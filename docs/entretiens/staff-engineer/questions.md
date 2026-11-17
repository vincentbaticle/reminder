# Entretien Staff Engineer : les questions

!!! warning "Avertissement"
    Ces notes sont des pense-bêtes personnels, pas une source de vérité. Elles reflètent ma compréhension et mes choix : leur contenu reste subjectif, malgré les citations et les références qu'il contient. Il peut être incomplet, simplifié, inexact ou dépassé. Vérifiez toujours dans la documentation officielle avant de l'appliquer. Ce contenu est fourni tel quel, sans aucune garantie : son utilisation se fait sous votre seule responsabilité.

!!! audience "Pour qui, pour quoi"
    - **Métiers** : développeur senior qui vise un poste Staff, Staff ou Principal Engineer, tech lead, architecte logiciel, ingénieur qualité ou plateforme qui travaille avec plusieurs équipes.
    - **Usages** : je prépare un entretien Staff et je veux la liste des questions posées, thème par thème ; je relis la veille d'un entretien le plan de réponse d'une question comme « que fais-tu si une équipe ignore tes recommandations ? » ; je cherche quelle section de Knowledge relire pour une question technique précise, comme l'idempotence d'un paiement ; je vérifie que j'ai une histoire vécue pour chaque thème.

Cette page liste les questions posées en entretien Staff Engineer, regroupées par thème, telles que l'intervieweur les formule. Pour chacune, je donne un plan de réponse court à la première personne, puis les sections de Knowledge qui contiennent la réponse complète.

Comment je m'en sers :

1. Je lis le plan de réponse, sans chercher à le réciter.
2. J'ouvre la section liée dans **À relire** quand une notion me manque.
3. Je prépare une histoire vécue pour chaque thème : la situation, ce que j'ai fait moi, le résultat chiffré. Beaucoup de questions Staff sont en réalité « raconte-moi une fois où tu as... », et l'intervieweur attend « j'ai fait », pas « je ferais ».
4. Je m'entraîne ensuite sur les [exercices en direct](exercices.md), qui demandent du code, une conception ou une étude de cas devant l'intervieweur.

Le rôle recoupe celui d'architecte logiciel : décisions techniques, <span class="term" data-term="adr">ADR</span>, cohérence entre services, fiabilité. La page [Software Architect](../software-architect/questions.md) va plus loin sur les compromis de conception et les systèmes distribués.

## Architecture et décisions techniques

### « Comment choisir entre deux architectures techniquement viables ? »

*Aussi posée ainsi : « Comment documentes-tu une décision d'architecture ? », « Le métier veut un système "rapide et fiable", que fais-tu ? »*

Je clarifie d'abord le besoin et les contraintes réelles, puis je compare les options sur des critères partagés (sécurité, performance, coût, maintenabilité) plutôt que sur mes préférences. Je transforme les adjectifs flous en scénarios chiffrés, à la façon d'<span class="term" data-term="atam">ATAM</span> (Software Engineering Institute, 2000). Si une incertitude peut changer la décision, je la lève par une mesure ou un <span class="term" data-term="prototype">prototype</span>. Je décide vite ce qui est réversible et lentement ce qui ne l'est pas (décisions de type 1 et 2, lettre aux actionnaires d'Amazon de 2015). J'écris un ADR (Michael Nygard, 2011) avec les options écartées, les <span class="term" data-term="accepted-risk">risques acceptés</span> et la condition qui ferait revoir le choix. Exemple : pour un solde bancaire, un cache court pour l'affichage, mais une lecture de la <span class="term" data-term="source-of-truth">source de vérité</span> avant tout virement.

