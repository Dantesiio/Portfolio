"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthDialog } from "@/components/auth/AuthDialog";
import { useAuth } from "@/components/auth/AuthProvider";

import styles from "./Navbar.module.css";

export const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const openDialog = () => {
    setDialogOpen(true);
    setMenuOpen(false);
  };

  const closeDialog = () => setDialogOpen(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <Link href="#inicio" className={styles.brand}>
          <span aria-hidden className={styles.brandDot} />
          <span>Mi Portafolio</span>
        </Link>
        <div className={styles.links}>
          <a href="#proyectos">Proyectos</a>
          <a href="#experiencia">Experiencia</a>
          <a href="#contacto">Contacto</a>
        </div>
        <div className={styles.actions}>
          {user ? (
            <div className={styles.userMenu}>
              <button onClick={toggleMenu} className={styles.userButton}>
                {user.name}
              </button>
              {menuOpen ? (
                <div className={styles.dropdown}>
                  <button onClick={handleLogout}>Cerrar sesión</button>
                </div>
              ) : null}
            </div>
          ) : (
            <button
              onClick={openDialog}
              className={styles.loginButton}
              disabled={loading}
            >
              {loading ? "Cargando..." : "Iniciar sesión"}
            </button>
          )}
        </div>
      </nav>
      <AuthDialog open={dialogOpen} onClose={closeDialog} />
    </header>
  );
};
