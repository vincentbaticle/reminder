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
    | <span class="pill pill-ex pill-ex-bad">Avoid</span> <span class="pill pill-ex pill-ex-good">Recommended</span> on top of a code block | a demo written for the example: the classic mistake, then the good practice; read it as advice, not as documentation |
    | <span class="pill pill-ex pill-ex-ref">Reference</span> on top of a code block | the real syntax, command, output or format of a tool or a standard, as in its documentation; only the values (names, numbers) are made up |
    | <span class="pill pill-ex pill-ex-illus">Illustration</span> on top of a code block | a made-up scenario that makes an idea concrete (timeline, calculation, tree, code sketch): neither official syntax nor advice |
    | <span class="pill pill-ex pill-ex-compare">Comparison</span> on top of a code block | two versions side by side in one block, each named inside the block |
    | :material-book-open-variant: **Reference docs** | the official documentation or original source of the notion, dated |
    | italic line under a tool | the tools it competes with, complements or is replaced by ([overview](knowledge/outils.md#complementary-or-competing)) |
    | table of contents on the right | the page's sections; the site name at the top always leads back home |

## Knowledge

### Code

<div class="grid cards group-code" markdown>

-   :material-git:{ .lg .middle } **Git**

    ---

    Commands by situation: merge or rebase, conflicts, fixing a mistake, recovering a lost commit.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Open](knowledge/git.md)

-   :material-shape-outline:{ .lg .middle } **Design patterns**

    ---

    Factory, Builder, Singleton, Adapter, Decorator, Facade, Repository, dependency injection: the same example in PHP, Python and Java, your choice.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Open](knowledge/design-patterns.md)

-   :material-swap-horizontal:{ .lg .middle } **Behavioral design patterns**

    ---

    Strategy, Observer, Command, Template Method, Chain of Responsibility and State: the same example in PHP, Python and Java, your pick.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Open](knowledge/design-patterns-comportement.md)

-   :material-scale-balance:{ .lg .middle } **Design principles**

    ---

    SOLID letter by letter, the STUPID smells, KISS, DRY, YAGNI, Law of Demeter, composition over inheritance, cohesion and coupling, CUPID: in PHP, Python and Java, and what interviews ask about them.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Open](knowledge/principes-conception.md)

-   :material-sitemap-outline:{ .lg .middle } **Architecture and distributed systems**

    ---

    Map of scales (code, application, system, infrastructure, enterprise), architecture styles, hexagonal architecture (when, why, how), information system urbanization and TOGAF, DDD, CAP and PACELC, replication and quorum, sagas, CQRS, resilience (retry, circuit breaker), high availability, RTO and RPO, capacity estimation, C4 and fitness functions, company tech radar.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Open](knowledge/architecture.md)

-   :material-cellphone-link:{ .lg .middle } **Front end and web apps**

    ---

    React, mobile web apps and PWA (iPhone, service worker), micro front ends and Module Federation, design system and Storybook, rendering strategies (CSR, SSR, SSG, ISR), bundlers.

    *:material-calendar-check: Updated on 2026-11-16*

    [:octicons-arrow-right-24: Open](knowledge/front-end.md)

-   :material-database-search-outline:{ .lg .middle } **SQL**

    ---

    SELECT, joins, grouping, transactions, EXPLAIN and indexes, NULL and date pitfalls, scaling a database (vertical or horizontal, partitions, sharding), zero-downtime schema migrations, injection, SQL for QA.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Open](knowledge/sql.md)

</div>

### APIs and security

<div class="grid cards group-api" markdown>

-   :material-api:{ .lg .middle } **REST and async APIs**

    ---

    HTTP methods and status codes, pagination, versioning, OpenAPI, API first, API management, GraphQL, messages and events, queues, DLQ, outbox, AsyncAPI.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Open](knowledge/api-rest-async.md)

-   :material-shield-lock-outline:{ .lg .middle } **Security**

    ---

    OAuth, OIDC, JWT, flows and PKCE, OAuth 2.1, DPoP, metadata, DCR, Auth0, OWASP API Top 10, threat modeling (STRIDE), zero trust and mTLS, GDPR in the architecture, secrets.

    *:material-calendar-check: Updated on 2026-11-19*

    [:octicons-arrow-right-24: Open](knowledge/securite.md)

-   :material-incognito:{ .lg .middle } **Cybersecurity and ethical hacking**

    ---

    Legal framework and disclosure, kill chain and MITRE ATT&CK, pentest, red team, purple team and bug bounty, nmap and Burp, practicing legally, CVSS, EPSS and KEV, supply chain, and AI tools that simulate attacks (Daybreak, XBOW, Claude Mythos).

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Open](knowledge/cybersecurite.md)

</div>

### Operations

<div class="grid cards group-ops" markdown>

-   :material-kubernetes:{ .lg .middle } **Containers, Kubernetes and deployment**

    ---

    Pods, Deployment, readiness / liveness / startup probes, then Dockerfile, Helm, Argo CD and Cloud Run: the path of an image to production.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Open](knowledge/kubernetes.md)

