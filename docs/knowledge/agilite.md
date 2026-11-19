# Agilité, Scrum et Kanban

!!! warning "Avertissement"
    Ces notes sont des pense-bêtes personnels, pas une source de vérité. Elles reflètent ma compréhension et mes choix : leur contenu reste subjectif, malgré les citations et les références qu'il contient. Il peut être incomplet, simplifié, inexact ou dépassé. Vérifiez toujours dans la documentation officielle avant de l'appliquer. Ce contenu est fourni tel quel, sans aucune garantie : son utilisation se fait sous votre seule responsabilité.

!!! audience "Pour qui, pour quoi"
    - **Métiers** : développeur, QA, product owner, Scrum Master, tech lead, engineering manager.
    - **Usages** : j'arrive dans une équipe qui « fait du Scrum » et je veux savoir à quoi sert chaque réunion ; mon équipe reçoit surtout des demandes imprévues, comme des bugs de production, et je me demande si Kanban lui irait mieux que des sprints ; un manager me demande une date et je veux répondre avec une prévision honnête plutôt qu'un chiffre au doigt mouillé ; nos rétrospectives tournent en rond et je cherche comment les rendre utiles ; je prépare un entretien où l'on me demandera « Scrum ou Kanban ? ».

L'agilité n'est pas une méthode : c'est une famille de façons de travailler qui partagent une idée, livrer souvent de petits morceaux utiles et s'ajuster à ce qu'on apprend. Cette page explique le Manifeste agile, compare les principales méthodes (Scrum, Kanban, Scrumban, XP, Lean, Crystal, DSDM, FDD, SAFe, Disciplined Agile), puis détaille les trois que je croise le plus : Scrum, Kanban et Extreme Programming (XP). Elle montre comment les combiner dans une équipe, avec DevOps, puis couvre l'estimation et la prévision, les rituels qui servent vraiment, l'agilité à l'échelle, la qualité dans une équipe agile et les dérives les plus courantes.

