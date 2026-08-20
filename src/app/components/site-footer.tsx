import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Studio" },
  { href: "/font", label: "Font" },
  { href: "/docs/javascript", label: "JavaScript" },
  { href: "/docs/api", label: "API" },
  { href: "/license", label: "License" },
] as const;

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>Pixel type, made tangible.</p>
      <nav aria-label="Footer navigation">
        {footerLinks.map((item) => (
          <Link key={item.href} href={item.href}>{item.label}</Link>
        ))}
      </nav>
      <div className="site-footer-meta">
        <a href="https://github.com/gwendall/pxface" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://gwendall.com" target="_blank" rel="noreferrer">Made by Gwendall</a>
      </div>
    </footer>
  );
}