-   :material-arrow-expand-all:{ .lg .middle } **Kubernetes at scale**

    ---

    Pod and node autoscaling (HPA, KEDA, Knative, Karpenter) and operators (Strimzi): following the load without paying for empty machines.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Open](knowledge/kubernetes-echelle.md)

-   :material-chart-timeline-variant:{ .lg .middle } **Observability**

    ---

    Logs, metrics, traces, OpenTelemetry, collector, sampling, SLOs, SLAs, ITA and alerts, and the probe noise case.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Open](knowledge/observabilite.md)

-   :material-rocket-launch-outline:{ .lg .middle } **Delivery and engineering practices**

    ---

    Technical design, ADRs, trunk-based, automated tests, continuous delivery and deployment, progressive deployment, testing in production, DORA, SPACE, DevEx, continuous improvement.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Open](knowledge/livraison.md)

-   :material-fire-alert:{ .lg .middle } **Incidents and incident analysis**

    ---

    Incident lifecycle, severities, roles, communication, runbooks, blameless postmortems, action tracking, MTTR and its limits, on-call, game days.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Open](knowledge/incidents.md)

-   :material-laptop-account:{ .lg .middle } **Workplace engineering and corporate IT**

    ---

    Identity and SSO, SCIM, phishing-resistant MFA, joiners and leavers driven by the HRIS, MDM and zero-touch enrollment, endpoint security, workplace as code, SaaS and shadow IT, ITSM, compliance.

    *:material-calendar-check: Updated on 2026-11-19*

    [:octicons-arrow-right-24: Open](knowledge/workplace.md)

</div>

### Quality and tools

<div class="grid cards group-quality" markdown>

-   :material-check-decagram-outline:{ .lg .middle } **Quality and testing**

    ---

    pyramid, trophy, honeycomb, quadrants, ISO/IEC 25010, test levels, synthetic tests, Testcontainers, contracts, Gherkin, coverage, quality gates, CI, canary and blue-green tests, A/B testing, mutation testing, London and Detroit schools, flaky tests, code review.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Open](knowledge/qualite.md)

-   :material-clipboard-check-outline:{ .lg .middle } **Designing tests**

    ---

    Risk-based strategy and exit criteria, scenarios, partitions and boundary values, decision tables, state transitions, pairwise and property-based tests, exploratory testing, test data, TDD and legacy code, bug reports, accessibility.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Open](knowledge/conception-tests.md)

-   :material-tools:{ .lg .middle } **Tech tools landscape**

    ---

    RabbitMQ, Kafka, Pub/Sub, Redis, PostgreSQL, BigQuery, Kubernetes, Argo CD, CI, observability, Playwright, k6, Checkly: mini benchmarks and why one or the other, and tech radars (Thoughtworks, CNCF, Zalando, BYOR).

    *:material-calendar-check: Updated on 2026-11-19*

    [:octicons-arrow-right-24: Open](knowledge/outils.md)

-   :material-package-variant-closed:{ .lg .middle } **Package managers**

    ---

    System, tool versions and language, manifest and lockfile, SemVer and ranges, conflict resolution, npm, pnpm, yarn, Bun, uv, Poetry, Composer, Maven, workspaces, private registries, securing installation, updates.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Open](knowledge/gestionnaires-paquets.md)

-   :material-chart-box-outline:{ .lg .middle } **Data and decisions**

    ---

    Data-driven decisions, time to insight, real time, A/B testing, visualisation, data governance, data science, predictive and generative AI, FinOps.

    *:material-calendar-check: Updated on 2026-11-19*

    [:octicons-arrow-right-24: Open](knowledge/donnees-decision.md)

-   :material-account-cog-outline:{ .lg .middle } **Developer Experience and platform**

    ---

    Inner and outer loop, one-command setup, fast CI, platform engineering, golden paths, portal, documentation (Diátaxis), onboarding, large-scale migrations, measuring without surveillance.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Open](knowledge/devx.md)

</div>

### AI

<div class="grid cards group-ai" markdown>

-   :material-robot-outline:{ .lg .middle } **Agents, skills and context**

    ---

    Building relevant context (context engineering), LLM, agent, sub-agent and skill, CLAUDE.md, memory, code search, current tools, with concrete examples.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Open](knowledge/ia-agents.md)

-   :material-toolbox-outline:{ .lg .middle } **Agents: tools, MCP, skills and hooks**

    ---

    Giving a coding agent capabilities and keeping them in check: tools, permissions, MCP, skills, sub-agents, hooks, plugins, mods, headless mode, multi-agent workflows.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Open](knowledge/ia-capacites.md)

-   :material-scale-balance:{ .lg .middle } **AI at work**

    ---

    Measuring AI assistant usage without monitoring people, pseudonymization, the EU AI Act, and the debates on model intelligence and consciousness.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Open](knowledge/ia-entreprise.md)

</div>

### Culture

<div class="grid cards group-culture" markdown>

