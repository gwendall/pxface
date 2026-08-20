# Iconic domain-name research for PXWORD

Date: 2026-08-19  
Scope: short, memorable names for the 3×5 pixel-font / wordmark studio. No domain was purchased.

## Recommendation

Use **PX ZIP** as the product and font-family brand, at **`px.zip`**.

It is the best combination of:

- an extremely short address (two-letter label);
- the existing `PX` visual language;
- a TLD that completes the product story: create, export, and download a compact font/assets package;
- a name that sounds active and fast: “pixel zip” / “PX Zip”;
- a wordmark that the 3×5 alphabet can render especially well.

Google Registry itself frames `.zip` around “tying things together” and speed, which happens to match the product unusually well ([official `.zip` positioning](https://www.registry.google/tlds/zip/)). It is an active generic TLD delegated to Google Registry ([IANA delegation record](https://www.iana.org/domains/root/db/zip.html)).

The tradeoff is also the hook: some people initially read `px.zip` as a downloadable archive rather than a website. That makes it memorable and on-theme, but links should always be written with the protocol in security-sensitive contexts (`https://px.zip`).

## Ranked shortlist

Availability was checked in two stages on 2026-08-19: DNS first, then Domani's registrar search. Prices are USD for one year and can change before registration.

| Rank | Domain / brand | Registry availability | Register | Renew | Why it works | Caveat |
|---:|---|---|---:|---:|---|---|
| 1 | **`px.zip` — PX ZIP** | Available | $20 | $20 | Two letters; `PX` remains the identity; `.zip` turns export/download into the name itself. Punchy font-family name. | File-extension ambiguity is deliberate but may look unusual in plain-text links. |
| 2 | **`px.tf` — PXTF / PX Typeface** | Available | $20 | $20 | The shortest typography-specific insider option: “TF” reads as typeface and the four-letter lockup is excellent. | `.tf` is formally a country-code TLD, not a font format; Terraform users may read it as a `.tf` file. |
| 3 | **`3x5.zip` — 3×5** | Available | $20 | $20 | The domain is the font's defining constraint plus its distribution format. Extremely honest and memorable. | Less extensible if the project later adds other grids. |
| 4 | **`px.page` — PX PAGE** | Available | $17 | $17 | Clean, editorial, credible and still only two letters before the dot. Good for a wordmark/typesetting canvas. | More generic and less distinctly pixel/font than `.zip` or `.tf`; `.page` requires HTTPS, which Vercel already provides ([Google Registry policy](https://www.registry.google/policies/registration/page/)). |
| 5 | **`3x5.space` — 3×5 SPACE** | Available | $32 | $32 | “Space” works as canvas space and typographic spacing; the domain describes both grid and medium. | Longer and pricier; the name is a studio more than a font family. |
| 6 | **`pxword.zip` — PXWORD ZIP** | Available | $20 | $20 | Safest migration: keeps all current name recognition while gaining an on-theme address. | Not the iconic two-letter reset requested. |
| 7 | **`wordmark.ink` — WORDMARK INK** | Available | $29 | $29 | Immediately explains the generator; `.ink` feels typographic and physical. | Descriptive rather than ownable; long for a flagship domain. |
| 8 | **`3x5.studio` — 3×5 STUDIO** | Available | $44 | $44 | Polished creative-tool positioning, exact grid retained. | Longer and the most expensive serious candidate. |
| 9 | **`px.pics` — PX PICS** | Available | $38 | $38 | Short, rhythmic and accurately describes PNG/image output. | Frames the product as an image tool, underselling the actual installable font. |
| 10 | **`px.foo` — PX FOO** | Available | $20 | $20 | Very short, playful and developer-native; good cult-tool energy. | Says nothing about type or pixels and can sound throwaway. |

Direct verification: [Domani registrar search for the PX shortlist](https://domani.run/api/domains/search?domains=px.zip%2Cpx.tf%2Cpx.page%2Cpx.foo%2Cpx.pics), [Domani search for 3×5 variants](https://domani.run/api/domains/search?domains=3x5.zip%2C3x5.space%2C3x5.studio%2Cpxword.zip%2Cwordmark.ink), and [Domani TLD price catalogue](https://domani.run/api/tlds?limit=500&sort=tld&order=asc).

## Exhaustive Domani pass

Domani exposed **1,014 supported TLD entries**. I paginated the entire catalogue and ran `dns-check` for `px` against every entry in batches of 50, the endpoint maximum:

- 1,014/1,014 TLD entries checked;
- 852 had no DNS registration for `px` and were therefore candidates;
- 162 had DNS and were immediately excluded;
- every serious candidate then went through the authoritative pricing/availability search, because a DNS miss does **not** prove that a registry will sell the name.

This second step mattered. For example, `px.ink`, `px.art`, `px.design`, `px.graphics`, `px.space`, `gr.id`, and `b.it` had no DNS in the initial pass but came back unavailable at registrar search. The final shortlist above contains only `available: true` registrar results.

The most relevant initial DNS checks are reproducible here: [PX across semantic TLDs](https://domani.run/api/domains/dns-check?name=px&tlds=ink%2Cart%2Czip%2Cdesign%2Cgraphics%2Cstudio%2Cspace%2Ctools%2Cdev%2Cio%2Capp%2Cxyz%2Cpage%2Cpics%2Cpress), [3×5 across semantic TLDs](https://domani.run/api/domains/dns-check?name=3x5&tlds=ink%2Cart%2Czip%2Cdesign%2Cstudio%2Cspace%2Ctools), and [typographic hacks](https://domani.run/api/domains/dns-check?name=px&tlds=md%2Ctf%2Cpm%2Cfyi%2Csh%2Cgg).

## Attractive ideas that are not available

| Idea | Result | Comment |
|---|---|---|
| `px.md` | Taken at DNS | The Markdown-style analogy requested would have been excellent. |
| `px.ink` | Unavailable at registrar | Best obvious typographic TLD, but not purchasable. |
| `px.art` | Unavailable at registrar | Strong but generic. |
| `px.design` | Unavailable at registrar | Strong but expensive even at base price. |
| `gly.ph` | Taken at DNS | Perfect domain hack for “glyph”. |
| `ty.pe` | Taken at DNS | Perfect domain hack for “type”. |
| `gr.id` | Unavailable at registrar | DNS produced a false positive; registry search rejected it. |
| `fnt.dev` | Unavailable at registrar | `FNT` is itself a historic font-file extension; Domani Suggest called it available, but the required final search contradicted that. |
| `pxl.run` | Unavailable at registrar | Same suggest/search discrepancy; excluded. |

## Naming and conflict notes

- **PX ZIP / PXTF:** targeted web searches did not surface an established typeface or font product using either exact name. This is a useful first-pass conflict signal, not trademark clearance.
- **3BY5:** avoid using this exact spelling as the font family. An existing 3by5 font is published on FontStruct ([existing 3by5 typeface](https://fontstruct.com/fontstructions/show/1029986/3by5_2)). `3×5` as a technical descriptor remains fine, but it is less ownable.
- **DOTGRID:** avoid it as the family name. A Dotgrid typeface has existed since 2012 ([existing Dotgrid font](https://www.dafont.com/dotgrid.font)).
- **3X5PX:** avoid as a family name even though `3x5px.dev` is available; an existing font uses that exact name ([existing 3x5px typeface](https://fontstruct.com/fontstructions/show/794099/3x5px_1)).

Before a public rename, run a formal trademark search in the intended markets. Domain availability alone is not trademark clearance.

## Domani hints and next step

The DNS responses returned the hint: **use registrar search to check pricing for the candidate domains**. That step is complete. Registrar search returned no additional `hint` or `next_steps` fields for the final shortlist.

Domani Suggest returned: **“Purchase with buy_domain. For more options, call suggest_domains again with exclude…”**. No purchase was made. The next operational step is therefore simple: after the user explicitly confirms one exact domain and its displayed price, register it through Domani, then connect it to the existing Vercel project and redirect `pxword.com` to the new canonical domain.

## Decision

Recommended order to secure:

1. **`px.zip`** as the canonical brand and production domain.
2. Optionally **`px.tf`** as a defensive/typographic redirect if both are worth maintaining.
3. Keep **`pxword.com`** as a permanent redirect so existing links and recognition are not lost.

