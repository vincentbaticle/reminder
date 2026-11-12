# reminder

> **Avertissement** : ces notes sont des pense-bêtes personnels, pas une source de vérité. Elles reflètent ma compréhension et mes choix : leur contenu reste subjectif, malgré les citations et les références qu'il contient. Il peut être incomplet, simplifié, inexact ou dépassé. Vérifiez toujours dans la documentation officielle avant de l'appliquer. Ce contenu est fourni tel quel, sans aucune garantie : son utilisation se fait sous votre seule responsabilité.

Mes pense-bêtes, lisibles comme un site : `mise run serve` puis [http://127.0.0.1:8100](http://127.0.0.1:8100). Détails dans [docs/acces.md](docs/acces.md). Le site existe en français et en anglais (bouton de langue dans l'en-tête). Règles d'écriture et de mise à jour : [CLAUDE.md](CLAUDE.md).

## Knowledge

### Code

- [Git](docs/knowledge/git.md) : les commandes par situation, merge ou rebase, réparer une erreur, retrouver un commit perdu
- [Design patterns](docs/knowledge/design-patterns.md) : Factory, Builder, Adapter, Decorator, Strategy, Observer, State, Repository, injection de dépendances, en PHP, Python et Java
- [Principes de conception](docs/knowledge/principes-conception.md) : SOLID, STUPID, KISS, DRY, YAGNI, loi de Déméter, composition plutôt qu'héritage, cohésion et couplage, CUPID
- [Architecture et systèmes distribués](docs/knowledge/architecture.md) : carte des échelles, styles, front-end et micro front-ends, architecture hexagonale, urbanisation du SI et TOGAF, DDD, CAP et PACELC, sagas, CQRS, résilience, haute disponibilité, RTO et RPO, estimation de capacité, C4
- [SQL](docs/knowledge/sql.md) : requêtes, jointures, transactions, index, faire grandir une base (vertical ou horizontal), migrer un schéma sans interruption, pièges, injection, SQL pour la QA

### API et sécurité

- [API REST et asynchrone](docs/knowledge/api-rest-async.md) : méthodes et codes HTTP, pagination, versions, OpenAPI, API first, API management, GraphQL, événements, files, DLQ, outbox, AsyncAPI
- [Sécurité](docs/knowledge/securite.md) : opérations de sécurité (SIEM, NDR, CSPM, SAST), OAuth, OIDC, PKCE, OAuth 2.1, DPoP, DCR, Auth0, OWASP API Top 10, STRIDE, zero trust et mTLS, RGPD dans l'architecture, secrets

### Exploitation

- [Conteneurs, Kubernetes et déploiement](docs/knowledge/kubernetes.md) : pods, Deployment, probes, autoscaling (HPA, KEDA, Knative, Karpenter), opérateurs, Dockerfile, Helm, Argo CD, Cloud Run
- [Observabilité](docs/knowledge/observabilite.md) : logs, métriques, traces, OpenTelemetry, collecteur, sampling, SLO, SLA, ITA et alertes
- [Incidents et incidentologie](docs/knowledge/incidents.md) : cycle de vie, sévérités, rôles, postmortem sans recherche de coupable, MTTR et ses limites, astreinte, game days
- [Livraison et pratiques d'ingénierie](docs/knowledge/livraison.md) : conception technique, ADR, trunk-based, livraison et déploiement continus, déploiement progressif, tests en production, DORA, SPACE, DevEx

### Qualité et outils

- [Qualité et tests](docs/knowledge/qualite.md) : pyramide, trophée, nid d'abeille, quadrants, ISO/IEC 25010, niveaux de test, tests synthétiques, Testcontainers, contrats, Gherkin, couverture, quality gates, CI, tests canary et blue-green, tests instables, revue de code
- [Panorama des outils techniques](docs/knowledge/outils.md) : RabbitMQ, Kafka, Pub/Sub, Redis, bases, Kubernetes, CI, observabilité, tests, Checkly, avec mini benchmarks et quoi choisir
- [Developer Experience et plateforme](docs/knowledge/devx.md) : boucle interne et externe, CI rapide, platform engineering, golden paths, portail, documentation, onboarding, migrations à grande échelle
- [Données et décision](docs/knowledge/donnees-decision.md) : plateforme de données (lakehouse, ETL, Spark, MLOps), décisions pilotées par les données, time to insight, temps réel, A/B testing, visualisation, gouvernance des données, data science, FinOps

### IA

- [Agents, skills et contexte](docs/knowledge/ia-agents.md) : construire un contexte pertinent (context engineering), CLAUDE.md, mémoire, MCP, skills, sub-agents, hooks, plugins et mods, CI, orchestrateurs, et quoi utiliser quand
- [IA en entreprise](docs/knowledge/ia-entreprise.md) : mesurer l'usage des assistants sans surveiller, pseudonymisation, EU AI Act, débats sur l'intelligence des modèles

### Culture

- [Textes fondateurs](docs/knowledge/textes-fondateurs.md) : auteurs de référence, livres blancs, articles de recherche, RFC, normes, manifestes et ouvrages de référence, ce que chacun dit et comment le citer
- [Lois et principes éponymes](docs/knowledge/lois-et-principes.md) : Conway, Brooks, Goodhart, Hyrum, Postel, Gall, Amdahl, Little, Chesterton, avec exemple et mauvais usage
- [Culture d'entreprise et organisation](docs/knowledge/culture-entreprise.md) : Westrum, sécurité psychologique, Team Topologies, OKR, Cynefin, Lean, Wardley, CAPEX et OPEX, parler à la direction

## Divers

- [Expressions courantes (multilingue)](docs/knowledge/expressions.md) : expressions françaises courantes et leur équivalent anglais (page bilingue unique)
- [Veille technique par métier](docs/knowledge/veille.md) : pourquoi, quand et comment faire sa veille, sources pour architecte, DevX, QA et développeur

## Licence

[CC BY 4.0](LICENSE) : réutilisation libre avec attribution, contenu fourni tel quel, sans aucune garantie.
