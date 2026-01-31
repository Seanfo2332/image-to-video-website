import { NextResponse } from "next/server";
import crypto from "crypto";
import forge from "node-forge";

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
    const rawStart = privateKeyPem.substring(0, 80);

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
    const base64Start = keyContent.substring(0, 50);
    const base64End = keyContent.substring(keyContent.length - 50);

    // Rebuild PEM
    const lines = keyContent.match(/.{1,64}/g) || [];
    const rebuiltPem = `-----BEGIN RSA PRIVATE KEY-----\n${lines.join("\n")}\n-----END RSA PRIVATE KEY-----`;

    // Test signing with different methods
    let forgeResult = "not_tested";
    let cryptoResult = "not_tested";
    let keyType = "unknown";

    // Test with node-forge
    try {
      const privateKey = forge.pki.privateKeyFromPem(rebuiltPem);
      const md = forge.md.sha256.create();
      md.update("test data", "utf8");
      const signature = privateKey.sign(md);
      const b64Sig = forge.util.encode64(signature);
      forgeResult = `success (sig length: ${b64Sig.length})`;
      keyType = `RSA ${privateKey.n.bitLength()} bit`;
    } catch (err) {
      forgeResult = `failed: ${err instanceof Error ? err.message : String(err)}`;
    }

    // Test with native crypto
    try {
      const sign = crypto.createSign("RSA-SHA256");
      sign.update("test data");
      sign.end();
      const signature = sign.sign(rebuiltPem, "base64");
      cryptoResult = `success (sig length: ${signature.length})`;
    } catch (err) {
      cryptoResult = `failed: ${err instanceof Error ? err.message : String(err)}`;
    }

    return NextResponse.json({
      configured: true,
      raw: {
        length: rawLength,
        start: rawStart,
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
        end: base64End,
        expectedLengthFor2048bit: "~1624",
      },
      rebuiltPemLength: rebuiltPem.length,
      rebuiltLineCount: lines.length,
      signingTests: {
        forge: forgeResult,
        crypto: cryptoResult,
      },
      keyType,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
