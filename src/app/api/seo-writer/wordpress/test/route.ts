import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../../auth";
import { prisma } from "@/lib/prisma";

// POST - Test WordPress connection
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { siteId, url, username, appPassword } = body;

    let testUrl = url;
    let testUsername = username;
    let testPassword = appPassword;

    // If siteId provided, get site URL from database (but prefer form values for credentials)
    if (siteId) {
      const site = await prisma.wordPressSite.findFirst({
        where: { id: siteId, userId: session.user.id },
      });

      if (!site) {
        return NextResponse.json({ error: "Site not found" }, { status: 404 });
      }

      // Use site URL from database
      testUrl = testUrl || site.url;

      // Only use stored credentials if form values are NOT provided
      if (!testUsername || testUsername === "pending") {
        testUsername = site.username;
      }
      if (!testPassword) {
        testPassword = site.appPassword;
      }
    }

    if (!testUrl || !testUsername || !testPassword) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      );
    }

    // Normalize URL - ensure https and no trailing slash
    let normalizedUrl = testUrl.trim();
    if (!normalizedUrl.startsWith("http")) {
      normalizedUrl = `https://${normalizedUrl}`;
    }
    normalizedUrl = normalizedUrl.replace(/\/+$/, "");

    // Application passwords can have spaces - keep them as-is
    // WordPress expects: username:application_password (with spaces)
    const cleanPassword = testPassword.trim();
    const cleanUsername = testUsername.trim();

    console.log(`Testing WordPress connection to: ${normalizedUrl}`);
    console.log(`Username: "${cleanUsername}"`);
    console.log(`Password length: ${cleanPassword.length}`);

    // Test connection to WordPress REST API
    const authString = `${cleanUsername}:${cleanPassword}`;
    const credentials = Buffer.from(authString, 'utf-8').toString("base64");

    console.log(`Auth string: "${authString}"`);

    // First, test if we can access the users/me endpoint (requires authentication)
    const response = await fetch(`${normalizedUrl}/wp-json/wp/v2/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
        "User-Agent": "SEOWriter/1.0",
      },
    });

    console.log(`WordPress API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`WordPress API error response: ${errorText}`);

      let errorMessage = "Connection failed";
      let hint = "";

      if (response.status === 401) {
        errorMessage = "Invalid credentials";
        hint = "Check: 1) Username is correct (not email), 2) Application password has no extra spaces, 3) Application passwords are enabled in WordPress";
      } else if (response.status === 403) {
        errorMessage = "Access forbidden";
        hint = "The user may not have permission to access the REST API. Make sure the user has Editor or Administrator role.";
      } else if (response.status === 404) {
        errorMessage = "WordPress REST API not found";
        hint = "1) Go to Settings > Permalinks and save (even without changes), 2) Make sure .htaccess allows REST API access";
      } else {
        errorMessage = `WordPress API error: ${response.status}`;
        hint = errorText.substring(0, 200);
      }

      return NextResponse.json(
        { success: false, error: errorMessage, hint, details: errorText },
        { status: 400 }
      );
    }

    const userData = await response.json();

    // If siteId was provided, update the site with new credentials and connection status
    if (siteId) {
      await prisma.wordPressSite.update({
        where: { id: siteId },
        data: {
          username: testUsername,
          appPassword: cleanPassword,
          isConnected: true,
          lastTestedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Successfully connected to WordPress!",
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        roles: userData.roles,
      },
    });
  } catch (error) {
    console.error("WordPress test error:", error);

    // Check for network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        { success: false, error: "Could not connect to the website. Please check the URL." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Connection test failed" },
      { status: 500 }
    );
  }
}
