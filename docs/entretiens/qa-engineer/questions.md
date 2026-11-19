# Entretien QA Engineer : les questions

!!! warning "Avertissement"
    Ces notes sont des pense-bêtes personnels, pas une source de vérité. Elles reflètent ma compréhension et mes choix : leur contenu reste subjectif, malgré les citations et les références qu'il contient. Il peut être incomplet, simplifié, inexact ou dépassé. Vérifiez toujours dans la documentation officielle avant de l'appliquer. Ce contenu est fourni tel quel, sans aucune garantie : son utilisation se fait sous votre seule responsabilité.

!!! audience "Pour qui, pour quoi"
    - **Métiers** : QA Engineer, testeur ou testeuse, ingénieur en automatisation des tests (SDET), QA lead, développeur qui vise un poste orienté qualité.
    - **Usages** : j'ai un entretien QA dans une semaine et je veux revoir les questions thème par thème ; on me demande « comment testerais-tu ce champ ? » et je veux une démarche, pas une liste au hasard ; je veux savoir quelle page relire pour approfondir une réponse ; je prépare une histoire vécue par thème avant un entretien technique.

Cette page rassemble les questions posées en entretien pour un poste de QA Engineer, rangées par thème. Chaque question est citée comme le recruteur la pose, suivie d'une piste de réponse courte à la première personne, puis des sections à relire : la réponse complète, avec ses exemples, vit dans les pages Knowledge.

Comment je m'en sers :

1. Je lis la piste de réponse, sans chercher à la retenir mot pour mot.
2. J'ouvre les sections « À relire » pour comprendre le pourquoi et les limites de chaque notion.
3. Je prépare au moins une histoire vécue par thème : le contexte, ce que j'ai fait moi, le résultat avec un chiffre. Si je n'ai pas vécu le cas, je le présente comme hypothétique et je déroule mon raisonnement.
4. Je m'entraîne à voix haute sur les [exercices en direct](exercices.md) : beaucoup d'entretiens QA demandent de tester un formulaire, de réparer un test ou d'écrire un rapport de bug en direct.

En entretien QA, beaucoup de questions demandent en réalité « raconte-moi le bug le plus intéressant que tu as trouvé » ou « montre-moi comment tu testerais ce champ » : le recruteur attend une démarche visible, des cas de test précis et une histoire vraie.

## Stratégie de test et approche par les risques

### « Comment construis-tu la stratégie de test d'une nouvelle fonctionnalité ? »

- Je pars d'une liste de risques, pas d'une liste de cas : avec le PO et un développeur, je cherche ce qui coûterait cher si ça cassait (argent, données fausses, utilisateur bloqué, faille).
- Je note chaque risque en probabilité et en impact : c'est le <span class="term" data-term="risk-based-testing">test basé sur les risques</span> du syllabus ISTQB Foundation v4.0 (2023). Beaucoup d'effort sur les risques élevés, un test léger sur les faibles, et j'écris ce que je ne teste pas.
- Pour chaque risque, je choisis le niveau le plus bas qui le couvre, je réserve du temps d'exploratoire, et je vérifie avec les quadrants du test agile (Brian Marick, 2003) que je n'oublie pas une famille de tests.
- Je termine par des <span class="term" data-term="exit-criteria">critères de sortie</span> écrits et partagés, pour que la décision de livrer ne repose pas sur une impression.
- Exemple que je peux dérouler : les codes promo, où je teste en premier le code appliqué deux fois et deux commandes simultanées avec le même code, pas la couleur du bouton.

