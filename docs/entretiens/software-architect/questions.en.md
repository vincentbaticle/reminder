# Software Architect interview: the questions

!!! warning "Disclaimer"
    These notes are personal cheat sheets, not a source of truth. They reflect my own understanding and choices: their content remains subjective, despite the quotes and references it contains. It may be incomplete, simplified, inaccurate or outdated. Always check the official documentation before applying it. This content is provided as is, without any warranty: you use it at your own risk.

!!! audience "Who and what for"
    - **Roles**: software architect, solution architect, Staff Engineer, tech lead, senior developer aiming for an architect role.
    - **Uses**: I prepare an architect interview and I want the list of recurring questions, theme by theme; I look for the outline of an answer to "monolith or microservices?" before rereading the full section; I prepare a lived decision to tell, with its rejected options and its trade-off; I review the night before a whiteboard design exercise.

This page lists, theme by theme, the questions asked to a software architect, as the interviewer phrases them. For each one, I give a short first-person answer outline, then a **Read next** line pointing to the Knowledge sections where the full answer is explained with its examples.

How I use it:

1. I read the outline out loud, without looking further;
2. I open the linked section to fill what I am missing (definitions, numbers, examples);
3. I prepare a lived story that illustrates the question: the context, the rejected options, the trade-off I accepted and what the decision gave. The interviewer expects "I did", not "I would";
4. for the whiteboard exercise (system design, ADR, C4, saga, capacity estimation, threat modeling), I practice with [the live exercises](exercices.md).

The role is about <span class="term" data-term="trade-off">trade-offs</span> between <span class="term" data-term="quality-attribute">quality attributes</span> (performance, availability, security, cost, evolvability) at the scale of several teams, not about picking a library. It overlaps with the Staff Engineer role (cross-team decisions, ADRs, influence without authority): the [Staff Engineer page](../staff-engineer/questions.md) stresses adoption and supporting teams, this one design and distributed systems.

## The architect's role and stance

### "What sets a software architect apart from a tech lead or a Staff Engineer?"

- I start from scope and horizon: the tech lead owns the design and delivery of one team, over the sprint; the architect owns consistency across several teams, over several years.
- The architect's deliverable is not code but explicit decisions, with their trade-offs, and rules teams apply without them.
- My example: two services compute "active subscription" differently; I get the team to settle which one is the <span class="term" data-term="source-of-truth">source of truth</span>, I write an <span class="term" data-term="adr">ADR</span>, and a <span class="term" data-term="fitness-function">fitness function</span> then checks that no service recomputes the state.
- I acknowledge the overlap: Will Larson, "Staff Engineer" (2021), makes the architect one of the Staff Engineer archetypes. I ask what the role really expects.

