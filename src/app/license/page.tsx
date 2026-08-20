import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../components/site-footer";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Licensing",
  description: "Licensing terms for the PXFACE app, 3×5 glyph set, and brand.",
  path: "/license",
  keywords: ["PXFACE license", "CC0 pixel glyphs", "MIT license", "SIL Open Font License", "OFL pixel font"],
});

export default function LicensePage() {
  return (
    <main className="license-page">
      <article className="license-sheet">
        <div className="license-content">
          <section className="license-intro">
            <p className="license-eyebrow">Open glyphs</p>
            <h1>Use the pixels.<br />Make them yours.</h1>
            <p>
              PXFACE separates the reusable 3×5 glyph set from the app that
              turns it into wordmarks.
            </p>
          </section>

          <div className="license-grid">
            <section>
              <h2>Glyphs: CC0 1.0</h2>
              <p>
                The glyph matrices are dedicated to the public domain. Use,
                modify, and redistribute them for any purpose, including
                commercially. No permission or attribution is required.
              </p>
              <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noreferrer">
                Read CC0 1.0
              </a>
            </section>

            <section>
              <h2>Code: MIT</h2>
              <p>
                The PXFACE application code is available under the MIT
                License. Copies of the code must keep its copyright and
                license notice.
              </p>
              <a href="https://github.com/gwendall/pxface" target="_blank" rel="noreferrer">
                Browse the source
              </a>
            </section>

            <section>
              <h2>Brand: Excluded</h2>
              <p>
                The PXFACE name, logo, and brand identity are not included in
                the CC0 dedication or MIT License.
              </p>
            </section>

            <section>
              <h2>Font: OFL 1.1</h2>
              <p>
                The installable PXFACE 3×5 font files use the SIL Open Font
                License. PXFACE is the Reserved Font Name; modified versions
                must use another name.
              </p>
              <Link href="/font">Download the font</Link>
            </section>
          </div>

          <aside className="license-export-note">
            <span>Your exports</span>
            <p>
              These terms cover the underlying glyph shapes, not the text,
              arrangement, colors, or other creative choices you add to an
              export. Those contributions remain yours.
            </p>
          </aside>
        </div>

        <SiteFooter />
      </article>
    </main>
  );
}
