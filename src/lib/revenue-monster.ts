import crypto from "crypto";

// Revenue Monster API - Direct implementation with signature
let accessToken: string | null = null;
let tokenExpiry: number = 0;

// Get private key from environment and create key object
function getPrivateKey(): crypto.KeyObject {
  let privateKeyPem = process.env.RM_PRIVATE_KEY;
  if (!privateKeyPem) {
    throw new Error("RM_PRIVATE_KEY not configured");
  }

  console.log("Raw key length:", privateKeyPem.length);
  console.log("Raw key starts with:", privateKeyPem.substring(0, 50));

  // Handle escaped newlines from Vercel (both \\n and literal \n)
  privateKeyPem = privateKeyPem
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "")
    .trim();

  // Detect key format - support both PKCS#1 and PKCS#8
  const isPKCS1 = privateKeyPem.includes("BEGIN RSA PRIVATE KEY");
  const isPKCS8 = privateKeyPem.includes("BEGIN PRIVATE KEY");

  let header: string;
  let footer: string;

  if (isPKCS1) {
    header = "-----BEGIN RSA PRIVATE KEY-----";
    footer = "-----END RSA PRIVATE KEY-----";
  } else if (isPKCS8) {
    header = "-----BEGIN PRIVATE KEY-----";
    footer = "-----END PRIVATE KEY-----";
  } else {
    // Assume it's raw base64 content without headers - add PKCS#1 headers
    console.log("No PEM headers found, treating as raw base64");
    header = "-----BEGIN RSA PRIVATE KEY-----";
    footer = "-----END RSA PRIVATE KEY-----";
  }

  // Extract base64 content
  let keyContent = privateKeyPem
    .replace(/-----BEGIN[\w\s]+-----/g, "")
    .replace(/-----END[\w\s]+-----/g, "")
    .replace(/[\s\n\r]/g, ""); // Only remove whitespace, NOT dashes

  console.log("Base64 content length:", keyContent.length);
  console.log("Base64 starts with:", keyContent.substring(0, 30));

  // Rebuild proper PEM format with 64-char lines
  const lines = keyContent.match(/.{1,64}/g) || [];
  privateKeyPem = `${header}\n${lines.join("\n")}\n${footer}`;

  console.log("Reformatted key length:", privateKeyPem.length);
  console.log("Key lines:", lines.length);

  // Create key object with proper format specification
  try {
    const privateKey = crypto.createPrivateKey({
      key: privateKeyPem,
      format: "pem",
    });
    console.log("Private key parsed successfully");
    return privateKey;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Failed to parse private key:", errorMessage);
    console.error("Key preview (first 200 chars):", privateKeyPem.substring(0, 200));
    console.error("Key preview (last 100 chars):", privateKeyPem.substring(privateKeyPem.length - 100));

    // Try as PKCS#8 if PKCS#1 failed
    if (isPKCS1) {
      console.log("Trying PKCS#8 format instead...");
      try {
        const pkcs8Pem = `-----BEGIN PRIVATE KEY-----\n${lines.join("\n")}\n-----END PRIVATE KEY-----`;
        const privateKey = crypto.createPrivateKey({
          key: pkcs8Pem,
          format: "pem",
        });
        console.log("Private key parsed successfully as PKCS#8");
        return privateKey;
      } catch (err2) {
        console.error("PKCS#8 also failed:", err2 instanceof Error ? err2.message : String(err2));
      }
    }

    throw new Error(`Invalid private key format: ${errorMessage}`);
  }
}

// Generate signature for Revenue Monster API
function generateSignature(
  method: string,
  requestUrl: string,
  timestamp: string,
  nonce: string,
  body: object | null
): string {
  const privateKey = getPrivateKey();

  // Build signature data according to Revenue Monster docs
  let signData = "";

  if (body && Object.keys(body).length > 0) {
    // Sort and encode body data
    const encodedData = Buffer.from(JSON.stringify(body)).toString("base64");
    signData = `data=${encodedData}&`;
  }

  signData += `method=${method.toLowerCase()}&`;
  signData += `nonceStr=${nonce}&`;
  signData += `requestUrl=${requestUrl}&`;
  signData += `signType=sha256&`;
  signData += `timestamp=${timestamp}`;

  console.log("Signing data:", signData.substring(0, 100) + "...");

  // Sign with private key
  const sign = crypto.createSign("SHA256");
  sign.update(signData);
  sign.end();

  const signature = sign.sign(privateKey, "base64");
  return signature;
}

// Generate random nonce
function generateNonce(): string {
  return crypto.randomBytes(16).toString("hex");
}

