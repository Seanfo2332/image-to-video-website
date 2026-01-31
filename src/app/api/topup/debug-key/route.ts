import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  try {
    let privateKeyPem = process.env.RM_PRIVATE_KEY;

    if (!privateKeyPem) {
      return NextResponse.json({
        error: "RM_PRIVATE_KEY not configured",
        configured: false
      }, { status: 400 });
    }

    const rawLength = privateKeyPem.length;
    const rawStart = privateKeyPem.substring(0, 60);
    const rawEnd = privateKeyPem.substring(privateKeyPem.length - 60);

    // Handle escaped newlines
    privateKeyPem = privateKeyPem
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "")
      .trim();

    const processedLength = privateKeyPem.length;
    const hasNewlines = privateKeyPem.includes("\n");
    const lineCount = privateKeyPem.split("\n").length;

    // Check for headers
    const hasPKCS1Header = privateKeyPem.includes("BEGIN RSA PRIVATE KEY");
    const hasPKCS8Header = privateKeyPem.includes("BEGIN PRIVATE KEY");

    // Extract base64 content
    const keyContent = privateKeyPem
      .replace(/-----BEGIN[\w\s]+-----/g, "")
      .replace(/-----END[\w\s]+-----/g, "")
      .replace(/[\s\n\r]/g, "");

    const base64Length = keyContent.length;
    const base64Start = keyContent.substring(0, 40);

    // Try to parse the key
    let parseResult = "not_attempted";
    let keyType = "unknown";

    // Rebuild PEM
    const header = hasPKCS8Header
      ? "-----BEGIN PRIVATE KEY-----"
      : "-----BEGIN RSA PRIVATE KEY-----";
    const footer = hasPKCS8Header
      ? "-----END PRIVATE KEY-----"
      : "-----END RSA PRIVATE KEY-----";
    const lines = keyContent.match(/.{1,64}/g) || [];
    const rebuiltPem = `${header}\n${lines.join("\n")}\n${footer}`;

    try {
      const privateKey = crypto.createPrivateKey({
        key: rebuiltPem,
        format: "pem",
      });
      parseResult = "success";
      keyType = privateKey.asymmetricKeyType || "unknown";
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      parseResult = `failed: ${errorMsg}`;

      // Try PKCS#8 if PKCS#1 failed
      if (!hasPKCS8Header) {
        try {
          const pkcs8Pem = `-----BEGIN PRIVATE KEY-----\n${lines.join("\n")}\n-----END PRIVATE KEY-----`;
          const privateKey = crypto.createPrivateKey({
            key: pkcs8Pem,
            format: "pem",
          });
          parseResult = "success_as_pkcs8";
          keyType = privateKey.asymmetricKeyType || "unknown";
        } catch (err2) {
          parseResult = `both_failed: PKCS#1: ${errorMsg}, PKCS#8: ${err2 instanceof Error ? err2.message : String(err2)}`;
        }
      }
    }

    return NextResponse.json({
      configured: true,
      raw: {
        length: rawLength,
        start: rawStart,
        end: rawEnd,
      },
      processed: {
        length: processedLength,
        hasNewlines,
        lineCount,
      },
      format: {
        hasPKCS1Header,
        hasPKCS8Header,
      },
      base64: {
        length: base64Length,
        start: base64Start,
        expectedLengthFor2048bit: 1624, // Approximately
      },
      parseResult,
      keyType,
      rebuiltPemLength: rebuiltPem.length,
      rebuiltLineCount: lines.length,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
