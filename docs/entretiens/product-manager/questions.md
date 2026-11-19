# Entretien Product Manager : les questions

!!! warning "Avertissement"
    Ces notes sont des pense-bêtes personnels, pas une source de vérité. Elles reflètent ma compréhension et mes choix : leur contenu reste subjectif, malgré les citations et les références qu'il contient. Il peut être incomplet, simplifié, inexact ou dépassé. Vérifiez toujours dans la documentation officielle avant de l'appliquer. Ce contenu est fourni tel quel, sans aucune garantie : son utilisation se fait sous votre seule responsabilité.

!!! audience "Pour qui, pour quoi"
    - **Métiers** : product manager, product owner qui vise un poste de PM, product designer ou tech lead qui évolue vers le produit, QA ou analyste qui prépare un entretien produit.
    - **Usages** : je prépare un entretien de PM dans une semaine et je veux la liste des questions avec un plan de réponse ; la veille, je relis un seul thème, comme les métriques ; je cherche quelle page Knowledge explique une notion que je veux citer, comme le score RICE ; je prépare une histoire vécue par thème, comme une fonction que j'ai retirée parce qu'elle ne servait pas.

Cette page liste, thème par thème, les questions qu'on pose à un product manager, telles que le recruteur les formule. Pour chaque question, je lis le plan de réponse (quelques lignes, à la première personne), puis j'ouvre la section Knowledge liée, qui donne l'explication complète, les exemples et les pièges. Le plan ne se récite pas : il sert à structurer **une histoire vécue**, avec mes propres chiffres (taux d'activation, rétention, part des paris qui ont marché). Quand je n'ai pas vécu un cas, je le présente comme un scénario et j'explique mon raisonnement.

Un entretien de PM mêle des questions de comportement (« racontez-moi une fois où... »), où le recruteur attend « j'ai fait » et pas « je ferais », et des études de cas (« concevez un produit pour... », « cette métrique a chuté, que faites-vous ? »), où il juge la démarche plus que la réponse. Les applications citées (`bike-app`, location de vélos ; `recipe-app`, application de recettes), les personnes (ada la PM, grace la designer, alan le tech lead) et tous les chiffres sont des exemples inventés. Les exercices en direct, avec tableaux, requêtes et calculs corrigés, sont dans [Entretien Product Manager : les exercices](exercices.md).

## Le rôle de product manager

### « Qu'est-ce qu'un product manager, et en quoi diffère-t-il d'un product owner ou d'un chef de projet ? »

- Le <span class="term" data-term="product-manager">product manager</span> répond du résultat : le bon problème, pour les bons utilisateurs, avec un effet mesurable.
- Le <span class="term" data-term="product-owner">product owner</span> est un rôle de Scrum (Scrum Guide, novembre 2020) : il maximise la valeur du produit et ordonne le backlog ; dans beaucoup d'entreprises, c'est la même personne.
- Le chef de projet répond d'un périmètre livré dans un délai et un budget ; le designer, de l'expérience.
- Je cite Martin Eriksson (2011) : le PM au croisement du business, de la technique et de l'expérience utilisateur.
- Exemple : sur `bike-app`, je ne réponds pas de « la réservation livrée le 15 avril », mais de « plus de nouveaux inscrits font un deuxième trajet ».

