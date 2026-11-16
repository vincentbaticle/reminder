# Developer Experience and platform

!!! warning "Disclaimer"
    These notes are personal cheat sheets, not a source of truth. They reflect my own understanding and choices: their content remains subjective, despite the quotes and references it contains. It may be incomplete, simplified, inaccurate or outdated. Always check the official documentation before applying it. This content is provided as is, without any warranty: you use it at your own risk.

!!! audience "Who and what for"
    - **Roles**: back-end developer, QA engineer, platform engineer, SRE, tech lead, engineering manager.
    - **Uses**: I prepare a platform or DevX engineer interview; I bring a CI down from 30 to 10 minutes; I design a golden path to create a service in a few minutes; I run a migration across 50 repositories; I shorten a newcomer's onboarding.

!!! abstract "Scales"
    The colored badges under the headings say at which scale a notion applies:

    - <span class="pill pill-scope pill-scope-code">Code</span> the classes, functions and modules of one program;
    - <span class="pill pill-scope pill-scope-app">Application</span> one service or application and its internal split;
    - <span class="pill pill-scope pill-scope-system">System</span> several services talking to each other over the network;
    - <span class="pill pill-scope pill-scope-infra">Infrastructure</span> servers, network, zones and clusters, physical or virtual;
    - <span class="pill pill-scope pill-scope-enterprise">Enterprise</span> the whole information system and its organization.

    Details and ambiguous words: [map of scales](architecture.md#map-of-scales).

<span class="term" data-term="developer-experience">Developer Experience</span> (DevX) is what developers live through while they work: the time they spend waiting, the obstacles they hit, how hard it is to find a piece of information. When it takes two days to run a project locally, or twenty minutes to know whether a test passes, the team delivers less and gets more tired. This page gathers the notions and tools that make that daily work smoother: setting up a project, shortening the wait between a change and its result, providing an internal platform, golden paths, reliable documentation, and running migrations across hundreds of repositories. The `orders-service` and `my-api` services, the `team-core` team and the people `ada` and `grace` are fictitious. Numbers are examples.

What already lives elsewhere is not repeated here: DORA metrics, SPACE and the DevEx framework are in [Delivery and engineering practices](livraison.md#measuring-developer-experience-space-and-devex), the <span class="term" data-term="mise">mise</span>, <span class="term" data-term="uv">uv</span>, Renovate and Backstage tools in the [Technical tools overview](outils.md#developer-tooling-mise-uv-ruff-yarn).

*Renovate: competes with Dependabot; complements Snyk, Trivy*<br>
*uv: competes with pip, Poetry, pdm; complements mise*
{ .tool-rel }


:material-swap-horizontal: The tools mentioned on this page: which ones replace each other, which ones combine? See [Complementary or competing](outils.md#complementary-or-competing).
{ .doc-ref }

## Terminology

**<span class="term" data-term="developer-experience">Developer experience</span> (DX or DevX)**: the way developers live their work every day, from the idea to the code in production: installing a project, understanding the code, running the tests, waiting for CI, deploying, finding the documentation.

**<span class="term" data-term="process-friction">Friction</span>**: anything that slows down or discourages a developer without adding value. Example: an 18-step README where three steps are wrong.

**<span class="term" data-term="cognitive-load">Cognitive load</span>**: the amount of things a person must keep in mind to do a task. The notion comes from the psychology of learning (John Sweller, 1988); the book "Team Topologies" (Matthew Skelton and Manuel Pais, 2019) applies it to teams. Example: having to know [Kubernetes](kubernetes.md), Terraform and three cloud consoles to deploy a simple fix.

**<span class="term" data-term="flow-state">Flow state</span>** (deep focus): the deep concentration where work moves forward without apparent effort, described by Mihaly Csikszentmihalyi, "Flow" (1990). Every wait longer than a few seconds and every interruption can break it.

**<span class="term" data-term="inner-loop">Inner loop</span>**: a developer's local cycle, edit, run, see the result, repeated dozens of times an hour. **<span class="term" data-term="outer-loop">Outer loop</span>**: what happens after the push: CI, review, merge, deployment.

**<span class="term" data-term="internal-developer-platform">Internal platform</span> (IDP)**: the set of internal tools and services that let a team create, test, deploy and run a service without depending on another team. Watch out, the acronym IDP sometimes also means *Internal Developer Portal*, the website that gives access to this platform: the portal is only one interface of the platform.

**<span class="term" data-term="golden-path">Golden path</span>** (or *paved road*): the recommended, tooled way to do a common task, easier than the alternatives without being mandatory.

**<span class="term" data-term="self-service">Self-service</span>**: a team gets a resource (a database, a bucket, an environment) without opening a ticket or waiting for someone.

**<span class="term" data-term="toil">Toil</span>**: manual, repetitive, automatable work with no lasting value, which grows with the size of the system. The definition comes from the book "Site Reliability Engineering" (Google, 2016), chapter "Eliminating Toil". Example: creating by hand, on a ticket request, every new repository with its CI.

**<span class="term" data-term="sli">SLI</span>** (*Service Level Indicator*): the number I actually measure. Example: the p95 CI duration on `orders-service`, read every week in the CI/CD analytics.

**<span class="term" data-term="slo">SLO</span>** (*Service Level Objective*): the internal target the team sets on an SLI. Example: "p95 CI under 15 minutes, four weeks out of five".

**<span class="term" data-term="sla">SLA</span>** (*Service Level Agreement*): the contractual promise made to a customer, with a penalty when it is not kept, usually looser than the SLO to keep a margin. Example: a remote environment vendor that refunds part of the subscription below 99.5% monthly availability.

| Word | Question it asks | Example measure |
|---|---|---|
| friction | what wastes time? | 2 days between the clone and the first green test |
| cognitive load | how many things must I know? | 14 steps in the deployment guide |
| flow state | how long without interruption? | 2-hour blocks without meetings per week |
| inner loop | how many seconds to see the result? | 45 s to rerun a test |
| toil | what repeated work could disappear? | 40 "create a repository" tickets per quarter |

:material-book-open-variant: Reference docs: [Google, "Site Reliability Engineering", chapter "Eliminating Toil"](https://sre.google/sre-book/eliminating-toil/) (2016)
{ .doc-ref }

## Inner loop and outer loop

<a class="pill pill-scope pill-scope-code" href="../architecture/#map-of-scales">Scale · Code</a> <span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

The two loops have neither the same frequency nor the same acceptable duration, and I do not speed them up with the same tools. An example day for `ada` on `orders-service`:

``` { .text .ex-illus title="Illustration" }
inner loop (on the laptop, dozens of times an hour)
  10:00:00  ada edits calculate_total()
  10:00:01  the server reloads the code by itself
  10:00:03  pytest reruns only the failing test: green
  10:00:40  ada edits the "100% discount" case, the test passes again in 2 s

outer loop (after the push, a few times a day)
  10:42     push and MR opened
  10:43     CI: lint, tests, image, finished at 10:55
  11:30     first review by grace
  14:10     merge, automatic deployment
  14:25     in production
```

```mermaid
flowchart LR
    subgraph IN["Inner loop: workstation, under 10 s"]
        direction LR
        C["Edit"] --> R["Run, reload"] --> V["See the result"] --> C
    end
    subgraph OUT["Outer loop: after the push, minutes to hours"]
        direction LR
        P["Push, MR"] --> CI["CI"] --> RV["Review"] --> MG["Merge"] --> D["Deployment"]
    end
    V -- "ready" --> P
    D -- "feedback from production" --> C
```

| Loop | Frequency | Target order of magnitude | What often slows it down |
|---|---|---|---|
| inner | dozens of times an hour | under 10 s per round | rebuilding an image, rerunning the whole suite, restarting services |
| outer | a few times a day | a CI of about 10 min, a review within half a day | sequential CI, flaky tests, waiting for review, manual approval |

The orders of magnitude rely on two sources: Jakob Nielsen's response time limits, "Response Times: The 3 Important Limits" (1993), where 1 s keeps the train of thought and 10 s loses attention, and Martin Fowler's "Continuous Integration" article (2000, revised in 2024), which aims for a build of about ten minutes. They are landmarks, not standards.

A second saved in the inner loop counts much more than it seems: 2 minutes of waiting per round, at 30 rounds a day, make one hour a day per person (example), and above all as many breaks in focus. In the outer loop, it is often the **waiting** (review, approval, runner queue) that weighs more than the computing: a <span class="term" data-term="value-stream-mapping">value stream map</span> shows it.

!!! noob "As noob"
    The inner loop is tasting the sauce while cooking: I do it every two minutes, so it has to be instant. The outer loop is having the head chef approve the dish before it goes out: rarer, longer, and mostly the wait for the chef is what costs. The takeaway: **in the inner loop I hunt seconds, in the outer loop I hunt waiting.**

:material-book-open-variant: Reference docs: [Jakob Nielsen, "Response Times: The 3 Important Limits"](https://www.nngroup.com/articles/response-times-3-important-limits/) (1993); [Martin Fowler, "Continuous Integration"](https://martinfowler.com/articles/continuousIntegration.html) (2000, revised in 2024)
{ .doc-ref }

!!! maturity "Measuring maturity"
    | Level | What I see in the team |
    |---|---|
    | N1 | someone once timed an inner loop round and the CI duration, with no follow-up |
    | N2 | automatic reload and rerunning only the affected tests work on every machine; the CI duration is shown on every merge request |
    | N3 | a CI run over its target duration or a flaky test triggers an alert or a quarantine without anyone asking |
    | N4 | the team tracks every month the inner loop round time, the CI duration and the review wait, and picks its work from these numbers |

    **I measure**: the median and p90 of the CI duration (read in the CI tool) and the delay between opening a merge request and its first review (read in the merge request tool).

## Setting up a project in one command

<a class="pill pill-scope pill-scope-app" href="../architecture/#map-of-scales">Scale · Application</a> <span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

I join a team, clone `orders-service`, and it takes two days and the help of three people to run the first test. <span class="term" data-term="project-setup">Project setup</span> is everything I must do between `git clone` and the first test passing locally. The goal: a newcomer does it alone, without asking for help, with a few commands that are the same from one repository to the next.

Three rules:

- **everything is in the repository**: tool versions in a file read by a <span class="term" data-term="tool-version-manager">version manager</span> (mise, asdf), dependencies in a <span class="term" data-term="lockfile">lockfile</span>, local services in a Docker Compose file;
- **the same command names everywhere**: `setup`, `test`, `dev`, `doctor`. This is the idea behind "Scripts to Rule Them All" (GitHub, 2015);
- **the setup is tested**: a weekly CI job replays it on a blank image, otherwise it degrades without anyone noticing.

*mise: competes with asdf; complements uv*<br>
*asdf: competes with mise*
{ .tool-rel }


A newcomer's path becomes:

``` { .bash .ex-good title="Recommended" }
git clone git@git.example.com:team-core/orders-service.git
cd orders-service
mise install
mise run setup
mise run test
```

The matching `mise.toml` file is shown in the [Technical tools overview](outils.md#developer-tooling-mise-uv-ruff-yarn). The `doctor` command checks that the laptop is ready and says how to fix what is missing, instead of an obscure error message three steps later.

Avoid the setup script that assumes everything is already installed and running: with Docker stopped, the newcomer reads `Cannot connect to the Docker daemon` in the middle of forty lines of output, then `uv: command not found`, with no idea where to start.

``` { .bash .ex-bad title="Avoid" }
# Avoid: no check at all, the first failing command gives a raw error
docker compose up -d db
uv sync
uv run pytest
```

The version with `doctor`, which says what to fix:

``` { .python .ex-good title="Recommended" }
"""Check that the laptop can run orders-service and explain how to fix it."""

import shutil
import subprocess
import sys

# Good: each required tool comes with its fix, not an obscure error
REQUIRED_COMMANDS = {
    "docker": "install Docker, then restart the terminal",
    "uv": "run 'mise install' at the root of the repository",
}


def docker_is_running() -> bool:
    """Tell whether the Docker daemon answers."""
    result = subprocess.run(["docker", "info"], capture_output=True, check=False)
    return result.returncode == 0


# Good: returns each problem with the way to fix it
def find_problems() -> list[str]:
    """Return the list of problems found, each with its fix."""
    problems = [
        f"command '{name}' not found: {fix}"
        for name, fix in REQUIRED_COMMANDS.items()
        if shutil.which(name) is None
    ]
    if shutil.which("docker") and not docker_is_running():
        problems.append("Docker is installed but stopped: start Docker")
    return problems


def main() -> int:
    """Print the diagnosis and return 1 if the laptop is not ready."""
    problems = find_problems()
    for problem in problems:
        print(f"KO  {problem}")
    if not problems:
        print("OK  the laptop is ready, run: mise run test")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
```

**Risks.** A `setup` script that does everything silently hides what it installs: the day it breaks, nobody knows how to fix it; I make it print each step and keep the commands readable in the task file. The CI job that replays the setup costs runner minutes and can fail on a mere network outage; I run it once a week, not on every MR, and I read the failure before opening a ticket. Without a tooled setup, every newcomer loses days and interrupts three colleagues.

| I want... | I use... |
|---|---|
| my project needs a precise version of Python, Node or Terraform, and the whole team must have the same one, without reinstalling by hand when switching projects | mise or asdf (see the [Technical tools overview](outils.md#developer-tooling-mise-uv-ruff-yarn)) |
| I move from one repository to another and want to type the same commands everywhere, like `setup` to install and `test` to run the tests, without rereading each README | mise tasks, a `Makefile`, or `script/setup`, `script/test` scripts |
| my service needs a PostgreSQL database and other services to run locally, and I want to start everything with a single command | Docker Compose |
| my project needs system tools or native libraries on top of the language, like a database client or an image processing library, and I want to describe everything in one place | a Dev Container (see below) |
| a newcomer sees the setup fail on an obscure message and does not know what to fix, for example because Docker is installed but stopped | a `doctor` script that says what to fix |
| nobody has run the setup from scratch in months, and I want to know it is broken before the next newcomer runs into it | a CI job that replays it on a blank image |

:material-book-open-variant: Reference docs: [GitHub, "Scripts to Rule Them All"](https://github.com/github/scripts-to-rule-them-all) (2015); [mise, documentation](https://mise.jdx.dev/) (accessed November 2026)
{ .doc-ref }

### Docker Compose and code mounted through a volume

<span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>


*Docker: complements Kubernetes, Helm*
{ .tool-rel }

Docker Compose describes, in a `compose.yaml` file, the <span class="term" data-term="docker">Docker</span> containers the project needs locally, and starts them together with `docker compose up`. A <span class="term" data-term="docker-volume">volume</span> links a folder on the workstation to a folder in the container: here the repository code, so a save in the editor is seen right away by the server, without rebuilding the image.

Avoid running the service from an image holding a copy of the code made at build time: every change needs `docker compose up --build`, about two minutes per try (example), and forgetting `--build` means testing the old code.

``` { .yaml .ex-bad title="Avoid" }
# Avoid: code copied into the image, no volume and no reload
services:
  my-api:
    build: .
    command: uvicorn app.main:app --host 0.0.0.0
    ports: ["8000:8000"]
```

The version with a volume and reload:

``` { .yaml .ex-good title="Recommended" }
# Example: my-api and its Postgres database, started together locally
services:
  # Good: code mounted as a volume and --reload, a save is seen right away
  my-api:
    build: .
    command: uvicorn app.main:app --host 0.0.0.0 --reload
    ports: ["8000:8000"]
    volumes:
      - .:/app
    environment:
      DATABASE_URL: postgresql://app:app@db:5432/app
    depends_on: [db]
  # Example: throwaway Postgres for the dev machine
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: app
```

```mermaid
flowchart LR
    subgraph POSTE["ada's workstation"]
        ED["Editor"] --> SRC["Repository folder"]
    end
    subgraph COMPOSE["docker compose up"]
        API["my-api<br/>/app, --reload"]
        DB[("db<br/>postgres:16")]
    end
    SRC -- "volume .:/app" --> API
    API -- "db:5432" --> DB
    U["Browser, tests"] -- "localhost:8000" --> API
```

`- .:/app` mounts the repository root into `/app`; `--reload` restarts the server on every change; `my-api` reaches the database by its service name, `db`. The password is for the local workstation only. Pitfall: the volume hides what the image had installed in `/app` (a `.venv`, `node_modules`); install dependencies outside that folder, or protect them with a dedicated volume.

:material-book-open-variant: Reference docs: [Docker, Compose](https://docs.docker.com/compose/) (accessed November 2026); [Docker, Bind mounts](https://docs.docker.com/engine/storage/bind-mounts/) (accessed November 2026)
{ .doc-ref }

!!! maturity "Measuring maturity"
    | Level | What I see in the team |
    |---|---|
    | N1 | an up-to-date README describes the setup, and one person in the team can walk through it from memory to help each newcomer |
    | N2 | every repository answers the same `setup`, `test`, `doctor` commands, with tool versions in `mise.toml` and local services in a `compose.yaml` |
    | N3 | a weekly CI job replays the setup on a blank image and turns red, with a ticket opened, as soon as a step breaks |
    | N4 | the team records at each arrival the time between `git clone` and the first green test, and picks its setup work from that number |

    **I measure**: the share of repositories that answer the `setup`, `test` and `doctor` commands, read through a code search across all repositories; the time to first green test, timed by each newcomer.

## Speeding up the inner loop

<a class="pill pill-scope pill-scope-code" href="../architecture/#map-of-scales">Scale · Code</a> <span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

I change one line and wait a minute to find out whether it works: after thirty tries, I have lost half an hour and my focus. Three principles shorten that wait: **run only what is touched**, **keep what is already ready**, **leave slow checks to CI**. The levers:

- <span class="term" data-term="hot-reload">hot reload</span>: the application picks up the change without restarting;
- **targeted tests**: rerun one test, the failing tests, or those linked to the changed file. When a tool picks these tests automatically from the code dependencies, it is called <span class="term" data-term="test-impact-analysis">test impact analysis</span>;
- **watch mode**: the tool reruns the relevant tests by itself on every save;
- the <span class="term" data-term="build-cache">build cache</span>: reuse a compilation or test result when its inputs have not changed;
- the <span class="term" data-term="incremental-build">incremental build</span>: recompile only the changed files and those that depend on them.

!!! noob "As noob"
    The build cache is coffee already brewed and kept warm: as long as nobody changed the beans or the water, I pour another cup without restarting the machine. The incremental build is remaking only the cup whose beans I changed. Limit: if the cache is wrong about what changed, it serves a stale result, hence the importance of the key that describes its inputs. The takeaway: **only redo what has changed inputs.**

``` { .bash .ex-ref title="Reference" }
uvicorn my_api.main:app --reload
pytest -x --lf
pytest tests/test_orders.py::test_total_with_discount
npx vitest related src/cart.ts --run
npx tsc --noEmit --incremental
```

In order: the server reloads on every save; pytest reruns first the tests that failed last time and stops at the first failure; a single test; Vitest runs the tests that import `cart.ts`; TypeScript only rechecks what changed since last time. Options to check in the documentation of the version I use.

*pytest: competes with unittest; complements Testcontainers*
{ .tool-rel }


The "before" and "after" columns are measured by timing the loop itself, on the workstation: `time pytest -x --lf` for one try, or hyperfine for an average over several tries (`hyperfine 'pytest tests/test_orders.py'`). Measure the most frequent action of the day first, not the slowest one.

| Action on my-api | Before | After | Lever |
|---|---|---|---|
| edit an endpoint and see the result | 2 min (rebuild the image, restart) | 1 s | code mounted in the container, `--reload` |
| rerun the failing test | 45 s (the whole suite) | 2 s | `pytest --lf` |
| check types after a change | 20 s | 3 s | incremental build |

Example numbers. The Docker image serves CI and production; locally, the code can be mounted into the container through a volume, without rebuilding the image on every try (sample `compose.yaml` in [Docker Compose and code mounted through a volume](#docker-compose-and-code-mounted-through-a-volume)).

**Risks.** A cache whose key forgets an input (an environment variable, a tool version) serves a stale result, and I believe broken code is green; I put every input in the key and clear the cache at the slightest doubt. Running only targeted tests lets a regression in another module slip through; CI reruns the whole suite before the merge. Hot reload sometimes keeps state in memory (a connection, a singleton object): when a behaviour looks absurd, I restart the server before digging further.

| I want... | I use... |
|---|---|
| I change an endpoint of `my-api` and want to see the result within a second, without restarting the server | the framework's hot reload |
| a single test failed in the whole suite, and I want to rerun only that one while I fix it | `pytest --lf`, `jest --onlyFailures` |
| I change `cart.ts` and want only the tests that depend on it to rerun on every save | a watch mode, `vitest related`, a test selection plugin |
| a small change recompiles the whole project, and I wait every time | the compiler's incremental build, a build cache |
| my end-to-end tests take several minutes and block my laptop, but I do not want to drop them | leave them to CI |

:material-book-open-variant: Reference docs: [pytest, "How to re-run failed tests and maintain state between test runs"](https://docs.pytest.org/en/stable/how-to/cache.html) (stable version, accessed November 2026); [Vitest, Command Line Interface](https://vitest.dev/guide/cli) (accessed November 2026); [hyperfine](https://github.com/sharkdp/hyperfine) (accessed November 2026)
{ .doc-ref }

!!! maturity "Measuring maturity"
    | Level | What I see in the team |
    |---|---|
    | N1 | a few developers know `pytest --lf` or hot reload and use them each on their own |
    | N2 | reload, targeted tests and incremental build are configured in the repository (`compose.yaml`, mise tasks), so everyone gets them without setting anything |
    | N3 | watch mode reruns the relevant tests by itself on every save, and the cache invalidates itself when its inputs change |
    | N4 | the team times its most frequent actions (hyperfine, `time`) and reworks those above its target, for example 10 s per loop |

    **I measure**: the duration of one "edit, see the result" loop on the most frequent action, timed with hyperfine before and after each tooling change; the share of repositories with a `dev` command that reloads, read in their task files.

## Local or remote environment

<a class="pill pill-scope pill-scope-infra" href="../architecture/#map-of-scales">Scale · Infrastructure</a> <span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

!!! info "Section written in November 2026"
    Remote environment services and their features change fast. The names given are examples, to check at the time of reading.

A <span class="term" data-term="devcontainer">Dev Container</span> is a complete development environment (image, tools, editor extensions, install commands) described by a `devcontainer.json` file in the repository, and run in a container. The *Development Containers Specification* (containers.dev, started by Microsoft, published as an open specification in 2022) lets several editors and services read the same file.

!!! noob "As noob"
    A Dev Container is a kitchen trunk delivered with its instructions: utensils, spices and setup steps are inside, and everyone opens it the same way, on their laptop or on a remote machine. No more "works on my machine" because of a different tool version. The takeaway: **the development setup is described in the repository, like the code.**

A <span class="term" data-term="remote-dev-environment">remote development environment</span> runs this workstation on a server or in the cloud; I connect to it from a local editor or a browser. Examples of this kind of tool: GitHub Codespaces, Coder, Gitpod (to check, the offer changes).

``` { .json .ex-ref title="Reference" }
{
  "name": "orders-service",
  "image": "mcr.microsoft.com/devcontainers/python:3.12",
  "features": {
    "ghcr.io/devcontainers/features/docker-in-docker:2": {}
  },
  "postCreateCommand": "pip install uv && uv sync --frozen",
  "forwardPorts": [8000]
}
```

The same file works locally (the editor starts the container on the laptop) and remotely (the service starts the container on its machines). Image and identifiers given as examples, to check.

| Criterion | Local with a version manager | Local Dev Container | Remote environment |
|---|---|---|---|
| setup | a few minutes | a few minutes, after the first image download | under a minute if the image is prebuilt |
| offline work | yes | yes | no |
| computing power | the laptop's | the laptop's | the server's, adjustable |
| sensitive data | copied to the laptop | copied to the laptop | stays in the company cloud |
| cost | nothing extra | nothing extra | billed per hour of use |
| maintenance | low | an image to keep up to date | an image and a service to run or pay for |

The rule: take the lightest option that solves the problem. <span class="term" data-term="dev-prod-parity">Dev/prod parity</span> is sought where the gaps have already caused bugs (same database engine, same language version), not by copying all of production to the laptop.

**Risks.** A remote environment that is down, or a dropped connection, stops the whole team at once; I keep a local setup that works with the same `devcontainer.json`. A Dev Container image nobody updates ends up with old versions and known vulnerabilities; I rebuild it in CI and let Renovate propose its version bumps. Chasing full parity with production weighs the workstation down without preventing bugs; I only copy what has already caused a gap.

| I want... | I use... |
|---|---|
| my project only needs the right version of Python or Node, nothing else | mise or asdf |
| my project depends on several system tools and native libraries that are painful to install on every laptop | a local Dev Container |
| the data must not leave the company cloud, or the team's laptops are too weak for the project | a remote environment based on the same Dev Container |
| I want an environment reproduced exactly the same on every laptop, and my team already knows the tool that does it | <span class="term" data-term="nix">Nix</span> |

:material-book-open-variant: Reference docs: [Development Containers Specification](https://containers.dev/) (2022); [Visual Studio Code, "Developing inside a Container"](https://code.visualstudio.com/docs/devcontainers/containers) (accessed November 2026)
{ .doc-ref }

### Preview environment per merge request

<a class="pill pill-scope pill-scope-infra" href="../architecture/#map-of-scales">Scale · Infrastructure</a> <span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

My product owner wants to click through the new order screen before the merge, but has to wait for the deployment to <span class="term" data-term="staging-env">staging</span>, shared by six teams and often broken. A <span class="term" data-term="preview-environment">preview environment</span> (*review app* in GitLab, *preview deployment* in Vercel or Netlify) is a temporary deployment of an MR's branch, with its own address such as `https://mr-42.preview.example.com`. The CI creates it when the MR opens and destroys it on merge, or after a few days without activity.

!!! noob "As noob"
    It is a property developer's show flat: one is set up for each proposed plan, the buyer visits it before signing, then it is taken down. Limit of the picture: it is furnished with fake furniture (fictitious data) and plugged into the shared building's utilities (the integration environment), not into a full installation of its own. The takeaway: **each MR is shown in its own throwaway environment, before the merge.**

**When**: people who do not read the code (product owner, designer, tester) must validate before the merge, or the shared staging has become a bottleneck. Not for a back-end service with no screen, already validated by its contract and integration tests: nobody would visit the environment. **Why**: feedback arrives before the merge, staging gets decongested, and every MR becomes testable by hand. The cost: cluster resources, a dataset, test secrets and a pipeline to maintain. **How**: the deployment is the easy part, four decisions make the project succeed or fail.

| Decision | My default choice | Why |
|---|---|---|
| scope | only the service people want to see (the front end), wired to the APIs of the <span class="term" data-term="integration-env">integration environment</span> | duplicating the whole system per MR is expensive and breaks often |
| seed data | a fictitious dataset versioned in the repository, loaded by a job right after the deployment | never a copy of production, which holds personal data |
| time to live | destroyed when the MR closes, and after 5 days without a commit | a forgotten environment costs money and serves nobody |
| cost cap | 1 replica, small requests, a quota per namespace, a maximum number of open environments | the bill does not grow with the number of MRs |
| secrets | test credentials reserved for `preview/*` environments, protected and masked variables | a leak from an MR exposes nothing real |

Avoid: a deployment with neither `auto_stop_in` nor `on_stop`. Each MR leaves a namespace behind, nobody deletes it, and three months later the cluster hosts 200 environments nobody looks at any more.

``` { .yaml .ex-bad title="Avoid" }
# Avoid: nothing destroys the environment, it stays after the merge
preview:
  environment:
    name: preview/mr-$CI_MERGE_REQUEST_IID
  script:
    - helm upgrade --install "front-mr-$CI_MERGE_REQUEST_IID" ./chart
```

``` { .yaml .ex-good title="Recommended" }
# Good: address published in the MR, destroyed on close and after 5 days without activity
preview:
  stage: deploy
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
  environment:
    name: preview/mr-$CI_MERGE_REQUEST_IID
    url: https://mr-$CI_MERGE_REQUEST_IID.preview.example.com
    on_stop: preview-stop
    auto_stop_in: 5 days
  script:
    - helm upgrade --install "front-mr-$CI_MERGE_REQUEST_IID" ./chart
      --namespace "preview-mr-$CI_MERGE_REQUEST_IID" --create-namespace
      --set image.tag="$CI_COMMIT_SHA"
      --set api.baseUrl="https://api.integration.example.com"

# Good: versioned fictitious data, loaded right after the deployment
preview-seed:
  stage: deploy
  needs: [preview]
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
  script:
    - kubectl -n "preview-mr-$CI_MERGE_REQUEST_IID" exec deploy/front --
      node scripts/seed.js --file fixtures/preview-seed.json

# Example: teardown, run when the MR closes or by hand
preview-stop:
  stage: deploy
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
      when: manual
  environment:
    name: preview/mr-$CI_MERGE_REQUEST_IID
    action: stop
  script:
    - kubectl delete namespace "preview-mr-$CI_MERGE_REQUEST_IID"
```

`preview-seed.json` holds the accounts `ada@example.test` and `grace@example.test`, three orders and a reduced catalogue. Secrets come from protected, masked variables limited to `preview/*` environments: a payment sandbox key, an integration test account. GitLab keywords to check for my version. To know whether the investment is worth it, I track the number of MRs the product owner validates before the merge and the number of late change requests after release; if the need is confirmed, I extend it to the most requested back-end services.

**<span class="term" data-term="gitops">GitOps</span> variant.** Here, CI runs `helm upgrade` itself. For a throwaway environment, that is acceptable. But if the other environments are deployed by [Argo CD](kubernetes.md#argo-cd-git-decides-what-runs), CI keeps rights on the cluster just for previews, and what it deploys there escapes Argo CD. The alternative: an <span class="term" data-term="argo-applicationset">ApplicationSet</span> with the *Pull Request* generator, which creates one Application per open MR labeled `preview`, and deletes it when the MR closes. CI only has to push the image tagged with the commit SHA. The namespace created by `CreateNamespace` is not deleted with the Application (to check for your Argo CD version): I clean it up with a scheduled job, or I have the chart create the namespace itself.

``` { .yaml .ex-ref title="Reference" }
# Example: one Argo CD Application per open MR labeled preview, deleted when it closes
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: front-previews
  namespace: argocd
spec:
  goTemplate: true
  generators:
    - pullRequest:
        gitlab:
          project: my-team/front
          api: https://git.example.com/
          labels: [preview]
          pullRequestState: opened
        requeueAfterSeconds: 300
  template:
    metadata:
      name: "front-mr-{{.number}}"
    spec:
      project: default
      source:
        repoURL: https://git.example.com/my-team/front.git
        targetRevision: "{{.head_sha}}"
        path: chart
        helm:
          parameters:
            - name: image.tag
              value: "{{.head_sha}}"
      destination:
        server: https://kubernetes.default.svc
        namespace: "preview-mr-{{.number}}"
      syncPolicy:
        automated:
          prune: true
        syncOptions:
          - CreateNamespace=true
```

| I want... | I use... |
|---|---|
| my product owner wants to click through the new screen before the merge, and the shared staging is often broken by another team | one environment per MR for the front end only, wired to integration |
| I change a back-end service with no screen, already validated by its contract and integration tests | no per-MR environment: the CI is enough |
| a tester wants to explore each MR with known data, like a customer who has three orders | a seed job with a versioned fictitious dataset |
| forgotten environments push the cluster bill up every month | `auto_stop_in`, a quota per namespace, a cap on the number of environments |
| the other environments are deployed by Argo CD, and I do not want CI to keep rights on the cluster for previews | an ApplicationSet with the Pull Request generator |

:material-book-open-variant: Reference docs: [GitLab, Review Apps](https://docs.gitlab.com/ci/review_apps/) (accessed November 2026); [Argo CD, Pull Request Generator](https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/Generators-Pull-Request/) (accessed November 2026); [GitLab, Environments](https://docs.gitlab.com/ci/environments/) (accessed November 2026)
{ .doc-ref }

!!! maturity "Measuring maturity"
    | Level | What I see in the team |
    |---|---|
    | N1 | everyone sets up their workstation their own way; a demo environment is built by hand when the product owner asks for it |
    | N2 | a `devcontainer.json` or a `mise.toml` describes the workstation in every repository, and CI creates a preview environment for every front-end MR |
    | N3 | preview environments destroy themselves at merge or after 5 days, and a per-namespace quota refuses those above the cap |
    | N4 | the team tracks the monthly cost of environments and the number of MRs validated before merge, and tunes lifetime and scope from those numbers |

    **I measure**: the number of preview environments open for more than 5 days, read in the forge's environment list; the monthly bill of the `preview-*` namespaces, read in the cloud cost tool.

## A fast and reliable CI

<a class="pill pill-scope pill-scope-app" href="../architecture/#map-of-scales">Scale · Application</a> <a class="pill pill-scope pill-scope-infra" href="../architecture/#map-of-scales">Scale · Infrastructure</a> <span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

<a class="pill pill-dora" href="https://dora.dev/capabilities/continuous-integration/">DORA · Continuous integration</a> <a class="pill pill-dora" href="https://dora.dev/capabilities/test-automation/">DORA · Test automation</a>

I push my MR and CI takes 30 minutes: I move on to something else, and when it fails I have forgotten where I was. If on top of that it sometimes fails for no reason, the team learns to rerun without reading the error. A useful CI therefore has two qualities: it is **fast**, so the developer waits for the result without switching tasks, and **reliable**, so a red result is always real information. I measure first: pipeline duration at p50 and p95, wait before a <span class="term" data-term="runner">runner</span> is free, and the <span class="term" data-term="critical-path">critical path</span> (the chain of dependent jobs that sets the minimum duration).

The p50 (the median) is the duration under which half of the pipelines finish; the <span class="term" data-term="p95">p95</span>, the one under which 95% of them finish. Example with 10 pipelines of 8, 8, 9, 9, 9, 10, 10, 11, 12 and 28 min: the p50 is about 9.5 min, the p95 lands between 21 and 28 min depending on the calculation method, pulled entirely by the single 28 min run. The median tells what a developer usually lives through, the p95 tells what makes them switch tasks.

!!! noob "As noob"
    I think of my commute: the median is how long it takes on a normal day; the p95 is the duration I only exceed about one day in twenty, when it rains and a train is cancelled. I pick my departure time from those bad days, not from the average. The takeaway: **the p50 tells the everyday, the p95 tells what makes me miss the meeting.**

To know where the time goes, I lay a real pipeline on a timeline. The numbers come from the CI itself: the pipeline page shows each job with its wait and its duration, the GitLab jobs API gives `queued_duration` and `duration` for hundreds of runs, and the CI/CD analytics page charts pipeline duration over time. Look at the runner wait and the critical path first, and only then at the longest job.

```mermaid
gantt
    title MR pipeline, 12 min in total
    dateFormat HH:mm
    axisFormat %H:%M
    section Wait
    free runner         :done, q, 10:43, 10:45
    section Jobs
    lint                :l, 10:45, 10:47
    test 1/4            :t1, 10:45, 10:50
    test 2/4            :t2, 10:45, 10:49
    test 3/4            :t3, 10:45, 10:50
    test 4/4 critical   :crit, t4, 10:45, 10:55
```

Reading (example figures): 2 min of wait before the first job, then shard 4 alone sets the end of the pipeline, 10 min against 4 to 5 for the others. Rebalancing the shards from measured durations (`pytest --store-durations` with pytest-split) pays off more than a fifth shard, and runner wait is fixed on the capacity side, not in the tests.

The levers, in the order where they often pay off the most:

1. **remove useless waiting**: jobs that start as soon as their real dependencies are done (`needs` in GitLab CI), instead of waiting for a whole stage to finish;
2. **cache** dependencies, with the lockfile as the key, and Docker layers (<span class="term" data-term="docker-layer-cache">layer cache</span>, dependencies copied before the code);
3. **parallelise** a long test suite into <span class="term" data-term="test-shard">shards</span>;
4. **run only what is concerned**: rules on changed files, or the "affected" commands of monorepo tools, with a <span class="term" data-term="remote-build-cache">remote build cache</span>.

*GitLab CI: competes with GitHub Actions, Jenkins*
{ .tool-rel }


Avoid the CI copied from project to project: each job waits for the previous stage to finish and downloads every dependency again, and tests run even when only the README changed, so 4 min of lint then 15 min of tests in a row (example numbers).

``` { .yaml .ex-bad title="Avoid" }
# Avoid: sequential stages, no cache, tests run for every change
stages: [lint, test]

lint:
  stage: lint
  image: python:3.12-slim
  script:
    - pip install uv && uv sync
    - uv run ruff check .

test:
  stage: test
  image: python:3.12-slim
  script:
    - pip install uv && uv sync
    - uv run pytest
```

The same CI, reorganised:

``` { .yaml .ex-good title="Recommended" }
# Good: shared base, uv cache keyed on the lockfile
.python:
  image: python:3.12-slim
  variables:
    UV_CACHE_DIR: .uv-cache
  cache:
    key:
      files: [uv.lock]
    paths: [.uv-cache]
  before_script:
    - pip install uv
    - uv sync --frozen

# Good: needs: [] starts the job without waiting for a whole stage
lint:
  extends: .python
  needs: []
  script: uv run ruff check .

# Good: 4 shards, run only when code, tests or the lockfile change
test:
  extends: .python
  needs: []
  parallel: 4
  script: uv run pytest --splits 4 --group "$CI_NODE_INDEX"
  rules:
    - changes: [src/**/*, tests/**/*, uv.lock]
```

```mermaid
flowchart LR
    PUSH["push"] --> L["lint"]
    PUSH --> T1["test 1/4"]
    PUSH --> T2["test 2/4"]
    PUSH --> T3["test 3/4"]
    PUSH --> T4["test 4/4"]
    CACHE[("uv cache<br/>key: uv.lock")] -.-> L
    CACHE -.-> T1
    CACHE -.-> T4
    L --> OK["green pipeline"]
    T1 --> OK
    T2 --> OK
    T3 --> OK
    T4 --> OK
```

`needs: []` starts `lint` and `test` at the same time; `parallel: 4` creates four jobs, and the pytest-split plugin gives each one a quarter of the tests; `rules: changes` avoids running the tests when only the documentation changes. Keywords to check for my version of GitLab and of the plugin.

Reliability matters as much as speed: a <span class="term" data-term="flaky-test">flaky test</span> teaches teams to rerun without reading. Causes and strategy (quarantine, owner, deadline) are in [Software quality and testing](qualite.md#flaky-tests-and-parallelisation). A simple indicator: the share of pipelines rerun on the same commit.

**Risks.** A `changes` rule that is too narrow skips tests that should have run, for example when only a configuration file changes, and a bug ships to production with a green pipeline; I keep a full run on the main branch. A badly keyed cache serves dependencies from another version; its key contains the lockfile, and I clear it when a result looks inconsistent. Splitting into shards reveals tests that depend on execution order: they fail at random, so I fix them instead of rerunning them.

| I want... | I use... |
|---|---|
| my CI is slow and I do not know whether it is the wait for a runner, a job that is too long, or jobs waiting for each other | duration per job, runner wait, critical path |
| every pipeline downloads all dependencies again, even though the lockfile has not changed | a cache keyed on the lockfile |
| the lint job waits for a whole stage to finish although it does not need it, so the pipeline lasts longer than necessary | `needs` (GitLab CI), explicit dependencies between jobs |
| my test suite takes 15 min and alone sets the duration of the pipeline | parallel shards |
| I fix a typo in the README and the whole test suite runs again | rules on changed files, test impact analysis |
| each team has copied and tweaked its own CI, and an improvement made in one never reaches the others | a shared, versioned CI component |

:material-book-open-variant: Reference docs: [GitLab, CI/CD YAML syntax reference](https://docs.gitlab.com/ci/yaml/) (accessed November 2026); [GitLab, CI/CD analytics](https://docs.gitlab.com/user/analytics/ci_cd_analytics/) (accessed November 2026)
{ .doc-ref }

### Shared, versioned CI component

<span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

A <span class="term" data-term="versioned-component">CI component</span> is a reusable piece of pipeline (jobs, their images, their cache), kept in a single repository, published with a version number, and included by every project. The project no longer copies the jobs: it keeps one `include` line and a version. In GitLab these are CI/CD components, generally available since GitLab 17.0 (2024, to check); the GitHub equivalent is the *reusable workflow* (`uses: team-platform/ci/.github/workflows/python.yml@v1.4.0`).

!!! noob "As noob"
    A CI component is flat-pack furniture supplied by one factory to every shop, with a model number: if the factory improves a hinge, it releases model 1.5 and each shop moves to the new model when it is ready. Without a component, each shop copied the plan by hand and tweaked it, and the improvement never reaches it. The takeaway: **share a pipeline through a version, not through copy and paste.**

Avoid the floating version: each project takes the latest published version without going through an MR, so a mistake in the component turns every pipeline red the same morning.

``` { .yaml .ex-bad title="Avoid" }
# Avoid: floating version, one change to the component breaks every project at once
include:
  - component: git.example.com/team-platform/ci/python@~latest
```

A project's `.gitlab-ci.yml`, with a pinned version:

``` { .yaml .ex-good title="Recommended" }
# Good: one include line and a version, no more copied jobs
include:
  - component: git.example.com/team-platform/ci/python@1.4.0
    inputs:
      python_version: "3.12"
```

The component repository, `team-platform/ci`:

``` { .text .ex-illus title="Illustration" }
team-platform/ci/
├── templates/
│   └── python.yml      the "python" component
├── .gitlab-ci.yml      tests the component, publishes a release on each tag
├── CHANGELOG.md
└── README.md
```

``` { .yaml .ex-ref title="Reference" }
# templates/python.yml
# Example: parameters the component accepts, with their default
spec:
  inputs:
    python_version:
      default: "3.12"
---
# Example: shared jobs, the Python version comes from the input
lint:
  image: python:$[[ inputs.python_version ]]-slim
  needs: []
  script:
    - pip install uv
    - uv run ruff check .

test:
  image: python:$[[ inputs.python_version ]]-slim
  needs: []
  script:
    - pip install uv
    - uv run pytest
```

The part before `---` declares the accepted parameters; `$[[ inputs.python_version ]]` is replaced at include time. Syntax to check for my GitLab version.

How a fix reaches the projects:

``` { .text .ex-illus title="Illustration" }
day 0   the platform team adds the uv cache to the component, tags 1.5.0
day 1   the dependency update bot (Renovate) opens an MR "python 1.4.0 -> 1.5.0" in each project
day 1   each MR's CI runs with the new version; minor version and green CI: automatic merge
day 7   the campaign table lists the projects still on 1.4.0, often those whose CI was already red
```

Pitfall: including `@main` or `~latest` avoids the MRs, but a change to the component then breaks every project on the same day, with no review and no easy rollback. A pinned version plus an automatic MR keeps both: propagation and control.

:material-book-open-variant: Reference docs: [GitLab, CI/CD components](https://docs.gitlab.com/ci/components/) (accessed November 2026)
{ .doc-ref }

### SemVer: the contract of an internal library, CLI or component

<a class="pill pill-scope pill-scope-code" href="../architecture/#map-of-scales">Scale · Code</a> <a class="pill pill-scope pill-scope-app" href="../architecture/#map-of-scales">Scale · Application</a> <span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026; specification 2.0.0 unchanged">Current · 11/2026</span>

Twenty teams call my internal CLI `devctl` from their CI scripts, and a bot merges its minor versions on its own. <span class="term" data-term="semantic-versioning">Semantic versioning</span> (Semantic Versioning, specification 2.0.0, published in 2013) gives a meaning to the number `MAJOR.MINOR.PATCH`: the patch fixes without changing anything else, the minor adds without breaking, the major announces a <span class="term" data-term="breaking-change">breaking change</span>. For internal code, this number is a promise made to teams I do not all know: it is what allows a `2.3.0 -> 2.4.0` to be merged automatically.

**When**: as soon as another team depends on my code through a version (package, image, CLI, CI component). Useless for code that never leaves a single repository. **Why**: without a contract that holds, a minor breaks a script, teams pin their version out of caution and stop receiving security fixes. The cost: deciding what is public and keeping the old behaviour during a <span class="term" data-term="deprecation">deprecation</span> period. **How**:

1. I write down what is part of the contract: the importable functions, the CLI's subcommands and options, its `--output json` output, the component's inputs. Text displayed for a human and `_internal` modules are not part of it.
2. I decide what breaks with the same rules as for an API: removing or renaming an option, a JSON field or an input, making mandatory what was optional ([see Versioning in the API page](api-rest-async.md#versioning)).
3. I never remove anything at once: the old option keeps working for two minor versions with a warning naming its replacement, then disappears in the next major version, with a migration note in `CHANGELOG.md`.

Avoid: renaming `--env` to `--target` in version 2.4.0. The bot merges this minor automatically, and the next morning every script that runs `devctl deploy --env staging` fails on an unknown option.

``` { .python .ex-bad title="Avoid" }
# Avoid: option renamed in a minor version, existing scripts break
@cli.command()
@click.option("--target", required=True)
def deploy(target):
    run_deploy(target)
```

``` { .python .ex-good title="Recommended" }
# Good: the new option arrives in 2.4.0, the old one still works and warns until 3.0.0
@cli.command()
@click.option("--target")
@click.option("--env", hidden=True)
def deploy(target, env):
    if env is not None:
        click.echo("--env is deprecated and will be removed in 3.0.0: use --target", err=True)
        target = target or env
    run_deploy(target)
```

| Change in `devctl` | Number |
|---|---|
| fix a display bug | 2.3.1, patch |
| add a `devctl logs` subcommand | 2.4.0, minor |
| add `--target` while keeping `--env` with a warning | 2.4.0, minor |
| remove `--env`, or a field of the `--output json` output | 3.0.0, major |
| reword the text displayed to the human | patch: this text is not part of the contract |

| I want... | I use... |
|---|---|
| I want to rename an option of my internal CLI, which twenty teams call from their CI scripts | new option in a minor, old one deprecated, removal in a major |
| other teams' scripts read my CLI's output to chain steps | `--output json` treated as a contract, human text free |
| I want my fixes to reach every repository without anyone thinking about it | SemVer held strictly, automatic merge of patches and minors by Renovate |

:material-book-open-variant: Reference docs: [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html) (2013)
{ .doc-ref }

!!! maturity "Measuring maturity"
    | Level | What I see in the team |
    |---|---|
    | N1 | someone looks at pipeline duration when CI feels slow, and reruns red jobs by hand |
    | N2 | lockfile cache, `needs` and shards are in place, and projects include a pinned CI component instead of copying jobs |
    | N3 | flaky tests go into quarantine by themselves, and Renovate proposes each new version of the component or internal CLI and merges it when CI is green and the version is minor |
    | N4 | the team tracks p50, p95, runner wait and rerun rate on a dashboard, and decides its CI work from those curves |

    **I measure**: p95 pipeline duration and runner wait, read in the CI/CD analytics or the jobs API (`duration`, `queued_duration`); the share of pipelines rerun on the same commit.

## Platform engineering: the platform as a product

<a class="pill pill-scope pill-scope-infra" href="../architecture/#map-of-scales">Scale · Infrastructure</a> <a class="pill pill-scope pill-scope-enterprise" href="../architecture/#map-of-scales">Scale · Enterprise</a> <span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

<a class="pill pill-dora" href="https://dora.dev/capabilities/loosely-coupled-teams/">DORA · Loosely coupled teams</a>

Every product team has to write its own CI, configure its deployments and create its databases by hand, so it spends more time on tooling than on its product. **Platform engineering** means building an <span class="term" data-term="internal-developer-platform">internal platform</span> that product teams consume in self-service, to reduce their cognitive load. Evan Bottcher, "What I Talk About When I Talk About Platforms" (martinfowler.com, 2018), defines it as a set of services, tools and knowledge that makes teams autonomous; he insists on one point: the platform is an **internal product**, with users, a roadmap and a measure of adoption.

!!! noob "As noob"
    The internal platform is the central kitchen of a restaurant chain: each restaurant could make its own stocks and sauces, but the central kitchen delivers them ready, and each chef focuses on their dishes. If the sauces are poor or late, the chefs go back to making their own: that is why it is run as a product, with customers to satisfy. The takeaway: **a successful platform is measured by how many teams choose to use it.**

"Team Topologies" (Matthew Skelton and Manuel Pais, 2019) gives the vocabulary for teams:

| Team type | Role | Example |
|---|---|---|
| <span class="term" data-term="stream-aligned-team">stream-aligned team</span> | delivers a part of the product end to end | team-core, which owns orders-service |
| <span class="term" data-term="platform-team">platform team</span> | provides internal services in self-service | shared CI, deployment, databases on demand |
| <span class="term" data-term="enabling-team">enabling team</span> | helps a team gain a skill, then steps back | two weeks with team-core to set up contract tests |
| complicated-subsystem team | owns a component that needs rare expertise | a pricing engine |

The book also describes three interaction modes: collaboration, *X-as-a-Service* (I consume without coordinating) and facilitating. It suggests starting with the <span class="term" data-term="thinnest-viable-platform">Thinnest Viable Platform</span>: the smallest thing that really speeds teams up, sometimes a simple documentation page.

```mermaid
flowchart LR
    P["Platform team"] -- "X-as-a-Service: CI, deployment, databases" --> A["team-core"]
    P -- "X-as-a-Service" --> B["team-web"]
    E["Enabling team"] -- "facilitating, 2 weeks" --> A
    A -- "feedback, requests" --> P
```

The **CNCF Platforms White Paper** (CNCF TAG App Delivery, 2023, date and list to check) describes the attributes of a good platform: treated as a product, focused on its users' experience, documented with onboarding, self-service, reducing cognitive load, optional and composable, secure by default. The same group published a platform engineering maturity model (2023, to check).

Treating the platform as a product, concretely:

- start from users' frequent tasks (deploy, roll back, create a service), not from a feature list;
- first deliver one task covered end to end;
- publish a roadmap and a feedback channel;
- measure voluntary <span class="term" data-term="adoption">adoption</span> and satisfaction: a team that works around the platform sends a product signal, not a lack of discipline.

**Risks.** A platform team that builds what it thinks is useful, without talking to product teams, ships features nobody uses, and teams keep their scripts; I start from frequent tasks and measure adoption. A platform made mandatory becomes a bottleneck: every need it does not cover turns back into a waiting ticket; I keep a documented way out. A platform everything depends on is also a shared failure: if the shared deployment goes down, no team ships, so I run it like a production service, with on-call and availability targets.

| Situation | Choice |
|---|---|
| my company has 3 teams and a single way to deploy, which everyone already knows | no platform team: a doc page and a CI template are enough |
| a team must learn a new skill, like setting up contract tests, and nobody on it has done it before | an enabling team, for a limited time |
| many teams open the same infrastructure tickets, like "create a database" or "create a repository", and wait for someone every time | a platform team and self-service |
| the platform exists, but only 30% of services use it and the others keep doing things their own way | go and see the teams that do not use it, before adding features |

:material-book-open-variant: Reference docs: [Evan Bottcher, "What I Talk About When I Talk About Platforms"](https://martinfowler.com/articles/talk-about-platforms.html) (2018); [CNCF TAG App Delivery, "Platforms White Paper"](https://tag-app-delivery.cncf.io/whitepapers/platforms/) (2023, to check)
{ .doc-ref }

### Getting a tool adopted without imposing it

<a class="pill pill-scope pill-scope-enterprise" href="../architecture/#map-of-scales">Scale · Enterprise</a> <span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

My team built a CLI that creates a test environment in one command. Two months later, three teams out of twenty use it. The reflex is to add features, or to ask management for a directive. Two models explain better what is going on.

**Diffusion of innovations** (Everett Rogers, "Diffusion of Innovations", 1962) sorts the people who adopt something new into five groups, by when they take it up: innovators (about 2.5%), <span class="term" data-term="early-adopters">early adopters</span> (13.5%), early majority (34%), late majority (34%), laggards (16%). Each group is convinced differently. Rogers lists five qualities that speed adoption up: a clear advantage, compatibility with what people already do, simplicity, the chance to try without committing, results others can see. **Crossing the Chasm** (Geoffrey Moore, 1991) adds that a gap (the *chasm*) opens between early adopters and the early majority: the first accept an imperfect tool because it is new, the majority wants a complete tool, a simple switch and proof that peers use it. Many internal tools stop there, around 15% adoption.

!!! noob "As noob"
    It is the life of a new sneaker model: a few enthusiasts wear it before everyone else, then the curious, and the majority follows when it sees it on its friends' feet, not in the ads. Between the curious and the majority, many models disappear. The takeaway: **the majority adopts a tool because its peers use it and the switch is simple, not because the tool is new.**

**When**: a voluntary tool (platform, CLI, shared component) stalls after its first users. Not for an obligation: a security rule that must apply everywhere before a date is decided and announced, with a deadline. **Why**: an imposed adoption vanishes as soon as priorities change, and teams work around the tool; a voluntary adoption lasts and reveals the real needs. The cost: it is slower, and it takes coaching time. **How**:

1. I interview the teams that use the tool (what convinced them, how much time do they save?), then five teams that do not. Often they do not know it, an installation step blocks them, or it does not cover their case.
2. I fix the most frequent blocker, and I lower the <span class="term" data-term="switching-cost">switching cost</span>: a generated migration MR beats a twenty-page guide.
3. I have a user team give a ten-minute demo: developers trust their peers more than the team that supplies the tool. I add the tool to the golden path template, so new services get it by default.
4. I track adoption and retention separately, as the HEART framework suggests (Google, 2010): a team can try the tool and then drop it.

| Group (Rogers) | Teams | What convinces them | What I do |
|---|---|---|---|
| innovators | 3 | the tool itself | direct feedback, access to beta versions |
| early adopters | 4 | a clear gain and quick help | half a day of coaching |
| early majority | 8 | peer testimony, a simple switch | demo by team-core, automatic MR |
| late majority | 4 | the tool having become the norm | built into the service template |
| laggards | 1 | a specific need not covered | interview, change or an assumed exception |

Example curve: 3 teams in month 2, 7 in month 4, 15 in month 6. Going from 7 to 15 took the demo and the automatic MR, not a new feature.

| Situation | Choice |
|---|---|
| my tool pleases the three curious teams that tried it, but the other seventeen do not move | peer testimony and automatic migration MR |
| a team tried the tool, then went back to its old script | go and see it: measure retention, not only adoption |
| I want every new service to have the tool without anyone having to think about it | build it into the golden path template |
| a security rule must apply in every repository before a set date | a written obligation with a deadline, not an adoption campaign |

:material-book-open-variant: Reference docs: [Wikipedia, Diffusion of innovations](https://en.wikipedia.org/wiki/Diffusion_of_innovations) (accessed November 2026); [Wikipedia, Crossing the Chasm](https://en.wikipedia.org/wiki/Crossing_the_Chasm) (accessed November 2026)
{ .doc-ref }

!!! maturity "Measuring maturity"
    | Level | What I see in the team |
    |---|---|
    | N1 | one or two infrastructure people answer "create a database" or "create a repository" tickets by hand |
    | N2 | a platform team provides those resources as self-service, with a public roadmap and a feedback channel |
    | N3 | the platform enforces its guardrails by itself (quotas, permissions, secure defaults), and new services get it by default through the template |
    | N4 | the platform team tracks voluntary adoption, retention and satisfaction per team, and picks its roadmap from those numbers |

    **I measure**: the share of services that deploy through the platform, read in the catalogue or the deployment logs; the number of repetitive infrastructure tickets per quarter, read in the ticket tool.

## Golden paths and templates

<a class="pill pill-scope pill-scope-app" href="../architecture/#map-of-scales">Scale · Application</a> <a class="pill pill-scope pill-scope-infra" href="../architecture/#map-of-scales">Scale · Infrastructure</a> <span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

A <span class="term" data-term="golden-path">golden path</span> covers a common task end to end: for example "create a Python HTTP service and deploy it", with a repository template, ready CI, deployment, dashboards and basic alerts. The term was popularised by Spotify Engineering, "How We Use Golden Paths to Solve Fragmentation in Our Software Ecosystem" (2020); Netflix speaks of a *paved road* (date to check). The path can be left: a team may step off it, but then takes on the <span class="term" data-term="cost-of-difference">cost of its difference</span> (its CI, its updates, its on-call documentation).

!!! noob "As noob"
    The golden path is the marked, maintained trail to the most visited summit: I can always cut through the woods, but then I carry my own map, water and rescue plan. The takeaway: **the official path is the easiest one, not the only one allowed.**

**The deployment golden path.** On Kubernetes, the most common paved path comes down to two bricks maintained by the platform team: a [generic Helm chart](kubernetes.md#one-generic-chart-for-every-service), where each team only fills in its values (image, port, resources), and <span class="term" data-term="argo-cd">Argo CD</span>, which deploys from a config repo on every merged MR ([details](kubernetes.md#argo-cd-git-decides-what-runs)). To ship, the product team no longer needs to know Deployments, probes or kubectl; it finds them on the [Kubernetes](kubernetes.md) page the day it has to debug. The cluster's complexity does not disappear: it moves from every team to the platform team, which carries it once.

<span class="term" data-term="scaffolding">Scaffolding</span> generates a project's initial structure from a template. Its trap is <span class="term" data-term="template-drift">template drift</span>: each project keeps the choices of the day it was created, and the new template version never reaches it. Two remedies:

- **a thin template**: the minimum in the template, the maximum in shared, versioned building blocks ([CI component](#shared-versioned-ci-component), base image, configuration library), which are updated through a version bump;
- **a tool that can update**: <span class="term" data-term="copier">Copier</span> records the template version in the project and reapplies its changes with `copier update`; cruft does the same for cookiecutter.

!!! noob "As noob"
    A template is a photocopier: each project is a photocopy of the original on the day it was created. Fixing the original fixes none of the copies already handed out. The takeaway: **what must keep evolving after creation does not go in the template, but in a shared, versioned building block.**

**Backstage Software Templates**: in the Backstage portal, a form starts the generation, creates the repository and registers it in the catalogue. A template is a YAML file that describes the requested parameters and the steps:

``` { .yaml .ex-ref title="Reference" }
# Example: Backstage template, parameters asked in the form
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: python-http-service
  title: Python HTTP service
spec:
  owner: team-platform
  type: service
  parameters:
    - title: The service
      required: [name, owner]
      properties:
        name:
          type: string
        owner:
          type: string
  # Example: copies the skeleton, creates the repo, registers it in the catalog
  steps:
    - id: fetch
      action: fetch:template
      input:
        url: ./skeleton
        values:
          name: ${{ parameters.name }}
          owner: ${{ parameters.owner }}
    - id: publish
      action: publish:gitlab
      input:
        repoUrl: git.example.com?owner=team-core&repo=${{ parameters.name }}
    - id: register
      action: catalog:register
      input:
        repoContentsUrl: ${{ steps.publish.output.repoContentsUrl }}
        catalogInfoPath: /catalog-info.yaml
```

```mermaid
flowchart LR
    F["Portal form<br/>name, owner"] --> S1["fetch:template<br/>filled skeleton"]
    S1 --> S2["publish:gitlab<br/>new repository"]
    S2 --> S3["catalog:register<br/>catalog-info.yaml"]
    S3 --> CAT[("Catalogue")]
    S2 --> CI["Shared component CI"]
```

Action and field names to check in the documentation of the Backstage version I use.

| Element | In the template | In a shared, versioned building block |
|---|---|---|
| folder structure, first test | yes | no |
| CI pipeline | one `include` line | the CI component |
| logging and metrics configuration | no | a small internal library |
| base image | its reference | the image itself, rebuilt and published |
| catalogue file | yes, prefilled | no |

| I want... | I use... |
|---|---|
| a team wants to create a new service that already follows the rules (CI, logs, alerts) in a few minutes, not in three weeks | a golden path with a creation form |
| services created two years ago kept the old CI and do not receive the fixes made since in the template | a thin template and versioned blocks, updated by automatic MRs |
| I prefer to generate a project from my terminal, and to be able to update it later when the template changes | Copier, or cookiecutter with cruft |
| I want people to create their service by filling in a form in the portal, without touching the command line | Backstage Software Templates |
| a team has a good reason to leave the path, for example a service written in another language than the template's | a written exception, with what remains mandatory and what it takes on |

:material-book-open-variant: Reference docs: [Spotify Engineering, "How We Use Golden Paths to Solve Fragmentation in Our Software Ecosystem"](https://engineering.atspotify.com/2020/08/how-we-use-golden-paths-to-solve-fragmentation-in-our-software-ecosystem/) (2020); [Backstage, Software Templates](https://backstage.io/docs/features/software-templates/) (accessed November 2026)
{ .doc-ref }

!!! maturity "Measuring maturity"
    | Level | What I see in the team |
    |---|---|
    | N1 | a template repository exists, which teams copy by hand when they think of it |
    | N2 | a form or a command (Backstage, Copier) creates a complete service: repository, included CI, catalogue file, basic alerts |
    | N3 | shared building blocks update through automatic MRs, and CI flags services that left the path without a written exception |
    | N4 | the team tracks service creation lead time and the share of services up to date with the shared blocks, and slims the template from those numbers |

    **I measure**: the time between the request and the first deployment of a new service, read in the portal or forge history; the share of services on the latest version of the shared blocks, read in the Renovate dashboard.

## Developer portal and catalogue

<a class="pill pill-scope pill-scope-enterprise" href="../architecture/#map-of-scales">Scale · Enterprise</a> <span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

A <span class="term" data-term="developer-portal">developer portal</span> is a single internal site that gathers services, their owners, their documentation and common actions (create a service, see the CI status). Its core is the <span class="term" data-term="service-catalog">service catalogue</span>: the list of all components, with their owning team, their dependencies and their useful links. Backstage and its `catalog-info.yaml` file are presented in the [Technical tools overview](outils.md#collaboration-jira-confluence-slack-backstage).

The portal is an **interface** of the platform, not the platform itself: if deploying still means opening a ticket and waiting for someone, a nice portal on top saves no time. The order that often works:

1. a catalogue file in each repository, added by an automatic MR and checked by CI (does the owner exist?);
2. a page generated from these files, or a minimal portal;
3. only then, creation templates, built-in documentation, plugins.

!!! noob "As noob"
    The portal is a shop window; the catalogue, its inventory; the platform, the warehouse and the delivery drivers. A nice window on top of a wrong inventory sends the customer to a product that no longer exists, and without drivers nothing reaches them. The takeaway: **first an accurate catalogue and a platform that delivers, then the window.**

```mermaid
flowchart TB
    subgraph UI["Interfaces"]
        PORT["Developer portal"]
        CLI["CLI"]
        GIT["Files in the repository"]
    end
    subgraph PLAT["Internal platform"]
        CAT["Service catalogue"]
        TPL["Golden paths, templates"]
        CICD["CI and deployment"]
        OBS["Observability"]
    end
    subgraph RES["Resources"]
        K8S["Clusters"]
        DBS["Databases, buckets"]
        CLOUD["Cloud accounts"]
    end
    UI --> PLAT --> RES
```

A wrong catalogue is worse than no catalogue: it sends the incident alert to a team that no longer exists. The data must therefore come from the repositories and be checked automatically, not typed into a spreadsheet.

| Question with no answer today | What the catalogue provides |
|---|---|
| "who owns this service?" | the `owner` field, checked by CI |
| "who calls this API before I change it?" | the `providesApis` and `consumesApis` relations |
| "where are the docs, the dashboard?" | the component's links |
| "which services are orphaned or obsolete?" | lifecycle and owner, filterable |

| I want... | I use... |
|---|---|
| an alert goes off at night and nobody knows which team owns the service | one catalogue file per repository, checked by CI |
| newcomers do not know where to find the list of services, their docs and their dashboards | a portal, once the catalogue is reliable |
| I want a portal, but my team has no time to build and maintain one more application | a commercial portal or a generated page that reads the same files |

Backstage is open source but remains an application to develop and maintain.

:material-book-open-variant: Reference docs: [Backstage, Software Catalog](https://backstage.io/docs/features/software-catalog/) (accessed November 2026); [internaldeveloperplatform.org](https://internaldeveloperplatform.org/) (accessed November 2026)
{ .doc-ref }

!!! maturity "Measuring maturity"
    | Level | What I see in the team |
    |---|---|
    | N1 | a wiki page lists services and their owners, updated by hand |
    | N2 | every repository has its catalogue file, and a portal or a generated page displays them |
    | N3 | CI refuses a catalogue file whose owner does not exist, and the incident alert goes to the team read from the catalogue |
    | N4 | the team tracks the share of components with a valid owner and the searches with no result in the portal, and fixes the catalogue from those numbers |

    **I measure**: the share of repositories with a valid catalogue file, read in CI or the portal; the number of orphan services, filtered in the catalogue.

## Documentation

<span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

<a class="pill pill-dora" href="https://dora.dev/capabilities/documentation-quality/">DORA · Documentation quality</a>

My team has a wiki nobody updates: the code changes, the page stays, and it ends up giving wrong instructions. **<span class="term" data-term="docs-as-code">Docs as code</span>** fixes this: technical documentation is written in Markdown in the repository, changed in the same MR as the code, reviewed, then published by CI (with MkDocs, for example). It therefore gets the same tools and the same review as the code. The practice was popularised by the Write the Docs community in the 2010s (date to check).

<span class="term" data-term="diataxis">Diátaxis</span> (Daniele Procida, presented from about 2017, site diataxis.fr, date to check) separates four types of documentation, each for one reader need. A page that mixes all four serves no reader well.

!!! noob "As noob"
    I think of cooking: the step-by-step recipe for a beginner (tutorial), the card on "rescuing a split mayonnaise" (how-to guide), the table of cooking times (reference) and the article on the chemistry of emulsions (explanation). Each one serves a different moment, and a text mixing all four loses everyone. The takeaway: **before writing, pick which of the reader's four needs I am serving.**

| Type | The reader wants... | Typical question on orders-service |
|---|---|---|
| tutorial | to learn by doing | "I am new, how do I make a first change?" |
| how-to guide | to accomplish a precise task | "how do I deploy to production?" |
| reference | to check a piece of information | "which variable sets the timeout?" |
| explanation | to understand a choice | "why a message queue here?" |

<figure class="diagram"><svg viewBox="0 0 220 160" role="img" aria-label="The four Diátaxis types"><rect class="layer layer-2" x="50" y="10" width="80" height="60"/><rect class="layer layer-1" x="130" y="10" width="80" height="60"/><rect class="layer layer-1" x="50" y="70" width="80" height="60"/><rect class="layer layer-2" x="130" y="70" width="80" height="60"/><text x="90" y="43" text-anchor="middle" class="label-strong">tutorial</text><text x="170" y="43" text-anchor="middle" class="label-strong">how-to guide</text><text x="90" y="103" text-anchor="middle" class="label-strong">explanation</text><text x="170" y="103" text-anchor="middle" class="label-strong">reference</text><text x="45" y="43" text-anchor="end">action</text><text x="45" y="103" text-anchor="end">cognition</text><text x="90" y="145" text-anchor="middle">study</text><text x="170" y="145" text-anchor="middle">work</text></svg><figcaption>The four Diátaxis types (Daniele Procida)</figcaption></figure>

``` { .text .ex-illus title="Illustration" }
orders-service/
├── mkdocs.yml
└── docs/
    ├── index.md
    ├── tutorials/
    │   └── first-change.md
    ├── how-to/
    │   └── deploy-to-production.md
    ├── reference/
    │   ├── configuration.md
    │   └── api.md
    └── explanation/
        └── why-a-queue.md
```

What to measure: the most read pages, searches with no result, the date of last change, and the questions that keep coming back in chat channels. A wrong page does more damage than a missing one: fix it or delete it.

**Risks.** Docs as code leaves out people who do not use Git (support, product): they stop fixing anything and go back to their own wiki; I let them edit from the published site, which creates the MR for them. Sorting by Diátaxis can turn into an endless classification debate; I first separate the generated reference from the rest, then move page by page. Abundant but never reviewed documentation gives wrong instructions with an official look; every page has an owner and a review date.

| I want... | I use... |
|---|---|
| my docs still tell people to run a command removed months ago, because nobody thinks of updating them when the code changes | docs as code: Markdown in the repository, published by CI |
| my pages mix the step-by-step guide for beginners, the list of variables and the explanation of choices, and nobody finds what they are looking for | the four Diátaxis types |
| my API docs list fields that no longer exist, or miss the new ones | a reference generated from the OpenAPI schema |
| people ask me the same question every week in the help channel, like "how do I deploy to production?" | one page per frequent question, then answer with a link |

:material-book-open-variant: Reference docs: [Daniele Procida, Diátaxis](https://diataxis.fr/) (publication date not given); [Write the Docs, "Docs as Code"](https://www.writethedocs.org/guide/docs-as-code/) (accessed November 2026)
{ .doc-ref }

!!! maturity "Measuring maturity"
    | Level | What I see in the team |
    |---|---|
    | N1 | a wiki exists, kept by one or two motivated people |
    | N2 | technical docs live in Markdown in the repository, changed in the same MR as the code, published by CI and sorted by Diátaxis |
    | N3 | CI breaks on a dead link or an API reference out of sync with the OpenAPI schema, and a page untouched for a year is flagged to its owner |
    | N4 | the team tracks searches with no result and repeated questions in the help channel, and writes or fixes pages from those numbers |

    **I measure**: the number of repeated questions per month in the help channel, counted over one month; the share of MRs that change code and docs together, read in the forge.

## Onboarding

<span class="term" data-term="onboarding">Onboarding</span> is how a newcomer joins: access, laptop, tools, first tasks. If ada waits several days for her access, then struggles to start her first project, she feels useless, and the team does not know where things get stuck. Two simple indicators show it:

- the **time to first commit** (or first MR opened): it mostly measures access and project setup;
- the <span class="term" data-term="time-to-first-change">time to first change in production</span>: it measures the whole chain, review and deployment included.

These indicators are common in DevX experience reports, with no single reference source. Complete them with the newcomer's feeling after 30 days.

| Day | Step | Measure |
|---|---|---|
| D-5 | accounts and access created from the team profile, automatically | access ready on D1 (yes or no) |
| D1 | laptop set up by script, first project started in one command | time to first green test |
| D2 | a small real task, labelled "first ticket", paired with ada | MR opened |
| D3 | MR merged and deployed | time to first change in production |
| D30 | five questions and a <span class="term" data-term="retrospective">retrospective</span> | blockers mentioned, feeling |

Example path. Each blocker noted becomes a ticket, and the newcomer fixes the documentation that blocked them: they are best placed to see what is missing.

**Risks.** If time to first commit becomes a target, the newcomer gets a trivial task to bring the number down, and learns nothing about the real code; I read that delay together with the day-30 feedback. Pairing weighs on ada, who ships less during those days; the team plans for it instead of taking it from her evenings. Without a path, every newcomer makes the same discoveries again and the team never sees where things get stuck.

| I want... | I use... |
|---|---|
| a newcomer spends their first day waiting for accounts and access | access profiles per team, requested automatically |
| a newcomer must be able to start their first project alone, without asking for help at every step | one-command setup, with `doctor` |
| I want a newcomer to contribute to real code quickly, for example a small fix merged in their first week | a "first ticket" label on small real tasks |
| I improved onboarding and want to know whether the next newcomers really get up to speed faster | time to first change, arrival after arrival |

!!! maturity "Measuring maturity"
    | Level | What I see in the team |
    |---|---|
    | N1 | a colleague welcomes each newcomer and passes on by word of mouth what to know |
    | N2 | a written path (D-5 to D30), per-team access profiles and tasks labelled "first ticket" are ready before the arrival |
    | N3 | access is requested automatically from the team profile, and each newcomer fixes the docs that blocked them without being asked |
    | N4 | the team tracks time to first production change, arrival after arrival, and tunes the path from that number and the day-30 feedback |

    **I measure**: the delay between arrival and the first production change, read in the forge; the number of blockers mentioned in the day-30 retrospective.

## Large-scale migrations

<a class="pill pill-scope pill-scope-code" href="../architecture/#map-of-scales">Scale · Code</a> <a class="pill pill-scope pill-scope-enterprise" href="../architecture/#map-of-scales">Scale · Enterprise</a> <span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

Moving 300 repositories to a new Python version, retiring an internal library used by 60 services: at this scale, a migration is a **programme**, not an instruction sent by email. Three tools:

- the <span class="term" data-term="codemod">codemod</span>: a program that rewrites code automatically while understanding its structure (libcst for Python, OpenRewrite for Java, jscodeshift for JavaScript; creation dates to check). For common cases, existing tools are enough: `pyupgrade`, or ruff rules with `--fix`. Full example [below](#codemod-example-changing-an-import-in-48-repositories);
- the <span class="term" data-term="dependency-update-bot">dependency update bot</span> (Renovate, Dependabot): it automatically opens MRs for each new version of a dependency, an image or a CI component;
- the <span class="term" data-term="migration-campaign">campaign</span>: a public table that tracks each repository (MR opened, CI green, merged).

*Dependabot: competes with Renovate*<br>
*ruff: replaces flake8, black; complements mypy*
{ .tool-rel }


An example Renovate configuration: automatic merge of patches and minor versions when CI is green, human review for major versions.

``` { .json .ex-ref title="Reference" }
{
  "extends": ["config:recommended"],
  "packageRules": [
    {
      "matchUpdateTypes": ["minor", "patch"],
      "automerge": true
    },
    {
      "matchUpdateTypes": ["major"],
      "labels": ["breaking-change"]
    }
  ]
}
```

Preset and option names to check in the Renovate documentation.

<span class="term" data-term="deprecation">Deprecation</span> happens in announced steps. <span class="term" data-term="hyrum-law">Hyrum's law</span> (Hyrum Wright, stated around 2012, popularised by "Software Engineering at Google", Titus Winters, Tom Manshreck and Hyrum Wright, 2020) reminds that with enough users, every observable behaviour is used by someone: the inventory of usages comes first.

!!! noob "As noob"
    I move the kitchen light switch ten centimetres: the lease says nothing about it, but someone used to reach for it in the dark and will now fumble around. Software used by many people always has someone relying on a detail nobody promised (a sort order, an error message, a delay). The takeaway: **before removing something, find out who actually uses it, not just what the documentation says.**

``` { .text .ex-illus title="Illustration" }
month 0     announcement, migration guide, warning on every import of legacy-config
month 1     codemod and automatic MRs in the 48 services that only use 2 functions
month 2     lint rule: no new usage accepted
month 3-5   direct support for the 12 remaining services
month 6     archiving: the library is no longer published
```

Example schedule. The end of the campaign is always the longest part: the last repositories are the most unusual. The team retiring a tool carries a good share of the migration cost, otherwise it does not move (chapters "Large-Scale Changes" and "Deprecation" of Google's book, 2020).

**Risks.** Automatic merge of minors assumes dependencies follow SemVer: a library that breaks in a minor ships to production if CI tests its use poorly; I keep automatic merge for repositories whose tests cover that use. A flood of automatic MRs wears teams out, and they end up ignoring them; I group updates per week and per family. A codemod applied to 300 repositories spreads its mistakes there too: I first run it on a wave of five repositories.

| I want... | I use... |
|---|---|
| my repositories use dozens of dependencies and Docker images, and nobody can follow their new versions by hand | Renovate or Dependabot |
| I must make the same code change in 300 repositories, like replacing an import, without doing it all by hand | a codemod, then one MR per repository, in waves |
| I want to retire an old tool, but I do not know which services still use it | a code search across all repositories, call logs |
| during the migration, new services start using the old tool, so the list to migrate grows instead of shrinking | a warning, then a lint rule |
| I do not want a team to find out on shutdown day that its service depended on the retired tool | a public schedule, steps, a campaign table |

:material-book-open-variant: Reference docs: [Renovate, documentation](https://docs.renovatebot.com/) (accessed November 2026); [Titus Winters et al., "Software Engineering at Google", chapter "Large-Scale Changes"](https://abseil.io/resources/swe-book/html/ch22.html) (2020)
{ .doc-ref }

### Codemod example: changing an import in 48 repositories

The services must move from the `legacy_config` library to `team_config`, which exposes the same `load` function.

``` { .python .ex-good title="Recommended" }
# before
from legacy_config import load

# What changes: same load function, imported from team_config
from team_config import load
```

An <span class="term" data-term="ast-grep">ast-grep</span> rule makes the replacement by reading the structure of the code, not its text: it ignores comments and strings that would contain the same words, and tolerates spacing variations.

!!! noob "As noob"
    `sed` looks for letters, like a word processor's "find and replace"; ast-grep reads sentences, like a proofreader who can tell a verb from a noun. So it replaces the import of `legacy_config`, not the word `legacy_config` lying around in a comment. The takeaway: **the more the shape of the code to change varies, the more I need a tool that understands its structure.**

``` { .yaml .ex-ref title="Reference" }
# rules/legacy-config.yml
# Example: ast-grep rule rewriting the import, whatever names are imported
id: legacy-config-import
language: python
rule:
  pattern: from legacy_config import $$$NAMES
fix: from team_config import $$$NAMES
```

For a case this simple, `sed` is often enough: `git ls-files '*.py' | xargs sed -i 's/^from legacy_config import /from team_config import /'` (GNU sed; on macOS, `sed -i ''`). As soon as the shape varies (`import legacy_config as cfg`, then `cfg.load()`), I need a real codemod, in libcst for example.

Avoid the unanchored replacement across every file: it also changes strings and names containing the same word, like the `legacy_config_overrides.yaml` file read at startup, which becomes `team_config_overrides.yaml` in the code, so it is not found and the service no longer starts.

``` { .bash .ex-bad title="Avoid" }
# Avoid: replaces the word everywhere, not only in imports
git ls-files | xargs sed -i 's/legacy_config/team_config/g'
```

The loop that applies the rule and opens one MR per repository, from a `repos.txt` list (`team-core/orders-service`, `team-core/payments-service`...):

``` { .bash .ex-ref title="Reference" }
# Example: for each repo in repos.txt, applies the rule and opens an MR
RULE="$PWD/rules/legacy-config.yml"
while read -r repo; do
  (
    git clone --depth 1 "git@git.example.com:$repo.git" "work/$repo" && cd "work/$repo" || exit 1
    git switch -c chore/team-config
    ast-grep scan --rule "$RULE" --update-all
    git diff --quiet && exit 0
    git commit -am "refactor: import load from team_config"
    git push -u origin chore/team-config
    glab mr create --fill --label migration-team-config --yes
  )
done < repos.txt
```

```mermaid
flowchart LR
    LIST["repos.txt"] --> CL["clone"]
    CL --> BR["branch<br/>chore/team-config"]
    BR --> AG["ast-grep<br/>--update-all"]
    AG --> Q{"empty diff?"}
    Q -- "yes" --> SKIP["repository skipped"]
    Q -- "no" --> CO["commit, push"]
    CO --> MR["MR with the label<br/>migration-team-config"]
    MR --> TAB["Campaign table"]
```

A repository with no change is skipped; the shared label feeds the campaign table. ast-grep and glab options to check in their documentation. Beyond a few dozen repositories, dedicated tools run the same loop with tracking and retry on error (multi-gitter, Sourcegraph Batch Changes; to check).

:material-book-open-variant: Reference docs: [ast-grep, documentation](https://ast-grep.github.io/) (accessed November 2026); [LibCST, documentation](https://libcst.readthedocs.io/) (accessed November 2026)
{ .doc-ref }

!!! maturity "Measuring maturity"
    | Level | What I see in the team |
    |---|---|
    | N1 | a migration is done by hand, repository by repository, announced by email |
    | N2 | Renovate opens update MRs, and a codemod plus a script loop open one MR per repository with a shared label |
    | N3 | patches and minors merge by themselves when CI is green, and a lint rule refuses any new use of the tool being retired |
    | N4 | the team tracks the campaign board (open MRs, merged, remaining repositories) and dependency age, and decides the waves from those numbers |

    **I measure**: the share of migrated repositories, read in the campaign board from the label; the average version lag of dependencies, read in the Renovate dashboard.

## Measuring without monitoring people

<span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

<a class="pill pill-dora" href="https://dora.dev/capabilities/job-satisfaction/">DORA · Job satisfaction</a> <a class="pill pill-dora" href="https://dora.dev/capabilities/well-being/">DORA · Well-being</a>

The measurement frameworks (<span class="term" data-term="dora-metrics">DORA metrics</span>, SPACE, DevEx) are presented in [Delivery and engineering practices](livraison.md#measuring-developer-experience-space-and-devex). What matters on the DevX side is how to use them:

- **measure teams and systems, never people**: as soon as a number is used to judge someone, it gets gamed, this is <span class="term" data-term="goodhart-law">Goodhart's law</span>;
- **cross two sources**: what tools record (CI duration, review delay) and what developers say in a survey;
- **few indicators, each linked to a possible decision**;
- **a public charter**: what is measured, what it is for, what is off limits.

!!! noob "As noob"
    If I pay a courier per parcel scanned, they scan fast, even badly addressed parcels: the number goes up, the service goes down. A developer judged on commit count does the same: they split their commits without delivering more. The takeaway: **a number used to judge a person stops measuring the work.**

A useful <span class="term" data-term="developer-survey">developer survey</span> is short (under ten minutes), repeated with the same questions, anonymous with an <span class="term" data-term="anonymity-threshold">anonymity threshold</span> (no group with fewer than 5 answers is shown, for example), and followed by a published summary with the actions decided. A survey with no follow-up makes the answers to the next one drop.

| Indicator | Level | Source | What it helps decide |
|---|---|---|---|
| CI duration at p95 | repository, CI template | CI | invest in caching or shards |
| time to first review | team | Git forge | set up a reviewer rotation |
| time to first green test | repository | timing, newcomer | fix the project setup |
| "I get CI results fast enough" (out of 5) | team, at least 5 answers | survey | confirm the gain is felt |
| commits or lines per person | never | none | nothing: refuse it |

| I want... | I use... |
|---|---|
| my management wants to know whether the team's delivery improves from one quarter to the next | the team's DORA metrics, compared with itself |
| I want to know what really bothers developers day to day, beyond what the tools show | a short, regular survey, plus interviews |
| my team spent a month speeding up CI and must show it was worth it | a baseline, then the same measure afterwards |
| someone asks me for a ranking of developers, for example by number of commits | a reasoned refusal and a proposal of team-level measures |

The full loop, from the source of a number to the measure after the project:

```mermaid
flowchart LR
    subgraph SRC["Where the numbers come from"]
        direction TB
        CI["CI: duration, wait,<br/>retries"]
        GIT["Git forge: review<br/>and merge delay"]
        TK["Tickets, incidents"]
        SV["Developer survey"]
    end
    SRC --> CALC["Per-team calculation<br/>tool or script"]
    CALC --> DASH["Per-team dashboard<br/>p50, p95, trend"]
    DASH --> Q{"Which number<br/>hurts the most?"}
    Q --> ACT["Targeted project<br/>cache, shards, review"]
    ACT --> AFTER["Same measure afterwards"]
    AFTER --> DASH
```

**Tooling the measurement.** Computing DORA metrics by hand in a spreadsheet lasts a few weeks. An **<span class="term" data-term="engineering-metrics-platform">engineering metrics platform</span>** automatically collects data from the Git forge, the CI, the ticket tracker and incidents, and computes the indicators per team. Apache DevLake (open source project of the Apache foundation, incubating, to check) is the self-hosted option; there are commercial products (LinearB, Swarmia, DX, for example).

- **When**: once the indicators are chosen and tied to decisions, and manual computation becomes the bottleneck. Not before: a dashboard with no question to answer turns into a surveillance tool.
- **Why**: numbers computed the same way for every team, with no manual entry, and a baseline available before every initiative.
- **How**: plug the sources one at a time, define what a "deployment" and an "incident" are for the tool (that is where numbers go wrong), display per team only, and publish the charter before the first dashboard.

:material-book-open-variant: Reference docs: [Forsgren et al., "The SPACE of Developer Productivity", ACM Queue](https://queue.acm.org/detail.cfm?id=3454124) (2021); [Noda et al., "DevEx: What Actually Drives Productivity", ACM Queue](https://queue.acm.org/detail.cfm?id=3595878) (2023)
{ .doc-ref }

!!! maturity "Measuring maturity"
    | Level | What I see in the team |
    |---|---|
    | N1 | someone pulls CI duration or review delay by hand into a spreadsheet when a question comes up |
    | N2 | a short survey comes back every quarter with the same questions, and indicators are computed per team automatically |
    | N3 | the tool shows nothing per person or below the anonymity threshold, and a public charter says what is measured and what is forbidden |
    | N4 | every DevX initiative starts with a baseline and is judged on the same measure afterwards, cross-checked with the survey |

    **I measure**: the survey response rate from one quarter to the next, read in the survey tool; the share of DevX initiatives with a baseline and an after measure, read in their tickets.

## AI coding assistants

<a class="pill pill-scope pill-scope-code" href="../architecture/#map-of-scales">Scale · Code</a> <span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

!!! info "Section written in November 2026"
    Tools, their terms of use and studies on their effects change very fast. To check at the time of reading.

An <span class="term" data-term="ai-coding-assistant">AI coding assistant</span> joins the DevX tooling like any other tool: a frame (data sent, secrets, accounts), a measured pilot, training in effective uses, and the same rules as before (all merged code is reviewed and passes CI). The concepts are in [AI: agents, skills and context](ia-agents.md) (context, agents) and [Agents: tools, MCP, skills and hooks](ia-capacites.md) (MCP, skills, hooks), measuring team usage in [AI in the enterprise](ia-entreprise.md#measuring-ai-assistant-usage-in-a-team).

Two points specific to DevX:

- **what helps humans helps agents**: one-command setup, fast and targeted tests, an instruction file in the repository (`AGENTS.md`, `CLAUDE.md`) that says how to run the tests. An agent that can check its work in a few seconds stays wrong for less time;
- **measure on the flow, not on activity**: the suggestion <span class="term" data-term="acceptance-rate">acceptance rate</span> comes from the vendor and says nothing about the value delivered.

**Risks.** An assistant receives the code and sometimes the secrets present in open files: without a framework, an API key goes to a third party; I provide a company account with set retention, and a secret scanner runs before the push. Generated code, plausible but wrong, gets through a review that is too quick because it looks clean; the review rule stays the same and MRs stay small. Tracking acceptance rate pushes people to accept more, not to ship better: I measure lead time and failure rate.

| Study | Result | Source reliability |
|---|---|---|
| Sida Peng et al., "The Impact of AI on Developer Productivity: Evidence from GitHub Copilot" (2023) | about 55% faster on a short, isolated task | [Take with caution: preprint, a single task, authors linked to the vendor] |
| METR, "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity" (July 2025) | 19% slower on real tasks, while developers believed they were faster | [Take with caution: 16 developers, early-2025 tools, specific context] |

| I want... | I use... |
|---|---|
| my company just bought an AI coding assistant and wants to roll it out to every team | a written frame, a pilot with a baseline, training |
| someone asks me whether the assistant really makes the team deliver faster, beyond the vendor's numbers | lead time, change failure rate, MR size, survey, with a comparison group |
| I want the AI agents that change my repository to make fewer mistakes and check their own work | the same levers as for humans, plus an instruction file |

:material-book-open-variant: Reference docs: [METR, "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity"](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) (July 2025); [Sida Peng et al., "The Impact of AI on Developer Productivity: Evidence from GitHub Copilot"](https://arxiv.org/abs/2302.06590) (2023)
{ .doc-ref }

!!! maturity "Measuring maturity"
    | Level | What I see in the team |
    |---|---|
    | N1 | a few developers use an assistant with their personal account, with no shared rule |
    | N2 | a written framework (data sent, secrets, accounts) governs the tool provided by the company, and every repository has an instructions file (`AGENTS.md`) |
    | N3 | a secret scanner blocks the push and CI refuses the merge without human review, whether the code comes from a person or an agent |
    | N4 | the team compares lead time, failure rate and MR size with and without the assistant, and tunes training and usage from those numbers |

    **I measure**: lead time and change failure rate of pilot teams, compared to a group without the assistant, read in the forge and the incident tracker; the share of repositories with an instructions file for agents.

## Measuring success

I know the solutions on this page work when developers actually wait less, not when a tool is installed. Before an initiative, I take a baseline over four weeks: for example p95 CI duration or time to first green test. I take the same measure, computed the same way, over the following four weeks. A guard metric must not degrade meanwhile: the change failure rate in production, or the survey score "I get CI results fast enough". The principles of measurement (teams, not people; tools cross-checked with the survey) are in [Measuring without monitoring people](#measuring-without-monitoring-people).

| Solution or situation | Success indicator (SLI) | Likely SLO | Likely SLA |
|---|---|---|---|
| one-command setup, with `doctor` | time between `git clone` and the first green test, timed by each newcomer | under 30 min for 9 newcomers out of 10 | n/a: no external contract |
| faster inner loop | duration of one "edit, see the result" loop on the most frequent action | under 10 s at p95, the threshold where Nielsen places the loss of attention | n/a: no external contract |
| fast and reliable CI | p95 MR pipeline duration, and share of pipelines rerun on the same commit | p95 under 15 min and under 5% reruns, over four rolling weeks | n/a: no external contract |
| preview environment per MR | share of front-end MRs whose environment is ready less than 10 min after the push | 95% of MRs | n/a: no external contract |
| self-service internal platform | availability of deployment through the platform, checked by a test deployment every 5 min | 99.5% per month, about 3 h 36 of tolerated downtime: teams can wait a little, not a whole day | n/a: no external contract (sold outside, it would promise looser, for example 99%) |
| golden path for service creation | delay between the request and the first deployment of a new service | under one day for 9 services out of 10 | n/a: no external contract |
| service catalogue | share of components whose owner still exists | 100%, because a single gap sends an incident alert nowhere | n/a: no external contract |
| onboarding | time to first production change of a newcomer | under 5 working days | n/a: no external contract |

[Take with caution: example orders of magnitude, to set with the business]

!!! noob "As noob"
    The SLO is the time the pizzeria sets for itself in the kitchen, like 25 minutes; the SLA is the promise shown to the customer, "delivered in 40 minutes or it's free", with a penalty. It always aims tighter than what it promises, to keep a margin on rainy evenings. The takeaway: **the SLO is my internal target, the SLA is the looser promise, with a penalty, made to a customer.**

## Pitfalls to avoid

- **Setup never replayed**: I leave the project setup untested, it decays without anyone noticing, and the next newcomer spends two days stuck on a wrong step; I have a weekly CI job replay it on a blank image ([see the setup](#setting-up-a-project-in-one-command)).
- **Volume hiding the dependencies**: I mount the repository in `/app` without realising the volume hides the `.venv` or `node_modules` the image installed, so the application no longer finds its dependencies; I install dependencies outside that folder, or protect them with a dedicated volume ([see Docker Compose](#docker-compose-and-code-mounted-through-a-volume)).
- **Speeding up the wrong job**: I shorten the longest job without looking at runner wait time or the critical path, so the pipeline gains almost nothing; I first lay a real pipeline on a timeline, then fix the wait, the cache and the shard balance ([see CI](#a-fast-and-reliable-ci)).
- **Tolerated flaky tests**: I let tests fail at random, the team learns to rerun without reading the error, and a real red goes unnoticed; I quarantine those tests with an owner and a deadline, and I track the share of pipelines rerun on the same commit.
- **Component included at `@main`**: I include the CI component without a pinned version to avoid MRs, and a single change breaks every project on the same day, with no review and no easy rollback; I pin the version and let a bot open the version bump MRs ([see the CI component](#shared-versioned-ci-component)).
- **Thick template**: I put the whole CI and configuration in the template, and each project stays frozen on its creation day, never receiving the fixes; I keep a thin template and shared, versioned building blocks ([see golden paths](#golden-paths-and-templates)).
- **Portal before a reliable catalogue**: I build a nice portal while deploying still takes a ticket, or I fill the catalogue by hand, and the incident alert goes to a team that no longer exists; I make the data come from the repositories, checked by CI, and the portal comes afterwards ([see the portal](#developer-portal-and-catalogue)).
- **Measuring individuals**: I accept a ranking of developers by commit count, the numbers become a target and get gamed; I measure teams and systems, cross tools with a survey, and publish a charter ([see measuring](#measuring-without-monitoring-people)).

## What interviews ask

The typical questions:

- "How would you measure a team's developer experience?", "What do you answer if you are asked to rank developers by commit count?" How I answer: I cross what the tools record with a short survey, and I measure teams, never individuals ([Measuring without monitoring people](#measuring-without-monitoring-people)).
- "Our CI takes 30 minutes, where do you start?" How I answer: I measure p50, p95, runner wait time and the critical path before touching the jobs, then I mention `needs`, the cache keyed on the lockfile and shards ([A fast and reliable CI](#a-fast-and-reliable-ci)).
- "A newcomer takes two days to run the tests, what do you do?" How I answer: I describe a one-command setup with `doctor`, replayed by CI, and time to first production change as the measure ([Setting up a project](#setting-up-a-project-in-one-command), [Onboarding](#onboarding)).
- "What is an internal platform, and when do you create a platform team?", "Golden path or mandatory rule?" How I answer: I talk about a platform treated as a product, voluntary adoption, the thinnest viable platform, and a paved path a team can leave by taking on the cost of its difference ([Platform engineering](#platform-engineering-the-platform-as-a-product), [Golden paths](#golden-paths-and-templates)).
- "How do you move 300 repositories to a new version without spending a year on it?" How I answer: I mention the codemod, MRs in waves, the update bot, the campaign board and Hyrum's law for the inventory of usages ([Large-scale migrations](#large-scale-migrations)).
- "How would you roll out an AI coding assistant to the teams?" How I answer: I propose a written framework, a pilot measured on flow rather than on acceptance rate, and the same review and CI rules ([AI coding assistants](#ai-coding-assistants)).
- "The product owner waits for staging to validate screens, what do you suggest?" How I answer: one environment per MR for the front end only, wired to integration, with fictitious data, a time to live and a cost cap ([Preview environment](#preview-environment-per-merge-request)).
- "How do you evolve an internal CLI without breaking its users?", "Your tool is used by only three teams out of twenty, what do you do?" How I answer: SemVer as a contract, deprecation before removal, then Rogers and Moore, the switching cost and peer testimony ([SemVer](#semver-the-contract-of-an-internal-library-cli-or-component), [Getting a tool adopted](#getting-a-tool-adopted-without-imposing-it)).
- "How do you know your DevX initiative paid off?" How to answer: a baseline, the same measure afterwards over the same period, a guard metric such as failure rate, and an internal SLO per solution rather than an SLA, since there is no external customer ([Measuring success](#measuring-success)).

What makes a good answer: start from a measured wait (seconds, minutes, days) before suggesting a tool, and say what I would refuse to measure.

## What to use in which situation

| Situation | I use |
|---|---|
| a newcomer needs two days to run the tests of their first project, and has to ask for help at every step | versions in the repository, one-command `setup` and `doctor`, tested by CI |
| every time I change a line locally, I wait two minutes to see the result | hot reload, targeted tests, incremental build |
| my project depends on native libraries that are hard to install, or its data must not leave the cloud | a Dev Container, locally or in a remote environment |
| my CI takes 30 minutes, so every developer switches tasks while waiting for the result | critical path measurement, `needs`, cache keyed on the lockfile, shards |
| developers rerun red pipelines "just to see", without reading the error, because some tests fail at random | flaky test detection, quarantine with an owner |
| the infrastructure team gets the same tickets every week, like "create a database" or "create a repository" | a platform team, self-service with guardrails |
| a team needs three weeks to create a new service ready for production | a golden path with a thin template and versioned blocks |
| services generated long ago kept the old CI and no longer receive fixes | Copier or cruft, and shared components updated by Renovate |
| an alert comes in and nobody knows which team the service belongs to | one catalogue file per repository, checked by CI, then a portal |
| people ask me the same questions every week in the help channel | docs as code, Diátaxis, one page per frequent question |
| I must move 300 repositories to a new version, like a new Python version | codemod, MRs in waves, campaign table |
| I want to retire a tool, but services still use it | inventory, deprecation schedule, migration carried by the retiring team |
| management wants an individual ranking of developers, for example by number of commits | team and system measures, survey, public charter |
| an AI assistant was just bought for every developer, and I am expected to make it save time | a pilot measured on the flow, same review and CI rules |
| my product owner waits for the shared, often broken staging to validate new screens | a preview environment per MR, destroyed on merge |
| I want to rename an option of my internal CLI without breaking other teams' CI scripts | SemVer, deprecation for two minors, removal in a major |
| my new tool pleases the first teams, but the majority does not adopt it | peer testimony, migration MR, built into the template |

## Sources

- Everett Rogers, "Diffusion of Innovations" (1962)
- John Sweller, "Cognitive Load During Problem Solving: Effects on Learning", Cognitive Science (1988)
- Mihaly Csikszentmihalyi, "Flow: The Psychology of Optimal Experience" (1990)
- Geoffrey Moore, "Crossing the Chasm" (1991)
- [Jakob Nielsen, "Response Times: The 3 Important Limits" (1993)](https://www.nngroup.com/articles/response-times-3-important-limits/)
- [Martin Fowler, "Continuous Integration" (2000, revised in 2024)](https://martinfowler.com/articles/continuousIntegration.html)
- [Adam Wiggins, "The Twelve-Factor App" (2011)](https://12factor.net/)
- [Tom Preston-Werner, "Semantic Versioning 2.0.0" (2013)](https://semver.org/spec/v2.0.0.html)
- [GitHub, "Scripts to Rule Them All" (2015)](https://github.com/github/scripts-to-rule-them-all)
- Betsy Beyer et al., "Site Reliability Engineering" (Google, 2016), chapter "Eliminating Toil"
- [Evan Bottcher, "What I Talk About When I Talk About Platforms" (2018)](https://martinfowler.com/articles/talk-about-platforms.html)
- Matthew Skelton and Manuel Pais, "Team Topologies" (2019)
- [Spotify Engineering, "How We Use Golden Paths to Solve Fragmentation in Our Software Ecosystem" (2020)](https://engineering.atspotify.com/2020/08/how-we-use-golden-paths-to-solve-fragmentation-in-our-software-ecosystem/)
- Titus Winters, Tom Manshreck and Hyrum Wright, "Software Engineering at Google" (2020), chapters "Deprecation" and "Large-Scale Changes"
- [Development Containers Specification (2022)](https://containers.dev/)
- [CNCF TAG App Delivery, "Platforms White Paper" (2023, to check)](https://tag-app-delivery.cncf.io/whitepapers/platforms/)
- [Daniele Procida, Diátaxis (publication date not stated, from about 2017)](https://diataxis.fr/)
- [Backstage, Software Templates documentation (read in November 2026)](https://backstage.io/docs/features/software-templates/)
- [Renovate, documentation (read in November 2026)](https://docs.renovatebot.com/)
- [Noda et al., "DevEx: What Actually Drives Productivity", ACM Queue (2023)](https://queue.acm.org/detail.cfm?id=3595878)
- [Sida Peng et al., "The Impact of AI on Developer Productivity: Evidence from GitHub Copilot" (2023)](https://arxiv.org/abs/2302.06590)
- [METR, "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity" (July 2025)](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)
