import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedPxface } from "pxface/react";
import SiteFooter from "../../components/site-footer";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "JavaScript Library",
  description: "Render and animate editable PXFACE 3×5 pixel type in JavaScript, TypeScript, React, SSR, and React Server Components.",
  path: "/docs/javascript",
  keywords: ["pixel font JavaScript", "pixel text React", "SVG wordmark library", "3x5 type renderer", "React Server Component SVG"],
});

const javascriptExample = `import { renderWordmark } from "pxface";

const { svg, scene } = renderWordmark({
  text: "HELLO\\nTHERE",
  effect: "wave",
  effectAmount: 1.1,
  pixelGap: 0,
  padding: 20,
  ratio: "fit",
  pixelOverrides: {
    "l0-c0-r0-x0": {
      color: "#FF4E1A",
      offsetY: -1,
      opacity: 0.7,
    },
  },
});

document.querySelector("#mark").innerHTML = svg;
console.log(scene.output);`;

const reactExample = `import { Pxface } from "pxface/react";

export function Logo() {
  return (
    <Pxface
      text="HELLO"
      effect="weave"
      depth={1}
      className="logo"
    />
  );
}`;

const animationExample = `import { renderWordmarkAnimation } from "pxface";

const loop = renderWordmarkAnimation(
  { text: "MOVE", effect: "assemble", seed: 42 },
  { duration: 3, frameRate: 12 },
);

loop.svg;            // self-contained animated SVG
loop.frames[0].svg;  // exact editable static frame`;

const animatedReactExample = `import { AnimatedPxface } from "pxface/react";

export function Loop() {
  return (
    <AnimatedPxface
      text="MOVE"
      effect="relay"
      duration={3}
      frameRate={12}
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
            <p>One dependency gives any frontend the exact static and animated renderer behind the studio, without a browser, canvas, or duplicated rules.</p>
            <div className="library-install" aria-label="Install pxface from npm">
              <code>npm install pxface</code>
              <a href="https://www.npmjs.com/package/pxface" target="_blank" rel="noreferrer">View on npm</a>
            </div>
          </div>
          <div className="library-hero-art" aria-hidden="true">
            <AnimatedPxface
              text={"BUILD\nWITH\nPIXELS"}
              effect="relay"
              duration={3}
              frameRate={12}
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

        <section className="docs-grid library-code-grid">
          <article>
            <p className="license-card-index">03 / LOOPS</p>
            <h2>Sample exact time.</h2>
            <p>Normalized time is an explicit renderer input. Fixed-step frames are deterministic, seamless, and share one stable viewBox.</p>
            <pre><code>{animationExample}</code></pre>
          </article>
          <article>
            <p className="license-card-index">04 / REACT MOTION</p>
            <h2>Ship one SVG.</h2>
            <p>The animated adapter emits a self-contained looping SVG with no client JavaScript and a static reduced-motion fallback.</p>
            <pre><code>{animatedReactExample}</code></pre>
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
              <p>Spacing, colors, depth, shape, effects, pixel overrides, padding, ratio, transparency, seed, and scale share versioned defaults.</p>
            </article>
            <article>
              <strong>Exact scene</strong>
              <p>Read stable pixel IDs, resolved transforms, layout coordinates, viewBox, and final dimensions before writing a file or mounting markup.</p>
            </article>
            <article>
              <strong>Zero duplication</strong>
              <p>The studio, npm package, React adapter, hosted endpoint, static assets, and animation frames all cross the same renderer seam.</p>
            </article>
          </div>
        </section>

        <section className="docs-reference library-reference">
          <div>
            <h2>Choose the right surface.</h2>
          </div>
          <p>
            Use <code>pxface</code> when rendering or sampling animation inside your own code. Use the <Link href="/docs/api">hosted API</Link> when an agent, automation, or non-JavaScript tool needs static or animated SVG and PNG. Use the Studio for browser-exported GIF, WebM, and MP4. Use the <Link href="/font">font files</Link> for normal typing in design and desktop apps.
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
