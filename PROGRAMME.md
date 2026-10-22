# Programme Aalam — objectif 2 000 fiches

But : une appli addictive pour comprendre le monde, avec énormément de fiches, des recommandations qui collent aux goûts, et des notifications qui interpellent.

Point de départ (22 oct. 2026) : 512 fiches, 47 parcours.

## Règles de fabrication (chaque fiche)
- Accroche interpellante (`hook`), intro, exemple, « pourquoi c'est utile », chaîne « Pourquoi c'est comme ça » (4 étapes), quiz de 4 QCM, page « En savoir plus » (chiffres clés, 2-3 parties, débat, lectures).
- Histoire : toujours `y` et `d` pour apparaître sur la frise.
- Ton simple, pas d'emojis, faits vérifiés, positions politiques présentées de façon neutre.
- Vérification automatique avant chaque publication : syntaxe, doublons, liens « Voir aussi », étapes de parcours, test dans un navigateur.

## Étapes

| # | Contenu | Fiches | Total visé |
|---|---------|--------|-----------|
| 3 (en cours, 1ʳᵉ partie faite) | Tour du monde — Afrique (Ouest, Sahel, Corne, Grands Lacs, australe, Maghreb, Égypte moderne) + « Pourquoi ce pays pèse » (Chine, Allemagne, Israël, Qatar…) | ~75 | ~590 |
| 4 | Tour du monde — Amériques (Mexique, Andes, Brésil, Caraïbes, Cône Sud, Canada, États-Unis modernes) + 10 pays « qui pèsent » | ~75 | ~665 |
| 5 | Tour du monde — Asie (Chine, Japon, Corée, Inde, Asie du Sud-Est, Asie centrale, Iran, Afghanistan) + 10 pays | ~75 | ~740 |
| 6 | Tour du monde — Europe (Balkans, Scandinavie, Pologne, Russie, Espagne, Italie, Irlande, Caucase) + 10 pays | ~75 | ~815 |
| 7 | Tour du monde — Moyen-Orient et Océanie + parcours « Tour du monde » par région | ~75 | ~890 |
| 8 | Technique : découper les fiches en fichiers par section chargés à la demande (l'appli reste rapide au-delà de 1 000) | — | — |
| 9-15 | Approfondir toutes les sections (économie, sciences, philo, droit, finances, climat, numérique, critique, religions, politique), ~80 par étape | ~560 | ~1 450 |
| 16-20 | Compléter jusqu'à 2 000 selon ce qui plaît le plus (statistiques de fréquentation) | ~550 | ~2 000 |

## Chantiers transversaux
- **Notifications v2** : banque de messages tirée de toutes les fiches, titres variés et interpellants, jamais deux fois le même message, préférence pour les thèmes aimés (nécessite d'ajouter deux colonnes à la table `aalam_subs` sur Supabase et de redéployer `aalam-push`). En attente de l'accord de Naim.
- **Recommandations** : le Flash apprend déjà les goûts ; plus il y a de fiches par thème, mieux il colle.
- **Parcours** : 1 parcours par région du monde, et de nouveaux parcours à chaque étape.

## Journal
- 22 oct. 2026 : lot 1 (90 fiches, 14 parcours, 8 dessous) et lot 2 (73 fiches, 12 parcours, 5 dessous). Programme écrit.
- 22 oct. 2026 : étape 3, première partie — 23 fiches Afrique (groupe « Tour du monde : Afrique ») et 8 « Pourquoi ce pays pèse » (Chine, Allemagne, Israël, Qatar, Suisse, Nigeria, Égypte, Royaume-Uni), 4 parcours, 2 dessous. Total : 543 fiches. Reste pour l'étape 3 : Afrique de l'Est et australe moderne (Kenya, Rwanda d'avant 1994, Afrique du Sud après 1994, Madagascar, Côte d'Ivoire, Sénégal), et d'autres pays qui pèsent (Turquie, Iran, Brésil, Japon, Corée du Sud, Émirats).
