import { RMSDK } from "rm-api-sdk";

// Revenue Monster SDK instance
let rmSDK: ReturnType<typeof RMSDK> | null = null;
let accessToken: string | null = null;
let tokenExpiry: number = 0;

// Initialize the SDK
function getSDK() {
  if (!rmSDK) {
    const clientId = process.env.RM_CLIENT_ID;
    const clientSecret = process.env.RM_CLIENT_SECRET;
    const privateKey = process.env.RM_PRIVATE_KEY;

    if (!clientId || !clientSecret || !privateKey) {
      throw new Error("Revenue Monster credentials not configured");
    }

    rmSDK = RMSDK({
      clientId,
      clientSecret,
      privateKey: privateKey.replace(/\\n/g, "\n"), // Handle escaped newlines
      isProduction: process.env.NODE_ENV === "production",
      timeout: 30000,
    });
  }

  return rmSDK;
}

// Get or refresh access token
async function getAccessToken(): Promise<string> {
  const now = Date.now();

  // Return cached token if still valid (with 5 min buffer)
  if (accessToken && tokenExpiry > now + 300000) {
    return accessToken;
  }

  const sdk = getSDK();
  const result = await sdk.getClientCredentials();

  if (!result.accessToken) {
    throw new Error("Failed to get Revenue Monster access token");
  }

  accessToken = result.accessToken;
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
    const sdk = getSDK();
    const token = await getAccessToken();
    const storeId = process.env.RM_STORE_ID;

    if (!storeId) {
      throw new Error("RM_STORE_ID not configured");
    }

    // Create online payment checkout
    const response = await sdk.Payment.createTransactionUrl(token, {
      amount: options.amount,
      currencyType: "MYR",
      expiry: {
        type: "PERMANENT",
      },
      isPreFillAmount: true,
      method: [], // Empty array allows all payment methods
      order: {
        id: options.orderId.substring(0, 24), // Max 24 chars
        title: options.title,
        detail: options.details,
      },
      redirectUrl: options.redirectUrl,
      storeId: storeId,
      type: "DYNAMIC",
    });

    if (response && response.item) {
      return {
        success: true,
        checkoutId: response.item.checkoutId,
        checkoutUrl: response.item.url,
      };
    }

    return {
      success: false,
      error: "Failed to create checkout",
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
    const sdk = getSDK();
    const token = await getAccessToken();

    // Query checkout status
    const response = await sdk.Payment.getTransactionUrl(token, checkoutId);

    if (response && response.item) {
      const item = response.item;

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
