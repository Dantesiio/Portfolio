"use client";

import { FormEvent, useState } from "react";

import { useAuth } from "./AuthProvider";
import { Modal } from "@/components/ui/Modal";

type Mode = "login" | "register";

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AuthDialog = ({ open, onClose }: AuthDialogProps) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setError(null);
  };

  const closeDialog = () => {
    onClose();
    resetForm();
    setMode("login");
  };

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode);
    setError(null);
  };

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
      closeDialog();
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo completar la acción";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  let submitLabel = "Entrar";
  if (mode === "register") {
    submitLabel = "Registrarme";
  }
  if (submitting) {
    submitLabel = "Guardando...";
  }

  return (
    <Modal
      title={mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
      open={open}
      onClose={closeDialog}
    >
      <form onSubmit={handleSubmit} className="auth-form">
        {mode === "register" && (
          <label className="auth-field">
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
        )}

        <label className="auth-field">
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

        <label className="auth-field">
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

        {error ? <p className="auth-error">{error}</p> : null}

        <button type="submit" disabled={submitting} className="auth-submit">
          {submitLabel}
        </button>

        <p className="auth-switch">
          {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"} {" "}
          <button
            type="button"
            onClick={() => switchMode(mode === "login" ? "register" : "login")}
            className="auth-link"
          >
            {mode === "login" ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </form>
    </Modal>
  );
};

// Obsoleto: el flujo de autenticación ahora vive en /auth
export {};
