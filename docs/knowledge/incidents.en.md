# Incidents and incident analysis

!!! warning "Disclaimer"
    These notes are personal cheat sheets, not a source of truth. They reflect my own understanding and choices: their content remains subjective, despite the quotes and references it contains. It may be incomplete, simplified, inaccurate or outdated. Always check the official documentation before applying it. This content is provided as is, without any warranty: you use it at your own risk.

!!! abstract "Scales"
    The colored badges under the headings say at which scale a notion applies:

    - <span class="pill pill-scope pill-scope-code">Code</span> the classes, functions and modules of one program;
    - <span class="pill pill-scope pill-scope-app">Application</span> one service or application and its internal split;
    - <span class="pill pill-scope pill-scope-system">System</span> several services talking to each other over the network;
    - <span class="pill pill-scope pill-scope-infra">Infrastructure</span> servers, network, zones and clusters, physical or virtual;
    - <span class="pill pill-scope pill-scope-enterprise">Enterprise</span> the whole information system and its organization.

    Details and ambiguous words: [map of scales](architecture.md#map-of-scales).

Customers have not been able to pay on my site for ten minutes: that is an incident. An <span class="term" data-term="incident">incident</span> is the moment a real service stops doing what it should. This page covers two things: how to get through it (detect, coordinate, communicate, restore) and how to get something out of it (analyse, follow up on actions, learn from one incident to the next). It ends with the health of the <span class="term" data-term="on-call">on-call</span> rotation and the exercises that prepare for the next one.

The French word "incidentologie" has no exact English equivalent. English speakers say *incident management* (handling the incident while it happens), *incident analysis* (studying it afterwards) or *learning from incidents* (the movement that treats incidents as a source of learning).

<span class="term" data-term="alert-monitoring">Alerts</span>, <span class="term" data-term="slo">SLOs</span> and the <span class="term" data-term="error-budget">error budget</span> are explained on the [Observability](observabilite.md#objectives-and-alerts) page: this page builds on them without defining them again. The `orders-service`, `payments-service` and `my-api` services, the people ada, grace, alan and linus, and all the figures are examples.

:material-swap-horizontal: The tools mentioned on this page: which ones replace each other, which ones combine? See [Complementary or competing](outils.md#complementary-or-competing).
{ .doc-ref }

## Terminology

**Incident**: an interruption or degradation of a service used by real users, which calls for a quick response. A known bug with no ongoing impact is not an incident: it is a ticket.

**Severity**: the <span class="term" data-term="incident-severity">seriousness level</span> of an incident (SEV1, SEV2...), decided by criteria written in advance. It says who gets called and how often we communicate. Not to be confused with bug severity, which judges a defect, not an ongoing situation.

**On-call**: the person on duty must be able to answer an alert at any hour, for a given period, often a week.

**Mitigation**: the quick action that reduces the impact before the cause is understood: <span class="term" data-term="rollback">going back to the previous version</span>, turning a feature off with a <span class="term" data-term="feature-flag">feature flag</span>, failing over to another zone.

**MTTD, MTTA, MTTR**: three average durations measured over a series of incidents.

```
14:00  the problem actually starts
14:12  an alert fires                     MTTD: 12 min (Mean Time To Detect)
14:15  the on-call person takes it        MTTA: 3 min  (Mean Time To Acknowledge)
14:40  the service is restored            MTTR: 40 min (Mean Time To Restore)
```

<span class="term" data-term="mttd">MTTD</span> counts from the real start, <span class="term" data-term="mtta">MTTA</span> from the alert. The R in <span class="term" data-term="mttr">MTTR</span> has several readings depending on the source (restore, recover, repair, resolve): always write down which one is measured.

**Postmortem**: the <span class="term" data-term="postmortem">document written after an incident</span>, which tells what happened, why it was possible, and what we change. Also written "post-mortem", or called an "incident review".

**Contributing factor**: a <span class="term" data-term="contributing-factor">condition</span> that made the incident possible or worse, without being its only cause. Example: "no alert on message age" did not cause the outage, but made it last 30 minutes longer.

**Near miss**: an <span class="term" data-term="near-miss">event</span> that could have caused an incident but had no impact, by luck or thanks to someone. Example: a migration that would have locked the orders table, stopped in pre-production because ada noticed how long it took.

:material-book-open-variant: Reference docs: [Atlassian, Common incident management metrics](https://www.atlassian.com/incident-management/kpis/common-metrics) (accessed November 2026)
{ .doc-ref }

## The lifecycle of an incident

<a class="pill pill-scope pill-scope-system" href="../architecture/#map-of-scales">Scale · System</a> <a class="pill pill-scope pill-scope-infra" href="../architecture/#map-of-scales">Scale · Infrastructure</a> <span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

<a class="pill pill-practice" href="../observabilite/" title="level 2: it is automated">Practice · Observability · L2</a>
<a class="pill pill-dora" href="https://dora.dev/capabilities/proactive-failure-notification/">DORA · Proactive failure notification</a>

An incident goes through five stages. The core rule: **mitigate before fixing**. I restore the service first with the safest move, and understand afterwards. If payments fail right after a deployment, I first go back to the previous version, and look for the reason once customers are out of trouble.

!!! noob "As noob"
    It is the plumber facing a leak: first they shut off the water, then they look for which pipe gave way. The one thing to remember: **restore the service first, understand the cause afterwards.**

```mermaid
flowchart LR
  D[Detection<br/>alert or report] --> T[Triage<br/>severity, roles]
  T --> M[Mitigation<br/>rollback, flag, failover]
  M --> R[Resolution<br/>cause fixed, monitoring]
  R --> A[Analysis<br/>postmortem, actions]
  A -.-> D
```

| Stage | Question | Expected output |
|---|---|---|
| Detection | is something wrong? | an alert, ideally before customers notice |
| Triage | how bad is it, who should come? | a severity, a person who coordinates, a channel |
| Mitigation | how do we stop the damage now? | customer impact stopped, even without knowing the cause |
| Resolution | is the service back to normal? | indicators back, cause fixed or durably worked around |
| Analysis | what made it possible? | a postmortem and a few tracked actions |

I can learn there is a problem from an alert, from a support ticket or from a colleague who warns me. The goal is for automatic signals to fire before customers complain; the share of incidents "detected by customers" is tracked in the [incident review](#learning-from-incidents-at-scale).

```mermaid
flowchart LR
  subgraph AUTO["Automatic signals, before customers"]
    S1["Alert on an SLO<br/>burn rate"]
    S2["Synthetic probe<br/>replayed journey"]
    S3["Error tracking<br/>new exception"]
    S4["Failing canary<br/>during a deployment"]
  end
  subgraph HUM["Human signals, often after"]
    S5["Support ticket"]
    S6["Colleague, social media"]
    S7["A provider's<br/>status page"]
  end
  S1 & S2 & S3 & S4 --> O["On-call tool<br/>pages the on-call"]
  S5 & S6 & S7 --> M["Manual<br/>declaration"]
  O --> T["Triage"]
  M --> T
```

Example timeline, on a Tuesday:

```
14:02  orders-service v2.14 deployed (new shipping fee calculation rule)
14:06  payment error rate goes from 0.2 % to 9 %
14:09  alert "5 % of payments failing for 3 min", linus (on-call) takes it
14:11  linus opens the #inc-payments channel, classifies SEV2, grace coordinates
14:14  grace decides to roll back to v2.13 without waiting for the cause
14:19  rollback done, error rate at 0.3 %
14:20  ada posts "service restored, monitoring in progress" on the status page
14:50  no relapse, incident closed; 312 failed payments (example) to retry
D+3    postmortem reviewed with the team, 3 actions opened
```

Here, MTTD: 7 minutes, MTTA: 0, restoration: 17 minutes. The failed payments still have to be handled after the impact ends: resolution includes repairing the affected data, not only bringing the service back.

Rolling back is not always possible. If v2.14 contained a migration that drops a column, v2.13 no longer works. Hence the rule of keeping migrations compatible with two versions (see [Expand / contract](sql.md#expand-contract): renaming a column in five deployments, each one reversible).

:material-book-open-variant: Reference docs: [Google SRE Workbook, Incident Response](https://sre.google/workbook/incident-response/) (2018); [PagerDuty Incident Response](https://response.pagerduty.com/) (accessed November 2026)
{ .doc-ref }

## Severity levels

<span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

A severity grid makes two people classify the same incident the same way, at 3 a.m., without debate. It is written with product and support, with observable criteria, not with "this is bad".

!!! noob "As noob"
    It is triage in the emergency room: the nurse sorts each patient with fixed criteria (are they breathing, are they bleeding?), not with a gut feeling, and that sorting decides who is seen and how fast. The one thing to remember: **severity is read from a grid written in advance, not from the emotion of the moment.**

| Level | Criterion (example) | Who comes | Communication | Postmortem |
|---|---|---|---|---|
| SEV1 | critical journey down for everyone, data loss or leak | on-call, incident commander within 15 min, management informed | every 30 min | mandatory |
| SEV2 | critical journey degraded, or down for some customers | on-call and incident commander | every hour | mandatory |
| SEV3 | secondary feature affected, workaround available | owning team, business hours | team channel | optional |
| SEV4 | no customer impact (near miss) | ticket | none | grouped review |

The grid read as a decision tree (criteria from the example):

```mermaid
flowchart TD
  Q1{Are customers<br/>affected right now?} -->|no| S4[SEV4<br/>ticket]
  Q1 -->|yes| Q2{Critical journey<br/>or data affected?}
  Q2 -->|"no, workaround exists"| S3[SEV3<br/>owning team]
  Q2 -->|yes| Q3{Down for everyone,<br/>data loss or leak?}
  Q3 -->|"no, degraded or partial"| S2[SEV2<br/>on-call + commander]
  Q3 -->|yes| S1[SEV1<br/>commander within 15 min]
  Q2 -->|"when in doubt"| Q3
```

Three rules that avoid debates:

- **when in doubt, classify higher**: lowering a severity costs a few minutes, underestimating costs the communication cadence;
- **severity can change** during the incident, and each change is written in the timeline;
- **severity measures impact, not effort**: a one-line fix can close a SEV1.

The number of levels varies between organizations (three to five, sometimes numbered the other way round). What matters is that each level triggers different actions; two levels that trigger the same thing can be merged.

:material-book-open-variant: Reference docs: [PagerDuty, Severity Levels](https://response.pagerduty.com/before/severity_levels/) (accessed November 2026); [Atlassian, Incident severity levels](https://www.atlassian.com/incident-management/kpis/severity-levels) (accessed November 2026)
{ .doc-ref }

## Roles during the incident

<span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

The roles come from the **Incident Command System** (ICS), created in the 1970s by California firefighters to coordinate several agencies on large wildfires. Operations teams adopted it, for example in the "Managing Incidents" chapter of the book "Site Reliability Engineering" (Google, 2016).

!!! noob "As noob"
    It is a kitchen in the middle of the rush: the head chef does not cook, they call out orders and share the work, and a single waiter talks to the guests. The one thing to remember: **whoever coordinates does not hunt the fault, and those hunting it do not talk to the outside.**

| Role | Does | Does not |
|---|---|---|
| <span class="term" data-term="incident-commander">Incident commander</span> | decides, prioritizes, hands out work, declares the end | debug personally |
| Communication | updates the status page, answers support and management | interrupt the experts |
| <span class="term" data-term="incident-scribe">Scribe</span> | writes down facts and decisions with the time | interpret or judge |
| Experts (operations) | investigate and apply the decided actions | start a change without announcing it |

Who talks to whom during the example incident: everything goes through the incident commander, and experts never talk to the outside directly.

```mermaid
flowchart TD
  IC[grace<br/>incident commander]
  IC <--> COM[ada<br/>communication]
  IC <--> SC[alan<br/>scribe]
  IC <--> EX[linus and experts<br/>operations]
  COM --> SP[status page]
  COM --> SUP[support, management]
  SC --> TL[timeline]
  EX --> PROD[production]
```

On a small incident, one person holds several roles. As soon as more than two or three people are involved, at least separate coordination from investigation: someone with their hands in the logs no longer sees the whole picture.

The incident commander is not necessarily the most expert or the most senior. It is the person who was designated, and they can hand over explicitly ("grace, can you take over coordination?"), which is written in the timeline.

:material-book-open-variant: Reference docs: [Google SRE book, Managing Incidents](https://sre.google/sre-book/managing-incidents/) (2016); [PagerDuty, Incident Commander training](https://response.pagerduty.com/training/incident_commander/) (accessed November 2026)
{ .doc-ref }

## Communicating

<span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

During an incident, support, customers and management want to know where things stand. Without news, they write straight to the people who are investigating, who then spend their time answering instead of searching. So silence costs more than bad news. A <span class="term" data-term="status-page">status page</span> and a fixed cadence solve both problems: everyone knows where to read the information, and when the next update comes.

Simple rules:

- **an announced cadence**, kept even when there is nothing new ("still in progress, next update at 15:00");
- **facts, not hypotheses**: what users experience, what we are doing, the next update;
- **one channel per incident**, and one person who talks to the outside;
- **the user's vocabulary**: "card payments are failing", not "the payments pod is in CrashLoopBackOff".

Message template:

```
[SEV2] Card payments failing: in progress
Impact     : about 9 % of card payments have been failing since 14:06.
             Other payment methods work.
Action     : rollback to the previous version in progress.
Workaround : retry in a few minutes, or pay by bank transfer.
Next update: 14:45 at the latest.
```

The closing message says what was affected, for how long, whether data needs repairing, and when the postmortem summary will be shared.

:material-book-open-variant: Reference docs: [Atlassian, Incident communication](https://www.atlassian.com/incident-management/incident-communication) (accessed November 2026)
{ .doc-ref }

### Tooling for incident management

<span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

!!! info "Section written in November 2026"
    Incident management tools change fast (acquisitions, AI features added every year). The names given are examples, their features are to check at the time of reading.

An incident management tool (incident.io, PagerDuty, Opsgenie, FireHydrant, Rootly) automates the administrative part of everything above, so that people can focus on the diagnosis. PagerDuty and Opsgenie grew out of on-call (receive the alert, page the right person, handle the <span class="term" data-term="escalation-policy">escalation</span>) and added coordination; incident.io started from coordination in the chat tool (Slack, Teams) and added on-call. Atlassian announced the end of sale of Opsgenie in favor of Jira Service Management and Compass (2025 announcement, to check).

*PagerDuty: competes with Opsgenie; complements Alertmanager*<br>
*Opsgenie: competes with PagerDuty; complements Alertmanager*<br>
*Jira: complements Confluence, Slack*
{ .tool-rel }


| What the tool automates | Without a tool | With a tool |
|---|---|---|
| channel | someone creates `#inc-payments` and invites people by hand | one command (`/inc declare`) creates the channel, invites the on-call person and the owning team |
| roles | "who is coordinating?" in the thread | the <span class="term" data-term="incident-commander">incident commander</span> and the communication lead are assigned and shown at the top of the channel |
| timeline | the scribe copies the time of every message | flagged messages, severity changes and alerts form the timeline |
| status page | someone logs into another tool to publish | updated from the channel, with a reminder at the agreed cadence |
| postmortem draft | facts are reconstructed two days later | a document prefilled with the timeline, the people and the durations |
| follow-up | actions get lost in the channel | actions create tickets, the incident is closed once they are tracked |

**When**: several incidents a month, several teams working together, a public status page, or on-call to organize over several rotations. **Not yet**: a single team with one incident a quarter; a message template, a channel created by hand and a postmortem template are enough, and teach the process before automating it.

**Why**: during an incident, every administrative step is done by someone who should be thinking, and a timeline rebuilt after the fact is always incomplete. The gain: a process followed even at 3 am by someone going through it for the first time, and data (durations, severities, patterns) for [learning at scale](#learning-from-incidents-at-scale). The cost: a license often per user, and the risk of automating a process nobody has understood yet.

**How**: write the process first (severity grid, roles, cadence), then configure it in the tool, then try it during a [game day](#practicing-game-days-and-chaos-engineering) before the first real incident.

## Runbooks and playbooks

<a class="pill pill-scope pill-scope-system" href="../architecture/#map-of-scales">Scale · System</a> <a class="pill pill-scope pill-scope-infra" href="../architecture/#map-of-scales">Scale · Infrastructure</a> <span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

An alert wakes the on-call person at 3 a.m., on a service they barely know: they need to know what to do without working everything out from scratch. A <span class="term" data-term="runbook">runbook</span> is a written, step-by-step procedure for a known alert or failure. A <span class="term" data-term="playbook">playbook</span> is broader: it describes how to handle a family of situations (a data leak, a supplier outage), with the roles and the decisions to make. The two words overlap depending on the team.

!!! noob "As noob"
    The runbook is the quick-reference card taped to the machine ("if the red light blinks, do 1, 2, 3"); the playbook is the building's emergency plan, saying who does what for a whole family of situations. The one thing to remember: **a runbook is followed at 3 a.m. without thinking, a playbook organizes a response.**

```markdown
# Runbook: "payments-events" queue growing

Alert : oldest message > 5 min (link to the dashboard)
Impact: payment confirmations arrive late

1. Check the consumers: `kubectl get pods -l app=payments-consumer`
2. If pods are restarting in a loop: read the logs, then roll back the last deployment
3. If pods are healthy but slow: scale to 6 replicas
   `kubectl scale deploy/payments-consumer --replicas=6`
4. If the queue goes over 50,000 messages: tell the incident commander (SEV2)
5. Do not purge the queue: the messages are real payments

Owner: team-payments; last reviewed: 2026-09-14
```

What makes a runbook useful:

- **a link from the alert**: the person who was woken up should not have to search for it;
- **copyable commands** and what I should see if they work;
- **what not to do**, often more valuable than the rest;
- **a review date**: a wrong runbook is worse than no runbook.

When a runbook step is applied identically every time, it is a candidate for automation. If an alert cannot have a runbook ("nothing to do"), it may not deserve to be an alert (see [Alert on symptoms](observabilite.md#alert-on-symptoms-not-on-causes)).

## The blameless postmortem

<span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

<a class="pill pill-dora" href="https://dora.dev/capabilities/learning-culture/">DORA · Learning culture</a>

A <span class="term" data-term="blameless">blameless</span> postmortem looks for what in the system made the error possible, not for who made it. The idea was popularized by John Allspaw, "Blameless PostMortems and a Just Culture" (Etsy engineering blog, 2012), then by the "Postmortem Culture: Learning from Failure" chapter of the book "Site Reliability Engineering" (Google, 2016). The reason is practical: if people risk sanctions, they hide the details, and the details are what allow a fix.

!!! noob "As noob"
    After an aviation incident, the investigation does not try to punish the pilot, but to understand why the cockpit made the mistake possible; otherwise pilots hide their mistakes and nobody learns. Limit: blameless does not mean nobody is accountable, every action still has an owner. The one thing to remember: **when nobody is punished, people tell what really happened.**

Two ideas guide the analysis:

- **several factors, not one root cause**: a <span class="term" data-term="root-cause-analysis">root cause analysis</span> that stops at "linus deployed a bug" changes nothing. There are almost always several aligned <span class="term" data-term="contributing-factor">contributing factors</span> (James Reason's "Swiss cheese" model, "Human Error", 1990, pictures these layers of defense that each have a hole);
- **what made sense at the time**: the person acted on the information they had. Ask "what made you think it was safe?" rather than "why didn't you check?" (Sidney Dekker, "The Field Guide to Understanding Human Error", 2006).

The Swiss cheese drawn for an example incident (payments with an expired card fail silently): four layers of defense, each with a hole, and the holes aligned.

```
               hole
code review  ══════ ════════════   the review reads the diff, not the changed config file
tests        ══════ ════════════   no test with an expired card
canary       ══════ ════════════   5% of traffic for 10 min: too few expired cards
alert        ══════ ════════════   threshold at 10% failures, the incident peaks at 9%
                   |
                   v
            incident in production
```

Plugging a single hole is enough to stop this bug; the postmortem looks for one action per layer, not one culprit per layer.

Filled-in template, for the timeline of the section [The lifecycle of an incident](#the-lifecycle-of-an-incident):

```markdown
# Postmortem: card payments failing, 2026-10-13 (SEV2)

Summary (5 lines max)
  From 14:06 to 14:19, about 9 % of card payments failed after the
  deployment of orders-service v2.14. 312 payments to retry, no data loss.
  Restored by rollback. Detected by an alert, before any customer report.

Roles: grace (coordination), ada (communication), alan (scribe), linus (on-call)

Timeline: see the #inc-payments channel (timestamped by alan)

Contributing factors
  1. The new fee rule sends an amount with 3 decimals; payments-service
     only accepts 2. No contract test between the two services.
  2. The deployment went to 100 % at once: no canary on orders-service.
  3. The 312 failed payments had no automatic retry.

What went well: alert in 3 min, rollback in 5 min, status page kept up to date.
Where we got lucky: deployment during business hours, low traffic.

Actions
  | Action                                          | Type      | Owner         | Due   |
  | orders/payments contract test on the amount     | prevent   | team-orders   | D+15  |
  | 5 % canary for 10 min on orders-service         | mitigate  | team-core     | D+30  |
  | automatic retry of failed payments              | repair    | team-payments | D+30  |
```

Good practices:

- **written within a few days**, while memories are fresh; reviewed in a meeting with the people involved;
- **a summary at the top**, readable in 30 seconds by someone who was not there;
- **few actions**, each with an owner, a due date and a completion criterion;
- **"human error" is never a conclusion**: it is the starting point of the next question.

:material-book-open-variant: Reference docs: [Google SRE book, Postmortem Culture](https://sre.google/sre-book/postmortem-culture/) (2016); [Google SRE Workbook, Postmortem Culture](https://sre.google/workbook/postmortem-culture/) (2018)
{ .doc-ref }

## Following up on actions

<span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

My team writes a good postmortem with three actions, then everyone goes back to their tickets, and six months later the same outage comes back. A postmortem whose actions stay open only served to write a document. Actions are real work: they go into the owning team's backlog, not into the document.

| Action type | Goal | Example |
|---|---|---|
| detect | see it earlier | alert on message age |
| mitigate | reduce the impact next time | <span class="term" data-term="canary-deployment">canary</span>, <span class="term" data-term="kill-switch">kill switch</span>, runbook |
| prevent | stop it from happening again | <span class="term" data-term="contract-test">contract test</span>, validation in CI |
| repair | fix the damage of this incident | retry of the failed payments |

The path of an action, from the incident to its closure:

```mermaid
flowchart LR
  I[Incident closed] --> D[Postmortem draft<br/>within a few days]
  D --> R[Review meeting<br/>with the people involved]
  R --> B[Actions in the backlog<br/>owner, due date]
  B --> M{Monthly review}
  M -->|"done"| C[Action closed]
  M -->|"late"| B
  M -->|"slips 3 times"| A[Accepted risk,<br/>written down]
```

Light tracking is often enough: a fifteen-minute monthly review of overdue actions, presented by the teams themselves, and a simple indicator, the share of actions closed on time. An action that slips three times is an implicit decision not to do it: write it down as an accepted risk rather than letting it drag on.

## Learning from incidents at scale

<span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

A postmortem looks at one incident. Useful learning often comes from reading **several** incidents together: a pattern that keeps coming back is a system problem, not bad luck. For example, three outages out of five reported by customers are not three strokes of bad luck, they are a gap in detection.

```
5 incidents over 6 months, read together (example)

incident                         detected by          pattern
1. bulk import by one customer   customers, 25 min    shared resource with no limit
2. bad config everywhere         alert, 4 min         change applied to everyone at once
3. tax API unavailable           customers, 35 min    non-critical dependency on the critical path
4. expired certificate           customers, 20 min    unmonitored deadline
5. migration that locks          alert, 3 min         change applied to everyone at once

finding: 3 out of 5 detected by customers; 2 out of 5 share the same pattern
```

Practices that help:

- **a quarterly review** of incidents by theme (detection, deployment, dependencies), not by team;
- **collect <span class="term" data-term="near-miss">near misses</span>**: they show the same weaknesses without the cost of an outage, and people talk about them more willingly;
- **also look at what works**: why most deployments go fine, which adaptations by people prevent outages every week;
- **turn a pattern into an architecture decision**, written in an <span class="term" data-term="adr">ADR</span> and checked automatically.

This movement is called **Learning from Incidents** (community started by Nora Jones in 2019, to check). It draws on safety research, in particular Richard Cook, "How Complex Systems Fail" (1998): a complex system always runs in a partially degraded mode, and people are what keep it running.

:material-book-open-variant: Reference docs: [Learning from Incidents in Software](https://www.learningfromincidents.io/) (accessed November 2026); [Richard Cook, "How Complex Systems Fail"](https://how.complexsystems.fail/) (1998)
{ .doc-ref }

## Metrics and their limits

<span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

My management wants a number to know whether incidents are getting better, and the average duration looks like the simplest one to follow. Yet it is a poor guide, for the reasons in the table.

| Metric | What it tells | Limit |
|---|---|---|
| MTTD | are incidents seen quickly? | only counts the incidents that were detected |
| MTTA | does on-call respond? | easy to inflate by acknowledging without acting |
| MTTR | do incidents last long? | average crushed by a few long incidents |
| number of incidents | the general trend | goes down if fewer are declared, not if fewer happen |
| recurring incidents | do the actions work? | requires linking incidents together |
| actions closed on time | is follow-up real? | does not say whether the action was the right one |

The trouble with MTTR: incident durations do not follow a bell curve. Most are short, a few are very long, and the average mostly moves at random from one quarter to the next.

!!! noob "As noob"
    It is the average income in a café when a billionaire walks in: the average shoots up while nobody else changed. A single very long incident does the same to the MTTR. The one thing to remember: **for incident durations, the median and the list say more than the average.**

```
8 incidents this quarter (example), in minutes: 6, 9, 12, 15, 18, 22, 30, 410
mean: 65 min    median: 16.5 min
without the 410 min incident: mean 16 min
```

The VOID Report (Courtney Nash, Verica, 2021 then 2022, to check), built from thousands of public incidents, concludes that these durations are too spread out for an average MTTR to be a good indicator. Štěpán Davidovič, "Incident Metrics in SRE" (Google and O'Reilly, 2021, to check), reaches a similar conclusion through simulation. [Take with caution: both conclusions are summarized here without first-hand verification.]

What works better: look at the list of incidents rather than the average, track the median and the worst case, and set no numeric target on a duration. A target on MTTR pushes people to close incidents too early or to misclassify them (<span class="term" data-term="goodhart-law">Goodhart's law</span>). On the DORA side, the recovery metric covers failed deployments, not all incidents (*failed deployment recovery time* since the 2023 report, to check; see [Delivery](livraison.md#measuring-delivery-dora)).

:material-book-open-variant: Reference docs: [The VOID](https://www.thevoid.community/) (accessed November 2026); [Štěpán Davidovič, "Incident Metrics in SRE"](https://sre.google/resources/practices-and-processes/incident-metrics-in-sre/) (2021)
{ .doc-ref }

## Sustainable on-call

<span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

An on-call rotation that wears people out ends up losing its experienced people, and tired people make more mistakes during incidents. <span class="term" data-term="alert-fatigue">Alert fatigue</span> is the first sign: too many alerts, many with no action, until the real ones get ignored.

!!! noob "As noob"
    It is the boy who cried wolf: after ten false alarms nobody gets up, even on the day the wolf is really there. The one thing to remember: **every alert with no action makes the next one less heard.**

Guidelines (to adapt):

| Topic | Guideline |
|---|---|
| rotation size | enough people not to be on duty more than one week in four or five (example) |
| load | Google's SRE book (2016) aims for at most two incidents per 12-hour shift (to check) |
| alerts | every alert that wakes someone up must require human action; otherwise delete it or turn it into a ticket |
| <span class="term" data-term="escalation-policy">escalation</span> | if on-call does not respond within 10 min (example), the alert goes to a second person |
| compensation | bonus, time off or both, depending on the country's labor law (to check locally) |
| handover | a 15-minute meeting at the end of the week: alerts received, ongoing actions, noise to fix |

A typical escalation policy, played out over time (example delays):

```mermaid
sequenceDiagram
  participant A as Alert
  participant O as On-call tool
  participant L as linus (primary)
  participant G as grace (secondary)
  participant M as team lead
  A->>O: failing payments > 5 %
  O->>L: push notification, then call
  Note over O,L: no acknowledgement within 10 min
  O->>G: escalation level 2
  Note over O,G: still nothing within 10 min
  O->>M: escalation level 3
  G-->>O: acknowledgement
```

Health indicators to track as closely as MTTR: number of alerts per shift, out-of-hours pages per person, share of alerts with no action. If the on-call person spends the week fighting fires, they do no project work: that is planned, not a failure.

:material-book-open-variant: Reference docs: [Google SRE book, Being On-Call](https://sre.google/sre-book/being-on-call/) (2016); [Google SRE Workbook, On-Call](https://sre.google/workbook/on-call/) (2018)
{ .doc-ref }

## Practicing: game days and chaos engineering

<a class="pill pill-scope pill-scope-system" href="../architecture/#map-of-scales">Scale · System</a> <a class="pill pill-scope pill-scope-infra" href="../architecture/#map-of-scales">Scale · Infrastructure</a> <span class="pill pill-status pill-status-ok" title="Still valid, checked November 2026">Current · 11/2026</span>

Finding out during a SEV1 that the runbook points to a deleted dashboard, or that the alert does not fire, is too late: customers are already suffering the outage. These gaps are found by practicing.

**<span class="term" data-term="game-day">Game day</span>**: a planned exercise where the team causes a failure, in a chosen environment, and handles it like a real incident. The practice is often credited to Jesse Robbins at Amazon in the mid-2000s (to check).

**<span class="term" data-term="chaos-engineering">Chaos engineering</span>**: experimenting on a system to build confidence in its ability to withstand failures. Netflix popularized it with Chaos Monkey (announced in 2011, to check), which shut down servers at random. The "Principles of Chaos Engineering" (principlesofchaos.org, 2015, to check) sum it up in four steps: define a measurable steady state, form a hypothesis, inject a real-world event, look for a difference.

!!! noob "As noob"
    It is a fire drill: I ring the alarm on a quiet day, to find out the emergency exit is blocked before the real fire. Chaos engineering goes further and really cuts off a piece of the system to check that the rest holds. The one thing to remember: **I cause the failure on purpose, in small doses and under control, so I do not discover it for real.**

```mermaid
flowchart LR
  S[Measurable<br/>steady state] --> H[Hypothesis<br/>steady state holds]
  H --> I[Inject<br/>a real failure]
  I --> D{Difference from<br/>steady state?}
  D -->|no| C[More confidence,<br/>widen the scope]
  D -->|yes| A[Weakness found,<br/>actions]
  A --> S
  C --> S
```

```
Game day, pre-production, Thursday 10:00 (example)
Hypothesis : if payments-service goes down, orders-service queues the payments
             and the "payments pending" alert fires within 5 min.
Injection  : payments-service scaled to 0 replicas for 15 min.
Observed   : queue OK; the alert fired at 11 min (threshold set wrong);
             the runbook pointed to a deleted dashboard.
Actions    : threshold fixed, runbook updated, replay in a month.
```

Start small: a tabletop exercise (walk through a scenario out loud, breaking nothing), then a failure in pre-production, then, once the team is confident, a limited experiment in production with a stop criterion.

A tabletop exercise fits on one page: the facilitator announces events one at a time, the team says what it does, and I note the decisions that hesitate (example, 45 min, nothing is broken):

| Minute | The facilitator announces | Expected decision |
|---|---|---|
| 0 | "the 'payment failures > 5%' alert fires" | on-call acknowledges and opens the incident channel |
| 5 | "9% failures since the orders-service v2.14 deployment" | SEV2, an incident commander is named |
| 10 | "the rollback fails: the migration is not reversible" | another mitigation: switch off the new flow's feature flag |
| 20 | "support reports 40 customer tickets" | the communications person updates the status page |
| 30 | "the failure rate is back to 0.2%" | end of incident declared, postmortem scheduled |

Every missed decision (nobody knew who publishes the status page) becomes an action, as after a real incident.

:material-book-open-variant: Reference docs: [Principles of Chaos Engineering](https://principlesofchaos.org/) (2015, to check); [Netflix, Chaos Monkey](https://netflix.github.io/chaosmonkey/) (accessed November 2026)
{ .doc-ref }

## Pitfalls to avoid

- **Looking for the cause before mitigating**: payments fail right after a deployment, and I dig through the logs to understand. Meanwhile, customers keep suffering the outage. I first roll back to the previous version or turn off the feature flag, and investigate afterwards ([see The lifecycle](#the-lifecycle-of-an-incident)).
- **Classifying too low out of caution**: I hesitate between SEV2 and SEV3 and pick the lower one. The right people are not paged and the communication cadence is missing. When in doubt, I classify higher: going back down costs a few minutes ([see Severity levels](#severity-levels)).
- **Coordinating while debugging**: I am the incident commander and I have my hands in the logs. I lose the big picture, and several people each try their own fix without telling the others. As soon as more than two or three people are involved, I separate coordination from investigation ([see Roles](#roles-during-the-incident)).
- **Silence while there is nothing new**: I give no news because nothing has moved. Support and management write directly to the people investigating, who spend their time answering. I announce a cadence and keep it, even to say "still in progress" ([see Communicating](#communicating)).
- **A runbook never reviewed**: my runbook points to a deleted dashboard. The person woken up at 3 a.m. follows a wrong procedure, which is worse than no runbook. I date each review, link the runbook from the alert and try it in a game day ([see Runbooks and playbooks](#runbooks-and-playbooks)).
- **"Human error" as a conclusion**: my postmortem stops at "linus deployed a bug". Nothing changes in the system, and next time people keep details to themselves out of fear. I look for several contributing factors and one action per layer of defence ([see The postmortem](#the-blameless-postmortem)).
- **Actions left in the document**: the postmortem lists three actions, then everyone goes back to their tickets. Six months later, the same outage comes back. I put the actions in the backlog, with an owner, a due date and a monthly review of late ones ([see Following up on actions](#following-up-on-actions)).
- **A numeric target on MTTR**: I promise management to lower the average incident duration. A single long incident crushes the average, and the target pushes people to close too early or misclassify. I follow the list of incidents, the median and the worst case ([see Metrics and their limits](#metrics-and-their-limits)).

## What interviews ask

The typical questions:

- "Tell me about an incident you handled. What did you do first?" How I answer: I walk through the timeline and show that I mitigated before looking for the cause ([The lifecycle of an incident](#the-lifecycle-of-an-incident)).
- "How do you decide the severity of an incident?", "Who does what during an incident?" How I answer: I talk about observable criteria written in advance and an incident commander who coordinates without debugging ([Severity levels](#severity-levels), [Roles during the incident](#roles-during-the-incident)).
- "What is a blameless postmortem?", "How do you make sure the actions get done?" How I answer: I talk about contributing factors rather than one root cause, and actions tracked in the backlog ([The blameless postmortem](#the-blameless-postmortem), [Following up on actions](#following-up-on-actions)).
- "Is MTTR a good indicator?" How I answer: I show that one long incident crushes the average, and suggest the median, the worst case and recurring incidents ([Metrics and their limits](#metrics-and-their-limits)).
- "How do you make on-call sustainable?", "What do you do with an alert that fires for nothing?" How I answer: I talk about alerts that always require an action, rotation size and handover ([Sustainable on-call](#sustainable-on-call)).
- "Have you ever run a game day or done chaos engineering?" How I answer: I describe a tabletop exercise then an outage in pre-production, with hypothesis, observation and actions ([Practicing](#practicing-game-days-and-chaos-engineering)).

What makes a good answer: a lived (or realistic) story told in the order detection, mitigation, resolution, analysis, ending with what the team changed afterwards. I talk about the system that allowed the error, never about a culprit.

## What to use in which situation

| I want... | I use... |
|---|---|
| two on-call people to classify the same incident the same way, even at 3 a.m., without arguing about "is it serious or not" | a severity grid with observable criteria |
| to stop the damage right away, while I do not yet know why payments have been failing since the last deployment | a mitigation: rollback, feature flag, failover |
| to avoid five people each trying their own fix in production at the same time, without telling each other | an incident commander and a single channel |
| management and support to know where the incident stands without writing every five minutes to the people investigating | one person on communication, a status page, a fixed cadence |
| to stop losing time, over several incidents a month, creating channels, noting times and rebuilding a timeline that is always incomplete | an incident management tool (incident.io, PagerDuty): channel, roles, timeline, postmortem draft |
| the person woken at 3 a.m. by an alert to know what to do, without improvising or hunting for the docs | a runbook linked from the alert |
| to understand what really happened, even if the person who deployed the bug fears a sanction and may keep details quiet | a blameless postmortem |
| the same outage not to come back in six months because the postmortem actions stayed in a document | actions in the backlog, a monthly review of overdue ones |
| to see what several incidents have in common, like three outages out of five reported by customers | a quarterly review of incidents by pattern, near misses |
| to know whether things improve from one quarter to the next, without a single very long incident skewing the number | the incident list, the median, recurring incidents; not an MTTR target |
| on-call people not to burn out between useless night alerts and on-call weeks that come around too often | actionable alerts, a large enough rotation, compensation, handover |
| to check that a fix really holds, for example that the alert does fire when payments-service goes down, before the next real incident | a game day or a chaos engineering experiment |
| to be warned of an outage before customers report it to support | alerts on symptoms and SLOs ([Observability](observabilite.md#objectives-and-alerts)) |

## Sources

- [John Allspaw, "Blameless PostMortems and a Just Culture", Etsy engineering blog (2012)](https://www.etsy.com/codeascraft/blameless-postmortems/)
- [Betsy Beyer et al., "Site Reliability Engineering", chapters "Managing Incidents" and "Postmortem Culture" (Google, 2016)](https://sre.google/sre-book/postmortem-culture/)
- [Betsy Beyer et al., "The Site Reliability Workbook", chapter "Incident Response" (Google, 2018)](https://sre.google/workbook/incident-response/)
- [PagerDuty Incident Response Documentation (publication date not stated, to check)](https://response.pagerduty.com/)
- [incident.io documentation (publication date not stated, to check)](https://docs.incident.io/)
- [Atlassian, Opsgenie end of sale (2025 announcement, to check)](https://www.atlassian.com/software/opsgenie/migration)
- [The VOID Report, Courtney Nash (Verica, 2021)](https://www.thevoid.community/)
- Štěpán Davidovič, "Incident Metrics in SRE" (O'Reilly, 2021)
- [Learning from Incidents in Software (community, 2019, to check)](https://www.learningfromincidents.io/)
- [Richard Cook, "How Complex Systems Fail" (1998)](https://how.complexsystems.fail/)
- Sidney Dekker, "The Field Guide to Understanding Human Error" (2006)
- James Reason, "Human Error" (1990)
- [Principles of Chaos Engineering (2015, to check)](https://principlesofchaos.org/)
- [FEMA, Incident Command System Resources (publication date not stated)](https://www.fema.gov/emergency-managers/nims/components)
