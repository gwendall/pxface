# Domain-name research: a more iconic PX/type brand

Research date: 2026-08-19  
Scope: naming only; no domain was purchased or configured.

## Executive recommendation

Use **PX.STYLE** as the product/master brand and `px.style` as the primary domain.

- It is available through Domani at **$43 USD for registration and $43/year to renew**.
- It reads naturally as **“P-X dot style”** and can also be understood as “pixel style.”
- `px` is the CSS unit; `style` connects type design, visual styling, and CSS. The two halves make one coherent idea instead of merely putting a product name in front of an arbitrary TLD.
- It is short enough to work as the wordmark itself: `PX.STYLE`.
- It is broad enough for the existing wordmark editor, downloadable font, rendering API, Figma workflow, and future font families.
- An exact-name Web search found no meaningful typography/product conflict for “PX Style.” This is a useful screen, not a formal trademark clearance.

Recommended naming architecture:

| Layer | Name |
|---|---|
| Master brand and website | **PX.STYLE** / `px.style` |
| Current tool | **PXWORD Studio** by PX.STYLE, or simply **Studio** in the navigation |
| Current font | **PXWORD 3×5** by PX.STYLE |
| Future fonts | **PX [family name]**, after a proper trademark/name-table collision check |

Keeping `PXWORD 3×5` as the font-family name initially avoids needlessly breaking installed fonts, CSS declarations, package URLs, and the Reserved Font Name. A later font rename should be treated as a versioned migration rather than a cosmetic site change.

If the goal is instead to give the **font family itself** a completely new name, my strongest alternative is **PXFACE**, hosted at `pxface.family`.

## How this was checked

