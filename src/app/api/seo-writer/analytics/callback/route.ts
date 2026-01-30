import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXTAUTH_URL + "/api/seo-writer/analytics/callback";

// GET - Handle OAuth callback from Google
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      console.error("OAuth error:", error);
      return NextResponse.redirect(
        new URL("/seo-writer?error=oauth_denied", request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/seo-writer?error=invalid_callback", request.url)
      );
    }

    // Decode state
    let stateData: { siteId: string; userId: string };
    try {
      stateData = JSON.parse(Buffer.from(state, "base64").toString());
    } catch {
      return NextResponse.redirect(
        new URL("/seo-writer?error=invalid_state", request.url)
      );
    }

    const { siteId, userId } = stateData;

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", await tokenResponse.text());
      return NextResponse.redirect(
        new URL("/seo-writer?error=token_exchange_failed", request.url)
      );
    }

    const tokens = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokens;

    // Get list of sites from GSC to find matching property
    const sitesResponse = await fetch(
      "https://www.googleapis.com/webmasters/v3/sites",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    if (!sitesResponse.ok) {
      console.error("Failed to fetch GSC sites:", await sitesResponse.text());
      return NextResponse.redirect(
        new URL("/seo-writer?error=gsc_sites_failed", request.url)
      );
    }

    const sitesData = await sitesResponse.json();

    // Get the WordPress site URL to match
    const wpSite = await prisma.wordPressSite.findUnique({
      where: { id: siteId },
    });

    if (!wpSite) {
      return NextResponse.redirect(
        new URL("/seo-writer?error=site_not_found", request.url)
      );
    }

    // Find matching GSC property (match by domain)
    const wpDomain = new URL(wpSite.url).hostname;
    let propertyUrl = "";

    if (sitesData.siteEntry) {
      const matchingSite = sitesData.siteEntry.find((site: { siteUrl: string }) => {
        const siteUrl = site.siteUrl;
        // Check for domain property (sc-domain:) or URL property
        if (siteUrl.startsWith("sc-domain:")) {
          return siteUrl.replace("sc-domain:", "") === wpDomain;
        }
        try {
          const siteDomain = new URL(siteUrl).hostname;
          return siteDomain === wpDomain;
        } catch {
          return false;
        }
      });

      if (matchingSite) {
        propertyUrl = matchingSite.siteUrl;
      }
    }

    // Store or update GSC connection
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    await prisma.googleSearchConsole.upsert({
      where: { siteId },
      create: {
        siteId,
        accessToken: access_token,
        refreshToken: refresh_token || "",
        expiresAt,
        propertyUrl,
      },
      update: {
        accessToken: access_token,
        refreshToken: refresh_token || undefined,
        expiresAt,
        propertyUrl,
      },
    });

    // Redirect back to analytics page
    return NextResponse.redirect(
      new URL(`/seo-writer/analytics?siteId=${siteId}`, request.url)
    );
  } catch (error) {
    console.error("Error in OAuth callback:", error);
    return NextResponse.redirect(
      new URL("/seo-writer?error=callback_failed", request.url)
    );
  }
}
