import { NextResponse } from "next/server";

import { verifyAuthToken } from "@/lib/jwt";
import { userStore } from "@/server/store/userStore";
import { toPublicUser } from "@/server/types";

const unauthorized = () =>
  NextResponse.json({ message: "Token inválido o ausente" }, { status: 401 });

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return unauthorized();
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return unauthorized();
  }

  try {
    const payload = verifyAuthToken(token);
    const user = userStore.findById(payload.sub);

    if (!user) {
      return unauthorized();
    }

    return NextResponse.json({ user: toPublicUser(user) });
  } catch (error) {
    console.error("Failed to verify token", error);
    return unauthorized();
  }
}
