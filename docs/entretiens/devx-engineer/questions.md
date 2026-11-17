# Entretien DevX Engineer : les questions

!!! warning "Avertissement"
    Ces notes sont des pense-bêtes personnels, pas une source de vérité. Elles reflètent ma compréhension et mes choix : leur contenu reste subjectif, malgré les citations et les références qu'il contient. Il peut être incomplet, simplifié, inexact ou dépassé. Vérifiez toujours dans la documentation officielle avant de l'appliquer. Ce contenu est fourni tel quel, sans aucune garantie : son utilisation se fait sous votre seule responsabilité.

!!! audience "Pour qui, pour quoi"
    - **Métiers** : ingénieur DevX, ingénieur plateforme, ingénieur DevOps ou SRE qui vise un poste DevX, tech lead chargé de l'outillage, QA qui évolue vers l'outillage des équipes.
    - **Usages** : je prépare un entretien DevX dans une semaine et je veux la liste des questions avec un plan de réponse ; la veille de l'entretien, je relis un seul thème, comme la CI ; je cherche quelle page Knowledge explique une notion que je veux citer, comme les métriques DORA ; je prépare une histoire vécue par thème, comme une CI que j'ai accélérée.

Cette page liste, thème par thème, les questions qu'on pose à un DevX Engineer, telles que le recruteur les formule. Pour chaque question, je lis le plan de réponse (quelques lignes, à la première personne), puis j'ouvre la section Knowledge liée, qui donne l'explication complète, les exemples et les pièges. Le plan ne se récite pas : il sert à structurer **une histoire vécue**, avec mes propres chiffres (minutes de CI gagnées, temps de mise en route, taux d'adoption). Quand je n'ai pas vécu un cas, je le présente comme un scénario et j'explique mon raisonnement.

Beaucoup de questions DevX veulent dire en réalité « racontez-moi une fois où vous avez amélioré le quotidien des développeurs » : le recruteur attend « j'ai fait », pas « je ferais ». Les exercices en direct, avec configurations, scripts et requêtes corrigés, sont dans [Entretien DevX Engineer : les exercices](exercices.md).

## Le rôle et la plateforme comme produit

### « Qu'est-ce que la Developer Experience, et en quoi un DevX Engineer diffère-t-il d'un DevOps ou d'un SRE ? »

- Je définis la <span class="term" data-term="developer-experience">Developer Experience</span> par ses effets : tout ce qui se passe entre l'idée d'un développeur et son code en production (installer, comprendre, tester, attendre la CI, déployer, trouver la doc).
- Mon client, c'est le développeur, pas le serveur de production : le SRE protège la fiabilité, le DevOps outille la livraison, l'<span class="term" data-term="platform-team">équipe plateforme</span> fournit l'infrastructure en libre-service.
- Ma question de départ est différente : où les développeurs perdent-ils du temps ou de l'énergie, et qu'est-ce qui changerait le plus leur journée ?
- Je cite le <span class="term" data-term="devex-framework">DevEx framework</span> (Noda, Storey, Forsgren et Greiler, ACM Queue, 2023) : boucle de retour, charge cognitive, état de concentration.
- Exemple : premier mois d'un poste créé dans une organisation de 150 développeurs, j'observe, je mesure et je publie trois frictions chiffrées.

