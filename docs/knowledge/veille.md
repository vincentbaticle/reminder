# Veille technique par métier

!!! warning "Avertissement"
    Ces notes sont des pense-bêtes personnels, pas une source de vérité. Elles reflètent ma compréhension et mes choix : leur contenu reste subjectif, malgré les citations et les références qu'il contient. Il peut être incomplet, simplifié, inexact ou dépassé. Vérifiez toujours dans la documentation officielle avant de l'appliquer. Ce contenu est fourni tel quel, sans aucune garantie : son utilisation se fait sous votre seule responsabilité.

Faire de la veille, c'est suivre ce qui change dans mon métier (outils, pratiques, idées) sans y passer mes journées. Cette page dit pourquoi, quand et comment la faire, puis liste les sources les plus citées pour quatre métiers : architecte, DevX et plateforme, QA, développeur.

!!! info "Liste établie en novembre 2026"
    Les sites, newsletters et podcasts naissent, changent de nom et s'arrêtent. Les années indiquent la création quand elle est connue ; « à vérifier » quand elle n'a pas été vérifiée à la source. Vérifier qu'une source est toujours active avant de s'y abonner.

## Vocabulaire

**<span class="term" data-term="tech-watch">Veille technique</span>** : le temps régulier consacré à suivre les évolutions de son domaine, et à trier ce qui mérite d'être essayé.

**<span class="term" data-term="newsletter">Newsletter</span>** : une lettre envoyée par e-mail à intervalle fixe (souvent chaque semaine), qui sélectionne et résume des articles. C'est le format le plus économe : quelqu'un a déjà trié.

**<span class="term" data-term="rss-feed">Flux RSS</span>** : un fichier publié par un site, qui liste ses derniers articles. Un lecteur de flux (Feedly, Inoreader, NetNewsWire, Miniflux) regroupe tous les sites suivis dans une seule liste, sans algorithme ni publicité.

**<span class="term" data-term="tech-radar">Radar technologique</span>** : un classement des technologies en quatre anneaux, popularisé par Thoughtworks (Technology Radar, publié deux fois par an depuis 2010) : **Adopt** (à utiliser), **Trial** (à essayer sur un vrai projet), **Assess** (à étudier), **Hold** (à éviter pour les nouveaux usages).

## Pourquoi, quand et comment

**Pourquoi.** Trois raisons concrètes :

- j'évite de réinventer ce qui existe déjà : mon équipe s'apprête à écrire son propre outil de mocks alors qu'une bibliothèque, une pratique ou un retour d'expérience règle déjà le problème ;
- je vois venir les changements qui touchent mon travail, comme la fin de support de la version de Python de mon projet ou un outil qui en remplace un autre, avant qu'ils ne bloquent une mise à jour ;
- j'ai des arguments datés et sourcés quand je propose un changement à l'équipe, au lieu d'un « j'ai lu quelque part ».

**Quand.** Un créneau fixe et court vaut mieux qu'une lecture au fil de l'eau : par exemple 1 h par semaine, le vendredi après-midi, plus 15 minutes en début de journée pour survoler. Et une veille ciblée, plus intense, au moment d'un choix (choisir un outil de test, un broker, une base).

**Comment.** Une méthode simple :

1. **centraliser** : les newsletters dans un dossier dédié de la messagerie, les blogs dans un lecteur RSS ;
2. **survoler puis trier** chaque article dans un des anneaux du radar : la plupart finissent dans « rien à faire » ;
3. **garder une trace** : une ligne par sujet retenu, avec la date, la source et ce que j'en pense ;
4. **essayer** une chose par mois sur un vrai cas, même petit ;
5. **partager** : un message court à l'équipe, une démo, une ligne dans le radar d'équipe.