**À relire** : [Test basé sur les risques](../../knowledge/conception-tests.md#test-base-sur-les-risques), [Critères de sortie et décision go/no-go](../../knowledge/conception-tests.md#criteres-de-sortie-et-decision-gono-go), [Dessiner le parcours comme un graphe](../../knowledge/conception-tests.md#dessiner-le-parcours-comme-un-graphe), [Les quadrants du test agile](../../knowledge/qualite.md#les-quadrants-du-test-agile-ne-pas-oublier-un-type-de-test), [Les sept principes du test (ISTQB)](../../knowledge/qualite.md#les-sept-principes-du-test-istqb)

### « Le temps manque avant une mise en production : que testes-tu en priorité ? »

- Je reprends la liste des risques et je teste d'abord les chemins critiques : ceux qui rapportent de l'argent ou bloquent l'utilisateur s'ils cassent.
- J'ajoute les zones qui ont déjà eu des incidents : les défauts se regroupent (principe ISTQB du regroupement des défauts).
- Je lance un <span class="term" data-term="smoke-test">test de fumée</span> des parcours vitaux, puis je dis clairement ce qui n'a pas été testé et le risque résiduel.

**À relire** : [Test basé sur les risques](../../knowledge/conception-tests.md#test-base-sur-les-risques), [Les sept principes du test (ISTQB)](../../knowledge/qualite.md#les-sept-principes-du-test-istqb), [Concevoir les scénarios](../../knowledge/conception-tests.md#concevoir-les-scenarios)

### « À quel niveau places-tu un test : unitaire, API ou E2E ? Pyramide ou trophée ? »

- Pour chaque vérification, je me demande quel défaut elle doit attraper, puis je la place au niveau le plus bas qui voit ce défaut.
- Une règle de calcul va en <span class="term" data-term="unit-test">test unitaire</span> ; un contrat, une requête SQL ou une autorisation au niveau API ou intégration ; l'<span class="term" data-term="e2e-test">E2E</span> reste pour ce qui n'existe que tout assemblé, comme un parcours d'achat.
- La <span class="term" data-term="test-pyramid">pyramide</span> (Mike Cohn, 2009) ou le <span class="term" data-term="testing-trophy">trophée</span> (Kent C. Dodds, 2018) ne sont pas des quotas : la forme dépend du contexte, et ma règle est d'utiliser une vraie dépendance dès qu'elle peut prouver le comportement.
- Exemple : 40 E2E sur les frais de port deviennent 40 tests unitaires paramétrés, un test d'API et un seul E2E ; je retire les E2E seulement après avoir vu les nouveaux tests échouer sur un calcul cassé.

**À relire** : [Pyramide, trophée, nid d'abeille](../../knowledge/qualite.md#pyramide-trophee-nid-dabeille-la-forme-dune-suite), [Choisir le bon niveau de test](../../knowledge/qualite.md#choisir-le-bon-niveau-de-test), [La règle](../../knowledge/qualite.md#la-regle), [La question à se poser](../../knowledge/qualite.md#la-question-a-se-poser)

### « Shift-left et shift-right : qu'est-ce que ça change concrètement pour un QA ? Teste-t-on en production ? »

- Le <span class="term" data-term="shift-left">shift-left</span> change le moment où j'interviens : je pose mes questions de test pendant le cadrage, quand une ambiguïté coûte cinq minutes et pas une semaine de correction, et je relis les tests unitaires des développeurs.
- Le <span class="term" data-term="shift-right">shift-right</span> part du constat qu'aucun environnement de test ne ressemble à la production : je regarde les erreurs remontées par la supervision et je propose des <span class="term" data-term="synthetic-monitoring">tests synthétiques</span> sur les parcours critiques.
- Oui, on teste en production, avec des règles : comptes de test dédiés, analyse canary, changements risqués derrière un <span class="term" data-term="feature-flag">feature flag</span> ouvert d'abord à 5 % des clients.
- Entre les deux, le test pendant le sprint reste nécessaire : les deux approches l'entourent, elles ne le remplacent pas.

**À relire** : [Shift-left et shift-right](../../knowledge/qualite.md#shift-left-et-shift-right-quand-tester), [Tester en production](../../knowledge/livraison.md#tester-en-production), [Tests synthétiques](../../knowledge/qualite.md#tests-synthetiques), [Feature flags : Unleash](../../knowledge/outils.md#feature-flags-unleash)

## Techniques de conception de tests

### « Comment choisis-tu les valeurs à tester pour un champ de saisie ? »

- Je découpe les entrées en <span class="term" data-term="equivalence-partitioning">partitions d'équivalence</span>, valides et invalides, et je prends une valeur par partition.
- J'ajoute les <span class="term" data-term="boundary-value">valeurs limites</span> avec la méthode à trois valeurs (ISTQB Foundation v4.0, 2023) : pour « 18 à 65 ans inclus », je teste 17, 18, 19 et 64, 65, 66.
- J'ajoute les cas que les règles n'énoncent jamais : vide, espaces, zéro, décimal, texte très long, accents ; pour une date, le changement d'heure, le 29 février et le fuseau.
- Je vérifie la règle côté serveur, en envoyant la valeur directement à l'API, et je vérifie le message d'erreur, pas seulement le refus.
- Pour aller plus loin, le test par propriétés (QuickCheck, 2000 ; Hypothesis en Python) génère des centaines de valeurs par partition.

**À relire** : [Partitions d'équivalence et valeurs limites](../../knowledge/conception-tests.md#partitions-dequivalence-et-valeurs-limites), [Test par propriétés](../../knowledge/conception-tests.md#test-par-proprietes-property-based-testing)

### « Comment testes-tu une règle métier avec beaucoup de conditions, ou un objet qui change d'état ? »

- Quand plusieurs conditions se combinent, je fais une <span class="term" data-term="decision-table">table de décision</span> : une colonne par combinaison, l'action attendue en bas. Elle montre les combinaisons oubliées, que je fais trancher par le PO.
- Quand un objet a un cycle de vie (commande, abonnement), je dessine ses <span class="term" data-term="state-machine">états</span> et je teste chaque <span class="term" data-term="state-transition">transition</span> autorisée, puis les transitions interdites.
- Exemple : rembourser deux fois une commande doit renvoyer une erreur et laisser l'état intact en base, pas seulement renvoyer un code d'erreur.

**À relire** : [Table de décision](../../knowledge/conception-tests.md#table-de-decision), [Transitions d'état](../../knowledge/conception-tests.md#transitions-detat), [Quelle technique pour quelle règle](../../knowledge/conception-tests.md#quelle-technique-pour-quelle-regle)

### « Comment testes-tu beaucoup de combinaisons sans toutes les tester ? »

- Je compte d'abord : 4 navigateurs, 3 langues, 3 moyens de paiement et 2 types de compte font déjà 72 combinaisons.
- J'utilise le <span class="term" data-term="pairwise-testing">test par paires</span> : un outil comme PICT génère une douzaine de cas où chaque couple de valeurs apparaît au moins une fois.
- Je m'appuie sur Kuhn, Wallace et Gallo (IEEE TSE, 2004) : sur les systèmes étudiés, la plupart des défauts venaient d'un ou deux paramètres. [À prendre avec précaution : mesuré sur peu de systèmes, rien de garanti pour un produit donné.]
- J'ajoute à la main les combinaisons que je sais risquées, et je garde l'exhaustif pour les paramètres où une erreur coûterait très cher.

**À relire** : [Test par paires (pairwise)](../../knowledge/conception-tests.md#test-par-paires-pairwise), [Quelle technique pour quelle règle](../../knowledge/conception-tests.md#quelle-technique-pour-quelle-regle)

### « Pratiques-tu le TDD ? Comment modifies-tu un code legacy sans tests ? »

- Je pratique le TDD quand la règle est claire : un test rouge, le code minimal pour le passer au vert, puis le nettoyage (Kent Beck, « Test-Driven Development: By Example », 2002). Quand la règle est floue, je fais d'abord un essai jetable.
- Sur du code legacy, je cherche un point de test, je crée un seam minimal (passer l'horloge en paramètre par exemple), je fige le comportement actuel par des tests de caractérisation (Michael Feathers, 2004), puis je change.

**À relire** : [TDD en pratique](../../knowledge/conception-tests.md#tdd-en-pratique), [Tests de caractérisation et golden master](../../knowledge/conception-tests.md#tests-de-caracterisation-et-golden-master)

## Test exploratoire, bugs et triage

### « Qu'est-ce que le test exploratoire, et comment le rends-tu sérieux ? »

- C'est apprendre le produit, concevoir des tests et les exécuter en même temps, en laissant chaque observation orienter le test suivant. Ce n'est pas cliquer au hasard.
- Je donne à chaque session une <span class="term" data-term="test-charter">charte</span> d'une phrase et une durée fixe : c'est le Session-Based Test Management de Jonathan Bach (2000), avec le modèle « Explorer ... avec ... pour découvrir ... » d'Elisabeth Hendrickson (« Explore It! », 2013).
- Je note ce que j'ai couvert, les bugs, les questions ; un débrief de dix minutes décide de la suite, et les trouvailles utiles deviennent des tests automatisés.
- Les tests automatisés vérifient ce qu'on sait déjà, l'exploratoire trouve ce qu'on ne savait pas (testing vs checking, James Bach et Michael Bolton, 2013).

**À relire** : [Session et charte (SBTM)](../../knowledge/conception-tests.md#session-et-charte-sbtm), [SFDIPOT : trouver des idées de test](../../knowledge/conception-tests.md#sfdipot-trouver-des-idees-de-test), [Tester ou vérifier](../../knowledge/conception-tests.md#tester-ou-verifier-testing-vs-checking)

### « Comment écris-tu un bon rapport de bug ? »

- Un bon rapport se lit en trente secondes et se reproduit en cinq minutes : un titre qui dit quoi, où et dans quelle condition.
- Je cherche d'abord la <span class="term" data-term="minimal-reproduction">reproduction minimale</span>, et j'isole le côté client ou serveur en regardant la réponse de l'API.
- J'écris des <span class="term" data-term="reproduction-steps">étapes de reproduction</span> numérotées avec les données exactes, l'attendu et l'obtenu sans deviner la cause, l'environnement, et une preuve (trace, capture, <span class="term" data-term="correlation-id">identifiant de corrélation</span>) nettoyée de ses secrets.
- Je propose une sévérité et je décris l'impact utilisateur ; les champs suivent la norme ISO/IEC/IEEE 29119-3 (2013, qui remplace IEEE 829).

**À relire** : [Le rapport de bug](../../knowledge/conception-tests.md#le-rapport-de-bug), [Scénario enregistré (Playwright Codegen)](../../knowledge/conception-tests.md#scenario-enregistre-playwright-codegen), [Relier les signaux entre eux](../../knowledge/observabilite.md#relier-les-signaux-entre-eux)

### « Comment débogues-tu un bug que tu ne sais pas reproduire ? »

- Je rassemble les faits (logs, trace, heure, version, compte) et je cherche ce qui distingue les cas qui échouent de ceux qui passent.
- Je teste une hypothèse à la fois, je réduis l'entrée, et j'écris un test qui reproduit le bug avant toute correction.
- Si le bug est apparu entre deux versions, `git bisect` trouve le commit en quelques essais.

**À relire** : [Déboguer méthodiquement](../../knowledge/incidents.md#trouver-la-cause-deboguer-methodiquement), [Lire un échec : du rouge à la cause](../../knowledge/qualite.md#lire-un-echec-du-rouge-a-la-cause)

### « Quelle différence entre sévérité et priorité, et comment se passe un triage ? »

- La <span class="term" data-term="bug-severity">sévérité</span> est un constat d'impact que je propose ; la <span class="term" data-term="bug-priority">priorité</span> est une décision d'urgence que prend le PO, selon les utilisateurs touchés, un <span class="term" data-term="workaround">contournement</span>, une date ou une obligation légale.
- Les deux divergent : une faute dans le nom de la marque sur la page d'accueil est peu sévère mais prioritaire ; un plantage d'un écran d'archivage utilisé une fois par an est sévère mais peut attendre.
- Le <span class="term" data-term="bug-triage">triage</span> est court et régulier : chaque bug en sort corrigé maintenant, planifié ou fermé, avec la raison écrite dans le ticket.

**À relire** : [Sévérité et priorité](../../knowledge/conception-tests.md#severite-et-priorite), [Triage et politique zéro bug](../../knowledge/conception-tests.md#triage-et-politique-zero-bug)

## Automatisation et architecture des tests

### « Comment choisis-tu ce qu'il faut automatiser ? »

- J'automatise ce qui sera exécuté souvent, ce qui protège un risque élevé et ce qui est stable : test de fumée à chaque déploiement, <span class="term" data-term="regression">régressions</span> des règles métier, calculs fastidieux.
- Je garde au manuel ce qui demande du jugement (ergonomie, lisibilité), ce qui change chaque semaine, et ce qui n'arrivera qu'une fois.
- Je classe avec une grille simple (fréquence, risque, stabilité, coût) et je choisis toujours le niveau le plus bas : automatiser ne veut pas dire E2E. Brian Marick le résume dans « When Should a Test Be Automated? » (1998).
- Un test automatisé est du code qu'on maintient : s'il coûte plus qu'il ne rapporte, c'est une dette.

**À relire** : [Choisir le bon niveau de test](../../knowledge/qualite.md#choisir-le-bon-niveau-de-test), [Tester ou vérifier](../../knowledge/conception-tests.md#tester-ou-verifier-testing-vs-checking), [Les familles de suites de test](../../knowledge/qualite.md#les-familles-de-suites-de-test), [Choisir ce qu'on automatise](../../knowledge/qualite.md#choisir-ce-quon-automatise)

### « Comment structures-tu une suite E2E Playwright pour qu'elle reste maintenable ? »

- Je sépare l'intention du test de la mécanique : les scénarios lisent comme une phrase métier, les <span class="term" data-term="selector">sélecteurs</span> vivent dans des <span class="term" data-term="page-object">Page Objects</span> (Martin Fowler, 2013).
- Je cible les éléments par rôle et libellé (`getByRole`), plus stables que le CSS, avec l'<span class="term" data-term="auto-wait">attente automatique</span> au lieu des pauses fixes.
- Je prépare l'état par des <span class="term" data-term="test-fixture">fixtures</span> : un utilisateur créé par l'API, une session connectée une fois et réutilisée avec <span class="term" data-term="storage-state">storageState</span>.
- Chaque test crée ses données et ne dépend d'aucun autre, donc la suite tourne en parallèle ; je mesure la durée avant et après.

**À relire** : [Le vocabulaire des tests](../../knowledge/qualite.md#le-vocabulaire-des-tests), [Playwright, Cypress, Selenium](../../knowledge/outils.md#playwright-cypress-selenium), [Paralléliser sans casser](../../knowledge/qualite.md#paralleliser-sans-casser), [Le vocabulaire de l'authentification dans les tests](../../knowledge/qualite.md#le-vocabulaire-de-lauthentification-dans-les-tests), [Structurer une suite E2E maintenable](../../knowledge/qualite.md#structurer-une-suite-e2e-maintenable)

### « Appliques-tu SOLID et DRY à un framework de test ? DRY ou DAMP dans les tests ? »

- Côté mécanique, je suis strict sur <span class="term" data-term="dry">DRY</span> : un sélecteur vit dans un seul Page Object, la connexion et la création de données dans des fixtures.
- Responsabilité unique : un Page Object manipule sa page, il ne décide pas si le test est réussi. Les fixtures appliquent l'inversion des dépendances : le test demande un panier rempli, il ne sait pas comment on le crée.
- Côté scénario, je préfère <span class="term" data-term="damp">DAMP</span> : les données et l'attendu restent visibles dans le test, quitte à répéter (Jay Fields, 2014 ; « Software Engineering at Google », 2020).
- J'évite une `BasePage` de 800 lignes dont tout hérite : je compose des composants de page.

**À relire** : [DAMP plutôt que DRY dans les tests](../../knowledge/conception-tests.md#damp-plutot-que-dry-dans-les-tests), [SOLID](../../knowledge/principes-conception.md#solid), [DRY, WET et AHA](../../knowledge/principes-conception.md#dry-wet-et-aha), [Structurer une suite E2E maintenable](../../knowledge/qualite.md#structurer-une-suite-e2e-maintenable)

### « Mock, stub ou fake : quelle différence, et quand mocker ? École de Londres ou de Detroit ? »

- Un stub renvoie une réponse préparée, un mock vérifie qu'un appel a eu lieu, un fake est une implémentation simplifiée qui marche (une base en mémoire).
- Par défaut je garde les voisins vrais et je vérifie le résultat (école de Detroit) ; je remplace seulement ce qui est lent ou hors de mon contrôle : réseau, horloge, service tiers.
- Je mocke quand l'échange est le comportement (« un e-mail est envoyé »), et je sais qu'un mock écrit à la main ment le jour où le partenaire change : le test de contrat comble ce trou.

**À relire** : [Double de test](../../knowledge/qualite.md#double-de-test-mock-stub-fake), [Écoles de Londres et de Detroit](../../knowledge/qualite.md#ecoles-de-londres-et-de-detroit-isoler-ou-non-lunite), [Le problème des mocks écrits à la main](../../knowledge/qualite.md#le-probleme-des-mocks-ecrits-a-la-main)

### « Comment gères-tu les données de test ? Quel pattern pour des données lisibles ? »

- Chaque test crée ses propres <span class="term" data-term="test-data">données de test</span>, juste ce dont il a besoin, par l'API ou en base, jamais en cliquant dans l'interface, et les nettoie.
- Je les rends uniques avec un suffixe pour que les tests tournent en parallèle ; le jeu de référence partagé reste en lecture seule.
- J'utilise un Test Data Builder (Nat Pryce, 2007), comme `an_order().paid().build()` : des valeurs par défaut valides, le test ne précise que ce qui compte pour lui.
- Des données venues de la production passent toujours par une <span class="term" data-term="data-anonymization">anonymisation</span>.

**À relire** : [Données de test : Builder, Object Mother, isolation](../../knowledge/conception-tests.md#donnees-de-test-builder-object-mother-isolation), [Builder (monteur)](../../knowledge/design-patterns.md#builder-monteur)

### « Comment traites-tu un test instable (flaky) ? Comment accélères-tu une suite E2E trop lente ? »

- Un <span class="term" data-term="flaky-test">test instable</span> est plus dangereux qu'un test absent : l'équipe apprend à ignorer le rouge.
- Je mesure son taux d'échec, je le mets en <span class="term" data-term="test-quarantine">quarantaine</span> avec un ticket et un responsable (Martin Fowler, « Eradicating Non-Determinism in Tests », 2011), puis je cherche la cause dans la trace : attente fixe, données partagées, ordre des tests, service tiers lent, ou vrai bug de concurrence.
- Un `sleep` ou des relances automatiques cachent le problème, et parfois un vrai bug.
- Pour une suite lente, je découpe en <span class="term" data-term="test-shard">shards</span> par compte et par tag, je prépare l'état par l'API, et je descends les vérifications qui n'ont rien à faire en E2E.

**À relire** : [Stratégie face à un test instable](../../knowledge/qualite.md#strategie-face-a-un-test-instable), [Causes d'instabilité qui ne sont pas des bugs de test](../../knowledge/qualite.md#causes-dinstabilite-qui-ne-sont-pas-des-bugs-de-test), [Outils de diagnostic](../../knowledge/qualite.md#outils-de-diagnostic-ce-quils-montrent-vraiment), [Paralléliser sans casser](../../knowledge/qualite.md#paralleliser-sans-casser), [Mettre en quarantaine sans bloquer](../../knowledge/qualite.md#mettre-en-quarantaine-sans-bloquer)

## Tests d'API, de contrat et de performance

### « Comment testes-tu une API REST ? »

- Pour chaque endpoint : le cas nominal (statut, contenu, schéma), puis les erreurs client paramétrées, chacune avec un `4xx` précis et jamais un `500`.
- Je passe beaucoup de temps sur les autorisations : sans jeton, jeton expiré, et surtout la ressource d'un autre utilisateur, la faille <span class="term" data-term="bola">BOLA</span>, première de l'OWASP API Security Top 10 (édition 2023).
- Je vérifie les effets de bord en relisant la ressource ou la base, et je valide les réponses contre le fichier <span class="term" data-term="openapi">OpenAPI</span> s'il existe.
- Pour un `POST` rejoué (double clic, nouvelle tentative réseau), je vérifie qu'une <span class="term" data-term="idempotency-key">clé d'idempotence</span> évite le doublon.

**À relire** : [Tester une API REST](../../knowledge/api-rest-async.md#tester-une-api-rest), [Les codes de réponse](../../knowledge/api-rest-async.md#les-codes-de-reponse), [Les méthodes HTTP](../../knowledge/api-rest-async.md#les-methodes-http), [Les failles les plus courantes des API](../../knowledge/securite.md#les-failles-les-plus-courantes-des-api), [Simuler un tiers en erreur ou lent](../../knowledge/qualite.md#simuler-un-tiers-en-erreur-ou-lent)

### « Comment testes-tu un traitement asynchrone sans `sleep` fixe ? »

- J'attends une condition avec un délai maximal (le message est traité, la ligne existe) au lieu d'une pause fixe qui est soit trop courte en CI, soit trop longue partout.
- Je teste aussi le message reçu deux fois (le consommateur doit être idempotent) et le message en échec qui part dans la file des messages morts.

**À relire** : [Tester l'asynchrone](../../knowledge/api-rest-async.md#tester-lasynchrone), [Idempotence](../../knowledge/architecture.md#idempotence)

### « Qu'est-ce qu'un test de contrat, et quand l'utiliser plutôt qu'un E2E ? »

- Le <span class="term" data-term="contract-test">test de contrat</span> répond à une question : le consommateur et le fournisseur se comprennent-ils encore ?
- Avec un <span class="term" data-term="consumer-driven-contract">contrat piloté par le consommateur</span> (Ian Robinson, 2006), le consommateur décrit ce qu'il envoie et les champs dont il a besoin ; le contrat est rejoué dans la CI du fournisseur, dont la MR échoue s'il renomme un champ utilisé.
- C'est plus rapide et plus précis qu'un E2E qui demande tous les services déployés. Je l'utilise dès que deux équipes font évoluer deux services à des rythmes différents ; il ne vérifie pas la logique du fournisseur.

**À relire** : [Tests de contrat et mocks d'API](../../knowledge/qualite.md#tests-de-contrat-et-mocks-dapi), [Le test de contrat](../../knowledge/qualite.md#le-test-de-contrat), [Détecter que le partenaire a changé](../../knowledge/qualite.md#detecter-que-le-partenaire-a-change)

### « Comment conçois-tu un test de performance ? »

- Je pars d'une question chiffrée : « tenons-nous 500 commandes par minute au pic, avec 95 % des réponses en moins de 500 ms ? » (chiffres d'exemple). Sans objectif, un test de performance produit des graphiques, pas une décision.
- Je choisis le type (<span class="term" data-term="load-test">charge</span>, <span class="term" data-term="stress-test">stress</span>, <span class="term" data-term="soak-test">endurance</span>, pic), puis un scénario réaliste : vrai mélange de parcours, temps de réflexion, données variées pour ne pas tout servir depuis un cache.
- Je fixe des seuils sur le <span class="term" data-term="p95">p95</span> et le taux d'erreur, car la moyenne cache les utilisateurs lents.
- Pendant le test je regarde le serveur (CPU, base, files) et je vérifie que le <span class="term" data-term="load-generator">générateur de charge</span> ne sature pas, sinon je mesure la mauvaise chose.

**À relire** : [Test de performance](../../knowledge/qualite.md#test-de-performance), [k6, JMeter, Locust](../../knowledge/outils.md#k6-jmeter-locust), [Latence p95](../../knowledge/observabilite.md#latence-p95)

### « Comment vérifies-tu en base l'effet d'un test ? Deux clients réservent la dernière place en même temps : que se passe-t-il ? »

- Je relis la base avec un compte en lecture seule, ou j'enveloppe mon test dans `BEGIN ... ROLLBACK` sur une base de test.
- Je cherche les incohérences avec des requêtes types : doublons avec `GROUP BY ... HAVING COUNT(*) > 1`, orphelins avec `LEFT JOIN ... IS NULL`.
- Pour la concurrence, j'envoie deux requêtes en parallèle et je vérifie qu'une seule réussit : le motif lire, décider, écrire laisse passer une <span class="term" data-term="race-condition">course</span>, un `UPDATE ... WHERE seats_left > 0` atomique ou une contrainte d'unicité l'empêche.

**À relire** : [SQL pour la QA](../../knowledge/sql.md#sql-pour-la-qa), [Écritures concurrentes](../../knowledge/sql.md#ecritures-concurrentes), [Trouver ce qui manque](../../knowledge/sql.md#trouver-ce-qui-manque-left-join-is-null), [Les contraintes : la base garde les règles](../../knowledge/sql.md#les-contraintes-la-base-garde-les-regles)

### « Comment testes-tu un pipeline de données ? »

- Je place des tests de contenu à chaque étape (unicité, non nul, valeurs acceptées, fraîcheur), avec une gravité `error` qui bloque ou `warn` qui prévient, en dbt ou avec Great Expectations.
- Le but : que le tableau de bord garde le dernier chiffre juste plutôt qu'afficher un chiffre faux.

**À relire** : [Tester la qualité des données](../../knowledge/donnees-decision.md#tester-la-qualite-des-donnees)

## CI, environnements et observabilité

### « Comment intègres-tu tes tests dans la CI, et que doit bloquer un quality gate ? »

- Je place chaque suite là où son rapport entre valeur et durée est le meilleur : unitaires et API à chaque MR en quelques minutes, E2E critiques sur un environnement déployé, suite complète et performance la nuit ou avant une release (le deployment pipeline de Jez Humble et David Farley, « Continuous Delivery », 2010).
- Un <span class="term" data-term="quality-gate">quality gate</span> ne bloque que sur des contrôles fiables : un test instable dans un gate apprend à l'équipe à contourner le gate. Deux gates suffisent, et je n'en affaiblis jamais un pour faire passer une MR.
- Je publie un rapport lisible et les traces des échecs en <span class="term" data-term="ci-artifact">artefacts</span>, pour qu'un développeur comprenne l'échec sans relancer le test.

**À relire** : [Quality gates](../../knowledge/qualite.md#quality-gates), [Deux gates suffisent](../../knowledge/qualite.md#deux-gates-suffisent), [Ne jamais affaiblir un gate](../../knowledge/qualite.md#ne-jamais-affaiblir-un-gate), [Résultats de tests et visibilité](../../knowledge/qualite.md#resultats-de-tests-et-visibilite), [Tests fonctionnels automatisés](../../knowledge/livraison.md#tests-fonctionnels-automatises), [Dérogation datée et acceptation du risque](../../knowledge/qualite.md#derogation-datee-et-acceptation-du-risque)

### « Comment gères-tu les environnements de test ? »

- Je veux qu'un échec veuille dire « le code a un problème », pas « quelqu'un a cassé l'environnement » : je réduis la dépendance aux <span class="term" data-term="shared-environment">environnements partagés</span>.
- Les tests d'intégration utilisent une <span class="term" data-term="throwaway-database">base jetable</span> (Testcontainers), et chaque MR a si possible son <span class="term" data-term="ephemeral-environment">environnement éphémère</span>.
- Les services tiers (paiement, SMS) sont remplacés par une <span class="term" data-term="service-virtualization">virtualisation de service</span> qui sait répondre en erreur ou en retard (WireMock, Prism ou Microcks).
- Je garde une pré-production proche de la production pour la fin de chaîne et la performance, avec un responsable et des règles d'usage.

**À relire** : [Tests d'intégration avec Testcontainers](../../knowledge/qualite.md#tests-dintegration-avec-testcontainers), [Environnement de prévisualisation par merge request](../../knowledge/devx.md#environnement-de-previsualisation-par-merge-request), [Mock piloté par contrat](../../knowledge/qualite.md#mock-pilote-par-contrat), [Environnements](../../knowledge/kubernetes.md#environnements), [Quel environnement pour quel test](../../knowledge/devx.md#quel-environnement-pour-quel-test), [Simuler un tiers en erreur ou lent](../../knowledge/qualite.md#simuler-un-tiers-en-erreur-ou-lent)

### « Que peut apporter un QA à l'observabilité, et qu'est-ce que le monitoring synthétique ? »

- L'<span class="term" data-term="observability">observabilité</span> me sert d'abord à diagnostiquer : la métrique montre qu'il y a un problème, la trace où il est, le log pourquoi.
- Je teste aussi l'observabilité elle-même : quand je provoque une erreur de paiement, apparaît-elle dans les logs avec assez de contexte, et une alerte se déclenche-t-elle ?
- Le monitoring synthétique, c'est un de mes E2E qui tourne en production toutes les cinq ou dix minutes sur un parcours critique, avec un compte de test : la supervision boîte noire du livre « Site Reliability Engineering » (Google, 2016).
- Les données <span class="term" data-term="rum">RUM</span> me disent quels navigateurs et parcours les vrais utilisateurs empruntent, donc où concentrer mes tests.

**À relire** : [Les trois signaux](../../knowledge/observabilite.md#les-trois-signaux), [De l'alerte à la cause](../../knowledge/observabilite.md#de-lalerte-a-la-cause), [Tests synthétiques](../../knowledge/qualite.md#tests-synthetiques), [Tests synthétiques : Checkly](../../knowledge/outils.md#tests-synthetiques-checkly)

### « Comment testes-tu un déploiement canary, un blue-green, ou une fonctionnalité en A/B test ? »

- Canary : je compare les métriques de la nouvelle version à l'ancienne par paliers (taux d'erreur, latence), avec des critères d'arrêt écrits avant.
- Blue-green : je teste l'environnement green avant la bascule, puis je vérifie que le retour vers blue marche.
- A/B test : je force chaque variante en E2E, je vérifie que l'affectation reste stable pour un même client, que l'événement de mesure part dans les deux variantes, et je laisse la conclusion à la statistique.

**À relire** : [Tester un déploiement canary](../../knowledge/qualite.md#tester-un-deploiement-canary), [Tester un déploiement blue-green](../../knowledge/qualite.md#tester-un-deploiement-blue-green), [Tester une fonctionnalité en A/B test](../../knowledge/qualite.md#tester-une-fonctionnalite-en-ab-test), [Déploiement progressif](../../knowledge/livraison.md#deploiement-progressif)

## Accessibilité, sécurité et qualités non fonctionnelles

### « Comment intègres-tu l'accessibilité dans tes tests ? »

- Je traite l'accessibilité comme une exigence fonctionnelle : un utilisateur qui ne peut pas payer au clavier ne peut pas payer.
- J'automatise ce qu'un outil détecte, avec axe-core dans les tests Playwright : contrastes, images sans texte alternatif, champs sans libellé.
- Ces outils ne trouvent qu'une partie des problèmes, donc je teste à la main les parcours critiques : tout au clavier, focus visible, et un passage au <span class="term" data-term="screen-reader">lecteur d'écran</span>.
- Je vise le niveau AA des <span class="term" data-term="wcag">WCAG</span> 2.2 (W3C, octobre 2023), avec l'European Accessibility Act en toile de fond.

**À relire** : [Tests d'accessibilité](../../knowledge/conception-tests.md#tests-daccessibilite), [WCAG 2.2 et obligations légales](../../knowledge/conception-tests.md#wcag-22-et-obligations-legales), [Automatique et manuel](../../knowledge/conception-tests.md#automatique-et-manuel-axe-core-clavier-lecteur-decran)

### « Quels tests de sécurité un QA peut-il faire sans être expert ? Comment testes-tu la sécurité d'une API ? »

- Mon réflexe : « et si l'utilisateur n'avait pas le droit ? ». Je change l'identifiant dans l'URL pour celui d'un autre client, j'appelle une route d'administration avec un compte simple, je réutilise un jeton après la déconnexion.
- J'essaie des entrées malveillantes simples : une apostrophe pour l'<span class="term" data-term="sql-injection">injection SQL</span>, une balise `<script>` pour le <span class="term" data-term="xss">XSS</span>, et je vérifie qu'elles s'affichent comme du texte.
- Je vérifie que les erreurs ne révèlent rien d'interne et que les cookies de session ont les bons attributs ; j'ajoute un scan <span class="term" data-term="dast">DAST</span> sur l'environnement de test.
- Je rejoue dans Burp ou ZAP la requête d'un utilisateur avec l'identifiant d'un autre, et chaque constat devient un test de refus. Je m'appuie sur l'OWASP Web Security Testing Guide (version 4.2, 2020) et j'escalade aux experts ce qui me dépasse.

**À relire** : [Les failles les plus courantes des API](../../knowledge/securite.md#les-failles-les-plus-courantes-des-api), [XSS, CSRF, CORS](../../knowledge/securite.md#xss-csrf-cors-les-failles-cote-navigateur), [Les outils de test de sécurité](../../knowledge/securite.md#les-outils-de-test-de-securite), [La boîte à outils](../../knowledge/cybersecurite.md#la-boite-a-outils), [Sécurité : l'injection SQL](../../knowledge/sql.md#securite-linjection-sql), [Énumération des comptes](../../knowledge/securite.md#enumeration-des-comptes)

## Collaboration, BDD et décision de livraison

### « Comment travailles-tu avec le PO et les développeurs avant le code ? »

- Avant qu'une story soit codée, je propose une séance de <span class="term" data-term="three-amigos">three amigos</span> de vingt à trente minutes avec le PO et un développeur.
- J'apporte des exemples concrets plutôt que des questions abstraites, avec un <span class="term" data-term="example-mapping">Example Mapping</span> (Matt Wynne, 2015) : une carte par règle, des exemples sous chaque règle, une carte par question ouverte.
- On repart avec des <span class="term" data-term="acceptance-criteria">critères d'acceptation</span> testables ; trop de questions rouges veut dire que la story est trop grosse.

**À relire** : [Estimer et découper une fonctionnalité](../../knowledge/culture-entreprise.md#estimer-et-decouper-une-fonctionnalite), [Shift-left et shift-right](../../knowledge/qualite.md#shift-left-et-shift-right-quand-tester), [Gherkin avec un « Goal »](../../knowledge/conception-tests.md#gherkin-avec-un-goal)

### « BDD et Gherkin : quand est-ce utile, et quand est-ce un piège ? »

- Le <span class="term" data-term="bdd">BDD</span> est d'abord une façon de discuter : on se met d'accord sur des exemples avant de coder. <span class="term" data-term="gherkin">Gherkin</span> n'est qu'un format pour les écrire (Dan North, « Introducing BDD », 2006).
- C'est utile si le PO lit et valide vraiment les scénarios ; c'est un piège si personne ne les lit, car on paie la couche des <span class="term" data-term="step-definition">step definitions</span> pour rien.
- J'écris des scénarios déclaratifs (« le client applique un code expiré »), pas impératifs (« je clique sur le bouton bleu »), avec un seul comportement chacun.

**À relire** : [Gherkin avec un « Goal »](../../knowledge/conception-tests.md#gherkin-avec-un-goal), [Outils Gherkin par langage](../../knowledge/conception-tests.md#outils-gherkin-par-langage)

### « Comment prends-tu part à une décision go/no-go ? »

- Je ne dis pas « c'est testé » : je présente un état factuel par rapport à des critères de sortie écrits avant. Ce qui a tourné, les défauts ouverts avec leur sévérité, les risques non couverts et pourquoi.
- Je donne mon avis (go, no-go, go sous conditions) et la raison ; la décision appartient au PO, qui porte le risque métier.
- Avant un go, je vérifie deux choses : le <span class="term" data-term="rollback">retour arrière</span> est possible et testé, et la supervision verra vite un problème. Une migration qui supprime une colonne casse le retour arrière : je propose de la passer en deux temps.

**À relire** : [Critères de sortie et décision go/no-go](../../knowledge/conception-tests.md#criteres-de-sortie-et-decision-gono-go), [Migrer un schéma sans interruption](../../knowledge/sql.md#migrer-un-schema-sans-interruption), [Déploiement progressif](../../knowledge/livraison.md#deploiement-progressif)

### « Qu'est-ce qui fait une bonne revue de code, ou une bonne revue de tests ? »

- Je classe mes remarques par gravité (bloquant, suggestion) et je prouve chacune par `fichier:ligne` et un scénario qui casse.
- Sur une MR de tests, je cherche d'abord les secrets en dur et les assertions qui ne vérifient rien, puis je casse le code exprès pour voir si les tests échouent.
- Le ton reste celui d'un collègue : le risque, puis une correction concrète.

**À relire** : [Revue de code](../../knowledge/qualite.md#revue-de-code), [Prouver chaque remarque](../../knowledge/qualite.md#prouver-chaque-remarque), [Itérer jusqu'à zéro bloquant](../../knowledge/qualite.md#iterer-jusqua-zero-bloquant), [Préparer ma MR et recevoir une revue](../../knowledge/qualite.md#preparer-ma-mr-et-recevoir-une-revue)

### « Quels indicateurs suis-tu pour savoir si la qualité s'améliore ? La couverture de code est-elle un bon indicateur ? »

- Je pars d'une question avec GQM, puis je suis peu d'indicateurs : les <span class="term" data-term="escaped-defect">défauts échappés</span> et le Defect Detection Percentage, le taux de tests instables, la durée de la CI, le <span class="term" data-term="mttr">MTTR</span> (en médiane, car un seul long incident écrase la moyenne).
- Je regarde des tendances et je n'en fais jamais un objectif individuel : compter les bugs trouvés par la QA pousse à ouvrir dix tickets pour un problème, c'est la <span class="term" data-term="goodhart-law">loi de Goodhart</span>.
- La couverture dit quel code est exécuté, pas quel code est vérifié : 100 % de couverture peut laisser survivre un mutant. Je mets un gate sur le nouveau code seulement, et du <span class="term" data-term="mutation-testing">mutation testing</span> ciblé sur le code critique.

**À relire** : [Choisir ses indicateurs avec GQM](../../knowledge/qualite.md#choisir-ses-indicateurs-avec-gqm), [Defect Detection Percentage](../../knowledge/qualite.md#defect-detection-percentage), [Ce qu'elle dit et ce qu'elle ne dit pas](../../knowledge/qualite.md#ce-quelle-dit-et-ce-quelle-ne-dit-pas), [Mutation testing](../../knowledge/qualite.md#mutation-testing-tester-les-tests), [Loi de Goodhart](../../knowledge/lois-et-principes.md#loi-de-goodhart), [Mesures et leurs limites](../../knowledge/incidents.md#mesures-et-leurs-limites)

## Le rôle de QA dans une équipe agile et avec l'IA

### « Quel est le rôle d'un QA dans une équipe agile où les développeurs testent aussi ? »

- La qualité appartient à toute l'équipe (Whole Team Approach, Lisa Crispin et Janet Gregory, « Agile Testing », 2009) : si seul le QA s'en occupe, il devient un goulot et les développeurs livrent « pour le QA ».
- J'apporte une expertise : trouver les risques, concevoir de bons cas, explorer, construire l'outillage avec l'équipe.
- Je fais du <span class="term" data-term="quality-coaching">coaching qualité</span> : je relis les tests des développeurs, je propose des cas manquants, je fais entrer les exigences de test dans la <span class="term" data-term="definition-of-done">définition de terminé</span>.
- Je garde le regard que personne d'autre n'a le temps d'avoir : le produit entier, du point de vue de l'utilisateur.

**À relire** : [Les quadrants du test agile](../../knowledge/qualite.md#les-quadrants-du-test-agile-ne-pas-oublier-un-type-de-test), [Shift-left et shift-right](../../knowledge/qualite.md#shift-left-et-shift-right-quand-tester), [Test et qualité (textes fondateurs)](../../knowledge/textes-fondateurs.md#test-et-qualite), [Le rôle du QA dans une équipe agile](../../knowledge/qualite.md#le-role-du-qa-dans-une-equipe-agile)

### « Scrum ou Kanban : où se place le test dans ton équipe ? Que fais-tu si tout arrive en test le dernier jour du sprint ? »

- Je dis d'abord dans quel cadre j'ai travaillé et pourquoi il allait au travail de l'équipe : Scrum pour un produit qui avance par objectifs, Kanban pour un flux de demandes imprévues.
- En Scrum, le test se fait pendant le sprint : <span class="term" data-term="three-amigos">three amigos</span> au raffinement, tests écrits avec le code, exploration dès que la story marche, exigences de test dans la définition de terminé.
- En Kanban, la colonne test a sa limite de WIP : quand elle est pleine, les développeurs aident à la vider au lieu de commencer un nouveau ticket.
- Si tout arrive le vendredi, je montre le fait en rétrospective (temps d'attente en test, bugs trouvés le dernier jour) et je propose une seule expérience : limite de WIP en test, ou story découpée plus fin.

**À relire** : [Scrum, Kanban ou Scrumban](../../knowledge/agilite.md#scrum-kanban-ou-scrumban), [La qualité dans une équipe agile](../../knowledge/agilite.md#la-qualite-dans-une-equipe-agile), [Concevoir le tableau](../../knowledge/agilite.md#concevoir-le-tableau), [Une rétrospective qui change quelque chose](../../knowledge/agilite.md#une-retrospective-qui-change-quelque-chose)

### « Comment utilises-tu un assistant d'IA dans ton travail de QA, et avec quelles précautions ? »

- Je l'utilise comme un collègue rapide mais pas fiable : idées de cas que je trie, premier jet d'un test Playwright ou pytest, données variées, résumé d'un long log.
- Je garde l'<span class="term" data-term="test-oracle">oracle</span> : l'IA ne connaît pas la règle métier, elle peut écrire un test qui passe parce qu'il ne vérifie rien, ou inventer une méthode, une <span class="term" data-term="hallucination">hallucination</span>.
- Je donne à l'agent la commande de tests pour qu'il boucle jusqu'au vert, puis je relis comme une MR et je vérifie que le test échoue quand je casse le code (l'idée du mutation testing, DeMillo, Lipton et Sayward, 1978).
- Je n'envoie ni secret, ni donnée personnelle, ni code confidentiel à un outil non autorisé.

**À relire** : [Hallucination](../../knowledge/ia-agents.md#hallucination), [Fermer la boucle : donner un moyen de vérifier](../../knowledge/ia-agents.md#fermer-la-boucle-donner-un-moyen-de-verifier), [Assistants de code IA](../../knowledge/devx.md#assistants-de-code-ia), [Mutation testing](../../knowledge/qualite.md#mutation-testing-tester-les-tests)

### « Comment testes-tu un système à base de LLM, alors que ses réponses varient ? Que change l'EU AI Act pour une équipe QA ? »

- Je ne compare pas un texte exact : je vérifie des propriétés (format, champs présents, refus attendu), je mesure un taux de réussite sur plusieurs passages, et je garde un jeu d'évaluations rejoué à chaque changement de prompt ou de modèle.
- La température 0 ne rend pas le modèle déterministe : je mets le déterminisme dans le code qui entoure le modèle.
- Pour l'AI Act, je situe l'usage dans les quatre niveaux de risque et je distingue fournisseur et déployeur : un assistant de code n'est en général pas un système à haut risque.

**À relire** : [Tester un système à base d'agents](../../knowledge/ia-capacites.md#tester-un-systeme-a-base-dagents), [Ce que ça change pour une équipe de dev et de QA](../../knowledge/ia-entreprise.md#ce-que-ca-change-pour-une-equipe-de-dev-et-de-qa)

### « Comment restes-tu à jour sur les outils de test ? Quel livre t'a marqué ? »

- Je lis les notes de version de mes outils, une newsletter de test et une communauté comme Ministry of Testing, sur un créneau fixe et court ; j'essaie une chose par mois sur un vrai cas.
- Pour le livre, je choisis un texte vraiment lu et j'en cite une idée précise, par exemple les quadrants de « Agile Testing » (2009).

**À relire** : [Veille : QA](../../knowledge/veille.md#qa), [Pourquoi, quand et comment](../../knowledge/veille.md#pourquoi-quand-et-comment), [Test et qualité (textes fondateurs)](../../knowledge/textes-fondateurs.md#test-et-qualite)

## Choix d'outils

### « Playwright, Cypress ou Selenium : comment choisis-tu un outil E2E ? Comment testes-tu une fonctionnalité derrière un feature flag ? »

- Je pars des besoins : navigateurs à couvrir (Safari en particulier), langage de l'équipe, plusieurs onglets, iframes, interception réseau, appli native.
- Je regarde ce qui rend une suite stable : attente automatique, parallélisme intégré, traces. <span class="term" data-term="playwright">Playwright</span> coche beaucoup de cases pour un nouveau projet web ; Selenium reste pertinent pour le standard <span class="term" data-term="webdriver">WebDriver</span> ou une grille existante.
- Je fais un essai d'une semaine sur deux parcours réels et je compare des chiffres : durée, taux d'instabilité, temps pour écrire un test.
- Derrière un flag, je teste les deux positions tant que le flag existe.

**À relire** : [Playwright, Cypress, Selenium](../../knowledge/outils.md#playwright-cypress-selenium), [Feature flags : Unleash](../../knowledge/outils.md#feature-flags-unleash), [OpenFeature : changer d'outil de flags sans toucher au code](../../knowledge/outils.md#openfeature-changer-doutil-de-flags-sans-toucher-au-code)

### « k6, JMeter, Gatling ou Locust : comment choisis-tu un outil de test de performance ? »

- Je regarde qui écrit les scripts : k6 en JavaScript, Locust en Python, Gatling en Scala, Java ou Kotlin, JMeter surtout par interface graphique et XML.
- Je préfère un test écrit en code, relu en MR, qui tourne en CI avec des <span class="term" data-term="load-threshold">seuils</span> qui font échouer le job.
- Je vérifie les protocoles nécessaires et la capacité du générateur de charge.

**À relire** : [k6, JMeter, Locust](../../knowledge/outils.md#k6-jmeter-locust), [Test de performance](../../knowledge/qualite.md#test-de-performance)

### « Faut-il tester une API avec Postman ou avec du code comme pytest ? »

- Postman ou Bruno pour explorer une API à la main ; <span class="term" data-term="pytest">pytest</span> et un client HTTP pour une suite de régression, versionnée avec l'application, relue dans la même MR, factorisée par des fixtures.
- Le vrai critère est la maintenance : si les développeurs modifient les tests quand ils changent l'API, ces tests vivent dans leur langage et leur dépôt.

**À relire** : [Postman, Bruno](../../knowledge/outils.md#postman-bruno), [pytest](../../knowledge/outils.md#pytest)

## Critères éliminatoires : les erreurs à éviter

Ces questions servent surtout à éliminer. Une réponse qui va dans le mauvais sens suffit à faire échouer l'entretien, même si le reste est bon.

| Question du recruteur | Ce qui élimine | Ce que je réponds | À relire |
|---|---|---|---|
| « On te demande de valider une release que tu n'as pas eu le temps de tester : que fais-tu ? » | signer « validé » sur ce que je n'ai pas testé, ou bloquer par principe | j'utilise le temps sur les risques les plus élevés et un test de fumée, je dis ce qui n'est pas testé et le <span class="term" data-term="residual-risk">risque résiduel</span>, la décision écrite revient au PO, et je propose flag, livraison progressive et supervision renforcée | [Critères de sortie et décision go/no-go](../../knowledge/conception-tests.md#criteres-de-sortie-et-decision-gono-go) |
| « Un bug que tu n'as pas trouvé arrive en production : comment réagis-tu ? » | « ce n'est pas ma faute » ou « c'est ma faute » | j'aide d'abord à corriger (reproduire, périmètre, tester le correctif), puis je cherche pourquoi il a échappé dans un postmortem <span class="term" data-term="blameless">sans reproche</span>, j'ajoute un test au niveau le plus bas et je corrige la stratégie pour toute la famille de cas | [Le postmortem sans recherche de coupable](../../knowledge/incidents.md#le-postmortem-sans-recherche-de-coupable) |
| « Il faut automatiser 100 % des tests : es-tu d'accord ? » | « oui » sans nuance, ou un refus de l'automatisation | non : on automatise des <span class="term" data-term="test-check">checks</span>, l'exploratoire et le jugement restent humains ; mon objectif est une confiance suffisante au moindre coût, pas un pourcentage | [Tester ou vérifier](../../knowledge/conception-tests.md#tester-ou-verifier-testing-vs-checking) |
| « Tu trouves une faille sur un site par hasard : que fais-tu ? » | exploiter la faille « pour voir » ou la publier | je m'arrête, je ne copie rien, je cherche le contact sécurité (`security.txt`), je préviens et je laisse le temps de corriger | [Le cadre](../../knowledge/cybersecurite.md#le-cadre-autorisation-perimetre-et-divulgation) |

## Les 3 choses qu'un QA Engineer fait en permanence

1. **Chercher les risques avant les cas de test.** Je me demande ce qui coûterait cher si ça cassait, puis je dirige l'effort vers ces risques, au niveau le moins coûteux. Exemple : pour des codes promo, je teste en premier le double usage d'un code, pas la couleur du bouton.
2. **Rendre l'information utile et vérifiable.** Mes rapports de bugs se reproduisent du premier coup, mes avis de release séparent les faits des opinions, mes tests échouent pour une raison claire. Exemple : le rapport dit déjà que l'API renvoie le mauvais montant, avec l'identifiant de la requête.
3. **Faire progresser la qualité de toute l'équipe.** J'apporte des exemples au cadrage, je relis les tests des développeurs, je construis un outillage que tout le monde utilise. Exemple : une campagne manuelle de trois jours devient des tests automatisés au bon niveau, et je garde mon temps pour l'exploratoire.

## Structure simple pour répondre à l'oral

Pour presque toutes les questions, je suis ce fil, proche de la méthode STAR (situation, tâche, action, résultat) :

1. **Contexte** : quel produit, quels utilisateurs, quel enjeu ?
2. **Risques** : qu'est-ce qui coûterait cher si ça cassait ?
3. **Conception** : quelles techniques, quels cas, à quel niveau ?
4. **Exécution** : comment je teste, j'automatise ou j'explore ?
5. **Communication** : comment je rapporte les bugs et les risques restants ?
6. **Résultat** : qu'est-ce qui a été trouvé ou évité, avec un chiffre ?
7. **Amélioration** : qu'est-ce que l'équipe fait mieux maintenant ?

L'idée centrale : un QA Engineer ne se contente pas d'exécuter des tests. Il trouve où sont les risques, conçoit les tests qui les couvrent au bon niveau, rapporte des informations fiables, et aide toute l'équipe à construire la qualité dès le départ.

## Mesurer le succès

Je sais que ma préparation marche quand je réponds à voix haute avec une histoire vécue, pas quand j'ai relu la page. Avant de commencer, je note une base : je tire dix questions au hasard, je réponds à chacune en deux minutes en m'enregistrant, et je compte les réponses qui suivent le fil contexte, action, résultat avec un chiffre. Je refais la même mesure une semaine plus tard, sur dix autres questions. La métrique garde-fou est le naturel : si je reprends la page mot pour mot, la réponse sonne récitée, et je reformule avec mes propres exemples.

| Solution | Indicateur de succès (<span class="term" data-term="sli">SLI</span>) | <span class="term" data-term="slo">SLO</span> probable | <span class="term" data-term="sla">SLA</span> probable |
|---|---|---|---|
| répéter à voix haute dix questions tirées au hasard | part des réponses tenues en deux minutes avec contexte, action et résultat chiffré | 8 sur 10 [À prendre avec précaution : valeur d'exemple, à ajuster au temps de préparation disponible] | sans objet : pas de contrat externe |
| préparer une histoire vécue par thème | nombre de thèmes de cette page avec une histoire prête | les 11 thèmes [À prendre avec précaution : valeur d'exemple] | sans objet : pas de contrat externe |
| s'entraîner sur les exercices en direct | part des exercices finis dans le temps imparti en nommant la technique utilisée | 7 sur 10 [À prendre avec précaution : valeur d'exemple] | sans objet : pas de contrat externe |
| répondre aux critères éliminatoires | part des réponses sans « c'est validé » non vérifié ni recherche de coupable | 100 %, puisqu'une seule suffit à éliminer | sans objet : pas de contrat externe |
| relire les sections Knowledge liées | part des réponses où je cite une source avec son auteur et sa date | une réponse sur deux [À prendre avec précaution : valeur d'exemple] | sans objet : pas de contrat externe |

## Pièges à éviter

| Piège | Ce qui se passe | Solution |
| --- | --- | --- |
| **Réciter** : j'apprends les pistes de réponse par cœur. | Le recruteur pose une question de relance et je n'ai rien derrière. | Je comprends le pourquoi dans la section liée et je réponds avec mes mots ([Structure simple pour répondre à l'oral](#structure-simple-pour-repondre-a-loral)). |
| **Répondre sans histoire vécue** : je reste dans la théorie. | La réponse ressemble à celle de tous les autres candidats. | Je prépare une histoire vécue par thème, avec un chiffre, ou je dis clairement que le cas est hypothétique. |
| **Tester sans questionner** : je liste des cas avant de clarifier la règle. | Je teste la mauvaise règle, et je ne montre pas mon métier. | Je pose deux ou trois questions au début de chaque exercice ([Exercices en direct](exercices.md)). |
| **Partir de l'outil** : je réponds « Playwright » avant de connaître le besoin. | Je sonne comme quelqu'un qui suit la mode. | Je pars des risques et des contraintes, puis je cite l'outil et son coût ([Choix d'outils](#choix-doutils)). |
| **Signer sans avoir testé** : je dis « c'est validé » pour ne pas bloquer. | Le jour où un bug sort, ma parole ne vaut plus rien. | Je dis ce qui est testé, ce qui ne l'est pas et le risque résiduel ([Critères éliminatoires](#criteres-eliminatoires-les-erreurs-a-eviter)). |
| **Viser 100 % d'automatisation** : je promets de tout automatiser. | Je montre que je confonds tester et vérifier. | Je défends une confiance suffisante au moindre coût ([Comment choisis-tu ce qu'il faut automatiser ?](#comment-choisis-tu-ce-quil-faut-automatiser)). |
| **Chercher un coupable** : je raconte un bug échappé en accusant un développeur. | Le recruteur entend quelqu'un avec qui il sera difficile de travailler. | Je parle du système de qualité de l'équipe et de ce qu'on a changé ensuite. |
