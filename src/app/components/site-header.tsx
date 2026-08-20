"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buildPixelLayout } from "pxface";

const mark = buildPixelLayout("PX", 1, 2, "left");

const navigation = [
  { href: "/", label: "Studio" },
  { href: "/font", label: "Font" },
  { href: "/docs/javascript", label: "JS" },
  { href: "/docs/api", label: "API" },
  { href: "/license", label: "License" },
] as const;

function isCurrentPath(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname.startsWith(href);
}

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link className="site-brand" href="/" aria-label="PXFACE studio">
        <svg
          viewBox={`0 0 ${mark.width} ${mark.height}`}
          aria-hidden="true"
          className="site-brand-mark"
        >
          {mark.pixels.map((pixel, index) => (
            <rect key={index} x={pixel.x} y={pixel.y} width="1" height="1" />
          ))}
        </svg>
        <span aria-hidden="true">FACE</span>
      </Link>

      <p className="site-tagline">Pixel type, made tangible.</p>

      <nav className="site-nav" aria-label="Primary navigation">
        {navigation.map((item) => {
          const current = isCurrentPath(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
