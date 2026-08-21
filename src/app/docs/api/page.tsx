import type { Metadata } from "next";
import SiteFooter from "../../components/site-footer";
import { RENDER_PARAMETER_GROUPS } from "@/lib/render-parameter-docs";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Render API",
  description: "Generate deterministic PXFACE 3×5 pixel wordmarks as editable SVG or production-ready PNG.",
  path: "/docs/api",
  keywords: ["pixel text API", "SVG generator API", "PNG render API", "OpenAPI pixel art", "headless typography"],
  alternateTypes: {
    "text/plain": "/llms.txt",
    "text/markdown": "/SKILL.md",
    "text/yaml": "/openapi.yaml",
  },
});

const agentResources = [
  {
    name: "llms.txt",
    href: "/llms.txt",
    type: "text/plain",
    description: "A compact index of PXFACE, its endpoint, limits, license, and canonical documentation.",
  },
  {
    name: "SKILL.md",
    href: "/SKILL.md",
    type: "text/markdown",
    description: "Ready-to-use instructions for agents that need to generate, validate, and save an asset.",
  },
  {
    name: "openapi.yaml",
    href: "/openapi.yaml",
    type: "text/yaml",
    description: "The complete OpenAPI 3.1 contract for clients, tool calling, validation, and code generation.",
  },
] as const;

const svgCurl = `curl --get 'https://pxface.com/api/v1/render' \\
  --data-urlencode 'text=HELLO\nTHERE' \\
  --data 'format=svg' \\
  --data 'ratio=fit' \\
  --output hello-there.svg`;

const pngCurl = `curl 'https://pxface.com/api/v1/render' \\
  --header 'Content-Type: application/json' \\
  --data '{"format":"png","options":{"text":"HELLO\\nTHERE","ratio":"square","effect":"wave","effectAmount":1.1,"seed":42,"pixelOverrides":{"l0-c0-r0-x0":{"color":"#FF4E1A","offsetY":-1}}}}' \\
  --output hello-there.png`;

export default function ApiDocsPage() {
  return (
    <main className="docs-page">
      <div className="docs-shell">
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
        <section className="docs-parameters" aria-labelledby="parameter-reference">
          <div className="docs-parameters-heading">
            <div>
              <h2 id="parameter-reference">Parameter reference.</h2>
              <p>Every studio control is available through the API. GET accepts flat query parameters. POST keeps <code>format</code> and <code>download</code> at the root and puts all render parameters inside <code>options</code>.</p>
              <p className="docs-table-note">Scroll each table horizontally to see every column.</p>
            </div>
            <a href="/openapi.yaml">OpenAPI 3.1</a>
          </div>
          <div className="docs-parameter-groups">
            {RENDER_PARAMETER_GROUPS.map((group) => (
              <section className="docs-parameter-group" key={group.title}>
                <header>
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                </header>
                <div className="docs-table-scroll">
                  <table aria-label={`${group.title} parameters`}>
                    <thead>
                      <tr>
                        <th scope="col">Parameter</th>
                        <th scope="col">Type or values</th>
                        <th scope="col">Default</th>
                        <th scope="col">Effect</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.parameters.map((parameter) => (
                        <tr key={parameter.name}>
                          <th scope="row"><code>{parameter.name}</code></th>
                          <td><code>{parameter.type}</code></td>
                          <td><code>{parameter.defaultValue}</code></td>
                          <td>{parameter.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        </section>
        <section className="docs-agent-resources" aria-labelledby="agent-resources">
          <header>
            <h2 id="agent-resources">Agent resources.</h2>
            <p>Three plain files make the renderer easy to discover and use. Open them directly, copy their URLs, or give them to an agent.</p>
          </header>
          <div className="docs-resource-list">
            {agentResources.map((resource) => (
              <a href={resource.href} key={resource.name} type={resource.type}>
                <strong>{resource.name}</strong>
                <p>{resource.description}</p>
                <code>{resource.type}</code>
                <span aria-hidden="true">Open</span>
              </a>
            ))}
          </div>
        </section>
        <section className="docs-reference">
          <div>
            <h2>Built for automation.</h2>
          </div>
          <p>Errors include field-level issues. Output dimensions and renderer version are exposed as headers. Public CORS is enabled; the current limit is 60 requests per minute per IP. GET responses include an ETag for cache validation. Building a JavaScript frontend? <a href="/docs/javascript">Use the local package</a> instead of making a network request.</p>
        </section>
        <SiteFooter />
      </div>
    </main>
  );
}
