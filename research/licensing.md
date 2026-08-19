# Licence de PXWORD — recommandation

> Note d’information, pas un avis juridique.

> Statut d’implémentation : Gwendall a confirmé la provenance et les droits le
> 19 août 2026. Le code est sous MIT, les matrices sous CC0-1.0 et la fonte
> installable sous OFL-1.1 avec « PXWORD » comme nom réservé. La palette interne
> a été renommée `random-palette.ts` et reste hors du périmètre CC0 des glyphes.

## Recommandation

Adopter une licence **MIT pour le code de l’application** et **CC0 1.0 Universal pour le jeu de glyphes 3×5**. Cette séparation correspond aux deux objets réellement distribués : un logiciel et une création graphique/donnée de caractères.

- **Code Next.js, moteur de mise en page et interface : MIT.** C’est une licence logicielle permissive : usage commercial, modification et redistribution sont autorisés, à condition de conserver l’avis de copyright et la licence ; elle exclut garantie et responsabilité. [GitHub — MIT License](https://choosealicense.com/licenses/mit/)
- **Matrices et dessins des glyphes 3×5 : CC0-1.0.** CC0 abandonne les droits d’auteur et droits voisins dans toute la mesure permise, pour tout usage y compris commercial ; si l’abandon n’est pas efficace dans une juridiction, une licence publique gratuite, irrévocable et sans condition prend le relais. [Creative Commons — CC0 Legal Code, §§2–3](https://creativecommons.org/publicdomain/zero/1.0/legalcode.en)
- **Nom et logo PXWORD : hors CC0.** CC0 ne touche pas aux marques ; la mention de licence doit donc dire explicitement que le nom, le logo et les autres marques restent réservés. [Creative Commons — CC0 FAQ, questions 2.10–2.11](https://wiki.creativecommons.org/wiki/CC0_FAQ#Can_I_control_how_my_work_is_being_used_once_I_publish_it_using_CC0.3F)

CC0 est adapté ici si l’objectif est réellement « utilisez ces glyphes comme vous voulez ». L’attribution de Gwendall **n’est pas légalement obligatoire** sous CC0. On peut demander un crédit par courtoisie, mais pas le présenter comme une condition. Si un crédit obligatoire est souhaité, choisir **CC BY 4.0** pour les glyphes au lieu de CC0. [Creative Commons — CC0 FAQ, question 2.5](https://wiki.creativecommons.org/wiki/CC0_FAQ#Does_CC0_require_others_who_use_my_work_to_give_me_attribution.3F)

## Pourquoi ne pas mettre tout sous CC0 ?

Creative Commons considère CC0 utilisable pour le logiciel, mais précise qu’il n’est pas approuvé par l’OSI et qu’il n’accorde aucun droit de brevet. CC recommande de considérer une licence logicielle OSI à la place. MIT est le choix simple et conventionnel pour PXWORD ; si un octroi explicite de brevets devient important, **Apache-2.0** est une meilleure alternative pour le code. [Creative Commons — CC0 FAQ, question 2.4](https://wiki.creativecommons.org/wiki/CC0_FAQ#May_I_apply_CC0_to_computer_software.3F_If_so.2C_is_there_a_recommended_implementation.3F)

CC0 n’est pas une promesse que toute renonciation fonctionne identiquement partout : certains droits, notamment certains droits moraux, ne sont pas toujours abandonnables. Son mécanisme de licence de repli cherche à reproduire l’effet voulu dans ces juridictions. CC0 ne cède pas les brevets ou marques, n’efface pas les droits de tiers, et fournit l’œuvre sans garantie. [Creative Commons — CC0 FAQ, questions 2.6 et 2.11–2.12](https://wiki.creativecommons.org/wiki/CC0_FAQ#Does_CC0_really_eliminate_all_copyright_and_related_rights.2C_everywhere.3F), [CC0 Legal Code, §4](https://creativecommons.org/publicdomain/zero/1.0/legalcode.en)

## Faut-il le préciser sur le site ?

**Oui, fortement recommandé.** Une dédicace CC0 doit être publiée en étant clairement associée à l’œuvre ; le sélecteur officiel fournit précisément le marquage HTML et les métadonnées. Creative Commons recommande de placer la mention à côté de l’œuvre ou au bas de la page. [Creative Commons — License Chooser](https://creativecommons.org/chooser/), [Marking your work](https://wiki.creativecommons.org/wiki/Marking_your_work_with_a_CC_license#Adding_a_CC0_public_domain_notice_to_your_work)

Texte court suggéré sur le site, lié vers une page `/license` :

> PXWORD glyph set: CC0 1.0 — no attribution required. App source: MIT. PXWORD name and logo excluded.

La page détaillée peut ajouter :

> You may use, modify and redistribute the 3×5 glyph set, including commercially, without permission or attribution. Attribution to Gwendall is appreciated but optional. The PXWORD name and logo are not included. You retain any rights you may have in the text and composition you create.

Éviter « tous les exports sont CC0 » : un export combine les glyphes avec le texte, la composition et éventuellement la marque de l’utilisateur. La mention doit couvrir **les formes de glyphes sous-jacentes**, sans prétendre placer les apports de l’utilisateur sous CC0.

## Mise en œuvre recommandée dans le dépôt

1. Séparer les matrices de glyphes dans un fichier dédié afin que la portée ne soit pas ambiguë.
2. Ajouter `LICENSE` avec le texte MIT pour le code.
3. Ajouter `LICENSES/CC0-1.0.txt` avec le texte juridique CC0 et un en-tête SPDX `SPDX-License-Identifier: CC0-1.0` dans le fichier de données des glyphes.
4. Ajouter dans le README un tableau de portée : code → `MIT`, glyphes → `CC0-1.0`, marque/logo → exclus.
5. Déclarer `"license": "MIT"` dans `package.json`, ce champ décrivant le package logiciel, pas les données CC0 qu’il embarque.

GitHub recommande un fichier de licence à la racine ; il avertit aussi que plusieurs licences peuvent compliquer la détection automatique, d’où l’importance du tableau de portée dans le README. Les identifiants normalisés sont `MIT`, `CC0-1.0` et, si nécessaire, `OFL-1.1`. [GitHub Docs — Licensing a repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository), [SPDX License List](https://spdx.org/licenses/)

Le dépôt étant actuellement privé, MIT peut déjà encadrer les copies de code effectivement distribuées, mais ne rend pas le source accessible à lui seul. Ne pas annoncer « open source » ou « source available » sur le site avant d’avoir rendu le dépôt — ou une distribution du code — accessible.

Pour l’export SVG, une balise `<metadata>` peut indiquer que les **glyphes** sont sous `CC0-1.0`, avec le lien canonique, sans licencier automatiquement la composition complète. C’est utile pour la traçabilité mais pas indispensable. Pour le PNG, une page de licence liée depuis l’interface est plus fiable que des métadonnées souvent supprimées.

## Quand préférer l’OFL ?

Si PXWORD publie plus tard une vraie fonte (`.ttf`, `.otf`, `.woff`) avec sources et scripts de build, **SIL Open Font License 1.1** est l’alternative spécialisée. Elle autorise usage, étude, modification, intégration et redistribution, mais impose notamment le maintien de la licence pour la fonte et ses dérivés, la conservation des notices et des règles éventuelles de nom réservé. Les documents, images et logos créés avec la fonte ne deviennent pas OFL. [SIL — Open Font License 1.1 et FAQ](https://software.sil.org/oflt/)

Pour le dataset actuel de pixels utilisé dans un générateur, CC0 reste plus simple et maximise la réutilisation. Choisir OFL seulement si l’objectif produit devient la distribution d’un **logiciel de fonte** et si le maintien sous licence ouverte des fontes dérivées est souhaité.

## Vérification indispensable avant publication

CC0 ne peut porter que sur des droits que Gwendall possède ou est autorisé à abandonner. Il est irrévocable et ne neutralise pas les droits de tiers. Creative Commons demande de vérifier les droits et d’identifier séparément tout matériau tiers. [Creative Commons — CC0 FAQ, questions 2.1–2.2](https://wiki.creativecommons.org/wiki/CC0_FAQ#Who_can_use_CC0.3F), [Creative Commons — Using CC0](https://creativecommons.org/public-domain/#using-cc0)

Avant de publier :

- confirmer que l’alphabet initial a été créé par Gwendall ou transféré avec les droits nécessaires ;
- documenter l’origine de chaque glyphe ajouté ; les caractères recréés depuis une capture de référence ne doivent être inclus en CC0 que si cette référence est la création de Gwendall, est déjà réutilisable, ou si les nouveaux dessins ont été refaits indépendamment ;
- exclure ou documenter séparément toute palette, image, icône, police d'interface ou dépendance tierce ; `src/lib/random-palette.ts` reste hors du périmètre CC0 des glyphes ;
- faire approuver explicitement la dédicace par tous les coauteurs éventuels.

Même si des glyphes 3×5 très simples peuvent ne pas atteindre le seuil de protection dans certains pays, il ne faut pas le supposer mondialement. CC0 sert justement à clarifier l’intention pour tous les droits qui pourraient exister.
