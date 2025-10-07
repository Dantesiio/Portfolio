import jwt from "jsonwebtoken";
import { getJwtSecret } from "./env";
import { PublicUser } from "@/server/types";

const TOKEN_TTL = "7d";

export interface AuthTokenPayload {
  sub: string;
  name: string;
  email: string;
}

export const createAuthToken = (user: PublicUser) =>
  jwt.sign(
    {
      name: user.name,
      email: user.email,
    },
    getJwtSecret(),
    {
      subject: user.id,
      expiresIn: TOKEN_TTL,
    }
  );

export const verifyAuthToken = (token: string): AuthTokenPayload => {
  const payload = jwt.verify(token, getJwtSecret());

  if (typeof payload === "string") {
    throw new Error("Invalid token payload");
  }

  return {
    sub: payload.sub as string,
    name: payload.name as string,
    email: payload.email as string,
  };
};
