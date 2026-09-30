export const BRAND = "SARTO";

// tekstovi su { bs, en } — prevod bira useT()/t() u komponenti
export const NAV = [
  { n: "I.", label: { bs: "POČETNA", en: "HOME" }, href: "/" },
  { n: "II.", label: { bs: "O NAMA", en: "ABOUT US" }, href: "/about" },
  { n: "III.", label: { bs: "PROCES", en: "PROCESS" }, href: "/process" },
  { n: "IV.", label: { bs: "GALERIJA", en: "GALLERY" }, href: "/gallery" },
  { n: "V.", label: { bs: "NARUČI", en: "ORDER" }, href: "/product" },
  { n: "VI.", label: { bs: "LISTA ŽELJA", en: "REGISTRY" }, href: "/registry" },
];

export const LEGAL = [
  { label: { bs: "Česta pitanja", en: "FAQ" }, href: "/legals/faq" },
  { label: { bs: "Krojači i fotografi", en: "Featured Tailors & Photography" }, href: "/featured-designers" },
  { label: { bs: "Uslovi korištenja", en: "Terms & Conditions" }, href: "/legals/terms" },
  { label: { bs: "Politika privatnosti", en: "Privacy Policy" }, href: "/legals/policy" },
];

export const FOOTER_NAV = [
  { label: { bs: "Početna", en: "Home" }, href: "/" },
  { label: { bs: "Naruči", en: "Order" }, href: "/product" },
  { label: { bs: "Proces", en: "Process" }, href: "/process" },
  { label: { bs: "O nama", en: "About" }, href: "/about" },
  { label: { bs: "Galerija", en: "Gallery" }, href: "/gallery" },
];

export const CONTACT = {
  phone: "+1 (212) 555-0148",
  email: "hello@sartostudio.com",
  commissions: "commissions@sartostudio.com",
};

/**
 * Putanja do optimizovane slike. `size="sm"` = verzija širine 640px za male sličice
 * (grid, galerija) — browser ne dekodira sliku od 2000px za prikaz od 150px (manje trzanja pri skrolu).
 */
export const m = (name: string, size?: "sm") => `/media/${size === "sm" ? "sm/" : ""}${name}.webp`;
