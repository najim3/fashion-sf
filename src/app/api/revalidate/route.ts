import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const hmacHeader = request.headers.get("x-shopify-hmac-sha256");
    const topic = request.headers.get("x-shopify-topic");
    const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("Missing SHOPIFY_WEBHOOK_SECRET");
      return NextResponse.json({ message: "Server misconfigured" }, { status: 500 });
    }

    if (!hmacHeader || !topic) {
      return NextResponse.json({ message: "Missing required headers" }, { status: 400 });
    }

    // Verify HMAC
    const hash = crypto
      .createHmac("sha256", secret)
      .update(rawBody, "utf8")
      .digest("base64");

    if (hash !== hmacHeader) {
      console.error("Invalid HMAC signature");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    // Determine what to revalidate based on topic
    switch (topic) {
      case "products/create":
      case "products/update":
      case "products/delete":
        // @ts-expect-error - Next.js Canary type definition expects 2 arguments
        revalidateTag("products");
        if (payload.handle) {
          revalidatePath(`/products/${payload.handle}`);
        }
        break;

      case "collections/create":
      case "collections/update":
      case "collections/delete":
        // @ts-expect-error - Next.js Canary type definition expects 2 arguments
        revalidateTag("collections");
        if (payload.handle) {
          revalidatePath(`/collections/${payload.handle}`);
        }
        break;

      case "inventory_levels/update":
        // @ts-expect-error - Next.js Canary type definition expects 2 arguments
        revalidateTag("products"); // In case stock status affects UI
        break;

      default:
        console.log(`Unhandled topic: ${topic}`);
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
