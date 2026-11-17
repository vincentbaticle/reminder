# Staff Engineer interview: the questions

!!! warning "Disclaimer"
    These notes are personal cheat sheets, not a source of truth. They reflect my own understanding and choices: their content remains subjective, despite the quotes and references it contains. It may be incomplete, simplified, inaccurate or outdated. Always check the official documentation before applying it. This content is provided as is, without any warranty: you use it at your own risk.

!!! audience "Who and what for"
    - **Roles**: senior developer aiming for a Staff role, Staff or Principal Engineer, tech lead, software architect, quality or platform engineer working with several teams.
    - **Uses**: I prepare a Staff interview and want the list of questions asked, theme by theme; the day before an interview, I reread the answer outline of a question like "what do you do if a team ignores your recommendations?"; I look for the Knowledge section to reread for a precise technical question, like the idempotency of a payment; I check that I have a lived story for each theme.

This page lists the questions asked in a Staff Engineer interview, grouped by theme, as the interviewer phrases them. For each one, I give a short first-person answer outline, then the Knowledge sections that hold the full answer.

How I use it:

1. I read the answer outline, without trying to recite it.
2. I open the section linked in **Read next** when a notion is missing.
3. I prepare a lived story for each theme: the situation, what I did myself, the result with a number. Many Staff questions are really "tell me about a time when you...", and the interviewer expects "I did", not "I would".
4. I then practice on the [live exercises](exercices.md), which ask for code, a design or a case study in front of the interviewer.

The role overlaps with the software architect one: technical decisions, <span class="term" data-term="adr">ADRs</span>, consistency between services, reliability. The [Software Architect](../software-architect/questions.md) page goes further on design trade-offs and distributed systems.

## Architecture and technical decisions

### "How do you choose between two technically viable architectures?"

*Also asked as: "How do you document an architecture decision?", "The business wants a 'fast and reliable' system, what do you do?"*

