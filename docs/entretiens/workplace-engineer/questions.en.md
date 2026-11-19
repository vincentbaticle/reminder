# Workplace Engineer interview: the questions

!!! warning "Disclaimer"
    These notes are personal cheat sheets, not a source of truth. They reflect my own understanding and choices: their content remains subjective, despite the quotes and references it contains. It may be incomplete, simplified, inaccurate or outdated. Always check the official documentation before applying it. This content is provided as is, without any warranty: you use it at your own risk.

!!! audience "Who and what for"
    - **Roles**: workplace engineer (or corporate engineer, IT engineer), system administrator aiming at an engineering role, IT support lead who automates, security engineer focused on devices and identity, platform engineer taking over internal IT.
    - **Uses**: I prepare a workplace engineer interview next week and I want the list of questions with an answer outline; the day before, I reread a single theme, like identity; I look for the Knowledge page that explains a notion I want to quote, like SCIM; I prepare one lived story per theme, like a departure whose access cut-off I automated.

This page lists, theme by theme, the questions a Workplace Engineer gets asked, worded the way the interviewer says them. For each question, I read the answer outline (a few lines, in the first person), then I open the linked Knowledge section, which holds the full explanation, the examples and the pitfalls. The outline is not something to recite: it structures **a lived story**, with my own numbers (new hires ready on day one, cut-off delay at departure, tickets avoided). When I have not lived a case, I present it as a scenario and explain my reasoning.

The role mixes three jobs: identity and access, workstations, and support. The interviewer looks for someone who handles all three **as code** (versioned, reviewed, tested, measured) and treats employees as the users of a product. The company `acme.example`, the team `team-core` and the people `ada` and `grace` are fictitious; the numbers are examples. The live exercises, with corrected scripts, queries and plans, are in [Workplace Engineer interview: the exercises](exercices.md).

## The role and IT as a product

### "What is a workplace engineer, and how is it different from support or IT operations?"

- I define <span class="term" data-term="workplace-engineering">workplace engineering</span> by its scope: everything an employee uses to work, outside the product the company sells (identity, computer, online tools, office network, support).
- Support handles requests one by one, operations keeps the existing services running, security sets the rules; I build and automate the system that makes those gestures unnecessary or safe.
- My stance: every request that comes back is a sign that an automation or a self-service page is missing.
- Example: instead of creating every `team-core` joiner's accounts by hand, I write the rule that does it from the HRIS, and the test that checks it.

