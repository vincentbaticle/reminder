# Tech watch by role

!!! warning "Disclaimer"
    These notes are personal cheat sheets, not a source of truth. They reflect my own understanding and choices: their content remains subjective, despite the quotes and references it contains. It may be incomplete, simplified, inaccurate or outdated. Always check the official documentation before applying it. This content is provided as is, without any warranty: you use it at your own risk.

!!! audience "Who and what for"
    - **Roles**: developer, QA engineer, architect, platform or DevX engineer, workplace engineer, product manager.
    - **Uses**: I prepare an interview where I am asked "how do you keep up to date?"; I look for three reliable sources for my role without subscribing to thirty; my team has to pick a test tool and I want to know whether it is mature enough; I want a slot and a method that fit in a busy week.

Tech watch means keeping up with what changes in my job (tools, practices, ideas) without spending my days on it. This page says why, when and how to do it, then lists the most quoted sources for six roles: architect, DevX and platform, QA, developer, workplace and internal IT, product manager.

!!! noob "As noob"
    Tech watch is like checking the weather before a hike: a few regular minutes are enough not to be caught by the storm, without becoming a meteorologist. I do not try to know everything, only to see coming what will affect my work. The takeaway: **useful tech watch is short, regular and aimed at my next decisions.**

!!! info "List written in November 2026"
    Sites, newsletters and podcasts appear, get renamed and stop. Years give the creation date when known; "to check" when it was not verified at the source. Check that a source is still active before subscribing.

## Terminology

**<span class="term" data-term="tech-watch">Tech watch</span>**: the regular time spent following changes in one's field, and sorting out what is worth trying.

**<span class="term" data-term="newsletter">Newsletter</span>**: a letter sent by e-mail at a fixed interval (often weekly), which selects and summarizes articles. It is the cheapest format: someone already did the sorting.

**<span class="term" data-term="rss-feed">RSS feed</span>**: a file published by a site, listing its latest articles. A feed reader (Feedly, Inoreader, NetNewsWire, Miniflux) gathers all the followed sites in a single list, with no algorithm and no ads.