-   :material-book-open-page-variant-outline:{ .lg .middle } **Seminal texts**

    ---

    White papers, research papers, RFCs, standards, manifestos and reference books: what each says, why it still matters, how to cite it in an interview, from Conway and Brooks to Dynamo, Raft, Accelerate and "Attention Is All You Need".

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Open](knowledge/textes-fondateurs.md)

-   :material-gavel:{ .lg .middle } **Eponymous laws and principles**

    ---

    Conway, Brooks, Parkinson, Hofstadter, Goodhart, Hyrum, Postel, Gall, Amdahl, Little, Chesterton and the others: the statement, the origin, an example, and the misuse to avoid.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Open](knowledge/lois-et-principes.md)

-   :material-domain:{ .lg .middle } **Company culture and organization**

    ---

    Westrum, psychological safety, Team Topologies, OKR, Cynefin, Lean, theory of constraints, Wardley, CAPEX and OPEX, cost of delay, talking to leadership, expert career track.

    *:material-calendar-check: Updated on 2026-11-19*

    [:octicons-arrow-right-24: Open](knowledge/culture-entreprise.md)

-   :material-bullseye-arrow:{ .lg .middle } **Product management**

    ---

    The PM role and the product trio, outcomes over outputs, continuous discovery, The Mom Test, RICE, Kano, Now/Next/Later roadmaps, product metrics (AARRR, HEART, cohorts), product-market fit, stories and launch, market size.

    *:material-calendar-check: Updated on 2026-11-19*

    [:octicons-arrow-right-24: Open](knowledge/product-management.md)

</div>

## Interviews

For each role, the questions asked with an answer outline and links to the Knowledge pages, then live exercises with worked answers.

<div class="grid cards group-interview" markdown>

-   :material-account-star-outline:{ .lg .middle } **Staff Engineer**

    ---

    Architecture decisions, influence without authority, quality across several teams, incidents, measuring engineering, coaching.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Questions](entretiens/staff-engineer/questions.md) · [:octicons-arrow-right-24: Exercises](entretiens/staff-engineer/exercices.md)

-   :material-tools:{ .lg .middle } **DevX Engineer**

    ---

    Platform as a product, measuring productivity, inner and outer loops, golden paths, portal, migrations, AI coding assistants.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Questions](entretiens/devx-engineer/questions.md) · [:octicons-arrow-right-24: Exercises](entretiens/devx-engineer/exercices.md)

-   :material-bug-check-outline:{ .lg .middle } **QA Engineer**

    ---

    Risk-based strategy, test design, exploratory testing, automation, API, contract and performance, CI, accessibility, go/no-go.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Questions](entretiens/qa-engineer/questions.md) · [:octicons-arrow-right-24: Exercises](entretiens/qa-engineer/exercices.md)

-   :material-code-braces:{ .lg .middle } **Software Engineer**

    ---

    Readable code, tests, refactoring, review and Git, APIs and databases, concurrency and caching, security and production, system design.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Questions](entretiens/software-engineer/questions.md) · [:octicons-arrow-right-24: Exercises](entretiens/software-engineer/exercices.md)

-   :material-floor-plan:{ .lg .middle } **Software Architect**

    ---

    Quality attributes, styles and decomposition, distributed systems, integration, reliability, security, costs, modernization, ADRs and C4.

    *:material-calendar-check: Updated on 2026-11-17*

    [:octicons-arrow-right-24: Questions](entretiens/software-architect/questions.md) · [:octicons-arrow-right-24: Exercises](entretiens/software-architect/exercices.md)

-   :material-laptop-account:{ .lg .middle } **Workplace Engineer**

    ---

    Identity and SSO, SCIM, joiners and leavers, MDM and zero-touch, endpoint security, workplace as code, SaaS, ITSM, compromised account.

    *:material-calendar-check: Updated on 2026-11-19*

    [:octicons-arrow-right-24: Questions](entretiens/workplace-engineer/questions.md) · [:octicons-arrow-right-24: Exercises](entretiens/workplace-engineer/exercices.md)

-   :material-bullseye-arrow:{ .lg .middle } **Product Manager**

    ---

    Product sense, discovery, prioritization and roadmap, metrics and A/B tests, execution with engineering, strategy and estimation, stakeholders.

    *:material-calendar-check: Updated on 2026-11-19*

    [:octicons-arrow-right-24: Questions](entretiens/product-manager/questions.md) · [:octicons-arrow-right-24: Exercises](entretiens/product-manager/exercices.md)

</div>

## Miscellaneous

<div class="grid cards group-misc" markdown>

-   :material-translate:{ .lg .middle } **Common expressions (multilingual)**

    ---

    The most common French expressions, their meaning and their real English equivalent, with an example. Bilingual page.

    *:material-calendar-check: Updated on 2026-11-15*

    [:octicons-arrow-right-24: Open](knowledge/expressions.md)

-   :material-radar:{ .lg .middle } **Tech watch by role**

    ---

    Why, when and how to keep up, and the sources to follow for architects, DevX and platform, QA and developers.

    *:material-calendar-check: Updated on 2026-11-19*

    [:octicons-arrow-right-24: Open](knowledge/veille.md)

</div>
