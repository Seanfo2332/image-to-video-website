import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Verify cron secret to prevent unauthorized access
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) return false;

  return authHeader === `Bearer ${cronSecret}`;
}

// POST - Auto-publish scheduled articles
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    if (!verifyCronSecret(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find all articles scheduled for now or earlier that haven't been published
    const now = new Date();
    const scheduledArticles = await prisma.article.findMany({
      where: {
        status: "scheduled",
        scheduledFor: {
          lte: now,
        },
      },
      include: {
        site: true,
        keyword: true,
      },
    });

    if (scheduledArticles.length === 0) {
      return NextResponse.json({
        message: "No articles to publish",
        count: 0,
      });
    }

    const results = [];

    for (const article of scheduledArticles) {
      try {
        // Update status to publishing
        await prisma.article.update({
          where: { id: article.id },
          data: { status: "publishing" },
        });

        // Publish to WordPress
        const wpResponse = await publishToWordPress(article, article.site);

        if (wpResponse.success) {
          // Update article with WP post ID and published status
          await prisma.article.update({
            where: { id: article.id },
            data: {
              status: "published",
              wpPostId: wpResponse.postId,
              publishedAt: new Date(),
            },
          });

          // Update keyword status if linked
          if (article.keywordId) {
            await prisma.keyword.update({
              where: { id: article.keywordId },
              data: { status: "published" },
            });
          }

          results.push({
            articleId: article.id,
            title: article.title,
            status: "published",
            wpPostId: wpResponse.postId,
          });
        } else {
          // Mark as failed
          await prisma.article.update({
            where: { id: article.id },
            data: { status: "failed" },
          });

          results.push({
            articleId: article.id,
            title: article.title,
            status: "failed",
            error: wpResponse.error,
          });
        }
      } catch (error) {
        console.error(`Error publishing article ${article.id}:`, error);

        await prisma.article.update({
          where: { id: article.id },
          data: { status: "failed" },
        });

        results.push({
          articleId: article.id,
          title: article.title,
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      message: `Processed ${results.length} articles`,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Error in auto-publish cron:", error);
    return NextResponse.json(
      { error: "Failed to run auto-publish" },
      { status: 500 }
    );
  }
}

// Helper function to publish to WordPress
async function publishToWordPress(
  article: {
    title: string;
    content: string;
    slug: string;
    metaDescription: string | null;
    featuredImage: string | null;
  },
  site: {
    url: string;
    username: string;
    appPassword: string;
  }
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    const apiUrl = `${site.url}/wp-json/wp/v2/posts`;
    const auth = Buffer.from(`${site.username}:${site.appPassword}`).toString("base64");

    // Create post
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        title: article.title,
        content: article.content,
        slug: article.slug,
        status: "publish",
        excerpt: article.metaDescription || "",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `WP API error: ${response.status} - ${errorText}` };
    }

    const post = await response.json();

    // If we have a featured image, upload and set it
    if (article.featuredImage) {
      try {
        await setFeaturedImage(post.id, article.featuredImage, site, auth);
      } catch (imgError) {
        console.error("Error setting featured image:", imgError);
        // Continue even if image upload fails
      }
    }

    return { success: true, postId: post.id.toString() };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to publish",
    };
  }
}

// Helper to upload and set featured image
async function setFeaturedImage(
  postId: number,
  imageUrl: string,
  site: { url: string },
  auth: string
) {
  // Fetch the image
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) return;

  const imageBlob = await imageResponse.blob();
  const formData = new FormData();
  formData.append("file", imageBlob, "featured-image.jpg");

  // Upload to WordPress media library
  const uploadResponse = await fetch(`${site.url}/wp-json/wp/v2/media`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
    },
    body: formData,
  });

  if (!uploadResponse.ok) return;

  const media = await uploadResponse.json();

  // Set as featured image
  await fetch(`${site.url}/wp-json/wp/v2/posts/${postId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      featured_media: media.id,
    }),
  });
}

// Also allow GET for Vercel Cron (which uses GET by default)
export async function GET(request: NextRequest) {
  return POST(request);
}