**Read next**: [Staff+ archetypes](../../knowledge/culture-entreprise.md#staff-archetypes), [Two tracks: expertise and management](../../knowledge/culture-entreprise.md#two-tracks-expertise-and-management), [ADR](../../knowledge/architecture.md#adr), [Software, solution and enterprise architects](../../knowledge/culture-entreprise.md#software-solution-and-enterprise-architects)

### "Software, solution and enterprise architect: what are the differences?"

- I tell them apart by the question each one answers: how this system is built (software), how to meet this business need by assembling systems (solution), which systems the organization needs for its strategy (enterprise).
- The enterprise architect works with a <span class="term" data-term="capability-map">capability map</span> and frameworks such as TOGAF (The Open Group, 10th edition in 2022); they spot gaps and duplicates.
- I show the three levels on a single project, like pay in three installments: existing capability or not, provider or in-house build, then integration behind a single adapter.
- I say which of the three levels I practice most and who I rely on for the others.

**Read next**: [Map of scales](../../knowledge/architecture.md#map-of-scales), [Urbanizing the information system](../../knowledge/architecture.md#urbanizing-the-information-system), [Reference frameworks](../../knowledge/architecture.md#reference-frameworks), [Build, buy or partner](../../knowledge/culture-entreprise.md#build-buy-or-partner), [Software, solution and enterprise architects](../../knowledge/culture-entreprise.md#software-solution-and-enterprise-architects)

### "How do you stay technically credible without coding every day?"

- I do not code on a team's critical path: I would become a bottleneck. I code where it serves my decisions: a <span class="term" data-term="prototype">prototype</span>, a <span class="term" data-term="spike">spike</span>, a tool that checks an architecture rule.
- I read code every week through targeted reviews, and I take part in <span class="term" data-term="postmortem">postmortems</span>, where the real architecture drifts from the diagram.
- I translate both ways, from the cost of a technical choice for management to the business constraint for the team: Gregor Hohpe's elevator ("The Software Architect Elevator", 2020).
- I keep a short, regular tech watch aimed at my next decisions, and I say "I don't know, I'll check" when that is the case.

**Read next**: [Tech watch: architect](../../knowledge/veille.md#architect), [The blameless postmortem](../../knowledge/incidents.md#the-blameless-postmortem), [Estimating and slicing a feature](../../knowledge/culture-entreprise.md#estimating-and-slicing-a-feature), [Splitting my time and showing impact](../../knowledge/culture-entreprise.md#splitting-my-time-and-showing-impact)

## Requirements and quality attributes

### "The business wants a 'fast and reliable' system: how do you turn a vague need into architecture requirements?"

- I turn each adjective into a <span class="term" data-term="quality-attribute-scenario">measurable scenario</span> in six parts: "fast" becomes "500 users check their order, the page answers in under 300 ms at the <span class="term" data-term="p99">p99</span>".
- I get the numbers approved by those who pay for them, showing what each level costs.
- I sort the scenarios in a <span class="term" data-term="utility-tree">utility tree</span>, rated by business importance and technical difficulty: the important and difficult ones drive the architecture.
- I reread the ISO/IEC 25010 list (2023 revision) so as not to forget a quality family.

**Read next**: [Quality scenarios, utility tree and ATAM](../../knowledge/architecture.md#quality-scenarios-utility-tree-and-atam), [What quality means: ISO/IEC 25010](../../knowledge/qualite.md#what-quality-means-isoiec-25010)

### "How do you trade off between conflicting quality attributes?"

- I assume everything is a trade-off: <span class="term" data-term="availability">availability</span> costs money, a cache that cuts <span class="term" data-term="latency">latency</span> serves stale data.
- I decide with the scenario ranking approved by the business, not with my preferences, and I price each option in euros and risk.
- I do not make one trade-off for the whole system: a catalog accepts <span class="term" data-term="eventual-consistency">eventual consistency</span>, a payment does not.
- I write the trade-off and the threshold that should trigger a review; the ATAM method (Software Engineering Institute, 2000) calls these decisions tradeoff points.

**Read next**: [Quality scenarios, utility tree and ATAM](../../knowledge/architecture.md#quality-scenarios-utility-tree-and-atam), [Strong or eventual consistency](../../knowledge/architecture.md#strong-or-eventual-consistency), [Presenting a technical trade-off in business terms](../../knowledge/culture-entreprise.md#presenting-a-technical-trade-off-in-business-terms)

### "How do you estimate the capacity you need?", "How many servers for one million daily active users?"

- I do a <span class="term" data-term="back-of-envelope">back-of-the-envelope calculation</span> on the board: a day is about 100,000 seconds, so one million actions a day is about ten per second on average.
- I apply a peak factor, split reads and writes, estimate storage over the retention period, then Little's law (John Little, 1961) gives me the number of requests in flight.
- I compare with known orders of magnitude ("Latency Numbers Every Programmer Should Know", Jeff Dean, around 2009) to know whether one database is enough.
- I then validate with a <span class="term" data-term="load-test">load test</span>: a mental calculation stays a hypothesis.

**Read next**: [Orders of magnitude](../../knowledge/architecture.md#orders-of-magnitude), [Average and peak QPS](../../knowledge/architecture.md#average-and-peak-qps), [Little's law](../../knowledge/architecture.md#littles-law), [And the database](../../knowledge/architecture.md#and-the-database)

### "How do you approach a system design exercise?"

- I first clarify the needs and the quality attributes, then I state my assumptions and the orders of magnitude.
- I draw the simplest version that meets the need, each arrow with a verb and a protocol, and only then the scaling.
- I name the rejected option for each strong choice and I say what I would not do.
- I end with the limits: the points of failure, what breaks first at ten times the load, what I would measure.

**Read next**: [Estimating capacity](../../knowledge/architecture.md#estimating-capacity), [Resilience](../../knowledge/architecture.md#resilience), [the live exercises](exercices.md), [Example: a URL shortener](../../knowledge/architecture.md#example-a-url-shortener)

## Architecture styles and decomposition

### "Monolith, modular monolith or microservices: how do you choose?", "What is a distributed monolith?"

- I choose based on the number of teams and their need for independence, not on code size or fashion.
- By default, a <span class="term" data-term="modular-monolith">modular monolith</span> whose boundaries are checked automatically; I extract a <span class="term" data-term="microservice">microservice</span> for a measurable reason (delivery pace, scaling, isolation).
- Microservices turn function calls into network calls that fail, and data that no longer fits in one transaction. The worst outcome is the <span class="term" data-term="distributed-monolith">distributed monolith</span>, which adds up the flaws of both.
- I quote "Monolith First" (Martin Fowler, 2015) and I write down the signals that will trigger an extraction.

**Read next**: [Which style to choose](../../knowledge/architecture.md#which-style-to-choose), [Modular monolith](../../knowledge/architecture.md#modular-monolith), [Microservices](../../knowledge/architecture.md#microservices), [Lewis and Fowler, "Microservices" (2014)](../../knowledge/textes-fondateurs.md#lewis-and-fowler-microservices-2014)

### "How do you split a system into modules or services?", "How do you break up a monolith?"

- I split neither by technical layer nor by table: I split where the business language changes.
- I bring business and developers into an <span class="term" data-term="event-storming">event storming</span> workshop: a "product" does not mean the same thing to the catalog and to the warehouse, each meaning becomes a <span class="term" data-term="bounded-context">bounded context</span>.
- I draw the <span class="term" data-term="context-map">context map</span> (Eric Evans, "Domain-Driven Design", 2003) to decide who adapts to whom.
- A context is not necessarily a service; to leave a monolith, I start with the easiest and least risky context, then the strangler fig.

**Read next**: [Splitting the system](../../knowledge/architecture.md#splitting-the-system), [Event storming](../../knowledge/architecture.md#event-storming), [Context map](../../knowledge/architecture.md#context-map), [Strangler fig](../../knowledge/architecture.md#strangler-fig)

### "Hexagonal architecture, clean architecture: when are they worth their cost?"

- They serve one purpose: business rules depend neither on the database, nor the framework, nor external APIs. It is <span class="term" data-term="dependency-inversion">dependency inversion</span> applied to a whole service (Alistair Cockburn, ports and adapters, 2005).
- They are worth it when the business logic is rich, the system will live long and technologies may change: I test the business code with a <span class="term" data-term="fake-object">fake</span> in milliseconds.
- They are worth nothing for a service that reads and writes rows: three layers and conversions for nothing.
- I apply them to the business core and have the dependency rule checked by an automated test.

**Read next**: [Hexagonal and clean architecture](../../knowledge/architecture.md#hexagonal-and-clean-architecture), [D: dependency inversion](../../knowledge/principes-conception.md#d-dependency-inversion), [Fitness functions](../../knowledge/architecture.md#fitness-functions)

### "When should you choose an event-driven architecture?", "What happens if a message arrives twice?"

- I choose <span class="term" data-term="domain-event">domain events</span> when several services react to the same fact, or when the sender must not depend on their availability. I keep a synchronous call when the caller needs the answer to continue.
- <span class="term" data-term="choreography">Choreography</span> for independent reactions, orchestration for a multi-step process with cancellations, like a saga.
- A broker delivers at least once: I make each consumer idempotent, I plan a <span class="term" data-term="dead-letter-queue">dead letter queue</span> and I publish through the outbox.
- I make the flow observable end to end, otherwise nobody knows where an order stands.

**Read next**: [Event-driven architecture](../../knowledge/architecture.md#event-driven-architecture), [Queue or topic](../../knowledge/api-rest-async.md#queue-or-topic), [Delivery guarantees](../../knowledge/api-rest-async.md#delivery-guarantees), [Idempotency](../../knowledge/architecture.md#idempotency)

### "Serverless, containers or virtual machines: how do you choose?"

- I start from the load profile: <span class="term" data-term="serverless">serverless</span> for rare or spiky event-driven load; <span class="term" data-term="container">containers</span> for a service that runs all the time; a virtual machine for software or a license that requires one.
- I weigh the limits: <span class="term" data-term="cold-start">cold start</span>, maximum execution time, coupling to the provider.
- I compare the <span class="term" data-term="total-cost-ownership">total cost of ownership</span>, operating skills included: a Kubernetes platform needs a team that knows how to run it.
- I keep <span class="term" data-term="stateless">stateless</span> services, configured through the environment ("The Twelve-Factor App", Adam Wiggins, 2011), so I can change my mind.

**Read next**: [Serverless](../../knowledge/architecture.md#serverless), [Autoscaling and serverless: HPA, KEDA, Knative, Karpenter](../../knowledge/kubernetes-echelle.md#autoscaling-and-serverless-hpa-keda-knative-karpenter), [Total cost of ownership](../../knowledge/culture-entreprise.md#total-cost-of-ownership)

## Distributed systems and data

### "What does the CAP theorem say, and how do you use it?", "Strong or eventual consistency for a bank balance, and for a like counter?"

- CAP (Eric Brewer, 2000, proven by Gilbert and Lynch in 2002): during a <span class="term" data-term="network-partition">network partition</span>, a distributed system chooses between consistency and availability. "Two out of three" is misleading: the partition is not optional.
- Outside failures, PACELC (Daniel Abadi, 2012) adds the trade-off between latency and consistency.
- I reason per operation: a bank balance wants <span class="term" data-term="strong-consistency">strong consistency</span>, a like counter accepts eventual consistency.
- I translate into settings: read and write <span class="term" data-term="quorum">quorums</span>, read from the leader or from a replica.

**Read next**: [CAP and PACELC](../../knowledge/architecture.md#cap-and-pacelc), [Strong or eventual consistency](../../knowledge/architecture.md#strong-or-eventual-consistency), [Replication and quorum](../../knowledge/architecture.md#replication-and-quorum), [The eight fallacies](../../knowledge/architecture.md#the-eight-fallacies)

### "How do you choose a database?"

- I start from access patterns and volumes, not from a technology name.
- By default, a <span class="term" data-term="relational-database">relational database</span>: transactions, constraints, a technology everyone knows how to run; with <span class="term" data-term="jsonb">JSONB</span>, it covers many "document" needs.
- I add another family (key-value, document, wide-column, graph, search) only for a pattern the relational one serves badly, and I feed it through <span class="term" data-term="cdc">CDC</span> rather than a dual write.
- I quote the innovation tokens of "Choose Boring Technology" (Dan McKinley, 2015): each extra database costs in operations.

**Read next**: [Choosing the type of database](../../knowledge/architecture.md#choosing-the-type-of-database), [One database per service](../../knowledge/architecture.md#one-database-per-service), [Exercise 2: the catalog ADR](exercices.md)

### "Your database is saturated, what do you do?", "Vertical or horizontal: how do you decide?"

- I clear up the ambiguity: "vertical" and "horizontal" talk about the machine or the data.
- I start from the numbers (volume, write throughput, read share, growth) and climb the ladder from cheapest to most expensive: queries and indexes, a <span class="term" data-term="vertical-scaling">bigger machine</span>, <span class="term" data-term="read-replica">read replicas</span> while handling <span class="term" data-term="replication-lag">replication lag</span>, table partitioning.
- <span class="term" data-term="sharding">Sharding</span> comes last: it is almost irreversible, the key freezes the possible queries. I then compare it with <span class="term" data-term="distributed-sql">distributed SQL</span>.
- I write the decision with the signal that would trigger the next step.

**Read next**: [Scaling a database](../../knowledge/sql.md#scaling-a-database), [Two meanings of "vertical" and "horizontal"](../../knowledge/sql.md#two-meanings-of-vertical-and-horizontal), [Sharding, last](../../knowledge/sql.md#sharding-last)

### "How do you keep data consistent across several services without a distributed transaction?", "How do you publish an event without losing it once the database has written?"

- I separate what must be true at every instant (in one service, a <span class="term" data-term="db-transaction">local transaction</span>) from what can converge later (a saga).
- Saga (Garcia-Molina and Salem, 1987): each step has a <span class="term" data-term="compensation">compensation</span>; beyond three or four steps, I prefer orchestration, which keeps the state in one place.
- I write each message through the <span class="term" data-term="outbox-pattern">outbox</span>, delivered at least once, handled by an <span class="term" data-term="idempotent-consumer">idempotent consumer</span>.
- I rule out <span class="term" data-term="two-phase-commit">two-phase commit</span> between services: it blocks everyone as soon as one participant stops answering.

**Read next**: [Orchestrated or choreographed saga](../../knowledge/architecture.md#orchestrated-or-choreographed-saga), [Outbox](../../knowledge/architecture.md#outbox), [The write-then-publish trap](../../knowledge/api-rest-async.md#the-write-then-publish-trap), [Exercise 5: the order saga](exercices.md), [Payment authorization and capture](../../knowledge/architecture.md#payment-authorization-and-capture)

### "Two customers book the last slot at the same time, what happens?"

- I show the read, decide, write timeline: both read "free", both write, so two bookings.
- I protect in the database, not in the code nor in the cache: an atomic `UPDATE ... WHERE seats_left > 0`, a uniqueness constraint or an exclusion constraint on time ranges.
- I choose pessimistic locking when conflicts are frequent, optimistic when they are rare.

**Read next**: [Concurrent writes](../../knowledge/sql.md#concurrent-writes), [Isolation levels](../../knowledge/sql.md#isolation-levels), [Exercise 3: the C4 views of a booking platform](exercices.md), [Exclusion constraint: no overlapping slots](../../knowledge/sql.md#exclusion-constraint-no-overlapping-slots), [Constraints: the database keeps the rules](../../knowledge/sql.md#constraints-the-database-keeps-the-rules)

### "CQRS and event sourcing: when to use them, and when to avoid them?"

- I treat the two ideas separately: <span class="term" data-term="cqrs">CQRS</span> (Greg Young, 2010) separates write and read models where their shapes diverge, without requiring event sourcing.
- I keep <span class="term" data-term="event-sourcing">event sourcing</span> for domains where "what happened, and when?" is a business question: an accounting ledger, a claims workflow.
- I price the cost: lagging <span class="term" data-term="projection-read-model">projections</span>, event versioning, erasure of personal data.
- I apply it to one subdomain, never to the whole system, and stay with CRUD elsewhere.

**Read next**: [CQRS](../../knowledge/architecture.md#cqrs), [Event sourcing](../../knowledge/architecture.md#event-sourcing), [Right to erasure and event logs](../../knowledge/securite.md#right-to-erasure-and-event-logs)

### "How do you evolve a schema without downtime?", "How do you rename a column in production?"

- During a <span class="term" data-term="rolling-update">rolling deployment</span>, the old and new versions run together on the same schema: a direct rename breaks one of them.
- I split into <span class="term" data-term="expand-contract">expand / contract</span> (Danilo Sato, "Parallel Change", 2014): add, write to both, <span class="term" data-term="backfill">backfill</span> in batches, switch reads, stop the old write, drop.
- Each step is a separate, reversible deployment, except the drop, done after a backup.
- To change databases, I prefer CDC to an application <span class="term" data-term="dual-write">dual write</span>, which diverges silently.

**Read next**: [Zero-downtime schema migrations](../../knowledge/sql.md#zero-downtime-schema-migrations), [Changing without breaking: expand and contract](../../knowledge/architecture.md#changing-without-breaking-expand-and-contract), [Exercise 9: rename a column](exercices.md)

## Integration and APIs

### "REST, gRPC, GraphQL or messages: how do you choose the integration style?"

- I first choose between synchronous and asynchronous: if the caller needs the answer, a call; if it announces a fact, an event, which removes <span class="term" data-term="temporal-coupling">temporal coupling</span>.
- <span class="term" data-term="rest-api">REST</span> by default for the web and partners; <span class="term" data-term="grpc">gRPC</span> between high-traffic internal services; <span class="term" data-term="graphql">GraphQL</span> when several screens compose the same data differently.
- I limit the company to three or four styles, each described in a contract (<span class="term" data-term="openapi">OpenAPI</span>, `.proto`, GraphQL schema, <span class="term" data-term="asyncapi">AsyncAPI</span>).
- Reference: "Enterprise Integration Patterns" (Gregor Hohpe and Bobby Woolf, 2003).

**Read next**: [REST or GraphQL?](../../knowledge/api-rest-async.md#rest-or-graphql), [Other styles, in one line](../../knowledge/api-rest-async.md#other-styles-in-one-line), [Message, event, command](../../knowledge/api-rest-async.md#message-event-command)

### "How do you evolve contracts between teams without blocking them?", "How do you evolve an API without breaking its clients?"

- I want a provider to deploy alone as long as it breaks nobody, and the CI to prove it.
- Synchronous APIs: <span class="term" data-term="consumer-driven-contract">consumer-driven contracts</span> (Ian Robinson, 2006, tooled with Pact); messages: a <span class="term" data-term="schema-registry">schema registry</span> that enforces a compatibility rule.
- On the consumer side, the <span class="term" data-term="tolerant-reader">tolerant reader</span>; on the provider side, a <span class="term" data-term="breaking-change">breaking change</span> becomes a new field or a new version, with an announced removal date.
- I assume every visible behavior is used by someone (Hyrum's law).

**Read next**: [Versioning](../../knowledge/api-rest-async.md#versioning), [Tolerant Reader: a client that does not break](../../knowledge/api-rest-async.md#tolerant-reader-a-client-that-does-not-break), [The contract test](../../knowledge/qualite.md#the-contract-test), [Hyrum's law](../../knowledge/lois-et-principes.md#hyrums-law)

### "API gateway, BFF, service mesh: what role for each?"

- The <span class="term" data-term="api-gateway">API gateway</span> guards the boundary (token, <span class="term" data-term="rate-limit">rate limit</span>, routing, logs), with no business rule at all.
- The <span class="term" data-term="bff">BFF</span> (Sam Newman, 2015) belongs to the team of one interface and assembles data for its screens.
- The <span class="term" data-term="service-mesh">service mesh</span> handles internal traffic uniformly: <span class="term" data-term="mtls">mTLS</span>, timeouts, retries, traces, without touching the code. I only add it when the number of services makes manual work unmanageable.
- The main risk: business logic in the gateway, which becomes a shared monolith.

**Read next**: [API management](../../knowledge/api-rest-async.md#api-management), [API gateway: KrakenD, nginx](../../knowledge/outils.md#api-gateway-krakend-nginx), [Zero trust and service-to-service identity](../../knowledge/securite.md#zero-trust-and-service-to-service-identity)

### "What is a webhook, and how do you secure it?"

- The sender calls my URL when the event happens, instead of me polling it in a loop.
- I always check the signature, I answer `200` fast then process, and I accept receiving the same webhook twice.
- I do not rely on the webhook alone: a job polls the provider for states left pending too long.

**Read next**: [Webhook](../../knowledge/api-rest-async.md#webhook), [Exercise 3: payment by webhook](exercices.md)

## Reliability, performance and scaling

### "How do you design a highly available system?"

- I ask what one hour of downtime costs, journey by journey, to set an <span class="term" data-term="slo">SLO</span>, an <span class="term" data-term="rto">RTO</span> and an <span class="term" data-term="rpo">RPO</span>.
- I do the math: two components at 99.9 % in series give 99.8 %, about 17.5 hours of downtime a year instead of 8.8.
- I remove each <span class="term" data-term="spof">SPOF</span> through redundancy, in the order instance, zone, region; multi-region only if the RTO or the law requires it.
- A <span class="term" data-term="failover">failover</span> never tested does not exist: I have it rehearsed.

**Read next**: [Single point of failure](../../knowledge/architecture.md#single-point-of-failure), [Composite availability](../../knowledge/architecture.md#composite-availability), [Zones and regions](../../knowledge/architecture.md#zones-and-regions), [RTO and RPO](../../knowledge/architecture.md#rto-and-rpo)

### "How do you prevent cascading failures?", "A service you depend on becomes slow, what do you do?"

- A slow dependency is more dangerous than a dead one: it holds resources. Each call has a <span class="term" data-term="timeout">timeout</span> shorter than the caller's.
- Rare retries, with <span class="term" data-term="exponential-backoff">exponential backoff</span> and <span class="term" data-term="jitter">jitter</span>, at a single level, on idempotent operations: three levels of three retries send 27 requests to the saturated dependency.
- A <span class="term" data-term="circuit-breaker">circuit breaker</span> per dependency, <span class="term" data-term="bulkhead">bulkheads</span>, <span class="term" data-term="load-shedding">load shedding</span> at the entrance (Michael Nygard, "Release It!", 2007, 2nd edition 2018).
- I decide with the product the degraded mode of each non-critical dependency, before the incident.

**Read next**: [Resilience](../../knowledge/architecture.md#resilience), [Retry budget](../../knowledge/architecture.md#retry-budget), [Graceful degradation](../../knowledge/architecture.md#graceful-degradation), [Exercise 6: the resilient client](exercices.md)

### "How does the architecture limit the impact of incidents?", "Is MTTR a good indicator?"

- I reduce the <span class="term" data-term="blast-radius">blast radius</span> by construction: <span class="term" data-term="cell-based-architecture">cell-based architecture</span>, isolation of the customers of a <span class="term" data-term="multi-tenancy">multi-tenant</span> platform, cell-by-cell releases.
- I decide each function's degradation in advance, I plan a <span class="term" data-term="kill-switch">kill switch</span> and I aim for <span class="term" data-term="static-stability">static stability</span>.
- Average <span class="term" data-term="mttr">MTTR</span> is misleading: one long incident crushes it. I look at the median, the worst case and recurring incidents.
- I read postmortems together: a recurring pattern becomes an ADR, then a fitness function, and a <span class="term" data-term="game-day">game day</span> checks the fix.

**Read next**: [Cell-based architecture](../../knowledge/architecture.md#cell-based-architecture), [Metrics and their limits](../../knowledge/incidents.md#metrics-and-their-limits), [Learning from incidents at scale](../../knowledge/incidents.md#learning-from-incidents-at-scale), [Practicing: game days and chaos engineering](../../knowledge/incidents.md#practicing-game-days-and-chaos-engineering)

### "The load is multiplied by ten, what do you do?", "Why doesn't doubling the servers double the throughput?"

- I measure before choosing: a load test at ten times the traffic shows what breaks first.
- I make the application stateless and scale it out; I relieve the database (indexes, cache, replicas), partitioning last; I take off the critical path whatever can be asynchronous.
- I look for hot keys and contention: Amdahl's law (1967) caps the gain if 5 % of the work stays sequential, the <span class="term" data-term="usl">USL</span> (Neil Gunther, 1993) shows that too many machines lower the throughput.
- For a worker reading a queue, I scale on the queue lag, not on CPU.

**Read next**: [Scale cube](../../knowledge/architecture.md#scale-cube), [Amdahl's law](../../knowledge/lois-et-principes.md#amdahls-law), [Universal Scalability Law (USL)](../../knowledge/lois-et-principes.md#universal-scalability-law-usl), [What to use for scaling](../../knowledge/kubernetes-echelle.md#what-to-use-for-scaling)

### "Where do you put a cache, and how do you keep a popular key that expires from taking down the database?"

- I sort data by acceptable freshness and computation cost before talking about tools.
- I reason in layers: browser, <span class="term" data-term="cdn">CDN</span> with explicit `Cache-Control`, gateway, then <span class="term" data-term="cache-aside">cache-aside</span> in the application with a TTL set by the business.
- Against a <span class="term" data-term="cache-stampede">cache stampede</span>: request coalescing, <span class="term" data-term="stale-while-revalidate">stale-while-revalidate</span> (RFC 5861, 2010), slightly random expiry.
- I keep sensitive decisions out of the cache, like a payment or an access right.

**Read next**: [Where to put a cache](../../knowledge/architecture.md#where-to-put-a-cache), [Reading and writing with a cache](../../knowledge/architecture.md#reading-and-writing-with-a-cache), [Invalidation and cache stampede](../../knowledge/architecture.md#invalidation-and-cache-stampede)

### "Design a rate limiter for an API open to partners."

- I compare fixed window, sliding window and token bucket, which accepts bounded bursts.
- I share the counter between instances, for example in Redis, otherwise each instance lets its own limit through.
- I return `429` with `Retry-After`, and I document the limits per partner.

**Read next**: [Rate limiting](../../knowledge/architecture.md#rate-limiting), [Load shedding and backpressure](../../knowledge/architecture.md#load-shedding-and-backpressure), [Multi-tenant isolation and the noisy neighbor](../../knowledge/architecture.md#multi-tenant-isolation-and-the-noisy-neighbor)

## Security and compliance

### "How do you build security in from the design stage?", "Have you ever done threat modeling?"

- I run a one-hour <span class="term" data-term="threat-modeling">threat modeling</span> session for each feature that touches a <span class="term" data-term="trust-boundary">trust boundary</span>, with a data flow diagram.
- I run each element through the <span class="term" data-term="stride">STRIDE</span> grid (Kohnfelder and Garg, Microsoft, 1999), with Adam Shostack's four questions (2014).
- I rank by likelihood and impact, and each threat kept becomes a testable requirement: a refusal test, a <span class="term" data-term="static-analysis">static analysis</span> rule, an infrastructure policy.
- I reason in <span class="term" data-term="defense-in-depth">defense in depth</span>, and I quote BOLA, first risk of the OWASP API Security Top 10 (2023 edition).

**Read next**: [Threat modeling (STRIDE)](../../knowledge/securite.md#threat-modeling-stride), [The most common API vulnerabilities](../../knowledge/securite.md#the-most-common-api-vulnerabilities), [Exercise 10: STRIDE of an upload API](exercices.md)

### "How do you secure communication between services?", "What is zero trust?"

- I start from <span class="term" data-term="zero-trust">zero trust</span> (NIST SP 800-207, 2020): being inside the cluster proves nothing.
- Each service gets a short-lived <span class="term" data-term="workload-identity">workload identity</span> issued by the platform (for example in the <span class="term" data-term="spiffe">SPIFFE</span> format), and calls go over mTLS.
- A policy says who may call what, following <span class="term" data-term="least-privilege">least privilege</span>, deny by default.
- When a service acts for a user, I propagate the person's identity in a token with a restricted audience.

**Read next**: [Zero trust and service-to-service identity](../../knowledge/securite.md#zero-trust-and-service-to-service-identity), [A deny-by-default policy](../../knowledge/securite.md#a-deny-by-default-policy), [NIST SP 800-207](../../knowledge/textes-fondateurs.md#nist-sp-800-207-zero-trust-architecture-2020)

### "RBAC or ABAC?", "Where do you check permissions?"

- Roles for a few stable profiles, attributes when the rule depends on the data (country, amount, owner), relationships for sharing.
- The decision is made server side, in the service that owns the data, deny by default; the gateway only checks the token.
- I check that the object belongs to the caller on every read: that is what prevents BOLA.

**Read next**: [Modeling permissions: RBAC, ABAC, ReBAC](../../knowledge/securite.md#modeling-permissions-rbac-abac-rebac), [Where to enforce checks](../../knowledge/securite.md#where-to-enforce-checks)

### "How does the architecture take GDPR and personal data into account?"

- I treat <span class="term" data-term="gdpr">GDPR</span> as an architecture requirement: <span class="term" data-term="privacy-by-design">privacy by design</span> (article 25, applied since May 2018) starts with <span class="term" data-term="data-minimization">data minimization</span>.
- I concentrate personal data in one owning service and the others only handle an identifier: <span class="term" data-term="pseudonymization">pseudonymization</span>, which does not take the data out of GDPR.
- The right to erasure in immutable logs and backups goes through <span class="term" data-term="crypto-shredding">crypto-shredding</span>.
- <span class="term" data-term="data-residency">Data residency</span> guides the choice of regions; for a risky processing, an impact assessment with the <span class="term" data-term="dpo">DPO</span> before freezing the architecture.

**Read next**: [Personal data and GDPR in the architecture](../../knowledge/securite.md#personal-data-and-gdpr-in-the-architecture), [Pseudonymisation or anonymisation](../../knowledge/securite.md#pseudonymisation-or-anonymisation), [Data residency](../../knowledge/securite.md#data-residency)

## Cloud, costs and operations

### "How do you factor cost into architecture choices?"

- I treat cost as a quality attribute, just like performance.
- I express it per business unit, with <span class="term" data-term="unit-economics">unit costs</span> like the cost per 1,000 orders: a growing total may just reflect growing activity.
- For each option, I compare infrastructure, human operating time and the cost of the downtime it avoids.
- I make these numbers visible to the teams that generate them, in the <span class="term" data-term="finops">FinOps</span> spirit (FinOps Foundation, 2019).

**Read next**: [Costs and savings](../../knowledge/donnees-decision.md#costs-and-savings), [Total cost of ownership](../../knowledge/culture-entreprise.md#total-cost-of-ownership), [CAPEX and OPEX](../../knowledge/culture-entreprise.md#capex-and-opex), [Exercise 12: weigh a cost](exercices.md)

### "Should you avoid cloud provider lock-in?"

- I treat lock-in as one cost among others, not as an absolute evil: a <span class="term" data-term="managed-service">managed service</span> often saves months of operations right now.
- For each component I estimate the <span class="term" data-term="vendor-lock-in">lock-in</span> it creates, the likelihood of having to leave and the <span class="term" data-term="switching-cost">switching cost</span>.
- I keep the portability effort for components where leaving is likely or expensive, I watch the <span class="term" data-term="egress-fees">egress fees</span> and I keep data in exportable formats.
- Reference: "Don't get locked up into avoiding lock-in" (Gregor Hohpe, 2019).

**Read next**: [Vendor lock-in, a cost to price](../../knowledge/culture-entreprise.md#vendor-lock-in-a-cost-to-price), [Build, buy or partner](../../knowledge/culture-entreprise.md#build-buy-or-partner)

### "How do you make observability an architecture requirement?", "SLI, SLO, SLA: what is the difference?"

- A service nobody can diagnose is not ready for production: I require three things before go-live.
- SLOs written from the user's point of view; common <span class="term" data-term="instrumentation">instrumentation</span> with <span class="term" data-term="opentelemetry">OpenTelemetry</span>, so that <span class="term" data-term="trace-distributed">distributed traces</span> cross team boundaries thanks to the `traceparent` header; alerts on the consumption of the <span class="term" data-term="error-budget">error budget</span>.
- The SLI is the measured number, the SLO the internal target, the SLA the contract with a penalty, looser than the SLO.
- The error budget arbitrates between new features and reliability ("Site Reliability Engineering", Google, 2016).

**Read next**: [SLI, SLO, error budget](../../knowledge/observabilite.md#sli-slo-error-budget), [Burn rate](../../knowledge/observabilite.md#burn-rate), [Propagation across services](../../knowledge/observabilite.md#propagation-across-services), [Alerting on symptoms](../../knowledge/observabilite.md#alert-on-symptoms-not-on-causes)

## Modernization and evolution

### "How do you modernize an existing system?"

- I start from a precise business problem, not from a craving for technology.
- I apply the <span class="term" data-term="strangler-fig">strangler fig</span> (Martin Fowler, 2004): a routing point sends some requests to the new component, an <span class="term" data-term="anti-corruption-layer">anti-corruption layer</span> translates the models.
- In the code, <span class="term" data-term="branch-by-abstraction">branch by abstraction</span> and <span class="term" data-term="feature-flag">feature flags</span> to switch gradually and roll back in a minute.
- Each step delivers value and removes old code.

**Read next**: [Strangler fig](../../knowledge/architecture.md#strangler-fig), [Modernizing an existing system](../../knowledge/architecture.md#modernizing-an-existing-system), [Changing legacy code](../../knowledge/principes-conception.md#changing-legacy-code)

### "Full rewrite or gradual overhaul: how do you decide?"

- My default position is the gradual overhaul: a <span class="term" data-term="rewrite">rewrite</span> must catch up with years of implicit rules while the old system keeps evolving, and delivers nothing before the switch.
- I quote "Things You Should Never Do" (Joel Spolsky, 2000) and the <span class="term" data-term="second-system-effect">second-system effect</span> (Fred Brooks, 1975).
- I only rewrite in a few cases: a technology with no upgrade path, a small and well-tested system, a need so different that the old code covers almost none of it.
- Even then, I deliver in slices and set stop criteria before starting.

**Read next**: [Rewrite or redesign progressively](../../knowledge/architecture.md#rewrite-or-redesign-progressively), [Sacrificial architecture](../../knowledge/architecture.md#sacrificial-architecture), [Chesterton's fence](../../knowledge/lois-et-principes.md#chestertons-fence)

### "How do you keep the architecture from drifting away from the code over time?"

- I turn important decisions into fitness functions (Ford, Parsons and Kua, "Building Evolutionary Architectures", 2017) that run in the CI on every merge request.
- For dependencies between modules, <span class="term" data-term="architecture-rule">architecture rules</span> with import-linter in Python or ArchUnit in Java.
- I start with two or three rules, like no <span class="term" data-term="dependency-cycle">dependency cycles</span>.
- Existing exceptions are listed, dated, and the list only shrinks.

**Read next**: [Fitness functions](../../knowledge/architecture.md#fitness-functions), [Exercise 11: a fitness function](exercices.md), [Waivers and the target architecture](../../knowledge/architecture.md#waivers-and-the-target-architecture)

### "How do you ship several times a day without downtime?"

- I design for independent deployment: compatible contracts, expand / contract migrations, no shared database that forces teams to release together.
- I separate deploying from enabling with feature flags, and I release progressively (canary, blue-green) with stop criteria written beforehand.
- I measure with the four DORA metrics, speed and stability read together.

**Read next**: [Designing for continuous delivery](../../knowledge/architecture.md#designing-for-continuous-delivery), [Separating deploy from release](../../knowledge/architecture.md#separating-deploy-from-release), [Progressive deployment](../../knowledge/livraison.md#progressive-deployment), [Measuring delivery: DORA](../../knowledge/livraison.md#measuring-delivery-dora)

## Documentation, governance and communication

### "How do you document an architecture?", "How do you document an architecture decision?"

- I document for specific readers: a newcomer, a neighboring team, an auditor.
- For diagrams, the <span class="term" data-term="c4-model">C4 model</span> (Simon Brown): context for everyone, containers for developers, rarely further.
- For decisions, short ADRs (Michael Nygard, 2011), because the "why" is what gets lost fastest; a superseded decision keeps its ADR, with the status "superseded by".
- Everything lives in the repository as <span class="term" data-term="docs-as-code">docs as code</span>, reviewed in the same merge request as the change.

**Read next**: [C4 model](../../knowledge/architecture.md#c4-model), [ADR](../../knowledge/architecture.md#adr), [arc42](../../knowledge/architecture.md#arc42), [Design before coding](../../knowledge/livraison.md#design-before-coding), [Superseding an outdated ADR](../../knowledge/architecture.md#superseding-an-outdated-adr)

### "How do you run a useful architecture review without becoming a blocking committee?", "How do you make an important technical decision as a team?"

- I make the review a service, not a gate: the <span class="term" data-term="advice-process">advice process</span> (Andrew Harmel-Law, 2021) lets the team that bears the consequences decide, after seeking advice.
- I scale the effort to reversibility: an easy-to-undo decision takes one discussion, a hard-to-undo one deserves a written review (type 1 and type 2 decisions).
- I test the proposal against a few concrete scenarios, and the advice and decisions are public.
- When I disagree, I write my objection, then I commit to the decision taken.

**Read next**: [Advice process](../../knowledge/culture-entreprise.md#advice-process), [Type 1 and type 2 decisions](../../knowledge/culture-entreprise.md#type-1-and-type-2-decisions), [RFCs and design documents](../../knowledge/culture-entreprise.md#rfcs-and-design-documents), [Disagree and commit](../../knowledge/culture-entreprise.md#disagree-and-commit), [Influence without authority and communities of practice](../../knowledge/culture-entreprise.md#influence-without-authority-and-communities-of-practice)

### "How do you frame technology choices across several teams?"

- I keep a company radar with a clear mandate, written criteria per ring and a review at a fixed pace.
- Proposals are open to every team; an adopted technology becomes a tooled <span class="term" data-term="golden-path">golden path</span>, a retained technology gets an ADR.

**Read next**: [Company tech radar](../../knowledge/architecture.md#company-tech-radar), [Golden paths and templates](../../knowledge/devx.md#golden-paths-and-templates), [Waivers and the target architecture](../../knowledge/architecture.md#waivers-and-the-target-architecture)

### "How do you present an architecture choice to non-technical decision makers?", "How do you convince management to fund an overhaul?"

- I start with the recommendation and the decision I expect, then the reasons (pyramid principle, Barbara Minto).
- I translate each argument into a consequence the decision maker already arbitrates: cost, delay, customer risk, legal obligation.
- I always present the "do nothing" option with its cost, and the cost of delay.
- I say whether the decision is a <span class="term" data-term="reversible-change">reversible change</span>, and what would change my recommendation.

**Read next**: [Pyramid principle](../../knowledge/culture-entreprise.md#pyramid-principle), [Presenting a technical trade-off in business terms](../../knowledge/culture-entreprise.md#presenting-a-technical-trade-off-in-business-terms), [Cost of delay](../../knowledge/culture-entreprise.md#cost-of-delay), [One-pager](../../knowledge/culture-entreprise.md#one-pager)

### "What does Conway's law say, and how do you use it?", "How would you organize teams around a platform?"

- Melvin Conway (1968): systems mirror the communication structure of those who design them. A front-end team, a back-end team and a database team produce three coupled layers.
- I use it to diagnose (a service that needs three teams for every release) and to design, with the <span class="term" data-term="inverse-conway-maneuver">inverse Conway maneuver</span>.
- I split by cognitive load with "Team Topologies" (Skelton and Pais, 2019), and I work with the managers, who own the team structure.

**Read next**: [Conway's law](../../knowledge/architecture.md#conways-law), [Conway's law (laws page)](../../knowledge/lois-et-principes.md#conways-law), [Team Topologies](../../knowledge/culture-entreprise.md#team-topologies)

### "How do you know your new architecture works?"

- I take a baseline before the change, the same measure after, over a window of the same length, and a guard metric that must not get worse.
- I give an SLI, an internal SLO and, if there is an external customer, a looser SLA with a penalty.

**Read next**: [Measuring success (architecture)](../../knowledge/architecture.md#measuring-success), [Measuring success](#measuring-success)

## AI and architecture

### "How do you integrate a language model into an architecture?", "Five teams call LLMs each with their own key, what do you propose?"

- I treat an <span class="term" data-term="llm">LLM</span> as an external dependency that is slow, billed per <span class="term" data-term="token-llm">token</span> and non-deterministic.
- All calls go through an <span class="term" data-term="llm-gateway">LLM gateway</span> that alone holds the keys, applies quotas and masking of personal data, and tracks cost per team.
- For factual answers, <span class="term" data-term="rag">RAG</span> (Patrick Lewis et al., 2020) limits <span class="term" data-term="hallucination">hallucinations</span>; <span class="term" data-term="llm-eval">evaluations</span> are replayed on every prompt or model change.
- I treat every input as a possible <span class="term" data-term="prompt-injection">prompt injection</span> and limit the model's actions with <span class="term" data-term="llm-guardrail">guardrails</span> and least privilege.

**Read next**: [The LLM gateway: a single point of passage](../../knowledge/ia-entreprise.md#the-llm-gateway-a-single-point-of-passage), [RAG](../../knowledge/ia-agents.md#rag-retrieval-augmented-generation), [Context security](../../knowledge/ia-agents.md#context-security), [Testing an agent-based system](../../knowledge/ia-capacites.md#testing-an-agent-based-system)

## Deal-breakers

These questions test the stance more than the technique: one bad answer is enough to rule out a candidate.

| Question | What rules me out | What I answer | Read next |
|---|---|---|---|
| "What do you do if teams do not follow the target architecture?" | imposing, blocking, saying no to everything | I listen first, because a deviation often signals a target that is badly explained or too costly; I make the right path easier with a <span class="term" data-term="golden-path">golden path</span>, I accept written and dated <span class="term" data-term="waiver">waivers</span>, and I only block on security, data or reliability | [Golden paths and templates](../../knowledge/devx.md#golden-paths-and-templates), [Getting a tool adopted without imposing it](../../knowledge/devx.md#getting-a-tool-adopted-without-imposing-it) |
| "How do you recognize that you have over-architected a system?" | never having over-architected | I name the signs of <span class="term" data-term="over-engineering">over-engineering</span> (more time on the platform than on the business, components for a load that never came, one change that touches five services); it is <span class="term" data-term="accidental-complexity">accidental complexity</span>, which I prevent with <span class="term" data-term="yagni">YAGNI</span> and by distrusting <span class="term" data-term="resume-driven-development">resume-driven development</span>, mine included | [YAGNI and rule of three](../../knowledge/principes-conception.md#yagni-and-rule-of-three), [Gall's law](../../knowledge/lois-et-principes.md#galls-law) |
| "How do you react when one of your architecture decisions turns out to be wrong?" | defending the decision on principle, or hiding the mistake | I acknowledge it fast with facts, I separate the quality of the decision from that of the outcome, I price fixing, working around or rolling back without counting the effort already spent, I write a new ADR that supersedes the old one and I run a blameless postmortem on the decision | [ADR](../../knowledge/architecture.md#adr), [The blameless postmortem](../../knowledge/incidents.md#the-blameless-postmortem) |

## The three things an architect does all the time

1. **Make trade-offs explicit**: I translate each choice into quality requirements, costs and risks, and I say what we accept not to have. For example, before going multi-region, I set the yearly cost of the option against the real cost of a region outage, then the business picks its level of risk.
2. **Keep the architecture true in the code**: I protect important decisions with automated tests, documentation in the repository and up-to-date ADRs. For example, an import-linter rule keeps the domain from importing the ORM, and the list of exceptions shrinks with every ticket.
3. **Get teams to decide rather than deciding for them**: I advise, test proposals against concrete scenarios and make the right path easy. For example, I replace a monthly committee with an advice process: the team asks for advice, decides and writes an ADR within a week.

## Answering out loud

For almost every architecture question, I follow this thread, close to the STAR method (situation, task, action, result):

1. **Context**: which business problem, for whom, with what volume and which team?
2. **Quality requirements**: which properties matter here (availability, latency, cost, security, evolvability), with numbers?
3. **Options**: which architectures are possible, including "change nothing"?
4. **Trade-offs**: what each option brings, what it costs, what it gives up.
5. **Decision**: the option I recommend, and why in this precise context.
6. **Risks and reversibility**: what can go wrong, and what a rollback costs.
7. **Verification**: the measure, automated test or checkpoint that will tell whether the decision was right.

I favor lived examples; if I have not lived a case, I present it as hypothetical and explain my reasoning. The core idea: an architect does not pick the most elegant solution, they pick the one whose trade-offs fit the context, make them visible, and make sure the decision stays true in the code and in the organization.

## Measuring success

I know my preparation works when I answer a random question in two minutes, out loud, with a named trade-off and a lived story. Before starting, I take a baseline: I draw ten questions from this page and count those where my answer contains a context, a rejected option and a verification. I take the same measure two weeks later, on ten other questions. The guard metric is the share of answers based on a lived case: if it drops while the score rises, I am learning outlines by heart instead of preparing my stories.

I track an <span class="term" data-term="sli">SLI</span> (the measured number) with an <span class="term" data-term="slo">SLO</span> (my internal target); an <span class="term" data-term="sla">SLA</span> (the contractual promise made to a customer) makes no sense for personal preparation.

| Solution | Success indicator (SLI) | Likely SLO | Likely SLA |
|---|---|---|---|
| read the outline out loud, then the linked section | share of random questions I answer in two minutes | 8 questions out of 10 | not applicable: no external contract |
| prepare one lived story per theme | number of themes covered by at least one lived decision I can tell | 10 themes out of 12 | not applicable: no external contract |
| name the trade-off and the rejected option | share of recorded answers that mention a rejected option | 9 answers out of 10 | not applicable: no external contract |
| follow the answering thread | share of answers that end with a verification (measure, test, checkpoint) | 8 answers out of 10 | not applicable: no external contract |
| rehearse the deal-breakers | answers to the three deal-breaker questions without a defensive stance, judged by a peer | 3 out of 3 | not applicable: no external contract |

[Take with caution: example orders of magnitude, to adjust to my starting level and to the target role]

## Pitfalls to avoid

| Pitfall | What happens | Solution |
| --- | --- | --- |
| **Answering in the conditional**: I say "I would" to a question about a past decision. | The interviewer hears a theory and doubts I have ever decided anything. | I prepare one lived story per theme and tell it with the [answering thread](#answering-out-loud). |
| **Quoting a pattern without its cost**: I recommend microservices, CQRS or multi-region without saying what they cost. | My answer sounds learned, and the next question asks when I would not do it. | I always name the trade-off and the situation where I would do the opposite ([The three things](#the-three-things-an-architect-does-all-the-time)). |
| **Deciding for the teams**: I present the architect as the one who settles everything. | The interviewer sees a future blocking committee, bypassed by the teams. | I describe the advice process and the golden path ([Deal-breakers](#deal-breakers)). |
| **Forgetting the business**: I start from technology instead of the need and the quality attributes. | I cannot justify any choice with an approved number. | I start from the quality scenarios and the cost of an hour of downtime ([Requirements and quality attributes](#requirements-and-quality-attributes)). |
| **Reciting the outlines**: I learn this page by heart. | I get stuck as soon as the question is phrased differently, and the answer sounds fake. | I read the linked section to understand the mechanism, then I answer with my own words and numbers. |
| **Never admitting a mistake**: I have "never" made a bad decision. | It is a deal-breaker: an architect who is never wrong teaches teams to hide their mistakes. | I prepare a decision that turned out wrong, with the ADR that superseded it ([Deal-breakers](#deal-breakers)). |
| **Getting lost in detail**: I answer "monolith or microservices?" with the Kubernetes configuration. | The interviewer does not see the overall reasoning. | I start with the conclusion, then zoom in only if asked ([Answering out loud](#answering-out-loud)). |
