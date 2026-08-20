import type { Metadata } from "next";
import Link from "next/link";
import { Pxface } from "pxface/react";
import SiteFooter from "../../components/site-footer";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "JavaScript Library",
  description: "Render editable PXFACE 3×5 pixel type in JavaScript, TypeScript, React, SSR, and React Server Components.",
  path: "/docs/javascript",
  keywords: ["pixel font JavaScript", "pixel text React", "SVG wordmark library", "3x5 type renderer", "React Server Component SVG"],
});

const javascriptExample = `import { renderWordmark } from "pxface";

const { svg, scene } = renderWordmark({
  text: "HELLO\\nTHERE",
  pixelGap: 0,
  padding: 20,
  ratio: "fit",
});

document.querySelector("#mark").innerHTML = svg;
console.log(scene.output);`;

const reactExample = `import { Pxface } from "pxface/react";

export function Logo() {
  return (
    <Pxface
      text="HELLO"
      depth={1}
      className="logo"
    />
  );
}`;

export default function JavaScriptDocsPage() {
  return (
    <main className="docs-page">
      <div className="docs-shell library-shell">
        <header className="library-hero">
          <div className="library-hero-copy">
            <p className="license-kicker">NPM / TYPESCRIPT / REACT</p>
            <h1>Pixels,<br />in your code.</h1>
            <p>One dependency gives any frontend the exact renderer behind the studio—without a browser, canvas, or duplicated rules.</p>
            <div className="library-install" aria-label="Install pxface from npm">
              <code>npm install pxface</code>
              <a href="https://www.npmjs.com/package/pxface" target="_blank" rel="noreferrer">View on npm</a>
            </div>
          </div>
          <div className="library-hero-art" aria-hidden="true">
            <Pxface
              text={"BUILD\nWITH\nPIXELS"}
              align="center"
              foreground="#F1F0E9"
              background="#181816"
              depthColor="#FF4E1A"
              depth={1}
              padding={14}
              className="library-wordmark"
            />
          </div>
        </header>

        <section className="docs-grid library-code-grid">
          <article>
            <p className="license-card-index">01 / CORE</p>
            <h2>Render anywhere.</h2>
            <p>The root package is pure TypeScript with no runtime dependencies. Get deterministic SVG and a serializable scene in Node, the browser, a worker, or a build script.</p>
            <pre><code>{javascriptExample}</code></pre>
          </article>
          <article>
            <p className="license-card-index">02 / REACT</p>
            <h2>Drop into React.</h2>
            <p>The optional adapter has no hooks, effects, browser globals, or client directive. It renders during SSR and inside React Server Components.</p>
            <pre><code>{reactExample}</code></pre>
          </article>
        </section>

        <section className="library-contract" aria-labelledby="library-contract-title">
          <header>
            <p className="license-kicker">ONE RENDER CONTRACT</p>
            <h2 id="library-contract-title">Small interface.<br />Every pixel exposed.</h2>
          </header>
          <div className="library-contract-grid">
            <article>
              <strong>Editable SVG</strong>
              <p>Pixels stay as named rectangles or circles, grouped by layer, line, and character for CSS, Figma, or custom tooling.</p>
            </article>
            <article>
              <strong>Typed options</strong>
              <p>Spacing, colors, depth, shape, alignment, palette, padding, ratio, transparency, slant, seed, and scale share versioned defaults.</p>
            </article>
            <article>
              <strong>Exact scene</strong>
              <p>Read normalized options, layout coordinates, colors, viewBox, and final dimensions before writing a file or mounting markup.</p>
            </article>
            <article>
              <strong>Zero duplication</strong>
              <p>The studio, npm package, React adapter, hosted SVG endpoint, and PNG output all cross the same renderer seam.</p>
            </article>
          </div>
        </section>

        <section className="docs-reference library-reference">
          <div>
            <h2>Choose the right surface.</h2>
          </div>
          <p>
            Use <code>pxface</code> when rendering inside your own code. Use the <Link href="/docs/api">hosted API</Link> when an agent, automation, or non-JavaScript tool needs SVG or PNG. Use the <Link href="/font">font files</Link> for normal typing in design and desktop apps.
          </p>
        </section>

        <section className="library-open-source">
          <div>
            <p className="license-kicker">OPEN SOURCE</p>
            <h2>Hack the renderer.</h2>
          </div>
          <p>Package code is MIT. The glyph matrices are CC0 with no attribution required. The PXFACE name and logo remain reserved.</p>
          <div>
            <a href="https://github.com/gwendall/pxface" target="_blank" rel="noreferrer">Source on GitHub</a>
            <Link href="/license">Licensing details</Link>
          </div>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
