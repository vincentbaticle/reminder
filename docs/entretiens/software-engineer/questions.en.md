# Software Engineer interview: the questions

!!! warning "Disclaimer"
    These notes are personal cheat sheets, not a source of truth. They reflect my own understanding and choices: their content remains subjective, despite the quotes and references it contains. It may be incomplete, simplified, inaccurate or outdated. Always check the official documentation before applying it. This content is provided as is, without any warranty: you use it at your own risk.

!!! audience "Who and what for"
    - **Roles**: back-end developer, full-stack developer, developer aiming for a Software Engineer position, QA engineer moving to development, tech lead who runs interviews.
    - **Uses**: I prepare a technical interview and want to see on one page the questions that keep coming back (SOLID, N+1, race condition, code review); the evening before the interview, I reread the answer outline of each theme; I look for the page of the site that explains in detail a notion I was asked about; I prepare a lived story for each theme; I run an interview and look for questions that tell a learned answer from an experienced one.

This page lists, theme by theme, the questions asked in a Software Engineer interview, as the interviewer phrases them. The position is individual and concrete: it is about my code, my feature, my team, not company-wide strategy.

How I use it:

1. I read the answer outline of the question, a few lines in the first person;
2. I open the **Read next** sections, which hold the full answer with its examples;
3. I prepare a lived story for each theme: the interviewer often expects "I did", with a true situation and a checkable result (a bug avoided, a response time halved, a faster review);
4. I practice the live exercises (refactoring, TDD, N+1, REST endpoint, LRU cache, double payment) on the [exercises](exercices.md) page.

The sources quoted in the outlines are dated: quoting them shows I know the state of the art, without reinventing it. The figures given are examples.

## Readable code and design

### "What is readable code, and how do you recognize it?"

- I start from the reader: a colleague (or me in six months) must understand without the author explaining.
- I look for names that state the business intent, functions that do one thing, a flow flattened by <span class="term" data-term="guard-clause">guard clauses</span>.
- I replace <span class="term" data-term="magic-number">magic numbers</span> with named constants and only comment the "why".
- My simple test: if a reviewer has to ask me a question to understand a function, it is not clear enough yet ("Clean Code", Robert C. Martin, 2008; four rules of simple design, Kent Beck, late 1990s).

