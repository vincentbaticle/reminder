# Product Manager interview: the questions

!!! warning "Disclaimer"
    These notes are personal cheat sheets, not a source of truth. They reflect my own understanding and choices: their content remains subjective, despite the quotes and references it contains. It may be incomplete, simplified, inaccurate or outdated. Always check the official documentation before applying it. This content is provided as is, without any warranty: you use it at your own risk.

!!! audience "Who and what for"
    - **Roles**: product manager, product owner aiming at a PM role, product designer or tech lead moving towards product, QA engineer or analyst preparing a product interview.
    - **Uses**: I prepare a PM interview next week and I want the list of questions with an answer outline; the day before, I reread a single theme, like metrics; I look for the Knowledge page that explains a notion I want to quote, like the RICE score; I prepare one lived story per theme, like a feature I removed because nobody used it.

This page lists, theme by theme, the questions a product manager gets asked, worded the way the interviewer says them. For each question, I read the answer outline (a few lines, in the first person), then I open the linked Knowledge section, which holds the full explanation, the examples and the pitfalls. The outline is not something to recite: it structures **a lived story**, with my own numbers (activation rate, retention, share of bets that worked). When I have not lived a case, I present it as a scenario and explain my reasoning.

A PM interview mixes behavioural questions ("tell me about a time when..."), where the interviewer expects "I did", not "I would", and case studies ("design a product for...", "this metric dropped, what do you do?"), where the approach counts more than the answer. The apps quoted (`bike-app`, bike rental; `recipe-app`, a recipe app), the people (ada the PM, grace the designer, alan the tech lead) and all numbers are made up. The live exercises, with worked tables, queries and calculations, are in [Product Manager interview: the exercises](exercices.md).

## The product manager role

### "What is a product manager, and how do they differ from a product owner or a project manager?"

- The <span class="term" data-term="product-manager">product manager</span> is accountable for the outcome: the right problem, for the right users, with a measurable effect.
- The <span class="term" data-term="product-owner">product owner</span> is a Scrum role (Scrum Guide, November 2020): they maximise the product's value and order the backlog; in many companies, it is the same person.
- The project manager is accountable for a scope delivered on time and on budget; the designer, for the experience.
- I quote Martin Eriksson (2011): the PM at the crossing of business, technology and user experience.
- Example: on `bike-app`, I am not accountable for "booking shipped on 15 April", but for "more new sign-ups take a second ride".

