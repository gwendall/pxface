import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "License — PXWORD",
  description: "Licensing terms for the PXWORD app, 3×5 glyph set, and brand.",
  alternates: {
    canonical: "/license",
  },
};

export default function LicensePage() {
  return (
    <main className="license-page">
      <article className="license-sheet">
        <header className="license-header">
          <Link href="/">PXWORD</Link>
          <span>Licensing / 2026</span>
        </header>

        <div className="license-content">
          <section className="license-intro">
            <p className="license-eyebrow">Open glyphs</p>
            <h1>Use the pixels.<br />Make them yours.</h1>
            <p>
              PXWORD separates the reusable 3×5 glyph set from the app that
              turns it into wordmarks.
            </p>
          </section>

          <div className="license-grid">
            <section>
              <span>01 / Glyphs</span>
              <h2>CC0 1.0</h2>
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
              <span>02 / App code</span>
              <h2>MIT</h2>
              <p>
                The PXWORD application code is available under the MIT
                License. Copies of the code must keep its copyright and
                license notice.
              </p>
            </section>

            <section>
              <span>03 / Brand</span>
              <h2>Excluded</h2>
              <p>
                The PXWORD name, logo, and brand identity are not included in
                the CC0 dedication or MIT License.
              </p>
            </section>

            <section>
              <span>04 / Font files</span>
              <h2>OFL 1.1</h2>
              <p>
                The installable PXWORD 3×5 font files use the SIL Open Font
                License. PXWORD is the Reserved Font Name; modified versions
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

        <footer className="license-footer">
          <Link href="/">Back to studio</Link>
          <a href="https://gwendall.com" target="_blank" rel="noreferrer">Made by Gwendall</a>
        </footer>
      </article>
    </main>
  );
}
