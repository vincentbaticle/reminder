# DevX Engineer interview: the questions

!!! warning "Disclaimer"
    These notes are personal cheat sheets, not a source of truth. They reflect my own understanding and choices: their content remains subjective, despite the quotes and references it contains. It may be incomplete, simplified, inaccurate or outdated. Always check the official documentation before applying it. This content is provided as is, without any warranty: you use it at your own risk.

!!! audience "Who and what for"
    - **Roles**: DevX engineer, platform engineer, DevOps engineer or SRE aiming at a DevX role, tech lead in charge of tooling, QA engineer moving towards team tooling.
    - **Uses**: I prepare a DevX interview next week and I want the list of questions with an answer outline; the day before the interview, I reread a single theme, like CI; I look for the Knowledge page that explains a notion I want to quote, like the DORA metrics; I prepare one lived story per theme, like a CI I sped up.

This page lists, theme by theme, the questions a DevX Engineer gets asked, worded the way the interviewer says them. For each question, I read the answer outline (a few lines, in the first person), then I open the linked Knowledge section, which holds the full explanation, the examples and the pitfalls. The outline is not something to recite: it structures **a lived story**, with my own numbers (CI minutes saved, setup time, adoption rate). When I have not lived a case, I present it as a scenario and explain my reasoning.

Many DevX questions really mean "tell me about a time you improved developers' daily work": the interviewer expects "I did", not "I would". The live exercises, with corrected configurations, scripts and queries, are in [DevX Engineer interview: the exercises](exercices.md).

## The role and the platform as a product

### "What is Developer Experience, and how does a DevX Engineer differ from a DevOps engineer or an SRE?"

- I define <span class="term" data-term="developer-experience">Developer Experience</span> by its effects: everything between a developer's idea and their code in production (install, understand, test, wait for CI, deploy, find the docs).
- My customer is the developer, not the production server: the SRE protects reliability, the DevOps engineer tools delivery, the <span class="term" data-term="platform-team">platform team</span> provides self-service infrastructure.
- My starting question is different: where do developers lose time or energy, and what would change their day the most?
- I quote the <span class="term" data-term="devex-framework">DevEx framework</span> (Noda, Storey, Forsgren and Greiler, ACM Queue, 2023): feedback loop, cognitive load, flow state.
- Example: first month in a newly created role in a 150-developer organization, I observe, measure and publish three frictions with numbers.

