# Staff Engineer: live exercises

!!! warning "Disclaimer"
    These notes are personal cheat sheets, not a source of truth. They reflect my own understanding and choices: their content remains subjective, despite the quotes and references it contains. It may be incomplete, simplified, inaccurate or outdated. Always check the official documentation before applying it. This content is provided as is, without any warranty: you use it at your own risk.

!!! audience "Who and what for"
    - **Roles**: senior developer aiming for a Staff role, Staff or Principal Engineer, tech lead, software architect, quality or platform engineer.
    - **Uses**: I practice a code review out loud before a technical interview; I get forty minutes to design a test strategy and want a worked answer to compare with; I prepare a case study like "the QA team is a bottleneck"; I review the idempotency of a `POST /orders` with code to show.

These practical exercises come with detailed worked answers. They complement the [Staff Engineer interview: the questions](questions.md) page. There is no single answer: these are **concrete reference answers**, with code, architecture decisions, choice criteria and an oral phrasing.

The role is mostly about helping several teams progress: architecture, quality, tooling, reliability, measurement and cross-team influence. The exercises therefore cover code, but also trade-offs and case studies. Each exercise ends with a **Read next** line pointing to the Knowledge sections that explain the notions it uses.

## How to use this document

In a live interview, the interviewer mostly watches **how** I search, not only what I find. For each exercise:

1. I read the statement without looking at the answer.
2. **I ask two or three questions before answering**: "how many teams?", "what volume?", "what is already in place?". It shows I am not pasting a ready-made solution.
3. **I think out loud**: I explain my reasoning before proposing a solution, then I say what I am checking and why, even while I write code.
4. I give a simple solution, then state its limits and possible next steps.
5. I make the trade-offs explicit: cost, risk, operational complexity and adoption by the teams.
6. **I end with a lived example**: "in a previous role, I had a similar case...". The answers are theoretical, experience is what makes the difference.

The code examples are deliberately small so they can be done in an interview. They illustrate the expected reasoning, not a complete production architecture. They are in PHP; exercises 1 and 4 also have a Python version, so I can answer in either language.

---

## Exercise 1. Code review: reliability, security and maintainability

### Problem

The interviewer shows me this PHP function:

``` { .php .ex-bad title="Avoid · function to review" }
// Avoid: query built by concatenation, unclear return contract
function getUser(PDO $db, $id) {
    $sql = "SELECT * FROM users WHERE id = " . $id;
    $result = $db->query($sql);
    return $result->fetch();
}
```

"Identify the problems, propose a fixed version and explain what you
would check in the tests."

### Expected answer

#### Problems to point out

-   **<span class="term" data-term="sql-injection">SQL injection</span>**: the value of `$id` is concatenated into the
    query.
-   **Vague contract**: we do not know whether `$id` must be a positive
    integer, nor what is returned when the user does not exist.
-   **`SELECT *`**: potentially fetches unneeded columns and makes the
    contract depend on the schema.
-   **Error handling**: the behavior depends on the PDO configuration
    and no convention is stated.
-   **Weak typing**: input and output types are not
    documented.
-   **Responsibilities**: the function mixes data access with the
    lack of an explicit error policy.

#### Fixed version

``` { .php .ex-good title="Recommended" }
<?php

declare(strict_types=1);

// Good: prepared statement, strict typing, explicit return contract
function getUser(PDO $db, int $id): ?array
{
    if ($id <= 0) {
        throw new InvalidArgumentException('User ID must be positive.');
    }

    $statement = $db->prepare(
        'SELECT id, email, display_name FROM users WHERE id = :id'
    );
    $statement->execute(['id' => $id]);

    $user = $statement->fetch(PDO::FETCH_ASSOC);

    return $user === false ? null : $user;
}
```

This version assumes the chosen contract is: positive identifier,
`null` when no user exists, exception on a database error. Another
convention can be acceptable as long as it is consistent across the
application.

The `declare(strict_types=1);` line is essential: without it, the
`int $id` type does not fully protect. PHP converts a string like
`"1 OR 1=1"` into `1` (with a mere warning) instead of rejecting it.
With it, PHP throws a `TypeError`. This mode applies to calls written in
the file that declares it: it must therefore also be in the files that
call `getUser`. The simplest way is to make it a project rule, checked
automatically.

Equivalent Python version. Python type hints are not checked at
runtime: the `isinstance` check plays the role of `strict_types`, and
mypy reports the error before the code even runs.

``` { .python .ex-good title="Recommended · Python version" }
import sqlite3
from typing import TypedDict


# Example: the returned type, one row of the users table
class User(TypedDict):
    id: int
    email: str
    display_name: str


# Good: type checked at runtime, parameterized query, None when absent
def get_user(db: sqlite3.Connection, user_id: int) -> User | None:
    if not isinstance(user_id, int):
        raise TypeError("User ID must be an int.")
    if user_id <= 0:
        raise ValueError("User ID must be positive.")

    row = db.execute(
        "SELECT id, email, display_name FROM users WHERE id = :id",
        {"id": user_id},
    ).fetchone()

    if row is None:
        return None
    return User(id=row[0], email=row[1], display_name=row[2])
```

#### Tests to plan

1.  An existing identifier returns the expected fields.
2.  A non-existent identifier returns `null`.
3.  A zero or negative identifier throws `InvalidArgumentException`.
4.  A hostile string like `"1 OR 1=1"` throws a `TypeError`: it never
    reaches the query, whose structure stays intact.
5.  A database error is propagated according to the project's error
    convention.

Example <span class="term" data-term="integration-test">integration tests</span> (the test schema and PDO configuration must
be adapted to the project; the test file also declares
`strict_types`):

``` { .php .ex-good title="Recommended · integration tests" }
// Good: a missing user gives null
public function testReturnsNullWhenUserDoesNotExist(): void
{
    $user = getUser($this->pdo, 999999);

    self::assertNull($user);
}

// Good: a hostile string is refused before the query
public function testRejectsHostileStringId(): void
{
    $this->expectException(TypeError::class);

    getUser($this->pdo, '1 OR 1=1');
}
```

#### What a Staff Engineer should add

-   Do not stop at the local fix: search for the same pattern across
    all repositories (an SQL query built with `.` and a variable).
-   Add an <span class="term" data-term="lint-rule">automated analysis rule</span> (Semgrep, a tool that finds code
    patterns, or SonarQube) that blocks this pattern in new <span class="term" data-term="merge-request">MRs</span>. Fixing
    one function fixes one bug; the rule prevents the next ones.
-   Document the safe pattern and make it easy to adopt through
    examples, helpers or standards.
-   Avoid imposing a generic abstraction when a <span class="term" data-term="prepared-statement">prepared statement</span> is
    enough.

#### Possible spoken answer

> "I first fix the SQL injection with a prepared statement, I turn on
> strict typing and I clarify the return contract. Then I search for
> the same pattern across all repositories. If it comes back, I add an
> automated analysis rule that blocks it in new MRs, rather than a
> simple instruction in the documentation."

