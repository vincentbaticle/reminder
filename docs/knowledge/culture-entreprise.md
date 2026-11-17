# Culture d'entreprise et organisation

!!! warning "Avertissement"
    Ces notes sont des pense-bêtes personnels, pas une source de vérité. Elles reflètent ma compréhension et mes choix : leur contenu reste subjectif, malgré les citations et les références qu'il contient. Il peut être incomplet, simplifié, inexact ou dépassé. Vérifiez toujours dans la documentation officielle avant de l'appliquer. Ce contenu est fourni tel quel, sans aucune garantie : son utilisation se fait sous votre seule responsabilité.

!!! audience "Pour qui, pour quoi"
    - **Métiers** : développeur, QA, tech lead, engineering manager, product owner, architecte.
    - **Usages** : je prépare un entretien où l'on me demande comment mon équipe réagit après une panne ; je dois convaincre ma direction de financer un chantier, comme automatiser la recette ; mon équipe a grossi et je cherche comment la découper ; je veux comprendre pourquoi un ticket de deux jours met trois semaines à sortir ; je vise un rôle staff et je veux savoir ce qu'on en attend.

!!! abstract "Les échelles"
    Les pastilles de couleur sous les titres disent à quelle échelle une notion s'applique :

    - <span class="pill pill-scope pill-scope-code">Code</span> les classes, fonctions et modules d'un programme ;
    - <span class="pill pill-scope pill-scope-app">Application</span> un service ou une application et son découpage interne ;
    - <span class="pill pill-scope pill-scope-system">Système</span> plusieurs services qui communiquent par le réseau ;
    - <span class="pill pill-scope pill-scope-infra">Infrastructure</span> les serveurs, le réseau, les zones et les clusters, physiques ou virtuels ;
    - <span class="pill pill-scope pill-scope-enterprise">Entreprise</span> le système d'information entier et son organisation.

    Détail et mots ambigus : [carte des échelles](architecture.md#carte-des-echelles).

Un ingénieur qui parle à un manager, à une directrice produit ou à un directeur financier change de langue : il ne parle plus de latence ni de file de messages, mais d'objectifs, de coûts, de risques et de délais. Cette page rassemble le vocabulaire et les cadres de pensée les plus cités en entreprise : décrire une culture d'équipe, organiser les équipes, fixer des objectifs, décider, faire circuler le travail, penser produit et stratégie, parler d'argent, présenter un choix technique à la direction et comprendre les filières de carrière.

Les livres de gestion, de produit et de stratégie sont ici. Les articles techniques fondateurs sont rassemblés dans [Textes fondateurs](textes-fondateurs.md). Les équipes (`team-core`, `team-billing`), les services (`orders-service`, `billing-service`), les personnes (ada, grace) et tous les chiffres sont des exemples.

## Vocabulaire

| Mot | Définition | Exemple |
|---|---|---|
| **Culture** | ce que les gens font vraiment quand personne ne regarde : comment circule l'information, comment on traite une erreur, qui ose contredire | dans team-core, un junior peut dire en réunion « je crois que ce plan ne tient pas » sans risque |
| **Gouvernance** | qui a le droit de décider quoi, et comment on contrôle ces décisions | le comité d'architecture valide tout ce qui touche à plus de deux équipes |
| **Stratégie** | le diagnostic d'une situation et le petit nombre de choix cohérents pour y répondre | « nos clients partent à cause des pannes : cette année, la fiabilité passe avant les nouvelles fonctions » |
| **OKR** | Objectives and Key Results : un objectif qualitatif et deux à cinq résultats chiffrés qui disent s'il est atteint | objectif « un paiement sans friction », résultat clé « taux d'abandon au paiement de 12 % à 6 % » |
| **KPI** | Key Performance Indicator : un indicateur suivi en continu pour savoir si l'activité est en bonne santé | le chiffre d'affaires mensuel, le taux de disponibilité, le nombre de tickets support |
| **ROI** | Return On Investment : ce qu'un investissement rapporte, rapporté à ce qu'il coûte | 50 000 € dépensés, 80 000 € économisés : ROI de 60 % |
| **CAPEX** | Capital Expenditure : une dépense d'investissement, amortie sur plusieurs années | acheter des serveurs, construire une nouvelle plateforme |
| **OPEX** | Operating Expenditure : une dépense de fonctionnement, comptée dans l'année | la facture cloud mensuelle, les licences annuelles, la maintenance |
| **P&L** | Profit and Loss, le compte de résultat : les revenus moins les coûts sur une période | « le P&L de la ligne de produit est négatif depuis deux trimestres » |
| **Marge** | ce qui reste des revenus une fois les coûts directs payés | un abonnement à 10 € qui coûte 3 € de cloud et de support : marge brute de 70 % |
| **Time to market** | le délai entre l'idée et la mise à disposition aux clients | trois mois pour sortir une nouvelle offre au lieu de neuf |
| **Feuille de route** (roadmap) | la liste ordonnée de ce qu'on compte livrer, souvent par trimestre | T1 : paiement en plusieurs fois ; T2 : application mobile |
| **Partie prenante** (stakeholder) | toute personne touchée par une décision ou qui peut l'influencer | le support, la finance, le juridique, les équipes qui consomment l'API |
| **Sponsor** | la personne de la direction qui porte un projet, le défend et débloque le budget | la directrice technique sponsorise la migration vers le cloud |
| **Run et build** | le run fait tourner l'existant (exploitation, support), le build construit le nouveau | « 60 % de notre budget part dans le run » |
| **Effectif** (headcount) | le nombre de postes ouverts ou pourvus, souvent l'unité de budget d'une équipe | « on a deux postes de plus au budget de l'an prochain » |
| **DORA** | DevOps Research and Assessment : un programme de recherche (Nicole Forsgren, Jez Humble, Gene Kim, rattaché à Google depuis 2018, à vérifier) qui publie les rapports annuels « State of DevOps » et a résumé ses résultats dans le livre « Accelerate » (2018) | une de ses quatre métriques de livraison, la fréquence de déploiement : « orders-service déploie 3 fois par jour » |
| **Postmortem** | l'analyse écrite d'un incident, après coup : ce qui s'est passé, pourquoi, ce qu'on change, sans chercher de coupable | « cause : la migration verrouille la table ; action : timeout de verrou de 5 s sur les migrations » |
| **Rétrospective** | une réunion régulière de l'équipe, souvent en fin de sprint, pour regarder comment elle a travaillé et choisir une amélioration | « on a attendu les revues deux jours : on essaie un créneau de revue chaque jour à 14h » |
| **<span class="term" data-term="sli">SLI</span>** | Service Level Indicator : l'indicateur mesuré pour savoir si quelque chose marche | le délai médian d'un ticket entre son début et sa mise en production |
| **<span class="term" data-term="slo">SLO</span>** | Service Level Objective : la cible interne fixée sur un SLI | « délai médian sous 5 jours ouvrés » (exemple) |
| **<span class="term" data-term="sla">SLA</span>** | Service Level Agreement : la promesse contractuelle faite à un client, avec une pénalité si elle n'est pas tenue, en général plus lâche que le SLO | « disponibilité de 99,5 % par mois, sinon 10 % de remise », pour un SLO interne de 99,9 % (exemple) |

Une phrase de comité de direction, décodée :

``` { .text .ex-illus title="Illustration" }
« Le P&L du trimestre est sous pression : on gèle le headcount et on repousse les projets CAPEX ;
  l'OKR prioritaire reste le time to market du nouveau paiement. »

P&L sous pression          les coûts montent plus vite que les revenus
gel du headcount           aucun nouveau poste, les recrutements attendent
projets CAPEX repoussés    les investissements longs (une nouvelle plateforme) attendent
OKR prioritaire            l'objectif qui passe avant tous les autres ce trimestre
time to market             livrer vite le nouveau paiement compte plus que le reste
```

## Culture d'équipe

<a class="pill pill-dora" href="https://dora.dev/capabilities/generative-organizational-culture/">DORA · Generative organizational culture</a> <a class="pill pill-dora" href="https://dora.dev/capabilities/learning-culture/">DORA · Learning culture</a>

Une culture ne se lit pas dans les valeurs affichées au mur, mais dans les comportements : ce qui arrive à la personne qui annonce une mauvaise nouvelle, ou à celle qui a cassé la production.

### Typologie de Westrum

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le sociologue Ron Westrum classe les organisations selon la façon dont l'information y circule (« A typology of organisation culture », Quality and Safety in Health Care, 2004). La <span class="term" data-term="westrum-typology">typologie de Westrum</span> distingue trois cultures :

!!! noob "As noob"
    Je pense à quelqu'un qui pose un panneau « attention, verglas » sur une route. Dans une culture pathologique, on lui reproche d'avoir ralenti le trafic ; dans une culture bureaucratique, il faut d'abord trouver quel service a le droit de poser ce panneau ; dans une culture générative, on le remercie et on sale la route. La phrase à retenir : **la culture d'une équipe se voit à ce qui arrive à la mauvaise nouvelle et à celui qui l'apporte.**

| Comportement | Pathologique (orientée pouvoir) | Bureaucratique (orientée règles) | Générative (orientée performance) |
|---|---|---|---|
| coopération | faible | modérée | forte |
| porteur de mauvaise nouvelle | puni | ignoré | formé et écouté |
| responsabilités | esquivées | cloisonnées | partagées |
| liens entre équipes | découragés | tolérés | encouragés |
| échec | on cherche un coupable | on applique une sanction prévue | on cherche à comprendre |
| nouveauté | étouffée | source de problèmes | mise en œuvre |

Le même incident dans les trois cultures :

``` { .text .ex-illus title="Illustration" }
pathologique    grace signale que la sauvegarde de orders-service ne marche plus depuis 2 semaines.
                On lui reproche de ne pas l'avoir vu plus tôt. La fois suivante, elle se taira.
bureaucratique  le ticket est créé, mais il n'entre dans le périmètre d'aucune équipe. Il attend.
générative      on la remercie, on corrige, et le postmortem ajoute une alerte sur l'âge de la sauvegarde.
```

Le programme de recherche DORA mesure cette culture avec un questionnaire inspiré de Westrum, et la relie à la performance de livraison (Nicole Forsgren, Jez Humble et Gene Kim, « Accelerate », 2018). Cette performance se mesure avec les quatre <span class="term" data-term="dora-metrics">métriques DORA</span>, par exemple le délai entre un commit et sa mise en production (médiane d'un jour pour orders-service, chiffre d'exemple).

**Risques.** la typologie sert à décrire, pas à noter. Si je colle l'étiquette « pathologique » sur une équipe en réunion, elle se braque et la discussion s'arrête : je parle de comportements observés (ce qui est arrivé à grace), pas de personnes. Un questionnaire rempli par le seul management donne une image trop flatteuse : je le fais remplir anonymement par toute l'équipe.

:material-book-open-variant: Doc de référence : [Ron Westrum, A typology of organisational cultures](https://pmc.ncbi.nlm.nih.gov/articles/PMC1765804/) (2004)
{ .doc-ref }

### Sécurité psychologique

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

La <span class="term" data-term="psychological-safety">sécurité psychologique</span> est la croyance partagée par les membres d'une équipe qu'on peut y prendre un risque interpersonnel (poser une question naïve, avouer une erreur, contredire le chef) sans être humilié ni puni. Amy Edmondson l'a définie et mesurée dans « Psychological Safety and Learning Behavior in Work Teams » (Administrative Science Quarterly, 1999).

!!! noob "As noob"
    Dans une équipe où l'on se sent en sécurité, dire « je n'ai pas compris » ou « j'ai cassé la prod » coûte un moment de gêne, pas une réputation. Les problèmes remontent donc tôt, quand ils sont encore petits. La phrase à retenir : **une équipe où l'on cache les erreurs n'en fait pas moins, elle les découvre plus tard.**

Google l'a rendue célèbre avec le projet Aristotle, une étude interne sur ce qui rend une équipe efficace, publiée sur le site re:Work en 2015 : la sécurité psychologique arrivait en tête de cinq facteurs, devant la fiabilité des engagements, la clarté des rôles, le sens du travail et l'impact perçu (à vérifier sur re:Work, l'étude n'a pas été publiée comme article scientifique).

Ce n'est pas de la gentillesse. Edmondson croise la sécurité avec l'exigence :

| | Exigence faible | Exigence forte |
|---|---|---|
| **Sécurité forte** | zone de confort : on est bien, on progresse peu | zone d'apprentissage : on ose et on se dépasse |
| **Sécurité faible** | apathie | anxiété : on vise haut, mais on cache les problèmes |

Signes concrets : en revue de MR, les juniors commentent le code des seniors ; en rétrospective, les problèmes viennent de toute l'équipe, pas seulement du manager ; « je ne sais pas » est une réponse acceptée.

:material-book-open-variant: Doc de référence : [Wikipédia, Psychological safety](https://en.wikipedia.org/wiki/Psychological_safety) (consultée en novembre 2026) ; [Google re:Work, Understand team effectiveness](https://rework.withgoogle.com/print/guides/5721312655835136/) (2015, à vérifier)
{ .doc-ref }

### Culture juste

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Une <span class="term" data-term="just-culture">culture juste</span> ne punit pas l'erreur honnête, mais ne tolère pas la mise en danger délibérée. L'idée vient de la sécurité industrielle (James Reason, « Managing the Risks of Organizational Accidents », 1997) et a été développée par Sidney Dekker (« Just Culture », 2007). David Marx distingue trois comportements, chacun avec sa réponse (« Patient Safety and the Just Culture », 2001, à vérifier) :

!!! noob "As noob"
    Trois conducteurs : l'un rate un panneau caché par un arbre, l'autre roule toujours un peu trop vite comme tout le monde, le troisième grille un feu rouge exprès. Pour le premier, on déplace le panneau ; pour le deuxième, on se demande pourquoi tout le monde roule trop vite ; seul le troisième mérite une amende. La phrase à retenir : **on juge le comportement, pas la gravité de la conséquence.**

| Comportement | Exemple | Réponse |
|---|---|---|
| erreur humaine | ada lance la migration sur la mauvaise base, les deux onglets se ressemblent | consoler, puis changer le système (couleur par environnement, confirmation) |
| comportement à risque | grace saute les tests « parce que tout le monde le fait quand c'est urgent » | accompagner, et comprendre pourquoi le raccourci est devenu normal |
| imprudence | quelqu'un désactive une alerte de sécurité en sachant le danger, sans le dire | sanctionner |

C'est le socle du <span class="term" data-term="blameless">postmortem sans recherche de coupable</span> : voir [Incidents](incidents.md#le-postmortem-sans-recherche-de-coupable).

**Risques.** la frontière entre comportement à risque et imprudence est jugée par quelqu'un : si c'est toujours le manager, seul et après coup, l'équipe y voit un arbitraire et cache de nouveau ses erreurs. J'écris les critères à l'avance et je fais trancher à deux. À l'inverse, une culture juste mal comprise devient « personne n'est jamais responsable » : l'imprudence délibérée reste sanctionnée.

:material-book-open-variant: Doc de référence : [Wikipédia, Just culture](https://en.wikipedia.org/wiki/Just_culture) (consultée en novembre 2026)
{ .doc-ref }

### Culture de l'apprentissage

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Une organisation apprenante transforme ses expériences en pratiques partagées, au lieu de les laisser dans la tête de quelques personnes (Peter Senge, « The Fifth Discipline », 1990). Concrètement : des rétrospectives qui finissent par une action, des postmortems lus par les autres équipes, du temps réservé pour apprendre, des démonstrations internes, des erreurs racontées en public par les seniors eux-mêmes.

À éviter : un postmortem qui s'arrête à un nom. L'équipe en retient qu'avouer une erreur coûte cher, donc la prochaine fausse manœuvre sera cachée, et la migration peut toujours verrouiller la table orders sans limite de temps.

``` { .text .ex-bad title="À éviter" }
postmortem : panne du paiement, 03/11, 42 min
cause     ada a lancé la migration sans vérifier
action    ada fera plus attention la prochaine fois
```

Squelette d'un postmortem, puis ordre du jour typique d'une rétrospective d'une heure (exemples) :

``` { .text .ex-illus title="Illustration" }
postmortem : panne du paiement, 03/11, 42 min
chronologie   14:02 migration lancée ; 14:05 alertes 5xx ; 14:44 retour arrière
causes        la migration verrouille la table orders, aucun timeout de verrou
actions       timeout de 5 s sur les migrations (ada, 10/11) ; répétition sur une copie de la base (grace)

rétrospective
 5 min   l'action décidée la dernière fois : faite ou pas ?
15 min   ce qui a aidé, ce qui a freiné (notes écrites en silence, puis regroupées)
30 min   discussion des deux sujets qui ont reçu le plus de votes
10 min   une ou deux actions, chacune avec un responsable et une date
```

| Je veux... | J'utilise... |
|---|---|
| décrire la culture de mon organisation avec des faits, pas avec un vague « l'ambiance est bonne » : ce qui arrive à la personne qui annonce une mauvaise nouvelle, ce qu'on fait après une panne | la typologie de Westrum et ses six comportements |
| savoir si les gens de mon équipe osent dire « je n'ai pas compris » ou « j'ai cassé la prod », ou s'ils préfèrent se taire en réunion | les questions d'Edmondson en enquête anonyme, puis en discussion |
| réagir à une erreur, comme une migration lancée sur la mauvaise base, sans que l'équipe se mette à cacher les suivantes | la culture juste : erreur, risque ou imprudence |
| que les autres équipes profitent de la leçon d'un incident, au lieu de refaire la même erreur quelques mois plus tard | des postmortems publiés et lus, une revue mensuelle entre équipes |

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | une ou deux personnes protègent ceux qui annoncent une mauvaise nouvelle, et quelques postmortems sont écrits après les grosses pannes |
    | N2 | chaque incident notable a son postmortem sans recherche de coupable, sur un modèle commun, et chaque rétrospective finit par une action datée |
    | N3 | les postmortems sont publiés et lus par les autres équipes sans qu'on le demande, et un junior conteste un plan en réunion sans conséquence |
    | N4 | l'équipe suit le taux d'actions de postmortem réalisées et une enquête anonyme de sécurité psychologique chaque semestre, et change ses rituels quand un score baisse |

    **Je mesure** : la part des actions de postmortem faites à la date prévue, lue dans l'outil de tickets ; le score moyen des questions d'Edmondson dans une enquête anonyme semestrielle.

## Organiser les équipes

<a class="pill pill-scope pill-scope-system" href="../architecture/#carte-des-echelles">Échelle · Système</a> <a class="pill pill-scope pill-scope-enterprise" href="../architecture/#carte-des-echelles">Échelle · Entreprise</a>

<a class="pill pill-dora" href="https://dora.dev/capabilities/loosely-coupled-teams/">DORA · Loosely coupled teams</a>

Si deux équipes doivent se mettre d'accord à chaque changement, leur code finit lui aussi par dépendre l'un de l'autre : l'organisation des équipes n'est pas qu'une affaire de management, elle façonne l'architecture. C'est la <span class="term" data-term="conway-law">loi de Conway</span>, détaillée dans [Architecture](architecture.md#loi-de-conway).

### Team Topologies

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Matthew Skelton et Manuel Pais (« Team Topologies », 2019) proposent quatre types d'équipes et trois modes d'interaction. Le critère de découpage est la <span class="term" data-term="cognitive-load">charge cognitive</span> : une équipe ne doit pas porter plus qu'elle ne peut comprendre, par exemple ne pas gérer à la fois le tunnel de commande, la CI et le moteur de calcul des prix.

!!! noob "As noob"
    Une cuisine de restaurant ne confie pas les entrées, la pâtisserie et la plonge à une seule personne : elle ne tiendrait pas le rythme et ferait tout moins bien. Chaque poste a un périmètre qu'il maîtrise et des règles claires pour travailler avec les autres. La phrase à retenir : **on découpe les équipes selon ce qu'une équipe peut garder en tête, pas selon l'organigramme.**

| Type | Rôle | Exemple |
|---|---|---|
| <span class="term" data-term="stream-aligned-team">équipe alignée sur un flux</span> | livre de bout en bout une partie du produit | team-checkout : le tunnel de commande, du besoin à la production |
| <span class="term" data-term="platform-team">équipe plateforme</span> | fournit des services internes en libre-service | team-platform : CI, déploiement, environnements |
| <span class="term" data-term="enabling-team">équipe d'accompagnement</span> | aide une équipe à acquérir une compétence, puis se retire | team-quality coache team-checkout sur les tests de contrat pendant six semaines |
| <span class="term" data-term="complicated-subsystem-team">équipe sous-système complexe</span> | porte un composant qui demande une expertise rare | team-pricing : le moteur de calcul des prix |

Les trois modes d'interaction :

```mermaid
flowchart LR
    S[team-checkout<br/>alignée sur un flux] -- "X as a service :<br/>consomme sans parler" --> P[team-platform]
    E[team-quality<br/>accompagnement] -- "facilitation :<br/>aide puis se retire" --> S
    S -- "collaboration :<br/>travail commun, limité dans le temps" --> C[team-pricing<br/>sous-système complexe]
```

La <span class="term" data-term="inverse-conway-maneuver">manœuvre de Conway inverse</span> part de l'architecture que je veux obtenir, puis organise les équipes en conséquence : si je veux un moteur de prix séparé du tunnel de commande, je crée d'abord une équipe qui en est responsable, comme team-pricing.

**Risques.** réorganiser coûte cher : pendant des mois, les gens apprennent un nouveau périmètre et les livraisons ralentissent, donc je ne redécoupe que quand la charge cognitive ou les attentes entre équipes sont mesurées, pas pour suivre le livre. Une équipe plateforme qui ne fait pas de vrai libre-service devient un guichet à tickets, et toutes les équipes l'attendent : je mesure le délai d'attente de ses demandes. Une équipe d'accompagnement sans date de fin finit par faire le travail à la place des autres.

:material-book-open-variant: Doc de référence : [Team Topologies, Key concepts](https://teamtopologies.com/key-concepts) (consultée en novembre 2026)
{ .doc-ref }

### Le modèle Spotify et ses limites

Henrik Kniberg et Anders Ivarsson décrivent en 2012 l'organisation de Spotify à ce moment-là (« Scaling Agile @ Spotify with Tribes, Squads, Chapters & Guilds ») :

| Nom | Ce que c'est |
|---|---|
| squad | une petite équipe autonome, avec sa mission |
| tribe | un groupe de squads sur un même domaine |
| chapter | les personnes du même métier dans une tribe (tous les testeurs), avec un responsable hiérarchique commun |
| guild | une communauté d'intérêt ouverte à toute l'entreprise |

Précautions avant de le copier :

- l'article décrivait un instantané, pas un modèle à reproduire ; Kniberg l'a rappelé lui-même ;
- Jeremiah Lee, ancien employé, raconte dans « Spotify's Failed #SquadGoals » (2020) que l'organisation réelle était loin du schéma, notamment sur la responsabilité hiérarchique des chapters ;
- renommer les équipes en squads ne change ni l'autonomie, ni l'architecture, ni la culture.

:material-book-open-variant: Doc de référence : [Kniberg et Ivarsson, Scaling Agile @ Spotify](https://blog.crisp.se/wp-content/uploads/2012/11/SpotifyScaling.pdf) (2012) ; [Jeremiah Lee, Spotify's Failed #SquadGoals](https://www.jeremiahlee.com/posts/failed-squad-goals/) (2020)
{ .doc-ref }

### RACI

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Une matrice <span class="term" data-term="raci">RACI</span> dit, pour chaque tâche, qui la fait (**R**esponsible), qui en répond et tranche (**A**ccountable, une seule personne), qui est consulté avant (**C**onsulted) et qui est informé après (**I**nformed). Son origine précise n'est pas documentée (années 1950 à 1970, à vérifier).

| Tâche : migrer la base de orders-service | ada (dev) | grace (lead) | team-platform | support |
|---|---|---|---|---|
| écrire le plan de migration | R | A | C | |
| valider la fenêtre de maintenance | C | A | C | I |
| exécuter la migration | R | A | C | I |
| prévenir les clients | | A | | R |

Règle : un seul A par ligne. Deux A, c'est personne.

**Risques.** une matrice RACI écrite une fois puis jamais relue décrit une organisation qui n'existe plus : je la relis à chaque changement d'équipe ou de projet. Trop de C transforme chaque décision en tournée de consultation, et un A donné à quelqu'un qui n'a ni le temps ni le pouvoir de trancher bloque tout : l'A est la personne qui peut vraiment dire oui.

:material-book-open-variant: Doc de référence : [Wikipédia, Responsibility assignment matrix](https://en.wikipedia.org/wiki/Responsibility_assignment_matrix) (consultée en novembre 2026)
{ .doc-ref }

### InnerSource

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

team-billing a besoin d'un nouveau champ dans la bibliothèque de paiement que possède team-core. Elle ouvre un ticket, team-core le classe derrière ses propres priorités, et trois sprints plus tard rien n'a bougé : team-billing finit par copier la bibliothèque et la modifier dans son coin. L'**<span class="term" data-term="innersource">InnerSource</span>** (terme de Tim O'Reilly, 2000) applique à l'intérieur de l'entreprise les pratiques de l'<span class="term" data-term="open-source">open source</span> : le code des équipes est visible par tous, et une autre équipe peut proposer elle-même la modification par une MR, que l'équipe propriétaire relit et accepte. La communauté InnerSource Commons, fondée en 2015, en documente les pratiques.

!!! noob "As noob"
    C'est un jardin partagé entre voisins : chacun peut planter dans la parcelle commune en suivant le règlement affiché à l'entrée, et un jardinier référent vérifie que rien n'étouffe le reste. Limite : la parcelle a toujours un propriétaire, qui garde le dernier mot. La phrase à retenir : **en InnerSource, j'écris moi-même la modification dont j'ai besoin, et l'équipe propriétaire la relit au lieu de la coder.**

**Quand** : plusieurs équipes dépendent d'un même code (bibliothèque, composant de CI, standard partagé) et l'équipe propriétaire est devenue un goulot. Pas quand le code change de fond en comble chaque semaine, ou quand l'équipe propriétaire n'a pas le temps de relire : les MR pourrissent, ce qui est pire qu'un ticket refusé. **Pourquoi** : les équipes contribuent au standard au lieu de le subir ou de le copier, et le code reste unique. Le coût : du temps de relecture et d'accompagnement pour l'équipe propriétaire, et une documentation de contribution à tenir. **Comment** :

1. L'équipe propriétaire écrit un `CONTRIBUTING.md` : comment lancer les tests, ce qu'elle accepte, le délai de relecture qu'elle s'engage à tenir (par exemple deux jours ouvrés).
2. Elle nomme un ou deux *trusted committers* : des personnes chargées de relire et d'accompagner les contributeurs extérieurs, à tour de rôle.
3. Les échanges se font par écrit, dans les MR et les tickets, pour que la décision reste lisible par tous.
4. Pour un changement important, le contributeur ouvre d'abord un ticket pour en discuter, avant d'écrire le code.

``` { .text .ex-illus title="Illustration" }
Sans InnerSource
  semaine 0   team-billing ouvre un ticket « ajouter le champ installment_count »
  semaine 6   toujours en attente derrière les priorités de team-core
  semaine 7   team-billing copie la bibliothèque : deux versions divergent

Avec InnerSource
  jour 0      team-billing lit CONTRIBUTING.md et ouvre une MR avec le champ et ses tests
  jour 2      le trusted committer de team-core relit, demande un test de plus
  jour 3      fusion, version 2.5.0 publiée pour toutes les équipes
```

:material-book-open-variant: Doc de référence : [InnerSource Commons](https://innersourcecommons.org/) (consultée en novembre 2026)
{ .doc-ref }

### Influence sans autorité et communautés de pratique

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Je veux que cinq équipes adoptent un format commun pour les réponses d'erreur de leurs API, mais aucune ne dépend de moi : je ne peux rien imposer, et un ordre venu d'en haut serait contourné dès la première livraison pressée. L'**influence sans autorité** consiste à faire changer une pratique par l'échange, la preuve et l'écrit, plutôt que par la hiérarchie. Allan Cohen et David Bradford (« Influence Without Authority », 1990) la décrivent comme un échange : je cherche ce qui compte pour l'autre équipe (moins d'incidents, moins d'astreinte, de la reconnaissance, moins de tickets support) et je propose quelque chose qui lui rapporte dans cette « monnaie »-là, pas dans la mienne.

!!! noob "As noob"
    Pour lancer un compost commun dans un immeuble, je ne commence pas par une affiche « obligatoire dès lundi ». Je demande d'abord aux voisins ce qui les gêne (les poubelles qui débordent), je lance le bac avec les deux voisins motivés, puis les autres suivent quand ils voient que ça marche et que ça ne sent pas mauvais. La phrase à retenir : **sans pouvoir d'imposer, je convaincs par ce que l'autre y gagne et par un premier succès visible, pas par un règlement.**

Trois idées connues, à combiner :

| Idée | Ce qu'elle dit | Ce que je fais |
|---|---|---|
| l'échange (Cohen et Bradford, 1990) | chacun coopère quand il y gagne quelque chose qui compte pour lui | avant de proposer, je demande à team-web ce qui lui coûte le plus ; ici, des tickets support sur des messages d'erreur illisibles |
| la diffusion de l'innovation (Everett Rogers, « Diffusion of Innovations », 1962) | une nouveauté passe des innovateurs (environ 2,5 %) aux <span class="term" data-term="early-adopters">adopteurs précoces</span> (13,5 %), puis à la majorité, qui copie ceux qu'elle voit réussir | je commence par l'équipe volontaire, jamais par la plus réticente |
| le <span class="term" data-term="nemawashi">nemawashi</span> (pratique japonaise, reprise dans le système de production de Toyota) | préparer la décision en parlant à chacun avant la réunion, pour que la réunion entérine au lieu de découvrir | je fais relire ma RFC en tête à tête par chaque tech lead avant la revue commune |

Une <span class="term" data-term="community-of-practice">communauté de pratique</span> (Jean Lave et Etienne Wenger, « Situated Learning », 1991) prolonge ce travail dans la durée : des personnes de plusieurs équipes qui partagent un métier ou une pratique (les tests, l'accessibilité, les API) se retrouvent régulièrement, sur la base du volontariat, pour apprendre les unes des autres. Les guildes du modèle Spotify (2012) en sont une version. Chaque membre devient un <span class="term" data-term="champion">relais</span> dans son équipe : la pratique circule sans passer par moi.

**Quand** : je dois faire changer une pratique dans des équipes qui ne dépendent pas de moi (un standard, un outil, une convention), ou une compétence est éparpillée entre plusieurs équipes. Pas pour une règle de sécurité ou de conformité non négociable : là, la décision revient à qui en a l'autorité, et l'influence sert seulement à l'expliquer. **Pourquoi** : une pratique adoptée par conviction survit à mon départ ; une pratique imposée est contournée dès que personne ne regarde. Le coût : c'est plus lent qu'un ordre, et je dois accepter de modifier ma proposition. **Comment** :

1. Je comprends les objections avant de convaincre : quel problème la pratique résout, ce qu'elle coûte à chaque équipe.
2. Je prouve avec une équipe volontaire, en mode non bloquant d'abord, et je publie les résultats, coûts et faux positifs compris.
3. J'écris la proposition (une RFC) et je la prépare en tête à tête avant la réunion de décision.
4. Je m'appuie sur une communauté de pratique et des relais dans chaque équipe, avec une exception possible mais visible et datée.
5. Je mesure l'<span class="term" data-term="adoption">adoption</span> réelle, pas le nombre de personnes présentes à la présentation.

À éviter : imposer un quality gate commun par une annonce. Les équipes qui n'en voient pas l'intérêt le désactivent, et le standard meurt en silence.

``` { .text .ex-bad title="À éviter" }
semaine 1   j'annonce dans le canal général : « dès lundi, le quality gate bloque toutes les MR »
semaine 2   deux équipes le désactivent dans leur pipeline, une troisième pose une exception sans date
semaine 6   le gate ne bloque plus nulle part, et ma prochaine proposition partira avec un handicap
```

Bien : le même gate, porté par l'échange, une équipe volontaire et une décision préparée.

``` { .text .ex-good title="Recommandé" }
semaine 1   je demande à chaque équipe ce qui lui coûte en revue : deux citent les failles de sécurité
semaine 2   team-web, volontaire, essaie le gate en mode informatif, sans bloquer
semaine 4   je publie ses chiffres, faux positifs compris, et je retire deux règles trop bruyantes
semaine 5   chaque tech lead relit la RFC en tête à tête avant la revue commune (nemawashi)
semaine 8   le gate bloque sur les règles fiables ; exception possible, avec un label et une date de fin
(durées d'exemple)
```

**Risques.** une communauté de pratique sans animateur ni temps accordé par les managers s'éteint en quelques mois : je demande que la participation compte comme du travail et je fais tourner l'animation. Elle n'est pas un organe de décision : si elle se met à voter des règles pour toutes les équipes, elle redevient une autorité, sans en avoir la légitimité. Elle peut aussi devenir un club de convaincus qui parlent entre eux : je mesure combien d'équipes y sont représentées. Enfin, le nemawashi mal fait ressemble à des accords de couloir : j'écris dans la RFC chaque objection reçue en tête à tête et la réponse apportée.

:material-book-open-variant: Doc de référence : [Etienne et Beverly Wenger-Trayner, Introduction to communities of practice](https://www.wenger-trayner.com/introduction-to-communities-of-practice/) (consultée en novembre 2026) ; [Wikipédia, Diffusion of innovations](https://en.wikipedia.org/wiki/Diffusion_of_innovations) (consultée en novembre 2026)
{ .doc-ref }

### Équipes à deux pizzas

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

L'<span class="term" data-term="two-pizza-team">équipe à deux pizzas</span> est assez petite pour être nourrie par deux pizzas, soit environ six à dix personnes. La règle est attribuée à Jeff Bezos chez Amazon au début des années 2000 (à vérifier, elle n'est connue que par des récits). La raison est arithmétique : le nombre de canaux de communication possibles est n × (n - 1) / 2, soit 6 canaux à 4 personnes, 28 à 8 et 66 à 12.

**Risques.** découper une équipe trop grande crée des frontières, donc des dépendances : si je coupe au milieu d'un flux, les deux moitiés doivent se coordonner à chaque changement et rien n'est plus rapide. Je découpe le long de deux flux distincts. Une équipe trop petite (deux ou trois personnes) ne tient pas l'astreinte ni les absences : la connaissance repose sur une seule tête.

| Je veux... | J'utilise... |
|---|---|
| que mes équipes livrent sans attendre les autres à chaque changement, par exemple que team-checkout puisse déployer sans demander un environnement à la main à une autre équipe | Team Topologies : des équipes alignées sur un flux, une plateforme en libre-service |
| aider une équipe à maîtriser une nouvelle pratique, comme les tests de contrat, sans finir par écrire ses tests à sa place | une équipe d'accompagnement, avec une date de fin |
| savoir qui tranche sur une tâche que plusieurs équipes partagent, comme une migration de base où chacun croit que c'est l'autre qui décide | une matrice RACI, un seul A par ligne |
| reprendre le modèle Spotify (squads, tribes, chapters) parce qu'il a l'air de marcher ailleurs | lire d'abord ses critiques, garder l'idée (autonomie, communautés), pas les noms |
| mon équipe a grossi jusqu'à douze personnes et chaque décision demande maintenant une réunion avec tout le monde | la scinder autour de deux flux distincts |
| une autre équipe attend depuis trois sprints que team-core ajoute un champ dans sa bibliothèque partagée, et finit par la copier | l'[InnerSource](#innersource) : elle propose la MR, team-core relit |
| je veux qu'un format commun d'erreurs d'API soit adopté par cinq équipes qui ne dépendent pas de moi, sans passer par un ordre de la direction | l'[influence sans autorité](#influence-sans-autorite-et-communautes-de-pratique) : une équipe volontaire, une RFC préparée en tête à tête, une communauté de pratique |

:material-book-open-variant: Doc de référence : [AWS Whitepaper, Two-pizza teams](https://docs.aws.amazon.com/whitepapers/latest/introduction-devops-aws/two-pizza-teams.html) (consultée en novembre 2026)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | quelqu'un sait à peu près qui décide quoi, et les équipes se coordonnent au cas par cas |
    | N2 | les équipes ont un type (flux, plateforme, accompagnement, sous-système), une matrice RACI pour les sujets partagés et un `CONTRIBUTING.md` sur le code commun |
    | N3 | une équipe livre sans attendre une autre : la plateforme est en libre-service, les MR InnerSource sont relues dans le délai promis sans relance |
    | N4 | l'organisation suit le temps d'attente entre équipes et le délai de relecture des MR externes, et redécoupe les équipes quand ces chiffres montent |

    **Je mesure** : le nombre de tickets bloqués en attente d'une autre équipe et leur durée d'attente, lus dans l'outil de tickets ; le délai médian de relecture des MR venues d'autres équipes, lu dans l'outil de MR.

## Fixer et suivre des objectifs

### OKR

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Les <span class="term" data-term="okr">OKR</span> viennent d'Andy Grove chez Intel (« High Output Management », 1983). John Doerr les a appris chez Intel, les a présentés à Google en 1999 et les a popularisés dans « Measure What Matters » (2018). Un OKR :

- un **objectif** : qualitatif, motivant, ce qu'on veut changer ;
- deux à cinq **résultats clés** : chiffrés, vérifiables à la fin de la période, des résultats et pas des tâches.

``` { .text .ex-illus title="Illustration" }
Objectif        Les équipes livrent sans attendre la CI (T3)
Résultat clé 1  temps de pipeline au p95 : de 28 min à 10 min
Résultat clé 2  taux de tests instables : de 4 % à moins de 1 %
Résultat clé 3  satisfaction CI dans l'enquête développeurs : de 2,9 à 4 sur 5

Mauvais résultat clé : « migrer les runners vers des machines plus grosses » (c'est une tâche, pas un résultat)
```

Doerr distingue les OKR **engagés** (à atteindre à 100 %) et **ambitieux** (atteindre 60 à 70 % est déjà un succès, à vérifier selon les organisations). Mélanger les deux sans le dire crée des malentendus.

**Risques.** lier les OKR à la prime pousse chacun à choisir des cibles faciles, et l'objectif ambitieux perd son sens : je les sépare de l'évaluation individuelle. Trop d'OKR à la fois (dix objectifs par équipe) diluent l'effort, et aucun n'avance : j'en garde un à trois par trimestre. Un OKR écrit en janvier et relu en mars ne pilote rien : je fais un point court toutes les deux semaines.

:material-book-open-variant: Doc de référence : [What Matters, OKR meaning, definition and examples](https://www.whatmatters.com/faqs/okr-meaning-definition-example) (consultée en novembre 2026)
{ .doc-ref }

### KPI ou OKR

Un <span class="term" data-term="kpi">KPI</span> est un thermomètre : on le surveille en permanence. Un OKR est un changement voulu sur une période.

| | KPI | OKR |
|---|---|---|
| question | « est-ce que tout va bien ? » | « qu'est-ce qu'on veut changer ce trimestre ? » |
| durée | permanent | une période (souvent un trimestre) |
| exemple | disponibilité de my-api à 99,9 % | « faire passer la disponibilité de 99,5 % à 99,9 % » |
| quand il bouge | on enquête | on ajuste le plan |

Un KPI qui se dégrade devient souvent l'objet d'un OKR le trimestre suivant.

**Risques.** trop de KPI suivis en même temps, et plus personne ne regarde aucun d'eux : le jour où l'un se dégrade, personne ne le voit. Je garde une poignée d'indicateurs par activité, chacun avec un seuil et un responsable. Un KPI sans seuil d'alerte est une décoration de tableau de bord.

:material-book-open-variant: Doc de référence : [Wikipédia, Performance indicator](https://en.wikipedia.org/wiki/Performance_indicator) (consultée en novembre 2026)
{ .doc-ref }

### North Star metric

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

La <span class="term" data-term="north-star-metric">North Star metric</span> est l'unique mesure qui capte la valeur que le produit apporte aux clients, et qui annonce le revenu futur. Le terme est popularisé dans le milieu du growth marketing, notamment par Sean Ellis, vers 2017 (à vérifier). On la décompose en métriques d'entrée sur lesquelles les équipes agissent :

```mermaid
flowchart TD
    N[North Star : commandes livrées par semaine] --> A[visiteurs qui ajoutent au panier]
    N --> B[taux de paiement réussi]
    N --> C[livraisons à l'heure]
    A --> T1[team-catalog]
    B --> T2[team-checkout]
    C --> T3[team-logistics]
```

**Risques.** une seule métrique optimisée sans garde-fou se paie ailleurs : pousser les commandes livrées par semaine avec des promotions agressives fait baisser la marge. J'associe à la North Star une ou deux contre-mesures (marge, satisfaction). Une North Star mal choisie, comme le nombre de visites, récompense l'activité au lieu de la valeur pour le client.

:material-book-open-variant: Doc de référence : [Amplitude, The North Star Playbook](https://amplitude.com/books/north-star) (consultée en novembre 2026)
{ .doc-ref }

### Éviter le piège de Goodhart

La <span class="term" data-term="goodhart-law">loi de Goodhart</span> : quand une mesure devient un objectif, elle cesse d'être une bonne mesure (Charles Goodhart, 1975, dans la formulation de Marilyn Strathern, 1997). Elle et ses cousines sont détaillées dans [Lois et principes](lois-et-principes.md). La parade : associer à chaque objectif une **contre-mesure** qui se dégrade si on triche.

| Objectif | Triche possible | Contre-mesure |
|---|---|---|
| réduire le temps de traitement des tickets support | fermer les tickets sans les résoudre | taux de tickets rouverts |
| augmenter la fréquence de déploiement | découper artificiellement les changements | taux d'échec des changements |
| augmenter la couverture de code | tests sans assertion | score de mutation sur le code critique |

| Je veux... | J'utilise... |
|---|---|
| donner à l'équipe une direction ambitieuse pour le trimestre, comme « les équipes livrent sans attendre la CI », et savoir à la fin si on y est arrivé | un OKR : un objectif, deux à cinq résultats chiffrés |
| savoir en continu si une activité va bien, comme la disponibilité de my-api, et être prévenu dès qu'elle se dégrade | des KPI, avec un seuil qui déclenche une enquête |
| que team-catalog, team-checkout et team-logistics tirent dans le même sens, au lieu que chacune optimise son propre chiffre | une North Star metric et son arbre de métriques d'entrée |
| qu'un chiffre suivi ne soit pas gonflé artificiellement, comme des tickets support fermés sans être résolus pour faire baisser le temps de traitement | une contre-mesure par objectif, et jamais de classement individuel |

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | le manager fixe des objectifs à l'oral, sans chiffre de départ ni d'arrivée |
    | N2 | chaque trimestre, l'équipe écrit un à trois OKR chiffrés et suit quelques KPI, chacun avec un seuil |
    | N3 | un KPI qui passe son seuil déclenche une alerte et une enquête sans réunion préalable, et chaque objectif a sa contre-mesure |
    | N4 | l'équipe compare en fin de trimestre les résultats clés atteints, la contre-mesure et la North Star, et ajuste ses objectifs suivants d'après ces écarts |

    **Je mesure** : la part des résultats clés chiffrés et mesurables (pas des tâches), lue dans le document d'OKR ; le nombre d'objectifs suivis avec leur contre-mesure.

## Décider

<a class="pill pill-practice" href="../livraison/#concevoir-avant-de-coder">Pratique · Conception technique</a>
<a class="pill pill-dora" href="https://dora.dev/capabilities/documentation-quality/">DORA · Documentation quality</a>

### Cynefin

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le cadre <span class="term" data-term="cynefin">Cynefin</span> (Dave Snowden, à partir de 1999 ; « A Leader's Framework for Decision Making », avec Mary Boone, Harvard Business Review, 2007) dit qu'on ne décide pas de la même façon selon la nature de la situation :

!!! noob "As noob"
    Changer une roue, c'est clair : je suis la notice. Réparer un moteur, c'est compliqué : un mécanicien trouve la panne en analysant. Faire aimer un nouveau plat à des clients, c'est complexe : aucune analyse ne le garantit, j'essaie, je regarde, j'ajuste. Une voiture en feu, c'est chaotique : j'éloigne d'abord les gens, je comprendrai après. La phrase à retenir : **avant de choisir comment décider, je me demande dans quel genre de situation je suis.**

<figure class="diagram"><svg viewBox="0 0 320 210" role="img" aria-label="Cynefin : quatre domaines et la confusion au centre (d'après Dave Snowden)"><rect class="layer layer-2" x="10" y="10" width="145" height="90" rx="6"/><text class="label-strong" x="82.5" y="32" text-anchor="middle">Complexe</text><text x="82.5" y="45" text-anchor="middle">sonder, constater, répondre</text><text x="82.5" y="57" text-anchor="middle">pratique émergente</text><rect class="layer layer-1" x="165" y="10" width="145" height="90" rx="6"/><text class="label-strong" x="237.5" y="32" text-anchor="middle">Compliqué</text><text x="237.5" y="45" text-anchor="middle">constater, analyser, répondre</text><text x="237.5" y="57" text-anchor="middle">bonne pratique</text><rect class="layer layer-3" x="10" y="110" width="145" height="90" rx="6"/><text class="label-strong" x="82.5" y="170" text-anchor="middle">Chaotique</text><text x="82.5" y="183" text-anchor="middle">agir, constater, répondre</text><text x="82.5" y="195" text-anchor="middle">pratique nouvelle</text><rect class="layer layer-1" x="165" y="110" width="145" height="90" rx="6"/><text class="label-strong" x="237.5" y="170" text-anchor="middle">Clair</text><text x="237.5" y="183" text-anchor="middle">constater, classer, appliquer</text><text x="237.5" y="195" text-anchor="middle">meilleure pratique</text><ellipse class="layer layer-1" cx="160" cy="105" rx="44" ry="20" style="fill-opacity:1;fill:var(--md-default-bg-color)"/><text class="label-strong" x="160" y="108" text-anchor="middle">Confusion</text></svg><figcaption>Cynefin : quatre domaines et la confusion au centre (d'après Dave Snowden)</figcaption></figure>

| Domaine | Lien cause et effet | Méthode | Exemple |
|---|---|---|---|
| clair | évident, connu de tous | constater, classer, appliquer la bonne pratique | renouveler un certificat qui expire : suivre le runbook |
| compliqué | trouvable par un expert | constater, analyser, répondre | dimensionner la base de orders-service pour le double de trafic |
| complexe | visible seulement après coup | sonder, constater, répondre : des expériences sûres | savoir si les clients veulent le paiement en plusieurs fois |
| chaotique | aucun lien visible | agir, constater, répondre : stabiliser d'abord | panne totale en pleine soirée de soldes |
| confusion | on ne sait pas dans quel domaine on est | découper la situation en morceaux | une réunion où chacun croit parler d'un problème différent |

L'erreur classique : traiter un problème complexe comme compliqué, avec un plan détaillé sur un an là où il fallait des expériences de deux semaines.

:material-book-open-variant: Doc de référence : [The Cynefin Co, About the Cynefin framework](https://thecynefin.co/about-us/about-cynefin-framework/) (consultée en novembre 2026) ; [Snowden et Boone, A Leader's Framework for Decision Making](https://hbr.org/2007/11/a-leaders-framework-for-decision-making) (2007)
{ .doc-ref }

### Décisions de type 1 et de type 2

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Jeff Bezos, dans sa lettre aux actionnaires de 2015, distingue deux sortes de décisions :

- **type 1** : une <span class="term" data-term="one-way-door">porte à sens unique</span>, difficile ou impossible à défaire ; elle mérite du temps et de la prudence ;
- **type 2** : une porte à double sens, un <span class="term" data-term="reversible-change">changement réversible</span> ; elle doit être prise vite, par une petite équipe.

``` { .text .ex-illus title="Illustration" }
type 1   choisir la base de données principale de la nouvelle plateforme
         signer un contrat de cinq ans avec un fournisseur
type 2   choisir une bibliothèque de logs derrière une interface
         activer une fonction pour 5 % des clients derrière un feature flag
```

Le piège décrit dans la lettre : appliquer le processus lourd du type 1 à toutes les décisions, ce qui ralentit l'organisation entière.

**Risques.** le risque inverse du piège de Bezos : classer en type 2 une décision qui est en réalité un type 1. Choisir un format de données « pour l'instant » devient irréversible dès que trois services et des années de données en dépendent. Avant de décider vite, je me demande ce que coûterait le retour arrière dans six mois, et si personne ne sait répondre, je traite la décision comme un type 1.

:material-book-open-variant: Doc de référence : [Jeff Bezos, lettre aux actionnaires 2015](https://s2.q4cdn.com/299287126/files/doc_financials/annual/2015-Letter-to-Shareholders.PDF) (2016)
{ .doc-ref }

### RFC et documents de conception

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Une **RFC** (Request for Comments) est un document qui propose un changement et sollicite des avis avant la décision. Le nom vient de l'Internet : la RFC 1 a été publiée en 1969 par Steve Crocker. En entreprise, on parle aussi de document de conception (design doc). Le modèle tient en quelques rubriques :

``` { .markdown .ex-illus title="Illustration" }
# RFC 014 : facturer à l'usage dans billing-service

Statut : en revue jusqu'au 15/11 (exemple)
Contexte : pourquoi maintenant, avec les chiffres
Objectifs et non-objectifs : ce qu'on vise, ce qu'on ne traite pas
Options étudiées : au moins deux, dont « ne rien faire »
Proposition : l'option choisie et pourquoi
Risques et questions ouvertes
Plan de déploiement et de retour arrière
```

La décision finale est ensuite gardée dans un <span class="term" data-term="adr">ADR</span> : voir [Concevoir avant de coder](livraison.md#concevoir-avant-de-coder).

**Risques.** une RFC sans date de fin de revue traîne des semaines et bloque l'équipe, ou se termine par la victoire de celui qui commente le plus : je fixe une date et une personne qui tranche. Une RFC pour chaque petit choix noie les lecteurs, qui finissent par ne plus rien lire : je la réserve aux décisions de type 1 ou qui touchent plusieurs équipes.

:material-book-open-variant: Doc de référence : [RFC 1, Host Software](https://www.rfc-editor.org/rfc/rfc1) (1969)
{ .doc-ref }

### Advice process

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Dans l'<span class="term" data-term="advice-process">advice process</span>, n'importe qui peut prendre une décision, à condition d'avoir demandé l'avis des personnes concernées et des experts. Celui qui décide n'est pas obligé de suivre ces avis. Le principe vient de Dennis Bakke (« Joy at Work », 2005) et a été repris par Frederic Laloux (« Reinventing Organizations », 2014). Andrew Harmel-Law l'applique à l'architecture logicielle dans « Scaling the Practice of Architecture, Conversationally » (martinfowler.com, 2021).

``` { .text .ex-illus title="Illustration" }
1. ada veut remplacer la file RabbitMQ de orders-service par un sujet Kafka
2. elle demande l'avis de billing-service (consommateur), de l'équipe plateforme et de grace (experte Kafka)
3. billing-service craint pour l'ordre des messages ; la plateforme préfère attendre la mise à jour du cluster
4. ada décide : migration après la mise à jour, clé de partition par numéro de commande
5. elle écrit l'ADR 027 : contexte, avis reçus (y compris ceux non suivis), décision, conséquences
```

**Risques.** sans trace écrite, l'advice process ressemble à « chacun fait ce qu'il veut » : les avis demandés et non suivis disparaissent, et la même discussion revient six mois plus tard. Je tiens un registre des décisions (les ADR). Une personne peut aussi ne consulter que ceux qui sont d'accord avec elle : la liste des personnes concernées se décide avant de demander les avis.

:material-book-open-variant: Doc de référence : [Andrew Harmel-Law, Scaling the Practice of Architecture, Conversationally](https://martinfowler.com/articles/scaling-architecture-conversationally.html) (2021)
{ .doc-ref }

### Désaccord et engagement

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le <span class="term" data-term="disagree-and-commit">disagree and commit</span> : on exprime son désaccord pendant la discussion, puis, une fois la décision prise, on s'engage à la réussir comme si c'était la sienne. Bezos le décrit dans sa lettre de 2016 ; l'expression est souvent rattachée à Intel et à Andy Grove (à vérifier). Ce n'est pas « se taire et obéir » : le désaccord est dit, écrit, et peut être revu si les faits changent.

``` { .text .ex-illus title="Illustration" }
l'équipe choisit MongoDB pour le catalogue, grace aurait préféré PostgreSQL
grace écrit son désaccord dans l'ADR : « risque : rapports avec jointures coûteux »
puis elle conçoit le meilleur schéma MongoDB possible, sans freiner le projet
six mois plus tard, si les rapports posent problème, son objection écrite sert à rouvrir la décision
```

**Risques.** « disagree and commit » peut servir à faire taire : si le chef l'invoque avant que les objections soient dites, c'est de l'obéissance, et les problèmes réapparaissent en production. Le désaccord se dit et s'écrit d'abord. À l'inverse, quelqu'un qui « s'engage » en freinant en silence fait échouer la décision : l'engagement se voit aux actes.

:material-book-open-variant: Doc de référence : [Jeff Bezos, lettre aux actionnaires 2016](https://www.aboutamazon.com/news/company-news/2016-letter-to-shareholders) (2017)
{ .doc-ref }

### Le mémo narratif de six pages

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le <span class="term" data-term="narrative-memo">mémo narratif</span> remplace les diapositives par un texte complet, lu en silence par tous au début de la réunion. L'idée remonte à un courriel de Jeff Bezos de 2004 qui bannit PowerPoint des réunions de direction (à vérifier ; la longueur de six pages est la forme rapportée plus tard). Un texte oblige à relier les idées entre elles, là où une liste à puces permet de les juxtaposer.

``` { .text .ex-illus title="Illustration" }
diapositive  « Contexte : latence, coûts, dette technique »
mémo         « La latence p99 de orders-service a doublé depuis janvier, parce que chaque commande
               appelle quatre services. La refonte supprime deux de ces appels ; elle coûte trois mois
               à deux personnes, et le gain attendu est un p99 sous 300 ms. »
réunion      20 min de lecture silencieuse, puis 40 min de questions
```

**Risques.** un mémo coûte du temps à écrire, souvent plusieurs jours pour une décision importante : je le réserve aux décisions qui le valent. Si les participants arrivent sans avoir lu et que la lecture silencieuse est supprimée « pour gagner du temps », la réunion retombe dans la découverte du sujet en direct : les 20 minutes de lecture font partie de la réunion.

| Je veux... | J'utilise... |
|---|---|
| savoir comment décider face à une question dont personne ne connaît la réponse, comme savoir si les clients veulent le paiement en plusieurs fois | Cynefin : expériences si c'est complexe, analyse si c'est compliqué |
| aller vite sur les petits choix sans m'enfermer sur les gros : choisir une bibliothèque de logs en une heure, mais prendre le temps pour la base de données principale | type 1 ou type 2 : décision rapide si elle se défait facilement |
| recueillir les avis avant un choix qui touche plusieurs équipes, comme passer billing-service à la facturation à l'usage | une RFC relue, puis un ADR |
| que les équipes prennent elles-mêmes leurs décisions d'architecture, sans tout faire remonter à un comité | l'advice process, avec un registre des décisions |
| avancer alors que quelqu'un de l'équipe n'est pas d'accord, comme grace qui aurait préféré PostgreSQL à MongoDB pour le catalogue | disagree and commit, avec le désaccord écrit |
| ne plus avoir de réunions de décision où personne n'a lu le dossier et où tout le monde découvre le sujet sur les diapositives | un mémo narratif lu en début de réunion |

:material-book-open-variant: Doc de référence : [Jeff Bezos, lettre aux actionnaires 2017](https://www.aboutamazon.com/news/company-news/2017-letter-to-shareholders) (2018)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | les décisions se prennent en réunion, à l'oral, et quelques personnes s'en souviennent |
    | N2 | les décisions importantes passent par une RFC relue puis un ADR, et l'équipe classe chaque choix en type 1 ou type 2 |
    | N3 | l'advice process tourne seul : chacun décide après avoir consulté, et l'ADR est écrit sans qu'on le demande, avec les avis non suivis |
    | N4 | l'équipe mesure le délai entre l'ouverture d'une RFC et la décision, et le nombre de décisions rouvertes, et allège ou renforce son processus d'après ces chiffres |

    **Je mesure** : le délai médian entre l'ouverture d'une RFC et son ADR, lu dans le dépôt des ADR ; la part des décisions rouvertes dans l'année faute d'avis demandé.

## Lean et flux

<a class="pill pill-dora" href="https://dora.dev/capabilities/work-visibility-in-value-stream/">DORA · Visibility of work in the value stream</a> <a class="pill pill-dora" href="https://dora.dev/capabilities/working-in-small-batches/">DORA · Working in small batches</a>

### Toyota Production System

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le **Lean** vient du Toyota Production System, décrit par Taiichi Ohno (« Toyota Production System: Beyond Large-Scale Production », 1978 au Japon, 1988 en anglais), puis popularisé par James Womack et Daniel Jones (« Lean Thinking », 1996). Deux piliers : le **juste à temps** (produire ce qui est demandé, quand c'est demandé) et le **jidoka** (arrêter la chaîne dès qu'un défaut apparaît : n'importe quel ouvrier peut tirer la corde andon).

Le Lean chasse le <span class="term" data-term="lean-waste">gaspillage</span>. Mary et Tom Poppendieck traduisent les sept gaspillages de l'usine pour le logiciel (« Lean Software Development: An Agile Toolkit », 2003) :

| Usine | Logiciel | Exemple |
|---|---|---|
| stocks | travail partiellement fait | une branche finie mais pas fusionnée depuis trois semaines |
| surproduction | fonctions en trop | un export PDF que personne n'utilise |
| traitements inutiles | réapprentissage | redécouvrir pourquoi un choix a été fait, faute d'ADR |
| transport | transferts | une demande qui passe par quatre équipes avant d'être traitée |
| mouvements | changements de tâche | une développeuse sur cinq projets à la fois |
| attente | délais | une MR qui attend deux jours une revue |
| défauts | défauts | un bug trouvé en production plutôt qu'en CI |

Leurs sept principes du Lean logiciel : éliminer le gaspillage, amplifier l'apprentissage, décider le plus tard possible, livrer le plus vite possible, donner le pouvoir à l'équipe, construire l'intégrité dedans, voir l'ensemble.

**Risques.** copier les outils du Lean sans son principe (le tableau, les réunions debout, les étiquettes de gaspillage) donne un rituel vide : l'équipe compte les gaspillages sans rien supprimer. Je choisis un gaspillage mesuré, comme l'attente en revue, et je le fais baisser. Chasser le « gaspillage » sans discernement peut aussi supprimer la marge qui absorbe les imprévus, et l'équipe s'effondre au premier incident.

:material-book-open-variant: Doc de référence : [Toyota, Toyota Production System](https://global.toyota/en/company/vision-and-philosophy/production-system/) (consultée en novembre 2026) ; [Lean Enterprise Institute, Toyota Production System](https://www.lean.org/lexicon-terms/toyota-production-system/) (consultée en novembre 2026)
{ .doc-ref }

### Cartographie du flux de valeur

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

La <span class="term" data-term="value-stream-mapping">cartographie du flux de valeur</span> (Mike Rother et John Shook, « Learning to See », 1998) dessine chaque étape d'une demande avec son temps de travail et son temps d'attente.

``` { .text .ex-illus title="Illustration" }
étape                    travail    attente avant l'étape suivante
spécification            4 h        5 jours (priorisation)
développement            2 jours    2 jours (revue de code)
revue                    1 h        3 jours (campagne de recette)
recette                  4 h        4 jours (fenêtre de mise en production)
mise en production       1 h

total : environ 3,2 jours de travail pour 17,2 jours de délai
efficacité du flux = 3,2 / 17,2, soit 19 % (chiffres d'exemple)
```

```mermaid
flowchart LR
  A["Spécification<br/>4 h"] -- "attente 5 j" --> B["Développement<br/>2 j"]
  B -- "attente 2 j" --> C["Revue<br/>1 h"]
  C -- "attente 3 j" --> D["Recette<br/>4 h"]
  D -- "attente 4 j" --> E["Mise en production<br/>1 h"]
```

Le gain est presque toujours dans les attentes, pas dans le travail : faire passer le développement de 2 jours à 1 jour ne retire qu'une journée à un délai de plus de 17 jours, alors que supprimer l'attente de la fenêtre de mise en production en retire 4.

**Risques.** une carte dessinée de mémoire en atelier donne des chiffres faux, souvent trop optimistes sur les attentes : je les lis dans l'outil de tickets (dates de changement de statut). Une carte faite une fois puis rangée ne change rien : je la refais après chaque amélioration pour vérifier que l'attente a vraiment baissé.

:material-book-open-variant: Doc de référence : [Lean Enterprise Institute, Value Stream Mapping](https://www.lean.org/lexicon-terms/value-stream-mapping/) (consultée en novembre 2026)
{ .doc-ref }

### Théorie des contraintes

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Eliyahu Goldratt, dans le roman « The Goal » (1984), montre que le débit d'un système dépend de son <span class="term" data-term="bottleneck">goulot d'étranglement</span>. Optimiser ailleurs ne sert à rien. La <span class="term" data-term="theory-of-constraints">théorie des contraintes</span> propose cinq étapes :

!!! noob "As noob"
    Sur une autoroute qui passe de trois voies à une, élargir la route avant le rétrécissement ne fait arriver personne plus tôt : les voitures attendent simplement plus nombreuses devant l'entonnoir. Seul l'élargissement de l'entonnoir fait passer plus de voitures par heure. La phrase à retenir : **une heure gagnée hors du goulot ne fait rien gagner au système.**

1. **identifier** la contrainte (dans l'exemple ci-dessus, la recette manuelle) ;
2. **l'exploiter** : qu'elle ne perde jamais de temps (préparer les données de recette à l'avance) ;
3. **tout lui subordonner** : ne pas produire plus vite qu'elle n'absorbe ;
4. **l'élever** : augmenter sa capacité (automatiser les tests de recette) ;
5. **recommencer** : la contrainte a bougé ailleurs.

```mermaid
flowchart LR
  I["Étape 1<br/>identifier la contrainte"] --> X["Étape 2<br/>l'exploiter"]
  X --> S["Étape 3<br/>tout lui subordonner"]
  S --> E["Étape 4<br/>l'élever"]
  E --> R["Étape 5<br/>recommencer"]
  R -. "la contrainte a bougé" .-> I
```

**Risques.** me tromper de goulot fait investir au mauvais endroit : sans mesure, chaque équipe désigne l'étape d'à côté. Je cherche où le travail s'accumule (la plus longue file d'attente). Une fois la contrainte élevée, elle bouge ailleurs : si je continue à investir au même endroit, le gain s'arrête net.

:material-book-open-variant: Doc de référence : [Wikipédia, Theory of constraints](https://en.wikipedia.org/wiki/Theory_of_constraints) (consultée en novembre 2026)
{ .doc-ref }

### Loi de Little et limites de WIP

La <span class="term" data-term="littles-law">loi de Little</span> (John Little, 1961) relie trois grandeurs d'un système stable : travail en cours = <span class="term" data-term="throughput">débit</span> × délai moyen. Retournée, elle dit que le délai = travail en cours / débit. Le détail côté systèmes est dans [Architecture](architecture.md#loi-de-little).

!!! noob "As noob"
    Une boulangerie sert une personne par minute. Avec dix personnes devant moi, j'attends environ dix minutes ; avec vingt, vingt minutes, alors que la boulangère ne travaille pas plus lentement. La loi ne vaut qu'en moyenne et pour une file stable, où il n'entre pas durablement plus de monde qu'il n'en sort. La phrase à retenir : **à débit égal, plus il y a de travail en attente, plus chaque demande attend.**

``` { .text .ex-illus title="Illustration" }
team-core termine 5 tickets par semaine
avec 20 tickets en cours   délai moyen = 20 / 5 = 4 semaines
avec 10 tickets en cours   délai moyen = 10 / 5 = 2 semaines
```

Si mon équipe veut livrer plus vite sans travailler plus, elle commence moins de choses à la fois : avec moitié moins de tickets en cours, chaque ticket sort en moyenne deux fois plus tôt. C'est le rôle d'une <span class="term" data-term="wip-limit">limite de WIP</span> (Work In Progress).

**Risques.** une limite de WIP trop basse laisse des gens sans rien à faire dès qu'un ticket est bloqué, et l'équipe la contourne en ouvrant des tickets « hors tableau » : je pars du travail en cours actuel et je baisse par petits pas. La loi ne vaut que pour une file stable : avec un flux d'urgences imprévisibles, le calcul donne un ordre de grandeur, pas une promesse de délai.

:material-book-open-variant: Doc de référence : [Wikipédia, Little's law](https://en.wikipedia.org/wiki/Little%27s_law) (consultée en novembre 2026)
{ .doc-ref }

### Kanban

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

La méthode <span class="term" data-term="kanban">Kanban</span> pour le travail intellectuel (David J. Anderson, « Kanban: Successful Evolutionary Change for Your Technology Business », 2010) part de l'existant : visualiser le travail, limiter le travail en cours, gérer le flux, rendre les règles explicites, améliorer par petites touches.

``` { .text .ex-illus title="Illustration" }
À FAIRE     EN COURS (max 3)    EN REVUE (max 2)    FAIT
TCK-41      TCK-38 ada          TCK-35              TCK-30
TCK-42      TCK-39 grace        TCK-36              TCK-31
TCK-43      TCK-40 ada

EN REVUE est plein : avant de commencer TCK-41, ada va relire TCK-35.
```

**Risques.** un tableau Kanban sans limites de WIP n'est qu'une liste de tâches en colonnes : le travail s'accumule sans que rien ne réagisse. Des limites que personne ne respecte (« juste pour cette fois ») ne protègent rien : quand une colonne est pleine, l'équipe aide à la vider avant de commencer autre chose, sinon la limite saute.

| Je veux... | J'utilise... |
|---|---|
| comprendre pourquoi une demande qui représente quelques jours de travail met trois semaines à arriver en production | une cartographie du flux de valeur, temps de travail et d'attente |
| savoir où mettre des personnes ou du budget pour livrer plus, plutôt que d'accélérer une étape qui ne bloque rien | la théorie des contraintes : d'abord le goulot |
| que les tickets sortent plus vite sans recruter ni faire d'heures en plus, alors que l'équipe a vingt tickets ouverts en même temps | limiter le travail en cours (loi de Little) |
| voir où le travail s'accumule, comme des MR qui s'empilent en revue, et l'améliorer petit à petit sans réorganiser toute l'équipe | un tableau Kanban avec des limites de WIP |
| des mots communs pour pointer ce qui fait perdre du temps, comme une MR qui attend deux jours une revue ou un export que personne n'utilise | les sept gaspillages du logiciel (Poppendieck) |

:material-book-open-variant: Doc de référence : [Kanban University, The Official Kanban Guide](https://kanban.university/kanban-guide/) (consultée en novembre 2026)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | l'équipe sent que le travail attend quelque part, sans savoir où |
    | N2 | un tableau Kanban montre tout le travail en cours, et une carte du flux de valeur donne les temps de travail et d'attente |
    | N3 | les limites de WIP bloquent le démarrage d'un nouveau ticket quand une colonne est pleine, sans arbitrage du manager |
    | N4 | l'équipe suit le délai de bout en bout et l'efficacité du flux chaque mois, et déplace ses efforts vers la nouvelle contrainte quand elle bouge |

    **Je mesure** : le délai médian entre le début d'un ticket et sa mise en production, et le travail en cours moyen, lus dans l'outil de tickets ; l'efficacité du flux (travail sur délai total) recalculée chaque trimestre.

## Produit

### Produit ou projet

| | Projet | Produit |
|---|---|---|
| fin | une date et un périmètre | tant que le produit a des utilisateurs |
| succès | livré à temps, dans le budget | les utilisateurs obtiennent un résultat |
| équipe | assemblée puis dispersée | stable, garde la connaissance |
| financement | par projet | par équipe, sur la durée |

Mik Kersten (« Project to Product », 2018) défend le passage du projet au produit pour les équipes logicielles : un logiciel n'est jamais « fini », et une équipe dispersée après la livraison laisse un système que plus personne ne connaît.

**Risques.** un financement par produit sans revue régulière garde en vie des produits que plus personne n'utilise, avec une équipe entière dessus : je revois chaque année la valeur de chaque produit et j'accepte d'en arrêter. À l'inverse, rester en mode projet laisse des systèmes orphelins après chaque livraison, et la première panne tombe sur une équipe qui ne les connaît pas.

:material-book-open-variant: Doc de référence : [Sriram Narayan, Products Over Projects](https://martinfowler.com/articles/products-over-projects.html) (2018)
{ .doc-ref }

### Jobs to be done

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le cadre <span class="term" data-term="jobs-to-be-done">Jobs to be done</span> (Clayton Christensen et coauteurs, « Competing Against Luck », 2016) dit qu'un client « embauche » un produit pour accomplir un progrès dans une situation donnée. L'exemple classique de Christensen : des clients achètent un milk-shake le matin, non par goût, mais parce qu'il occupe un long trajet en voiture et tient jusqu'à midi. Le concurrent n'est pas l'autre milk-shake, c'est la banane ou le bagel.

!!! noob "As noob"
    Personne ne veut une perceuse : on veut un trou dans le mur, et même plutôt un cadre accroché. Si je ne regarde que la perceuse, je la compare à d'autres perceuses ; si je regarde le cadre accroché, je vois que les crochets adhésifs sont aussi des concurrents. La phrase à retenir : **je cherche le progrès que le client veut faire, pas la fonction qu'il demande.**

À éviter : écrire le besoin sous la forme d'une solution déjà choisie. Je m'enferme dans un tableau de bord avant de savoir si le gérant a besoin d'un tableau, d'une simple notification « tous les virements sont partis » ou d'une alerte seulement en cas d'échec.

``` { .text .ex-bad title="À éviter" }
En tant que  gérant,
je veux      un tableau de bord avec la liste des virements et leur statut,
afin de      voir les virements.
```

Bien : la situation, le progrès voulu et la raison, sans présumer de la solution.

``` { .text .ex-good title="Recommandé" }
Quand   je prépare la paie de mes 12 salariés en fin de mois,
je veux être sûr que chaque virement est parti,
pour    ne pas passer le lundi à répondre à des salariés inquiets.
```

**Risques.** des entretiens mal menés (« voudriez-vous telle fonction ? ») produisent des réponses polies et fausses : je fais raconter la dernière fois où le client a vécu la situation, avec des faits. Un « job » trop large, comme « gérer mon entreprise », ne guide aucune décision : je descends à une situation précise, comme préparer la paie de fin de mois.

:material-book-open-variant: Doc de référence : [Christensen Institute, Jobs to Be Done](https://www.christenseninstitute.org/theory/jobs-to-be-done/) (consultée en novembre 2026)
{ .doc-ref }

### Discovery et delivery

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Marty Cagan (« Inspired », 2008, deuxième édition en 2017) sépare deux activités menées en parallèle par la même équipe :

- la <span class="term" data-term="product-discovery">discovery</span> : découvrir ce qui vaut la peine d'être construit, avec des prototypes et des tests auprès d'utilisateurs ;
- la **delivery** : construire et livrer, de façon fiable, ce qui a été validé.

La discovery traite quatre risques avant d'écrire le code de production : la **valeur** (vont-ils l'acheter ou l'utiliser ?), l'**utilisabilité** (sauront-ils s'en servir ?), la **faisabilité** (peut-on le construire ?) et la **viabilité** (est-ce tenable pour l'entreprise : juridique, ventes, finance ?). Teresa Torres décrit une pratique hebdomadaire de discovery dans « Continuous Discovery Habits » (2021).

Une fonction fictive, le paiement en trois fois dans orders-service, et un test par risque :

| Risque | Test avant d'écrire le code de production |
|---|---|
| valeur | un bouton « payer en 3 fois » factice sur 5 % des paniers : combien de clients cliquent ? |
| utilisabilité | une maquette cliquable montrée à cinq clients : comprennent-ils l'échéancier ? |
| faisabilité | deux jours d'exploration technique : le prestataire de paiement gère-t-il les paiements fractionnés ? |
| viabilité | la finance et le juridique valident le coût des impayés et les mentions légales du crédit |

**Risques.** une discovery sans fin repousse la livraison, et l'équipe perd la confiance de la direction : je borne chaque test dans le temps (une à deux semaines) avec un critère de décision écrit avant. Une discovery « de façade », qui ne sert qu'à confirmer une décision déjà prise, coûte du temps sans rien apprendre : je note ce qui me ferait abandonner l'idée.

:material-book-open-variant: Doc de référence : [Marty Cagan, The Four Big Risks](https://www.svpg.com/the-four-big-risks/) (2017)
{ .doc-ref }

### Shape Up

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Ryan Singer décrit la méthode de Basecamp dans « Shape Up » (2019, livre gratuit en ligne) :

- des cycles de **six semaines**, suivis de **deux semaines** de récupération (cooldown) ;
- avant le cycle, un projet est **façonné** (shaping) : le problème, les grandes lignes de la solution, les pièges connus ;
- l'<span class="term" data-term="appetite">appétit</span> remplace l'estimation : on ne demande pas « combien de temps ça prendra ? » mais « combien de temps ce problème mérite-t-il ? » ;
- une **table des paris** (betting table) choisit les projets du cycle ;
- un **disjoncteur** : un projet non fini en six semaines n'est pas prolongé par défaut.

Un cycle, sur un exemple :

``` { .text .ex-illus title="Illustration" }
cycle précédent    shaping : grace façonne « export comptable » (problème, croquis, pièges), appétit 6 semaines
cooldown           table des paris : 3 projets façonnés, 2 retenus ; le 3e n'est pas mis en attente
semaines 1 à 6     l'équipe construit ; en semaine 4, elle coupe l'export PDF pour tenir l'appétit
fin de semaine 6   disjoncteur : l'export CSV est livré ; non fini, il aurait été arrêté, pas prolongé
semaines 7 et 8    cooldown : corrections, petite dette, exploration libre ; nouvelle table des paris
```

**Risques.** six semaines, c'est trop long pour un correctif et trop court pour une migration de plateforme : je garde Shape Up pour les projets de taille moyenne. Le disjoncteur ne protège que s'il est appliqué : si chaque projet non fini est prolongé « juste deux semaines », l'appétit redevient une estimation. Sans personne pour façonner les projets avant le cycle, l'équipe démarre sur un problème flou.

:material-book-open-variant: Doc de référence : [Ryan Singer, Shape Up](https://basecamp.com/shapeup) (2019)
{ .doc-ref }

### Estimer et découper une fonctionnalité

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le <span class="term" data-term="product-owner">product owner</span> veut que les clients retrouvent leur panier sur tous leurs appareils, et il me demande une estimation pour planifier le trimestre. Aujourd'hui, le panier vit dans le navigateur et n'existe pas côté serveur. Une **estimation** est une prévision de l'effort, avec son incertitude : ce n'est pas un engagement. Je n'estime donc pas une demande floue, je pose d'abord les questions qui changent la taille : seulement les clients connectés, ou aussi les visiteurs anonymes ? que faire si le même produit est ajouté sur deux appareils à la fois ? l'application mobile, qui a son propre calendrier de publication, est-elle concernée ?

Je découpe ensuite en <span class="term" data-term="vertical-slice">tranches verticales</span> : chacune traverse toutes les couches (base, API, écran) et livre un petit morceau utilisable, qu'on peut tester et montrer seul. Bill Wake résume les qualités d'un bon ticket avec INVEST (2003) : indépendant, négociable, porteur de valeur, estimable, petit, testable. L'exercice **Elephant Carpaccio** d'Alistair Cockburn (date à vérifier) entraîne à découper une fonctionnalité en tranches très fines, une quinzaine en moins d'une heure, chacune livrable.

!!! noob "As noob"
    C'est un gâteau à étages : si je sers d'abord toute la génoise, puis toute la crème, puis tout le glaçage, personne ne goûte le gâteau avant la fin. Une part coupée de haut en bas contient tous les étages, et se mange tout de suite. La phrase à retenir : **chaque tranche traverse toutes les couches et peut être livrée seule.**

**Quand** : dès qu'une demande dépasse quelques jours de travail, ou qu'on me demande une date. Pas besoin d'atelier pour un correctif d'une heure. **Pourquoi** : une valeur livrée tôt, des retours avant d'avoir tout construit, des estimations plus justes parce que les morceaux sont petits, et la possibilité pour le product owner d'arrêter quand la valeur suffit. Le coût : du temps de découpage avec le produit, et une réestimation à chaque hypothèse qui tombe. **Comment** :

| Découpage horizontal (à éviter) | Découpage vertical (retenu) |
|---|---|
| 1. tables du panier en base | 1. panier serveur pour les clients connectés sur le web : table, API et écran |
| 2. toutes les routes d'API du panier | 2. application mobile branchée sur ce panier |
| 3. écrans web et mobile | 3. fusion du panier anonyme à la connexion |
| rien à montrer ni à mesurer avant la fin de l'étape 3 | chaque ligne se livre, se montre et se mesure seule |

| Tranche | Ce que le client obtient | Estimation (exemple) | Inconnue |
|---|---|---|---|
| 1. panier serveur, clients connectés, web | le panier survit à un changement de navigateur | 4 à 6 j | reprise du panier local à la première connexion |
| 2. application mobile sur le même panier | retrouver sur mobile ce qu'il a mis sur le web | 3 à 5 j | calendrier de publication de l'application |
| 3. fusion du panier anonyme à la connexion | ne rien perdre en se connectant au moment de payer | 3 à 8 j | règles de fusion : <span class="term" data-term="spike">spike</span> d'une journée |
| 4. mise à jour en direct entre appareils ouverts | voir le panier changer sans recharger | 5 à 10 j | sans doute inutile : à valider avec les données d'usage |

Je donne une **fourchette par tranche**, pas un chiffre unique : « la tranche 1 en une semaine environ, l'ensemble entre trois et six semaines selon les règles de fusion ». Les fourchettes larges disent où sont les inconnues. Le **<span class="term" data-term="cone-of-uncertainty">cône d'incertitude</span>** (Barry Boehm, 1981, popularisé par Steve McConnell en 2006) décrit pourquoi : au tout début d'un projet, l'estimation peut se tromper d'un facteur 4 dans un sens ou dans l'autre, et l'écart se resserre à mesure que les décisions sont prises [À prendre avec précaution : ces ordres de grandeur viennent de projets anciens et sont discutés]. Quand une inconnue est trop grosse, je propose un **spike** (Extreme Programming, Kent Beck, 1999) : une exploration limitée dans le temps, une journée par exemple, dont le seul livrable est la réponse à une question.

Pour que tout le monde comprenne la même chose, je fais un **Example Mapping** (Matt Wynne, 2015) avec le produit et le test : en 25 minutes, une carte par règle, des cartes d'exemples concrets sous chaque règle, et une carte par question ouverte. Beaucoup de questions rouges veut dire que la tranche n'est pas prête. Les exemples retenus deviennent les <span class="term" data-term="acceptance-criteria">critères d'acceptation</span>, écrits en <span class="term" data-term="gherkin">Gherkin</span>.

``` { .text .ex-illus title="Illustration" }
Règle : le panier est conservé côté serveur pour un client connecté
  Exemple : ada ajoute 2 claviers sur son ordinateur, les retrouve sur un autre navigateur
  Exemple : un produit retiré du catalogue reste visible comme indisponible, hors du total
Règle : à la connexion, le panier anonyme rejoint le panier du compte
  Exemple : même produit des deux côtés : on additionne les quantités ?
  Question : combien de temps garde-t-on un panier abandonné ?
```

``` { .gherkin .ex-ref title="Référence" }
# language: fr
# Exemple : critères d'acceptation de la tranche 1, issus de l'Example Mapping
Fonctionnalité : panier conservé côté serveur

  Scénario : retrouver son panier sur un autre navigateur
    Étant donné qu'ada est connectée sur son ordinateur
    Et qu'elle ajoute 2 "Clavier mécanique" à son panier
    Quand elle se connecte sur un autre navigateur
    Alors son panier contient 2 "Clavier mécanique"
```

Je propose de livrer la tranche 1 d'abord, de mesurer combien de clients utilisent vraiment plusieurs appareils avant d'investir dans la tranche 4, de réestimer après le spike, et de prévenir dès qu'une hypothèse tombe, pas la veille de la date.

:material-book-open-variant: Doc de référence : [Alistair Cockburn, Elephant Carpaccio](https://alistaircockburn.com/Elephant-Carpaccio) (consultée en novembre 2026) ; [Matt Wynne, « Introducing Example Mapping »](https://cucumber.io/blog/bdd/example-mapping-introduction/) (2015) ; [Wikipédia, Cone of Uncertainty](https://en.wikipedia.org/wiki/Cone_of_Uncertainty) (consultée en novembre 2026)
{ .doc-ref }

### Construire, acheter ou s'associer

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le choix <span class="term" data-term="build-vs-buy">construire ou acheter</span> revient pour chaque brique.

| Situation | Choix | Exemple |
|---|---|---|
| la brique fait ma différence face aux concurrents : c'est en partie pour elle que les clients viennent chez moi | construire | le moteur de recommandation d'un site marchand |
| tout le monde a le même besoin, et le marché le sert déjà bien | acheter (logiciel ou service) | la paie, l'envoi d'emails, la supervision |
| j'ai besoin vite d'une capacité qui n'est pas mon métier | s'associer | un partenaire de paiement pour un nouveau pays |
| le besoin est courant, mais une contrainte forte pèse dessus, sur les données ou sur le coût | acheter, puis réévaluer | une solution du marché, avec une sortie prévue |

Le coût d'une solution construite ne s'arrête pas à sa livraison : il faut la maintenir des années. Le prix d'une solution achetée inclut l'intégration et le risque de <span class="term" data-term="vendor-lock-in">dépendance au fournisseur</span>.

| Je veux... | J'utilise... |
|---|---|
| comprendre ce que les clients cherchent vraiment, au-delà de ce qu'ils demandent, comme le gérant qui veut surtout être sûr que chaque virement de paie est parti | Jobs to be done, avec des entretiens sur des situations réelles |
| ne pas découvrir après la mise en production qu'une fonction n'intéresse personne, comme un export PDF que personne n'ouvre | la discovery : tester valeur et utilisabilité avant le code |
| arrêter un projet qui dérive, où chaque semaine ajoute une demande et repousse la date de fin | <span class="term" data-term="shape-up">Shape Up</span> : un appétit fixe, un périmètre variable |
| garder l'équipe et ce qu'elle sait du système une fois la livraison faite, au lieu de la disperser sur d'autres projets | un financement par produit, pas par projet |
| décider si on développe une brique ou si on l'achète, comme la paie ou l'envoi d'emails | construire ce qui différencie, acheter le reste |
| donner une estimation pour le trimestre sur une demande encore floue, comme « un panier synchronisé sur tous les appareils » | des questions d'abord, des [tranches verticales](#estimer-et-decouper-une-fonctionnalite) estimées en fourchettes, un spike pour la plus grosse inconnue |

:material-book-open-variant: Doc de référence : [Martin Fowler, Utility Vs Strategic Dichotomy](https://martinfowler.com/bliki/UtilityVsStrategicDichotomy.html) (2010)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | quelqu'un parle aux clients de temps en temps, et les estimations sont un chiffre unique donné à l'oral |
    | N2 | chaque fonctionnalité importante passe par un test de valeur ou d'utilisabilité avant le code, et les demandes sont découpées en tranches verticales estimées en fourchettes |
    | N3 | une idée qui échoue à son test de discovery est abandonnée sans débat, et le disjoncteur arrête un projet qui dépasse son appétit |
    | N4 | l'équipe mesure l'usage réel de chaque fonction livrée et l'écart entre estimations et durées réelles, et ajuste sa discovery et ses fourchettes d'après ces données |

    **Je mesure** : la part des fonctions livrées utilisées par au moins 10 % des clients visés après trois mois (exemple), lue dans l'outil d'analytique ; la part des tranches livrées dans leur fourchette d'estimation.

## Stratégie

### Cartes de Wardley

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Une <span class="term" data-term="wardley-map">carte de Wardley</span> (Simon Wardley, méthode développée au milieu des années 2000, à vérifier) place chaque composant d'une chaîne de valeur sur deux axes : sa **visibilité** pour l'utilisateur (vertical) et son **évolution** (horizontal), de la genèse (nouveau, incertain) au sur-mesure, puis au produit, puis à la commodité (standard, au compteur).

!!! noob "As noob"
    Je pense à l'électricité : au début, chaque usine avait sa propre centrale, construite sur mesure ; aujourd'hui, on se branche au réseau et on paie au compteur (une commodité). La carte de Wardley place chaque brique d'un produit sur ce chemin, et rappelle que tout finit par glisser vers la droite. La phrase à retenir : **on construit ce qui nous distingue, on achète ce qui est devenu banal.**

<figure class="diagram"><svg viewBox="0 0 340 236" role="img" aria-label="Carte de Wardley d'une boutique en ligne (exemple)"><line class="set" style="stroke-width:0.6;stroke-dasharray:2 3" x1="112.5" y1="14" x2="112.5" y2="196"/><line class="set" style="stroke-width:0.6;stroke-dasharray:2 3" x1="185.0" y1="14" x2="185.0" y2="196"/><line class="set" style="stroke-width:0.6;stroke-dasharray:2 3" x1="257.5" y1="14" x2="257.5" y2="196"/><line class="set" x1="40" y1="196" x2="330" y2="196"/><line class="set" x1="40" y1="196" x2="40" y2="14"/><text x="76.2" y="208" text-anchor="middle">genèse</text><text x="148.8" y="208" text-anchor="middle">sur-mesure</text><text x="221.2" y="208" text-anchor="middle">produit</text><text x="293.8" y="208" text-anchor="middle">commodité</text><text x="185.0" y="222" text-anchor="middle" class="label-strong">Évolution</text><text x="36" y="22" text-anchor="end">visible</text><text x="36" y="194" text-anchor="end">invisible</text><text x="12" y="105.0" text-anchor="middle" class="label-strong" transform="rotate(-90 12 105.0)">Visibilité</text><line class="set" style="stroke-width:1" x1="219.8" y1="23.1" x2="219.8" y2="57.7"/><line class="set" style="stroke-width:1" x1="219.8" y1="57.7" x2="127.0" y2="90.4"/><line class="set" style="stroke-width:1" x1="219.8" y1="57.7" x2="231.4" y2="114.1"/><line class="set" style="stroke-width:1" x1="127.0" y1="90.4" x2="98.0" y2="130.5"/><line class="set" style="stroke-width:1" x1="98.0" y1="130.5" x2="295.2" y2="174.2"/><line class="set" style="stroke-width:1" x1="231.4" y1="114.1" x2="295.2" y2="174.2"/><line class="set" style="stroke-dasharray:4 3" x1="104.0" y1="130.5" x2="219.8" y2="130.5"/><polygon class="hit" points="219.8,130.5 213.4,133.2 213.4,127.8"/><text x="161.8" y="125.5" text-anchor="middle">dérive avec le temps</text><circle class="hit" cx="219.8" cy="23.1" r="4"/><text x="226.8" y="18.1">client</text><circle class="hit" cx="219.8" cy="57.7" r="4"/><text x="226.8" y="52.7">boutique en ligne</text><circle class="hit" cx="127.0" cy="90.4" r="4"/><text x="134.0" y="85.4">recommandations</text><circle class="hit" cx="98.0" cy="130.5" r="4"/><text x="91.0" y="133.5" text-anchor="end">modèle maison</text><circle class="hit" cx="231.4" cy="114.1" r="4"/><text x="238.4" y="109.1">paiement</text><circle class="hit" cx="295.2" cy="174.2" r="4"/><text x="288.2" y="177.2" text-anchor="end">calcul (cloud)</text></svg><figcaption>Carte de Wardley d'une boutique en ligne (exemple)</figcaption></figure>

Lecture : construire ce qui est en genèse ou sur-mesure et différencie (les recommandations), acheter ou louer les produits et les commodités (le paiement, le calcul). Les composants dérivent vers la droite avec le temps : ce qui est rare aujourd'hui sera banal demain.

**Risques.** une carte dessinée par une seule personne reflète ses croyances : je la construis avec les équipes concernées et je la confronte aux faits (offres du marché, coûts). La position sur l'axe d'évolution est un jugement, pas une mesure : deux personnes placeront le même composant différemment, et c'est la discussion qui compte, pas le dessin final.

:material-book-open-variant: Doc de référence : [Learn Wardley Mapping](https://learnwardleymapping.com/) (consultée en novembre 2026) ; [Wikipédia, Wardley map](https://en.wikipedia.org/wiki/Wardley_map) (consultée en novembre 2026)
{ .doc-ref }

### Bonne et mauvaise stratégie

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Richard Rumelt (« Good Strategy Bad Strategy », 2011) donne le noyau d'une bonne stratégie : un **diagnostic** (ce qui se passe vraiment), une **politique directrice** (l'approche choisie) et des **actions cohérentes** (qui se renforcent). Il reconnaît une mauvaise stratégie à quatre signes : des mots creux, l'absence de diagnostic du vrai problème, des objectifs pris pour une stratégie, et des objectifs irréalistes.

``` { .text .ex-compare title="Comparaison" }
mauvaise   « Devenir le leader de la plateforme développeur, innovante et centrée client. »

bonne      diagnostic   les équipes perdent 30 % de leur temps sur la CI et les environnements
           politique    un chemin standard en libre-service plutôt que du sur-mesure par équipe
           actions      un template de projet, une CI partagée, des environnements de prévisualisation,
                        et l'arrêt du support des trois outils maison (chiffres d'exemple)
```

**Risques.** un diagnostic sans chiffres n'est qu'une opinion, et la stratégie qui en découle vise le mauvais problème : j'appuie le diagnostic sur des mesures, comme le temps perdu sur la CI. Une stratégie qui ne renonce à rien (aucun outil arrêté, aucun sujet refusé) n'en est pas une : les actions doivent dire ce que l'équipe arrête de faire.

### Le dilemme de l'innovateur

Clayton Christensen (« The Innovator's Dilemma », 1997) explique pourquoi des entreprises bien gérées perdent face à des nouveaux venus. Elles investissent dans l'**innovation de continuité** que leurs meilleurs clients demandent, et négligent l'<span class="term" data-term="disruptive-innovation">innovation de rupture</span> : un produit d'abord moins bon et moins cher, destiné à des clients délaissés, qui s'améliore jusqu'à suffire au marché principal. Exemple souvent cité : les petits disques durs, d'abord trop limités pour les clients existants, ont remplacé les grands.

!!! noob "As noob"
    Les premiers appareils photo numériques faisaient de moins bonnes images que la pellicule : un fabricant de pellicule qui écoutait ses meilleurs clients n'avait aucune raison de s'y intéresser. Mais le numérique s'est amélioré plus vite que les besoins des clients, et un jour il a suffi. La phrase à retenir : **écouter ses meilleurs clients est rationnel, et c'est justement ce qui empêche de voir venir le produit modeste qui va les prendre.**

<figure class="diagram"><svg viewBox="0 0 320 210" role="img" aria-label="Le dilemme de l'innovateur (d'après Clayton Christensen, 1997)"><polygon class="layer layer-1" points="36,150 300,110 300,60 36,110"/><line class="set" x1="36" y1="170" x2="300" y2="170"/><line class="set" x1="36" y1="170" x2="36" y2="12"/><line class="set" x1="36.0" y1="100.0" x2="300.0" y2="20.0"/><polygon class="hit" points="300.0,20.0 294.6,24.5 293.0,19.3"/><line class="set" style="stroke-dasharray:4 3" x1="90.0" y1="168.0" x2="300.0" y2="80.0"/><polygon class="hit" points="300.0,80.0 295.1,85.0 293.0,80.0"/><text x="42" y="124">ce que le marché</text><text x="42" y="134">peut absorber</text><text x="70" y="78" transform="rotate(-17 70 78)">innovation de continuité</text><text x="140" y="162" transform="rotate(-23 140 162)">innovation de rupture</text><text x="168" y="186" text-anchor="middle">temps</text><text x="20" y="91" text-anchor="middle" transform="rotate(-90 20 91)">performance</text></svg><figcaption>Le dilemme de l'innovateur (d'après Clayton Christensen, 1997)</figcaption></figure>

| Je veux... | J'utilise... |
|---|---|
| discuter avec la direction de ce qu'il faut construire ou acheter, avec un dessin partagé plutôt qu'avec des opinions | une carte de Wardley de la chaîne de valeur |
| savoir si une stratégie annoncée en est vraiment une, ou seulement un slogan comme « devenir le leader innovant et centré client » | le noyau de Rumelt : diagnostic, politique, actions |
| comprendre pourquoi un concurrent au produit plus simple et moins cher gagne des clients | le dilemme de l'innovateur |
| écrire la stratégie technique de mon équipe sans qu'elle tourne à la liste de vœux | diagnostic chiffré, une politique, trois à cinq actions |

:material-book-open-variant: Doc de référence : [Christensen Institute, Disruptive Innovation](https://www.christenseninstitute.org/theory/disruptive-innovation/) (consultée en novembre 2026)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | la stratégie existe dans la tête de la direction, sous forme de slogans |
    | N2 | la stratégie technique est écrite avec un diagnostic chiffré, une politique et quelques actions, et une carte de Wardley sert aux choix construire ou acheter |
    | N3 | chaque nouveau projet est confronté à la stratégie écrite avant d'être lancé, et un projet qui ne la sert pas est refusé sans escalade |
    | N4 | l'équipe relit chaque année le diagnostic avec ses mesures (temps perdu, coûts), et change la politique quand les chiffres ont bougé |

    **Je mesure** : la part des projets de l'année rattachés à une action de la stratégie écrite, lue dans la feuille de route ; l'évolution de la mesure du diagnostic (par exemple le temps perdu sur la CI) d'une année sur l'autre.

## Argent et coûts

<a class="pill pill-scope pill-scope-infra" href="../architecture/#carte-des-echelles">Échelle · Infrastructure</a> <a class="pill pill-scope pill-scope-enterprise" href="../architecture/#carte-des-echelles">Échelle · Entreprise</a>

### CAPEX et OPEX

Le <span class="term" data-term="capex">CAPEX</span> est un investissement qui crée un actif utilisé plusieurs années : il est amorti, c'est-à-dire réparti sur sa durée de vie dans les comptes. L'<span class="term" data-term="opex">OPEX</span> est une dépense de fonctionnement, comptée dans l'année.

!!! noob "As noob"
    Acheter une voiture, c'est du CAPEX : une grosse somme au départ, que la comptabilité étale sur les années où la voiture sert. La louer au mois, c'est de l'OPEX : une dépense régulière, comptée au fil de l'eau. La phrase à retenir : **deux options au coût total proche n'apparaissent pas de la même façon dans les comptes, et c'est souvent ce qui pèse dans la décision.**

``` { .text .ex-illus title="Illustration" }
acheter 3 serveurs à 30 000 €, amortis sur 3 ans    CAPEX : 10 000 € par an dans le compte de résultat
louer l'équivalent dans le cloud, 1 200 € par mois  OPEX  : 14 400 € par an
(chiffres d'exemple)
```

Le cloud transforme du CAPEX en OPEX : pas d'achat initial, mais une facture qui suit l'usage. Une partie du temps de développement d'un nouveau logiciel peut aussi être immobilisée (traitée comme du CAPEX) selon les normes comptables, par exemple IAS 38 (à vérifier avec la finance, les règles varient selon le pays et le référentiel). C'est pourquoi la finance demande parfois de séparer le temps passé sur un nouveau produit du temps passé sur la maintenance.

**Risques.** le passage au cloud en OPEX supprime le gros chèque initial, mais la facture suit l'usage sans plafond : sans budget ni alerte, elle double en silence. Je pose un budget et une alerte par projet. Classer du temps de développement en CAPEX sans suivre les règles comptables expose à une correction par les auditeurs : je laisse la finance trancher.

:material-book-open-variant: Doc de référence : [Wikipédia, Capital expenditure](https://en.wikipedia.org/wiki/Capital_expenditure) (consultée en novembre 2026) ; [IFRS Foundation, IAS 38 Intangible Assets](https://www.ifrs.org/issued-standards/list-of-standards/ias-38-intangible-assets/) (consultée en novembre 2026)
{ .doc-ref }

### Coût total de possession

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le <span class="term" data-term="total-cost-ownership">coût total de possession</span> (TCO) additionne tout ce que coûte une solution sur sa durée de vie, pas seulement son prix d'achat.

| Sur 3 ans | Héberger soi-même | Service managé |
|---|---|---|
| licences ou abonnement | 0 € | 54 000 € |
| infrastructure | 36 000 € | inclus |
| temps humain (exploitation, mises à jour, astreinte) | 0,5 personne, soit 120 000 € | 0,1 personne, soit 24 000 € |
| **total** | **156 000 €** | **78 000 €** |

Chiffres d'exemple. Le poste le plus oublié est presque toujours le temps humain.

**Risques.** un TCO dépend d'hypothèses (salaire chargé, part de temps d'exploitation, durée de vie) qui font basculer la conclusion : je les écris à côté du tableau pour qu'on puisse les contester. Celui qui défend une option sous-estime souvent ses coûts : je fais relire le calcul par quelqu'un qui n'a pas d'intérêt dans le choix.

:material-book-open-variant: Doc de référence : [Wikipédia, Total cost of ownership](https://en.wikipedia.org/wiki/Total_cost_of_ownership) (consultée en novembre 2026)
{ .doc-ref }

### L'enfermement chez un fournisseur, un coût à chiffrer

<a class="pill pill-scope pill-scope-system" href="../architecture/#carte-des-echelles">Échelle · Système</a> <a class="pill pill-scope pill-scope-infra" href="../architecture/#carte-des-echelles">Échelle · Infrastructure</a> <span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

L'équipe de orders-service veut héberger elle-même sa base PostgreSQL sur un cluster Kubernetes, au lieu de prendre la base PostgreSQL managée de son fournisseur cloud, « pour ne pas être enfermée ». L'**enfermement** (lock-in, ou <span class="term" data-term="vendor-lock-in">verrouillage fournisseur</span>) est la situation où quitter un fournisseur coûte cher, parce que le code, les données ou les compétences dépendent de ses services propres. Gregor Hohpe (« Don't get locked up into avoiding lock-in », martinfowler.com, 2019) rappelle deux choses : l'enfermement a plusieurs formes (fournisseur, produit, version, architecture, compétences, contrat), et la portabilité a elle aussi un prix, payé tout de suite, pour un départ qui n'arrivera peut-être jamais.

!!! noob "As noob"
    Je peux louer un appartement meublé ou vide. Le meublé me fait gagner des semaines au départ, mais si je déménage, je repars sans meubles. Acheter mes propres meubles « au cas où je déménage » coûte tout de suite, même si je reste dix ans. La phrase à retenir : **l'enfermement n'est pas un mal absolu, c'est un coût futur et incertain à comparer au coût immédiat de la portabilité.**

Je chiffre donc l'enfermement comme un risque : **coût attendu = probabilité de devoir partir × <span class="term" data-term="switching-cost">coût de bascule</span>**, et je le compare au surcoût immédiat de l'option portable, calculé comme un [coût total de possession](#cout-total-de-possession).

``` { .text .ex-illus title="Illustration" }
option A : PostgreSQL managé
  probabilité de changer de fournisseur dans les 3 ans   10 %
  coût de bascule : export, import, tests, 2 personnes 2 semaines   8 000 €
  coût attendu de l'enfermement : 10 % × 8 000 €   800 €

option B : PostgreSQL hébergé soi-même sur Kubernetes, « portable »
  surcoût d'exploitation : sauvegardes, montées de version, astreinte
  0,3 personne pendant 3 ans   72 000 €

conclusion : la portabilité coûte 90 fois l'enfermement qu'elle évite
(chiffres d'exemple)
```

Deux coûts s'oublient souvent dans le coût de bascule. Les <span class="term" data-term="egress-fees">frais de sortie</span> (egress) : le fournisseur facture les données qui quittent son réseau, et partir avec plusieurs dizaines de téraoctets peut coûter cher (plusieurs grands fournisseurs ont annoncé en 2024 des sorties gratuites pour les clients qui migrent, sous conditions, à vérifier). Et les compétences : une équipe formée à un outil propriétaire doit réapprendre.

Je réserve donc l'effort de portabilité aux composants où la sortie est probable ou très coûteuse, et je l'écris dans une grille :

| Composant | Option retenue | Enfermement | Coût de bascule estimé | Décision |
|---|---|---|---|---|
| base de données | PostgreSQL managé | faible : moteur standard | 2 semaines | accepté |
| file de messages | file propriétaire du fournisseur | moyen : API propre | 4 semaines | accepté, accès isolé derrière une interface `MessagePublisher` |
| identité des employés | annuaire du fournisseur | fort : tous les accès en dépendent | 3 mois | <span class="term" data-term="exit-strategy">stratégie de sortie</span> écrite, relue chaque année |
| traces et métriques | OpenTelemetry vers l'outil du fournisseur | faible : format standard | changer la destination du collecteur | accepté |

Durées d'exemple. **Quand** : avant d'adopter un <span class="term" data-term="managed-service">service managé</span> propriétaire, ou quand quelqu'un propose de tout héberger soi-même « pour rester portable ». **Pourquoi** : sans chiffre, le débat oppose deux peurs ; avec un chiffre, il oppose deux coûts. **Comment** : pour chaque composant, j'estime la probabilité de partir, le coût de bascule et le surcoût de la portabilité ; je préfère les services managés bâtis sur un standard ouvert (PostgreSQL, Kubernetes, OpenTelemetry) ; je garde toujours les données dans un format exportable.

**Risques.** sous-estimer la probabilité de partir : une hausse de prix, un rachat ou une nouvelle règle (le règlement européen DORA, applicable depuis janvier 2025, impose aux entités financières une stratégie de sortie pour leurs prestataires informatiques critiques) change le calcul ; je relis la grille chaque année. À l'inverse, isoler chaque service derrière une abstraction « au cas où » ajoute du code à maintenir et me prive des fonctions qui faisaient l'intérêt du service : le plus petit dénominateur commun de trois clouds est un mauvais cloud.

| Je veux... | J'utilise... |
|---|---|
| décider si l'équipe prend la base managée du fournisseur ou l'héberge elle-même pour rester portable | la probabilité de partir × le coût de bascule, comparés au TCO de l'option portable |
| savoir sur quels composants l'effort de portabilité vaut vraiment la peine, comme une file de messages propriétaire | une grille d'enfermement par composant |
| rassurer la direction, ou un régulateur, sur un fournisseur dont tout dépend, comme l'annuaire des employés | une stratégie de sortie écrite et relue chaque année |

:material-book-open-variant: Doc de référence : [Gregor Hohpe, Don't get locked up into avoiding lock-in](https://martinfowler.com/articles/oss-lockin.html) (2019)
{ .doc-ref }

### Retour sur investissement

Le <span class="term" data-term="roi">ROI</span> se calcule ainsi : (gain - coût) / coût. Le **délai de récupération** (payback) dit en combien de temps l'investissement est remboursé.

``` { .text .ex-illus title="Illustration" }
coût : automatiser la recette, 2 personnes pendant 2 mois, soit 40 000 €
gain : 10 jours de recette manuelle par mois en moins, soit 5 000 € par mois

ROI sur un an     (60 000 - 40 000) / 40 000 = 50 %
délai de récupération : 40 000 / 5 000 = 8 mois
(chiffres d'exemple)
```

**Risques.** les gains d'un ROI sont presque toujours estimés trop haut, et un projet vendu sur un ROI gonflé coûte ma crédibilité au suivant : je donne une fourchette et je mesure le gain réel après coup. Un ROI calculé sur un an ignore les coûts de maintenance des années suivantes : je les inclus.

:material-book-open-variant: Doc de référence : [Wikipédia, Return on investment](https://en.wikipedia.org/wiki/Return_on_investment) (consultée en novembre 2026)
{ .doc-ref }

### Coût du retard

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le <span class="term" data-term="cost-of-delay">coût du retard</span> (Donald Reinertsen, « The Principles of Product Development Flow », 2009) est ce qu'on perd par unité de temps tant qu'une chose n'est pas livrée. Diviser le coût du retard par la durée donne un ordre de priorité, souvent appelé CD3 (Cost of Delay Divided by Duration, à vérifier pour l'origine du sigle).

!!! noob "As noob"
    Un parapluie livré après l'averse ne vaut plus grand-chose : chaque semaine de retard a un prix, et ce prix n'est pas le même pour tous les sujets. Diviser ce prix par la durée du travail fait passer en premier ce qui rapporte le plus vite. La phrase à retenir : **on ne priorise pas seulement par valeur, mais par ce que coûte chaque semaine d'attente.**

| Sujet | Coût du retard par semaine | Durée | CD3 | Ordre |
|---|---|---|---|---|
| paiement en plusieurs fois | 8 000 € | 4 semaines | 2 000 | 2 |
| correctif de conformité (amende possible) | 15 000 € | 3 semaines | 5 000 | 1 |
| refonte du back-office | 3 000 € | 6 semaines | 500 | 3 |

Chiffres d'exemple. L'intérêt est moins le calcul exact que la discussion qu'il force : « que perd-on si on attend ? ». La démarche <span class="term" data-term="finops">FinOps</span> et la façon de prouver une économie sont dans [Données et décision](donnees-decision.md#couts-et-economies).

**Risques.** des coûts du retard inventés donnent une priorisation précise en apparence et fausse en réalité : chacun gonfle le chiffre de son sujet. Je demande d'où vient chaque montant (chiffre d'affaires, amende possible, coût du support) et je compare des ordres de grandeur plutôt que des euros exacts.

| Je veux... | J'utilise... |
|---|---|
| comparer acheter des serveurs et louer l'équivalent dans le cloud, alors que l'un se paie d'un coup et l'autre tous les mois | CAPEX et OPEX, sur la même durée |
| comparer honnêtement héberger un outil soi-même et prendre un service managé, sans oublier le temps que l'équipe passe à le faire tourner | le TCO sur 3 ans, temps humain compris |
| convaincre la direction de financer un chantier technique, comme automatiser la recette | le ROI et le délai de récupération, avec les hypothèses écrites |
| décider avec la direction quel sujet passe en premier quand tout semble urgent, comme un correctif de conformité face au paiement en plusieurs fois | le coût du retard divisé par la durée |
| prouver qu'une optimisation a vraiment fait baisser la facture cloud, même si le trafic a changé entre-temps | le coût unitaire, avant et après |

:material-book-open-variant: Doc de référence : [Black Swan Farming, Cost of Delay](https://blackswanfarming.com/cost-of-delay/) (consultée en novembre 2026)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | les coûts sont connus après coup, quand la facture arrive |
    | N2 | chaque choix d'outil ou de projet a un TCO sur 3 ans et un ROI écrits, avec leurs hypothèses, et la priorisation passe par le coût du retard |
    | N3 | des budgets et des alertes de coût par projet préviennent l'équipe dès qu'une dépense dérive, sans qu'un humain surveille la facture |
    | N4 | l'équipe compare le ROI annoncé au gain mesuré et le coût unitaire avant et après, et corrige ses hypothèses de calcul pour les dossiers suivants |

    **Je mesure** : l'écart entre le gain annoncé et le gain mesuré six mois après, lu dans les dossiers de projet ; le coût unitaire (par commande, par utilisateur) suivi chaque mois dans l'outil de facturation cloud.

## Communiquer avec la direction

### Principe de la pyramide

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le <span class="term" data-term="pyramid-principle">principe de la pyramide</span> (Barbara Minto, « The Pyramid Principle », édition de 1987, à vérifier) : la conclusion d'abord, puis les arguments qui la soutiennent, puis les détails, seulement si on les demande. Pour l'introduction, Minto propose le schéma SCQA : situation, complication, question, réponse.

À éviter : raconter l'histoire dans l'ordre chronologique. La demande arrive à la fin, quand la directrice a déjà décroché ou que la réunion se termine, et la décision est reportée.

``` { .text .ex-bad title="À éviter" }
En 2019, on a créé orders-service pour remplacer l'ancien module de commande.
En mars, une première panne ; en juin, une deuxième ; en septembre, une troisième.
On a analysé les causes, essayé plusieurs correctifs, comparé trois options...
Donc je demande deux personnes de team-core pendant deux trimestres.
```

Bien : la même demande avec le schéma SCQA, la réponse visible dès la quatrième ligne.

``` { .text .ex-good title="Recommandé" }
Situation     orders-service traite toutes les commandes depuis 2019.
Complication  il a causé 3 pannes ce semestre, 14 h sans commande au total.
Question      faut-il le refondre maintenant ?
Réponse       oui, en deux trimestres, par étapes : je demande deux personnes de team-core.
(chiffres d'exemple)
```

```mermaid
flowchart TD
  R["Réponse<br/>refondre orders-service par étapes, 2 personnes"] --> A1["Argument<br/>3 pannes ce semestre"]
  R --> A2["Argument<br/>14 h sans commande"]
  R --> A3["Argument<br/>une refonte par étapes limite le risque"]
  A1 --> D1["Détail<br/>postmortems"]
  A2 --> D2["Détail<br/>ventes perdues estimées"]
  A3 --> D3["Détail<br/>plan par étapes"]
```

**Risques.** devant un public sceptique ou qui découvre le sujet, une conclusion lancée sans contexte peut braquer : la situation et la complication du schéma SCQA servent justement à amener la réponse. Une pyramide dont les arguments ne soutiennent pas vraiment la conclusion se voit à la première question : je vérifie que chaque argument répond à « pourquoi ? ».

:material-book-open-variant: Doc de référence : [Barbara Minto, The Minto Pyramid Principle](https://www.barbaraminto.com/) (consultée en novembre 2026)
{ .doc-ref }

### One-pager

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le one-pager tient sur une page et se lit en deux minutes :

``` { .markdown .ex-illus title="Illustration" }
# Demande : refondre orders-service par étapes

Décision attendue : 2 personnes de team-core pendant 2 trimestres, d'ici le 30/11
Pourquoi : 3 pannes ce semestre, environ 160 000 € de ventes perdues (estimation)
Options : ne rien faire / refonte progressive (recommandée) / réécriture complète
Coût : 2 trimestres de 2 personnes, 1 500 € par mois de cloud en plus
Risques : fonctions métier oubliées ; atténué par des tests de caractérisation
Ce qui changerait la recommandation : un plan de remplacement du produit dans l'année
```

**Risques.** tenir sur une page oblige à couper, et une option ou un risque important peut disparaître : je garde une annexe avec les détails pour qui les demande. Un one-pager sans décision attendue ni date produit une réunion agréable et aucune suite.

### Registre des risques

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Un <span class="term" data-term="risk-register">registre des risques</span> liste les risques connus, leur probabilité, leur impact, un responsable et une parade. Il rassure la direction parce qu'il montre que les risques sont vus et suivis.

| Risque | Probabilité | Impact | Responsable | Parade |
|---|---|---|---|---|
| perte de commandes pendant la bascule | faible | fort | grace | bascule progressive, réconciliation quotidienne |
| départ de la seule personne qui connaît le code | moyenne | fort | ada | binômage, documentation des décisions |
| dépassement de délai | moyenne | moyen | grace | point d'étape à mi-parcours, périmètre réductible |

**Risques.** un registre rempli au lancement puis jamais relu rassure à tort : les risques changent, et celui qui arrive n'y figure pas. Je le relis à chaque point d'étape. Un registre de cinquante lignes noie les trois risques qui comptent : je classe par probabilité et impact et je ne détaille que le haut de la liste.

:material-book-open-variant: Doc de référence : [Wikipédia, Risk register](https://en.wikipedia.org/wiki/Risk_register) (consultée en novembre 2026)
{ .doc-ref }

### Présenter un compromis technique en termes métier

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Mon manager ou ma directrice arbitre déjà de l'argent, des délais, des risques et des clients, pas des versions de bibliothèque : chaque argument technique doit donc être traduit dans l'une de ces unités, sinon il passe pour un caprice d'ingénieur.

| Ce que dit l'ingénieur | Ce qu'entend le décideur |
|---|---|
| « la <span class="term" data-term="technical-debt">dette technique</span> est élevée » | « chaque nouvelle fonction prend deux fois plus de temps qu'il y a un an » |
| « on n'a pas de redondance » | « une panne d'un seul serveur arrête les ventes, environ 10 000 € de l'heure (exemple) » |
| « il faut migrer de version » | « dans six mois, plus de correctifs de sécurité : risque d'incident et de non-conformité » |
| « la CI est lente » | « vingt personnes attendent 30 min plusieurs fois par jour : l'équivalent de deux postes » |

Toujours présenter l'option « ne rien faire » avec son coût, rendre le <span class="term" data-term="trade-off">compromis</span> explicite, et dire si la décision est de type 1 ou de type 2. Gregor Hohpe décrit ce va-et-vient entre la salle des machines et la direction dans « The Software Architect Elevator » (2020).

**Risques.** des chiffres gonflés pour convaincre (« 10 000 € de l'heure ») se vérifient un jour, et je perds la confiance de la direction pour les demandes suivantes : je donne la source ou la méthode de chaque montant, et j'écris « estimation » quand c'en est une. À l'inverse, ne rien traduire laisse la dette technique s'accumuler jusqu'à la panne, faute de budget.

| Je veux... | J'utilise... |
|---|---|
| que la direction comprenne ma demande en deux minutes, même si elle ne lit que le début | le principe de la pyramide : la conclusion d'abord |
| repartir de la réunion avec une décision écrite, pas avec un « on en reparle » | un one-pager avec la décision attendue et sa date |
| montrer à la direction que je vois les risques du projet et que chacun est suivi par quelqu'un | un registre des risques avec un responsable par ligne |
| défendre un chantier technique devant des gens qui ne parlent ni de latence ni de versions | une traduction en argent, délai, risque ou clients, et l'option « ne rien faire » |

:material-book-open-variant: Doc de référence : [Gregor Hohpe, The Architect Elevator](https://architectelevator.com/) (consultée en novembre 2026)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | quelqu'un présente ses demandes à la direction en racontant l'historique, et repart souvent sans décision |
    | N2 | chaque demande à la direction passe par un one-pager avec la décision attendue, l'option « ne rien faire » et un registre des risques |
    | N3 | le one-pager est le format attendu par défaut, et le registre des risques est relu à chaque point d'étape sans qu'on le demande |
    | N4 | l'équipe suit la part de ses demandes qui obtiennent une décision à la première réunion, et revoit ses dossiers quand elle baisse |

    **Je mesure** : la part des demandes qui repartent avec une décision écrite dès la première réunion, lue dans les comptes rendus ; le délai entre la demande et la décision.

## Carrière et rôles

### Deux filières : expertise et management

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Beaucoup d'entreprises proposent deux filières parallèles au-delà du niveau senior : la <span class="term" data-term="ic-track">filière d'expertise</span> (contributeur individuel : staff, principal, distinguished) et la filière de management (manager, directeur, vice-président). Les deux ont des niveaux de salaire comparables ; aucune n'est une promotion de l'autre.

``` { .text .ex-illus title="Illustration" }
                 senior engineer
                /               \
   staff engineer                engineering manager
   principal engineer            director of engineering
   distinguished engineer        VP engineering
   (influence par l'expertise)   (influence par l'équipe et le budget)
```

Camille Fournier décrit la filière management dans « The Manager's Path » (2017). Charity Majors défend l'idée d'aller et venir entre les deux (« The Engineer/Manager Pendulum », 2017).

**Risques.** une filière d'expertise qui n'existe que sur le papier (pas de poste staff ouvert, pas de salaire comparable) pousse les meilleurs ingénieurs vers le management à contrecœur, ou vers la sortie : je regarde combien de personnes ont réellement été promues sur chaque filière. Passer manager sans le vouloir pour « monter » donne souvent un mauvais manager et un expert de moins.

:material-book-open-variant: Doc de référence : [Charity Majors, The Engineer/Manager Pendulum](https://charity.wtf/2017/05/11/the-engineer-manager-pendulum/) (2017)
{ .doc-ref }

### Les archétypes staff+

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Will Larson (« Staff Engineer: Leadership beyond the management track », 2021) décrit quatre <span class="term" data-term="staff-archetype">archétypes</span> de rôles staff :

| Archétype | Ce qu'il fait | Exemple |
|---|---|---|
| tech lead | guide l'approche et l'exécution d'une ou plusieurs équipes | ada porte la conception et le découpage du nouveau paiement |
| architecte | garde la cohérence d'un domaine technique sur la durée | grace est responsable des API publiques et de leurs règles |
| solver | plonge dans les problèmes difficiles, l'un après l'autre | un expert envoyé là où la performance s'effondre |
| right hand | étend la portée d'un dirigeant, sur ses sujets | le bras droit de la directrice technique sur les sujets transverses |

Tanya Reilly complète avec « The Staff Engineer's Path » (2022) : vision d'ensemble, exécution des projets transverses, élévation du niveau des autres.

**Risques.** les archétypes décrivent des tendances, pas des fiches de poste : m'enfermer dans un seul me fait refuser des sujets utiles qui « ne sont pas mon rôle ». Un rôle staff sans périmètre écrit ni sponsor tourne à l'équipe de pompiers sans fin : je me mets d'accord avec mon manager sur l'archétype visé et sur ce qui comptera comme réussite.

| Je veux... | J'utilise... |
|---|---|
| choisir, après le niveau senior, entre devenir expert et devenir manager, sans croire que l'un est une promotion de l'autre | les deux filières, et l'idée du pendule (Majors) |
| décrire le rôle staff que je vise, par exemple porter la conception du nouveau paiement ou être responsable des API publiques | les quatre archétypes de Larson |

:material-book-open-variant: Doc de référence : [Will Larson, Staff archetypes](https://staffeng.com/guides/staff-archetypes/) (2021)
{ .doc-ref }

### Architecte logiciel, de solution, d'entreprise

<a class="pill pill-scope pill-scope-app" href="../architecture/#carte-des-echelles">Échelle · Application</a> <a class="pill pill-scope pill-scope-system" href="../architecture/#carte-des-echelles">Échelle · Système</a> <a class="pill pill-scope pill-scope-enterprise" href="../architecture/#carte-des-echelles">Échelle · Entreprise</a> <span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Une offre d'emploi dit « architecte », une autre « Staff Engineer », une troisième « tech lead », et je ne sais pas si c'est le même métier. La différence tient moins au titre qu'à ce dont la personne répond, sur quelle portée et sur quel horizon de temps. Trois métiers d'architecte coexistent : l'architecte logiciel conçoit l'intérieur d'un système, l'<span class="term" data-term="solution-architect">architecte de solution</span> conçoit la réponse à un besoin métier en assemblant plusieurs systèmes, et l'architecte d'entreprise aligne l'ensemble des systèmes sur la stratégie (l'<span class="term" data-term="enterprise-architecture">architecture d'entreprise</span>).

| Rôle | Question à laquelle il répond | Portée | Horizon | Livrable principal |
|---|---|---|---|---|
| tech lead | comment mon équipe conçoit et livre ce sujet ? | une équipe | le sprint, le trimestre | du code, des revues, le découpage du travail |
| Staff Engineer | quel problème technique transverse faut-il régler, et comment ? | plusieurs équipes | le trimestre, l'année | des prototypes, des RFC, du code sur les parties à risque |
| architecte logiciel | comment ce système est-il construit à l'intérieur ? | un système, plusieurs équipes | plusieurs mois à quelques années | le découpage, les règles, des ADR |
| architecte de solution | comment répondre à ce besoin métier précis ? | un projet, plusieurs systèmes | la durée du projet | un dossier de solution : construire ou acheter, coût, délais, contrats |
| architecte d'entreprise | de quels systèmes l'organisation a-t-elle besoin, et lesquels sont en double ? | toute l'organisation | plusieurs années | une <span class="term" data-term="capability-map">carte des capacités</span>, des règles communes |

Dans beaucoup d'entreprises, ces casquettes se recouvrent : un Staff Engineer peut tenir l'archétype « architecte » de Larson, et un architecte logiciel peut coder. En entretien, je demande ce que le poste attend vraiment. Martin Fowler (« Who Needs an Architect? », IEEE Software, 2003) reprend la formule de Ralph Johnson : l'architecture, ce sont « les choses importantes, quelles qu'elles soient ».

Le même projet, vu aux trois niveaux : une boutique en ligne veut proposer le paiement en trois fois.

``` { .text .ex-illus title="Illustration" }
entreprise  avons-nous déjà une capacité « financement du client » ailleurs, dans une autre
            activité ou un outil acheté ? sinon, est-ce une capacité à construire ou à acheter ?
solution    prestataire de paiement fractionné branché par API, ou développement interne ?
            délai, coût par transaction, crédit à la consommation encadré, dépendance au prestataire
logiciel    le prestataire choisi, comment l'intégrer dans orders-service sans que le reste du code
            dépende de son API ? un adaptateur unique, des tests de contrat, des délais d'attente
```

Le piège du métier est l'<span class="term" data-term="ivory-tower-architect">architecte en tour d'ivoire</span> : il dessine des schémas sans voir le code ni les contraintes des équipes, ses décisions arrivent inapplicables et les équipes les contournent. Gregor Hohpe (« The Software Architect Elevator », 2020) propose l'image inverse : l'architecte prend l'ascenseur entre la direction (le dernier étage, où se décident la stratégie et le budget) et la salle des machines (le code), et il est utile parce qu'il s'arrête aux deux bouts.

**Risques.** un architecte qui décide seul retire la conception aux tech leads, qui cessent de réfléchir ou contournent ses règles : je décide avec eux, j'écris la décision dans un ADR et je laisse la conception locale aux équipes. Un architecte d'entreprise sans architecte logiciel derrière produit une cible qui reste un schéma. Confondre les rôles en recrutement donne un « architecte » qui attend des équipes à diriger, ou un Staff qui attend un domaine à dessiner : je fais écrire ce dont le poste répond.

:material-book-open-variant: Doc de référence : [Martin Fowler, Who Needs an Architect?](https://martinfowler.com/ieeeSoftware/whoNeedsArchitect.pdf) (IEEE Software, 2003) ; [Gregor Hohpe, The Architect Elevator](https://architectelevator.com/) (consultée en novembre 2026)
{ .doc-ref }

### Les 90 premiers jours dans un nouveau rôle

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

J'arrive comme Staff Engineer sur une plateforme de paiement. Dès la première semaine, trois équipes me demandent de l'aide, chacune sur un sujet différent, et j'ai envie de proposer tout de suite la refonte de la CI que j'ai faite ailleurs. Michael Watkins (« The First 90 Days », 2003, édition augmentée en 2013) montre que les premiers mois décident de la suite : je dois comprendre avant d'agir, et obtenir tôt une <span class="term" data-term="quick-win">victoire rapide</span> pour gagner la confiance qui me permettra de porter les chantiers longs.

Son modèle **STARS** rappelle que la bonne stratégie dépend de la situation trouvée en arrivant :

| Situation (STARS) | Ce que je trouve | Ce que je fais d'abord |
|---|---|---|
| démarrage (start-up) | une équipe ou un produit à construire | poser les bases : outils, règles, premiers recrutements |
| redressement (turnaround) | un système en crise, comme des pannes chaque semaine | décider vite, stabiliser, couper ce qui ne sert pas |
| croissance accélérée (accelerated growth) | une équipe qui double en un an | écrire les pratiques pour que les nouveaux les suivent |
| réalignement (realignment) | une situation qui se dégrade sans que personne ne le voie | rendre le problème visible, chiffres à l'appui |
| maintien du succès (sustaining success) | une équipe qui marche bien | ne rien casser, comprendre pourquoi ça marche avant de changer |

Je découpe les trois mois en trois phases, chacune avec un livrable :

| Période | Objectif | Livrable | Victoire visible |
|---|---|---|---|
| jours 1 à 30 | comprendre : entretiens avec les mêmes questions pour tous (« qu'est-ce qui te ralentit le plus ? », « qu'est-ce qu'il ne faut surtout pas casser ? »), lecture des derniers postmortems | un diagnostic court, envoyé aux équipes avec la question « qu'est-ce que j'ai mal compris ? » | un tableau de bord des tests instables par équipe |
| jours 31 à 60 | prouver : un ou deux problèmes transverses, une mesure de départ, une expérience avec une <span class="term" data-term="pilot-team">équipe pilote</span> | un plan priorisé, avec hypothèses et responsables | le test instable qui bloque un pipeline sur cinq est stabilisé |
| jours 61 à 90 | donner une direction : résultats comparés à la mesure de départ | une feuille de route sur six mois, validée par les tech leads | premier ADR accepté sur le sujet prioritaire |

Pour les demandes qui arrivent dès la première semaine, je ne dis pas oui à chacune : je les note toutes dans une même liste, je les regroupe par thème, et je réponds « c'est noté, je reviens vers toi après le diagnostic ». Souvent, trois demandes différentes sont le même problème vu de trois équipes.

À éviter : arriver avec la solution. La refonte proposée en semaine deux ne répond pas aux vrais problèmes, et les équipes retiennent que je n'écoute pas.

``` { .text .ex-bad title="À éviter" }
semaine 1   je dis oui aux trois demandes reçues, une par équipe
semaine 2   je propose de réécrire toute la CI comme dans mon ancien poste
semaine 6   les trois demandes sont à moitié faites, la refonte est rejetée
```

Bien : comprendre, prouver sur un petit périmètre, puis proposer.

``` { .text .ex-good title="Recommandé" }
semaine 1   je note les trois demandes dans une liste commune et je les regroupe : deux parlent des tests instables
semaine 4   diagnostic relu par les équipes, tableau de bord des tests instables publié
semaine 8   l'équipe pilote stabilise ses tests, échecs au hasard divisés par deux (exemple)
semaine 12  feuille de route validée par les tech leads, aucune refonte lancée avant le jour 60
```

**Risques.** trop écouter fait passer trois mois sans rien livrer, et l'on me croit inutile : la victoire rapide du premier mois sert justement à montrer que j'agis. Une victoire rapide mal choisie (un outil que personne n'a demandé) produit l'effet inverse : je la prends dans ce que les équipes m'ont dit pendant les entretiens. Enfin, se tromper de situation STARS est coûteux : appliquer un redressement à une équipe qui marche casse ce qui fonctionnait.

| Je veux... | J'utilise... |
|---|---|
| savoir par où commencer en arrivant sur un poste où tout le monde me demande déjà de l'aide | la liste unique des demandes, regroupées par thème, et des entretiens avec les mêmes questions |
| choisir ma stratégie selon l'état de l'équipe, en crise ou au contraire en pleine réussite | le modèle STARS de Watkins |
| gagner la confiance des équipes avant de porter un chantier de plusieurs mois | une victoire rapide prise dans ce qu'elles m'ont dit, puis une équipe pilote |

:material-book-open-variant: Doc de référence : [Genesis Advisers, The First 90 Days](https://www.genesisadvisers.com/the-first-90-days) (consultée en novembre 2026) ; [Wikipédia, Michael D. Watkins](https://en.wikipedia.org/wiki/Michael_D._Watkins) (consultée en novembre 2026)
{ .doc-ref }

### Répartir son temps et montrer son impact

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Comme Staff Engineer, on m'appelle en réunion, sur un incident, sur une revue de conception. Si la livraison du 15 dépend du code que je dois écrire, une seule journée prise par une urgence ailleurs retarde toute l'équipe. Je garde donc mes tâches de code hors du <span class="term" data-term="critical-path">chemin critique</span> des équipes, un conseil que l'on retrouve chez Will Larson (« Staff Engineer », 2021) : je code ce qui n'est pas urgent pour une équipe mais aide plusieurs équipes (un prototype qui tranche une question d'architecture, un outil interne, une correction partagée), et je relis ou j'accompagne ce qui est sur le chemin critique.

| Tâche | Une livraison en dépend ? | Qui la code |
|---|---|---|
| l'endpoint `POST /refunds` attendu pour la livraison du 15 | oui | l'équipe A ; je relis la conception et la MR |
| le correctif qui bloque la mise en production | oui | un développeur de l'équipe B, en binôme avec moi |
| le script de migration des anciennes factures | non | moi |
| l'outil interne qui génère des données de test | non | moi |

Deux autres textes aident à répartir ce temps. Tanya Reilly (« Being Glue », 2019) nomme le <span class="term" data-term="glue-work">travail de liaison</span> : animer les réunions, relancer les dépendances, accueillir les nouveaux, tenir la documentation. Il est indispensable, mais invisible dans les promotions s'il n'est ni choisi ni reconnu : je le fais exprès, je le dis à mon manager, et je ne le laisse pas manger tout mon temps. Paul Graham (« Maker's schedule, manager's schedule », 2009) explique qu'une seule réunion au milieu d'un après-midi casse une demi-journée de code : je regroupe mes réunions et je protège des plages longues, selon l'<span class="term" data-term="makers-schedule">emploi du temps du créateur</span>. Une répartition d'exemple : 40 % conception et revues, 30 % code hors chemin critique, 30 % accompagnement, à ajuster chaque trimestre avec mon manager.

Montrer l'<span class="term" data-term="staff-impact">impact Staff</span> demande ensuite un récit en quatre temps : la **base** (la situation chiffrée avant), la **décision** (ce que j'ai proposé et fait accepter), l'**adoption** (combien d'équipes l'utilisent sans moi), le **<span class="term" data-term="measured-result">résultat mesuré</span>** (le même chiffre après), en séparant ce qui est mesuré de ce qui est seulement espéré.

À éviter : compter son activité. Le recruteur ou le comité de promotion ne peut rien en conclure sur l'effet produit.

``` { .text .ex-bad title="À éviter" }
cette année, j'ai écrit 40 000 lignes de code, animé 30 réunions et rédigé 12 documents
```

Bien : la même année, racontée comme un effet sur plusieurs équipes.

``` { .text .ex-good title="Recommandé" }
base       30 % des pipelines de 6 équipes échouaient pour des raisons sans lien avec le code
décision   RFC relue par les 6 tech leads : une bibliothèque commune de données de test
adoption   5 équipes sur 6 l'utilisent, maintenue par deux relais sans moi
résultat   30 % d'échecs devenus 4 % en 4 mois, lus dans le tableau de bord de la CI
(chiffres d'exemple : je cite les miens)
```

Pour ne pas oublier ces chiffres le jour de l'entretien annuel, je tiens un <span class="term" data-term="brag-document">document de réalisations</span> (brag document, Julia Evans, 2019) : chaque mois, j'y note ce que j'ai fait, pour qui, et le chiffre qui le prouve, travail de liaison compris.

**Risques.** rester trop loin du code me fait perdre la crédibilité et la compréhension des vraies difficultés : je garde une part de code, même petite. À l'inverse, prendre les tâches du chemin critique « parce que je vais plus vite » fait de moi un goulot et prive l'équipe d'apprentissage. Un brag document qui ne liste que des activités reproduit le mauvais exemple ci-dessus : chaque ligne finit par un effet.

:material-book-open-variant: Doc de référence : [Tanya Reilly, Being Glue](https://noidea.dog/glue) (2019) ; [Paul Graham, Maker's Schedule, Manager's Schedule](https://paulgraham.com/makersschedule.html) (2009) ; [Julia Evans, Get your work recognized: write a brag document](https://jvns.ca/blog/brag-documents/) (2019)
{ .doc-ref }

### Raconter une expérience avec la méthode STAR

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

« Raconte une erreur que tu as faite », « parle-moi d'un désaccord » : ce sont des <span class="term" data-term="behavioral-question">questions comportementales</span>. Le recruteur part de ce que j'ai réellement fait pour prédire ce que je ferai. La <span class="term" data-term="star-method">méthode STAR</span> (technique d'entretien attribuée à la société DDI, années 1970, à vérifier) structure la réponse en quatre temps : la **Situation** en deux phrases, la **Tâche** qui m'incombait, l'**Action** que j'ai menée, le **Résultat** obtenu, chiffré si possible.

Les règles qui font la différence :

- je dis « j'ai », pas « on a » : le recruteur veut savoir ce que j'ai fait, moi ;
- je passe peu de temps sur la situation, l'essentiel sur l'action et le résultat ;
- je finis sur ce qui a changé ensuite, pour moi et pour l'équipe ;
- je tiens en deux minutes, et je prépare quatre ou cinq histoires vraies (une erreur, un désaccord, un impact, une influence) qui servent pour la plupart des questions.

À éviter : une réponse floue, collective, sans résultat. Le recruteur ne sait ni ce que j'ai fait, ni si j'ai appris quelque chose.

``` { .text .ex-bad title="À éviter" }
« Une fois, on a eu un souci avec un script en production. C'était compliqué,
  mais on a réussi à corriger. Depuis, on fait plus attention. »
```

Bien : une vraie erreur, racontée avec STAR, qui finit sur un changement durable.

``` { .text .ex-good title="Recommandé" }
Situation  40 commandes d'un client étaient bloquées après un bug.
Tâche      je devais corriger leur statut en production.
Action     j'ai lancé un script SQL testé sur une base presque vide ; une parenthèse mal
           placée dans le WHERE a modifié 12 000 commandes. J'ai vu le nombre de lignes,
           prévenu l'équipe tout de suite, et nous avons restauré les statuts en une heure.
Résultat   depuis, tout script de production tourne dans une transaction, avec un comptage
           avant de valider ; j'ai proposé ce modèle à l'équipe, qui l'a adopté.
(chiffres d'exemple : je raconte ma propre histoire)
```

À la question « quel est ton plus grand défaut ? », le faux défaut (« je suis trop perfectionniste ») échoue : il esquive la question, le recruteur l'a entendu cent fois, et il conclut que je ne sais pas reconnaître mes faiblesses. Je donne un vrai défaut, sans gravité pour le poste, et ce que je fais concrètement pour le compenser : « j'ai tendance à dire oui à toutes les demandes ; je les note maintenant dans une liste et je les priorise avec mon manager chaque semaine ».

**Risques.** une histoire inventée ou trop répétée se voit aux questions de relance (« qu'aurais-tu fait autrement ? ») : je ne raconte que du vécu, et si je n'ai pas vécu la situation, je le dis et je présente mon raisonnement comme une hypothèse. Une erreur choisie trop grave pour le poste inquiète au lieu de rassurer : je choisis un impact réel mais maîtrisé.

| Je veux... | J'utilise... |
|---|---|
| répondre à « raconte une erreur » ou « parle-moi d'un désaccord » sans m'égarer dans le contexte | la méthode STAR, en deux minutes, en disant « je » |
| prouver un impact au-delà de mon équipe, devant un comité de promotion ou un recruteur | base, décision, adoption, résultat mesuré, nourris par mon brag document |
| répondre à « quel est ton plus grand défaut ? » sans sonner faux | un vrai défaut, sans gravité pour le poste, et ce que je fais pour le compenser |

:material-book-open-variant: Doc de référence : [Wikipédia, Situation, task, action, result](https://en.wikipedia.org/wiki/Situation,_task,_action,_result) (consultée en novembre 2026)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | les évolutions de carrière se discutent au cas par cas, et « monter » veut dire devenir manager |
    | N2 | les deux filières sont écrites, avec des niveaux et des attentes par niveau, et les archétypes staff servent à décrire les rôles |
    | N3 | les promotions se décident sur des critères écrits, dans un comité, et un ingénieur peut passer de l'expertise au management et revenir sans perte |
    | N4 | l'entreprise suit les promotions et les départs par filière, et corrige la filière qui perd ses gens ou ne promeut personne |

    **Je mesure** : le nombre de promotions par an sur chaque filière, lu dans les données RH ; le taux de départ des ingénieurs seniors et la raison donnée en entretien de sortie.

## Mesurer le succès

Je sais que ces cadres marchent quand un comportement ou un délai change, pas quand ils sont affichés au mur. Avant de lancer une pratique (limites de WIP, postmortems, OKR), je note une base : par exemple le délai médian d'un ticket sur les trois derniers mois. Je reprends la même mesure un à deux trimestres plus tard. La métrique garde-fou dépend du cadre : le taux d'échec des changements pour la vitesse de livraison, la satisfaction de l'équipe pour une réorganisation, la contre-mesure de chaque OKR.

| Solution ou situation | Indicateur de succès (SLI) | SLO probable | SLA probable |
|---|---|---|---|
| postmortems sans recherche de coupable | part des actions de postmortem faites à la date prévue | au moins 80 % des actions faites à temps ; en dessous, les postmortems deviennent des promesses | sans objet : pas de contrat externe |
| sécurité psychologique | score moyen d'une enquête anonyme sur 5 | au moins 4 sur 5, et aucune équipe en baisse deux semestres de suite | sans objet : pas de contrat externe |
| limites de WIP et flux | délai médian entre le début d'un ticket et sa mise en production | moins de 5 jours ouvrés pour un ticket standard | sans objet : pas de contrat externe |
| organisation des équipes (Team Topologies, InnerSource) | délai médian de relecture d'une MR venue d'une autre équipe | 2 jours ouvrés, le délai promis dans le `CONTRIBUTING.md` | sans objet : pas de contrat externe |
| OKR | part des résultats clés engagés atteints en fin de trimestre | au moins 90 % pour les engagés ; 60 à 70 % pour les ambitieux, d'après Doerr | sans objet : pas de contrat externe |
| décisions par RFC et ADR | délai entre l'ouverture d'une RFC et la décision écrite | moins de 3 semaines pour une décision de type 1 | sans objet : pas de contrat externe |
| estimation en fourchettes | part des tranches livrées dans leur fourchette | au moins 70 % ; plus haut, les fourchettes sont sans doute trop larges pour aider à planifier | sans objet : pas de contrat externe |
| one-pager devant la direction | part des demandes qui obtiennent une décision dès la première réunion | au moins 2 demandes sur 3 | sans objet : pas de contrat externe |

[À prendre avec précaution : ordres de grandeur d'exemple, à fixer avec le métier]

!!! noob "As noob"
    Le SLO, c'est l'objectif que l'équipe se fixe, comme un restaurant qui vise de servir chaque plat en moins de 15 minutes ; le SLA, c'est ce qu'il promet par écrit au client, avec un geste commercial si la promesse n'est pas tenue, par exemple 30 minutes. Le restaurant vise plus serré qu'il ne promet, pour garder de la marge. La phrase à retenir : **le SLO est la cible interne, le SLA l'engagement contractuel plus lâche ; une pratique d'équipe n'a qu'un SLO.**

## Pièges à éviter

| Piège | Ce qui se passe | Solution |
| --- | --- | --- |
| **Copier le modèle Spotify** : je renomme mes équipes en squads et en tribes parce que le schéma a l'air de marcher ailleurs. | Rien ne change, ni l'autonomie, ni l'architecture, ni la culture. | Je garde l'idée (autonomie, communautés) et je découpe les équipes d'après leur charge cognitive et leurs flux ([Le modèle Spotify](#le-modele-spotify-et-ses-limites)). |
| **Deux A dans une ligne de RACI** : je mets deux personnes « accountable » sur la migration de la base. | Chacune croit que l'autre tranche, et la décision n'est jamais prise. | Je garde un seul A par ligne ([RACI](#raci)). |
| **Un résultat clé qui est une tâche** : j'écris « migrer les runners vers des machines plus grosses » comme résultat clé. | Je coche la tâche sans savoir si la CI est devenue plus rapide. | J'écris des résultats chiffrés et vérifiables, et je dis si l'OKR est engagé ou ambitieux ([OKR](#okr)). |
| **Un objectif sans contre-mesure** : je fixe un temps de traitement des tickets support à faire baisser. | L'équipe ferme des tickets sans les résoudre. | J'associe à chaque objectif une contre-mesure qui se dégrade si on triche, comme le taux de tickets rouverts ([Goodhart](#eviter-le-piege-de-goodhart)). |
| **Le processus lourd pour tout** : j'applique à chaque choix de bibliothèque la prudence d'une porte à sens unique. | Toute l'organisation ralentit. | Je classe d'abord la décision en type 1 ou type 2, et je décide vite les décisions réversibles ([Type 1 et type 2](#decisions-de-type-1-et-de-type-2)). |
| **Accélérer hors du goulot** : j'optimise une étape qui n'est pas la contrainte, comme le build, alors que la recette manuelle bloque tout. | Le débit ne bouge pas. | J'identifie la contrainte avant d'investir ([La théorie des contraintes](#theorie-des-contraintes)). |
| **Trop de travail en cours** : mon équipe commence vingt tickets à la fois pour « avancer sur tout ». | Chaque ticket met en moyenne quatre semaines à sortir. | Je pose une limite de WIP et je termine avant de commencer ([La loi de Little](#loi-de-little-et-limites-de-wip)). |
| **Un argument technique brut devant la direction** : je défends une refonte en parlant de versions de bibliothèque. | Ça passe pour un caprice d'ingénieur et c'est refusé. | Je traduis en argent, délais, risques ou clients, avec le coût de l'option « ne rien faire » ([Le compromis en termes métier](#presenter-un-compromis-technique-en-termes-metier)). |

## Ce qu'on demande en entretien

Les questions typiques :

- « Comment reconnais-tu une culture d'équipe saine ? », « Qu'est-ce que la sécurité psychologique, et comment la favorises-tu ? » Pour répondre : je cite la typologie de Westrum et des signes concrets (les juniors commentent les MR des seniors, « je ne sais pas » est accepté), et je précise que ce n'est pas de la gentillesse sans exigence ([Typologie de Westrum](#typologie-de-westrum), [Sécurité psychologique](#securite-psychologique)).
- « Comment organiserais-tu les équipes autour d'une plateforme ? », « Que penses-tu du modèle Spotify ? » Pour répondre : je découpe d'après la charge cognitive avec Team Topologies, et je rappelle que l'article Spotify décrivait un instantané, pas un modèle à copier ([Team Topologies](#team-topologies), [Le modèle Spotify](#le-modele-spotify-et-ses-limites)).
- « Quelle différence entre un KPI et un OKR ? », « Comment évites-tu qu'un indicateur soit gonflé artificiellement ? » Pour répondre : je présente le KPI comme un thermomètre permanent et l'OKR comme un changement voulu sur une période, et je donne à chaque objectif sa contre-mesure ([KPI ou OKR](#kpi-ou-okr), [Goodhart](#eviter-le-piege-de-goodhart)).
- « Comment prends-tu une décision technique importante en équipe ? », « Que fais-tu quand tu n'es pas d'accord avec une décision ? » Pour répondre : je classe la décision en type 1 ou type 2, je passe par une RFC pour les décisions lourdes, et j'écris mon objection avant de m'engager ([Type 1 et type 2](#decisions-de-type-1-et-de-type-2), [RFC](#rfc-et-documents-de-conception), [Désaccord et engagement](#desaccord-et-engagement)).
- « Parle-moi d'un désaccord avec un collègue », « Raconte un échec » Pour répondre : je raconte une histoire vécue avec la méthode STAR (la situation, la tâche qui m'incombait, l'action que j'ai menée, le résultat obtenu), puis ce que j'en ai appris et ce que je fais autrement depuis ([Désaccord et engagement](#desaccord-et-engagement), [La méthode STAR](#raconter-une-experience-avec-la-methode-star)).
- « Notre équipe livre lentement, comment trouves-tu pourquoi ? » Pour répondre : je cartographie le flux de valeur pour voir où le travail attend, je cherche la contrainte, puis je limite le travail en cours ([Cartographie du flux de valeur](#cartographie-du-flux-de-valeur), [Loi de Little](#loi-de-little-et-limites-de-wip)).
- « Comment convaincs-tu ta direction de financer une refonte ? » Pour répondre : je donne la conclusion d'abord, le coût du retard, l'option « ne rien faire » et le type de décision ([Compromis en termes métier](#presenter-un-compromis-technique-en-termes-metier), [Coût du retard](#cout-du-retard)).
- « Comment estimes-tu et découpes-tu une fonctionnalité ? », « Une équipe bloque sur ta bibliothèque partagée, que fais-tu ? » Pour répondre : des questions avant le chiffre, des tranches verticales, des fourchettes, un spike, l'Example Mapping ; puis l'InnerSource avec un `CONTRIBUTING.md` et un délai de relecture tenu ([Estimer et découper](#estimer-et-decouper-une-fonctionnalite), [InnerSource](#innersource)).
- « Comment sais-tu qu'une pratique d'équipe, comme les limites de WIP ou les postmortems, a vraiment marché ? » Pour répondre : je donne une base avant, la même mesure un trimestre après, une métrique garde-fou, et une cible interne (un SLO) plutôt qu'une promesse contractuelle ([Mesurer le succès](#mesurer-le-succes)).
- « Comment fais-tu adopter un standard par des équipes qui ne dépendent pas de toi ? » Pour répondre : je cherche ce que chaque équipe y gagne, je prouve avec une équipe volontaire en mode non bloquant, je prépare la RFC en tête à tête (nemawashi), puis je m'appuie sur une communauté de pratique et je mesure l'adoption ([Influence sans autorité](#influence-sans-autorite-et-communautes-de-pratique)).
- « Faut-il éviter l'enfermement chez un fournisseur cloud ? » Pour répondre : je le traite comme un coût, probabilité de partir × coût de bascule, comparé au coût immédiat de la portabilité, et je réserve l'effort aux composants où la sortie est probable ([L'enfermement, un coût à chiffrer](#lenfermement-chez-un-fournisseur-un-cout-a-chiffrer)).
- « Qu'est-ce qui distingue un architecte d'un tech lead ou d'un Staff Engineer ? », « Architecte logiciel, de solution, d'entreprise : quelles différences ? » Pour répondre : je compare ce dont chacun répond, sa portée et son horizon, puis je montre un même projet vu aux trois niveaux ([Les trois architectes](#architecte-logiciel-de-solution-dentreprise)).
- « Que ferais-tu pendant tes trois premiers mois ? » Pour répondre : comprendre, prouver, donner une direction, chaque phase avec un livrable, une victoire rapide visible dès le premier mois, et les demandes reçues regroupées plutôt qu'acceptées une à une ([Les 90 premiers jours](#les-90-premiers-jours-dans-un-nouveau-role)).
- « Comment répartis-tu ton temps entre code, conception et accompagnement ? », « Comment démontres-tu ton impact au niveau Staff ? » Pour répondre : je code hors du chemin critique des équipes, je choisis mon travail de liaison, puis je raconte l'impact en base, décision, adoption et résultat mesuré ([Répartir son temps](#repartir-son-temps-et-montrer-son-impact)).
- « Quel est ton plus grand défaut ? » Pour répondre : un vrai défaut, sans gravité pour le poste, et ce que je fais pour le compenser, jamais « je suis trop perfectionniste » ([La méthode STAR](#raconter-une-experience-avec-la-methode-star)).


Ce qui fait une bonne réponse : nommer le cadre, l'illustrer par une situation vécue ou réaliste, puis dire sa limite, comme le modèle Spotify copié sans son contexte.

Les questions par métier, avec des réponses plus détaillées et des exercices corrigés : [Staff Engineer](../entretiens/staff-engineer/questions.md), [DevX Engineer](../entretiens/devx-engineer/questions.md), [Software Engineer](../entretiens/software-engineer/questions.md), [Software Architect](../entretiens/software-architect/questions.md).

## Quoi utiliser dans quelle situation

| Situation | J'utilise |
|---|---|
| dans mon équipe, personne n'ose annoncer une mauvaise nouvelle, comme une sauvegarde qui ne marche plus depuis deux semaines | typologie de Westrum, sécurité psychologique, culture juste |
| mes équipes passent leur temps à s'attendre : une fonction ne sort pas tant qu'une autre équipe n'a pas fait sa part | Team Topologies, puis la loi de Conway pour l'architecture |
| personne ne sait qui tranche, et deux personnes croient chacune que c'est l'autre | une matrice RACI ou l'advice process |
| je dois donner une direction à l'équipe pour le prochain trimestre | des OKR, avec une contre-mesure par résultat clé |
| je dois décider vite et j'hésite à lancer un long circuit de validation | type 1 ou type 2 : réversible, on décide vite |
| personne ne connaît la solution à l'avance, comme savoir si les clients veulent payer en plusieurs fois | Cynefin domaine complexe : des expériences courtes |
| une demande de quelques jours de travail met des semaines à arriver en production | cartographie du flux de valeur, limites de WIP |
| des fonctions livrées ne servent à personne, comme un export PDF que personne n'ouvre | discovery, Jobs to be done |
| j'hésite entre développer une brique et l'acheter, comme la paie ou la supervision | construire ce qui différencie, TCO sur 3 ans pour le reste |
| la direction doit choisir entre plusieurs sujets qui se disent tous urgents | coût du retard divisé par la durée |
| je dois présenter un chantier technique au comité de direction et repartir avec une décision | pyramide de Minto, one-pager, registre des risques |
| on me présente un plan stratégique fait de slogans, sans diagnostic ni action concrète | le noyau de Rumelt : diagnostic, politique, actions |
| le product owner veut une date pour une fonctionnalité de plusieurs semaines, et personne ne sait encore comment fusionner deux paniers | tranches verticales, fourchettes, spike, Example Mapping |
| plusieurs équipes dépendent de la bibliothèque d'une seule équipe, qui n'arrive plus à suivre les demandes | InnerSource, trusted committers |
| une équipe veut tout héberger elle-même « pour ne pas être enfermée » chez son fournisseur cloud | probabilité de partir × coût de bascule, comparé au TCO de l'option portable |
| j'arrive sur un nouveau poste et trois équipes me demandent de l'aide dès la première semaine | les 90 premiers jours : comprendre, prouver, donner une direction |

## Sources

- [Ron Westrum, « A typology of organisation culture », Quality and Safety in Health Care (2004)](https://qualitysafety.bmj.com/content/13/suppl_2/ii22)
- [Amy Edmondson, « Psychological Safety and Learning Behavior in Work Teams », Administrative Science Quarterly (1999)](https://doi.org/10.2307/2666999)
- [Google re:Work, « Guide: Understand team effectiveness » (2015, à vérifier)](https://rework.withgoogle.com/print/guides/5721312655835136/)
- James Reason, « Managing the Risks of Organizational Accidents » (1997)
- Sidney Dekker, « Just Culture » (2007)
- Peter Senge, « The Fifth Discipline » (1990)
- Nicole Forsgren, Jez Humble et Gene Kim, « Accelerate » (2018)
- Matthew Skelton et Manuel Pais, « Team Topologies » (2019)
- [InnerSource Commons (communauté fondée en 2015)](https://innersourcecommons.org/)
- [Henrik Kniberg et Anders Ivarsson, « Scaling Agile @ Spotify » (2012)](https://blog.crisp.se/wp-content/uploads/2012/11/SpotifyScaling.pdf)
- [Jeremiah Lee, « Spotify's Failed #SquadGoals » (2020)](https://www.jeremiahlee.com/posts/failed-squad-goals/)
- Andy Grove, « High Output Management » (1983)
- John Doerr, « Measure What Matters » (2018)
- [Jeff Bezos, lettre aux actionnaires (2015, publiée en 2016)](https://s2.q4cdn.com/299287126/files/doc_financials/annual/2015-Letter-to-Shareholders.PDF)
- [Jeff Bezos, lettre aux actionnaires (2016, publiée en 2017)](https://www.aboutamazon.com/news/company-news/2016-letter-to-shareholders)
- [Dave Snowden et Mary Boone, « A Leader's Framework for Decision Making », Harvard Business Review (2007)](https://hbr.org/2007/11/a-leaders-framework-for-decision-making)
- [Steve Crocker, RFC 1, « Host Software » (1969)](https://www.rfc-editor.org/rfc/rfc1)
- Dennis Bakke, « Joy at Work » (2005)
- Frederic Laloux, « Reinventing Organizations » (2014)
- [Andrew Harmel-Law, « Scaling the Practice of Architecture, Conversationally » (2021)](https://martinfowler.com/articles/scaling-architecture-conversationally.html)
- Taiichi Ohno, « Toyota Production System: Beyond Large-Scale Production » (1978, traduction anglaise de 1988)
- James Womack et Daniel Jones, « Lean Thinking » (1996)
- Mary et Tom Poppendieck, « Lean Software Development: An Agile Toolkit » (2003)
- Mike Rother et John Shook, « Learning to See » (1998)
- Eliyahu Goldratt, « The Goal » (1984)
- John Little, « A Proof for the Queuing Formula: L = λW », Operations Research (1961)
- David J. Anderson, « Kanban: Successful Evolutionary Change for Your Technology Business » (2010)
- Mik Kersten, « Project to Product » (2018)
- Clayton Christensen, Taddy Hall, Karen Dillon et David Duncan, « Competing Against Luck » (2016)
- Bill Wake, « INVEST in Good Stories, and SMART Tasks » (2003)
- [Matt Wynne, « Introducing Example Mapping » (2015)](https://cucumber.io/blog/bdd/example-mapping-introduction/)
- Steve McConnell, « Software Estimation: Demystifying the Black Art » (2006)
- Marty Cagan, « Inspired » (2008, deuxième édition 2017)
- Teresa Torres, « Continuous Discovery Habits » (2021)
- [Ryan Singer, « Shape Up » (2019)](https://basecamp.com/shapeup)
- [Simon Wardley, « Wardley Maps » (chapitres publiés en ligne à partir de 2016, à vérifier)](https://medium.com/wardleymaps)
- Richard Rumelt, « Good Strategy Bad Strategy » (2011)
- Clayton Christensen, « The Innovator's Dilemma » (1997)
- Donald Reinertsen, « The Principles of Product Development Flow » (2009)
- Barbara Minto, « The Pyramid Principle » (édition de 1987, à vérifier)
- Gregor Hohpe, « The Software Architect Elevator » (2020)
- Camille Fournier, « The Manager's Path » (2017)
- [Charity Majors, « The Engineer/Manager Pendulum » (2017)](https://charity.wtf/2017/05/11/the-engineer-manager-pendulum/)
- [Will Larson, « Staff Engineer: Leadership beyond the management track » (2021)](https://staffeng.com/book)
- Tanya Reilly, « The Staff Engineer's Path » (2022)
- Allan Cohen et David Bradford, « Influence Without Authority » (1990)
- Everett Rogers, « Diffusion of Innovations » (1962)
- Jean Lave et Etienne Wenger, « Situated Learning: Legitimate Peripheral Participation » (1991)
- [Gregor Hohpe, « Don't get locked up into avoiding lock-in », martinfowler.com (2019)](https://martinfowler.com/articles/oss-lockin.html)
- [Martin Fowler, « Who Needs an Architect? », IEEE Software (2003)](https://martinfowler.com/ieeeSoftware/whoNeedsArchitect.pdf)
- Michael Watkins, « The First 90 Days » (2003, édition augmentée en 2013)
- [Tanya Reilly, « Being Glue » (2019)](https://noidea.dog/glue)
- [Paul Graham, « Maker's Schedule, Manager's Schedule » (2009)](https://paulgraham.com/makersschedule.html)
- [Julia Evans, « Get your work recognized: write a brag document » (2019)](https://jvns.ca/blog/brag-documents/)
