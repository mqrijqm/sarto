export const BRAND = "SARTO";

export const NAV = [
  { n: "I.", label: "HOME", href: "/" },
  { n: "II.", label: "ABOUT US", href: "/about" },
  { n: "III.", label: "PROCESS", href: "/process" },
  { n: "IV.", label: "GALLERY", href: "/gallery" },
  { n: "V.", label: "ORDER", href: "/product" },
  { n: "VI.", label: "REGISTRY", href: "/registry" },
];

export const LEGAL = [
  { label: "FAQ", href: "/legals/faq" },
  { label: "Featured Tailors & Photography", href: "/featured-designers" },
  { label: "Terms & Conditions", href: "/legals/terms" },
  { label: "Privacy Policy", href: "/legals/policy" },
];

export const FOOTER_NAV = [
  { label: "Home", href: "/" },
  { label: "Order", href: "/product" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
];

export const CONTACT = {
  phone: "+1 (212) 555-0148",
  email: "hello@sartostudio.com",
  commissions: "commissions@sartostudio.com",
};

/** putanja do optimizovane slike */
export const m = (name: string) => `/media/${name}.webp`;
