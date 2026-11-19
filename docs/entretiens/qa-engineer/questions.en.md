# QA Engineer interview: the questions

!!! warning "Disclaimer"
    These notes are personal cheat sheets, not a source of truth. They reflect my own understanding and choices: their content remains subjective, despite the quotes and references it contains. It may be incomplete, simplified, inaccurate or outdated. Always check the official documentation before applying it. This content is provided as is, without any warranty: you use it at your own risk.

!!! audience "Who and what for"
    - **Roles**: QA engineer, tester, software development engineer in test (SDET), QA lead, developer aiming for a quality-oriented job.
    - **Uses**: I have a QA interview in a week and I want to review the questions theme by theme; I am asked "how would you test this field?" and I want a method, not a random list; I want to know which page to read to go deeper on an answer; I prepare one lived story per theme before a technical interview.

This page gathers the questions asked in interviews for a QA Engineer job, sorted by theme. Each question is quoted as the interviewer asks it, followed by a short first-person answer outline, then the sections to read: the full answer, with its examples, lives in the Knowledge pages.

How I use it:

1. I read the answer outline, without trying to learn it word for word.
2. I open the "Read next" sections to understand the why and the limits of each notion.
3. I prepare at least one lived story per theme: the context, what I did myself, the result with a number. If I have not lived the case, I present it as hypothetical and walk through my reasoning.
4. I practise out loud on the [live exercises](exercices.md): many QA interviews ask to test a form, fix a test or write a bug report live.

In a QA interview, many questions really mean "tell me about the most interesting bug you found" or "show me how you would test this field": the interviewer expects a visible method, precise test cases and a true story.

## Test strategy and risk-based approach

### "How do you build the test strategy for a new feature?"

- I start from a list of risks, not a list of cases: with the PO and a developer, I look for what would cost a lot if it broke (money, wrong data, blocked user, security hole).
- I score each risk by likelihood and impact: this is the <span class="term" data-term="risk-based-testing">risk-based testing</span> of the ISTQB Foundation syllabus v4.0 (2023). A lot of effort on high risks, light testing on low ones, and I write down what I do not test.
- For each risk, I pick the lowest level that covers it, I keep time for exploratory testing, and I check with the agile testing quadrants (Brian Marick, 2003) that I do not forget a family of tests.
- I finish with written, shared <span class="term" data-term="exit-criteria">exit criteria</span>, so the decision to ship does not rest on a feeling.
- Example I can walk through: promo codes, where I first test a code applied twice and two simultaneous orders with the same code, not the colour of the button.