**À relire** : [Product manager, product owner, chef de projet, product designer](../../knowledge/product-management.md#product-manager-product-owner-chef-de-projet-product-designer), [Ce dont le PM répond](../../knowledge/product-management.md#ce-dont-le-pm-repond), [Produit ou projet](../../knowledge/culture-entreprise.md#produit-ou-projet)

### « Comment travailles-tu avec le design et l'ingénierie ? »

- Je travaille en <span class="term" data-term="product-trio">trio produit</span> (Teresa Torres, « Continuous Discovery Habits », 2021) : la PM, le designer et le tech lead mènent la discovery ensemble.
- Chacun voit un risque : moi la valeur et la viabilité, le designer l'utilisabilité, le tech lead la faisabilité.
- Je donne le problème et le résultat visé, pas la solution ni l'écran : l'équipe choisit comment.
- Le trio décide des opportunités et des solutions à tester ; il ne valide pas la couleur d'un bouton.
- Exemple : un entretien utilisateur par semaine où les trois sont présents, et un arbre d'opportunités partagé.

**À relire** : [Le trio produit](../../knowledge/product-management.md#le-trio-produit), [Discovery et delivery](../../knowledge/culture-entreprise.md#discovery-et-delivery), [RACI](../../knowledge/culture-entreprise.md#raci)

### « Qu'est-ce qui distingue un bon PM d'un PM moyen ? », « De quoi es-tu responsable ? »

- Je me juge au résultat obtenu auprès des utilisateurs, pas au nombre de fonctions livrées ni de réunions animées (Ben Horowitz, « Good Product Manager/Bad Product Manager », texte de 1996 à vérifier).
- Je distingue le livrable, le <span class="term" data-term="product-outcome">résultat</span> et l'impact (Joshua Seiden, « Outcomes Over Output », 2019).
- Je réponds de la clarté : chacun sait ce qu'on fait, pourquoi, et ce qu'on ne fait pas.
- J'écris les décisions, ce qu'on a écarté et ce qui nous ferait changer d'avis.
- Je négocie la marge de manœuvre en même temps que l'objectif : un résultat sans levier est une responsabilité vide.

**À relire** : [Ce dont le PM répond](../../knowledge/product-management.md#ce-dont-le-pm-repond), [Résultats plutôt que livrables](../../knowledge/product-management.md#resultats-plutot-que-livrables), [Le PM selon la taille de l'entreprise](../../knowledge/product-management.md#le-pm-selon-la-taille-de-lentreprise)

## Sens produit

### « Conçois une application pour aider les étudiants à cuisiner », « Conçois un produit pour X »

- Je clarifie d'abord : quel but (croissance, revenu, impact social), quelle contrainte, quel horizon ?
- Je choisis un segment précis plutôt que « les étudiants » : par exemple ceux qui viennent de quitter le foyer familial et cuisinent seuls avec un petit budget.
- Je liste leurs besoins sous forme de situations, à la manière des <span class="term" data-term="jobs-to-be-done">jobs to be done</span> : « le soir, je ne sais pas quoi faire avec ce qui reste dans le frigo ».
- Je priorise un besoin (fréquence, douleur, ce qui existe déjà), je propose trois solutions, j'en choisis une et je dis pourquoi.
- Je finis par la mesure : une métrique principale, une métrique d'entrée et un garde-fou, puis une limite de mon choix.
- Le cadre CIRCLES de Lewis Lin (« Decode and Conquer », 2013) suit cet ordre ; je l'utilise comme fil, sans le réciter.

**À relire** : [Jobs to be done](../../knowledge/culture-entreprise.md#jobs-to-be-done), [Discovery continue et arbre d'opportunités](../../knowledge/product-management.md#discovery-continue-et-arbre-dopportunites), [L'énoncé du problème](../../knowledge/product-management.md#lenonce-du-probleme), [Exercice 1 : concevoir un produit](exercices.md#exercice-1-concevoir-une-application-pour-aider-les-etudiants-a-cuisiner)

### « Quel est ton produit préféré, et comment l'améliorerais-tu ? »

- Je choisis un produit que j'utilise vraiment et dont je connais les utilisateurs, pas le plus célèbre.
- Je dis pour qui il est fait et quel besoin il sert, puis ce qu'il fait mieux que ses concurrents.
- J'identifie un segment mal servi et une douleur précise, observée chez moi ou chez d'autres.
- Je propose une amélioration, je dis comment je la testerais à bas coût et comment je mesurerais son succès.
- J'évite « ajouter un mode sombre » : une amélioration se justifie par un besoin, pas par une liste de fonctions.

**À relire** : [Les quatre risques](../../knowledge/product-management.md#les-quatre-risques), [Modèle de Kano](../../knowledge/product-management.md#modele-de-kano), [HEART](../../knowledge/product-management.md#heart)

## Discovery et recherche utilisateur

### « Comment sais-tu qu'une idée vaut la peine d'être construite ? »

- Je liste les quatre risques de Marty Cagan (« Inspired », 2017) : valeur, utilisabilité, faisabilité, viabilité.
- Je fais une <span class="term" data-term="assumption-mapping">cartographie des hypothèses</span> et je teste d'abord celles qui sont importantes et sans preuve.
- Je choisis le test le moins cher qui répond : une <span class="term" data-term="fake-door-test">fausse porte</span>, un <span class="term" data-term="concierge-test">concierge</span>, un prototype cliquable.
- J'écris le critère de succès avant le test, avec une date de décision.
- Exemple : un test concierge de deux semaines avec 30 cyclistes au lieu de deux mois de développement de la réservation [chiffres d'exemple].

**À relire** : [Les quatre risques](../../knowledge/product-management.md#les-quatre-risques), [Cartographier les hypothèses](../../knowledge/product-management.md#cartographier-les-hypotheses), [Prototypes et tests](../../knowledge/product-management.md#prototypes-et-tests-fausse-porte-concierge-magicien-doz)

### « Comment mènes-tu un entretien utilisateur ? »

- Je suis le <span class="term" data-term="mom-test">Mom Test</span> (Rob Fitzpatrick, 2013) : je parle de leur vie, pas de mon idée.
- Je demande des faits passés (« racontez-moi la dernière fois que... »), jamais des promesses (« utiliseriez-vous... ? »).
- Je cherche un engagement réel (laisser son numéro, payer d'avance) plutôt qu'un compliment.
- J'interroge aussi ceux qui sont partis, pas seulement les fidèles.
- Je note les citations exactes pendant l'entretien, et je fais un entretien par semaine plutôt qu'une grande étude par an.

**À relire** : [Interviewer sans biais : The Mom Test](../../knowledge/product-management.md#interviewer-sans-biais-the-mom-test), [Discovery continue et arbre d'opportunités](../../knowledge/product-management.md#discovery-continue-et-arbre-dopportunites)

### « Qu'est-ce qu'un MVP ? Donne un exemple. »

- Le <span class="term" data-term="mvp">MVP</span> d'Eric Ries (« The Lean Startup », 2011) est une expérience : le maximum d'apprentissage validé pour le moins d'effort.
- Ce n'est pas une version 1 au rabais : une seule hypothèse, un critère de décision, une durée courte.
- À la fin, je persévère ou je pivote, d'après le critère écrit avant.
- « Minimum » porte sur le périmètre, pas sur la qualité de ce qui est montré.
- Exemple : réservation par SMS pour 30 cyclistes ; critère : 18 sur 30 réservent deux fois par semaine pendant deux semaines [chiffres d'exemple].

**À relire** : [MVP et build-measure-learn](../../knowledge/product-management.md#mvp-et-build-measure-learn), [Prototypes et tests](../../knowledge/product-management.md#prototypes-et-tests-fausse-porte-concierge-magicien-doz)

### « Un dirigeant arrive avec une solution toute faite, que fais-tu ? »

- Je ne dis ni oui ni non : je remonte au problème (« quel client, quelle situation, qu'est-ce que ça lui coûte aujourd'hui ? »).
- J'écris un <span class="term" data-term="problem-statement">énoncé du problème</span> sans la solution, et je le fais valider par le dirigeant.
- Je propose deux ou trois solutions, dont la sienne, et un test rapide pour départager.
- Si sa solution gagne, tant mieux : je l'ai rendue mesurable.
- Exemple : « il nous faut une réservation » devient « 30 % des cyclistes du matin trouvent leur station vide ».

**À relire** : [L'énoncé du problème](../../knowledge/product-management.md#lenonce-du-probleme), [Influence sans autorité](../../knowledge/culture-entreprise.md#influence-sans-autorite-et-communautes-de-pratique)

## Priorisation et feuille de route

### « Comment priorises-tu ? », « Tu as cinq demandes et une seule équipe, que fais-tu ? »

- Je reviens d'abord à l'objectif du trimestre : quelle demande le fait bouger ?
- J'utilise une méthode écrite, comme le <span class="term" data-term="rice-score">score RICE</span> (Sean McBride, Intercom, 2016), pour rendre les hypothèses visibles.
- Je dis sa limite : RICE favorise les petites choses larges, comme un mode sombre, et ignore le coût du retard.
- Je traite à part ce qui a une date imposée (contrat, loi), avec le <span class="term" data-term="cost-of-delay">coût du retard</span> (Reinertsen, 2009).
- J'écris la décision et sa raison, refus compris, et je la publie.

**À relire** : [RICE](../../knowledge/product-management.md#rice), [WSJF et coût du retard](../../knowledge/product-management.md#wsjf-et-cout-du-retard), [Quelle méthode, et quand elle échoue](../../knowledge/product-management.md#quelle-methode-et-quand-elle-echoue), [Exercice 3 : prioriser un backlog](exercices.md#exercice-3-prioriser-un-backlog-de-huit-elements-avec-rice)

### « Comment dis-tu non à un dirigeant ou à un gros client ? »

- Je reformule le besoin derrière la demande, pour montrer que je l'ai compris.
- Je montre le <span class="term" data-term="opportunity-cost">coût d'opportunité</span> : ce qui glisse si on prend la demande.
- Je propose une alternative moins chère (un export fait à la main pour ce client) et une condition de réexamen.
- Je note chaque demande refusée et je reviens vers son auteur si le contexte change.
- Je m'appuie sur l'objectif écrit et sur des données, pas sur mon intuition seule.

**À relire** : [Dire non](../../knowledge/product-management.md#dire-non), [Communiquer un compromis](../../knowledge/product-management.md#communiquer-un-compromis)

### « À quoi ressemble ta feuille de route ? », « Le commercial veut une date, que réponds-tu ? »

- Une feuille de route <span class="term" data-term="now-next-later">Now, Next, Later</span> (Janna Bastow) : la précision affichée suit la précision réelle.
- Chaque élément dit quel résultat il sert : c'est une feuille de route par résultats, pas une liste de fonctions.
- Je donne des dates là où elles existent vraiment (rentrée universitaire, contrat, loi), avec une confiance : « 1er septembre, confiance 80 %, si... ».
- Pour une vraie date, je fixe la date et je fais varier le périmètre, avec MoSCoW.
- J'annonce un risque dès qu'une hypothèse tombe, pas la veille.

**À relire** : [Now, Next, Later](../../knowledge/product-management.md#now-next-later), [Feuille de route par résultats ou par dates](../../knowledge/product-management.md#feuille-de-route-par-resultats-ou-par-dates), [Tenir un engagement de date](../../knowledge/product-management.md#tenir-un-engagement-de-date), [Exercice 8 : une date exigée](exercices.md#exercice-8-arbitrer-la-feuille-de-route-face-a-une-date-exigee)

## Métriques et analytique

### « Quelle North Star choisirais-tu pour notre produit ? »

- Je pars de la valeur reçue par l'utilisateur : une <span class="term" data-term="north-star-metric">North Star</span> capte cette valeur et annonce le revenu futur.
- Pour `bike-app` : trajets terminés par semaine ; pour `recipe-app` : recettes cuisinées par semaine, pas les recettes consultées.
- Je la décompose en <span class="term" data-term="input-metric">métriques d'entrée</span> sur lesquelles une équipe agit (cyclistes actifs, trajets par cycliste, vélos disponibles).
- J'ajoute une contre-mesure contre la loi de Goodhart : une North Star de volume grossit avec des trajets gratuits offerts en masse.
- Je refuse les <span class="term" data-term="vanity-metric">métriques de vanité</span> (téléchargements cumulés), qui montent toujours.

**À relire** : [North Star et arbre de métriques](../../knowledge/product-management.md#north-star-et-arbre-de-metriques), [North Star metric](../../knowledge/culture-entreprise.md#north-star-metric), [Éviter le piège de Goodhart](../../knowledge/culture-entreprise.md#eviter-le-piege-de-goodhart)

### « Comment définirais-tu le succès de cette fonction ? »

- Je dis d'abord quel comportement doit changer, et pour qui : c'est la métrique principale.
- J'utilise HEART (Google, CHI 2010) et sa démarche objectifs, signaux, métriques, en ne gardant que deux catégories utiles.
- J'ajoute une ou deux <span class="term" data-term="guardrail-metric">métriques garde-fous</span>, avec leur seuil écrit avant.
- Je fixe la base, la cible, la date de lecture et la décision que je prendrai selon le résultat.
- Je prévois le <span class="term" data-term="tracking-plan">plan de marquage</span> dans la définition de terminé : sans événements, pas de mesure.

**À relire** : [HEART](../../knowledge/product-management.md#heart), [Métriques garde-fous](../../knowledge/product-management.md#metriques-garde-fous), [Définition de terminé](../../knowledge/product-management.md#definition-de-termine), [Exercice 4 : métriques de succès](exercices.md#exercice-4-definir-les-metriques-de-succes-dune-fonction)

### « Les utilisateurs actifs ont chuté de 15 % hier, que fais-tu ? »

- Je vérifie que la baisse est réelle : changement de marquage, tableau de bord en retard, bug de collecte.
- Je compare au même jour de la semaine précédente, pas à la veille.
- Je sépare causes externes (vacances, météo, panne d'un magasin d'applications) et internes (version, prix, campagne arrêtée).
- Je segmente : plateforme, version, pays, nouveaux ou anciens, étape de l'<span class="term" data-term="conversion-funnel">entonnoir</span>.
- Je donne une hypothèse, la requête qui la vérifie, puis l'action et sa communication ; je me méfie du <span class="term" data-term="simpson-paradox">paradoxe de Simpson</span>.

**À relire** : [Enquêter sur une baisse de métrique](../../knowledge/product-management.md#enqueter-sur-une-baisse-de-metrique), [Entonnoir et activation](../../knowledge/product-management.md#entonnoir-et-activation), [Exercice 2 : diagnostiquer une baisse](exercices.md#exercice-2-diagnostiquer-une-baisse-dutilisateurs-actifs)

### « Ton A/B test montre +3 % de conversion, on le met en production ? »

- Je vérifie d'abord la répartition des groupes : un <span class="term" data-term="sample-ratio-mismatch">déséquilibre d'échantillon</span> invalide tout le reste.
- Je lis l'<span class="term" data-term="confidence-interval">intervalle de confiance</span> de l'écart : contient-il 0, sa borne basse vaut-elle le changement ?
- Je regarde l'écart semaine par semaine pour repérer un <span class="term" data-term="novelty-effect">effet de nouveauté</span>.
- Je vérifie les garde-fous et je refuse de chercher après coup le segment où « ça marche ».
- Je rappelle la règle : taille d'échantillon fixée avant, pas d'arrêt dès que le chiffre paraît bon.

**À relire** : [Expérimenter avec un A/B test](../../knowledge/product-management.md#experimenter-avec-un-ab-test), [A/B testing](../../knowledge/donnees-decision.md#ab-testing), [Exercice 5 : lire un A/B test](exercices.md#exercice-5-lire-le-resultat-dun-ab-test)

### « Comment sais-tu qu'un produit a trouvé son marché ? »

- Le signe le plus fiable : une courbe de <span class="term" data-term="cohort-retention">rétention par cohortes</span> qui s'aplatit au-dessus de zéro.
- Le test de Sean Ellis : au moins 40 % de « très déçu » si le produit disparaît [À prendre avec précaution : seuil tiré de l'expérience de son auteur, sans étude publiée].
- Je lis les deux par segment : un segment peut avoir trouvé son marché quand la moyenne ne l'a pas.
- Avant ce point, accélérer l'acquisition remplit un seau percé.

**À relire** : [Product-market fit](../../knowledge/product-management.md#ce-que-veut-dire-product-market-fit), [Le test des 40 % de Sean Ellis](../../knowledge/product-management.md#le-test-des-40-de-sean-ellis), [La courbe de rétention qui s'aplatit](../../knowledge/product-management.md#la-courbe-de-retention-qui-saplatit)

## Exécution

### « Comment écris-tu une story et ses critères d'acceptation ? »

- Une <span class="term" data-term="user-story">story</span> part d'un utilisateur, d'un besoin et d'une valeur, et respecte INVEST (Bill Wake, 2003).
- Je découpe en tranches verticales : chaque tranche traverse base, API et écran et peut sortir seule.
- J'écris les <span class="term" data-term="acceptance-criteria">critères d'acceptation</span> avec le développeur et le QA, en Gherkin quand c'est utile.
- Je décris le comportement, pas l'interface : « le vélo redevient disponible », pas « le bouton devient gris ».

**À relire** : [Stories utilisateur et INVEST](../../knowledge/product-management.md#stories-utilisateur-et-invest), [Critères d'acceptation](../../knowledge/product-management.md#criteres-dacceptation), [Gherkin avec un « Goal »](../../knowledge/conception-tests.md#gherkin-avec-un-goal), [Exercice 9 : découper une epic](exercices.md#exercice-9-decouper-une-epic-en-stories-avec-criteres-gherkin)

### « Quel est le rôle du product owner dans Scrum ? Scrum ou Kanban pour ton équipe ? »

- Dans Scrum, le <span class="term" data-term="product-owner">PO</span> répond de la valeur du produit : il écrit l'objectif de produit et ordonne le backlog ; les développeurs décident combien ils prennent et comment.
- Je donne à chaque sprint un objectif en une phrase, pas une liste de tickets : il permet de négocier le périmètre sans perdre le but.
- Je choisis le cadre selon le travail : Scrum pour une fonctionnalité qui se précise par objectifs, Kanban quand l'équipe reçoit surtout des demandes imprévues.
- Je viens à la sprint review avec de vrais utilisateurs ou des représentants du métier, et je repars avec des changements dans le backlog.

**À relire** : [L'équipe Scrum et ses trois responsabilités](../../knowledge/agilite.md#lequipe-scrum-et-ses-trois-responsabilites), [Les trois artefacts et leurs engagements](../../knowledge/agilite.md#les-trois-artefacts-et-leurs-engagements), [Scrum, Kanban ou Scrumban](../../knowledge/agilite.md#scrum-kanban-ou-scrumban)

### « Le lancement est dans deux semaines et l'équipe ne tiendra pas la date, que fais-tu ? »

- Je vérifie si la date est externe (contrat, saison) ou interne : une cible interne se déplace.
- Pour une date externe, je coupe du périmètre (MoSCoW), jamais les tests.
- Je n'ajoute pas de personnes en dernière minute : la <span class="term" data-term="brooks-law">loi de Brooks</span> (1975) dit que ça retarde encore.
- J'annonce la situation tout de suite aux parties prenantes, avec deux options chiffrées et ma recommandation.
- Je note ce qui a fait déraper l'estimation, pour la prochaine fois.

**À relire** : [Tenir un engagement de date](../../knowledge/product-management.md#tenir-un-engagement-de-date), [MoSCoW](../../knowledge/product-management.md#moscow), [Communiquer un compromis](../../knowledge/product-management.md#communiquer-un-compromis)

### « Comment prépares-tu un lancement ? »

- Je sépare déployer, activer et lancer : un <span class="term" data-term="feature-flag">feature flag</span> permet de déployer sans montrer.
- J'ouvre progressivement (bêta fermée, 5 %, 50 %, 100 %) en surveillant les garde-fous.
- Je prépare le <span class="term" data-term="go-to-market">go-to-market</span> : segment, message, canal, prix, support et ventes formés.
- J'écris la note de version pour l'utilisateur, pas pour l'équipe.
- Huit semaines après, je regarde si le résultat visé a bougé : garder, améliorer ou retirer.

**À relire** : [Sortir une fonctionnalité](../../knowledge/product-management.md#sortir-une-fonctionnalite-flags-beta-lancement), [Déploiement progressif](../../knowledge/livraison.md#deploiement-progressif)

### « Comment arbitres-tu entre nouvelles fonctions et dette technique ? »

- Je ne l'oppose pas aux fonctions : je relie la <span class="term" data-term="technical-debt">dette technique</span> à un résultat que je suis (délai de livraison, incidents).
- Je demande au tech lead la liste des dettes classée par coût.
- Je réserve une part fixe de capacité, par exemple 20 %, qui ne se renégocie pas à chaque sprint.
- J'accepte une dette délibérée et prudente pour un MVP, si son remboursement est écrit.

**À relire** : [Négocier la dette technique](../../knowledge/product-management.md#negocier-la-dette-technique)

## Stratégie et marché

### « Faut-il lancer notre offre sur ce nouveau marché ? »

- Je calcule la taille du marché de bas en haut (<span class="term" data-term="tam-sam-som">TAM, SAM, SOM</span>), à partir de clients que je peux compter.
- Je regarde l'économie d'un client : <span class="term" data-term="customer-lifetime-value">valeur vie client</span> et <span class="term" data-term="customer-acquisition-cost">coût d'acquisition</span>.
- Je vérifie que le produit a déjà trouvé son marché dans le segment d'origine : sinon, j'exporte un problème.
- Je propose un test limité (une ville, un segment) avec un critère de décision.
- Je dis ce qu'on ne fera pas pendant ce temps.

**À relire** : [TAM, SAM, SOM](../../knowledge/product-management.md#taille-de-marche-tam-sam-som), [LTV et CAC](../../knowledge/product-management.md#valeur-dun-client-et-cout-dacquisition-ltv-et-cac), [Bonne et mauvaise stratégie](../../knowledge/culture-entreprise.md#bonne-et-mauvaise-strategie), [Exercice 6 : taille de marché](exercices.md#exercice-6-estimer-un-marche-et-leconomie-dun-abonnement)

### « Un concurrent lance la même fonction gratuitement, que fais-tu ? »

- Je ne copie pas dans la panique : je regarde d'abord si nos clients partent (rétention, résiliations, motifs donnés).
- Je reviens à ce qui nous différencie et à ce que nos meilleurs clients aiment.
- J'évalue la menace avec le dilemme de l'innovateur (Christensen, 1997) : une offre « moins bonne mais gratuite » peut prendre le bas du marché.
- Je réponds sur la valeur (qualité, intégration, service) avant le prix.

**À relire** : [Le dilemme de l'innovateur](../../knowledge/culture-entreprise.md#le-dilemme-de-linnovateur), [Cartes de Wardley](../../knowledge/culture-entreprise.md#cartes-de-wardley), [Le test des 40 % de Sean Ellis](../../knowledge/product-management.md#le-test-des-40-de-sean-ellis)

### « Comment fixerais-tu le prix de notre abonnement ? »

- Trois références : le coût, les concurrents, la valeur perçue (<span class="term" data-term="value-based-pricing">tarification à la valeur</span>) ; pour un produit numérique, surtout les deux dernières.
- Je cherche une plage acceptable (questionnaire de Van Westendorp, 1976), puis je teste sur un segment ou une ville.
- Je vérifie l'effet sur la LTV, pas seulement sur la conversion.
- Je décide avec la finance et le juridique, et je sais qu'une baisse de prix est difficile à reprendre.

**À relire** : [Les bases du prix](../../knowledge/product-management.md#les-bases-du-prix), [LTV et CAC](../../knowledge/product-management.md#valeur-dun-client-et-cout-dacquisition-ltv-et-cac)

### « Combien de recettes cuisine-t-on en France chaque soir ? », « Combien de vélos pour une ville de 500 000 habitants ? »

- Une <span class="term" data-term="fermi-estimate">estimation de Fermi</span> : je découpe en facteurs que je peux estimer, puis je multiplie.
- Je dis chaque hypothèse à voix haute, avec un chiffre rond.
- Je vérifie l'ordre de grandeur à la fin, par une autre route ou une référence connue.
- On juge la démarche, pas le chiffre.

**À relire** : [Estimer un ordre de grandeur](../../knowledge/product-management.md#estimer-un-ordre-de-grandeur), [Exercice 6 : taille de marché](exercices.md#exercice-6-estimer-un-marche-et-leconomie-dun-abonnement)

## Parties prenantes et leadership

### « Comment alignes-tu des parties prenantes en désaccord ? »

- Je fais une <span class="term" data-term="stakeholder-map">carte des parties prenantes</span> (pouvoir, intérêt) et je n'oublie pas ceux qui subissent la décision (support, maintenance).
- Je les vois en tête à tête avant la réunion de décision (<span class="term" data-term="nemawashi">nemawashi</span>).
- Je présente des options nommées, ce qu'on gagne et ce qu'on perd, la recommandation en premier (<span class="term" data-term="pyramid-principle">principe de la pyramide</span>).
- Une fois la décision prise, je demande le <span class="term" data-term="disagree-and-commit">désaccord et engagement</span>, et je l'écris.

**À relire** : [Cartographier et aligner les parties prenantes](../../knowledge/product-management.md#cartographier-et-aligner-les-parties-prenantes), [Communiquer un compromis](../../knowledge/product-management.md#communiquer-un-compromis), [Désaccord et engagement](../../knowledge/culture-entreprise.md#desaccord-et-engagement), [Principe de la pyramide](../../knowledge/culture-entreprise.md#principe-de-la-pyramide)

### « Comment influences-tu une équipe que tu ne diriges pas ? »

- Je n'ai pas d'autorité hiérarchique sur l'équipe : je convaincs par le problème, les données et l'écoute.
- Je partage les entretiens utilisateurs et les chiffres bruts : l'équipe se fait son propre avis.
- Je donne de la place aux idées des autres, et je reconnais publiquement leurs contributions.
- J'écris un <span class="term" data-term="one-pager">one-pager</span> pour une décision importante : une page, une décision attendue, une date.

**À relire** : [Influence sans autorité](../../knowledge/culture-entreprise.md#influence-sans-autorite-et-communautes-de-pratique), [One-pager](../../knowledge/culture-entreprise.md#one-pager), [Working Backwards](../../knowledge/product-management.md#working-backwards-le-communique-et-la-faq), [Exercice 7 : PR/FAQ](exercices.md#exercice-7-ecrire-un-prfaq-pour-une-nouvelle-offre)

### « Que fais-tu pendant tes 90 premiers jours ? »

- Mois 1, comprendre : utilisateurs (une dizaine d'entretiens), chiffres (entonnoir, rétention), équipe et parties prenantes ; je lis les décisions passées.
- Mois 2, une <span class="term" data-term="quick-win">victoire rapide</span>, visible et peu risquée, choisie avec l'équipe.
- Mois 3, une feuille de route Now, Next, Later avec un objectif de résultat, validée par l'équipe et la direction.
- Je m'appuie sur Michael Watkins (« The First 90 Days », 2003) : je négocie le succès attendu avec mon responsable dès le début.

**À relire** : [Les 90 premiers jours dans un nouveau rôle](../../knowledge/culture-entreprise.md#les-90-premiers-jours-dans-un-nouveau-role), [OKR](../../knowledge/culture-entreprise.md#okr)

## Questions de comportement

### « Raconte un produit ou une fonction qui a échoué »

- J'utilise la <span class="term" data-term="star-method">méthode STAR</span> : situation, tâche, action, résultat, puis ce que j'ai appris.
- Je choisis un vrai échec, dont j'étais responsable, pas un faux défaut (« je travaille trop »).
- Je montre ce que j'ai mesuré, comment j'ai décidé d'arrêter et ce que j'ai changé ensuite dans ma façon de faire.
- Exemple de forme : une fonction livrée sans test de valeur, utilisée par 2 % des utilisateurs, retirée après huit semaines ; depuis, je teste avec une fausse porte avant de construire [chiffres d'exemple].

**À relire** : [Raconter une expérience avec la méthode STAR](../../knowledge/culture-entreprise.md#raconter-une-experience-avec-la-methode-star), [Prototypes et tests](../../knowledge/product-management.md#prototypes-et-tests-fausse-porte-concierge-magicien-doz)

### « Parle-moi d'un désaccord avec un ingénieur ou un designer »

- Je raconte un désaccord sur le fond (périmètre, dette, solution), pas un conflit de personnes.
- Je montre que j'ai écouté son risque avant de défendre le mien, et que nous avons cherché un fait qui départage (un spike, un test utilisateur).
- Je dis qui a décidé, et comment le perdant s'est engagé.
- Je finis par le résultat et ce que la relation y a gagné.

**À relire** : [Désaccord et engagement](../../knowledge/culture-entreprise.md#desaccord-et-engagement), [Le trio produit](../../knowledge/product-management.md#le-trio-produit), [Négocier la dette technique](../../knowledge/product-management.md#negocier-la-dette-technique)

### « Données ou intuition : raconte une décision prise sans données suffisantes »

- Je distingue les décisions réversibles des irréversibles (décisions de type 1 et de type 2, Jeff Bezos, lettre aux actionnaires de 2015).
- Pour une décision réversible, je décide vite avec ce que j'ai et je prévois la mesure qui me fera corriger.
- Pour une décision irréversible, je cherche un test bon marché qui produit la donnée manquante.
- Je dis ce qui m'aurait fait changer d'avis, et ce qui s'est passé.

**À relire** : [Décisions de type 1 et de type 2](../../knowledge/culture-entreprise.md#decisions-de-type-1-et-de-type-2), [Décider avec les données](../../knowledge/donnees-decision.md#decider-avec-les-donnees)

## Fonctions d'IA dans le produit

!!! info "Section rédigée en novembre 2026"
    Les modèles, leurs coûts et les obligations légales évoluent vite. Les dates et les noms d'outils sont à vérifier au moment de la lecture.

### « Ajouterais-tu une fonction d'IA à notre produit ? », « Comment mesures-tu sa qualité ? »

- Je pars d'une opportunité, pas de la technologie : quelle tâche fréquente une réponse approximative aiderait-elle déjà ?
- Je demande ce que coûte une mauvaise réponse : une <span class="term" data-term="hallucination">hallucination</span> sur une recette coûte un dîner, sur un remboursement de l'argent.
- Plus l'erreur coûte cher, plus je garde un <span class="term" data-term="human-in-the-loop">humain dans la boucle</span>.
- Avant le lancement, une <span class="term" data-term="llm-eval">évaluation</span> sur de vraies questions, avec un seuil écrit ; je la rejoue à chaque changement de modèle.
- Après, je mesure la réussite de la tâche, pas le nombre de messages, avec un garde-fou (réclamations), le coût par requête et l'obligation d'informer l'utilisateur (AI Act, article 50, à partir du 2 août 2026, à vérifier).

**À relire** : [Une fonction d'IA dans le produit](../../knowledge/product-management.md#une-fonction-dia-dans-le-produit), [Hallucination](../../knowledge/ia-agents.md#hallucination), [Tester un système à base d'agents](../../knowledge/ia-capacites.md#tester-un-systeme-a-base-dagents), [Les quatre niveaux de risque de l'AI Act](../../knowledge/ia-entreprise.md#les-quatre-niveaux-de-risque)

## Critères éliminatoires

Trois questions où une seule mauvaise réponse suffit à écarter un candidat PM.

| Question du recruteur | Réponse qui élimine | Ce que je réponds | À relire |
|---|---|---|---|
| « Comment sais-tu que ta fonction a réussi ? » | « Elle a été livrée à temps », ou « les utilisateurs l'ont aimée en démo ». | Par un changement de comportement mesuré contre une base, avec un garde-fou, lu à une date fixée avant le lancement ; et je dis ce que j'aurais fait si le chiffre n'avait pas bougé. | [Résultats plutôt que livrables](../../knowledge/product-management.md#resultats-plutot-que-livrables), [Métriques garde-fous](../../knowledge/product-management.md#metriques-garde-fous) |
| « Comment valides-tu une idée avec les utilisateurs ? » | « Je leur montre la maquette et je leur demande s'ils l'utiliseraient. » | Je fais raconter des faits passés selon le Mom Test, je teste l'hypothèse la plus risquée par une fausse porte ou un concierge, avec un critère écrit avant. | [The Mom Test](../../knowledge/product-management.md#interviewer-sans-biais-the-mom-test), [Prototypes et tests](../../knowledge/product-management.md#prototypes-et-tests-fausse-porte-concierge-magicien-doz) |
| « Qui décide de la solution technique et de l'estimation ? » | « Moi : je donne les spécifications détaillées et la date à l'équipe. » | L'équipe estime et le tech lead choisit la solution ; je donne le problème, le résultat et les contraintes, et je propose de couper du périmètre quand la fourchette dépasse l'appétit. | [Le trio produit](../../knowledge/product-management.md#le-trio-produit), [Estimation et découpage](../../knowledge/product-management.md#estimation-et-decoupage) |

## Les 3 choses qu'un PM fait en permanence

1. **Partir du problème des utilisateurs, entendu de leur bouche.** Je parle à des utilisateurs chaque semaine et j'écris le problème avant la solution. Exemple : « il nous faut une réservation » devient « les cyclistes du matin trouvent leur station vide ».
2. **Choisir, et dire ce qu'on ne fait pas.** Un objectif de résultat, une méthode de priorisation explicite, des refus motivés. Exemple : le mode sombre attend, parce qu'il ne fait pas bouger le deuxième trajet des nouveaux inscrits.
3. **Mesurer l'effet et corriger.** Base, cible, garde-fou, date de lecture, et le courage de retirer ce qui ne sert pas. Exemple : une fonction utilisée par 2 % des utilisateurs après huit semaines est retirée, et la leçon change la discovery suivante.

## Structure simple pour répondre à l'oral

Pour une question de comportement, je suis la méthode STAR et je finis par ce que j'ai appris ([Raconter une expérience avec la méthode STAR](../../knowledge/culture-entreprise.md#raconter-une-experience-avec-la-methode-star)). Pour une étude de cas, je déroule ce fil :

1. **Clarifier** : quel but, quelle contrainte, quel horizon ? Une ou deux questions, pas dix.
2. **Utilisateurs** : quel segment précis, et pourquoi lui ?
3. **Besoins** : quelles situations douloureuses, à quelle fréquence ?
4. **Options** : trois solutions, de la plus légère à la plus lourde.
5. **Choix** : laquelle, pourquoi, et ce que je ne fais pas.
6. **Mesure** : métrique principale, métrique d'entrée, garde-fou, base et cible.
7. **Risques et suite** : la limite de mon choix, et le test qui le vérifierait à bas coût.

L'idée centrale : un product manager ne se juge pas à la quantité de fonctions livrées. Il choisit le bon problème pour les bons utilisateurs, rend les hypothèses visibles, teste avant de construire, mesure l'effet et sait arrêter ce qui ne sert pas.

## Mesurer le succès

On me demande presque toujours « comment sais-tu que ça a marché ? ». Ma réponse suit la même forme pour chaque initiative : une **base** mesurée avant (par exemple, 22 % des nouveaux inscrits de `recipe-app` cuisinent deux recettes dans leurs 14 premiers jours), la **même mesure après**, sur les cohortes suivantes, et une **métrique garde-fou** qui ne doit pas se dégrader (le taux de désactivation des notifications, ou les tickets du support). Puis je donne, par solution, un <span class="term" data-term="sli">SLI</span> et un <span class="term" data-term="slo">SLO</span> interne ; un <span class="term" data-term="sla">SLA</span> n'a de sens que lorsqu'un client a signé une promesse.

| Solution | Indicateur de succès (SLI) | SLO probable | SLA probable |
|---|---|---|---|
| objectif de résultat trimestriel | part des paris livrés qui font bouger leur résultat dans le bon sens | au moins 1 sur 3 [À prendre avec précaution : ordre de grandeur d'exemple, selon le produit] | sans objet : pas de contrat externe |
| discovery continue | entretiens utilisateurs par trio et par semaine | au moins 1 par semaine, 10 semaines sur 12 [À prendre avec précaution : valeur d'exemple] | sans objet : pas de contrat externe |
| activation | part des nouveaux inscrits qui cuisinent 2 recettes en 14 jours | de 22 % à 30 % en un trimestre [À prendre avec précaution : valeur d'exemple] | sans objet : pas de contrat externe |
| engagement de date externe | part des dates promises à des partenaires tenues sur l'année | au moins 90 % [À prendre avec précaution : valeur d'exemple] | selon le contrat : une date promise à un partenaire peut avoir une pénalité |
| lancement d'une fonction | part des utilisateurs visés qui l'ont utilisée au moins une fois à 30 jours | au moins 15 % [À prendre avec précaution : valeur d'exemple] | sans objet : pas de contrat externe |
| fonction d'IA | part des questions résolues sans ticket, avec réclamations stables | au moins 40 % [À prendre avec précaution : valeur d'exemple, aucune norme externe] | sans objet : pas de contrat externe |

## Pièges à éviter

| Piège | Ce qui se passe | Solution |
|---|---|---|
| **Sauter à la solution** : à « conçois un produit pour X », je décris des écrans dès la première minute. | Le recruteur ne voit ni le segment, ni le besoin, ni la raison du choix. | Je clarifie, je choisis un segment et un besoin, puis trois solutions ([Structure pour l'oral](#structure-simple-pour-repondre-a-loral)). |
| **Couvrir tout le monde** : je conçois pour « les étudiants » ou « les utilisateurs ». | La réponse reste générique et rien n'est priorisé. | Je choisis un segment précis et je dis pourquoi ([Sens produit](#sens-produit)). |
| **Mesurer la livraison** : je réponds « la fonction est sortie à temps ». | Critère éliminatoire : je montre que je juge l'output, pas le résultat. | Base, cible, garde-fou et date de lecture ([Mesurer le succès](#mesurer-le-succes)). |
| **Croire le score** : je classe le backlog au score RICE et je m'arrête là. | Le mode sombre passe devant ce qui sert l'objectif. | Le score ouvre la discussion, l'objectif tranche ([Priorisation](#priorisation-et-feuille-de-route)). |
| **Conclure sur la première cause** : « les actifs baissent, c'est la météo ». | Le vrai bug reste en production. | Réelle, externe ou interne, puis segmenter ([Métriques et analytique](#metriques-et-analytique)). |
| **Répondre au conditionnel** : je dis « je ferais » sans aucune histoire vécue. | La réponse ressemble à un livre récité. | Une histoire STAR par thème, avec mes chiffres ([Questions de comportement](#questions-de-comportement)). |
| **Promettre une date pour faire plaisir** : je donne au commercial la date qu'il veut. | La promesse devient ferme dans sa tête, et je la rate. | Une date avec sa confiance et ses conditions, périmètre variable ([Priorisation](#priorisation-et-feuille-de-route)). |
