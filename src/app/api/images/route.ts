import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "@/lib/prisma";

// GET /api/images
// Returns user's generated images
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const images = await prisma.image.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    // Format for frontend
    const formattedImages = images.map((img) => ({
      id: img.id,
      title: img.title,
      prompt: img.prompt || "",
      thumbnail: img.thumbnailUrl || img.downloadUrl || "/api/placeholder/320/320",
      createdAt: img.createdAt.toISOString(),
      status: img.status,
      downloadUrl: img.downloadUrl,
    }));

    return NextResponse.json(formattedImages);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
