# Agile, Scrum and Kanban

!!! warning "Disclaimer"
    These notes are personal cheat sheets, not a source of truth. They reflect my own understanding and choices: their content remains subjective, despite the quotes and references it contains. It may be incomplete, simplified, inaccurate or outdated. Always check the official documentation before applying it. This content is provided as is, without any warranty: you use it at your own risk.

!!! audience "Who and what for"
    - **Roles**: developer, QA engineer, product owner, Scrum Master, tech lead, engineering manager.
    - **Uses**: I join a team that "does Scrum" and want to know what each meeting is for; my team mostly gets unplanned requests, like production bugs, and I wonder whether Kanban would suit it better than sprints; a manager asks me for a date and I want to answer with an honest forecast rather than a guess; our retrospectives go round in circles and I look for how to make them useful; I prepare an interview where I will be asked "Scrum or Kanban?".

Agile is not a method: it is a family of ways of working that share one idea, deliver small useful pieces often and adjust to what I learn. This page explains the Agile Manifesto, then the three frameworks I meet most: Scrum, Kanban and Extreme Programming (XP). It then covers estimation and forecasting, the rituals that really help, agile at scale, quality in an agile team and the most common drifts.

Several related notions live elsewhere and I link to them instead of repeating them: Little's law, Lean and the theory of constraints in [Company culture](culture-entreprise.md#lean-and-flow), slicing and estimating a feature in [Estimating and slicing a feature](culture-entreprise.md#estimating-and-slicing-a-feature), stories and the definition of done in [Product management](product-management.md#user-stories-and-invest), the QA role in [Quality and testing](qualite.md#the-qa-role-in-an-agile-team). The shop application `shop-app`, the team `team-orders` and its members (ada the product owner, grace the Scrum Master, alan and linus developers, margaret QA) and all numbers are made-up examples.

## Terminology

| Word | Definition | Example |
|---|---|---|
| **<span class="term" data-term="agile-manifesto">Agile Manifesto</span>** | the 2001 text that sets four values and twelve principles shared by agile methods | "working software over comprehensive documentation" |
| **<span class="term" data-term="scrum">Scrum</span>** | a lightweight framework where a team delivers a useful increment every sprint, then inspects and adapts | `team-orders` delivers every two weeks and reviews its plan at the end of each sprint |
| **<span class="term" data-term="sprint">Sprint</span>** | a fixed-length period, one month at most, during which the team pursues a goal and produces an increment | the sprint from March 2 to 13, goal "pay in three installments" |
| **<span class="term" data-term="timebox">Timebox</span>** | a maximum duration set in advance for an activity: I stop on time, even if it is not finished | the daily lasts 15 minutes at most |
| **<span class="term" data-term="product-owner">Product owner</span>** (PO) | the person accountable for the value of the product, who orders the backlog | ada decides that paying in three installments comes before dark mode |
| **<span class="term" data-term="scrum-master">Scrum Master</span>** | the person accountable for the team's effectiveness and for Scrum being understood | grace notices the daily lasts 40 minutes and suggests moving technical discussions out of it |
| **Developers** | in Scrum, everyone who builds the increment: developers, QA, designers, ops | alan, linus and margaret |
| **<span class="term" data-term="product-backlog">Product backlog</span>** | the ordered list of everything that could improve the product | 60 items, the top 10 detailed and ready |
| **<span class="term" data-term="sprint-goal">Sprint Goal</span>** | the sentence that says why the sprint matters, and guides choices during the sprint | "a customer can pay in three installments by card" |
| **<span class="term" data-term="increment">Increment</span>** | a finished, usable piece of product that adds to the previous ones | paying in three installments in production, behind a feature flag |
| **<span class="term" data-term="definition-of-done">Definition of done</span>** (DoD) | the shared list of conditions a piece of work meets to be finished | green tests in CI, review done, documentation up to date |
| **<span class="term" data-term="kanban">Kanban</span>** | a method that manages the flow of work: visualize, limit work in progress, improve | a board with a limit of 3 tickets "in progress" |
| **<span class="term" data-term="wip-limit">WIP limit</span>** | the maximum number of items allowed at the same time in a step | "in review: 2 at most" |
| **<span class="term" data-term="cycle-time">Cycle time</span>** | the time between the moment the team starts an item and the moment it is finished | ticket started Monday, in production Thursday: 4 days |
| **<span class="term" data-term="lead-time">Lead time</span>** | the time between the request and the delivery, including the wait before the start | requested on the 1st, started on the 10th, delivered on the 13th: 13 days |
| **<span class="term" data-term="throughput">Throughput</span>** | the number of items finished per unit of time | 4 tickets finished per week |
| **<span class="term" data-term="work-item-age">Work item age</span>** | how long ago an item in progress was started | ticket 41 has been in progress for 9 days |
| **<span class="term" data-term="story-points">Story points</span>** | a relative unit of size, specific to a team, that mixes effort, complexity and uncertainty | a 5-point story looks two and a half times bigger than a 2-point story |
| **<span class="term" data-term="velocity">Velocity</span>** | the number of points a team finishes per sprint, on average | 21, 18 and 24 points over the last three sprints |
| **<span class="term" data-term="extreme-programming">Extreme Programming</span>** (XP) | an agile method centered on engineering practices: pairing, TDD, continuous integration | alan and linus write the test first, together at the same workstation |
| **<span class="term" data-term="sli">SLI</span>** | Service Level Indicator: the indicator measured to know whether something works | the share of tickets finished in less than 10 days |
| **<span class="term" data-term="slo">SLO</span>** | Service Level Objective: the internal target set on an SLI | "85% of tickets finished in less than 10 days" (example) |
| **<span class="term" data-term="sla">SLA</span>** | Service Level Agreement: the contractual promise made to a customer, with a penalty, usually looser than the SLO | a fix for a blocking bug within 5 business days, promised to a customer, otherwise a discount (example) |

A daily sentence, decoded:

``` { .text .ex-illus title="Illustration" }
"The sprint goal is at risk: 41 is 9 days old, the review column is at its limit,
 I suggest we stop starting and finish."

sprint goal at risk          the sentence "pay in three installments" may not be reached
41 is 9 days old             ticket 41 was started 9 days ago, much longer than usual
review column at its limit   2 MRs are waiting for review, the maximum the team allows itself
stop starting                nobody takes a new ticket before helping to finish one
```

## The Agile Manifesto

<span class="pill pill-status pill-status-ok" title="Still valid, checked in November 2026">Current · 11/2026</span>

In the 1990s, many projects followed the waterfall model: six months of specifications, a year of development, then testing at the end, where the team found out the need had changed. In February 2001, seventeen practitioners (among them Kent Beck, Ken Schwaber, Jeff Sutherland, Ward Cunningham, Martin Fowler, Alistair Cockburn) met in Snowbird, Utah, and wrote the <span class="term" data-term="agile-manifesto">Manifesto for Agile Software Development</span>. They already practiced Scrum, XP, Crystal or DSDM, and were looking for what these methods had in common.

### The four values

The text fits in four lines. Each line prefers the item on the left, without throwing away the one on the right:

| We value more... | ...than | What it changes for `team-orders` |
|---|---|---|
| individuals and interactions | processes and tools | when a ticket is stuck, alan goes to talk to margaret instead of changing the status in the tool and waiting |
| working software | comprehensive documentation | the team shows installment payment in a demo rather than a 40-page document |
| customer collaboration | contract negotiation | ada invites two customers to the sprint review instead of defending herself with the specification |
| responding to change | following a plan | installment payment comes before the profile redesign, because customer feedback showed it |

!!! noob "As noob"
    I prepare a road trip. Waterfall means printing the whole route the night before and following it even when the radio announces a traffic jam. Agile means keeping the destination, driving in stages and checking the GPS at each stop to change route if needed. Limit of the picture: in software, the destination itself can change on the way. The takeaway: **the Manifesto says "over", not "instead of": the plan and the documentation matter, just less than what works.**

### The twelve principles in plain words

The Manifesto adds twelve principles. I group them into four ideas I can recite:

| Idea | Principles summarized | Concrete example |
|---|---|---|
| deliver early and often | satisfy the customer through early and continuous delivery; deliver every few weeks; working software is the measure of progress | `shop-app` goes to production every week, not once a quarter |
| welcome change | accept changing requirements, even late | a new payment method arrives mid-quarter, it goes into the backlog |
| motivated people who talk | business people and developers work together daily; trust motivated people; prefer face-to-face conversation; self-organizing teams; sustainable pace | ada sits with the team; nobody works late at the end of the sprint |
| do it well and improve | technical excellence and good design enhance agility; simplicity, the art of maximizing the amount of work not done; at regular intervals, the team reflects and adjusts | the retrospective picks one improvement per sprint; the team refuses to build an export nobody asked for |

