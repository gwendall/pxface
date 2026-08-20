import { Desktop, DownloadSimple, File, Globe, Package } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import manifestJson from "../../../public/fonts/manifest.json";
import { createPageMetadata } from "@/lib/site-metadata";
import { CopyCssButton, FontTester } from "./font-tools";

export const metadata: Metadata = createPageMetadata({
  title: "Download the 3×5 Font",
  description: "Download the PXFACE 3×5 pixel font for desktop, design tools, and the web as OTF, TTF, WOFF2, or WOFF.",
  path: "/font",
  keywords: ["pixel font download", "3×5 font", "TTF pixel font", "WOFF2 pixel font", "Figma pixel font"],
});

const manifest = manifestJson as {
  family: string;
  style: string;
  version: string;
  license: string;
  artifacts: Record<string, { bytes: number; sha256: string; url: string; purpose: string }>;
};

const ttfZip = `PXFACE3x5-TTF-v${manifest.version}.zip`;
const otfZip = `PXFACE3x5-OTF-v${manifest.version}.zip`;
const webZip = `PXFACE3x5-Web-v${manifest.version}.zip`;
const allZip = `PXFACE3x5-v${manifest.version}.zip`;
const versionPath = `v${manifest.version}`;
const fileStem = "PXFACE3x5-Regular";

const cssExample = `@font-face {
  font-family: "PXFACE 3x5";
  src: url("./PXFACE3x5-Regular.woff2") format("woff2");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}

.pixel-type {
  font-family: "PXFACE 3x5", monospace;
}`;

function size(name: string) {
  const bytes = manifest.artifacts[name]?.bytes ?? 0;
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}

const packages = [
  {
    name: "Desktop font",
    file: ttfZip,
    description: "One TTF to install on macOS, Windows, Linux, Figma, Adobe apps, Sketch, and Office.",
    icon: Desktop,
    recommended: true,
  },
  {
    name: "Web kit",
    file: webZip,
    description: "WOFF2, optional legacy WOFF, ready-to-use CSS, README, and license for self-hosting.",
    icon: Globe,
    recommended: false,
  },
  {
    name: "All formats",
    file: allZip,
    description: "TTF, OTF, web fonts, CSS, README, FONTLOG, manifest, checksums, and OFL documents.",
    icon: Package,
    recommended: false,
  },
];

const formats = [
  { format: "TTF", file: `${versionPath}/${fileStem}.ttf`, use: "Recommended desktop", note: "The safest single choice for operating systems, apps, and design tools." },
  { format: "OTF", file: `${versionPath}/${fileStem}.otf`, use: "Desktop alternative", note: "Choose only if your workflow specifically asks for OTF; do not install it beside TTF." },
  { format: "WOFF2", file: `${versionPath}/${fileStem}.woff2`, use: "Recommended web", note: "The compact format to self-host in modern browsers." },
  { format: "WOFF", file: `${versionPath}/${fileStem}.woff`, use: "Legacy web", note: "An optional fallback for older browser environments." },
];

