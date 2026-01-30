import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../../../auth";
import { prisma } from "@/lib/prisma";

// Helper to publish to WordPress
async function publishToWordPress(
  site: { url: string; username: string; appPassword: string },
  article: {
    title: string;
    content: string;
    slug: string;
    metaDescription?: string | null;
    featuredImage?: string | null;
  }
) {
  const credentials = Buffer.from(`${site.username}:${site.appPassword}`).toString("base64");

  // First, upload featured image if exists
  let featuredMediaId = null;
  if (article.featuredImage) {
    try {
      // Download the image
      const imageResponse = await fetch(article.featuredImage);
      const imageBlob = await imageResponse.blob();
      const imageBuffer = await imageBlob.arrayBuffer();

      // Upload to WordPress
      const mediaResponse = await fetch(`${site.url}/wp-json/wp/v2/media`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "image/png",
          "Content-Disposition": `attachment; filename="${article.slug}-featured.png"`,
        },
        body: Buffer.from(imageBuffer),
      });

      if (mediaResponse.ok) {
        const mediaData = await mediaResponse.json();
        featuredMediaId = mediaData.id;
      }
    } catch (imageError) {
      console.error("Failed to upload featured image:", imageError);
      // Continue without featured image
    }
  }

  // Create the post
  const postData: {
    title: string;
    content: string;
    slug: string;
    status: string;
    featured_media?: number;
    excerpt?: string;
  } = {
    title: article.title,
    content: article.content,
    slug: article.slug,
    status: "publish",
  };

  if (featuredMediaId) {
    postData.featured_media = featuredMediaId;
  }

  if (article.metaDescription) {
    postData.excerpt = article.metaDescription;
  }

  const response = await fetch(`${site.url}/wp-json/wp/v2/posts`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WordPress API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// POST - Publish article to WordPress
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get article with site details
    const article = await prisma.article.findFirst({
      where: {
        id,
        site: {
          userId: session.user.id,
        },
      },
      include: {
        site: true,
        keyword: true,
      },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (!article.site.isConnected) {
      return NextResponse.json(
        { error: "WordPress site is not connected. Please test the connection first." },
        { status: 400 }
      );
    }

    // Update status to publishing
    await prisma.article.update({
      where: { id },
      data: { status: "publishing" },
    });

    try {
      // Publish to WordPress
      const wpPost = await publishToWordPress(
        {
          url: article.site.url,
          username: article.site.username,
          appPassword: article.site.appPassword,
        },
        {
          title: article.title,
          content: article.content,
          slug: article.slug,
          metaDescription: article.metaDescription,
          featuredImage: article.featuredImage,
        }
      );

      // Update article with WordPress post ID
      const updatedArticle = await prisma.article.update({
        where: { id },
        data: {
          status: "published",
          wpPostId: String(wpPost.id),
          publishedAt: new Date(),
        },
      });

      // Update keyword status if linked
      if (article.keyword) {
        await prisma.keyword.update({
          where: { id: article.keyword.id },
          data: { status: "published" },
        });
      }

      return NextResponse.json({
        success: true,
        article: updatedArticle,
        wpPost: {
          id: wpPost.id,
          link: wpPost.link,
        },
      });
    } catch (publishError) {
      // Revert status on failure
      await prisma.article.update({
        where: { id },
        data: { status: "failed" },
      });

      console.error("Publish error:", publishError);
      return NextResponse.json(
        { error: `Failed to publish: ${publishError instanceof Error ? publishError.message : "Unknown error"}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error publishing article:", error);
    return NextResponse.json(
      { error: "Failed to publish article" },
      { status: 500 }
    );
  }
}
