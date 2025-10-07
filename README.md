# Portafolio Next.js + API JWT

Portafolio personal construido con Next.js (App Router) y TypeScript. El mismo proyecto expone un backend ligero para registro e inicio de sesión con JSON Web Tokens (JWT) opcionales: cualquier visitante puede navegar el contenido, pero si se autentica verá su nombre en la barra superior.

## ✨ Características clave

- UI limpia con navbar fija, secciones de proyectos, experiencia y contacto.
- Pantalla dedicada en `/auth` para login/registro; el estado autenticado se guarda en `localStorage`.
- API REST en `/api/auth/*` (registro, login y consulta de perfil) firmada con JWT de 7 días.
- Almacenamiento en memoria para usuarios (ideal para demos) con hashing de contraseñas (`bcryptjs`).
- Suite de pruebas (unitarias e integrales) con Vitest + Testing Library.

## 🛠️ Stack principal

- Next.js 15 · React 19 · TypeScript
- pnpm como gestor de paquetes
- `jsonwebtoken` + `bcryptjs` para autenticación
- Vitest, Testing Library y jsdom para pruebas

## 🗂️ Estructura del proyecto

```
.
├── public/                 # Activos estáticos (favicon, imágenes, etc.)
├── src/
│   ├── app/
│   │   ├── api/auth/       # Route handlers: register, login y me
│   │   ├── layout.tsx      # Layout raíz con AuthProvider y Navbar
│   │   └── page.tsx        # Contenido principal del portafolio
│   ├── components/
│   │   ├── auth/           # AuthProvider y página de autenticación
│   │   └── navbar/         # Navbar y estilos asociados
│   ├── lib/                # Utilidades (JWT, contraseñas, cliente HTTP)
│   └── server/             # Tipos y store en memoria para usuarios
├── vitest.config.ts        # Configuración de Vitest (alias, coverage, jsdom)
├── vitest.setup.ts         # Setup de Testing Library y polyfills
└── package.json
```

## ✅ Requisitos previos

- Node.js 18 o superior (recomendado 20+)
- pnpm `>= 8`

## 🔐 Variables de entorno

En desarrollo se usa un secreto por defecto, pero en producción define un archivo `.env.local` (puedes partir de `.env.example`):

```bash
JWT_SECRET="coloca_aqui_una_clave_segura_de_16+_caracteres"
```

Sin este valor, los endpoints `/api/auth/register` y `/api/auth/login` devolverán un error 500 al intentar generar el JWT.

## 🚀 Cómo correr el proyecto

Instala dependencias y arranca el servidor de desarrollo:

```bash
pnpm install
pnpm dev
```

El sitio quedará disponible en [http://localhost:3000](http://localhost:3000).

### Otros scripts útiles

```bash
pnpm build         # Compila el proyecto (Next.js + Turbopack)
pnpm start         # Sirve la build de producción
pnpm lint          # Ejecuta ESLint
pnpm test          # Corre pruebas unitarias e integrales
pnpm test:watch    # Vitest en modo watch
pnpm test:coverage # Genera reporte de cobertura (coverage/)
```

## 🧪 Pruebas incluidas

- **Unitarias**: utilidades de JWT (`src/lib/jwt.ts`) y hashing de contraseñas (`src/lib/password.ts`).
- **Integración**: flujo completo de registro/login sobre los route handlers (`src/app/api/auth/__tests__`).

El reporte HTML de cobertura queda en `coverage/index.html` tras ejecutar `pnpm test:coverage`.

## 🔄 Flujo de autenticación opcional

1. Desde la navbar, ve a la página `/auth` para registrarte o iniciar sesión.
2. El registro crea un usuario en memoria, devuelve un JWT y almacena el token en `localStorage`.
3. Si el token existe al recargar, el `AuthProvider` recupera el perfil mediante `/api/auth/me`.
4. Cerrar sesión elimina el token local y restaura la interfaz pública.

## 📌 Próximos pasos sugeridos

- Persistir usuarios en una base de datos real (PostgreSQL, MongoDB, etc.).
- Añadir páginas o rutas protegidas que exijan autenticación.
- Internacionalizar el contenido y conectar los proyectos a un CMS.
