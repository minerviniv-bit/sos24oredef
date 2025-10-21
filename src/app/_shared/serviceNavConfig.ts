export type ServiceItem = {
  slug: string;   // es: "idraulico"
  label: string;  // testo nel menu
  href?: string;  // pagina madre nazionale
  icon?: string;  // path icona/mascotte
};

export const SERVICES = [
  { slug: "idraulico",           label: "Idraulico",              href: "/idraulico",           icon: "/mascotte/idraulico.webp" },
  { slug: "fabbro",              label: "Fabbro & Apertura Porte",href: "/fabbro",              icon: "/mascotte/fabbro.webp" },
  { slug: "elettricista",        label: "Elettricista",           href: "/elettricista",        icon: "/mascotte/elettricista.webp" },
  { slug: "spurgo",              label: "Spurgo & Fognature",     href: "/spurgo",              icon: "/mascotte/spurgo.webp" },
  { slug: "caldaie",             label: "Caldaie",                href: "/caldaie",             icon: "/mascotte/caldaie-2.webp" }, // <— nome reale
  { slug: "disinfestazioni",     label: "Disinfestazioni",        href: "/disinfestazioni",     icon: "/mascotte/disinfestatore.webp" },
  { slug: "vetraio",             label: "Vetraio",                href: "/vetraio",             icon: "/mascotte/vetraio.webp" },    // <— nome reale
  { slug: "assistenza-stradale", label: "Assistenza Stradale",    href: "/assistenza-stradale", icon: "/mascotte/carroattrezzi.webp" },
];

