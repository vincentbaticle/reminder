# reminder

> **Avertissement** : ces notes sont des pense-bêtes personnels, pas une source de vérité. Elles reflètent ma compréhension et mes choix : leur contenu reste subjectif, malgré les citations et les références qu'il contient. Il peut être incomplet, simplifié, inexact ou dépassé. Vérifiez toujours dans la documentation officielle avant de l'appliquer. Ce contenu est fourni tel quel, sans aucune garantie : son utilisation se fait sous votre seule responsabilité.

Mes pense-bêtes, à lire en ligne sur **[vincentbaticle.github.io/reminder](https://vincentbaticle.github.io/reminder/)**. Pour le lancer sur ma machine et contribuer : [Lancer le site en local](#lancer-le-site-en-local). Le site existe en français et en anglais (bouton de langue dans l'en-tête). Règles d'écriture et de mise à jour : [CLAUDE.md](CLAUDE.md).

## Knowledge

### Code

- [Git](docs/knowledge/git.md) : les commandes par situation, merge ou rebase, réparer une erreur, retrouver un commit perdu
- [Design patterns](docs/knowledge/design-patterns.md) : Factory, Builder, Singleton, Adapter, Decorator, Facade, Repository, injection de dépendances, en PHP, Python et Java
- [Design patterns de comportement](docs/knowledge/design-patterns-comportement.md) : Strategy, Observer, Command, Template Method, Chain of Responsibility, State, en PHP, Python et Java
- [Principes de conception](docs/knowledge/principes-conception.md) : SOLID, STUPID, KISS, DRY, YAGNI, loi de Déméter, composition plutôt qu'héritage, cohésion et couplage, CUPID
- [Architecture et systèmes distribués](docs/knowledge/architecture.md) : carte des échelles, styles, architecture hexagonale, urbanisation du SI et TOGAF, DDD, CAP et PACELC, sagas, CQRS, résilience, haute disponibilité, RTO et RPO, estimation de capacité, C4, tech radar d'entreprise
- [Front-end et applications web](docs/knowledge/front-end.md) : React, application web sur mobile et PWA, micro front-ends, design system, stratégies de rendu, bundlers
- [SQL](docs/knowledge/sql.md) : requêtes, jointures, transactions, index, faire grandir une base (vertical ou horizontal), migrer un schéma sans interruption, pièges, injection, SQL pour la QA

### API et sécurité

- [API REST et asynchrone](docs/knowledge/api-rest-async.md) : méthodes et codes HTTP, pagination, versions, OpenAPI, API first, API management, GraphQL, événements, files, DLQ, outbox, AsyncAPI
- [Sécurité](docs/knowledge/securite.md) : opérations de sécurité (SIEM, NDR, CSPM, SAST), OAuth, OIDC, PKCE, OAuth 2.1, DPoP, DCR, Auth0, OWASP API Top 10, STRIDE, zero trust et mTLS, RGPD dans l'architecture, secrets
- [Cybersécurité et hacking éthique](docs/knowledge/cybersecurite.md) : cadre légal et divulgation, kill chain et MITRE ATT&CK, pentest, red team, bug bounty, outils offensifs, s'entraîner légalement, CVSS, EPSS et KEV, chaîne d'approvisionnement, outils d'IA qui simulent des attaques (Daybreak)

### Exploitation

- [Conteneurs, Kubernetes et déploiement](docs/knowledge/kubernetes.md) : pods, Deployment, probes, Dockerfile, Helm, Argo CD et GitOps, Cloud Run
- [Kubernetes à l'échelle](docs/knowledge/kubernetes-echelle.md) : autoscaling (HPA, KEDA, Knative, Karpenter), opérateurs (Strimzi)
- [Observabilité](docs/knowledge/observabilite.md) : logs, métriques, traces, OpenTelemetry, collecteur, sampling, SLO, SLA, ITA et alertes
- [Incidents et incidentologie](docs/knowledge/incidents.md) : cycle de vie, sévérités, rôles, postmortem sans recherche de coupable, MTTR et ses limites, astreinte, game days
- [Workplace engineering et IT d'entreprise](docs/knowledge/workplace.md) : identité et SSO, SCIM, MFA, arrivées et départs, MDM et enrôlement zero-touch, sécurité des postes, workplace as code, SaaS et shadow IT, ITSM, conformité
- [Livraison et pratiques d'ingénierie](docs/knowledge/livraison.md) : conception technique, ADR, trunk-based, livraison et déploiement continus, déploiement progressif, tests en production, DORA, SPACE, DevEx

### Qualité et outils

- [Qualité et tests](docs/knowledge/qualite.md) : pyramide, trophée, nid d'abeille, quadrants, ISO/IEC 25010, niveaux de test, tests synthétiques, Testcontainers, contrats, Gherkin, couverture, quality gates, CI, tests canary et blue-green, A/B test, mutation testing, écoles de Londres et de Detroit, tests instables, revue de code
- [Concevoir les tests](docs/knowledge/conception-tests.md) : stratégie par les risques, critères de sortie, techniques de conception de tests, test exploratoire, données de test, TDD et code legacy, rapport de bug, accessibilité
- [Panorama des outils techniques](docs/knowledge/outils.md) : RabbitMQ, Kafka, Pub/Sub, Redis, bases, Kubernetes, CI, observabilité, tests, Checkly, tech radars, avec mini benchmarks et quoi choisir
- [Gestionnaires de paquets](docs/knowledge/gestionnaires-paquets.md) : système, versions d'outils et langage, lockfile, SemVer, résolution des conflits, npm, pnpm, yarn, Bun, uv, Poetry, Composer, Maven, workspaces, registres privés, sécuriser l'installation
- [Developer Experience et plateforme](docs/knowledge/devx.md) : boucle interne et externe, CI rapide, platform engineering, golden paths, portail, documentation, onboarding, migrations à grande échelle
- [Données et décision](docs/knowledge/donnees-decision.md) : plateforme de données (lakehouse, ETL, Spark, MLOps), décisions pilotées par les données, time to insight, temps réel, A/B testing, visualisation, gouvernance des données, data science, FinOps

### IA

- [Agents, skills et contexte](docs/knowledge/ia-agents.md) : construire un contexte pertinent (context engineering), CLAUDE.md, mémoire, MCP, skills, sub-agents, hooks, plugins et mods, CI, orchestrateurs, et quoi utiliser quand
- [Agents : outils, MCP, skills et hooks](docs/knowledge/ia-capacites.md) : outils, permissions, MCP, skills, sub-agents, hooks, plugins, mods, mode non interactif
- [IA en entreprise](docs/knowledge/ia-entreprise.md) : mesurer l'usage des assistants sans surveiller, pseudonymisation, EU AI Act, débats sur l'intelligence des modèles

### Culture

- [Textes fondateurs](docs/knowledge/textes-fondateurs.md) : auteurs de référence, livres blancs, articles de recherche, RFC, normes, manifestes et ouvrages de référence, ce que chacun dit et comment le citer
- [Lois et principes éponymes](docs/knowledge/lois-et-principes.md) : Conway, Brooks, Goodhart, Hyrum, Postel, Gall, Amdahl, Little, Chesterton, avec exemple et mauvais usage
- [Culture d'entreprise et organisation](docs/knowledge/culture-entreprise.md) : Westrum, sécurité psychologique, Team Topologies, OKR, Cynefin, Lean, Wardley, CAPEX et OPEX, parler à la direction
- [Product management](docs/knowledge/product-management.md) : rôle du PM, résultats plutôt que livrables, discovery, The Mom Test, RICE et Kano, feuilles de route, métriques produit, product-market fit, stories et lancement, taille de marché
- [Agilité, Scrum et Kanban](docs/knowledge/agilite.md) : Manifeste agile, comparaison des méthodes et comment les combiner avec DevOps, Scrum (guide 2020), Kanban en profondeur et mesures du flux, Scrumban, Extreme Programming, story points et prévision de Monte Carlo, rétrospectives, agilité à l'échelle, qualité dans le sprint, dérives

## Entretiens

Pour chaque métier, les questions avec une piste de réponse et des liens vers Knowledge, puis des exercices en direct corrigés.

- Staff Engineer : [questions](docs/entretiens/staff-engineer/questions.md), [exercices en direct](docs/entretiens/staff-engineer/exercices.md)
- DevX Engineer : [questions](docs/entretiens/devx-engineer/questions.md), [exercices en direct](docs/entretiens/devx-engineer/exercices.md)
- QA Engineer : [questions](docs/entretiens/qa-engineer/questions.md), [exercices en direct](docs/entretiens/qa-engineer/exercices.md)
- Software Engineer : [questions](docs/entretiens/software-engineer/questions.md), [exercices en direct](docs/entretiens/software-engineer/exercices.md)
- Software Architect : [questions](docs/entretiens/software-architect/questions.md), [exercices en direct](docs/entretiens/software-architect/exercices.md)
- Workplace Engineer : [questions](docs/entretiens/workplace-engineer/questions.md), [exercices en direct](docs/entretiens/workplace-engineer/exercices.md)
- Product Manager : [questions](docs/entretiens/product-manager/questions.md), [exercices en direct](docs/entretiens/product-manager/exercices.md)

## Divers

- [Expressions courantes (multilingue)](docs/knowledge/expressions.md) : expressions françaises courantes et leur équivalent anglais (page bilingue unique)
- [Veille technique par métier](docs/knowledge/veille.md) : pourquoi, quand et comment faire sa veille, sources pour architecte, DevX, QA, développeur, workplace et product manager

## Lancer le site en local

Le site en ligne suffit pour lire. Cette partie sert à contribuer : écrire une page, relire une modification avant de la publier, ou garder une copie hors ligne.

Le site est construit par **MkDocs** (thème **Material**) à partir des fichiers Markdown de `docs/`. **mise** installe la bonne version de Python, crée un environnement virtuel `.venv` dans le repo et lance les commandes définies dans `mise.toml`.

### Première fois

Prérequis : `git` et [mise](https://mise.jdx.dev/).

```
$ git clone https://github.com/vincentbaticle/reminder.git
$ cd reminder
$ mise trust
$ mise run serve
```

Ouvrir [http://127.0.0.1:8100/reminder/](http://127.0.0.1:8100/reminder/) (version anglaise : [http://127.0.0.1:8100/reminder/en/](http://127.0.0.1:8100/reminder/en/)). Le site se recharge tout seul quand je modifie un fichier dans `docs/`.

Les fois suivantes : `git pull` puis `mise run serve`.

### Commandes

| Je veux...                                         | Commande           |
|----------------------------------------------------|--------------------|
| lire le site en local                              | `mise run serve`   |
| vérifier qu'aucun lien n'est cassé                 | `mise run build`   |
| réinstaller les dépendances                        | `mise run install` |

### Ajouter ou modifier une page

Le site existe en français (`page.md`) et en anglais (`page.en.md`), construit par le plugin `mkdocs-static-i18n`. Sans fichier `.en.md`, la version anglaise affiche la page française.

1. Créer ou modifier la page française **et** sa version anglaise dans `docs/knowledge/`, par exemple `docker.md` et `docker.en.md`.
2. Pour une nouvelle page : l'ajouter dans la partie `nav` de `mkdocs.yml` (nom du fichier français), avec son titre anglais dans `nav_translations` si le titre change, et une ligne dans ce README.
3. Mettre la date du jour sur sa carte de la page d'accueil, dans les deux langues (seule cette carte change de date) :
   ```
   docs/index.md      *:material-calendar-check: Mis à jour le 21/10/2026*
   docs/index.en.md   *:material-calendar-check: Updated on 2026-10-21*
   ```
4. `mise run build`, puis commit et push.

Toutes les règles d'écriture sont dans [CLAUDE.md](CLAUDE.md), pour que l'assistant les applique tout seul.

### Publication

Chaque push sur `main` lance le workflow `.github/workflows/pages.yml` : il construit le site avec `mkdocs build --strict` puis le publie sur GitHub Pages, en quelques minutes. Si la construction échoue (un lien cassé, par exemple), rien n'est publié : le site en ligne garde sa version précédente et l'onglet **Actions** du repo montre l'erreur.

### Le port 8100 est déjà pris

Le site écoute sur le port 8100 plutôt que 8000 (le port par défaut de MkDocs, souvent pris par des API lancées dans Docker). Si 8100 est occupé, choisir un autre port libre :

```
$ lsof -nP -iTCP:8100 -sTCP:LISTEN
$ mise exec -- mkdocs serve -a 127.0.0.1:8102
```

## Licence

[CC BY 4.0](LICENSE) : réutilisation libre avec attribution, contenu fourni tel quel, sans aucune garantie.
