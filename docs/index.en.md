---
hide:
  - navigation
  - toc
---

# Reminder { .hero-title }

!!! warning "Disclaimer"
    These notes are personal cheat sheets, not a source of truth. They reflect my own understanding and choices: their content remains subjective, despite the quotes and references it contains. It may be incomplete, simplified, inaccurate or outdated. Always check the official documentation before applying it. This content is provided as is, without any warranty: you use it at your own risk.

<div class="hero" markdown>

<p class="hero__tagline">A developer's cheat sheets: a simple definition, a concrete example, and when to use what.</p>

<div class="hero__chips" markdown>
<span class="hero__chip" markdown>:material-lightbulb-on-outline: One example per notion</span>
<span class="hero__chip" markdown>:material-gesture-tap: Definitions on hover</span>
<span class="hero__chip" markdown>:material-translate: French and English</span>
<span class="hero__chip" markdown>:material-magnify: Search in both languages</span>
</div>

[:material-dice-multiple-outline: A random page](#){ .md-button .hero__random }

</div>

??? tip "How to read the pages"
    Every page follows the same thread: **Terminology**, then one notion per heading, with its definition, an example and an "I want... I use..." table. Visual cues:

    | Cue | What it is |
    |---|---|
    | <span class="pill pill-scope pill-scope-code">Code</span> <span class="pill pill-scope pill-scope-system">System</span>... | the scale the notion applies to ([map of scales](knowledge/architecture.md#map-of-scales)) |
    | dotted underlined word | a definition on hover, with an example |
    | yellow **As noob** box | the notion explained simply, with an everyday picture |
    | diagram | the mechanism drawn out, worth reading before the text when the topic is new |
    | :material-book-open-variant: **Reference docs** | the official documentation or original source of the notion, dated |
    | italic line under a tool | the tools it competes with, complements or is replaced by ([overview](knowledge/outils.md#complementary-or-competing)) |
    | table of contents on the right | the page's sections; the site name at the top always leads back home |

## Knowledge

### Code

<div class="grid cards group-code" markdown>

-   :material-git:{ .lg .middle } **Git**

    ---

    Commands by situation: merge or rebase, conflicts, fixing a mistake, recovering a lost commit.

    *:material-calendar-check: Updated on 2026-11-06*

    [:octicons-arrow-right-24: Open](knowledge/git.md)

-   :material-shape-outline:{ .lg .middle } **Design patterns**

    ---

    Factory, Builder, Adapter, Decorator, Strategy, Observer, State, Repository, dependency injection: the same example in PHP, Python and Java, your choice.

    *:material-calendar-check: Updated on 2026-11-06*

    [:octicons-arrow-right-24: Open](knowledge/design-patterns.md)

-   :material-scale-balance:{ .lg .middle } **Design principles**

    ---

    SOLID letter by letter, the STUPID smells, KISS, DRY, YAGNI, Law of Demeter, composition over inheritance, cohesion and coupling, CUPID: in PHP, Python and Java, and what interviews ask about them.

    *:material-calendar-check: Updated on 2026-11-06*

    [:octicons-arrow-right-24: Open](knowledge/principes-conception.md)

-   :material-sitemap-outline:{ .lg .middle } **Architecture and distributed systems**

    ---

    Map of scales (code, application, system, infrastructure, enterprise), architecture styles, front end (micro front ends, design system, rendering, bundlers), hexagonal architecture (when, why, how), information system urbanization and TOGAF, DDD, CAP and PACELC, replication and quorum, sagas, CQRS, resilience (retry, circuit breaker), high availability, RTO and RPO, capacity estimation, C4 and fitness functions.

    *:material-calendar-check: Updated on 2026-11-06*

    [:octicons-arrow-right-24: Open](knowledge/architecture.md)

-   :material-database-search-outline:{ .lg .middle } **SQL**

    ---

    SELECT, joins, grouping, transactions, EXPLAIN and indexes, NULL and date pitfalls, scaling a database (vertical or horizontal, partitions, sharding), zero-downtime schema migrations, injection, SQL for QA.

    *:material-calendar-check: Updated on 2026-11-06*

    [:octicons-arrow-right-24: Open](knowledge/sql.md)

</div>

### APIs and security

<div class="grid cards group-api" markdown>

-   :material-api:{ .lg .middle } **REST and async APIs**

    ---

    HTTP methods and status codes, pagination, versioning, OpenAPI, API first, API management, GraphQL, messages and events, queues, DLQ, outbox, AsyncAPI.

    *:material-calendar-check: Updated on 2026-11-06*

    [:octicons-arrow-right-24: Open](knowledge/api-rest-async.md)

-   :material-shield-lock-outline:{ .lg .middle } **Security**

    ---

    OAuth, OIDC, JWT, flows and PKCE, OAuth 2.1, DPoP, metadata, DCR, Auth0, OWASP API Top 10, threat modeling (STRIDE), zero trust and mTLS, GDPR in the architecture, secrets.

    *:material-calendar-check: Updated on 2026-11-06*

    [:octicons-arrow-right-24: Open](knowledge/securite.md)

</div>

### Operations

<div class="grid cards group-ops" markdown>

-   :material-kubernetes:{ .lg .middle } **Containers, Kubernetes and deployment**

    ---

    Pods, Deployment, readiness / liveness / startup probes, then Dockerfile, Helm, Argo CD and Cloud Run: the path of an image to production.

    *:material-calendar-check: Updated on 2026-11-06*

    [:octicons-arrow-right-24: Open](knowledge/kubernetes.md)

-   :material-chart-timeline-variant:{ .lg .middle } **Observability**

    ---

    Logs, metrics, traces, OpenTelemetry, collector, sampling, SLOs, SLAs, ITA and alerts, and the probe noise case.

    *:material-calendar-check: Updated on 2026-11-06*

    [:octicons-arrow-right-24: Open](knowledge/observabilite.md)

-   :material-rocket-launch-outline:{ .lg .middle } **Delivery and engineering practices**

    ---

    Technical design, ADRs, trunk-based, automated tests, continuous delivery and deployment, progressive deployment, testing in production, DORA, SPACE, DevEx, continuous improvement.

    *:material-calendar-check: Updated on 2026-11-06*

    [:octicons-arrow-right-24: Open](knowledge/livraison.md)

-   :material-fire-alert:{ .lg .middle } **Incidents and incident analysis**

    ---

    Incident lifecycle, severities, roles, communication, runbooks, blameless postmortems, action tracking, MTTR and its limits, on-call, game days.

    *:material-calendar-check: Updated on 2026-11-06*

    [:octicons-arrow-right-24: Open](knowledge/incidents.md)

</div>

### Quality and tools

<div class="grid cards group-quality" markdown>

-   :material-check-decagram-outline:{ .lg .middle } **Quality and testing**

    ---

    pyramid, trophy, honeycomb, quadrants, ISO/IEC 25010, test levels, synthetic tests, Testcontainers, contracts, Gherkin, coverage, quality gates, CI, canary and blue-green tests, flaky tests, code review.

    *:material-calendar-check: Updated on 2026-11-06*

    [:octicons-arrow-right-24: Open](knowledge/qualite.md)

-   :material-tools:{ .lg .middle } **Tech tools landscape**

    ---

    RabbitMQ, Kafka, Pub/Sub, Redis, PostgreSQL, BigQuery, Kubernetes, Argo CD, CI, observability, Playwright, k6, Checkly: mini benchmarks and why one or the other.

    *:material-calendar-check: Updated on 2026-11-06*

    [:octicons-arrow-right-24: Open](knowledge/outils.md)

-   :material-chart-box-outline:{ .lg .middle } **Data and decisions**

    ---

    Data-driven decisions, time to insight, real time, A/B testing, visualisation, data governance, data science, predictive and generative AI, FinOps.

    *:material-calendar-check: Updated on 2026-11-06*

    [:octicons-arrow-right-24: Open](knowledge/donnees-decision.md)

-   :material-account-cog-outline:{ .lg .middle } **Developer Experience and platform**

    ---

    Inner and outer loop, one-command setup, fast CI, platform engineering, golden paths, portal, documentation (Diátaxis), onboarding, large-scale migrations, measuring without surveillance.

    *:material-calendar-check: Updated on 2026-11-06*

    [:octicons-arrow-right-24: Open](knowledge/devx.md)

</div>

### AI

<div class="grid cards group-ai" markdown>

-   :material-robot-outline:{ .lg .middle } **Agents, skills and context**

    ---

    Building relevant context (context engineering), CLAUDE.md, memory, MCP, skills, sub-agents, hooks, CI, orchestrators, with concrete examples.

    *:material-calendar-check: Updated on 2026-11-06*

    [:octicons-arrow-right-24: Open](knowledge/ia-agents.md)

-   :material-scale-balance:{ .lg .middle } **AI at work**

    ---

    Measuring AI assistant usage without monitoring people, pseudonymization, the EU AI Act, and the debates on model intelligence and consciousness.

    *:material-calendar-check: Updated on 2026-11-06*

    [:octicons-arrow-right-24: Open](knowledge/ia-entreprise.md)

</div>

### Culture

<div class="grid cards group-culture" markdown>

-   :material-book-open-page-variant-outline:{ .lg .middle } **Seminal texts**

    ---

    White papers, research papers, RFCs, standards, manifestos and reference books: what each says, why it still matters, how to cite it in an interview, from Conway and Brooks to Dynamo, Raft, Accelerate and "Attention Is All You Need".

    *:material-calendar-check: Updated on 2026-11-06*

    [:octicons-arrow-right-24: Open](knowledge/textes-fondateurs.md)

-   :material-gavel:{ .lg .middle } **Eponymous laws and principles**

    ---

    Conway, Brooks, Parkinson, Hofstadter, Goodhart, Hyrum, Postel, Gall, Amdahl, Little, Chesterton and the others: the statement, the origin, an example, and the misuse to avoid.

    *:material-calendar-check: Updated on 2026-11-06*

    [:octicons-arrow-right-24: Open](knowledge/lois-et-principes.md)

-   :material-domain:{ .lg .middle } **Company culture and organization**

    ---

    Westrum, psychological safety, Team Topologies, OKR, Cynefin, Lean, theory of constraints, Wardley, CAPEX and OPEX, cost of delay, talking to leadership, expert career track.

    *:material-calendar-check: Updated on 2026-11-06*

    [:octicons-arrow-right-24: Open](knowledge/culture-entreprise.md)

</div>

## Miscellaneous

<div class="grid cards group-misc" markdown>

-   :material-translate:{ .lg .middle } **Common expressions (multilingual)**

    ---

    The most common French expressions, their meaning and their real English equivalent, with an example. Bilingual page.

    *:material-calendar-check: Updated on 2026-11-05*

    [:octicons-arrow-right-24: Open](knowledge/expressions.md)

-   :material-radar:{ .lg .middle } **Tech watch by role**

    ---

    Why, when and how to keep up, and the sources to follow for architects, DevX and platform, QA and developers.

    *:material-calendar-check: Updated on 2026-11-05*

    [:octicons-arrow-right-24: Open](knowledge/veille.md)

</div>