1. Loaded all **1,014 TLD products** currently exposed by Domani.
2. Ran Domani `dns-check` for `px` across the entire catalog, not just `.com/.io/.dev`.
3. Intersected the results with the official [IANA root-zone list](https://data.iana.org/TLD/tlds-alpha-by-domain.txt), because the Domani catalog also exposes alternative-root names that do not resolve universally in normal browsers.
4. Used Domani `search`—not only DNS absence—to confirm actual registerability and pricing for the meaningful finalists.
5. Repeated the same check for invented type/foundry names across `.family`, `.style`, `.ink`, `.page`, `.design`, `.studio`, `.press`, and related TLDs.
6. Searched the Web for same-field products, existing font families, foundries, and obvious trademark conflicts.

Domani endpoints used: [TLD catalog](https://domani.run/api/tlds), [domain search](https://domani.run/api/domains/search), and `dns-check` as documented by [Domani](https://domani.run/llms.txt). Availability and pricing are snapshots and must be rechecked immediately before purchase.

## Ranked shortlist

### 1. PX.STYLE — `px.style`

**Say it aloud:** “P-X dot style”; informally, “pixel style.”  
**Domani:** available — **$43 registration / $43 renewal**.  
**Best role:** master brand, site, and foundry umbrella.

This is the most iconic domain hack in the set. `px` is already the native language of digital type and `.style` is recognizable to designers without boxing the product into only fonts. It looks excellent in uppercase and in the 3×5 alphabet.

The mild weakness is that “PX” is generic in typography. There are existing names such as [Px Grotesk](https://optimo.ch/typefaces/px_grotesk) and the LaTeX/Open Pixel Font ecosystem uses PX-prefixed names. That is why **PX.STYLE should be the distinctive masterbrand**, while the binary font initially remains **PXWORD 3×5**.

### 2. PXFACE — `pxface.family`

**Say it aloud:** “P-X face dot family”; or “pixel face.”  
**Domani:** available — **$43 / $43**.  
**Best role:** a font-family or small foundry brand.

`face` makes the typographic meaning immediate without using the overused word `font`. The complete address reads almost like metadata: a PX face, in a family. Exact-name searching did not surface a meaningful typography conflict.

Tradeoff: it is less magically compact than `px.style`, and “face dot family” is slightly redundant when spoken in full.

### 3. FIVE HIGH — `fivehigh.family`

**Say it aloud:** “five high dot family.”  
**Domani:** available — **$43 / $43**.  
**Best role:** the actual font name or an experimental foundry.

This encodes the defining five-pixel height while sounding like a proper display face. It has a memorable echo of “high five,” but is not as sterile as `3x5`. The Web search did not find an established same-name typeface.

Tradeoff: it says nothing about the three-pixel width, and some listeners may initially hear “high five.” That ambiguity is more charming than harmful.

### 4. PXFACE — `pxface.style`

**Say it aloud:** “P-X face dot style.”  
**Domani:** available — **$43 / $43**.  
**Best role:** alternate home for the PXFACE name.

Same brand strength as #2, with a broader product TLD. It loses the particularly strong type-industry phrase created by `.family`, so it ranks below that version.

### 5. PX.TF — `px.tf`

**Say it aloud:** “P-X dot T-F”; insiders can read TF as “typeface.”  
**Domani:** available — **$20 / $20**.  
**Best role:** short redirect, API/docs shortcut, or an intentionally cryptic typographer brand.

At five visible characters, it is wonderfully small. `.tf` is a real IANA country-code TLD for the French Southern Territories, so it resolves normally.

Tradeoff: almost nobody outside typography will decode “TF,” and the country-code meaning is unrelated. It feels clever after explanation rather than instantly clear.

### 6. GRID.FAMILY — `grid.family`

**Say it aloud:** “grid dot family.”  
**Domani:** available — **$43 / $43**.  
**Best role:** foundry/catalog brand.

The domain is crisp, serious, and naturally describes modular type. It can scale beyond one 3×5 font.

Tradeoff: **Grid is already a font name** and an extremely crowded typography term; for example, [GRID](https://www.dafont.com/grid.font) is an existing display typeface. The domain is excellent, but the brand is hard to own or search for.

### 7. FONTS.INK — `fonts.ink`

**Say it aloud:** “fonts dot ink.”  
**Domani:** available — **$29 / $29**.  
**Best role:** open-font catalog or foundry umbrella.

This is the best non-PX domain in the literal typographic group. It connects digital font files to the physical history of type and print.

Tradeoff: it does not capture the pixel/grid concept and is descriptive rather than ownable. It also invites uncertainty between “fonts ink” and “font’s ink.”

### 8. TYPEFACE.FAMILY — `typeface.family`

**Say it aloud:** “typeface dot family.”  
**Domani:** available — **$43 / $43**.  
**Best role:** an educational/open-type project.

Perfectly legible to designers and unusually self-explanatory.

Tradeoff: it is a tautology, long, generic, and does not feel like a distinctive product name.

### 9. PX.PAGE — `px.page`

**Say it aloud:** “P-X dot page.”  
**Domani:** available — **$17 / $17**.  
**Best role:** inexpensive fallback or editor/canvas URL.

Short and relevant to making a visual composition. `.page` is safe and ordinary in the good sense.

Tradeoff: it says “web/canvas” much more strongly than “font.” It would undersell the downloadable family and type-foundry ambition.

### 10. PX.ZIP — `px.zip`

**Say it aloud:** “P-X dot zip.”  
**Domani:** available — **$20 / $20**.  
**Best role:** playful download shortcut only.

The domain visually resembles the font package users download, which is memorable.

Tradeoff: it makes the whole site look like a file or download link. `.zip` domains also carry a phishing/security association because URLs can be mistaken for filenames. It should not be the primary identity.

## Tempting but not recommended

| Candidate | Finding | Why not |
|---|---|---|
| `px.pt` | Taken; active DNS points to a default server with a broken/self-signed HTTPS setup. Domani search returned unavailable. | This is the cleverest literal “PX point” (`pt` = point), but `.pt` primarily means Portugal and it is not available. Domani’s WHOIS endpoint returned its documented `INTERNAL_ERROR` hint to retry/contact support. No broker request was made. |
| `px.new` | Available, **$497 registration and $497/year renewal**. | Excellent command-like redirect (“make a new PX”), but poor value and not a font name. Consider only later as a marketing shortcut. |
| `3x5.family` / `3x5.style` | Available, $43/year. | A longstanding [3×5 font already exists](https://www.dafont.com/3x5.font), including current commercial licensing. The phrase is descriptive and crowded. |
| `gridbit.family` | Available, $43/year. | **IT Gridbit is an existing bitmap pixel font** on [MyFonts](https://www.myfonts.com/collections/it-gridbit-font-creatifont-studio/). Direct collision. |
| `pixbit.family` | Available, $43/year. | [Pixbit](https://www.1001fonts.com/pixbit-font.html) is already a pixel font. Direct collision. |
| `dotface.family` | Available, $43/year. | Dotface is an existing commercial font and trademarked name on [MyFonts](https://www.myfonts.com/pt/collections/dotface-font-chrismetcalfe). Direct collision. |
| `dotform.family` | Available, $43/year. | [DotForm](https://tim-carpenter.com/journal/dotform) is already a browser-based generative typography experiment—almost the same product category. |
| `bitform.family` | Available, $43/year. | Bitform is used by several active software/manufacturing businesses, including [Bitform](https://bitform.ai/about), and “Bit Form” is a WordPress product. |
| `pxmono.family` | Available, $43/year. | “PX Mono” is already used in the [Open Pixel Font Project](https://github.com/teryror/pixel-fonts) and FontStruct. |
| `raster.family` | Available, $43/year. | Semantically good but generic; Raster is already used by multiple fonts. |
| `gridlet.family` | Available, $43/year. | A new US trademark application exists for **GRIDLET** ([USPTO-derived filing](https://uspto.report/TM/99612690/APP20260124113742/)); unnecessary risk. |
| `bit.map`, `px.font`, `px.type`, `px.pixel`, `px.glyph` | Not registerable as normal domains. | `.map`, `.font`, `.type`, `.pixel`, and `.glyph` are not open universal IANA TLDs. A visually perfect hack that does not resolve in ordinary browsers is not a production name. |
| `px.unit` | Domani DNS suggested it, but `.unit` is absent from the IANA root zone and Domani search ultimately reported unavailable. | Alternative-root/non-universal TLD; misleading for a public product even though the semantic pun is excellent. |

## Final call

The best decision is not to invent a longer pseudo-foundry word. The available domain already contains the idea:

> **PX.STYLE**  
> Tiny type. Any style.

Use `px.style` for the product, preserve **PXWORD 3×5** as the first downloadable family for compatibility, and sign it **“PXWORD 3×5 — a PX.STYLE typeface.”**

If a single new name absolutely must cover both the product and the font binary, choose **PXFACE** and `pxface.family` instead.

