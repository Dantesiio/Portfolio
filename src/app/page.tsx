import styles from "./page.module.css";

const projects = [
  {
    title: "Dashboard de analítica",
    description:
      "Plataforma en tiempo real con dashboards personalizables y filtros avanzados para equipos de marketing.",
    type: "Producto SaaS",
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
  },
  {
    title: "E-commerce Headless",
    description:
      "Tienda en línea headless integrada con Stripe y CMS, optimizada para SEO y tiempos de carga sub-second.",
    type: "Comercio digital",
    stack: ["Next.js", "GraphQL", "Stripe", "Contentful"],
  },
  {
    title: "App móvil de bienestar",
    description:
      "Aplicación PWA con rutinas personalizadas, recordatorios inteligentes y seguimiento de hábitos.",
    type: "Salud & Lifestyle",
    stack: ["Next.js", "Expo", "Supabase", "Tailwind"],
  },
];

const experience = [
  {
    role: "Senior Frontend Engineer",
    company: "TechScale",
    period: "2023 - Actualidad",
    summary:
      "Lidero iniciativas de performance, migraciones a app router y diseño de sistemas de diseño escalables.",
  },
  {
    role: "Fullstack Developer",
    company: "StartHub",
    period: "2020 - 2023",
    summary:
      "Construí productos MVP en ciclos rápidos usando Next.js, Node y bases de datos relacionales.",
  },
];

const contactLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
  { label: "Descargar CV", href: "#" },
];

export default function Home() {
  return (
    <>
      <section id="inicio" className={styles.hero}>
        <p className={styles.cardTag}>Disponible para nuevos proyectos</p>
        <h1 className={styles.heroTitle}>
          Hola, soy <span>David Donneys</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Desarrollador fullstack especializado en experiencias web modernas, accesibles y con foco en
          rendimiento. Diseño soluciones end-to-end, desde el backend con Next.js hasta interfaces refinadas.
        </p>
        <div className={styles.heroActions}>
          <a className={styles.primaryButton} href="#contacto">
            Hablemos de tu idea
          </a>
          <a className={styles.secondaryButton} href="#proyectos">
            Ver proyectos destacados
          </a>
        </div>
      </section>

      <section id="proyectos">
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Proyectos destacados</h2>
          <p className={styles.sectionSubtitle}>
            Aplicaciones que combinan estrategia de producto, diseño centrado en el usuario y bases técnicas
            sólidas.
          </p>
        </header>
        <div className={styles.grid}>
          {projects.map((project) => (
            <article key={project.title} className={styles.card}>
              <span className={styles.cardTag}>{project.type}</span>
              <h3 className={styles.cardTitle}>{project.title}</h3>
              <p className={styles.cardDescription}>{project.description}</p>
              <div className={styles.cardStack}>
                {project.stack.map((tech) => (
                  <span key={tech} className={styles.stackPill}>
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="experiencia">
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Experiencia profesional</h2>
          <p className={styles.sectionSubtitle}>
            Más de 6 años construyendo productos digitales de alto impacto para startups y empresas en
            crecimiento.
          </p>
        </header>
        <div className={styles.timeline}>
          {experience.map((item) => (
            <article key={item.role} className={styles.timelineItem}>
              <h3 className={styles.timelineRole}>{item.role}</h3>
              <div className={styles.timelineCompany}>
                {item.company} · {item.period}
              </div>
              <p className={styles.cardDescription}>{item.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contacto">
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Conectemos</h2>
          <p className={styles.sectionSubtitle}>
            ¿Tienes un proyecto en mente o necesitas ayuda con tu plataforma actual? Estoy listo para sumarme.
          </p>
        </header>
        <div className={styles.contactCard}>
          <p>Escríbeme y coordinaré una llamada para ayudarte a construir la próxima gran experiencia.</p>
          <div className={styles.contactActions}>
            {contactLinks.map((link) => (
              <a
                key={link.label}
                className={styles.secondaryButton}
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
