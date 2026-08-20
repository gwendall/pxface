import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Render API | PXFACE",
  description: "Generate deterministic 3×5 pixel wordmarks as editable SVG or PNG.",
  alternates: { canonical: "/docs/api" },
};

const svgCurl = `curl --get 'https://pxface.com/api/v1/render' \\
  --data-urlencode 'text=HELLO\nTHERE' \\
  --data 'format=svg' \\
  --data 'ratio=fit' \\
  --output hello-there.svg`;

const pngCurl = `curl 'https://pxface.com/api/v1/render' \\
  --header 'Content-Type: application/json' \\
  --data '{"format":"png","options":{"text":"HELLO\\nTHERE","ratio":"square","colorMode":"random","seed":42}}' \\
  --output hello-there.png`;

export default function ApiDocsPage() {
  return (
    <main className="docs-page">
      <div className="docs-shell">
        <nav className="docs-nav" aria-label="API documentation">
          <Link href="/">PXFACE</Link>
          <span>API v1</span>
          <a href="/openapi.yaml">OpenAPI</a>
        </nav>
        <header className="docs-hero">
          <p className="license-kicker">HEADLESS RENDERER / V1</p>
          <h1>Pixels on demand.</h1>
          <p>One endpoint turns text and the same options as the studio into editable SVG or production-ready PNG.</p>
          <div className="docs-endpoint"><strong>GET · POST</strong><code>/api/v1/render</code></div>
        </header>
        <section className="docs-grid">
          <article>
            <h2>Cacheable SVG URL</h2>
            <p>Use GET when parameters fit in a URL. Responses are deterministic, cached, and carry an ETag.</p>
            <pre><code>{svgCurl}</code></pre>
          </article>
          <article>
            <h2>PNG from JSON</h2>
            <p>Use POST for structured agent calls. PNG and SVG come from the exact same render scene.</p>
            <pre><code>{pngCurl}</code></pre>
          </article>
        </section>
        <section className="docs-reference">
          <div>
            <h2>Everything the studio knows.</h2>
          </div>
          <p><code>text</code>, three colors, letter/word/line spacing, pixel gap, depth, padding, fit or square ratio, alignment, shape, slant, transparency, solid/random color mode, seed, and output scale.</p>
        </section>
        <section className="docs-reference">
          <div>
            <h2>Built for automation.</h2>
          </div>
          <p>Errors include field-level issues. Output dimensions and renderer version are exposed as headers. Public CORS is enabled; the current limit is 60 requests per minute per IP. Text is capped at 160 characters and 8 lines.</p>
        </section>
        <footer className="license-footer">
          <Link href="/">← Open the studio</Link>
          <a href="/openapi.yaml">Download OpenAPI</a>
          <a href="https://gwendall.com" target="_blank" rel="noreferrer">Made by Gwendall</a>
        </footer>
      </div>
    </main>
  );
}
