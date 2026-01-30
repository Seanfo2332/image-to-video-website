import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../../../auth";
import { prisma } from "@/lib/prisma";
import { generateImagePrompt, generateImage } from "@/lib/openai";

// POST - Regenerate featured image for an article
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

    // Get article with site and brand profile
    const article = await prisma.article.findFirst({
      where: {
        id,
        site: {
          userId: session.user.id,
        },
      },
      include: {
        site: {
          include: {
            brandProfile: true,
          },
        },
      },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (!article.site.brandProfile) {
      return NextResponse.json(
        { error: "Brand profile not found" },
        { status: 400 }
      );
    }

    // Generate new image
    const imagePrompt = await generateImagePrompt(
      article.title,
      article.site.brandProfile.imageStyle
    );

    const featuredImage = await generateImage(imagePrompt);

    if (!featuredImage) {
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: 500 }
      );
    }

    // Update article with new image
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: { featuredImage },
    });

    return NextResponse.json({
      success: true,
      featuredImage: updatedArticle.featuredImage,
    });
  } catch (error) {
    console.error("Error regenerating image:", error);
    return NextResponse.json(
      { error: "Failed to regenerate image" },
      { status: 500 }
    );
  }
}