**Read next**: [Inner loop and outer loop](../../knowledge/devx.md#inner-loop-and-outer-loop), [Platform engineering](../../knowledge/devx.md#platform-engineering-the-platform-as-a-product), [SPACE and DevEx](../../knowledge/livraison.md#measuring-developer-experience-space-and-devex), [Team Topologies](../../knowledge/culture-entreprise.md#team-topologies)

### "How do you treat an internal platform as a product?", "When do you create a platform team?"

- I start from the users (developers) and their frequent tasks: create a service, deploy it, read its logs.
- I first ship the smallest useful platform, one that solves a task end to end (Thinnest Viable Platform, "Team Topologies", 2019), rather than ten half-finished features.
- I publish a roadmap and a feedback channel, and I measure voluntary <span class="term" data-term="adoption">adoption</span>, not only availability.
- If a team works around the platform, it is a product signal, not a lack of discipline: I go and see what their scripts do that the tool does not.
- I create a platform team when the infrastructure team gets the same tickets every week ("create a database", "create a repository").

**Read next**: [Platform engineering](../../knowledge/devx.md#platform-engineering-the-platform-as-a-product), [Jobs to be done](../../knowledge/culture-entreprise.md#jobs-to-be-done), [CNCF Platforms White Paper](../../knowledge/textes-fondateurs.md#cncf-platforms-white-paper-2023)

### "How do you find developers' real friction points?", "Our team delivers slowly, how do you find out why?"

- I cross three sources: what developers say (interviews, short survey), what I observe while doing a real task with them, and what the tools measure (CI duration, review wait).
- I observe because many <span class="term" data-term="process-friction">frictions</span> have become invisible: a `.env` copied by hand "is normal".
- I draw a <span class="term" data-term="value-stream-mapping">value stream map</span> (Rother and Shook, "Learning to See", 1999) of a typical change, with work time and wait time.
- I look for the constraint (Goldratt, "The Goal", 1984): often 4 days of waiting out of 5, and CI weighs only a few minutes.
- I put a number on each friction (frequency, duration, people affected) and have the map validated by the teams.

**Read next**: [Value stream mapping](../../knowledge/culture-entreprise.md#value-stream-mapping), [Theory of constraints](../../knowledge/culture-entreprise.md#theory-of-constraints), [Little's law and WIP limits](../../knowledge/culture-entreprise.md#littles-law-and-wip-limits), [Measuring without monitoring people](../../knowledge/devx.md#measuring-without-monitoring-people), [Finding frictions by observation](../../knowledge/devx.md#finding-frictions-by-observation)

## Measuring experience and productivity

### "How do you measure developer experience without monitoring individuals?"

- I measure teams and systems, never people: as soon as a number judges someone, it gets gamed, that is <span class="term" data-term="goodhart-law">Goodhart's law</span> (1975).
- I cross <span class="term" data-term="perceptual-measure">perceptual measures</span> (survey) and system measures (CI duration, review delay), as the <span class="term" data-term="space-framework">SPACE framework</span> recommends (Forsgren et al., ACM Queue, 2021).
- Few indicators, each tied to a possible decision.
- A public charter: what we measure, what for, what we forbid ourselves (commits or lines per person).
- Example: a per-team board in three blocks, delivery flow, feedback loop, perception, shown to the teams before management.

**Read next**: [Measuring without monitoring people](../../knowledge/devx.md#measuring-without-monitoring-people), [SPACE and DevEx](../../knowledge/livraison.md#measuring-developer-experience-space-and-devex), [Goodhart's law](../../knowledge/lois-et-principes.md#goodharts-law), [Avoiding the Goodhart trap](../../knowledge/culture-entreprise.md#avoiding-the-goodhart-trap)

### "What are the DORA metrics, and how do you use them in a DevX approach?"

- The four <span class="term" data-term="dora-metrics">DORA metrics</span> ("Accelerate", 2018, and the State of DevOps reports since 2014): deployment frequency, change <span class="term" data-term="lead-time">lead time</span>, change failure rate, time to restore; recent editions redefine some of them, to check.
- I compute them automatically from the Git forge, the deployment tool and the incident tool, never by manual entry.
- It is a thermometer: it says where things are stuck, not why. I split the lead time into steps (review, CI, wait for deployment).
- I compare a team with itself over time, and I read speed and stability together.
- Example: 6 days of lead time on my-api, 3.7 of them waiting for the weekly deployment [example numbers].

**Read next**: [Measuring delivery: DORA](../../knowledge/livraison.md#measuring-delivery-dora), [Accelerate](../../knowledge/textes-fondateurs.md#forsgren-humble-and-kim-accelerate-2018), [Exercise 5: compute the DORA metrics](exercices.md#exercise-5-compute-the-dora-metrics-from-the-data)

### "How do you design a useful developer survey?"

- A short <span class="term" data-term="developer-survey">survey</span> (under ten minutes), repeated every quarter or half-year with the same questions, to follow a trend.
- Each question maps to a lever (CI, documentation, local environment, interruptions), on a Likert scale (1932) from 1 to 5, plus one or two open questions.
- An <span class="term" data-term="anonymity-threshold">anonymity threshold</span>: no group with fewer than 5 answers is shown.
- A summary published within two weeks, with three actions: a survey without follow-up makes the <span class="term" data-term="survey-response-rate">response rate</span> of the next one drop.
- Example: a 60-question survey with 25% answers becomes 15 questions, relayed by the team leads.

**Read next**: [Measuring without monitoring people](../../knowledge/devx.md#measuring-without-monitoring-people), [Exercise 6: analyse a survey](exercices.md#exercise-6-analyse-a-developer-survey-without-exposing-anyone)

### "How do you put a number on the return on investment of a DevX project?", "How do you know your DevX project was useful?"

- Without a <span class="term" data-term="baseline">baseline</span>, no gain can be shown: I measure before.
- I compute the time recovered (frequency, people, minutes saved), with written assumptions and a caution factor, because not everyone waits in front of the screen.
- Example of a calculation out loud: 120 developers, 4 pipelines a day, 15 minutes saved, so 120 hours a day, about 7 full-time equivalents after caution, for a 4 person-month project [example numbers].
- I compare with the <span class="term" data-term="opportunity-cost">opportunity cost</span> and quote the cost of delay (Reinertsen, 2009) to rank projects.
- Afterwards: the same measure, a guard metric (change failure rate), and the same survey question to check the gain is felt.

**Read next**: [Return on investment](../../knowledge/culture-entreprise.md#return-on-investment), [Cost of delay](../../knowledge/culture-entreprise.md#cost-of-delay), [Measuring success (DevX)](../../knowledge/devx.md#measuring-success), [Proving a tool's value with a pilot](../../knowledge/devx.md#proving-a-tools-value-with-a-pilot)

## The inner loop: workstation and local environment

### "A newcomer needs two days to run the tests, what do you do?", "How do you bring project setup down to a single command?"

- I time the <span class="term" data-term="project-setup">project setup</span> on a fresh machine, noting every blocker.
- I put in the repository what was in people's heads: tool versions read by a <span class="term" data-term="tool-version-manager">version manager</span> like mise, dependencies pinned by a <span class="term" data-term="lockfile">lockfile</span>, local services in Docker Compose.
- I provide `setup` and `doctor`, which says exactly what is missing and how to fix it ("Scripts to Rule Them All", GitHub, 2015).
- A weekly CI job replays the setup on a blank image, so it does not break silently.
- Measurable goal: under 30 minutes from clone to first green test, checked with the next newcomer.

**Read next**: [Setting up a project in one command](../../knowledge/devx.md#setting-up-a-project-in-one-command), [Development tools: mise, uv](../../knowledge/outils.md#developer-tooling-mise-uv-ruff-yarn), [Manifest and lockfile](../../knowledge/gestionnaires-paquets.md#manifest-and-lockfile), [Exercise 3: doctor script](exercices.md#exercise-3-write-a-workstation-diagnostic-script-doctor)

### "How do you speed up the inner loop (edit, build, test)?"

- The <span class="term" data-term="inner-loop">inner loop</span> repeats dozens of times an hour: beyond a few seconds, the developer switches windows (Nielsen, "Response Time Limits", 1993).
- I measure a typical round, then three principles: run only what is touched, keep what is ready (<span class="term" data-term="hot-reload">hot reload</span>, cache, database left running), leave the long checks to the <span class="term" data-term="outer-loop">outer loop</span>.
- Example: my-api rebuilds an image on every try, 2 minutes; with the code mounted as a volume and `uvicorn --reload`, one second; `pytest --lf` reruns only the failing test.
- I document this mode as the default one in `mise run dev`.

**Read next**: [Speeding up the inner loop](../../knowledge/devx.md#speeding-up-the-inner-loop), [Docker Compose and code mounted through a volume](../../knowledge/devx.md#docker-compose-and-code-mounted-through-a-volume)

### "How do you make the local environment close to production without making it heavy?"

- I do not copy production: I look for <span class="term" data-term="dev-prod-parity">parity</span> where gaps already caused bugs (same database engine and version, same language, same migrations), factor X of The Twelve-Factor App (2011).
- Example: SQLite locally, PostgreSQL in production, two bugs in production; I switch to a real PostgreSQL with <span class="term" data-term="testcontainers">Testcontainers</span>, version written in a single place.
- For an external provider, a <span class="term" data-term="service-double">service double</span> checked by <span class="term" data-term="contract-test">contract tests</span>.
- For what does not fit on a laptop, an <span class="term" data-term="ephemeral-environment">ephemeral environment</span> in the cluster.

**Read next**: [Local or remote environment](../../knowledge/devx.md#local-or-remote-environment), [Integration tests with Testcontainers](../../knowledge/qualite.md#integration-tests-with-testcontainers), [Contract tests and API mocks](../../knowledge/qualite.md#contract-tests-and-api-mocks), [The Twelve-Factor App](../../knowledge/textes-fondateurs.md#wiggins-the-twelve-factor-app-2011), [Which environment for which test](../../knowledge/devx.md#which-environment-for-which-test), [Simulating a third party that fails or is slow](../../knowledge/qualite.md#simulating-a-third-party-that-fails-or-is-slow)

### "My image is 1 GB and takes four minutes to rebuild on every change, what do you do?"

- The main problem is the layer order: `COPY . .` before the install invalidates the <span class="term" data-term="docker-layer-cache">layer cache</span> on every change.
- I copy the lockfile first, install, then copy the code; I add a BuildKit cache mount and a `.dockerignore`.
- A <span class="term" data-term="multi-stage-build">multi-stage build</span> gives a `dev` target and a `prod` target, slim, without test tools, with a non-root user.
- I measure build time and size before and after, then I put this Dockerfile in the service template.

**Read next**: [Multi-stage image](../../knowledge/kubernetes.md#multi-stage-image-fast-to-rebuild-light-in-production), [Exercise 2: Dockerfile](exercices.md#exercise-2-make-a-dockerfile-quick-to-rebuild)

## The outer loop: CI/CD

### "Our CI takes 30 minutes, where do you start?", "How do you halve the duration of a CI?"

- I measure first: each job's duration at p50 and <span class="term" data-term="p95">p95</span>, runner wait, <span class="term" data-term="critical-path">critical path</span>, rerun rate.
- Only the critical path sets the duration (theory of constraints, Goldratt, 1984): I remove waiting before optimizing a job.
- Then `needs` to parallelize, a cache keyed on the lockfile, test <span class="term" data-term="test-shard">shards</span>, and `rules: changes` to run only what is needed.
- Example: 28 minutes in series become about 5 minutes of critical path [example numbers].
- I watch order-dependent tests for two weeks, then turn it into a shared component; Fowler ("Continuous Integration", 2000, revised in 2024) quotes a target of about ten minutes.

**Read next**: [A fast and reliable CI](../../knowledge/devx.md#a-fast-and-reliable-ci), [Parallelizing without breaking](../../knowledge/qualite.md#parallelising-without-breaking-things), [Theory of constraints](../../knowledge/culture-entreprise.md#theory-of-constraints), [Exercise 1: CI pipeline](exercices.md#exercise-1-halve-the-duration-of-a-ci-pipeline)

### "What do you do with a flaky test?", "How do you handle flaky tests at organization scale?"

- A <span class="term" data-term="flaky-test">flaky test</span> costs twice: reruns, and teams that learn to ignore red.
- I define it as a test that fails and passes on the same commit, and I detect it automatically from stored JUnit reports.
- I put it in <span class="term" data-term="test-quarantine">quarantine</span>: it still runs but no longer blocks, with a ticket, an owning team and a deadline (Micco, Google Testing Blog, 2016).
- No silent automatic retry as a lasting fix.
- I publish an indicator (pipelines failed because of a flaky test) and I praise the teams that fix theirs.

**Read next**: [Flaky test](../../knowledge/qualite.md#flaky-test), [Strategy for a flaky test](../../knowledge/qualite.md#strategy-for-a-flaky-test), [Keeping the history](../../knowledge/qualite.md#keeping-the-history), [Exercise 4: flaky tests](exercices.md#exercise-4-detect-and-quarantine-flaky-tests), [Quarantining without blocking](../../knowledge/qualite.md#quarantining-without-blocking)

### "How do you provide reusable CI templates without blocking teams?"

- A template that covers the common case with no configuration: a Python repository includes it in three lines and gets lint, tests, security scan and image.
- I publish it as a <span class="term" data-term="versioned-component">versioned component</span>, with <span class="term" data-term="semantic-versioning">SemVer</span> (specification 2.0.0, 2013): each team chooses when to move to the next major.
- Parameters for frequent variations, so nobody needs to copy the template.
- Example: 40 diverging copies of a `.gitlab-ci.yml` become one component, migrated on 5 pilot repositories, then through automatic MRs with Renovate.
- A flaw in the base image is then fixed once, for everyone.

**Read next**: [Shared, versioned CI component](../../knowledge/devx.md#shared-versioned-ci-component), [SemVer](../../knowledge/devx.md#semver-the-contract-of-an-internal-library-cli-or-component), [CI/CD: GitLab CI, Renovate](../../knowledge/outils.md#cicd-and-code-quality-gitlab-ci-sonarqube-renovate)

### "How do you keep dependencies up to date without spending your life on it?"

- A <span class="term" data-term="dependency-update-bot">dependency update bot</span> (Renovate) opens the MRs, CI checks them.
- Automatic merge of green patches, planned majors, and an indicator of majors lagging behind.
- The lockfile is committed, and CI installs exactly what it says (`uv sync --frozen`, `npm ci`).
- On the security side: a single registry, hashes in the lockfile, a minimum delay before adopting a brand-new version.

**Read next**: [Updating dependencies](../../knowledge/gestionnaires-paquets.md#updating-dependencies), [Manifest and lockfile](../../knowledge/gestionnaires-paquets.md#manifest-and-lockfile), [Securing the install](../../knowledge/gestionnaires-paquets.md#securing-installation)

### "The product owner waits for staging to validate screens, what do you propose?"

- I first check who uses these environments, and what for.
- One <span class="term" data-term="preview-environment">preview environment</span> per MR, created by CI, its address posted in the MR, destroyed on merge or after five days without a commit.
- At first, the front end only, plugged into the APIs of the <span class="term" data-term="integration-env">integration environment</span>, without duplicating the whole system.
- The real difficulties: fake seed data, test secrets separate from production, a cost cap.
- I measure the product owner's late feedback, and extend to the most requested back ends if the need is confirmed.

**Read next**: [Preview environment per merge request](../../knowledge/devx.md#preview-environment-per-merge-request), [Environments](../../knowledge/kubernetes.md#environments), [Which environment for which test](../../knowledge/devx.md#which-environment-for-which-test)

## Golden paths, scaffolding and self-service

### "What is a golden path, and how do you build one?", "Golden path or enforced rule?"

- A <span class="term" data-term="golden-path">golden path</span> (Spotify Engineering, 2020) is the tooled answer to "how do we do ... here".
- I build it for the most common case (a Python HTTP service with PostgreSQL), end to end: template, ready CI, deployment, dashboards and basic alerts.
- I make it easier than the alternatives, without enforcing it: a team can leave it by taking on the cost of its difference (paved road).
- I give it an owner: an unmaintained paved road becomes a trap.
- Example: creating a service goes from three weeks to a deployment in integration the same day.

**Read next**: [Golden paths and templates](../../knowledge/devx.md#golden-paths-and-templates), [Platform engineering](../../knowledge/devx.md#platform-engineering-the-platform-as-a-product)

### "How do you keep a service template from ageing the day it is created?"

- I put the minimum in the template and the maximum in shared, versioned building blocks (CI component, base image, logging library): updates arrive through a version bump.
- For the generated part, a <span class="term" data-term="scaffolding">scaffolding</span> tool that can update, like Copier (`copier update`) or cruft for cookiecutter.
- The template's CI generates a project and runs its tests on every change.
- I measure the <span class="term" data-term="template-drift">drift</span>: the share of services up to date, shown in the catalogue.

**Read next**: [Golden paths and templates](../../knowledge/devx.md#golden-paths-and-templates), [Exercise 7: template and drift](exercices.md#exercise-7-test-a-service-template-and-track-its-drift)

### "How do you offer self-service infrastructure without losing control?"

- I start from the tickets: which requests come back, how long they wait.
- For the most frequent ones (database, bucket, secret), a standard <span class="term" data-term="infrastructure-as-code">infrastructure as code</span> module with the right defaults (encryption, backups, cost labels).
- Human approvals become automatic <span class="term" data-term="guardrail">guardrails</span> in <span class="term" data-term="policy-as-code">policy as code</span> (Open Policy Agent, graduated at the CNCF in 2021): a database without backups is rejected by CI.
- Each resource has an owning team and a visible cost.
- Example: getting a database goes from eight days to under an hour [example numbers].

**Read next**: [Platform engineering](../../knowledge/devx.md#platform-engineering-the-platform-as-a-product), [Terraform and OpenTofu](../../knowledge/outils.md#terraform-and-opentofu-the-declarative-standard), [Crossplane](../../knowledge/outils.md#crossplane-infrastructure-driven-by-kubernetes)

### "How do you evolve an internal library, SDK or CLI without breaking its users?"

- Every <span class="term" data-term="breaking-change">breaking change</span> is expensive, because I have users I do not all know (Hyrum's law).
- The <span class="term" data-term="open-closed">open/closed</span> principle becomes an <span class="term" data-term="extension-point">extension point</span>: a team writes a plugin instead of changing the core.
- Small, focused modules, injectable dependencies, <span class="term" data-term="sensible-default">sensible defaults</span> and the principle of <span class="term" data-term="least-astonishment">least astonishment</span>.
- SemVer as a contract, an `--output json` treated as an API, and a <span class="term" data-term="deprecation">deprecation policy</span>: a warning for two minors, removal in a major.
- Example: a `devctl` CLI with 80 options and one request a week moves to a plugin system.

**Read next**: [SemVer](../../knowledge/devx.md#semver-the-contract-of-an-internal-library-cli-or-component), [O: open/closed](../../knowledge/principes-conception.md#o-openclosed), [Component principles](../../knowledge/principes-conception.md#component-principles), [Principle of least astonishment](../../knowledge/principes-conception.md#principle-of-least-astonishment), [Hyrum's law](../../knowledge/lois-et-principes.md#hyrums-law), [Extension points through plugins](../../knowledge/principes-conception.md#extension-points-through-plugins)

### "What do you do when a team wants to leave the golden path?"

- I start by understanding: a request to deviate is often a <span class="term" data-term="product-signal">product signal</span>.
- I separate the non-negotiable (security, secrets, deployment traceability) from what can vary (language, framework).
- The team that leaves takes on the <span class="term" data-term="cost-of-difference">cost of its difference</span>: its CI, its updates, its on-call documentation.
- I write the deviation down in an ADR (Nygard, 2011); if three teams ask for the same deviation, it joins the path.
- Example: a Go service for 5,000 messages per second, accepted with its common obligations.

**Read next**: [Golden paths and templates](../../knowledge/devx.md#golden-paths-and-templates), [Designing before coding](../../knowledge/livraison.md#design-before-coding), [Tech radar](../../knowledge/outils.md#tech-radar-thoughtworks-byor-zalando-aoe-cncf), [Waivers and the target architecture](../../knowledge/architecture.md#waivers-and-the-target-architecture)

## Developer portal and documentation

### "Should we set up a developer portal like Backstage?"

- I start from the unanswered questions: who owns this service, where are its docs, how do I create a service?
- A <span class="term" data-term="developer-portal">developer portal</span> pays off from a few dozen services; Backstage (Spotify, open source in 2020) is an application to keep alive, with a team.
- I start with the <span class="term" data-term="service-catalog">service catalogue</span>, filled automatically by one `catalog-info.yaml` per repository, checked by CI: a wrong catalogue is worse than none.
- I measure usage (visits, searches without results, services without an owner) before adding plugins, and compare with the <span class="term" data-term="total-cost-ownership">total cost</span> of a commercial portal.

**Read next**: [Developer portal and catalogue](../../knowledge/devx.md#developer-portal-and-catalogue), [Collaboration: Backstage](../../knowledge/outils.md#collaboration-jira-confluence-slack-backstage), [Total cost of ownership](../../knowledge/culture-entreprise.md#total-cost-of-ownership)

### "How do you treat documentation as a product?", "You get the same questions every week in the help channel, what do you do?"

- I start from the real questions in the support channel: over a month, the twenty most frequent.
- I put the technical docs in the repository, as <span class="term" data-term="docs-as-code">docs as code</span>: changed in the same MR as the code, reviewed, published by CI.
- I separate page types with <span class="term" data-term="diataxis">Diátaxis</span> (Procida, from about 2017): tutorial, how-to guide, reference, explanation.
- I measure pages read, searches without results and freshness, and I delete what is wrong: a wrong page does more harm than a missing one.

**Read next**: [Documentation](../../knowledge/devx.md#documentation)

### "How do you shorten a newcomer's onboarding?"

- Two measures: the <span class="term" data-term="time-to-first-change">time to first change</span> in production, and how the newcomer feels after thirty days.
- I remove blockers one by one: access created automatically by team, machine set up by script, each project startable in one command.
- A list of small real tasks and a buddy for the <span class="term" data-term="onboarding">onboarding</span>.
- Each newcomer fixes the docs that blocked them: they are the best placed to see what is missing.
- Example: from three weeks to an MR merged in production within the first three days [example numbers].

**Read next**: [Onboarding](../../knowledge/devx.md#onboarding), [Setting up a project in one command](../../knowledge/devx.md#setting-up-a-project-in-one-command)

## Adoption, migrations and deprecations

### "How do you get a tool adopted without imposing it?", "Your tool is used by only three teams out of twenty, what do you do?"

- A developer adopts a tool when they gain something from the first use: I start from a felt problem.
- I start with <span class="term" data-term="early-adopters">volunteer teams</span>, then cross the chasm to the majority (Rogers, 1962; Moore, "Crossing the Chasm", 1991) with peer testimony.
- I lower the <span class="term" data-term="switching-cost">switching cost</span>: a generated migration MR beats a twenty-page guide; I put the tool in the template.
- I talk to five teams that do not use it, without trying to convince them, and fix the most frequent blocker.
- I follow active teams every month through anonymous, per-team <span class="term" data-term="usage-telemetry">usage telemetry</span>.

**Read next**: [Getting a tool adopted without imposing it](../../knowledge/devx.md#getting-a-tool-adopted-without-imposing-it), [Exercise 9: CLI telemetry](exercices.md#exercise-9-measure-the-usage-of-an-internal-cli-without-monitoring-developers), [Influence without authority and communities of practice](../../knowledge/culture-entreprise.md#influence-without-authority-and-communities-of-practice), [Usage telemetry for an internal tool or CLI](../../knowledge/devx.md#usage-telemetry-for-an-internal-tool-or-cli)

### "How do you retire an internal tool still used by many teams?"

- I inventory the usages through the syntax tree and call logs; <span class="term" data-term="hyrum-law">Hyrum's law</span> guarantees unexpected ones.
- I make sure the replacement covers the real cases, then announce a schedule: warning on import, freeze of new usages through a <span class="term" data-term="lint-rule">lint rule</span>, shutdown.
- A <span class="term" data-term="codemod">codemod</span> opens the MRs for the common cases, and I help the last ones directly.
- The team retiring the tool bears the migration cost ("Software Engineering at Google", 2020, chapter "Deprecation"); a public board shows the remaining repositories.

**Read next**: [Large-scale migrations](../../knowledge/devx.md#large-scale-migrations), [SemVer and deprecation](../../knowledge/devx.md#semver-the-contract-of-an-internal-library-cli-or-component), [Strangler Fig](../../knowledge/textes-fondateurs.md#fowler-strangler-fig-application-2004), [Exercise 8: retiring a library](exercices.md#exercise-8-prepare-the-removal-of-an-internal-library), [Freezing new usages of a deprecated module](../../knowledge/devx.md#freezing-new-usages-of-a-deprecated-module), [Usage telemetry for an internal tool or CLI](../../knowledge/devx.md#usage-telemetry-for-an-internal-tool-or-cli)

### "How do you move 300 repositories to a new version without spending a year on it?"

- At this scale, a migration is a program, not an instruction: a script or codemod makes the change, a tool opens one MR per repository.
- I test on about ten representative repositories, then run in waves so as not to flood CI or reviewers.
- I run a <span class="term" data-term="migration-campaign">campaign</span> with a board per repository (MR open, CI green, merged) and group failures by cause to fix the tool, not each repository.
- For the version part, Renovate is often enough; the tail of the migration needs individual help.
- Example: Python 3.9 to 3.12 on 300 repositories before the end of support.

**Read next**: [Large-scale migrations](../../knowledge/devx.md#large-scale-migrations), [Codemod example](../../knowledge/devx.md#codemod-example-changing-an-import-in-48-repositories), [Updating dependencies](../../knowledge/gestionnaires-paquets.md#updating-dependencies)

## AI coding assistants

!!! info "Section written in November 2026"
    AI tools for code, their terms of use and the studies on their effects change very fast. Numbers and tool names are to be checked at the time of reading.

### "How would you roll out an AI coding assistant to the teams?"

- First the frame, with security and legal: data sent to the provider, used or not for <span class="term" data-term="model-training">training</span>, <span class="term" data-term="secret">secrets</span> in the code, rights of an agent that runs commands.
- A one-page <span class="term" data-term="ai-usage-policy">usage policy</span>: forbidden data, mandatory human review, a service account with limited rights.
- A pilot of a few weeks with varied teams (not only the enthusiasts) and a baseline.
- Concrete training per language, and instruction files in the repositories (`AGENTS.md`), useful to humans too.
- Same rules as before: all merged code is reviewed and passes CI; I watch MR size.

**Read next**: [AI coding assistants](../../knowledge/devx.md#ai-coding-assistants), [Writing an effective instructions file](../../knowledge/ia-agents.md#writing-an-effective-instructions-file), [What the AI Act changes for a dev team](../../knowledge/ia-entreprise.md#what-it-changes-for-a-dev-and-qa-team), [Exercise 10: AI assistant](exercices.md#exercise-10-case-study-rolling-out-an-ai-coding-assistant), [Proving a tool's value with a pilot](../../knowledge/devx.md#proving-a-tools-value-with-a-pilot)

### "How do you measure the real effect of AI assistants, without monitoring people?"

- I do not stop at the suggestions' <span class="term" data-term="acceptance-rate">acceptance rate</span>: it is an activity measure, provided by the vendor.
- I measure the flow (lead time, failure rate, MR size, review time) and perception, before and after, with a <span class="term" data-term="comparison-group">comparison group</span>.
- I quote both studies with their caveats: about 55% faster on an isolated task (Peng et al., preprint, 2023) [Take with caution: a single task, authors linked to the vendor]; 19% slower while developers thought they were faster (METR, July 2025) [Take with caution: 16 developers, early-2025 tools].
- For usage, per-team counters without content, knowing that an "anonymous" mode is often pseudonymization.
- No external number replaces a measure on our own flow, especially before a hiring decision.

**Read next**: [AI coding assistants](../../knowledge/devx.md#ai-coding-assistants), [Measuring an AI assistant's usage in a team](../../knowledge/ia-entreprise.md#measuring-ai-assistant-usage-in-a-team), [Anonymization or pseudonymization](../../knowledge/ia-entreprise.md#why-anonymous-mode-is-actually-pseudonymisation), [Deciding with data](../../knowledge/donnees-decision.md#deciding-with-data)

## Vision of the DevX Engineer role

### "What would you do in your first three months?"

- Month 1, understand: about twenty interviews, three observations, a survey, a first flow map and a published <span class="term" data-term="baseline">baseline</span>; I make a contribution myself in a few repositories.
- Month 2, prove: one or two <span class="term" data-term="quick-win">quick wins</span>, visible and low-risk, like a cache in the most used CI template.
- Month 3, set the direction: a roadmap of three to five projects with numbers, including what I will not do, validated by the teams and management.
- I group the request lists instead of handling them one by one (Watkins, "The First 90 Days", 2003).

**Read next**: [Measuring without monitoring people](../../knowledge/devx.md#measuring-without-monitoring-people), [Value stream mapping](../../knowledge/culture-entreprise.md#value-stream-mapping), [One-pager](../../knowledge/culture-entreprise.md#one-pager), [The first 90 days in a new role](../../knowledge/culture-entreprise.md#the-first-90-days-in-a-new-role)

### "How do you prioritize when everyone has a request for the DevX team?"

- I group requests into common problems, then rank them by impact (developers affected, frequency, time lost) and size.
- A shared criterion: the <span class="term" data-term="cost-of-delay">cost of delay</span> divided by duration (CD3, or WSJF in SAFe).
- I reserve a share of <span class="term" data-term="reserved-capacity">capacity</span>, for example 20%, for support and maintenance.
- I often prefer helping a team become autonomous, as an <span class="term" data-term="enabling-team">enabling team</span>, rather than taking everything on.
- I publish the prioritization board, refusals included, with the date of the next review.

**Read next**: [Cost of delay](../../knowledge/culture-entreprise.md#cost-of-delay), [Team Topologies](../../knowledge/culture-entreprise.md#team-topologies), [Little's law and WIP limits](../../knowledge/culture-entreprise.md#littles-law-and-wip-limits)

## Tool choices

!!! info "Section written in November 2026"
    The features and maturity of the tools quoted change fast. I check their official documentation before recommending them.

### "Monorepo or several repositories, and with which build tool?"

- I do not decide on principle: I look at how often changes span several projects and how many languages there are.
- A <span class="term" data-term="monorepo">monorepo</span> makes a cross-cutting change atomic and keeps a single version of each dependency, but it requires a CI that rebuilds only what is touched, a <span class="term" data-term="remote-build-cache">remote build cache</span> and a <span class="term" data-term="codeowners">CODEOWNERS</span> file.
- The simplest that is enough: workspaces then Nx or Turborepo in JavaScript, Bazel or Pants for multi-language with a <span class="term" data-term="hermetic-build">hermetic build</span> and a team to maintain them.
- I migrate in steps (one library and two pilot applications) and measure the delay between a library change and its arrival in production.
- The repository structure ends up mirroring the team structure (Conway's law, 1968).

**Read next**: [Monorepo and workspaces](../../knowledge/gestionnaires-paquets.md#monorepo-and-workspaces), [Conway's law](../../knowledge/lois-et-principes.md#conways-law), [Monorepo or several repositories: how to decide](../../knowledge/gestionnaires-paquets.md#monorepo-or-several-repositories-how-to-decide)

### "Local or remote development environment: how do you choose?"

- I start from the problem and take the lightest option that is enough.
- Different tool versions: a version manager like mise is enough.
- Many system services: a <span class="term" data-term="devcontainer">Dev Container</span> (open specification containers.dev, 2022) describes the environment in the repository.
- Data that must not leave the cloud, underpowered machines: a <span class="term" data-term="remote-dev-environment">remote environment</span> based on the same Dev Container, with automatic shutdown for cost.
- Bit-for-bit reproducibility and a team at ease with it: <span class="term" data-term="nix">Nix</span>, at the price of a steep learning curve.

**Read next**: [Local or remote environment](../../knowledge/devx.md#local-or-remote-environment)

### "Build an internal tool, take open source or buy a SaaS?", "How does your company choose its technologies?"

- First question: does this tool set us apart? CI, a portal or feature flags almost never do; a component that became a commodity is bought (Wardley maps, 2005).
- I compare <span class="term" data-term="saas">SaaS</span> and self-hosted <span class="term" data-term="open-source">open source</span> over three years, human time included (maintenance, security, on-call).
- A home-made tool only for a truly specific need, knowing it will need maintenance for years.
- Open formats to keep an exit door, like <span class="term" data-term="openfeature">OpenFeature</span> (CNCF project since 2022) for feature flags.
- For technology choices, a company radar with its four rings and a justification for each entry.

**Read next**: [Build, buy or partner](../../knowledge/culture-entreprise.md#build-buy-or-partner), [Wardley maps](../../knowledge/culture-entreprise.md#wardley-maps), [Total cost of ownership](../../knowledge/culture-entreprise.md#total-cost-of-ownership), [Feature flags: Unleash](../../knowledge/outils.md#feature-flags-unleash), [Tech radar](../../knowledge/outils.md#tech-radar-thoughtworks-byor-zalando-aoe-cncf), [Company tech radar](../../knowledge/architecture.md#company-tech-radar), [Vendor lock-in, a cost to price](../../knowledge/culture-entreprise.md#vendor-lock-in-a-cost-to-price), [OpenFeature: switching flag tools without touching the code](../../knowledge/outils.md#openfeature-switching-flag-tools-without-touching-the-code)

## Elimination criteria

Three questions where a single wrong answer is enough to rule out a DevX candidate.

| Interviewer's question | Answer that eliminates | What I answer | Read next |
|---|---|---|---|
| "What do you answer if you are asked to rank developers by productivity?" | "I can pull the number of commits and lines per person from Git." | I refuse the individual ranking and explain why: the person on call or the one onboarding newcomers would land at the bottom, and <span class="term" data-term="goodhart-law">Goodhart's law</span> would get the number gamed. I propose per-team measures and escalate the request in writing if it is maintained. | [Measuring without monitoring people](../../knowledge/devx.md#measuring-without-monitoring-people), [Goodhart's law](../../knowledge/lois-et-principes.md#goodharts-law) |
| "What do you do if nobody uses the tool you built?" | "I ask management to make it mandatory", or "the teams do not see its value". | It is my problem, not the teams': I talk to those who do not use it, fix the main blocker or bring the information where they already are, and I know how to archive a tool that is not used. | [Getting a tool adopted without imposing it](../../knowledge/devx.md#getting-a-tool-adopted-without-imposing-it), [Jobs to be done](../../knowledge/culture-entreprise.md#jobs-to-be-done) |
| "Should a tool be made mandatory to speed up its adoption?" | "Yes, it is the fastest", or "never, each team does as it likes". | A mandate is legitimate for security and compliance (dependency scanning, secrets), made easy to follow; voluntary adoption for comfort tools; the mandate comes at the end, as an announced deprecation of the old tool. | [Getting a tool adopted without imposing it](../../knowledge/devx.md#getting-a-tool-adopted-without-imposing-it), [Large-scale migrations](../../knowledge/devx.md#large-scale-migrations) |

## The 3 things a DevX Engineer always does

1. **Start from real, measured frictions.** I observe, ask and measure before building. Example: before speeding up CI, I split the lead time and find that waiting for the weekly deployment weighs more than CI.
2. **Make the right path easier than the others.** Templates, CI templates, ready environments and reliable docs: the good practice becomes the simplest one. Example: the logging configuration moves into a versioned library rather than a written instruction.
3. **Treat the platform as a product and check its effect.** I measure adoption, satisfaction and effect on the flow, I listen to those who do not adopt, and I know how to stop what is not used. Example: after an AI assistant, I compare the pilot teams' lead time and failure rate with their previous numbers.

## A simple structure for answering out loud

For a behavioural question ("tell me about a time..."), I follow the <span class="term" data-term="star-method">STAR method</span>: the situation, the task that was mine, the action I took, the result with numbers, then what I learned ([Disagree and commit](../../knowledge/culture-entreprise.md#disagree-and-commit)). For a scenario question, I follow this thread:

1. **Users**: which developers hit which friction, how often?
2. **Measure**: what is the starting number (minutes, days, rate, survey score)?
3. **Options**: which solutions, from the lightest to the heaviest?
4. **Decision**: why this one, and what I do not do.
5. **Adoption**: how teams will discover it, try it and migrate.
6. **Result**: how I check the friction really went down.
7. **Wider benefits**: what the approach improves beyond the immediate problem.

The core idea: a DevX Engineer does not build tools for their own sake. They treat developers' daily work as a product, measure frictions, make the right path easier, support adoption without imposing it, and check that the teams' work is actually better for it.

## Measuring success

I almost always get asked "how do you know it helped?". My answer has the same shape for every project: a **baseline** measured before (for example the CI duration at p95 over the last two weeks), the **same measure after**, over a comparable period, and a **guard metric** that must not get worse (the change failure rate, or the pipeline rerun rate). Then I give, per solution, an <span class="term" data-term="sli">SLI</span> and an internal <span class="term" data-term="slo">SLO</span>; an <span class="term" data-term="sla">SLA</span> makes no sense here, since developers are not customers under contract.

| Solution | Success indicator (SLI) | Likely SLO | Likely SLA |
|---|---|---|---|
| faster CI (`needs`, cache, shards) | pipeline duration at p95, read in CI | under 10 minutes for 95% of `main` pipelines [Take with caution: example value, to set per repository] | n/a: no external contract |
| one-command setup | time from clone to first green test, timed with each newcomer | under 30 minutes for 9 newcomers out of 10 [Take with caution: example value] | n/a: no external contract |
| flaky test quarantine | share of pipelines failed because of a flaky test | under 2% over a rolling 14 days [Take with caution: example threshold, to set by the organization] | n/a: no external contract |
| golden path for creating a service | delay from request to first deployment in integration | same day for 90% of the services created [Take with caution: example value] | n/a: no external contract |
| docs as code | repeated questions per week in the help channel | half as many as before, over a quarter [Take with caution: example value] | n/a: no external contract |
| adoption of an internal tool | active teams per month, read in the anonymous telemetry | 15 teams out of 20 within six months [Take with caution: example value] | n/a: no external contract |
| AI coding assistant | median lead time of the pilot teams, compared with the group without the tool | going down, with a stable change failure rate [Take with caution: example goal, no external study sets a value] | n/a: no external contract |

## Pitfalls to avoid

| Pitfall | What happens | Solution |
|---|---|---|
| **Starting with the tool**: I answer "Backstage" or "Bazel" before talking about the users. | The interviewer hears someone who follows hype, not someone who solves a problem. | I first name the friction and its number, then the lightest tool that is enough ([Structure for answering](#a-simple-structure-for-answering-out-loud)). |
| **Forgetting the baseline**: I propose a project without saying where I start from. | I cannot prove the gain, so the answer sounds theoretical. | I quote a baseline, the same measure after and a guard metric ([Measuring success](#measuring-success)). |
| **Measuring people**: I accept a per-developer indicator to please management. | Elimination criterion: I lose the teams' trust and the numbers get gamed. | I measure teams and systems, with a public charter ([Elimination criteria](#elimination-criteria)). |
| **Mandating to go fast**: I propose to make the tool mandatory from day one. | Workarounds, resentment, and a visible adoption failure. | Voluntary adoption, then an announced deprecation of the old tool ([Adoption](#adoption-migrations-and-deprecations)). |
| **Answering in the conditional**: I say "I would" without any lived story. | The answer sounds like a page learned by heart, with no proof of experience. | I prepare one STAR story per theme, with my numbers ([Structure for answering](#a-simple-structure-for-answering-out-loud)). |
| **Believing the vendor's number**: I quote "55% more productivity" without qualifying it. | I show that I decide on a marketing number. | I give the source, its limit, and propose a measure on our own flow ([AI coding assistants](#ai-coding-assistants)). |
| **Reciting a framework without its limit**: I quote SPACE or DORA like a recipe. | The interviewer digs in and the answer collapses. | I give the framework, an example, then what it does not measure, like DORA saying where but not why ([Measuring experience](#measuring-experience-and-productivity)). |
