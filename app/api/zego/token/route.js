import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  const { roomId, userId, userName } = await req.json();

  const appID = Number(process.env.ZEGO_APP_ID);
  const serverSecret = process.env.ZEGO_SERVER_SECRET;

  const timestamp = Math.floor(Date.now() / 1000);
  const nonce = Math.floor(Math.random() * 100000);

  const payload = {
    app_id: appID,
    user_id: userId,
    nonce,
    ctime: timestamp,
    expire: timestamp + 3600,
  };

  const payloadStr = JSON.stringify(payload);
  const signature = crypto
    .createHmac("sha256", serverSecret)
    .update(payloadStr)
    .digest("hex");

  const token = Buffer.from(
    JSON.stringify({ ...payload, signature })
  ).toString("base64");

  return NextResponse.json({
    token,
    userName,
  });
}