**Read next**: [Guard clauses](../../knowledge/principes-conception.md#guard-clauses), [The four rules of simple design](../../knowledge/principes-conception.md#the-four-rules-of-simple-design), [Deep modules](../../knowledge/principes-conception.md#deep-modules), [No magic value](../../knowledge/qualite.md#no-magic-value), [Naming by intent](../../knowledge/principes-conception.md#naming-by-intent), and [exercise 1](exercices.md#exercise-1-refactor-a-long-function-without-changing-its-behavior).

### "Explain SOLID, with an example for each letter. How do you apply it without falling into over-engineering?"

- For each letter, I give the symptom it treats: a class that changes for three reasons (S), a subclass that breaks the caller (L), a database dependency in the middle of a business rule (D).
- I use <span class="term" data-term="solid">SOLID</span> to react to real pain, not as a checklist.
- I add an interface only for a real second implementation or a fake in tests: otherwise it is <span class="term" data-term="over-engineering">over-engineering</span>.
- In review, I spot the opposite, the flaws of <span class="term" data-term="stupid-code">STUPID</span> code (William Durand, 2013, date to check): Singleton, tight coupling, duplication.

**Read next**: [SOLID](../../knowledge/principes-conception.md#solid), [STUPID: the six smells to avoid](../../knowledge/principes-conception.md#stupid-the-six-smells-to-avoid), [D: dependency inversion](../../knowledge/principes-conception.md#d-dependency-inversion), and [exercise 11](exercices.md#exercise-11-spot-the-design-flaws-of-a-class-and-refactor-it).

### "Can you explain the Liskov substitution principle, and how do people break it without noticing?"

- A subclass honors the contract of its parent: it does not demand more as input, it does not promise less as output (Barbara Liskov, 1987, then with Jeannette Wing, 1994).
- It gets broken when one inherits to reuse code: an overridden method that raises "not supported", or a caller that checks the type with `isinstance`.
- My example: a `GiftCard` that inherits `refund` without being able to refund, and crashes on the first order return.
- I fix it by splitting capabilities (`Chargeable`, `Refundable`) or by composing, and I run the same contract tests on every subclass.

**Read next**: [L: Liskov substitution](../../knowledge/principes-conception.md#l-liskov-substitution), [I: interface segregation](../../knowledge/principes-conception.md#i-interface-segregation), [Design by contract](../../knowledge/principes-conception.md#design-by-contract).

### "DRY, KISS, YAGNI: when is duplication better than an abstraction?"

- To me, <span class="term" data-term="dry">DRY</span> means "a business rule written in one place" (Hunt and Thomas, "The Pragmatic Programmer", 1999), not "never two identical lines".
- Two pieces of code that look alike but will change for different reasons stay separate.
- I apply the <span class="term" data-term="rule-of-three">rule of three</span>: I factor out at the third real case, when I see what varies.
- A shared function that has grown five booleans is a <span class="term" data-term="wrong-abstraction">wrong abstraction</span>: I reintroduce the duplication, then refactor (Sandi Metz, "The Wrong Abstraction", 2016).

**Read next**: [DRY, WET and AHA](../../knowledge/principes-conception.md#dry-wet-and-aha), [YAGNI and the rule of three](../../knowledge/principes-conception.md#yagni-and-rule-of-three), [KISS](../../knowledge/principes-conception.md#kiss).

### "Composition or inheritance: how do you choose? When do you prefer Strategy to Template Method?"

- By default I compose: the object receives a collaborator and delegates to it, which is tested with a fake and combines freely ("Design Patterns", Gamma and co-authors, 1994).
- I inherit for a true "is a" relation that honors Liskov, one level deep, or when the framework requires it.
- I switch to Strategy as soon as inheritance goes beyond one level or a variant changes many steps.
- I apply the <span class="term" data-term="law-of-demeter">law of Demeter</span>: no `order.customer.address.city` to decide on behalf of neighboring objects.

**Read next**: [Composition over inheritance](../../knowledge/principes-conception.md#composition-over-inheritance), [Law of Demeter and Tell, don't ask](../../knowledge/principes-conception.md#law-of-demeter-and-tell-dont-ask), [Strategy](../../knowledge/design-patterns-comportement.md#strategy), [Template Method](../../knowledge/design-patterns-comportement.md#template-method).

### "Which design patterns do you use every day? Why is the Singleton called an anti-pattern?"

- I start from a real case: Strategy for standard and express shipping fees, Builder for readable test data (`an_order().paid().build()`), Adapter in front of a third-party API.
- The Singleton creates global state shared between tests and impossible to replace with a double: I let the <span class="term" data-term="dependency-injection">dependency injection</span> container keep the single instance.
- I always say when I would not use the pattern: an `if` is enough as long as there are only two stable cases.

**Read next**: [Singleton](../../knowledge/design-patterns.md#singleton), [Dependency injection](../../knowledge/design-patterns.md#dependency-injection), [Builder](../../knowledge/design-patterns.md#builder), [Adapter](../../knowledge/design-patterns.md#adapter).

### "Observer or direct calls? What is a middleware?"

- With Observer, the emitter no longer knows its subscribers: adding a handler is easy, but the order and the error handling are no longer written anywhere.
- When billing must succeed before the e-mail, I keep direct calls.
- A middleware is a chain of responsibility: each link handles what concerns it then passes on or cuts short, and the order of the chain is tested.

**Read next**: [Observer](../../knowledge/design-patterns-comportement.md#observer), [Chain of Responsibility](../../knowledge/design-patterns-comportement.md#chain-of-responsibility).

### "How do you prevent a shipped order from being paid a second time?"

- I model the statuses as a state machine: a table of allowed transitions, tested row by row.
- I back the rule in the database (conditional update on the status), because two simultaneous requests slip through a plain `if`.
- For an action replayed from a queue, I keep an identifier of the actions already processed.

**Read next**: [State](../../knowledge/design-patterns-comportement.md#state), [Command](../../knowledge/design-patterns-comportement.md#command), and [exercise 7](exercices.md#exercise-7-debug-a-double-payment).

### "How do you handle errors in your code? Exceptions or a result type?"

- I separate expected business errors (insufficient stock), which are part of the contract, from failures (database unreachable), which I let bubble up.
- I apply <span class="term" data-term="fail-fast">fail fast</span>: an invalid input is rejected at the entrance of the function (Jim Shore, IEEE Software, 2004).
- I never swallow an exception; at the boundary, I translate into an HTTP code or a useful message, without leaking information.
- I log once, with a <span class="term" data-term="correlation-id">correlation ID</span>.

**Read next**: [Error handling](../../knowledge/principes-conception.md#error-handling), [No fallback value that hides a gap](../../knowledge/qualite.md#no-fallback-value-that-hides-a-gap), [Error format](../../knowledge/api-rest-async.md#error-format).

### "How do you design an internal library or CLI that evolves without breaking its users?"

- I publish each version with a SemVer number and a changelog: a breaking change, a major version.
- I assume every visible behavior will end up being used by someone (Hyrum's law).
- I deprecate before removing, and I keep dependencies acyclic and pointing toward more stable than me.

**Read next**: [Component principles](../../knowledge/principes-conception.md#component-principles), [Principle of least surprise](../../knowledge/principes-conception.md#principle-of-least-astonishment), [Hyrum's law](../../knowledge/lois-et-principes.md#hyrums-law), [SemVer](../../knowledge/api-rest-async.md#semver-what-the-version-number-says), [Extension points through plugins](../../knowledge/principes-conception.md#extension-points-through-plugins).

## Testing my own code

### "How do you decide what to test, and at which level? Pyramid or trophy?"

- I start from risk: what would cost a lot if it broke?
- Business logic (prices, validation) goes into many <span class="term" data-term="unit-test">unit tests</span>, with the edge cases; SQL queries and transactions into <span class="term" data-term="integration-test">integration tests</span> on a real disposable database; a few end-to-end tests for the critical journeys.
- The shape depends on the context (Mike Cohn's pyramid, 2009; Kent C. Dodds' trophy, 2018): my rule, a real request as soon as it can prove the behavior.
- I test what the code does, not how it does it, so I can refactor without rewriting the tests.

**Read next**: [Pyramid, trophy, honeycomb](../../knowledge/qualite.md#pyramid-trophy-honeycomb-the-shape-of-a-suite), [Choosing the right test level](../../knowledge/qualite.md#choosing-the-right-test-level), [Risk-based testing](../../knowledge/conception-tests.md#risk-based-testing), [Equivalence partitions and boundary values](../../knowledge/conception-tests.md#equivalence-partitioning-and-boundary-values).

### "Do you practice TDD, and when do you not?"

- I use <span class="term" data-term="tdd">TDD</span> when the rule is clear and the logic rich: calculation, validation, parser, bug fix (Kent Beck, 2002; "Canon TDD", 2023).
- I start with the list of scenarios, then turn them one by one into a failing test.
- When I do not know yet what I am building, I do a throwaway <span class="term" data-term="spike">spike</span>, then start again properly with tests.
- For a bug, I always write first the test that reproduces it.

**Read next**: [TDD in practice](../../knowledge/conception-tests.md#tdd-in-practice), and [exercise 3](exercices.md#exercise-3-write-a-pure-function-with-tdd).

### "When do you use a mock, and when a real dependency? What is the difference between a mock, a stub and a fake?"

- I double what is outside my control: third-party API, e-mail, clock, randomness.
- I prefer a simple <span class="term" data-term="fake-object">fake</span> to a <span class="term" data-term="mock">mock</span> that checks every call: the fake tests the result, not the way (Martin Fowler, "Mocks Aren't Stubs", 2007).
- I do not mock my own database: a wrong query or a forgotten constraint only show up with a real database, started by <span class="term" data-term="testcontainers">Testcontainers</span>.
- I choose per neighbor: Detroit school by default, a mock when the exchange is the behavior; "don't mock what you don't own" (Freeman and Pryce, 2009).

**Read next**: [Test double](../../knowledge/qualite.md#test-double-mock-stub-fake), [London and Detroit schools](../../knowledge/qualite.md#london-and-detroit-schools-isolating-the-unit-or-not), [Integration tests with Testcontainers](../../knowledge/qualite.md#integration-tests-with-testcontainers), [Contract tests and API mocks](../../knowledge/qualite.md#contract-tests-and-api-mocks).

### "How do you make a test reliable and readable? What do you do with a flaky test?"

- I control everything that varies: I inject a clock instead of calling `now()`, I fix the random seed, I depend neither on order nor on another test's data.
- One test, one behavior, a name that says it ("rejects an expired promo code"), and the arrange, act, assert shape.
- I wait for a state, never a fixed delay.
- A <span class="term" data-term="flaky-test">flaky test</span> is a bug: I quarantine it with a ticket, then find out whether the test is wrong or reveals a real race in the code (FIRST principles, quoted in "Clean Code", 2008).

**Read next**: [Flaky test](../../knowledge/qualite.md#flaky-test), [Strategy for a flaky test](../../knowledge/qualite.md#strategy-for-a-flaky-test), [Test data](../../knowledge/conception-tests.md#test-data-builder-object-mother-isolation), [DAMP rather than DRY in tests](../../knowledge/conception-tests.md#damp-over-dry-in-tests).

### "Is code coverage a good indicator? Is 100% enough?"

- Coverage says which code was executed, not which code was checked.
- I set a gate on new code only, not a global target that pushes people to write tests without assertions.
- Mutation testing shows a mutant that survives despite 100% coverage; I keep it for critical code, because it costs computing time.

**Read next**: [What it says and what it does not](../../knowledge/qualite.md#what-it-says-and-what-it-does-not), [Mutation testing](../../knowledge/qualite.md#mutation-testing-testing-the-tests), [Two gates are enough](../../knowledge/qualite.md#two-gates-are-enough), [Goodhart's law](../../knowledge/lois-et-principes.md#goodharts-law).

### "How do you test asynchronous processing without a fixed `sleep`?"

- I wait for a condition with a maximum delay, instead of a fixed pause that is either too long or too short.
- I also test the message received twice and the message that ends up in the dead letter queue.

**Read next**: [Testing asynchronous flows](../../knowledge/api-rest-async.md#testing-asynchronous-flows).

## Existing code, refactoring and technical debt

### "How do you change legacy code that has no tests?"

- I do not rewrite: I look for the smallest place to change and a point from which to observe the behavior.
- If the code is too coupled, I create a minimal <span class="term" data-term="seam">seam</span>, for example the annoying dependency passed as a parameter with a default value.
- I write <span class="term" data-term="characterization-test">characterization tests</span> that freeze what the code does today, even if it is odd.
- I grow the new logic in a tested function (Sprout Method), called from the old code (Michael Feathers, "Working Effectively with Legacy Code", 2004).

**Read next**: [Changing legacy code](../../knowledge/principes-conception.md#changing-legacy-code), [Characterization tests and golden master](../../knowledge/conception-tests.md#characterization-tests-and-golden-master).

### "When do you refactor, and how do you do it without breaking the behavior?"

- I refactor when I have to touch the code: "make the change easy, then make the easy change" (Kent Beck, 2012).
- I deal with the <span class="term" data-term="code-smell">code smells</span> that get in the way of this precise change, not all those of the file.
- Small steps (rename, extract, move), tests run after each step, automated IDE refactorings.
- I separate a `refactor:` commit with no behavior change from the `feat:` or `fix:` commit (Martin Fowler's catalog, "Refactoring", 1999, 2nd edition 2018).

**Read next**: [Refactoring in small steps](../../knowledge/principes-conception.md#refactoring-in-small-steps), [Extract instead of piling up](../../knowledge/qualite.md#extract-instead-of-piling-up), and [exercise 1](exercices.md#exercise-1-refactor-a-long-function-without-changing-its-behavior).

### "You find a piece of code nobody understands: do you delete it?"

- First I look for why it is there: Git history, linked ticket, callers.
- I remove it in reversible steps: a log or a metric to see whether it is called, then the deletion in a short MR.

**Read next**: [Chesterton's fence](../../knowledge/lois-et-principes.md#chestertons-fence), [I look for who wrote a line](../../knowledge/git.md#i-am-looking-for-who-wrote-a-line-or-when-a-bug-appeared).

### "How do you talk about technical debt to your team and to the Product Owner?"

- I do not say "the code is dirty", I say what the <span class="term" data-term="technical-debt">technical debt</span> costs: "each new pricing rule takes three days instead of one, and two calculation bugs this quarter" (example figures).
- I only talk about the debt of often-changed areas, the hotspots (Adam Tornhill, 2015).
- I propose paying it back in slices within the features that touch the area, and I log each debt with its impact in the backlog (Ward Cunningham, OOPSLA, 1992).

**Read next**: [Technical debt](../../knowledge/principes-conception.md#technical-debt), [Presenting a technical trade-off in business terms](../../knowledge/culture-entreprise.md#presenting-a-technical-trade-off-in-business-terms).

## Code review and Git

### "How do you do a good code review?"

- I read the description and the ticket first: without the intent, I cannot judge whether the <span class="term" data-term="merge-request">MR</span> does what it wants.
- In order: correctness (edge cases, errors, concurrency), tests, security, readability; style I leave to the linter.
- I label each comment (blocking, suggestion, question, <span class="term" data-term="nit">nit</span>) and prove it with `file:line` and a breaking scenario.
- I comment on the code, not the person, I propose a solution, and I answer within the day (Google Engineering Practices, 2019).

**Read next**: [Code review](../../knowledge/qualite.md#code-review), [Prove every comment](../../knowledge/qualite.md#proving-every-comment), [Iterate down to zero blockers](../../knowledge/qualite.md#iterating-down-to-zero-blockers), [Preparing my MR and receiving a review](../../knowledge/qualite.md#preparing-my-mr-and-receiving-a-review), and [exercise 9](exercices.md#exercise-9-code-review-of-a-junior-developers-mr).

### "How do you react to review comments on your own code?"

- I make the review easy: a short MR, a description that says why and how to test, a read of my own diff before asking for a reviewer.
- If the reviewer did not understand, the next reader will not either: often, I clarify the code instead of explaining in a comment.
- I answer every comment; when I disagree, I argue with a fact, and after two exchanges without agreement, we talk live.
- I am not my code (Gerald Weinberg, "The Psychology of Computer Programming", 1971).

**Read next**: [Code review](../../knowledge/qualite.md#code-review), [I want to clean up my commits before the review](../../knowledge/git.md#i-want-to-clean-up-my-commits-before-review), [Disagree and commit](../../knowledge/culture-entreprise.md#disagree-and-commit), [Preparing my MR and receiving a review](../../knowledge/qualite.md#preparing-my-mr-and-receiving-a-review).

### "Which Git workflow do you use, and how do you write your commits?"

- Short branches, one to three days, often rebased on `main`: close to <span class="term" data-term="trunk-based-development">trunk-based development</span>.
- Atomic commits that keep the tests green, with <span class="term" data-term="conventional-commits">Conventional Commits</span> messages (specification 1.0.0, 2019) and a body that explains why.
- I may clean up my local commits, never a shared branch, and I push with `--force-with-lease` rather than `--force`.

**Read next**: [I write a good commit message](../../knowledge/git.md#i-am-writing-a-good-commit-message-conventional-commits-2019-specification-10), [Trunk-based development](../../knowledge/livraison.md#trunk-based-development), [I have to push after a rebase](../../knowledge/git.md#i-need-to-push-after-a-rebase).

### "Merge or rebase? What is the difference between `reset` and `revert`?"

- I <span class="term" data-term="git-rebase">rebase</span> my branch when I am alone on it, I merge on a shared branch.
- `reset` rewrites history and stays local; `revert` adds an inverse commit, safe on `main`, so that is what I use to undo a commit already merged.
- My rule: whatever rewrites is safe on my own branch, and dangerous as soon as it is shared.

**Read next**: [My branch is behind main: merge or rebase?](../../knowledge/git.md#my-branch-is-behind-main-merge-or-rebase), [I made a mistake: which command?](../../knowledge/git.md#i-made-a-mistake-which-command), [I lost a commit](../../knowledge/git.md#i-lost-a-commit-after-a-reset-or-a-botched-rebase).

### "How do you resolve a conflict, and a conflict in a lockfile?"

- I read the markers and recall the meaning of "ours" and "theirs", which flips between merge and rebase.
- I do not merge a lockfile by hand: I take one of the two versions and regenerate it with the package manager.

**Read next**: [I have a conflict](../../knowledge/git.md#i-have-a-conflict), [Manifest and lockfile](../../knowledge/gestionnaires-paquets.md#manifest-and-lockfile).

### "A password was pushed to the repository: what do you do?"

- I change the secret first: it stays in the history and in every clone, even after a commit that removes it.
- `.gitignore` and `git rm --cached` only prevent what comes next; I warn the team and check the access logs.

**Read next**: [I want to ignore a file](../../knowledge/git.md#i-want-to-ignore-a-file), [Secrets](../../knowledge/securite.md#secrets).

## APIs and databases

### "How do you design a clean REST endpoint?"

- I start from what the client wants to do, not from my tables: plural resources (`/orders/42`), the action carried by the HTTP method.
- Precise <span class="term" data-term="http-status-code">HTTP codes</span>: `201` with `Location`, `404`, `422` for invalid data, `409` for a conflict (RFC 9110, 2022).
- I validate inputs at the boundary, I check rights, and I never return a database object as is.
- I describe the contract in an <span class="term" data-term="openapi">OpenAPI</span> file (3.1, 2021), and I add fields without removing any, for a Tolerant Reader client (Martin Fowler, 2011).

**Read next**: [Resource and URL](../../knowledge/api-rest-async.md#resource-and-url), [Response codes](../../knowledge/api-rest-async.md#response-codes), [OpenAPI](../../knowledge/api-rest-async.md#openapi), [Tolerant Reader](../../knowledge/api-rest-async.md#tolerant-reader-a-client-that-does-not-break), and [exercise 5](exercices.md#exercise-5-design-a-small-rest-endpoint-with-errors-and-pagination).

### "What is the difference between `PUT` and `PATCH`? How do you make a `POST` safe to replay?"

- `PUT` replaces the whole resource and is idempotent; `PATCH` changes part of it and is not necessarily idempotent.
- For a payment `POST`, the client sends an <span class="term" data-term="idempotency-key">idempotency key</span>; the server keeps the response tied to that key and returns it if the request comes again.

**Read next**: [HTTP methods](../../knowledge/api-rest-async.md#http-methods), [Idempotency](../../knowledge/architecture.md#idempotency).

### "How do you return errors and paginate a list in an API? `401` or `403`?"

- One single error format, <span class="term" data-term="problem-details">Problem Details</span> (RFC 9457, 2023), with a stable `type` and the list of fields in error; never an exception trace to the client.
- `401` when I do not know who calls, `403` when I know but they lack the right.
- I always paginate, with a server-side maximum limit; I switch to <span class="term" data-term="cursor-pagination">cursor pagination</span> as soon as the list is large or receives continuous inserts.

**Read next**: [Error format](../../knowledge/api-rest-async.md#error-format), [Pagination](../../knowledge/api-rest-async.md#pagination), [Response codes](../../knowledge/api-rest-async.md#response-codes).

### "How do you evolve an API without breaking its clients?"

- I add without removing; for a breaking change, I do an expand / contract announced by the `Deprecation` and `Sunset` headers, and I bump the major version.
- I assume every visible behavior is used: I keep error codes stable.

**Read next**: [Versioning](../../knowledge/api-rest-async.md#versioning), [Hyrum's law](../../knowledge/lois-et-principes.md#hyrums-law), [Robustness principle](../../knowledge/lois-et-principes.md#robustness-principle-postels-law).

### "How do you model a table, and how do you choose your indexes?"

- I model the business, I <span class="term" data-term="db-normalization">normalize</span> by default, and I put the rules in the database: primary key, `NOT NULL`, uniqueness, <span class="term" data-term="foreign-key">foreign keys</span>. The code may have a bug, the constraint always holds.
- I index from the real queries (columns of the `WHERE`, of the joins, of the `ORDER BY`), equality first then range or sort in a composite index (Markus Winand, "SQL Performance Explained", 2012).
- I check with the <span class="term" data-term="execution-plan">execution plan</span>, and I do not index everything: each index slows writes down.

**Read next**: [When an index helps](../../knowledge/sql.md#when-an-index-helps), [EXPLAIN](../../knowledge/sql.md#explain), [Indexes and constraints without blocking](../../knowledge/sql.md#indexes-and-constraints-without-blocking), [Modeling a table](../../knowledge/sql.md#modeling-a-table), [Normal forms, in plain words](../../knowledge/sql.md#normal-forms-in-plain-words), [Constraints: the database keeps the rules](../../knowledge/sql.md#constraints-the-database-keeps-the-rules), [When to denormalize](../../knowledge/sql.md#when-to-denormalize), [Composite index: column order and covering index](../../knowledge/sql.md#composite-index-column-order-and-covering-index).

### "What is the difference between INNER JOIN and LEFT JOIN? How do you find the customers who never ordered?"

- I give the number of rows returned on a small example: `INNER JOIN` keeps what exists on both sides, `LEFT JOIN` keeps the whole left table.
- For what is missing: `LEFT JOIN ... WHERE o.id IS NULL`.
- For the last three orders of each customer, a window function `ROW_NUMBER() OVER (PARTITION BY ...)`.

**Read next**: [Joining tables](../../knowledge/sql.md#joining-tables), [Finding what is missing](../../knowledge/sql.md#finding-what-is-missing-left-join-is-null), [Window functions](../../knowledge/sql.md#window-functions).

### "What is the N+1 problem, and how do you avoid it?"

- The <span class="term" data-term="n-plus-one">N+1 problem</span> mostly comes with an ORM: a loop over orders that reads `order.customer` runs one query per row, invisible locally with ten rows.
- I detect it by counting the queries per page, in the SQL logs or the APM.
- I fix it with <span class="term" data-term="eager-loading">eager loading</span> (a join, or a second `IN (...)` query), and I add a test that checks the number of queries stays fixed.

**Read next**: [The N+1 problem](../../knowledge/sql.md#the-n1-problem), [Lazy or eager loading](../../knowledge/sql.md#lazy-or-eager-loading), and [exercise 4](exercices.md#exercise-4-fix-an-n1-query).

### "When do you use a transaction, and which isolation level do you choose?"

- I open a <span class="term" data-term="db-transaction">transaction</span> as soon as several writes form a single business operation, and I keep it short: never an HTTP call in the middle.
- I know the default <span class="term" data-term="isolation-level">isolation level</span>: `READ COMMITTED` for PostgreSQL, `REPEATABLE READ` for MySQL InnoDB.
- For a read followed by a write that depends on it, I protect: `SELECT ... FOR UPDATE`, a conditional update, or `SERIALIZABLE` with a retry against <span class="term" data-term="write-skew">write skew</span> (Kleppmann, "Designing Data-Intensive Applications", 2017).

**Read next**: [What a transaction guarantees (ACID)](../../knowledge/sql.md#what-a-transaction-guarantees-acid), [Isolation levels](../../knowledge/sql.md#isolation-levels), [Pessimistic lock](../../knowledge/sql.md#pessimistic-lock-for-update).

### "How do you rename a column in production without downtime?"

- I run expand / contract: add the new column, write to both, copy in batches, read the new one, then remove the old one in a separate release.
- Each step keeps rollback possible, and I set a `lock_timeout` so as not to block the table.

**Read next**: [Expand / contract](../../knowledge/sql.md#expand-contract), [Backfill in batches](../../knowledge/sql.md#batched-backfill), [Locks: lock_timeout](../../knowledge/sql.md#locks-lock_timeout).

## Concurrency, performance and caching

### "How do you avoid a race condition on shared data? Two people book the last seat at the same time."

- I look for the read, decide, write pattern (`if stock > 0: stock -= 1`): the classic <span class="term" data-term="race-condition">race condition</span>.
- My first option is an <span class="term" data-term="atomic-operation">atomic operation</span> in the database: `UPDATE ... SET stock = stock - 1 WHERE stock > 0`.
- Otherwise, I choose an <span class="term" data-term="optimistic-locking">optimistic lock</span> (`version` column) when conflicts are rare, a pessimistic lock when they are frequent (Kung and Robinson, 1981).
- For "only once", a <span class="term" data-term="unique-constraint">unique constraint</span>, true even with ten servers; an in-memory lock only protects its own process. I prove it with a test that fires parallel calls.

**Read next**: [Race condition and lost update](../../knowledge/sql.md#race-condition-and-lost-update), [Optimistic lock](../../knowledge/sql.md#optimistic-lock-version-column), [Pessimistic lock](../../knowledge/sql.md#pessimistic-lock-for-update), [Constraints: the database keeps the rules](../../knowledge/sql.md#constraints-the-database-keeps-the-rules), [Exclusion constraint: no overlapping slots](../../knowledge/sql.md#exclusion-constraint-no-overlapping-slots), and [exercise 7](exercices.md#exercise-7-debug-a-double-payment).

### "How do you find the cause of slowness in your code? An export went from 10 seconds to 4 minutes."

- I define slowness with a number: which endpoint, which <span class="term" data-term="p95">p95</span>, since when.
- I look at a trace to see where the time goes between code, database and external calls: most often, an SQL query or a network call.
- If it is the code, I run a <span class="term" data-term="profiler">profiler</span> and read the <span class="term" data-term="flame-graph">flame graph</span> (Brendan Gregg, 2011).
- I fix one cause at a time, measure again, and stop as soon as the target is met (Knuth, 1974: optimize the critical 3%, once measured).

**Read next**: [Finding the cause of slowness](../../knowledge/observabilite.md#finding-the-cause-of-a-slowdown-profiler-and-flame-graph), [p95 latency](../../knowledge/observabilite.md#p95-latency), [Making a query fast: the loop](../../knowledge/sql.md#making-a-query-fast-the-loop).

### "When do you add a cache, and how do you invalidate it?"

- I measure first: the <span class="term" data-term="cache-data">cache</span> treats a symptom, the cause is sometimes a missing index.
- I mostly use <span class="term" data-term="cache-aside">cache-aside</span>: I read the cache, otherwise the source, then fill the cache.
- I agree with the business on the acceptable freshness, I always set a <span class="term" data-term="ttl">TTL</span>, and I delete the entry on write when I own the write.
- The key holds everything that changes the answer (language, currency, user for personal data); against a stampede on a popular key, request coalescing and jitter.

**Read next**: [Where to put a cache](../../knowledge/architecture.md#where-to-put-a-cache), [Reading and writing with a cache](../../knowledge/architecture.md#reading-and-writing-with-a-cache), [Invalidation and cache stampede](../../knowledge/architecture.md#invalidation-and-cache-stampede), [Cache: Redis](../../knowledge/outils.md#cache-redis), and [exercise 6](exercices.md#exercise-6-code-an-lru-cache).

### "Why the p95 rather than the average? What is the difference between logs, metrics and traces?"

- The average looks like no request at all: 95 requests at 50 ms and 5 at 3 s give an average of 200 ms (example).
- The metric shows there is a problem, the trace where it is, the log why.

**Read next**: [p95 latency](../../knowledge/observabilite.md#p95-latency), [The three signals](../../knowledge/observabilite.md#the-three-signals).

## Security, debugging and production

### "Which security habits do you apply in your code every day?"

- Every SQL query is parameterized, never concatenated, against <span class="term" data-term="sql-injection">SQL injection</span>.
- Every displayed value goes through the template engine's escaping, against <span class="term" data-term="xss">XSS</span>.
- <span class="term" data-term="secret-credential">Secrets</span> come from the environment or a manager, never from the repository nor the logs; passwords are hashed with Argon2id or bcrypt.
- I let the CI do its part: dependency scanning and <span class="term" data-term="sast">SAST</span> (OWASP Top 10, 2021 edition, new edition to check).

**Read next**: [Injection](../../knowledge/securite.md#injection), [XSS, CSRF, CORS](../../knowledge/securite.md#xss-csrf-cors-browser-side-vulnerabilities), [Secrets](../../knowledge/securite.md#secrets), [Storing a password](../../knowledge/securite.md#storing-a-password), [Security: SQL injection](../../knowledge/sql.md#security-sql-injection).

### "How do you check access rights in your code? What is BOLA?"

- <span class="term" data-term="authentication">Authentication</span> says who calls, <span class="term" data-term="authorization">authorization</span> whether they may touch this precise object.
- <span class="term" data-term="bola">BOLA</span>, first risk of the OWASP API Security Top 10 (2023 edition): `GET /invoices/1234` returns the invoice to anyone who changes the number.
- I check ownership on every request on the server side, ideally in the SQL query, in a shared layer a new endpoint cannot forget, deny by default.
- I test denied access, not only allowed access.

**Read next**: [The most common API flaws](../../knowledge/securite.md#the-most-common-api-vulnerabilities), [Where to enforce the checks](../../knowledge/securite.md#where-to-enforce-checks), [Modeling rights](../../knowledge/securite.md#modeling-permissions-rbac-abac-rebac).

### "What is inside a JWT, and what must the API check?"

- I quote `iss`, `aud`, `exp`, `scope` and the signature: the API checks each one before trusting the token.
- A bearer token works for whoever holds it: I keep it short-lived and never write one to the logs.

**Read next**: [JWT](../../knowledge/securite.md#jwt-what-a-token-looks-like), [Bearer token](../../knowledge/securite.md#bearer-token-whoever-holds-it-can-use-it).

### "How do you debug a bug you do not understand, or cannot reproduce?"

- I reproduce first, ideally with a failing test.
- I read the error and the stack trace in full, then state a hypothesis and the experiment that could refute it, one variable at a time.
- If I cannot find it, I cut in half: the minimal data that triggers it, the guilty commit with <span class="term" data-term="git-bisect">git bisect</span>.
- I fix the cause, keep the test, and write down what I learned (David J. Agans, "Debugging: The 9 Indispensable Rules", 2002).

**Read next**: [Finding the cause: debugging methodically](../../knowledge/incidents.md#finding-the-cause-debugging-methodically), [I look for who wrote a line, or when a bug appeared](../../knowledge/git.md#i-am-looking-for-who-wrote-a-line-or-when-a-bug-appeared), and [exercise 2](exercices.md#exercise-2-fix-a-bug-from-a-failing-test).

### "Your production release breaks something: what do you do? Tell me about an incident you handled."

- I warn the team right away and say what I am doing.
- I mitigate first: <span class="term" data-term="rollback">rollback</span> or turning off the <span class="term" data-term="feature-flag">feature flag</span>, not a fix written in a hurry.
- I check with the metrics that the error rate is back to normal, then look for the cause in the logs and traces.
- I fix with a test that reproduces it, and I write a short, <span class="term" data-term="blameless">blameless</span> <span class="term" data-term="postmortem">postmortem</span> ("Site Reliability Engineering", Google, 2016).

**Read next**: [The lifecycle of an incident](../../knowledge/incidents.md#the-lifecycle-of-an-incident), [The blameless postmortem](../../knowledge/incidents.md#the-blameless-postmortem), [Progressive delivery](../../knowledge/livraison.md#progressive-deployment), [From alert to cause](../../knowledge/observabilite.md#from-the-alert-to-the-cause), [Telling an experience with the STAR method](../../knowledge/culture-entreprise.md#telling-an-experience-with-the-star-method).

## Organizing work, product and AI

### "How do you estimate and split a feature? Why do our projects always overrun?"

- I do not estimate a vague request: I first ask the questions that change the size.
- I split into <span class="term" data-term="vertical-slice">vertical slices</span>, each deliverable and testable on its own (INVEST criteria, Bill Wake, 2003).
- I give a range per slice and name the unknowns; an unknown that is too big justifies a time-boxed spike.
- I start from the real durations of past projects rather than the sum of the tasks, and I warn as soon as an assumption falls.

**Read next**: [Estimating and splitting a feature](../../knowledge/culture-entreprise.md#estimating-and-slicing-a-feature), [Planning fallacy](../../knowledge/lois-et-principes.md#planning-fallacy), [Hofstadter's law](../../knowledge/lois-et-principes.md#hofstadters-law), and [exercise 10](exercices.md#exercise-10-estimate-and-split-a-feature).

### "How do you work with the Product Owner when a request seems badly framed?"

- The <span class="term" data-term="product-owner">PO</span> knows the need better than me, I know the cost of the solutions better.
- I ask for the problem behind the solution: which user, which situation, what bothers them today.
- I make the discussion concrete with examples (Example Mapping, Matt Wynne, 2015), I propose costed options and let the PO decide.
- I write the agreed rules as <span class="term" data-term="acceptance-criteria">acceptance criteria</span>.

**Read next**: [Jobs to be done](../../knowledge/culture-entreprise.md#jobs-to-be-done), [Gherkin with a "Goal"](../../knowledge/conception-tests.md#gherkin-with-a-goal), [Estimating and splitting a feature](../../knowledge/culture-entreprise.md#estimating-and-slicing-a-feature).

### "How do you use an AI coding assistant responsibly?"

- I remain the author of the merged code: I read every proposed line like an MR, and I do not keep what I cannot explain.
- I check with tests, ideally written or reviewed by me before the generated code, because a <span class="term" data-term="hallucination">hallucination</span> passes a quick read easily.
- I give the agent a precise task and the test or lint command so it loops until green.
- No secret nor customer data in a tool the team has not approved (OWASP Top 10 for LLM Applications, 2025 edition, to check).

**Read next**: [Hallucination](../../knowledge/ia-agents.md#hallucination), [Writing a good task prompt](../../knowledge/ia-agents.md#writing-a-good-task-prompt), [Closing the loop](../../knowledge/ia-agents.md#closing-the-loop-giving-a-way-to-verify), [AI coding assistants](../../knowledge/devx.md#ai-coding-assistants).

### "How do you keep up to date technically? Which sources do you follow?"

- A short fixed slot, three sources I actually read, one line of notes per topic kept.
- I try one thing a month on a real case and share it with the team.

**Read next**: [Why, when and how](../../knowledge/veille.md#why-when-and-how), [Developer](../../knowledge/veille.md#developer).

## System design and behavioral questions

### "How would you design a URL shortener? How do you approach a system design exercise?"

- I clarify: links created per day, clicks, expiry, statistics.
- I do a <span class="term" data-term="back-of-envelope">back-of-the-envelope calculation</span>: 1 million links a day and 100 clicks per link make a service read a hundred times more than it is written (example).
- Simple design: `POST /links`, `GET /{code}` that returns a <span class="term" data-term="http-redirect">redirect</span>; a unique identifier encoded in <span class="term" data-term="base62">base62</span> (7 characters, about 3,500 billion codes); a cache in front of the database.
- I end with the limits: abuse, code enumeration, <span class="term" data-term="rate-limit">rate limiting</span> on creation (Alex Xu, "System Design Interview", 2020).

**Read next**: [Estimating capacity](../../knowledge/architecture.md#estimating-capacity), [Average and peak QPS](../../knowledge/architecture.md#average-and-peak-qps), [Response codes](../../knowledge/api-rest-async.md#response-codes), [Where to put a cache](../../knowledge/architecture.md#where-to-put-a-cache), [Example: a URL shortener](../../knowledge/architecture.md#example-a-url-shortener).

### "Design a rate limiter for an API open to partners."

- I compare fixed window, sliding window and token bucket.
- With several instances, I share the counter in Redis (atomic `INCR` and expiry).
- I return `429` with `Retry-After`, and I first check whether the API gateway already does it.

**Read next**: [Rate limiting](../../knowledge/architecture.md#rate-limiting), [API gateway](../../knowledge/outils.md#api-gateway-krakend-nginx), [Multi-tenant isolation and the noisy neighbor](../../knowledge/architecture.md#multi-tenant-isolation-and-the-noisy-neighbor), and [exercise 8](exercices.md#exercise-8-design-a-rate-limiter-for-an-api).

### "A service you depend on becomes slow: what do you do? How do you prevent a retry from charging twice?"

- I stack a timeout, a retry with backoff and jitter, a circuit breaker, and graceful degradation.
- A retry is only safe if the call is idempotent: an idempotency key on the called side.

**Read next**: [Resilience](../../knowledge/architecture.md#resilience), [Retry, exponential backoff and jitter](../../knowledge/architecture.md#retry-exponential-backoff-and-jitter), [Idempotency](../../knowledge/architecture.md#idempotency), [Simulating a third party that fails or is slow](../../knowledge/qualite.md#simulating-a-third-party-that-fails-or-is-slow).

### "Tell me about a mistake you made, and what you took from it."

- I pick a real mistake, with a real but contained impact, not a fake flaw.
- I tell it with the <span class="term" data-term="star-method">STAR method</span>, saying "I" and not "we".
- I spend little time on the mistake, more on the detection, the fix and what I changed afterwards (a test, a checklist, a habit).

**Read next**: [The blameless postmortem](../../knowledge/incidents.md#the-blameless-postmortem), [Learning culture](../../knowledge/culture-entreprise.md#learning-culture), [Telling an experience with the STAR method](../../knowledge/culture-entreprise.md#telling-an-experience-with-the-star-method).

### "Tell me about a technical disagreement with a colleague, and how it was resolved."

- I restate my colleague's position until they agree with my restatement.
- We agree on the <span class="term" data-term="decision-criteria">decision criteria</span> before the options, then look for a fact: a prototype, a measurement, a test ("Getting to Yes", Fisher and Ury, 1981).
- If the facts do not settle it, the team or the lead decides, and I commit to the decision (disagree and commit).

**Read next**: [Disagree and commit](../../knowledge/culture-entreprise.md#disagree-and-commit), [Type 1 and type 2 decisions](../../knowledge/culture-entreprise.md#type-1-and-type-2-decisions), [Psychological safety](../../knowledge/culture-entreprise.md#psychological-safety), [Telling an experience with the STAR method](../../knowledge/culture-entreprise.md#telling-an-experience-with-the-star-method).

### "How do you learn a new technology, or code you do not know?"

- I start from a concrete goal: I follow a simple feature from the entry point to the database, with a debugger or logs.
- For a library, I write <span class="term" data-term="learning-test">learning tests</span> (quoted in "Clean Code", 2008) that will warn me if an update changes its behavior.
- I note what surprised me and add it to the project documentation, and I ask my questions early.

**Read next**: [Onboarding](../../knowledge/devx.md#onboarding), [Documentation](../../knowledge/devx.md#documentation), [Learning an unknown codebase or library](../../knowledge/devx.md#learning-an-unknown-codebase-or-library).

### "Which technical book or article has had the most impact on you?"

- I pick a text I have really read, I quote the author and the year, and one precise idea that changed the way I work.

**Read next**: [Where to start](../../knowledge/textes-fondateurs.md#where-to-start).

## Tool choices

### "ORM or handwritten SQL: how do you choose? Active Record or Data Mapper?"

- The <span class="term" data-term="orm">ORM</span> for everyday CRUD; parameterized SQL for reporting, aggregations and critical queries, whose plan I read.
- I turn on SQL logs in development: an ORM nobody looks at ends up generating N+1 queries.
- Active Record: the object saves itself; Data Mapper: a session saves an object that knows nothing about the database (Martin Fowler, 2002).
- What matters is a clear team rule for when to switch to SQL.

**Read next**: [ORM, query builder or handwritten SQL](../../knowledge/sql.md#orm-query-builder-or-hand-written-sql), [Active Record or Data Mapper](../../knowledge/sql.md#active-record-or-data-mapper), [Repository](../../knowledge/design-patterns.md#repository).

### "Feature flag or long-lived branch: how do you deliver a feature that takes three weeks?"

- I merge disabled code behind a flag every day rather than keep a <span class="term" data-term="long-lived-branch">long-lived branch</span>, which piles up conflicts and hides integration problems.
- I enable it for the team, then for part of the users, and I can turn it off in a second.
- I test both positions of the flag, and I create the removal ticket together with the flag (Pete Hodgson, "Feature Toggles", 2017).

**Read next**: [Trunk-based development](../../knowledge/livraison.md#trunk-based-development), [Separating deploy and release](../../knowledge/architecture.md#separating-deploy-from-release), [Feature flags: Unleash](../../knowledge/outils.md#feature-flags-unleash), [OpenFeature: switching flag tools without touching the code](../../knowledge/outils.md#openfeature-switching-flag-tools-without-touching-the-code).

### "How do you choose an external library to add to the project? What is a lockfile for?"

- I ask whether the <span class="term" data-term="dependency-software">dependency</span> is worth its cost: for three lines of code, no.
- I look at its health (releases, maintainers, speed of security fixes, OpenSSF Scorecard, launched in 2020), its license and its <span class="term" data-term="transitive-dependency">transitive dependencies</span>.
- If it is at the heart of the business, I wrap it in an adapter of my own.
- I pin the version in the <span class="term" data-term="lockfile">lockfile</span> (the manifest says what I accept, the lockfile what was chosen) and a bot like Renovate proposes the updates.

**Read next**: [Choosing a dependency](../../knowledge/securite.md#choosing-a-dependency), [Manifest and lockfile](../../knowledge/gestionnaires-paquets.md#manifest-and-lockfile), [Versions and ranges](../../knowledge/gestionnaires-paquets.md#versions-and-ranges), [Updating dependencies](../../knowledge/gestionnaires-paquets.md#updating-dependencies).

## Deal-breakers

These questions test judgment more than technique. An answer on principle, one way or the other, gets a candidate eliminated.

| Interviewer's question | Avoid | What I answer | Read next |
|---|---|---|---|
| "Would you ship without tests to meet a deadline?" | "Yes, we will test later", or "never, quality is not negotiable", without looking at the context. | I start from risk: I keep the tests that protect money and data, even if it means cutting the <span class="term" data-term="feature-scope">scope</span>; a shortcut on the rest is written, visible and followed by a ticket, and the PO knows the trade-off. | [Risk-based testing](../../knowledge/conception-tests.md#risk-based-testing), [Technical debt](../../knowledge/principes-conception.md#technical-debt) |
| "A colleague broke production: how do you talk about it?" | Naming and blaming the person in public, or saying "it would not have happened with me". | I talk about the system: if one MR could break production, several safety nets were missing. I help restore service, then take part in the postmortem; in private, I remind them everyone has done it one day. | [The blameless postmortem](../../knowledge/incidents.md#the-blameless-postmortem), [Just culture](../../knowledge/culture-entreprise.md#just-culture) |
| "What do you think of the code you wrote two years ago?" | "It is very good, I would do it the same way", or "it is horrible" without saying why. | I quote one or two concrete points I would do differently (tests too tied to the implementation, an abstraction added too early), then what made me change: a review, an incident, a book. | [Learning culture](../../knowledge/culture-entreprise.md#learning-culture), [YAGNI and the rule of three](../../knowledge/principes-conception.md#yagni-and-rule-of-three) |

## The 3 things a Software Engineer does all the time

1. **Write code others can read, test and change**: I name by intent, I separate pure logic from side effects, and I leave tests that document the rules.
2. **Check with facts rather than assume**: I reproduce a bug with a test before fixing it, I measure before optimizing, I read the execution plan before adding an index, and I review code generated by an assistant like a colleague's.
3. **Own my code all the way to production**: I think about errors, concurrency, security and rollback before shipping, I watch my release, and I react quickly and calmly when something breaks. For example, a backward-compatible migration keeps rollback possible, and I watch the metrics in the hour following the deployment.

## A simple structure for answering out loud

For almost every question, I follow this thread, close to the STAR method (situation, task, action, result):

1. **Clarify**: what is the need, what are the constraints (volume, deadline, risk)?
2. **Propose simple**: the simplest solution that meets the need.
3. **Check**: how I prove it works (tests, measurement, review).
4. **Limits**: edge cases, errors, concurrency, security.
5. **Ship**: how I put it in production safely (small MRs, flag, rollback).
6. **Result**: what changed, with a number.
7. **Learn**: what I would do differently, what the team keeps.

I favor examples I have lived. When I have not lived a case, I present it as hypothetical and explain my reasoning: an interviewer prefers an honest method to an invented story.

## Measuring success

My preparation works when I answer correctly and quickly, with a lived story, not when I have read every page. Before starting, I record a baseline: in a 45-minute mock interview with a colleague, how many questions of this page I handle in under two minutes with a concrete example. I run the same mock again, with other questions drawn at random, two weeks later. The guard metric is correctness: a fast but wrong answer, or an invented story, counts as a failure.

| Solution | Success indicator (<span class="term" data-term="sli">SLI</span>) | Likely <span class="term" data-term="slo">SLO</span> | Likely <span class="term" data-term="sla">SLA</span> |
|---|---|---|---|
| answer outline learned for each question | share of randomly drawn questions I answer in under two minutes | at least 8 questions out of 10 | not applicable: no external contract |
| one lived story per theme | number of themes for which I have a story with a measured result | 11 themes out of 11 | not applicable: no external contract |
| timed live exercises | share of exercises finished and tested within the time limit (20 to 40 minutes) | at least 3 exercises out of 4 | not applicable: no external contract |
| rereading the Read next sections | share of the notions quoted in my answers that I can define with an example | 100% of the notions I quote, since a notion quoted without being understood shows at the next question | not applicable: no external contract |
| mock interviews with a peer | number of "learned answer, not lived" remarks per mock | at most one per mock | not applicable: no external contract |

[Take with caution: example orders of magnitude, to adapt to the target position and the time available]

## Pitfalls to avoid

| Pitfall | What happens | Solution |
|---|---|---|
| **Reciting the definition**: I give the five letters of SOLID without an example. | The interviewer sees a learned answer and digs until I get stuck. | I give the symptom, a lived example, then the case where the principle does not apply ([SOLID](../../knowledge/principes-conception.md#solid)). |
| **Saying "we"**: I tell what the team did. | The interviewer does not know what I did myself. | I say "I", with my action and its result ([A simple structure for answering out loud](#a-simple-structure-for-answering-out-loud)). |
| **Coding right away**: I rush into the exercise without asking anything. | I solve another problem than the one asked, or I forget an edge case. | I ask two or three questions and write an example or a test first ([exercises](exercices.md)). |
| **Optimizing before measuring**: I suggest a cache as soon as slowness comes up. | I treat a symptom, and the real cause (a missing index, an N+1) stays. | I measure, find the cause, then fix one thing at a time ([Finding the cause of slowness](../../knowledge/observabilite.md#finding-the-cause-of-a-slowdown-profiler-and-flame-graph)). |
| **Answering on principle**: "never without tests", "always microservices". | I show I cannot weigh a trade-off. | I give my criteria, then what I would choose in the case at hand ([Deal-breakers](#deal-breakers)). |
| **Inventing a story**: I present a hypothetical case as lived. | One detail question is enough to bring it down, and trust with it. | I say the case is hypothetical and explain my reasoning. |
| **Blaming someone**: I tell an incident by accusing a colleague. | The interviewer imagines how I will talk about them. | I talk about the system that allowed the mistake and what changed afterwards ([The blameless postmortem](../../knowledge/incidents.md#the-blameless-postmortem)). |
