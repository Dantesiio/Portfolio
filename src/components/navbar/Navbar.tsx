"use client";

import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";

import styles from "./Navbar.module.css";

export const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  let authControl: React.ReactNode;
  if (user) {
    authControl = (
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
    );
  } else if (loading) {
    authControl = (
      <button className={styles.loginButton} disabled>
        Cargando...
      </button>
    );
  } else {
    authControl = (
      <Link href="/auth" className={styles.loginButton}>
        Iniciar sesión
      </Link>
    );
  }

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <Link href="/#inicio" className={styles.brand}>
          <span aria-hidden className={styles.brandDot} />
          <span>Mi Portafolio</span>
        </Link>
        <div className={styles.links}>
          <Link href="/#proyectos">Proyectos</Link>
          <Link href="/#experiencia">Experiencia</Link>
          <Link href="/#contacto">Contacto</Link>
        </div>
        <div className={styles.actions}>{authControl}</div>
      </nav>
    </header>
  );
};
