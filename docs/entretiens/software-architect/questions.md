# Entretien Software Architect : les questions

!!! warning "Avertissement"
    Ces notes sont des pense-bêtes personnels, pas une source de vérité. Elles reflètent ma compréhension et mes choix : leur contenu reste subjectif, malgré les citations et les références qu'il contient. Il peut être incomplet, simplifié, inexact ou dépassé. Vérifiez toujours dans la documentation officielle avant de l'appliquer. Ce contenu est fourni tel quel, sans aucune garantie : son utilisation se fait sous votre seule responsabilité.

!!! audience "Pour qui, pour quoi"
    - **Métiers** : architecte logiciel, architecte de solution, Staff Engineer, tech lead, développeur senior qui vise un poste d'architecte.
    - **Usages** : je prépare un entretien d'architecte et je veux la liste des questions qui reviennent, thème par thème ; je cherche la trame d'une réponse à « monolithe ou microservices ? » avant de relire la section complète ; je prépare une décision vécue à raconter, avec ses options écartées et son compromis ; je révise la veille d'un exercice de conception au tableau.

Cette page liste, thème par thème, les questions qu'on pose à un architecte logiciel, telles que le recruteur les formule. Pour chacune, je donne une trame de réponse courte, à la première personne, puis une ligne **À relire** qui renvoie aux sections de Knowledge où la réponse complète est expliquée avec ses exemples.

Comment je m'en sers :

1. je lis la trame, à voix haute, sans regarder la suite ;
2. j'ouvre la section liée pour combler ce qui me manque (définitions, chiffres, exemples) ;
3. je prépare une histoire vécue qui illustre la question : le contexte, les options écartées, le compromis assumé et ce que la décision a donné. Le recruteur attend « j'ai fait », pas « je ferais » ;
4. pour l'exercice au tableau (system design, ADR, C4, saga, estimation de capacité, modélisation des menaces), je m'entraîne avec [les exercices en direct](exercices.md).

Le rôle porte sur les <span class="term" data-term="trade-off">compromis</span> entre <span class="term" data-term="quality-attribute">attributs de qualité</span> (performance, disponibilité, sécurité, coût, évolutivité) à l'échelle de plusieurs équipes, pas sur le choix d'une bibliothèque. Il recoupe celui de Staff Engineer (décisions transverses, ADR, influence sans autorité hiérarchique) : la [page Staff Engineer](../staff-engineer/questions.md) insiste sur l'adoption et l'accompagnement des équipes, celle-ci sur la conception et les systèmes distribués.

## Rôle et posture de l'architecte

### « Qu'est-ce qui distingue un architecte logiciel d'un tech lead ou d'un Staff Engineer ? »

- Je pars de la portée et de l'horizon : le tech lead répond de la conception et de la livraison d'une équipe, sur le sprint ; l'architecte répond de la cohérence entre plusieurs équipes, sur plusieurs années.
- Le livrable de l'architecte n'est pas du code mais des décisions explicites, avec leurs compromis, et des règles que les équipes appliquent sans lui.
- Mon exemple : deux services calculent « abonnement actif » différemment ; je fais trancher qui est la <span class="term" data-term="source-of-truth">source de vérité</span>, j'écris un <span class="term" data-term="adr">ADR</span>, et une <span class="term" data-term="fitness-function">fitness function</span> vérifie ensuite qu'aucun service ne recalcule l'état.
- Je reconnais le recouvrement : Will Larson, « Staff Engineer » (2021), fait de l'architecte un des archétypes du Staff Engineer. Je demande ce que le poste attend vraiment.