**À relire** : [Architecture : ADR](../../knowledge/architecture.md#adr), [Architecture : Scénarios de qualité, arbre d'utilité et ATAM](../../knowledge/architecture.md#scenarios-de-qualite-arbre-dutilite-et-atam), [Culture d'entreprise : Décisions de type 1 et de type 2](../../knowledge/culture-entreprise.md#decisions-de-type-1-et-de-type-2), [Architecture : Fitness functions](../../knowledge/architecture.md#fitness-functions), [Architecture : Où placer un cache](../../knowledge/architecture.md#ou-placer-un-cache)

### « Comment arbitrer entre une solution élégante et une livraison rapide ? »

Je demande ce que la date protège (un engagement client, une contrainte réglementaire, une préférence) et ce que coûterait le retard. Je sépare l'indispensable de l'<span class="term" data-term="structural-improvement">amélioration structurelle</span> qui peut attendre. Un raccourci est acceptable s'il est testé, limité et que son coût futur est écrit, jamais au prix de la sécurité ou de l'<span class="term" data-term="data-integrity">intégrité des données</span>. Exemple : un calcul de remboursement copié dans trois contrôleurs ; j'écris d'abord des <span class="term" data-term="characterization-test">tests de caractérisation</span> (Michael Feathers, « Working Effectively with Legacy Code », 2004) qui comparent les trois, et si les montants diffèrent déjà, c'est un bug en production à corriger avant la livraison. Le quadrant de la dette de Martin Fowler (2009) m'aide à dire si la dette est prudente et délibérée.

**À relire** : [Concevoir les tests : Tests de caractérisation et golden master](../../knowledge/conception-tests.md#tests-de-caracterisation-et-golden-master), [Principes de conception : Dette technique](../../knowledge/principes-conception.md#dette-technique), [Principes de conception : YAGNI et règle de trois](../../knowledge/principes-conception.md#yagni-et-regle-de-trois)

### « Quand faut-il créer une bibliothèque partagée entre plusieurs équipes ? »

Je ne mutualise pas du code parce qu'il se ressemble : je vérifie que les règles métier et leur rythme d'évolution sont vraiment communs. J'attends souvent le troisième cas, la <span class="term" data-term="rule-of-three">règle de trois</span> (Don Roberts, citée dans « Refactoring », 1999). Si je mutualise, je fixe une interface stable, un versionnement <span class="term" data-term="semantic-versioning">SemVer</span> (spécification 2.0.0, 2013), un propriétaire et un mode de contribution <span class="term" data-term="innersource">InnerSource</span>. Sinon, une duplication limitée coûte moins cher qu'une dépendance partagée que personne n'ose faire évoluer.

**À relire** : [Principes de conception : Principes des composants](../../knowledge/principes-conception.md#principes-des-composants), [Principes de conception : DRY, WET et AHA](../../knowledge/principes-conception.md#dry-wet-et-aha), [DevX : SemVer : le contrat d'une bibliothèque, d'une CLI ou d'un composant interne](../../knowledge/devx.md#semver-le-contrat-dune-bibliotheque-dune-cli-ou-dun-composant-interne), [Culture d'entreprise : InnerSource](../../knowledge/culture-entreprise.md#innersource)

### « Comment appliques-tu les principes de conception au niveau des composants et des services ? »

Les principes d'une classe valent pour un module ou un service, à une autre échelle : forte <span class="term" data-term="cohesion">cohésion</span>, faible <span class="term" data-term="coupling">couplage</span>, et un module ne connaît de l'autre que son contrat. Pour les bibliothèques, je m'appuie sur les principes des composants de Robert C. Martin (« Clean Architecture », 2017) : pas de cycle de dépendances, et les dépendances vont vers le plus stable. Entre services, l'inversion des dépendances prend la forme d'un contrat publié ou d'un événement. Le signal d'alerte que je surveille, c'est le <span class="term" data-term="distributed-monolith">monolithe distribué</span> : deux services qui s'appellent l'un l'autre et doivent livrer le même jour.

**À relire** : [Principes de conception : Principes des composants](../../knowledge/principes-conception.md#principes-des-composants), [Principes de conception : Séparation des préoccupations, cohésion et couplage](../../knowledge/principes-conception.md#separation-des-preoccupations-cohesion-et-couplage), [Architecture : Contexte borné et langage omniprésent](../../knowledge/architecture.md#contexte-borne-et-langage-omnipresent), [Qualité : Tests de contrat et mocks d'API](../../knowledge/qualite.md#tests-de-contrat-et-mocks-dapi)

### « Comment traiter une dette technique qui ralentit plusieurs équipes ? »

*Aussi posée ainsi : « Comment parles-tu de dette technique au Product Owner ? », « Comment convaincs-tu ta direction de financer une refonte ? »*

Je mesure l'impact avant de juger la conception : quelles évolutions la dette ralentit, quels incidents elle provoque, combien d'équipes elle touche. Je ne cite que la dette des zones souvent modifiées, et je priorise avec le <span class="term" data-term="cost-of-delay">coût du retard</span> (Don Reinertsen, 2009). Devant la direction, je donne la conclusion d'abord, le coût de « ne rien faire » et un remboursement par tranches, pas une refonte d'un bloc. Exemple : quatre équipes patchent à la main une vieille bibliothèque d'authentification ; un <span class="term" data-term="golden-path">golden path</span> et un robot de mise à jour des dépendances suppriment ce travail répété.

**À relire** : [Principes de conception : Dette technique](../../knowledge/principes-conception.md#dette-technique), [Culture d'entreprise : Coût du retard](../../knowledge/culture-entreprise.md#cout-du-retard), [Culture d'entreprise : Présenter un compromis technique en termes métier](../../knowledge/culture-entreprise.md#presenter-un-compromis-technique-en-termes-metier), [Gestionnaires de paquets : Mettre à jour les dépendances](../../knowledge/gestionnaires-paquets.md#mettre-a-jour-les-dependances)

### « Comment faire évoluer une architecture sans bloquer le développement ? »

*Aussi posée ainsi : « Réécriture complète ou refonte progressive ? »*

Je clarifie pourquoi l'architecture doit changer, l'état cible et qui dépend de l'existant. J'avance par étapes compatibles avec les livraisons en cours : une façade, puis un déplacement progressif des fonctionnalités avec le <span class="term" data-term="strangler-fig">figuier étrangleur</span> (Martin Fowler, 2004) ou le <span class="term" data-term="branch-by-abstraction">branch by abstraction</span> (Paul Hammant, 2007). Chaque étape est testable, observable et réversible. Je retire l'ancien système seulement quand ses derniers usages sont mesurés et migrés.

**À relire** : [Architecture : Réécrire ou refondre progressivement](../../knowledge/architecture.md#reecrire-ou-refondre-progressivement), [Architecture : Figuier étrangleur](../../knowledge/architecture.md#figuier-etrangleur), [Livraison : Trunk-based development](../../knowledge/livraison.md#trunk-based-development)

### « Monolithe ou microservices pour un nouveau produit ? »

*Aussi posée ainsi : « Qu'est-ce qu'un monolithe distribué ? »*

Je pars du nombre d'équipes et de la stabilité des frontières métier, pas de la mode. Par défaut, je commence par un <span class="term" data-term="modular-monolith">monolithe modulaire</span> dont la CI vérifie les frontières. J'extrais un service quand un déploiement, une mise à l'échelle ou une propriété des données indépendants apportent un gain mesurable, et qu'une équipe peut l'opérer. L'exercice 11 de la page [exercices](exercices.md) déroule ce cas.

**À relire** : [Architecture : Quel style choisir](../../knowledge/architecture.md#quel-style-choisir), [Architecture : Monolithe modulaire](../../knowledge/architecture.md#monolithe-modulaire), [Architecture : Loi de Conway](../../knowledge/architecture.md#loi-de-conway)

## Influence transverse et leadership technique

### « Comment faire adopter un standard qu'une équipe ne veut pas utiliser ? »

Je cherche d'abord pourquoi l'équipe résiste : coût de migration, manque de temps, mauvaise expérience ou vrai désaccord. Je pars d'un problème concret que le standard règle, je propose un essai limité avec une équipe volontaire, puis je publie les résultats, faux positifs compris. Exemple : une équipe refuse un <span class="term" data-term="quality-gate">quality gate</span> par peur de bloquer ses livraisons ; je l'active d'abord en mode informatif et seulement sur le nouveau code. La diffusion de l'innovation d'Everett Rogers (1962) me rappelle de convaincre d'abord les volontaires.

**À relire** : [DevX : Faire adopter un outil sans l'imposer](../../knowledge/devx.md#faire-adopter-un-outil-sans-limposer), [Qualité : Deux gates suffisent](../../knowledge/qualite.md#deux-gates-suffisent), [DevX : Golden paths et templates](../../knowledge/devx.md#golden-paths-et-templates), [Culture d'entreprise : Influence sans autorité et communautés de pratique](../../knowledge/culture-entreprise.md#influence-sans-autorite-et-communautes-de-pratique)

### « Que faire si deux équipes défendent des solutions incompatibles ? »

*Aussi posée ainsi : « Comment prends-tu une décision technique importante en équipe ? »*

Je fais expliciter les besoins de chacune, puis je compare sur des critères communs pondérés. Je vérifie si le désaccord est réel ou s'il vient d'hypothèses différentes. Si les contraintes sont vraiment distinctes, je n'impose pas une uniformité artificielle : je cherche la cohérence là où elle sert tout le monde. Exemple : une équipe veut REST, l'autre GraphQL pour agréger plusieurs sources ; selon les consommateurs, un <span class="term" data-term="bff">BFF</span> peut satisfaire les deux. La décision passe par un <span class="term" data-term="advice-process">advice process</span> (Andrew Harmel-Law, 2021) et finit dans un ADR.

**À relire** : [Culture d'entreprise : Advice process](../../knowledge/culture-entreprise.md#advice-process), [Culture d'entreprise : RFC et documents de conception](../../knowledge/culture-entreprise.md#rfc-et-documents-de-conception), [API : REST ou GraphQL ?](../../knowledge/api-rest-async.md#rest-ou-graphql)

### « Que faire si une équipe ignore tes recommandations ? »

Je vérifie d'abord que ma recommandation répond bien au problème, puis je cherche les raisons du refus et j'explique les conséquences concrètes. Si le risque reste dans le périmètre de l'équipe, j'accepte un choix différent. S'il touche la sécurité, la conformité ou d'autres équipes, je clarifie qui peut accepter ce risque, et je le fais écrire avec une date de revue. Exemple : un secret d'API dans un dépôt « privé » n'est pas un choix local ; je fais révoquer le secret et j'escalade si besoin.

**À relire** : [Sécurité : Les secrets](../../knowledge/securite.md#les-secrets), [Culture d'entreprise : Registre des risques](../../knowledge/culture-entreprise.md#registre-des-risques), [Culture d'entreprise : Désaccord et engagement](../../knowledge/culture-entreprise.md#desaccord-et-engagement), [Architecture : Dérogations et architecture cible](../../knowledge/architecture.md#derogations-et-architecture-cible)

### « Comment éviter de devenir un passage obligatoire pour toutes les décisions techniques ? »

Je regarde quelles décisions remontent jusqu'à moi et pourquoi : règle absente, peur de se tromper ou vrai sujet transverse. J'écris un cadre : décisions locales, décisions avec consultation, décisions transverses arbitrées. L'advice process permet à chacun de décider après avoir consulté les personnes concernées. Si on me sollicite toujours pour le même cas, c'est un défaut de cadre ou de transmission, que je corrige comme une <span class="term" data-term="enabling-team">enabling team</span> (« Team Topologies », 2019).

**À relire** : [Culture d'entreprise : Advice process](../../knowledge/culture-entreprise.md#advice-process), [Culture d'entreprise : Team Topologies](../../knowledge/culture-entreprise.md#team-topologies), [Architecture : Tech radar d'entreprise](../../knowledge/architecture.md#tech-radar-dentreprise)

## Collaboration transverse

### « Comment coordonner plusieurs équipes qui dépendent les unes des autres ? »

*Aussi posée ainsi : « Qu'est-ce que la loi de Conway, et qu'en fais-tu ? »*

Je cartographie les dépendances et je repère celles qui bloquent vraiment. Je stabilise les interfaces pour que les équipes avancent en parallèle, avec des tests de contrat pilotés par le consommateur (Ian Robinson, 2006). Je rends visibles les propriétaires et les risques, et je réduis les synchronisations obligatoires. La <span class="term" data-term="conway-law">loi de Conway</span> (1968) me rappelle que l'architecture suit l'organisation : parfois, c'est le découpage des équipes qu'il faut revoir.

**À relire** : [Qualité : Tests de contrat et mocks d'API](../../knowledge/qualite.md#tests-de-contrat-et-mocks-dapi), [Lois et principes : Loi de Conway](../../knowledge/lois-et-principes.md#loi-de-conway), [Culture d'entreprise : Team Topologies](../../knowledge/culture-entreprise.md#team-topologies)

### « Comment gérer un désaccord sur les responsabilités entre équipes ? »

Je pars du résultat attendu pour l'utilisateur et je retrace le parcours entre les composants pour trouver l'étape sans propriétaire, ou avec deux. Je distingue responsabilité métier, technique et opérationnelle. Je fais trancher par la personne habilitée et j'écris le résultat dans un endroit que tout le monde consulte, comme un catalogue de services. Pendant un incident, je fais d'abord rétablir le service ensemble, et je traite la question des responsabilités juste après, dans un <span class="term" data-term="postmortem">postmortem</span> sans recherche de coupable.

**À relire** : [DevX : Portail développeur et catalogue](../../knowledge/devx.md#portail-developpeur-et-catalogue), [Culture d'entreprise : RACI](../../knowledge/culture-entreprise.md#raci), [Incidents : Le postmortem sans recherche de coupable](../../knowledge/incidents.md#le-postmortem-sans-recherche-de-coupable)

### « Comment prioriser lorsque plusieurs équipes demandent de l'aide en même temps ? »

Je compare impact, urgence, risque et nombre d'équipes touchées. Un incident de production ou une faille exploitable passe avant une amélioration de confort. Je tiens compte de l'effet de levier : corriger un problème partagé débloque plusieurs équipes. Pour trancher, je divise le coût du retard par la durée, et je limite mon travail en cours. Je communique mes arbitrages et je les revois si la situation change.

**À relire** : [Culture d'entreprise : Coût du retard](../../knowledge/culture-entreprise.md#cout-du-retard), [Culture d'entreprise : Loi de Little et limites de WIP](../../knowledge/culture-entreprise.md#loi-de-little-et-limites-de-wip), [Incidents : Niveaux de sévérité](../../knowledge/incidents.md#niveaux-de-severite)

### « Comment faire collaborer des équipes qui n'ont pas les mêmes objectifs ? »

*Aussi posée ainsi : « Notre équipe livre lentement, comment trouves-tu pourquoi ? »*

Je ramène la discussion à l'objectif commun, le parcours complet de l'utilisateur, plutôt qu'aux indicateurs locaux. Je rends visibles les compromis, souvent avec une <span class="term" data-term="value-stream-mapping">cartographie du flux de valeur</span> (Rother et Shook, « Learning to See », 1998) qui montre où le travail attend. Exemple : le backend limite les appels, le front multiplie les petits appels, et l'écran est lent ; un point d'agrégation ou un BFF règle le vrai problème. Je vérifie ensuite que le parcours complet s'améliore.

**À relire** : [Culture d'entreprise : Cartographie du flux de valeur](../../knowledge/culture-entreprise.md#cartographie-du-flux-de-valeur), [Culture d'entreprise : Théorie des contraintes](../../knowledge/culture-entreprise.md#theorie-des-contraintes), [Culture d'entreprise : OKR](../../knowledge/culture-entreprise.md#okr)

## Qualité logicielle et excellence technique

### « Comment définir une stratégie de tests pour un projet complexe ? »

*Aussi posée ainsi : « Pyramide ou trophée des tests ? », « Le temps manque avant une mise en production, que testes-tu en priorité ? »*

Je liste avec le produit les scénarios dont la panne coûterait le plus cher et je les classe par impact et probabilité : c'est le <span class="term" data-term="risk-based-testing">test basé sur les risques</span> (syllabus ISTQB Foundation, version 4.0 de 2023). Cette liste guide la stratégie, pas un pourcentage de couverture. Pour chaque scénario, je choisis le niveau de test le plus bas qui le protège : les règles de calcul en unitaire, la base et les services externes en intégration, quelques parcours en bout en bout. Je surveille la durée et la stabilité de la suite, car une suite lente ou instable finit contournée.

**À relire** : [Concevoir les tests : Test basé sur les risques](../../knowledge/conception-tests.md#test-base-sur-les-risques), [Qualité : Choisir le bon niveau de test](../../knowledge/qualite.md#choisir-le-bon-niveau-de-test), [Qualité : Pyramide, trophée, nid d'abeille : la forme d'une suite](../../knowledge/qualite.md#pyramide-trophee-nid-dabeille-la-forme-dune-suite)

### « Comment améliorer la qualité sans ralentir les livraisons ? »

*Aussi posée ainsi : « Notre CI met 30 minutes, par quoi commences-tu ? »*

Je pars des défauts réels, trouvés en recette et en production, pour savoir où la qualité se perd. Je déplace les contrôles au plus près du moment où l'erreur est introduite, et je rends bloquants seulement ceux qui protègent d'un risque important. Je mesure à la fois les défauts détectés, les <span class="term" data-term="escaped-defect">défauts échappés</span> et le temps de retour du pipeline (p50, p95, attente de runner). Les premiers gains viennent souvent de réglages qui ne retirent aucun contrôle : `needs`, cache sur le lockfile, annulation des pipelines dépassés.

**À relire** : [DevX : Une CI rapide et fiable](../../knowledge/devx.md#une-ci-rapide-et-fiable), [Qualité : CI et livraison](../../knowledge/qualite.md#ci-et-livraison), [Qualité : Shift-left et shift-right : quand tester](../../knowledge/qualite.md#shift-left-et-shift-right-quand-tester)

### « Quels contrôles automatiser dans la CI/CD ? »

Je classe les contrôles par vitesse, fiabilité et risque couvert. Les rapides et fiables (lint, tests unitaires) donnent un retour tôt ; ceux qui protègent la sécurité, les règles métier critiques et l'intégrité des données bloquent une livraison dangereuse. J'ajoute l'analyse statique de sécurité (<span class="term" data-term="sast">SAST</span>), l'analyse des dépendances (<span class="term" data-term="sca">SCA</span>) et un <span class="term" data-term="sbom">SBOM</span>, en visant les niveaux SLSA (2021) pour la chaîne de build. Je suis les faux positifs et les échecs intermittents, car c'est la confiance dans le pipeline qui le rend utile.

**À relire** : [Livraison : Contrôles automatiques avant la fusion](../../knowledge/livraison.md#controles-automatiques-avant-la-fusion), [Sécurité : Les outils de test de sécurité](../../knowledge/securite.md#les-outils-de-test-de-securite), [Gestionnaires de paquets : Sécuriser l'installation](../../knowledge/gestionnaires-paquets.md#securiser-linstallation)

### « Pourquoi la couverture de code ne suffit-elle pas à mesurer la qualité des tests ? »

*Aussi posée ainsi : « 100 % de couverture, c'est suffisant ? », « Quel seuil imposer ? »*

La couverture dit quel code a été exécuté, pas quel comportement a été vérifié. Exemple : 95 % de couverture sur un calcul de remboursement, mais aucun test ne vérifie que le montant reste inférieur au prix payé. Je la complète par les scénarios métier, les cas limites et les défauts échappés, et sur le code critique par le <span class="term" data-term="mutation-testing">mutation testing</span> (DeMillo, Lipton et Sayward, 1978) ou le test par propriétés. Si j'impose un seuil, c'est sur le nouveau code seulement.

**À relire** : [Qualité : Ce qu'elle dit et ce qu'elle ne dit pas](../../knowledge/qualite.md#ce-quelle-dit-et-ce-quelle-ne-dit-pas), [Qualité : Mutation testing : tester les tests](../../knowledge/qualite.md#mutation-testing-tester-les-tests), [Concevoir les tests : Test par propriétés (property-based testing)](../../knowledge/conception-tests.md#test-par-proprietes-property-based-testing)

### « Comment améliorer la maintenabilité d'un code difficile à faire évoluer ? »

*Aussi posée ainsi : « Comment modifies-tu un code legacy sans tests ? »*

Je cherche pourquoi le code est difficile à modifier et quelles évolutions coûtent le plus. Je fige le comportement avec des tests, je crée un <span class="term" data-term="seam">seam</span>, puis je sépare peu à peu les responsabilités qui changent pour des raisons différentes. Exemple : un contrôleur qui vérifie les droits, calcule, écrit en base, appelle la banque et envoie un e-mail ; je sors d'abord le calcul dans une fonction testée. Je préfère des refactorings ciblés et mesurés (catalogue de Martin Fowler, 1999, 2e édition 2018) à une réécriture.

**À relire** : [Principes de conception : Modifier du code legacy](../../knowledge/principes-conception.md#modifier-du-code-legacy), [Principes de conception : Refactoring en petits pas](../../knowledge/principes-conception.md#refactoring-en-petits-pas), [Architecture : Architecture hexagonale et clean architecture](../../knowledge/architecture.md#architecture-hexagonale-et-clean-architecture)

### « SOLID, STUPID, DRY : faut-il en faire un standard d'équipe, et comment les utiliser en revue sans dogme ? »

Je n'en fais pas une règle qui bloque une MR, mais un vocabulaire partagé. En revue, chaque remarque cite un coût concret (« ajouter un moyen de paiement oblige à modifier ce fichier et ses 40 tests »), pas « ça viole l'ouvert/fermé ». J'automatise ce qui se mesure sans débat : complexité cognitive par fonction, sens des dépendances entre modules avec des règles d'architecture en CI. Le reste reste un jugement : une duplication de deux lignes n'est pas une faute, et une <span class="term" data-term="wrong-abstraction">mauvaise abstraction</span> coûte plus qu'une copie (Sandi Metz, 2016).

**À relire** : [Principes de conception : SOLID](../../knowledge/principes-conception.md#solid), [Principes de conception : STUPID : les six odeurs à éviter](../../knowledge/principes-conception.md#stupid-les-six-odeurs-a-eviter), [Qualité : Prouver chaque remarque](../../knowledge/qualite.md#prouver-chaque-remarque), [Architecture : Fitness functions](../../knowledge/architecture.md#fitness-functions)

### « Comment améliorer l'observabilité et la fiabilité d'un service ? »

*Aussi posée ainsi : « SLI, SLO, SLA : quelle différence ? », « Qu'est-ce qu'une bonne alerte ? »*

Je pars des parcours critiques et je fixe avec le métier un objectif de fiabilité pour chacun : un <span class="term" data-term="sli">SLI</span> mesuré, un <span class="term" data-term="slo">SLO</span> interne et son <span class="term" data-term="error-budget">budget d'erreur</span> (livre « Site Reliability Engineering » de Google, 2016). Je relie les services par un identifiant de trace propagé (W3C Trace Context, 2020) et j'alerte sur les symptômes vus par l'utilisateur, au rythme de consommation du budget, pas sur chaque cause. Exemple : des virements restent « en cours » ; l'âge du plus vieux message de la file dit plus que le CPU du service.

**À relire** : [Observabilité : SLI, SLO, budget d'erreur](../../knowledge/observabilite.md#sli-slo-budget-derreur), [Observabilité : Alerter sur les symptômes, pas sur les causes](../../knowledge/observabilite.md#alerter-sur-les-symptomes-pas-sur-les-causes), [Observabilité : Propagation entre services](../../knowledge/observabilite.md#propagation-entre-services), [Outils : Observer la santé d'une file](../../knowledge/outils.md#observer-la-sante-dune-file)

## Mesure et amélioration de l'ingénierie

### « Comment mesurer l'efficacité d'une démarche qualité ? »

*Aussi posée ainsi : « Quels indicateurs qualité suis-tu ? », « Comment sais-tu qu'une pratique a vraiment marché ? »*

Je définis le problème, puis une mesure de départ, avec la méthode Goal-Question-Metric (Victor Basili, 1984). Je choisis quelques indicateurs de résultat et de coût, je lance un essai, puis je compare sur une fenêtre de même durée, avec une métrique garde-fou. Je ne conclus pas qu'une démarche marche parce que l'outil est déployé ou que la règle est respectée. La <span class="term" data-term="goodhart-law">loi de Goodhart</span> (1975) me rappelle qu'un indicateur devenu objectif se fait gonfler.

**À relire** : [Qualité : Choisir ses indicateurs avec GQM](../../knowledge/qualite.md#choisir-ses-indicateurs-avec-gqm), [Lois et principes : Loi de Goodhart](../../knowledge/lois-et-principes.md#loi-de-goodhart), [Qualité : Defect Detection Percentage](../../knowledge/qualite.md#defect-detection-percentage)

### « Que sont les métriques DORA et comment les utiliser ? »

*Aussi posée ainsi : « Comment mesurer la productivité d'une équipe ? »*

Les quatre <span class="term" data-term="dora-metrics">métriques DORA</span> (programme de recherche depuis 2014, livre « Accelerate », 2018) mesurent le flux de livraison : délai des changements, fréquence de déploiement, taux d'échec des changements, temps de rétablissement. Je les lis ensemble et en tendance : déployer plus souvent n'est pas un progrès si les échecs augmentent. Je ne compare pas des équipes aux contextes différents et je ne mesure jamais des personnes. Je les complète par SPACE (2021) et DevEx (2023) pour l'expérience des développeurs.

**À relire** : [Livraison : Mesurer la livraison : DORA](../../knowledge/livraison.md#mesurer-la-livraison-dora), [Livraison : Mesurer l'expérience développeur : SPACE et DevEx](../../knowledge/livraison.md#mesurer-lexperience-developpeur-space-et-devex), [DevX : Mesurer sans surveiller](../../knowledge/devx.md#mesurer-sans-surveiller)

### « Comment démontrer la valeur d'un outil ou d'un standard ? »

*Aussi posée ainsi : « Comment sais-tu que ton chantier DevX a servi ? »*

J'écris l'hypothèse que l'outil doit vérifier et le problème qu'il doit régler. Je lance un <span class="term" data-term="pilot">pilote</span> sur un périmètre représentatif, idéalement avec un <span class="term" data-term="comparison-group">groupe de comparaison</span>, en mesurant les gains et les coûts d'adoption (« The Lean Startup », Eric Ries, 2011). Je décide sur les résultats, et je suis prêt à ajuster ou abandonner. Exemple : automatiser PHPUnit dans les pipelines ; je compare les défauts échappés et la durée du pipeline des équipes pilotes avant et après.

**À relire** : [DevX : Faire adopter un outil sans l'imposer](../../knowledge/devx.md#faire-adopter-un-outil-sans-limposer), [Données et décision : Décider avec les données](../../knowledge/donnees-decision.md#decider-avec-les-donnees), [DevX : Mesurer sans surveiller](../../knowledge/devx.md#mesurer-sans-surveiller), [DevX : Prouver la valeur d'un outil par un pilote](../../knowledge/devx.md#prouver-la-valeur-dun-outil-par-un-pilote)

## Pragmatisme, incidents et arbitrages

### « Que faire lorsqu'un contrôle qualité bloque une livraison importante ? »

Je ne supprime pas le contrôle sans comprendre pourquoi il bloque. Si c'est un défaut sérieux, je le corrige avant de livrer. Si c'est un faux positif ou un problème préexistant sans lien avec le changement, j'accepte une <span class="term" data-term="waiver">dérogation</span> visible, justifiée, avec un propriétaire et une date d'expiration (acceptation formelle du risque, ISO 31000, 2009, révisée en 2018). Dans tous les cas, je traite la cause pour que le blocage ne revienne pas, par exemple un gate qui ne regarde que le nouveau code.

**À relire** : [Qualité : Ne jamais affaiblir un gate](../../knowledge/qualite.md#ne-jamais-affaiblir-un-gate), [Qualité : Deux gates suffisent](../../knowledge/qualite.md#deux-gates-suffisent), [Culture d'entreprise : Registre des risques](../../knowledge/culture-entreprise.md#registre-des-risques), [Qualité : Dérogation datée et acceptation du risque](../../knowledge/qualite.md#derogation-datee-et-acceptation-du-risque)

### « Comment réagir à un incident qui touche plusieurs équipes ? »

*Aussi posée ainsi : « Raconte un incident que tu as géré. Qu'as-tu fait en premier ? », « Qui fait quoi pendant un incident ? »*

Je sépare la gestion immédiate de l'analyse. D'abord l'impact, un <span class="term" data-term="incident-commander">responsable d'incident</span> qui coordonne sans déboguer, une personne qui communique, et l'atténuation avant la recherche de cause (Incident Command System, né chez les pompiers américains dans les années 1970). Ensuite les faits, les facteurs contributifs et des actions avec propriétaire et échéance. Je parle du système qui a permis l'erreur, jamais d'un coupable (John Allspaw, 2012).

**À relire** : [Incidents : Le cycle de vie d'un incident](../../knowledge/incidents.md#le-cycle-de-vie-dun-incident), [Incidents : Les rôles pendant l'incident](../../knowledge/incidents.md#les-roles-pendant-lincident), [Incidents : Le postmortem sans recherche de coupable](../../knowledge/incidents.md#le-postmortem-sans-recherche-de-coupable)

### « Comment mettre en place une démarche d'incidentologie qui fait vraiment progresser les équipes ? »

*Aussi posée ainsi : « Le MTTR est-il un bon indicateur ? », « Comment t'assures-tu que les actions sont faites ? », « Comment rends-tu une astreinte soutenable ? »*

J'écris une grille de sévérité avec le produit et le support, avec des critères vérifiables et, pour chaque niveau, qui est appelé, qui coordonne et à quel rythme la page de statut change. Après un incident grave, un postmortem court cherche les facteurs contributifs. Les actions vont dans le backlog, avec responsable et échéance, et je les suis jusqu'à la clôture. Je regarde les incidents ensemble chaque trimestre pour les thèmes qui reviennent. Le <span class="term" data-term="mttr">MTTR</span> moyen est écrasé par un seul long incident : je lui préfère la médiane, le pire cas, les incidents récurrents et la charge de l'astreinte.

**À relire** : [Incidents : Niveaux de sévérité](../../knowledge/incidents.md#niveaux-de-severite), [Incidents : Suivre les actions](../../knowledge/incidents.md#suivre-les-actions), [Incidents : Mesures et leurs limites](../../knowledge/incidents.md#mesures-et-leurs-limites), [Incidents : Une astreinte soutenable](../../knowledge/incidents.md#une-astreinte-soutenable), [Incidents : Apprendre des incidents à l'échelle](../../knowledge/incidents.md#apprendre-des-incidents-a-lechelle)

### « Quand faut-il corriger immédiatement et quand faut-il refactorer ? »

Je pèse l'urgence, l'impact et le risque de la correction. Pendant un incident, je choisis un correctif sûr qui rétablit le comportement attendu, couvert par un test qui reproduit le bug. Une fois la situation stable, je regarde si la structure du code rend la récidive probable, et je refactore par petits pas. Kent Beck (2012) le résume : « make the change easy, then make the easy change ». Exemple : une erreur de TVA en production ; correctif ciblé le jour même, refactoring préparatoire dans les semaines qui suivent.

**À relire** : [Principes de conception : Refactoring en petits pas](../../knowledge/principes-conception.md#refactoring-en-petits-pas), [Concevoir les tests : Tests de caractérisation et golden master](../../knowledge/conception-tests.md#tests-de-caracterisation-et-golden-master), [Incidents : Trouver la cause : déboguer méthodiquement](../../knowledge/incidents.md#trouver-la-cause-deboguer-methodiquement)

### « Que faire si une équipe veut contourner un quality gate ? »

*Aussi posée ainsi : « Que fais-tu d'un test instable ? »*

Je cherche pourquoi elle contourne. Si le contrôle est fiable et protège d'un risque important, je ne le désactive pas pour accélérer. Si le problème vient de faux positifs ou de <span class="term" data-term="flaky-test">tests instables</span>, je traite ce défaut : quarantaine avec ticket et responsable (Google, « Flaky Tests at Google and How We Mitigate Them », 2016), puis réparation. Exemple : des tests E2E échouent une fois sur dix et l'équipe relance jusqu'au vert ; la relance cache aussi les vrais bugs.

**À relire** : [Qualité : Stratégie face à un test instable](../../knowledge/qualite.md#strategie-face-a-un-test-instable), [Qualité : Ne jamais affaiblir un gate](../../knowledge/qualite.md#ne-jamais-affaiblir-un-gate), [Qualité : Causes d'instabilité qui ne sont pas des bugs de test](../../knowledge/qualite.md#causes-dinstabilite-qui-ne-sont-pas-des-bugs-de-test), [Qualité : Mettre en quarantaine sans bloquer](../../knowledge/qualite.md#mettre-en-quarantaine-sans-bloquer), [Qualité : Dérogation datée et acceptation du risque](../../knowledge/qualite.md#derogation-datee-et-acceptation-du-risque)

## Transmission et accompagnement

### « Comment faire progresser plusieurs équipes sur les pratiques de test ? »

Je pars des difficultés réelles des équipes, pas d'un catalogue de bonnes pratiques. Je construis un exemple concret qu'elles peuvent copier, puis un modèle réutilisable et une documentation courte. Je forme des relais dans chaque équipe, à la manière d'une communauté de pratique (Lave et Wenger, 1991). Je regarde ensuite où elles restent bloquées pour améliorer le support, plutôt que de faire à leur place.

**À relire** : [DevX : Golden paths et templates](../../knowledge/devx.md#golden-paths-et-templates), [DevX : Documentation](../../knowledge/devx.md#documentation), [Culture d'entreprise : Team Topologies](../../knowledge/culture-entreprise.md#team-topologies), [Qualité : Choisir le bon niveau de test](../../knowledge/qualite.md#choisir-le-bon-niveau-de-test)

### « Comment transformer une bonne pratique en standard partagé ? »

*Aussi posée ainsi : « Golden path ou règle imposée ? », « Comment fais-tu passer 300 dépôts à une nouvelle version sans y passer un an ? »*

Je vérifie que le besoin est partagé et que la pratique marche dans plusieurs contextes. Je sépare les principes communs des détails propres à chaque langage, puis je fournis un chemin balisé : un composant de CI versionné que les équipes incluent, qu'elles peuvent quitter en assumant leur différence. Je prévois comment le standard évolue à partir des retours. Pour une migration de masse, je combine <span class="term" data-term="codemod">codemod</span>, MR par vagues, robot de mise à jour et tableau de campagne.

**À relire** : [DevX : Golden paths et templates](../../knowledge/devx.md#golden-paths-et-templates), [DevX : Composant de CI partagé et versionné](../../knowledge/devx.md#composant-de-ci-partage-et-versionne), [DevX : Migrations à grande échelle](../../knowledge/devx.md#migrations-a-grande-echelle), [DevX : Platform engineering : la plateforme comme produit](../../knowledge/devx.md#platform-engineering-la-plateforme-comme-produit)

### « Comment développer l'influence sans autorité hiérarchique ? »

*Aussi posée ainsi : « Ton outil n'est utilisé que par trois équipes sur vingt, que fais-tu ? »*

Je comprends les contraintes de l'équipe avant de proposer. Je m'appuie sur des faits, un exemple ou un prototype qui rend le gain visible, j'écoute les objections et j'adapte. J'écris une RFC courte pour les propositions lourdes, et je fais relire en tête-à-tête avant la réunion de décision. Mon objectif est que les équipes prennent une bonne décision et sachent la reproduire sans moi. « Influence Without Authority » (Cohen et Bradford, 1990) donne le principe : comprendre ce que l'autre valorise et proposer un échange.

**À relire** : [Culture d'entreprise : RFC et documents de conception](../../knowledge/culture-entreprise.md#rfc-et-documents-de-conception), [DevX : Faire adopter un outil sans l'imposer](../../knowledge/devx.md#faire-adopter-un-outil-sans-limposer), [Culture d'entreprise : Désaccord et engagement](../../knowledge/culture-entreprise.md#desaccord-et-engagement), [Culture d'entreprise : Influence sans autorité et communautés de pratique](../../knowledge/culture-entreprise.md#influence-sans-autorite-et-communautes-de-pratique)

## Vision du rôle de Staff Engineer

### « Quelle est la différence entre un Senior Engineer et un Staff Engineer ? »

La différence principale est l'étendue de l'impact. Un Senior résout des problèmes complexes dans son équipe ; un Staff repère les problèmes communs à plusieurs équipes, facilite les décisions transverses et améliore les pratiques durablement. Exemple : le Senior corrige un client HTTP mal configuré dans son appli, le Staff voit que cinq applis l'utilisent. Je cite les quatre <span class="term" data-term="staff-archetype">archétypes</span> de Will Larson (« Staff Engineer », 2021), je dis lequel je vise et pourquoi il répond au besoin de l'entreprise.

**À relire** : [Culture d'entreprise : Les archétypes staff+](../../knowledge/culture-entreprise.md#les-archetypes-staff), [Culture d'entreprise : Deux filières : expertise et management](../../knowledge/culture-entreprise.md#deux-filieres-expertise-et-management)

### « Que ferais-tu pendant tes trois premiers mois ? »

Premier mois : j'écoute les équipes, je cartographie les systèmes et le flux de livraison, je livre une petite victoire visible, et je fais relire mon diagnostic en demandant « qu'est-ce que j'ai mal compris ? ». Deuxième mois : je choisis avec les équipes un ou deux problèmes transverses, une mesure de départ et un essai réversible. Troisième mois : je compare aux chiffres de départ et je décide avec les parties prenantes de généraliser, adapter ou arrêter. « The First 90 Days » (Michael Watkins, 2003) donne le cadre. L'exercice 13 de la page [exercices](exercices.md) le détaille.

**À relire** : [Culture d'entreprise : Cartographie du flux de valeur](../../knowledge/culture-entreprise.md#cartographie-du-flux-de-valeur), [Livraison : Mesurer la livraison : DORA](../../knowledge/livraison.md#mesurer-la-livraison-dora), [Culture d'entreprise : Les archétypes staff+](../../knowledge/culture-entreprise.md#les-archetypes-staff), [Culture d'entreprise : Les 90 premiers jours dans un nouveau rôle](../../knowledge/culture-entreprise.md#les-90-premiers-jours-dans-un-nouveau-role)

### « Comment répartis-tu ton temps entre code, conception et accompagnement ? »

Je garde du temps de code pour rester proche des difficultés réelles, mais sur des sujets où mon intervention a le plus de valeur : un prototype qui tranche une question d'architecture, un outil, une correction partagée. Je ne prends pas une tâche dont dépend directement une livraison d'équipe : si une urgence ailleurs m'occupe trois jours, toute l'équipe attend (Will Larson, 2021, « rester hors du <span class="term" data-term="critical-path">chemin critique</span> »). Je rends visible le travail de liaison entre équipes, que Tanya Reilly appelle « Being Glue » (2019). Je mesure mon impact collectif, pas mon volume de code.

**À relire** : [Culture d'entreprise : Les archétypes staff+](../../knowledge/culture-entreprise.md#les-archetypes-staff), [DevX : Boucle interne et boucle externe](../../knowledge/devx.md#boucle-interne-et-boucle-externe), [Culture d'entreprise : Répartir son temps et montrer son impact](../../knowledge/culture-entreprise.md#repartir-son-temps-et-montrer-son-impact)

### « Comment vois-tu le rôle du Staff Engineer avec l'essor de l'IA ? »

*Aussi posée ainsi : « Comment déploierais-tu un assistant de code IA dans les équipes ? »*

L'IA accélère l'écriture du code, mais ne garantit ni la justesse des exigences ni la sécurité. Exemple : une API générée compile, ses tests passent, et elle laisse un utilisateur lire le compte d'un autre. Je pose un cadre écrit, je garde les mêmes revues et la même CI, et je mesure l'effet sur le délai et les défauts plutôt que sur la quantité de code générée. Je cite l'OWASP Top 10 for LLM Applications (édition 2025) et l'EU AI Act (règlement de 2024) pour les risques et les obligations.

**À relire** : [DevX : Assistants de code IA](../../knowledge/devx.md#assistants-de-code-ia), [IA en entreprise : Mesurer l'usage d'un assistant IA en équipe](../../knowledge/ia-entreprise.md#mesurer-lusage-dun-assistant-ia-en-equipe), [IA en entreprise : Ce que ça change pour une équipe de dev et de QA](../../knowledge/ia-entreprise.md#ce-que-ca-change-pour-une-equipe-de-dev-et-de-qa), [IA et agents : Fermer la boucle : donner un moyen de vérifier](../../knowledge/ia-agents.md#fermer-la-boucle-donner-un-moyen-de-verifier)

### « Comment reconnais-tu une culture d'équipe saine ? »

Je regarde des signes concrets : les juniors commentent les MR des seniors, « je ne sais pas » est accepté, un incident donne lieu à un apprentissage et non à une sanction. Je cite la typologie de Westrum (2004) et la <span class="term" data-term="psychological-safety">sécurité psychologique</span>, en précisant que ce n'est pas de la gentillesse sans exigence. Comme Staff, j'en suis un modèle : je dis quand je me trompe et je remercie qui me corrige.

**À relire** : [Culture d'entreprise : Typologie de Westrum](../../knowledge/culture-entreprise.md#typologie-de-westrum), [Culture d'entreprise : Sécurité psychologique](../../knowledge/culture-entreprise.md#securite-psychologique), [Culture d'entreprise : Culture juste](../../knowledge/culture-entreprise.md#culture-juste)

## Questions techniques précises

### « Comment faire évoluer une API sans casser ses consommateurs ? »

*Aussi posée ainsi : « Offset ou curseur pour paginer ? », « Ton API doit-elle accepter une requête un peu mal formée ? »*

Je recense qui consomme l'API et quelles garanties ils attendent ; la <span class="term" data-term="hyrum-law">loi de Hyrum</span> rappelle que tout comportement visible est utilisé par quelqu'un. Je privilégie les évolutions compatibles. Pour une rupture, je fais un <span class="term" data-term="expand-contract">expand / contract</span> (Danilo Sato, 2014) : j'ajoute `account_id` à côté de `customer_id`, j'annonce le retrait par les en-têtes `Deprecation` et `Sunset`, je suis l'usage de l'ancien champ, puis je le retire. Les tests de contrat et une majeure SemVer encadrent la rupture ; côté client, je lis en Tolerant Reader (Martin Fowler, 2011).

**À relire** : [API : Versionner](../../knowledge/api-rest-async.md#versionner), [API : Tolerant Reader : un client qui ne casse pas](../../knowledge/api-rest-async.md#tolerant-reader-un-client-qui-ne-casse-pas), [Lois et principes : Loi de Hyrum](../../knowledge/lois-et-principes.md#loi-de-hyrum), [API : Pagination](../../knowledge/api-rest-async.md#pagination)

### « Comment migrer une authentification vers OAuth 2.0 ou OpenID Connect ? »

Je sépare les deux questions : OAuth 2.0 (RFC 6749, 2012) délègue un accès, OpenID Connect dit qui est connecté. Je recense les applications qui s'authentifient aujourd'hui, et je choisis le flux par type de client : Authorization Code avec <span class="term" data-term="pkce">PKCE</span> (RFC 7636, 2015) pour une personne, Client Credentials entre services. Chaque API valide `iss`, `aud`, `exp` et la signature du <span class="term" data-term="jwt">JWT</span>. Je migre progressivement, avec des tests de sécurité et un retour arrière, en suivant la RFC 9700 (janvier 2025).

**À relire** : [Sécurité : OAuth et OpenID Connect](../../knowledge/securite.md#oauth-et-openid-connect), [Sécurité : Quel flux pour quel client](../../knowledge/securite.md#quel-flux-pour-quel-client), [Sécurité : JWT : à quoi ressemble un jeton](../../knowledge/securite.md#jwt-a-quoi-ressemble-un-jeton), [Outils : Authentification : Auth0, Keycloak](../../knowledge/outils.md#authentification-auth0-keycloak)

### « Comment éviter les doublons lorsqu'une API reçoit plusieurs fois la même demande ? »

*Aussi posée ainsi : « Comment rendre un `POST` rejouable sans risque ? », « Que se passe-t-il si un message arrive deux fois ? »*

Un timeout ne veut pas dire que le serveur n'a rien fait. Pour une opération non répétable comme un paiement, j'utilise une <span class="term" data-term="idempotency-key">clé d'idempotence</span> fournie par le client, unique par client, enregistrée avec une empreinte de la requête et la réponse. C'est la <span class="term" data-term="unique-constraint">contrainte d'unicité</span> en base qui arbitre deux requêtes simultanées, pas un « chercher puis insérer ». Côté messages, je rends le consommateur idempotent (Chris Richardson, « Microservices Patterns », 2018). L'exercice 4 de la page [exercices](exercices.md) donne le code.

**À relire** : [API : Les méthodes HTTP](../../knowledge/api-rest-async.md#les-methodes-http), [Architecture : Idempotence](../../knowledge/architecture.md#idempotence), [API : Garanties de livraison](../../knowledge/api-rest-async.md#garanties-de-livraison)

### « Comment gérer la cohérence des données entre plusieurs services ? »

*Aussi posée ainsi : « Explique le théorème CAP », « Comment publier un événement sans le perdre si la base a écrit ? »*

Je clarifie les garanties métier et le système qui fait autorité pour chaque donnée. Je vérifie si la cohérence immédiate est indispensable ou si la <span class="term" data-term="eventual-consistency">cohérence à terme</span> suffit. Pour une opération répartie, j'écris une <span class="term" data-term="saga-pattern">saga</span> (Garcia-Molina et Salem, 1987) avec ses états, ses reprises et ses compensations, et j'enregistre l'événement avec la donnée grâce à l'outbox. Exemple : le paiement réussit mais la réservation de stock échoue ; la saga rembourse. Le théorème CAP (Brewer, 2000, démontré en 2002) ne se pose que pendant une coupure réseau.

**À relire** : [Architecture : Saga orchestrée ou chorégraphiée](../../knowledge/architecture.md#saga-orchestree-ou-choregraphiee), [Architecture : Outbox](../../knowledge/architecture.md#outbox), [Architecture : CAP et PACELC](../../knowledge/architecture.md#cap-et-pacelc), [API : Le piège de l'écriture puis de la publication](../../knowledge/api-rest-async.md#le-piege-de-lecriture-puis-de-la-publication), [Architecture : Autorisation et capture du paiement](../../knowledge/architecture.md#autorisation-et-capture-du-paiement)

### « Comment sécuriser une API qui expose des données sensibles ? »

*Aussi posée ainsi : « Qu'est-ce que le BOLA ? », « RBAC ou ABAC ? », « Une clé a fuité, que fais-tu ? »*

J'identifie les données sensibles et qui doit y accéder. Je sépare authentification et autorisation : être connecté ne donne pas accès à toutes les ressources. Exemple : `/accounts/12345` où l'on remplace l'identifiant par celui d'un autre client, la faille <span class="term" data-term="bola">BOLA</span> en tête de l'OWASP API Security Top 10 (édition 2023). Je vérifie les droits côté serveur, en refus par défaut, je limite les champs exposés, je protège les secrets et j'ajoute des tests de refus. Je relis aussi les logs, qui fuient souvent plus que l'API.

**À relire** : [Sécurité : Les failles les plus courantes des API](../../knowledge/securite.md#les-failles-les-plus-courantes-des-api), [Sécurité : Où appliquer les contrôles](../../knowledge/securite.md#ou-appliquer-les-controles), [Sécurité : Modéliser les droits : RBAC, ABAC, ReBAC](../../knowledge/securite.md#modeliser-les-droits-rbac-abac-rebac), [Sécurité : Les secrets](../../knowledge/securite.md#les-secrets)

### « Un scanner signale des centaines de failles dans nos dépendances : comment priorises-tu ? »

*Aussi posée ainsi : « Qu'est-ce que le CVSS, l'EPSS, le KEV ? »*

Je croise la gravité (<span class="term" data-term="cvss">CVSS</span>, version 4.0 publiée en 2023), la probabilité d'exploitation (<span class="term" data-term="epss">EPSS</span>, publié par le FIRST depuis 2021), l'atteignabilité du code vulnérable et l'exposition réelle. Une faille à CVSS 9 jamais appelée attend moins qu'une faille à CVSS 7 avec un exploit qui circule. Chaque action a un propriétaire et un délai ; une alerte ignorée est écrite dans la configuration du scanner avec une date d'expiration. L'exercice 10 de la page [exercices](exercices.md) déroule le cas.

**À relire** : [Cybersécurité : Noter et trier une faille](../../knowledge/cybersecurite.md#noter-et-trier-une-faille), [Gestionnaires de paquets : Mettre à jour les dépendances](../../knowledge/gestionnaires-paquets.md#mettre-a-jour-les-dependances), [Cybersécurité : Attaques de la chaîne d'approvisionnement](../../knowledge/cybersecurite.md#attaques-de-la-chaine-dapprovisionnement), [Qualité : Dérogation datée et acceptation du risque](../../knowledge/qualite.md#derogation-datee-et-acceptation-du-risque)

### « Comment diagnostiquer une API qui devient lente en production ? »

*Aussi posée ainsi : « Pourquoi le p95 plutôt que la moyenne ? », « Une page est lente à cause de la base, que fais-tu ? »*

Je caractérise la dégradation : depuis quand, sur quelles requêtes, avec quel impact, en regardant le <span class="term" data-term="p95">p95</span> et pas la moyenne. Je lis les métriques avec la méthode RED (Tom Wilkie, 2015) côté service et USE (Brendan Gregg, 2012) côté ressources, puis une trace pour localiser le composant. Je formule une hypothèse, je la vérifie (`EXPLAIN ANALYZE`, flame graph), je change une seule chose et je compare avant et après. Exemple : des requêtes à trois secondes le matin, causées par un export qui sature la base.

**À relire** : [Observabilité : Tableau de bord d'un service : RED et USE](../../knowledge/observabilite.md#tableau-de-bord-dun-service-red-et-use), [Observabilité : Latence p95](../../knowledge/observabilite.md#latence-p95), [Observabilité : Trouver la cause d'une lenteur : profileur et flame graph](../../knowledge/observabilite.md#trouver-la-cause-dune-lenteur-profileur-et-flame-graph), [SQL : Performances](../../knowledge/sql.md#performances), [SQL : Index composite : l'ordre des colonnes et l'index couvrant](../../knowledge/sql.md#index-composite-lordre-des-colonnes-et-lindex-couvrant)

### « La base de données principale sature : faut-il la faire grandir (vertical) ou la répartir (horizontal) ? »

Je ne choisis pas avant d'avoir mesuré : une base qui sature est souvent victime de quelques requêtes. Je regarde `pg_stat_statements`, les plans des requêtes les plus coûteuses, les index manquants, le <span class="term" data-term="n-plus-one">N+1</span>, les connexions et les verrous. Puis je monte l'échelle du moins cher au plus cher : corriger les requêtes, un pooler, un cache, une machine plus grosse, des réplicas en lecture, le partitionnement et l'archivage. Le <span class="term" data-term="sharding">sharding</span> vient en dernier, quand les écritures dépassent une machine (Martin Kleppmann, « Designing Data-Intensive Applications », 2017).

**À relire** : [SQL : Faire grandir une base de données](../../knowledge/sql.md#faire-grandir-une-base-de-donnees), [SQL : L'échelle, du moins cher au plus cher](../../knowledge/sql.md#lechelle-du-moins-cher-au-plus-cher), [SQL : Trouver les requêtes lentes](../../knowledge/sql.md#trouver-les-requetes-lentes), [SQL : Le problème N+1](../../knowledge/sql.md#le-probleme-n1)

### « Comment déployer un changement risqué en limitant son impact ? »

*Aussi posée ainsi : « Canary, blue-green ou feature flag : lequel choisir ? », « Comment renommes-tu une colonne en production ? »*

Je réduis le <span class="term" data-term="blast-radius">rayon d'impact</span>. Je sépare déployer et activer avec un <span class="term" data-term="feature-flag">feature flag</span> (Pete Hodgson, 2017), puis j'ouvre par paliers en canary. J'écris à l'avance les indicateurs à surveiller, les critères d'arrêt et la procédure de retour arrière. Pour les données, je garde la compatibilité entre l'ancienne et la nouvelle version avec expand / contract, sinon le retour arrière casse. Exemple : un nouveau calcul de frais de virement, activé pour 1 % des clients, comparé au calcul actuel.

**À relire** : [Livraison : Déploiement progressif](../../knowledge/livraison.md#deploiement-progressif), [Architecture : Séparer déployer et activer](../../knowledge/architecture.md#separer-deployer-et-activer), [SQL : Migrer un schéma sans interruption](../../knowledge/sql.md#migrer-un-schema-sans-interruption), [Qualité : Tester un déploiement canary](../../knowledge/qualite.md#tester-un-deploiement-canary)

## Choix d'outils

### « Comment choisir entre RabbitMQ et Kafka, et faut-il garder les deux ? »

*Aussi posée ainsi : « File ou topic ? », « Comment sais-tu qu'un consommateur est en retard ? »*

Je pars de la question posée au message. Une tâche à répartir entre des workers, avec retry et file d'erreurs, va dans une file comme RabbitMQ ; un fait que plusieurs services doivent connaître, même plus tard, va dans un journal comme Kafka (Jay Kreps, « The Log », 2013). Je compare aussi le volume, l'ordre attendu et le coût d'exploitation. Garder les deux est raisonnable s'ils servent deux besoins, à condition d'écrire la règle de choix dans un ADR. Je surveille le <span class="term" data-term="consumer-lag">retard des consommateurs</span> et l'âge du plus vieux message.

**À relire** : [Outils : Pourquoi avoir les deux](../../knowledge/outils.md#pourquoi-avoir-les-deux), [API : File (queue) ou sujet (topic)](../../knowledge/api-rest-async.md#file-queue-ou-sujet-topic), [Outils : Observer la santé d'une file](../../knowledge/outils.md#observer-la-sante-dune-file)

### « Faut-il choisir un service managé ou héberger l'outil soi-même ? »

Je compare le <span class="term" data-term="total-cost-ownership">coût total de possession</span>, pas seulement la facture : un outil gratuit auto-hébergé coûte des jours d'ingénieur en mises à jour, astreintes et incidents. Je me demande si l'opérer nous différencie ; sinon, un <span class="term" data-term="managed-service">service managé</span> libère l'équipe (cartes de Wardley, Simon Wardley, 2005). Je regarde le <span class="term" data-term="vendor-lock-in">verrouillage fournisseur</span>, les contraintes de données, et je garde une porte de sortie par un standard. Exemple : remplacer Auth0 par Keycloak dans le cluster ; je chiffre les deux sur trois ans, astreinte comprise.

**À relire** : [Culture d'entreprise : Coût total de possession](../../knowledge/culture-entreprise.md#cout-total-de-possession), [Culture d'entreprise : Construire, acheter ou s'associer](../../knowledge/culture-entreprise.md#construire-acheter-ou-sassocier), [Culture d'entreprise : Cartes de Wardley](../../knowledge/culture-entreprise.md#cartes-de-wardley), [Outils : Authentification : Auth0, Keycloak](../../knowledge/outils.md#authentification-auth0-keycloak), [Culture d'entreprise : L'enfermement chez un fournisseur, un coût à chiffrer](../../knowledge/culture-entreprise.md#lenfermement-chez-un-fournisseur-un-cout-a-chiffrer)

### « Comment remplacer un outil de test en place sans tout réécrire ? »

Je mesure d'abord le problème de l'outil actuel (durée, instabilité, coût de maintenance) et je vérifie sur un pilote que le nouvel outil le règle. Ensuite, je migre progressivement : tous les nouveaux tests dans le nouvel outil, les anciens par priorité, ceux qui coûtent le plus d'abord. Je fixe un critère de fin, car deux outils qui coexistent sans date doublent la maintenance. Exemple : 300 tests Cypress de 40 minutes qui échouent une fois sur cinq, migrés vers Playwright avec un tableau de suivi.

**À relire** : [Outils : Playwright, Cypress, Selenium](../../knowledge/outils.md#playwright-cypress-selenium), [DevX : Migrations à grande échelle](../../knowledge/devx.md#migrations-a-grande-echelle), [Architecture : Figuier étrangleur](../../knowledge/architecture.md#figuier-etrangleur), [DevX : Prouver la valeur d'un outil par un pilote](../../knowledge/devx.md#prouver-la-valeur-dun-outil-par-un-pilote)

### « Quand ajouter un cache comme Redis, et quels risques prendre en compte ? »

Je n'ajoute un cache qu'après avoir mesuré une lecture coûteuse et répétée, et vérifié qu'un index ne suffit pas. Le métier valide combien de temps une donnée périmée est acceptable, ce qui donne le <span class="term" data-term="ttl">TTL</span>. Je pars du motif <span class="term" data-term="cache-aside">cache-aside</span>, je définis l'invalidation, et je teste deux pannes : Redis indisponible, où le service lit la source, et l'expiration d'une clé populaire, qui provoque une <span class="term" data-term="cache-stampede">ruée sur le cache</span> (Vattani et al., 2015).

**À relire** : [Architecture : Où placer un cache](../../knowledge/architecture.md#ou-placer-un-cache), [Architecture : Invalidation et ruée sur le cache](../../knowledge/architecture.md#invalidation-et-ruee-sur-le-cache), [Outils : Cache : Redis](../../knowledge/outils.md#cache-redis)

### « Une équipe veut faire ses tableaux de bord directement sur la base de production : que proposes-tu ? »

Je comprends le besoin : quels indicateurs, avec quelle fraîcheur. Une base de production est faite pour l'<span class="term" data-term="oltp">OLTP</span>, et une grosse requête d'analyse la ralentit pour tous les utilisateurs. Selon la fraîcheur, je propose une réplique en lecture seule, un export planifié, ou un flux <span class="term" data-term="cdc">CDC</span> vers un entrepôt de données. Je choisis la solution la plus simple, et je fais définir chaque indicateur une seule fois, pour que deux tableaux ne donnent pas deux chiffres.

**À relire** : [Données et décision : Entrepôt, lac ou lakehouse](../../knowledge/donnees-decision.md#entrepot-lac-ou-lakehouse), [Données et décision : Intégrer les données : ETL ou ELT](../../knowledge/donnees-decision.md#integrer-les-donnees-etl-ou-elt), [SQL : Des réplicas en lecture](../../knowledge/sql.md#des-replicas-en-lecture), [Architecture : CQRS](../../knowledge/architecture.md#cqrs)

### « Comment choisir un outil d'observabilité sans s'enfermer chez un fournisseur ? »

Je sépare deux décisions. L'instrumentation vit dans le code : je la fais avec <span class="term" data-term="opentelemetry">OpenTelemetry</span> (CNCF, 2019), pour ne pas la refaire si l'outil change. Le stockage et l'affichage, c'est l'outil : je le choisis sur les usages réels et sur le coût au volume ingéré. Un collecteur entre les deux envoie les données vers deux outils pendant une transition et filtre ce qui coûte sans servir.

**À relire** : [Observabilité : OpenTelemetry (OTel)](../../knowledge/observabilite.md#opentelemetry-otel), [Observabilité : Collecteur (OTel Collector)](../../knowledge/observabilite.md#collecteur-otel-collector), [Outils : Observabilité : Datadog, Prometheus et Grafana, OpenTelemetry](../../knowledge/outils.md#observabilite-datadog-prometheus-et-grafana-opentelemetry), [Culture d'entreprise : L'enfermement chez un fournisseur, un coût à chiffrer](../../knowledge/culture-entreprise.md#lenfermement-chez-un-fournisseur-un-cout-a-chiffrer)

### « Comment encadres-tu le choix des technologies entre plusieurs équipes ? »

*Aussi posée ainsi : « Qui décide qu'un outil est adopté ? », « Comment décides-tu qu'un outil est assez mûr ? »*

Je décris un radar d'entreprise inspiré du Technology Radar de Thoughtworks (publié depuis 2010) : des anneaux avec des critères écrits, des propositions ouvertes à toutes les équipes, une revue à rythme fixe. Pour un outil, je regarde l'âge du projet, ses mainteneurs et qui l'utilise en production. Je relie chaque entrée à un ADR et aux golden paths, pour qu'« adopté » veuille dire « soutenu et outillé ».

**À relire** : [Architecture : Tech radar d'entreprise](../../knowledge/architecture.md#tech-radar-dentreprise), [Outils : Tech radar : Thoughtworks, BYOR, Zalando, AOE, CNCF](../../knowledge/outils.md#tech-radar-thoughtworks-byor-zalando-aoe-cncf), [Veille : Pourquoi, quand et comment](../../knowledge/veille.md#pourquoi-quand-et-comment)

## Critères éliminatoires : les erreurs à éviter

Ces questions testent la posture plus que la technique. Une seule réponse du mauvais côté suffit souvent à écarter une candidature Staff.

| Question | Réponse qui élimine | Ce que je dis plutôt | À relire |
|---|---|---|---|
| « Que fais-tu si une équipe refuse une décision d'architecture ? » | « Je suis Staff, donc la décision doit être appliquée. » | Je vérifie mes hypothèses, je rends les risques explicites, je fais arbitrer par la bonne personne si plusieurs équipes sont touchées, puis tout le monde applique la décision, moi compris (« disagree and commit », Jeff Bezos, 2016), et je l'écris dans un ADR. | [Culture d'entreprise : Désaccord et engagement](../../knowledge/culture-entreprise.md#desaccord-et-engagement), [Architecture : ADR](../../knowledge/architecture.md#adr) |
| « Comment réagis-tu si tu ne connais pas la réponse technique ? » | Inventer une réponse, ou présenter une hypothèse comme un fait. | Je sépare ce que je sais de ce que je suppose, et je propose un moyen de réduire l'incertitude : une mesure, la documentation, un <span class="term" data-term="spike">spike</span> limité dans le temps (Kent Beck, 1999), un spécialiste. | [Culture d'entreprise : Estimer et découper une fonctionnalité](../../knowledge/culture-entreprise.md#estimer-et-decouper-une-fonctionnalite) |
| « Comment gères-tu une recommandation technique qui s'avère mauvaise ? », « Raconte un échec » | Défendre la décision parce que je l'ai prise. | Je réexamine à partir des faits, je dis quelle hypothèse était fausse, je corrige la trajectoire et je marque l'ancien ADR comme remplacé. Avant un gros projet, un <span class="term" data-term="pre-mortem">pre-mortem</span> (Gary Klein, 2007) limite ce cas. Je raconte l'échec avec la méthode STAR et ce que je fais autrement depuis. | [Incidents : Le pre-mortem : imaginer l'échec avant de commencer](../../knowledge/incidents.md#le-pre-mortem-imaginer-lechec-avant-de-commencer), [Architecture : ADR](../../knowledge/architecture.md#adr) |
| « Comment éviter de multiplier les standards et les processus ? » | Une règle ou un outil de plus pour chaque problème, sans regarder le coût global. | Je demande quel risque chaque règle réduit, j'automatise les vérifications objectives, je garde les processus humains courts, et je retire ce qui ne sert plus, après avoir compris pourquoi c'était là (barrière de Chesterton, 1929). | [Lois et principes : Barrière de Chesterton](../../knowledge/lois-et-principes.md#barriere-de-chesterton), [DevX : Golden paths et templates](../../knowledge/devx.md#golden-paths-et-templates) |
| « Comment démontrer que tu as un impact au niveau Staff ? » | Compter des lignes de code, des réunions ou des documents. | Je pars d'un problème initial chiffré, j'explique les décisions et leur adoption par les équipes, puis les résultats mesurés, séparés des bénéfices attendus. Je tiens un journal de mes réalisations (« brag document », Julia Evans, 2019). | [Livraison : Mesurer la livraison : DORA](../../knowledge/livraison.md#mesurer-la-livraison-dora), [Culture d'entreprise : Les archétypes staff+](../../knowledge/culture-entreprise.md#les-archetypes-staff) |

## Les 3 choses qu'un Staff Engineer fait en permanence

1. **Clarifier les problèmes et prendre les bonnes décisions techniques** : avant d'ajouter un cache pour afficher un solde, je vérifie quelle fraîcheur le métier exige et ce que coûte un montant périmé. Les équipes gardent un raisonnement explicite qu'elles peuvent réutiliser.
2. **Faire progresser plusieurs équipes sans devenir leur point de passage obligatoire** : plutôt que d'approuver chaque pipeline, je fournis un modèle commun, des critères clairs et des tests réutilisables.
3. **Vérifier que les changements produisent réellement de la valeur** : après l'arrivée des quality gates, je regarde si les défauts importants baissent, et si la durée du pipeline et les faux positifs restent acceptables.

## Structure simple pour répondre à l'oral

Pour presque toutes les questions, je suis ce fil :

1. **Problème** : qui rencontre quelle difficulté, avec quel impact ?
2. **Contraintes** : sécurité, délai, fiabilité, coût, dépendances.
3. **Options** : quelles solutions, avec quels compromis ?
4. **Décision** : pourquoi cette option ?
5. **Exécution** : comment tester, déployer, accompagner ou revenir en arrière ?
6. **Résultat** : comment je vérifie que la situation s'est améliorée ?
7. **Bénéfices plus larges** : ce que la démarche améliore au-delà du problème immédiat.

Quand la question demande une histoire (« raconte une fois où... »), je la raconte avec la <span class="term" data-term="star-method">méthode STAR</span> : la situation, la tâche qui m'incombait, l'action que j'ai menée moi, le résultat chiffré. Je privilégie les cas que j'ai vécus ; si je n'en ai pas, je présente le scénario comme hypothétique et j'explique mon raisonnement.

**À relire** : [Culture d'entreprise : Désaccord et engagement](../../knowledge/culture-entreprise.md#desaccord-et-engagement), [Culture d'entreprise : Principe de la pyramide](../../knowledge/culture-entreprise.md#principe-de-la-pyramide)

## Mesurer le succès

Je sais que ma préparation marche quand mes réponses deviennent concrètes, pas quand j'ai lu toute la page. Avant de commencer, je note une base : je m'enregistre en répondant à dix questions tirées au hasard, et je compte combien de réponses contiennent une histoire vécue et un chiffre. Je refais la même mesure, sur dix autres questions, deux semaines plus tard. La métrique garde-fou est la durée : une réponse qui dépasse trois minutes perd l'intervieweur, même si elle est juste.

| Solution | Indicateur de succès (<span class="term" data-term="sli">SLI</span>) | <span class="term" data-term="slo">SLO</span> probable | <span class="term" data-term="sla">SLA</span> probable |
|---|---|---|---|
| une histoire vécue préparée par thème | part des thèmes de cette page pour lesquels j'ai une histoire STAR écrite | au moins 9 thèmes sur 11 | sans objet : pas de contrat externe |
| répondre avec la structure orale | part des réponses enregistrées qui donnent un résultat chiffré | au moins 7 réponses sur 10 | sans objet : pas de contrat externe |
| relire la section Knowledge liée | part des questions techniques où je cite le mécanisme et son coût sans regarder mes notes | au moins 8 sur 10 | sans objet : pas de contrat externe |
| s'entraîner sur les exercices en direct | nombre d'exercices faits à voix haute, chronométrés | les 13 exercices au moins une fois avant l'entretien | sans objet : pas de contrat externe |
| garder des réponses courtes | durée médiane d'une réponse enregistrée | entre 1 min 30 et 3 min | sans objet : pas de contrat externe |

[À prendre avec précaution : ordres de grandeur d'exemple, à ajuster selon le format de l'entretien]

## Pièges à éviter

| Piège | Ce qui se passe | Solution |
| --- | --- | --- |
| **Réciter la méthode** : je réponds au conditionnel (« je ferais ») à une question qui demande une histoire. | L'intervieweur n'entend aucune preuve que je l'ai déjà fait. | Je prépare une histoire vécue par thème et je la raconte avec STAR ([structure orale](#structure-simple-pour-repondre-a-loral)). |
| **Dire « on »** : je raconte ce que l'équipe a fait sans dire ma part. | Mon impact personnel reste invisible. | Je dis ce que j'ai décidé, fait ou débloqué moi, puis le résultat collectif ([impact Staff](#criteres-eliminatoires-les-erreurs-a-eviter)). |
| **Imposer par le titre** : je réponds qu'en tant que Staff, ma décision s'applique. | C'est un critère éliminatoire : le rôle repose sur l'influence, pas sur l'autorité. | Je montre comment je fais décider et comment je m'engage même quand je ne suis pas suivi ([influence](#comment-developper-linfluence-sans-autorite-hierarchique)). |
| **Citer sans expliquer** : je nomme Conway, Goodhart ou DORA sans dire ce que ça change. | La citation sonne comme une réponse apprise. | Je donne l'idée en une phrase, un exemple, puis sa limite ([décisions](#comment-choisir-entre-deux-architectures-techniquement-viables)). |
| **Promettre sans base** : j'annonce « on a gagné 30 % » sans mesure de départ. | La première question de relance fait tomber le chiffre. | Je cite une base, la même mesure après et une métrique garde-fou ([mesurer](#comment-mesurer-lefficacite-dune-demarche-qualite)). |
| **Devenir le passage obligatoire** : je décris un rôle où toutes les décisions passent par moi. | L'intervieweur entend un goulot d'étranglement, pas un Staff. | Je décris le cadre qui laisse les équipes décider seules ([autonomie](#comment-eviter-de-devenir-un-passage-obligatoire-pour-toutes-les-decisions-techniques)). |
| **Sauter les questions de cadrage** : en exercice, je propose une solution dès la fin de l'énoncé. | Je réponds à un problème que l'intervieweur n'a pas posé. | Je pose deux ou trois questions (volume, équipes, existant) avant de proposer ([exercices](exercices.md)). |
