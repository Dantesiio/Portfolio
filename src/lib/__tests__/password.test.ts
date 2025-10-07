import { describe, expect, it } from "vitest";

import { hashPassword, verifyPassword } from "@/lib/password";

describe("password helpers", () => {
  it("verifica correctamente una contraseña válida", async () => {
    const password = "supersecret123";
    const hash = await hashPassword(password);

    await expect(verifyPassword(password, hash)).resolves.toBe(true);
  });

  it("rechaza contraseñas inválidas", async () => {
    const hash = await hashPassword("otrapassword");

    await expect(verifyPassword("passwordincorrecta", hash)).resolves.toBe(false);
  });
});
