import { NextResponse } from "next/server";
import { z } from "zod";

import { verifyPassword } from "@/lib/password";
import { createAuthToken } from "@/lib/jwt";
import { userStore } from "@/server/store/userStore";
import { toPublicUser } from "@/server/types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "El email es obligatorio")
    .transform((value) => value.toLowerCase())
    .refine((value) => emailRegex.test(value), "Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);

  const result = loginSchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json(
      {
        message: "Error de validación",
        errors: result.error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      },
      { status: 400 }
    );
  }

  const { email, password } = result.data;
  const user = userStore.findByEmail(email);

  if (!user) {
    return NextResponse.json(
      { message: "Credenciales inválidas" },
      { status: 401 }
    );
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash);

  if (!isValidPassword) {
    return NextResponse.json(
      { message: "Credenciales inválidas" },
      { status: 401 }
    );
  }

  const publicUser = toPublicUser(user);

  try {
    const token = createAuthToken(publicUser);

    return NextResponse.json({
      user: publicUser,
      token,
    });
  } catch (error) {
    console.error("Failed to create auth token during login", error);

    return NextResponse.json(
      {
        message:
          "No se pudo generar el token de autenticación. Verifica la variable JWT_SECRET.",
      },
      { status: 500 }
    );
  }
}