// Get or refresh access token using direct API call
async function getAccessToken(): Promise<string> {
  const now = Date.now();

  // Return cached token if still valid (with 5 min buffer)
  if (accessToken && tokenExpiry > now + 300000) {
    return accessToken;
  }

  const clientId = process.env.RM_CLIENT_ID;
  const clientSecret = process.env.RM_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Revenue Monster credentials not configured");
  }

  const isProduction = process.env.NODE_ENV === "production";
  const authUrl = isProduction
    ? "https://oauth.revenuemonster.my/v1/token"
    : "https://sb-oauth.revenuemonster.my/v1/token";

  // Create Basic auth header
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  console.log("Getting access token from:", authUrl);

  const response = await fetch(authUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify({
      grantType: "client_credentials",
    }),
  });

  const data = await response.json();
  console.log("Token response status:", response.status);

  if (!response.ok) {
    console.error("Token error:", data);
    throw new Error(data.error?.message || "Failed to get access token");
  }

  if (!data.accessToken) {
    throw new Error("No access token in response");
  }

  accessToken = data.accessToken;
  // Token expires in 2 hours, set expiry
  tokenExpiry = now + 7200000;

  return accessToken as string;
}

export interface CreateCheckoutOptions {
  orderId: string;
  amount: number; // in cents (e.g., 1000 = RM10.00)
  title: string;
  details: string;
  redirectUrl: string;
  notifyUrl: string;
}

export interface CheckoutResult {
  success: boolean;
  checkoutId?: string;
  checkoutUrl?: string;
  error?: string;
}

export async function createCheckout(
  options: CreateCheckoutOptions
): Promise<CheckoutResult> {
  try {
    const token = await getAccessToken();
    const storeId = process.env.RM_STORE_ID;
    const isProduction = process.env.NODE_ENV === "production";

    if (!storeId) {
      throw new Error("RM_STORE_ID not configured");
    }

    const baseUrl = isProduction
      ? "https://open.revenuemonster.my"
      : "https://sb-open.revenuemonster.my";

    const requestUrl = `${baseUrl}/v3/payment/online`;

    // Create online payment checkout via direct API call
    const payload = {
      order: {
        id: options.orderId.substring(0, 24),
        title: options.title,
        detail: options.details,
        amount: options.amount,
        currencyType: "MYR",
      },
      type: "WEB_PAYMENT",
      storeId: storeId,
      redirectUrl: options.redirectUrl,
      notifyUrl: options.notifyUrl,
      layoutVersion: "v3",
    };

    // Generate signature headers
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = generateNonce();
    const signature = generateSignature("POST", requestUrl, timestamp, nonce, payload);

    console.log("Creating checkout with payload:", JSON.stringify(payload, null, 2));
    console.log("Request URL:", requestUrl);

    const response = await fetch(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Nonce-Str": nonce,
        "X-Signature": `sha256 ${signature}`,
        "X-Timestamp": timestamp,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Revenue Monster response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("Revenue Monster API error:", data);
      throw new Error(data.error?.message || data.message || `API returned ${response.status}`);
    }

    if (data && data.item) {
      return {
        success: true,
        checkoutId: data.item.checkoutId,
        checkoutUrl: data.item.url,
      };
    }

    return {
      success: false,
      error: "No checkout URL returned",
    };
  } catch (error) {
    console.error("Revenue Monster checkout error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Checkout creation failed",
    };
  }
}

export interface VerifyPaymentResult {
  success: boolean;
  transactionId?: string;
  status?: string;
  amount?: number;
  error?: string;
}

export async function verifyCheckout(
  checkoutId: string
): Promise<VerifyPaymentResult> {
  try {
    const token = await getAccessToken();
    const isProduction = process.env.NODE_ENV === "production";
    const baseUrl = isProduction
      ? "https://open.revenuemonster.my"
      : "https://sb-open.revenuemonster.my";

    const requestUrl = `${baseUrl}/v3/payment/online?checkoutId=${checkoutId}`;

    // Generate signature headers for GET request
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = generateNonce();
    const signature = generateSignature("GET", requestUrl, timestamp, nonce, null);

    // Query checkout status via direct API call
    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Nonce-Str": nonce,
        "X-Signature": `sha256 ${signature}`,
        "X-Timestamp": timestamp,
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    if (data && data.item) {
      const item = data.item;

      return {
        success: item.status === "SUCCESS",
        transactionId: item.transactionId,
        status: item.status,
        amount: item.amount,
      };
    }

    return {
      success: false,
      error: "Failed to verify checkout",
    };
  } catch (error) {
    console.error("Revenue Monster verify error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Verification failed",
    };
  }
}

// Verify webhook signature (for callback)
export function verifyWebhookSignature(
  data: string,
  signature: string,
  timestamp: string
): boolean {
  // Revenue Monster webhook verification
  // In production, you should verify the signature using their provided algorithm
  // For now, we'll do basic validation
  return !!signature && !!timestamp;
}
