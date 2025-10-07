import type { Metadata } from "next";

import AuthPageClient from "./AuthPageClient";

export const metadata: Metadata = {
  title: "Accede al portafolio",
  description: "Inicia sesión o crea una cuenta para personalizar tu experiencia.",
};

export default function AuthPage() {
  return <AuthPageClient />;
}
