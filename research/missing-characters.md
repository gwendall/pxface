# PXWORD — audit des caractères ASCII manquants

_Audit effectué le 19 août 2026 à partir du module désormais situé dans `packages/pxface/src/pixel-font.ts` et des données officielles Unicode 17.0._

> Statut d’implémentation : les 11 glyphes identifiés ci-dessous ont été
> ajoutés. PXWORD couvre désormais les 95 caractères ASCII imprimables.

## Périmètre

Le bloc Unicode **C0 Controls and Basic Latin** couvre U+0000–U+007F. Pour un outil ASCII, le répertoire imprimable pertinent est U+0020–U+007E inclus : **95 caractères**, dont 94 visibles et U+0020 SPACE. Unicode classe SPACE comme `Zs` (séparateur d'espace, donc caractère graphique) et U+007F DELETE comme `Cc` (contrôle), à exclure. Sources : [code chart officiel Basic Latin](https://www.unicode.org/charts/PDF/U0000.pdf), [UnicodeData.txt officiel](https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt), [définition Unicode de « Graphic Character »](https://www.unicode.org/glossary/#graphic_character) et [Names List Basic Latin](https://www.unicode.org/charts/nameslist/n_0000.html).

## Résultat exact

Il manque fonctionnellement **11 caractères imprimables ASCII** :

| Code point | Caractère | Nom Unicode |
|---|:---:|---|
| U+0022 | `"` | QUOTATION MARK |
| U+0023 | `#` | NUMBER SIGN |
| U+0024 | `$` | DOLLAR SIGN |
| U+0026 | `&` | AMPERSAND |
| U+002F | `/` | SOLIDUS |
| U+003B | `;` | SEMICOLON |
| U+003C | `<` | LESS-THAN SIGN |
| U+003E | `>` | GREATER-THAN SIGN |
| U+0040 | `@` | COMMERCIAL AT |
| U+005C | `\` | REVERSE SOLIDUS |
| U+0060 | `` ` `` | GRAVE ACCENT |

Liste compacte exacte :

```text
" # $ & / ; < > @ \ `
```

### Pourquoi SPACE et `a–z` ne sont pas dans cette liste

- `a–z` n'ont pas d'entrée propre dans `PIXEL_FONT`, mais `normalizeForFont()` convertit toute saisie en majuscules avant le rendu. Ils sont donc déjà acceptés, avec les formes de `A–Z`.
- SPACE n'a pas de dessin, ce qui est normal, mais le moteur lui attribue déjà une avance de 3 pixels via `characterWidth()`. Il fonctionne donc comme espace.

Une comparaison littérale des clés de `PIXEL_FONT` signalerait **38 entrées absentes** — les 11 ci-dessus, SPACE et les 26 minuscules — mais seules les 11 ci-dessus nécessitent réellement de nouveaux dessins pour compléter l'ASCII imprimable dans le comportement actuel.

## Priorité produit

Pour les wordmarks et identités, les plus utiles sont **`&`**, **`/`**, **`@`**, **`#`** et **`$`** : noms composés, lockups, handles, hashtags et prix/finance. Les six autres — **`"`**, **`;`**, **`<`**, **`>`**, **`\`** et **`` ` ``** — sont moins fréquents dans un logo, mais doivent être ajoutés pour pouvoir annoncer honnêtement une couverture complète de l'ASCII imprimable. Comme il ne reste que 11 glyphes, la recommandation est de les ajouter tous plutôt que d'entretenir deux niveaux de support.