I first clarify the need and the real constraints, then I compare the options on shared criteria (security, performance, cost, maintainability) rather than on my preferences. I turn vague adjectives into scenarios with numbers, the way <span class="term" data-term="atam">ATAM</span> does (Software Engineering Institute, 2000). If an uncertainty can change the decision, I remove it with a measurement or a <span class="term" data-term="prototype">prototype</span>. I decide fast on what is reversible and slowly on what is not (type 1 and type 2 decisions, Amazon's 2015 shareholder letter). I write an ADR (Michael Nygard, 2011) with the rejected options, the <span class="term" data-term="accepted-risk">accepted risks</span> and the condition that would reopen the choice. Example: for a bank balance, a short cache for display, but a read from the <span class="term" data-term="source-of-truth">source of truth</span> before any transfer.

**Read next**: [Architecture: ADR](../../knowledge/architecture.md#adr), [Architecture: Quality scenarios, utility tree and ATAM](../../knowledge/architecture.md#quality-scenarios-utility-tree-and-atam), [Company culture: Type 1 and type 2 decisions](../../knowledge/culture-entreprise.md#type-1-and-type-2-decisions), [Architecture: Fitness functions](../../knowledge/architecture.md#fitness-functions), [Architecture: Where to put a cache](../../knowledge/architecture.md#where-to-put-a-cache)

### "How do you trade off an elegant solution against a fast delivery?"

I ask what the date protects (a customer commitment, a regulatory constraint, a preference) and what a delay would cost. I separate what is essential from the <span class="term" data-term="structural-improvement">structural improvement</span> that can wait. A shortcut is acceptable if it is tested, bounded and its future cost is written down, never at the cost of security or <span class="term" data-term="data-integrity">data integrity</span>. Example: a refund calculation copied in three controllers; I first write <span class="term" data-term="characterization-test">characterization tests</span> (Michael Feathers, "Working Effectively with Legacy Code", 2004) that compare the three, and if the amounts already differ, it is a production bug to fix before the release. Martin Fowler's technical debt quadrant (2009) helps me say whether the debt is prudent and deliberate.

**Read next**: [Designing tests: Characterization tests and golden master](../../knowledge/conception-tests.md#characterization-tests-and-golden-master), [Design principles: Technical debt](../../knowledge/principes-conception.md#technical-debt), [Design principles: YAGNI and rule of three](../../knowledge/principes-conception.md#yagni-and-rule-of-three)

### "When should you create a library shared by several teams?"

I do not share code because it looks alike: I check that the business rules and their pace of change are really common. I often wait for the third case, the <span class="term" data-term="rule-of-three">rule of three</span> (Don Roberts, quoted in "Refactoring", 1999). If I share, I set a stable interface, <span class="term" data-term="semantic-versioning">SemVer</span> versioning (specification 2.0.0, 2013), an owner and an <span class="term" data-term="innersource">InnerSource</span> contribution model. Otherwise, a bounded duplication costs less than a shared dependency nobody dares to change.

**Read next**: [Design principles: Component principles](../../knowledge/principes-conception.md#component-principles), [Design principles: DRY, WET and AHA](../../knowledge/principes-conception.md#dry-wet-and-aha), [DevX: SemVer: the contract of an internal library, CLI or component](../../knowledge/devx.md#semver-the-contract-of-an-internal-library-cli-or-component), [Company culture: InnerSource](../../knowledge/culture-entreprise.md#innersource)

### "How do you apply design principles at the level of components and services?"

The principles of a class hold for a module or a service, at another scale: high <span class="term" data-term="cohesion">cohesion</span>, low <span class="term" data-term="coupling">coupling</span>, and a module only knows the other one's contract. For libraries, I rely on Robert C. Martin's component principles ("Clean Architecture", 2017): no dependency cycle, and dependencies point towards what is more stable. Between services, dependency inversion takes the form of a published contract or an event. The warning sign I watch for is the <span class="term" data-term="distributed-monolith">distributed monolith</span>: two services that call each other and must ship on the same day.

**Read next**: [Design principles: Component principles](../../knowledge/principes-conception.md#component-principles), [Design principles: Separation of concerns, cohesion and coupling](../../knowledge/principes-conception.md#separation-of-concerns-cohesion-and-coupling), [Architecture: Bounded context and ubiquitous language](../../knowledge/architecture.md#bounded-context-and-ubiquitous-language), [Quality: Contract tests and API mocks](../../knowledge/qualite.md#contract-tests-and-api-mocks)

### "How do you deal with technical debt that slows down several teams?"

*Also asked as: "How do you talk about technical debt to the Product Owner?", "How do you convince management to fund a redesign?"*

I measure the impact before judging the design: which changes the debt slows down, which incidents it causes, how many teams it touches. I only bring up debt in areas that change often, and I prioritize with the <span class="term" data-term="cost-of-delay">cost of delay</span> (Don Reinertsen, 2009). In front of management, I give the conclusion first, the cost of "doing nothing" and a repayment in slices, not a big-bang redesign. Example: four teams patch an old authentication library by hand; a <span class="term" data-term="golden-path">golden path</span> and a dependency update bot remove that repeated work.

**Read next**: [Design principles: Technical debt](../../knowledge/principes-conception.md#technical-debt), [Company culture: Cost of delay](../../knowledge/culture-entreprise.md#cost-of-delay), [Company culture: Presenting a technical trade-off in business terms](../../knowledge/culture-entreprise.md#presenting-a-technical-trade-off-in-business-terms), [Package managers: Updating dependencies](../../knowledge/gestionnaires-paquets.md#updating-dependencies)

### "How do you evolve an architecture without blocking development?"

*Also asked as: "Full rewrite or progressive redesign?"*

I clarify why the architecture has to change, the target state and who depends on what exists. I move in steps compatible with the ongoing releases: a facade, then a progressive move of features with the <span class="term" data-term="strangler-fig">strangler fig</span> (Martin Fowler, 2004) or <span class="term" data-term="branch-by-abstraction">branch by abstraction</span> (Paul Hammant, 2007). Each step is testable, observable and reversible. I remove the old system only once its last usages are measured and migrated.

**Read next**: [Architecture: Rewrite or redesign progressively](../../knowledge/architecture.md#rewrite-or-redesign-progressively), [Architecture: Strangler fig](../../knowledge/architecture.md#strangler-fig), [Delivery: Trunk-based development](../../knowledge/livraison.md#trunk-based-development)

### "Monolith or microservices for a new product?"

*Also asked as: "What is a distributed monolith?"*

I start from the number of teams and the stability of business boundaries, not from fashion. By default, I start with a <span class="term" data-term="modular-monolith">modular monolith</span> whose boundaries the CI checks. I extract a service when independent deployment, scaling or data ownership brings a measurable gain, and a team can run it. Exercise 11 on the [exercises](exercices.md) page walks through this case.

**Read next**: [Architecture: Which style to choose](../../knowledge/architecture.md#which-style-to-choose), [Architecture: Modular monolith](../../knowledge/architecture.md#modular-monolith), [Architecture: Conway's law](../../knowledge/architecture.md#conways-law)

## Cross-team influence and technical leadership

### "How do you get a team to adopt a standard it does not want to use?"

I first look for why the team resists: migration cost, lack of time, a bad experience or a real disagreement. I start from a concrete problem the standard solves, I propose a limited trial with a volunteer team, then I publish the results, false positives included. Example: a team refuses a <span class="term" data-term="quality-gate">quality gate</span> for fear of blocking its releases; I first turn it on in report-only mode and on new code only. Everett Rogers' diffusion of innovations (1962) reminds me to convince the volunteers first.

**Read next**: [DevX: Getting a tool adopted without imposing it](../../knowledge/devx.md#getting-a-tool-adopted-without-imposing-it), [Quality: Two gates are enough](../../knowledge/qualite.md#two-gates-are-enough), [DevX: Golden paths and templates](../../knowledge/devx.md#golden-paths-and-templates), [Company culture: Influence without authority and communities of practice](../../knowledge/culture-entreprise.md#influence-without-authority-and-communities-of-practice)

### "What do you do if two teams defend incompatible solutions?"

*Also asked as: "How do you make an important technical decision as a team?"*

I get each team to state its needs, then I compare on weighted shared criteria. I check whether the disagreement is real or comes from different assumptions. If the constraints really differ, I do not force an artificial uniformity: I look for consistency where it serves everyone. Example: one team wants REST, the other GraphQL to aggregate several sources; depending on the consumers, a <span class="term" data-term="bff">BFF</span> can satisfy both. The decision goes through an <span class="term" data-term="advice-process">advice process</span> (Andrew Harmel-Law, 2021) and ends in an ADR.

**Read next**: [Company culture: Advice process](../../knowledge/culture-entreprise.md#advice-process), [Company culture: RFCs and design documents](../../knowledge/culture-entreprise.md#rfcs-and-design-documents), [API: REST or GraphQL?](../../knowledge/api-rest-async.md#rest-or-graphql)

### "What do you do if a team ignores your recommendations?"

I first check that my recommendation really answers the problem, then I look for the reasons of the refusal and I explain the concrete consequences. If the risk stays within the team's scope, I accept a different choice. If it touches security, compliance or other teams, I clarify who can accept that risk, and I get it written down with a review date. Example: an API secret in a "private" repository is not a local choice; I get the secret revoked and escalate if needed.

**Read next**: [Security: Secrets](../../knowledge/securite.md#secrets), [Company culture: Risk register](../../knowledge/culture-entreprise.md#risk-register), [Company culture: Disagree and commit](../../knowledge/culture-entreprise.md#disagree-and-commit), [Architecture: Waivers and the target architecture](../../knowledge/architecture.md#waivers-and-the-target-architecture)

### "How do you avoid becoming a mandatory checkpoint for every technical decision?"

I look at which decisions come up to me and why: a missing rule, fear of being wrong, or a real cross-team topic. I write a framework: local decisions, decisions with consultation, cross-team decisions that need arbitration. The advice process lets anyone decide after consulting the people affected. If I am always asked about the same case, it is a gap in the framework or in knowledge sharing, which I fix like an <span class="term" data-term="enabling-team">enabling team</span> ("Team Topologies", 2019).

**Read next**: [Company culture: Advice process](../../knowledge/culture-entreprise.md#advice-process), [Company culture: Team Topologies](../../knowledge/culture-entreprise.md#team-topologies), [Architecture: Company tech radar](../../knowledge/architecture.md#company-tech-radar)

## Cross-team collaboration

### "How do you coordinate several teams that depend on each other?"

*Also asked as: "What is Conway's law, and what do you do with it?"*

I map the dependencies and spot the ones that really block. I stabilize the interfaces so the teams can move in parallel, with consumer-driven contract tests (Ian Robinson, 2006). I make owners and risks visible, and I reduce mandatory synchronizations. <span class="term" data-term="conway-law">Conway's law</span> (1968) reminds me that the architecture follows the organization: sometimes it is the team split that has to change.

**Read next**: [Quality: Contract tests and API mocks](../../knowledge/qualite.md#contract-tests-and-api-mocks), [Laws and principles: Conway's law](../../knowledge/lois-et-principes.md#conways-law), [Company culture: Team Topologies](../../knowledge/culture-entreprise.md#team-topologies)

### "How do you handle a disagreement about responsibilities between teams?"

I start from the result the user expects and I trace the path between components to find the step with no owner, or with two. I separate business, technical and operational responsibility. I get the empowered person to decide and I write the outcome where everyone looks, like a service catalog. During an incident, I first get everyone to restore the service together, and I deal with responsibilities right after, in a blameless <span class="term" data-term="postmortem">postmortem</span>.

**Read next**: [DevX: Developer portal and catalogue](../../knowledge/devx.md#developer-portal-and-catalogue), [Company culture: RACI](../../knowledge/culture-entreprise.md#raci), [Incidents: The blameless postmortem](../../knowledge/incidents.md#the-blameless-postmortem)

### "How do you prioritize when several teams ask for help at the same time?"

I compare impact, urgency, risk and the number of teams affected. A production incident or an exploitable flaw comes before a comfort improvement. I take leverage into account: fixing a shared problem unblocks several teams. To decide, I divide the cost of delay by the duration, and I limit my own work in progress. I communicate my trade-offs and revisit them if the situation changes.

**Read next**: [Company culture: Cost of delay](../../knowledge/culture-entreprise.md#cost-of-delay), [Company culture: Little's law and WIP limits](../../knowledge/culture-entreprise.md#littles-law-and-wip-limits), [Incidents: Severity levels](../../knowledge/incidents.md#severity-levels)

### "How do you get teams with different goals to work together?"

*Also asked as: "Our team ships slowly, how do you find out why?"*

I bring the discussion back to the common goal, the user's full journey, rather than local indicators. I make the trade-offs visible, often with a <span class="term" data-term="value-stream-mapping">value stream map</span> (Rother and Shook, "Learning to See", 1998) that shows where work waits. Example: the backend limits calls, the front end makes many small calls, and the screen is slow; an aggregation endpoint or a BFF fixes the real problem. I then check that the full journey improves.

**Read next**: [Company culture: Value stream mapping](../../knowledge/culture-entreprise.md#value-stream-mapping), [Company culture: Theory of constraints](../../knowledge/culture-entreprise.md#theory-of-constraints), [Company culture: OKR](../../knowledge/culture-entreprise.md#okr)

## Software quality and technical excellence

### "How do you define a test strategy for a complex project?"

*Also asked as: "Pyramid or testing trophy?", "Time is short before a release, what do you test first?"*

I list with the product the scenarios whose failure would cost the most and rank them by impact and probability: this is <span class="term" data-term="risk-based-testing">risk-based testing</span> (ISTQB Foundation syllabus, version 4.0 from 2023). That list drives the strategy, not a coverage percentage. For each scenario, I pick the lowest test level that protects it: calculation rules in unit tests, the database and external services in integration tests, a few journeys end to end. I watch the suite's duration and stability, because a slow or flaky suite ends up bypassed.

**Read next**: [Designing tests: Risk-based testing](../../knowledge/conception-tests.md#risk-based-testing), [Quality: Choosing the right test level](../../knowledge/qualite.md#choosing-the-right-test-level), [Quality: Pyramid, trophy, honeycomb: the shape of a suite](../../knowledge/qualite.md#pyramid-trophy-honeycomb-the-shape-of-a-suite)

### "How do you improve quality without slowing down releases?"

*Also asked as: "Our CI takes 30 minutes, where do you start?"*

I start from real defects, found in acceptance and in production, to know where quality leaks. I move checks as close as possible to the moment the mistake is made, and I make blocking only those that protect from a significant risk. I measure the defects caught, the <span class="term" data-term="escaped-defect">escaped defects</span> and the pipeline feedback time (p50, p95, runner wait). The first gains often come from settings that remove no check: `needs`, a cache keyed on the lockfile, cancelling outdated pipelines.

**Read next**: [DevX: A fast and reliable CI](../../knowledge/devx.md#a-fast-and-reliable-ci), [Quality: CI and delivery](../../knowledge/qualite.md#ci-and-delivery), [Quality: Shift-left and shift-right: when to test](../../knowledge/qualite.md#shift-left-and-shift-right-when-to-test)

### "Which checks should be automated in CI/CD?"

I rank checks by speed, reliability and the risk they cover. Fast and reliable ones (lint, unit tests) give early feedback; those that protect security, critical business rules and data integrity block a dangerous release. I add static security analysis (<span class="term" data-term="sast">SAST</span>), dependency analysis (<span class="term" data-term="sca">SCA</span>) and an <span class="term" data-term="sbom">SBOM</span>, aiming at the SLSA levels (2021) for the build chain. I track false positives and intermittent failures, because trust in the pipeline is what makes it useful.

**Read next**: [Delivery: Automated checks before merging](../../knowledge/livraison.md#automated-checks-before-merging), [Security: Security testing tools](../../knowledge/securite.md#security-testing-tools), [Package managers: Securing installation](../../knowledge/gestionnaires-paquets.md#securing-installation)

### "Why is code coverage not enough to measure the quality of tests?"

*Also asked as: "Is 100% coverage enough?", "Which threshold should we enforce?"*

Coverage says which code ran, not which behavior was checked. Example: 95% coverage on a refund calculation, but no test checks that the amount stays below the price paid. I complete it with business scenarios, edge cases and escaped defects, and on critical code with <span class="term" data-term="mutation-testing">mutation testing</span> (DeMillo, Lipton and Sayward, 1978) or property-based testing. If I enforce a threshold, it is on new code only.

**Read next**: [Quality: What it says and what it does not](../../knowledge/qualite.md#what-it-says-and-what-it-does-not), [Quality: Mutation testing: testing the tests](../../knowledge/qualite.md#mutation-testing-testing-the-tests), [Designing tests: Property-based testing](../../knowledge/conception-tests.md#property-based-testing)

### "How do you improve the maintainability of code that is hard to change?"

*Also asked as: "How do you change legacy code without tests?"*

I look for why the code is hard to change and which changes cost the most. I pin the behavior with tests, I create a <span class="term" data-term="seam">seam</span>, then I gradually split the responsibilities that change for different reasons. Example: a controller that checks rights, calculates, writes to the database, calls the bank and sends an email; I first move the calculation into a tested function. I prefer targeted, measured refactorings (Martin Fowler's catalog, 1999, 2nd edition 2018) to a rewrite.

**Read next**: [Design principles: Changing legacy code](../../knowledge/principes-conception.md#changing-legacy-code), [Design principles: Refactoring in small steps](../../knowledge/principes-conception.md#refactoring-in-small-steps), [Architecture: Hexagonal and clean architecture](../../knowledge/architecture.md#hexagonal-and-clean-architecture)

### "SOLID, STUPID, DRY: should they be a team standard, and how do you use them in review without dogma?"

I do not make them a rule that blocks an MR, but a shared vocabulary. In review, each comment states a concrete cost ("adding a payment method forces a change to this file and its 40 tests"), not "this violates open/closed". I automate what can be measured without debate: cognitive complexity per function, direction of dependencies between modules with architecture rules in CI. The rest stays a judgment: a two-line duplication is not a fault, and the <span class="term" data-term="wrong-abstraction">wrong abstraction</span> costs more than a copy (Sandi Metz, 2016).

**Read next**: [Design principles: SOLID](../../knowledge/principes-conception.md#solid), [Design principles: STUPID: the six smells to avoid](../../knowledge/principes-conception.md#stupid-the-six-smells-to-avoid), [Quality: Proving every comment](../../knowledge/qualite.md#proving-every-comment), [Architecture: Fitness functions](../../knowledge/architecture.md#fitness-functions)

### "How do you improve the observability and reliability of a service?"

*Also asked as: "SLI, SLO, SLA: what is the difference?", "What makes a good alert?"*

I start from the critical journeys and set with the business a reliability goal for each: a measured <span class="term" data-term="sli">SLI</span>, an internal <span class="term" data-term="slo">SLO</span> and its <span class="term" data-term="error-budget">error budget</span> (Google's "Site Reliability Engineering" book, 2016). I link services with a propagated trace ID (W3C Trace Context, 2020) and I alert on symptoms the user sees, at the rate the budget burns, not on every cause. Example: transfers stay "in progress"; the age of the oldest message in the queue tells more than the service's CPU.

**Read next**: [Observability: SLI, SLO, error budget](../../knowledge/observabilite.md#sli-slo-error-budget), [Observability: Alert on symptoms, not on causes](../../knowledge/observabilite.md#alert-on-symptoms-not-on-causes), [Observability: Propagation across services](../../knowledge/observabilite.md#propagation-across-services), [Tools: Observing a queue's health](../../knowledge/outils.md#observing-a-queues-health)

## Measuring and improving engineering

### "How do you measure the effectiveness of a quality initiative?"

*Also asked as: "Which quality indicators do you track?", "How do you know a practice really worked?"*

I define the problem, then a baseline, with the Goal-Question-Metric method (Victor Basili, 1984). I pick a few outcome and cost indicators, I run a trial, then I compare over a window of the same length, with a guard metric. I do not conclude that an initiative works because the tool is deployed or the rule is followed. <span class="term" data-term="goodhart-law">Goodhart's law</span> (1975) reminds me that an indicator turned into a target gets inflated.

**Read next**: [Quality: Choosing indicators with GQM](../../knowledge/qualite.md#choosing-indicators-with-gqm), [Laws and principles: Goodhart's law](../../knowledge/lois-et-principes.md#goodharts-law), [Quality: Defect Detection Percentage](../../knowledge/qualite.md#defect-detection-percentage)

### "What are the DORA metrics and how do you use them?"

*Also asked as: "How do you measure a team's productivity?"*

The four <span class="term" data-term="dora-metrics">DORA metrics</span> (research program since 2014, "Accelerate" book, 2018) measure the delivery flow: lead time for changes, deployment frequency, change failure rate, recovery time. I read them together and as trends: deploying more often is no progress if failures go up. I do not compare teams with different contexts and I never measure individuals. I complete them with SPACE (2021) and DevEx (2023) for developer experience.

**Read next**: [Delivery: Measuring delivery: DORA](../../knowledge/livraison.md#measuring-delivery-dora), [Delivery: Measuring developer experience: SPACE and DevEx](../../knowledge/livraison.md#measuring-developer-experience-space-and-devex), [DevX: Measuring without monitoring people](../../knowledge/devx.md#measuring-without-monitoring-people)

### "How do you demonstrate the value of a tool or a standard?"

*Also asked as: "How do you know your DevX work paid off?"*

I write down the hypothesis the tool must confirm and the problem it must solve. I run a <span class="term" data-term="pilot">pilot</span> on a representative scope, ideally with a <span class="term" data-term="comparison-group">comparison group</span>, measuring gains and adoption costs ("The Lean Startup", Eric Ries, 2011). I decide on the results, and I am ready to adjust or drop it. Example: automating PHPUnit in pipelines; I compare the escaped defects and pipeline duration of the pilot teams before and after.

**Read next**: [DevX: Getting a tool adopted without imposing it](../../knowledge/devx.md#getting-a-tool-adopted-without-imposing-it), [Data and decisions: Deciding with data](../../knowledge/donnees-decision.md#deciding-with-data), [DevX: Measuring without monitoring people](../../knowledge/devx.md#measuring-without-monitoring-people), [DevX: Proving a tool's value with a pilot](../../knowledge/devx.md#proving-a-tools-value-with-a-pilot)

## Pragmatism, incidents and trade-offs

### "What do you do when a quality check blocks an important release?"

I do not remove the check without understanding why it blocks. If it is a serious defect, I fix it before releasing. If it is a false positive or a pre-existing issue unrelated to the change, I accept a visible, justified <span class="term" data-term="waiver">waiver</span>, with an owner and an expiry date (formal risk acceptance, ISO 31000, 2009, revised in 2018). Either way, I fix the cause so the block does not come back, for example a gate that only looks at new code.

**Read next**: [Quality: Never weaken a gate](../../knowledge/qualite.md#never-weaken-a-gate), [Quality: Two gates are enough](../../knowledge/qualite.md#two-gates-are-enough), [Company culture: Risk register](../../knowledge/culture-entreprise.md#risk-register), [Quality: Time-limited waivers and risk acceptance](../../knowledge/qualite.md#time-limited-waivers-and-risk-acceptance)

### "How do you react to an incident that affects several teams?"

*Also asked as: "Tell me about an incident you handled. What did you do first?", "Who does what during an incident?"*

I separate immediate handling from analysis. First the impact, an <span class="term" data-term="incident-commander">incident commander</span> who coordinates without debugging, someone who communicates, and mitigation before searching for the cause (Incident Command System, born among US firefighters in the 1970s). Then the facts, the contributing factors and actions with an owner and a deadline. I talk about the system that allowed the mistake, never about a culprit (John Allspaw, 2012).

**Read next**: [Incidents: The lifecycle of an incident](../../knowledge/incidents.md#the-lifecycle-of-an-incident), [Incidents: Roles during the incident](../../knowledge/incidents.md#roles-during-the-incident), [Incidents: The blameless postmortem](../../knowledge/incidents.md#the-blameless-postmortem)

### "How do you set up an incident analysis practice that really makes teams improve?"

*Also asked as: "Is MTTR a good indicator?", "How do you make sure actions get done?", "How do you make on-call sustainable?"*

I write a severity grid with product and support, with verifiable criteria and, for each level, who is paged, who coordinates and how often the status page changes. After a severe incident, a short postmortem looks for contributing factors. Actions go into the backlog, with an owner and a deadline, and I follow them until closed. I review incidents together every quarter for recurring themes. Average <span class="term" data-term="mttr">MTTR</span> is crushed by a single long incident: I prefer the median, the worst case, recurring incidents and on-call load.

**Read next**: [Incidents: Severity levels](../../knowledge/incidents.md#severity-levels), [Incidents: Following up on actions](../../knowledge/incidents.md#following-up-on-actions), [Incidents: Metrics and their limits](../../knowledge/incidents.md#metrics-and-their-limits), [Incidents: Sustainable on-call](../../knowledge/incidents.md#sustainable-on-call), [Incidents: Learning from incidents at scale](../../knowledge/incidents.md#learning-from-incidents-at-scale)

### "When should you fix right away and when should you refactor?"

I weigh the urgency, the impact and the risk of the fix. During an incident, I pick a safe fix that restores the expected behavior, covered by a test that reproduces the bug. Once things are stable, I check whether the code structure makes a relapse likely, and I refactor in small steps. Kent Beck (2012) sums it up: "make the change easy, then make the easy change". Example: a VAT error in production; a targeted fix the same day, preparatory refactoring in the following weeks.

**Read next**: [Design principles: Refactoring in small steps](../../knowledge/principes-conception.md#refactoring-in-small-steps), [Designing tests: Characterization tests and golden master](../../knowledge/conception-tests.md#characterization-tests-and-golden-master), [Incidents: Finding the cause: debugging methodically](../../knowledge/incidents.md#finding-the-cause-debugging-methodically)

### "What do you do if a team wants to bypass a quality gate?"

*Also asked as: "What do you do with a flaky test?"*

I look for why it bypasses it. If the check is reliable and protects from a significant risk, I do not disable it to go faster. If the problem comes from false positives or <span class="term" data-term="flaky-test">flaky tests</span>, I fix that defect: quarantine with a ticket and an owner (Google, "Flaky Tests at Google and How We Mitigate Them", 2016), then repair. Example: E2E tests fail one time in ten and the team reruns until green; the rerun also hides real bugs.

**Read next**: [Quality: Strategy for a flaky test](../../knowledge/qualite.md#strategy-for-a-flaky-test), [Quality: Never weaken a gate](../../knowledge/qualite.md#never-weaken-a-gate), [Quality: Causes of flakiness that are not test bugs](../../knowledge/qualite.md#causes-of-flakiness-that-are-not-test-bugs), [Quality: Quarantining without blocking](../../knowledge/qualite.md#quarantining-without-blocking), [Quality: Time-limited waivers and risk acceptance](../../knowledge/qualite.md#time-limited-waivers-and-risk-acceptance)

## Knowledge sharing and coaching

### "How do you help several teams improve their testing practices?"

I start from the teams' real difficulties, not from a catalog of best practices. I build a concrete example they can copy, then a reusable template and short documentation. I grow relays in each team, the way a community of practice works (Lave and Wenger, 1991). I then look at where they stay stuck to improve support, rather than doing the work for them.

**Read next**: [DevX: Golden paths and templates](../../knowledge/devx.md#golden-paths-and-templates), [DevX: Documentation](../../knowledge/devx.md#documentation), [Company culture: Team Topologies](../../knowledge/culture-entreprise.md#team-topologies), [Quality: Choosing the right test level](../../knowledge/qualite.md#choosing-the-right-test-level)

### "How do you turn a good practice into a shared standard?"

*Also asked as: "Golden path or enforced rule?", "How do you move 300 repositories to a new version without spending a year on it?"*

I check that the need is shared and that the practice works in several contexts. I separate common principles from details specific to each language, then I provide a paved road: a versioned CI component the teams include, which they can leave by owning their difference. I plan how the standard evolves from feedback. For a mass migration, I combine a <span class="term" data-term="codemod">codemod</span>, MRs in waves, an update bot and a campaign dashboard.

**Read next**: [DevX: Golden paths and templates](../../knowledge/devx.md#golden-paths-and-templates), [DevX: Shared, versioned CI component](../../knowledge/devx.md#shared-versioned-ci-component), [DevX: Large-scale migrations](../../knowledge/devx.md#large-scale-migrations), [DevX: Platform engineering: the platform as a product](../../knowledge/devx.md#platform-engineering-the-platform-as-a-product)

### "How do you build influence without formal authority?"

*Also asked as: "Your tool is only used by three teams out of twenty, what do you do?"*

I understand the team's constraints before proposing. I rely on facts, an example or a prototype that makes the gain visible, I listen to objections and adapt. I write a short RFC for heavy proposals, and I get it reviewed one on one before the decision meeting. My goal is for teams to make a good decision and know how to repeat it without me. "Influence Without Authority" (Cohen and Bradford, 1990) gives the principle: understand what the other side values and offer an exchange.

**Read next**: [Company culture: RFCs and design documents](../../knowledge/culture-entreprise.md#rfcs-and-design-documents), [DevX: Getting a tool adopted without imposing it](../../knowledge/devx.md#getting-a-tool-adopted-without-imposing-it), [Company culture: Disagree and commit](../../knowledge/culture-entreprise.md#disagree-and-commit), [Company culture: Influence without authority and communities of practice](../../knowledge/culture-entreprise.md#influence-without-authority-and-communities-of-practice)

## Vision of the Staff Engineer role

### "What is the difference between a Senior Engineer and a Staff Engineer?"

The main difference is the reach of the impact. A Senior solves complex problems in their team; a Staff spots problems common to several teams, eases cross-team decisions and improves practices for good. Example: the Senior fixes a badly configured HTTP client in their app, the Staff sees that five apps use it. I quote Will Larson's four <span class="term" data-term="staff-archetype">archetypes</span> ("Staff Engineer", 2021), I say which one I aim for and why it meets the company's need.

**Read next**: [Company culture: Staff+ archetypes](../../knowledge/culture-entreprise.md#staff-archetypes), [Company culture: Two tracks: expertise and management](../../knowledge/culture-entreprise.md#two-tracks-expertise-and-management)

### "What would you do in your first three months?"

First month: I listen to the teams, I map the systems and the delivery flow, I deliver a small visible win, and I get my diagnosis reviewed by asking "what did I get wrong?". Second month: I pick with the teams one or two cross-team problems, a baseline and a reversible trial. Third month: I compare with the baseline and decide with the stakeholders to generalize, adapt or stop. "The First 90 Days" (Michael Watkins, 2003) gives the frame. Exercise 13 on the [exercises](exercices.md) page details it.

**Read next**: [Company culture: Value stream mapping](../../knowledge/culture-entreprise.md#value-stream-mapping), [Delivery: Measuring delivery: DORA](../../knowledge/livraison.md#measuring-delivery-dora), [Company culture: Staff+ archetypes](../../knowledge/culture-entreprise.md#staff-archetypes), [Company culture: The first 90 days in a new role](../../knowledge/culture-entreprise.md#the-first-90-days-in-a-new-role)

### "How do you split your time between code, design and coaching?"

I keep coding time to stay close to real difficulties, but on topics where my input has the most value: a prototype that settles an architecture question, a tool, a shared fix. I do not take a task a team's release directly depends on: if an emergency elsewhere keeps me busy for three days, the whole team waits (Will Larson, 2021, "stay off the <span class="term" data-term="critical-path">critical path</span>"). I make visible the linking work between teams that Tanya Reilly calls "Being Glue" (2019). I measure my collective impact, not my volume of code.

**Read next**: [Company culture: Staff+ archetypes](../../knowledge/culture-entreprise.md#staff-archetypes), [DevX: Inner loop and outer loop](../../knowledge/devx.md#inner-loop-and-outer-loop), [Company culture: Splitting my time and showing impact](../../knowledge/culture-entreprise.md#splitting-my-time-and-showing-impact)

### "How do you see the Staff Engineer role with the rise of AI?"

*Also asked as: "How would you roll out an AI coding assistant across teams?"*

AI speeds up writing code, but guarantees neither correct requirements nor security. Example: a generated API compiles, its tests pass, and it lets a user read someone else's account. I set a written framework, I keep the same reviews and the same CI, and I measure the effect on lead time and defects rather than on the amount of generated code. I quote the OWASP Top 10 for LLM Applications (2025 edition) and the EU AI Act (2024 regulation) for risks and obligations.

**Read next**: [DevX: AI coding assistants](../../knowledge/devx.md#ai-coding-assistants), [AI at work: Measuring AI assistant usage in a team](../../knowledge/ia-entreprise.md#measuring-ai-assistant-usage-in-a-team), [AI at work: What it changes for a dev and QA team](../../knowledge/ia-entreprise.md#what-it-changes-for-a-dev-and-qa-team), [AI and agents: Closing the loop: giving a way to verify](../../knowledge/ia-agents.md#closing-the-loop-giving-a-way-to-verify)

### "How do you recognize a healthy team culture?"

I look at concrete signs: juniors comment on seniors' MRs, "I don't know" is accepted, an incident leads to learning, not punishment. I quote Westrum's typology (2004) and <span class="term" data-term="psychological-safety">psychological safety</span>, adding that it is not kindness without standards. As a Staff, I model it: I say when I am wrong and I thank whoever corrects me.

**Read next**: [Company culture: Westrum typology](../../knowledge/culture-entreprise.md#westrum-typology), [Company culture: Psychological safety](../../knowledge/culture-entreprise.md#psychological-safety), [Company culture: Just culture](../../knowledge/culture-entreprise.md#just-culture)

## Precise technical questions

### "How do you evolve an API without breaking its consumers?"

*Also asked as: "Offset or cursor for pagination?", "Should your API accept a slightly malformed request?"*

I list who consumes the API and which guarantees they expect; <span class="term" data-term="hyrum-law">Hyrum's law</span> reminds me that every visible behavior is used by someone. I favor compatible changes. For a breaking change, I do an <span class="term" data-term="expand-contract">expand / contract</span> (Danilo Sato, 2014): I add `account_id` next to `customer_id`, I announce the removal with the `Deprecation` and `Sunset` headers, I track usage of the old field, then I remove it. Contract tests and a SemVer major frame the break; on the client side, I read as a Tolerant Reader (Martin Fowler, 2011).

**Read next**: [API: Versioning](../../knowledge/api-rest-async.md#versioning), [API: Tolerant Reader: a client that does not break](../../knowledge/api-rest-async.md#tolerant-reader-a-client-that-does-not-break), [Laws and principles: Hyrum's law](../../knowledge/lois-et-principes.md#hyrums-law), [API: Pagination](../../knowledge/api-rest-async.md#pagination)

### "How do you migrate authentication to OAuth 2.0 or OpenID Connect?"

I separate the two questions: OAuth 2.0 (RFC 6749, 2012) delegates access, OpenID Connect says who is logged in. I list the applications that authenticate today, and I pick the flow per client type: Authorization Code with <span class="term" data-term="pkce">PKCE</span> (RFC 7636, 2015) for a person, Client Credentials between services. Each API validates `iss`, `aud`, `exp` and the signature of the <span class="term" data-term="jwt">JWT</span>. I migrate progressively, with security tests and a rollback, following RFC 9700 (January 2025).

**Read next**: [Security: OAuth and OpenID Connect](../../knowledge/securite.md#oauth-and-openid-connect), [Security: Which flow for which client](../../knowledge/securite.md#which-flow-for-which-client), [Security: JWT: what a token looks like](../../knowledge/securite.md#jwt-what-a-token-looks-like), [Tools: Authentication: Auth0, Keycloak](../../knowledge/outils.md#authentication-auth0-keycloak)

### "How do you avoid duplicates when an API receives the same request several times?"

*Also asked as: "How do you make a `POST` safe to retry?", "What happens if a message arrives twice?"*

A timeout does not mean the server did nothing. For a non-repeatable operation like a payment, I use an <span class="term" data-term="idempotency-key">idempotency key</span> provided by the client, unique per client, stored with a fingerprint of the request and the response. The <span class="term" data-term="unique-constraint">unique constraint</span> in the database decides between two simultaneous requests, not a "look up then insert". For messages, I make the consumer idempotent (Chris Richardson, "Microservices Patterns", 2018). Exercise 4 on the [exercises](exercices.md) page gives the code.

**Read next**: [API: HTTP methods](../../knowledge/api-rest-async.md#http-methods), [Architecture: Idempotency](../../knowledge/architecture.md#idempotency), [API: Delivery guarantees](../../knowledge/api-rest-async.md#delivery-guarantees)

### "How do you keep data consistent across several services?"

*Also asked as: "Explain the CAP theorem", "How do you publish an event without losing it once the database has written?"*

I clarify the business guarantees and the system that is authoritative for each piece of data. I check whether immediate consistency is required or whether <span class="term" data-term="eventual-consistency">eventual consistency</span> is enough. For a distributed operation, I write a <span class="term" data-term="saga-pattern">saga</span> (Garcia-Molina and Salem, 1987) with its states, retries and compensations, and I store the event with the data thanks to the outbox. Example: the payment succeeds but the stock reservation fails; the saga refunds. The CAP theorem (Brewer, 2000, proven in 2002) only applies during a network partition.

**Read next**: [Architecture: Orchestrated or choreographed saga](../../knowledge/architecture.md#orchestrated-or-choreographed-saga), [Architecture: Outbox](../../knowledge/architecture.md#outbox), [Architecture: CAP and PACELC](../../knowledge/architecture.md#cap-and-pacelc), [API: The write-then-publish trap](../../knowledge/api-rest-async.md#the-write-then-publish-trap), [Architecture: Payment authorization and capture](../../knowledge/architecture.md#payment-authorization-and-capture)

### "How do you secure an API that exposes sensitive data?"

*Also asked as: "What is BOLA?", "RBAC or ABAC?", "A key leaked, what do you do?"*

I identify the sensitive data and who should access it. I separate authentication from authorization: being logged in does not grant access to every resource. Example: `/accounts/12345` where the ID is replaced by another customer's, the <span class="term" data-term="bola">BOLA</span> flaw at the top of the OWASP API Security Top 10 (2023 edition). I check rights on the server side, deny by default, limit the exposed fields, protect secrets and add denial tests. I also review the logs, which often leak more than the API.

**Read next**: [Security: The most common API vulnerabilities](../../knowledge/securite.md#the-most-common-api-vulnerabilities), [Security: Where to enforce checks](../../knowledge/securite.md#where-to-enforce-checks), [Security: Modeling permissions: RBAC, ABAC, ReBAC](../../knowledge/securite.md#modeling-permissions-rbac-abac-rebac), [Security: Secrets](../../knowledge/securite.md#secrets)

### "A scanner reports hundreds of flaws in our dependencies: how do you prioritize?"

*Also asked as: "What are CVSS, EPSS, KEV?"*

I combine severity (<span class="term" data-term="cvss">CVSS</span>, version 4.0 published in 2023), probability of exploitation (<span class="term" data-term="epss">EPSS</span>, published by FIRST since 2021), reachability of the vulnerable code and real exposure. A CVSS 9 flaw never called waits less urgently than a CVSS 7 flaw with an exploit in the wild. Each action has an owner and a deadline; an ignored alert is written in the scanner configuration with an expiry date. Exercise 10 on the [exercises](exercices.md) page walks through the case.

**Read next**: [Cybersecurity: Scoring and triaging a vulnerability](../../knowledge/cybersecurite.md#scoring-and-triaging-a-vulnerability), [Package managers: Updating dependencies](../../knowledge/gestionnaires-paquets.md#updating-dependencies), [Cybersecurity: Supply chain attacks](../../knowledge/cybersecurite.md#supply-chain-attacks), [Quality: Time-limited waivers and risk acceptance](../../knowledge/qualite.md#time-limited-waivers-and-risk-acceptance)

### "How do you diagnose an API that becomes slow in production?"

*Also asked as: "Why p95 rather than the average?", "A page is slow because of the database, what do you do?"*

I characterize the degradation: since when, on which requests, with which impact, looking at the <span class="term" data-term="p95">p95</span> and not the average. I read the metrics with the RED method (Tom Wilkie, 2015) on the service side and USE (Brendan Gregg, 2012) on the resource side, then a trace to locate the component. I form a hypothesis, check it (`EXPLAIN ANALYZE`, flame graph), change one thing only and compare before and after. Example: three-second requests in the morning, caused by an export that saturates the database.

**Read next**: [Observability: A dashboard for one service: RED and USE](../../knowledge/observabilite.md#a-dashboard-for-one-service-red-and-use), [Observability: p95 latency](../../knowledge/observabilite.md#p95-latency), [Observability: Finding the cause of a slowdown: profiler and flame graph](../../knowledge/observabilite.md#finding-the-cause-of-a-slowdown-profiler-and-flame-graph), [SQL: Performance](../../knowledge/sql.md#performance), [SQL: Composite index: column order and covering index](../../knowledge/sql.md#composite-index-column-order-and-covering-index)

### "The main database is saturated: should you scale it up (vertical) or spread it out (horizontal)?"

I do not choose before measuring: a saturated database is often the victim of a few queries. I look at `pg_stat_statements`, the plans of the most expensive queries, missing indexes, <span class="term" data-term="n-plus-one">N+1</span>, connections and locks. Then I climb the ladder from cheapest to most expensive: fix the queries, a pooler, a cache, a bigger machine, read replicas, partitioning and archiving. <span class="term" data-term="sharding">Sharding</span> comes last, when writes exceed one machine (Martin Kleppmann, "Designing Data-Intensive Applications", 2017).

**Read next**: [SQL: Scaling a database](../../knowledge/sql.md#scaling-a-database), [SQL: The ladder, from cheapest to most expensive](../../knowledge/sql.md#the-ladder-from-cheapest-to-most-expensive), [SQL: Finding slow queries](../../knowledge/sql.md#finding-slow-queries), [SQL: The N+1 problem](../../knowledge/sql.md#the-n1-problem)

### "How do you deploy a risky change while limiting its impact?"

*Also asked as: "Canary, blue-green or feature flag: which one?", "How do you rename a column in production?"*

I reduce the <span class="term" data-term="blast-radius">blast radius</span>. I separate deploying from enabling with a <span class="term" data-term="feature-flag">feature flag</span> (Pete Hodgson, 2017), then I open in canary steps. I write in advance the indicators to watch, the stop criteria and the rollback procedure. For data, I keep the old and new versions compatible with expand / contract, otherwise the rollback breaks. Example: a new transfer fee calculation, enabled for 1% of customers, compared with the current calculation.

**Read next**: [Delivery: Progressive deployment](../../knowledge/livraison.md#progressive-deployment), [Architecture: Separating deploy from release](../../knowledge/architecture.md#separating-deploy-from-release), [SQL: Zero-downtime schema migrations](../../knowledge/sql.md#zero-downtime-schema-migrations), [Quality: Testing a canary deployment](../../knowledge/qualite.md#testing-a-canary-deployment)

## Tool choices

### "How do you choose between RabbitMQ and Kafka, and should you keep both?"

*Also asked as: "Queue or topic?", "How do you know a consumer is lagging?"*

I start from the question the message answers. A task to spread across workers, with retry and an error queue, goes into a queue like RabbitMQ; a fact several services need to know, even later, goes into a log like Kafka (Jay Kreps, "The Log", 2013). I also compare volume, expected ordering and operating cost. Keeping both is reasonable if they serve two needs, provided the choice rule is written in an ADR. I watch the <span class="term" data-term="consumer-lag">consumer lag</span> and the age of the oldest message.

**Read next**: [Tools: Why keep both](../../knowledge/outils.md#why-keep-both), [API: Queue or topic](../../knowledge/api-rest-async.md#queue-or-topic), [Tools: Observing a queue's health](../../knowledge/outils.md#observing-a-queues-health)

### "Should you pick a managed service or self-host the tool?"

I compare the <span class="term" data-term="total-cost-ownership">total cost of ownership</span>, not only the bill: a free self-hosted tool costs engineer days in upgrades, on-call and incidents. I ask whether running it sets us apart; if not, a <span class="term" data-term="managed-service">managed service</span> frees the team (Wardley maps, Simon Wardley, 2005). I look at <span class="term" data-term="vendor-lock-in">vendor lock-in</span>, data constraints, and I keep an exit door through a standard. Example: replacing Auth0 with Keycloak in the cluster; I price both over three years, on-call included.

**Read next**: [Company culture: Total cost of ownership](../../knowledge/culture-entreprise.md#total-cost-of-ownership), [Company culture: Build, buy or partner](../../knowledge/culture-entreprise.md#build-buy-or-partner), [Company culture: Wardley maps](../../knowledge/culture-entreprise.md#wardley-maps), [Tools: Authentication: Auth0, Keycloak](../../knowledge/outils.md#authentication-auth0-keycloak), [Company culture: Vendor lock-in, a cost to price](../../knowledge/culture-entreprise.md#vendor-lock-in-a-cost-to-price)

### "How do you replace a test tool in place without rewriting everything?"

I first measure the current tool's problem (duration, flakiness, maintenance cost) and check on a pilot that the new tool fixes it. Then I migrate progressively: all new tests in the new tool, old ones by priority, the most expensive first. I set an end criterion, because two tools living side by side with no date double the maintenance. Example: 300 Cypress tests taking 40 minutes and failing one time in five, migrated to Playwright with a tracking dashboard.

**Read next**: [Tools: Playwright, Cypress, Selenium](../../knowledge/outils.md#playwright-cypress-selenium), [DevX: Large-scale migrations](../../knowledge/devx.md#large-scale-migrations), [Architecture: Strangler fig](../../knowledge/architecture.md#strangler-fig), [DevX: Proving a tool's value with a pilot](../../knowledge/devx.md#proving-a-tools-value-with-a-pilot)

### "When should you add a cache like Redis, and which risks should you consider?"

I only add a cache after measuring an expensive, repeated read, and checking that an index is not enough. The business validates how long stale data is acceptable, which gives the <span class="term" data-term="ttl">TTL</span>. I start from the <span class="term" data-term="cache-aside">cache-aside</span> pattern, I define invalidation, and I test two failures: Redis down, where the service reads the source, and the expiry of a popular key, which triggers a <span class="term" data-term="cache-stampede">cache stampede</span> (Vattani et al., 2015).

**Read next**: [Architecture: Where to put a cache](../../knowledge/architecture.md#where-to-put-a-cache), [Architecture: Invalidation and cache stampede](../../knowledge/architecture.md#invalidation-and-cache-stampede), [Tools: Cache: Redis](../../knowledge/outils.md#cache-redis)

### "A team wants to build its dashboards directly on the production database: what do you suggest?"

I understand the need: which indicators, how fresh. A production database is built for <span class="term" data-term="oltp">OLTP</span>, and a big analytics query slows it down for every user. Depending on freshness, I suggest a read-only replica, a scheduled export, or a <span class="term" data-term="cdc">CDC</span> stream into a data warehouse. I pick the simplest option, and I get each indicator defined once, so two dashboards do not show two numbers.

**Read next**: [Data and decisions: Warehouse, lake or lakehouse](../../knowledge/donnees-decision.md#warehouse-lake-or-lakehouse), [Data and decisions: Integrating data: ETL or ELT](../../knowledge/donnees-decision.md#integrating-data-etl-or-elt), [SQL: Read replicas](../../knowledge/sql.md#read-replicas), [Architecture: CQRS](../../knowledge/architecture.md#cqrs)

### "How do you choose an observability tool without getting locked in with a vendor?"

I separate two decisions. Instrumentation lives in the code: I do it with <span class="term" data-term="opentelemetry">OpenTelemetry</span> (CNCF, 2019), so I do not redo it if the tool changes. Storage and display are the tool: I choose it on real usage and on the cost per ingested volume. A collector between the two sends data to two tools during a transition and filters what costs without serving.

**Read next**: [Observability: OpenTelemetry (OTel)](../../knowledge/observabilite.md#opentelemetry-otel), [Observability: Collector (OTel Collector)](../../knowledge/observabilite.md#collector-otel-collector), [Tools: Observability: Datadog, Prometheus and Grafana, OpenTelemetry](../../knowledge/outils.md#observability-datadog-prometheus-and-grafana-opentelemetry), [Company culture: Vendor lock-in, a cost to price](../../knowledge/culture-entreprise.md#vendor-lock-in-a-cost-to-price)

### "How do you frame technology choices across several teams?"

*Also asked as: "Who decides a tool is adopted?", "How do you decide a tool is mature enough?"*

I describe a company radar inspired by Thoughtworks' Technology Radar (published since 2010): rings with written criteria, proposals open to every team, a review at a fixed pace. For a tool, I look at the project's age, its maintainers and who runs it in production. I link each entry to an ADR and to the golden paths, so that "adopted" means "supported and tooled".

**Read next**: [Architecture: Company tech radar](../../knowledge/architecture.md#company-tech-radar), [Tools: Tech radar: Thoughtworks, BYOR, Zalando, AOE, CNCF](../../knowledge/outils.md#tech-radar-thoughtworks-byor-zalando-aoe-cncf), [Tech watch: Why, when and how](../../knowledge/veille.md#why-when-and-how)

## Disqualifying criteria: the mistakes to avoid

These questions test posture more than technique. A single answer on the wrong side is often enough to rule out a Staff candidate.

| Question | Answer that disqualifies | What I say instead | Read next |
|---|---|---|---|
| "What do you do if a team refuses an architecture decision?" | "I am Staff, so the decision must be applied." | I check my assumptions, I make the risks explicit, I get the right person to arbitrate if several teams are affected, then everyone applies the decision, me included ("disagree and commit", Jeff Bezos, 2016), and I write it in an ADR. | [Company culture: Disagree and commit](../../knowledge/culture-entreprise.md#disagree-and-commit), [Architecture: ADR](../../knowledge/architecture.md#adr) |
| "How do you react if you do not know the technical answer?" | Making up an answer, or presenting an assumption as a fact. | I separate what I know from what I assume, and I propose a way to reduce the uncertainty: a measurement, the documentation, a time-boxed <span class="term" data-term="spike">spike</span> (Kent Beck, 1999), a specialist. | [Company culture: Estimating and slicing a feature](../../knowledge/culture-entreprise.md#estimating-and-slicing-a-feature) |
| "How do you handle a technical recommendation that turns out to be wrong?", "Tell me about a failure" | Defending the decision because I made it. | I review it from the facts, I say which assumption was wrong, I correct course and mark the old ADR as superseded. Before a big project, a <span class="term" data-term="pre-mortem">pre-mortem</span> (Gary Klein, 2007) limits this case. I tell the failure with the STAR method and what I have done differently since. | [Incidents: The pre-mortem: imagining failure before starting](../../knowledge/incidents.md#the-pre-mortem-imagining-failure-before-starting), [Architecture: ADR](../../knowledge/architecture.md#adr) |
| "How do you avoid piling up standards and processes?" | One more rule or tool for every problem, without looking at the overall cost. | I ask which risk each rule reduces, I automate objective checks, I keep human processes short, and I remove what no longer serves, after understanding why it was there (Chesterton's fence, 1929). | [Laws and principles: Chesterton's fence](../../knowledge/lois-et-principes.md#chestertons-fence), [DevX: Golden paths and templates](../../knowledge/devx.md#golden-paths-and-templates) |
| "How do you show you have Staff-level impact?" | Counting lines of code, meetings or documents. | I start from an initial problem with numbers, explain the decisions and their adoption by the teams, then the measured results, kept apart from expected benefits. I keep a log of my achievements ("brag document", Julia Evans, 2019). | [Delivery: Measuring delivery: DORA](../../knowledge/livraison.md#measuring-delivery-dora), [Company culture: Staff+ archetypes](../../knowledge/culture-entreprise.md#staff-archetypes) |

## The 3 things a Staff Engineer does all the time

1. **Clarify problems and make the right technical decisions**: before adding a cache to display a balance, I check how fresh the business needs it and what a stale amount costs. Teams keep an explicit reasoning they can reuse.
2. **Help several teams progress without becoming their mandatory checkpoint**: rather than approving each pipeline, I provide a common template, clear criteria and reusable tests.
3. **Check that changes really create value**: after quality gates arrive, I look at whether major defects go down, and whether pipeline duration and false positives stay acceptable.

## A simple structure for answering out loud

For almost every question, I follow this thread:

1. **Problem**: who faces which difficulty, with which impact?
2. **Constraints**: security, deadline, reliability, cost, dependencies.
3. **Options**: which solutions, with which trade-offs?
4. **Decision**: why this option?
5. **Execution**: how to test, deploy, support or roll back?
6. **Result**: how do I check the situation improved?
7. **Wider benefits**: what the approach improves beyond the immediate problem.

When the question asks for a story ("tell me about a time when..."), I tell it with the <span class="term" data-term="star-method">STAR method</span>: the situation, the task that was mine, the action I took myself, the result with a number. I favor cases I lived; if I have none, I present the scenario as hypothetical and explain my reasoning.

**Read next**: [Company culture: Disagree and commit](../../knowledge/culture-entreprise.md#disagree-and-commit), [Company culture: Pyramid principle](../../knowledge/culture-entreprise.md#pyramid-principle)

## Measuring success

I know my preparation works when my answers become concrete, not when I have read the whole page. Before starting, I write down a baseline: I record myself answering ten random questions, and I count how many answers contain a lived story and a number. I take the same measure, on ten other questions, two weeks later. The guard metric is duration: an answer longer than three minutes loses the interviewer, even if it is right.

| Solution | Success indicator (<span class="term" data-term="sli">SLI</span>) | Likely <span class="term" data-term="slo">SLO</span> | Likely <span class="term" data-term="sla">SLA</span> |
|---|---|---|---|
| one lived story prepared per theme | share of this page's themes for which I have a written STAR story | at least 9 themes out of 11 | n/a: no external contract |
| answering with the oral structure | share of recorded answers that give a result with a number | at least 7 answers out of 10 | n/a: no external contract |
| rereading the linked Knowledge section | share of technical questions where I name the mechanism and its cost without my notes | at least 8 out of 10 | n/a: no external contract |
| practicing the live exercises | number of exercises done out loud, timed | all 13 exercises at least once before the interview | n/a: no external contract |
| keeping answers short | median duration of a recorded answer | between 1 min 30 and 3 min | n/a: no external contract |

[Take with caution: example orders of magnitude, to adjust to the interview format]

## Pitfalls to avoid

| Pitfall | What happens | Solution |
| --- | --- | --- |
| **Reciting the method**: I answer in the conditional ("I would") to a question that asks for a story. | The interviewer hears no proof that I have done it before. | I prepare one lived story per theme and tell it with STAR ([oral structure](#a-simple-structure-for-answering-out-loud)). |
| **Saying "we"**: I tell what the team did without saying my part. | My personal impact stays invisible. | I say what I decided, did or unblocked myself, then the collective result ([Staff impact](#disqualifying-criteria-the-mistakes-to-avoid)). |
| **Imposing through the title**: I answer that as a Staff, my decision applies. | It is a disqualifying criterion: the role relies on influence, not authority. | I show how I get decisions made and how I commit even when I am not followed ([influence](#how-do-you-build-influence-without-formal-authority)). |
| **Quoting without explaining**: I name Conway, Goodhart or DORA without saying what it changes. | The quote sounds like a learned answer. | I give the idea in one sentence, an example, then its limit ([decisions](#how-do-you-choose-between-two-technically-viable-architectures)). |
| **Promising without a baseline**: I announce "we gained 30%" with no starting measure. | The first follow-up question brings the number down. | I quote a baseline, the same measure after and a guard metric ([measuring](#how-do-you-measure-the-effectiveness-of-a-quality-initiative)). |
| **Becoming the mandatory checkpoint**: I describe a role where every decision goes through me. | The interviewer hears a bottleneck, not a Staff. | I describe the framework that lets teams decide on their own ([autonomy](#how-do-you-avoid-becoming-a-mandatory-checkpoint-for-every-technical-decision)). |
| **Skipping framing questions**: in an exercise, I propose a solution right after the statement. | I answer a problem the interviewer did not ask. | I ask two or three questions (volume, teams, what exists) before proposing ([exercises](exercices.md)). |