Plusieurs notions voisines vivent ailleurs et je les relie au lieu de les répéter : la loi de Little, le Lean et la théorie des contraintes dans [Culture d'entreprise](culture-entreprise.md#lean-et-flux), le découpage en tranches et l'estimation d'une fonctionnalité dans [Estimer et découper une fonctionnalité](culture-entreprise.md#estimer-et-decouper-une-fonctionnalite), les stories et la définition de terminé dans [Product management](product-management.md#stories-utilisateur-et-invest), le rôle du QA dans [Qualité et tests](qualite.md#le-role-du-qa-dans-une-equipe-agile). L'application de boutique `shop-app`, l'équipe `team-orders` et ses membres (ada la product owner, grace la Scrum Master, alan et linus développeurs, margaret QA) et tous les chiffres sont des exemples inventés.

## Vocabulaire

| Mot | Définition | Exemple |
|---|---|---|
| **<span class="term" data-term="agile-manifesto">Manifeste agile</span>** | le texte de 2001 qui pose quatre valeurs et douze principes communs aux méthodes agiles | « un logiciel qui fonctionne plutôt qu'une documentation exhaustive » |
| **<span class="term" data-term="scrum">Scrum</span>** | un cadre de travail léger où une équipe livre un incrément utile à chaque sprint, puis inspecte et s'adapte | `team-orders` livre toutes les deux semaines et revoit son plan à chaque fin de sprint |
| **<span class="term" data-term="sprint">Sprint</span>** | une période de durée fixe, un mois au plus, pendant laquelle l'équipe vise un objectif et produit un incrément | le sprint du 2 au 13 mars, objectif « payer en trois fois » |
| **<span class="term" data-term="timebox">Timebox</span>** | une durée maximale fixée à l'avance pour une activité : on s'arrête à l'heure, même si ce n'est pas fini | le daily dure 15 minutes au plus |
| **<span class="term" data-term="product-owner">Product owner</span>** (PO) | la personne qui répond de la valeur du produit et ordonne le backlog | ada décide que le paiement en trois fois passe avant le mode sombre |
| **<span class="term" data-term="scrum-master">Scrum Master</span>** | la personne qui répond de l'efficacité de l'équipe et de la bonne compréhension de Scrum | grace remarque que le daily dure 40 minutes et propose de sortir les discussions techniques |
| **Développeurs** (Developers) | dans Scrum, toutes les personnes qui construisent l'incrément : développeurs, QA, designers, ops | alan, linus et margaret |
| **<span class="term" data-term="product-backlog">Product backlog</span>** | la liste ordonnée de tout ce qui pourrait améliorer le produit | 60 éléments, les 10 premiers détaillés et prêts |
| **<span class="term" data-term="sprint-goal">Objectif de sprint</span>** (Sprint Goal) | la phrase qui dit pourquoi le sprint compte, et qui guide les choix pendant le sprint | « un client peut payer en trois fois par carte » |
| **<span class="term" data-term="increment">Incrément</span>** | un morceau de produit terminé, utilisable, qui s'ajoute aux précédents | le paiement en trois fois en production, derrière un feature flag |
| **<span class="term" data-term="definition-of-done">Définition de terminé</span>** (DoD) | la liste commune des conditions qu'un travail remplit pour être fini | tests verts en CI, revue faite, documentation à jour |
| **<span class="term" data-term="kanban">Kanban</span>** | une méthode qui gère le flux de travail : visualiser, limiter le travail en cours, améliorer | un tableau avec une limite de 3 tickets « en cours » |
| **<span class="term" data-term="wip-limit">Limite de WIP</span>** | le nombre maximum d'éléments autorisés en même temps dans une étape | « en revue : 2 au plus » |
| **<span class="term" data-term="cycle-time">Temps de cycle</span>** (cycle time) | le temps entre le moment où l'équipe commence un élément et celui où il est fini | ticket commencé lundi, en production jeudi : 4 jours |
| **<span class="term" data-term="lead-time">Délai de livraison</span>** (lead time) | le temps entre la demande et la livraison, attente avant le début comprise | demandé le 1er, commencé le 10, livré le 13 : 13 jours |
| **<span class="term" data-term="throughput">Débit</span>** (throughput) | le nombre d'éléments finis par unité de temps | 4 tickets finis par semaine |
| **<span class="term" data-term="work-item-age">Âge d'un élément</span>** (work item age) | depuis combien de temps un élément en cours a commencé | le ticket 41 est en cours depuis 9 jours |
| **<span class="term" data-term="story-points">Points d'histoire</span>** (story points) | une unité relative de taille, propre à une équipe, qui mêle effort, complexité et incertitude | une story à 5 points paraît deux fois et demie plus grosse qu'une story à 2 |
| **<span class="term" data-term="velocity">Vélocité</span>** | le nombre de points qu'une équipe finit par sprint, en moyenne | 21, 18 et 24 points sur les trois derniers sprints |
| **<span class="term" data-term="extreme-programming">Extreme Programming</span>** (XP) | une méthode agile centrée sur les pratiques d'ingénierie : binôme, TDD, intégration continue | alan et linus écrivent le test d'abord, à deux sur le même poste |
| **<span class="term" data-term="sli">SLI</span>** | Service Level Indicator : l'indicateur mesuré pour savoir si quelque chose marche | la part des tickets finis en moins de 10 jours |
| **<span class="term" data-term="slo">SLO</span>** | Service Level Objective : la cible interne fixée sur un SLI | « 85 % des tickets finis en moins de 10 jours » (exemple) |
| **<span class="term" data-term="sla">SLA</span>** | Service Level Agreement : la promesse contractuelle faite à un client, avec une pénalité, en général plus lâche que le SLO | un correctif de bug bloquant sous 5 jours ouvrés, promis à un client, sinon remise (exemple) |

Une phrase de daily, décodée :

``` { .text .ex-illus title="Illustration" }
« L'objectif de sprint est en danger : le 41 a 9 jours d'âge, la colonne revue est à sa limite,
  je propose qu'on arrête de commencer et qu'on finisse. »

objectif de sprint en danger   la phrase « payer en trois fois » risque de ne pas être atteinte
le 41 a 9 jours d'âge          le ticket 41 est commencé depuis 9 jours, bien plus que d'habitude
la colonne revue à sa limite   2 MR attendent une revue, le maximum que l'équipe s'autorise
arrêter de commencer           personne ne prend un nouveau ticket avant d'avoir aidé à finir
```

## Le Manifeste agile

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Dans les années 1990, beaucoup de projets suivaient le modèle en cascade : six mois de spécifications, un an de développement, puis des tests à la fin, où l'on découvrait que le besoin avait changé. En février 2001, dix-sept praticiens (parmi eux Kent Beck, Ken Schwaber, Jeff Sutherland, Ward Cunningham, Martin Fowler, Alistair Cockburn) se retrouvent à Snowbird, dans l'Utah, et écrivent le <span class="term" data-term="agile-manifesto">Manifeste pour le développement agile de logiciels</span>. Ils pratiquaient déjà Scrum, XP, Crystal ou DSDM, et cherchaient ce que ces méthodes avaient en commun.

### Les quatre valeurs

Le texte tient en quatre lignes. Chaque ligne préfère l'élément de gauche, sans jeter celui de droite :

| Nous valorisons davantage... | ...que | Ce que ça change pour `team-orders` |
|---|---|---|
| les individus et leurs interactions | les processus et les outils | quand un ticket bloque, alan va voir margaret au lieu de changer le statut dans l'outil et d'attendre |
| un logiciel qui fonctionne | une documentation exhaustive | l'équipe montre le paiement en trois fois en démo plutôt qu'un document de 40 pages |
| la collaboration avec le client | la négociation contractuelle | ada invite deux clients à la revue de sprint au lieu de se défendre avec le cahier des charges |
| l'adaptation au changement | le suivi d'un plan | le paiement en trois fois passe avant la refonte du profil, parce que les retours clients l'ont montré |

!!! noob "As noob"
    Je prépare un voyage en voiture. La cascade, c'est imprimer tout l'itinéraire la veille et le suivre même quand la radio annonce un bouchon. L'agilité, c'est garder la destination, rouler par étapes et regarder le GPS à chaque pause pour changer de route si besoin. Limite de l'image : en logiciel, la destination elle-même peut changer en route. La phrase à retenir : **le Manifeste dit « plutôt que », pas « au lieu de » : le plan et la documentation comptent, simplement moins que ce qui marche.**

### Les douze principes en clair

Le Manifeste ajoute douze principes. Je les regroupe en quatre idées que je peux réciter :

| Idée | Principes résumés | Exemple concret |
|---|---|---|
| livrer tôt et souvent | satisfaire le client en livrant tôt et en continu ; livrer toutes les quelques semaines ; le logiciel qui fonctionne mesure l'avancement | `shop-app` part en production chaque semaine, pas une fois par trimestre |
| accueillir le changement | accepter les changements de besoin, même tard | un nouveau moyen de paiement arrive au milieu du trimestre, il entre dans le backlog |
| des personnes motivées qui se parlent | métier et développeurs travaillent ensemble chaque jour ; faire confiance à des personnes motivées ; préférer la conversation en face à face ; équipes auto-organisées ; rythme soutenable | ada est assise avec l'équipe ; personne ne fait de soirées en fin de sprint |
| bien faire et s'améliorer | l'excellence technique et la bonne conception renforcent l'agilité ; la simplicité, l'art de maximiser le travail qu'on ne fait pas ; à intervalles réguliers, l'équipe réfléchit et s'ajuste | la rétrospective choisit une amélioration par sprint ; l'équipe refuse de construire un export que personne n'a demandé |

**Quand** : le Manifeste n'est pas un processus à « appliquer », c'est une grille pour juger un processus. Je le relis quand une pratique agile tourne au rituel vide, ou quand on me dit « on est agiles, donc pas de documentation ». **Pourquoi** : il remet le but avant les outils ; deux équipes peuvent faire Scrum, l'une agile, l'autre non. **Comment** : devant une règle d'équipe, je me demande quelle valeur elle sert ; si aucune, je propose de la supprimer.

**Risques.** Le Manifeste a été écrit par et pour des équipes de développement ; l'étendre tel quel à toute une organisation (achats, juridique, budget annuel) crée des frictions que le texte ne règle pas. Le lire comme « pas de plan, pas de documentation » laisse l'équipe sans trace de ses décisions : je garde les documents qui servent, comme les ADR et le README. Plusieurs signataires ont critiqué ce que l'« Agile » industriel est devenu, comme Dave Thomas (« Agile is Dead (Long Live Agility) », 2014) : je cite le texte, pas la marque.

:material-book-open-variant: Doc de référence : [Manifeste pour le développement agile de logiciels](https://agilemanifesto.org/iso/fr/manifesto.html) (2001) ; [les douze principes](https://agilemanifesto.org/iso/fr/principles.html) (2001)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | l'équipe se dit agile et livre par itérations, mais personne ne sait citer les valeurs |
    | N2 | l'équipe livre un logiciel qui fonctionne au moins une fois par mois, et le métier le voit à chaque fois |
    | N3 | les règles d'équipe qui ne servent aucune valeur sont retirées en rétrospective, sans attendre l'accord d'un manager |
    | N4 | l'équipe suit la fréquence de livraison et le délai entre une demande et sa mise en production, et ajuste sa façon de travailler sur ces chiffres |

    **Je mesure** : le nombre de mises en production par mois, lu dans l'outil de déploiement ; le délai médian entre la création d'un ticket et sa mise en production, lu dans l'outil de tickets.

## Panorama des méthodes agiles

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le mot « agile » regroupe une dizaine de méthodes, nées à des époques différentes pour des problèmes différents. Certaines organisent le travail d'une équipe (Scrum, Kanban), d'autres disent comment écrire le code (XP), d'autres coordonnent des dizaines d'équipes (SAFe), d'autres encore aident à choisir sa propre façon de travailler (Disciplined Agile). Avant de comparer, je me demande donc quel problème j'ai : le rythme de l'équipe, la qualité du code, le flux des demandes ou la coordination entre équipes.

### Comparaison rapide

| Méthode | Origine | Sprints | Ce qu'elle priorise | Taille visée | Je la choisis quand... |
|---|---|---|---|---|---|
| [Scrum](#scrum) | Schwaber et Sutherland, 1995 | oui, un mois au plus | organiser et livrer par itérations courtes | une équipe de 10 personnes ou moins | mon équipe construit un produit dont le besoin se précise en route, avec un PO disponible |
| [Kanban](#kanban-en-profondeur) | David J. Anderson, 2010 | non, flux continu | le flux : moins de travail en cours, des délais plus courts | une équipe ou un service | les demandes arrivent sans prévenir, comme des bugs et du support |
| [Scrumban](#scrum-kanban-ou-scrumban) | Corey Ladas, 2009 | facultatifs | la souplesse : les rendez-vous de Scrum, le flux de Kanban | une équipe | mon équipe Scrum voit ses tickets s'empiler en revue et en test |
| [XP](#extreme-programming) | Kent Beck, 1999 | généralement oui, d'une à deux semaines | la qualité technique : tests, binôme, intégration continue | une équipe de 2 à 12 développeurs | mon code devient plus cher à changer à chaque sprint |
| [Lean](#lean-software-development) | Poppendieck, 2003, d'après Toyota | non imposés | l'efficacité : supprimer le gaspillage, optimiser le tout | une équipe ou toute l'organisation | une demande de 3 jours de travail met 3 semaines à arriver en production |
| [Crystal](#crystal) | Alistair Cockburn, années 1990 | variable, livraisons fréquentes | la collaboration humaine, adaptée à la taille et au risque | de 6 à plus de 100 personnes, selon la variante | mon équipe est petite, assise ensemble, et veut le moins de règles possible |
| [DSDM](#dsdm-et-fdd) | consortium britannique, 1994 | oui, des timebox de 2 à 6 semaines | tenir une date et un budget en faisant varier le périmètre | un projet, une ou plusieurs équipes | j'ai une date fixe et un client qui attend un cadre de projet |
| [FDD](#dsdm-et-fdd) | Jeff De Luca, 1997 | des cycles de deux semaines au plus par fonctionnalité | des fonctionnalités livrées une par une, sur un modèle du domaine | de grandes équipes de développement | j'ai beaucoup de développeurs sur un domaine riche à modéliser |
| [SAFe](#lagilite-a-lechelle) | Dean Leffingwell, 2011 | oui, des itérations de 2 semaines dans des incréments de 8 à 12 semaines | coordonner plusieurs équipes et le portefeuille | de 50 à plusieurs milliers de personnes | une grande organisation doit aligner budget, portefeuille et équipes |
| [Disciplined Agile](#disciplined-agile) | Scott Ambler et Mark Lines, 2012 | variable, selon le cycle de vie choisi | l'adaptation : choisir sa façon de travailler selon le contexte | une équipe à toute l'entreprise | mes équipes ont des contextes trop différents pour une seule méthode |

!!! noob "As noob"
    Ces méthodes sont comme des boîtes à outils de cuisine. Scrum est le planning des services, Kanban le passe-plat qui limite les assiettes en attente, XP la technique des cuisiniers, Lean la chasse au gâchis, SAFe l'organisation d'une chaîne de cinquante restaurants. Un restaurant prend souvent plusieurs boîtes à la fois. La phrase à retenir : **je choisis une méthode pour le problème qu'elle règle, pas pour son nom.**

### Lean software development

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Mary et Tom Poppendieck transposent au logiciel la production de Toyota (« Lean Software Development: An Agile Toolkit », 2003 ; « Implementing Lean Software Development », 2006). Le Lean ne donne ni rôles ni réunions : il donne des principes pour juger un processus. Dans la version de 2006, ils sont sept : éliminer le gaspillage, intégrer la qualité dès le début, créer de la connaissance, retarder les engagements irréversibles, livrer vite, respecter les personnes, optimiser le tout.

``` { .text .ex-illus title="Illustration · le gaspillage dans une demande de team-orders" }
Demande « ajouter un champ de commentaire à la commande »
Travail réel       : 3 jours (code, tests, revue)
Délai total        : 19 jours
  attente de priorisation      6 jours   gaspillage : attente
  attente d'une revue          4 jours   gaspillage : attente
  aller-retour sur le besoin   3 jours   gaspillage : travail refait
  attente de l'environnement   3 jours   gaspillage : attente
Efficacité du flux : 3 / 19 = 16 % (chiffres d'exemple)
```

**Quand** : les délais sont longs alors que chacun travaille beaucoup ; l'équipe optimise son étape et le tout reste lent. **Pourquoi** : l'essentiel du délai est souvent de l'attente, pas du travail ; la réduire coûte moins cher que de travailler plus vite. **Comment** : je dessine le flux de valeur, je mesure travail et attente, puis je traite la plus grosse attente. Le détail (Toyota, cartographie du flux de valeur, théorie des contraintes, les sept gaspillages) est dans [Lean et flux](culture-entreprise.md#lean-et-flux).

**Risques.** « Éliminer le gaspillage » mal compris sert à supprimer les tests, la documentation ou les rétrospectives, qui ne sont pas du gaspillage : ils évitent du travail refait. Optimiser une étape isolée (« les développeurs codent plus vite ») sans regarder le tout ne fait que déplacer la file d'attente.

:material-book-open-variant: Doc de référence : Mary et Tom Poppendieck, « Implementing Lean Software Development » (2006)
{ .doc-ref }

### Crystal

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Alistair Cockburn, signataire du Manifeste, part d'un constat : les projets réussissent surtout grâce aux personnes et à leur façon de communiquer, et une méthode doit s'adapter à l'équipe, pas l'inverse. Crystal est une famille de méthodes, rangées par couleur selon la taille de l'équipe (Clear jusqu'à environ 6 personnes, puis Yellow, Orange, Red...) et selon ce qu'un défaut peut coûter (du confort perdu jusqu'à des vies). Plus l'équipe est grande et le risque élevé, plus la méthode ajoute de règles.

Crystal Clear (« Crystal Clear: A Human-Powered Methodology for Small Teams », 2004) demande sept propriétés, dont trois obligatoires :

| Propriété | Ce que ça veut dire | Exemple chez `team-orders` |
|---|---|---|
| livraison fréquente (obligatoire) | du code utilisable livré à des utilisateurs tous les quelques mois au plus, idéalement bien plus souvent | une version en production chaque semaine |
| amélioration par la réflexion (obligatoire) | l'équipe s'arrête régulièrement pour revoir sa façon de travailler | une rétrospective toutes les deux semaines |
| communication osmotique (obligatoire) | l'équipe est assez proche pour entendre les questions des autres et y répondre | ada entend alan buter sur une règle d'échéance et répond aussitôt |
| sécurité personnelle | chacun peut dire « je ne sais pas » ou « je me suis trompé » sans crainte | margaret signale son propre test faux en daily |
| focalisation | chacun sait sur quoi travailler et a du temps sans interruption | deux heures sans réunion chaque matin |
| accès facile aux utilisateurs experts | une personne du métier répond en moins d'une journée | un conseiller clientèle joignable par message |
| environnement technique solide | tests automatisés, gestion de configuration, intégration fréquente | CI sur chaque MR |

**Quand** : une petite équipe, au même endroit ou en contact permanent, sur un produit peu critique, qui veut le moins de cérémonies possible. **Quand ne pas l'utiliser** : une équipe répartie sur plusieurs fuseaux horaires, où la communication osmotique ne se produit pas d'elle-même. **Risques.** Crystal donne peu de règles concrètes ; une équipe sans expérience y trouve peu d'appui et retombe dans ses anciennes habitudes. La méthode est aujourd'hui peu pratiquée sous son nom, mais ses idées (proximité, sécurité, réflexion) sont partout.

:material-book-open-variant: Doc de référence : [Alistair Cockburn, site personnel](https://alistair.cockburn.us/) (consultée en novembre 2026) ; Alistair Cockburn, « Crystal Clear » (2004)
{ .doc-ref }

### DSDM et FDD

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Deux méthodes plus anciennes que le Manifeste reviennent encore dans les appels d'offres et les grandes entreprises.

**DSDM** (Dynamic Systems Development Method, consortium britannique, 1994, aujourd'hui « DSDM Agile Project Framework » de l'Agile Business Consortium) fixe la date, le budget et la qualité, et fait varier le périmètre. Elle priorise avec **MoSCoW** : Must have, Should have, Could have, Won't have this time. La règle d'usage : les « Must » ne dépassent pas environ 60 % de l'effort, pour garder une marge.

``` { .text .ex-illus title="Illustration · MoSCoW pour la livraison du 1er juin" }
Must    paiement en trois fois par carte, calcul des échéances, e-mail de confirmation
Should  export comptable des échéances
Could   rappel par SMS avant chaque échéance
Won't   paiement en trois fois sur l'application mobile (prochaine livraison)
```

**FDD** (Feature-Driven Development, Jeff De Luca et Peter Coad, 1997, projet bancaire à Singapour) part d'un modèle du domaine, dresse la liste des fonctionnalités vues par le client (« calculer les échéances d'une commande »), puis les conçoit et les construit une par une, en deux semaines au plus chacune.

**Quand** : DSDM quand un contrat ou une direction impose une date et un budget fixes ; FDD quand beaucoup de développeurs travaillent sur un domaine riche. **Risques.** Avec DSDM, tout devient « Must » si personne n'ose arbitrer, et la marge disparaît. FDD repose sur des propriétaires de classes et un architecte en chef : l'équipe dépend de quelques personnes clés.

:material-book-open-variant: Doc de référence : [Agile Business Consortium, The DSDM Agile Project Framework](https://www.agilebusiness.org/resource/the-dsdm-agile-project-framework/) (édition 2014, à vérifier)
{ .doc-ref }

### Disciplined Agile

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Scott Ambler et Mark Lines (« Disciplined Agile Delivery », 2012) partent du constat inverse des méthodes précédentes : aucune méthode ne convient à toutes les équipes. Disciplined Agile (DA), racheté par le PMI en 2019, est une **boîte à outils** pour choisir sa propre façon de travailler (« choose your WoW », Way of Working). Elle propose plusieurs cycles de vie (agile proche de Scrum, lean proche de Kanban, livraison continue, exploratoire, programme de plusieurs équipes) et, pour chaque décision (comment prioriser, comment tester, comment livrer), une liste d'options avec leurs compromis.

**Quand** : une grande organisation dont les équipes ont des contextes très différents (une équipe de produit grand public, une équipe réglementaire, une équipe d'exploitation), et où une méthode unique imposée à tous ferait souffrir la moitié des équipes. **Pourquoi** : chaque équipe garde un vocabulaire commun tout en choisissant ses pratiques. **Comment** : l'équipe part de son contexte (taille, risque, réglementation), choisit un cycle de vie, puis ses options, et revoit ses choix en rétrospective.

**Risques.** La boîte à outils est très grande : sans accompagnement, l'équipe passe plus de temps à choisir qu'à livrer. Les certifications payantes peuvent devenir le but à la place de l'amélioration.

:material-book-open-variant: Doc de référence : [PMI, Disciplined Agile](https://www.pmi.org/disciplined-agile) (consultée en novembre 2026)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | l'équipe applique la méthode imposée par l'entreprise, sans savoir quel problème elle doit régler |
    | N2 | l'équipe a écrit quel problème sa méthode règle (rythme, flux, qualité, coordination) et pourquoi elle l'a choisie |
    | N3 | les règles de la méthode choisie s'appliquent sans arbitrage (limites de WIP, timebox, CI bloquante) |
    | N4 | l'équipe compare ses mesures avant et après chaque changement de méthode ou de pratique, et revient en arrière si elles se dégradent |

    **Je mesure** : le temps de cycle et la fréquence de mise en production avant et après un changement de méthode, lus dans l'outil de tickets et l'outil de déploiement.

## Scrum

### D'où vient Scrum et quand l'utiliser

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le mot vient du rugby, la mêlée. Hirotaka Takeuchi et Ikujiro Nonaka l'utilisent en 1986 dans « The New New Product Development Game » (Harvard Business Review) pour décrire des équipes produit qui avancent ensemble plutôt qu'en relais. Ken Schwaber et Jeff Sutherland présentent Scrum pour le logiciel en 1995 (conférence OOPSLA), puis publient le **Scrum Guide**, dont la dernière édition date de novembre 2020. Le guide fait 13 pages : c'est la seule définition officielle.

<span class="term" data-term="scrum">Scrum</span> repose sur l'**empirisme** : je décide à partir de ce que j'observe, pas d'un plan fait au début. Trois piliers le permettent : la **transparence** (tout le monde voit le même état du travail), l'**inspection** (on regarde souvent ce qu'on a produit et comment) et l'**adaptation** (on change dès qu'un écart apparaît). Cinq valeurs soutiennent ces piliers : engagement, focalisation, ouverture, respect et courage.

**Quand** : mon équipe construit un produit où le besoin n'est pas entièrement connu à l'avance, avec un objectif qui tient sur quelques semaines, et une équipe stable de 10 personnes ou moins. Le cadre [Cynefin](culture-entreprise.md#cynefin) range ce genre de problème dans le domaine « complexe », où l'on avance par essais. **Quand ne pas l'utiliser** : une équipe surtout réactive (support, exploitation, bugs de production en continu), où un plan de deux semaines est cassé dès le mardi ; un travail répétitif et bien connu, où une simple file suffit. **Pourquoi** : un rythme fixe force à finir quelque chose de montrable souvent, donc à recevoir des retours tôt et à corriger le cap à faible coût. Le coût : environ 10 % du temps en réunions pour un sprint de deux semaines (exemple), et un vrai changement de rôle pour le PO et le manager.

``` mermaid
flowchart LR
  PB[Product backlog<br/>objectif de produit] --> SP[Sprint planning]
  SP --> SB[Sprint backlog<br/>objectif de sprint]
  SB --> S((Sprint<br/>daily chaque jour))
  S --> I[Incrément<br/>définition de terminé]
  I --> SR[Sprint review]
  SR --> RE[Rétrospective]
  RE --> SP
  SR -. retours .-> PB
```

!!! noob "As noob"
    Scrum, c'est une cuisine de restaurant qui sort un menu nouveau toutes les deux semaines. Au début, l'équipe choisit les plats qu'elle peut vraiment réussir ; chaque matin, elle fait le point devant les fourneaux ; à la fin, les clients goûtent ; puis les cuisiniers parlent de leur façon de travailler, pas des plats. La phrase à retenir : **Scrum est une boucle courte « planifier, faire, montrer, s'améliorer », répétée à rythme fixe.**

**Risques.** Scrum rend visibles les problèmes, il ne les règle pas : une équipe qui dépend de cinq autres équipes verra chaque sprint échouer sur ces dépendances, et devra changer son organisation, pas ses réunions. Ken Schwaber le résume souvent par « Scrum est facile à comprendre, difficile à maîtriser ». Appliquer seulement les réunions sans donner à l'équipe le pouvoir de décider produit ce que Ron Jeffries appelle le « Dark Scrum » (2016), voir [Quand l'agilité dérape](#quand-lagilite-derape).

:material-book-open-variant: Doc de référence : [Ken Schwaber et Jeff Sutherland, The Scrum Guide](https://scrumguides.org/scrum-guide.html) (novembre 2020)
{ .doc-ref }

### L'équipe Scrum et ses trois responsabilités

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Une équipe Scrum compte en général 10 personnes ou moins, sans sous-équipes ni hiérarchie interne. Le Scrum Guide 2020 ne parle plus de « rôles » mais de **responsabilités** (accountabilities) :

| Responsabilité | De quoi elle répond | Ce qu'elle fait | Ce qu'elle ne fait pas |
|---|---|---|---|
| <span class="term" data-term="product-owner">Product owner</span> | maximiser la valeur du produit | écrit l'objectif de produit, ordonne le backlog, accepte ou refuse le travail | dire aux développeurs comment faire, ni combien prendre dans le sprint |
| <span class="term" data-term="scrum-master">Scrum Master</span> | l'efficacité de l'équipe Scrum | aide l'équipe à s'auto-gérer, fait sauter les obstacles, enseigne Scrum à l'organisation | prendre les notes du daily, distribuer les tickets, faire le chef de projet |
| Développeurs | un incrément utile et de qualité à chaque sprint | construisent le sprint backlog, s'organisent entre eux, respectent la définition de terminé | attendre qu'on leur assigne les tâches |

Le guide décrit le Scrum Master comme « un vrai leader qui sert » (true leader who serves) : il agit sur l'équipe, sur le PO (techniques de gestion du backlog) et sur l'organisation (lever les freins hors de l'équipe).

``` { .text .ex-illus title="Illustration · qui décide quoi chez team-orders" }
Le paiement en trois fois passe avant le mode sombre ?     ada (PO)
Combien de stories entrent dans ce sprint ?                 alan, linus, margaret (développeurs)
On découpe la story en API puis écran, ou en tranches ?     les développeurs, avec l'avis d'ada
Le daily dure 40 minutes, on fait quoi ?                    l'équipe, aidée par grace (Scrum Master)
L'équipe sécurité bloque la mise en production depuis 5 j   grace va voir l'équipe sécurité
```

**Risques.** Un PO absent ou sans pouvoir de décision (« je dois demander au directeur ») transforme chaque question en attente de plusieurs jours : je demande que le PO ait le dernier mot sur l'ordre du backlog. Un Scrum Master qui fait aussi développeur à plein temps n'a jamais le temps de lever les obstacles. Un manager qui assigne les tâches au daily retire à l'équipe son auto-gestion, et les développeurs arrêtent de s'engager sur l'objectif.

:material-book-open-variant: Doc de référence : [The Scrum Guide, Scrum Team](https://scrumguides.org/scrum-guide.html#scrum-team) (novembre 2020)
{ .doc-ref }

### Les cinq événements

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Chaque événement est une occasion d'inspecter et d'adapter, avec une <span class="term" data-term="timebox">timebox</span>. Les durées maximales du guide valent pour un sprint d'un mois ; pour un sprint plus court, l'usage est de les réduire en proportion.

| Événement | Durée maximale (sprint d'un mois) | Qui | La question à laquelle il répond |
|---|---|---|---|
| le <span class="term" data-term="sprint">sprint</span> | un mois | toute l'équipe | le conteneur des autres événements : il recommence aussitôt fini |
| sprint planning | 8 heures | toute l'équipe | pourquoi ce sprint compte, quoi faire, comment le faire |
| daily scrum | 15 minutes, chaque jour | les développeurs | où en est-on de l'objectif de sprint, et que change-t-on pour demain ? |
| sprint review | 4 heures | l'équipe et les parties prenantes | qu'a-t-on produit, et qu'est-ce que ça change pour la suite du produit ? |
| rétrospective | 3 heures | l'équipe Scrum | comment avons-nous travaillé, et que changeons-nous ? |

Le **raffinement du backlog** (refinement) n'est pas un événement : c'est une activité continue, où l'équipe découpe, précise et estime les éléments à venir. L'usage courant y consacre au plus 10 % du temps des développeurs (ancien chiffre du guide de 2017, retiré en 2020).

**Risques.** Raccourcir ou sauter la rétrospective « parce qu'on est en retard » coupe la seule boucle d'amélioration : le retard revient au sprint suivant. Une sprint review qui se limite à une démo devant le PO, sans parties prenantes ni discussion du backlog, devient une cérémonie de validation : j'invite au moins un utilisateur ou un représentant du métier, et la review finit sur des changements dans le backlog.

:material-book-open-variant: Doc de référence : [The Scrum Guide, Scrum Events](https://scrumguides.org/scrum-guide.html#scrum-events) (novembre 2020)
{ .doc-ref }

### Les trois artefacts et leurs engagements

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Un artefact est un objet de travail visible par tous. Le guide 2020 attache à chacun un **engagement**, la cible qui lui donne un sens :

| Artefact | Engagement | Exemple pour `team-orders` |
|---|---|---|
| <span class="term" data-term="product-backlog">Product backlog</span> | objectif de produit (Product Goal) | « d'ici fin juin, 70 % des paniers de plus de 200 euros sont payés sans abandon » (exemple) |
| sprint backlog | <span class="term" data-term="sprint-goal">objectif de sprint</span> (Sprint Goal) | « un client peut payer en trois fois par carte » |
| <span class="term" data-term="increment">incrément</span> | <span class="term" data-term="definition-of-done">définition de terminé</span> | tests verts, revue faite, déployé derrière un flag, note de version écrite |

L'objectif de sprint est ce qui distingue un sprint d'une liste de tâches. Il laisse de la marge : si une story se révèle plus grosse que prévu, l'équipe négocie le périmètre avec le PO, mais garde l'objectif.

À éviter : un objectif de sprint qui n'est que la liste des tickets.

``` { .text .ex-bad title="À éviter" }
Objectif de sprint : faire ORD-101, ORD-102, ORD-105, ORD-107 et ORD-110.
(si ORD-107 prend deux fois plus de temps, personne ne sait ce qu'on peut sacrifier)
```

Bien : une phrase de résultat, qui permet d'arbitrer pendant le sprint.

``` { .text .ex-good title="Recommandé" }
Objectif de sprint : un client peut payer en trois fois par carte sur le web.
Stories prévues : ORD-101 calcul des échéances, ORD-102 écran de choix, ORD-105 appel au prestataire,
                  ORD-107 e-mail de confirmation, ORD-110 export comptable.
(ORD-110 glisse au sprint suivant sans casser l'objectif ; ORD-105 ne peut pas glisser)
```

**Risques.** Une définition de terminé qui n'inclut pas les tests ni la mise en production produit des incréments « finis » qui reviennent en bugs au sprint suivant. Un backlog de 400 éléments que personne ne relit n'est plus ordonné : j'archive ce qui n'a pas bougé depuis six mois. Le détail de la définition de terminé côté produit est dans [Product management](product-management.md#definition-de-termine).

:material-book-open-variant: Doc de référence : [The Scrum Guide, Scrum Artifacts](https://scrumguides.org/scrum-guide.html#scrum-artifacts) (novembre 2020)
{ .doc-ref }

### Un sprint de deux semaines, jour par jour

Voici à quoi ressemble un sprint réel chez `team-orders` (exemple) :

``` { .text .ex-illus title="Illustration · sprint du 2 au 13 mars" }
lun. 2   9 h 30  sprint planning, 2 h : ada présente l'objectif « payer en trois fois »,
                 les développeurs prennent 6 stories et les découpent en tâches
mar. 3   9 h 30  daily, 15 min, devant le tableau
mer. 4           daily ; three amigos sur ORD-105 avec ada, alan et margaret
jeu. 5   14 h    raffinement, 1 h : les stories du sprint suivant
lun. 9           daily : ORD-105 bloqué par le prestataire, grace l'appelle
mer. 11          daily : l'objectif tient, ORD-110 glisse, ada est d'accord
ven. 13  10 h    sprint review, 1 h : démo à deux conseillers clientèle, deux idées entrent au backlog
ven. 13  11 h 30 rétrospective, 1 h 30 : une action retenue, « revue de MR sous 4 h »
lun. 16          le sprint suivant commence
```

### Ce qui a changé dans le Scrum Guide 2020

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Beaucoup d'équipes et de questionnaires d'entretien parlent encore de la version 2017. Ce qui a changé en novembre 2020 :

| Avant (2017) | Depuis 2020 |
|---|---|
| l'« équipe de développement » à l'intérieur de l'équipe Scrum | une seule équipe Scrum ; les « développeurs » sont une responsabilité |
| équipe auto-organisée (elle choisit comment) | équipe auto-gérée (elle choisit qui, comment et sur quoi travailler) |
| pas d'objectif au niveau du produit | l'objectif de produit (Product Goal) |
| pas d'engagement nommé | trois engagements : objectif de produit, objectif de sprint, définition de terminé |
| les trois questions du daily (hier, aujourd'hui, obstacles) | aucune structure imposée au daily |
| le sprint planning répond à « quoi » et « comment » | il ajoute « pourquoi ce sprint compte » |
| « servant-leader » pour le Scrum Master | « vrai leader qui sert » |

**Risques.** Citer en entretien les trois questions du daily comme une règle de Scrum montre une connaissance datée : je dis qu'elles étaient dans le guide de 2017 et qu'elles restent un format possible.

:material-book-open-variant: Doc de référence : [Scrum Guides, Revisions to the Scrum Guide](https://scrumguides.org/revisions.html) (novembre 2020)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | l'équipe tient les cinq événements, mais les sprints finissent souvent sans incrément utilisable |
    | N2 | chaque sprint a un objectif écrit en une phrase et finit par un incrément qui respecte la définition de terminé |
    | N3 | l'équipe ajuste seule son périmètre pendant le sprint pour tenir l'objectif, et les tests de la définition de terminé bloquent automatiquement une MR incomplète |
    | N4 | l'équipe suit la part des objectifs de sprint atteints et le temps de cycle, et ses rétrospectives choisissent leurs actions à partir de ces chiffres |

    **Je mesure** : la part des objectifs de sprint atteints sur les six derniers sprints, notée à chaque review ; le nombre de bugs ouverts sur des stories déclarées terminées, lu dans l'outil de tickets.

## Kanban en profondeur

La page [Culture d'entreprise](culture-entreprise.md#kanban) présente Kanban en une section, avec la loi de Little. Je vais ici plus loin : les deux définitions qui coexistent, la conception du tableau, les mesures du flux et les classes de service.

### Deux Kanban : la méthode et le guide

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le mot vient des cartes (kanban veut dire « étiquette » ou « panneau » en japonais) que Taiichi Ohno utilisait chez Toyota dans les années 1950 pour qu'une étape ne produise que ce que l'étape suivante consomme. Pour le travail intellectuel, deux textes coexistent :

| | La méthode Kanban | Le Kanban Guide |
|---|---|---|
| auteurs | David J. Anderson, Kanban University (livre de 2010) | Daniel Vacanti et John Coleman, ProKanban.org (décembre 2020, révisé depuis, à vérifier) |
| idée | une méthode de changement progressif d'une organisation | une stratégie minimale pour optimiser le flux de valeur |
| pratiques | six pratiques : visualiser, limiter le WIP, gérer le flux, rendre les règles explicites, mettre en place des boucles de retour, s'améliorer ensemble par l'expérimentation | trois pratiques : définir et visualiser le workflow, gérer activement les éléments en cours, améliorer le workflow |
| en plus | des principes de gestion du changement (« partir de ce que je fais aujourd'hui ») et sept cadences de réunions | quatre mesures obligatoires du flux |

Les deux s'accordent sur l'essentiel : **arrêter de commencer, commencer à finir** (« stop starting, start finishing »). Contrairement à Scrum, Kanban n'impose ni rôles, ni sprints, ni réunions : il part du fonctionnement actuel de l'équipe.

**Quand** : mon équipe reçoit des demandes de tailles et d'urgences variées, à un rythme imprévisible : support de niveau 2, équipe plateforme, maintenance, équipe d'exploitation. Ou une équipe Scrum dont les sprints cassent sans cesse et qui veut voir où le travail attend. **Pourquoi** : le délai baisse sans travailler plus, juste en commençant moins de choses à la fois ([loi de Little](culture-entreprise.md#loi-de-little-et-limites-de-wip)). **Coût** : il faut la discipline de respecter les limites, et quelqu'un qui regarde les mesures.

**Risques.** « Faire du Kanban » se résume souvent à un tableau Jira en colonnes, sans limite ni mesure : rien ne change, sauf le nom. Sans cadence imposée, une équipe peut ne jamais prendre le temps de s'améliorer : je planifie une revue du flux toutes les deux semaines.

:material-book-open-variant: Doc de référence : [Daniel Vacanti et John Coleman, The Kanban Guide](https://kanbanguides.org/english/) (consultée en novembre 2026) ; [Kanban University, The Official Kanban Guide](https://kanban.university/kanban-guide/) (consultée en novembre 2026)
{ .doc-ref }

### Concevoir le tableau

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Un bon tableau reflète le vrai chemin du travail, pas un modèle tout fait. Je pars de ce que l'équipe fait réellement, j'ajoute les colonnes d'attente (souvent invisibles), puis une limite par étape.

À éviter : trois colonnes génériques et aucune limite. Les tickets « en cours » mélangent ce qui avance et ce qui attend une revue ou un environnement, donc personne ne voit où le travail bloque.

``` { .text .ex-bad title="À éviter" }
À FAIRE (34)      EN COURS (14)       FAIT
                  ORD-88  ada ?
                  ORD-91  attend revue depuis 6 j
                  ORD-95  attend l'environnement de test
                  ...
```

Bien : les étapes réelles, les files d'attente visibles, une limite par étape, et des règles écrites en haut de colonne.

``` { .text .ex-good title="Recommandé" }
PRÊT (max 6)  DEV (max 4)   ATTENTE REVUE   REVUE (max 2)   TEST (max 2)   EN PROD
              en cours|fini
ORD-96        ORD-92 alan   ORD-91 (6 j !)  ORD-89          ORD-88
ORD-97        ORD-93 linus                  ORD-90
Règles : « Prêt » = critères d'acceptation écrits ; « Fini » en DEV = MR ouverte et CI verte ;
         une colonne pleine = j'aide à la vider avant de tirer un nouveau ticket.
```

Les colonnes « fini » et « attente » montrent ce que le premier tableau cachait : ORD-91 n'avance plus depuis six jours parce que la revue est saturée.

**Risques.** Un tableau trop détaillé (quinze colonnes) devient un rituel de mise à jour : je fusionne les étapes que personne ne regarde. Une limite par personne (« 2 tickets chacun ») protège moins qu'une limite par étape, parce qu'elle ne montre pas le goulot.

:material-book-open-variant: Doc de référence : [Kanban University, The Official Kanban Guide](https://kanban.university/kanban-guide/) (consultée en novembre 2026)
{ .doc-ref }

### Les quatre mesures du flux

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le Kanban Guide impose quatre mesures, toutes lisibles dans un outil de tickets :

| Mesure | Définition | Question à laquelle elle répond | Exemple |
|---|---|---|---|
| travail en cours (WIP) | le nombre d'éléments commencés et pas finis | est-ce qu'on commence trop de choses ? | 11 tickets en cours pour 4 personnes |
| <span class="term" data-term="throughput">débit</span> | le nombre d'éléments finis par période | combien d'éléments on livre, réellement ? | 4 par semaine en moyenne |
| <span class="term" data-term="work-item-age">âge des éléments</span> | depuis combien de temps chaque élément en cours a commencé | quel ticket est en train de mal tourner, aujourd'hui ? | ORD-91 a 9 jours, quand 85 % des tickets finissent en 7 |
| <span class="term" data-term="cycle-time">temps de cycle</span> | le temps entre le début et la fin d'un élément fini | combien de temps prend un élément, une fois commencé ? | médiane 4 jours, 85 % en 7 jours |

L'âge est la seule mesure qui regarde le présent : le temps de cycle arrive trop tard, une fois le ticket fini. Au daily, je regarde donc d'abord les tickets les plus âgés. Le guide ajoute une <span class="term" data-term="service-level-expectation">attente de niveau de service</span> (SLE, Service Level Expectation) : « 85 % de nos éléments finissent en 7 jours ou moins », calculée sur les temps de cycle passés.

Un **diagramme de flux cumulé** (CFD, cumulative flow diagram) empile, jour par jour, le nombre d'éléments dans chaque colonne. Une bande qui s'élargit montre une étape qui accumule du travail ; une bande « en prod » qui monte en pente régulière montre un flux stable.

``` { .text .ex-illus title="Illustration · lire un diagramme de flux cumulé" }
nombre
d'éléments
  40 ┤                                        ░░░ à faire
  30 ┤                         ░░░░░░░░░░░░░░░▒▒▒ revue   (la bande « revue » s'élargit :
  20 ┤            ░░░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒             les MR attendent de plus en plus)
  10 ┤  ░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ en prod
   0 ┼─────────────────────────────────────────── semaines
```

!!! noob "As noob"
    Je pense à une caisse de supermarché. Le débit, c'est le nombre de clients servis par heure ; le temps de cycle, le temps passé par un client entre l'arrivée à la caisse et la sortie ; l'âge, depuis combien de temps le client devant moi attend ; le WIP, le nombre de personnes dans la file. La phrase à retenir : **pour savoir si un ticket va mal, je regarde son âge aujourd'hui, pas le temps de cycle moyen d'hier.**

**Risques.** Mesurer le débit en nombre de tickets pousse à découper artificiellement les tickets : le chiffre monte, la valeur livrée non ([loi de Goodhart](lois-et-principes.md#loi-de-goodhart)). Je garde ces mesures pour l'équipe, pour comparer l'équipe à elle-même, jamais pour comparer deux équipes. Des moyennes cachent les cas extrêmes : je lis des percentiles (50 %, 85 %).

:material-book-open-variant: Doc de référence : [Daniel Vacanti et John Coleman, The Kanban Guide, Flow Metrics](https://kanbanguides.org/english/) (consultée en novembre 2026) ; Daniel Vacanti, « Actionable Agile Metrics for Predictability » (2015)
{ .doc-ref }

### Classes de service

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Tous les tickets n'ont pas le même coût d'attente. Une **classe de service** est une règle de traitement écrite pour un type d'élément. La méthode Kanban en propose quatre classiques :

| Classe | Coût du retard | Règle d'exemple | Exemple |
|---|---|---|---|
| urgente (expedite) | énorme et immédiat | passe devant tout, dépasse la limite de WIP, une seule à la fois | le paiement par carte est en panne en production |
| date fixe | nul avant la date, énorme après | commencée assez tôt pour finir avant la date | la mise en conformité TVA au 1er janvier |
| standard | grandit avec le temps | premier arrivé, premier servi, dans l'ordre du PO | le paiement en trois fois |
| intangible | faible aujourd'hui, peut exploser plus tard | une part fixe de capacité, par exemple 1 ticket sur 5 | monter la version d'un framework avant sa fin de support |

**Risques.** Si un ticket sur trois devient « urgent », la classe n'a plus de sens et les tickets standard n'avancent plus : je limite la voie urgente à un élément et je compte combien de fois elle sert par mois. Le travail intangible est toujours repoussé s'il n'a pas une part réservée : c'est ainsi que la dette technique gagne. Le lien avec le [coût du retard](culture-entreprise.md#cout-du-retard) aide à choisir la classe.

:material-book-open-variant: Doc de référence : [Kanban University, The Official Kanban Guide](https://kanban.university/kanban-guide/) (consultée en novembre 2026)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | un tableau montre le travail, sans limite ni règle écrite |
    | N2 | chaque étape a une limite de WIP, les files d'attente sont visibles, les règles sont écrites sur le tableau |
    | N3 | l'outil empêche de tirer un ticket dans une colonne pleine, et signale seul un ticket dont l'âge dépasse la SLE |
    | N4 | l'équipe revoit chaque mois le temps de cycle, le débit et le diagramme de flux cumulé, et change ses limites ou ses étapes à partir de ces chiffres |

    **Je mesure** : le 85e percentile du temps de cycle sur les 30 derniers jours, lu dans l'outil de tickets ; le nombre de tickets plus âgés que la SLE au daily.

## Scrum, Kanban ou Scrumban

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

La question revient dans presque chaque équipe et chaque entretien. Les deux ne s'opposent pas : Scrum donne un rythme et des rôles, Kanban donne une gestion du flux. Scrum.org a même publié « The Kanban Guide for Scrum Teams » (Daniel Vacanti et Yuval Yeret, 2018, révisé en 2021) pour ajouter les pratiques Kanban à Scrum.

| | Scrum | Kanban |
|---|---|---|
| rythme | des sprints de durée fixe | un flux continu, des cadences au choix |
| rôles | PO, Scrum Master, développeurs | aucun rôle imposé |
| limiter le travail en cours | indirectement, par ce qui entre dans le sprint | directement, par une limite par étape |
| changer le plan en cours de route | possible, mais l'objectif de sprint reste | à tout moment : on tire le prochain élément le plus utile |
| mesure principale | objectif de sprint atteint, parfois la vélocité | temps de cycle, débit, âge |
| livraison | au moins un incrément par sprint | dès qu'un élément est fini |

Le **Scrumban** (Corey Ladas, « Scrumban », 2009) désignait au départ le passage d'une équipe Scrum vers Kanban. Aujourd'hui, le mot désigne surtout un mélange : des événements Scrum (planning, review, rétro) et un tableau Kanban avec des limites de WIP et des mesures du flux.

| Situation | J'utilise... |
|---|---|
| mon équipe construit une nouvelle fonctionnalité sur plusieurs mois, avec un PO disponible et un besoin qui se précise en route, comme un nouveau tunnel de paiement | Scrum |
| mon équipe traite surtout des demandes imprévues, comme des bugs de production et des demandes d'autres équipes, qui cassent tout plan de deux semaines | Kanban |
| mon équipe fait du Scrum mais ses tickets traînent en revue et en test, et elle veut voir où le travail attend sans perdre ses rendez-vous | Scrumban : Scrum avec un tableau limité en WIP et des mesures du flux |
| mon équipe partage son temps entre un projet et du support, comme une équipe plateforme qui reçoit des demandes en plus de sa feuille de route | Kanban avec deux classes de service, ou une capacité réservée au support dans chaque sprint |
| mon équipe débute et n'a aucune habitude commune | Scrum, pour sa structure simple, puis j'ajoute des pratiques Kanban |

**Risques.** Choisir Kanban pour « ne plus avoir de réunions » fait disparaître les moments d'amélioration et de retour client : je garde une revue et une rétrospective, même sans sprint. Imposer Scrum à une équipe d'exploitation crée des sprints qui échouent chaque fois, et l'équipe finit par mépriser l'agilité.

:material-book-open-variant: Doc de référence : [Daniel Vacanti et Yuval Yeret, The Kanban Guide for Scrum Teams](https://www.scrum.org/resources/kanban-guide-scrum-teams) (révision de 2021)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | l'équipe applique le cadre choisi par l'entreprise, sans en avoir discuté |
    | N2 | l'équipe a choisi son cadre à partir de la nature de son travail, et l'écrit dans son accord d'équipe |
    | N3 | les règles du cadre (limites de WIP, timebox) s'appliquent sans arbitrage d'un manager |
    | N4 | l'équipe compare ses mesures (temps de cycle, objectifs atteints) avant et après un changement de cadre, et revient en arrière si elles se dégradent |

    **Je mesure** : la part du travail non planifié dans chaque sprint ou chaque mois, lue dans l'outil de tickets ; le temps de cycle avant et après le changement.

## Extreme Programming

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Scrum et Kanban disent comment organiser le travail, pas comment écrire du code. Une équipe Scrum peut donc livrer toutes les deux semaines un code de plus en plus difficile à changer. <span class="term" data-term="extreme-programming">Extreme Programming</span> (XP) comble ce vide. Kent Beck la met au point sur le projet de paie C3 de Chrysler vers 1996, puis la décrit dans « Extreme Programming Explained » (1999, deuxième édition avec Cynthia Andres en 2004). L'idée : pousser à l'extrême les pratiques qui marchent. Si la revue de code est utile, on relit en continu (binôme) ; si les tests sont utiles, on les écrit avant le code (TDD) ; si l'intégration est utile, on intègre plusieurs fois par jour.

XP repose sur cinq valeurs : communication, simplicité, retour (feedback), courage et respect (ajouté en 2004). Les pratiques que je retrouve le plus dans les équipes d'aujourd'hui :

| Pratique | Ce que c'est | Exemple chez `team-orders` | Lien |
|---|---|---|---|
| <span class="term" data-term="pair-programming">programmation en binôme</span> | deux personnes, un poste : l'une écrit, l'autre relit et réfléchit à la suite, et elles échangent souvent | alan et margaret écrivent ensemble le calcul des échéances | |
| <span class="term" data-term="mob-programming">programmation en groupe</span> (mob) | toute l'équipe sur un seul poste, un clavier qui tourne (Woody Zuill, vers 2012) | une demi-journée en groupe pour la migration du prestataire de paiement | |
| <span class="term" data-term="tdd">TDD</span> | écrire un test qui échoue, le faire passer, nettoyer | le test « 3 échéances de 33,34 / 33,33 / 33,33 » avant le code | [TDD en pratique](conception-tests.md#tdd-en-pratique) |
| intégration continue | intégrer son travail dans la branche principale plusieurs fois par jour, avec une CI qui vérifie | aucune branche ne vit plus d'un jour | [Trunk-based development](livraison.md#trunk-based-development) |
| petites livraisons | mettre en production souvent, par petits morceaux | une mise en production par jour | [Livraison continue](livraison.md#livraison-et-deploiement-continus) |
| <span class="term" data-term="refactoring">refactoring</span> | améliorer la structure du code sans changer son comportement, en continu | renommer et découper le service de paiement au fil des stories | |
| conception simple | le code le plus simple qui passe les tests d'aujourd'hui | pas de moteur de règles générique pour un seul cas de paiement | [Principes de conception](principes-conception.md) |
| propriété collective du code | n'importe qui peut modifier n'importe quelle partie | linus corrige un bug dans le module d'alan sans attendre son retour | |
| rythme soutenable | pas d'heures supplémentaires qui durent | la semaine de 40 heures de la première édition | |
| client sur place, devenu « équipe entière » | le métier travaille avec l'équipe, chaque jour | ada est assise avec les développeurs | |

**Quand** : dès que le code doit vivre longtemps et changer souvent ; c'est la condition pour que Scrum ou Kanban tiennent dans la durée. **Pourquoi** : le Manifeste le dit lui-même, « l'excellence technique renforce l'agilité ». Sans ces pratiques, chaque sprint coûte un peu plus cher que le précédent. **Comment** : je n'adopte pas tout d'un coup ; je commence par l'intégration continue et des tests automatisés, puis le binôme sur les sujets à risque.

!!! noob "As noob"
    Scrum, c'est le calendrier d'entraînement d'une équipe de foot ; XP, c'est la technique de passe et de tir. On peut avoir un excellent calendrier et rater toutes ses passes. La phrase à retenir : **Scrum et Kanban organisent le travail, XP rend le code assez sain pour que ce travail reste rapide.**

**Risques.** Le binôme toute la journée épuise : je le garde pour les sujets difficiles ou pour transmettre un savoir, avec des pauses. La propriété collective sans tests ni revue donne un code que tout le monde modifie et que personne ne comprend. « Conception simple » mal lue devient « pas de conception du tout » : simple veut dire sans ce qui ne sert pas aujourd'hui, pas sans réflexion.

:material-book-open-variant: Doc de référence : [Kent Beck, Extreme Programming Explained (2e édition)](https://www.oreilly.com/library/view/extreme-programming-explained/0321278658/) (2004) ; [Ron Jeffries, What is Extreme Programming?](https://ronjeffries.com/xprog/what-is-extreme-programming/) (2001, mis à jour 2011)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | quelques développeurs écrivent des tests et font du binôme, quand ils y pensent |
    | N2 | chaque changement passe par une CI avec des tests automatisés, et les branches vivent moins de deux jours |
    | N3 | la CI bloque la fusion d'un changement sans test ou qui casse un test, sans qu'un humain ait à le refuser |
    | N4 | l'équipe suit le taux d'échec des changements et le temps de cycle, et décide d'investir dans le refactoring ou le binôme à partir de ces chiffres |

    **Je mesure** : la durée de vie médiane des branches, lue dans Git ; la part des mises en production qui causent un incident ou un retour arrière, lue dans l'outil de déploiement ([DORA](livraison.md#mesurer-la-livraison-dora)).

## Combiner les approches dans une équipe

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Peu d'équipes appliquent une seule méthode « pure ». Mon équipe a en général plusieurs types de travail en même temps : des fonctionnalités à construire, des incidents et du support, du code à garder sain, des processus à fluidifier, une mise en production à rendre sûre. Chaque méthode règle un de ces problèmes, et elles se combinent bien parce qu'elles ne répondent pas aux mêmes questions :

| Approche | La question à laquelle elle répond | Ce que `team-orders` en prend |
|---|---|---|
| [Scrum](#scrum) | à quel rythme planifier, montrer et s'améliorer ? | sprints de deux semaines pour les fonctionnalités, review avec le métier, rétrospective |
| [Kanban](#kanban-en-profondeur) | comment traiter un flux de demandes imprévues sans tout bloquer ? | une voie support et incidents avec sa limite de WIP et une classe urgente |
| [XP](#extreme-programming) | comment garder le code facile à changer ? | TDD sur les calculs, binôme sur les sujets à risque, intégration continue |
| [Lean](#lean-software-development) | où le travail attend-il, et qu'est-ce qui ne sert à rien ? | une cartographie du flux de valeur par trimestre, la chasse aux attentes |
| <span class="term" data-term="devops">DevOps</span> | comment livrer souvent sans casser la production ? | pipeline de déploiement, feature flags, astreinte partagée, observabilité |

Le mot **DevOps** naît en 2009 (Patrick Debois organise les premiers DevOpsDays à Gand ; la même année, John Allspaw et Paul Hammond présentent « 10+ Deploys per Day » à la conférence Velocity). Ce n'est pas une méthode agile au sens du Manifeste mais un mouvement culturel et technique : les personnes qui développent et celles qui exploitent partagent la responsabilité de la production. Il prolonge l'agilité jusqu'à la mise en production, là où beaucoup d'équipes agiles s'arrêtaient (voir [Water-Scrum-Fall](#quand-lagilite-derape)). Le détail technique est dans [Livraison et pratiques d'ingénierie](livraison.md#livraison-et-deploiement-continus) et la mesure dans [DORA](livraison.md#mesurer-la-livraison-dora).

``` mermaid
flowchart LR
  subgraph Rythme["Scrum : le rythme"]
    PL[Planning] --> SPR[Sprint de 2 semaines] --> REV[Review et rétro]
  end
  subgraph Flux["Kanban : la voie support"]
    INC[Incidents et demandes] --> WIP[WIP max 2] --> FIX[Corrigé]
  end
  subgraph Code["XP : le code"]
    TDD[TDD, binôme, CI]
  end
  subgraph Prod["DevOps : la production"]
    PIPE[Pipeline, flags, observabilité]
  end
  SPR --> TDD
  WIP --> TDD
  TDD --> PIPE
  LEAN["Lean : chaque trimestre, carte du flux de valeur"] -.-> Rythme
  LEAN -.-> Flux
```

Une semaine type chez `team-orders` (exemple) :

``` { .text .ex-illus title="Illustration · une équipe qui combine cinq approches" }
Capacité       80 % pour l'objectif de sprint (Scrum), 20 % pour la voie support (Kanban)
Lundi          sprint planning ; linus est « de support » cette semaine, il tire les tickets
               de la voie support, WIP max 2, une seule urgence à la fois
Mardi          alan et margaret écrivent en binôme et en TDD le calcul des échéances (XP)
Mercredi       un incident de paiement arrive en classe urgente : linus le prend, les autres
               continuent le sprint ; correctif déployé derrière un flag en 2 heures (DevOps)
Jeudi          la rétro du sprint précédent avait noté « 4 jours d'attente de revue » :
               la limite de 2 MR en revue est appliquée (Lean, Kanban)
Vendredi       review avec deux conseillers clientèle ; déploiement continu, pas de « mise en
               production de fin de sprint »
```

**Quand** : dès que l'équipe a plus d'un type de travail, ce qui est le cas de la plupart des équipes produit. **Pourquoi** : forcer le support dans des sprints casse chaque plan, et ignorer les pratiques XP rend chaque sprint plus lent ; chaque approche couvre l'angle mort d'une autre. **Comment** : je pars des types de travail réels de l'équipe (combien de support, combien d'imprévu), je choisis une approche par problème, et j'écris l'accord dans un document court que la rétrospective révise.

**Risques.** Empiler toutes les pratiques d'un coup noie l'équipe sous les règles : j'ajoute une pratique à la fois, en mesurant son effet. Mélanger sans écrire l'accord crée des disputes (« le support passe avant le sprint ? ») : la part de capacité et la règle de la classe urgente sont écrites et visibles. Une rotation de support mal suivie fait toujours tomber les incidents sur la même personne, qui s'épuise.

:material-book-open-variant: Doc de référence : Gene Kim, Jez Humble, Patrick Debois et John Willis, « The DevOps Handbook » (2016) ; [Atlassian, What is DevOps?](https://www.atlassian.com/devops) (consultée en novembre 2026)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | le support et les fonctionnalités se mélangent dans le même sprint, et les imprévus cassent le plan |
    | N2 | l'équipe a écrit son accord : une part de capacité et une voie séparée pour le support, des pratiques XP nommées |
    | N3 | le tableau applique seul les limites de la voie support, et le pipeline déploie sans intervention manuelle |
    | N4 | l'équipe ajuste la part de capacité du support à partir du volume réel des derniers mois, et suit l'effet de chaque pratique ajoutée |

    **Je mesure** : la part de la capacité réellement prise par le support et les incidents chaque sprint ; la part des objectifs de sprint atteints malgré les imprévus.

## Estimer et prévoir

On me demande souvent « c'est pour quand ? ». Trois familles de réponses existent : estimer chaque élément (points ou jours), ne plus estimer mais compter, ou prévoir à partir de l'historique. Le découpage et la fourchette par tranche sont expliqués dans [Estimer et découper une fonctionnalité](culture-entreprise.md#estimer-et-decouper-une-fonctionnalite) ; je traite ici les pratiques propres aux équipes agiles.

### Points d'histoire, planning poker et vélocité

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Les <span class="term" data-term="story-points">points d'histoire</span> mesurent une taille **relative** : je ne dis pas « 3 jours », je dis « deux fois plus gros que la story de référence ». L'équipe choisit souvent une suite proche de Fibonacci (1, 2, 3, 5, 8, 13) pour dire que plus c'est gros, moins c'est précis. Le **planning poker** (James Grenning, 2002, popularisé par Mike Cohn dans « Agile Estimating and Planning », 2005) fait voter chacun en même temps, carte cachée, pour éviter que le premier qui parle influence les autres. Quand les votes divergent (2 et 13), les deux extrêmes expliquent : c'est là qu'on découvre un risque oublié.

``` { .text .ex-illus title="Illustration · un vote de planning poker" }
Story ORD-105 : appeler le prestataire pour créer l'échéancier
Premier vote    alan 3   linus 3   margaret 13   ada ne vote pas (PO)
margaret        « le prestataire renvoie un échéancier différent si la carte expire avant
                  la dernière échéance : il faut gérer ce cas et le tester »
Second vote     alan 8   linus 8   margaret 8
```

La <span class="term" data-term="velocity">vélocité</span> est la somme des points finis par sprint. Elle sert à une chose : aider l'équipe à savoir combien prendre au prochain sprint planning.

**Quand** : une équipe stable qui travaille en sprints et veut un ordre de grandeur pour son planning. **Quand ne pas l'utiliser** : pour comparer deux équipes, mesurer la productivité ou fixer un objectif. **Pourquoi** : estimer en relatif est plus rapide et plus juste qu'en heures, et la discussion compte plus que le chiffre. **Coût** : du temps de réunion, et un chiffre que les managers aiment transformer en indicateur de performance.

**Risques.** Dès que la vélocité devient un objectif (« +10 % ce trimestre »), les estimations gonflent : la même story passe de 3 à 5 points, la vélocité monte, rien de plus n'est livré ([loi de Goodhart](lois-et-principes.md#loi-de-goodhart)). Ron Jeffries, qui pense avoir contribué à inventer les points, a écrit qu'il le regrettait en voyant cet usage (« Story Points Revisited », 2019). Convertir les points en heures (« 1 point = 4 heures ») annule tout l'intérêt du relatif.

:material-book-open-variant: Doc de référence : [Ron Jeffries, Story Points Revisited](https://ronjeffries.com/articles/019-01ff/story-points/Index.html) (2019) ; [Mike Cohn, Planning Poker](https://www.mountaingoatsoftware.com/agile/planning-poker) (consultée en novembre 2026)
{ .doc-ref }

### NoEstimates : compter plutôt qu'estimer

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le mouvement **#NoEstimates** (lancé sur Twitter par Woody Zuill vers 2012, puis le livre de Vasco Duarte, « NoEstimates », 2016, date à vérifier) part d'un constat : si je découpe chaque élément en morceaux de taille comparable, compter les éléments prévoit aussi bien que sommer des points, pour beaucoup moins de temps de réunion. Le nom provoque : il ne veut pas dire « ne jamais répondre à la question de la date », mais « répondre avec les données plutôt qu'avec des devinettes ».

**Quand** : une équipe qui découpe déjà en petites tranches, et dont l'historique de débit existe. **Pourquoi** : le temps passé à estimer passe à découper et à livrer. **Comment** : je découpe jusqu'à ce que chaque élément tienne en quelques jours, je compte les éléments restants, et je prévois avec le débit passé (section suivante).

**Risques.** Sans découpage discipliné, un élément de deux jours et un élément de six semaines comptent chacun pour un, et la prévision n'a plus de sens. Annoncer « on n'estime plus » à une direction qui a besoin de dates pour un budget ferme la discussion : je présente la prévision probabiliste comme une meilleure réponse, pas comme un refus.

:material-book-open-variant: Doc de référence : Vasco Duarte, « NoEstimates: How to Measure Project Progress Without Estimating » (2016, date à vérifier)
{ .doc-ref }

### Prévoir avec une simulation de Monte Carlo

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Ada doit dire au directeur commercial quand les 40 éléments restants du paiement en trois fois seront livrés. Une **simulation de Monte Carlo** répond avec une probabilité plutôt qu'une date unique : je rejoue des milliers de futurs possibles en tirant au hasard dans le débit réel des semaines passées, puis je regarde en combien de semaines chaque futur finit.

``` { .text .ex-illus title="Illustration · calcul (chiffres d'exemple)" }
Débit des 10 dernières semaines : 1, 5, 3, 7, 2, 6, 4, 2, 8, 4  (moyenne 4,2)
Travail restant                 : 40 éléments

Un futur simulé : je tire une semaine au hasard (5), puis une autre (2), puis (8)...
                  et je compte les semaines jusqu'à 40 éléments.
Je recommence 100 000 fois.

Résultat        50 % des futurs finissent en 10 semaines ou moins
                85 % en 12 semaines ou moins
                95 % en 13 semaines ou moins

Ce que je dis   « Avec 85 % de confiance, c'est livré dans 12 semaines. »
Ce que je ne dis pas : « 40 / 4,2 = 9,5 semaines », qui n'est atteint qu'une fois sur trois environ.
```

Daniel Vacanti (« When Will It Be Done? », 2020) et Troy Magennis ont popularisé cette approche en logiciel. Elle répond aussi à la question inverse : « combien d'éléments seront livrés d'ici 6 semaines ? » (dans cet exemple, au moins 20 avec 85 % de confiance).

!!! noob "As noob"
    Pour savoir à quelle heure j'arriverai au travail, je ne calcule pas « distance divisée par vitesse moyenne » : je me souviens de mes trajets des derniers mois et je dis « presque toujours avant 9 h 10, sauf jour de grève ». La simulation fait la même chose, en rejouant mes semaines passées des milliers de fois. La phrase à retenir : **une prévision honnête est une date avec une probabilité, tirée de mes vrais chiffres.**

**Risques.** La simulation suppose que l'avenir ressemble au passé : si la moitié de l'équipe part en vacances ou si le périmètre grossit de 30 %, je refais le calcul. Le travail restant grossit presque toujours (questions découvertes en route) : je compte souvent les éléments ajoutés et je les intègre. Un tableur ou un outil fait le calcul ; je vérifie seulement que l'historique est assez long, au moins une dizaine de semaines.

:material-book-open-variant: Doc de référence : Daniel Vacanti, « When Will It Be Done? » (2020) ; [Troy Magennis, Focused Objective, outils de prévision](https://github.com/FocusedObjective/FocusedObjective.Resources) (consultée en novembre 2026)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | les dates sont données au jugé, par une seule personne |
    | N2 | l'équipe estime ensemble (points ou découpage) et note son débit ou sa vélocité à chaque sprint |
    | N3 | un outil calcule la prévision probabiliste à partir de l'historique, sans réunion d'estimation |
    | N4 | l'équipe compare ses prévisions aux dates réelles et ajuste sa méthode quand l'écart grandit |

    **Je mesure** : la part des prévisions à 85 % effectivement tenues, sur l'année ; le temps passé en réunions d'estimation par sprint.

## Les rituels qui servent vraiment

Une réunion agile est utile si elle change quelque chose. Je décris ici comment rendre le daily et la rétrospective utiles, les deux que je vois le plus souvent mal faits.

### Un daily qui regarde le travail, pas les personnes

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le daily sert aux développeurs à se coordonner vers l'objectif de sprint. Quand il devient un compte rendu au manager, chacun parle pour se justifier et personne n'écoute.

À éviter : un tour de table où chacun raconte sa journée au Scrum Master.

``` { .text .ex-bad title="À éviter" }
alan      « Hier j'ai travaillé sur ORD-105, aujourd'hui je continue ORD-105, pas de blocage. »
linus     « Hier j'ai eu des réunions, aujourd'hui ORD-107, pas de blocage. »
margaret  « Je teste ce qui arrive. »
(25 minutes ; ORD-91 attend une revue depuis 6 jours, personne ne le dit)
```

Bien : on parcourt le tableau de droite à gauche, en partant de ce qui est presque fini, et on regarde l'âge des tickets.

``` { .text .ex-good title="Recommandé" }
Objectif de sprint : payer en trois fois. On part de la colonne la plus à droite.
TEST    ORD-88  margaret : un cas d'arrondi échoue, alan regarde avec elle à 10 h
REVUE   ORD-91  6 jours d'âge, plus que tout le reste : linus le relit avant de tirer un ticket
DEV     ORD-105 le prestataire ne répond pas, grace l'appelle ce matin
Décision : personne ne commence de nouveau ticket aujourd'hui. (12 minutes)
```

**Risques.** Un daily « optimisé » au point de devenir un message écrit fait disparaître les discussions qui débloquent ; je garde un échange court en direct. Les discussions techniques longues se règlent juste après, entre les seules personnes concernées.

:material-book-open-variant: Doc de référence : [The Scrum Guide, Daily Scrum](https://scrumguides.org/scrum-guide.html#daily-scrum) (novembre 2020)
{ .doc-ref }

### Une rétrospective qui change quelque chose

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

La <span class="term" data-term="retrospective">rétrospective</span> est le moment où l'équipe regarde comment elle travaille. Norman Kerth en a posé la règle de base, la **Prime Directive** (« Project Retrospectives », 2001) : quoi que nous découvrions, nous pensons que chacun a fait de son mieux avec ce qu'il savait, ses compétences, les ressources disponibles et la situation. Sans cette règle, la rétro devient une recherche de coupable et personne ne dit plus rien d'utile ([sécurité psychologique](culture-entreprise.md#securite-psychologique)).

Esther Derby et Diana Larsen (« Agile Retrospectives », 2006) proposent cinq étapes :

1. **Ouvrir** : rappeler le but, la Prime Directive, un mot de chacun pour faire parler tout le monde.
2. **Collecter les faits** : la frise du sprint, les chiffres (objectif atteint ? tickets qui ont traîné ?).
3. **Comprendre** : chercher les causes, par exemple avec les « 5 pourquoi ».
4. **Décider** : une ou deux actions, chacune avec un responsable et une date.
5. **Clore** : ce qu'on retient, et un retour rapide sur la rétro elle-même.

Quelques formats courants pour l'étape 2 : **Start, Stop, Continue** ; **4L** (Liked, Learned, Lacked, Longed for) ; **Mad, Sad, Glad** ; le **bateau** (le vent qui pousse, l'ancre qui freine, les rochers à venir). Je change de format de temps en temps pour éviter la routine.

À éviter : une liste de plaintes sans suite, réécrite à chaque sprint.

``` { .text .ex-bad title="À éviter" }
Actions : « mieux communiquer », « faire plus de tests », « moins de réunions »
(aucun responsable, aucune date, aucune vérification : les mêmes lignes reviennent dans 2 semaines)
```

Bien : une action précise, petite, avec un responsable et un moyen de vérifier.

``` { .text .ex-good title="Recommandé" }
Constat   ORD-91 a attendu 6 jours en revue ; 4 tickets sur 6 ont attendu plus de 2 jours
Action    toute MR est relue dans les 4 heures ouvrées ; limite de 2 MR en revue sur le tableau
Qui       linus suit l'indicateur
Contrôle  à la prochaine rétro, on regarde le temps d'attente médian en revue
```

**Risques.** Trop d'actions à la fois, et aucune n'est faite : j'en garde une ou deux. Une rétro où le manager est présent et note les « problèmes » de chacun tue la parole : l'équipe Scrum seule, ou un accord explicite sur ce qui sort de la salle. Une rétro qui ne parle que des autres équipes (« la sécurité nous bloque ») ne change rien : je cherche ce que l'équipe peut faire, et je confie le reste au Scrum Master.

:material-book-open-variant: Doc de référence : [Norman Kerth, The Prime Directive](https://www.retrospectivewiki.org/index.php?title=The_Prime_Directive) (2001) ; Esther Derby et Diana Larsen, « Agile Retrospectives » (2006)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | le daily et la rétro ont lieu, mais ressemblent à des comptes rendus |
    | N2 | le daily part du tableau et de l'objectif ; chaque rétro finit par une action datée avec un responsable |
    | N3 | le tableau signale seul les tickets trop âgés au daily, et la rétro suivante commence toujours par la vérification des actions précédentes |
    | N4 | l'équipe suit la part des actions de rétro réalisées et leur effet sur une mesure (temps d'attente, objectifs atteints) |

    **Je mesure** : la part des actions de rétrospective réalisées à la date prévue ; la durée moyenne du daily.

## L'agilité à l'échelle

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Scrum est pensé pour une équipe. Quand dix équipes travaillent sur le même produit, de nouveaux problèmes apparaissent : dépendances, intégration commune, priorités contradictoires. Plusieurs cadres répondent, avec des philosophies opposées :

| Cadre | Auteurs et date | Idée | Pour qui |
|---|---|---|---|
| SAFe (Scaled Agile Framework) | Dean Leffingwell, 2011 (version 6.0 en 2023) | beaucoup de structure : trains de 50 à 125 personnes, planification commune par incréments de 8 à 12 semaines (PI Planning), rôles dédiés | grandes organisations qui ont besoin d'aligner budget, portefeuille et équipes |
| LeSS (Large-Scale Scrum) | Craig Larman et Bas Vodde, à partir de 2008 | le moins de structure possible : un seul PO, un seul backlog, un seul sprint pour 2 à 8 équipes | organisations prêtes à simplifier leur structure plutôt qu'à l'outiller |
| Nexus | Ken Schwaber, Scrum.org, 2015 | Scrum plus une équipe d'intégration, pour 3 à 9 équipes sur un produit | équipes Scrum qui butent sur l'intégration |
| Scrum@Scale | Jeff Sutherland, 2017 (date à vérifier) | des équipes de Scrum imbriquées, avec un « Scrum of Scrums » | organisations qui veulent étendre Scrum par réseau |
| modèle Spotify | Kniberg et Ivarsson, 2012 | squads, tribus, chapitres, guildes ; une photo d'une entreprise, pas un cadre | voir [ses limites](culture-entreprise.md#le-modele-spotify-et-ses-limites) |

``` mermaid
flowchart TB
  subgraph LeSS["LeSS : un backlog, un PO"]
    PO1[PO unique] --> BL1[Backlog unique]
    BL1 --> T1[Équipe 1] & T2[Équipe 2] & T3[Équipe 3]
  end
  subgraph SAFe["SAFe : plusieurs niveaux"]
    PF[Portefeuille] --> ART[Train : 5 à 12 équipes]
    ART --> PI[PI Planning toutes les 8 à 12 semaines]
    PI --> E1[Équipe A] & E2[Équipe B] & E3[Équipe C]
  end
```

**Quand** : plusieurs équipes livrent vraiment le même produit et se bloquent mutuellement. **Quand ne pas l'utiliser** : avant d'avoir essayé de réduire les dépendances. La [loi de Conway](lois-et-principes.md#loi-de-conway) et [Team Topologies](culture-entreprise.md#team-topologies) proposent souvent mieux : découper les équipes selon l'architecture pour que chacune livre seule. **Pourquoi** : un cadre commun donne un langage et un calendrier partagés. **Coût** : de la coordination en plus, des rôles en plus, et souvent une formation payante.

**Risques.** SAFe est souvent critiqué pour recréer une planification lourde en cascade sous un vocabulaire agile ; plusieurs signataires du Manifeste l'ont dit publiquement (à vérifier selon la source). Plaquer un cadre à l'échelle sur des équipes qui ne savent pas encore livrer seules multiplie les problèmes au lieu de les régler. Je mesure avant et après : temps de cycle de bout en bout, nombre de dépendances entre équipes.

:material-book-open-variant: Doc de référence : [Scaled Agile Framework](https://framework.scaledagile.com/) (version 6.0, 2023) ; [LeSS](https://less.works/) (consultée en novembre 2026) ; [Scrum.org, The Nexus Guide](https://www.scrum.org/resources/online-nexus-guide) (2021)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | les équipes se coordonnent dans une réunion hebdomadaire, sans calendrier commun |
    | N2 | les équipes d'un même produit partagent un backlog ordonné et un rendez-vous de planification commun |
    | N3 | une intégration continue commune détecte seule les changements d'une équipe qui cassent une autre |
    | N4 | l'organisation suit le nombre de dépendances entre équipes et le temps de cycle de bout en bout, et réorganise les équipes quand ils montent |

    **Je mesure** : le nombre de tickets bloqués par une autre équipe par sprint ; le temps de cycle d'une fonctionnalité qui traverse plusieurs équipes.

## La qualité dans une équipe agile

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Dans une équipe agile, le test ne peut pas attendre la fin : avec des sprints de deux semaines, une phase de test séparée en fin de sprint devient un mini-cycle en cascade, et les bugs arrivent le dernier jour. Lisa Crispin et Janet Gregory (« Agile Testing », 2009) défendent l'<span class="term" data-term="whole-team-approach">approche d'équipe entière</span> : la qualité appartient à toute l'équipe. Le détail du rôle du QA est dans [Qualité et tests](qualite.md#le-role-du-qa-dans-une-equipe-agile) ; voici comment le test s'insère dans chaque moment agile :

| Moment | Ce que fait l'équipe pour la qualité | Exemple |
|---|---|---|
| raffinement | les critères d'acceptation sont écrits avec des exemples, en <span class="term" data-term="three-amigos">three amigos</span> (PO, développeur, testeur) | margaret pose la question « et si la carte expire avant la troisième échéance ? » |
| sprint planning | les tâches de test font partie de la story, pas d'une story séparée | « écrire les tests d'API du calcul » est une tâche de ORD-101 |
| pendant le sprint | tests automatisés écrits avec le code, session exploratoire dès que la story marche | margaret explore ORD-102 avec alan le mercredi |
| définition de terminé | les exigences de test s'appliquent à toutes les stories | « chaque critère d'acceptation a un test automatisé vert » |
| sprint review | les parties prenantes essaient elles-mêmes | deux conseillers clientèle paient en trois fois en recette |
| rétrospective | l'équipe regarde les bugs échappés et leur cause | deux bugs d'arrondi : on ajoute des tests aux valeurs limites |

À éviter : un sprint où le test est une phase finale.

``` { .text .ex-bad title="À éviter" }
semaine 1   développement de toutes les stories
semaine 2   lun. à jeu. : encore du développement ; ven. : margaret teste tout
résultat    7 bugs trouvés le vendredi, 3 stories reportées, margaret fait des soirées
```

Bien : chaque story est testée dès qu'elle avance, par toute l'équipe.

``` { .text .ex-good title="Recommandé" }
avant le code   three amigos, exemples écrits en critères d'acceptation
pendant         tests automatisés avec le code ; exploration en binôme dès que la story marche
fin             la story n'est terminée que si la définition de terminé est remplie
résultat        les bugs arrivent au fil de l'eau, le vendredi sert à la review
```

**Risques.** « Toute l'équipe teste » peut devenir « personne n'est responsable » : la définition de terminé rend la responsabilité concrète. Supprimer le poste de QA au nom de l'agilité fait perdre l'expertise de conception de tests et le regard d'utilisateur ; Crispin et Gregory parlent d'une expertise partagée, pas d'un métier supprimé.

:material-book-open-variant: Doc de référence : [Lisa Crispin et Janet Gregory, Agile Testing](https://agiletester.ca/) (2009, suite « More Agile Testing », 2014)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | le QA teste les stories en fin de sprint |
    | N2 | les critères d'acceptation sont écrits avant le code, et les tests font partie de la définition de terminé |
    | N3 | la CI refuse une story dont les tests d'acceptation ne passent pas, sans arbitrage humain |
    | N4 | l'équipe suit les bugs échappés en production et le temps d'attente en test, et change ses pratiques quand ils montent |

    **Je mesure** : le nombre de bugs trouvés en production par mois, lu dans l'outil de tickets ; le temps médian passé par une story dans la colonne test.

## Quand l'agilité dérape

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Beaucoup de développeurs disent détester l'agilité ; souvent, ils détestent une de ses dérives. Savoir les nommer aide à proposer un changement précis plutôt qu'un rejet en bloc.

| Dérive | Qui l'a nommée | Ce que je vois | Ce que je propose |
|---|---|---|---|
| **Dark Scrum** | Ron Jeffries (2016) | les événements Scrum servent à contrôler l'équipe : le manager fixe le contenu du sprint et presse au daily | rendre au PO l'ordre du backlog et aux développeurs le choix de la quantité |
| **Water-Scrum-Fall** | Dave West, Forrester (2011) | spécifications complètes avant, sprints au milieu, grande phase de test et de mise en production à la fin | livrer chaque incrément jusqu'en production ([livraison continue](livraison.md#livraison-et-deploiement-continus)) |
| **Flaccid Scrum** | Martin Fowler (2009) | Scrum sans pratiques techniques : chaque sprint plus lent que le précédent | ajouter les pratiques XP, d'abord tests et intégration continue |
| **Zombie Scrum** | Johannes Schartau, Christiaan Verwijs et Barry Overeem (2020) | tous les événements ont lieu, mais aucun client ne voit l'incrément et rien ne change | une review avec de vrais utilisateurs, un objectif de sprint mesurable |
| **culte du cargo** | expression de Richard Feynman (1974), appliquée ici | copier les rituels d'une autre entreprise sans le problème qu'ils réglaient | partir du problème de l'équipe, puis choisir la pratique |
| **vélocité comme objectif** | voir la loi de Goodhart | les points gonflent, la vélocité monte, rien de plus n'est livré | mesurer le résultat client et le temps de cycle |

!!! noob "As noob"
    Une salle de sport où tout le monde porte la tenue, remplit sa fiche de présence et prend un selfie, mais où personne ne soulève de poids : les rituels sont là, le muscle non. La phrase à retenir : **l'agilité se juge à ce qui sort (un produit qui marche, des retours, des améliorations), pas aux réunions qui ont lieu.**

**Quand** : je reconnais une dérive quand l'équipe a tous les rituels et aucun des résultats : pas de mise en production avant la fin du trimestre, rétros sans action, clients jamais vus. **Comment** : je nomme la dérive en rétrospective avec un fait (« les 4 derniers incréments ne sont pas partis en production ») et je propose une seule expérience pour un ou deux sprints.

**Risques.** Coller une étiquette (« c'est du Dark Scrum ») sur le travail des autres braque les gens : je décris le fait et son effet, pas le nom. Jeter tout le cadre à cause d'une dérive fait souvent perdre ce qui marchait, comme la rétrospective.

:material-book-open-variant: Doc de référence : [Ron Jeffries, Dark Scrum](https://ronjeffries.com/articles/016-09ff/defense/) (2016) ; [Martin Fowler, Flaccid Scrum](https://martinfowler.com/bliki/FlaccidScrum.html) (2009)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | les dérives sont ressenties (« ces réunions ne servent à rien ») mais pas discutées |
    | N2 | les dérives sont nommées en rétrospective avec un fait, et une expérience est choisie |
    | N3 | des règles d'équipe protègent seules contre les dérives connues : pas de sprint sans objectif, pas d'incrément non déployé |
    | N4 | l'équipe suit la fréquence de mise en production et la part des objectifs atteints, et détecte une dérive par la baisse de ces chiffres |

    **Je mesure** : le délai entre la fin d'une story et sa mise en production ; le nombre d'utilisateurs ou de représentants du métier présents aux reviews.

## Mesurer le succès

Je sais que ma façon de travailler en agile marche quand l'équipe livre plus souvent, plus prévisiblement et sans s'épuiser, pas quand elle tient plus de réunions. Avant un changement (passer de Scrum à Kanban, ajouter des limites de WIP, changer de format de rétro), je note une base : par exemple, un temps de cycle de 9 jours au 85e percentile et 2 mises en production par mois. Je reprends la même mesure 6 à 8 semaines après. La métrique garde-fou : les bugs échappés en production et les heures supplémentaires, pour vérifier que la vitesse ne vient pas de la qualité ou de l'épuisement.

| Solution ou situation | Indicateur de succès (SLI) | SLO probable | SLA probable |
|---|---|---|---|
| Scrum | part des objectifs de sprint atteints | au moins 4 sprints sur 5 | sans objet : pas de contrat externe |
| Kanban | part des éléments finis en moins de la SLE | 85 % en 7 jours ou moins | sans objet : pas de contrat externe |
| limites de WIP | travail en cours moyen par personne | 2 éléments au plus | sans objet : pas de contrat externe |
| prévision probabiliste | part des prévisions à 85 % tenues sur l'année | au moins 80 % | selon le contrat : une date promise à un client peut avoir une pénalité |
| support en Kanban avec classe urgente | part des bugs bloquants corrigés à temps | 95 % en 2 jours ouvrés | correctif sous 5 jours ouvrés promis au client, sinon remise (exemple) |
| rétrospectives | part des actions réalisées à la date prévue | au moins 70 % | sans objet : pas de contrat externe |
| qualité dans le sprint | bugs échappés en production par mois | moins de 3, et en baisse | sans objet : pas de contrat externe |

[À prendre avec précaution : valeurs d'exemple, à fixer à partir de l'historique de l'équipe]

!!! noob "As noob"
    Le SLO, c'est l'objectif que l'équipe se fixe, comme un restaurant qui vise de servir chaque plat en moins de 15 minutes ; le SLA, c'est ce qu'il promet par écrit au client, avec un geste commercial si la promesse n'est pas tenue, par exemple 30 minutes. Le restaurant vise plus serré qu'il ne promet, pour garder de la marge. La phrase à retenir : **le SLO est la cible interne, le SLA l'engagement contractuel plus lâche ; une pratique d'équipe n'a qu'un SLO.**

## Pièges à éviter

| Piège | Ce qui se passe | Solution |
| --- | --- | --- |
| **Les rituels sans le but** : je tiens les cinq événements Scrum, mais l'incrément ne part jamais en production. | Personne ne voit le produit, les retours n'arrivent qu'au bout de trois mois. | Je livre chaque incrément jusqu'en production et j'invite de vrais utilisateurs à la review ([Quand l'agilité dérape](#quand-lagilite-derape)). |
| **La vélocité comme objectif** : je demande à l'équipe « +10 % de points ce trimestre ». | Les estimations gonflent, la vélocité monte, rien de plus n'est livré. | Je garde la vélocité pour le planning de l'équipe et je suis le temps de cycle et le résultat client ([Points d'histoire](#points-dhistoire-planning-poker-et-velocite)). |
| **Un tableau Kanban sans limite** : je mets les tickets en colonnes et j'appelle ça Kanban. | Le travail s'accumule en revue et en test, les délais s'allongent sans que rien ne réagisse. | J'ajoute une limite par étape et des colonnes d'attente visibles ([Concevoir le tableau](#concevoir-le-tableau)). |
| **Un objectif de sprint qui est une liste** : j'écris « faire ORD-101 à ORD-110 ». | Au premier imprévu, personne ne sait quoi sacrifier, et le sprint échoue entièrement. | J'écris une phrase de résultat et je négocie le périmètre autour ([Les trois artefacts](#les-trois-artefacts-et-leurs-engagements)). |
| **Une date unique** : je dis « 40 éléments, 4 par semaine, donc 10 semaines ». | La date est ratée une fois sur deux, et la confiance de la direction baisse. | Je donne une date avec une probabilité, tirée d'une simulation sur mon débit réel ([Monte Carlo](#prevoir-avec-une-simulation-de-monte-carlo)). |
| **Le test en fin de sprint** : je laisse le QA tester tout le vendredi. | Les bugs arrivent le dernier jour, les stories glissent, le QA s'épuise. | Three amigos avant, tests avec le code, exploration dès que la story marche ([La qualité dans une équipe agile](#la-qualite-dans-une-equipe-agile)). |
| **Un cadre à l'échelle avant d'en avoir besoin** : je déploie SAFe sur trois équipes qui ne savent pas encore livrer seules. | Plus de réunions et de rôles, les mêmes blocages. | Je réduis d'abord les dépendances entre équipes, puis je choisis le cadre le plus léger ([L'agilité à l'échelle](#lagilite-a-lechelle)). |
| **Des rétros sans suite** : je note « mieux communiquer » à chaque rétro. | Les mêmes problèmes reviennent, l'équipe ne croit plus à la rétro. | Une ou deux actions précises, avec un responsable, vérifiées à la rétro suivante ([Une rétrospective qui change quelque chose](#une-retrospective-qui-change-quelque-chose)). |

## Ce qu'on demande en entretien

- « Quelles méthodes agiles connaissez-vous, et en quoi diffèrent-elles ? » Pour répondre : je classe les méthodes par le problème qu'elles règlent (rythme pour Scrum, flux pour Kanban, qualité du code pour XP, gaspillage pour Lean, coordination pour SAFe, choix du contexte pour Disciplined Agile), puis je dis que mon équipe en combine souvent plusieurs ([Panorama des méthodes agiles](#panorama-des-methodes-agiles), [Combiner les approches](#combiner-les-approches-dans-une-equipe)).
- « Qu'est-ce que l'agilité ? », « Citez les valeurs du Manifeste agile. » Pour répondre : les quatre valeurs avec le mot « plutôt que », puis une idée des principes (livrer souvent, accueillir le changement, s'améliorer), et l'écart entre l'esprit et les rituels ([Le Manifeste agile](#le-manifeste-agile)).
- « Décrivez Scrum : rôles, événements, artefacts. » Pour répondre : les trois responsabilités, les cinq événements avec leur question, les trois artefacts avec leurs engagements ; mentionner que le guide de 2020 parle de responsabilités et a retiré les trois questions du daily ([Scrum](#scrum), [Ce qui a changé](#ce-qui-a-change-dans-le-scrum-guide-2020)).
- « Scrum ou Kanban, lequel choisiriez-vous ? » Pour répondre : ça dépend de la nature du travail ; Scrum pour un produit qui se construit par objectifs, Kanban pour un flux de demandes imprévues ; et souvent un mélange ([Scrum, Kanban ou Scrumban](#scrum-kanban-ou-scrumban)).
- « Qu'est-ce qu'une limite de WIP, et pourquoi limiter le travail en cours ? » Pour répondre : la loi de Little, moins d'éléments en cours veut dire des délais plus courts à débit égal ; un exemple de tableau ([Concevoir le tableau](#concevoir-le-tableau), [Loi de Little](culture-entreprise.md#loi-de-little-et-limites-de-wip)).
- « Que pensez-vous des story points ? », « Comment répondez-vous à "c'est pour quand ?" » Pour répondre : utiles pour la discussion et le planning de l'équipe, dangereux comme indicateur de performance ; pour une date, une prévision probabiliste sur le débit réel ([Estimer et prévoir](#estimer-et-prevoir)).
- « Votre équipe n'atteint jamais ses objectifs de sprint, que faites-vous ? » Pour répondre : je regarde les faits (travail imprévu, stories trop grosses, dépendances), je propose une expérience en rétrospective et je mesure ([Les rituels qui servent vraiment](#les-rituels-qui-servent-vraiment)).
- « Quel est le rôle du QA dans une équipe Scrum ? » Pour répondre : la qualité appartient à toute l'équipe, le QA apporte une expertise et du coaching, le test se fait pendant le sprint ([La qualité dans une équipe agile](#la-qualite-dans-une-equipe-agile)).
- « Avez-vous déjà vu l'agilité mal appliquée ? » Pour répondre : une dérive nommée avec un fait (water-scrum-fall, vélocité comme objectif), ce que j'ai proposé et le résultat, en méthode STAR ([Quand l'agilité dérape](#quand-lagilite-derape)).

Les questions par métier, avec des réponses plus détaillées et des exercices corrigés : [QA Engineer](../entretiens/qa-engineer/questions.md), [Software Engineer](../entretiens/software-engineer/questions.md), [Product Manager](../entretiens/product-manager/questions.md).

## Quoi utiliser dans quelle situation

| Je veux... | J'utilise... |
|---|---|
| savoir si une règle de mon équipe, comme « chaque ticket a une estimation en heures », sert encore à quelque chose | les quatre valeurs du Manifeste agile |
| savoir quelle méthode agile règle le problème de mon équipe, entre le rythme, le flux, la qualité du code ou la coordination | le panorama des méthodes agiles |
| organiser une équipe qui a à la fois des fonctionnalités à livrer et des incidents à traiter | Scrum pour les fonctionnalités, une voie Kanban pour le support, XP pour le code, DevOps pour la production |
| tenir une date et un budget fixés par un contrat, en faisant varier le périmètre | DSDM et MoSCoW |
| construire un nouveau produit dont le besoin se précise en route, avec un PO disponible et une équipe stable | Scrum |
| gérer un flux de demandes imprévues, comme des bugs de production et des demandes d'autres équipes | Kanban, avec des classes de service |
| voir où le travail attend, comme des MR qui s'empilent en revue, sans abandonner mes sprints | Scrumban : un tableau limité en WIP dans Scrum |
| que mon code reste facile à changer après vingt sprints | les pratiques XP : TDD, intégration continue, binôme, refactoring |
| savoir combien de travail prendre au prochain sprint | la vélocité ou le débit des derniers sprints |
| répondre à « c'est pour quand ? » sans inventer un chiffre | une simulation de Monte Carlo sur le débit réel |
| repérer aujourd'hui le ticket qui va mal tourner | l'âge des éléments en cours, au daily |
| faire de la rétrospective un moment qui change vraiment quelque chose | la Prime Directive, les cinq étapes, une ou deux actions datées |
| coordonner plusieurs équipes sur le même produit | d'abord réduire les dépendances, puis Nexus ou LeSS, SAFe si l'organisation a besoin de beaucoup de structure |
| que le test ne soit plus un goulot en fin de sprint | three amigos, tests dans la définition de terminé, exploration pendant le sprint |

## Sources

- [Manifeste pour le développement agile de logiciels (2001)](https://agilemanifesto.org/iso/fr/manifesto.html)
- [Ken Schwaber et Jeff Sutherland, « The Scrum Guide » (novembre 2020)](https://scrumguides.org/scrum-guide.html)
- [Scrum Guides, « Revisions to the Scrum Guide » (novembre 2020)](https://scrumguides.org/revisions.html)
- Hirotaka Takeuchi et Ikujiro Nonaka, « The New New Product Development Game », Harvard Business Review (1986)
- [Daniel Vacanti et John Coleman, « The Kanban Guide » (consultée en novembre 2026)](https://kanbanguides.org/english/)
- [Kanban University, « The Official Kanban Guide » (consultée en novembre 2026)](https://kanban.university/kanban-guide/)
- David J. Anderson, « Kanban: Successful Evolutionary Change for Your Technology Business » (2010)
- [Daniel Vacanti et Yuval Yeret, « The Kanban Guide for Scrum Teams » (révision de 2021)](https://www.scrum.org/resources/kanban-guide-scrum-teams)
- Corey Ladas, « Scrumban: Essays on Kanban Systems for Lean Software Development » (2009)
- Daniel Vacanti, « Actionable Agile Metrics for Predictability » (2015)
- Daniel Vacanti, « When Will It Be Done? » (2020)
- Kent Beck et Cynthia Andres, « Extreme Programming Explained », deuxième édition (2004)
- [Ron Jeffries, « What is Extreme Programming? » (2001, mis à jour 2011)](https://ronjeffries.com/xprog/what-is-extreme-programming/)
- Mary et Tom Poppendieck, « Implementing Lean Software Development » (2006)
- Alistair Cockburn, « Crystal Clear: A Human-Powered Methodology for Small Teams » (2004)
- [Agile Business Consortium, « The DSDM Agile Project Framework » (édition 2014, à vérifier)](https://www.agilebusiness.org/resource/the-dsdm-agile-project-framework/)
- Scott Ambler et Mark Lines, « Disciplined Agile Delivery » (2012)
- [PMI, « Disciplined Agile » (consultée en novembre 2026)](https://www.pmi.org/disciplined-agile)
- Gene Kim, Jez Humble, Patrick Debois et John Willis, « The DevOps Handbook » (2016)
- Mike Cohn, « Agile Estimating and Planning » (2005)
- [Ron Jeffries, « Story Points Revisited » (2019)](https://ronjeffries.com/articles/019-01ff/story-points/Index.html)
- Vasco Duarte, « NoEstimates » (2016, date à vérifier)
- Norman Kerth, « Project Retrospectives: A Handbook for Team Reviews » (2001)
- Esther Derby et Diana Larsen, « Agile Retrospectives: Making Good Teams Great » (2006)
- Lisa Crispin et Janet Gregory, « Agile Testing » (2009)
- [Ron Jeffries, « Dark Scrum » (2016)](https://ronjeffries.com/articles/016-09ff/defense/)
- [Martin Fowler, « Flaccid Scrum » (2009)](https://martinfowler.com/bliki/FlaccidScrum.html)
- Dave West, « Water-Scrum-Fall Is The Reality Of Agile For Most Organizations Today », Forrester (2011)
- Johannes Schartau, Christiaan Verwijs et Barry Overeem, « The Zombie Scrum Survival Guide » (2020)
- [Dave Thomas, « Agile is Dead (Long Live Agility) » (2014)](https://pragdave.me/thoughts/active/2014-03-04-time-to-kill-agile.html)
- [Scaled Agile Framework (version 6.0, 2023)](https://framework.scaledagile.com/)
- [LeSS, Large-Scale Scrum (consultée en novembre 2026)](https://less.works/)
- [Scrum.org, « The Nexus Guide » (2021)](https://www.scrum.org/resources/online-nexus-guide)
