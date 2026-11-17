# QA Engineer interview: live exercises

!!! warning "Disclaimer"
    These notes are personal cheat sheets, not a source of truth. They reflect my own understanding and choices: their content remains subjective, despite the quotes and references it contains. It may be incomplete, simplified, inaccurate or outdated. Always check the official documentation before applying it. This content is provided as is, without any warranty: you use it at your own risk.

!!! audience "Who and what for"
    - **Roles**: QA engineer, tester, software development engineer in test (SDET), QA lead, developer aiming for a quality-oriented job.
    - **Uses**: I am asked live to list the test cases of a date form and I want a method that fits in ten minutes; I must fix a flaky Playwright test in front of the interviewer; I am given a customer complaint and must write the bug report; I must recommend a go or a no-go from a release situation.

Hands-on exercises with detailed worked answers. This page complements [the interview questions](questions.md): there is no single answer, but **concrete reference answers** (test cases, code, reports and oral phrasing) that I use as a structure.

The target job asks to design and write tests, find and report bugs, automate at the right level and help the team decide to ship. The exercises therefore cover test design techniques, code (Playwright in TypeScript, <span class="term" data-term="pytest">pytest</span>, k6, SQL), reviews and decisions.

## How to use this page

In a live interview, the interviewer mostly watches **how** I search, not just what I find. For each exercise:

1. I read the statement without looking at the answer.
2. **I ask two or three questions before answering**: "who are the users?", "what is the exact rule?", "what is already tested?". A QA who starts by questioning the specification already shows their craft.
3. **I think out loud**: I name the technique I apply ("I do <span class="term" data-term="equivalence-partitioning">equivalence partitioning</span>, then boundary values"), then I say what I check and why, even while I write code.
4. I start with the riskiest cases, then widen. I also say what I would not test, and why.
5. For code, I give a simple version that works, then state its limits (stability, data, parallelism).
6. **I finish with a lived example**: "in my current job, I had a similar bug...". The worked answers are theoretical, experience is what makes the difference.

The code examples are deliberately small so they can be done in an interview. Service, URL and data names are made up. Tool syntax should be checked against their version.

## Exercise 1. Designing the tests of a booking period field

### Statement

A bike rental website has a form with a start date and an end date. Rules given by the PO:

- the start date cannot be in the past;
- the rental lasts from 1 to 14 days inclusive;
- booking is at most 90 days in advance.

I must list the test cases I would propose, and write the tests of the validation function.

### Worked answer

#### 1. Questions to ask first

- "1 to 14 days": does a rental from Monday to Monday last 7 or 8 days? Is the end date included?
- "Not in the past": is today allowed? In which time zone is "today" computed?
- What happens if the end date is before the start date?
- Is the rule checked on the server side, and not only in the browser?

From here on, I assume the answer: the end date is included (from the 1st to the 1st = 1 day), today is allowed, the time zone is the agency's (Europe/Paris).

#### 2. Equivalence partitions

An equivalence partition is a group of values the system must treat the same way: a single value of the group is enough to represent it. For example, a start at D+10 represents every start between today and D+90.

| Parameter | Valid partition | Invalid partitions |
|---|---|---|
| Start | today to D+90 | past, beyond D+90 |
| Duration | 1 to 14 days | 0 or negative (end before start), 15 days and more |
| Format | two valid dates | empty date, impossible date (31/02), text |

#### 3. Boundary values

With the <span class="term" data-term="boundary-value">three-value method</span> around each boundary:

| Boundary | Values tested | Expected |
|---|---|---|
| Earliest start | yesterday, today, tomorrow | rejected, accepted, accepted |
| Latest start | D+89, D+90, D+91 | accepted, accepted, rejected |
| Minimum duration | end = start minus 1 day, end = start, end = start plus 1 day | rejected, accepted (1 day), accepted (2 days) |
| Maximum duration | 13, 14, 15 days | accepted, accepted, rejected |

#### 4. Date-specific cases

- A period that crosses the clock change (end of March, end of October).
- A period that crosses 29 February of a leap year.
- A period that spans two years (from 28 December to 3 January).
- A user in another time zone, at 23:30 Paris time: "today" is not the same day for them.

#### 5. Decision table and state transitions

A <span class="term" data-term="decision-table">decision table</span> crosses the conditions and gives the expected result for each useful combination; each column becomes a test case. "-" means "does not matter for this rule".

| Condition / result | R1 | R2 | R3 | R4 |
|---|---|---|---|---|
| Start in the past | yes | no | no | no |
| Duration of 1 to 14 days | - | no | yes | yes |
| Start at most at D+90 | - | - | no | yes |
| Expected result | rejected `start_in_past` | rejected `too_long` or `end_before_start` | rejected `too_far_ahead` | accepted |

<span class="term" data-term="state-transition">State transitions</span> test what the booking becomes after validation. Three valid transitions, and a forbidden one to test as well:

| Start state | Event | End state |
|---|---|---|
| Draft | valid dates and payment accepted | Confirmed |
| Confirmed | cancellation before the start date | Cancelled |
| Confirmed | end date passed | Completed |

Forbidden transition: a cancelled booking that receives a payment must stay cancelled (and the payment be rejected or refunded).

#### 6. The tests of the validation function

I assume a function `validate_booking(start, end, today)` that returns an empty list of errors when the period is valid. The classic mistake is to let the function read the real date: the test passes today and breaks the day D+90 lands on another boundary.

``` { .python .ex-bad title="Avoid" }
from datetime import date, timedelta

from booking.rules import validate_booking


# Avoid: the real date, so the result changes with the day CI runs
def test_booking_ninety_days_ahead():
    start = date.today() + timedelta(days=90)
    assert validate_booking(start, start) == []
```

Passing `today` as a parameter makes the test independent of the real date. `@pytest.mark.parametrize` runs the same test function once per row of the list: here seven cases, seven separate results in the report, each named by its `id`.

``` { .python .ex-good title="Recommended" }
from datetime import date, timedelta

import pytest

from booking.rules import validate_booking

TODAY = date(2026, 10, 23)


# Good: a helper that expresses each date relative to a fixed day
def d(days: int) -> date:
    return TODAY + timedelta(days=days)


# Good: one case per partition and per boundary value, each named by its id
@pytest.mark.parametrize(
    ("start", "end", "expected_error"),
    [
        pytest.param(d(-1), d(0), "start_in_past", id="start-yesterday"),
        pytest.param(d(0), d(0), None, id="start-today-1-day"),
        pytest.param(d(90), d(90), None, id="start-d90"),
        pytest.param(d(91), d(91), "too_far_ahead", id="start-d91"),
        pytest.param(d(5), d(4), "end_before_start", id="end-before-start"),
        pytest.param(d(1), d(14), None, id="duration-14-days"),
        pytest.param(d(1), d(15), "too_long", id="duration-15-days"),
    ],
)
def test_validate_booking(start, end, expected_error):
    errors = validate_booking(start, end, today=TODAY)

    if expected_error is None:
        assert errors == []
    else:
        assert expected_error in errors


# Good: a date-specific trap, with a fixed calendar day
def test_booking_across_leap_day_counts_29_february():
    errors = validate_booking(date(2028, 2, 20), date(2028, 3, 4), today=date(2028, 2, 1))

    assert errors == []
```