**Read next**: [The role: workplace engineering](../../knowledge/workplace.md#the-role-workplace-engineering), [Terminology](../../knowledge/workplace.md#terminology)

### "How do you treat internal IT as a product?", "How do you know whether employees are happy with IT?"

- My users are the employees, and their lost time is my first indicator.
- I start from their frequent tasks (joining, getting access, replacing a laptop) rather than from the tools I administer.
- I publish a measurable promise, like <span class="term" data-term="day-one-readiness">day-one readiness</span>: 95% of joiners ready at 9 a.m. [example figure].
- I measure by ticket category, with a short question after each closed ticket and a twice-yearly survey, and I publish three actions after each survey.
- A team that works around IT (a tool bought with a card) gives me a product signal, not a lack of discipline.

**Read next**: [The role: workplace engineering](../../knowledge/workplace.md#the-role-workplace-engineering), [Joining and leaving as a product](../../knowledge/workplace.md#joining-and-leaving-as-a-product), [Jobs to be done](../../knowledge/culture-entreprise.md#jobs-to-be-done)

### "What would you do in your first three months?"

- Month 1, understand: I follow ten real joiners and ten real leavers, I read a month of tickets by category, I list the admin tools and who has access to them.
- I take a baseline: cut-off delay at departure, share of encrypted and up-to-date devices, share of SaaS behind SSO.
- Month 2, prove: a quick, low-risk win, like a form that automates the most frequent access request.
- Month 3, set direction: a roadmap of three to five costed projects, agreed with security and HR, with what I will not do.
- I also check two serious risks right away: do emergency accounts exist, and do administrators have strong MFA?

**Read next**: [The first 90 days in a new role](../../knowledge/culture-entreprise.md#the-first-90-days-in-a-new-role), [Measuring success (workplace)](../../knowledge/workplace.md#measuring-success), [Emergency accounts](../../knowledge/workplace.md#emergency-accounts-break-glass)

## Identity and access

### "What is the difference between SSO and SCIM? Between SAML and OIDC?"

- <span class="term" data-term="sso">SSO</span> says **who** logs in: the application delegates login to the identity provider.
- <span class="term" data-term="scim">SCIM</span> (RFC 7643 and 7644, published in 2015) **creates and closes** accounts in the application, through a standard REST API; without it, ada hits "account does not exist" and grace keeps her account after she leaves.
- <span class="term" data-term="saml">SAML 2.0</span> (OASIS, 2005) carries a signed XML assertion through the browser; OpenID Connect (2014) a JWT token on top of OAuth 2.0.
- In practice: SAML for many established SaaS, OIDC for recent and mobile applications; above all I check whether the vendor reserves SSO for its most expensive plan.

**Read next**: [Identity provider and SSO](../../knowledge/workplace.md#identity-provider-and-sso), [Automatic provisioning: SCIM](../../knowledge/workplace.md#automatic-provisioning-scim), [OpenID Connect](../../knowledge/securite.md#openid-connect-oidc-knowing-who-is-logged-in)

### "Someone leaves the company tonight at 6 p.m. Walk me through everything that happens."

- The <span class="term" data-term="hris">HRIS</span> is the source of truth: the departure is entered there with its time, and it is the trigger.
- At 6 p.m., the identity provider suspends the account and revokes sessions and tokens; SCIM deactivates application accounts and frees the licences; the MDM locks the laptop if it has not been returned.
- Applications without SSO each open a named task; files and the mailbox go to the manager according to the policy.
- Everything is logged, and a check on D+1 confirms that no access remains.
- I mention the contentious departure: cut-off to the hour, coordinated with HR and the manager.

**Read next**: [Joiner, mover, leaver](../../knowledge/workplace.md#joiner-mover-leaver-the-lifecycle-driven-by-the-hris), [Scripts against admin APIs](../../knowledge/workplace.md#scripts-against-admin-apis), [Departure: retaining and transferring data](../../knowledge/workplace.md#departure-retaining-and-transferring-data), [Exercise 1: joiners and leavers](exercices.md#exercise-1-automating-joiners-and-leavers-from-the-hris)

### "How do you handle a team change?", "How do you stop someone from piling up access rights?"

- The mover in the <span class="term" data-term="joiner-mover-leaver">joiner, mover, leaver</span> cycle is the case most often missed: new access gets added and the old one is never removed.
- I never grant access to a person: I grant it to a group computed from an HRIS attribute (team, job, country), so changing team removes the old group the same day.
- For on-request access, a quarterly <span class="term" data-term="access-review">access review</span> by the access owner, with the last login shown.
- Example: after three team changes, ada held the rights of three teams; with computed groups, she only has `team-data`'s.

**Read next**: [Groups, roles and access reviews](../../knowledge/workplace.md#groups-roles-and-access-reviews), [Modeling permissions: RBAC](../../knowledge/securite.md#modeling-permissions-rbac-abac-rebac)

### "Which MFA would you choose, and for whom first?", "Should passwords change every 90 days?"

- <span class="term" data-term="phishing-resistant-mfa">Phishing-resistant MFA</span> (a FIDO2 key or a <span class="term" data-term="passkey">passkey</span>) binds the proof to the real domain name, so a fake site gets nothing; SMS and codes can be copied.
- Administrators of the identity provider, the MDM and mail first, then everyone, group by group.
- Two registered methods per person, and a recovery checked on a video call with ID, never through a plain call to support.
- No to changes every 90 days: NIST SP 800-63B (2017, confirmed in 2025) asks for a change only after a compromise.

**Read next**: [Phishing-resistant MFA](../../knowledge/workplace.md#phishing-resistant-mfa), [Misconception: changing passwords every 90 days](../../knowledge/workplace.md#misconception-changing-passwords-every-90-days), [Social engineering](../../knowledge/cybersecurite.md#social-engineering)

### "What is an emergency account, and how do you protect it?"

- A <span class="term" data-term="break-glass-account">break-glass account</span> is an administrator account excluded from conditional access rules, kept under lock, to repair things when a wrong rule or an MFA outage locks everyone out.
- Two accounts, not tied to a person, protected by FIDO2 keys kept in a safe.
- Every login triggers an immediate alert to security.
- I test it every quarter: an account never tested does not work on the day it is needed, an account without an alert is a back door.

**Read next**: [Emergency accounts (break-glass)](../../knowledge/workplace.md#emergency-accounts-break-glass)

### "One application refuses SSO logins since this morning, the others work. How do you investigate?"

- A single application affected: it is a configuration mismatch, not an identity provider outage.
- I read the <span class="term" data-term="saml-assertion">SAML assertion</span> in the identity provider's log or with a browser extension, and compare field by field.
- The frequent causes: <span class="term" data-term="clock-skew">clock skew</span>, an audience or return address that does not match, a signing certificate renewed on one side only, an identifier in the wrong format.
- I do not "fix" it by turning off signature checking or by raising the clock tolerance to one hour.
- For the future, a list of SAML applications with their certificate's expiry date and an alert 30 days before.

**Read next**: [Debugging a SAML login](../../knowledge/workplace.md#debugging-a-saml-login), [Exercise 2: SAML login](exercices.md#exercise-2-debugging-a-failing-saml-login)

## Device management

### "How would you get 50 new hires ready on the same Monday?", "A new hire works remotely, how does she get her laptop?"

- <span class="term" data-term="zero-touch-enrollment">Zero-touch enrollment</span>: the laptop is tied to the company by serial number at purchase (Apple Business Manager or Windows Autopilot), delivered still wrapped to the person, and enrolls itself in the MDM on first boot.
- Accounts are created from the HRIS ten days before, disabled until the day before, with the team's groups.
- The promise: at 9 a.m., encrypted laptop, active account, passkey to register in two minutes, team applications installed.
- I measure the share of joiners ready at 9 a.m., and I agree a minimum entry delay with HR.

**Read next**: [Zero-touch enrollment](../../knowledge/workplace.md#zero-touch-enrollment), [Joining and leaving as a product](../../knowledge/workplace.md#joining-and-leaving-as-a-product), [Onboarding (DevX)](../../knowledge/devx.md#onboarding), [Exercise 4: remote onboarding](exercices.md#exercise-4-designing-zero-touch-onboarding-for-a-remote-hire)

### "What is an MDM, and what does declarative management change?"

- An <span class="term" data-term="mdm">MDM</span> keeps a link with every enrolled device: it pushes configuration profiles, applications and commands (lock, wipe), and receives an inventory.
- With Apple's <span class="term" data-term="declarative-device-management">declarative device management</span> (2021, extended to the Mac in 2022), the server sends a desired state, the device applies and keeps it on its own, then reports its changes.
- It is the same idea as GitOps: I describe the result, not the steps.
- I check what my tool supports before planning a migration, and I watch the yearly expiry of the Apple push certificate.

**Read next**: [MDM and configuration profiles](../../knowledge/workplace.md#mdm-and-configuration-profiles), [Apple declarative device management](../../knowledge/workplace.md#apple-declarative-device-management)

### "Developers want Linux, and sales people want their personal phone. What do you answer?"

- Linux: yes if I can prove the same controls (encryption, updates, screen lock) with a configuration tool and an inventory agent like osquery; otherwise a Mac or a remote development environment.
- Personal phone (<span class="term" data-term="byod">BYOD</span>): no full takeover, but a user enrollment that separates company data and only wipes that.
- Conditional access refuses sensitive applications to non-compliant devices.
- I write down what the company sees on a personal device, for trust and for GDPR.

**Read next**: [Linux and personal devices (BYOD)](../../knowledge/workplace.md#linux-and-personal-devices-byod), [Device trust and conditional access](../../knowledge/workplace.md#device-trust-and-conditional-access)

## Endpoint security and compliance

### "How do you know every disk is encrypted?"

- The MDM enforces <span class="term" data-term="disk-encryption">disk encryption</span> (FileVault, BitLocker) and escrows the recovery key, readable by few people and logged.
- I check in two ways: the MDM report, and an <span class="term" data-term="osquery">osquery</span> query across the fleet, which also catches devices that left the MDM.
- I compare the MDM inventory with the purchase records: a laptop missing from both is the most dangerous.
- Conditional access refuses the payroll application to an unencrypted device, and the evidence is exported every month for the audit.

**Read next**: [Disk encryption](../../knowledge/workplace.md#disk-encryption), [EDR and osquery](../../knowledge/workplace.md#edr-and-osquery), [Exercise 3: osquery](exercices.md#exercise-3-finding-non-compliant-devices-with-osquery)

### "How do you organize patching? An actively exploited flaw is published this morning, what do you do?"

- <span class="term" data-term="patch-management">Patch management</span> sets deadlines by risk (NIST SP 800-40, revision 4, 2022): for example 48 h for a flaw in CISA's <span class="term" data-term="kev">KEV</span> catalog, 14 days for an ordinary update, 60 to 90 days for a major version [example deadlines].
- For today's flaw: I measure exposure with osquery (how many devices run the vulnerable version), I push the patch on a fast track, with a forced restart after notice.
- For the rest: rings, then a deadline with a limited number of deferrals.
- I measure the share of devices up to date on D+14, and I send the list of laggards to their managers.

**Read next**: [Patching: cadence and deadlines](../../knowledge/workplace.md#patching-cadence-and-deadlines), [Rollout rings](../../knowledge/workplace.md#rollout-rings), [Exercise 5: major macOS version](exercices.md#exercise-5-planning-a-major-macos-upgrade)

### "Developers want admin rights on their laptop, what do you answer?"

- I answer neither "never" nor "yes to everyone": <span class="term" data-term="local-admin-rights">local admin rights</span> are granted according to real use.
- A sales person who installs a tool once a quarter: a self-service application catalog, no rights.
- A developer who installs tools every week: temporary rights on demand, for example 30 minutes, logged.
- A team that needs drivers or virtual machines: permanent rights with an <span class="term" data-term="edr">EDR</span> and a justification reviewed every year.
- I pilot the change with volunteer developers before tightening for everyone.

**Read next**: [CIS Benchmarks and admin rights](../../knowledge/workplace.md#cis-benchmarks-and-admin-rights), [EDR and osquery](../../knowledge/workplace.md#edr-and-osquery)

### "What is zero trust for employees? Should we keep the VPN?"

- BeyondCorp (Google, 2014): access depends on who I am and on my device's state, not on the network I am on.
- <span class="term" data-term="device-trust">Device trust</span> proves the device is managed and compliant; <span class="term" data-term="conditional-access">conditional access</span> combines person, device, application and risk at every login.
- The <span class="term" data-term="vpn">VPN</span> puts the laptop "inside" the network; <span class="term" data-term="ztna">ZTNA</span> publishes each application separately.
- I remove the VPN application by application, after inventorying the flows, because there is always an old application that only works internally.
- I turn on every new rule in <span class="term" data-term="report-only-mode">report-only mode</span> first.

**Read next**: [Device trust and conditional access](../../knowledge/workplace.md#device-trust-and-conditional-access), [Office network](../../knowledge/workplace.md#office-network), [Zero trust](../../knowledge/securite.md#zero-trust-and-service-to-service-identity)

### "How do you prepare an ISO 27001 or SOC 2 audit?", "How far can we monitor employees' devices?"

- <span class="term" data-term="iso-27001">ISO 27001</span> and <span class="term" data-term="soc2">SOC 2</span> ask for dated evidence drawn from the systems: departures, access reviews, MFA, encryption, changes.
- I produce this evidence continuously (monthly export), not in the audit week; the <span class="term" data-term="audit-log">audit log</span> is exported out of the consoles, whose default retention is short.
- On the <span class="term" data-term="gdpr">GDPR</span> side, what EDR, MDM and DLP collect must be necessary, announced to employees and kept for a limited time.
- I write down what is collected, why, who reads it and for how long: that is what lets me say no to an excessive monitoring request.

**Read next**: [Compliance and evidence](../../knowledge/workplace.md#compliance-and-evidence), [Personal data and GDPR](../../knowledge/securite.md#personal-data-and-gdpr-in-the-architecture), [SIEM](../../knowledge/securite.md#siem-centralizing-and-correlating-security-logs)

## Automation and workplace as code

### "Why put the identity provider's or the MDM's configuration in Git?"

- In a web console, nobody knows who changed what, and a wrong click cannot be reviewed.
- With <span class="term" data-term="infrastructure-as-code">infrastructure as code</span> (Terraform with the Okta or Entra ID providers, Fleet in YAML), every change goes through a merge request: the CI runs the <span class="term" data-term="terraform-plan">plan</span>, a colleague reviews it, the merge applies.
- A nightly `plan` detects <span class="term" data-term="configuration-drift">drift</span> made by hand.
- I protect critical resources with `prevent_destroy`, and the Terraform token lives in a secret manager.
- Example: a group computed by a rule instead of a list of people, which keeps nobody after a departure.

**Read next**: [Configuration in Git](../../knowledge/workplace.md#configuration-in-git), [Secret managers](../../knowledge/securite.md#secret-managers-for-machines-and-for-humans), [Exercise 9: Terraform](exercices.md#exercise-9-managing-identity-provider-groups-in-terraform)

### "How do you write a script that touches accounts safely?"

- It takes its input from the HRIS, never from a copy-paste: a wrong address would delete the wrong person.
- Each step is <span class="term" data-term="idempotency">idempotent</span>: I can rerun the script after a failure with no side effect.
- A <span class="term" data-term="dry-run">dry-run</span> mode prints what it would do, and I run it that way first.
- It suspends before deleting, logs every action, and an error opens a ticket instead of stopping silently.
- A safety cap: beyond N accounts touched at once, it stops and asks for human approval.

**Read next**: [Scripts against admin APIs](../../knowledge/workplace.md#scripts-against-admin-apis), [Idempotency](../../knowledge/architecture.md#idempotency), [Webhook](../../knowledge/api-rest-async.md#webhook), [Exercise 1: joiners and leavers](exercices.md#exercise-1-automating-joiners-and-leavers-from-the-hris)

### "How do you roll out a new configuration across the fleet without breaking everything?"

- A wrong profile reaches the whole fleet in minutes: I treat it like a production release.
- I apply it in <span class="term" data-term="rollout-ring">rings</span>: the IT team, then volunteers from every department, then half the fleet, then the rest.
- Stop criteria are written beforehand: number of related tickets, broken business tool.
- The rollback is prepared (remove the profile from the group) and tested on ring 0.
- Example: a firewall profile that would have cut the sales team's video tool, stopped at ring 1.

**Read next**: [Rollout rings](../../knowledge/workplace.md#rollout-rings), [Progressive deployment](../../knowledge/livraison.md#progressive-deployment), [Exercise 5: major macOS version](exercices.md#exercise-5-planning-a-major-macos-upgrade)

### "How do you test a configuration change before production?"

- I review the plan in the merge request: "1 group added, 0 destroyed"; a plan that destroys must be explained.
- I apply first in a test organization of the identity provider, filled with fictitious accounts.
- For a script, unit tests with a fake API client, and dry-run mode on real data.
- For a conditional access rule, report-only mode for a week, then the list of who would have been blocked.
- For a device profile, ring 0 on the team's own machines.

**Read next**: [Configuration in Git](../../knowledge/workplace.md#configuration-in-git), [Device trust and conditional access](../../knowledge/workplace.md#device-trust-and-conditional-access)

## SaaS and collaboration tools

### "Teams buy SaaS without going through IT, what do you do?"

- I do not start by forbidding: forbidden <span class="term" data-term="shadow-it">shadow IT</span> moves to personal accounts, even less visible.
- I discover tools through spending (cards, expense reports), "Sign in with Google or Microsoft" logins and the <span class="term" data-term="oauth-consent">OAuth consents</span> granted by employees.
- For each tool: an owner, a decision (connect to SSO and SCIM, replace with the tool already paid for, close), a review before renewal.
- I offer a fast purchasing path for small tools without sensitive data.

**Read next**: [SaaS sprawl and shadow IT](../../knowledge/workplace.md#saas-sprawl-and-shadow-it), [Build, buy or partner](../../knowledge/culture-entreprise.md#build-buy-or-partner)

### "How do you cut licence costs?"

- I compare paid licences with accounts active in the last 30 days, tool by tool.
- SCIM frees the licence at departure; without it, I pay for months of ghost accounts.
- I spot duplicate tools (three survey tools) and consolidate at renewal.
- An archive licence rather than a full licence for a suspended account we keep.
- Example: 40 licences of a drawing tool without a login for three months [example figure], freed after a message to the people concerned.

**Read next**: [SaaS sprawl and shadow IT](../../knowledge/workplace.md#saas-sprawl-and-shadow-it), [Total cost of ownership](../../knowledge/culture-entreprise.md#total-cost-of-ownership)

### "What happens to the files and mailbox of someone who leaves?"

- Suspend right away, without deleting: the data stays, the door is closed.
- Transfer file ownership to the manager within the week, redirect or share the mailbox for a few weeks, according to the written policy.
- Check for a <span class="term" data-term="legal-hold">legal hold</span> before any deletion.
- Archive or delete after the set period, for example 30 to 90 days.
- Limit the transfer to what the policy allows: a mailbox can hold private or HR exchanges.

**Read next**: [Departure: retaining and transferring data](../../knowledge/workplace.md#departure-retaining-and-transferring-data), [Exercise 8: SaaS offboarding](exercices.md#exercise-8-designing-saas-offboarding-with-data-transfer)

### "Which settings do you check first in Google Workspace or Microsoft 365?"

- External sharing of documents: forbidden by default, open to some groups with a warning.
- Third-party applications connected through OAuth: an allow list, the others blocked.
- Automatic forwarding of mail outside: forbidden, with an alert, because it is a classic technique after a compromise.
- Retention periods, and a <span class="term" data-term="dlp">DLP</span> in audit mode first to measure false positives.
- I close what is dangerous and offer an approved path for the real need, like a space shared with a partner.

**Read next**: [Administering Google Workspace or Microsoft 365](../../knowledge/workplace.md#administering-google-workspace-or-microsoft-365), [Data loss prevention (DLP)](../../knowledge/workplace.md#data-loss-prevention-dlp)

## Support and ITSM

### "Incident, request, problem, change: what is the difference?"

- An incident: something that worked no longer works, I restore fast, even with a workaround.
- A <span class="term" data-term="service-request">service request</span>: a planned need, which deserves a standard path, ideally self-service.
- A problem: the unknown cause of several incidents, which I find and remove.
- A change: a planned modification, with assessed risk and a rollback.
- I use these four words from <span class="term" data-term="itil">ITIL</span> 4 (2019) without the weight: no approval board for every profile.

**Read next**: [ITIL 4: incident, request, problem, change](../../knowledge/workplace.md#itil-4-incident-request-problem-change)

### "Support gets 400 tickets a month, how do you bring that down?"

- I sort a month of tickets by category, with handling time: frequency alone is not enough.
- I look for repetitive gestures: often a third of tickets ask for access, a sign that computed groups do not cover real needs.
- I handle first the categories where frequency times duration is largest, following the <span class="term" data-term="pareto-principle">Pareto principle</span>.
- Depending on the cause: computed group, form with automatic approval, <span class="term" data-term="knowledge-base">knowledge base</span> article, or a problem to fix.
- I measure <span class="term" data-term="ticket-deflection">ticket deflection</span> and watch satisfaction to check I have not just moved the load.

**Read next**: [Ticket queues, self-service portal and knowledge base](../../knowledge/workplace.md#ticket-queues-self-service-portal-and-knowledge-base), [Exercise 7: ticket export](exercices.md#exercise-7-choosing-what-to-automate-from-a-ticket-export)

### "How do you keep a knowledge base and a self-service portal alive?"

- I write articles from the most frequent tickets, as short answers, each with an owner and a review date.
- <span class="term" data-term="shift-left-support">Shift left in support</span> resolves the request as early as possible, but it only works if self-service is really faster than a ticket.
- <span class="term" data-term="chatops">ChatOps</span> brings common requests into the chat tool, with the owner's approval and a log.
- I keep an "I don't know" entry triaged by a human, otherwise people go around it by direct message.
- I measure searches with no result and articles never read, and I delete what is wrong.

**Read next**: [Shift left and ChatOps](../../knowledge/workplace.md#shift-left-and-chatops), [Ticket queues](../../knowledge/workplace.md#ticket-queues-self-service-portal-and-knowledge-base)

### "Which SLAs or SLOs would you set for support?"

- I tell the <span class="term" data-term="slo">SLO</span>, an internal target, from the <span class="term" data-term="sla">SLA</span>, a contractual promise with a penalty, which only exists in internal IT when support is outsourced to a provider.
- I choose indicators that matter to employees: time to first response, resolution time for standard requests, share resolved through self-service.
- Example: first response within 4 business hours for 90% of tickets [example value].
- I always read a delay together with satisfaction: a ticket closed fast but reopened is not a success.

**Read next**: [Measuring success (workplace)](../../knowledge/workplace.md#measuring-success), [Support and ITSM](../../knowledge/workplace.md#support-and-itsm)

## Incidents

### "An employee's account is compromised, what do you do in the first hour?"

- The signals: <span class="term" data-term="impossible-travel">impossible travel</span>, <span class="term" data-term="mfa-fatigue">MFA fatigue</span>, a new mail forwarding rule, an unknown OAuth consent.
- Contain: suspend without deleting, revoke sessions and tokens, remove recent MFA methods, consents and forwarding rules.
- Preserve: export the logs before they expire; measure the scope: what was read, shared or sent.
- Restore with phishing-resistant MFA, registered on a video call with ID.
- Security leads the investigation, I execute and provide the logs; I warn the person by phone, not on the compromised mailbox.

**Read next**: [Compromised account: contain, then investigate](../../knowledge/workplace.md#compromised-account-contain-then-investigate), [The lifecycle of an incident](../../knowledge/incidents.md#the-lifecycle-of-an-incident), [Exercise 6: compromised account](exercices.md#exercise-6-responding-to-a-compromised-account)

### "An MDM profile pushed yesterday broke Wi-Fi on 200 laptops, what do you do?"

- I open an incident with an <span class="term" data-term="incident-commander">incident commander</span> and a single channel, and I warn employees through a means that does not depend on Wi-Fi (SMS, signs, phone tethering).
- I restore first: remove the profile from the group in the MDM; laptops without a network do not receive it, so I plan a cable or tethering for them to get the fix.
- Then the cause: why did the profile reach 200 devices without going through the rings?
- A blameless <span class="term" data-term="postmortem">postmortem</span>, with actions: rings mandatory for network profiles, automatic stop criterion.

**Read next**: [The lifecycle of an incident](../../knowledge/incidents.md#the-lifecycle-of-an-incident), [Communicating](../../knowledge/incidents.md#communicating), [The blameless postmortem](../../knowledge/incidents.md#the-blameless-postmortem), [Rollout rings](../../knowledge/workplace.md#rollout-rings)

### "The identity provider is down, what happens, and what had you prepared?"

- No new login at all: it is a single point of failure, to treat as a critical component with its own alerts.
- Sessions already open often keep working until they expire: the outage shows first among the morning's joiners.
- I had prepared a communication channel outside the suite (status page, SMS), the emergency accounts and a <span class="term" data-term="runbook">runbook</span>.
- I read the provider's availability commitment in the contract, and on my side I measure the share of successful logins.

**Read next**: [Identity provider and SSO](../../knowledge/workplace.md#identity-provider-and-sso), [Severity levels](../../knowledge/incidents.md#severity-levels), [Runbooks and playbooks](../../knowledge/incidents.md#runbooks-and-playbooks)

## Behavioural questions

!!! info "Preparing lived stories"
    These questions have no right theoretical answer. For each, I prepare a real story, told with the <span class="term" data-term="star-method">STAR method</span>, with my own numbers. The examples below are fictitious scenarios that show the expected shape.

### "Tell me about a time you had to say no to an executive."

- Typical situation: a director asks to be exempted from MFA "because it slows him down when travelling".
- I look for the real need behind the request: he loses time with SMS codes abroad.
- I say no to the exemption, yes to the need: a passkey on his phone, faster than SMS and safer.
- I explain the risk in business terms (his account is the favourite target of payment fraud), and I keep a written record if the request is maintained.
- Expected outcome: the need is solved, the rule stays the same for everyone.

**Read next**: [Presenting a technical trade-off in business terms](../../knowledge/culture-entreprise.md#presenting-a-technical-trade-off-in-business-terms), [Disagree and commit](../../knowledge/culture-entreprise.md#disagree-and-commit), [Phishing-resistant MFA](../../knowledge/workplace.md#phishing-resistant-mfa)

### "How do you work with security and HR?"

- HR holds the source of truth: I agree with them on an entry delay for joiners and leavers, and on an emergency gesture for an immediate departure.
- Security sets the rules and leads investigations; I make them applicable and measurable, without blocking work.
- I formalize who decides what with a <span class="term" data-term="raci">RACI</span> matrix for the sensitive moments: contentious departure, compromised account, monitoring request.
- I share the numbers with them every month: cut-off delay, non-compliant devices, access tickets.

**Read next**: [RACI](../../knowledge/culture-entreprise.md#raci), [Influence without authority](../../knowledge/culture-entreprise.md#influence-without-authority-and-communities-of-practice), [Joiner, mover, leaver](../../knowledge/workplace.md#joiner-mover-leaver-the-lifecycle-driven-by-the-hris)

### "Tell me about an automation you are proud of.", "Tell me about a mistake you made in production."

- For the automation: the situation in numbers before (for example, departures cut off in three days on average), what I built, the number after, and what I would do differently.
- For the mistake: I pick a real one, explain how I detected it, what I did to limit the impact, and the guardrail I added (rings, dry-run mode, safety cap).
- I talk about what the system allowed, not about who clicked: that is the spirit of the blameless postmortem.

**Read next**: [Telling an experience with the STAR method](../../knowledge/culture-entreprise.md#telling-an-experience-with-the-star-method), [The blameless postmortem](../../knowledge/incidents.md#the-blameless-postmortem)

## Elimination criteria

Three questions where a single wrong answer is enough to rule out a workplace engineer candidate.

| Interviewer's question | Answer that eliminates | What I answer | Read next |
|---|---|---|---|
| "Someone leaves tonight. How do you cut their access?" | "I deactivate their account in the identity provider, that's it." | Suspension, revocation of sessions and tokens, deactivation through SCIM, applications without SSO handled, data transferred, check on D+1. Otherwise open sessions and local accounts survive. | [Joiner, mover, leaver](../../knowledge/workplace.md#joiner-mover-leaver-the-lifecycle-driven-by-the-hris), [Scripts against admin APIs](../../knowledge/workplace.md#scripts-against-admin-apis) |
| "How do you roll out a new security profile?" | "I push it to the whole fleet on a Friday evening, it's faster." | In rings, with stop criteria written beforehand and a tested rollback; never before a weekend. | [Rollout rings](../../knowledge/workplace.md#rollout-rings) |
| "A director asks you to read the mailbox of an employee he suspects." | "I give him access, an administrator is asking." | I refuse to act alone: it is a decision for HR, legal and security, governed by law and internal policy, recorded in writing. | [Compliance and evidence](../../knowledge/workplace.md#compliance-and-evidence), [Personal data and GDPR](../../knowledge/securite.md#personal-data-and-gdpr-in-the-architecture) |

## The 3 things a Workplace Engineer always does

1. **Start from the source of truth.** The HRIS says who works here, groups follow from it, access follows the groups. Example: a team change entered by HR removes the old rights the same day, with no ticket.
2. **Treat configuration as code.** Versioned, reviewed, tested, rolled out in rings, reversible. Example: a new firewall profile goes through a merge request, then the IT team, then volunteers, before the whole fleet.
3. **Measure employees' time and the correctness of access.** Joiners ready at 9 a.m., cut-off delay at departure, share of compliant devices, tickets by category. Example: I choose the next automation by reading the ticket export, not by gut feeling.

## A simple structure for answering out loud

For a behavioural question ("tell me about a time..."), I follow the <span class="term" data-term="star-method">STAR method</span>: the situation, the task that was mine, the action I took, the result with numbers, then what I learned. For a scenario question, I follow this thread:

1. **Person**: who is concerned (ada who joins, grace who leaves, 300 laptops)?
2. **Source of truth**: where does the triggering information come from (HRIS, MDM, ticket)?
3. **Chain**: which steps, in which order, end to end?
4. **Failure**: what happens when a step fails, and how do I roll back?
5. **Security and privacy**: which risk, which personal data, who must approve?
6. **Measure**: which starting number, which number after, which guardrail?
7. **Evidence**: what trace remains for the audit?

The core idea: a workplace engineer does not just run consoles. They automate identity, devices and support from a source of truth, roll out changes like code, protect employees without slowing them down, and prove with numbers that their daily work gets better.

## Measuring success

I am almost always asked "how do you know it worked?". My answer follows the same shape for every project: a **baseline** measured before (for example the account cut-off delay over last quarter's departures), the **same measure after**, over a comparable period, and a **guardrail metric** that must not get worse (employee satisfaction with IT, or the number of logins wrongly refused). Then, per solution, I give an <span class="term" data-term="sli">SLI</span> and an internal SLO; an SLA only makes sense for a service under contract, like a hosted identity provider or support outsourced to a provider.

| Solution | Success indicator (SLI) | Likely SLO | Likely SLA |
|---|---|---|---|
| lifecycle driven by the HRIS | delay between the departure time in the HRIS and the deactivation of the last account | 95% of departures in under an hour [Take with caution: example value, to set with security] | not applicable: no external contract |
| zero-touch enrollment and day-one readiness | share of joiners with a ready device and all their access at 9 a.m. | 95% of joiners entered at least 10 days before [Take with caution: example value] | not applicable: no external contract |
| device compliance | share of active devices enrolled in the MDM, encrypted and up to date on D+14 | 95% [Take with caution: example threshold, to set with security] | not applicable: no external contract |
| hosted identity provider | share of successful logins without a provider error | 99.9% per month [Take with caution: example value] | the provider's commitment in the contract, for example 99.99% [Take with caution: to check in the real contract] |
| automation of standard requests | share of requests resolved with no support gesture | 60% [Take with caution: example value] | not applicable: no external contract |
| first-line support outsourced to a provider | share of tickets picked up within the deadline | 95% within 4 business hours [Take with caution: example value] | 90% within 4 business hours, with a penalty [Take with caution: example value, depending on the contract] |

## Pitfalls to avoid

| Pitfall | What happens | Solution |
|---|---|---|
| **Naming the tool first**: I answer "Okta" or "Jamf" before talking about the person and the source of truth. | The interviewer hears someone who administers a console, not someone who designs a system. | I walk the chain from the HRIS, then name the tool ([Structure for answering](#a-simple-structure-for-answering-out-loud)). |
| **Forgetting the mover**: I talk about joining and leaving, never about team changes. | I show that my groups pile up rights. | Groups computed from attributes and access reviews ([Identity and access](#identity-and-access)). |
| **Deactivating without revoking**: I stop at deactivating the account. | Elimination criterion: open sessions and local accounts stay usable. | I mention sessions, tokens, SCIM, applications without SSO and the D+1 check ([Elimination criteria](#elimination-criteria)). |
| **Pushing everything at once**: I describe a change applied to the whole fleet. | The interviewer pictures 300 laptops without Wi-Fi on a Monday morning. | Rings, stop criteria, tested rollback ([Automation](#automation-and-workplace-as-code)). |
| **Security against employees**: I answer "we forbid it" to every request. | I push people towards shadow IT and workarounds. | I close what is dangerous and offer an approved path ([SaaS and collaboration tools](#saas-and-collaboration-tools)). |
| **Monitoring without a frame**: I agree to collect all device activity "for security". | A GDPR problem and a loss of trust. | I document what is collected, why and for how long ([Endpoint security and compliance](#endpoint-security-and-compliance)). |
| **Answering in the conditional**: I say "I would" with no lived story. | The answer sounds like a memorized page, with no proof of experience. | One STAR story per theme, with my numbers ([Behavioural questions](#behavioural-questions)). |
