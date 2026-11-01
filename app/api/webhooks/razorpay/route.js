import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/razorpay";

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature header" }, { status: 400 });
    }

    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn("Razorpay webhook signature verification failed.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;

    if (eventType === "order.paid" || eventType === "payment.captured") {
      const paymentEntity = event.payload?.payment?.entity;
      const orderId = paymentEntity?.notes?.orderId;
      const transactionId = paymentEntity?.id;

      if (orderId) {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
        });

        if (order && order.paymentStatus !== "SUCCESS") {
          await prisma.$transaction(async (tx) => {
            await tx.order.update({
              where: { id: orderId },
              data: {
                paymentStatus: "SUCCESS",
                orderStatus: "CONFIRMED",
              },
            });

            await tx.payment.upsert({
              where: { orderId },
              update: {
                status: "SUCCESS",
                transactionId,
              },
              create: {
                orderId,
                paymentMethod: "ONLINE",
                amount: order.total,
                status: "SUCCESS",
                transactionId,
              },
            });

            await tx.orderStatusHistory.create({
              data: {
                orderId,
                status: "CONFIRMED",
              },
            });
          });
        }
      }
    } else if (eventType === "payment.failed") {
      const paymentEntity = event.payload?.payment?.entity;
      const orderId = paymentEntity?.notes?.orderId;
      const transactionId = paymentEntity?.id;

      if (orderId) {
        await prisma.payment.updateMany({
          where: { orderId },
          data: {
            status: "FAILED",
            transactionId,
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Razorpay webhook processing error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