```
radar-perso.md (exemple)
| Date       | Sujet                  | Anneau | Source                         | Pourquoi                        |
|------------|------------------------|--------|--------------------------------|---------------------------------|
| 2026-10-03 | Testcontainers modules | Trial  | blog de l'outil                | remplacer nos bases partagées   |
| 2026-10-17 | outil X de mocks       | Assess | Software Testing Weekly        | à comparer à Microcks           |
| 2026-10-24 | framework Y            | Hold   | Technology Radar               | trop jeune, un seul mainteneur  |
```

Pièges :

- **la peur de rater quelque chose** : s'abonner à tout, ne rien lire. Mieux vaut trois sources lues que trente empilées ;
- **l'effet de mode** : un outil très partagé n'est pas forcément mûr. Regarder l'âge du projet, le nombre de mainteneurs, qui l'utilise en production ;
- **les sources d'éditeurs** : utiles pour les nouveautés, mais elles vendent leur produit. Croiser avec une source indépendante.

## Commun à tous les métiers

| Source | Format | Pourquoi la suivre |
|---|---|---|
| [Thoughtworks Technology Radar](https://www.thoughtworks.com/radar) (depuis 2010) | rapport, deux fois par an | un avis argumenté sur des centaines de technologies, avec l'anneau et le pourquoi |
| [InfoQ](https://www.infoq.com/) (depuis 2006) | articles, conférences filmées | conférences QCon en accès libre, sujets architecture, dev, culture |
| [Hacker News](https://news.ycombinator.com/) (depuis 2007) | agrégateur communautaire | ce dont la communauté parle aujourd'hui ; les commentaires sont souvent plus utiles que l'article |
| [The Pragmatic Engineer](https://newsletter.pragmaticengineer.com/) (Gergely Orosz, depuis 2021) | newsletter, podcast | comment travaillent les équipes d'ingénierie, salaires, organisation, outils |
| [martinfowler.com](https://martinfowler.com/) (date de création non indiquée) | articles de fond | des définitions de référence (refactoring, microservices, tests), mises à jour au fil des ans |
| [Stack Overflow Developer Survey](https://survey.stackoverflow.co/) (annuelle depuis 2011) | enquête | ce que les développeurs utilisent vraiment, langages et outils |
| [Les Cast Codeurs](https://lescastcodeurs.com/) (depuis 2009) | podcast en français | actualité de l'écosystème, une à deux fois par mois |

## Architecte

| Source | Format | Pourquoi la suivre |
|---|---|---|
| [InfoQ, rubrique Architecture & Design](https://www.infoq.com/architecture-design/) (depuis 2006) | articles, conférences | retours d'expérience d'architecture à grande échelle |
| [High Scalability](https://highscalability.com/) (Todd Hoff, depuis 2007) | blog | comment des systèmes connus ont été construits, à lire avec un œil critique sur les dates |
| [ByteByteGo](https://blog.bytebytego.com/) (Alex Xu, depuis 2022, à vérifier) | newsletter, schémas | concepts de conception de systèmes expliqués en un schéma |
| [microservices.io](https://microservices.io/) (Chris Richardson, date de création à vérifier) | catalogue de patterns | sagas, outbox, découpage : chaque pattern avec ses forces et ses limites |
| [AWS Architecture Blog](https://aws.amazon.com/blogs/architecture/) et [Google Cloud Architecture Center](https://cloud.google.com/architecture) (dates de création non indiquées) | guides d'éditeurs | architectures de référence ; source d'éditeur, à croiser |
| [The Open Group](https://www.opengroup.org/) (TOGAF, ArchiMate ; dates des versions dans [Architecture](architecture.md#urbaniser-le-systeme-dinformation)) | normes | pour l'architecture d'entreprise et l'urbanisation |
| [c4model.com](https://c4model.com/) (Simon Brown, date de création à vérifier) | site de référence | documenter une architecture lisiblement |

## DevX et plateforme

| Source | Format | Pourquoi la suivre |
|---|---|---|
| [DORA](https://dora.dev/) (rapport State of DevOps annuel depuis 2014, à vérifier) | recherche, rapport annuel | les indicateurs de livraison et les capacités qui les font progresser, chiffres à l'appui |
| [CNCF](https://www.cncf.io/) (fondée en 2015) et son [Landscape](https://landscape.cncf.io/) | fondation, carte des outils | l'état et la maturité des projets cloud native (sandbox, incubating, graduated) |
| [platformengineering.org](https://platformengineering.org/) (depuis 2022, à vérifier) | communauté, articles, conférences | platform engineering, portails, golden paths |
| [The New Stack](https://thenewstack.io/) (depuis 2014) | média | actualité cloud native, DevOps, outils de développement |
| [Engineering Enablement](https://newsletter.getdx.com/) (Abi Noda, depuis 2021, à vérifier) | newsletter | résumés d'études sur la productivité et l'expérience développeur ; l'auteur dirige un éditeur du domaine, à croiser |
| [Team Topologies](https://teamtopologies.com/) (livre de 2019) | site, articles | organisation des équipes plateforme et de leurs interactions |
| [LeadDev](https://leaddev.com/) (date de création à vérifier) | articles, conférences | management technique, conduite du changement, plateformes internes |

## QA

| Source | Format | Pourquoi la suivre |
|---|---|---|
| [Ministry of Testing](https://www.ministryoftesting.com/) (née Software Testing Club en 2007, à vérifier) | communauté, articles, conférences | la plus grande communauté de testeurs ; test exploratoire, automatisation, carrière |
| [Software Testing Weekly](https://softwaretestingweekly.com/) (Dawid Dylowicz, date de création à vérifier) | newsletter | une sélection hebdomadaire d'articles et d'outils de test |
| [Google Testing Blog](https://testing.googleblog.com/) (depuis 2007) | blog | tests à grande échelle, tests instables, « Testing on the Toilet » |
| [Test Automation University](https://testautomationu.applitools.com/) (Applitools, depuis 2019) | cours gratuits | Playwright, Cypress, tests d'API ; plateforme d'un éditeur, cours indépendants de son produit pour la plupart |
| [DevelopSense](https://developsense.com/) (Michael Bolton) et [Satisfice](https://www.satisfice.com/) (James Bach) (dates de création non indiquées) | blogs | le test comme activité de recherche et d'esprit critique, pas seulement d'exécution |
| [Notes de version de Playwright](https://playwright.dev/docs/release-notes) | documentation | une nouvelle version par mois environ : nouvelles API, changements à anticiper |
| [ISTQB](https://www.istqb.org/) et [CFTL](https://www.cftl.fr/) (comité français) | normes, syllabus | vocabulaire commun et évolutions des certifications |

## Développeur

| Source | Format | Pourquoi la suivre |
|---|---|---|
| [Notes de version](https://docs.python.org/3/whatsnew/index.html) du langage et des frameworks utilisés | documentation | la source la plus fiable : ce qui arrive, ce qui devient obsolète |
| [JavaScript Weekly](https://javascriptweekly.com/) et [Python Weekly](https://www.pythonweekly.com/) (dates de création à vérifier) | newsletters | une sélection hebdomadaire par écosystème |
| [State of JS](https://stateofjs.com/) (annuelle depuis 2016) | enquête | adoption et satisfaction des outils front-end |
| [OWASP](https://owasp.org/) (fondée en 2001) | fondation, Top 10 | les failles les plus courantes et comment les éviter |
| [Lobsters](https://lobste.rs/) (depuis 2012, à vérifier) | agrégateur communautaire | plus technique et plus calme que Hacker News |
| [Devoxx France](https://www.devoxx.fr/) (depuis 2012) | conférence, vidéos en ligne | les conférences de l'année, en français pour la plupart |
| [GitHub Changelog](https://github.blog/changelog/) (date de création non indiquée) | journal des nouveautés | évolutions des outils de développement et de CI les plus utilisés |

## Pièges à éviter

- **Tout suivre** : je m'abonne à trente sources par peur de rater quelque chose, donc je n'en lis aucune et tout s'empile. Je garde trois sources que je lis vraiment.
- **Lire au fil de l'eau** : je lis dès qu'un article passe, donc la veille grignote mes journées sans rien produire. Je garde un créneau fixe et court, comme 1 h le vendredi ([voir quand](#pourquoi-quand-et-comment)).
- **Suivre la mode** : j'adopte un outil parce que tout le monde le partage cette semaine, donc mon équipe se retrouve avec un projet trop jeune, au seul mainteneur. Je regarde l'âge du projet, le nombre de mainteneurs et qui l'utilise en production, puis je le classe dans le [radar](#vocabulaire).
- **Croire l'éditeur sur parole** : je prends un blog d'éditeur pour un avis neutre, alors qu'il vend son produit. Je croise avec une source indépendante avant de proposer quoi que ce soit.
- **Lire sans garder de trace** : je ne note rien, donc trois mois plus tard je ne retrouve ni la source ni pourquoi l'outil m'avait plu. J'écris une ligne par sujet retenu, avec la date, la source et mon avis.
- **Ne jamais essayer** : je lis tout mais je ne teste rien, donc je n'ai que des impressions à proposer à l'équipe. J'essaie une chose par mois sur un vrai cas, même petit.
- **Suivre une source morte** : je m'abonne à une newsletter citée partout qui a cessé de paraître ou changé de nom. Je vérifie qu'une source est toujours active avant de m'y abonner.

## Ce qu'on demande en entretien

Les questions typiques :

- « Comment fais-tu ta veille technique ? », « Combien de temps y consacres-tu ? » Pour répondre : je décris ma méthode (centraliser, trier, garder une trace, essayer, partager) et mon créneau ([Pourquoi, quand et comment](#pourquoi-quand-et-comment)).
- « Quelles sources suis-tu ? Cites-en trois » Pour répondre : je cite des sources de mon métier que je lis vraiment, avec ce que chacune m'apporte ([Commun à tous les métiers](#commun-a-tous-les-metiers), [QA](#qa), [Développeur](#developpeur)).
- « Comment décides-tu qu'un outil est assez mûr pour l'adopter ? » Pour répondre : je regarde l'âge du projet, ses mainteneurs, qui l'utilise en production, et l'anneau du Technology Radar ([Pièges à éviter](#pieges-a-eviter)).
- « Raconte une fois où ta veille a changé une décision dans ton équipe » Pour répondre : je raconte une histoire vécue, avec ce que j'ai essayé, ce que j'ai partagé et ce que l'équipe a décidé ([Pourquoi, quand et comment](#pourquoi-quand-et-comment)).
- « Comment restes-tu à jour sur les outils de test ? » Pour répondre : je lis les notes de version de l'outil, une newsletter de test, et je suis une communauté comme Ministry of Testing ([QA](#qa)).

Ce qui fait une bonne réponse : montrer une habitude régulière plutôt qu'une liste de noms, avec une méthode, deux ou trois sources vraiment lues, et un exemple de chose essayée puis partagée.

## Quoi suivre selon le besoin

| Besoin | Source |
|---|---|
| je n'ai que 10 minutes par semaine et je veux une seule source qui a déjà trié pour moi | une newsletter de mon métier |
| un collègue propose un framework découvert la semaine dernière et je veux savoir s'il est assez mûr pour un vrai projet | Thoughtworks Technology Radar, CNCF Landscape |
| mon équipe doit choisir un outil, comme un outil de test ou un broker, et je veux comparer sur du concret | notes de version, enquêtes annuelles, retours d'expérience InfoQ |
| j'entends parler de sagas ou d'outbox en réunion et je veux vraiment comprendre l'idée, pas juste le mot | martinfowler.com, microservices.io |
| je dois convaincre ma direction de changer la façon de livrer, et il me faut des chiffres plutôt qu'une impression | rapports DORA |
| je sais déjà écrire des tests Playwright et je veux progresser sur la façon de penser le test, pas sur l'outil | Ministry of Testing, DevelopSense, Satisfice |
| je préfère suivre l'actualité en français, en podcast ou en vidéo | Les Cast Codeurs, Devoxx France |