**<span class="term" data-term="tech-radar">Technology radar</span>**: a classification of technologies into four rings, popularised by Thoughtworks (Technology Radar, published twice a year since 2010): **Adopt** (use it), **Trial** (try it on a real project), **Assess** (study it), **Hold** (avoid it for new uses; Thoughtworks now calls it Caution). Public radars and the tools to draw one are in [Tech tools landscape: tech radar](outils.md#tech-radar-thoughtworks-byor-zalando-aoe-cncf), the company radar in [Architecture: company tech radar](architecture.md#company-tech-radar).

**<span class="term" data-term="sli">SLI</span>** (Service Level Indicator): the number I measure to know whether something works, for example the number of tech watch topics tried on a real case each month.

**<span class="term" data-term="slo">SLO</span>** (Service Level Objective): the internal target I set on that number, for example "at least one trial a month, eleven months out of twelve".

**<span class="term" data-term="sla">SLA</span>** (Service Level Agreement): the contractual promise made to a customer, with a penalty if it is not kept, usually looser than the SLO. A personal or team tech watch has no external customer, so no SLA.

## Why, when and how

**Why.** Three concrete reasons:

- I avoid reinventing what already exists: my team is about to write its own mock tool while a library, a practice or a field report already solves the problem;
- I see coming the changes that affect my work, like the end of support of my project's Python version or a tool replacing another, before they block an upgrade;
- I have dated, sourced arguments when I propose a change to the team, instead of an "I read it somewhere".

**When.** A fixed, short slot beats reading on the fly: for example 1 hour a week, on Friday afternoon, plus 15 minutes at the start of the day to skim. And a focused, more intense watch when a choice is due (picking a test tool, a broker, a database).

**How.** A simple method:

1. **centralize**: newsletters in a dedicated mail folder, blogs in an RSS reader;
2. **skim then sort** each article into one of the radar rings: most end up in "nothing to do";
3. **keep a record**: one line per topic I keep, with the date, the source and what I think of it;
4. **try** one thing a month on a real case, even a small one;
5. **share**: a short message to the team, a demo, a line in the team radar.

!!! noob "As noob"
    Sorting what I read is like sorting my mail: most envelopes go to recycling, a few call for action, one or two deserve to be filed. If I keep everything "just in case", I can no longer find anything. The takeaway: **reading is only half the work, the other half is deciding what to do with it.**

``` { .text .ex-illus title="Illustration" }
my-radar.md (example)
| Date       | Topic                  | Ring   | Source                         | Why                             |
|------------|------------------------|--------|--------------------------------|---------------------------------|
| 2026-10-03 | Testcontainers modules | Trial  | the tool's blog                | replace our shared databases    |
| 2026-10-17 | mock tool X            | Assess | Software Testing Weekly        | to compare with Microcks        |
| 2026-10-24 | framework Y            | Hold   | Technology Radar               | too young, a single maintainer  |
```

Traps:

- **fear of missing out**: subscribing to everything, reading nothing. Three sources read beat thirty piled up;
- **hype**: a widely shared tool is not necessarily mature. Look at the project's age, the number of maintainers, who runs it in production;
- **vendor sources**: useful for news, but they sell their product. Cross-check with an independent source.

!!! maturity "Measuring maturity"
    | Level | What I see in the team |
    |---|---|
    | N1 | one or two people do tech watch, each on their own, and talk about it when the occasion arises |
    | N2 | the team has a fixed slot, shared sources (newsletter folder, RSS reader) and a team radar where each topic kept has its dated line |
    | N3 | tech watch is anchored in the rituals: a "tech watch" item at each retro or demo, and every tool choice starts with a line in the radar without anyone asking |
    | N4 | the team tracks how many topics move from Assess to Trial then to Adopt, and how many trials succeed, and adjusts its sources and slot from these numbers |

    **I measure**: the number of lines added to the team radar per month and the share of those lines that lead to a trial, read in the radar file's history; the number of the year's tool choices that quote a tech watch source, read in the architecture decisions.

## Common to all roles

| Source | Format | Why follow it |
|---|---|---|
| [Thoughtworks Technology Radar](https://www.thoughtworks.com/radar) (since 2010) | report, twice a year | a reasoned opinion on hundreds of technologies, with the ring and the why |
| [InfoQ](https://www.infoq.com/) (since 2006) | articles, recorded talks | QCon talks freely available, architecture, development and culture topics |
| [Hacker News](https://news.ycombinator.com/) (since 2007) | community aggregator | what the community talks about today; the comments are often more useful than the article |
| [The Pragmatic Engineer](https://newsletter.pragmaticengineer.com/) (Gergely Orosz, since 2021) | newsletter, podcast | how engineering teams work, pay, organization, tools |
| [martinfowler.com](https://martinfowler.com/) (creation date not stated) | in-depth articles | reference definitions (refactoring, microservices, tests), updated over the years |
| [Stack Overflow Developer Survey](https://survey.stackoverflow.co/) (yearly since 2011) | survey | what developers really use, languages and tools |
| [Les Cast Codeurs](https://lescastcodeurs.com/) (since 2009) | podcast in French | news of the ecosystem, once or twice a month |

## Architect

| Source | Format | Why follow it |
|---|---|---|
| [InfoQ, Architecture & Design section](https://www.infoq.com/architecture-design/) (since 2006) | articles, talks | field reports on architecture at scale |
| [High Scalability](https://highscalability.com/) (Todd Hoff, since 2007) | blog | how well known systems were built, to read with a critical eye on the dates |
| [ByteByteGo](https://blog.bytebytego.com/) (Alex Xu, since 2022, to check) | newsletter, diagrams | system design concepts explained in one diagram |
| [microservices.io](https://microservices.io/) (Chris Richardson, creation date to check) | pattern catalogue | sagas, outbox, decomposition: each pattern with its strengths and limits |
| [AWS Architecture Blog](https://aws.amazon.com/blogs/architecture/) and [Google Cloud Architecture Center](https://cloud.google.com/architecture) (creation dates not stated) | vendor guides | reference architectures; vendor source, to cross-check |
| [The Open Group](https://www.opengroup.org/) (TOGAF, ArchiMate; version dates in [Architecture](architecture.md#urbanizing-the-information-system)) | standards | for enterprise architecture and urbanization |
| [c4model.com](https://c4model.com/) (Simon Brown, creation date to check) | reference site | documenting an architecture legibly |

## DevX and platform

| Source | Format | Why follow it |
|---|---|---|
| [DORA](https://dora.dev/) (yearly State of DevOps report since 2014, to check) | research, yearly report | delivery metrics and the capabilities that improve them, with numbers |
| [CNCF](https://www.cncf.io/) (founded in 2015) and its [Landscape](https://landscape.cncf.io/) | foundation, map of tools | the state and maturity of cloud native projects (sandbox, incubating, graduated) |
| [platformengineering.org](https://platformengineering.org/) (since 2022, to check) | community, articles, conferences | platform engineering, portals, golden paths |
| [The New Stack](https://thenewstack.io/) (since 2014) | media | cloud native, DevOps and developer tools news |
| [Engineering Enablement](https://newsletter.getdx.com/) (Abi Noda, since 2021, to check) | newsletter | summaries of studies on productivity and developer experience; the author runs a vendor in the field, to cross-check |
| [Team Topologies](https://teamtopologies.com/) (2019 book) | site, articles | organizing platform teams and their interactions |
| [LeadDev](https://leaddev.com/) (creation date to check) | articles, conferences | engineering management, change management, internal platforms |

## QA

| Source | Format | Why follow it |
|---|---|---|
| [Ministry of Testing](https://www.ministryoftesting.com/) (born as Software Testing Club in 2007, to check) | community, articles, conferences | the largest testers community; exploratory testing, automation, career |
| [Software Testing Weekly](https://softwaretestingweekly.com/) (Dawid Dylowicz, creation date to check) | newsletter | a weekly selection of testing articles and tools |
| [Google Testing Blog](https://testing.googleblog.com/) (since 2007) | blog | testing at scale, flaky tests, "Testing on the Toilet" |
| [Test Automation University](https://testautomationu.applitools.com/) (Applitools, since 2019) | free courses | Playwright, Cypress, API tests; a vendor's platform, most courses independent of its product |
| [DevelopSense](https://developsense.com/) (Michael Bolton) and [Satisfice](https://www.satisfice.com/) (James Bach) (creation dates not stated) | blogs | testing as an investigation and critical thinking activity, not only execution |
| [Playwright release notes](https://playwright.dev/docs/release-notes) | documentation | a new version roughly every month: new APIs, changes to anticipate |
| [ISTQB](https://www.istqb.org/) and [CFTL](https://www.cftl.fr/) (French board) | standards, syllabi | shared vocabulary and changes to the certifications |

## Developer

| Source | Format | Why follow it |
|---|---|---|
| [Release notes](https://docs.python.org/3/whatsnew/index.html) of the language and frameworks in use | documentation | the most reliable source: what is coming, what is deprecated |
| [JavaScript Weekly](https://javascriptweekly.com/) and [Python Weekly](https://www.pythonweekly.com/) (creation dates to check) | newsletters | a weekly selection per ecosystem |
| [State of JS](https://stateofjs.com/) (yearly since 2016) | survey | adoption and satisfaction of front-end tools |
| [OWASP](https://owasp.org/) (founded in 2001) | foundation, Top 10 | the most common vulnerabilities and how to avoid them |
| [Lobsters](https://lobste.rs/) (since 2012, to check) | community aggregator | more technical and calmer than Hacker News |
| [Devoxx France](https://www.devoxx.fr/) (since 2012) | conference, online videos | the year's talks, mostly in French |
| [GitHub Changelog](https://github.blog/changelog/) (creation date not stated) | changelog | changes to the most used development and CI tools |

## Workplace and internal IT

| Source | Format | Why follow it |
|---|---|---|
| [Apple Platform Deployment](https://support.apple.com/guide/deployment/welcome/web) (accessed November 2026) | documentation | what changes in Mac, iPhone and iPad enrollment and management with each macOS and iOS release |
| [Apple security releases](https://support.apple.com/en-us/100100) (accessed November 2026) | list of fixes | which vulnerabilities each update fixes, to decide how urgently to roll it out to the fleet |
| [MacAdmins Foundation](https://macadmins.org/) (creation date to check) | community, Slack, conferences | the Apple admins community: field reports on MDMs, scripts, release-day issues |
| [CISA Known Exploited Vulnerabilities catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) (since 2021) | catalog | the vulnerabilities really exploited: what to patch on laptops first |
| [CERT-FR](https://www.cert.ssi.gouv.fr/) (ANSSI, creation date to check) | alerts and advisories, in French | security alerts to act on, with the affected versions |
| [SANS Internet Storm Center](https://isc.sans.edu/) (since 2001, to check) | daily diary, podcast | a short summary of the day's threats, useful for support and endpoint security |
| [Krebs on Security](https://krebsonsecurity.com/) (Brian Krebs, since 2009) | investigative blog | how attacks really happen (phishing, account takeover), material for colleague awareness sessions |

## Product manager

| Source | Format | Why follow it |
|---|---|---|
| [SVPG](https://www.svpg.com/articles/) (Marty Cagan, creation date to check) | in-depth articles | empowered product teams, discovery, the product manager's role; part of the vocabulary in [Product management](product-management.md) comes from here |
| [Product Talk](https://www.producttalk.org/) (Teresa Torres, creation date to check) | blog, courses | continuous discovery: talking to users every week, opportunity solution tree |
| [Lenny's Newsletter](https://www.lennysnewsletter.com/) (Lenny Rachitsky, since 2019, to check) | newsletter, podcast | growth, retention, PM careers, with numbers from real companies; partly paid |
| [Mind the Product](https://www.mindtheproduct.com/) (creation date to check) | community, articles, conferences | the largest product community, recorded talks free to watch |
| [Nielsen Norman Group](https://www.nngroup.com/articles/) (founded in 1998) | research articles | usability and user research, studies with numbers and methods for testing with users |
| [The Beautiful Mess](https://cutlefish.substack.com/) (John Cutler, creation date to check) | newsletter | product organization, prioritization, what gets stuck between product and engineering |
| [The Scrum Guide](https://scrumguides.org/scrum-guide.html) (November 2020 revision) | official guide | the reference text when a discussion about events or roles goes off track; details in [Agile](agilite.md) |

## Measuring success

I know my tech watch works when it changes decisions, not when I read a lot. Before changing my method, I write down a baseline: for example, over the last three months, how many topics I tried and how many team choices quoted a source. I take the same measure three months later. The guard metric is the time spent: if the watch goes beyond the planned slot (1 hour a week in my example), it eats into the work instead of helping it.

| Solution or situation | Success indicator (SLI) | Likely SLO | Likely SLA |
|---|---|---|---|
| fixed, short slot, like 1 hour on Friday | tech watch time per week, noted in my calendar | between 45 min and 1 h 30, four weeks out of five | n/a: no external contract |
| sorting each article into a radar ring | share of followed sources actually read in the month | at least three sources out of four read; otherwise I unsubscribe, it is the sign I follow too many | n/a: no external contract |
| keeping a record (personal or team radar) | number of lines added to the radar per month | at least two lines a month | n/a: no external contract |
| trying one thing a month on a real case | number of trials run per quarter | three trials per quarter, one a month | n/a: no external contract |
| sharing with the team | number of messages, demos or radar lines shared per month | at least one share a month | n/a: no external contract |
| focused watch when a tool choice is due | share of the year's tool choices that quote at least two sources, one of them independent | 100% of tool choices, since a single unsourced choice is enough to pick the trendy tool | n/a: no external contract |

[Take with caution: example orders of magnitude, to set with the business]

!!! noob "As noob"
    The SLO is the goal I set for myself, like "run three times a week"; the SLA is a promise signed to someone else, with a fine if I break it, like a coach who refunds clients. I always set myself a stricter goal than what I promise, to keep a margin. The takeaway: **the SLO is my internal target, the SLA is the looser commitment I sign with a customer.**

## Pitfalls to avoid

| Pitfall | What happens | Solution |
| --- | --- | --- |
| **Following everything**: I subscribe to thirty sources out of fear of missing out. | I read none of them and everything piles up. | I keep three sources I really read. |
| **Reading on the fly**: I read as soon as an article shows up. | The watch eats into my days without producing anything. | I keep a fixed, short slot, like 1 hour on Friday ([When](#why-when-and-how)). |
| **Following the hype**: I adopt a tool because everyone shares it this week. | My team ends up with a project that is too young, with a single maintainer. | I look at the project's age, the number of maintainers and who runs it in production, then I place it in the [radar](#terminology). |
| **Taking the vendor at their word**: I treat a vendor blog as a neutral opinion. | I rely on a text written to sell its product. | I cross-check with an independent source before proposing anything. |
| **Reading without keeping a record**: I write nothing down. | Three months later, I find neither the source nor why I liked the tool. | I write one line per topic I keep, with the date, the source and my opinion. |
| **Never trying**: I read everything but test nothing. | I only have impressions to offer the team. | I try one thing a month on a real case, even a small one. |
| **Following a dead source**: I subscribe to a newsletter quoted everywhere that stopped publishing or got renamed. | I receive nothing, or no longer under the name I was following. | I check that a source is still active before subscribing. |

## What interviews ask

The typical questions:

- "How do you do your tech watch?", "How much time do you spend on it?" How I answer: I describe my method (centralize, sort, keep a record, try, share) and my slot ([Why, when and how](#why-when-and-how)).
- "Which sources do you follow? Name three" How I answer: I name sources from my role that I really read, with what each one brings me ([Common to all roles](#common-to-all-roles), [QA](#qa), [Developer](#developer)).
- "How do you decide a tool is mature enough to adopt?" How I answer: I look at the project's age, its maintainers, who runs it in production, and the Technology Radar ring ([Pitfalls to avoid](#pitfalls-to-avoid)).
- "Tell me about a time your tech watch changed a decision in your team" How I answer: I tell a lived story, with what I tried, what I shared and what the team decided ([Why, when and how](#why-when-and-how)).
- "How do you know your tech watch is useful?" How I answer: I give an indicator (trials run, sourced tool choices), a baseline before, the same measure three months later, and the time spent as a guard metric ([Measuring success](#measuring-success)).
- "How do you follow the vulnerabilities that affect employee laptops?" How I answer: I name a source of actually exploited vulnerabilities and an alert source, and I say how they decide how urgent a rollout is ([Workplace and internal IT](#workplace-and-internal-it)).
- "Which product authors do you read, and what did you change thanks to them?" How I answer: I name two sources and one practice I tried, like one user interview a week ([Product manager](#product-manager)).
- "How do you stay up to date on test tools?" How I answer: I read the tool's release notes and a testing newsletter, and I follow a community like Ministry of Testing ([QA](#qa)).

What makes a good answer: show a regular habit rather than a list of names, with a method, two or three sources really read, and an example of something tried then shared.

The questions by role, with more detailed answers and worked exercises: [Staff Engineer](../entretiens/staff-engineer/questions.md), [DevX Engineer](../entretiens/devx-engineer/questions.md), [QA Engineer](../entretiens/qa-engineer/questions.md), [Software Engineer](../entretiens/software-engineer/questions.md), [Software Architect](../entretiens/software-architect/questions.md), [Workplace Engineer](../entretiens/workplace-engineer/questions.md), [Product Manager](../entretiens/product-manager/questions.md).

## What to follow for which need

| Need | Source |
|---|---|
| I only have 10 minutes a week and want a single source that has already sorted things for me | a newsletter of my role |
| a colleague suggests a framework found last week and I want to know whether it is mature enough for a real project | Thoughtworks Technology Radar, CNCF Landscape |
| my team must pick a tool, like a test tool or a broker, and I want to compare on concrete facts | release notes, yearly surveys, InfoQ field reports |
| I hear about sagas or outbox in a meeting and want to really understand the idea, not just the word | martinfowler.com, microservices.io |
| I must convince my management to change the way we deliver, and I need numbers rather than a feeling | DORA reports |
| I already write Playwright tests and want to grow in how I think about testing, not in the tool | Ministry of Testing, DevelopSense, Satisfice |
| I prefer to follow the news in French, as a podcast or a video | Les Cast Codeurs, Devoxx France |
| I manage the company's laptops and a macOS update fixes a vulnerability: I must decide whether to push it today or next week | Apple security releases, CISA KEV catalog, CERT-FR |
| I am a product manager and want to get better at discovery, like learning to interview users without leading their answers | Product Talk, SVPG, Nielsen Norman Group |