**À relire** : [Les archétypes staff+](../../knowledge/culture-entreprise.md#les-archetypes-staff), [Deux filières : expertise et management](../../knowledge/culture-entreprise.md#deux-filieres-expertise-et-management), [ADR](../../knowledge/architecture.md#adr), [Architecte logiciel, de solution, d'entreprise](../../knowledge/culture-entreprise.md#architecte-logiciel-de-solution-dentreprise)

### « Architecte logiciel, de solution, d'entreprise : quelles différences ? »

- Je les distingue par la question à laquelle chacun répond : comment ce système est construit (logiciel), comment répondre à ce besoin métier en assemblant des systèmes (solution), de quels systèmes l'organisation a besoin pour sa stratégie (entreprise).
- L'architecte d'entreprise travaille avec une <span class="term" data-term="capability-map">carte des capacités</span> et des cadres comme TOGAF (The Open Group, 10e édition en 2022) ; il repère les manques et les doublons.
- Je montre les trois niveaux sur un seul projet, comme un paiement en trois fois : capacité existante ou non, prestataire ou développement interne, puis intégration derrière un adaptateur unique.
- Je dis lequel des trois niveaux je pratique le plus et sur qui je m'appuie pour les autres.

**À relire** : [Carte des échelles](../../knowledge/architecture.md#carte-des-echelles), [Urbaniser le système d'information](../../knowledge/architecture.md#urbaniser-le-systeme-dinformation), [Les cadres de référence](../../knowledge/architecture.md#les-cadres-de-reference), [Construire, acheter ou s'associer](../../knowledge/culture-entreprise.md#construire-acheter-ou-sassocier), [Architecte logiciel, de solution, d'entreprise](../../knowledge/culture-entreprise.md#architecte-logiciel-de-solution-dentreprise)

### « Comment restes-tu crédible techniquement sans coder tous les jours ? »

- Je ne code pas sur le chemin critique d'une équipe : je deviendrais un goulot. Je code là où cela sert mes décisions : un <span class="term" data-term="prototype">prototype</span>, un <span class="term" data-term="spike">spike</span>, un outil qui vérifie une règle d'architecture.
- Je lis du code chaque semaine par des revues ciblées, et je participe aux <span class="term" data-term="postmortem">postmortems</span>, là où l'architecture réelle s'écarte du schéma.
- Je traduis dans les deux sens, du coût d'un choix technique pour la direction à la contrainte métier pour l'équipe : l'ascenseur de Gregor Hohpe (« The Software Architect Elevator », 2020).
- Je fais une veille courte et régulière, tournée vers mes prochaines décisions, et je dis « je ne sais pas, je vérifie » quand c'est le cas.

**À relire** : [Veille : architecte](../../knowledge/veille.md#architecte), [Le postmortem sans recherche de coupable](../../knowledge/incidents.md#le-postmortem-sans-recherche-de-coupable), [Estimer et découper une fonctionnalité](../../knowledge/culture-entreprise.md#estimer-et-decouper-une-fonctionnalite), [Répartir son temps et montrer son impact](../../knowledge/culture-entreprise.md#repartir-son-temps-et-montrer-son-impact)

## Exigences et attributs de qualité

### « Le métier veut un système "rapide et fiable" : comment transformes-tu un besoin flou en exigences d'architecture ? »

- Je transforme chaque adjectif en <span class="term" data-term="quality-attribute-scenario">scénario mesurable</span> en six parties : « rapide » devient « 500 utilisateurs consultent leur commande, la page répond en moins de 300 ms au <span class="term" data-term="p99">p99</span> ».
- Je fais valider les chiffres par ceux qui en paient le coût, en montrant ce que chaque niveau coûte.
- Je range les scénarios dans un <span class="term" data-term="utility-tree">arbre d'utilité</span>, notés par importance métier et difficulté technique : les scénarios importants et difficiles guident l'architecture.
- Je relis la liste ISO/IEC 25010 (révision de 2023) pour ne pas oublier une famille de qualité.

**À relire** : [Scénarios de qualité, arbre d'utilité et ATAM](../../knowledge/architecture.md#scenarios-de-qualite-arbre-dutilite-et-atam), [Ce qu'on appelle qualité : ISO/IEC 25010](../../knowledge/qualite.md#ce-quon-appelle-qualite-isoiec-25010)

### « Comment arbitres-tu entre des attributs de qualité contradictoires ? »

- Je pars du principe que tout est compromis : la <span class="term" data-term="availability">disponibilité</span> coûte de l'argent, un cache qui réduit la <span class="term" data-term="latency">latence</span> sert des données en retard.
- Je tranche avec le classement des scénarios validé par le métier, pas avec mes préférences, et je chiffre chaque option en euros et en risque.
- Je n'arbitre pas une fois pour tout le système : un catalogue accepte la <span class="term" data-term="eventual-consistency">cohérence à terme</span>, un paiement non.
- J'écris le compromis et le seuil qui doit le faire revoir ; la méthode ATAM (Software Engineering Institute, 2000) appelle ces décisions des points de compromis.

**À relire** : [Scénarios de qualité, arbre d'utilité et ATAM](../../knowledge/architecture.md#scenarios-de-qualite-arbre-dutilite-et-atam), [Cohérence forte ou à terme](../../knowledge/architecture.md#coherence-forte-ou-a-terme), [Présenter un compromis technique en termes métier](../../knowledge/culture-entreprise.md#presenter-un-compromis-technique-en-termes-metier)

### « Comment estimes-tu la capacité nécessaire ? », « Combien de serveurs pour un million d'utilisateurs actifs par jour ? »

- Je fais un <span class="term" data-term="back-of-envelope">calcul de coin de table</span> au tableau : une journée compte environ 100 000 secondes, donc un million d'actions par jour font une dizaine par seconde en moyenne.
- J'applique un facteur de pic, je sépare lectures et écritures, j'estime le stockage sur la durée de conservation, puis la loi de Little (John Little, 1961) me donne le nombre de requêtes en vol.
- Je compare aux ordres de grandeur connus (« Latency Numbers Every Programmer Should Know », Jeff Dean, vers 2009) pour savoir si une seule base suffit.
- Je valide ensuite par un <span class="term" data-term="load-test">test de charge</span> : un calcul de tête reste une hypothèse.

**À relire** : [Ordres de grandeur](../../knowledge/architecture.md#ordres-de-grandeur), [QPS moyen et pic](../../knowledge/architecture.md#qps-moyen-et-pic), [Loi de Little](../../knowledge/architecture.md#loi-de-little), [Et la base de données](../../knowledge/architecture.md#et-la-base-de-donnees)

### « Comment abordes-tu un exercice de system design ? »

- Je clarifie d'abord les besoins et les attributs de qualité, puis j'annonce mes hypothèses et les ordres de grandeur.
- Je dessine la version la plus simple qui répond au besoin, chaque flèche avec un verbe et un protocole, et seulement ensuite la mise à l'échelle.
- Je nomme l'option écartée à chaque choix fort et je dis ce que je ne ferais pas.
- Je finis par les limites : les points de défaillance, ce qui casse en premier à dix fois la charge, ce que je mesurerais.

**À relire** : [Estimer la capacité](../../knowledge/architecture.md#estimer-la-capacite), [Résilience](../../knowledge/architecture.md#resilience), [les exercices en direct](exercices.md), [Exemple : un raccourcisseur d'URL](../../knowledge/architecture.md#exemple-un-raccourcisseur-durl)

## Styles d'architecture et découpage

### « Monolithe, monolithe modulaire ou microservices : comment choisis-tu ? », « Qu'est-ce qu'un monolithe distribué ? »

- Je choisis selon le nombre d'équipes et leur besoin d'indépendance, pas selon la taille du code ni la mode.
- Par défaut, un <span class="term" data-term="modular-monolith">monolithe modulaire</span> aux frontières vérifiées automatiquement ; j'extrais un <span class="term" data-term="microservice">microservice</span> pour une raison mesurable (rythme de livraison, montée en charge, isolement).
- Les microservices changent des appels de fonction en appels réseau qui échouent et des données qui ne tiennent plus dans une transaction. Le pire résultat est le <span class="term" data-term="distributed-monolith">monolithe distribué</span>, qui cumule les défauts des deux.
- Je cite « Monolith First » (Martin Fowler, 2015) et j'écris les signaux qui déclencheront l'extraction.

**À relire** : [Quel style choisir](../../knowledge/architecture.md#quel-style-choisir), [Monolithe modulaire](../../knowledge/architecture.md#monolithe-modulaire), [Microservices](../../knowledge/architecture.md#microservices), [Lewis et Fowler, « Microservices » (2014)](../../knowledge/textes-fondateurs.md#lewis-et-fowler-microservices-2014)

### « Comment découpes-tu un système en modules ou en services ? », « Comment découper un monolithe ? »

- Je ne découpe ni par couche technique ni par table : je découpe là où le langage du métier change.
- Je réunis métier et développeurs dans un atelier d'<span class="term" data-term="event-storming">event storming</span> : un « produit » n'a pas le même sens pour le catalogue et pour l'entrepôt, chaque sens devient un <span class="term" data-term="bounded-context">contexte borné</span>.
- Je dessine la <span class="term" data-term="context-map">carte de contextes</span> (Eric Evans, « Domain-Driven Design », 2003) pour décider qui s'adapte à qui.
- Un contexte n'est pas forcément un service ; pour sortir d'un monolithe, je commence par le contexte le plus facile et le moins risqué, puis le figuier étrangleur.

**À relire** : [Découper le système](../../knowledge/architecture.md#decouper-le-systeme), [Event storming](../../knowledge/architecture.md#event-storming), [Carte de contextes](../../knowledge/architecture.md#carte-de-contextes), [Figuier étrangleur](../../knowledge/architecture.md#figuier-etrangleur)

### « Architecture hexagonale, clean architecture : quand valent-elles leur coût ? »

- Elles servent à une chose : que les règles métier ne dépendent ni de la base, ni du framework, ni des API externes. C'est l'<span class="term" data-term="dependency-inversion">inversion des dépendances</span> appliquée à tout un service (Alistair Cockburn, ports et adaptateurs, 2005).
- Elles valent leur coût quand la logique métier est riche, que le système vivra longtemps et que des technologies risquent de changer : je teste le métier avec un <span class="term" data-term="fake-object">fake</span> en millisecondes.
- Elles ne valent rien pour un service qui lit et écrit des lignes : trois couches et des conversions pour rien.
- Je les applique au cœur métier et je fais vérifier la règle de dépendance par un test automatique.

**À relire** : [Architecture hexagonale et clean architecture](../../knowledge/architecture.md#architecture-hexagonale-et-clean-architecture), [D : inversion des dépendances](../../knowledge/principes-conception.md#d-inversion-des-dependances), [Fitness functions](../../knowledge/architecture.md#fitness-functions)

### « Quand choisir une architecture orientée événements ? », « Que se passe-t-il si un message arrive deux fois ? »

- Je choisis les <span class="term" data-term="domain-event">événements métier</span> quand plusieurs services réagissent au même fait, ou quand l'émetteur ne doit pas dépendre de leur disponibilité. Je garde l'appel synchrone quand l'appelant a besoin de la réponse pour continuer.
- <span class="term" data-term="choreography">Chorégraphie</span> pour des réactions indépendantes, orchestration pour un processus à étapes avec annulations, comme une saga.
- Un broker livre au moins une fois : je rends chaque consommateur idempotent, je prévois une <span class="term" data-term="dead-letter-queue">file des messages morts</span> et je publie avec l'outbox.
- Je rends le flux observable de bout en bout, sinon plus personne ne sait où en est une commande.

**À relire** : [Architecture orientée événements](../../knowledge/architecture.md#architecture-orientee-evenements), [File (queue) ou sujet (topic)](../../knowledge/api-rest-async.md#file-queue-ou-sujet-topic), [Garanties de livraison](../../knowledge/api-rest-async.md#garanties-de-livraison), [Idempotence](../../knowledge/architecture.md#idempotence)

### « Serverless, conteneurs ou machines virtuelles : comment choisis-tu ? »

- Je pars du profil de charge : le <span class="term" data-term="serverless">serverless</span> pour une charge rare ou en pics, déclenchée par des événements ; les <span class="term" data-term="container">conteneurs</span> pour un service qui tourne en continu ; la machine virtuelle pour un logiciel ou une licence qui l'impose.
- Je pèse les limites : <span class="term" data-term="cold-start">démarrage à froid</span>, durée maximale d'exécution, couplage au fournisseur.
- Je compare le <span class="term" data-term="total-cost-ownership">coût total de possession</span>, compétences d'exploitation comprises : une plateforme Kubernetes demande une équipe qui sait la faire tourner.
- Je garde des services <span class="term" data-term="stateless">sans état</span>, configurés par l'environnement (« The Twelve-Factor App », Adam Wiggins, 2011), pour pouvoir changer d'avis.

**À relire** : [Serverless](../../knowledge/architecture.md#serverless), [Autoscaling et serverless : HPA, KEDA, Knative, Karpenter](../../knowledge/kubernetes-echelle.md#autoscaling-et-serverless-hpa-keda-knative-karpenter), [Coût total de possession](../../knowledge/culture-entreprise.md#cout-total-de-possession)

## Systèmes distribués et données

### « Que dit le théorème CAP, et comment l'utilises-tu ? », « Cohérence forte ou à terme pour un solde bancaire, et pour un compteur de likes ? »

- CAP (Eric Brewer, 2000, démontré par Gilbert et Lynch en 2002) : pendant une <span class="term" data-term="network-partition">partition réseau</span>, un système distribué choisit entre cohérence et disponibilité. La formule « deux sur trois » est trompeuse, la partition n'est pas optionnelle.
- Hors panne, PACELC (Daniel Abadi, 2012) ajoute le compromis entre latence et cohérence.
- Je raisonne par opération : un solde bancaire veut une <span class="term" data-term="strong-consistency">cohérence forte</span>, un compteur de likes accepte la cohérence à terme.
- Je traduis en réglages : <span class="term" data-term="quorum">quorums</span> de lecture et d'écriture, lecture sur le leader ou sur une réplique.

**À relire** : [CAP et PACELC](../../knowledge/architecture.md#cap-et-pacelc), [Cohérence forte ou à terme](../../knowledge/architecture.md#coherence-forte-ou-a-terme), [Réplication et quorum](../../knowledge/architecture.md#replication-et-quorum), [Les huit illusions](../../knowledge/architecture.md#les-huit-illusions)

### « Comment choisis-tu une base de données ? »

- Je pars des motifs d'accès et des volumes, pas du nom d'une technologie.
- Par défaut, une <span class="term" data-term="relational-database">base relationnelle</span> : transactions, contraintes, une technologie que tout le monde sait exploiter ; avec <span class="term" data-term="jsonb">JSONB</span>, elle couvre beaucoup de besoins « documents ».
- J'ajoute une autre famille (clé-valeur, documents, colonnes, graphe, recherche) seulement pour un motif que la relationnelle sert mal, et je l'alimente par <span class="term" data-term="cdc">CDC</span> plutôt que par une double écriture.
- Je cite les jetons d'innovation de « Choose Boring Technology » (Dan McKinley, 2015) : chaque base de plus coûte en exploitation.

**À relire** : [Choisir le type de base](../../knowledge/architecture.md#choisir-le-type-de-base), [Une base par service](../../knowledge/architecture.md#une-base-par-service), [Exercice 2 : l'ADR du catalogue](exercices.md)

### « Ta base sature, que fais-tu ? », « Vertical ou horizontal : comment décides-tu ? »

- Je lève l'ambiguïté : « vertical » et « horizontal » parlent de la machine ou des données.
- Je pars des chiffres (volume, débit d'écriture, part des lectures, croissance) et je monte l'échelle du moins cher au plus cher : requêtes et index, <span class="term" data-term="vertical-scaling">machine plus grosse</span>, <span class="term" data-term="read-replica">réplicas en lecture</span> en gérant le <span class="term" data-term="replication-lag">retard de réplication</span>, partitionnement de table.
- Le <span class="term" data-term="sharding">sharding</span> vient en dernier : il est presque irréversible, la clé fige les requêtes possibles. Je le compare alors au <span class="term" data-term="distributed-sql">SQL distribué</span>.
- J'écris la décision avec le signal qui déclencherait l'étape suivante.

**À relire** : [Faire grandir une base de données](../../knowledge/sql.md#faire-grandir-une-base-de-donnees), [Deux sens pour « vertical » et « horizontal »](../../knowledge/sql.md#deux-sens-pour-vertical-et-horizontal), [Sharder, en dernier](../../knowledge/sql.md#sharder-en-dernier)

### « Comment garder des données cohérentes entre plusieurs services sans transaction distribuée ? », « Comment publier un événement sans le perdre si la base a écrit ? »

- Je sépare ce qui doit être vrai à chaque instant (dans un seul service, une <span class="term" data-term="db-transaction">transaction locale</span>) de ce qui peut converger plus tard (une saga).
- Saga (Garcia-Molina et Salem, 1987) : chaque étape a une <span class="term" data-term="compensation">compensation</span> ; au-delà de trois ou quatre étapes, je préfère l'orchestration, qui garde l'état à un seul endroit.
- J'écris chaque message avec l'<span class="term" data-term="outbox-pattern">outbox</span>, livré au moins une fois, traité par un <span class="term" data-term="idempotent-consumer">consommateur idempotent</span>.
- J'écarte le <span class="term" data-term="two-phase-commit">commit à deux phases</span> entre services : il bloque tout le monde dès qu'un participant ne répond plus.

**À relire** : [Saga orchestrée ou chorégraphiée](../../knowledge/architecture.md#saga-orchestree-ou-choregraphiee), [Outbox](../../knowledge/architecture.md#outbox), [Le piège de l'écriture puis de la publication](../../knowledge/api-rest-async.md#le-piege-de-lecriture-puis-de-la-publication), [Exercice 5 : la saga de commande](exercices.md), [Autorisation et capture du paiement](../../knowledge/architecture.md#autorisation-et-capture-du-paiement)

### « Deux clients réservent le dernier créneau en même temps, que se passe-t-il ? »

- Je montre la chronologie lire, décider, écrire : les deux lisent « libre », les deux écrivent, donc deux réservations.
- Je protège dans la base, pas dans le code ni dans le cache : un `UPDATE ... WHERE seats_left > 0` atomique, une contrainte d'unicité ou une contrainte d'exclusion sur des plages horaires.
- Je choisis le verrou pessimiste quand les conflits sont fréquents, l'optimiste quand ils sont rares.

**À relire** : [Écritures concurrentes](../../knowledge/sql.md#ecritures-concurrentes), [Niveaux d'isolation](../../knowledge/sql.md#niveaux-disolation), [Exercice 3 : les vues C4 d'une plateforme de réservation](exercices.md), [Contrainte d'exclusion : pas de créneaux qui se chevauchent](../../knowledge/sql.md#contrainte-dexclusion-pas-de-creneaux-qui-se-chevauchent), [Les contraintes : la base garde les règles](../../knowledge/sql.md#les-contraintes-la-base-garde-les-regles)

### « CQRS et event sourcing : quand les utiliser, et quand les éviter ? »

- Je traite les deux idées séparément : <span class="term" data-term="cqrs">CQRS</span> (Greg Young, 2010) sépare les modèles d'écriture et de lecture là où leurs formes divergent, sans demander d'event sourcing.
- Je réserve l'<span class="term" data-term="event-sourcing">event sourcing</span> aux domaines où « que s'est-il passé, et quand ? » est une question métier : un grand livre comptable, un suivi de sinistres.
- Je chiffre le coût : <span class="term" data-term="projection-read-model">projections</span> en retard, versionnement des événements, effacement des données personnelles.
- Je l'applique à un sous-domaine, jamais à tout le système, et je reste en CRUD ailleurs.

**À relire** : [CQRS](../../knowledge/architecture.md#cqrs), [Event sourcing](../../knowledge/architecture.md#event-sourcing), [Droit à l'effacement et journaux d'événements](../../knowledge/securite.md#droit-a-leffacement-et-journaux-devenements)

### « Comment faire évoluer un schéma sans interruption ? », « Comment renommes-tu une colonne en production ? »

- Pendant un <span class="term" data-term="rolling-update">déploiement progressif</span>, l'ancienne et la nouvelle version tournent ensemble sur le même schéma : un renommage direct casse l'une des deux.
- Je découpe en <span class="term" data-term="expand-contract">expand / contract</span> (Danilo Sato, « Parallel Change », 2014) : ajouter, écrire dans les deux, <span class="term" data-term="backfill">backfill</span> par lots, basculer les lectures, arrêter l'ancienne écriture, supprimer.
- Chaque étape est un déploiement séparé et réversible, sauf la suppression, faite après une sauvegarde.
- Pour changer de base, je préfère le CDC à la <span class="term" data-term="dual-write">double écriture</span> applicative, qui diverge sans bruit.

**À relire** : [Migrer un schéma sans interruption](../../knowledge/sql.md#migrer-un-schema-sans-interruption), [Changer sans casser : expand and contract](../../knowledge/architecture.md#changer-sans-casser-expand-and-contract), [Exercice 9 : renommer une colonne](exercices.md)

## Intégration et API

### « REST, gRPC, GraphQL ou messages : comment choisis-tu le style d'intégration ? »

- Je choisis d'abord entre synchrone et asynchrone : si l'appelant a besoin de la réponse, un appel ; s'il annonce un fait, un événement, qui supprime le <span class="term" data-term="temporal-coupling">couplage temporel</span>.
- <span class="term" data-term="rest-api">REST</span> par défaut pour le web et les partenaires ; <span class="term" data-term="grpc">gRPC</span> entre services internes à fort trafic ; <span class="term" data-term="graphql">GraphQL</span> quand plusieurs écrans composent les mêmes données différemment.
- Je limite l'entreprise à trois ou quatre styles, chacun décrit dans un contrat (<span class="term" data-term="openapi">OpenAPI</span>, `.proto`, schéma GraphQL, <span class="term" data-term="asyncapi">AsyncAPI</span>).
- Référence : « Enterprise Integration Patterns » (Gregor Hohpe et Bobby Woolf, 2003).

**À relire** : [REST ou GraphQL ?](../../knowledge/api-rest-async.md#rest-ou-graphql), [Les autres styles, en une ligne](../../knowledge/api-rest-async.md#les-autres-styles-en-une-ligne), [Message, événement, commande](../../knowledge/api-rest-async.md#message-evenement-commande)

### « Comment fais-tu évoluer des contrats entre équipes sans les bloquer ? », « Comment fais-tu évoluer une API sans casser ses clients ? »

- Je veux qu'un fournisseur déploie seul tant qu'il ne casse personne, et que la CI le lui prouve.
- API synchrones : <span class="term" data-term="consumer-driven-contract">contrats pilotés par le consommateur</span> (Ian Robinson, 2006, outillés avec Pact) ; messages : un <span class="term" data-term="schema-registry">registre de schémas</span> qui applique une règle de compatibilité.
- Côté consommateur, le <span class="term" data-term="tolerant-reader">lecteur tolérant</span> ; côté fournisseur, un <span class="term" data-term="breaking-change">changement cassant</span> devient un nouveau champ ou une nouvelle version, avec une date de retrait annoncée.
- Je pars du principe que tout comportement visible est utilisé par quelqu'un (loi de Hyrum).

**À relire** : [Versionner](../../knowledge/api-rest-async.md#versionner), [Tolerant Reader : un client qui ne casse pas](../../knowledge/api-rest-async.md#tolerant-reader-un-client-qui-ne-casse-pas), [Le test de contrat](../../knowledge/qualite.md#le-test-de-contrat), [Loi de Hyrum](../../knowledge/lois-et-principes.md#loi-de-hyrum)

### « API gateway, BFF, service mesh : quel rôle pour chacun ? »

- L'<span class="term" data-term="api-gateway">API gateway</span> protège la frontière (jeton, <span class="term" data-term="rate-limit">limite de débit</span>, routage, journaux), sans aucune règle métier.
- Le <span class="term" data-term="bff">BFF</span> (Sam Newman, 2015) appartient à l'équipe d'une interface et assemble les données pour ses écrans.
- Le <span class="term" data-term="service-mesh">service mesh</span> traite le trafic interne de façon uniforme : <span class="term" data-term="mtls">mTLS</span>, timeouts, réessais, traces, sans toucher au code. Je ne l'ajoute que quand le nombre de services rend le travail à la main ingérable.
- Le risque principal : de la logique métier dans la gateway, qui devient un monolithe partagé.

**À relire** : [API management](../../knowledge/api-rest-async.md#api-management), [Passerelle d'API : KrakenD, NGINX](../../knowledge/outils.md#passerelle-dapi-krakend-nginx), [Zero trust et identité entre services](../../knowledge/securite.md#zero-trust-et-identite-entre-services)

### « Qu'est-ce qu'un webhook, et comment le sécuriser ? »

- C'est l'expéditeur qui appelle mon URL quand l'événement se produit, au lieu que je l'interroge en boucle.
- Je vérifie toujours la signature, je réponds `200` vite puis je traite, et j'accepte de recevoir le même webhook deux fois.
- Je ne dépends pas du webhook seul : une tâche interroge le fournisseur pour les états restés en attente trop longtemps.

**À relire** : [Webhook](../../knowledge/api-rest-async.md#webhook), [Exercice 3 : le paiement par webhook](exercices.md)

## Fiabilité, performance et passage à l'échelle

### « Comment conçois-tu un système hautement disponible ? »

- Je demande combien coûte une heure d'arrêt, parcours par parcours, pour fixer un <span class="term" data-term="slo">SLO</span>, un <span class="term" data-term="rto">RTO</span> et un <span class="term" data-term="rpo">RPO</span>.
- Je fais le calcul : deux composants à 99,9 % en série donnent 99,8 %, environ 17,5 heures d'arrêt par an au lieu de 8,8.
- Je supprime chaque <span class="term" data-term="spof">SPOF</span> par la redondance, dans l'ordre instance, zone, région ; le multi-régions seulement si le RTO ou la loi l'exige.
- Un <span class="term" data-term="failover">basculement</span> jamais testé n'existe pas : je le fais répéter.

**À relire** : [Point unique de défaillance](../../knowledge/architecture.md#point-unique-de-defaillance), [Disponibilité composée](../../knowledge/architecture.md#disponibilite-composee), [Zones et régions](../../knowledge/architecture.md#zones-et-regions), [RTO et RPO](../../knowledge/architecture.md#rto-et-rpo)

### « Comment évites-tu les pannes en cascade ? », « Un service dont tu dépends devient lent, que fais-tu ? »

- Une dépendance lente est plus dangereuse qu'une dépendance en panne : elle bloque des ressources. Chaque appel a un <span class="term" data-term="timeout">timeout</span> plus court que celui de l'appelant.
- Des réessais rares, avec <span class="term" data-term="exponential-backoff">backoff exponentiel</span> et <span class="term" data-term="jitter">gigue</span>, à un seul niveau, sur des opérations idempotentes : trois niveaux de trois réessais envoient 27 requêtes à la dépendance saturée.
- Un <span class="term" data-term="circuit-breaker">disjoncteur</span> par dépendance, des <span class="term" data-term="bulkhead">cloisons</span>, du <span class="term" data-term="load-shedding">délestage</span> à l'entrée (Michael Nygard, « Release It! », 2007, 2e édition 2018).
- Je décide avec le produit le mode dégradé de chaque dépendance non critique, avant l'incident.

**À relire** : [Résilience](../../knowledge/architecture.md#resilience), [Budget de retry](../../knowledge/architecture.md#budget-de-retry), [Dégradation contrôlée](../../knowledge/architecture.md#degradation-controlee), [Exercice 6 : le client résilient](exercices.md)

### « Comment l'architecture limite-t-elle l'impact des incidents ? », « Le MTTR est-il un bon indicateur ? »

- Je réduis le <span class="term" data-term="blast-radius">rayon d'impact</span> par construction : <span class="term" data-term="cell-based-architecture">architecture cellulaire</span>, isolation des clients d'une plateforme <span class="term" data-term="multi-tenancy">multi-locataires</span>, livraisons cellule par cellule.
- Je décide à froid la dégradation de chaque fonction, je prévois un <span class="term" data-term="kill-switch">kill switch</span> et je vise la <span class="term" data-term="static-stability">stabilité statique</span>.
- Le <span class="term" data-term="mttr">MTTR</span> moyen est trompeur : un seul long incident l'écrase. Je regarde la médiane, le pire cas et les incidents récurrents.
- Je lis les postmortems ensemble : un motif qui revient devient un ADR, puis une fitness function, et un <span class="term" data-term="game-day">game day</span> vérifie la correction.

**À relire** : [Architecture cellulaire](../../knowledge/architecture.md#architecture-cellulaire), [Mesures et leurs limites](../../knowledge/incidents.md#mesures-et-leurs-limites), [Apprendre des incidents à l'échelle](../../knowledge/incidents.md#apprendre-des-incidents-a-lechelle), [S'entraîner : game days et chaos engineering](../../knowledge/incidents.md#sentrainer-game-days-et-chaos-engineering)

### « La charge est multipliée par dix, que fais-tu ? », « Pourquoi doubler les serveurs ne double-t-il pas le débit ? »

- Je mesure avant de choisir : un test de charge à dix fois le trafic montre ce qui casse en premier.
- Je rends l'application sans état et je l'étends horizontalement ; je soulage la base (index, cache, réplicas), le partitionnement en dernier ; je sors du chemin critique ce qui peut être asynchrone.
- Je cherche les clés chaudes et la contention : la loi d'Amdahl (1967) plafonne le gain si 5 % du travail reste séquentiel, l'<span class="term" data-term="usl">USL</span> (Neil Gunther, 1993) montre que trop de machines font baisser le débit.
- Pour un worker qui lit une file, je scale sur le retard de la file, pas sur le CPU.

**À relire** : [Scale cube](../../knowledge/architecture.md#scale-cube), [Loi d'Amdahl](../../knowledge/lois-et-principes.md#loi-damdahl), [Loi d'échelle universelle (USL)](../../knowledge/lois-et-principes.md#loi-dechelle-universelle-usl), [Quoi utiliser pour scaler](../../knowledge/kubernetes-echelle.md#quoi-utiliser-pour-scaler)

### « Où places-tu un cache, et comment évites-tu qu'une clé populaire qui expire fasse tomber la base ? »

- Je classe les données par fraîcheur acceptable et coût de calcul avant de parler d'outil.
- Je raisonne en couches : navigateur, <span class="term" data-term="cdn">CDN</span> avec `Cache-Control` explicite, gateway, puis <span class="term" data-term="cache-aside">cache-aside</span> dans l'application avec un TTL décidé par le métier.
- Contre la <span class="term" data-term="cache-stampede">ruée sur le cache</span> : regroupement des requêtes, <span class="term" data-term="stale-while-revalidate">stale-while-revalidate</span> (RFC 5861, 2010), expiration légèrement aléatoire.
- Je garde hors du cache les décisions sensibles, comme un paiement ou un droit d'accès.

**À relire** : [Où placer un cache](../../knowledge/architecture.md#ou-placer-un-cache), [Lire et écrire avec un cache](../../knowledge/architecture.md#lire-et-ecrire-avec-un-cache), [Invalidation et ruée sur le cache](../../knowledge/architecture.md#invalidation-et-ruee-sur-le-cache)

### « Conçois un limiteur de débit pour une API ouverte à des partenaires. »

- Je compare fenêtre fixe, fenêtre glissante et seau à jetons, qui accepte des rafales bornées.
- Je partage le compteur entre les instances, par exemple dans Redis, sinon chaque instance laisse passer sa propre limite.
- Je renvoie `429` avec `Retry-After`, et je documente les limites par partenaire.

**À relire** : [Limitation de débit](../../knowledge/architecture.md#limitation-de-debit), [Délestage et contre-pression](../../knowledge/architecture.md#delestage-et-contre-pression), [Isolation multi-locataires et voisin bruyant](../../knowledge/architecture.md#isolation-multi-locataires-et-voisin-bruyant)

## Sécurité et conformité

### « Comment intègres-tu la sécurité dès la conception ? », « As-tu déjà fait une modélisation des menaces ? »

- Je fais une <span class="term" data-term="threat-modeling">modélisation des menaces</span> d'une heure pour chaque fonctionnalité qui touche une <span class="term" data-term="trust-boundary">frontière de confiance</span>, avec un schéma de flux de données.
- Je passe chaque élément à la grille <span class="term" data-term="stride">STRIDE</span> (Kohnfelder et Garg, Microsoft, 1999), avec les quatre questions d'Adam Shostack (2014).
- Je classe par probabilité et impact, et chaque menace retenue devient une exigence testable : un test de refus, une règle d'<span class="term" data-term="static-analysis">analyse statique</span>, une politique d'infrastructure.
- Je raisonne en <span class="term" data-term="defense-in-depth">défense en profondeur</span>, et je cite le BOLA, premier risque de l'OWASP API Security Top 10 (édition 2023).

**À relire** : [Modéliser les menaces (STRIDE)](../../knowledge/securite.md#modeliser-les-menaces-stride), [Les failles les plus courantes des API](../../knowledge/securite.md#les-failles-les-plus-courantes-des-api), [Exercice 10 : STRIDE d'une API d'upload](exercices.md)

### « Comment sécurises-tu les échanges entre services ? », « Qu'est-ce que le zero trust ? »

- Je pars du <span class="term" data-term="zero-trust">zero trust</span> (NIST SP 800-207, 2020) : être dans le cluster ne prouve rien.
- Chaque service reçoit une <span class="term" data-term="workload-identity">identité de charge de travail</span> courte, délivrée par la plateforme (par exemple au format <span class="term" data-term="spiffe">SPIFFE</span>), et les appels passent en mTLS.
- Une politique dit qui peut appeler quoi, selon le <span class="term" data-term="least-privilege">moindre privilège</span>, en refus par défaut.
- Quand un service agit pour un utilisateur, je propage l'identité de la personne dans un jeton à audience restreinte.

**À relire** : [Zero trust et identité entre services](../../knowledge/securite.md#zero-trust-et-identite-entre-services), [Une politique en refus par défaut](../../knowledge/securite.md#une-politique-en-refus-par-defaut), [NIST SP 800-207](../../knowledge/textes-fondateurs.md#nist-sp-800-207-zero-trust-architecture-2020)

### « RBAC ou ABAC ? », « Où vérifies-tu les droits ? »

- Les rôles pour quelques profils stables, les attributs quand la règle dépend des données (pays, montant, propriétaire), les relations pour du partage.
- La décision se prend côté serveur, dans le service qui possède la donnée, en refus par défaut ; la gateway ne fait que vérifier le jeton.
- Je vérifie l'appartenance de l'objet à chaque lecture : c'est ce qui empêche le BOLA.

**À relire** : [Modéliser les droits : RBAC, ABAC, ReBAC](../../knowledge/securite.md#modeliser-les-droits-rbac-abac-rebac), [Où appliquer les contrôles](../../knowledge/securite.md#ou-appliquer-les-controles)

### « Comment l'architecture prend-elle en compte le RGPD et les données personnelles ? »

- Je traite le <span class="term" data-term="gdpr">RGPD</span> comme une exigence d'architecture : la <span class="term" data-term="privacy-by-design">protection dès la conception</span> (article 25, appliqué depuis mai 2018) commence par la <span class="term" data-term="data-minimization">minimisation</span>.
- Je concentre les données personnelles dans un service propriétaire et les autres ne manipulent qu'un identifiant : de la <span class="term" data-term="pseudonymization">pseudonymisation</span>, qui ne fait pas sortir les données du RGPD.
- Le droit à l'effacement dans les journaux immuables et les sauvegardes passe par le <span class="term" data-term="crypto-shredding">crypto-shredding</span>.
- La <span class="term" data-term="data-residency">résidence des données</span> guide le choix des régions ; pour un traitement à risque, une analyse d'impact avec le <span class="term" data-term="dpo">DPO</span> avant de figer l'architecture.

**À relire** : [Données personnelles et RGPD dans l'architecture](../../knowledge/securite.md#donnees-personnelles-et-rgpd-dans-larchitecture), [Pseudonymisation ou anonymisation](../../knowledge/securite.md#pseudonymisation-ou-anonymisation), [Résidence des données](../../knowledge/securite.md#residence-des-donnees)

## Cloud, coûts et exploitation

### « Comment intègres-tu le coût dans les choix d'architecture ? »

- Je traite le coût comme un attribut de qualité, au même titre que la performance.
- Je l'exprime par unité métier, avec des <span class="term" data-term="unit-economics">coûts unitaires</span> comme le coût pour 1 000 commandes : un total qui monte peut refléter une activité qui monte.
- Pour chaque option, je compare l'infrastructure, le temps humain d'exploitation et le coût de l'indisponibilité évitée.
- Je rends ces chiffres visibles aux équipes qui les génèrent, dans l'esprit <span class="term" data-term="finops">FinOps</span> (FinOps Foundation, 2019).

**À relire** : [Coûts et économies](../../knowledge/donnees-decision.md#couts-et-economies), [Coût total de possession](../../knowledge/culture-entreprise.md#cout-total-de-possession), [CAPEX et OPEX](../../knowledge/culture-entreprise.md#capex-et-opex), [Exercice 12 : arbitrer un coût](exercices.md)

### « Faut-il éviter l'enfermement chez un fournisseur cloud ? »

- Je traite l'enfermement comme un coût parmi d'autres, pas comme un mal absolu : un <span class="term" data-term="managed-service">service managé</span> fait souvent gagner des mois d'exploitation dès aujourd'hui.
- J'estime pour chaque composant le <span class="term" data-term="vendor-lock-in">verrouillage</span> qu'il crée, la probabilité de devoir partir et le <span class="term" data-term="switching-cost">coût de bascule</span>.
- Je réserve l'effort de portabilité aux composants où la sortie est probable ou coûteuse, je surveille les <span class="term" data-term="egress-fees">frais de sortie des données</span> et je garde les données dans des formats exportables.
- Référence : « Don't get locked up into avoiding lock-in » (Gregor Hohpe, 2019).

**À relire** : [L'enfermement chez un fournisseur, un coût à chiffrer](../../knowledge/culture-entreprise.md#lenfermement-chez-un-fournisseur-un-cout-a-chiffrer), [Construire, acheter ou s'associer](../../knowledge/culture-entreprise.md#construire-acheter-ou-sassocier)

### « Comment fais-tu de l'observabilité une exigence d'architecture ? », « SLI, SLO, SLA : quelle différence ? »

- Un service qu'on ne sait pas diagnostiquer n'est pas prêt pour la production : j'exige trois choses avant la mise en production.
- Des SLO écrits du point de vue de l'utilisateur ; une <span class="term" data-term="instrumentation">instrumentation</span> commune avec <span class="term" data-term="opentelemetry">OpenTelemetry</span>, pour que les <span class="term" data-term="trace-distributed">traces distribuées</span> traversent les équipes grâce à l'en-tête `traceparent` ; des alertes sur la consommation du <span class="term" data-term="error-budget">budget d'erreur</span>.
- Le SLI est le chiffre mesuré, le SLO l'objectif interne, le SLA le contrat avec pénalité, plus lâche que le SLO.
- Le budget d'erreur arbitre entre nouvelles fonctions et fiabilité (« Site Reliability Engineering », Google, 2016).

**À relire** : [SLI, SLO, budget d'erreur](../../knowledge/observabilite.md#sli-slo-budget-derreur), [Burn rate](../../knowledge/observabilite.md#burn-rate-vitesse-de-consommation-du-budget), [Propagation entre services](../../knowledge/observabilite.md#propagation-entre-services), [Alerter sur les symptômes](../../knowledge/observabilite.md#alerter-sur-les-symptomes-pas-sur-les-causes)

## Modernisation et évolution

### « Comment modernises-tu un système existant ? »

- Je pars d'un problème métier précis, pas d'une envie de technologie.
- J'applique le <span class="term" data-term="strangler-fig">figuier étrangleur</span> (Martin Fowler, 2004) : un point de routage envoie certaines requêtes vers le nouveau composant, une <span class="term" data-term="anti-corruption-layer">couche anticorruption</span> traduit les modèles.
- Dans le code, <span class="term" data-term="branch-by-abstraction">branch by abstraction</span> et <span class="term" data-term="feature-flag">feature flags</span> pour basculer progressivement et revenir en arrière en une minute.
- Chaque étape livre de la valeur et retire du code ancien.

**À relire** : [Figuier étrangleur](../../knowledge/architecture.md#figuier-etrangleur), [Moderniser un système existant](../../knowledge/architecture.md#moderniser-un-systeme-existant), [Modifier du code legacy](../../knowledge/principes-conception.md#modifier-du-code-legacy)

### « Réécriture complète ou refonte progressive : comment décides-tu ? »

- Ma position par défaut est la refonte progressive : une <span class="term" data-term="rewrite">réécriture</span> doit rattraper des années de règles implicites pendant que l'ancien système évolue, et ne livre rien avant la bascule.
- Je cite « Things You Should Never Do » (Joel Spolsky, 2000) et l'<span class="term" data-term="second-system-effect">effet second système</span> (Fred Brooks, 1975).
- Je ne réécris que dans quelques cas : technologie sans chemin de montée de version, système petit et bien testé, besoin si différent que l'ancien code n'en couvre presque rien.
- Même alors, je livre par tranches et je fixe des critères d'arrêt avant de commencer.

**À relire** : [Réécrire ou refondre progressivement](../../knowledge/architecture.md#reecrire-ou-refondre-progressivement), [Architecture sacrificielle](../../knowledge/architecture.md#architecture-sacrificielle), [Barrière de Chesterton](../../knowledge/lois-et-principes.md#barriere-de-chesterton)

### « Comment empêches-tu l'architecture de dériver du code dans le temps ? »

- Je transforme les décisions importantes en fitness functions (Ford, Parsons et Kua, « Building Evolutionary Architectures », 2017) qui tournent dans la CI à chaque merge request.
- Pour les dépendances entre modules, des <span class="term" data-term="architecture-rule">règles d'architecture</span> avec import-linter en Python ou ArchUnit en Java.
- Je commence par deux ou trois règles, comme l'absence de <span class="term" data-term="dependency-cycle">cycles de dépendances</span>.
- Les exceptions existantes sont listées, datées, et la liste ne fait que diminuer.

**À relire** : [Fitness functions](../../knowledge/architecture.md#fitness-functions), [Exercice 11 : une fitness function](exercices.md), [Dérogations et architecture cible](../../knowledge/architecture.md#derogations-et-architecture-cible)

### « Comment livres-tu plusieurs fois par jour sans coupure ? »

- Je conçois pour le déploiement indépendant : contrats compatibles, migrations en expand / contract, pas de base partagée qui force les équipes à livrer ensemble.
- Je sépare déployer et activer avec des feature flags, et je livre progressivement (canary, blue-green) avec des critères d'arrêt écrits avant.
- Je mesure avec les quatre métriques DORA, vitesse et stabilité lues ensemble.

**À relire** : [Concevoir pour la livraison continue](../../knowledge/architecture.md#concevoir-pour-la-livraison-continue), [Séparer déployer et activer](../../knowledge/architecture.md#separer-deployer-et-activer), [Déploiement progressif](../../knowledge/livraison.md#deploiement-progressif), [Mesurer la livraison : DORA](../../knowledge/livraison.md#mesurer-la-livraison-dora)

## Documentation, gouvernance et communication

### « Comment documentes-tu une architecture ? », « Comment documentes-tu une décision d'architecture ? »

- Je documente pour des lecteurs précis : un nouvel arrivant, une équipe voisine, un auditeur.
- Pour les schémas, le <span class="term" data-term="c4-model">modèle C4</span> (Simon Brown) : contexte pour tout le monde, conteneurs pour les développeurs, rarement plus loin.
- Pour les décisions, des ADR courts (Michael Nygard, 2011), parce que le « pourquoi » est ce qu'on perd le plus vite ; une décision remplacée garde son ADR, avec le statut « remplacé par ».
- Tout vit dans le dépôt en <span class="term" data-term="docs-as-code">docs as code</span>, relu dans la même merge request que le changement.

**À relire** : [Modèle C4](../../knowledge/architecture.md#modele-c4), [ADR](../../knowledge/architecture.md#adr), [arc42](../../knowledge/architecture.md#arc42), [Concevoir avant de coder](../../knowledge/livraison.md#concevoir-avant-de-coder), [Remplacer un ADR dépassé](../../knowledge/architecture.md#remplacer-un-adr-depasse)

### « Comment mènes-tu une revue d'architecture utile sans devenir un comité bloquant ? », « Comment prends-tu une décision technique importante en équipe ? »

- Je fais de la revue un service rendu, pas une porte de contrôle : l'<span class="term" data-term="advice-process">advice process</span> (Andrew Harmel-Law, 2021) laisse décider l'équipe qui porte les conséquences, après avoir demandé conseil.
- Je proportionne l'effort à la réversibilité : une décision facile à défaire se prend en une discussion, une décision difficile à défaire mérite une revue écrite (décisions de type 1 et de type 2).
- Je teste la proposition contre quelques scénarios concrets, et les avis et décisions sont publics.
- En désaccord, j'écris mon objection, puis je m'engage dans la décision prise.

**À relire** : [Advice process](../../knowledge/culture-entreprise.md#advice-process), [Décisions de type 1 et de type 2](../../knowledge/culture-entreprise.md#decisions-de-type-1-et-de-type-2), [RFC et documents de conception](../../knowledge/culture-entreprise.md#rfc-et-documents-de-conception), [Désaccord et engagement](../../knowledge/culture-entreprise.md#desaccord-et-engagement), [Influence sans autorité et communautés de pratique](../../knowledge/culture-entreprise.md#influence-sans-autorite-et-communautes-de-pratique)

### « Comment encadres-tu le choix des technologies entre plusieurs équipes ? »

- Je tiens un radar d'entreprise avec un mandat clair, des critères écrits par anneau et une revue à rythme fixe.
- Les propositions sont ouvertes à toutes les équipes ; une technologie adoptée devient un <span class="term" data-term="golden-path">golden path</span> outillé, une technologie retenue fait l'objet d'un ADR.

**À relire** : [Tech radar d'entreprise](../../knowledge/architecture.md#tech-radar-dentreprise), [Golden paths et templates](../../knowledge/devx.md#golden-paths-et-templates), [Dérogations et architecture cible](../../knowledge/architecture.md#derogations-et-architecture-cible)

### « Comment présentes-tu un choix d'architecture à des décideurs non techniques ? », « Comment convaincs-tu ta direction de financer une refonte ? »

- Je commence par la recommandation et la décision attendue, puis les raisons (principe de la pyramide, Barbara Minto).
- Je traduis chaque argument en conséquence que le décideur arbitre déjà : coût, délai, risque client, obligation légale.
- Je présente toujours l'option « ne rien faire » avec son coût, et le coût du retard.
- Je dis si la décision est un <span class="term" data-term="reversible-change">changement réversible</span>, et ce qui ferait changer ma recommandation.

**À relire** : [Principe de la pyramide](../../knowledge/culture-entreprise.md#principe-de-la-pyramide), [Présenter un compromis technique en termes métier](../../knowledge/culture-entreprise.md#presenter-un-compromis-technique-en-termes-metier), [Coût du retard](../../knowledge/culture-entreprise.md#cout-du-retard), [One-pager](../../knowledge/culture-entreprise.md#one-pager)

### « Que dit la loi de Conway, et comment t'en sers-tu ? », « Comment organiserais-tu les équipes autour d'une plateforme ? »

- Melvin Conway (1968) : les systèmes reproduisent la structure de communication de ceux qui les conçoivent. Une équipe front, une équipe back et une équipe base produisent trois couches couplées.
- Je m'en sers pour diagnostiquer (un service qui exige trois équipes à chaque livraison) et pour concevoir, avec la <span class="term" data-term="inverse-conway-maneuver">manœuvre de Conway inverse</span>.
- Je découpe d'après la charge cognitive avec « Team Topologies » (Skelton et Pais, 2019), et je travaille avec les managers, à qui revient la structure des équipes.

**À relire** : [Loi de Conway](../../knowledge/architecture.md#loi-de-conway), [Loi de Conway (lois)](../../knowledge/lois-et-principes.md#loi-de-conway), [Team Topologies](../../knowledge/culture-entreprise.md#team-topologies)

### « Comment sais-tu que ta nouvelle architecture marche ? »

- Je relève une base avant le changement, la même mesure après, sur une fenêtre de même durée, et une métrique garde-fou qui ne doit pas se dégrader.
- Je donne un SLI, un SLO interne et, s'il y a un client externe, un SLA plus lâche avec pénalité.

**À relire** : [Mesurer le succès (architecture)](../../knowledge/architecture.md#mesurer-le-succes), [Mesurer le succès](#mesurer-le-succes)

## IA et architecture

### « Comment intègres-tu un modèle de langage dans une architecture ? », « Cinq équipes appellent des LLM chacune avec sa clé, que proposes-tu ? »

- Je traite un <span class="term" data-term="llm">LLM</span> comme une dépendance externe lente, facturée au <span class="term" data-term="token-llm">token</span> et non déterministe.
- Tous les appels passent par une <span class="term" data-term="llm-gateway">passerelle LLM</span> qui garde seule les clés, applique quotas et masquage des données personnelles, et suit le coût par équipe.
- Pour les réponses factuelles, le <span class="term" data-term="rag">RAG</span> (Patrick Lewis et al., 2020) limite les <span class="term" data-term="hallucination">hallucinations</span> ; des <span class="term" data-term="llm-eval">évaluations</span> sont rejouées à chaque changement de prompt ou de modèle.
- Je considère toute entrée comme une <span class="term" data-term="prompt-injection">injection de prompt</span> possible et je limite les actions du modèle avec des <span class="term" data-term="llm-guardrail">garde-fous</span> et le moindre privilège.

**À relire** : [La passerelle LLM : un seul point de passage](../../knowledge/ia-entreprise.md#la-passerelle-llm-un-seul-point-de-passage), [RAG](../../knowledge/ia-agents.md#rag-retrieval-augmented-generation), [Sécurité du contexte](../../knowledge/ia-agents.md#securite-du-contexte), [Tester un système à base d'agents](../../knowledge/ia-capacites.md#tester-un-systeme-a-base-dagents)

## Critères éliminatoires

Ces questions testent la posture plus que la technique : une mauvaise réponse suffit à écarter une candidature.

| Question | Ce qui élimine | Ce que je réponds | À relire |
|---|---|---|---|
| « Que fais-tu si les équipes ne suivent pas l'architecture cible ? » | imposer, bloquer, dire non à tout | j'écoute d'abord, car un écart signale souvent une cible mal expliquée ou trop chère ; je rends la bonne voie plus facile avec un <span class="term" data-term="golden-path">golden path</span>, j'accepte des <span class="term" data-term="waiver">dérogations</span> écrites et datées, et je ne bloque que sur la sécurité, les données ou la fiabilité | [Golden paths et templates](../../knowledge/devx.md#golden-paths-et-templates), [Faire adopter un outil sans l'imposer](../../knowledge/devx.md#faire-adopter-un-outil-sans-limposer) |
| « Comment reconnais-tu que tu as sur-architecturé un système ? » | ne jamais avoir sur-architecturé | je cite les signes de <span class="term" data-term="over-engineering">sur-ingénierie</span> (plus de temps sur la plateforme que sur le métier, composants pour une charge jamais venue, une modification qui touche cinq services) ; c'est de la <span class="term" data-term="accidental-complexity">complexité accidentelle</span>, que je préviens avec <span class="term" data-term="yagni">YAGNI</span> et en me méfiant du <span class="term" data-term="resume-driven-development">resume-driven development</span>, le mien compris | [YAGNI et règle de trois](../../knowledge/principes-conception.md#yagni-et-regle-de-trois), [Loi de Gall](../../knowledge/lois-et-principes.md#loi-de-gall) |
| « Comment réagis-tu quand une de tes décisions d'architecture s'avère mauvaise ? » | défendre la décision par principe, ou cacher l'erreur | je le reconnais vite avec des faits, je sépare la qualité de la décision de celle du résultat, je chiffre corriger, contourner ou revenir en arrière sans compter l'effort déjà dépensé, j'écris un nouvel ADR qui remplace l'ancien et je fais un postmortem sans blâme sur la décision | [ADR](../../knowledge/architecture.md#adr), [Le postmortem sans recherche de coupable](../../knowledge/incidents.md#le-postmortem-sans-recherche-de-coupable) |

## Les trois choses qu'un architecte fait en permanence

1. **Rendre les compromis explicites** : je traduis chaque choix en exigences de qualité, en coûts et en risques, et je dis ce qu'on accepte de ne pas avoir. Par exemple, avant un passage en multi-région, je mets en face le coût annuel de l'option et le coût réel d'une panne de région, puis le métier choisit son niveau de risque.
2. **Garder l'architecture vraie dans le code** : je protège les décisions importantes par des tests automatiques, une documentation dans le dépôt et des ADR à jour. Par exemple, une règle import-linter empêche le domaine d'importer l'ORM, et la liste des exceptions diminue à chaque ticket.
3. **Faire décider les équipes plutôt que décider à leur place** : je conseille, je teste les propositions contre des scénarios concrets et je rends la bonne voie facile. Par exemple, je remplace un comité mensuel par un advice process : l'équipe demande l'avis, décide et écrit un ADR en une semaine.

## Répondre à l'oral

Pour presque toutes les questions d'architecture, je suis ce fil, proche de la méthode STAR (situation, tâche, action, résultat) :

1. **Contexte** : quel problème métier, pour qui, avec quel volume et quelle équipe ?
2. **Exigences de qualité** : quelles propriétés comptent ici (disponibilité, latence, coût, sécurité, évolutivité), avec des chiffres ?
3. **Options** : quelles architectures sont possibles, y compris « ne rien changer » ?
4. **Compromis** : ce que chaque option apporte, ce qu'elle coûte, ce qu'elle sacrifie.
5. **Décision** : l'option que je recommande, et pourquoi dans ce contexte précis.
6. **Risques et réversibilité** : ce qui peut mal tourner, et ce que coûte un retour en arrière.
7. **Vérification** : la mesure, le test automatique ou le point de contrôle qui dira si la décision était la bonne.

Je privilégie les exemples vécus ; si je n'ai pas vécu un cas, je le présente comme hypothétique et j'explique mon raisonnement. L'idée centrale : un architecte ne choisit pas la solution la plus élégante, il choisit celle dont les compromis conviennent au contexte, il les rend visibles, et il s'assure que la décision reste vraie dans le code et dans l'organisation.

## Mesurer le succès

Je sais que ma préparation marche quand je réponds à une question tirée au hasard en deux minutes, à voix haute, avec un compromis nommé et une histoire vécue. Avant de commencer, je note une base : je tire dix questions de cette page et je compte celles où ma réponse contient un contexte, une option écartée et une vérification. Je refais la même mesure deux semaines plus tard, sur dix autres questions. La métrique garde-fou est la part de réponses qui s'appuient sur un cas vécu : si elle baisse pendant que le score monte, j'apprends des trames par cœur au lieu de préparer mes histoires.

Je suis un <span class="term" data-term="sli">SLI</span> (le chiffre mesuré) avec un <span class="term" data-term="slo">SLO</span> (ma cible interne) ; un <span class="term" data-term="sla">SLA</span> (la promesse contractuelle faite à un client) n'a pas de sens pour une préparation personnelle.

| Solution | Indicateur de succès (SLI) | SLO probable | SLA probable |
|---|---|---|---|
| lire la trame à voix haute, puis la section liée | part des questions tirées au hasard auxquelles je réponds en deux minutes | 8 questions sur 10 | sans objet : pas de contrat externe |
| préparer une histoire vécue par thème | nombre de thèmes couverts par au moins une décision vécue racontable | 10 thèmes sur 12 | sans objet : pas de contrat externe |
| nommer le compromis et l'option écartée | part des réponses enregistrées qui citent une option écartée | 9 réponses sur 10 | sans objet : pas de contrat externe |
| suivre le fil de réponse à l'oral | part des réponses qui finissent par une vérification (mesure, test, point de contrôle) | 8 réponses sur 10 | sans objet : pas de contrat externe |
| répéter les critères éliminatoires | réponses aux trois questions éliminatoires sans posture défensive, jugées par un pair | 3 sur 3 | sans objet : pas de contrat externe |

[À prendre avec précaution : ordres de grandeur d'exemple, à ajuster à mon niveau de départ et au poste visé]

## Pièges à éviter

| Piège | Ce qui se passe | Solution |
| --- | --- | --- |
| **Répondre au conditionnel** : je dis « je ferais » à une question sur une décision passée. | Le recruteur entend une théorie et doute que j'aie déjà décidé quoi que ce soit. | Je prépare une histoire vécue par thème et je la raconte avec le [fil de réponse à l'oral](#repondre-a-loral). |
| **Citer un pattern sans son coût** : je recommande microservices, CQRS ou multi-région sans dire ce qu'ils coûtent. | Ma réponse sonne apprise, et la question suivante me demande quand je ne le ferais pas. | Je nomme toujours le compromis et la situation où je ferais l'inverse ([Les trois choses](#les-trois-choses-quun-architecte-fait-en-permanence)). |
| **Décider à la place des équipes** : je présente l'architecte comme celui qui tranche tout. | Le recruteur y voit un futur comité bloquant, contourné par les équipes. | Je décris l'advice process et le golden path ([Critères éliminatoires](#criteres-eliminatoires)). |
| **Oublier le métier** : je pars de la technologie au lieu du besoin et des attributs de qualité. | Je ne peux justifier aucun choix par un chiffre validé. | Je pars des scénarios de qualité et du coût d'une heure d'arrêt ([Exigences et attributs de qualité](#exigences-et-attributs-de-qualite)). |
| **Réciter les trames** : j'apprends cette page par cœur. | Je bloque dès que la question est formulée autrement, et la réponse sonne fausse. | Je lis la section liée pour comprendre le mécanisme, puis je réponds avec mes mots et mes chiffres. |
| **Ne jamais reconnaître d'erreur** : je n'ai « jamais » pris de mauvaise décision. | C'est un critère éliminatoire : un architecte qui ne se trompe jamais apprend aux équipes à cacher leurs erreurs. | Je prépare une décision qui s'est révélée mauvaise, avec l'ADR qui l'a remplacée ([Critères éliminatoires](#criteres-eliminatoires)). |
| **Se perdre dans le détail** : je réponds à « monolithe ou microservices ? » par la configuration de Kubernetes. | Le recruteur ne voit pas le raisonnement d'ensemble. | Je commence par la conclusion, puis je zoome seulement si on me le demande ([Répondre à l'oral](#repondre-a-loral)). |