**Read next**: [SQL: Security: SQL injection](../../knowledge/sql.md#security-sql-injection), [Quality: Code rules that prevent defects](../../knowledge/qualite.md#code-rules-that-prevent-defects), [Quality: Code review](../../knowledge/qualite.md#code-review), [Delivery: Automated checks before merging](../../knowledge/livraison.md#automated-checks-before-merging)

---

## Exercise 2. Design a test strategy for an API

### Problem

An API creates an order. It checks the cart, computes the
total, decrements the stock and requests a payment. The teams complain
that the test suite is slow and flaky. "Propose a test
strategy."

### Expected answer

#### 1. Put numbers on the problem

First question: "slow and flaky, how much?" Without baseline figures,
we cannot tell whether the new strategy is better. For example: the
suite takes 40 minutes and 1 run in 5 fails without any code change.

#### 2. Identify the critical scenarios

Before choosing test levels, list with the product team what must not
break, then rank each scenario by impact and likelihood of a defect.
The top of the list gets the most effort.

-   Valid creation: order saved and correct total.
-   Insufficient stock: order rejected, no partial stock decrement.
-   Payment declined: consistent state and stock released according to
    the business rules.
-   Database error: transaction rolled back when
    possible. This scenario is tested with a real disposable database
    (Testcontainers, a tool that starts the database in a container for
    the duration of the test) stopped in the middle of the test, rather
    than with a fake object that simulates the error.
-   Repeated request: no duplicate order or duplicate payment if
    an <span class="term" data-term="idempotency-key">idempotency key</span> is in place.
-   Invalid input: stable and documented 4xx response.

#### 3. Place each scenario at the right test level

| Level | What we check | Examples |
|--------|------------------|----------|
| <span class="term" data-term="unit-test">Unit tests</span> | Deterministic rules without real infrastructure | total calculation, discounts, business rules |
| Integration tests | Interaction with a real, controlled dependency | SQL persistence, transaction, ORM mapping |
| <span class="term" data-term="contract-test">Contract tests</span> | Compatibility between consumers and providers | request/response schema, error codes |
| Journey tests | A few critical end-to-end business scenarios | full order creation with test dependencies |

Do not try to test everything end to end. These tests are useful to
check that the components work together, but they are expensive and more
fragile.

Each scenario from step 2 goes to the lowest level that protects it:
the total calculation as a unit test, the untouched stock as an
integration test, the complete creation as a journey test.

#### 4. Example unit test for the calculation

``` { .php .ex-good title="Recommended · total calculation" }
// Good: amounts in integer cents, invalid input refused
final class OrderTotal
{
    public static function calculate(array $items): int
    {
        $total = 0;

        foreach ($items as $item) {
            if ($item['quantity'] <= 0 || $item['unit_price_cents'] < 0) {
                throw new InvalidArgumentException('Invalid order item.');
            }

            $total += $item['quantity'] * $item['unit_price_cents'];
        }

        return $total;
    }
}
```

``` { .php .ex-good title="Recommended · unit test" }
// Good: a fast test, no database or network, on the calculation rule
public function testCalculatesTotalInCents(): void
{
    $total = OrderTotal::calculate([
        ['quantity' => 2, 'unit_price_cents' => 1250],
        ['quantity' => 1, 'unit_price_cents' => 500],
    ]);

    self::assertSame(3000, $total);
}
```

Amounts are stored in minor currency units (cents here)
to avoid rounding errors caused by floating-point numbers.

#### 5. Reduce flakiness

-   Quarantine the existing <span class="term" data-term="flaky-test">flaky tests</span> right away: they no longer block
    MRs, but each one has a ticket and an owner. The team trusts the
    pipeline again while they are being fixed.
-   Replace expectations on implementation details with
    assertions on observable behavior.
-   Use explicit, isolated test data.
-   Avoid dependencies on execution order.
-   Control the clock, randomness and external calls.
-   Keep real calls to third-party services for dedicated tests, not
    for the whole suite.
-   Measure duration and intermittent failure rate before removing or
    moving tests.

#### 6. Measure success

-   Total time and 95th percentile time of the suite.
-   Rate of flaky tests.
-   Pipeline feedback time after a change.
-   <span class="term" data-term="escaped-defect">Defects escaped</span> to production and incidents on critical
    journeys.

These measures are compared with the baseline figures, against concrete
targets: for example feedback in under 10 minutes on an MR and under 1%
flaky tests.

<span class="term" data-term="code-coverage">Code coverage</span> is a signal, not a sufficient goal: an
executed line does not guarantee a meaningful assertion.

#### Possible spoken answer

> "I would start by putting numbers on the problem: suite duration and
> failure rate without any code change. Then I would identify the critical
> scenarios with the product team, rank them by impact, and place each
> one at the cheapest test level that gives enough confidence. I would quarantine the flaky tests, each with a
> ticket and an owner, so the pipeline becomes reliable again while
> they are being fixed. I would not remove tests just because they are
> slow: I would measure their value, their flakiness and their cost,
> then I would move scenarios to more targeted tests when
> possible."

**Read next**: [Designing tests: Risk-based testing](../../knowledge/conception-tests.md#risk-based-testing), [Quality: Choosing the right test level](../../knowledge/qualite.md#choosing-the-right-test-level), [Quality: Integration tests with Testcontainers](../../knowledge/qualite.md#integration-tests-with-testcontainers), [Quality: Strategy for a flaky test](../../knowledge/qualite.md#strategy-for-a-flaky-test), [Quality: Money in integer cents](../../knowledge/qualite.md#money-in-integer-cents), [Quality: Simulating a third party that fails or is slow](../../knowledge/qualite.md#simulating-a-third-party-that-fails-or-is-slow)

---

## Exercise 3. Design a useful CI rather than an endless one

### Problem

The GitLab pipeline takes 25 minutes. Developers often wait for
the result before merging an <span class="term" data-term="merge-request">MR</span>. "Propose a gradual evolution."

### Expected answer

#### Step 1: measure before reorganizing

Collect over a representative period:

- duration per <span class="term" data-term="ci-job">job</span> and total duration;
- waiting time in queues;
- failure rate per job;
- retry rate and <span class="term" data-term="flaky-test">flaky test</span> rate;
- time between opening an MR and the first reliable feedback;
- how often failures are only detected after merge.

#### Step 2: separate fast feedback from more expensive checks

Conceptual example of `.gitlab-ci.yml`:

``` { .yaml .ex-good title="Recommended · .gitlab-ci.yml (illustrative)" }
stages:
  - validate
  - test
  - package

# Good: cancel outdated pipelines, cache dependencies keyed on the lockfile
default:
  interruptible: true
  cache:
    key:
      files: [composer.lock]
    paths: [vendor/]

# Good: the fastest check first
lint:
  stage: validate
  script:
    - composer validate --strict
    - vendor/bin/phpcs

# Good: starts as soon as lint is done, thanks to needs
unit_tests:
  stage: test
  needs: [lint]
  script:
    - vendor/bin/phpunit --testsuite unit

# Good: only runs if the MR touches the code or the dependencies
integration_tests:
  stage: test
  needs: [lint]
  rules:
    - changes:
        - src/**/*
        - tests/integration/**/*
        - composer.lock
  script:
    - vendor/bin/phpunit --testsuite integration

# Example: the image is only built after the tests
build:
  stage: package
  script:
    - docker build -t app:$CI_COMMIT_SHA .
```

Jobs in the same <span class="term" data-term="ci-stage">stage</span> can run in parallel if the runners
and dependencies allow it. But with `stages` alone, a stage waits for
the **whole** previous stage to finish. Four GitLab settings save time
without removing any check:

- `needs`: the job starts as soon as `lint` is done, without waiting
  for the other jobs of the previous stage;
- `interruptible: true`: if a new commit is pushed, the old pipeline
  is cancelled instead of running for nothing;
- a cache keyed on the <span class="term" data-term="lockfile">lockfile</span>: dependencies are downloaded again only
  when they change;
- `rules: changes`: the job only runs if the MR changes the listed
  files. In a repository with several modules, the tests of a module
  the MR does not touch are not run.

The YAML is illustrative: scripts, images, caches and rules must match
the real repository.

#### Step 3: improve without reducing confidence

1.  Identify the slowest and most expensive jobs.
2.  Cache dependencies safely, with a key tied
    to the lockfile.
3.  Run independent tests in parallel.
4.  Move fast checks ahead of expensive tests.
5.  Stabilize flaky tests and track their causes.
6.  Keep security and quality checks proportionate to the
    risk.
7.  After merge, keep the checks needed before deployment
    and the production checks.

#### What not to do

-   Remove slow tests without analyzing what they protect.
-   Make tests non-blocking only to show a green
    pipeline.
-   Optimize only the average duration without measuring the real
    feedback time.
-   Build a pipeline so complex that nobody can
    diagnose a failure.

#### Acceptance criteria for an improvement

-   Measurable drop in MR feedback time.
-   No significant increase in escaped defects.
-   Reproducible results and diagnosable failures.
-   Documentation and an identified owner for each important job.

#### Possible spoken answer

> "I would not start by rewriting the pipeline. I would measure where the
> time goes, then aim for the fastest possible
> feedback on frequent errors, while keeping reliable
> safeguards. The first gains often come from settings that remove no
> check: start a job as soon as what it depends on is done, cancel
> pipelines made obsolete by a new commit, cache dependencies and skip
> the tests of an unchanged module. Success is measured both by the
> feedback delay and by the absence of any drop in quality."

**Read next**: [DevX: A fast and reliable CI](../../knowledge/devx.md#a-fast-and-reliable-ci), [Quality: CI and delivery](../../knowledge/qualite.md#ci-and-delivery), [Quality: Parallelising without breaking things](../../knowledge/qualite.md#parallelising-without-breaking-things)

---

## Exercise 4. Creation API: idempotency and double submission

### Problem

A mobile client can retry a `POST /orders` request after a
<span class="term" data-term="timeout">timeout</span>. Sometimes two orders are created. "How do you fix the
problem?"

### Expected answer

#### Principle

A timeout does not mean the server did nothing: it may have
created the order and then lost the response. The client must be able to retry
without triggering a second business operation.

Use an **idempotency key** provided by the client, unique for
one creation intent, and store this key atomically
with the result of the operation.

#### Proposed API contract

``` { .http .ex-illus title="Illustration · proposed contract" }
POST /orders
Idempotency-Key: 6f4c0f0a-0b35-4c82-9c72-0e7b45f5a9c1
Content-Type: application/json
```

-   First valid request: creation and a `201 Created` response.
-   Same key and same logical request: return the already
    stored result.
-   Same key reused with a different payload: reject, for example
    with `409 Conflict`.
-   Request in progress with the same key: respond `409 Conflict` with a
    `Retry-After` header telling the client in how many seconds to try
    again.

The key is **specific to each customer**, not unique across the whole
application: the same key sent by two different customers stands for
two different intents.

#### Persistence model

An `idempotency_records` table with, at minimum:

-   `customer_id` and `idempotency_key`, with a
    `UNIQUE (customer_id, idempotency_key)` constraint;
-   fingerprint of the relevant payload;
-   status (`processing`, `completed`);
-   order identifier and/or stored response;
-   creation date and expiry date.

A constraint on the key alone is not enough: if two customers happen to
send the same key, the second one receives the first one's saved
response, that is, someone else's order.

Each key has a lifetime, for example 24 hours. A scheduled job then
deletes the expired rows, otherwise the table grows forever.

The **fingerprint** is a hash of the request body, computed after
**<span class="term" data-term="canonicalization">canonicalisation</span>**: the JSON is rewritten in a single form (sorted
keys, no whitespace) so that two equivalent bodies give the same hash,
whatever the field order the client sent.

``` { .text .ex-illus title="Illustration · fingerprint after canonicalization" }
body received       canonical form      sha256 (first 8 characters)
{"a":1,"b":2}       {"a":1,"b":2}       43258cff
{"b": 2, "a": 1}    {"a":1,"b":2}       43258cff   same fingerprint: replay accepted
{"a":1,"b":3}       {"a":1,"b":3}       f9c6777f   different fingerprint: 409 Conflict
```

Without canonicalisation, a client resending the same order with the
fields in another order would wrongly get a `409`.

#### Pseudo-code

The reflex that does not work: look up the key, then create the order if
the key is missing. Two simultaneous requests both pass the check before
either one stores the key, and the customer gets two orders.

``` { .text .ex-bad title="Avoid · look up then insert" }
# Avoid: two simultaneous requests find nothing and each creates an order
handleCreateOrder(customerId, key, request):
    if idempotency record exists for (customerId, key):
        return record.saved_response
    create order
    insert idempotency record (customerId, key, response)
```

The version that holds: try to insert the key first.

``` { .text .ex-good title="Recommended · pseudo-code" }
# Good: the key is inserted first, the unique constraint settles concurrency
handleCreateOrder(customerId, key, request):
    fingerprint = hash(canonicalize(request))

    try:
        insert idempotency record
            (customerId, key, fingerprint, processing, expires in 24 h)
        commit
    on unique constraint violation:
        record = find idempotency record by (customerId, key)

        if record.fingerprint != fingerprint:
            return 409 Conflict

        if record.status == completed:
            return record.saved_response

        return 409 Conflict with Retry-After header

    begin transaction
    validate business rules
    create order
    save response in idempotency record as completed
    commit

    on error:
        delete idempotency record so that a retry can start again

    return saved response
```

Concurrency relies on the <span class="term" data-term="unique-constraint">uniqueness constraint</span> in the database: we try
the insert first, and its failure is what reveals that a request with
the same key already exists. A simple "look up then insert" would
suffer a <span class="term" data-term="race-condition">race</span> between two concurrent requests. The `processing` status
is saved before the order is created, so a second request sees it and
gets `409` with `Retry-After`.

Same logic in Python with `sqlite3` (the table and the `create_order`
function must be adapted to the project):

``` { .python .ex-good title="Recommended · Python version" }
import hashlib
import json
import sqlite3
from collections.abc import Callable
from typing import Any

RETRY_AFTER_SECONDS = 2

JsonDict = dict[str, Any]
Response = tuple[int, dict[str, str], JsonDict]
CreateOrder = Callable[[sqlite3.Connection, JsonDict], JsonDict]


# Good: same fingerprint for two equivalent JSON bodies, whatever the key order
def fingerprint(request: JsonDict) -> str:
    canonical = json.dumps(request, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canonical.encode()).hexdigest()


# Good: the key is reserved before creation, and released if creation fails
def handle_create_order(
    db: sqlite3.Connection,
    customer_id: int,
    key: str,
    request: JsonDict,
    create_order: CreateOrder,
) -> Response:
    request_hash = fingerprint(request)

    try:
        with db:
            db.execute(
                "INSERT INTO idempotency_records"
                " (customer_id, idempotency_key, fingerprint, status, expires_at)"
                " VALUES (?, ?, ?, 'processing', datetime('now', '+24 hours'))",
                (customer_id, key, request_hash),
            )
    except sqlite3.IntegrityError:
        return replay(db, customer_id, key, request_hash)

    try:
        with db:
            order = create_order(db, request)
            db.execute(
                "UPDATE idempotency_records"
                " SET status = 'completed', response = ?"
                " WHERE customer_id = ? AND idempotency_key = ?",
                (json.dumps(order), customer_id, key),
            )
    except Exception:
        with db:
            db.execute(
                "DELETE FROM idempotency_records"
                " WHERE customer_id = ? AND idempotency_key = ?",
                (customer_id, key),
            )
        raise

    return 201, {}, order


# Good: replay the stored response, or ask to retry later
def replay(
    db: sqlite3.Connection, customer_id: int, key: str, request_hash: str
) -> Response:
    retry_later: Response = (
        409,
        {"Retry-After": str(RETRY_AFTER_SECONDS)},
        {"error": "Request in progress."},
    )
    row = db.execute(
        "SELECT fingerprint, status, response FROM idempotency_records"
        " WHERE customer_id = ? AND idempotency_key = ?",
        (customer_id, key),
    ).fetchone()

    if row is None:
        return retry_later
    stored_hash, status, response = row
    if stored_hash != request_hash:
        return 409, {}, {"error": "Key reused with another payload."}
    if status == "completed":
        return 201, {}, json.loads(response)
    return retry_later
```

#### Important architecture point

If payment is an external service, an SQL transaction cannot on its
own make the local database and the payment atomic. I need to
define a robust workflow: <span class="term" data-term="idempotency">idempotent</span> payment identifier, explicit
states, recovery on error and possibly an <span class="term" data-term="outbox-pattern">outbox</span>/<span class="term" data-term="saga-pattern">saga</span> pattern
depending on the context.

#### Must-have tests

-   Two sequential requests with the same key create only one
    order.
-   Two concurrent requests with the same key create only one
    order.
-   Same key, different payload: explicit conflict.
-   Two different customers with the same key: two separate orders,
    neither receives the other's response.
-   Request arriving while the first one is being processed: `409` with
    `Retry-After`.
-   Timeout after creation then retry: the client gets the existing
    result.
-   Failure during processing: the record is deleted and a new attempt
    starts from scratch without a duplicate.
-   Expired key: the cleanup job deletes the row.

#### Possible spoken answer

> "I start from the fact that a timeout is ambiguous. I make creation
> idempotent with a persisted key, unique per customer, a fingerprint
> of the request and a reusable result. I let the database carry the
> concurrency guarantee, I answer `409` with `Retry-After` while the
> first request is in progress, and keys expire after 24 hours. Then I
> handle external effects such as payment separately."

**Read next**: [API: HTTP methods](../../knowledge/api-rest-async.md#http-methods), [Architecture: Idempotency](../../knowledge/architecture.md#idempotency), [SQL: Concurrent writes](../../knowledge/sql.md#concurrent-writes), [Architecture: Outbox](../../knowledge/architecture.md#outbox), [Architecture: Orchestrated or choreographed saga](../../knowledge/architecture.md#orchestrated-or-choreographed-saga), [SQL: Constraints: the database keeps the rules](../../knowledge/sql.md#constraints-the-database-keeps-the-rules)

---

## Exercise 5. Case study: the QA team is described as a bottleneck

### Problem

Management claims that a separate quality check slows down
deliveries. It wants to transfer quality activities to the
development teams and remove the central check. "How do you approach
the problem as a Staff Engineer?"

### Expected answer

#### 1. Do not defend an organization on principle

The right question is not "should we keep a QA team?", but:
**where is the delay really, what risk does the check reduce and
what capability must be kept?**

A centralized QA team can create a queue if every
delivery has to go through it. But removing that team does not
remove the need for testing, security or reliability
requirements. Responsibilities and control mechanisms must
be explicitly redistributed.

#### 2. State testable hypotheses

-   H1: waiting for a QA review is a significant part of the <span class="term" data-term="lead-time">lead time</span>.
-   H2: delays come rather from environments,
    dependencies, product approvals or defects.
-   H3: some checks are repetitive and could be automated.
-   H4: development teams do not everywhere have the skills,
    time or tools to take over these activities.
-   H5: centralization is still needed for some specialized
    risks, for example security, performance or cross-team test
    strategy.

#### 3. Ask for the right data

-   Waiting time before QA picks up the work. Precise source: the time
    tickets spend in the "To test" column of the ticket board, compared
    to the time spent "In progress". If a ticket waits 3 days in "To
    test" for 2 hours of actual testing, the <span class="term" data-term="bottleneck">bottleneck</span> is confirmed
    and quantified.
-   Active processing time versus time in the queue.
-   Change lead time and deployment frequency.
-   Change failure rate, incidents and production defects.
-   Reopens, retests and causes of blockers.
-   Actual tool usage, but also the quality and interpretability of
    the usage data.
-   Differences by team, change type and risk level.

Do not confuse correlation and causation. A longer delay when a
QA step is present does not on its own prove that this step is
the main cause.

#### 4. Propose a reversible experiment

1.  Map the current flow and set a numeric baseline.
2.  Pick one or two volunteer teams and a limited scope.
3.  <span class="term" data-term="shift-left">Shift automatable tests left</span> and clarify acceptance
    criteria.
4.  Provide templates, examples, libraries, pipelines and coaching.
5.  Keep cross-team expertise for complex cases,
    standards and high risks.
6.  Compare results with the initial situation and, if possible,
    a comparable team.
7.  Define success criteria and stop conditions up front.

#### 5. Success measures

-   Lower delivery time and waiting time.
-   No unacceptable increase in incidents or <span class="term" data-term="escaped-defect">escaped defects</span>.
-   Teams' ability to diagnose failures.
-   Adoption of the practices and test maintenance cost.
-   Time spent on the handover and on coaching.

#### 6. Staff Engineer stance

The role is neither to protect a silo nor to accept a reorganization
based on a gut feeling. It is to clarify the problem,
propose an organizational and technical architecture, test
the hypothesis and measure the effects.

The change in the QA role is presented positively: QA moves from "the
one who signs off at the end" to "the one who provides tools and
support", with test templates, CI and a review of the test strategy
from the start of the ticket.

#### Possible spoken answer

> "I would treat the bottleneck as a hypothesis to
> verify. I would measure queue time and processing time,
> for example the time spent in the "To test" column compared to the
> actual testing time, then I would look at defects and incidents to
> avoid optimizing speed at the expense of reliability. I would test a
> model where teams own quality day to day,
> supported by shared tools and standards, with cross-team
> expertise for complex risks. QA no longer signs off at the end: it
> provides tools and support."

This is the exercise closest to a QA job, the one where I must be the
most concrete: I end with a lived example of that shift from a QA that
signs off to a QA that provides tools.

**Read next**: [Company culture: Value stream mapping](../../knowledge/culture-entreprise.md#value-stream-mapping), [Company culture: Theory of constraints](../../knowledge/culture-entreprise.md#theory-of-constraints), [Quality: Shift-left and shift-right: when to test](../../knowledge/qualite.md#shift-left-and-shift-right-when-to-test), [Data and decisions: Deciding with data](../../knowledge/donnees-decision.md#deciding-with-data), [Quality: The QA role in an agile team](../../knowledge/qualite.md#the-qa-role-in-an-agile-team)

---

## Exercise 6. DORA: choosing metrics without creating bad behavior

### Problem

A manager asks for a dashboard to compare teams. They
propose ranking teams by number of deployments and test
coverage. "What do you answer?"

### Expected answer

#### Why ranking is risky

-   The number of deployments depends on the product, the architecture,
    regulatory constraints and how changes are split.
-   <span class="term" data-term="code-coverage">Code coverage</span> measures execution, not the relevance of the
    assertions.
-   A ranking encourages optimizing the indicator rather than the system.
    This is **<span class="term" data-term="goodhart-law">Goodhart's law</span>** (Charles Goodhart, 1975, wording
    popularized by Marilyn Strathern in 1997): "when a measure becomes
    a target, it ceases to be a good measure". Example: if teams are
    ranked by coverage, tests without assertions appear, coverage goes
    up and quality does not move.
-   Teams can have different risk profiles and
    contexts.

#### A more useful dashboard

Track trends and distributions, per service or product,
rather than a simplistic ranking:

-   **Lead time for changes**: time between a committed change and
    its availability, according to a shared definition.
-   **Deployment frequency**: how often deployments reach production.
-   **Change failure rate**: share of deployments that cause an
    incident or need a fix, according to an agreed
    definition.
-   **Failed deployment recovery time**: time needed to restore
    service after a failed deployment.

Worked example of the change failure rate, over one month (example
figures):

| Production deployment | Counted as a failure? | Why |
|---|---|---|
| 36 deployments with no follow-up | No | nothing to fix |
| 1 deployment undone by <span class="term" data-term="rollback">rollback</span> | Yes | immediate intervention in production |
| 2 deployments followed by an urgent hotfix | Yes | the change degraded the service |
| 1 hotfix fixing one of the two above | No | one more deployment in the denominator, not a failure if it works |
| Red pipeline, never reached production | Out of scope | not a deployment |
| Bug found 3 months later | Out of scope, usually | it belongs to escaped defects, not to a given deployment |

Result: 3 failures out of 40 deployments, that is 7.5%. The figure only
makes sense if every team counts the same events: that is the "agreed
definition" above, to write down before publishing the first chart. The
official definition (a deployment that causes a failure needing
immediate intervention) comes from
[dora.dev](https://dora.dev/guides/dora-metrics-four-keys/) (read in
November 2026, exact wording to check).

Complement these metrics with:

- availability and <span class="term" data-term="slo">SLOs</span>;
- incidents and severity;
- <span class="term" data-term="escaped-defect">escaped defects</span>;
- CI feedback duration;
- flaky test rate;
- unplanned work and operational cost, if relevant.

#### Method

1.  Define events and denominators precisely.
2.  Check data quality.
3.  Set a baseline before any target.
4.  Look at trends and the constraints specific to each service.
5.  Use the metrics to find obstacles and decide on
    experiments.
6.  Show each team **its own** curves over time. Management sees
    overall trends, not a named ranking.
7.  Always show the four <span class="term" data-term="dora-metrics">DORA metrics</span> together on the same screen:
    nobody can improve one by degrading the others without it showing.
8.  Avoid mechanically linking these numbers to individual
    performance reviews.

#### Possible spoken answer

> "I would refuse to turn the metrics into a raw ranking: that is
> Goodhart's law, a measure that becomes a target ceases to be a good
> measure. I would propose a balanced set that measures both flow and
> stability, with shared definitions and a reading in the
> context of each product. Each team sees its own curves, management
> sees overall trends, and the four metrics stay on screen together.
> Metrics should help locate constraints and learn, not push teams to
> game the numbers."

**Read next**: [Delivery: Measuring delivery: DORA](../../knowledge/livraison.md#measuring-delivery-dora), [Laws and principles: Goodhart's law](../../knowledge/lois-et-principes.md#goodharts-law), [DevX: Measuring without monitoring people](../../knowledge/devx.md#measuring-without-monitoring-people), [Quality: What it says and what it does not](../../knowledge/qualite.md#what-it-says-and-what-it-does-not)

---

## Exercise 7. Production incident: what does the Staff Engineer do?

### Problem

After a deployment, the API error rate rises sharply. The
teams immediately look for the faulty commit and several people
suggest fixing it in production. "Describe what you do."

### Expected answer

#### Priority 1: limit the impact

1.  Name the roles: one person leads the incident (<span class="term" data-term="incident-commander">incident commander</span>)
    and decides, another communicates, the others investigate. The
    person leading does not debug themselves.
2.  Check user impact, scope and service
    indicators.
3.  Follow the <span class="term" data-term="runbook">runbook</span> and consider <span class="term" data-term="rollback">rollback</span>, disabling a
    feature with a <span class="term" data-term="feature-flag">feature flag</span> (a configuration switch that turns the
    feature off without redeploying) or a known mitigation. Rolling
    back is not always possible: if the deployment included a migration
    that drops or renames a column, the old code version looks for a
    column that no longer exists and everything breaks.
4.  Share a factual status with stakeholders at a
    regular cadence.
5.  Avoid simultaneous, uncoordinated changes.

#### Priority 2: diagnose with evidence

-   Compare error rate, latency and saturation before and after the
    deployment.
-   Correlate with version, region, dependencies and feature flags.
-   Look at logs, traces and metrics.
-   Check whether the problem affects all requests or one
    specific journey.
-   State hypotheses and test them one at a time.

#### Priority 3: restore and verify

-   Apply the least risky mitigation.
-   Check that indicators return to the expected level.
-   Watch for side effects.
-   Document the timeline, decisions and uncertainties.

#### After the incident

-   Run a <span class="term" data-term="blameless">blameless</span> review.
-   Separate immediate cause, contributing factors and detection
    gaps.
-   Create few actions, each with an owner, a due date and a success
    criterion.
-   Improve tests, observability, progressive rollout, rollback or
    runbook if needed.
-   Keep rollback possible with two practices: migrations compatible
    with both the old and new versions (add first, drop several
    deployments later), and feature flags to turn a feature off without
    redeploying.

#### Possible spoken answer

> "During the incident, I prioritize reducing impact and clear
> coordination over immediately looking for someone to blame: one
> person leads without debugging, one communicates, the others
> investigate. I rely on observable signals, I choose a reversible
> mitigation, checking that no migration prevents a rollback, and I
> verify recovery. Afterwards, I turn the learnings into tracked
> actions, without reducing the analysis to an individual mistake."

**Read next**: [Incidents: The lifecycle of an incident](../../knowledge/incidents.md#the-lifecycle-of-an-incident), [Incidents: Roles during the incident](../../knowledge/incidents.md#roles-during-the-incident), [Incidents: The blameless postmortem](../../knowledge/incidents.md#the-blameless-postmortem), [SQL: Zero-downtime schema migrations](../../knowledge/sql.md#zero-downtime-schema-migrations), [Delivery: Progressive deployment](../../knowledge/livraison.md#progressive-deployment)

---

## Exercise 8. Getting a standard adopted without formal authority

### Problem

I propose a common <span class="term" data-term="quality-gate">quality gate</span> on <span class="term" data-term="merge-request">merge requests</span>. Two teams
refuse: one fears it will slow down its deliveries, the other considers
that its context is different. "How do you move forward?"

### Expected answer

#### 1. Understand the objections before trying to convince

-   What problem is the gate meant to prevent?
-   What is the current cost of the defects it targets?
-   What does the gate cost in duration, maintenance and <span class="term" data-term="false-positive">false positives</span>?
-   Do the teams have legitimate constraints or exceptions?
-   Are the proposed rules understandable and actionable?

#### 2. Separate the common baseline from specific rules

Example of a possible baseline:

- compilation or syntax validation;
- fast tests;
- high-risk security rules;
- quality thresholds targeted at new code, if justified.

More expensive rules can run after merge or in an
adapted pipeline, as long as the risk and the detection mechanism
remain acceptable.

#### 3. Prove the value

-   Start with a volunteer team rather than with the two reluctant
    ones: a first success in a team that chose to try convinces better
    than any argument.
-   Run a workshop with the teams.
-   Measure pipeline time and the targeted defects.
-   Try the gate in informational mode before making it blocking.
-   Publish the results, including false positives and costs.
-   Fix the rules that generate noise.
-   Define an explicit, temporary and reviewable exception mechanism,
    and make it visible: for example a label on the MR with an expiry
    date, and a board listing current exceptions. An exception without
    a date becomes a hidden rule.

#### 4. Define the governance

-   Who owns the rules?
-   How are they changed?
-   What is the turnaround time for an exception request?
-   How do we keep the common baseline from becoming too heavy?
-   How do we measure adoption and results?

#### Possible spoken answer

> "I would not try to impose the same tool and all the same
> thresholds everywhere. I would start with a common goal and rules
> justified by risk. I would test the setup with a volunteer team
> first, publish the observed cost and benefit, then make
> blocking only the checks that are reliable and truly necessary.
> Exceptions remain possible, but visible and with an end date.
> Adoption is a success criterion, not a communication detail."

**Read next**: [Quality: Quality gates](../../knowledge/qualite.md#quality-gates), [Quality: Two gates are enough](../../knowledge/qualite.md#two-gates-are-enough), [DevX: Getting a tool adopted without imposing it](../../knowledge/devx.md#getting-a-tool-adopted-without-imposing-it), [Company culture: Advice process](../../knowledge/culture-entreprise.md#advice-process), [Company culture: Influence without authority and communities of practice](../../knowledge/culture-entreprise.md#influence-without-authority-and-communities-of-practice)

---

## Exercise 9. SQL performance: diagnose before optimizing

### Problem

A page that lists orders is slow. The query looks like this:

``` { .sql .ex-illus title="Illustration · the query of the slow page" }
-- Example: a customer's last 50 orders
SELECT id, customer_id, created_at, status
FROM orders
WHERE customer_id = 123
ORDER BY created_at DESC
LIMIT 50;
```

"What is your approach?"

### Expected answer

#### 1. Measure and understand

-   Reproduce with representative data.
-   Measure latency on the application side and on the database side.
-   Look at `EXPLAIN` or `EXPLAIN ANALYZE` depending on the engine.
-   Check estimated and actual row counts, reads and sorting.
-   Look at existing indexes, data distribution and query
    frequency.

#### 2. Index hypothesis

A <span class="term" data-term="composite-index">composite index</span> `(customer_id, created_at)` can be relevant: the
database finds customer 123's orders **already sorted by date** in the
index. It reads the last 50 and stops, without sorting all of the
customer's orders. The exact choice depends on the engine, cardinality,
sort direction, row size and other queries.

Example:

``` { .sql .ex-good title="Recommended · composite index" }
-- Good: the filter and the sort are served by the same index
CREATE INDEX idx_orders_customer_created
ON orders (customer_id, created_at);
```

In MySQL, `EXPLAIN` shows it: before, the `Extra` column displays
`Using filesort` (the database sorts the rows by itself); after, that
mention disappears.

In InnoDB (MySQL), a secondary index always contains the primary key
`id`. With an index on `(customer_id, created_at, status)`, every
requested column is in the index: the database does not even need to
read the table. This is called a <span class="term" data-term="covering-index">covering index</span>.

Check the plan after creating it and measure the effect. An extra
index slows down writes and uses space: it should not
be added without validation.

#### 3. Additional points

-   Avoid selecting unneeded columns.
-   Check whether `OFFSET` pagination becomes expensive on
    deep pages; consider <span class="term" data-term="cursor-pagination">cursor pagination</span> if the need
    justifies it.
-   Check for <span class="term" data-term="n-plus-one">N+1</span> on the application side if the page then loads
    details for each order.
-   Check performance changes under load and write
    costs.

What a deep `OFFSET` costs, compared with keyset pagination (the most
common form of cursor pagination):

``` { .sql .ex-bad title="Avoid · deep OFFSET" }
-- Avoid: the database reads 100,050 index entries to keep 50
SELECT id, created_at, total FROM orders
WHERE customer_id = 123
ORDER BY created_at DESC, id DESC
LIMIT 50 OFFSET 100000;
```

``` { .sql .ex-good title="Recommended · keyset pagination" }
-- Good: the database restarts from the last row seen and reads 50 entries
SELECT id, created_at, total FROM orders
WHERE customer_id = 123
  AND (created_at, id) < ('2026-03-14 10:22:05', 98431)
ORDER BY created_at DESC, id DESC
LIMIT 50;
```

The first query reads 100,050 index entries and throws 100,000 away:
the deeper the page, the slower it gets. The second one restarts from
the last row seen (its date and `id`, sent back to the client as the
cursor): with an index on `(customer_id, created_at, id)`, the database
jumps straight to the right place and reads 50 entries, whatever the
page. The `id` breaks ties between two orders created in the same
second. Limit: I can no longer jump straight to page 2,000, only to
the next one. On MySQL, whether the tuple comparison
`(created_at, id) < (...)` uses the index depends on the version (to
check with `EXPLAIN`); the expanded form
`created_at < ? OR (created_at = ? AND id < ?)` is the safest.

#### Possible spoken answer

> "I start with the <span class="term" data-term="execution-plan">execution plan</span> and a representative measurement,
> not by automatically adding an index. The
> `(customer_id, created_at)` index is a reasonable hypothesis for this
> filter and this order: the database reads rows already sorted and
> stops at 50. I validate it with the plan, where `Using filesort` must
> disappear, and with measurements. If needed, I add `status` to get a
> covering index. I then check the read/write trade-off and the
> behavior on large volumes."

**Read next**: [SQL: Performance](../../knowledge/sql.md#performance), [SQL: EXPLAIN](../../knowledge/sql.md#explain), [SQL: When an index helps](../../knowledge/sql.md#when-an-index-helps), [API: Pagination](../../knowledge/api-rest-async.md#pagination), [SQL: The N+1 problem](../../knowledge/sql.md#the-n1-problem), [SQL: Composite index: column order and covering index](../../knowledge/sql.md#composite-index-column-order-and-covering-index)

---

## Exercise 10. Security: handling a vulnerable dependency

### Problem

A scanner reports a vulnerability in a dependency. The fix
is available, but the major upgrade could break
the application. "How do you decide?"

### Expected answer

#### 1. Assess the risk

-   Version actually installed and dependency path, direct or
    <span class="term" data-term="transitive-dependency">transitive</span>.
-   Vulnerable version(s) and fixed versions.
-   Exploitability in the real context: affected code, network
    exposure, accessible data.
-   Severity and probability of exploitation. The **<span class="term" data-term="cvss">CVSS</span>** score
    (version 4.0, published in 2023) says how serious a flaw is **if**
    it is exploited. The **<span class="term" data-term="epss">EPSS</span>** score (published since 2021 by FIRST,
    the international association of incident response teams) estimates
    the **probability** that it will actually be exploited within 30
    days. A flaw with CVSS 9 but EPSS 0.1% is not as urgent as a CVSS 7
    flaw with an exploit already circulating.
-   Reachability: some scanners check whether the code actually calls
    the vulnerable function of the library. If it does not, the risk
    drops sharply.
-   Any internal or regulatory obligations.
-   Possibility of a temporary mitigation.

The scanner score is a signal; it does not replace an analysis of
the real exposure.

#### 2. Choose a proportionate plan

-   If the risk is exploitable and high: speed up mitigation and
    upgrade, with a rollback plan.
-   If the fix is compatible: upgrade quickly, test and
    deploy.
-   If a major upgrade is required: isolate the change,
    add compatibility tests, plan a short migration
    and assign an owner.
-   If the risk is low or not applicable: write the exception in the
    scanner configuration, with the evidence, the owner and an expiry
    date, so the alert comes back by itself, rather than silently
    closing the alert.

#### 3. Cross-team prevention

-   Reliable inventory of dependencies and <span class="term" data-term="lockfile">lockfiles</span>.
-   Automatic alerts in CI.
-   Remediation time policy per risk level.
-   Compatibility tests and a regular upgrade process.
-   Tracking of exceptions and their expiry.

#### Possible spoken answer

> "I combine severity, measured by CVSS, with the probability of
> exploitation, measured by EPSS, the reachability of the vulnerable
> code and real exposure. I define an action, an owner, a deadline and
> a possible mitigation. If I ignore an alert, I write it in the
> scanner configuration with an expiry date. The goal is neither to
> follow the scanner blindly, nor to downplay an alert because the fix
> is expensive. I also try to make the handling reproducible for other
> teams."

**Read next**: [Cybersecurity: Scoring and triaging a vulnerability](../../knowledge/cybersecurite.md#scoring-and-triaging-a-vulnerability), [Package managers: Updating dependencies](../../knowledge/gestionnaires-paquets.md#updating-dependencies), [Security: Example: a dependency scan](../../knowledge/securite.md#example-a-dependency-scan), [Quality: Time-limited waivers and risk acceptance](../../knowledge/qualite.md#time-limited-waivers-and-risk-acceptance)

---

## Exercise 11. Architecture: extract a service or keep a monolith?

### Problem

A team proposes extracting price calculation into a <span class="term" data-term="microservice">microservice</span>
because the module is complex and changes often. "What do you
look at before deciding?"

### Expected answer

#### Questions to ask

-   Does the module need to be deployed or scaled
    independently?
-   Does it have a clear business boundary and data that it
    owns?
-   Are the frequent changes blocked by the monolith or
    just hard to test?
-   What are the availability and latency requirements?
-   What new network failures, retry policies and
    consistency constraints would appear?
-   Can the team run the service: observability, alerts,
    on-call, deployment, security?
-   What is the migration cost and the <span class="term" data-term="rollback">rollback</span> plan?

#### Starting position

Code complexity alone is not enough to justify a
microservice. A first step can be a **<span class="term" data-term="modular-monolith">modular monolith</span>**: pricing
becomes a well-isolated module in the same codebase, with a clear
interface and internal contract tests, with no network between the two.

To keep that boundary over time, CI checks it automatically: Deptrac in
PHP or import-linter in Python fail if another module calls the inside
of the pricing module directly instead of going through its interface.
With import-linter, a four-line contract in `pyproject.toml` is enough:

``` { .toml .ex-good title="Recommended · pyproject.toml" }
# Good: other modules only go through the app.pricing interface
[[tool.importlinter.contracts]]
name = "Nobody imports the inside of the pricing module"
type = "forbidden"
source_modules = ["app.orders", "app.billing"]
forbidden_modules = ["app.pricing.internal"]
```

`lint-imports` then fails if `app.orders` imports
`app.pricing.internal`, and the only entry point left is `app.pricing`.
The full version (layers, frozen exceptions, testing the rule) is in
[Architecture: Fitness functions](../../knowledge/architecture.md#fitness-functions).

Extraction becomes more relevant if independent deployment,
scaling, data ownership or team organization brings a
measurable benefit greater than the cost of distribution. <span class="term" data-term="conway-law">Conway's law</span>
(Melvin Conway, 1968) is a reminder: architecture ends up mirroring the
organization. Extracting a service only makes sense if a team can fully
own it.

#### Gradual decision

1.  Clarify responsibilities and business boundaries.
2.  Isolate the module in the code, have CI check its boundary and
    measure dependencies.
3.  Define contracts and non-functional requirements.
4.  Prototype or test the major constraints.
5.  Compare total cost and expected benefits.
6.  If extracting: gradual migration, observability, consistency
    strategy and rollback.

#### Possible spoken answer

> "I do not confuse modularity with distribution. I would start with a
> modular monolith: the boundary becomes explicit in the same codebase
> and CI checks that it is respected. Then I would assess whether
> independent deployment or separate scaling is
> really needed. A microservice adds operational costs
> and network failures; I extract it if the benefits are
> concrete and if a team can fully own it."

**Read next**: [Architecture: Which style to choose](../../knowledge/architecture.md#which-style-to-choose), [Architecture: Modular monolith](../../knowledge/architecture.md#modular-monolith), [Architecture: Fitness functions](../../knowledge/architecture.md#fitness-functions), [Architecture: Conway's law](../../knowledge/architecture.md#conways-law)

---

## Exercise 12. Technical coaching: a developer proposes a fragile solution

### Problem

During code review, a developer proposes a complex generic
abstraction to avoid a few duplicated lines. The solution works,
but will be hard to understand. "How do you react?"

### Expected answer

#### Response to avoid

-   "That's bad practice, do it this way."
-   Imposing a personal preference as a universal rule.
-   Rewriting the code myself without explaining the problem.
-   Letting a significant risk through to avoid a disagreement.

#### Constructive approach

1.  Ask what problem the abstraction solves and which future
    changes it makes easier.
2.  Look at how many cases are truly shared and how stable their
    logic is.
3.  Compare the local duplication with the cognitive cost of the abstraction.
4.  Propose a concrete, simpler alternative if possible.
5.  Explain the decision criteria, then let the team take part
    in the choice.
6.  If the disagreement reveals a recurring rule, document a principle
    with examples rather than a dogmatic ban.

In the review comment, ask a question rather than give a verdict, for
example: "What are the next cases this abstraction must cover? If we
don't know any yet, can we keep the two simple versions and factor out
at the third case?"

#### Useful decision rule

An abstraction is worth it when it expresses a stable concept and
genuinely lowers the cost of change. A few similar lines are not
always enough: explicit duplication can be cheaper
than a premature abstraction.

A simple, well-known rule helps decide: the **<span class="term" data-term="rule-of-three">rule of three</span>**. I accept
duplication the second time and factor it out the third time, when I
finally see what is truly common. Sandi Metz sums it up in "The Wrong
Abstraction" (2016): "duplication is far cheaper than the wrong
abstraction".

#### Before / after example

Before: two nearly identical functions, six lines each.

``` { .python .ex-illus title="Illustration · before" }
# Example: orders export, six readable lines
def export_orders_csv(orders):
    lines = ["id;date;total"]
    for order in orders:
        lines.append(f"{order.id};{order.created_at:%Y-%m-%d};{order.total}")
    return "\n".join(lines)


# Example: invoices export, almost identical, acceptable with two cases
def export_invoices_csv(invoices):
    lines = ["id;date;amount"]
    for invoice in invoices:
        lines.append(f"{invoice.id};{invoice.issued_at:%Y-%m-%d};{invoice.amount}")
    return "\n".join(lines)
```

Proposal in review: a generic class with six parameters, four of which
(`delimiter`, `header`, `date_format`, `encoding`) get the same value
from both callers.

``` { .python .ex-bad title="Avoid · premature abstraction" }
# Avoid: six parameters, four of them identical for both callers
exporter = GenericExporter(
    source="orders",
    columns=["id", "created_at", "total"],
    delimiter=";",
    header=True,
    date_format="%Y-%m-%d",
    encoding="utf-8",
)
```

It covers cases that do not exist yet and forces the reader to open the
class to understand a six-line export. Suggested answer: keep the two
functions. When a third export arrives (refunds), the real common part
becomes visible (a header, then one line per item, separated by `;`)
and only that is factored out:

``` { .python .ex-good title="Recommended · factor out at the third case" }
# Good: the only truly common part, two parameters
def to_csv(header, rows):
    lines = [";".join(header)]
    lines += [";".join(str(value) for value in row) for row in rows]
    return "\n".join(lines)


# Good: each export keeps its columns readable
def export_refunds_csv(refunds):
    return to_csv(
        ["id", "date", "amount"],
        ([r.id, f"{r.refunded_at:%Y-%m-%d}", r.amount] for r in refunds),
    )
```

The small `to_csv` function has two parameters, each export keeps a
readable choice of columns, and a new parameter will only be added the
day an export really needs it.

#### Possible spoken answer

> "I would first try to understand the need and the expected
> changes, asking the question in the review rather than giving a
> verdict. I would compare the cost of the duplication with the cost of
> understanding and maintaining the abstraction. I would propose a
> simpler example and the rule of three: keep two simple versions and
> factor out at the third case. My role is to grow the team's technical
> judgment, not just to get my implementation accepted."

**Read next**: [Design principles: DRY, WET and AHA](../../knowledge/principes-conception.md#dry-wet-and-aha), [Design principles: YAGNI and rule of three](../../knowledge/principes-conception.md#yagni-and-rule-of-three), [Quality: Proving every comment](../../knowledge/qualite.md#proving-every-comment)

---

## Exercise 13. Wrap-up question: my first 90 days

### Problem

"If you are hired as a Staff Engineer, what do you do during the first
three months?"

### Expected answer

#### Days 1 to 30: Understand

-   Meet the teams, tech leads, product,
    platform, security and operations.
-   Map the systems and the delivery flows.
-   Understand recurring pain points and ongoing initiatives.
-   Look at existing signals: incidents, <span class="term" data-term="lead-time">lead time</span>, pipeline,
    defects and technical debt.
-   Do not immediately launch a general overhaul.
-   Deliver a small visible win, for example a dashboard of flaky tests
    per team: it costs little and builds credibility for what comes
    next.

**Deliverable:** a short, shareable document (problems, risks,
strengths, hypotheses to verify), sent to the teams with one simple
question: "what did I get wrong?". The corrections received are as
valuable as the assessment itself, and teams feel involved from the
start.

#### Days 31 to 60: Prioritize and experiment

-   Pick one or two cross-team problems with a demonstrable
    impact.
-   Define a baseline measurement and an expected outcome.
-   Co-build a solution with the teams involved.
-   Run a limited, reversible and documented experiment.
-   Clarify ownership and maintenance of the solution.

**Deliverable:** a prioritized plan, with hypotheses, owners, measures
and an experiment.

#### Days 61 to 90: Demonstrate and spread

-   Compare the results with the baseline.
-   Fix adoption problems or hidden costs.
-   Document the reusable model.
-   Organize sharing with other teams.
-   Propose next steps based on the results, not on a fixed plan.

**Deliverable:** observed results, decisions made and an updated
roadmap.

#### Possible spoken answer

> "In the first month, I try to understand the systems, the people
> and the real friction points. I deliver a small visible win and I
> have the teams review my assessment by asking them what I got wrong.
> In the second, I select with the teams one or two cross-team problems
> and I run a measurable experiment. In the third, I share the results
> and decide with the stakeholders whether to generalize, adapt or
> stop. I want to build trust and demonstrate impact,
> not multiply standards without evidence."

**Read next**: [Company culture: Staff+ archetypes](../../knowledge/culture-entreprise.md#staff-archetypes), [Company culture: Value stream mapping](../../knowledge/culture-entreprise.md#value-stream-mapping), [Delivery: Measuring delivery: DORA](../../knowledge/livraison.md#measuring-delivery-dora), [Company culture: The first 90 days in a new role](../../knowledge/culture-entreprise.md#the-first-90-days-in-a-new-role)

---

## Preparation checklist for a live exercise

Before wrapping up an answer, I check that I covered:

-   [ ] **Problem**: did I clarify the need and the constraints?
-   [ ] **Hypotheses**: did I state what I need to verify?
-   [ ] **Minimal solution**: did I propose a concrete and
    understandable approach?
-   [ ] **Risks**: did I talk about errors, security,
    concurrency or operations when relevant?
-   [ ] **Tests**: did I explain how to prove the solution
    works?
-   [ ] **Measurement**: did I define how to check the result?
-   [ ] **Adoption**: did I think about the teams that will have to use and
    maintain the solution?
-   [ ] **Trade-offs**: did I acknowledge the limits and the alternatives?

### If I get stuck during the interview

I can say out loud:

> "I will start by clarifying the constraints, then propose a
> simple solution. I will then look at the edge cases and the
> trade-offs before talking about optimization."

This is better than a rushed answer. For a Staff Engineer, the
quality of the reasoning, the handling of uncertainty and the ability to
make the decision understandable matter as much as the final
solution.

### Review priority if I am short on time

1.  Code review and security.
2.  Test strategy and CI/CD.
3.  Idempotency, transactions and error handling.
4.  Case study on a quality bottleneck.
5.  DORA metrics and preventing perverse effects.
6.  Production incident.
7.  Cross-team influence and adoption.
8.  SQL performance and the monolith vs microservices trade-off.
9.  First 90 days plan.

The goal is not to recite these answers word for word. I use them as
frameworks, then I connect them to my real experience: code in production,
quality tooling, supporting teams and adopting standards. The interview
questions that go with them are in
[Staff Engineer interview: the questions](questions.md).

## Measuring success

I know my practice works when I keep to the time and cover the checklist, not when I know the answers by heart. Before starting, I write down a baseline: I do three exercises out loud, timed, and I count how many points of the [preparation checklist](#preparation-checklist-for-a-live-exercise) I covered without looking. I take the same measure on three other exercises a week later. The guard metric is duration: a forty-minute exercise where I spend thirty minutes on the first idea leaves out the tests and the trade-offs.

| Solution | Success indicator (<span class="term" data-term="sli">SLI</span>) | Likely <span class="term" data-term="slo">SLO</span> | Likely <span class="term" data-term="sla">SLA</span> |
|---|---|---|---|
| asking framing questions before answering | share of exercises where I ask at least two questions before proposing | 100% of exercises | n/a: no external contract |
| following the preparation checklist | number of checklist points covered without notes, out of 8 | at least 7 out of 8 | n/a: no external contract |
| writing code live | share of coding exercises where the proposed code runs and has at least one test | at least 4 coding exercises out of 5 | n/a: no external contract |
| keeping to the time | duration of an exercise done out loud | 30 to 40 minutes, oral answer included | n/a: no external contract |
| ending with a lived example | share of exercises closed with a real case | at least 3 out of 4 | n/a: no external contract |

[Take with caution: example orders of magnitude, to adjust to the format the interviewer announces]

## Pitfalls to avoid

| Pitfall | What happens | Solution |
| --- | --- | --- |
| **Rushing into code**: I write the solution right after the statement. | I solve a problem the interviewer did not ask, and find the key constraint too late. | I ask two or three framing questions first ([how to use this document](#how-to-use-this-document)). |
| **Fixing only locally**: I repair the vulnerable function and stop there. | The same pattern stays in the other repositories, and the interviewer expects the Staff view. | I search for the pattern everywhere and add an automatic rule that blocks it ([exercise 1](#exercise-1-code-review-reliability-security-and-maintainability)). |
| **Optimizing without measuring**: I add an index or delete slow tests with no baseline. | I cannot prove the gain, and I sometimes break what the tests protected. | I measure, read the plan, change one thing, measure again ([exercise 9](#exercise-9-sql-performance-diagnose-before-optimizing)). |
| **Look up then insert**: I check whether the idempotency key exists before storing it. | Two simultaneous requests pass the check and create two orders. | I let the unique constraint decide ([exercise 4](#exercise-4-creation-api-idempotency-and-double-submission)). |
| **Ranking teams**: I accept a dashboard that compares teams by deployments or coverage. | Teams optimize the number, not the system. | I show each team its own curves, the four metrics together ([exercise 6](#exercise-6-dora-choosing-metrics-without-creating-bad-behavior)). |
| **Hunting the culprit during the incident**: I let the team argue about the faulty commit. | The service stays degraded while people look for who broke it. | I get it mitigated first, with named roles ([exercise 7](#exercise-7-production-incident-what-does-the-staff-engineer-do)). |
| **Imposing the standard**: I make the quality gate blocking everywhere on day one. | Reluctant teams bypass it and I lose their trust. | I start with a volunteer team, in report-only mode ([exercise 8](#exercise-8-getting-a-standard-adopted-without-formal-authority)). |