**À relire** : [Boucle interne et boucle externe](../../knowledge/devx.md#boucle-interne-et-boucle-externe), [Platform engineering](../../knowledge/devx.md#platform-engineering-la-plateforme-comme-produit), [SPACE et DevEx](../../knowledge/livraison.md#mesurer-lexperience-developpeur-space-et-devex), [Team Topologies](../../knowledge/culture-entreprise.md#team-topologies)

### « Comment traites-tu une plateforme interne comme un produit ? », « Quand créer une équipe plateforme ? »

- Je pars des utilisateurs (les développeurs) et de leurs tâches fréquentes : créer un service, le déployer, lire ses logs.
- Je livre d'abord la plus petite plateforme utile, qui résout une tâche de bout en bout (Thinnest Viable Platform, « Team Topologies », 2019), plutôt que dix fonctions à moitié finies.
- Je publie une feuille de route et un canal de retour, et je mesure l'<span class="term" data-term="adoption">adoption</span> volontaire, pas seulement la disponibilité.
- Si une équipe contourne la plateforme, c'est un signal produit, pas un manque de discipline : je vais voir ce que ses scripts font que l'outil ne fait pas.
- Je crée une équipe plateforme quand l'équipe infrastructure reçoit chaque semaine les mêmes tickets (« créer une base », « créer un dépôt »).

**À relire** : [Platform engineering](../../knowledge/devx.md#platform-engineering-la-plateforme-comme-produit), [Jobs to be done](../../knowledge/culture-entreprise.md#jobs-to-be-done), [CNCF Platforms White Paper](../../knowledge/textes-fondateurs.md#cncf-platforms-white-paper-2023)

### « Comment trouves-tu les vrais points de friction des développeurs ? », « Notre équipe livre lentement, comment trouves-tu pourquoi ? »

- Je croise trois sources : ce que les développeurs disent (entretiens, enquête courte), ce que j'observe en faisant une tâche réelle avec eux, et ce que les outils mesurent (durée de CI, attente de revue).
- J'observe parce que beaucoup de <span class="term" data-term="process-friction">frictions</span> sont devenues invisibles : un `.env` copié à la main « c'est normal ».
- Je dessine une <span class="term" data-term="value-stream-mapping">cartographie du flux de valeur</span> (Rother et Shook, « Learning to See », 1999) d'une modification typique, avec temps de travail et temps d'attente.
- Je cherche la contrainte (Goldratt, « The Goal », 1984) : souvent 4 jours d'attente sur 5, et la CI ne pèse que quelques minutes.
- Je chiffre chaque friction (fréquence, durée, personnes touchées) et je fais valider la carte par les équipes.

**À relire** : [Cartographie du flux de valeur](../../knowledge/culture-entreprise.md#cartographie-du-flux-de-valeur), [Théorie des contraintes](../../knowledge/culture-entreprise.md#theorie-des-contraintes), [Loi de Little et limites de WIP](../../knowledge/culture-entreprise.md#loi-de-little-et-limites-de-wip), [Mesurer sans surveiller](../../knowledge/devx.md#mesurer-sans-surveiller), [Trouver les frictions en observant](../../knowledge/devx.md#trouver-les-frictions-en-observant)

## Mesurer l'expérience et la productivité

### « Comment mesures-tu la developer experience sans surveiller les individus ? »

- Je mesure des équipes et des systèmes, jamais des personnes : dès qu'un chiffre juge quelqu'un, il est manipulé, c'est la <span class="term" data-term="goodhart-law">loi de Goodhart</span> (1975).
- Je croise des <span class="term" data-term="perceptual-measure">mesures perceptuelles</span> (enquête) et des mesures système (durée de CI, délai de revue), comme le recommande le <span class="term" data-term="space-framework">cadre SPACE</span> (Forsgren et al., ACM Queue, 2021).
- Peu d'indicateurs, chacun relié à une décision possible.
- Une charte publique : ce qu'on mesure, à quoi ça sert, ce qu'on s'interdit (commits ou lignes par personne).
- Exemple : un tableau par équipe en trois blocs, flux de livraison, boucle de retour, perception, montré aux équipes avant la direction.

**À relire** : [Mesurer sans surveiller](../../knowledge/devx.md#mesurer-sans-surveiller), [SPACE et DevEx](../../knowledge/livraison.md#mesurer-lexperience-developpeur-space-et-devex), [Loi de Goodhart](../../knowledge/lois-et-principes.md#loi-de-goodhart), [Éviter le piège de Goodhart](../../knowledge/culture-entreprise.md#eviter-le-piege-de-goodhart)

### « Quelles sont les métriques DORA, et comment les utilises-tu dans une démarche DevX ? »

- Les quatre <span class="term" data-term="dora-metrics">métriques DORA</span> (« Accelerate », 2018, et les rapports State of DevOps depuis 2014) : fréquence de déploiement, <span class="term" data-term="lead-time">délai de livraison</span>, taux d'échec des changements, temps de restauration ; les éditions récentes en redéfinissent certaines, à vérifier.
- Je les calcule automatiquement depuis la forge, l'outil de déploiement et l'outil d'incidents, jamais par saisie.
- C'est un thermomètre : il dit où ça coince, pas pourquoi. Je découpe le délai en étapes (revue, CI, attente du déploiement).
- Je compare une équipe à elle-même dans le temps, et je lis vitesse et stabilité ensemble.
- Exemple : 6 jours de délai sur my-api, dont 3,7 jours d'attente du déploiement hebdomadaire [chiffres d'exemple].

**À relire** : [Mesurer la livraison : DORA](../../knowledge/livraison.md#mesurer-la-livraison-dora), [Accelerate](../../knowledge/textes-fondateurs.md#forsgren-humble-et-kim-accelerate-2018), [Exercice 5 : calculer les métriques DORA](exercices.md#exercice-5-calculer-les-metriques-dora-a-partir-des-donnees)

### « Comment conçois-tu une enquête développeurs utile ? »

- Une <span class="term" data-term="developer-survey">enquête</span> courte (moins de dix minutes), répétée chaque trimestre ou semestre avec les mêmes questions, pour suivre une tendance.
- Chaque question correspond à un levier (CI, documentation, environnement local, interruptions), sur une échelle de Likert (1932) de 1 à 5, plus une ou deux questions ouvertes.
- Un <span class="term" data-term="anonymity-threshold">seuil d'anonymat</span> : aucun groupe de moins de 5 réponses n'est affiché.
- Une synthèse publiée en deux semaines, avec trois actions : une enquête sans suite fait chuter le <span class="term" data-term="survey-response-rate">taux de réponse</span> de la suivante.
- Exemple : une enquête de 60 questions à 25 % de réponses devient 15 questions, relayées par les responsables d'équipe.

**À relire** : [Mesurer sans surveiller](../../knowledge/devx.md#mesurer-sans-surveiller), [Exercice 6 : analyser une enquête](exercices.md#exercice-6-analyser-une-enquete-developpeurs-sans-exposer-personne)

### « Comment chiffres-tu le retour sur investissement d'un chantier DevX ? », « Comment sais-tu que ton chantier DevX a servi ? »

- Sans <span class="term" data-term="baseline">mesure de départ</span>, aucun gain n'est démontrable : je mesure avant.
- Je calcule le temps récupéré (fréquence, personnes, minutes gagnées), avec des hypothèses écrites et un coefficient de prudence, parce que tout le monde n'attend pas devant l'écran.
- Exemple de calcul à voix haute : 120 développeurs, 4 pipelines par jour, 15 minutes gagnées, soit 120 h par jour, environ 7 équivalents temps plein après prudence, pour 4 mois-personne de chantier [chiffres d'exemple].
- Je compare au <span class="term" data-term="opportunity-cost">coût d'opportunité</span> et je cite le coût du retard (Reinertsen, 2009) pour classer les chantiers.
- Après coup : la même mesure, une métrique garde-fou (taux d'échec), et la même question d'enquête pour vérifier que le gain est ressenti.

**À relire** : [Retour sur investissement](../../knowledge/culture-entreprise.md#retour-sur-investissement), [Coût du retard](../../knowledge/culture-entreprise.md#cout-du-retard), [Mesurer le succès (DevX)](../../knowledge/devx.md#mesurer-le-succes), [Prouver la valeur d'un outil par un pilote](../../knowledge/devx.md#prouver-la-valeur-dun-outil-par-un-pilote)

## La boucle interne : poste de travail et environnement local

### « Un nouvel arrivant met deux jours à lancer les tests, que fais-tu ? », « Comment ramènes-tu la mise en route à une seule commande ? »

- Je chronomètre la <span class="term" data-term="project-setup">mise en route</span> sur un poste neuf, en notant chaque blocage.
- Je mets dans le dépôt ce qui était dans la tête des gens : versions d'outils lues par un <span class="term" data-term="tool-version-manager">gestionnaire de versions</span> comme mise, dépendances figées par un <span class="term" data-term="lockfile">lockfile</span>, services locaux dans Docker Compose.
- Je fournis `setup` et `doctor`, qui dit précisément ce qui manque et comment corriger (« Scripts to Rule Them All », GitHub, 2015).
- Une CI hebdomadaire rejoue la mise en route sur une image vierge, pour qu'elle ne casse pas en silence.
- Objectif mesurable : moins de 30 minutes entre le clone et le premier test vert, vérifié avec le prochain arrivant.

**À relire** : [Mettre un projet en route en une commande](../../knowledge/devx.md#mettre-un-projet-en-route-en-une-commande), [Outils de développement : mise, uv](../../knowledge/outils.md#outils-de-developpement-mise-uv-ruff-yarn), [Manifeste et lockfile](../../knowledge/gestionnaires-paquets.md#manifeste-et-lockfile), [Exercice 3 : script doctor](exercices.md#exercice-3-ecrire-un-script-de-diagnostic-du-poste-doctor)

### « Comment accélères-tu la boucle interne (modifier, compiler, tester) ? »

- La <span class="term" data-term="inner-loop">boucle interne</span> se répète des dizaines de fois par heure : au-delà de quelques secondes, le développeur change de fenêtre (Nielsen, « Response Time Limits », 1993).
- Je mesure un tour typique, puis trois principes : ne lancer que ce qui est touché, garder ce qui est prêt (<span class="term" data-term="hot-reload">rechargement à chaud</span>, cache, base qui reste démarrée), laisser les contrôles longs à la <span class="term" data-term="outer-loop">boucle externe</span>.
- Exemple : my-api reconstruit une image à chaque essai, 2 minutes ; avec le code monté en volume et `uvicorn --reload`, une seconde ; `pytest --lf` relance seulement le test en échec.
- Je documente ce mode comme le mode par défaut dans `mise run dev`.

**À relire** : [Accélérer la boucle interne](../../knowledge/devx.md#accelerer-la-boucle-interne), [Docker Compose et code monté par un volume](../../knowledge/devx.md#docker-compose-et-code-monte-par-un-volume)

### « Comment rends-tu l'environnement local proche de la production sans le rendre lourd ? »

- Je ne copie pas la production : je cherche la <span class="term" data-term="dev-prod-parity">parité</span> là où les écarts ont déjà causé des bugs (même moteur et version de base, même langage, mêmes migrations), facteur X de The Twelve-Factor App (2011).
- Exemple : SQLite en local, PostgreSQL en production, deux bugs en production ; je passe à un vrai PostgreSQL avec <span class="term" data-term="testcontainers">Testcontainers</span>, version écrite à un seul endroit.
- Pour un prestataire externe, une <span class="term" data-term="service-double">doublure</span> vérifiée par des <span class="term" data-term="contract-test">tests de contrat</span>.
- Pour ce qui ne tient pas sur un portable, un <span class="term" data-term="ephemeral-environment">environnement éphémère</span> dans le cluster.

**À relire** : [Environnement local ou distant](../../knowledge/devx.md#environnement-local-ou-distant), [Tests d'intégration avec Testcontainers](../../knowledge/qualite.md#tests-dintegration-avec-testcontainers), [Tests de contrat et mocks d'API](../../knowledge/qualite.md#tests-de-contrat-et-mocks-dapi), [The Twelve-Factor App](../../knowledge/textes-fondateurs.md#wiggins-the-twelve-factor-app-2011), [Quel environnement pour quel test](../../knowledge/devx.md#quel-environnement-pour-quel-test), [Simuler un tiers en erreur ou lent](../../knowledge/qualite.md#simuler-un-tiers-en-erreur-ou-lent)

### « Mon image fait 1 Go et se reconstruit en quatre minutes à chaque modification, que fais-tu ? »

- Le problème principal est l'ordre des couches : `COPY . .` avant l'installation invalide le <span class="term" data-term="docker-layer-cache">cache de couches</span> à chaque modification.
- Je copie d'abord le lockfile, j'installe, puis je copie le code ; j'ajoute un cache de montage BuildKit et un `.dockerignore`.
- Un <span class="term" data-term="multi-stage-build">build multi-étapes</span> donne une cible `dev` et une cible `prod`, slim, sans outils de test, avec un utilisateur non root.
- Je mesure la durée de construction et la taille avant et après, puis je mets ce Dockerfile dans le template de service.

**À relire** : [Image multi-étapes](../../knowledge/kubernetes.md#image-multi-etapes-rapide-a-reconstruire-legere-en-production), [Exercice 2 : Dockerfile](exercices.md#exercice-2-rendre-un-dockerfile-rapide-a-reconstruire)

## La boucle externe : CI/CD

### « Notre CI met 30 minutes, par quoi commences-tu ? », « Comment divises-tu par deux la durée d'une CI ? »

- Je mesure d'abord : durée de chaque job au p50 et au <span class="term" data-term="p95">p95</span>, attente de runner, <span class="term" data-term="critical-path">chemin critique</span>, taux de relance.
- Seul le chemin critique fixe la durée (théorie des contraintes, Goldratt, 1984) : je supprime les attentes avant d'optimiser un job.
- Puis `needs` pour paralléliser, un cache dont la clé est le lockfile, des <span class="term" data-term="test-shard">shards</span> de tests, et `rules: changes` pour ne lancer que le nécessaire.
- Exemple : 28 minutes en série deviennent environ 5 minutes de chemin critique [chiffres d'exemple].
- Je surveille deux semaines les tests qui dépendent de l'ordre, puis j'en fais un composant partagé ; Fowler (« Continuous Integration », 2000, révisé en 2024) cite un objectif de l'ordre de dix minutes.

**À relire** : [Une CI rapide et fiable](../../knowledge/devx.md#une-ci-rapide-et-fiable), [Paralléliser sans casser](../../knowledge/qualite.md#paralleliser-sans-casser), [Théorie des contraintes](../../knowledge/culture-entreprise.md#theorie-des-contraintes), [Exercice 1 : pipeline de CI](exercices.md#exercice-1-diviser-par-deux-la-duree-dun-pipeline-de-ci)

### « Que fais-tu d'un test instable ? », « Comment traites-tu les tests instables à l'échelle de l'organisation ? »

- Un <span class="term" data-term="flaky-test">test instable</span> coûte deux fois : des relances, et des équipes qui apprennent à ignorer le rouge.
- Je le définis comme un test qui échoue et réussit sur le même commit, et je le détecte automatiquement à partir des rapports JUnit stockés.
- Je le mets en <span class="term" data-term="test-quarantine">quarantaine</span> : il tourne toujours mais ne bloque plus, avec un ticket, une équipe propriétaire et une date limite (Micco, Google Testing Blog, 2016).
- Pas de relance automatique silencieuse comme solution durable.
- Je publie un indicateur (pipelines échoués à cause d'un test instable) et je salue les équipes qui réparent.

**À relire** : [Test instable](../../knowledge/qualite.md#test-instable-flaky), [Stratégie face à un test instable](../../knowledge/qualite.md#strategie-face-a-un-test-instable), [Garder l'historique](../../knowledge/qualite.md#garder-lhistorique), [Exercice 4 : tests instables](exercices.md#exercice-4-detecter-et-mettre-en-quarantaine-les-tests-instables), [Mettre en quarantaine sans bloquer](../../knowledge/qualite.md#mettre-en-quarantaine-sans-bloquer)

### « Comment fournis-tu des modèles de CI réutilisables sans bloquer les équipes ? »

- Un modèle qui couvre le cas courant sans configuration : un dépôt Python l'inclut en trois lignes et obtient lint, tests, analyse de sécurité et image.
- Je le publie comme un <span class="term" data-term="versioned-component">composant versionné</span>, avec <span class="term" data-term="semantic-versioning">SemVer</span> (spécification 2.0.0, 2013) : chaque équipe choisit quand passer à la majeure.
- Des paramètres pour les variations fréquentes, pour que personne n'ait besoin de copier le modèle.
- Exemple : 40 copies divergentes d'un `.gitlab-ci.yml` deviennent un composant, migré sur 5 dépôts pilotes, puis par MR automatiques avec Renovate.
- Une faille dans l'image de base se corrige alors une fois, pour tout le monde.

**À relire** : [Composant de CI partagé et versionné](../../knowledge/devx.md#composant-de-ci-partage-et-versionne), [SemVer](../../knowledge/devx.md#semver-le-contrat-dune-bibliotheque-dune-cli-ou-dun-composant-interne), [CI/CD : GitLab CI, Renovate](../../knowledge/outils.md#cicd-et-qualite-du-code-gitlab-ci-sonarqube-renovate)

### « Comment gardes-tu les dépendances à jour sans y passer ta vie ? »

- Un <span class="term" data-term="dependency-update-bot">robot de mise à jour</span> (Renovate) ouvre les MR, la CI les vérifie.
- Fusion automatique des correctifs verts, majeures planifiées, et un indicateur des majeures en retard.
- Le lockfile est commité, et la CI installe exactement ce qu'il dit (`uv sync --frozen`, `npm ci`).
- Côté sécurité : registre unique, empreintes dans le lockfile, délai minimum avant d'adopter une version toute neuve.

**À relire** : [Mettre à jour les dépendances](../../knowledge/gestionnaires-paquets.md#mettre-a-jour-les-dependances), [Manifeste et lockfile](../../knowledge/gestionnaires-paquets.md#manifeste-et-lockfile), [Sécuriser l'installation](../../knowledge/gestionnaires-paquets.md#securiser-linstallation)

### « Le product owner attend le staging pour valider les écrans, que proposes-tu ? »

- Je vérifie d'abord qui consulte ces environnements, et pour quoi faire.
- Un <span class="term" data-term="preview-environment">environnement de prévisualisation</span> par MR, créé par la CI, adresse publiée dans la MR, détruit à la fusion ou après cinq jours sans commit.
- Au départ, le front seulement, branché sur les API de l'<span class="term" data-term="integration-env">environnement d'intégration</span>, sans dupliquer tout le système.
- Les vraies difficultés : données d'amorçage fictives, secrets de test distincts de la production, plafond de coût.
- Je mesure les retours tardifs du product owner, et j'étends aux back-ends les plus demandés si le besoin se confirme.

**À relire** : [Environnement de prévisualisation par merge request](../../knowledge/devx.md#environnement-de-previsualisation-par-merge-request), [Environnements](../../knowledge/kubernetes.md#environnements), [Quel environnement pour quel test](../../knowledge/devx.md#quel-environnement-pour-quel-test)

## Golden paths, scaffolding et libre-service

### « Qu'est-ce qu'un golden path, et comment le construis-tu ? », « Golden path ou règle imposée ? »

- Un <span class="term" data-term="golden-path">golden path</span> (Spotify Engineering, 2020) est la réponse outillée à « comment fait-on ici pour... ».
- Je le construis pour le cas le plus courant (un service HTTP Python avec PostgreSQL), de bout en bout : template, CI prête, déploiement, tableaux de bord et alertes de base.
- Je le rends plus facile que les alternatives, sans l'imposer : une équipe peut en sortir en prenant en charge sa différence (paved road).
- Je lui donne un propriétaire : un chemin balisé non entretenu devient un piège.
- Exemple : créer un service passe de trois semaines à un déploiement en intégration le jour même.

**À relire** : [Golden paths et templates](../../knowledge/devx.md#golden-paths-et-templates), [Platform engineering](../../knowledge/devx.md#platform-engineering-la-plateforme-comme-produit)

### « Comment éviter qu'un template de service vieillisse dès sa création ? »

- Je mets le minimum dans le template, le maximum dans des briques partagées et versionnées (composant de CI, image de base, bibliothèque de logs) : les mises à jour arrivent par une montée de version.
- Pour la partie générée, un outil de <span class="term" data-term="scaffolding">scaffolding</span> qui sait mettre à jour, comme Copier (`copier update`) ou cruft pour cookiecutter.
- La CI du template génère un projet et lance ses tests à chaque modification.
- Je mesure la <span class="term" data-term="template-drift">dérive</span> : la part des services à jour, affichée dans le catalogue.

**À relire** : [Golden paths et templates](../../knowledge/devx.md#golden-paths-et-templates), [Exercice 7 : template et dérive](exercices.md#exercice-7-tester-un-template-de-service-et-suivre-sa-derive)

### « Comment offres-tu de l'infrastructure en libre-service sans perdre le contrôle ? »

- Je pars des tickets : quelles demandes reviennent, combien de temps elles attendent.
- Pour les plus fréquentes (base, bucket, secret), un module d'<span class="term" data-term="infrastructure-as-code">infrastructure as code</span> standard avec les bonnes valeurs par défaut (chiffrement, sauvegardes, étiquettes de coût).
- Les validations humaines deviennent des <span class="term" data-term="guardrail">garde-fous</span> automatiques en <span class="term" data-term="policy-as-code">policy as code</span> (Open Policy Agent, gradué à la CNCF en 2021) : une base sans sauvegarde est refusée par la CI.
- Chaque ressource a une équipe propriétaire et un coût visible.
- Exemple : obtenir une base passe de huit jours à moins d'une heure [chiffres d'exemple].

**À relire** : [Platform engineering](../../knowledge/devx.md#platform-engineering-la-plateforme-comme-produit), [Terraform et OpenTofu](../../knowledge/outils.md#terraform-et-opentofu-le-standard-declaratif), [Crossplane](../../knowledge/outils.md#crossplane-linfrastructure-pilotee-par-kubernetes)

### « Comment fais-tu évoluer une bibliothèque, un SDK ou une CLI interne sans casser ses utilisateurs ? »

- Chaque <span class="term" data-term="breaking-change">rupture de compatibilité</span> coûte cher, car j'ai des utilisateurs que je ne connais pas tous (loi de Hyrum).
- Le principe <span class="term" data-term="open-closed">ouvert/fermé</span> devient un <span class="term" data-term="extension-point">point d'extension</span> : une équipe écrit un plugin au lieu de modifier le cœur.
- Des modules petits et ciblés, des dépendances injectables, des <span class="term" data-term="sensible-default">valeurs par défaut raisonnables</span> et le principe de <span class="term" data-term="least-astonishment">moindre surprise</span>.
- SemVer comme contrat, une sortie `--output json` traitée comme une API, et une <span class="term" data-term="deprecation">politique de dépréciation</span> : avertissement pendant deux mineures, retrait en majeure.
- Exemple : une CLI `devctl` avec 80 options et une demande par semaine passe à un système de plugins.

**À relire** : [SemVer](../../knowledge/devx.md#semver-le-contrat-dune-bibliotheque-dune-cli-ou-dun-composant-interne), [O : ouvert/fermé](../../knowledge/principes-conception.md#o-ouvertferme), [Principes des composants](../../knowledge/principes-conception.md#principes-des-composants), [Principe de moindre surprise](../../knowledge/principes-conception.md#principe-de-moindre-surprise), [Loi de Hyrum](../../knowledge/lois-et-principes.md#loi-de-hyrum), [Points d'extension par plugins](../../knowledge/principes-conception.md#points-dextension-par-plugins)

### « Que fais-tu quand une équipe veut sortir du chemin balisé ? »

- Je commence par comprendre : une demande d'écart est souvent un <span class="term" data-term="product-signal">signal produit</span>.
- Je sépare le non négociable (sécurité, secrets, traçabilité des déploiements) de ce qui peut varier (langage, framework).
- L'équipe qui sort prend en charge le <span class="term" data-term="cost-of-difference">coût de sa différence</span> : sa CI, ses mises à jour, sa documentation d'astreinte.
- J'écris l'écart dans un ADR (Nygard, 2011) ; si trois équipes demandent le même écart, il entre dans le chemin.
- Exemple : un service Go pour 5 000 messages par seconde, accepté avec ses obligations communes.

**À relire** : [Golden paths et templates](../../knowledge/devx.md#golden-paths-et-templates), [Concevoir avant de coder](../../knowledge/livraison.md#concevoir-avant-de-coder), [Tech radar](../../knowledge/outils.md#tech-radar-thoughtworks-byor-zalando-aoe-cncf), [Dérogations et architecture cible](../../knowledge/architecture.md#derogations-et-architecture-cible)

## Portail développeur et documentation

### « Faut-il mettre en place un portail développeur comme Backstage ? »

- Je pars des questions sans réponse : à qui appartient ce service, où est sa doc, comment créer un service ?
- Un <span class="term" data-term="developer-portal">portail développeur</span> se justifie à partir de quelques dizaines de services ; Backstage (Spotify, open source en 2020) est une application à faire vivre, avec une équipe.
- Je commence par le <span class="term" data-term="service-catalog">catalogue de services</span>, rempli automatiquement par un `catalog-info.yaml` par dépôt, vérifié par la CI : un catalogue faux est pire que pas de catalogue.
- Je mesure l'usage (visites, recherches sans résultat, services sans propriétaire) avant d'ajouter des plugins, et je compare au <span class="term" data-term="total-cost-ownership">coût total</span> d'un portail commercial.

**À relire** : [Portail développeur et catalogue](../../knowledge/devx.md#portail-developpeur-et-catalogue), [Collaboration : Backstage](../../knowledge/outils.md#collaboration-jira-confluence-slack-backstage), [Coût total de possession](../../knowledge/culture-entreprise.md#cout-total-de-possession)

### « Comment traites-tu la documentation comme un produit ? », « On te pose les mêmes questions chaque semaine dans le canal d'aide, que fais-tu ? »

- Je pars des questions réelles du canal de support : sur un mois, les vingt plus fréquentes.
- Je mets la doc technique dans le dépôt, en <span class="term" data-term="docs-as-code">docs as code</span> : modifiée dans la même MR que le code, relue, publiée par la CI.
- Je sépare les types de pages avec <span class="term" data-term="diataxis">Diátaxis</span> (Procida, à partir de 2017 environ) : tutoriel, guide pratique, référence, explication.
- Je mesure pages lues, recherches sans résultat et fraîcheur, et je supprime ce qui est faux : une page fausse fait plus de dégâts qu'une page manquante.

**À relire** : [Documentation](../../knowledge/devx.md#documentation)

### « Comment réduis-tu le temps d'onboarding d'un nouvel arrivant ? »

- Deux mesures : le <span class="term" data-term="time-to-first-change">délai jusqu'au premier changement</span> en production, et le ressenti à trente jours.
- J'enlève les blocages un par un : accès créés automatiquement selon l'équipe, poste installé par script, chaque projet démarrable en une commande.
- Une liste de petites tâches réelles et un référent pour l'<span class="term" data-term="onboarding">onboarding</span>.
- Chaque arrivant corrige la doc qui l'a bloqué : il est le mieux placé pour voir ce qui manque.
- Exemple : de trois semaines à une MR fusionnée en production dans les trois premiers jours [chiffres d'exemple].

**À relire** : [Onboarding](../../knowledge/devx.md#onboarding), [Mettre un projet en route en une commande](../../knowledge/devx.md#mettre-un-projet-en-route-en-une-commande)

## Adoption, migrations et dépréciations

### « Comment fais-tu adopter un outil sans l'imposer ? », « Ton outil n'est utilisé que par trois équipes sur vingt, que fais-tu ? »

- Un développeur adopte un outil quand il gagne quelque chose dès la première utilisation : je pars d'un problème ressenti.
- Je commence avec des <span class="term" data-term="early-adopters">équipes volontaires</span>, puis je franchis le gouffre vers la majorité (Rogers, 1962 ; Moore, « Crossing the Chasm », 1991) avec le témoignage de pairs.
- Je réduis le <span class="term" data-term="switching-cost">coût de bascule</span> : une MR de migration générée vaut mieux qu'un guide de vingt pages ; j'intègre l'outil au template.
- J'interroge cinq équipes qui ne l'utilisent pas, sans chercher à convaincre, et je corrige le frein le plus fréquent.
- Je suis les équipes actives chaque mois par une <span class="term" data-term="usage-telemetry">télémétrie d'usage</span> anonyme par équipe.

**À relire** : [Faire adopter un outil sans l'imposer](../../knowledge/devx.md#faire-adopter-un-outil-sans-limposer), [Exercice 9 : télémétrie d'une CLI](exercices.md#exercice-9-mesurer-lusage-dune-cli-interne-sans-surveiller-les-developpeurs), [Influence sans autorité et communautés de pratique](../../knowledge/culture-entreprise.md#influence-sans-autorite-et-communautes-de-pratique), [Télémétrie d'usage d'un outil interne ou d'une CLI](../../knowledge/devx.md#telemetrie-dusage-dun-outil-interne-ou-dune-cli)

### « Comment retires-tu un outil interne encore utilisé par de nombreuses équipes ? »

- Je fais l'inventaire des usages par l'arbre syntaxique et les journaux d'appel ; la <span class="term" data-term="hyrum-law">loi de Hyrum</span> garantit des usages inattendus.
- Je m'assure que le remplaçant couvre les cas réels, puis j'annonce un calendrier : avertissement à l'import, gel des nouveaux usages par une <span class="term" data-term="lint-rule">règle de lint</span>, arrêt.
- Un <span class="term" data-term="codemod">codemod</span> ouvre les MR pour les cas courants, et j'accompagne directement les derniers.
- L'équipe qui retire l'outil porte le coût de la migration (« Software Engineering at Google », 2020, chapitre « Deprecation ») ; un tableau public montre les dépôts restants.

**À relire** : [Migrations à grande échelle](../../knowledge/devx.md#migrations-a-grande-echelle), [SemVer et dépréciation](../../knowledge/devx.md#semver-le-contrat-dune-bibliotheque-dune-cli-ou-dun-composant-interne), [Strangler Fig](../../knowledge/textes-fondateurs.md#fowler-strangler-fig-application-2004), [Exercice 8 : retrait d'une bibliothèque](exercices.md#exercice-8-preparer-le-retrait-dune-bibliotheque-interne), [Geler les nouveaux usages d'un module déprécié](../../knowledge/devx.md#geler-les-nouveaux-usages-dun-module-deprecie), [Télémétrie d'usage d'un outil interne ou d'une CLI](../../knowledge/devx.md#telemetrie-dusage-dun-outil-interne-ou-dune-cli)

### « Comment fais-tu passer 300 dépôts à une nouvelle version sans y passer un an ? »

- À cette échelle, une migration est un programme, pas une consigne : un script ou un codemod fait la modification, un outil ouvre une MR par dépôt.
- Je teste sur une dizaine de dépôts représentatifs, puis je lance par vagues pour ne saturer ni la CI ni les relecteurs.
- Je suis une <span class="term" data-term="migration-campaign">campagne</span> avec un tableau par dépôt (MR ouverte, CI verte, fusionnée) et je classe les échecs par cause pour corriger l'outil, pas chaque dépôt.
- Pour la partie versions, Renovate suffit souvent ; la queue de la migration demande une aide individuelle.
- Exemple : Python 3.9 vers 3.12 sur 300 dépôts avant la fin du support.

**À relire** : [Migrations à grande échelle](../../knowledge/devx.md#migrations-a-grande-echelle), [Exemple de codemod](../../knowledge/devx.md#exemple-de-codemod-changer-un-import-dans-48-depots), [Mettre à jour les dépendances](../../knowledge/gestionnaires-paquets.md#mettre-a-jour-les-dependances)

## Assistants de code IA

!!! info "Section rédigée en novembre 2026"
    Les outils d'IA pour le code, leurs conditions d'utilisation et les études sur leurs effets évoluent très vite. Les chiffres et les noms d'outils sont à vérifier au moment de la lecture.

### « Comment déploierais-tu un assistant de code IA dans les équipes ? »

- D'abord le cadre, avec sécurité et juridique : données envoyées au fournisseur, utilisées ou non pour l'<span class="term" data-term="model-training">entraînement</span>, <span class="term" data-term="secret">secrets</span> dans le code, droits d'un agent qui exécute des commandes.
- Une <span class="term" data-term="ai-usage-policy">politique d'usage</span> d'une page : données interdites, revue humaine obligatoire, compte de service aux droits limités.
- Un pilote de quelques semaines avec des équipes variées (pas seulement les enthousiastes) et une mesure de départ.
- Une formation concrète par langage, et des fichiers d'instructions dans les dépôts (`AGENTS.md`), utiles aussi aux humains.
- Mêmes règles qu'avant : tout code fusionné est relu et passe la CI ; je surveille la taille des MR.

**À relire** : [Assistants de code IA](../../knowledge/devx.md#assistants-de-code-ia), [Écrire un fichier d'instructions efficace](../../knowledge/ia-agents.md#ecrire-un-fichier-dinstructions-efficace), [Ce que l'AI Act change pour une équipe de dev](../../knowledge/ia-entreprise.md#ce-que-ca-change-pour-une-equipe-de-dev-et-de-qa), [Exercice 10 : assistant IA](exercices.md#exercice-10-etude-de-cas-deployer-un-assistant-de-code-ia), [Prouver la valeur d'un outil par un pilote](../../knowledge/devx.md#prouver-la-valeur-dun-outil-par-un-pilote)

### « Comment mesures-tu l'effet réel des assistants IA, sans surveiller les personnes ? »

- Je ne m'arrête pas au <span class="term" data-term="acceptance-rate">taux d'acceptation</span> des suggestions : c'est une mesure d'activité, fournie par le vendeur.
- Je mesure le flux (délai, taux d'échec, taille des MR, temps de revue) et le ressenti, avant et après, avec un <span class="term" data-term="comparison-group">groupe de comparaison</span>.
- Je cite les deux études en les qualifiant : environ 55 % plus rapide sur une tâche isolée (Peng et al., prépublication, 2023) [À prendre avec précaution : une seule tâche, auteurs liés au fournisseur] ; 19 % plus lent alors que les développeurs se croyaient plus rapides (METR, juillet 2025) [À prendre avec précaution : 16 développeurs, outils du début de 2025].
- Pour l'usage, des compteurs par équipe sans contenu, en sachant qu'un mode « anonyme » est souvent une pseudonymisation.
- Aucun chiffre externe ne remplace une mesure sur notre propre flux, surtout avant une décision de recrutement.

**À relire** : [Assistants de code IA](../../knowledge/devx.md#assistants-de-code-ia), [Mesurer l'usage d'un assistant IA en équipe](../../knowledge/ia-entreprise.md#mesurer-lusage-dun-assistant-ia-en-equipe), [Anonymisation ou pseudonymisation](../../knowledge/ia-entreprise.md#pourquoi-le-mode-anonyme-est-en-realite-de-la-pseudonymisation), [Décider avec les données](../../knowledge/donnees-decision.md#decider-avec-les-donnees)

## Vision du rôle de DevX Engineer

### « Que ferais-tu pendant tes trois premiers mois ? »

- Mois 1, comprendre : une vingtaine d'entretiens, trois observations, une enquête, une première carte du flux et une <span class="term" data-term="baseline">mesure de départ</span> publiée ; je fais moi-même une contribution dans quelques dépôts.
- Mois 2, prouver : une ou deux <span class="term" data-term="quick-win">victoires rapides</span>, visibles et peu risquées, comme un cache dans le modèle de CI le plus utilisé.
- Mois 3, orienter : une feuille de route de trois à cinq chantiers chiffrés, avec ce que je ne ferai pas, validée par les équipes et la direction.
- Je regroupe les listes de demandes au lieu de les traiter une par une (Watkins, « The First 90 Days », 2003).

**À relire** : [Mesurer sans surveiller](../../knowledge/devx.md#mesurer-sans-surveiller), [Cartographie du flux de valeur](../../knowledge/culture-entreprise.md#cartographie-du-flux-de-valeur), [One-pager](../../knowledge/culture-entreprise.md#one-pager), [Les 90 premiers jours dans un nouveau rôle](../../knowledge/culture-entreprise.md#les-90-premiers-jours-dans-un-nouveau-role)

### « Comment priorises-tu quand tout le monde a une demande pour l'équipe DevX ? »

- Je regroupe les demandes en problèmes communs, puis je les classe par impact (développeurs touchés, fréquence, temps perdu) et par taille.
- Un critère partagé : le <span class="term" data-term="cost-of-delay">coût du retard</span> divisé par la durée (CD3, ou WSJF chez SAFe).
- Je réserve une part de <span class="term" data-term="reserved-capacity">capacité</span>, par exemple 20 %, au support et à la maintenance.
- Je préfère souvent aider une équipe à devenir autonome, en <span class="term" data-term="enabling-team">équipe d'accompagnement</span>, plutôt que tout prendre en charge.
- Je publie le tableau de priorisation, refus compris, avec la date de la prochaine revue.

**À relire** : [Coût du retard](../../knowledge/culture-entreprise.md#cout-du-retard), [Team Topologies](../../knowledge/culture-entreprise.md#team-topologies), [Loi de Little et limites de WIP](../../knowledge/culture-entreprise.md#loi-de-little-et-limites-de-wip)

## Choix d'outils

!!! info "Section rédigée en novembre 2026"
    Les fonctions et la maturité des outils cités changent vite. Je vérifie leur documentation officielle avant de les recommander.

### « Monorepo ou plusieurs dépôts, et avec quel outil de build ? »

- Je ne tranche pas sur le principe : je regarde la fréquence des changements multi-projets et le nombre de langages.
- Un <span class="term" data-term="monorepo">monorepo</span> rend un changement transverse atomique et garde une seule version de chaque dépendance, mais il exige une CI qui ne reconstruit que ce qui est touché, un <span class="term" data-term="remote-build-cache">cache de build distant</span> et un fichier <span class="term" data-term="codeowners">CODEOWNERS</span>.
- Le plus simple qui suffit : workspaces puis Nx ou Turborepo en JavaScript, Bazel ou Pants pour du multi-langage avec un <span class="term" data-term="hermetic-build">build hermétique</span> et une équipe pour les maintenir.
- Je migre par étapes (une bibliothèque et deux applications pilotes) et je mesure le délai entre une modification de la bibliothèque et son arrivée en production.
- La structure des dépôts finit par refléter celle des équipes (loi de Conway, 1968).

**À relire** : [Monorepo et workspaces](../../knowledge/gestionnaires-paquets.md#monorepo-et-workspaces), [Loi de Conway](../../knowledge/lois-et-principes.md#loi-de-conway), [Monorepo ou plusieurs dépôts : comment trancher](../../knowledge/gestionnaires-paquets.md#monorepo-ou-plusieurs-depots-comment-trancher)

### « Environnement de développement local ou distant : comment choisis-tu ? »

- Je pars du problème et je prends le plus léger qui suffit.
- Versions d'outils différentes : un gestionnaire de versions comme mise suffit.
- Beaucoup de services système : un <span class="term" data-term="devcontainer">Dev Container</span> (spécification ouverte containers.dev, 2022) décrit l'environnement dans le dépôt.
- Données qui ne doivent pas quitter le cloud, postes peu puissants : un <span class="term" data-term="remote-dev-environment">environnement distant</span> basé sur le même Dev Container, avec arrêt automatique pour le coût.
- Reproductibilité bit à bit et équipe à l'aise : <span class="term" data-term="nix">Nix</span>, au prix d'une courbe d'apprentissage raide.

**À relire** : [Environnement local ou distant](../../knowledge/devx.md#environnement-local-ou-distant)

### « Construire un outil interne, prendre de l'open source ou acheter un SaaS ? », « Comment ton entreprise choisit-elle ses technologies ? »

- Première question : cet outil nous différencie-t-il ? Une CI, un portail ou des feature flags, presque jamais ; un composant devenu commodité s'achète (cartes de Wardley, 2005).
- Je compare <span class="term" data-term="saas">SaaS</span> et <span class="term" data-term="open-source">open source</span> auto-hébergé sur trois ans, temps humain compris (maintenance, sécurité, astreinte).
- Un outil maison seulement pour un besoin vraiment spécifique, en sachant qu'il faudra le maintenir des années.
- Des formats ouverts pour garder une porte de sortie, comme <span class="term" data-term="openfeature">OpenFeature</span> (projet CNCF depuis 2022) pour les feature flags.
- Pour le choix des technologies, un radar d'entreprise avec ses quatre anneaux et la justification de chaque entrée.

**À relire** : [Construire, acheter ou s'associer](../../knowledge/culture-entreprise.md#construire-acheter-ou-sassocier), [Cartes de Wardley](../../knowledge/culture-entreprise.md#cartes-de-wardley), [Coût total de possession](../../knowledge/culture-entreprise.md#cout-total-de-possession), [Feature flags : Unleash](../../knowledge/outils.md#feature-flags-unleash), [Tech radar](../../knowledge/outils.md#tech-radar-thoughtworks-byor-zalando-aoe-cncf), [Tech radar d'entreprise](../../knowledge/architecture.md#tech-radar-dentreprise), [L'enfermement chez un fournisseur, un coût à chiffrer](../../knowledge/culture-entreprise.md#lenfermement-chez-un-fournisseur-un-cout-a-chiffrer), [OpenFeature : changer d'outil de flags sans toucher au code](../../knowledge/outils.md#openfeature-changer-doutil-de-flags-sans-toucher-au-code)

## Critères éliminatoires

Trois questions où une seule mauvaise réponse suffit à écarter un candidat DevX.

| Question du recruteur | Réponse qui élimine | Ce que je réponds | À relire |
|---|---|---|---|
| « Que réponds-tu si on te demande de classer les développeurs par productivité ? » | « Je peux sortir le nombre de commits et de lignes par personne depuis Git. » | Je refuse le classement individuel et j'explique pourquoi : la personne d'astreinte ou celle qui forme les nouveaux tomberait en bas, et la <span class="term" data-term="goodhart-law">loi de Goodhart</span> ferait manipuler le chiffre. Je propose des mesures par équipe et je remonte la demande par écrit si elle est maintenue. | [Mesurer sans surveiller](../../knowledge/devx.md#mesurer-sans-surveiller), [Loi de Goodhart](../../knowledge/lois-et-principes.md#loi-de-goodhart) |
| « Que fais-tu si personne n'utilise l'outil que tu as construit ? » | « Je demande à la direction de le rendre obligatoire », ou « les équipes ne comprennent pas son intérêt ». | C'est mon problème, pas celui des équipes : j'interroge celles qui ne l'utilisent pas, je corrige le frein principal ou je porte l'information là où elles sont déjà, et je sais archiver un outil qui ne sert pas. | [Faire adopter un outil sans l'imposer](../../knowledge/devx.md#faire-adopter-un-outil-sans-limposer), [Jobs to be done](../../knowledge/culture-entreprise.md#jobs-to-be-done) |
| « Faut-il rendre un outil obligatoire pour accélérer son adoption ? » | « Oui, c'est le plus rapide », ou « jamais, chaque équipe fait comme elle veut ». | Obligation légitime pour la sécurité et la conformité (analyse des dépendances, secrets), rendue facile à respecter ; adoption volontaire pour le confort ; l'obligation vient à la fin, comme une dépréciation annoncée de l'ancien outil. | [Faire adopter un outil sans l'imposer](../../knowledge/devx.md#faire-adopter-un-outil-sans-limposer), [Migrations à grande échelle](../../knowledge/devx.md#migrations-a-grande-echelle) |

## Les 3 choses qu'un DevX Engineer fait en permanence

1. **Partir des frictions réelles, mesurées.** J'observe, j'interroge et je mesure avant de construire. Exemple : avant d'accélérer la CI, je découpe le délai de livraison et je découvre que l'attente du déploiement hebdomadaire pèse plus que la CI.
2. **Rendre le bon chemin plus facile que les autres.** Templates, modèles de CI, environnements prêts et documentation fiable : la bonne pratique devient la plus simple. Exemple : la configuration des logs part dans une bibliothèque versionnée plutôt que dans une consigne.
3. **Traiter la plateforme comme un produit et vérifier son effet.** Je mesure adoption, satisfaction et effet sur le flux, j'écoute ceux qui n'adoptent pas, et je sais arrêter ce qui ne sert pas. Exemple : après un assistant IA, je compare délai et taux d'échec des équipes pilotes avec leurs chiffres d'avant.

## Structure simple pour répondre à l'oral

Pour une question de comportement (« raconte une fois où... »), je suis la <span class="term" data-term="star-method">méthode STAR</span> : la situation, la tâche qui m'incombait, l'action que j'ai menée, le résultat chiffré, puis ce que j'en ai appris ([Désaccord et engagement](../../knowledge/culture-entreprise.md#desaccord-et-engagement)). Pour une question de mise en situation, je déroule ce fil :

1. **Utilisateurs** : quels développeurs rencontrent quelle friction, à quelle fréquence ?
2. **Mesure** : quel est le chiffre de départ (minutes, jours, taux, note d'enquête) ?
3. **Options** : quelles solutions, de la plus légère à la plus lourde ?
4. **Décision** : pourquoi celle-ci, et ce que je ne fais pas.
5. **Adoption** : comment les équipes vont la découvrir, l'essayer et migrer.
6. **Résultat** : comment je vérifie que la friction a vraiment diminué.
7. **Bénéfices plus larges** : ce que la démarche améliore au-delà du problème immédiat.

L'idée centrale : un DevX Engineer ne construit pas des outils pour eux-mêmes. Il traite le quotidien des développeurs comme un produit, mesure les frictions, rend le bon chemin plus facile, accompagne l'adoption sans l'imposer, et vérifie que le travail des équipes s'en trouve amélioré.

## Mesurer le succès

On me demande presque toujours « comment sais-tu que ça a servi ? ». Ma réponse suit la même forme pour chaque chantier : une **base** mesurée avant (par exemple la durée de CI au p95 sur les deux dernières semaines), la **même mesure après**, sur une durée comparable, et une **métrique garde-fou** qui ne doit pas se dégrader (le taux d'échec des changements, ou le taux de relance des pipelines). Puis je donne, par solution, un <span class="term" data-term="sli">SLI</span> et un <span class="term" data-term="slo">SLO</span> interne ; un <span class="term" data-term="sla">SLA</span> n'a pas de sens ici, puisque les développeurs ne sont pas des clients sous contrat.

| Solution | Indicateur de succès (SLI) | SLO probable | SLA probable |
|---|---|---|---|
| CI accélérée (`needs`, cache, shards) | durée du pipeline au p95, lue dans la CI | sous 10 minutes sur 95 % des pipelines de `main` [À prendre avec précaution : valeur d'exemple, à fixer selon le dépôt] | sans objet : pas de contrat externe |
| mise en route en une commande | temps entre le clone et le premier test vert, chronométré avec chaque nouvel arrivant | moins de 30 minutes pour 9 arrivants sur 10 [À prendre avec précaution : valeur d'exemple] | sans objet : pas de contrat externe |
| quarantaine des tests instables | part des pipelines échoués à cause d'un test instable | moins de 2 % sur 14 jours glissants [À prendre avec précaution : seuil d'exemple, à fixer par l'organisation] | sans objet : pas de contrat externe |
| golden path de création de service | délai entre la demande et le premier déploiement en intégration | le jour même pour 90 % des services créés [À prendre avec précaution : valeur d'exemple] | sans objet : pas de contrat externe |
| documentation docs as code | questions répétées par semaine dans le canal d'aide | moitié moins qu'avant, sur un trimestre [À prendre avec précaution : valeur d'exemple] | sans objet : pas de contrat externe |
| adoption d'un outil interne | équipes actives par mois, lues dans la télémétrie anonyme | 15 équipes sur 20 en six mois [À prendre avec précaution : valeur d'exemple] | sans objet : pas de contrat externe |
| assistant de code IA | délai de livraison médian des équipes pilotes, comparé au groupe sans l'outil | en baisse, avec un taux d'échec des changements stable [À prendre avec précaution : objectif d'exemple, aucune étude externe ne fixe de valeur] | sans objet : pas de contrat externe |

## Pièges à éviter

| Piège | Ce qui se passe | Solution |
|---|---|---|
| **Commencer par l'outil** : je réponds « Backstage » ou « Bazel » avant d'avoir parlé des utilisateurs. | Le recruteur entend quelqu'un qui suit la mode, pas quelqu'un qui résout un problème. | Je nomme d'abord la friction et son chiffre, puis l'outil le plus léger qui suffit ([Structure pour l'oral](#structure-simple-pour-repondre-a-loral)). |
| **Oublier la mesure de départ** : je propose un chantier sans dire d'où je pars. | Je ne peux pas prouver le gain, donc la réponse paraît théorique. | Je cite une base, la même mesure après et un garde-fou ([Mesurer le succès](#mesurer-le-succes)). |
| **Mesurer des personnes** : j'accepte un indicateur par développeur pour plaire à la direction. | Critère éliminatoire : je perds la confiance des équipes et les chiffres sont manipulés. | Je mesure des équipes et des systèmes, avec une charte publique ([Critères éliminatoires](#criteres-eliminatoires)). |
| **Imposer pour aller vite** : je propose de rendre l'outil obligatoire dès le départ. | Contournements, rancœur, et un échec d'adoption visible. | Adoption volontaire, puis dépréciation annoncée de l'ancien outil ([Adoption](#adoption-migrations-et-depreciations)). |
| **Répondre au conditionnel** : je dis « je ferais » sans aucune histoire vécue. | La réponse ressemble à une page apprise, sans preuve d'expérience. | Je prépare une histoire STAR par thème, avec mes chiffres ([Structure pour l'oral](#structure-simple-pour-repondre-a-loral)). |
| **Croire le chiffre du vendeur** : je cite « 55 % de productivité » sans le qualifier. | Je montre que je décide sur un chiffre marketing. | Je donne la source, sa limite, et je propose une mesure sur notre flux ([Assistants de code IA](#assistants-de-code-ia)). |
| **Réciter un cadre sans sa limite** : je cite SPACE ou DORA comme une recette. | Le recruteur creuse et la réponse s'effondre. | Je donne le cadre, un exemple, puis ce qu'il ne mesure pas, comme DORA qui dit où mais pas pourquoi ([Mesurer l'expérience](#mesurer-lexperience-et-la-productivite)). |
