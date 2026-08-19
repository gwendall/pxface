import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PXWORD 3×5 Font",
  description: "Download the PXWORD 3×5 proportional pixel font as TTF, OTF, WOFF, or WOFF2.",
  alternates: { canonical: "/font" },
};

const cssExample = `@font-face {
  font-family: "PXWORD 3x5";
  src: url("PXWORD-3x5.woff2") format("woff2");
}

.pixel-type { font-family: "PXWORD 3x5", monospace; }`;

export default function FontPage() {
  return (
    <main className="docs-page">
      <div className="docs-shell">
        <nav className="docs-nav" aria-label="Font download">
          <Link href="/">PXWORD</Link>
          <span>FONT / 1.0.0</span>
          <Link href="/license">OFL 1.1</Link>
        </nav>
        <header className="docs-hero">
          <p className="license-kicker">INSTALLABLE TYPE / 95 ASCII CHARACTERS</p>
          <h1>Five pixels tall.<br />Ready anywhere.</h1>
          <p>A proportional display font built directly from the same canonical glyph matrices as the studio and API.</p>
        </header>
        <p className="font-specimen" aria-label="Font specimen">
          ABCDEFGHIJKLM<br />NOPQRSTUVWXYZ<br />0123456789<br />
          {"!?@#$%&*+-_=()[]{}<>/\\|'\"`~"}
        </p>
        <div className="font-downloads" aria-label="Font formats">
          <a href="/fonts/PXWORD-3x5.ttf" download>TTF</a>
          <a href="/fonts/PXWORD-3x5.otf" download>OTF</a>
          <a href="/fonts/PXWORD-3x5.woff" download>WOFF</a>
          <a href="/fonts/PXWORD-3x5.woff2" download>WOFF2</a>
        </div>
        <section className="docs-grid">
          <article>
            <p className="license-card-index">01 / DESKTOP</p>
            <h2>Install once</h2>
            <p>Download TTF or OTF, open the file, and install it with Font Book, Windows Fonts, or your design tool’s font manager.</p>
          </article>
          <article>
            <p className="license-card-index">02 / WEB</p>
            <h2>Self-host it</h2>
            <p>Download WOFF2 and use the supplied CSS. SPACE advances four units; letters use proportional widths plus one pixel of tracking.</p>
            <pre><code>{cssExample}</code></pre>
          </article>
        </section>
        <section className="docs-reference">
          <div>
            <p className="license-kicker">BOUNDARY</p>
            <h2>Font for type. Studio for effects.</h2>
          </div>
          <p>The font carries glyph outlines and metrics. Depth, random colors, pixel gap, padding, canvas ratio, and per-pixel editability remain PXWORD renderer features.</p>
        </section>
        <footer className="license-footer">
          <Link href="/">← Open the studio</Link>
          <Link href="/docs/api">Render API</Link>
          <a href="https://gwendall.com" target="_blank" rel="noreferrer">Made by Gwendall</a>
        </footer>
      </div>
    </main>
  );
}
