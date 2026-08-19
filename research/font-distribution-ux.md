# PXWORD font distribution UX

Research date: 19 August 2026. Sources are first-party documentation, standards,
or official project repositories.

## Recommendation in one sentence

Give people one obvious **Download font** action that installs the TTF build,
then place **Web**, **All formats**, and individual files in a clearly labelled
format chooser. Do not make four unexplained extensions compete as equal primary
buttons.

This follows the useful part of Google Fonts' model: a family-level download is
the simple default, while web usage is a separate copy-and-paste workflow. Google
Fonts' official Noto documentation describes `Download Family` as a ZIP action
and a separate “Use on the web” selection/embed-code flow. The Google Fonts
project itself only onboards TrueType `.ttf` binaries; upstream projects may also
publish `.otf` and `.woff2` files. [Noto usage guide](https://github.com/notofonts/noto-docs/blob/main/docs/website/use.md),
[Google Fonts static-font requirements](https://googlefonts.github.io/gf-guide/statics.html)

## Proposed page and CTA hierarchy

Above the fold:

1. Live specimen using the actual installed webfont, with editable sample text.
2. Family metadata: `PXWORD 3x5`, `Regular`, `95 ASCII characters`, `v1.0.0`,
   `OFL 1.1`.
3. Primary: **Download font** — `TTF · desktop · 9.8 KB`.
4. Secondary: **Use on the web** — opens the copyable CSS and web-kit download.
5. Tertiary link: **Choose another format**.

Format chooser:

| User intent | Recommended action | Alternatives |
| --- | --- | --- |
| Install in macOS, Windows, Office, Figma, Adobe apps | **TTF — recommended for desktop** | OTF |
| Self-host on a modern website | **WOFF2 — recommended for web** | WOFF legacy fallback |
| Archive, redistribute, or inspect everything | **All formats ZIP** | Desktop kit, web kit |
| Automated use | Stable direct file URL + versioned manifest | SHA-256 checksums |

Adobe Fonts similarly leads with user intent (`Add Family`, `Add font`, or add
to a web project) rather than exposing font extensions as the first decision.
That is a useful interaction pattern even though PXWORD is a downloadable open
font rather than a subscription service. [Adobe desktop-font flow](https://helpx.adobe.com/creative-cloud/apps/integration-with-other-apps/manage-fonts/add-fonts.html),
[Adobe web-project flow](https://helpx.adobe.com/fonts/using/add-fonts-website.html)

Practical details:

- Keep the primary button a real download link; no account and no modal before
  download.
- Put version, size, platform purpose, and license directly beside each action.
- After a click, show a short non-blocking confirmation and keep installation
  instructions in view.
- Make every file directly linkable and keyboard reachable. A disclosure or
  bottom sheet may organise formats on small screens, but must not hide the
  recommended action.
- Do not auto-select OTF vs TTF from the user agent. Both desktop platforms
  accept both formats and the user may be downloading for another machine.
- Do not put `TTF`, `OTF`, `WOFF`, and `WOFF2` as four unexplained equal-weight
  buttons. The current PXWORD page does this and transfers an implementation
  decision to users who usually only know their intended destination.

## Which formats to ship

Ship the existing four, but give them different priority:

- **TTF: primary desktop file.** Google Fonts distributes TrueType binaries,
  Windows explicitly accepts `.ttf`, macOS supports TrueType, and Figma supports
  it. It is the least surprising one-click desktop choice.
- **OTF: secondary desktop file.** It is useful for people or production systems
  that explicitly prefer OpenType/CFF. It is not inherently “higher quality”
  than the TTF build. macOS, Windows, Figma, and Illustrator accept it.
- **WOFF2: primary web file.** MDN recommends it for web delivery because of its
  compression and modern support; W3C says WOFF2 is implemented in all major
  browsers and supports the full TrueType/OpenType feature set.
- **WOFF: optional legacy web fallback.** Keep it because it costs little and
  may help deliberately old targets, but do not imply that a modern project
  requires it.

Do not add EOT, SVG fonts, TTC/OTC, or a variable font for this single-style
family. CSS Fonts Level 4 labels SVG fonts deprecated, and WOFF2 is the modern
web default. A collection and a variation axis would add concepts without adding
value here. [CSS Fonts Level 4 format table](https://www.w3.org/TR/css-fonts-4/#font-format-definitions),
[WOFF2 Recommendation](https://www.w3.org/TR/WOFF2/),
[MDN `@font-face`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face)

Important packaging caveat: **never tell users to install both TTF and OTF**.
They represent the same family/style and can appear as duplicates. Apple Font
Book explicitly detects duplicate installations. Make TTF the default and label
OTF “alternative — install one desktop format only.” [Apple Font Book](https://support.apple.com/en-ie/guide/font-book/fntbk1000/mac)

## Download packages

Recommended assets:

```text
PXWORD3x5-v1.0.0.zip                 # all formats, secondary action
PXWORD3x5-TTF-v1.0.0.zip             # primary desktop package
PXWORD3x5-OTF-v1.0.0.zip             # explicit alternative
PXWORD3x5-Web-v1.0.0.zip             # WOFF2 + WOFF + CSS
PXWORD3x5-Regular.ttf                # direct files remain available
PXWORD3x5-Regular.otf
PXWORD3x5-Regular.woff2
PXWORD3x5-Regular.woff
```

The current `desktop` ZIP includes both TTF and OTF, which creates an avoidable
duplicate-font trap. Split it into TTF and OTF downloads, or make the default
desktop ZIP TTF-only. The all-formats archive may still contain both in separate
folders with a prominent “install one” note.

Recommended all-formats archive:

```text
PXWORD3x5-v1.0.0/
├── README.md
├── OFL.txt
├── OFL-FAQ.txt
├── FONTLOG.md
├── SHA256SUMS.txt
├── manifest.json
├── desktop/
│   ├── ttf/PXWORD3x5-Regular.ttf
│   └── otf/PXWORD3x5-Regular.otf
└── web/
    ├── PXWORD3x5-Regular.woff2
    ├── PXWORD3x5-Regular.woff
    └── pxword-3x5.css
```

Google Fonts' project guidance uses predictable `FamilyName-Style.ttf` names,
GitHub releases for versioned font milestones, and a changelog. Its older project
checklist specifically recommends attaching production OTF/TTF binaries in a ZIP
release instead of treating development binaries as releases. [Static filename requirements](https://googlefonts.github.io/gf-guide/statics.html#static-font-filenames),
[Google Fonts project template](https://github.com/googlefonts/festival),
[Google Fonts project checklist](https://googlefonts.github.io/gf-docs/ProjectChecklist/)

For PXWORD:

- Use `PXWORD3x5-Regular.ext` for binary filenames; keep the version in the ZIP
  name and the font's internal version metadata.
- Publish immutable versioned URLs, for example
  `/fonts/v1.0.0/PXWORD3x5-Regular.woff2`. An optional unversioned convenience URL
  can redirect or carry a short cache lifetime.
- Keep one manifest with family, style, version, byte size, MIME type, URL, and
  SHA-256 for every asset. Add a downloadable `SHA256SUMS.txt`. This is an
  integrity/reproducibility recommendation, not an OFL requirement; PXWORD
  already computes SHA-256 in `manifest.json`.
- Keep builds deterministic and make the same version appear in the page, ZIP
  name, README, manifest, and the font `name` table.
- Serve correct MIME types (`font/ttf`, `font/otf`, `font/woff`, `font/woff2`),
  attachment filenames, immutable caching on versioned files, and CORS headers
  if PXWORD permits hotlinking from other origins. MDN notes that remote fonts
  are same-origin restricted unless HTTP access controls allow them.

## Web experience

The **Use on the web** panel should contain:

1. **Copy CSS** button.
2. **Download web kit** button.
3. Direct WOFF2 and WOFF links under “Individual files”.
4. A minimal HTML/CSS example and the exact family name.
5. A note that this is a five-pixel display face and that the studio—not the
   font—provides depth, per-pixel colour, gap, padding, and editable SVG effects.

Recommended default snippet:

```css
@font-face {
  font-family: "PXWORD 3x5";
  src: url("./PXWORD3x5-Regular.woff2") format("woff2");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}

.pixel-type {
  font-family: "PXWORD 3x5", monospace;
}
```

Offer the WOFF fallback as an optional compatibility variant, not in the default
snippet. Google Fonts' CSS API also separates the stylesheet link from the CSS
`font-family` rule, documents `font-display`, and supports text subsetting. The
PXWORD font is only about 1.5 KB as WOFF2, so a dynamic subset endpoint would add
more complexity than value. [Google Fonts CSS API](https://developers.google.com/fonts/docs/getting_started)

## Installation documentation

Use platform tabs or an accordion and default to the visitor's likely OS, while
keeping all tabs directly selectable.

### macOS

1. Download and unzip the TTF package.
2. Double-click `PXWORD3x5-Regular.ttf`.
3. Click **Install** in Font Book.
4. Restart a design application if the family is not immediately listed.

Apple documents double-click, drag-to-Font-Book, and File > Add Fonts workflows,
and supports both TTF and OTF. [Apple Font Book installation guide](https://support.apple.com/en-ie/guide/font-book/fntbk1000/mac)

### Windows 10/11

1. Download the TTF package and extract the ZIP.
2. Right-click `PXWORD3x5-Regular.ttf`.
3. Choose **Install**, or **Install for all users** if appropriate.
4. Reopen the target application if necessary.

Microsoft explicitly says to extract ZIPs first and supports TrueType and
OpenType files. [Microsoft Manage Fonts](https://support.microsoft.com/en-us/windows/experience/personalization/manage-fonts-in-windows)

### Linux

1. Extract the TTF package.
2. Copy the TTF to `~/.local/share/fonts/` for the current user.
3. Run `fc-cache` if the desktop does not discover it automatically.
4. Restart the target application.

For a system-wide install, GNOME's administration guide uses
`/usr/local/share/fonts/` and `fc-cache /usr/local/share/fonts/`. [GNOME system administration guide](https://help.gnome.org/system-admin-guide/fonts.html)

### Figma and other design applications

- Install the TTF in macOS or Windows, then restart Figma Desktop or reload the
  file.
- Figma in a browser needs Figma's font installer/helper to see local fonts.
- Search under **Installed by you**.
- Collaborators need the same font version or will receive missing-font errors.
- Figma supports local TTF and OTF, but not extra local fonts on ChromeOS or
  Linux. Figma now also permits uploading a font to an account, which makes it
  usable by its MCP and agent; the user must confirm they have upload rights.
- Illustrator sees fonts installed at OS level. If an application does not show
  the font immediately, restart it.

[Figma local-font guide](https://help.figma.com/hc/en-us/articles/360039956894-Add-a-font-to-Figma),
[Figma font picker](https://help.figma.com/hc/en-us/articles/360041308034-Browse-and-apply-fonts),
[Adobe Illustrator font FAQ](https://helpx.adobe.com/illustrator/using/fonts-faq.html)

## OFL packaging and a current PXWORD issue

OFL condition 2 requires redistributed copies to carry the copyright notice and
license. SIL recommends `OFL.txt` in the release, copyright/license metadata in
font binaries, and `OFL-FAQ.txt` plus `FONTLOG.txt` as package companions. Google
Fonts requires the copyright on the first line of `OFL.txt` to match the notice
inside every font file. Reserved Font Names apply to modified fonts, not to
documents or artwork made with the original font. [Official OFL text and FAQ](https://software.sil.org/oflt/),
[How to use the OFL](https://openfontlicense.org/how-to-use-the-ofl/),
[Google Fonts project checklist](https://github.com/googlefonts/gf-docs/blob/main/ProjectChecklist/README.md)

Current local audit:

- The ZIP packages correctly contain `OFL.txt` and a README.
- The binaries contain family/style/version plus OFL fields (`name` IDs 13/14).
- **The TTF and OTF currently have no copyright `name` ID 0.** This should be
  fixed before making individual binary downloads the headline experience. A
  direct binary download should be self-describing, and Google Fonts' packaging
  requirement expects its copyright notice to match `OFL.txt`.
- Add `OFL-FAQ.txt` and `FONTLOG.md` to the full release; they are recommended
  companions, while `OFL.txt` and the copyright/license notice are the legal
  core.
- Keep the UI wording precise: **font binaries are OFL 1.1; glyph matrices are
  CC0; PXWORD brand assets are excluded**. A font download must not imply every
  asset exported by the studio is OFL.

## Acceptance checklist

- [ ] One prominent “Download font” CTA downloads a TTF-only, versioned package.
- [ ] “Use on the web”, “All formats”, and “Choose another format” are visible
  without competing with the primary CTA.
- [ ] TTF, OTF, WOFF2, and WOFF have plain-language intent, size, version, and
  license labels.
- [ ] TTF is labelled recommended desktop; WOFF2 recommended web; OTF alternative;
  WOFF legacy.
- [ ] TTF and OTF are never both recommended for simultaneous installation.
- [ ] macOS, Windows, Linux, Figma, and web instructions are on the page.
- [ ] CSS can be copied and the complete web kit can be downloaded.
- [ ] ZIPs contain the correct scoped README, OFL, version, and only the promised
  files; the full ZIP also contains FAQ, FONTLOG, manifest, and checksums.
- [ ] Internal family/style/version/copyright/license metadata match the page and
  package. In particular, add copyright `name` ID 0.
- [ ] Direct responses have correct MIME, `Content-Disposition`, cache, and CORS
  behaviour.
- [ ] Downloads work by mouse and keyboard, on mobile and desktop, and do not
  cause global page overflow.
- [ ] Automated tests verify signatures, exact archive trees, deterministic
  hashes, copied CSS, links, response headers, and a clean install smoke test.

