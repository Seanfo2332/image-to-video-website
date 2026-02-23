import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../../auth";
import { prisma } from "@/lib/prisma";

// Test WordPress connection via XML-RPC (fallback when REST API auth fails)
async function testXmlRpc(url: string, username: string, password: string) {
  const xmlBody = `<?xml version="1.0" encoding="UTF-8"?>
<methodCall>
  <methodName>wp.getUsersBlogs</methodName>
  <params>
    <param><value><string>${username}</string></value></param>
    <param><value><string>${password}</string></value></param>
  </params>
</methodCall>`;

  const response = await fetch(`${url}/xmlrpc.php`, {
    method: "POST",
    headers: { "Content-Type": "text/xml", "User-Agent": "SEOWriter/1.0" },
    body: xmlBody,
  });

  const text = await response.text();

  if (!response.ok || !text || text.length === 0) {
    return { success: false, error: `Server error (${response.status})` };
  }

  if (text.includes("faultCode")) {
    const msg = text.match(/<string>(.*?)<\/string>/)?.[1] || "Unknown error";
    return { success: false, error: msg };
  }

  // Extract blog info from response
  const blogName = text.match(/<name>blogName<\/name>\s*<value><string>(.*?)<\/string>/)?.[1] || "";
  const isAdmin = text.includes("administrator") || text.includes("editor");

  return {
    success: true,
    user: { name: blogName, roles: isAdmin ? ["administrator"] : ["subscriber"] },
    method: "xmlrpc",
  };
}

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
      // Treat "pending" (from initial setup) as empty
      if (!testUsername || testUsername === "pending") {
        testUsername = site.username !== "pending" ? site.username : "";
      }
      if (!testPassword) {
        testPassword = site.appPassword !== "pending" ? site.appPassword : "";
      }
    }

    if (!testUrl || !testUsername || !testPassword) {
      return NextResponse.json(
        { error: "Missing credentials. Please enter your WordPress username and application password." },
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
    const cleanPassword = testPassword.trim();
    const cleanUsername = testUsername.trim();

    console.log(`Testing WordPress connection to: ${normalizedUrl}`);

    // Test connection to WordPress REST API
    const authString = `${cleanUsername}:${cleanPassword}`;
    const credentials = Buffer.from(authString, "utf-8").toString("base64");

    const response = await fetch(
      `${normalizedUrl}/wp-json/wp/v2/users/me?_=${Date.now()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
          "User-Agent": "SEOWriter/1.0",
          "Cache-Control": "no-cache",
        },
      }
    );

    console.log(`WordPress REST API response: ${response.status}`);

    // REST API succeeded
    if (response.ok) {
      const userData = await response.json();

      if (siteId) {
        await prisma.wordPressSite.update({
          where: { id: siteId },
          data: {
            username: cleanUsername,
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
    }

    // REST API failed — check if it's a header-stripping issue or real auth failure
    const errorText = await response.text();

    // If 401 with "rest_not_logged_in", the Authorization header may have been
    // stripped by the hosting provider (common with Hostinger, some shared hosts).
    // Fall back to XML-RPC which sends credentials in the POST body.
    if (
      response.status === 401 &&
      errorText.includes("rest_not_logged_in")
    ) {
      console.log("REST API auth header may be stripped, trying XML-RPC fallback...");
      const xmlRpcResult = await testXmlRpc(normalizedUrl, cleanUsername, cleanPassword);

      if (xmlRpcResult.success) {
        // XML-RPC worked — save credentials
        if (siteId) {
          await prisma.wordPressSite.update({
            where: { id: siteId },
            data: {
              username: cleanUsername,
              appPassword: cleanPassword,
              isConnected: true,
              lastTestedAt: new Date(),
            },
          });
        }

        return NextResponse.json({
          success: true,
          message: "Connected via XML-RPC! Your hosting provider may strip REST API auth headers.",
          user: xmlRpcResult.user,
        });
      }

      // XML-RPC also failed — credentials are actually wrong
      return NextResponse.json(
        {
          success: false,
          error: "Invalid credentials",
          hint: "Check: 1) Use your WordPress username (not email), 2) Make sure the application password is correct and was generated for this site, 3) Application passwords are enabled in WordPress",
        },
        { status: 400 }
      );
    }

    // Handle other REST API error codes
    let errorMessage = "Connection failed";
    let hint = "";

    if (response.status === 401) {
      errorMessage = "Invalid credentials";
      hint =
        "Check: 1) Username is correct (not email), 2) Application password has no extra spaces, 3) Application passwords are enabled in WordPress";
    } else if (response.status === 403) {
      errorMessage = "Access forbidden";
      hint =
        "The user may not have permission to access the REST API. Make sure the user has Editor or Administrator role.";
    } else if (response.status === 404) {
      errorMessage = "WordPress REST API not found";
      hint =
        "1) Go to Settings > Permalinks and save (even without changes), 2) Make sure your site is a WordPress site";
    } else if (response.status === 500) {
      errorMessage = "WordPress server error";
      hint =
        "Your WordPress site is experiencing a server error (500). Check your hosting error logs, disable recently added plugins, or contact your hosting provider.";
    } else {
      errorMessage = `WordPress error (${response.status})`;
      hint = errorText.substring(0, 200);
    }

    return NextResponse.json(
      { success: false, error: errorMessage, hint },
      { status: 400 }
    );
  } catch (error) {
    console.error("WordPress test error:", error);

    if (
      error instanceof TypeError &&
      (error.message.includes("fetch") || error.message.includes("ECONNREFUSED") || error.message.includes("ENOTFOUND"))
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not connect to the website",
          hint: "Please check the URL is correct and the site is online.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Connection test failed. Please try again." },
      { status: 500 }
    );
  }
}
