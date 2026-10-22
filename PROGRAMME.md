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
| 3 (terminée, 578 fiches) | Tour du monde — Afrique (Ouest, Sahel, Corne, Grands Lacs, australe, Maghreb, Égypte moderne) + « Pourquoi ce pays pèse » (Chine, Allemagne, Israël, Qatar…) | ~75 | ~590 |
| 4 (terminée, 647 fiches) | Tour du monde — Amériques (Mexique, Andes, Brésil, Caraïbes, Cône Sud, Canada, États-Unis modernes) + 10 pays « qui pèsent » | ~75 | ~665 |
| 5 (prochaine) | Tour du monde — Asie (Chine, Japon, Corée, Inde, Asie du Sud-Est, Asie centrale, Iran, Afghanistan) + 10 pays | ~75 | ~740 |
| 6 | Tour du monde — Europe (Balkans, Scandinavie, Pologne, Russie, Espagne, Italie, Irlande, Caucase) + 10 pays | ~75 | ~815 |
| 7 | Tour du monde — Moyen-Orient et Océanie + parcours « Tour du monde » par région | ~75 | ~890 |
| 8 | Technique : découper les fiches en fichiers par section chargés à la demande (l'appli reste rapide au-delà de 1 000) | — | — |
| 9-15 | Approfondir toutes les sections (économie, sciences, philo, droit, finances, climat, numérique, critique, religions, politique), ~80 par étape | ~560 | ~1 450 |
| 16-20 | Compléter jusqu'à 2 000 selon ce qui plaît le plus (statistiques de fréquentation) | ~550 | ~2 000 |

## Chantiers transversaux
- **Notifications v2 ✅ (22 oct. 2026)** : la fonction Supabase `aalam-push` (v2) lit la banque `notifs.json` publiée avec l'appli. **À chaque nouveau lot, régénérer `notifs.json`** (liste `[clé, section, accroche]` de toutes les fiches prêtes et des conflits). Titres variés par section, jamais deux fois la même fiche (colonne `sent`), thèmes préférés 2 jours sur 3 (colonne `likes`, envoyée par l'appli via `rpLikes()`).
- **Recommandations** : le Flash apprend déjà les goûts ; plus il y a de fiches par thème, mieux il colle.
- **Parcours** : 1 parcours par région du monde, et de nouveaux parcours à chaque étape.

## Journal
- 22 oct. 2026 : lot 1 (90 fiches, 14 parcours, 8 dessous) et lot 2 (73 fiches, 12 parcours, 5 dessous). Programme écrit.
- 22 oct. 2026 : étape 3, première partie — 23 fiches Afrique (groupe « Tour du monde : Afrique ») et 8 « Pourquoi ce pays pèse » (Chine, Allemagne, Israël, Qatar, Suisse, Nigeria, Égypte, Royaume-Uni), 4 parcours, 2 dessous. Total : 543 fiches. Reste pour l'étape 3 : Afrique de l'Est et australe moderne (Kenya, Rwanda d'avant 1994, Afrique du Sud après 1994, Madagascar, Côte d'Ivoire, Sénégal), et d'autres pays qui pèsent (Turquie, Iran, Brésil, Japon, Corée du Sud, Émirats).
- 22 oct. 2026 (soir) : étape 3 terminée — 20 fiches d'Afrique moderne (Kenya, Rwanda avant 1994 et de Kagame, Afrique du Sud après 1994, Madagascar, Côte d'Ivoire, Sénégal, Tanzanie, Ouganda, Zimbabwe, Angola et Mozambique, Somalie, Éthiopie, Érythrée, Françafrique, Botswana, Mali, Cameroun, Gabon, Tchad) et 15 « Pourquoi ce pays pèse » (États-Unis, Russie, France, Japon, Corée du Sud, Brésil, Iran, Indonésie, Afrique du Sud, Maroc, Éthiopie, Émirats, Norvège, Singapour, Pays-Bas ; la Turquie était déjà couverte). 5 parcours, 4 dessous. Total : 578 fiches, 56 parcours. Prochaine : étape 4, Amériques.
- 22 oct. 2026 (nuit) : notifications v2 en service (591 messages, titres variés, sans répétition, selon les goûts).
- 23 oct. 2026 (nuit) : étape 4 terminée — 59 fiches « Tour du monde : Amériques » (Olmèques, Teotihuacan, Mayas, Tenochtitlan, Cortés, Pizarro, choc microbien, Potosí, Treize Colonies, Nouvelle-France, Brésil colonial, Iroquois, Túpac Amaru II, indépendances du Mexique et du Brésil, San Martín, doctrine Monroe, guerre américano-mexicaine, Amérindiens, Triple Alliance, guerre du Pacifique, naissance du Canada, 1898, canal de Panama, révolution mexicaine, républiques bananières, Guatemala 1954, New Deal, Jim Crow, droits civiques, King et Malcolm X, Perón, Vargas, Cuba, Che, Révolution tranquille, Allende et Pinochet, disparus argentins, plan Condor, dictature brésilienne, Amérique centrale, Duvalier, Malouines, Sentier lumineux, décennie perdue, ALENA, Watergate, Reagan, Chávez, Lula, FARC, cartels mexicains, vague rose, Evo Morales, Haïti, Bukele, Milei, Obama et Trump, frontière) et 10 « Pourquoi ce pays pèse » (Mexique, Canada, Argentine, Chili, Colombie, Panama, Cuba, Guyana, Pérou, Venezuela). 6 parcours, 5 dessous. Actualité vérifiée au 22 oct. 2026 (Brésil : second tour Lula – Flávio Bolsonaro le 25 oct. ; Keiko Fujimori élue au Pérou ; De la Espriella en Colombie ; Kast au Chili ; élections annoncées en Haïti le 13 déc.). `notifs.json` régénéré (660 messages). Total : 647 fiches, 62 parcours. Prochaine : étape 5, Asie.