The last test checks that a rental from 20 February to 4 March 2028 lasts 14 days, 29 February included, so it stays accepted.

#### What a QA Engineer should add

- The same set of cases must be replayed **on the API**, not only on the function: a check done only in the browser can be bypassed.
- A single E2E test is enough to check that the error shows next to the right field and is readable by a <span class="term" data-term="screen-reader">screen reader</span>.
- The PO's answers to the opening questions go into the <span class="term" data-term="acceptance-criteria">acceptance criteria</span>, so nobody has to ask again.

#### Possible oral answer

> "I would start by clearing the ambiguities: is the end date included, and in which time zone is today computed? Then I would split into equivalence partitions, valid and invalid, and add the boundary values around each boundary: yesterday, today, D+90, D+91, 14 and 15 days. I would add the date-specific traps: clock change, 29 February, the user's time zone. I would write these cases as <span class="term" data-term="parametrized-test">parametrized</span> unit tests, with an injected current date so they do not depend on the calendar, then replay the main ones on the API."

**Read next**: [Equivalence partitioning and boundary values](../../knowledge/conception-tests.md#equivalence-partitioning-and-boundary-values), [Decision table](../../knowledge/conception-tests.md#decision-table), [State transitions](../../knowledge/conception-tests.md#state-transitions), [pytest](../../knowledge/outils.md#pytest)

## Exercise 2. Writing a bug report from a complaint

### Statement

Support forwards this message from a customer:

> "Hello, I tried to pay for my order last night and it crashed. I tried again and now I have been charged twice! Your website is awful."

Reproducing it on the test environment, I observe: on the payment page, clicking "Pay" twice quickly sends two `POST /payments` requests, and two payments are recorded for the same order. I must write the bug report.

### Worked answer

#### 1. What to check before writing

- **Minimal reproduction**: is the double click enough, or is a network error needed? Does the bug also show when reloading the page during payment, or with the back button?
- **Server side or client side**: the button should be disabled after the first click (client), but above all the server should never accept two payments for the same order. Sending two identical requests with a tool (curl, API test) shows whether the server protects itself.
- **Impact**: money charged twice. How many cases in production? Logs or the database can tell (see exercise 8).

#### 2. The report

The filled-in report, with made-up data:

``` { .markdown .ex-illus title="Illustration" }
Title: Double charge when clicking "Pay" twice quickly

Environment: integration, front 4.2.0, payments-service 2.7.1,
Chrome 130 and Firefox 131
Proposed severity: critical (money charged twice)
Frequency: 10 tries out of 10 with two clicks less than 300 ms apart

Steps
1. Log in with ada@example.test
2. Add an item to the cart, go to payment
3. Enter the test card 4242 4242 4242 4242
4. Click "Pay" twice quickly

Expected: a single payment recorded, the second click is ignored
Actual: two payments of €40.00 recorded for order 9812

Isolation
- The button stays active while the first payment is processed.
- Two identical POST /payments requests sent with curl:
  two payments created. The server does not protect against repetition.
- Same result when reloading the page during payment.

Evidence: Playwright trace, X-Request-Id a81f and a820, excerpt of the
payments table attached.

Original complaint: customer support ticket, double charge last night.
```

#### 3. What makes this report good

- The title says what and under which condition, without judgement.
- The steps are minimal, with the exact data.
- The "Isolation" section proves the real problem is on the server side, which guides the fix: an <span class="term" data-term="idempotency-key">idempotency key</span> or a unique constraint on the order, not just a disabled button.
- The <span class="term" data-term="bug-severity">severity</span> is justified by the impact, and the link to the real customer lets support answer them.

Severity measures the impact of the bug; <span class="term" data-term="bug-priority">priority</span> says in which order to fix it, and the PO sets it. A common four-level scale:

| Severity | What it means | Example |
|---|---|---|
| Critical | loss of money or data, security hole, service down | double charge in this report |
| Major | important feature broken, a workaround exists | sort by price reversed, sorting by relevance works |
| Minor | annoying without blocking anyone | typo in a confirmation email |
| Cosmetic | visual defect only | icon shifted by a few pixels |

The two axes do not always go together: a crash in an admin screen used once a year is major but low priority; the brand name misspelled on the home page is cosmetic but high priority.

#### What a QA Engineer should add

- Warn the PO and the team right away: a bug that charges money twice in production must not wait for the next triage.
- Propose to find the other affected customers in the database, and refund them.
- Propose a non-regression API test: two simultaneous requests for the same order, a single payment expected.

#### Possible oral answer

> "Before writing, I would look for the minimal reproduction and check whether the server protects itself, by sending two identical requests without the browser. Here it does not, so disabling the button would not be enough. I would write a factual title, minimal steps, expected and actual, an isolation section that points at the server, and a critical severity. Since money is charged twice in production, I would warn the team right away, without waiting for triage."

**Read next**: [The bug report](../../knowledge/conception-tests.md#the-bug-report), [Severity and priority](../../knowledge/conception-tests.md#severity-and-priority), [HTTP methods](../../knowledge/api-rest-async.md#http-methods), [Idempotency](../../knowledge/architecture.md#idempotency)

## Exercise 3. Fixing a flaky Playwright test

### Statement

This test fails about one time in five in CI, never locally. I must find the causes of flakiness and propose a fixed version.

``` { .typescript .ex-bad title="Avoid" }
import { test, expect } from '@playwright/test';

// Avoid: fixed pause, one-shot reads, shared catalogue data and CSS selectors
test('search for a product and add it to the cart', async ({ page }) => {
  await page.goto('https://staging.shop.example.test');
  await page.fill('#search', 'mug');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);
  const results = await page.$$('.product-card');
  expect(results.length).toBe(12);
  await page.click('.product-card:first-child .add-btn');
  const count = await page.textContent('.cart-count');
  expect(count).toBe('1');
});
```

### Worked answer

#### 1. The causes of flakiness

| Line | Problem | Why it is flaky |
|---|---|---|
| `waitForTimeout(3000)` | fixed wait | in CI, the search can take more than 3 s; locally it is faster |
| `$$('.product-card')` then `length` | one-shot read, no waiting | if results arrive in two batches, we count too early |
| `toBe(12)` | depends on data | a product added to or removed from the staging catalogue breaks the test |
| `textContent('.cart-count')` | one-shot read | the counter updates after the API response, the test reads too early |
| `:first-child` | depends on order | result order can change (sort by popularity) |
| hard-coded URL | depends on the environment | impossible to run the test elsewhere |
| CSS selectors | brittle | a class change breaks the test without any behaviour change |

#### 2. The fixed version

``` { .typescript .ex-good title="Recommended" }
import { test, expect } from '@playwright/test';

// Good: test-owned data, role-based selectors and assertions that retry
test('search for a product and add it to the cart', async ({ page, request }) => {
  await request.post('/api/test/products', {
    data: { sku: 'MUG-QA-001', name: 'QA test mug' },
  });

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Search' }).fill('QA test mug');
  await page.getByRole('searchbox', { name: 'Search' }).press('Enter');

  const card = page.getByRole('article').filter({ hasText: 'QA test mug' });
  await expect(card).toHaveCount(1);

  await card.getByRole('button', { name: 'Add to cart' }).click();

  await expect(page.getByTestId('cart-count')).toHaveText('1');
});
```

What changed:

- The URL comes from `baseURL` in the configuration, so the test runs on any environment.
- The test creates its own product through the API: it no longer depends on the catalogue or on result order (isolated <span class="term" data-term="test-data">test data</span>).
- No fixed wait left: `expect(...).toHaveCount()` and `toHaveText()` retry until the configured timeout, this is Playwright's <span class="term" data-term="auto-wait">auto-waiting</span>.
- The <span class="term" data-term="selector">selectors</span> use role and label, more stable and checking accessibility along the way.

#### 3. Validating the fix

``` { .bash .ex-ref title="Reference" }
# Example: replay the test 50 times on 4 workers to check it no longer flickers
npx playwright test search.spec.ts --repeat-each=50 --workers=4
```

If the 50 runs pass, the test can leave <span class="term" data-term="test-quarantine">quarantine</span>. To diagnose a remaining failure, I turn on `trace: 'on-first-retry'` in `playwright.config.ts` and open the trace with `npx playwright show-trace`.

#### What a QA Engineer should add

- Check that the failure was not a real bug: if the trace shows a 500 error from the search API, the product is unstable, not the test.
- Delete the test product at the end, or use a unique name, so parallel runs do not collide.
- Do not "fix" it by raising `waitForTimeout` or adding `retries: 3`: that hides the problem.

#### Possible oral answer

> "I see three families of causes: fixed waits and one-shot reads instead of retrying assertions, a dependency on the catalogue and on result order, and brittle CSS selectors. I would create the test data through the API, use `getByRole` and waiting `expect` calls, and remove the hard-coded URL. I would validate with `--repeat-each=50`, and look at the trace of an old failure to make sure it was not hiding a real bug."

**Read next**: [Strategy for a flaky test](../../knowledge/qualite.md#strategy-for-a-flaky-test), [Causes of flakiness that are not test bugs](../../knowledge/qualite.md#causes-of-flakiness-that-are-not-test-bugs), [Playwright, Cypress, Selenium](../../knowledge/outils.md#playwright-cypress-selenium), [Test vocabulary](../../knowledge/qualite.md#testing-vocabulary), [Test data: Builder, Object Mother, isolation](../../knowledge/conception-tests.md#test-data-builder-object-mother-isolation), [Quarantining without blocking](../../knowledge/qualite.md#quarantining-without-blocking)

## Exercise 4. Writing API tests with pytest

### Statement

The `my-api` API exposes:

- `POST /users`: creates a user. Body: `email` (required, unique), `name` (required, 1 to 50 characters). Response `201` with `id`, `email`, `name`.
- `GET /users/{id}`: returns the user, `404` if it does not exist.
- Both routes require a token (`Authorization: Bearer ...`).

I must write a pytest suite: <span class="term" data-term="test-fixture">fixtures</span>, happy path, parametrized error cases, authentication.

### Worked answer

#### 1. Layout

``` { .text .ex-illus title="Illustration" }
tests/
├── conftest.py        # fixtures: client, token, unique user
└── test_users.py      # the tests
```

#### 2. The fixtures

A fixture is a function marked `@pytest.fixture` that prepares a resource. A test receives it by declaring a parameter with the same name: pytest sees the name, calls the fixture and passes the result.

``` { .python .ex-illus title="Illustration" }
import pytest


# Example: a fixture that prepares an empty cart
@pytest.fixture
def cart():
    return {"items": [], "total_cents": 0}


# Example: the test receives the fixture by declaring a parameter with the same name
def test_empty_cart_total_is_zero(cart):
    assert cart["total_cents"] == 0
```

The classic mistake is to put the secret in the code and ask for a token in every test: the secret goes into Git history, and the suite calls the authentication server hundreds of times.

``` { .python .ex-bad title="Avoid" }
import httpx


# Avoid: hard-coded secret and a new token for every test
def test_get_user():
    token = httpx.post(
        "https://my-api.example.test/auth/token",
        data={"client_id": "qa", "client_secret": "s3cr3t"},
    ).json()["access_token"]
    response = httpx.get(
        "https://my-api.example.test/users/42",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
```

The suite's fixtures, put in `conftest.py` so every test file sees them:

``` { .python .ex-good title="Recommended" }
# tests/conftest.py
import os
import uuid

import httpx
import pytest

BASE_URL = os.environ["API_BASE_URL"]


# Good: one token per session, secrets read from the environment
@pytest.fixture(scope="session")
def token() -> str:
    response = httpx.post(
        f"{BASE_URL}/auth/token",
        data={
            "client_id": os.environ["TEST_CLIENT_ID"],
            "client_secret": os.environ["TEST_CLIENT_SECRET"],
        },
    )
    response.raise_for_status()
    return response.json()["access_token"]


# Good: an authenticated client, closed cleanly after the test
@pytest.fixture
def api(token):
    with httpx.Client(
        base_url=BASE_URL, headers={"Authorization": f"Bearer {token}"}, timeout=10
    ) as client:
        yield client


# Good: a client without a token for the authentication tests
@pytest.fixture
def anonymous_api():
    with httpx.Client(base_url=BASE_URL, timeout=10) as client:
        yield client


# Good: a unique email per test, to run in parallel without collisions
@pytest.fixture
def unique_email() -> str:
    return f"grace+{uuid.uuid4().hex[:8]}@example.test"
```

- The token is fetched once per session (`scope="session"`), not for every test.
- <span class="term" data-term="secret">Secrets</span> come from environment variables, never from the code.
- Each test gets a unique email: tests can run in parallel without collisions.

#### 3. The tests

``` { .python .ex-good title="Recommended" }
# tests/test_users.py
import pytest


# Good: the happy path checks the response then reads the created resource again
def test_create_user_returns_201_and_can_be_read(api, unique_email):
    created = api.post("/users", json={"email": unique_email, "name": "Grace"})

    assert created.status_code == 201
    body = created.json()
    assert body["email"] == unique_email
    assert body["name"] == "Grace"
    assert api.get(f"/users/{body['id']}").json() == body


# Good: invalid inputs in a single parametrized test, one id per case
@pytest.mark.parametrize(
    ("payload_update", "reason"),
    [
        pytest.param({"email": None}, "missing email", id="missing-email"),
        pytest.param({"email": "not-an-email"}, "format", id="invalid-email"),
        pytest.param({"name": ""}, "empty name", id="empty-name"),
        pytest.param({"name": "a" * 51}, "name too long", id="name-51-characters"),
    ],
)
def test_create_user_rejects_invalid_payload(api, unique_email, payload_update, reason):
    payload = {"email": unique_email, "name": "Grace"} | payload_update
    payload = {key: value for key, value in payload.items() if value is not None}

    response = api.post("/users", json=payload)

    assert response.status_code == 422, reason


# Good: the upper boundary value accepted
def test_name_of_50_characters_is_accepted(api, unique_email):
    response = api.post("/users", json={"email": unique_email, "name": "a" * 50})

    assert response.status_code == 201


# Good: the uniqueness rule
def test_duplicate_email_is_rejected(api, unique_email):
    api.post("/users", json={"email": unique_email, "name": "Grace"})

    response = api.post("/users", json={"email": unique_email, "name": "Ada"})

    assert response.status_code == 409


# Good: the missing resource
def test_unknown_user_returns_404(api):
    assert api.get("/users/00000000-0000-0000-0000-000000000000").status_code == 404


# Good: authentication on both routes
@pytest.mark.parametrize(
    ("method", "path"), [("post", "/users"), ("get", "/users/any-id")]
)
def test_routes_require_a_token(anonymous_api, method, path):
    response = getattr(anonymous_api, method)(path)

    assert response.status_code == 401
```

#### 4. What the suite covers

| Category | Tests |
|---|---|
| Happy path | creation then read back |
| Boundary values | 50-character name accepted, 51 rejected, empty name rejected |
| Invalid inputs | missing email, malformed email |
| Business rule | duplicate email rejected (`409`) |
| Missing resource | `404` |
| Authentication | `401` without a token on both routes |

#### What a QA Engineer should add

- An authorization test if users must only see their own record: this is the <span class="term" data-term="bola">BOLA</span> flaw.
- Validation of the response schema against the <span class="term" data-term="openapi">OpenAPI</span> file, if the team maintains one.
- Cleanup of the created users, or an environment reset regularly.
- A test of two simultaneous creations with the same email, to check that uniqueness holds under concurrency.

#### Possible oral answer

> "I would put the fixtures in `conftest.py`: a token fetched once per session, an authenticated client, an anonymous client and a unique email per test so I can run in parallel. I would write the happy path with a read back, then a parametrized test for invalid inputs, with the boundary values of the name length. I would add the uniqueness rule, the 404 and the 401. Secrets would come from environment variables. Then I would complete it with an authorization test between two users."

**Read next**: [pytest](../../knowledge/outils.md#pytest), [Testing a REST API](../../knowledge/api-rest-async.md#testing-a-rest-api), [Response codes](../../knowledge/api-rest-async.md#response-codes), [The most common API flaws](../../knowledge/securite.md#the-most-common-api-vulnerabilities), [Secrets](../../knowledge/securite.md#secrets)

## Exercise 5. Writing a load test with k6

### Statement

The team wants to know whether the catalogue API holds the expected Black Friday peak: 300 simultaneous users, who browse the product list, open a product page, and a third of them add a product to the cart. Target: 95% of requests under 400 ms, fewer than 1% errors. I must write the k6 script.

### Worked answer

#### 1. Questions to ask first

- On which environment? It must be sized like production, and the other teams must be warned.
- Does the peak build up progressively or all at once at midnight?
- Is one account per virtual user needed for the cart?
- Who watches the server metrics during the test?

#### 2. The script

The classic mistake: 300 virtual users looping on the same URL with no think time and no threshold. The test sends far more requests than 300 real people, only measures the cache of one page, and goes green whatever the result.

``` { .javascript .ex-bad title="Avoid" }
import http from 'k6/http';

export const options = { vus: 300, duration: '1m' };

// Avoid: a single URL, no pause, no threshold, so nothing can fail the test
export default function () {
  http.get('https://perf.my-api.example.test/products/1');
}
```

``` { .javascript .ex-good title="Recommended" }
import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL;
const TOKEN = __ENV.TEST_TOKEN;

// Good: a ramp-up, a plateau, a ramp-down, and thresholds that fail the test
export const options = {
  scenarios: {
    black_friday: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5m', target: 300 },
        { duration: '20m', target: 300 },
        { duration: '3m', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<400'],
    http_req_failed: ['rate<0.01'],
    'http_req_duration{name:add_to_cart}': ['p(95)<600'],
  },
};

// Good: the real journey, with think times and varied products
export default function () {
  const params = { headers: { Authorization: `Bearer ${TOKEN}` } };

  group('browse the catalogue', () => {
    const list = http.get(`${BASE_URL}/products?page=1`, { ...params, tags: { name: 'list' } });
    check(list, { 'list 200': (r) => r.status === 200 });
    sleep(Math.random() * 2 + 1);

    const productId = Math.floor(Math.random() * 5000) + 1;
    const product = http.get(`${BASE_URL}/products/${productId}`, {
      ...params,
      tags: { name: 'product' },
    });
    check(product, { 'product 200': (r) => r.status === 200 });
    sleep(Math.random() * 3 + 2);

    if (Math.random() < 1 / 3) {
      const cart = http.post(
        `${BASE_URL}/cart/items`,
        JSON.stringify({ product_id: productId, quantity: 1 }),
        { headers: { ...params.headers, 'Content-Type': 'application/json' }, tags: { name: 'add_to_cart' } },
      );
      check(cart, { 'cart 201': (r) => r.status === 201 });
    }
  });

  sleep(1);
}
```

Run: `k6 run -e BASE_URL=https://perf.my-api.example.test -e TEST_TOKEN=... catalog.js`

#### 3. The choices explained

A <span class="term" data-term="virtual-user">virtual user</span> (VU) is a loop that replays the `default` function non-stop, like a visitor going from page to page: 300 VUs are 300 loops in parallel. The three `stages` give this curve:

``` { .text .ex-illus title="Illustration" }
VU
300 |        ______________________
    |       /                      \
    |      /                        \
  0 |_____/                          \_____
    0 min  5 min               25 min  28 min
     ramp-up      plateau        ramp-down
```

| Choice | Reason |
|---|---|
| 5-minute ramp-up | see at which load latency starts to climb, instead of an instant shock |
| 20-minute plateau | give caches, connection pools and queues time to settle |
| random `sleep` | a real user reads the page; without think time, 300 VUs send far more requests than 300 people |
| random product ID | avoid everything being served from the cache of a single product |
| `tags: { name }` | thresholds and results per request type |
| <span class="term" data-term="load-threshold">Thresholds</span> | `k6 run` exits with an error if a target is missed, CI can use it |

#### 4. Reading the result

- Look at the <span class="term" data-term="p95">p95</span> and p99 per request type, not the average.
- Compare the moment latency climbs with the server metrics: CPU, memory, database connections, SQL query time.
- Check that the <span class="term" data-term="load-generator">load generator</span> itself was not saturated (CPU of the machine running k6).

#### What a QA Engineer should add

- A <span class="term" data-term="smoke-test">smoke test</span> first (`--vus 2 --duration 1m`) to validate the script before launching 300 VUs.
- A <span class="term" data-term="stress-test">stress test</span> next, beyond 300, to know the headroom.
- A kept reference measurement, to compare the next version.

#### Possible oral answer

> "I would model the real journey: list, product page, and a third adding to the cart, with random think times and varied products so I do not only test the cache. I would use a progressive ramp-up, a twenty-minute plateau at 300 VUs, and thresholds on the p95 and the error rate, so the test fails clearly if the target is missed. I would first run a smoke test, and during the test I would watch the server metrics with a developer, to know why it is slow if it is."

**Read next**: [Performance testing](../../knowledge/qualite.md#performance-test), [k6, JMeter, Locust](../../knowledge/outils.md#k6-jmeter-locust), [p95 latency](../../knowledge/observabilite.md#p95-latency)

## Exercise 6. Choosing what to automate

### Statement

Here are eight test cases from a manual campaign. I have two weeks to automate. Which do I automate, at which level, and which do I keep manual?

1. Login with a valid email and password.
2. Shipping fee calculation for 30 country and weight combinations.
3. The new dashboard is "pleasant to read" (currently redone every sprint).
4. Card payment with 3-D Secure.
5. Yearly accounting export, run once a year in January.
6. A customer cannot see another customer's order.
7. The order confirmation email contains the right amount.
8. The site displays correctly on an old browser used by 0.2% of visitors.

### Worked answer

#### 1. The selection criteria

For each case: how many times will it run, which risk does it cover, is the feature stable, how much does automation cost, and what is the lowest level that covers it?

The level of a test is the part of the system it goes through. The same shipping fee check (case 2) at three levels, amount and route given as examples:

| Level | What the test does | Duration | What can break it |
|---|---|---|---|
| Unit | calls `shipping_fee(total_cents=4999, country="FR")` and expects 490 | a few milliseconds | the calculation rule |
| API | sends `POST /cart/quote` and reads `shipping_fee` in the JSON | about 100 ms | the rule, serialization, the route |
| E2E | opens the browser, adds an item, reads the amount shown in the cart | several seconds | everything, including a renamed selector |

The lower the level, the faster and more stable the test: that is the logic of the <span class="term" data-term="test-pyramid">test pyramid</span>.

#### 2. The decision

| Case | Decision | Level | Reason |
|---|---|---|---|
| 1. Login | automate | E2E (1 test) + API | vital journey, run at each release, stable; it is also a good smoke test |
| 2. Shipping fees | automate first | parametrized unit | 30 tedious cases by hand, precise rule, runs in one second |
| 3. "Pleasant" dashboard | manual | <span class="term" data-term="test-charter">exploratory charter</span> | human judgement, screen that changes every sprint |
| 4. 3-D Secure payment | automate | E2E with the sandbox or a fake service | high risk; the 3-D Secure window needs some setup, but the journey brings in money |
| 5. Yearly export | manual, with a written procedure | | one run a year, automating it costs more than it brings; revisit if the export becomes monthly |
| 6. Another customer's order | automate | API | serious security hole, short and very stable test |
| 7. Amount in the email | automate | API or integration (content of the generated email) | check the content, not the inbox; the real sending is tested by hand from time to time |
| 8. Old browser | do not test, risk accepted and written down | | 0.2% of visitors; to discuss again if the figure grows |

A charter for case 3, in Elisabeth Hendrickson's "Explore ... with ... to discover ..." format, "Explore It!" (2013):

``` { .text .ex-illus title="Illustration" }
Explore      : the dashboard, with an account of 500 orders then an empty account
With         : Chrome on a 1280 px screen, then a phone
To discover  : what makes the figures hard to read or misleading
Duration     : 60 minutes, notes and screenshots as I go, 10-minute debrief
```

#### 3. The order over the two weeks

1. Cases 2 and 6: quick to write, high risk, very stable.
2. Case 1: login, the base of the other E2E tests (reused session).
3. Case 7: email content.
4. Case 4: the longest to set up, to start in parallel.

#### What a QA Engineer should add

- Write the list of what is not automated and why: it is a decision, not an oversight.
- Propose that developers write case 2 themselves: it is a unit test of their code.
- Revisit the decision on case 3 when the dashboard settles.

#### Possible oral answer

> "I would sort by frequency, risk, stability and cost, and for each case pick the lowest level. Shipping fees and access to another customer's order come first: high risk, fast and stable tests, as unit and API tests. Login and payment become E2E tests, the email a content test. I would keep the dashboard manual, since it changes too much and needs judgement, and the yearly export too. I would not test the old browser, and I would write that choice down so it is owned."

**Read next**: [Choosing the right test level](../../knowledge/qualite.md#choosing-the-right-test-level), [Pyramid, trophy, honeycomb](../../knowledge/qualite.md#pyramid-trophy-honeycomb-the-shape-of-a-suite), [Session and charter (SBTM)](../../knowledge/conception-tests.md#session-and-charter-sbtm), [Testing vs checking](../../knowledge/conception-tests.md#testing-vs-checking), [Choosing what to automate](../../knowledge/qualite.md#choosing-what-to-automate)

## Exercise 7. Test strategy for a new feature in 30 minutes

### Statement

The team will build "the monthly subscription": a customer picks a coffee box delivered every month, paid automatically by card. They can pause, change box or cancel. The charge happens on the 1st of each month. I have 30 minutes to propose a test strategy.

### Worked answer

#### 1. Questions (5 minutes)

- What happens if the charge fails (expired card, insufficient funds)? How many retries?
- Does a box change on the 30th apply to the next month?
- Is a pause limited in time?
- Which payment provider, and does it have a sandbox?
- How many subscribers are expected at launch, and are they all charged at the same time on the 1st?

#### 2. The risks (10 minutes)

Priority 1 = to cover first, 3 = last. It combines likelihood and impact.

| Risk | Likelihood | Impact | Priority |
|---|---|---|---|
| Customer charged twice in the same month | medium | very high (money, trust) | 1 |
| Cancelled customer still charged | medium | very high | 1 |
| Failed charge not handled, box sent for free | medium | high | 2 |
| End-of-month box change applied wrongly | high | medium | 2 |
| Load on the 1st of the month (all charges at once) | medium | high | 2 |
| Wrong display of the next charge date | high | low | 3 |

#### 3. Tests per level (10 minutes)

| Level | What we test |
|---|---|
| Unit | calculation of the next charge date (end of month, February, clock change), pause rules, prorated price on a box change |
| <span class="term" data-term="state-machine">Subscription states</span> | active, paused, payment failed, cancelled: every valid transition, and the forbidden ones (resuming a cancelled subscription, charging while paused) |
| API | create, pause, change, cancel; authorization (a customer does not change another customer's subscription) |
| Integration with the provider | fake service for refusals, delays and duplicate answers; a nightly test with the real sandbox |
| 1st-of-the-month job | charging job run twice: no double charge (<span class="term" data-term="idempotency">idempotency</span>) |
| E2E | a single journey: subscribe and see the next charge date |
| Performance | charging job with 10 times the expected number of subscribers |
| <span class="term" data-term="exploratory-testing">Exploratory</span> | one session on end-of-month changes, one on payment error messages |

To test the 1st of the month without waiting for the calendar, the code must allow injecting the date: I ask the developers for it during refinement.

#### 4. Exit criteria and what is not tested (5 minutes)

<span class="term" data-term="exit-criteria">Exit criteria</span> are measurable conditions, set before testing, that say when the version can ship:

- Every priority 1 risk covered by a green automated test.
- The charging job run twice on a set of 1,000 test subscriptions: zero double charges.
- Not tested: marketing emails related to the subscription (out of scope, another team).
- After release: an alert when the number of charges per customer per month is above 1.

#### What a QA Engineer should add

- Show time management: questions, risks, tests, criteria. In an interview, announcing this split at the start reassures.
- Say what we do not do, and why.
- Propose <span class="term" data-term="shift-right">shift-right</span>: monitoring the first 1st of the month in production is the real final test.

#### Possible oral answer

> "I would start with five minutes of questions, mostly on charge failures and end-of-month changes. Then I would list the risks: double charging and charging after cancellation come first, because they touch money and trust. I would place each test at the right level: dates and rules as unit tests, the subscription life cycle as transition tests, a simulated provider for errors, the charging job replayed twice to check idempotency, a single E2E test. I would finish with exit criteria and a production alert on double charges."

**Read next**: [Risk-based testing](../../knowledge/conception-tests.md#risk-based-testing), [Exit criteria and the go/no-go decision](../../knowledge/conception-tests.md#exit-criteria-and-the-gono-go-decision), [State transitions](../../knowledge/conception-tests.md#state-transitions), [Idempotency](../../knowledge/architecture.md#idempotency), [Shift-left and shift-right](../../knowledge/qualite.md#shift-left-and-shift-right-when-to-test)

## Exercise 8. Checking data consistency with SQL

### Statement

After the double payment bug (exercise 2), I am asked to check production data in read-only mode. Simplified schema:

``` { .sql .ex-illus title="Illustration" }
-- Example: the two useful tables, simplified columns
orders   (id, customer_id, total_cents, status, created_at)
payments (id, order_id, amount_cents, status, created_at)
```

I write the queries that find:

1. orders with more than one successful payment;
2. paid orders whose total of successful payments does not match the order amount;
3. payments that point to an order that does not exist.

### Worked answer

#### 1. Orders with more than one successful payment

``` { .sql .ex-good title="Recommended" }
-- Good: group by order, then filter the groups with HAVING
SELECT p.order_id,
       COUNT(*)            AS successful_payments,
       SUM(p.amount_cents) AS total_paid_cents
FROM payments AS p
WHERE p.status = 'succeeded'
GROUP BY p.order_id
HAVING COUNT(*) > 1
ORDER BY successful_payments DESC;
```

`GROUP BY` groups the payments by order, `HAVING` filters after grouping (`COUNT(*) > 1` cannot go in the `WHERE`).

#### 2. Total paid different from the order amount

The classic mistake is to filter the payment status in the `WHERE`: "paid" orders with no successful payment disappear from the result, although they are the most serious ones.

``` { .sql .ex-bad title="Avoid" }
-- Avoid: the filter in the WHERE drops rows without a payment and cancels the LEFT JOIN
SELECT o.id, o.total_cents, SUM(p.amount_cents) AS paid_cents
FROM orders AS o
LEFT JOIN payments AS p ON p.order_id = o.id
WHERE o.status = 'paid'
  AND p.status = 'succeeded'
GROUP BY o.id, o.total_cents
HAVING SUM(p.amount_cents) <> o.total_cents;
```

``` { .sql .ex-good title="Recommended" }
-- Good: the status filter in the ON, and COALESCE to count a missing payment as 0
SELECT o.id,
       o.total_cents,
       COALESCE(SUM(p.amount_cents), 0) AS paid_cents
FROM orders AS o
LEFT JOIN payments AS p
       ON p.order_id = o.id
      AND p.status = 'succeeded'
WHERE o.status = 'paid'
GROUP BY o.id, o.total_cents
HAVING COALESCE(SUM(p.amount_cents), 0) <> o.total_cents;
```

- The `LEFT JOIN` also keeps "paid" orders with **no** successful payment: a plain <span class="term" data-term="sql-join">join</span> would make them disappear, although it is a serious inconsistency.
- The condition `p.status = 'succeeded'` is in the `ON`, not in the `WHERE`: in the `WHERE`, it would drop the rows without a payment and cancel the effect of the `LEFT JOIN`.
- `COALESCE` replaces a missing payment (`NULL`) with 0.

#### 3. Orphan payments

``` { .sql .ex-good title="Recommended" }
-- Good: LEFT JOIN then IS NULL to find what is missing on the other side
SELECT p.id, p.order_id, p.amount_cents, p.created_at
FROM payments AS p
LEFT JOIN orders AS o ON o.id = p.order_id
WHERE o.id IS NULL;
```

If the database has a <span class="term" data-term="foreign-key">foreign key</span> from `payments.order_id` to `orders.id`, this query must return zero rows. If it returns some, the constraint is missing, and that is a defect to report.

#### 4. Precautions in production

- Use a <span class="term" data-term="read-only-account">read-only account</span>, or a replica, never the application's account.
- Limit the period (`created_at >= ...`) and add `LIMIT` on the first tries, so as not to load the database.
- Check the execution plan (`EXPLAIN`) if the tables are large.
- Do not copy personal data into a ticket: order IDs, not names or emails.

#### What a QA Engineer should add

- Turn these queries into an automatic check: a nightly job that alerts if query 1 returns a row.
- Propose the structural fix: a <span class="term" data-term="unique-constraint">unique constraint</span> on successful payments per order, which prevents the problem instead of detecting it.
- Give support the list of orders to refund.

#### Possible oral answer

> "For double payments, I would group successful payments by order with a `HAVING COUNT(*) > 1`. For inconsistent amounts, I would use a `LEFT JOIN` with the status filter in the `ON`, to keep paid orders with no payment at all, which are the most serious case. For orphans, a `LEFT JOIN` with `IS NULL`. I would run all this with a read-only account, on a limited period, then propose a unique constraint and a nightly automatic check."

**Read next**: [SQL for QA](../../knowledge/sql.md#sql-for-qa), [HAVING: filtering after grouping](../../knowledge/sql.md#having-filtering-after-grouping), [Finding what is missing](../../knowledge/sql.md#finding-what-is-missing-left-join-is-null), [Joining tables](../../knowledge/sql.md#joining-tables), [Constraints: the database keeps the rules](../../knowledge/sql.md#constraints-the-database-keeps-the-rules)

## Exercise 9. Reviewing a test MR

### Statement

A colleague proposes this MR that adds tests for the function `apply_coupon(cart_total_cents, coupon)`. I must review it.

``` { .python .ex-bad title="Avoid" }
import time
import requests

from shop.coupons import apply_coupon

USER = "admin"
PASSWORD = "Admin123!"


# Avoid: hard-coded secret, network call, pause, vague assertions and a swallowed exception
def test_coupon():
    coupon = requests.get(
        "https://staging.shop.example.test/api/coupons/SUMMER",
        auth=(USER, PASSWORD),
    ).json()
    time.sleep(2)
    result = apply_coupon(10000, coupon)
    assert result
    result2 = apply_coupon(5000, coupon)
    assert result2 < 5000
    try:
        apply_coupon(-1, coupon)
    except Exception:
        pass
```

### Worked answer

#### 1. The problems, from most to least serious

| Problem | Why it is a problem | Fix |
|---|---|---|
| Hard-coded credentials (`admin`, `Admin123!`) | a <span class="term" data-term="secret">secret</span> in the Git repository, visible to everyone, and it stays in history | environment variables, and get this password changed |
| Real call to staging in a unit test | the test depends on the network and staging data, it will be slow and flaky | build the coupon in the test |
| `time.sleep(2)` | slows down for no reason, protects from nothing | remove it |
| `assert result` | passes for any non-null value, even a wrong one | check the exact expected value |
| `assert result2 < 5000` | passes even if the discount is wrong (4,999 or 1) | exact value |
| `try / except / pass` | the test passes whether the exception is raised or not | `pytest.raises` |
| A single test for everything | a failure does not say which rule broke | one test per behaviour, parametrized |
| Name `test_coupon` | does not say what is checked | name the behaviour |

#### 2. The proposed version

``` { .python .ex-good title="Recommended" }
import pytest

from shop.coupons import Coupon, apply_coupon

TEN_PERCENT = Coupon(code="SUMMER", percent_off=10, min_total_cents=2_000)


# Good: exact values, threshold tested at its boundary, one case per row
@pytest.mark.parametrize(
    ("total_cents", "expected_cents"),
    [
        pytest.param(10_000, 9_000, id="ten-percent-off"),
        pytest.param(2_000, 1_800, id="exact-minimum-threshold"),
        pytest.param(1_999, 1_999, id="below-threshold-no-discount"),
    ],
)
def test_apply_coupon_amount(total_cents, expected_cents):
    assert apply_coupon(total_cents, TEN_PERCENT) == expected_cents


# Good: pytest.raises fails if the exception is not raised
def test_apply_coupon_rejects_negative_total():
    with pytest.raises(ValueError):
        apply_coupon(-1, TEN_PERCENT)
```

The rules (10%, minimum of 20 euros) are assumed: the review must ask the colleague to confirm them, since the original tests do not state them.

#### 3. The tone of the review

An effective review comment explains the risk and proposes a concrete fix. For example, on the password line:

> "This password will stay in Git history even if it is removed later. Could it go through an environment variable? And since it was pushed, it should also be changed on staging."

And on `assert result`:

> "This test would also pass if the discount were 90% instead of 10%. I suggest checking the exact value, `9_000`, so the test fails the day the calculation changes."

#### What a QA Engineer should add

- Check that the new tests fail when the code is broken: change `10` to `20` in the calculation and rerun, which is the idea behind <span class="term" data-term="mutation-testing">mutation testing</span>.
- Sort the comments: blocking (secret, assertions that check nothing), suggestions (naming).
- Propose an automatic rule (secret detection in a <span class="term" data-term="pre-commit-hook">pre-commit hook</span> or in CI) so the next password is blocked before review.

#### Possible oral answer

> "The most serious issue is the hard-coded password: it must be removed, moved to an environment variable and changed, because it stays in history. Next, the assertions check almost nothing: `assert result` and `< 5000` would pass with a wrong calculation, and the `try / except / pass` makes the last case always green. I would propose unit tests without network calls, with a coupon built in the test, exact values, the boundary values of the threshold and `pytest.raises`. Finally I would check that the tests fail when I break the calculation."

**Read next**: [Code review](../../knowledge/qualite.md#code-review), [Prove each comment](../../knowledge/qualite.md#proving-every-comment), [Secrets](../../knowledge/securite.md#secrets), [Mutation testing](../../knowledge/qualite.md#mutation-testing-testing-the-tests), [DAMP over DRY in tests](../../knowledge/conception-tests.md#damp-over-dry-in-tests), [Preparing my MR and receiving a review](../../knowledge/qualite.md#preparing-my-mr-and-receiving-a-review)

## Exercise 10. Go/no-go decision

### Statement

It is 3 pm, the release of version 5.0 is planned for 6 pm. The situation:

- critical E2E suite: 47 tests out of 48 pass; the failure is on "download a PDF invoice", flaky for two weeks;
- two open bugs: a major one (sort by price is reversed in search, workaround: sort by relevance) and a minor one (typo in an email);
- the new "pay in three instalments" feature was tested on the sandbox, but not the failures of the second or third charge;
- rollback has not been tested since this version's database migration, which drops a column.

What to recommend?

### Worked answer

#### 1. Sorting the facts

| Item | Severity | What to find out |
|---|---|---|
| Red PDF invoice E2E | to qualify | flaky or real bug? Look at the trace of the last failure |
| Sort by price reversed | major, workaround exists | how many customers sort by price? |
| Typo in an email | minor | blocks nothing |
| Pay in three instalments, failures untested | high risk | money; what happens if the 2nd charge fails? |
| Untested <span class="term" data-term="rollback">rollback</span>, dropped column | **blocking** | if the version causes trouble, we cannot roll back without losing data |

#### 2. The blocking point

The migration drops a column. If version 5.0 must be withdrawn, the old 4.x version expects that column, which no longer exists: rollback breaks the application or loses data. It is the only point that makes the release dangerous whatever happens, because it removes the safety net.

Options to lift it:

- split the migration in two steps (<span class="term" data-term="expand-contract">expand / contract</span>): 5.0 no longer uses the column, but does not drop it; the drop ships in a later version;
- or test the rollback in pre-production before 6 pm, with a verified backup.

#### 3. The recommendation

The written opinion, with made-up bug numbers:

``` { .markdown .ex-illus title="Illustration" }
QA opinion, version 5.0, 3:30 pm

Recommendation: NO-GO at 6 pm, GO possible tomorrow if two conditions
are met.

Blocking
- Rollback impossible: the migration drops the column
  orders.legacy_ref, which 4.x still reads. Proposal: remove the
  column drop from 5.0 (two-step migration).

To handle before the GO
- Pay in three instalments: ship behind the `split-payment` flag,
  turned off, until the failures of the 2nd and 3rd charge are
  tested (planned Thursday).

Accepted, to write in the release notes and tell support
- BUG-412 sort by price reversed (major, workaround: sort by
  relevance), fix in 5.0.1.
- BUG-415 typo in the email (minor).

To qualify tonight
- PDF invoice E2E: trace of the last failure under analysis. If
  it is a real bug, it becomes blocking.

Decision: PO and tech lead, at 4 pm.
```

The `split-payment` flag is only turned on once its exit criteria are ticked (percentages and durations given as examples):

``` { .markdown .ex-illus title="Illustration" }
- [ ] 2nd charge fails: the customer gets an email, the order
      moves to "to settle", no box is sent for free.
- [ ] 3rd charge fails: same behaviour, tested separately.
- [ ] Flag turned off in pre-production: one-off payment stays
      available and payments in progress are not lost.
- [ ] Turned on for 5% of customers, charge failure rate
      watched for 48 hours before widening.
```

#### What a QA Engineer should add

- Clearly separate facts, risks and recommendation.
- Propose a way out (<span class="term" data-term="feature-flag">flag</span>, two-step migration) rather than a plain refusal.
- Remind that the decision belongs to the PO and the tech lead, and that it must be written down.
- Afterwards, add "rollback tested" to the exit criteria of every version with a migration.

#### Possible oral answer

> "I would sort the facts first. The real problem is neither the sort bug nor the red E2E, it is rollback: the migration drops a column, so if 5.0 breaks, we cannot go back to 4.x. I would recommend a no-go at 6 pm, and a go as soon as the column drop is out of this version. I would ship pay in three instalments behind a flag turned off until its failures are tested, accept the sort bug with its workaround, and qualify the red E2E tonight. The decision belongs to the PO, but I would make sure it is taken knowingly and written down."

**Read next**: [Exit criteria and the go/no-go decision](../../knowledge/conception-tests.md#exit-criteria-and-the-gono-go-decision), [Migrating a schema without downtime](../../knowledge/sql.md#zero-downtime-schema-migrations), [Progressive deployment](../../knowledge/livraison.md#progressive-deployment), [Feature flags: Unleash](../../knowledge/outils.md#feature-flags-unleash)

## Preparation grid for a live exercise

Before wrapping up an answer, I check that I covered:

- [ ] **Questions**: did I clarify the rule, the users and the context before testing?
- [ ] **Risks**: did I start with what would cost the most if it broke?
- [ ] **Techniques**: did I name and apply a technique (partitions, boundary values, decision table, states, <span class="term" data-term="pairwise-testing">pairs</span>)?
- [ ] **Level**: did I put each test at the lowest level that covers it?
- [ ] **Negative**: did I test errors, authorization and invalid inputs, not just the happy path?
- [ ] **Stability**: are my tests independent, with no fixed wait, with their own data?
- [ ] **Communication**: did I say what I do not test, and how I report the result?
- [ ] **After release**: did I think about monitoring and rollback?

### If I get stuck during the interview

I can say out loud:

> "I will start with the questions I would ask the PO, then list the risks, and pick a test design technique for each. I start with the happy path, then the errors."

That is better than a rushed answer. For a QA Engineer, the visible method (questions, risks, named techniques, priorities) counts as much as the final list of test cases.

### Revision priority if I am short on time

1. Design techniques: partitions, boundary values, decision tables, state transitions (exercise 1).
2. Bug report and severity (exercise 2).
3. Flaky tests and waits in Playwright (exercise 3).
4. API tests with pytest, fixtures and parametrization (exercise 4).
5. Risk-based test strategy (exercise 7).
6. Go/no-go and rollback (exercise 10).
7. Test review (exercise 9).
8. Automation choices (exercise 6).
9. Consistency SQL and k6 load test (exercises 8 and 5).

The goal is not to recite these answers word for word. I use them as structures, then link them to my real experience: the bugs I found, the suites I stabilized, the release decisions I took part in.

## Measuring success

I know my practice works when I solve a new exercise out loud, on time, naming my techniques. Before starting, I write down a baseline: I do three exercises of this page without looking at the answer, timed, and count the points of the preparation grid I covered. I take the same measure a week later on three other exercises. The guard metric is correctness: going faster does not count if I forget the negative cases or rollback.

| Solution | Success indicator (<span class="term" data-term="sli">SLI</span>) | Likely <span class="term" data-term="slo">SLO</span> | Likely <span class="term" data-term="sla">SLA</span> |
|---|---|---|---|
| doing the exercises timed without the answer | share of exercises finished in the announced time (30 minutes for exercise 7) | 7 out of 10 [Take with caution: example value, to adjust to my starting level] | n/a: no external contract |
| following the preparation grid | number of grid points covered per exercise | 7 out of 8 [Take with caution: example value] | n/a: no external contract |
| asking questions before answering | share of exercises where I ask at least two questions before the first test case | 100% of exercises | n/a: no external contract |
| writing code that runs | share of code snippets written from memory that pass on the first local run | 8 out of 10 [Take with caution: example value] | n/a: no external contract |
| linking to a lived story | share of exercises ended with a real example or one presented as hypothetical | 100% of exercises | n/a: no external contract |

## Pitfalls to avoid

| Pitfall | What happens | Solution |
| --- | --- | --- |
| **Rushing to the cases**: I list values as soon as I read the statement. | I test a misunderstood rule, like an end date I believe excluded. | I first ask two or three questions ([Exercise 1](#exercise-1-designing-the-tests-of-a-booking-period-field)). |
| **Forgetting the negative**: I only test the happy path. | The interviewer concludes I do not think like a QA. | I cover errors, authorization and invalid inputs ([Exercise 4](#exercise-4-writing-api-tests-with-pytest)). |
| **Fixing with a pause**: I lengthen `waitForTimeout` to make a flaky test pass. | The test stays flaky, gets slower, and can hide a real bug. | I use retrying assertions and test-owned data ([Exercise 3](#exercise-3-fixing-a-flaky-playwright-test)). |
| **Stopping at the button**: I conclude that disabling the button solves the double payment. | A second direct API call still charges twice. | I isolate the server side with two identical requests ([Exercise 2](#exercise-2-writing-a-bug-report-from-a-complaint)). |
| **Filtering in the WHERE**: I put the payment status in the `WHERE` of a `LEFT JOIN`. | Paid orders with no payment, the most serious ones, disappear. | I put the filter in the `ON` ([Exercise 8](#exercise-8-checking-data-consistency-with-sql)). |
| **Saying no without a way out**: I recommend a no-go without proposing a path. | The team sees me as a brake, and the decision is made without me. | I propose a flag or a two-step migration ([Exercise 10](#exercise-10-gono-go-decision)). |
| **Measuring the average**: I judge a load test on the mean time. | Slow users are invisible in the result. | I set thresholds on the p95 and the error rate ([Exercise 5](#exercise-5-writing-a-load-test-with-k6)). |
