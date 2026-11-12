---
hide:
  - navigation
  - toc
---

# Reminder { .hero-title }

!!! warning "Avertissement"
    Ces notes sont des pense-bêtes personnels, pas une source de vérité. Elles reflètent ma compréhension et mes choix : leur contenu reste subjectif, malgré les citations et les références qu'il contient. Il peut être incomplet, simplifié, inexact ou dépassé. Vérifiez toujours dans la documentation officielle avant de l'appliquer. Ce contenu est fourni tel quel, sans aucune garantie : son utilisation se fait sous votre seule responsabilité.

<div class="hero" markdown>

<p class="hero__tagline">Mes pense-bêtes de développeur : une définition simple, un exemple concret, et quand utiliser quoi.</p>

<div class="hero__chips" markdown>
<span class="hero__chip" markdown>:material-lightbulb-on-outline: Un exemple par notion</span>
<span class="hero__chip" markdown>:material-gesture-tap: Définitions au survol</span>
<span class="hero__chip" markdown>:material-translate: Français et anglais</span>
<span class="hero__chip" markdown>:material-magnify: Recherche dans les deux langues</span>
</div>

[:material-dice-multiple-outline: Une page au hasard](#){ .md-button .hero__random }

</div>

??? tip "Comment lire les pages"
    Chaque page suit le même fil : **Vocabulaire**, puis une notion par titre, avec sa définition, un exemple et un tableau « je veux... j'utilise... ». Repères visuels :

    | Repère | Ce que c'est |
    |---|---|
    | <span class="pill pill-scope pill-scope-code">Code</span> <span class="pill pill-scope pill-scope-system">Système</span>... | l'échelle à laquelle la notion s'applique ([carte des échelles](knowledge/architecture.md#carte-des-echelles)) |
    | mot souligné en pointillé | une définition au survol, avec un exemple |
    | encadré jaune **As noob** | la notion expliquée simplement, avec une image du quotidien |
    | schéma | le mécanisme dessiné, à lire avant le texte quand on découvre le sujet |
    | :material-book-open-variant: **Doc de référence** | la documentation officielle ou la source d'origine de la notion, datée |
    | ligne en italique sous un outil | les outils concurrents, complémentaires ou qui le remplacent ([vue d'ensemble](knowledge/outils.md#complementaires-ou-concurrents)) |
    | sommaire à droite | les sections de la page ; le nom du site en haut ramène toujours à l'accueil |

## Knowledge

### Code

<div class="grid cards group-code" markdown>

-   :material-git:{ .lg .middle } **Git**

    ---

    Les commandes par situation : merge ou rebase, conflit, réparer une erreur, retrouver un commit perdu.

    *:material-calendar-check: Mis à jour le 06/11/2026*

    [:octicons-arrow-right-24: Ouvrir](knowledge/git.md)

-   :material-shape-outline:{ .lg .middle } **Design patterns**

    ---

    Factory, Builder, Adapter, Decorator, Strategy, Observer, State, Repository, injection de dépendances : le même exemple en PHP, Python et Java, au choix.

    *:material-calendar-check: Mis à jour le 06/11/2026*

    [:octicons-arrow-right-24: Ouvrir](knowledge/design-patterns.md)

-   :material-scale-balance:{ .lg .middle } **Principes de conception**

    ---

    SOLID lettre par lettre, les défauts STUPID, KISS, DRY, YAGNI, loi de Déméter, composition plutôt qu'héritage, cohésion et couplage, CUPID : en PHP, Python et Java, et ce qu'on en demande en entretien.

    *:material-calendar-check: Mis à jour le 06/11/2026*

    [:octicons-arrow-right-24: Ouvrir](knowledge/principes-conception.md)

-   :material-sitemap-outline:{ .lg .middle } **Architecture et systèmes distribués**

    ---

    Carte des échelles (code, application, système, infrastructure, entreprise), styles d'architecture, front-end (micro front-ends, design system, rendu, bundlers), architecture hexagonale (quand, pourquoi, comment), urbanisation du SI et TOGAF, DDD, CAP et PACELC, réplication et quorum, sagas, CQRS, résilience (retry, circuit breaker), haute disponibilité, RTO et RPO, estimation de capacité, C4 et fitness functions, tech radar d'entreprise.

    *:material-calendar-check: Mis à jour le 12/11/2026*

    [:octicons-arrow-right-24: Ouvrir](knowledge/architecture.md)

-   :material-database-search-outline:{ .lg .middle } **SQL**

    ---

    SELECT, jointures, regroupements, transactions, EXPLAIN et index, pièges des NULL et des dates, faire grandir une base (vertical ou horizontal, partitions, sharding), migrer un schéma sans interruption, injection, SQL pour la QA.

    *:material-calendar-check: Mis à jour le 06/11/2026*

    [:octicons-arrow-right-24: Ouvrir](knowledge/sql.md)

</div>

### API et sécurité

<div class="grid cards group-api" markdown>

-   :material-api:{ .lg .middle } **API REST et asynchrone**

    ---

    Méthodes et codes HTTP, pagination, versions, OpenAPI, API first, API management, GraphQL, messages et événements, files, DLQ, outbox, AsyncAPI.

    *:material-calendar-check: Mis à jour le 06/11/2026*

    [:octicons-arrow-right-24: Ouvrir](knowledge/api-rest-async.md)

-   :material-shield-lock-outline:{ .lg .middle } **Sécurité**

    ---

    OAuth, OIDC, JWT, flux et PKCE, OAuth 2.1, DPoP, métadonnées, DCR, Auth0, OWASP API Top 10, modélisation des menaces (STRIDE), zero trust et mTLS, RGPD dans l'architecture, secrets.

    *:material-calendar-check: Mis à jour le 06/11/2026*

    [:octicons-arrow-right-24: Ouvrir](knowledge/securite.md)

</div>

### Exploitation

<div class="grid cards group-ops" markdown>

-   :material-kubernetes:{ .lg .middle } **Conteneurs, Kubernetes et déploiement**

    ---

    Pods, Deployment, readiness / liveness / startup probes, puis Dockerfile, Helm, Argo CD et Cloud Run : le chemin d'une image jusqu'à la production.

    *:material-calendar-check: Mis à jour le 06/11/2026*

    [:octicons-arrow-right-24: Ouvrir](knowledge/kubernetes.md)

-   :material-chart-timeline-variant:{ .lg .middle } **Observabilité**

    ---

    Logs, métriques, traces, OpenTelemetry, collecteur, sampling, SLO, SLA, ITA et alertes, et le cas du bruit des probes.

    *:material-calendar-check: Mis à jour le 06/11/2026*

    [:octicons-arrow-right-24: Ouvrir](knowledge/observabilite.md)

-   :material-rocket-launch-outline:{ .lg .middle } **Livraison et pratiques d'ingénierie**

    ---

    Conception technique, ADR, trunk-based, tests automatisés, livraison et déploiement continus, déploiement progressif, tests en production, DORA, SPACE, DevEx, amélioration continue.

    *:material-calendar-check: Mis à jour le 06/11/2026*

    [:octicons-arrow-right-24: Ouvrir](knowledge/livraison.md)

-   :material-fire-alert:{ .lg .middle } **Incidents et incidentologie**

    ---

    Cycle de vie d'un incident, sévérités, rôles, communication, runbooks, postmortem sans recherche de coupable, suivi des actions, MTTR et ses limites, astreinte, game days.

    *:material-calendar-check: Mis à jour le 06/11/2026*

    [:octicons-arrow-right-24: Ouvrir](knowledge/incidents.md)

</div>

### Qualité et outils

<div class="grid cards group-quality" markdown>

-   :material-check-decagram-outline:{ .lg .middle } **Qualité et tests**

    ---

    pyramide, trophée, nid d'abeille, quadrants, ISO/IEC 25010, niveaux de test, tests synthétiques, Testcontainers, contrats, Gherkin, couverture, quality gates, CI, tests canary et blue-green, A/B test, mutation testing, écoles de Londres et de Detroit, tests instables, revue.

    *:material-calendar-check: Mis à jour le 12/11/2026*

    [:octicons-arrow-right-24: Ouvrir](knowledge/qualite.md)

-   :material-tools:{ .lg .middle } **Panorama des outils techniques**

    ---

    RabbitMQ, Kafka, Pub/Sub, Redis, PostgreSQL, BigQuery, Kubernetes, Argo CD, CI, observabilité, Playwright, k6, Checkly : mini benchmarks et pourquoi l'un ou l'autre, et les tech radars (Thoughtworks, CNCF, Zalando, BYOR).

    *:material-calendar-check: Mis à jour le 12/11/2026*

    [:octicons-arrow-right-24: Ouvrir](knowledge/outils.md)

-   :material-chart-box-outline:{ .lg .middle } **Données et décision**

    ---

    Décisions pilotées par les données, time to insight, temps réel, A/B testing, visualisation, gouvernance des données, data science, IA prédictive et générative, FinOps.

    *:material-calendar-check: Mis à jour le 12/11/2026*

    [:octicons-arrow-right-24: Ouvrir](knowledge/donnees-decision.md)

-   :material-account-cog-outline:{ .lg .middle } **Developer Experience et plateforme**

    ---

    Boucle interne et externe, projet prêt en une commande, CI rapide, platform engineering, golden paths, portail, documentation (Diátaxis), onboarding, migrations à grande échelle, mesurer sans surveiller.

    *:material-calendar-check: Mis à jour le 06/11/2026*

    [:octicons-arrow-right-24: Ouvrir](knowledge/devx.md)

</div>

### IA

<div class="grid cards group-ai" markdown>

-   :material-robot-outline:{ .lg .middle } **Agents, skills et contexte**

    ---

    Construire un contexte pertinent (context engineering), CLAUDE.md, mémoire, MCP, skills, sub-agents, hooks, CI, orchestrateurs, avec des exemples concrets.

    *:material-calendar-check: Mis à jour le 06/11/2026*

    [:octicons-arrow-right-24: Ouvrir](knowledge/ia-agents.md)

-   :material-scale-balance:{ .lg .middle } **IA en entreprise**

    ---

    Mesurer l'usage des assistants IA sans surveiller les personnes, pseudonymisation, EU AI Act, et les débats sur l'intelligence et la conscience des modèles.

    *:material-calendar-check: Mis à jour le 06/11/2026*

    [:octicons-arrow-right-24: Ouvrir](knowledge/ia-entreprise.md)

</div>

### Culture

<div class="grid cards group-culture" markdown>

-   :material-book-open-page-variant-outline:{ .lg .middle } **Textes fondateurs**

    ---

    Livres blancs, articles de recherche, RFC, normes, manifestes et ouvrages de référence : ce que chacun dit, pourquoi il compte encore, comment le citer en entretien, de Conway et Brooks à Dynamo, Raft, Accelerate et « Attention Is All You Need ».

    *:material-calendar-check: Mis à jour le 06/11/2026*

    [:octicons-arrow-right-24: Ouvrir](knowledge/textes-fondateurs.md)

-   :material-gavel:{ .lg .middle } **Lois et principes éponymes**

    ---

    Conway, Brooks, Parkinson, Hofstadter, Goodhart, Hyrum, Postel, Gall, Amdahl, Little, Chesterton et les autres : l'énoncé, l'origine, un exemple, et le mauvais usage à éviter.

    *:material-calendar-check: Mis à jour le 06/11/2026*

    [:octicons-arrow-right-24: Ouvrir](knowledge/lois-et-principes.md)

-   :material-domain:{ .lg .middle } **Culture d'entreprise et organisation**

    ---

    Westrum, sécurité psychologique, Team Topologies, OKR, Cynefin, Lean, théorie des contraintes, Wardley, CAPEX et OPEX, coût du retard, parler à la direction, carrière d'expert.

    *:material-calendar-check: Mis à jour le 06/11/2026*

    [:octicons-arrow-right-24: Ouvrir](knowledge/culture-entreprise.md)

</div>

## Divers

<div class="grid cards group-misc" markdown>

-   :material-translate:{ .lg .middle } **Expressions courantes (multilingue)**

    ---

    Les expressions françaises les plus courantes, leur sens et leur vrai équivalent anglais, avec un exemple. Page bilingue.

    *:material-calendar-check: Mis à jour le 05/11/2026*

    [:octicons-arrow-right-24: Ouvrir](knowledge/expressions.md)

-   :material-radar:{ .lg .middle } **Veille technique par métier**

    ---

    Pourquoi, quand et comment faire sa veille, et les sources à suivre pour l'architecte, la DevX et la plateforme, la QA et le développeur.

    *:material-calendar-check: Mis à jour le 12/11/2026*

    [:octicons-arrow-right-24: Ouvrir](knowledge/veille.md)

</div>
