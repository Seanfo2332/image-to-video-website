import crypto from "crypto";
import forge from "node-forge";

// Revenue Monster API - Direct implementation with signature
let accessToken: string | null = null;
let tokenExpiry: number = 0;

// Store the prepared PEM string for signing
let preparedPrivateKeyPem: string | null = null;

// Prepare the private key PEM string
function preparePrivateKey(): string {
  if (preparedPrivateKeyPem) {
    return preparedPrivateKeyPem;
  }

  let privateKeyPem = process.env.RM_PRIVATE_KEY;
  if (!privateKeyPem) {
    throw new Error("RM_PRIVATE_KEY not configured");
  }

  console.log("Raw key length:", privateKeyPem.length);

  // Check if the key is base64 encoded (doesn't start with -----)
  if (!privateKeyPem.trim().startsWith("-----")) {
    // Decode from base64 first
    try {
      privateKeyPem = Buffer.from(privateKeyPem, "base64").toString("utf-8");
      console.log("Decoded from base64, new length:", privateKeyPem.length);
    } catch (e) {
      console.log("Not base64 encoded, using as-is");
    }
  }

  // Handle escaped newlines from Vercel
  privateKeyPem = privateKeyPem
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "")
    .trim();

  // Extract base64 content (remove any headers/footers and whitespace)
  let keyContent = privateKeyPem
    .replace(/-----BEGIN[\w\s]+-----/g, "")
    .replace(/-----END[\w\s]+-----/g, "")
    .replace(/[\s\n\r]/g, "");

  console.log("Base64 content length:", keyContent.length);

  // Rebuild proper PEM format with 64-char lines using PKCS#1 format
  const lines = keyContent.match(/.{1,64}/g) || [];
  preparedPrivateKeyPem = `-----BEGIN RSA PRIVATE KEY-----\n${lines.join("\n")}\n-----END RSA PRIVATE KEY-----`;

  console.log("Prepared key lines:", lines.length);
  return preparedPrivateKeyPem;
}

// Generate signature using node-forge (more compatible with various key formats)
function signDataWithForge(data: string): string {
  const privateKeyPem = preparePrivateKey();

  try {
    // Use node-forge which is more forgiving with key formats
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const md = forge.md.sha256.create();
    md.update(data, "utf8");

    // Sign with RSASSA-PKCS1-v1_5
    const signature = privateKey.sign(md);

    // Convert to base64
    return forge.util.encode64(signature);
  } catch (err) {
    console.error("Forge signing error:", err);
    throw new Error(`Failed to sign with forge: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// Generate signature using native crypto (fallback)
function signDataWithCrypto(data: string): string {
  const privateKeyPem = preparePrivateKey();

  const sign = crypto.createSign("RSA-SHA256");
  sign.update(data);
  sign.end();

  try {
    const signature = sign.sign(privateKeyPem, "base64");
    return signature;
  } catch (err) {
    console.error("Native crypto sign error:", err);
    throw err;
  }
}

// Main signing function - tries forge first, then native crypto
function signData(data: string): string {
  try {
    // Try node-forge first (more compatible)
    return signDataWithForge(data);
  } catch (forgeErr) {
    console.log("Forge failed, trying native crypto...");

    try {
      return signDataWithCrypto(data);
    } catch (cryptoErr) {
      console.error("Both signing methods failed");
      console.error("Forge error:", forgeErr);
      console.error("Crypto error:", cryptoErr);
      throw new Error(`Failed to sign data: ${forgeErr instanceof Error ? forgeErr.message : String(forgeErr)}`);
    }
  }
}

// Sort object keys alphabetically (recursive for nested objects)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sortObject(obj: any): any {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sortObject);
  }

  const sorted: Record<string, unknown> = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = sortObject(obj[key]);
    });
  return sorted;
}

// Escape special characters as per Revenue Monster docs
function escapeSpecialChars(str: string): string {
  return str
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

// Generate signature for Revenue Monster API
function generateSignature(
  method: string,
  requestUrl: string,
  timestamp: string,
  nonce: string,
  body: object | null
): string {
  // Build signature data according to Revenue Monster docs
  let dataToSign = "";

  if (body && Object.keys(body).length > 0) {
    // 1. Sort keys alphabetically (including nested objects)
    const sortedBody = sortObject(body);
    // 2. Convert to JSON string
    const jsonString = JSON.stringify(sortedBody);
    // 3. Escape special characters
    const escapedJson = escapeSpecialChars(jsonString);
    // 4. Base64 encode
    const encodedData = Buffer.from(escapedJson).toString("base64");
    dataToSign = `data=${encodedData}&`;
  }

  dataToSign += `method=${method.toLowerCase()}&`;
  dataToSign += `nonceStr=${nonce}&`;
  dataToSign += `requestUrl=${requestUrl}&`;
  dataToSign += `signType=sha256&`;
  dataToSign += `timestamp=${timestamp}`;

  console.log("Signing data:", dataToSign.substring(0, 200) + "...");

  // Sign with private key using the new function
  const signature = signData(dataToSign);
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
