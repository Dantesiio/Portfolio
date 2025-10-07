import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST as registerRoute } from "@/app/api/auth/register/route";
import { POST as loginRoute } from "@/app/api/auth/login/route";
import { userStore } from "@/server/store/userStore";

const createRequest = (url: string, body: unknown) =>
  new Request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

beforeEach(() => {
  userStore.clear();
  process.env.JWT_SECRET = "test-secret-key-123456";
});

describe("auth API routes", () => {
  it("permite registrar y obtener un token", async () => {
    const request = createRequest("http://localhost/api/auth/register", {
      name: "Usuario Test",
      email: "test@example.com",
      password: "passwordsegura",
    });

    const response = await registerRoute(request);

    expect(response.status).toBe(201);

    const payload = (await response.json()) as { token: string; user: { email: string } };
    expect(payload.token).toBeTruthy();
    expect(payload.user.email).toBe("test@example.com");
  });

  it("evita registros duplicados", async () => {
    const payload = {
      name: "Usuario Test",
      email: "duplicado@example.com",
      password: "passwordsegura",
    };

    const first = await registerRoute(
      createRequest("http://localhost/api/auth/register", payload)
    );
    expect(first.status).toBe(201);

    const duplicate = await registerRoute(
      createRequest("http://localhost/api/auth/register", payload)
    );

    expect(duplicate.status).toBe(409);
    const duplicateJson = (await duplicate.json()) as { message: string };
    expect(duplicateJson.message).toMatch(/ya está registrado/i);
  });

  it("permite iniciar sesión con credenciales válidas", async () => {
    const email = "login@example.com";
    const password = "passwordsegura";

    await registerRoute(
      createRequest("http://localhost/api/auth/register", {
        name: "Login Test",
        email,
        password,
      })
    );

    const response = await loginRoute(
      createRequest("http://localhost/api/auth/login", {
        email,
        password,
      })
    );

    expect(response.status).toBe(200);
    const payload = (await response.json()) as { token: string; user: { name: string } };
    expect(payload.token).toBeTruthy();
    expect(payload.user.name).toBe("Login Test");
  });

  it("rechaza contraseñas incorrectas", async () => {
    const email = "wrongpass@example.com";

    await registerRoute(
      createRequest("http://localhost/api/auth/register", {
        name: "Wrong Password",
        email,
        password: "passwordsegura",
      })
    );

    const response = await loginRoute(
      createRequest("http://localhost/api/auth/login", {
        email,
        password: "passwordincorrecta",
      })
    );

    expect(response.status).toBe(401);
  });

  it("devuelve un error descriptivo si falta JWT_SECRET en producción", async () => {
  process.env.JWT_SECRET = "";
  vi.stubEnv("NODE_ENV", "production");

    const response = await registerRoute(
      createRequest("http://localhost/api/auth/register", {
        name: "Failing User",
        email: "failing@example.com",
        password: "passwordsegura",
      })
    );

    expect(response.status).toBe(500);
    const payload = (await response.json()) as { message: string };
    expect(payload.message).toMatch(/JWT_SECRET/i);

    vi.unstubAllEnvs();

    process.env.JWT_SECRET = "test-secret-key-123456";

    const retry = await registerRoute(
      createRequest("http://localhost/api/auth/register", {
        name: "Passing User",
        email: "passing@example.com",
        password: "passwordsegura",
      })
    );

    expect(retry.status).toBe(201);
  });
});
