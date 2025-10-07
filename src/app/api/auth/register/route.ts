import { NextResponse } from "next/server";
import { z } from "zod";

import { hashPassword } from "@/lib/password";
import { createAuthToken } from "@/lib/jwt";
import { userStore } from "@/server/store/userStore";
import { toPublicUser } from "@/server/types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const registerSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z
    .string()
    .trim()
    .min(1, "El email es obligatorio")
    .transform((value) => value.toLowerCase())
    .refine((value) => emailRegex.test(value), "Email inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(64, "La contraseña debe tener máximo 64 caracteres"),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);

  const result = registerSchema.safeParse(json);
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

  const { name, email, password } = result.data;

  if (userStore.findByEmail(email)) {
    return NextResponse.json(
      {
        message: "El email ya está registrado",
      },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);

  const user = userStore.save({
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash,
    createdAt: new Date(),
  });

  const publicUser = toPublicUser(user);

  return NextResponse.json(
    {
      user: publicUser,
      token: createAuthToken(publicUser),
    },
    { status: 201 }
  );
}
