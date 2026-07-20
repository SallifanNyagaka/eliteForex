import { NextResponse } from "next/server";
import { processEmailQueue } from "@/lib/email-queue";

export const maxDuration = 30;

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret) && request.headers.get("authorization") === `Bearer ${secret}`;
}

async function processRequest(request: Request) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET is not configured." }, { status: 503 });
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const result = await processEmailQueue(10);
    return NextResponse.json({ ok: true, ...result });
  } catch (queueError) {
    const error = queueError instanceof Error ? queueError.message : "Email queue processing failed.";
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return processRequest(request);
}

export async function POST(request: Request) {
  return processRequest(request);
}