**Read next**: [Product manager, product owner, project manager, product designer](../../knowledge/product-management.md#product-manager-product-owner-project-manager-product-designer), [What the PM is accountable for](../../knowledge/product-management.md#what-the-pm-is-accountable-for), [Product or project](../../knowledge/culture-entreprise.md#product-or-project)

### "How do you work with design and engineering?"

- I work as a <span class="term" data-term="product-trio">product trio</span> (Teresa Torres, "Continuous Discovery Habits", 2021): the PM, the designer and the tech lead run discovery together.
- Each one sees a risk: I see value and viability, the designer usability, the tech lead feasibility.
- I give the problem and the target outcome, not the solution or the screen: the team chooses how.
- The trio decides which opportunities and solutions to test; it does not approve a button colour.
- Example: one user interview a week with all three present, and a shared opportunity tree.

**Read next**: [The product trio](../../knowledge/product-management.md#the-product-trio), [Discovery and delivery](../../knowledge/culture-entreprise.md#discovery-and-delivery), [RACI](../../knowledge/culture-entreprise.md#raci)

### "What sets a good PM apart from an average one?", "What are you accountable for?"

- I judge myself by the outcome reached with users, not by the number of features shipped or meetings run (Ben Horowitz, "Good Product Manager/Bad Product Manager", text from 1996 to check).
- I tell apart the output, the <span class="term" data-term="product-outcome">outcome</span> and the impact (Joshua Seiden, "Outcomes Over Output", 2019).
- I am accountable for clarity: everyone knows what we do, why, and what we do not do.
- I write decisions down, what we set aside and what would make us change our mind.
- I negotiate room to act together with the goal: an outcome without levers is an empty responsibility.

**Read next**: [What the PM is accountable for](../../knowledge/product-management.md#what-the-pm-is-accountable-for), [Outcomes over outputs](../../knowledge/product-management.md#outcomes-over-outputs), [The PM by company stage](../../knowledge/product-management.md#the-pm-by-company-stage)

## Product sense

### "Design an app that helps students cook", "Design a product for X"

- I clarify first: which goal (growth, revenue, social impact), which constraint, which horizon?
- I pick a precise segment rather than "students": for example those who have just left home and cook alone on a small budget.
- I list their needs as situations, in the spirit of <span class="term" data-term="jobs-to-be-done">jobs to be done</span>: "in the evening, I do not know what to make with what is left in my fridge".
- I prioritise one need (frequency, pain, what already exists), I propose three solutions, I pick one and say why.
- I end with measurement: a main metric, an input metric and a guardrail, then a limit of my choice.
- Lewis Lin's CIRCLES framework ("Decode and Conquer", 2013) follows this order; I use it as a thread, without reciting it.

**Read next**: [Jobs to be done](../../knowledge/culture-entreprise.md#jobs-to-be-done), [Continuous discovery and the opportunity solution tree](../../knowledge/product-management.md#continuous-discovery-and-the-opportunity-solution-tree), [The problem statement](../../knowledge/product-management.md#the-problem-statement), [Exercise 1: design a product](exercices.md#exercise-1-design-an-app-that-helps-students-cook)

### "What is your favourite product, and how would you improve it?"

- I pick a product I really use and whose users I know, not the most famous one.
- I say who it is made for and which need it serves, then what it does better than its competitors.
- I identify a poorly served segment and a precise pain, observed in myself or in others.
- I propose an improvement, say how I would test it cheaply and how I would measure its success.
- I avoid "add a dark mode": an improvement is justified by a need, not by a feature list.

**Read next**: [The four risks](../../knowledge/product-management.md#the-four-risks), [Kano model](../../knowledge/product-management.md#kano-model), [HEART](../../knowledge/product-management.md#heart)

## Discovery and user research

### "How do you know an idea is worth building?"

- I list Marty Cagan's four risks ("Inspired", 2017): value, usability, feasibility, viability.
- I do an <span class="term" data-term="assumption-mapping">assumption map</span> and test first the assumptions that are important and lack evidence.
- I pick the cheapest test that answers: a <span class="term" data-term="fake-door-test">fake door</span>, a <span class="term" data-term="concierge-test">concierge</span>, a clickable prototype.
- I write the success criterion before the test, with a decision date.
- Example: a two-week concierge test with 30 riders instead of two months of building the booking feature [example numbers].

**Read next**: [The four risks](../../knowledge/product-management.md#the-four-risks), [Mapping assumptions](../../knowledge/product-management.md#mapping-assumptions), [Prototypes and tests](../../knowledge/product-management.md#prototypes-and-tests-fake-door-concierge-wizard-of-oz)

### "How do you run a user interview?"

- I follow the <span class="term" data-term="mom-test">Mom Test</span> (Rob Fitzpatrick, 2013): I talk about their life, not my idea.
- I ask for past facts ("tell me about the last time..."), never promises ("would you use...?").
- I look for a real commitment (leaving a phone number, paying upfront) rather than a compliment.
- I also interview those who left, not only the loyal ones.
- I write down exact quotes during the interview, and I do one interview a week rather than one big study a year.

**Read next**: [Interviewing without bias: The Mom Test](../../knowledge/product-management.md#interviewing-without-bias-the-mom-test), [Continuous discovery and the opportunity solution tree](../../knowledge/product-management.md#continuous-discovery-and-the-opportunity-solution-tree)

### "What is an MVP? Give an example."

- Eric Ries's <span class="term" data-term="mvp">MVP</span> ("The Lean Startup", 2011) is an experiment: the most validated learning for the least effort.
- It is not a cut-price version 1: one assumption, one decision criterion, a short duration.
- At the end, I persevere or pivot, based on the criterion written beforehand.
- "Minimum" is about scope, not about the quality of what is shown.
- Example: booking by text message for 30 riders; criterion: 18 out of 30 book twice a week for two weeks [example numbers].

**Read next**: [MVP and build-measure-learn](../../knowledge/product-management.md#mvp-and-build-measure-learn), [Prototypes and tests](../../knowledge/product-management.md#prototypes-and-tests-fake-door-concierge-wizard-of-oz)

### "An executive comes with a ready-made solution, what do you do?"

- I say neither yes nor no: I go back to the problem ("which customer, which situation, what does it cost them today?").
- I write a <span class="term" data-term="problem-statement">problem statement</span> without the solution, and have the executive validate it.
- I propose two or three solutions, theirs included, and a quick test to decide between them.
- If their solution wins, good: I have made it measurable.
- Example: "we need booking" becomes "30% of morning riders find their station empty".

**Read next**: [The problem statement](../../knowledge/product-management.md#the-problem-statement), [Influence without authority](../../knowledge/culture-entreprise.md#influence-without-authority-and-communities-of-practice)

## Prioritization and roadmap

### "How do you prioritise?", "You have five requests and one team, what do you do?"

- I first go back to the quarter's goal: which request moves it?
- I use a written method, like the <span class="term" data-term="rice-score">RICE score</span> (Sean McBride, Intercom, 2016), to make the assumptions visible.
- I state its limit: RICE favours small, broad items, like a dark mode, and ignores the cost of delay.
- I handle separately what has an imposed date (contract, law), with the <span class="term" data-term="cost-of-delay">cost of delay</span> (Reinertsen, 2009).
- I write the decision and its reason, refusals included, and publish it.

**Read next**: [RICE](../../knowledge/product-management.md#rice), [WSJF and cost of delay](../../knowledge/product-management.md#wsjf-and-cost-of-delay), [Which method, and when it fails](../../knowledge/product-management.md#which-method-and-when-it-fails), [Exercise 3: prioritise a backlog](exercices.md#exercise-3-prioritize-a-backlog-of-eight-items-with-rice)

### "How do you say no to an executive or a big customer?"

- I rephrase the need behind the request, to show I understood it.
- I show the <span class="term" data-term="opportunity-cost">opportunity cost</span>: what slips if we take the request.
- I propose a cheaper alternative (an export done by hand for this customer) and a condition for reconsidering.
- I log every refused request and go back to its author if the context changes.
- I rely on the written goal and on data, not on my intuition alone.

**Read next**: [Saying no](../../knowledge/product-management.md#saying-no), [Communicating a trade-off](../../knowledge/product-management.md#communicating-a-trade-off)

### "What does your roadmap look like?", "Sales wants a date, what do you answer?"

- A <span class="term" data-term="now-next-later">Now, Next, Later</span> roadmap (Janna Bastow): the precision shown matches the real precision.
- Each item says which outcome it serves: it is an outcome roadmap, not a feature list.
- I give dates where they really exist (start of the university year, contract, law), with a confidence: "1 September, 80% confidence, if...".
- For a real date, I fix the date and let the scope vary, with MoSCoW.
- I flag a risk as soon as an assumption falls, not the day before.

**Read next**: [Now, Next, Later](../../knowledge/product-management.md#now-next-later), [Outcome or date roadmap](../../knowledge/product-management.md#outcome-or-date-roadmap), [Holding a date commitment](../../knowledge/product-management.md#holding-a-date-commitment), [Exercise 8: a demanded date](exercices.md#exercise-8-arbitrate-the-roadmap-against-a-demanded-date)

## Metrics and analytics

### "Which North Star would you pick for our product?"

- I start from the value users receive: a <span class="term" data-term="north-star-metric">North Star</span> captures that value and predicts future revenue.
- For `bike-app`: rides completed per week; for `recipe-app`: recipes cooked per week, not recipes viewed.
- I break it down into <span class="term" data-term="input-metric">input metrics</span> a team can act on (active riders, rides per rider, bikes available).
- I add a counter-measure against Goodhart's law: a volume North Star grows with free rides handed out en masse.
- I refuse <span class="term" data-term="vanity-metric">vanity metrics</span> (cumulative downloads), which always go up.

**Read next**: [North Star and metric tree](../../knowledge/product-management.md#north-star-and-metric-tree), [North Star metric](../../knowledge/culture-entreprise.md#north-star-metric), [Avoiding the Goodhart trap](../../knowledge/culture-entreprise.md#avoiding-the-goodhart-trap)

### "How would you define success for this feature?"

- I first say which behaviour must change, and for whom: that is the main metric.
- I use HEART (Google, CHI 2010) and its goals, signals, metrics approach, keeping only two useful categories.
- I add one or two <span class="term" data-term="guardrail-metric">guardrail metrics</span>, with their threshold written beforehand.
- I set the baseline, the target, the reading date and the decision I will take depending on the result.
- I put the <span class="term" data-term="tracking-plan">tracking plan</span> in the definition of done: no events, no measurement.

**Read next**: [HEART](../../knowledge/product-management.md#heart), [Guardrail metrics](../../knowledge/product-management.md#guardrail-metrics), [Definition of done](../../knowledge/product-management.md#definition-of-done), [Exercise 4: success metrics](exercices.md#exercise-4-define-the-success-metrics-of-a-feature)

### "Active users dropped by 15% yesterday, what do you do?"

- I check the drop is real: tracking change, late dashboard, collection bug.
- I compare with the same weekday the week before, not with the previous day.
- I separate external causes (holidays, weather, an app store outage) from internal ones (release, price, a campaign stopped).
- I segment: platform, version, country, new or existing users, <span class="term" data-term="conversion-funnel">funnel</span> step.
- I give a hypothesis, the query that checks it, then the action and how I communicate it; I watch out for <span class="term" data-term="simpson-paradox">Simpson's paradox</span>.

**Read next**: [Investigating a metric drop](../../knowledge/product-management.md#investigating-a-metric-drop), [Funnel and activation](../../knowledge/product-management.md#funnel-and-activation), [Exercise 2: diagnose a drop](exercices.md#exercise-2-diagnose-a-drop-in-active-users)

### "Your A/B test shows +3% conversion, do we ship it?"

- I first check the split between groups: a <span class="term" data-term="sample-ratio-mismatch">sample ratio mismatch</span> invalidates everything else.
- I read the <span class="term" data-term="confidence-interval">confidence interval</span> of the difference: does it contain 0, is its lower bound worth the change?
- I look at the difference week by week to spot a <span class="term" data-term="novelty-effect">novelty effect</span>.
- I check the guardrails and refuse to hunt afterwards for the segment where "it works".
- I recall the rule: sample size fixed beforehand, no stopping as soon as the number looks good.

**Read next**: [Experimenting with an A/B test](../../knowledge/product-management.md#experimenting-with-an-ab-test), [A/B testing](../../knowledge/donnees-decision.md#ab-testing), [Exercise 5: read an A/B test](exercices.md#exercise-5-read-the-result-of-an-ab-test)

### "How do you know a product has found its market?"

- The most reliable sign: a <span class="term" data-term="cohort-retention">cohort retention</span> curve that flattens above zero.
- Sean Ellis's test: at least 40% "very disappointed" if the product disappeared [Take with caution: a threshold drawn from its author's experience, with no published study].
- I read both per segment: one segment may have found its market while the average has not.
- Before that point, speeding up acquisition fills a leaky bucket.

**Read next**: [Product-market fit](../../knowledge/product-management.md#what-product-market-fit-means), [Sean Ellis's 40% test](../../knowledge/product-management.md#sean-elliss-40-test), [The flattening retention curve](../../knowledge/product-management.md#the-flattening-retention-curve)

## Execution

### "How do you write a story and its acceptance criteria?"

- A <span class="term" data-term="user-story">story</span> starts from a user, a need and a value, and follows INVEST (Bill Wake, 2003).
- I slice vertically: each slice goes through database, API and screen and can ship on its own.
- I write the <span class="term" data-term="acceptance-criteria">acceptance criteria</span> with the developer and the QA engineer, in Gherkin when useful.
- I describe behaviour, not the interface: "the bike becomes available again", not "the button turns grey".

**Read next**: [User stories and INVEST](../../knowledge/product-management.md#user-stories-and-invest), [Acceptance criteria](../../knowledge/product-management.md#acceptance-criteria), [Gherkin with a "Goal"](../../knowledge/conception-tests.md#gherkin-with-a-goal), [Exercise 9: slice an epic](exercices.md#exercise-9-slice-an-epic-into-stories-with-gherkin-criteria)

### "Launch is in two weeks and the team will not make the date, what do you do?"

- I check whether the date is external (contract, season) or internal: an internal target can move.
- For an external date, I cut scope (MoSCoW), never the tests.
- I do not add people at the last minute: <span class="term" data-term="brooks-law">Brooks's law</span> (1975) says it delays things further.
- I tell stakeholders right away, with two costed options and my recommendation.
- I note what made the estimate slip, for next time.

**Read next**: [Holding a date commitment](../../knowledge/product-management.md#holding-a-date-commitment), [MoSCoW](../../knowledge/product-management.md#moscow), [Communicating a trade-off](../../knowledge/product-management.md#communicating-a-trade-off)

### "How do you prepare a launch?"

- I separate deploying, enabling and launching: a <span class="term" data-term="feature-flag">feature flag</span> lets me deploy without showing.
- I open progressively (closed beta, 5%, 50%, 100%) while watching the guardrails.
- I prepare the <span class="term" data-term="go-to-market">go-to-market</span>: segment, message, channel, price, trained support and sales.
- I write the release note for the user, not for the team.
- Eight weeks later, I check whether the target outcome moved: keep, improve or remove.

**Read next**: [Shipping a feature](../../knowledge/product-management.md#shipping-a-feature-flags-beta-launch), [Progressive deployment](../../knowledge/livraison.md#progressive-deployment)

### "How do you trade off new features against technical debt?"

- I do not set it against features: I tie <span class="term" data-term="technical-debt">technical debt</span> to an outcome I track (lead time, incidents).
- I ask the tech lead for the list of debts ranked by cost.
- I reserve a fixed share of capacity, for example 20%, that is not renegotiated every sprint.
- I accept deliberate, prudent debt for an MVP, if its repayment is written down.

**Read next**: [Negotiating technical debt](../../knowledge/product-management.md#negotiating-technical-debt)

## Strategy and market

### "Should we launch our offer in this new market?"

- I size the market bottom-up (<span class="term" data-term="tam-sam-som">TAM, SAM, SOM</span>), from customers I can count.
- I look at the economics of one customer: <span class="term" data-term="customer-lifetime-value">customer lifetime value</span> and <span class="term" data-term="customer-acquisition-cost">acquisition cost</span>.
- I check that the product has already found its market in the original segment: otherwise, I export a problem.
- I propose a limited test (one city, one segment) with a decision criterion.
- I say what we will not do in the meantime.

**Read next**: [TAM, SAM, SOM](../../knowledge/product-management.md#market-size-tam-sam-som), [LTV and CAC](../../knowledge/product-management.md#customer-value-and-acquisition-cost-ltv-and-cac), [Good and bad strategy](../../knowledge/culture-entreprise.md#good-and-bad-strategy), [Exercise 6: market size](exercices.md#exercise-6-estimate-a-market-and-the-economics-of-a-subscription)

### "A competitor launches the same feature for free, what do you do?"

- I do not copy in a panic: I first check whether our customers are leaving (retention, cancellations, reasons given).
- I go back to what sets us apart and what our best customers love.
- I assess the threat with the innovator's dilemma (Christensen, 1997): a "worse but free" offer can take the low end of the market.
- I answer on value (quality, integration, service) before price.

**Read next**: [The innovator's dilemma](../../knowledge/culture-entreprise.md#the-innovators-dilemma), [Wardley maps](../../knowledge/culture-entreprise.md#wardley-maps), [Sean Ellis's 40% test](../../knowledge/product-management.md#sean-elliss-40-test)

### "How would you price our subscription?"

- Three references: cost, competitors, perceived value (<span class="term" data-term="value-based-pricing">value-based pricing</span>); for a digital product, mostly the last two.
- I look for an acceptable range (Van Westendorp questionnaire, 1976), then test on a segment or a city.
- I check the effect on LTV, not only on conversion.
- I decide with finance and legal, and I know a price cut is hard to take back.

**Read next**: [Pricing basics](../../knowledge/product-management.md#pricing-basics), [LTV and CAC](../../knowledge/product-management.md#customer-value-and-acquisition-cost-ltv-and-cac)

### "How many recipes are cooked in France every evening?", "How many bikes for a city of 500,000 people?"

- A <span class="term" data-term="fermi-estimate">Fermi estimate</span>: I break the question into factors I can estimate, then multiply.
- I say each assumption out loud, with a round number.
- I check the order of magnitude at the end, by another route or a known reference.
- The approach is judged, not the number.

**Read next**: [Estimating an order of magnitude](../../knowledge/product-management.md#estimating-an-order-of-magnitude), [Exercise 6: market size](exercices.md#exercise-6-estimate-a-market-and-the-economics-of-a-subscription)

## Stakeholders and leadership

### "How do you align stakeholders who disagree?"

- I draw a <span class="term" data-term="stakeholder-map">stakeholder map</span> (power, interest) and do not forget those who bear the decision (support, maintenance).
- I see them one to one before the decision meeting (<span class="term" data-term="nemawashi">nemawashi</span>).
- I present named options, what we gain and what we lose, the recommendation first (<span class="term" data-term="pyramid-principle">pyramid principle</span>).
- Once the decision is made, I ask for <span class="term" data-term="disagree-and-commit">disagree and commit</span>, and write it down.

**Read next**: [Mapping and aligning stakeholders](../../knowledge/product-management.md#mapping-and-aligning-stakeholders), [Communicating a trade-off](../../knowledge/product-management.md#communicating-a-trade-off), [Disagree and commit](../../knowledge/culture-entreprise.md#disagree-and-commit), [Pyramid principle](../../knowledge/culture-entreprise.md#pyramid-principle)

### "How do you influence a team you do not manage?"

- I have no line authority over the team: I convince through the problem, the data and listening.
- I share user interviews and raw numbers: the team forms its own opinion.
- I make room for other people's ideas, and credit their contributions publicly.
- I write a <span class="term" data-term="one-pager">one-pager</span> for an important decision: one page, one expected decision, one date.

**Read next**: [Influence without authority](../../knowledge/culture-entreprise.md#influence-without-authority-and-communities-of-practice), [One-pager](../../knowledge/culture-entreprise.md#one-pager), [Working Backwards](../../knowledge/product-management.md#working-backwards-the-press-release-and-faq), [Exercise 7: PR/FAQ](exercices.md#exercise-7-write-a-prfaq-for-a-new-offer)

### "What do you do in your first 90 days?"

- Month 1, understand: users (about ten interviews), numbers (funnel, retention), team and stakeholders; I read past decisions.
- Month 2, a <span class="term" data-term="quick-win">quick win</span>, visible and low risk, chosen with the team.
- Month 3, a Now, Next, Later roadmap with an outcome goal, validated by the team and leadership.
- I lean on Michael Watkins ("The First 90 Days", 2003): I negotiate the expected success with my manager from the start.

**Read next**: [The first 90 days in a new role](../../knowledge/culture-entreprise.md#the-first-90-days-in-a-new-role), [OKR](../../knowledge/culture-entreprise.md#okr)

## Behavioural questions

### "Tell me about a product or feature that failed"

- I use the <span class="term" data-term="star-method">STAR method</span>: situation, task, action, result, then what I learned.
- I pick a real failure I was accountable for, not a fake flaw ("I work too much").
- I show what I measured, how I decided to stop and what I changed in my way of working afterwards.
- Example of the shape: a feature shipped without a value test, used by 2% of users, removed after eight weeks; since then, I test with a fake door before building [example numbers].

**Read next**: [Telling an experience with the STAR method](../../knowledge/culture-entreprise.md#telling-an-experience-with-the-star-method), [Prototypes and tests](../../knowledge/product-management.md#prototypes-and-tests-fake-door-concierge-wizard-of-oz)

### "Tell me about a disagreement with an engineer or a designer"

- I tell a disagreement on substance (scope, debt, solution), not a personal conflict.
- I show that I listened to their risk before defending mine, and that we looked for a fact to settle it (a spike, a user test).
- I say who decided, and how the side that lost committed.
- I end with the result and what the relationship gained.

**Read next**: [Disagree and commit](../../knowledge/culture-entreprise.md#disagree-and-commit), [The product trio](../../knowledge/product-management.md#the-product-trio), [Negotiating technical debt](../../knowledge/product-management.md#negotiating-technical-debt)

### "Data or intuition: tell me about a decision made without enough data"

- I tell reversible decisions from irreversible ones (type 1 and type 2 decisions, Jeff Bezos, 2015 shareholder letter).
- For a reversible decision, I decide quickly with what I have and plan the measurement that will make me correct course.
- For an irreversible decision, I look for a cheap test that produces the missing data.
- I say what would have changed my mind, and what happened.

**Read next**: [Type 1 and type 2 decisions](../../knowledge/culture-entreprise.md#type-1-and-type-2-decisions), [Deciding with data](../../knowledge/donnees-decision.md#deciding-with-data)

## AI features in the product

!!! info "Section written in November 2026"
    Models, their costs and legal obligations change fast. Dates and tool names are to check at the time of reading.

### "Would you add an AI feature to our product?", "How do you measure its quality?"

- I start from an opportunity, not the technology: which frequent task would an approximate answer already help?
- I ask what a wrong answer costs: a <span class="term" data-term="hallucination">hallucination</span> about a recipe costs a dinner, about a refund it costs money.
- The more an error costs, the more I keep a <span class="term" data-term="human-in-the-loop">human in the loop</span>.
- Before launch, an <span class="term" data-term="llm-eval">eval</span> on real questions, with a written threshold; I replay it at every model change.
- After, I measure task success, not the number of messages, with a guardrail (complaints), the cost per request and the duty to tell users (AI Act, article 50, from 2 August 2026, to check).

**Read next**: [An AI feature in the product](../../knowledge/product-management.md#an-ai-feature-in-the-product), [Hallucination](../../knowledge/ia-agents.md#hallucination), [Testing an agent-based system](../../knowledge/ia-capacites.md#testing-an-agent-based-system), [The four risk levels of the AI Act](../../knowledge/ia-entreprise.md#the-four-risk-levels)

## Elimination criteria

Three questions where a single bad answer is enough to rule out a PM candidate.

| Interviewer's question | Answer that eliminates | What I answer | Read next |
|---|---|---|---|
| "How do you know your feature succeeded?" | "It shipped on time", or "users liked it in the demo". | Through a behaviour change measured against a baseline, with a guardrail, read on a date set before launch; and I say what I would have done if the number had not moved. | [Outcomes over outputs](../../knowledge/product-management.md#outcomes-over-outputs), [Guardrail metrics](../../knowledge/product-management.md#guardrail-metrics) |
| "How do you validate an idea with users?" | "I show them the mock-up and ask whether they would use it." | I get them to tell past facts following the Mom Test, I test the riskiest assumption with a fake door or a concierge, with a criterion written beforehand. | [The Mom Test](../../knowledge/product-management.md#interviewing-without-bias-the-mom-test), [Prototypes and tests](../../knowledge/product-management.md#prototypes-and-tests-fake-door-concierge-wizard-of-oz) |
| "Who decides the technical solution and the estimate?" | "I do: I give the team the detailed specs and the date." | The team estimates and the tech lead picks the solution; I give the problem, the outcome and the constraints, and I propose cutting scope when the range exceeds the appetite. | [The product trio](../../knowledge/product-management.md#the-product-trio), [Estimating and slicing](../../knowledge/product-management.md#estimating-and-slicing) |

## The 3 things a PM does all the time

1. **Start from the users' problem, heard from them.** I talk to users every week and write the problem before the solution. Example: "we need booking" becomes "morning riders find their station empty".
2. **Choose, and say what we do not do.** One outcome goal, an explicit prioritisation method, reasoned refusals. Example: dark mode waits, because it does not move the second ride of new sign-ups.
3. **Measure the effect and correct.** Baseline, target, guardrail, reading date, and the courage to remove what does not help. Example: a feature used by 2% of users after eight weeks is removed, and the lesson changes the next discovery.

## Simple structure for an oral answer

For a behavioural question, I follow the STAR method and end with what I learned ([Telling an experience with the STAR method](../../knowledge/culture-entreprise.md#telling-an-experience-with-the-star-method)). For a case study, I follow this thread:

1. **Clarify**: which goal, which constraint, which horizon? One or two questions, not ten.
2. **Users**: which precise segment, and why this one?
3. **Needs**: which painful situations, how often?
4. **Options**: three solutions, from the lightest to the heaviest.
5. **Choice**: which one, why, and what I do not do.
6. **Measurement**: main metric, input metric, guardrail, baseline and target.
7. **Risks and next steps**: the limit of my choice, and the test that would check it cheaply.

The core idea: a product manager is not judged by the number of features shipped. They pick the right problem for the right users, make assumptions visible, test before building, measure the effect and know how to stop what does not help.

## Measuring success

I am almost always asked "how do you know it worked?". My answer takes the same shape for every initiative: a **baseline** measured before (for example, 22% of `recipe-app` new sign-ups cook two recipes in their first 14 days), the **same measure after**, on the next cohorts, and a **guardrail metric** that must not degrade (the rate of notifications switched off, or support tickets). Then I give, per solution, an internal <span class="term" data-term="sli">SLI</span> and <span class="term" data-term="slo">SLO</span>; an <span class="term" data-term="sla">SLA</span> only makes sense when a customer has signed a promise.

| Solution | Success indicator (SLI) | Likely SLO | Likely SLA |
|---|---|---|---|
| quarterly outcome goal | share of shipped bets that move their outcome the right way | at least 1 in 3 [Take with caution: example order of magnitude, depends on the product] | n/a: no external contract |
| continuous discovery | user interviews per trio per week | at least 1 a week, 10 weeks out of 12 [Take with caution: example value] | n/a: no external contract |
| activation | share of new sign-ups who cook 2 recipes within 14 days | from 22% to 30% in one quarter [Take with caution: example value] | n/a: no external contract |
| external date commitment | share of dates promised to partners kept over the year | at least 90% [Take with caution: example value] | depends on the contract: a date promised to a partner may carry a penalty |
| feature launch | share of targeted users who used it at least once within 30 days | at least 15% [Take with caution: example value] | n/a: no external contract |
| AI feature | share of questions solved without a ticket, with stable complaints | at least 40% [Take with caution: example value, no external standard] | n/a: no external contract |

## Pitfalls to avoid

| Pitfall | What happens | Solution |
|---|---|---|
| **Jumping to the solution**: on "design a product for X", I describe screens in the first minute. | The interviewer sees neither the segment, nor the need, nor the reason for the choice. | I clarify, pick a segment and a need, then three solutions ([Structure for an oral answer](#simple-structure-for-an-oral-answer)). |
| **Covering everyone**: I design for "students" or "users". | The answer stays generic and nothing is prioritised. | I pick a precise segment and say why ([Product sense](#product-sense)). |
| **Measuring delivery**: I answer "the feature shipped on time". | Elimination criterion: I show I judge output, not outcome. | Baseline, target, guardrail and reading date ([Measuring success](#measuring-success)). |
| **Trusting the score**: I rank the backlog by RICE score and stop there. | Dark mode goes ahead of what serves the goal. | The score opens the discussion, the goal decides ([Prioritization](#prioritization-and-roadmap)). |
| **Concluding on the first cause**: "active users are down, it is the weather". | The real bug stays in production. | Real, external or internal, then segment ([Metrics and analytics](#metrics-and-analytics)). |
| **Answering in the conditional**: I say "I would" with no lived story. | The answer sounds like a recited book. | One STAR story per theme, with my numbers ([Behavioural questions](#behavioural-questions)). |
| **Promising a date to please**: I give sales the date they want. | The promise becomes firm in their head, and I miss it. | A date with its confidence and conditions, variable scope ([Prioritization](#prioritization-and-roadmap)). |
