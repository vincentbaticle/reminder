# Incidents et incidentologie

!!! warning "Avertissement"
    Ces notes sont des pense-bêtes personnels, pas une source de vérité. Elles reflètent ma compréhension et mes choix : leur contenu reste subjectif, malgré les citations et les références qu'il contient. Il peut être incomplet, simplifié, inexact ou dépassé. Vérifiez toujours dans la documentation officielle avant de l'appliquer. Ce contenu est fourni tel quel, sans aucune garantie : son utilisation se fait sous votre seule responsabilité.

!!! abstract "Les échelles"
    Les pastilles de couleur sous les titres disent à quelle échelle une notion s'applique :

    - <span class="pill pill-scope pill-scope-code">Code</span> les classes, fonctions et modules d'un programme ;
    - <span class="pill pill-scope pill-scope-app">Application</span> un service ou une application et son découpage interne ;
    - <span class="pill pill-scope pill-scope-system">Système</span> plusieurs services qui communiquent par le réseau ;
    - <span class="pill pill-scope pill-scope-infra">Infrastructure</span> les serveurs, le réseau, les zones et les clusters, physiques ou virtuels ;
    - <span class="pill pill-scope pill-scope-enterprise">Entreprise</span> le système d'information entier et son organisation.

    Détail et mots ambigus : [carte des échelles](architecture.md#carte-des-echelles).

Les clients ne peuvent plus payer sur mon site depuis dix minutes : c'est un incident. Un <span class="term" data-term="incident">incident</span>, c'est le moment où un service réel ne rend plus le service attendu. Cette page couvre deux choses : comment le traverser (détecter, coordonner, communiquer, rétablir) et comment en tirer quelque chose (analyser, suivre les actions, apprendre d'un incident à l'autre). Elle finit par la santé de l'<span class="term" data-term="on-call">astreinte</span> et par les exercices qui préparent au prochain.

Le mot « incidentologie » est surtout employé en français. En anglais, on parle d'*incident management* (la gestion pendant l'incident), d'*incident analysis* (l'analyse après coup) ou de *learning from incidents* (le courant qui traite les incidents comme une source d'apprentissage).

Les <span class="term" data-term="alert-monitoring">alertes</span>, les <span class="term" data-term="slo">SLO</span> et le <span class="term" data-term="error-budget">budget d'erreur</span> sont expliqués dans la page [Observabilité](observabilite.md#objectifs-et-alertes) : cette page s'appuie dessus sans les redéfinir. Les services `orders-service`, `payments-service` et `my-api`, les personnes ada, grace, alan et linus, et tous les chiffres sont des exemples.

:material-swap-horizontal: Les outils cités dans cette page : lesquels se remplacent, lesquels se combinent ? Voir [Complémentaires ou concurrents](outils.md#complementaires-ou-concurrents).
{ .doc-ref }

## Vocabulaire

**Incident** : interruption ou dégradation d'un service utilisé par de vrais utilisateurs, qui demande une réponse rapide. Un bug connu, sans impact en cours, n'est pas un incident : c'est un ticket.

**Sévérité** : le <span class="term" data-term="incident-severity">niveau de gravité</span> d'un incident (SEV1, SEV2...), décidé par des critères écrits à l'avance. Elle dit qui est appelé et à quelle cadence on communique. À ne pas confondre avec la gravité d'un bug, qui juge un défaut, pas une situation en cours.

**Astreinte** (*on-call*) : la personne de garde doit pouvoir répondre à une alerte à toute heure, pendant une période donnée, souvent une semaine.

**Atténuation** (*mitigation*) : l'action rapide qui réduit l'impact avant de comprendre la cause : <span class="term" data-term="rollback">retour à la version précédente</span>, coupure d'une fonctionnalité par <span class="term" data-term="feature-flag">feature flag</span>, bascule vers une autre zone.

**MTTD, MTTA, MTTR** : trois durées moyennes mesurées sur une série d'incidents.

```
14:00  début réel du problème
14:12  une alerte sonne                 MTTD : 12 min (Mean Time To Detect, détecter)
14:15  l'astreinte prend l'alerte       MTTA : 3 min  (Mean Time To Acknowledge, accuser réception)
14:40  le service est rétabli           MTTR : 40 min (Mean Time To Restore, rétablir)
```

Le <span class="term" data-term="mttd">MTTD</span> se compte depuis le début réel, le <span class="term" data-term="mtta">MTTA</span> depuis l'alerte. Le R de <span class="term" data-term="mttr">MTTR</span> a plusieurs lectures selon les sources (restore, recover, repair, resolve) : toujours écrire laquelle on mesure.

**Postmortem** : le <span class="term" data-term="postmortem">document écrit après un incident</span>, qui raconte ce qui s'est passé, pourquoi c'était possible, et ce qu'on change. On écrit aussi « post-mortem » ou on parle de « revue d'incident ».

**Facteur contributif** : une <span class="term" data-term="contributing-factor">condition</span> qui a rendu l'incident possible ou plus grave, sans en être la seule cause. Exemple : « pas d'alerte sur l'âge des messages » n'a pas causé la panne, mais l'a fait durer 30 minutes de plus.

**Quasi-incident** (*near miss*) : un <span class="term" data-term="near-miss">événement</span> qui aurait pu provoquer un incident, sans impact, par chance ou grâce à quelqu'un. Exemple : une migration qui aurait verrouillé la table des commandes, arrêtée en préproduction parce qu'ada a remarqué sa durée.

:material-book-open-variant: Doc de référence : [Atlassian, Common incident management metrics](https://www.atlassian.com/incident-management/kpis/common-metrics) (consultée en novembre 2026)
{ .doc-ref }

## Le cycle de vie d'un incident

<a class="pill pill-scope pill-scope-system" href="../architecture/#carte-des-echelles">Échelle · Système</a> <a class="pill pill-scope pill-scope-infra" href="../architecture/#carte-des-echelles">Échelle · Infrastructure</a> <span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

<a class="pill pill-practice" href="../observabilite/" title="niveau 2 : elle est automatisée">Pratique · Observabilité · N2</a>
<a class="pill pill-dora" href="https://dora.dev/capabilities/proactive-failure-notification/">DORA · Proactive failure notification</a>

Un incident passe par cinq étapes. La règle centrale : **atténuer avant de corriger**. On rétablit d'abord le service par le geste le plus sûr, on comprend ensuite. Si les paiements échouent juste après un déploiement, je reviens d'abord à la version précédente, et je cherche pourquoi une fois les clients tirés d'affaire.

!!! noob "As noob"
    C'est le plombier face à une fuite : il coupe d'abord l'arrivée d'eau, et cherche ensuite quel tuyau a cédé. La phrase à retenir : **on rétablit le service d'abord, on comprend la cause ensuite.**

```mermaid
flowchart LR
  D[Détection<br/>alerte ou signalement] --> T[Triage<br/>sévérité, rôles]
  T --> M[Atténuation<br/>rollback, flag, bascule]
  M --> R[Résolution<br/>cause corrigée, surveillance]
  R --> A[Analyse<br/>postmortem, actions]
  A -.-> D
```

| Étape | Question | Sortie attendue |
|---|---|---|
| Détection | est-ce que quelque chose ne va pas ? | une alerte, idéalement avant les clients |
| Triage | est-ce grave, qui doit venir ? | une sévérité, une personne qui coordonne, un canal |
| Atténuation | comment arrêter les dégâts maintenant ? | l'impact client stoppé, même sans connaître la cause |
| Résolution | le service est-il revenu à la normale ? | indicateurs revenus, cause corrigée ou contournée durablement |
| Analyse | qu'est-ce qui l'a rendu possible ? | un postmortem et quelques actions suivies |

Je peux apprendre qu'il y a un problème par une alerte, par un ticket du support ou par un collègue qui me prévient. Le but est que les signaux automatiques sonnent avant que les clients se plaignent ; la part des incidents « détectés par les clients » se suit dans la [revue des incidents](#apprendre-des-incidents-a-lechelle).

```mermaid
flowchart LR
  subgraph AUTO["Signaux automatiques, avant les clients"]
    S1["Alerte sur un SLO<br/>burn rate"]
    S2["Sonde synthétique<br/>parcours rejoué"]
    S3["Suivi d'erreurs<br/>nouvelle exception"]
    S4["Canary en échec<br/>pendant un déploiement"]
  end
  subgraph HUM["Signaux humains, souvent après"]
    S5["Ticket du support"]
    S6["Collègue, réseaux sociaux"]
    S7["Page de statut<br/>d'un fournisseur"]
  end
  S1 & S2 & S3 & S4 --> O["Outil d'astreinte<br/>page la garde"]
  S5 & S6 & S7 --> M["Déclaration<br/>à la main"]
  O --> T["Triage"]
  M --> T
```

Exemple de chronologie, un mardi :

```
14:02  déploiement d'orders-service v2.14 (nouvelle règle de calcul des frais de port)
14:06  le taux d'erreur du paiement passe de 0,2 % à 9 %
14:09  alerte « 5 % des paiements en erreur depuis 3 min », linus (astreinte) la prend
14:11  linus ouvre le canal #inc-paiements, classe en SEV2, grace coordonne
14:14  grace décide le retour à v2.13 sans attendre la cause
14:19  rollback terminé, taux d'erreur à 0,3 %
14:20  ada publie « service rétabli, surveillance en cours » sur la page de statut
14:50  aucune rechute, incident clos ; 312 paiements en échec (exemple) à relancer
J+3    postmortem relu en équipe, 3 actions ouvertes
```

Ici, MTTD : 7 minutes, MTTA : 0, rétablissement : 17 minutes. Les paiements en échec restent à traiter après la fin de l'impact : la résolution inclut le rattrapage des données touchées, pas seulement le retour du service.

Le retour arrière n'est pas toujours possible. Si v2.14 contenait une migration qui supprime une colonne, v2.13 ne fonctionne plus. D'où la règle de garder les migrations compatibles avec deux versions (voir [Expand / contract](sql.md#expand-contract) : renommer une colonne en cinq déploiements, chacun réversible).

:material-book-open-variant: Doc de référence : [Google SRE Workbook, Incident Response](https://sre.google/workbook/incident-response/) (2018) ; [PagerDuty Incident Response](https://response.pagerduty.com/) (consultée en novembre 2026)
{ .doc-ref }

## Niveaux de sévérité

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

La grille de sévérité sert à ce que deux personnes classent le même incident de la même façon, à 3 h du matin, sans débat. Elle s'écrit avec le produit et le support, avec des critères observables, pas avec « c'est grave ».

!!! noob "As noob"
    C'est le tri aux urgences : l'infirmière classe chaque patient avec des critères fixes (respire-t-il, saigne-t-il ?), pas avec son ressenti, et ce classement décide qui est vu et à quelle vitesse. La phrase à retenir : **la sévérité se lit sur une grille écrite à l'avance, pas dans l'émotion du moment.**

| Niveau | Critère (exemple) | Qui vient | Communication | Postmortem |
|---|---|---|---|---|
| SEV1 | parcours critique indisponible pour tous, perte ou fuite de données | astreinte, responsable d'incident sous 15 min, direction prévenue | toutes les 30 min | obligatoire |
| SEV2 | parcours critique dégradé, ou indisponible pour une partie des clients | astreinte et responsable d'incident | toutes les heures | obligatoire |
| SEV3 | fonction secondaire touchée, contournement possible | équipe propriétaire, heures ouvrées | canal de l'équipe | facultatif |
| SEV4 | aucun impact client (quasi-incident) | ticket | aucune | revue groupée |

La grille lue comme un arbre de décision (critères de l'exemple) :

```mermaid
flowchart TD
  Q1{Des clients sont-ils<br/>touchés maintenant ?} -->|non| S4[SEV4<br/>ticket]
  Q1 -->|oui| Q2{Parcours critique<br/>ou données touchés ?}
  Q2 -->|"non, contournement possible"| S3[SEV3<br/>équipe propriétaire]
  Q2 -->|oui| Q3{Indisponible pour tous,<br/>perte ou fuite de données ?}
  Q3 -->|"non, dégradé ou partiel"| S2[SEV2<br/>astreinte + responsable]
  Q3 -->|oui| S1[SEV1<br/>responsable sous 15 min]
  Q2 -->|"dans le doute"| Q3
```

Trois règles qui évitent les débats :

- **dans le doute, classer plus haut** : redescendre une sévérité coûte quelques minutes, sous-estimer coûte la cadence de communication ;
- **la sévérité peut changer** pendant l'incident, et chaque changement est noté dans la chronologie ;
- **la sévérité mesure l'impact, pas l'effort** : un correctif d'une ligne peut clore un SEV1.

Le nombre de niveaux varie selon les organisations (trois à cinq, parfois numérotés à l'envers). Ce qui compte est que chaque niveau déclenche des actions différentes ; deux niveaux qui déclenchent la même chose peuvent fusionner.

:material-book-open-variant: Doc de référence : [PagerDuty, Severity Levels](https://response.pagerduty.com/before/severity_levels/) (consultée en novembre 2026) ; [Atlassian, Incident severity levels](https://www.atlassian.com/incident-management/kpis/severity-levels) (consultée en novembre 2026)
{ .doc-ref }

## Les rôles pendant l'incident

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Les rôles viennent de l'**Incident Command System** (ICS), créé dans les années 1970 par les pompiers de Californie pour coordonner plusieurs services sur les grands feux de forêt. Les équipes d'exploitation l'ont repris, par exemple dans le chapitre « Managing Incidents » du livre « Site Reliability Engineering » (Google, 2016).

!!! noob "As noob"
    C'est une cuisine en plein coup de feu : le chef ne cuisine pas, il annonce les commandes et répartit le travail, et un seul serveur parle aux clients. La phrase à retenir : **celui qui coordonne ne cherche pas la panne, et ceux qui la cherchent ne parlent pas à l'extérieur.**

| Rôle | Fait | Ne fait pas |
|---|---|---|
| <span class="term" data-term="incident-commander">Responsable d'incident</span> (*incident commander*) | décide, priorise, distribue le travail, déclare la fin | déboguer lui-même |
| Communication | met à jour la page de statut, répond au support et à la direction | interrompre les experts |
| <span class="term" data-term="incident-scribe">Scribe</span> | note les faits et les décisions avec l'heure | interpréter ou juger |
| Experts (opérations) | enquêtent et appliquent les actions décidées | lancer un changement sans l'annoncer |

Qui parle à qui pendant l'incident de l'exemple : tout passe par le responsable d'incident, et les experts ne parlent jamais directement à l'extérieur.

```mermaid
flowchart TD
  IC[grace<br/>responsable d'incident]
  IC <--> COM[ada<br/>communication]
  IC <--> SC[alan<br/>scribe]
  IC <--> EX[linus et experts<br/>opérations]
  COM --> SP[page de statut]
  COM --> SUP[support, direction]
  SC --> TL[chronologie]
  EX --> PROD[production]
```

Sur un petit incident, une seule personne tient plusieurs rôles. Dès que plus de deux ou trois personnes interviennent, séparer au moins la coordination de l'enquête : quelqu'un qui a les mains dans les logs ne voit plus l'ensemble.

Le responsable d'incident n'est pas forcément le plus expert ni le plus gradé. C'est celui qui a été désigné, et il peut passer la main explicitement (« grace, tu reprends la coordination ? »), ce qui est noté dans la chronologie.

:material-book-open-variant: Doc de référence : [Google SRE book, Managing Incidents](https://sre.google/sre-book/managing-incidents/) (2016) ; [PagerDuty, Incident Commander training](https://response.pagerduty.com/training/incident_commander/) (consultée en novembre 2026)
{ .doc-ref }

## Communiquer

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Pendant un incident, le support, les clients et la direction veulent savoir où on en est. Sans nouvelles, ils écrivent directement aux personnes qui enquêtent, et celles-ci passent leur temps à répondre au lieu de chercher. Le silence coûte donc plus cher qu'une mauvaise nouvelle. Une <span class="term" data-term="status-page">page de statut</span> et une cadence fixe règlent les deux problèmes : chacun sait où lire l'information, et quand viendra la suivante.

Règles simples :

- **une cadence annoncée**, tenue même quand il n'y a rien de neuf (« toujours en cours, prochain point à 15:00 ») ;
- **des faits, pas des hypothèses** : ce que vivent les utilisateurs, ce qu'on fait, le prochain point ;
- **un seul canal par incident**, et une seule personne qui parle à l'extérieur ;
- **le vocabulaire de l'utilisateur** : « les paiements par carte échouent », pas « le pod payments est en CrashLoopBackOff ».

Modèle de message :

```
[SEV2] Paiements par carte en échec : en cours
Impact     : environ 9 % des paiements par carte échouent depuis 14:06.
             Les autres moyens de paiement fonctionnent.
Action     : retour à la version précédente en cours.
Contournement : réessayer dans quelques minutes, ou payer par virement.
Prochain point : 14:45 au plus tard.
```

Le message de fin dit ce qui a été touché, pendant combien de temps, si des données sont à reprendre, et quand le résumé du postmortem sera partagé.

:material-book-open-variant: Doc de référence : [Atlassian, Incident communication](https://www.atlassian.com/incident-management/incident-communication) (consultée en novembre 2026)
{ .doc-ref }

### Outiller la gestion d'incident

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

!!! info "Section rédigée en novembre 2026"
    Les outils de gestion d'incident évoluent vite (rachats, fonctions d'IA ajoutées chaque année). Les noms cités sont des exemples, leurs fonctions sont à vérifier au moment de la lecture.

Un outil de gestion d'incident (incident.io, PagerDuty, Opsgenie, FireHydrant, Rootly) automatise la partie administrative de tout ce qui précède, pour que les personnes se concentrent sur le diagnostic. PagerDuty et Opsgenie sont nés de l'astreinte (recevoir l'alerte, appeler la bonne personne, gérer l'<span class="term" data-term="escalation-policy">escalade</span>) et ont ajouté la coordination ; incident.io est parti de la coordination dans la messagerie (Slack, Teams) et a ajouté l'astreinte. Atlassian a annoncé la fin de vente d'Opsgenie au profit de Jira Service Management et Compass (annonce de 2025, à vérifier).

*PagerDuty : concurrent de Opsgenie ; complémentaire de Alertmanager*<br>
*Opsgenie : concurrent de PagerDuty ; complémentaire de Alertmanager*<br>
*Jira : complémentaire de Confluence, Slack*
{ .tool-rel }


| Ce que l'outil automatise | Sans outil | Avec outil |
|---|---|---|
| canal | quelqu'un crée `#inc-paiements` et invite les gens à la main | une commande (`/inc declare`) crée le canal, invite l'astreinte et l'équipe propriétaire |
| rôles | « qui coordonne ? » dans le fil | le <span class="term" data-term="incident-commander">responsable d'incident</span> et la communication sont assignés et affichés en haut du canal |
| chronologie | le scribe recopie l'heure de chaque message | les messages marqués, les changements de sévérité et les alertes forment la chronologie |
| page de statut | quelqu'un se connecte à un autre outil pour publier | mise à jour depuis le canal, avec un rappel à la cadence fixée |
| brouillon de postmortem | on reconstitue les faits deux jours après | un document prérempli avec la chronologie, les personnes et les durées |
| suivi | les actions se perdent dans le canal | les actions créent des tickets, l'incident est clos quand elles sont suivies |

**Quand** : plusieurs incidents par mois, plusieurs équipes qui interviennent ensemble, une page de statut publique, ou une astreinte à organiser sur plusieurs rotations. **Pas encore** : une seule équipe avec un incident par trimestre ; un modèle de message, un canal créé à la main et un document de postmortem type suffisent, et apprennent le processus avant de l'automatiser.

**Pourquoi** : pendant un incident, chaque geste administratif est fait par quelqu'un qui devrait réfléchir, et la chronologie reconstituée après coup est toujours incomplète. Le gain : un processus suivi même à 3 h du matin par quelqu'un qui le vit pour la première fois, et des données (durées, sévérités, motifs) pour l'[analyse à l'échelle](#apprendre-des-incidents-a-lechelle). Le coût : une licence souvent par utilisateur, et le risque d'automatiser un processus que personne n'a encore compris.

**Comment** : écrire d'abord le processus (grille de sévérité, rôles, cadence), puis le configurer dans l'outil, puis l'essayer pendant un [game day](#sentrainer-game-days-et-chaos-engineering) avant le premier vrai incident.

## Runbooks et playbooks

<a class="pill pill-scope pill-scope-system" href="../architecture/#carte-des-echelles">Échelle · Système</a> <a class="pill pill-scope pill-scope-infra" href="../architecture/#carte-des-echelles">Échelle · Infrastructure</a> <span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Une alerte réveille la personne d'astreinte à 3 h du matin, sur un service qu'elle connaît mal : elle a besoin de savoir quoi faire sans tout reconstituer. Un <span class="term" data-term="runbook">runbook</span> est une procédure écrite, étape par étape, pour une alerte ou une panne connue. Un <span class="term" data-term="playbook">playbook</span> est plus large : il décrit la conduite face à une famille de situations (une fuite de données, la panne d'un fournisseur), avec les rôles et les décisions à prendre. Les deux mots se recouvrent selon les équipes.

!!! noob "As noob"
    Le runbook, c'est la fiche réflexe collée sur la machine (« si le voyant rouge clignote, faire 1, 2, 3 ») ; le playbook, c'est le plan d'urgence du bâtiment, qui dit qui fait quoi pour toute une famille de situations. La phrase à retenir : **un runbook se suit à 3 h du matin sans réfléchir, un playbook organise une réponse.**

```markdown
# Runbook : file « payments-events » qui grossit

Alerte : message le plus ancien > 5 min (lien vers le tableau de bord)
Impact : les confirmations de paiement arrivent en retard

1. Vérifier les consommateurs : `kubectl get pods -l app=payments-consumer`
2. Si des pods redémarrent en boucle : voir les logs, puis rollback du dernier déploiement
3. Si les pods sont sains mais lents : passer à 6 réplicas
   `kubectl scale deploy/payments-consumer --replicas=6`
4. Si la file dépasse 50 000 messages : prévenir le responsable d'incident (SEV2)
5. Ne pas purger la file : les messages sont des paiements réels

Propriétaire : team-payments ; dernière relecture : 2026-09-14
```

Ce qui rend un runbook utile :

- **un lien depuis l'alerte** : la personne réveillée ne doit pas le chercher ;
- **des commandes copiables** et ce qu'on doit voir si elles marchent ;
- **ce qu'il ne faut pas faire**, souvent plus précieux que le reste ;
- **une date de relecture** : un runbook faux est pire qu'aucun runbook.

Quand une étape de runbook est appliquée à l'identique à chaque fois, c'est un candidat à l'automatisation. Si une alerte n'a pas de runbook possible (« rien à faire »), ce n'est peut-être pas une alerte (voir [Alerter sur les symptômes](observabilite.md#alerter-sur-les-symptomes-pas-sur-les-causes)).

## Le postmortem sans recherche de coupable

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

<a class="pill pill-dora" href="https://dora.dev/capabilities/learning-culture/">DORA · Learning culture</a>

Un postmortem <span class="term" data-term="blameless">sans recherche de coupable</span> (*blameless*) cherche ce qui, dans le système, a rendu l'erreur possible, pas qui l'a commise. L'idée a été popularisée par John Allspaw, « Blameless PostMortems and a Just Culture » (blog d'ingénierie d'Etsy, 2012), puis par le chapitre « Postmortem Culture: Learning from Failure » du livre « Site Reliability Engineering » (Google, 2016). La raison est pratique : si les gens risquent une sanction, ils cachent les détails, et ce sont les détails qui permettent de corriger.

!!! noob "As noob"
    Après un incident d'avion, l'enquête ne cherche pas à punir le pilote, mais à comprendre pourquoi le cockpit a rendu l'erreur possible ; sinon, les pilotes cachent leurs erreurs et plus personne n'apprend. Limite : sans coupable ne veut pas dire sans responsable, chaque action a bien un propriétaire. La phrase à retenir : **quand personne n'est puni, les gens racontent ce qui s'est vraiment passé.**

Deux idées guident l'analyse :

- **plusieurs facteurs, pas une cause racine** : une <span class="term" data-term="root-cause-analysis">analyse de cause racine</span> qui s'arrête à « linus a déployé un bug » ne change rien. Il y a presque toujours plusieurs <span class="term" data-term="contributing-factor">facteurs contributifs</span> alignés (le modèle du « fromage suisse » de James Reason, « Human Error », 1990, illustre ces couches de défense qui ont chacune un trou) ;
- **ce qui paraissait logique sur le moment** : la personne a agi avec les informations qu'elle avait. Demander « qu'est-ce qui t'a fait penser que c'était sûr ? » plutôt que « pourquoi tu n'as pas vérifié ? » (Sidney Dekker, « The Field Guide to Understanding Human Error », 2006).

Le fromage suisse dessiné pour un incident d'exemple (les paiements par carte expirée échouent en silence) : quatre couches de défense, chacune avec un trou, et les trous alignés.

```
                 trou
revue de code  ══════ ════════════   la revue lit le diff, pas le fichier de config modifié
tests          ══════ ════════════   aucun test avec une carte expirée
canary         ══════ ════════════   5 % du trafic pendant 10 min : trop peu de cartes expirées
alerte         ══════ ════════════   seuil à 10 % d'échecs, l'incident plafonne à 9 %
                     |
                     v
              incident en production
```

Boucher un seul trou suffit à arrêter ce bug-là ; le postmortem cherche une action par couche, pas un coupable par couche.

Modèle rempli, pour la chronologie de la section [Le cycle de vie d'un incident](#le-cycle-de-vie-dun-incident) :

```markdown
# Postmortem : paiements par carte en échec, 2026-10-13 (SEV2)

Résumé (5 lignes max)
  De 14:06 à 14:19, environ 9 % des paiements par carte ont échoué après le
  déploiement d'orders-service v2.14. 312 paiements à relancer, aucune perte de données.
  Rétabli par rollback. Détecté par alerte, avant tout signalement client.

Rôles : grace (coordination), ada (communication), alan (scribe), linus (astreinte)

Chronologie : voir le canal #inc-paiements (horodatée par alan)

Facteurs contributifs
  1. La nouvelle règle de frais envoie un montant à 3 décimales ; payments-service
     n'en accepte que 2. Aucun test de contrat entre les deux services.
  2. Le déploiement est parti à 100 % d'un coup : pas de canary sur orders-service.
  3. Les 312 paiements en échec n'avaient pas de relance automatique.

Ce qui a bien marché : alerte en 3 min, rollback en 5 min, page de statut à jour.
Où on a eu de la chance : déploiement en heures ouvrées, trafic faible.

Actions
  | Action                                         | Type      | Responsable   | Échéance |
  | test de contrat orders/payments sur le montant  | prévenir  | team-orders   | J+15     |
  | canary 5 % pendant 10 min sur orders-service    | atténuer  | team-core     | J+30     |
  | relance automatique des paiements en échec      | réparer   | team-payments | J+30     |
```

Bonnes pratiques :

- **écrit sous quelques jours**, quand les souvenirs sont frais ; relu en réunion avec les personnes impliquées ;
- **un résumé en tête**, lisible en 30 secondes par quelqu'un qui n'était pas là ;
- **peu d'actions**, chacune avec un responsable, une échéance et un critère de fin ;
- **« erreur humaine » n'est jamais une conclusion** : c'est le point de départ de la question suivante.

:material-book-open-variant: Doc de référence : [Google SRE book, Postmortem Culture](https://sre.google/sre-book/postmortem-culture/) (2016) ; [Google SRE Workbook, Postmortem Culture](https://sre.google/workbook/postmortem-culture/) (2018)
{ .doc-ref }

## Suivre les actions

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Mon équipe écrit un bon postmortem avec trois actions, puis chacun retourne à ses tickets, et six mois plus tard la même panne revient. Un postmortem dont les actions restent ouvertes n'a servi qu'à écrire. Les actions sont du vrai travail : elles vont dans le backlog de l'équipe responsable, pas dans le document.

| Type d'action | But | Exemple |
|---|---|---|
| détecter | voir plus tôt | alerte sur l'âge des messages |
| atténuer | réduire l'impact la prochaine fois | <span class="term" data-term="canary-deployment">canary</span>, <span class="term" data-term="kill-switch">kill switch</span>, runbook |
| prévenir | empêcher que ça se reproduise | <span class="term" data-term="contract-test">test de contrat</span>, validation en CI |
| réparer | rattraper les dégâts de cet incident | relance des paiements en échec |

Le chemin d'une action, de l'incident à sa clôture :

```mermaid
flowchart LR
  I[Incident clos] --> D[Brouillon de postmortem<br/>sous quelques jours]
  D --> R[Relecture en réunion<br/>avec les personnes impliquées]
  R --> B[Actions dans le backlog<br/>responsable, échéance]
  B --> M{Revue mensuelle}
  M -->|"faite"| C[Action close]
  M -->|"en retard"| B
  M -->|"glisse 3 fois"| A[Risque accepté,<br/>écrit]
```

Un suivi léger suffit souvent : une revue mensuelle de quinze minutes des actions en retard, présentée par les équipes elles-mêmes, et un indicateur simple, la part d'actions closes à l'échéance. Une action qui glisse trois fois est une décision implicite de ne pas la faire : l'écrire comme un risque accepté plutôt que la laisser traîner.

## Apprendre des incidents à l'échelle

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Un postmortem regarde un incident. L'apprentissage utile vient souvent de la lecture de **plusieurs** incidents ensemble : un motif qui revient est un problème de système, pas de malchance. Par exemple, trois pannes sur cinq signalées par les clients, ce n'est pas trois coups de malchance, c'est un trou dans la détection.

```
5 incidents sur 6 mois, relus ensemble (exemple)

incident                         détecté par        motif
1. import massif d'un client     clients, 25 min    ressource partagée sans limite
2. config erronée partout        alerte, 4 min      changement appliqué à tous d'un coup
3. API de taxes indisponible     clients, 35 min    dépendance non critique sur le parcours critique
4. certificat expiré             clients, 20 min    échéance non surveillée
5. migration qui verrouille      alerte, 3 min      changement appliqué à tous d'un coup

constat : 3 sur 5 détectés par les clients ; 2 sur 5 du même motif
```

Pratiques qui aident :

- **une revue trimestrielle** des incidents par thème (détection, déploiement, dépendances), pas par équipe ;
- **recueillir les <span class="term" data-term="near-miss">quasi-incidents</span>** : ils montrent les mêmes faiblesses sans le coût d'une panne, et les gens en parlent plus volontiers ;
- **regarder aussi ce qui marche** : pourquoi la plupart des déploiements se passent bien, quelles adaptations des personnes évitent des pannes chaque semaine ;
- **transformer un motif en décision d'architecture**, écrite dans un <span class="term" data-term="adr">ADR</span> et vérifiée automatiquement.

Ce courant s'appelle **Learning from Incidents** (communauté lancée par Nora Jones en 2019, à vérifier). Il s'appuie sur la recherche en sécurité des systèmes, notamment Richard Cook, « How Complex Systems Fail » (1998) : un système complexe fonctionne toujours en mode partiellement dégradé, et ce sont les personnes qui le maintiennent en marche.

:material-book-open-variant: Doc de référence : [Learning from Incidents in Software](https://www.learningfromincidents.io/) (consultée en novembre 2026) ; [Richard Cook, « How Complex Systems Fail »](https://how.complexsystems.fail/) (1998)
{ .doc-ref }

## Mesures et leurs limites

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Ma direction veut un chiffre pour savoir si les incidents vont mieux, et la durée moyenne semble le plus simple à suivre. C'est pourtant un mauvais guide, pour les raisons du tableau.

| Mesure | Ce qu'elle dit | Limite |
|---|---|---|
| MTTD | les incidents sont-ils vus vite ? | ne compte que les incidents détectés |
| MTTA | l'astreinte répond-elle ? | facile à gonfler en accusant réception sans agir |
| MTTR | les incidents durent-ils ? | moyenne écrasée par quelques longs incidents |
| nombre d'incidents | la tendance générale | baisse si on déclare moins, pas si on casse moins |
| incidents récurrents | les actions marchent-elles ? | demande de relier les incidents entre eux |
| actions closes à l'échéance | le suivi est-il réel ? | ne dit pas si l'action était la bonne |

Le problème du MTTR : les durées d'incident ne suivent pas une courbe en cloche. La plupart sont courtes, quelques-unes très longues, et la moyenne bouge surtout au hasard d'un trimestre à l'autre.

!!! noob "As noob"
    C'est le salaire moyen d'un café quand un milliardaire y entre : la moyenne s'envole alors que personne d'autre n'a changé. Un seul incident très long fait la même chose au MTTR. La phrase à retenir : **sur des durées d'incident, la médiane et la liste disent plus que la moyenne.**

```
8 incidents du trimestre (exemple), en minutes : 6, 9, 12, 15, 18, 22, 30, 410
moyenne : 65 min    médiane : 16,5 min
sans l'incident de 410 min : moyenne 16 min
```

The VOID Report (Courtney Nash, Verica, 2021 puis 2022, à vérifier), construit à partir de milliers d'incidents publics, conclut que ces durées sont trop dispersées pour qu'un MTTR moyen soit un bon indicateur. Štěpán Davidovič, « Incident Metrics in SRE » (Google et O'Reilly, 2021, à vérifier), arrive à une conclusion proche par simulation. [À prendre avec précaution : ces deux conclusions sont résumées ici sans avoir été vérifiées de première main.]

Ce qui marche mieux : regarder la liste des incidents plutôt que la moyenne, suivre la médiane et le pire cas, et ne pas fixer d'objectif chiffré sur une durée. Un objectif sur le MTTR pousse à clore les incidents trop tôt ou à mal les classer (<span class="term" data-term="goodhart-law">loi de Goodhart</span>). Côté DORA, la métrique de rétablissement porte sur les déploiements ratés, pas sur tous les incidents (*failed deployment recovery time* depuis le rapport 2023, à vérifier ; voir [Livraison](livraison.md#mesurer-la-livraison-dora)).

:material-book-open-variant: Doc de référence : [The VOID](https://www.thevoid.community/) (consultée en novembre 2026) ; [Štěpán Davidovič, « Incident Metrics in SRE »](https://sre.google/resources/practices-and-processes/incident-metrics-in-sre/) (2021)
{ .doc-ref }

## Une astreinte soutenable

<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Une astreinte qui épuise les gens finit par perdre ses personnes expérimentées, et des personnes fatiguées font plus d'erreurs pendant les incidents. La <span class="term" data-term="alert-fatigue">fatigue d'alerte</span> en est le premier signe : trop d'alertes, dont beaucoup sans action, et les vraies finissent ignorées.

!!! noob "As noob"
    C'est le garçon qui criait au loup : après dix fausses alertes, plus personne ne se lève, même le jour où le loup est vraiment là. La phrase à retenir : **chaque alerte sans action rend la suivante moins écoutée.**

Repères (à adapter) :

| Sujet | Repère |
|---|---|
| taille de la rotation | assez de personnes pour ne pas être de garde plus d'une semaine sur quatre ou cinq (exemple) |
| charge | le livre SRE de Google (2016) vise au plus deux incidents par garde de 12 heures (à vérifier) |
| alertes | chaque alerte qui réveille doit demander une action humaine ; sinon on la supprime ou on la passe en ticket |
| <span class="term" data-term="escalation-policy">escalade</span> | si l'astreinte ne répond pas en 10 min (exemple), l'alerte passe à une deuxième personne |
| compensation | prime, récupération ou les deux, selon le droit du travail du pays (à vérifier localement) |
| passation | un point de 15 minutes en fin de semaine : alertes reçues, actions en cours, bruits à corriger |

Une politique d'escalade typique, déroulée dans le temps (délais d'exemple) :

```mermaid
sequenceDiagram
  participant A as Alerte
  participant O as Outil d'astreinte
  participant L as linus (garde principale)
  participant G as grace (garde secondaire)
  participant M as responsable d'équipe
  A->>O: paiements en échec > 5 %
  O->>L: notification push, puis appel
  Note over O,L: pas d'accusé de réception en 10 min
  O->>G: escalade niveau 2
  Note over O,G: toujours rien en 10 min
  O->>M: escalade niveau 3
  G-->>O: accusé de réception
```

Indicateurs de santé à suivre autant que le MTTR : nombre d'alertes par garde, appels hors heures ouvrées par personne, part des alertes sans action. Si la personne d'astreinte passe sa semaine à éteindre des feux, elle ne fait pas de travail de projet : c'est prévu, pas un échec.

:material-book-open-variant: Doc de référence : [Google SRE book, Being On-Call](https://sre.google/sre-book/being-on-call/) (2016) ; [Google SRE Workbook, On-Call](https://sre.google/workbook/on-call/) (2018)
{ .doc-ref }

## S'entraîner : game days et chaos engineering

<a class="pill pill-scope pill-scope-system" href="../architecture/#carte-des-echelles">Échelle · Système</a> <a class="pill pill-scope pill-scope-infra" href="../architecture/#carte-des-echelles">Échelle · Infrastructure</a> <span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Découvrir pendant un SEV1 que le runbook pointe vers un tableau de bord supprimé, ou que l'alerte ne sonne pas, c'est trop tard : les clients subissent déjà la panne. Ces trous-là se découvrent en s'entraînant.

**<span class="term" data-term="game-day">Game day</span>** : un exercice planifié où l'équipe provoque une panne, dans un environnement choisi, et la traite comme un vrai incident. La pratique est souvent attribuée à Jesse Robbins chez Amazon au milieu des années 2000 (à vérifier).

**<span class="term" data-term="chaos-engineering">Chaos engineering</span>** : expérimenter sur un système pour gagner confiance dans sa capacité à résister aux pannes. Netflix l'a popularisé avec Chaos Monkey (annoncé en 2011, à vérifier), qui arrêtait des serveurs au hasard. Les « Principles of Chaos Engineering » (principlesofchaos.org, 2015, à vérifier) le résument en quatre étapes : définir l'état normal mesurable, faire une hypothèse, injecter un événement réel, chercher une différence.

!!! noob "As noob"
    C'est l'exercice d'évacuation incendie : on déclenche l'alarme un jour calme, pour découvrir que la porte de secours est bloquée avant le vrai feu. Le chaos engineering va plus loin et coupe vraiment un morceau du système pour vérifier que le reste tient. La phrase à retenir : **on provoque la panne exprès, à petite dose et sous contrôle, pour ne pas la découvrir en vrai.**

```mermaid
flowchart LR
  S[État normal<br/>mesurable] --> H[Hypothèse<br/>l'état normal tient]
  H --> I[Injection<br/>d'une panne réelle]
  I --> D{Différence avec<br/>l'état normal ?}
  D -->|non| C[Confiance accrue,<br/>élargir le périmètre]
  D -->|oui| A[Faiblesse trouvée,<br/>actions]
  A --> S
  C --> S
```

```
Game day, préproduction, jeudi 10:00 (exemple)
Hypothèse   : si payments-service tombe, orders-service met les paiements en
              file et l'alerte « paiements en attente » sonne en moins de 5 min.
Injection   : payments-service passé à 0 réplica pendant 15 min.
Observé     : file OK ; l'alerte a sonné à 11 min (seuil mal réglé) ;
              le runbook pointait vers un tableau de bord supprimé.
Actions     : seuil corrigé, runbook mis à jour, rejouer dans un mois.
```

Commencer petit : un exercice sur table (on déroule un scénario à l'oral, sans rien casser), puis une panne en préproduction, puis, quand l'équipe a confiance, une expérience limitée en production avec un critère d'arrêt.

Un exercice sur table tient en une page : l'animateur annonce les événements un par un, l'équipe dit ce qu'elle fait, et on note les décisions qui hésitent (exemple, 45 min, rien n'est cassé) :

| Minute | L'animateur annonce | Décision attendue |
|---|---|---|
| 0 | « l'alerte "paiements en échec > 5 %" sonne » | l'astreinte accuse réception et ouvre le canal d'incident |
| 5 | « 9 % d'échecs depuis le déploiement d'orders-service v2.14 » | SEV2, un responsable d'incident est nommé |
| 10 | « le rollback échoue : la migration n'est pas réversible » | autre atténuation : éteindre le feature flag du nouveau parcours |
| 20 | « le support signale 40 tickets clients » | la personne à la communication met à jour la page de statut |
| 30 | « le taux d'échec revient à 0,2 % » | fin d'incident déclarée, postmortem planifié |

Chaque décision qui a manqué (personne ne savait qui publie la page de statut) devient une action, comme après un vrai incident.

:material-book-open-variant: Doc de référence : [Principles of Chaos Engineering](https://principlesofchaos.org/) (2015, à vérifier) ; [Netflix, Chaos Monkey](https://netflix.github.io/chaosmonkey/) (consultée en novembre 2026)
{ .doc-ref }

## Pièges à éviter

- **Chercher la cause avant d'atténuer** : les paiements échouent juste après un déploiement, et je fouille les logs pour comprendre. Pendant ce temps, les clients continuent de subir la panne. Je reviens d'abord à la version précédente ou j'éteins le feature flag, et je cherche ensuite ([voir Le cycle de vie](#le-cycle-de-vie-dun-incident)).
- **Classer trop bas par prudence** : j'hésite entre SEV2 et SEV3 et je choisis le plus bas. Les bonnes personnes ne sont pas appelées et la cadence de communication manque. Dans le doute, je classe plus haut : redescendre coûte quelques minutes ([voir Niveaux de sévérité](#niveaux-de-severite)).
- **Coordonner en déboguant** : je suis responsable d'incident et j'ai les mains dans les logs. Je ne vois plus l'ensemble, et plusieurs personnes tentent chacune leur correctif sans se prévenir. Dès que plus de deux ou trois personnes interviennent, je sépare la coordination de l'enquête ([voir Les rôles](#les-roles-pendant-lincident)).
- **Le silence tant qu'il n'y a rien de neuf** : je ne donne pas de nouvelles faute d'avancée. Le support et la direction écrivent directement aux personnes qui enquêtent, qui passent leur temps à répondre. J'annonce une cadence et je la tiens, même pour dire « toujours en cours » ([voir Communiquer](#communiquer)).
- **Un runbook jamais relu** : mon runbook pointe vers un tableau de bord supprimé. La personne réveillée à 3 h du matin suit une procédure fausse, ce qui est pire qu'aucun runbook. Je date chaque relecture, je relie le runbook depuis l'alerte et je l'essaie en game day ([voir Runbooks et playbooks](#runbooks-et-playbooks)).
- **« Erreur humaine » comme conclusion** : mon postmortem s'arrête à « linus a déployé un bug ». Rien ne change dans le système, et la prochaine fois les gens taisent des détails par peur. Je cherche plusieurs facteurs contributifs et une action par couche de défense ([voir Le postmortem](#le-postmortem-sans-recherche-de-coupable)).
- **Des actions laissées dans le document** : le postmortem liste trois actions, puis chacun retourne à ses tickets. Six mois plus tard, la même panne revient. Je mets les actions dans le backlog, avec un responsable, une échéance et une revue mensuelle des retards ([voir Suivre les actions](#suivre-les-actions)).
- **Un objectif chiffré sur le MTTR** : je promets à ma direction de baisser la durée moyenne des incidents. Un seul incident long écrase la moyenne, et l'objectif pousse à clore trop tôt ou à mal classer. Je suis la liste des incidents, la médiane et le pire cas ([voir Mesures et leurs limites](#mesures-et-leurs-limites)).

## Ce qu'on demande en entretien

Les questions typiques :

- « Raconte un incident que tu as géré. Qu'as-tu fait en premier ? » Pour répondre : je déroule la chronologie et je montre que j'ai atténué avant de chercher la cause ([Le cycle de vie d'un incident](#le-cycle-de-vie-dun-incident)).
- « Comment décides-tu de la sévérité d'un incident ? », « Qui fait quoi pendant un incident ? » Pour répondre : je parle de critères observables écrits à l'avance et d'un responsable d'incident qui coordonne sans déboguer ([Niveaux de sévérité](#niveaux-de-severite), [Les rôles pendant l'incident](#les-roles-pendant-lincident)).
- « Qu'est-ce qu'un postmortem sans recherche de coupable ? », « Comment t'assures-tu que les actions sont faites ? » Pour répondre : je parle de facteurs contributifs plutôt que d'une cause racine, et d'actions suivies dans le backlog ([Le postmortem sans recherche de coupable](#le-postmortem-sans-recherche-de-coupable), [Suivre les actions](#suivre-les-actions)).
- « Le MTTR est-il un bon indicateur ? » Pour répondre : je montre qu'un seul long incident écrase la moyenne, et je propose la médiane, le pire cas et les incidents récurrents ([Mesures et leurs limites](#mesures-et-leurs-limites)).
- « Comment rends-tu une astreinte soutenable ? », « Que fais-tu d'une alerte qui sonne pour rien ? » Pour répondre : je parle d'alertes qui demandent toujours une action, de taille de rotation et de passation ([Une astreinte soutenable](#une-astreinte-soutenable)).
- « As-tu déjà organisé un game day ou fait du chaos engineering ? » Pour répondre : je décris un exercice sur table puis une panne en préproduction, avec hypothèse, observation et actions ([S'entraîner](#sentrainer-game-days-et-chaos-engineering)).

Ce qui fait une bonne réponse : une histoire vécue (ou réaliste) racontée dans l'ordre détection, atténuation, résolution, analyse, qui finit par ce que l'équipe a changé ensuite. Je parle du système qui a permis l'erreur, jamais d'un coupable.

## Quoi utiliser dans quelle situation

| Je veux... | J'utilise... |
|---|---|
| que deux personnes de garde classent le même incident de la même façon, même à 3 h du matin, sans débattre de « c'est grave ou pas » | une grille de sévérité avec critères observables |
| arrêter les dégâts tout de suite, alors que je ne sais pas encore pourquoi les paiements échouent depuis le dernier déploiement | une atténuation : rollback, feature flag, bascule |
| éviter que cinq personnes tentent chacune leur correctif en production en même temps, sans se prévenir | un responsable d'incident et un canal unique |
| que la direction et le support sachent où en est l'incident sans écrire toutes les cinq minutes aux personnes qui enquêtent | une personne à la communication, une page de statut, une cadence fixe |
| ne plus perdre de temps, sur plusieurs incidents par mois, à créer les canaux, noter les heures et reconstituer une chronologie toujours incomplète | un outil de gestion d'incident (incident.io, PagerDuty) : canal, rôles, chronologie, brouillon de postmortem |
| que la personne réveillée à 3 h du matin par une alerte sache quoi faire, sans improviser ni chercher la doc | un runbook lié à l'alerte |
| comprendre ce qui s'est vraiment passé, même si la personne qui a déployé le bug a peur d'être sanctionnée et risque de taire des détails | un postmortem sans recherche de coupable |
| que la même panne ne revienne pas dans six mois parce que les actions du postmortem sont restées dans un document | des actions dans le backlog, une revue mensuelle des retards |
| voir ce que plusieurs incidents ont en commun, comme trois pannes sur cinq signalées par les clients | une revue trimestrielle des incidents par motif, les quasi-incidents |
| savoir si la situation s'améliore d'un trimestre à l'autre, sans qu'un seul incident très long fausse le chiffre | la liste des incidents, la médiane, les incidents récurrents ; pas un objectif de MTTR |
| que les personnes de garde ne s'épuisent pas entre les alertes inutiles de la nuit et des semaines de garde trop rapprochées | alertes actionnables, assez de monde dans la rotation, compensation, passation |
| vérifier qu'une correction tient vraiment, par exemple que l'alerte sonne bien quand payments-service tombe, avant le prochain vrai incident | un game day ou une expérience de chaos engineering |
| être prévenu d'une panne avant que les clients la signalent au support | des alertes sur les symptômes et des SLO ([Observabilité](observabilite.md#objectifs-et-alertes)) |

## Sources

- [John Allspaw, « Blameless PostMortems and a Just Culture », blog d'ingénierie d'Etsy (2012)](https://www.etsy.com/codeascraft/blameless-postmortems/)
- [Betsy Beyer et al., « Site Reliability Engineering », chapitres « Managing Incidents » et « Postmortem Culture » (Google, 2016)](https://sre.google/sre-book/postmortem-culture/)
- [Betsy Beyer et al., « The Site Reliability Workbook », chapitre « Incident Response » (Google, 2018)](https://sre.google/workbook/incident-response/)
- [PagerDuty Incident Response Documentation (date de publication non indiquée, à vérifier)](https://response.pagerduty.com/)
- [Documentation d'incident.io (date de publication non indiquée, à vérifier)](https://docs.incident.io/)
- [Atlassian, fin de vente d'Opsgenie (annonce de 2025, à vérifier)](https://www.atlassian.com/software/opsgenie/migration)
- [The VOID Report, Courtney Nash (Verica, 2021)](https://www.thevoid.community/)
- Štěpán Davidovič, « Incident Metrics in SRE » (O'Reilly, 2021)
- [Learning from Incidents in Software (communauté, 2019, à vérifier)](https://www.learningfromincidents.io/)
- [Richard Cook, « How Complex Systems Fail » (1998)](https://how.complexsystems.fail/)
- Sidney Dekker, « The Field Guide to Understanding Human Error » (2006)
- James Reason, « Human Error » (1990)
- [Principles of Chaos Engineering (2015, à vérifier)](https://principlesofchaos.org/)
- [FEMA, Incident Command System Resources (date de publication non indiquée)](https://www.fema.gov/emergency-managers/nims/components)
