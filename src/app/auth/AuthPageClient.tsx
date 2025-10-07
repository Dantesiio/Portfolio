"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";

import styles from "./page.module.css";

type Mode = "login" | "register";

export default function AuthPageClient() {
  const router = useRouter();
  const { user, login, register, loading } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submitLabel = useMemo(() => {
    if (submitting) {
      return "Guardando...";
    }
    return mode === "login" ? "Entrar" : "Registrarme";
  }, [mode, submitting]);

  const switchLabel = mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?";
  const switchAction = mode === "login" ? "Crear una cuenta" : "Inicia sesión";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      router.push("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo completar la acción";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className={styles.container}>
        <div className={styles.card}>
          <p className={styles.heading}>Cargando...</p>
        </div>
      </section>
    );
  }

  if (user) {
    return (
      <section className={styles.container}>
        <div className={styles.card}>
          <p className={styles.heading}>Ya estás autenticado</p>
          <p className={styles.text}>Hola {user.name}, ya puedes volver al portafolio.</p>
          <Link href="/" className={styles.primaryButton}>
            Volver al inicio
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.heading}>
            {mode === "login" ? "Inicia sesión" : "Crea tu cuenta"}
          </h1>
          <p className={styles.text}>
            {mode === "login"
              ? "Accede para guardar tu progreso y mostrar tu nombre en la navegación."
              : "Regístrate para personalizar la experiencia y continuar donde lo dejaste."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === "register" ? (
            <label className={styles.field}>
              <span>Nombre</span>
              <input
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Tu nombre completo"
                minLength={2}
                required
                autoComplete="name"
              />
            </label>
          ) : null}

          <label className={styles.field}>
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@email.com"
              required
              autoComplete="email"
            />
          </label>

          <label className={styles.field}>
            <span>Contraseña</span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Al menos 8 caracteres"
              minLength={8}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </label>

          {error ? <p className={styles.error}>{error}</p> : null}

          <button type="submit" disabled={submitting} className={styles.primaryButton}>
            {submitLabel}
          </button>
        </form>

        <div className={styles.switcher}>
          <span>{switchLabel}</span>
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError(null);
            }}
            className={styles.linkButton}
          >
            {switchAction}
          </button>
        </div>

        <Link href="/" className={styles.backLink}>
          ← Volver al inicio
        </Link>
      </div>
    </section>
  );
}
