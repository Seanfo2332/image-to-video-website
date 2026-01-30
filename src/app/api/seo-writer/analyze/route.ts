import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { analyzeWebsite, discoverKeywords } from "@/lib/openai";

// Scrape website content
async function scrapeWebsite(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SEOWriter/1.0; +https://example.com)",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status}`);
    }

    const html = await response.text();

    // Basic HTML to text conversion
    // Remove scripts and styles
    let text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "");

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";

    // Extract meta description
    const metaMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
    );
    const metaDescription = metaMatch ? metaMatch[1].trim() : "";

    // Extract headings
    const headings: string[] = [];
    const headingRegex = /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi;
    let match;
    while ((match = headingRegex.exec(html)) !== null) {
      headings.push(match[1].trim());
    }

    // Extract paragraph text
    const paragraphs: string[] = [];
    const pRegex = /<p[^>]*>([^<]+)<\/p>/gi;
    while ((match = pRegex.exec(text)) !== null) {
      const pText = match[1].trim();
      if (pText.length > 50) {
        paragraphs.push(pText);
      }
    }

    // Combine extracted content
    const content = `
Website: ${url}
Title: ${title}
Meta Description: ${metaDescription}

Headings:
${headings.slice(0, 20).join("\n")}

Content:
${paragraphs.slice(0, 30).join("\n\n")}
    `.trim();

    // Limit content length for API
    return content.substring(0, 15000);
  } catch (error) {
    console.error("Scraping error:", error);
    throw error;
  }
}

// POST - Analyze a website and create brand profile
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { siteId, url } = body;

    if (!siteId && !url) {
      return NextResponse.json(
        { error: "Site ID or URL required" },
        { status: 400 }
      );
    }

    let site;
    let targetUrl = url;

    if (siteId) {
      site = await prisma.wordPressSite.findFirst({
        where: { id: siteId, userId: session.user.id },
      });

      if (!site) {
        return NextResponse.json({ error: "Site not found" }, { status: 404 });
      }
      targetUrl = site.url;
    }

    // Scrape the website
    const websiteContent = await scrapeWebsite(targetUrl);

    // Analyze with AI
    const analysis = await analyzeWebsite(websiteContent, targetUrl);

    // If we have a site, save the brand profile
    if (site) {
      // Delete existing profile if any
      await prisma.brandProfile.deleteMany({
        where: { siteId: site.id },
      });

      // Create new profile
      const brandProfile = await prisma.brandProfile.create({
        data: {
          siteId: site.id,
          brandName: analysis.brandName || site.name,
          brandDescription: analysis.brandDescription || "",
          tone: analysis.tone || "professional",
          targetAudience: analysis.targetAudience || "",
          contentStyle: analysis.contentStyle || "",
          brandVoice: analysis.brandVoice || "",
          keyThemes: analysis.keyThemes || [],
        },
      });

      return NextResponse.json({
        success: true,
        brandProfile,
        analysis,
      });
    }

    // Return just the analysis for preview
    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze website" },
      { status: 500 }
    );
  }
}
