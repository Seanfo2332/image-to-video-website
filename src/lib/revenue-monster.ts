// Revenue Monster API - Direct implementation without SDK
let accessToken: string | null = null;
let tokenExpiry: number = 0;

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

    console.log("Creating checkout with payload:", JSON.stringify(payload, null, 2));
    console.log("Using base URL:", baseUrl);

    const response = await fetch(`${baseUrl}/v3/payment/online`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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

    // Query checkout status via direct API call
    const response = await fetch(
      `${baseUrl}/v3/payment/online?checkoutId=${checkoutId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

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