**When**: the Manifesto is not a process to "apply", it is a grid to judge a process. I reread it when an agile practice turns into an empty ritual, or when I hear "we are agile, so no documentation". **Why**: it puts the goal before the tools; two teams can do Scrum, one agile, the other not. **How**: faced with a team rule, I ask which value it serves; if none, I suggest removing it.

**Risks.** The Manifesto was written by and for development teams; extending it as is to a whole organization (purchasing, legal, annual budget) creates friction the text does not solve. Reading it as "no plan, no documentation" leaves the team with no record of its decisions: I keep the documents that help, like ADRs and the README. Several signatories have criticized what industrial "Agile" became, like Dave Thomas ("Agile is Dead (Long Live Agility)", 2014): I quote the text, not the brand.

:material-book-open-variant: Reference docs: [Manifesto for Agile Software Development](https://agilemanifesto.org/) (2001); [the twelve principles](https://agilemanifesto.org/principles.html) (2001)
{ .doc-ref }

!!! maturity "Measuring maturity"
    | Level | What I observe in the team |
    |---|---|
    | N1 | the team calls itself agile and delivers in iterations, but nobody can quote the values |
    | N2 | the team delivers working software at least once a month, and the business sees it each time |
    | N3 | team rules that serve no value are removed in retrospective, without waiting for a manager's approval |
    | N4 | the team tracks delivery frequency and the time between a request and its release, and adjusts its way of working on these numbers |

    **I measure**: the number of production releases per month, read in the deployment tool; the median time between a ticket's creation and its release, read in the ticket tool.

## Scrum

### Where Scrum comes from and when to use it

<span class="pill pill-status pill-status-ok" title="Still valid, checked in November 2026">Current · 11/2026</span>

The word comes from rugby, the scrum. Hirotaka Takeuchi and Ikujiro Nonaka use it in 1986 in "The New New Product Development Game" (Harvard Business Review) to describe product teams that move forward together rather than in relay. Ken Schwaber and Jeff Sutherland present Scrum for software in 1995 (OOPSLA conference), then publish the **Scrum Guide**, whose latest edition dates from November 2020. The guide is 13 pages long: it is the only official definition.

<span class="term" data-term="scrum">Scrum</span> rests on **empiricism**: I decide from what I observe, not from a plan made at the start. Three pillars make it possible: **transparency** (everyone sees the same state of the work), **inspection** (we look often at what we produced and how) and **adaptation** (we change as soon as a gap appears). Five values support these pillars: commitment, focus, openness, respect and courage.

**When**: my team builds a product where the need is not fully known in advance, with a goal that fits in a few weeks, and a stable team of 10 people or fewer. The [Cynefin](culture-entreprise.md#cynefin) framework puts this kind of problem in the "complex" domain, where I move forward by trial. **When not to use it**: a mostly reactive team (support, operations, a constant flow of production bugs), where a two-week plan is broken by Tuesday; repetitive, well-known work, where a simple queue is enough. **Why**: a fixed rhythm forces the team to finish something showable often, so to get feedback early and correct course at low cost. The cost: about 10% of the time in meetings for a two-week sprint (example), and a real change of role for the PO and the manager.

``` mermaid
flowchart LR
  PB[Product backlog<br/>product goal] --> SP[Sprint planning]
  SP --> SB[Sprint backlog<br/>sprint goal]
  SB --> S((Sprint<br/>daily every day))
  S --> I[Increment<br/>definition of done]
  I --> SR[Sprint review]
  SR --> RE[Retrospective]
  RE --> SP
  SR -. feedback .-> PB
```

!!! noob "As noob"
    Scrum is a restaurant kitchen that puts out a new menu every two weeks. At the start, the team picks the dishes it can really pull off; every morning, it takes stock in front of the stoves; at the end, customers taste; then the cooks talk about their way of working, not about the dishes. The takeaway: **Scrum is a short "plan, do, show, improve" loop, repeated at a fixed rhythm.**

**Risks.** Scrum makes problems visible, it does not solve them: a team that depends on five other teams will see every sprint fail on these dependencies, and will have to change its organization, not its meetings. Ken Schwaber often sums it up as "Scrum is simple to understand, difficult to master". Applying only the meetings without giving the team the power to decide produces what Ron Jeffries calls "Dark Scrum" (2016), see [When agile goes wrong](#when-agile-goes-wrong).

:material-book-open-variant: Reference docs: [Ken Schwaber and Jeff Sutherland, The Scrum Guide](https://scrumguides.org/scrum-guide.html) (November 2020)
{ .doc-ref }

### The Scrum Team and its three accountabilities

<span class="pill pill-status pill-status-ok" title="Still valid, checked in November 2026">Current · 11/2026</span>

A Scrum Team usually has 10 people or fewer, with no sub-teams or internal hierarchy. The 2020 Scrum Guide no longer talks about "roles" but about **accountabilities**:

| Accountability | What it is accountable for | What it does | What it does not do |
|---|---|---|---|
| <span class="term" data-term="product-owner">Product owner</span> | maximizing the value of the product | writes the product goal, orders the backlog, accepts or rejects the work | tell developers how to work, or how much to take into the sprint |
| <span class="term" data-term="scrum-master">Scrum Master</span> | the effectiveness of the Scrum Team | helps the team self-manage, removes impediments, teaches Scrum to the organization | take notes at the daily, hand out tickets, act as project manager |
| Developers | a useful, quality increment every sprint | build the sprint backlog, organize among themselves, respect the definition of done | wait for tasks to be assigned to them |

The guide describes the Scrum Master as a "true leader who serves": they act on the team, on the PO (backlog management techniques) and on the organization (removing obstacles outside the team).

``` { .text .ex-illus title="Illustration · who decides what at team-orders" }
Installment payment before dark mode?                        ada (PO)
How many stories go into this sprint?                         alan, linus, margaret (developers)
Do we slice the story as API then screen, or in slices?       the developers, with ada's opinion
The daily lasts 40 minutes, what do we do?                    the team, helped by grace (Scrum Master)
The security team has blocked the release for 5 days          grace goes to see the security team
```

**Risks.** An absent PO, or one with no decision power ("I need to ask the director"), turns every question into a wait of several days: I ask that the PO have the last word on the backlog order. A Scrum Master who is also a full-time developer never has time to remove impediments. A manager who assigns tasks at the daily takes self-management away from the team, and developers stop committing to the goal.

:material-book-open-variant: Reference docs: [The Scrum Guide, Scrum Team](https://scrumguides.org/scrum-guide.html#scrum-team) (November 2020)
{ .doc-ref }

### The five events

<span class="pill pill-status pill-status-ok" title="Still valid, checked in November 2026">Current · 11/2026</span>

Each event is an opportunity to inspect and adapt, with a <span class="term" data-term="timebox">timebox</span>. The guide's maximum durations apply to a one-month sprint; for a shorter sprint, the usual practice is to reduce them proportionally.

| Event | Maximum duration (one-month sprint) | Who | The question it answers |
|---|---|---|---|
| the <span class="term" data-term="sprint">sprint</span> | one month | the whole team | the container of the other events: it starts again as soon as it ends |
| sprint planning | 8 hours | the whole team | why this sprint matters, what to do, how to do it |
| daily scrum | 15 minutes, every day | the developers | where are we on the sprint goal, and what do we change for tomorrow? |
| sprint review | 4 hours | the team and the stakeholders | what did we produce, and what does it change for the rest of the product? |
| retrospective | 3 hours | the Scrum Team | how did we work, and what do we change? |

**Backlog refinement** is not an event: it is an ongoing activity, where the team slices, clarifies and estimates upcoming items. Common practice spends at most 10% of the developers' time on it (an old figure from the 2017 guide, removed in 2020).

**Risks.** Shortening or skipping the retrospective "because we are late" cuts the only improvement loop: the delay comes back next sprint. A sprint review reduced to a demo in front of the PO, with no stakeholders and no backlog discussion, becomes a sign-off ceremony: I invite at least one user or business representative, and the review ends with changes to the backlog.

:material-book-open-variant: Reference docs: [The Scrum Guide, Scrum Events](https://scrumguides.org/scrum-guide.html#scrum-events) (November 2020)
{ .doc-ref }

### The three artifacts and their commitments

<span class="pill pill-status pill-status-ok" title="Still valid, checked in November 2026">Current · 11/2026</span>

An artifact is a work object visible to everyone. The 2020 guide attaches a **commitment** to each, the target that gives it meaning:

| Artifact | Commitment | Example for `team-orders` |
|---|---|---|
| <span class="term" data-term="product-backlog">Product backlog</span> | Product Goal | "by the end of June, 70% of carts over 200 euros are paid without abandonment" (example) |
| sprint backlog | <span class="term" data-term="sprint-goal">Sprint Goal</span> | "a customer can pay in three installments by card" |
| <span class="term" data-term="increment">increment</span> | <span class="term" data-term="definition-of-done">definition of done</span> | green tests, review done, deployed behind a flag, release note written |

The sprint goal is what sets a sprint apart from a task list. It leaves room: if a story turns out bigger than planned, the team negotiates the scope with the PO, but keeps the goal.

Avoid: a sprint goal that is just the list of tickets.

``` { .text .ex-bad title="Avoid" }
Sprint goal: do ORD-101, ORD-102, ORD-105, ORD-107 and ORD-110.
(if ORD-107 takes twice as long, nobody knows what can be dropped)
```

Good: an outcome sentence, which allows trade-offs during the sprint.

``` { .text .ex-good title="Recommended" }
Sprint goal: a customer can pay in three installments by card on the web.
Planned stories: ORD-101 installment calculation, ORD-102 choice screen, ORD-105 call to the provider,
                 ORD-107 confirmation e-mail, ORD-110 accounting export.
(ORD-110 slips to the next sprint without breaking the goal; ORD-105 cannot slip)
```

**Risks.** A definition of done that does not include tests or the release produces "finished" increments that come back as bugs next sprint. A 400-item backlog nobody rereads is no longer ordered: I archive what has not moved for six months. The details of the definition of done from the product side are in [Product management](product-management.md#definition-of-done).

:material-book-open-variant: Reference docs: [The Scrum Guide, Scrum Artifacts](https://scrumguides.org/scrum-guide.html#scrum-artifacts) (November 2020)
{ .doc-ref }

### A two-week sprint, day by day

Here is what a real sprint looks like at `team-orders` (example):

``` { .text .ex-illus title="Illustration · sprint from March 2 to 13" }
Mon 2    9:30   sprint planning, 2 h: ada presents the goal "pay in three installments",
                the developers take 6 stories and break them into tasks
Tue 3    9:30   daily, 15 min, in front of the board
Wed 4           daily; three amigos on ORD-105 with ada, alan and margaret
Thu 5    14:00  refinement, 1 h: the stories of the next sprint
Mon 9           daily: ORD-105 blocked by the provider, grace calls them
Wed 11          daily: the goal holds, ORD-110 slips, ada agrees
Fri 13   10:00  sprint review, 1 h: demo to two customer advisers, two ideas enter the backlog
Fri 13   11:30  retrospective, 1 h 30: one action chosen, "review MRs within 4 h"
Mon 16          the next sprint starts
```

### What changed in the 2020 Scrum Guide

<span class="pill pill-status pill-status-ok" title="Still valid, checked in November 2026">Current · 11/2026</span>

Many teams and interview questionnaires still refer to the 2017 version. What changed in November 2020:

| Before (2017) | Since 2020 |
|---|---|
| the "Development Team" inside the Scrum Team | a single Scrum Team; "Developers" is an accountability |
| self-organizing team (it chooses how) | self-managing team (it chooses who, how and what to work on) |
| no goal at the product level | the Product Goal |
| no named commitment | three commitments: Product Goal, Sprint Goal, definition of done |
| the three daily questions (yesterday, today, impediments) | no structure imposed on the daily |
| sprint planning answers "what" and "how" | it adds "why this sprint matters" |
| "servant-leader" for the Scrum Master | "true leader who serves" |

**Risks.** Quoting the three daily questions as a Scrum rule in an interview shows outdated knowledge: I say they were in the 2017 guide and remain one possible format.

:material-book-open-variant: Reference docs: [Scrum Guides, Revisions to the Scrum Guide](https://scrumguides.org/revisions.html) (November 2020)
{ .doc-ref }

!!! maturity "Measuring maturity"
    | Level | What I observe in the team |
    |---|---|
    | N1 | the team holds the five events, but sprints often end without a usable increment |
    | N2 | each sprint has a goal written in one sentence and ends with an increment that meets the definition of done |
    | N3 | the team adjusts its scope on its own during the sprint to keep the goal, and the definition of done tests automatically block an incomplete MR |
    | N4 | the team tracks the share of sprint goals reached and the cycle time, and its retrospectives pick their actions from these numbers |

    **I measure**: the share of sprint goals reached over the last six sprints, noted at each review; the number of bugs opened on stories declared done, read in the ticket tool.

## Kanban in depth

The [Company culture](culture-entreprise.md#kanban) page presents Kanban in one section, with Little's law. Here I go further: the two definitions that coexist, board design, flow measures and classes of service.

### Two Kanbans: the method and the guide

<span class="pill pill-status pill-status-ok" title="Still valid, checked in November 2026">Current · 11/2026</span>

The word comes from the cards (kanban means "label" or "signboard" in Japanese) that Taiichi Ohno used at Toyota in the 1950s so that a step only produces what the next step consumes. For knowledge work, two texts coexist:

| | The Kanban Method | The Kanban Guide |
|---|---|---|
| authors | David J. Anderson, Kanban University (2010 book) | Daniel Vacanti and John Coleman, ProKanban.org (December 2020, revised since, to check) |
| idea | a method for gradually changing an organization | a minimal strategy to optimize the flow of value |
| practices | six practices: visualize, limit WIP, manage flow, make policies explicit, implement feedback loops, improve collaboratively and evolve experimentally | three practices: define and visualize the workflow, actively manage items in the workflow, improve the workflow |
| on top | change management principles ("start with what I do now") and seven meeting cadences | four mandatory flow measures |

Both agree on the essential: **stop starting, start finishing**. Unlike Scrum, Kanban imposes no roles, no sprints and no meetings: it starts from how the team works today.

**When**: my team receives requests of varied sizes and urgency, at an unpredictable pace: level 2 support, platform team, maintenance, operations team. Or a Scrum team whose sprints keep breaking and that wants to see where work waits. **Why**: lead time drops without working more, just by starting fewer things at once ([Little's law](culture-entreprise.md#littles-law-and-wip-limits)). **Cost**: it takes the discipline to respect the limits, and someone who watches the measures.

**Risks.** "Doing Kanban" often boils down to a Jira board with columns, no limits and no measures: nothing changes except the name. Without an imposed cadence, a team may never take the time to improve: I schedule a flow review every two weeks.

:material-book-open-variant: Reference docs: [Daniel Vacanti and John Coleman, The Kanban Guide](https://kanbanguides.org/english/) (accessed November 2026) ; [Kanban University, The Official Kanban Guide](https://kanban.university/kanban-guide/) (accessed November 2026)
{ .doc-ref }

### Designing the board

<span class="pill pill-status pill-status-ok" title="Still valid, checked in November 2026">Current · 11/2026</span>

A good board reflects the real path of the work, not a ready-made template. I start from what the team really does, add the waiting columns (often invisible), then a limit per step.

Avoid: three generic columns and no limit. "In progress" tickets mix what moves forward and what waits for a review or an environment, so nobody sees where work is stuck.

``` { .text .ex-bad title="Avoid" }
TO DO (34)        IN PROGRESS (14)      DONE
                  ORD-88  ada ?
                  ORD-91  waiting for review for 6 d
                  ORD-95  waiting for the test environment
                  ...
```

Good: the real steps, visible queues, a limit per step, and policies written at the top of the columns.

``` { .text .ex-good title="Recommended" }
READY (max 6)  DEV (max 4)    WAITING REVIEW  REVIEW (max 2)  TEST (max 2)   IN PROD
               doing|done
ORD-96         ORD-92 alan    ORD-91 (6 d !)  ORD-89          ORD-88
ORD-97         ORD-93 linus                   ORD-90
Policies: "Ready" = acceptance criteria written; "Done" in DEV = MR open and CI green;
          a full column = I help empty it before pulling a new ticket.
```

The "done" and "waiting" columns show what the first board hid: ORD-91 has not moved for six days because review is saturated.

**Risks.** A board that is too detailed (fifteen columns) turns into an update ritual: I merge the steps nobody looks at. A limit per person ("2 tickets each") protects less than a limit per step, because it does not show the bottleneck.

:material-book-open-variant: Reference docs: [Kanban University, The Official Kanban Guide](https://kanban.university/kanban-guide/) (accessed November 2026)
{ .doc-ref }

### The four flow measures

<span class="pill pill-status pill-status-ok" title="Still valid, checked in November 2026">Current · 11/2026</span>

The Kanban Guide mandates four measures, all readable in a ticket tool:

| Measure | Definition | Question it answers | Example |
|---|---|---|---|
| work in progress (WIP) | the number of items started and not finished | are we starting too many things? | 11 tickets in progress for 4 people |
| <span class="term" data-term="throughput">throughput</span> | the number of items finished per period | how many items do we really deliver? | 4 per week on average |
| <span class="term" data-term="work-item-age">work item age</span> | how long ago each item in progress was started | which ticket is going wrong, today? | ORD-91 is 9 days old, while 85% of tickets finish in 7 |
| <span class="term" data-term="cycle-time">cycle time</span> | the time between the start and the end of a finished item | how long does an item take once started? | median 4 days, 85% in 7 days |

Age is the only measure that looks at the present: cycle time comes too late, once the ticket is finished. At the daily, I therefore look first at the oldest tickets. The guide adds a <span class="term" data-term="service-level-expectation">Service Level Expectation</span> (SLE): "85% of our items finish in 7 days or less", computed on past cycle times.

A **cumulative flow diagram** (CFD) stacks, day by day, the number of items in each column. A band that widens shows a step that accumulates work; an "in prod" band that rises at a steady slope shows a stable flow.

``` { .text .ex-illus title="Illustration · reading a cumulative flow diagram" }
number
of items
  40 ┤                                        ░░░ to do
  30 ┤                         ░░░░░░░░░░░░░░░▒▒▒ review   (the "review" band widens:
  20 ┤            ░░░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒             MRs wait longer and longer)
  10 ┤  ░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ in prod
   0 ┼─────────────────────────────────────────── weeks
```

!!! noob "As noob"
    I think of a supermarket checkout. Throughput is the number of customers served per hour; cycle time, the time a customer spends between reaching the checkout and leaving; age, how long the customer in front of me has been waiting; WIP, the number of people in the line. The takeaway: **to know if a ticket is going wrong, I look at its age today, not at yesterday's average cycle time.**

**Risks.** Measuring throughput in number of tickets pushes people to split tickets artificially: the number goes up, the value delivered does not ([Goodhart's law](lois-et-principes.md#goodharts-law)). I keep these measures for the team, to compare the team with itself, never to compare two teams. Averages hide extreme cases: I read percentiles (50%, 85%).

:material-book-open-variant: Reference docs: [Daniel Vacanti and John Coleman, The Kanban Guide, Flow Metrics](https://kanbanguides.org/english/) (accessed November 2026) ; Daniel Vacanti, "Actionable Agile Metrics for Predictability" (2015)
{ .doc-ref }

### Classes of service

<span class="pill pill-status pill-status-ok" title="Still valid, checked in November 2026">Current · 11/2026</span>

Not all tickets have the same cost of waiting. A **class of service** is a written handling policy for a type of item. The Kanban Method offers four classic ones:

| Class | Cost of delay | Example policy | Example |
|---|---|---|---|
| expedite | huge and immediate | goes before everything, exceeds the WIP limit, only one at a time | card payment is down in production |
| fixed date | zero before the date, huge after | started early enough to finish before the date | VAT compliance due January 1st |
| standard | grows over time | first in, first out, in the PO's order | installment payment |
| intangible | low today, may explode later | a fixed share of capacity, for example 1 ticket out of 5 | upgrading a framework before its end of support |

**Risks.** If one ticket in three becomes "expedite", the class loses its meaning and standard tickets stop moving: I limit the expedite lane to one item and count how often it is used per month. Intangible work is always postponed unless it has a reserved share: that is how technical debt wins. The link with [cost of delay](culture-entreprise.md#cost-of-delay) helps choose the class.

:material-book-open-variant: Reference docs: [Kanban University, The Official Kanban Guide](https://kanban.university/kanban-guide/) (accessed November 2026)
{ .doc-ref }

!!! maturity "Measuring maturity"
    | Level | What I observe in the team |
    |---|---|
    | N1 | a board shows the work, with no limit or written policy |
    | N2 | each step has a WIP limit, queues are visible, policies are written on the board |
    | N3 | the tool prevents pulling a ticket into a full column, and flags on its own a ticket whose age exceeds the SLE |
    | N4 | the team reviews cycle time, throughput and the cumulative flow diagram every month, and changes its limits or steps based on these numbers |

    **I measure**: the 85th percentile of cycle time over the last 30 days, read in the ticket tool; the number of tickets older than the SLE at the daily.

## Scrum, Kanban or Scrumban

<span class="pill pill-status pill-status-ok" title="Still valid, checked in November 2026">Current · 11/2026</span>

The question comes up in almost every team and every interview. The two are not opposed: Scrum gives a rhythm and roles, Kanban gives flow management. Scrum.org even published "The Kanban Guide for Scrum Teams" (Daniel Vacanti and Yuval Yeret, 2018, revised in 2021) to add Kanban practices to Scrum.

| | Scrum | Kanban |
|---|---|---|
| rhythm | fixed-length sprints | a continuous flow, cadences of my choice |
| roles | PO, Scrum Master, developers | no imposed role |
| limiting work in progress | indirectly, through what enters the sprint | directly, through a limit per step |
| changing the plan midway | possible, but the sprint goal stays | at any time: I pull the next most useful item |
| main measure | sprint goal reached, sometimes velocity | cycle time, throughput, age |
| delivery | at least one increment per sprint | as soon as an item is finished |

**Scrumban** (Corey Ladas, "Scrumban", 2009) originally meant moving a Scrum team toward Kanban. Today, the word mostly means a mix: Scrum events (planning, review, retro) and a Kanban board with WIP limits and flow measures.

| Situation | I use... |
|---|---|
| my team builds a new feature over several months, with an available PO and a need that becomes clearer along the way, like a new checkout flow | Scrum |
| my team mostly handles unplanned requests, like production bugs and requests from other teams, that break any two-week plan | Kanban |
| my team does Scrum but its tickets linger in review and testing, and it wants to see where work waits without losing its rendezvous | Scrumban: Scrum with a WIP-limited board and flow measures |
| my team splits its time between a project and support, like a platform team that gets requests on top of its roadmap | Kanban with two classes of service, or capacity reserved for support in each sprint |
| my team is new and has no shared habits | Scrum, for its simple structure, then I add Kanban practices |

**Risks.** Choosing Kanban to "have no more meetings" removes the moments for improvement and customer feedback: I keep a review and a retrospective, even without sprints. Imposing Scrum on an operations team creates sprints that fail every time, and the team ends up despising agile.

:material-book-open-variant: Reference docs: [Daniel Vacanti and Yuval Yeret, The Kanban Guide for Scrum Teams](https://www.scrum.org/resources/kanban-guide-scrum-teams) (2021 revision)
{ .doc-ref }

!!! maturity "Measuring maturity"
    | Level | What I observe in the team |
    |---|---|
    | N1 | the team applies the framework chosen by the company, without having discussed it |
    | N2 | the team chose its framework from the nature of its work, and writes it in its team agreement |
    | N3 | the framework's rules (WIP limits, timeboxes) apply without a manager's arbitration |
    | N4 | the team compares its measures (cycle time, goals reached) before and after a change of framework, and rolls back if they get worse |

    **I measure**: the share of unplanned work in each sprint or each month, read in the ticket tool; cycle time before and after the change.

## Extreme Programming

<span class="pill pill-status pill-status-ok" title="Still valid, checked in November 2026">Current · 11/2026</span>

Scrum and Kanban say how to organize work, not how to write code. A Scrum team can therefore deliver every two weeks code that is harder and harder to change. <span class="term" data-term="extreme-programming">Extreme Programming</span> (XP) fills that gap. Kent Beck develops it on Chrysler's C3 payroll project around 1996, then describes it in "Extreme Programming Explained" (1999, second edition with Cynthia Andres in 2004). The idea: push the practices that work to the extreme. If code review is useful, review continuously (pairing); if tests are useful, write them before the code (TDD); if integration is useful, integrate several times a day.

XP rests on five values: communication, simplicity, feedback, courage and respect (added in 2004). The practices I find most in today's teams:

| Practice | What it is | Example at `team-orders` | Link |
|---|---|---|---|
| <span class="term" data-term="pair-programming">pair programming</span> | two people, one workstation: one writes, the other reviews and thinks ahead, and they switch often | alan and margaret write the installment calculation together | |
| <span class="term" data-term="mob-programming">mob programming</span> | the whole team on one workstation, with a rotating keyboard (Woody Zuill, around 2012) | half a day as a mob for the payment provider migration | |
| <span class="term" data-term="tdd">TDD</span> | write a failing test, make it pass, clean up | the test "3 installments of 33.34 / 33.33 / 33.33" before the code | [TDD in practice](conception-tests.md#tdd-in-practice) |
| continuous integration | merge my work into the main branch several times a day, with a CI that checks | no branch lives more than a day | [Trunk-based development](livraison.md#trunk-based-development) |
| small releases | release to production often, in small pieces | one release per day | [Continuous delivery](livraison.md#continuous-delivery-and-deployment) |
| <span class="term" data-term="refactoring">refactoring</span> | improve the structure of the code without changing its behavior, continuously | rename and split the payment service as stories go | |
| simple design | the simplest code that passes today's tests | no generic rule engine for a single payment case | [Design principles](principes-conception.md) |
| collective code ownership | anyone can change any part | linus fixes a bug in alan's module without waiting for him to come back | |
| sustainable pace | no overtime that lasts | the 40-hour week of the first edition | |
| on-site customer, which became "whole team" | the business works with the team, every day | ada sits with the developers | |

**When**: as soon as the code must live long and change often; it is the condition for Scrum or Kanban to hold over time. **Why**: the Manifesto says it itself, "technical excellence enhances agility". Without these practices, each sprint costs a little more than the previous one. **How**: I do not adopt everything at once; I start with continuous integration and automated tests, then pairing on risky topics.

!!! noob "As noob"
    Scrum is a football team's training schedule; XP is passing and shooting technique. A team can have an excellent schedule and miss all its passes. The takeaway: **Scrum and Kanban organize the work, XP keeps the code healthy enough for that work to stay fast.**

**Risks.** Pairing all day is exhausting: I keep it for hard topics or for passing on knowledge, with breaks. Collective ownership without tests or review gives code that everyone changes and nobody understands. "Simple design" misread becomes "no design at all": simple means without what is not needed today, not without thinking.

:material-book-open-variant: Reference docs: [Kent Beck, Extreme Programming Explained (2nd edition)](https://www.oreilly.com/library/view/extreme-programming-explained/0321278658/) (2004) ; [Ron Jeffries, What is Extreme Programming?](https://ronjeffries.com/xprog/what-is-extreme-programming/) (2001, updated 2011)
{ .doc-ref }

!!! maturity "Measuring maturity"
    | Level | What I observe in the team |
    |---|---|
    | N1 | a few developers write tests and pair, when they think of it |
    | N2 | every change goes through a CI with automated tests, and branches live less than two days |
    | N3 | the CI blocks merging a change without tests or that breaks a test, without a human having to refuse it |
    | N4 | the team tracks the change failure rate and cycle time, and decides to invest in refactoring or pairing based on these numbers |

    **I measure**: the median lifetime of branches, read in Git; the share of releases that cause an incident or a rollback, read in the deployment tool ([DORA](livraison.md#measuring-delivery-dora)).

## Estimating and forecasting

I am often asked "when will it be ready?". Three families of answers exist: estimate each item (points or days), stop estimating and count, or forecast from history. Slicing and the range per slice are explained in [Estimating and slicing a feature](culture-entreprise.md#estimating-and-slicing-a-feature); here I cover the practices specific to agile teams.

### Story points, planning poker and velocity

<span class="pill pill-status pill-status-ok" title="Still valid, checked in November 2026">Current · 11/2026</span>

<span class="term" data-term="story-points">Story points</span> measure a **relative** size: I do not say "3 days", I say "twice as big as the reference story". The team often picks a sequence close to Fibonacci (1, 2, 3, 5, 8, 13) to say that the bigger it is, the less precise it is. **Planning poker** (James Grenning, 2002, popularized by Mike Cohn in "Agile Estimating and Planning", 2005) makes everyone vote at the same time, card face down, so the first person to speak does not influence the others. When votes diverge (2 and 13), the two extremes explain: that is where a forgotten risk is found.

``` { .text .ex-illus title="Illustration · a planning poker vote" }
Story ORD-105: call the provider to create the installment schedule
First vote      alan 3   linus 3   margaret 13   ada does not vote (PO)
margaret        "the provider returns a different schedule if the card expires before
                 the last installment: we must handle that case and test it"
Second vote     alan 8   linus 8   margaret 8
```

<span class="term" data-term="velocity">Velocity</span> is the sum of the points finished per sprint. It is useful for one thing: helping the team know how much to take at the next sprint planning.

**When**: a stable team working in sprints that wants an order of magnitude for its planning. **When not to use it**: to compare two teams, measure productivity or set a target. **Why**: estimating relatively is faster and more accurate than in hours, and the discussion matters more than the number. **Cost**: meeting time, and a number managers love to turn into a performance indicator.

**Risks.** As soon as velocity becomes a target ("+10% this quarter"), estimates inflate: the same story goes from 3 to 5 points, velocity rises, nothing more is delivered ([Goodhart's law](lois-et-principes.md#goodharts-law)). Ron Jeffries, who thinks he may have helped invent points, wrote that he regretted it when seeing this use ("Story Points Revisited", 2019). Converting points into hours ("1 point = 4 hours") cancels the whole point of relative sizing.

:material-book-open-variant: Reference docs: [Ron Jeffries, Story Points Revisited](https://ronjeffries.com/articles/019-01ff/story-points/Index.html) (2019) ; [Mike Cohn, Planning Poker](https://www.mountaingoatsoftware.com/agile/planning-poker) (accessed November 2026)
{ .doc-ref }

### NoEstimates: counting instead of estimating

<span class="pill pill-status pill-status-ok" title="Still valid, checked in November 2026">Current · 11/2026</span>

The **#NoEstimates** movement (started on Twitter by Woody Zuill around 2012, then Vasco Duarte's book "NoEstimates", 2016, date to check) starts from an observation: if I slice each item into pieces of comparable size, counting items forecasts as well as summing points, for much less meeting time. The name is provocative: it does not mean "never answer the date question", but "answer with data rather than guesses".

**When**: a team that already slices into small pieces, and has a throughput history. **Why**: the time spent estimating goes into slicing and delivering. **How**: I slice until each item fits in a few days, count the remaining items, and forecast with past throughput (next section).

**Risks.** Without disciplined slicing, a two-day item and a six-week item each count as one, and the forecast no longer makes sense. Announcing "we no longer estimate" to a leadership team that needs dates for a budget shuts down the discussion: I present the probabilistic forecast as a better answer, not as a refusal.

:material-book-open-variant: Reference docs: Vasco Duarte, "NoEstimates: How to Measure Project Progress Without Estimating" (2016, date to check)
{ .doc-ref }

### Forecasting with a Monte Carlo simulation

<span class="pill pill-status pill-status-ok" title="Still valid, checked in November 2026">Current · 11/2026</span>

Ada has to tell the sales director when the 40 remaining items of installment payment will be delivered. A **Monte Carlo simulation** answers with a probability rather than a single date: I replay thousands of possible futures by drawing at random from the real throughput of past weeks, then look at how many weeks each future takes to finish.

``` { .text .ex-illus title="Illustration · calculation (example numbers)" }
Throughput of the last 10 weeks : 1, 5, 3, 7, 2, 6, 4, 2, 8, 4  (average 4.2)
Remaining work                  : 40 items

One simulated future: I draw a week at random (5), then another (2), then (8)...
                      and count the weeks until 40 items.
I repeat 100,000 times.

Result          50% of futures finish in 10 weeks or less
                85% in 12 weeks or less
                95% in 13 weeks or less

What I say      "With 85% confidence, it is delivered within 12 weeks."
What I do not say: "40 / 4.2 = 9.5 weeks", which is only reached about one time in three.
```

Daniel Vacanti ("When Will It Be Done?", 2020) and Troy Magennis popularized this approach in software. It also answers the reverse question: "how many items will be delivered within 6 weeks?" (in this example, at least 20 with 85% confidence).

!!! noob "As noob"
    To know when I will get to work, I do not compute "distance divided by average speed": I remember my commutes over the last months and say "almost always before 9:10, except on strike days". The simulation does the same, replaying my past weeks thousands of times. The takeaway: **an honest forecast is a date with a probability, drawn from my real numbers.**

**Risks.** The simulation assumes the future looks like the past: if half the team goes on vacation or the scope grows by 30%, I redo the calculation. Remaining work almost always grows (questions discovered along the way): I often count the added items and include them. A spreadsheet or a tool does the calculation; I only check that the history is long enough, at least ten weeks or so.

:material-book-open-variant: Reference docs: Daniel Vacanti, "When Will It Be Done?" (2020) ; [Troy Magennis, Focused Objective, forecasting tools](https://github.com/FocusedObjective/FocusedObjective.Resources) (accessed November 2026)
{ .doc-ref }

!!! maturity "Measuring maturity"
    | Level | What I observe in the team |
    |---|---|
    | N1 | dates are given by gut feeling, by a single person |
    | N2 | the team estimates together (points or slicing) and records its throughput or velocity every sprint |
    | N3 | a tool computes the probabilistic forecast from history, with no estimation meeting |
    | N4 | the team compares its forecasts with actual dates and adjusts its method when the gap grows |

    **I measure**: the share of 85% forecasts actually met, over the year; the time spent in estimation meetings per sprint.

## Rituals that really help

An agile meeting is useful if it changes something. Here I describe how to make the daily and the retrospective useful, the two I most often see done badly.

### A daily that looks at the work, not the people

<span class="pill pill-status pill-status-ok" title="Still valid, checked in November 2026">Current · 11/2026</span>

The daily helps developers coordinate toward the sprint goal. When it becomes a status report to the manager, everyone speaks to justify themselves and nobody listens.

Avoid: a round table where everyone tells the Scrum Master about their day.

``` { .text .ex-bad title="Avoid" }
alan      "Yesterday I worked on ORD-105, today I continue ORD-105, no blockers."
linus     "Yesterday I had meetings, today ORD-107, no blockers."
margaret  "I test what comes in."
(25 minutes; ORD-91 has been waiting for review for 6 days, nobody says so)
```

Good: walk the board from right to left, starting from what is almost finished, and look at ticket age.

``` { .text .ex-good title="Recommended" }
Sprint goal: pay in three installments. We start from the rightmost column.
TEST    ORD-88  margaret: a rounding case fails, alan looks at it with her at 10:00
REVIEW  ORD-91  6 days old, older than anything else: linus reviews it before pulling a ticket
DEV     ORD-105 the provider does not answer, grace calls them this morning
Decision: nobody starts a new ticket today. (12 minutes)
```

**Risks.** A daily "optimized" into a written message loses the discussions that unblock things; I keep a short live exchange. Long technical discussions are settled right after, among the people concerned only.

:material-book-open-variant: Reference docs: [The Scrum Guide, Daily Scrum](https://scrumguides.org/scrum-guide.html#daily-scrum) (November 2020)
{ .doc-ref }

### A retrospective that changes something

<span class="pill pill-status pill-status-ok" title="Still valid, checked in November 2026">Current · 11/2026</span>

The <span class="term" data-term="retrospective">retrospective</span> is the moment the team looks at how it works. Norman Kerth set its basic rule, the **Prime Directive** ("Project Retrospectives", 2001): regardless of what we discover, we understand and truly believe that everyone did the best job they could, given what they knew at the time, their skills and abilities, the resources available, and the situation at hand. Without this rule, the retro turns into a blame hunt and nobody says anything useful anymore ([psychological safety](culture-entreprise.md#psychological-safety)).

Esther Derby and Diana Larsen ("Agile Retrospectives", 2006) propose five steps:

1. **Set the stage**: recall the purpose, the Prime Directive, one word from each person to get everyone talking.
2. **Gather data**: the sprint timeline, the numbers (goal reached? tickets that lingered?).
3. **Generate insights**: look for causes, for example with the "5 whys".
4. **Decide what to do**: one or two actions, each with an owner and a date.
5. **Close**: what we keep, and quick feedback on the retro itself.

A few common formats for step 2: **Start, Stop, Continue**; **4L** (Liked, Learned, Lacked, Longed for); **Mad, Sad, Glad**; the **sailboat** (the wind that pushes, the anchor that holds back, the rocks ahead). I change the format from time to time to avoid routine.

Avoid: a list of complaints with no follow-up, rewritten every sprint.

``` { .text .ex-bad title="Avoid" }
Actions: "communicate better", "test more", "fewer meetings"
(no owner, no date, no check: the same lines come back in 2 weeks)
```

Good: one precise, small action, with an owner and a way to check it.

``` { .text .ex-good title="Recommended" }
Finding   ORD-91 waited 6 days in review; 4 tickets out of 6 waited more than 2 days
Action    every MR is reviewed within 4 business hours; limit of 2 MRs in review on the board
Who       linus tracks the indicator
Check     at the next retro, we look at the median waiting time in review
```

**Risks.** Too many actions at once, and none gets done: I keep one or two. A retro where the manager is present and writes down everyone's "problems" kills the conversation: the Scrum Team alone, or an explicit agreement on what leaves the room. A retro that only talks about other teams ("security blocks us") changes nothing: I look for what the team can do, and hand the rest to the Scrum Master.

:material-book-open-variant: Reference docs: [Norman Kerth, The Prime Directive](https://www.retrospectivewiki.org/index.php?title=The_Prime_Directive) (2001) ; Esther Derby and Diana Larsen, "Agile Retrospectives" (2006)
{ .doc-ref }

!!! maturity "Measuring maturity"
    | Level | What I observe in the team |
    |---|---|
    | N1 | the daily and the retro happen, but look like status reports |
    | N2 | the daily starts from the board and the goal; each retro ends with a dated action and an owner |
    | N3 | the board flags too-old tickets on its own at the daily, and the next retro always starts by checking the previous actions |
    | N4 | the team tracks the share of retro actions completed and their effect on a measure (waiting time, goals reached) |

    **I measure**: the share of retrospective actions completed by their due date; the average length of the daily.

## Agile at scale

<span class="pill pill-status pill-status-ok" title="Still valid, checked in November 2026">Current · 11/2026</span>

Scrum is designed for one team. When ten teams work on the same product, new problems appear: dependencies, shared integration, conflicting priorities. Several frameworks answer, with opposite philosophies:

| Framework | Authors and date | Idea | For whom |
|---|---|---|---|
| SAFe (Scaled Agile Framework) | Dean Leffingwell, 2011 (version 6.0 in 2023) | a lot of structure: trains of 50 to 125 people, joint planning in 8 to 12-week increments (PI Planning), dedicated roles | large organizations that need to align budget, portfolio and teams |
| LeSS (Large-Scale Scrum) | Craig Larman and Bas Vodde, from 2008 | as little structure as possible: one PO, one backlog, one sprint for 2 to 8 teams | organizations ready to simplify their structure rather than tool it up |
| Nexus | Ken Schwaber, Scrum.org, 2015 | Scrum plus an integration team, for 3 to 9 teams on one product | Scrum teams that struggle with integration |
| Scrum@Scale | Jeff Sutherland, 2017 (date to check) | nested Scrum teams, with a "Scrum of Scrums" | organizations that want to extend Scrum as a network |
| Spotify model | Kniberg and Ivarsson, 2012 | squads, tribes, chapters, guilds; a snapshot of one company, not a framework | see [its limits](culture-entreprise.md#the-spotify-model-and-its-limits) |

``` mermaid
flowchart TB
  subgraph LeSS["LeSS: one backlog, one PO"]
    PO1[Single PO] --> BL1[Single backlog]
    BL1 --> T1[Team 1] & T2[Team 2] & T3[Team 3]
  end
  subgraph SAFe["SAFe: several levels"]
    PF[Portfolio] --> ART[Train: 5 to 12 teams]
    ART --> PI[PI Planning every 8 to 12 weeks]
    PI --> E1[Team A] & E2[Team B] & E3[Team C]
  end
```

**When**: several teams really deliver the same product and block each other. **When not to use it**: before trying to reduce dependencies. [Conway's law](lois-et-principes.md#conways-law) and [Team Topologies](culture-entreprise.md#team-topologies) often offer better: split teams along the architecture so each one delivers on its own. **Why**: a shared framework gives a shared language and calendar. **Cost**: extra coordination, extra roles, and often paid training.

**Risks.** SAFe is often criticized for recreating heavy waterfall planning under agile vocabulary; several Manifesto signatories have said so publicly (to check depending on the source). Plastering a scaling framework on teams that cannot yet deliver on their own multiplies problems instead of solving them. I measure before and after: end-to-end cycle time, number of dependencies between teams.

:material-book-open-variant: Reference docs: [Scaled Agile Framework](https://framework.scaledagile.com/) (version 6.0, 2023) ; [LeSS](https://less.works/) (accessed November 2026) ; [Scrum.org, The Nexus Guide](https://www.scrum.org/resources/online-nexus-guide) (2021)
{ .doc-ref }

!!! maturity "Measuring maturity"
    | Level | What I observe in the team |
    |---|---|
    | N1 | teams coordinate in a weekly meeting, with no shared calendar |
    | N2 | teams on the same product share an ordered backlog and a joint planning rendezvous |
    | N3 | a shared continuous integration detects on its own the changes of one team that break another |
    | N4 | the organization tracks the number of dependencies between teams and end-to-end cycle time, and reorganizes teams when they rise |

    **I measure**: the number of tickets blocked by another team per sprint; the cycle time of a feature that crosses several teams.

## Quality in an agile team

<span class="pill pill-status pill-status-ok" title="Still valid, checked in November 2026">Current · 11/2026</span>

In an agile team, testing cannot wait for the end: with two-week sprints, a separate test phase at the end of the sprint becomes a mini waterfall, and bugs arrive on the last day. Lisa Crispin and Janet Gregory ("Agile Testing", 2009) advocate the <span class="term" data-term="whole-team-approach">whole team approach</span>: quality belongs to the whole team. The details of the QA role are in [Quality and testing](qualite.md#the-qa-role-in-an-agile-team); here is how testing fits into each agile moment:

| Moment | What the team does for quality | Example |
|---|---|---|
| refinement | acceptance criteria are written with examples, in <span class="term" data-term="three-amigos">three amigos</span> (PO, developer, tester) | margaret asks "what if the card expires before the third installment?" |
| sprint planning | test tasks are part of the story, not of a separate story | "write the API tests of the calculation" is a task of ORD-101 |
| during the sprint | automated tests written with the code, exploratory session as soon as the story works | margaret explores ORD-102 with alan on Wednesday |
| definition of done | test requirements apply to every story | "each acceptance criterion has a green automated test" |
| sprint review | stakeholders try it themselves | two customer advisers pay in three installments in staging |
| retrospective | the team looks at escaped bugs and their cause | two rounding bugs: we add boundary value tests |

Avoid: a sprint where testing is a final phase.

``` { .text .ex-bad title="Avoid" }
week 1      development of all the stories
week 2      Mon to Thu: more development; Fri: margaret tests everything
result      7 bugs found on Friday, 3 stories postponed, margaret works late
```

Good: each story is tested as it progresses, by the whole team.

``` { .text .ex-good title="Recommended" }
before the code   three amigos, examples written as acceptance criteria
during            automated tests with the code; paired exploration as soon as the story works
end               the story is done only if the definition of done is met
result            bugs arrive as we go, Friday is for the review
```

**Risks.** "The whole team tests" can turn into "nobody is accountable": the definition of done makes accountability concrete. Removing the QA position in the name of agile loses the test design expertise and the user's view; Crispin and Gregory talk about shared expertise, not a removed job.

:material-book-open-variant: Reference docs: [Lisa Crispin and Janet Gregory, Agile Testing](https://agiletester.ca/) (2009, followed by "More Agile Testing", 2014)
{ .doc-ref }

!!! maturity "Measuring maturity"
    | Level | What I observe in the team |
    |---|---|
    | N1 | the QA tests the stories at the end of the sprint |
    | N2 | acceptance criteria are written before the code, and tests are part of the definition of done |
    | N3 | the CI rejects a story whose acceptance tests fail, without human arbitration |
    | N4 | the team tracks bugs escaped to production and waiting time in testing, and changes its practices when they rise |

    **I measure**: the number of bugs found in production per month, read in the ticket tool; the median time a story spends in the test column.

## When agile goes wrong

<span class="pill pill-status pill-status-ok" title="Still valid, checked in November 2026">Current · 11/2026</span>

Many developers say they hate agile; often, they hate one of its drifts. Being able to name them helps propose a precise change rather than a wholesale rejection.

| Drift | Who named it | What I see | What I propose |
|---|---|---|---|
| **Dark Scrum** | Ron Jeffries (2016) | Scrum events are used to control the team: the manager sets the sprint content and applies pressure at the daily | give the backlog order back to the PO and the choice of quantity to the developers |
| **Water-Scrum-Fall** | Dave West, Forrester (2011) | full specifications up front, sprints in the middle, a big test and release phase at the end | deliver each increment all the way to production ([continuous delivery](livraison.md#continuous-delivery-and-deployment)) |
| **Flaccid Scrum** | Martin Fowler (2009) | Scrum without technical practices: each sprint slower than the previous one | add XP practices, tests and continuous integration first |
| **Zombie Scrum** | Johannes Schartau, Christiaan Verwijs and Barry Overeem (2020) | all events happen, but no customer sees the increment and nothing changes | a review with real users, a measurable sprint goal |
| **cargo cult** | Richard Feynman's expression (1974), applied here | copying another company's rituals without the problem they solved | start from the team's problem, then choose the practice |
| **velocity as a target** | see Goodhart's law | points inflate, velocity rises, nothing more is delivered | measure the customer outcome and cycle time |

!!! noob "As noob"
    A gym where everyone wears the outfit, fills in the attendance sheet and takes a selfie, but nobody lifts a weight: the rituals are there, the muscle is not. The takeaway: **agile is judged by what comes out (a product that works, feedback, improvements), not by the meetings that take place.**

**When**: I recognize a drift when the team has all the rituals and none of the results: no release before the end of the quarter, retros without actions, customers never seen. **How**: I name the drift in retrospective with a fact ("the last 4 increments did not go to production") and propose a single experiment for one or two sprints.

**Risks.** Sticking a label ("this is Dark Scrum") on other people's work puts them on the defensive: I describe the fact and its effect, not the name. Throwing away the whole framework because of one drift often loses what worked, like the retrospective.

:material-book-open-variant: Reference docs: [Ron Jeffries, Dark Scrum](https://ronjeffries.com/articles/016-09ff/defense/) (2016) ; [Martin Fowler, Flaccid Scrum](https://martinfowler.com/bliki/FlaccidScrum.html) (2009)
{ .doc-ref }

!!! maturity "Measuring maturity"
    | Level | What I observe in the team |
    |---|---|
    | N1 | drifts are felt ("these meetings are useless") but not discussed |
    | N2 | drifts are named in retrospective with a fact, and an experiment is chosen |
    | N3 | team rules protect on their own against known drifts: no sprint without a goal, no increment left undeployed |
    | N4 | the team tracks release frequency and the share of goals reached, and detects a drift through a drop in these numbers |

    **I measure**: the time between the end of a story and its release; the number of users or business representatives present at reviews.

## Measuring success

I know my agile way of working works when the team delivers more often, more predictably and without burning out, not when it holds more meetings. Before a change (moving from Scrum to Kanban, adding WIP limits, changing the retro format), I note a baseline: for example, a cycle time of 9 days at the 85th percentile and 2 releases per month. I take the same measure 6 to 8 weeks later. The guard metric: bugs escaped to production and overtime hours, to check that speed does not come at the expense of quality or exhaustion.

| Solution or situation | Success indicator (SLI) | Likely SLO | Likely SLA |
|---|---|---|---|
| Scrum | share of sprint goals reached | at least 4 sprints out of 5 | not applicable: no external contract |
| Kanban | share of items finished within the SLE | 85% in 7 days or less | not applicable: no external contract |
| WIP limits | average work in progress per person | 2 items at most | not applicable: no external contract |
| probabilistic forecast | share of 85% forecasts met over the year | at least 80% | depends on the contract: a date promised to a customer may carry a penalty |
| support in Kanban with an expedite class | share of blocking bugs fixed on time | 95% within 2 business days | fix within 5 business days promised to the customer, otherwise a discount (example) |
| retrospectives | share of actions completed by their due date | at least 70% | not applicable: no external contract |
| quality within the sprint | bugs escaped to production per month | fewer than 3, and decreasing | not applicable: no external contract |

[Take with caution: example values, to be set from the team's history]

!!! noob "As noob"
    The SLO is the target the team sets itself, like a restaurant aiming to serve each dish in under 15 minutes; the SLA is what it promises the customer in writing, with a gesture if the promise is broken, for example 30 minutes. The restaurant aims tighter than it promises, to keep a margin. The takeaway: **the SLO is the internal target, the SLA the looser contractual commitment; a team practice only has an SLO.**

## Pitfalls to avoid

| Pitfall | What happens | Solution |
| --- | --- | --- |
| **Rituals without the purpose**: I hold the five Scrum events, but the increment never goes to production. | Nobody sees the product, feedback only arrives after three months. | I deliver each increment all the way to production and invite real users to the review ([When agile goes wrong](#when-agile-goes-wrong)). |
| **Velocity as a target**: I ask the team for "+10% points this quarter". | Estimates inflate, velocity rises, nothing more is delivered. | I keep velocity for the team's planning and track cycle time and the customer outcome ([Story points](#story-points-planning-poker-and-velocity)). |
| **A Kanban board with no limit**: I put tickets in columns and call it Kanban. | Work piles up in review and testing, lead times grow without anything reacting. | I add a limit per step and visible waiting columns ([Designing the board](#designing-the-board)). |
| **A sprint goal that is a list**: I write "do ORD-101 to ORD-110". | At the first surprise, nobody knows what to drop, and the whole sprint fails. | I write an outcome sentence and negotiate the scope around it ([The three artifacts](#the-three-artifacts-and-their-commitments)). |
| **A single date**: I say "40 items, 4 per week, so 10 weeks". | The date is missed one time in two, and leadership's trust drops. | I give a date with a probability, drawn from a simulation on my real throughput ([Monte Carlo](#forecasting-with-a-monte-carlo-simulation)). |
| **Testing at the end of the sprint**: I let the QA test everything on Friday. | Bugs arrive on the last day, stories slip, the QA burns out. | Three amigos before, tests with the code, exploration as soon as the story works ([Quality in an agile team](#quality-in-an-agile-team)). |
| **A scaling framework before needing one**: I roll out SAFe on three teams that cannot yet deliver on their own. | More meetings and roles, the same blockers. | I first reduce dependencies between teams, then choose the lightest framework ([Agile at scale](#agile-at-scale)). |
| **Retros with no follow-up**: I write "communicate better" at every retro. | The same problems come back, the team stops believing in the retro. | One or two precise actions, with an owner, checked at the next retro ([A retrospective that changes something](#a-retrospective-that-changes-something)). |

## What interviews ask

- "What is agile?", "Name the values of the Agile Manifesto." How to answer: the four values with the word "over", then an idea of the principles (deliver often, welcome change, improve), and the gap between the spirit and the rituals ([The Agile Manifesto](#the-agile-manifesto)).
- "Describe Scrum: roles, events, artifacts." How to answer: the three accountabilities, the five events with their question, the three artifacts with their commitments; mention that the 2020 guide talks about accountabilities and removed the three daily questions ([Scrum](#scrum), [What changed](#what-changed-in-the-2020-scrum-guide)).
- "Scrum or Kanban, which would you choose?" How to answer: it depends on the nature of the work; Scrum for a product built through goals, Kanban for a flow of unplanned requests; and often a mix ([Scrum, Kanban or Scrumban](#scrum-kanban-or-scrumban)).
- "What is a WIP limit, and why limit work in progress?" How to answer: Little's law, fewer items in progress means shorter lead times at equal throughput; an example board ([Designing the board](#designing-the-board), [Little's law](culture-entreprise.md#littles-law-and-wip-limits)).
- "What do you think of story points?", "How do you answer 'when will it be ready?'" How to answer: useful for discussion and the team's planning, dangerous as a performance indicator; for a date, a probabilistic forecast on real throughput ([Estimating and forecasting](#estimating-and-forecasting)).
- "Your team never reaches its sprint goals, what do you do?" How to answer: I look at the facts (unplanned work, stories too big, dependencies), propose an experiment in retrospective and measure ([Rituals that really help](#rituals-that-really-help)).
- "What is the QA's role in a Scrum team?" How to answer: quality belongs to the whole team, the QA brings expertise and coaching, testing happens during the sprint ([Quality in an agile team](#quality-in-an-agile-team)).
- "Have you ever seen agile applied badly?" How to answer: a drift named with a fact (water-scrum-fall, velocity as a target), what I proposed and the result, with the STAR method ([When agile goes wrong](#when-agile-goes-wrong)).

Questions by role, with more detailed answers and worked exercises: [QA Engineer](../entretiens/qa-engineer/questions.md), [Software Engineer](../entretiens/software-engineer/questions.md), [Product Manager](../entretiens/product-manager/questions.md).

## What to use in which situation

| I want... | I use... |
|---|---|
| to know whether a team rule, like "every ticket has an estimate in hours", still serves a purpose | the four values of the Agile Manifesto |
| to build a new product whose need becomes clearer along the way, with an available PO and a stable team | Scrum |
| to handle a flow of unplanned requests, like production bugs and requests from other teams | Kanban, with classes of service |
| to see where work waits, like MRs piling up in review, without giving up my sprints | Scrumban: a WIP-limited board within Scrum |
| my code to stay easy to change after twenty sprints | XP practices: TDD, continuous integration, pairing, refactoring |
| to know how much work to take into the next sprint | the velocity or throughput of the last sprints |
| to answer "when will it be ready?" without making up a number | a Monte Carlo simulation on real throughput |
| to spot today the ticket that is going to go wrong | the age of items in progress, at the daily |
| to make the retrospective a moment that really changes something | the Prime Directive, the five steps, one or two dated actions |
| to coordinate several teams on the same product | first reduce dependencies, then Nexus or LeSS, SAFe if the organization needs a lot of structure |
| testing to stop being a bottleneck at the end of the sprint | three amigos, tests in the definition of done, exploration during the sprint |

## Sources

- [Manifesto for Agile Software Development (2001)](https://agilemanifesto.org/)
- [Ken Schwaber and Jeff Sutherland, "The Scrum Guide" (November 2020)](https://scrumguides.org/scrum-guide.html)
- [Scrum Guides, "Revisions to the Scrum Guide" (November 2020)](https://scrumguides.org/revisions.html)
- Hirotaka Takeuchi and Ikujiro Nonaka, "The New New Product Development Game", Harvard Business Review (1986)
- [Daniel Vacanti and John Coleman, "The Kanban Guide" (accessed November 2026)](https://kanbanguides.org/english/)
- [Kanban University, "The Official Kanban Guide" (accessed November 2026)](https://kanban.university/kanban-guide/)
- David J. Anderson, "Kanban: Successful Evolutionary Change for Your Technology Business" (2010)
- [Daniel Vacanti and Yuval Yeret, "The Kanban Guide for Scrum Teams" (2021 revision)](https://www.scrum.org/resources/kanban-guide-scrum-teams)
- Corey Ladas, "Scrumban: Essays on Kanban Systems for Lean Software Development" (2009)
- Daniel Vacanti, "Actionable Agile Metrics for Predictability" (2015)
- Daniel Vacanti, "When Will It Be Done?" (2020)
- Kent Beck and Cynthia Andres, "Extreme Programming Explained", second edition (2004)
- [Ron Jeffries, "What is Extreme Programming?" (2001, updated 2011)](https://ronjeffries.com/xprog/what-is-extreme-programming/)
- Mike Cohn, "Agile Estimating and Planning" (2005)
- [Ron Jeffries, "Story Points Revisited" (2019)](https://ronjeffries.com/articles/019-01ff/story-points/Index.html)
- Vasco Duarte, "NoEstimates" (2016, date to check)
- Norman Kerth, "Project Retrospectives: A Handbook for Team Reviews" (2001)
- Esther Derby and Diana Larsen, "Agile Retrospectives: Making Good Teams Great" (2006)
- Lisa Crispin and Janet Gregory, "Agile Testing" (2009)
- [Ron Jeffries, "Dark Scrum" (2016)](https://ronjeffries.com/articles/016-09ff/defense/)
- [Martin Fowler, "Flaccid Scrum" (2009)](https://martinfowler.com/bliki/FlaccidScrum.html)
- Dave West, "Water-Scrum-Fall Is The Reality Of Agile For Most Organizations Today", Forrester (2011)
- Johannes Schartau, Christiaan Verwijs and Barry Overeem, "The Zombie Scrum Survival Guide" (2020)
- [Dave Thomas, "Agile is Dead (Long Live Agility)" (2014)](https://pragdave.me/thoughts/active/2014-03-04-time-to-kill-agile.html)
- [Scaled Agile Framework (version 6.0, 2023)](https://framework.scaledagile.com/)
- [LeSS, Large-Scale Scrum (accessed November 2026)](https://less.works/)
- [Scrum.org, "The Nexus Guide" (2021)](https://www.scrum.org/resources/online-nexus-guide)
