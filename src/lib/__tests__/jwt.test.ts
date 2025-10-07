import { describe, expect, it, beforeEach } from "vitest";

import { createAuthToken, verifyAuthToken } from "@/lib/jwt";
import { PublicUser } from "@/server/types";

const sampleUser: PublicUser = {
  id: "user-123",
  name: "Test User",
  email: "test@example.com",
  createdAt: new Date().toISOString(),
};

beforeEach(() => {
  process.env.JWT_SECRET = "test-secret-key-123456";
});

describe("jwt helpers", () => {
  it("genera un token que podemos verificar", () => {
    const token = createAuthToken(sampleUser);
    const payload = verifyAuthToken(token);

    expect(payload.sub).toBe(sampleUser.id);
    expect(payload.name).toBe(sampleUser.name);
    expect(payload.email).toBe(sampleUser.email);
  });

  it("lanza error cuando el token es inválido", () => {
    const invalidToken = "token-malo";
    expect(() => verifyAuthToken(invalidToken)).toThrowError();
  });
});