**Read next**: [Risk-based testing](../../knowledge/conception-tests.md#risk-based-testing), [Exit criteria and the go/no-go decision](../../knowledge/conception-tests.md#exit-criteria-and-the-gono-go-decision), [Drawing the journey as a graph](../../knowledge/conception-tests.md#drawing-the-journey-as-a-graph), [The agile testing quadrants](../../knowledge/qualite.md#agile-testing-quadrants-not-forgetting-a-kind-of-test), [The seven testing principles (ISTQB)](../../knowledge/qualite.md#the-seven-testing-principles-istqb)

### "Time is short before a release: what do you test first?"

- I go back to the list of risks and test the critical paths first: those that bring in money or block the user if they break.
- I add the areas that already had incidents: defects cluster together (ISTQB defect clustering principle).
- I run a <span class="term" data-term="smoke-test">smoke test</span> of the vital journeys, then I say clearly what was not tested and the residual risk.

**Read next**: [Risk-based testing](../../knowledge/conception-tests.md#risk-based-testing), [The seven testing principles (ISTQB)](../../knowledge/qualite.md#the-seven-testing-principles-istqb), [Designing scenarios](../../knowledge/conception-tests.md#designing-scenarios)

### "At which level do you put a test: unit, API or E2E? Pyramid or trophy?"

- For each check, I ask which defect it must catch, then I put it at the lowest level that sees that defect.
- A calculation rule goes in a <span class="term" data-term="unit-test">unit test</span>; a contract, an SQL query or an authorization at API or integration level; <span class="term" data-term="e2e-test">E2E</span> stays for what only exists fully assembled, like a checkout journey.
- The <span class="term" data-term="test-pyramid">pyramid</span> (Mike Cohn, 2009) or the <span class="term" data-term="testing-trophy">trophy</span> (Kent C. Dodds, 2018) are not quotas: the shape depends on the context, and my rule is to use a real dependency as soon as it can prove the behaviour.
- Example: 40 E2E tests on shipping fees become 40 parametrized unit tests, one API test and a single E2E; I remove the E2E tests only after seeing the new tests fail on a broken calculation.

**Read next**: [Pyramid, trophy, honeycomb](../../knowledge/qualite.md#pyramid-trophy-honeycomb-the-shape-of-a-suite), [Choosing the right test level](../../knowledge/qualite.md#choosing-the-right-test-level), [The rule](../../knowledge/qualite.md#the-rule), [The question to ask](../../knowledge/qualite.md#the-question-to-ask)

### "Shift-left and shift-right: what do they change for a QA? Do we test in production?"

- <span class="term" data-term="shift-left">Shift-left</span> changes when I step in: I ask my test questions during refinement, when an ambiguity costs five minutes and not a week of fixing, and I review the developers' unit tests.
- <span class="term" data-term="shift-right">Shift-right</span> starts from the fact that no test environment looks like production: I look at the errors reported by monitoring and I propose <span class="term" data-term="synthetic-monitoring">synthetic tests</span> on the critical journeys.
- Yes, we test in production, with rules: dedicated test accounts, canary analysis, risky changes behind a <span class="term" data-term="feature-flag">feature flag</span> opened first to 5% of customers.
- In between, testing during the sprint is still needed: both approaches surround it, they do not replace it.

**Read next**: [Shift-left and shift-right](../../knowledge/qualite.md#shift-left-and-shift-right-when-to-test), [Testing in production](../../knowledge/livraison.md#testing-in-production), [Synthetic tests](../../knowledge/qualite.md#synthetic-tests), [Feature flags: Unleash](../../knowledge/outils.md#feature-flags-unleash)

## Test design techniques

### "How do you choose the values to test for an input field?"

- I split the inputs into <span class="term" data-term="equivalence-partitioning">equivalence partitions</span>, valid and invalid, and I take one value per partition.
- I add the <span class="term" data-term="boundary-value">boundary values</span> with the three-value method (ISTQB Foundation v4.0, 2023): for "18 to 65 years inclusive", I test 17, 18, 19 and 64, 65, 66.
- I add the cases the rules never state: empty, spaces, zero, decimal, very long text, accents; for a date, the clock change, 29 February and the time zone.
- I check the rule on the server side, by sending the value straight to the API, and I check the error message, not just the rejection.
- To go further, property-based testing (QuickCheck, 2000; Hypothesis in Python) generates hundreds of values per partition.

**Read next**: [Equivalence partitioning and boundary values](../../knowledge/conception-tests.md#equivalence-partitioning-and-boundary-values), [Property-based testing](../../knowledge/conception-tests.md#property-based-testing)

### "How do you test a business rule with many conditions, or an object that changes state?"

- When several conditions combine, I build a <span class="term" data-term="decision-table">decision table</span>: one column per combination, the expected action at the bottom. It shows the forgotten combinations, which I get the PO to settle.
- When an object has a life cycle (order, subscription), I draw its <span class="term" data-term="state-machine">states</span> and test each allowed <span class="term" data-term="state-transition">transition</span>, then the forbidden ones.
- Example: refunding an order twice must return an error and leave the state untouched in the database, not just return an error code.

**Read next**: [Decision table](../../knowledge/conception-tests.md#decision-table), [State transitions](../../knowledge/conception-tests.md#state-transitions), [Which technique for which rule](../../knowledge/conception-tests.md#which-technique-for-which-rule)

### "How do you test many combinations without testing them all?"

- I count first: 4 browsers, 3 languages, 3 payment methods and 2 account types already make 72 combinations.
- I use <span class="term" data-term="pairwise-testing">pairwise testing</span>: a tool like PICT generates a dozen cases where each pair of values appears at least once.
- I rely on Kuhn, Wallace and Gallo (IEEE TSE, 2004): on the systems studied, most defects came from one or two parameters. [Take with caution: measured on few systems, nothing guaranteed for a given product.]
- I add by hand the combinations I know are risky, and I keep exhaustive testing for the parameters where an error would be very costly.

**Read next**: [Pairwise testing](../../knowledge/conception-tests.md#pairwise-testing), [Which technique for which rule](../../knowledge/conception-tests.md#which-technique-for-which-rule)

### "Do you practise TDD? How do you change legacy code that has no tests?"

- I practise TDD when the rule is clear: a red test, the minimal code to turn it green, then the cleanup (Kent Beck, "Test-Driven Development: By Example", 2002). When the rule is vague, I first do a throwaway spike.
- On legacy code, I look for a test point, I create a minimal seam (passing the clock as a parameter for example), I freeze the current behaviour with characterization tests (Michael Feathers, 2004), then I change it.

**Read next**: [TDD in practice](../../knowledge/conception-tests.md#tdd-in-practice), [Characterization tests and golden master](../../knowledge/conception-tests.md#characterization-tests-and-golden-master)

## Exploratory testing, bugs and triage

### "What is exploratory testing, and how do you make it rigorous?"

- It is learning the product, designing tests and running them at the same time, letting each observation guide the next test. It is not clicking at random.
- I give each session a one-sentence <span class="term" data-term="test-charter">charter</span> and a fixed duration: this is Jonathan Bach's Session-Based Test Management (2000), with Elisabeth Hendrickson's "Explore ... with ... to discover ..." template ("Explore It!", 2013).
- I note what I covered, the bugs, the questions; a ten-minute debrief decides what comes next, and the useful findings become automated tests.
- Automated tests check what we already know, exploration finds what we did not know (testing vs checking, James Bach and Michael Bolton, 2013).

**Read next**: [Session and charter (SBTM)](../../knowledge/conception-tests.md#session-and-charter-sbtm), [SFDIPOT: finding test ideas](../../knowledge/conception-tests.md#sfdipot-finding-test-ideas), [Testing vs checking](../../knowledge/conception-tests.md#testing-vs-checking)

### "How do you write a good bug report?"

- A good report is read in thirty seconds and reproduced in five minutes: a title that says what, where and under which condition.
- I first look for the <span class="term" data-term="minimal-reproduction">minimal reproduction</span>, and I isolate the client or server side by looking at the API response.
- I write numbered <span class="term" data-term="reproduction-steps">reproduction steps</span> with the exact data, expected and actual without guessing the cause, the environment, and evidence (trace, screenshot, <span class="term" data-term="correlation-id">correlation ID</span>) cleaned of its secrets.
- I propose a severity and describe the user impact; the fields follow ISO/IEC/IEEE 29119-3 (2013, which replaces IEEE 829).

**Read next**: [The bug report](../../knowledge/conception-tests.md#the-bug-report), [Recorded scenario (Playwright Codegen)](../../knowledge/conception-tests.md#recorded-scenario-playwright-codegen), [Linking the signals together](../../knowledge/observabilite.md#linking-the-signals-together)

### "How do you debug a bug you cannot reproduce?"

- I gather the facts (logs, trace, time, version, account) and look for what separates the failing cases from the passing ones.
- I test one hypothesis at a time, I shrink the input, and I write a test that reproduces the bug before any fix.
- If the bug appeared between two versions, `git bisect` finds the commit in a few tries.

**Read next**: [Debugging methodically](../../knowledge/incidents.md#finding-the-cause-debugging-methodically), [Reading a failure: from red to the cause](../../knowledge/qualite.md#reading-a-failure-from-red-to-cause)

### "What is the difference between severity and priority, and how does a triage work?"

- <span class="term" data-term="bug-severity">Severity</span> is a finding about impact that I propose; <span class="term" data-term="bug-priority">priority</span> is an urgency decision the PO makes, based on the users affected, a <span class="term" data-term="workaround">workaround</span>, a date or a legal duty.
- The two diverge: a typo in the brand name on the home page is low severity but high priority; a crash in an archiving screen used once a year is severe but can wait.
- <span class="term" data-term="bug-triage">Triage</span> is short and regular: each bug leaves it fixed now, planned or closed, with the reason written in the ticket.

**Read next**: [Severity and priority](../../knowledge/conception-tests.md#severity-and-priority), [Triage and zero-bug policy](../../knowledge/conception-tests.md#triage-and-zero-bug-policy)

## Test automation and architecture

### "How do you choose what to automate?"

- I automate what will run often, what protects a high risk and what is stable: smoke test on each deployment, business rule <span class="term" data-term="regression">regressions</span>, tedious calculations.
- I keep manual what needs judgement (usability, readability), what changes every week, and what will only happen once.
- I sort with a simple grid (frequency, risk, stability, cost) and I always pick the lowest level: automating does not mean E2E. Brian Marick sums it up in "When Should a Test Be Automated?" (1998).
- An automated test is code to maintain: if it costs more than it brings, it is debt.

**Read next**: [Choosing the right test level](../../knowledge/qualite.md#choosing-the-right-test-level), [Testing vs checking](../../knowledge/conception-tests.md#testing-vs-checking), [The families of test suites](../../knowledge/qualite.md#test-suite-families), [Choosing what to automate](../../knowledge/qualite.md#choosing-what-to-automate)

### "How do you structure a Playwright E2E suite so it stays maintainable?"

- I separate the intent of the test from the mechanics: scenarios read like a business sentence, <span class="term" data-term="selector">selectors</span> live in <span class="term" data-term="page-object">Page Objects</span> (Martin Fowler, 2013).
- I target elements by role and label (`getByRole`), more stable than CSS, with <span class="term" data-term="auto-wait">auto-waiting</span> instead of fixed pauses.
- I prepare the state with <span class="term" data-term="test-fixture">fixtures</span>: a user created through the API, a session logged in once and reused with <span class="term" data-term="storage-state">storageState</span>.
- Each test creates its data and depends on no other, so the suite runs in parallel; I measure the duration before and after.

**Read next**: [Test vocabulary](../../knowledge/qualite.md#testing-vocabulary), [Playwright, Cypress, Selenium](../../knowledge/outils.md#playwright-cypress-selenium), [Parallelizing without breaking](../../knowledge/qualite.md#parallelising-without-breaking-things), [Authentication vocabulary in tests](../../knowledge/qualite.md#authentication-vocabulary-in-tests), [Structuring a maintainable E2E suite](../../knowledge/qualite.md#structuring-a-maintainable-e2e-suite)

### "Do you apply SOLID and DRY to a test framework? DRY or DAMP in tests?"

- On the mechanics, I am strict about <span class="term" data-term="dry">DRY</span>: a selector lives in a single Page Object, login and data creation in fixtures.
- Single responsibility: a Page Object handles its page, it does not decide whether the test passed. Fixtures apply dependency inversion: the test asks for a filled cart, it does not know how it is built.
- On the scenario, I prefer <span class="term" data-term="damp">DAMP</span>: data and expected result stay visible in the test, even if it repeats (Jay Fields, 2014; "Software Engineering at Google", 2020).
- I avoid an 800-line `BasePage` everything inherits from: I compose page components.

**Read next**: [DAMP over DRY in tests](../../knowledge/conception-tests.md#damp-over-dry-in-tests), [SOLID](../../knowledge/principes-conception.md#solid), [DRY, WET and AHA](../../knowledge/principes-conception.md#dry-wet-and-aha), [Structuring a maintainable E2E suite](../../knowledge/qualite.md#structuring-a-maintainable-e2e-suite)

### "Mock, stub or fake: what is the difference, and when do you mock? London or Detroit school?"

- A stub returns a prepared answer, a mock checks that a call happened, a fake is a simplified implementation that works (an in-memory database).
- By default I keep the neighbours real and check the result (Detroit school); I only replace what is slow or out of my control: network, clock, third-party service.
- I mock when the exchange is the behaviour ("an email is sent"), and I know a hand-written mock lies the day the partner changes: contract testing fills that gap.

**Read next**: [Test double](../../knowledge/qualite.md#test-double-mock-stub-fake), [London and Detroit schools](../../knowledge/qualite.md#london-and-detroit-schools-isolating-the-unit-or-not), [The problem with hand-written mocks](../../knowledge/qualite.md#the-problem-with-hand-written-mocks)

### "How do you manage test data? Which pattern gives readable data?"

- Each test creates its own <span class="term" data-term="test-data">test data</span>, just what it needs, through the API or in the database, never by clicking in the UI, and cleans it up.
- I make it unique with a suffix so tests run in parallel; the shared reference set stays read-only.
- I use a Test Data Builder (Nat Pryce, 2007), like `an_order().paid().build()`: valid default values, the test only states what matters to it.
- Data coming from production always goes through <span class="term" data-term="data-anonymization">anonymization</span>.

**Read next**: [Test data: Builder, Object Mother, isolation](../../knowledge/conception-tests.md#test-data-builder-object-mother-isolation), [Builder](../../knowledge/design-patterns.md#builder)

### "How do you handle a flaky test? How do you speed up an E2E suite that is too slow?"

- A <span class="term" data-term="flaky-test">flaky test</span> is more dangerous than a missing one: the team learns to ignore red.
- I measure its failure rate, I put it in <span class="term" data-term="test-quarantine">quarantine</span> with a ticket and an owner (Martin Fowler, "Eradicating Non-Determinism in Tests", 2011), then I look for the cause in the trace: fixed wait, shared data, test order, slow third-party service, or a real concurrency bug.
- A `sleep` or automatic retries hide the problem, and sometimes a real bug.
- For a slow suite, I split it into <span class="term" data-term="test-shard">shards</span> by account and by tag, I prepare the state through the API, and I push down the checks that have nothing to do in E2E.

**Read next**: [Strategy for a flaky test](../../knowledge/qualite.md#strategy-for-a-flaky-test), [Causes of flakiness that are not test bugs](../../knowledge/qualite.md#causes-of-flakiness-that-are-not-test-bugs), [Diagnostic tools](../../knowledge/qualite.md#diagnostic-tools-what-they-really-show), [Parallelizing without breaking](../../knowledge/qualite.md#parallelising-without-breaking-things), [Quarantining without blocking](../../knowledge/qualite.md#quarantining-without-blocking)

## API, contract and performance tests

### "How do you test a REST API?"

- For each endpoint: the happy path (status, content, schema), then parametrized client errors, each with a precise `4xx` and never a `500`.
- I spend a lot of time on authorization: no token, expired token, and above all another user's resource, the <span class="term" data-term="bola">BOLA</span> flaw, first in the OWASP API Security Top 10 (2023 edition).
- I check side effects by reading the resource or the database again, and I validate responses against the <span class="term" data-term="openapi">OpenAPI</span> file if there is one.
- For a replayed `POST` (double click, network retry), I check that an <span class="term" data-term="idempotency-key">idempotency key</span> prevents the duplicate.

**Read next**: [Testing a REST API](../../knowledge/api-rest-async.md#testing-a-rest-api), [Response codes](../../knowledge/api-rest-async.md#response-codes), [HTTP methods](../../knowledge/api-rest-async.md#http-methods), [The most common API flaws](../../knowledge/securite.md#the-most-common-api-vulnerabilities), [Simulating a third party that fails or is slow](../../knowledge/qualite.md#simulating-a-third-party-that-fails-or-is-slow)

### "How do you test asynchronous processing without a fixed `sleep`?"

- I wait for a condition with a maximum delay (the message is processed, the row exists) instead of a fixed pause that is either too short in CI or too long everywhere.
- I also test the message received twice (the consumer must be idempotent) and the failed message that goes to the dead letter queue.

**Read next**: [Testing asynchronous code](../../knowledge/api-rest-async.md#testing-asynchronous-flows), [Idempotency](../../knowledge/architecture.md#idempotency)

### "What is a contract test, and when do you use it instead of an E2E test?"

- A <span class="term" data-term="contract-test">contract test</span> answers one question: do the consumer and the provider still understand each other?
- With a <span class="term" data-term="consumer-driven-contract">consumer-driven contract</span> (Ian Robinson, 2006), the consumer describes what it sends and the fields it needs; the contract is replayed in the provider's CI, whose MR fails if it renames a field in use.
- It is faster and more precise than an E2E test that needs every service deployed. I use it as soon as two teams evolve two services at different paces; it does not check the provider's logic.

**Read next**: [Contract tests and API mocks](../../knowledge/qualite.md#contract-tests-and-api-mocks), [The contract test](../../knowledge/qualite.md#the-contract-test), [Detecting that the partner changed](../../knowledge/qualite.md#detecting-that-the-partner-has-changed)

### "How do you design a performance test?"

- I start from a question with a number: "do we handle 500 orders per minute at peak, with 95% of responses under 500 ms?" (example figures). Without a target, a performance test produces charts, not a decision.
- I pick the type (<span class="term" data-term="load-test">load</span>, <span class="term" data-term="stress-test">stress</span>, <span class="term" data-term="soak-test">soak</span>, spike), then a realistic scenario: real mix of journeys, think times, varied data so not everything comes from a cache.
- I set thresholds on the <span class="term" data-term="p95">p95</span> and the error rate, because the average hides the slow users.
- During the test I watch the server (CPU, database, queues) and I check that the <span class="term" data-term="load-generator">load generator</span> does not saturate, otherwise I measure the wrong thing.

**Read next**: [Performance testing](../../knowledge/qualite.md#performance-test), [k6, JMeter, Locust](../../knowledge/outils.md#k6-jmeter-locust), [p95 latency](../../knowledge/observabilite.md#p95-latency)

### "How do you check the effect of a test in the database? Two customers book the last seat at the same time: what happens?"

- I read the database with a read-only account, or I wrap my test in `BEGIN ... ROLLBACK` on a test database.
- I look for inconsistencies with standard queries: duplicates with `GROUP BY ... HAVING COUNT(*) > 1`, orphans with `LEFT JOIN ... IS NULL`.
- For concurrency, I send two requests in parallel and check that only one succeeds: the read, decide, write pattern lets a <span class="term" data-term="race-condition">race</span> through, an atomic `UPDATE ... WHERE seats_left > 0` or a unique constraint prevents it.

**Read next**: [SQL for QA](../../knowledge/sql.md#sql-for-qa), [Concurrent writes](../../knowledge/sql.md#concurrent-writes), [Finding what is missing](../../knowledge/sql.md#finding-what-is-missing-left-join-is-null), [Constraints: the database keeps the rules](../../knowledge/sql.md#constraints-the-database-keeps-the-rules)

### "How do you test a data pipeline?"

- I put content tests at each step (uniqueness, not null, accepted values, freshness), with an `error` severity that blocks or a `warn` that alerts, in dbt or with Great Expectations.
- The goal: the dashboard keeps the last correct figure rather than showing a wrong one.

**Read next**: [Testing data quality](../../knowledge/donnees-decision.md#testing-data-quality)

## CI, environments and observability

### "How do you plug your tests into CI, and what should a quality gate block?"

- I put each suite where its value to duration ratio is best: unit and API tests on every MR in a few minutes, critical E2E tests on a deployed environment, full suite and performance at night or before a release (the deployment pipeline of Jez Humble and David Farley, "Continuous Delivery", 2010).
- A <span class="term" data-term="quality-gate">quality gate</span> only blocks on reliable checks: a flaky test in a gate teaches the team to bypass the gate. Two gates are enough, and I never weaken one to get an MR through.
- I publish a readable report and the traces of failures as <span class="term" data-term="ci-artifact">artifacts</span>, so a developer understands the failure without rerunning the test.

**Read next**: [Quality gates](../../knowledge/qualite.md#quality-gates), [Two gates are enough](../../knowledge/qualite.md#two-gates-are-enough), [Never weaken a gate](../../knowledge/qualite.md#never-weaken-a-gate), [Test results and visibility](../../knowledge/qualite.md#test-results-and-visibility), [Automated functional tests](../../knowledge/livraison.md#automated-functional-tests), [Time-limited waivers and risk acceptance](../../knowledge/qualite.md#time-limited-waivers-and-risk-acceptance)

### "How do you manage test environments?"

- I want a failure to mean "the code has a problem", not "someone broke the environment": I reduce the dependency on <span class="term" data-term="shared-environment">shared environments</span>.
- Integration tests use a <span class="term" data-term="throwaway-database">throwaway database</span> (Testcontainers), and each MR has its own <span class="term" data-term="ephemeral-environment">ephemeral environment</span> when possible.
- Third-party services (payment, SMS) are replaced by <span class="term" data-term="service-virtualization">service virtualization</span> that can answer with errors or delays (WireMock, Prism or Microcks).
- I keep a pre-production close to production for end-to-end and performance tests, with an owner and usage rules.

**Read next**: [Integration tests with Testcontainers](../../knowledge/qualite.md#integration-tests-with-testcontainers), [Preview environment per merge request](../../knowledge/devx.md#preview-environment-per-merge-request), [Contract-driven mock](../../knowledge/qualite.md#contract-driven-mock), [Environments](../../knowledge/kubernetes.md#environments), [Which environment for which test](../../knowledge/devx.md#which-environment-for-which-test), [Simulating a third party that fails or is slow](../../knowledge/qualite.md#simulating-a-third-party-that-fails-or-is-slow)

### "What can a QA bring to observability, and what is synthetic monitoring?"

- <span class="term" data-term="observability">Observability</span> first helps me diagnose: the metric shows there is a problem, the trace where it is, the log why.
- I also test observability itself: when I trigger a payment error, does it show in the logs with enough context, and does an alert fire?
- Synthetic monitoring is one of my E2E tests running in production every five or ten minutes on a critical journey, with a test account: the black-box monitoring of the "Site Reliability Engineering" book (Google, 2016).
- <span class="term" data-term="rum">RUM</span> data tells me which browsers and journeys real users take, so where to focus my tests.

**Read next**: [The three signals](../../knowledge/observabilite.md#the-three-signals), [From alert to cause](../../knowledge/observabilite.md#from-the-alert-to-the-cause), [Synthetic tests](../../knowledge/qualite.md#synthetic-tests), [Synthetic tests: Checkly](../../knowledge/outils.md#synthetic-tests-checkly)

### "How do you test a canary deployment, a blue-green one, or a feature in an A/B test?"

- Canary: I compare the new version's metrics with the old one in steps (error rate, latency), with stop criteria written beforehand.
- Blue-green: I test the green environment before the switch, then I check that going back to blue works.
- A/B test: I force each variant in E2E, I check that assignment stays stable for a given customer, that the measurement event fires in both variants, and I leave the conclusion to statistics.

**Read next**: [Testing a canary deployment](../../knowledge/qualite.md#testing-a-canary-deployment), [Testing a blue-green deployment](../../knowledge/qualite.md#testing-a-blue-green-deployment), [Testing a feature in an A/B test](../../knowledge/qualite.md#testing-a-feature-in-an-ab-test), [Progressive deployment](../../knowledge/livraison.md#progressive-deployment)

## Accessibility, security and non-functional qualities

### "How do you include accessibility in your tests?"

- I treat accessibility as a functional requirement: a user who cannot pay with the keyboard cannot pay.
- I automate what a tool detects, with axe-core in the Playwright tests: contrast, images without alt text, fields without labels.
- These tools only find part of the problems, so I test the critical journeys by hand: everything with the keyboard, visible focus, and a pass with a <span class="term" data-term="screen-reader">screen reader</span>.
- I aim for level AA of <span class="term" data-term="wcag">WCAG</span> 2.2 (W3C, October 2023), with the European Accessibility Act in the background.

**Read next**: [Accessibility testing](../../knowledge/conception-tests.md#accessibility-testing), [WCAG 2.2 and legal duties](../../knowledge/conception-tests.md#wcag-22-and-legal-obligations), [Automated and manual](../../knowledge/conception-tests.md#automated-and-manual-axe-core-keyboard-screen-reader)

### "Which security tests can a QA do without being an expert? How do you test the security of an API?"

- My reflex: "what if the user had no right to do this?". I change the ID in the URL to another customer's, I call an admin route with a plain account, I reuse a token after logout.
- I try simple malicious inputs: an apostrophe for <span class="term" data-term="sql-injection">SQL injection</span>, a `<script>` tag for <span class="term" data-term="xss">XSS</span>, and I check they are displayed as text.
- I check that errors reveal nothing internal and that session cookies have the right attributes; I add a <span class="term" data-term="dast">DAST</span> scan on the test environment.
- I replay in Burp or ZAP a user's request with another user's ID, and each finding becomes a rejection test. I rely on the OWASP Web Security Testing Guide (version 4.2, 2020) and escalate to experts what goes beyond me.

**Read next**: [The most common API flaws](../../knowledge/securite.md#the-most-common-api-vulnerabilities), [XSS, CSRF, CORS](../../knowledge/securite.md#xss-csrf-cors-browser-side-vulnerabilities), [Security testing tools](../../knowledge/securite.md#security-testing-tools), [The toolbox](../../knowledge/cybersecurite.md#the-toolbox), [Security: SQL injection](../../knowledge/sql.md#security-sql-injection), [Account enumeration](../../knowledge/securite.md#account-enumeration)

## Collaboration, BDD and the release decision

### "How do you work with the PO and developers before the code?"

- Before a story is coded, I propose a twenty to thirty-minute <span class="term" data-term="three-amigos">three amigos</span> session with the PO and a developer.
- I bring concrete examples rather than abstract questions, with an <span class="term" data-term="example-mapping">Example Mapping</span> (Matt Wynne, 2015): one card per rule, examples under each rule, one card per open question.
- We leave with testable <span class="term" data-term="acceptance-criteria">acceptance criteria</span>; too many red questions means the story is too big.

**Read next**: [Estimating and slicing a feature](../../knowledge/culture-entreprise.md#estimating-and-slicing-a-feature), [Shift-left and shift-right](../../knowledge/qualite.md#shift-left-and-shift-right-when-to-test), [Gherkin with a "Goal"](../../knowledge/conception-tests.md#gherkin-with-a-goal)

### "BDD and Gherkin: when is it useful, and when is it a trap?"

- <span class="term" data-term="bdd">BDD</span> is first a way of talking: we agree on examples before coding. <span class="term" data-term="gherkin">Gherkin</span> is only a format to write them (Dan North, "Introducing BDD", 2006).
- It is useful if the PO really reads and validates the scenarios; it is a trap if nobody reads them, because we pay the <span class="term" data-term="step-definition">step definitions</span> layer for nothing.
- I write declarative scenarios ("the customer applies an expired code"), not imperative ones ("I click the blue button"), with a single behaviour each.

**Read next**: [Gherkin with a "Goal"](../../knowledge/conception-tests.md#gherkin-with-a-goal), [Gherkin tools per language](../../knowledge/conception-tests.md#gherkin-tools-per-language)

### "How do you take part in a go/no-go decision?"

- I do not say "it is tested": I present a factual state against exit criteria written beforehand. What ran, the open defects with their severity, the uncovered risks and why.
- I give my opinion (go, no-go, go with conditions) and the reason; the decision belongs to the PO, who carries the business risk.
- Before a go, I check two things: <span class="term" data-term="rollback">rollback</span> is possible and tested, and monitoring will quickly show a problem. A migration that drops a column breaks rollback: I propose to split it in two steps.

**Read next**: [Exit criteria and the go/no-go decision](../../knowledge/conception-tests.md#exit-criteria-and-the-gono-go-decision), [Migrating a schema without downtime](../../knowledge/sql.md#zero-downtime-schema-migrations), [Progressive deployment](../../knowledge/livraison.md#progressive-deployment)

### "What makes a good code review, or a good test review?"

- I sort my comments by severity (blocking, suggestion) and I prove each one with `file:line` and a scenario that breaks.
- On a test MR, I first look for hard-coded secrets and assertions that check nothing, then I break the code on purpose to see whether the tests fail.
- The tone stays that of a colleague: the risk, then a concrete fix.

**Read next**: [Code review](../../knowledge/qualite.md#code-review), [Prove each comment](../../knowledge/qualite.md#proving-every-comment), [Iterate until zero blockers](../../knowledge/qualite.md#iterating-down-to-zero-blockers), [Preparing my MR and receiving a review](../../knowledge/qualite.md#preparing-my-mr-and-receiving-a-review)

### "Which indicators do you follow to know whether quality improves? Is code coverage a good indicator?"

- I start from a question with GQM, then I follow few indicators: <span class="term" data-term="escaped-defect">escaped defects</span> and the Defect Detection Percentage, the flaky test rate, CI duration, <span class="term" data-term="mttr">MTTR</span> (as a median, because a single long incident crushes the average).
- I look at trends and never turn them into individual targets: counting bugs found by QA pushes people to open ten tickets for one problem, that is <span class="term" data-term="goodhart-law">Goodhart's law</span>.
- Coverage says which code runs, not which code is checked: 100% coverage can let a mutant survive. I put a gate on new code only, and targeted <span class="term" data-term="mutation-testing">mutation testing</span> on critical code.

**Read next**: [Choosing indicators with GQM](../../knowledge/qualite.md#choosing-indicators-with-gqm), [Defect Detection Percentage](../../knowledge/qualite.md#defect-detection-percentage), [What it says and what it does not](../../knowledge/qualite.md#what-it-says-and-what-it-does-not), [Mutation testing](../../knowledge/qualite.md#mutation-testing-testing-the-tests), [Goodhart's law](../../knowledge/lois-et-principes.md#goodharts-law), [Measures and their limits](../../knowledge/incidents.md#metrics-and-their-limits)

## The QA role in an agile team and with AI

### "What is the role of a QA in an agile team where developers also test?"

- Quality belongs to the whole team (Whole Team Approach, Lisa Crispin and Janet Gregory, "Agile Testing", 2009): if only the QA cares, they become a bottleneck and developers ship "for QA".
- I bring expertise: finding risks, designing good cases, exploring, building the tooling with the team.
- I do <span class="term" data-term="quality-coaching">quality coaching</span>: I review developers' tests, I suggest missing cases, I get test requirements into the <span class="term" data-term="definition-of-done">definition of done</span>.
- I keep the view nobody else has time for: the whole product, from the user's side.

**Read next**: [The agile testing quadrants](../../knowledge/qualite.md#agile-testing-quadrants-not-forgetting-a-kind-of-test), [Shift-left and shift-right](../../knowledge/qualite.md#shift-left-and-shift-right-when-to-test), [Testing and quality (seminal texts)](../../knowledge/textes-fondateurs.md#testing-and-quality), [The QA role in an agile team](../../knowledge/qualite.md#the-qa-role-in-an-agile-team)

### "Scrum or Kanban: where does testing fit in your team? What do you do if everything reaches testing on the last day of the sprint?"

- I first say which framework I worked in and why it suited the team's work: Scrum for a product that moves by goals, Kanban for a flow of unplanned requests.
- In Scrum, testing happens during the sprint: <span class="term" data-term="three-amigos">three amigos</span> at refinement, tests written with the code, exploration as soon as the story works, test requirements in the definition of done.
- In Kanban, the test column has its WIP limit: when it is full, developers help empty it instead of starting a new ticket.
- If everything arrives on Friday, I show the fact at the retrospective (waiting time in test, bugs found on the last day) and propose a single experiment: a WIP limit on test, or stories split thinner.

**Read next**: [Scrum, Kanban or Scrumban](../../knowledge/agilite.md#scrum-kanban-or-scrumban), [Quality in an agile team](../../knowledge/agilite.md#quality-in-an-agile-team), [Designing the board](../../knowledge/agilite.md#designing-the-board), [A retrospective that changes something](../../knowledge/agilite.md#a-retrospective-that-changes-something)

### "How do you use an AI assistant in your QA work, and with which precautions?"

- I use it as a fast but unreliable colleague: test case ideas that I sort, a first draft of a Playwright or pytest test, varied data, a summary of a long log.
- I keep the <span class="term" data-term="test-oracle">oracle</span>: the AI does not know the business rule, it can write a test that passes because it checks nothing, or invent a method, a <span class="term" data-term="hallucination">hallucination</span>.
- I give the agent the test command so it loops until green, then I review it like an MR and check that the test fails when I break the code (the idea of mutation testing, DeMillo, Lipton and Sayward, 1978).
- I send no secret, no personal data and no confidential code to a tool that is not approved.

**Read next**: [Hallucination](../../knowledge/ia-agents.md#hallucination), [Closing the loop: giving a way to verify](../../knowledge/ia-agents.md#closing-the-loop-giving-a-way-to-verify), [AI coding assistants](../../knowledge/devx.md#ai-coding-assistants), [Mutation testing](../../knowledge/qualite.md#mutation-testing-testing-the-tests)

### "How do you test an LLM-based system when its answers vary? What does the EU AI Act change for a QA team?"

- I do not compare exact text: I check properties (format, fields present, expected refusal), I measure a pass rate over several runs, and I keep an evaluation set replayed on each prompt or model change.
- Temperature 0 does not make the model deterministic: I put determinism in the code around the model.
- For the AI Act, I place the use in the four risk levels and I separate provider and deployer: a coding assistant is usually not a high-risk system.

**Read next**: [Testing an agent-based system](../../knowledge/ia-capacites.md#testing-an-agent-based-system), [What it changes for a dev and QA team](../../knowledge/ia-entreprise.md#what-it-changes-for-a-dev-and-qa-team)

### "How do you keep up to date on test tools? Which book made an impression on you?"

- I read my tools' release notes, a testing newsletter and a community like Ministry of Testing, in a fixed short slot; I try one thing a month on a real case.
- For the book, I pick a text I really read and quote one precise idea, for example the quadrants of "Agile Testing" (2009).

**Read next**: [Tech watch: QA](../../knowledge/veille.md#qa), [Why, when and how](../../knowledge/veille.md#why-when-and-how), [Testing and quality (seminal texts)](../../knowledge/textes-fondateurs.md#testing-and-quality)

## Choosing tools

### "Playwright, Cypress or Selenium: how do you choose an E2E tool? How do you test a feature behind a feature flag?"

- I start from the needs: browsers to cover (Safari in particular), the team's language, several tabs, iframes, network interception, native app.
- I look at what makes a suite stable: auto-waiting, built-in parallelism, traces. <span class="term" data-term="playwright">Playwright</span> ticks many boxes for a new web project; Selenium stays relevant for the <span class="term" data-term="webdriver">WebDriver</span> standard or an existing grid.
- I run a one-week trial on two real journeys and compare numbers: duration, flaky rate, time to write a test.
- Behind a flag, I test both positions as long as the flag exists.

**Read next**: [Playwright, Cypress, Selenium](../../knowledge/outils.md#playwright-cypress-selenium), [Feature flags: Unleash](../../knowledge/outils.md#feature-flags-unleash), [OpenFeature: switching flag tools without touching the code](../../knowledge/outils.md#openfeature-switching-flag-tools-without-touching-the-code)

### "k6, JMeter, Gatling or Locust: how do you choose a performance testing tool?"

- I look at who writes the scripts: k6 in JavaScript, Locust in Python, Gatling in Scala, Java or Kotlin, JMeter mostly through a GUI and XML.
- I prefer a test written as code, reviewed in an MR, running in CI with <span class="term" data-term="load-threshold">thresholds</span> that fail the job.
- I check the protocols needed and the capacity of the load generator.

**Read next**: [k6, JMeter, Locust](../../knowledge/outils.md#k6-jmeter-locust), [Performance testing](../../knowledge/qualite.md#performance-test)

### "Should you test an API with Postman or with code like pytest?"

- Postman or Bruno to explore an API by hand; <span class="term" data-term="pytest">pytest</span> and an HTTP client for a regression suite, versioned with the application, reviewed in the same MR, factored with fixtures.
- The real criterion is maintenance: if developers change the tests when they change the API, those tests live in their language and their repository.

**Read next**: [Postman, Bruno](../../knowledge/outils.md#postman-bruno), [pytest](../../knowledge/outils.md#pytest)

## Deal-breakers: the mistakes to avoid

These questions are mostly there to rule people out. One answer in the wrong direction is enough to fail the interview, even if the rest is good.

| Interviewer's question | What rules me out | What I answer | Read next |
|---|---|---|---|
| "You are asked to sign off a release you had no time to test: what do you do?" | signing "approved" on what I did not test, or blocking on principle | I spend the time on the highest risks and a smoke test, I say what is not tested and the <span class="term" data-term="residual-risk">residual risk</span>, the written decision belongs to the PO, and I propose a flag, progressive delivery and closer monitoring | [Exit criteria and the go/no-go decision](../../knowledge/conception-tests.md#exit-criteria-and-the-gono-go-decision) |
| "A bug you did not find reaches production: how do you react?" | "it is not my fault" or "it is my fault" | I first help fix it (reproduce, scope, test the fix), then I look for why it escaped in a <span class="term" data-term="blameless">blameless</span> postmortem, I add a test at the lowest level and I fix the strategy for the whole family of cases | [The blameless postmortem](../../knowledge/incidents.md#the-blameless-postmortem) |
| "We must automate 100% of the tests: do you agree?" | "yes" with no nuance, or refusing automation | no: we automate <span class="term" data-term="test-check">checks</span>, exploration and judgement stay human; my target is enough confidence at the lowest cost, not a percentage | [Testing vs checking](../../knowledge/conception-tests.md#testing-vs-checking) |
| "You find a security hole on a website by chance: what do you do?" | exploiting it "to see" or publishing it | I stop, I copy nothing, I look for the security contact (`security.txt`), I report it and leave time to fix it | [The framework](../../knowledge/cybersecurite.md#the-framework-permission-scope-and-disclosure) |

## The 3 things a QA Engineer always does

1. **Look for risks before test cases.** I ask what would cost a lot if it broke, then I aim the effort at those risks, at the cheapest level. Example: for promo codes, I first test a code used twice, not the colour of the button.
2. **Make information useful and verifiable.** My bug reports reproduce on the first try, my release opinions separate facts from opinions, my tests fail for a clear reason. Example: the report already says the API returns the wrong amount, with the request ID.
3. **Raise the quality of the whole team.** I bring examples to refinement, I review developers' tests, I build tooling everyone uses. Example: a three-day manual campaign becomes automated tests at the right level, and I keep my time for exploration.

## A simple structure for answering out loud

For almost every question, I follow this thread, close to the STAR method (situation, task, action, result):

1. **Context**: which product, which users, what is at stake?
2. **Risks**: what would cost a lot if it broke?
3. **Design**: which techniques, which cases, at which level?
4. **Execution**: how do I test, automate or explore?
5. **Communication**: how do I report bugs and remaining risks?
6. **Result**: what was found or avoided, with a number?
7. **Improvement**: what does the team do better now?

The core idea: a QA Engineer does not just run tests. They find where the risks are, design the tests that cover them at the right level, report reliable information, and help the whole team build quality in from the start.

## Measuring success

I know my preparation works when I answer out loud with a lived story, not when I have reread the page. Before starting, I write down a baseline: I draw ten random questions, answer each in two minutes while recording myself, and count the answers that follow the context, action, result thread with a number. I take the same measure a week later, on ten other questions. The guard metric is naturalness: if I repeat the page word for word, the answer sounds learned by heart, and I rephrase it with my own examples.

| Solution | Success indicator (<span class="term" data-term="sli">SLI</span>) | Likely <span class="term" data-term="slo">SLO</span> | Likely <span class="term" data-term="sla">SLA</span> |
|---|---|---|---|
| answering ten random questions out loud | share of answers held in two minutes with context, action and a result with a number | 8 out of 10 [Take with caution: example value, to adjust to the preparation time available] | n/a: no external contract |
| preparing one lived story per theme | number of themes of this page with a story ready | all 11 themes [Take with caution: example value] | n/a: no external contract |
| practising the live exercises | share of exercises finished in the allotted time while naming the technique used | 7 out of 10 [Take with caution: example value] | n/a: no external contract |
| answering the deal-breakers | share of answers with no unverified "approved" and no blaming | 100%, since a single one is enough to rule me out | n/a: no external contract |
| reading the linked Knowledge sections | share of answers where I quote a source with its author and date | one answer out of two [Take with caution: example value] | n/a: no external contract |

## Pitfalls to avoid

| Pitfall | What happens | Solution |
| --- | --- | --- |
| **Reciting**: I learn the answer outlines by heart. | The interviewer asks a follow-up question and I have nothing behind it. | I understand the why in the linked section and answer in my own words ([A simple structure for answering out loud](#a-simple-structure-for-answering-out-loud)). |
| **Answering without a lived story**: I stay in theory. | The answer sounds like every other candidate's. | I prepare one lived story per theme, with a number, or I say clearly that the case is hypothetical. |
| **Testing without questioning**: I list cases before clarifying the rule. | I test the wrong rule, and I do not show my craft. | I ask two or three questions at the start of each exercise ([Live exercises](exercices.md)). |
| **Starting from the tool**: I answer "Playwright" before knowing the need. | I sound like someone who follows fashion. | I start from the risks and constraints, then I name the tool and its cost ([Choosing tools](#choosing-tools)). |
| **Signing off without testing**: I say "approved" so as not to block. | The day a bug ships, my word is worth nothing. | I say what is tested, what is not and the residual risk ([Deal-breakers](#deal-breakers-the-mistakes-to-avoid)). |
| **Aiming for 100% automation**: I promise to automate everything. | I show that I confuse testing and checking. | I defend enough confidence at the lowest cost ([How do you choose what to automate?](#how-do-you-choose-what-to-automate)). |
| **Looking for a culprit**: I tell the story of an escaped bug by blaming a developer. | The interviewer hears someone who will be hard to work with. | I talk about the team's quality system and what we changed afterwards. |