export default function FontPage() {
  return (
    <main className="docs-page font-page">
      <div className="docs-shell font-shell">
        <header className="font-hero">
          <div>
            <p className="license-kicker">PXFACE 3×5 / 95 ASCII CHARACTERS</p>
            <h1>Five pixels tall.<br />Ready anywhere.</h1>
            <p className="font-hero-copy">A proportional display font built from the same canonical glyphs as the PXFACE studio and render API.</p>
            <div className="font-hero-actions">
              <a className="font-primary-download" href={`/fonts/${ttfZip}`} download={ttfZip}>
                <DownloadSimple weight="bold" />
                <span>Download font<small>TTF / ZIP / {size(ttfZip)}</small></span>
              </a>
              <a className="font-secondary-action" href="#web">Use on the web</a>
              <a className="font-tertiary-action" href="#formats">Other formats</a>
            </div>
          </div>
          <dl className="font-release-meta">
            <div><dt>Family</dt><dd>{manifest.family}</dd></div>
            <div><dt>Style</dt><dd>{manifest.style}</dd></div>
            <div><dt>Version</dt><dd>{manifest.version}</dd></div>
            <div><dt>License</dt><dd>{manifest.license}</dd></div>
          </dl>
        </header>

        <FontTester />

        <section className="font-download-section" id="packages" aria-labelledby="packages-title">
          <div className="font-section-heading">
            <div><h2 id="packages-title">Choose what you need.</h2></div>
            <p>Not sure? Download the TTF package. It is the simplest choice for most desktop and design workflows.</p>
          </div>
          <div className="font-package-grid">
            {packages.map((item) => {
              const Icon = item.icon;
              return (
                <article className="font-package-card" key={item.file} data-recommended={item.recommended || undefined}>
                  <div className="font-package-topline">
                    <Icon aria-hidden="true" />
                    {item.recommended && <span>Recommended</span>}
                  </div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <a href={`/fonts/${item.file}`} download={item.file}>
                    <DownloadSimple /> Download ZIP <small>{size(item.file)}</small>
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        <section className="font-format-section" id="formats" aria-labelledby="formats-title">
          <div className="font-section-heading compact">
            <div><h2 id="formats-title">Pick a format.</h2></div>
            <p>Every file contains the same Regular style and complete printable ASCII set.</p>
          </div>
          <div className="font-format-list">
            {formats.map((item) => (
              <a key={item.file} href={`/fonts/${item.file}`} download={item.file.split("/").at(-1)} className="font-format-row">
                <File aria-hidden="true" />
                <strong>{item.format}</strong>
                <span><b>{item.use}</b>{item.note}</span>
                <small>{size(item.file)}</small>
                <DownloadSimple aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <section className="font-web-section" id="web" aria-labelledby="web-title">
          <div className="font-web-copy">
            <h2 id="web-title">Copy, paste, ship.</h2>
            <p>Download the web kit, keep the CSS beside the files, and update the relative URL if you move them. WOFF2 covers modern browsers; WOFF is included only as an optional legacy fallback.</p>
            <a href={`/fonts/${webZip}`} download={webZip}><DownloadSimple /> Download web kit</a>
          </div>
          <div className="font-code-block">
            <CopyCssButton code={cssExample} />
            <pre><code>{cssExample}</code></pre>
          </div>
        </section>

        <section className="font-install-section" aria-labelledby="install-title">
          <div className="font-section-heading compact">
            <div><h2 id="install-title">From ZIP to font menu.</h2></div>
            <p>Install either OTF or TTF - not both - to avoid duplicate-family warnings.</p>
          </div>
          <div className="font-install-grid">
            <details open>
              <summary>macOS</summary>
              <ol><li>Download and unzip the TTF package.</li><li>Double-click <code>PXFACE3x5-Regular.ttf</code>.</li><li>Choose <strong>Install Font</strong> in Font Book.</li></ol>
              <a href="https://support.apple.com/guide/font-book/install-and-validate-fonts-fntbk1000/mac" target="_blank" rel="noreferrer">Apple instructions ↗</a>
            </details>
            <details>
              <summary>Windows</summary>
              <ol><li>Download and unzip the TTF package.</li><li>Right-click <code>PXFACE3x5-Regular.ttf</code>.</li><li>Choose <strong>Install</strong> or <strong>Install for all users</strong>.</li></ol>
              <a href="https://support.microsoft.com/en-us/office/add-a-font-b7c5f17c-4426-4b53-967f-455339c564c1" target="_blank" rel="noreferrer">Microsoft instructions ↗</a>
            </details>
            <details>
              <summary>Figma & design apps</summary>
              <ol><li>Install the TTF on macOS or Windows.</li><li>Restart the desktop app, or reload Figma after installing its Font Installer.</li><li>Search for <strong>PXFACE 3x5</strong>.</li></ol>
              <p>Figma currently supports local OTF/TTF on macOS and Windows; Linux and ChromeOS cannot add local fonts.</p>
              <a href="https://help.figma.com/hc/en-us/articles/360039956894-Add-a-font-to-Figma" target="_blank" rel="noreferrer">Figma instructions ↗</a>
            </details>
            <details>
              <summary>Linux desktop</summary>
              <ol><li>Unzip the TTF package.</li><li>Copy the TTF into <code>~/.local/share/fonts</code>.</li><li>Run <code>fc-cache -f</code>, then restart your application.</li></ol>
            </details>
          </div>
        </section>

        <section className="font-license-note">
          <div><h2>OFL 1.1, with the paperwork included.</h2></div>
          <div>
            <p>Use the font in personal or commercial work, apps, sites, print, logos, and documents. Every ZIP contains the full license. “PXFACE” is the Reserved Font Name; modified font versions must use another name.</p>
            <p>Your documents, images, and exports do not become OFL. Renderer-only effects - depth, random palettes, gaps, padding, ratios, and selectable pixels - stay in the <Link href="/">studio</Link>.</p>
            <a href="/fonts/manifest.json">Version, sizes & SHA-256 checksums ↗</a>
            <a href={`/fonts/${otfZip}`} download={otfZip}>Download the OTF package ↗</a>
          </div>
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
