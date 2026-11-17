# Entretien Software Engineer : les questions

!!! warning "Avertissement"
    Ces notes sont des pense-bêtes personnels, pas une source de vérité. Elles reflètent ma compréhension et mes choix : leur contenu reste subjectif, malgré les citations et les références qu'il contient. Il peut être incomplet, simplifié, inexact ou dépassé. Vérifiez toujours dans la documentation officielle avant de l'appliquer. Ce contenu est fourni tel quel, sans aucune garantie : son utilisation se fait sous votre seule responsabilité.

!!! audience "Pour qui, pour quoi"
    - **Métiers** : développeur back-end, développeur full-stack, développeur qui vise un poste de Software Engineer, QA qui passe au développement, tech lead qui fait passer des entretiens.
    - **Usages** : je prépare un entretien technique et je veux voir en une page les questions qui reviennent (SOLID, N+1, race condition, revue de code) ; je relis la veille de l'entretien le plan de réponse de chaque thème ; je cherche quelle page du site explique en détail une notion qu'on m'a demandée ; je prépare une histoire vécue pour chaque thème ; je fais passer un entretien et je cherche des questions qui distinguent une réponse apprise d'une réponse d'expérience.

Cette page liste, thème par thème, les questions posées en entretien Software Engineer, telles que le recruteur les formule. Le poste est individuel et concret : on parle de mon code, de ma fonctionnalité, de mon équipe, pas de stratégie à l'échelle de l'entreprise.

Comment je m'en sers :

1. je lis le plan de réponse de la question, quelques lignes à la première personne ;
2. j'ouvre les sections **À relire**, qui donnent la réponse complète avec ses exemples ;
3. je prépare une histoire vécue pour chaque thème : le recruteur attend souvent « j'ai fait », avec une situation vraie et un résultat vérifiable (un bug évité, un temps de réponse divisé, une revue plus rapide) ;
4. je m'entraîne aux exercices en direct (refactoring, TDD, N+1, endpoint REST, cache LRU, double paiement) sur la page [exercices](exercices.md).

Les sources citées dans les plans sont datées : les citer montre que je connais l'état de l'art, sans réinventer. Les chiffres donnés sont des exemples.

## Code lisible et conception

### « Qu'est-ce qu'un code lisible, et comment le reconnais-tu ? »

- Je pars du lecteur : un collègue (ou moi dans six mois) doit comprendre sans que l'auteur explique.
- Je regarde des noms qui disent l'intention métier, des fonctions qui font une seule chose, un flux aplati par des <span class="term" data-term="guard-clause">clauses de garde</span>.
- Je remplace les <span class="term" data-term="magic-number">nombres magiques</span> par des constantes nommées et je ne commente que le « pourquoi ».
- Mon test simple : si un relecteur doit me poser une question pour comprendre une fonction, elle n'est pas encore assez claire (« Clean Code », Robert C. Martin, 2008 ; quatre règles du design simple, Kent Beck, fin des années 1990).

**À relire** : [Clauses de garde](../../knowledge/principes-conception.md#clauses-de-garde), [Les quatre règles du design simple](../../knowledge/principes-conception.md#les-quatre-regles-du-design-simple), [Modules profonds](../../knowledge/principes-conception.md#modules-profonds), [Pas de valeur magique](../../knowledge/qualite.md#pas-de-valeur-magique), [Nommer selon l'intention](../../knowledge/principes-conception.md#nommer-selon-lintention), et l'[exercice 1](exercices.md#exercice-1-refactorer-une-fonction-longue-sans-changer-son-comportement).

### « Explique SOLID, avec un exemple pour chaque lettre. Comment l'appliques-tu sans tomber dans la sur-ingénierie ? »

- Pour chaque lettre, je donne le symptôme qu'elle soigne : une classe qui change pour trois raisons (S), une sous-classe qui casse l'appelant (L), une dépendance à la base au milieu de la règle métier (D).
- J'utilise <span class="term" data-term="solid">SOLID</span> pour réagir à une douleur réelle, pas comme une checklist.
- Je n'ajoute une interface que pour une deuxième implémentation réelle ou un faux en test : sinon, c'est de la <span class="term" data-term="over-engineering">sur-ingénierie</span>.
- En revue, je repère l'inverse, les défauts d'un code <span class="term" data-term="stupid-code">STUPID</span> (William Durand, 2013, date à vérifier) : Singleton, couplage fort, duplication.

**À relire** : [SOLID](../../knowledge/principes-conception.md#solid), [STUPID : les six odeurs à éviter](../../knowledge/principes-conception.md#stupid-les-six-odeurs-a-eviter), [D : inversion des dépendances](../../knowledge/principes-conception.md#d-inversion-des-dependances), et l'[exercice 11](exercices.md#exercice-11-reperer-les-defauts-de-conception-dune-classe-et-la-refactorer).

### « Peux-tu expliquer le principe de substitution de Liskov, et comment le viole-t-on sans s'en rendre compte ? »

- Une sous-classe respecte le contrat de sa parente : elle n'exige pas plus en entrée, elle ne promet pas moins en sortie (Barbara Liskov, 1987, puis avec Jeannette Wing, 1994).
- On la viole quand on hérite pour réutiliser du code : une méthode redéfinie qui lève « non supporté », ou un appelant qui teste le type avec `isinstance`.
- Mon exemple : une `GiftCard` qui hérite de `refund` sans savoir rembourser, et qui plante au premier retour de commande.
- Je corrige en séparant les capacités (`Chargeable`, `Refundable`) ou en composant, et je lance les mêmes tests de contrat sur chaque sous-classe.

**À relire** : [L : substitution de Liskov](../../knowledge/principes-conception.md#l-substitution-de-liskov), [I : ségrégation des interfaces](../../knowledge/principes-conception.md#i-segregation-des-interfaces), [Conception par contrat](../../knowledge/principes-conception.md#conception-par-contrat).

### « DRY, KISS, YAGNI : quand une duplication vaut-elle mieux qu'une abstraction ? »

- Pour moi, <span class="term" data-term="dry">DRY</span> veut dire « une règle métier écrite à un seul endroit » (Hunt et Thomas, « The Pragmatic Programmer », 1999), pas « jamais deux lignes identiques ».
- Deux codes qui se ressemblent mais changeront pour des raisons différentes restent séparés.
- J'applique la <span class="term" data-term="rule-of-three">règle de trois</span> : je factorise au troisième cas réel, quand je vois ce qui varie.
- Une fonction commune qui a pris cinq booléens est une <span class="term" data-term="wrong-abstraction">mauvaise abstraction</span> : je réintroduis la duplication, puis je refactorise (Sandi Metz, « The Wrong Abstraction », 2016).

**À relire** : [DRY, WET et AHA](../../knowledge/principes-conception.md#dry-wet-et-aha), [YAGNI et règle de trois](../../knowledge/principes-conception.md#yagni-et-regle-de-trois), [KISS](../../knowledge/principes-conception.md#kiss).

### « Composition ou héritage : comment choisis-tu ? Quand préférer Strategy à Template Method ? »

- Par défaut je compose : l'objet reçoit un collaborateur et lui délègue, ce qui se teste avec un faux et se combine librement (« Design Patterns », Gamma et coauteurs, 1994).
- J'hérite pour une vraie relation « est un » qui respecte Liskov, sur un niveau, ou quand le framework l'impose.
- Je passe à Strategy dès que l'héritage dépasse un niveau ou qu'une variante change beaucoup d'étapes.
- J'applique la <span class="term" data-term="law-of-demeter">loi de Déméter</span> : pas de `order.customer.address.city` pour décider à la place des objets voisins.

**À relire** : [Composition plutôt qu'héritage](../../knowledge/principes-conception.md#composition-plutot-quheritage), [Loi de Déméter et Tell, don't ask](../../knowledge/principes-conception.md#loi-de-demeter-et-tell-dont-ask), [Strategy](../../knowledge/design-patterns-comportement.md#strategy-strategie), [Template Method](../../knowledge/design-patterns-comportement.md#template-method-patron-de-methode).

### « Quels design patterns utilises-tu au quotidien ? Pourquoi dit-on que le Singleton est un anti-pattern ? »

- Je pars d'un cas réel : Strategy pour des frais de port standard et express, Builder pour des données de test lisibles (`an_order().paid().build()`), Adapter devant une API tierce.
- Le Singleton crée un état global partagé entre les tests et impossible à remplacer par un double : je laisse le conteneur d'<span class="term" data-term="dependency-injection">injection de dépendances</span> garder l'instance unique.
- Je dis toujours quand je n'utiliserais pas le pattern : un `if` suffit tant qu'il n'y a que deux cas stables.

**À relire** : [Singleton](../../knowledge/design-patterns.md#singleton), [Injection de dépendances](../../knowledge/design-patterns.md#injection-de-dependances), [Builder](../../knowledge/design-patterns.md#builder-monteur), [Adapter](../../knowledge/design-patterns.md#adapter-adaptateur).

### « Observer ou appels directs ? Qu'est-ce qu'un middleware ? »

- Avec Observer, l'émetteur ne connaît plus ses abonnés : ajouter un traitement est facile, mais l'ordre et la gestion d'erreur ne sont plus écrits nulle part.
- Quand la facturation doit réussir avant l'e-mail, je garde des appels directs.
- Un middleware est une chaîne de responsabilité : chaque maillon traite ce qui le concerne puis passe la main ou coupe court, et l'ordre de la chaîne est testé.

**À relire** : [Observer](../../knowledge/design-patterns-comportement.md#observer-observateur), [Chain of Responsibility](../../knowledge/design-patterns-comportement.md#chain-of-responsibility-chaine-de-responsabilite).

### « Comment empêches-tu qu'une commande expédiée soit payée une deuxième fois ? »

- Je modélise les statuts comme une machine à états : une table des transitions autorisées, testée ligne par ligne.
- Je double la règle en base (mise à jour conditionnelle sur le statut), parce que deux requêtes simultanées passent à travers un simple `if`.
- Pour une action rejouée depuis une file, je garde un identifiant d'action déjà traitée.

**À relire** : [State](../../knowledge/design-patterns-comportement.md#state-etat), [Command](../../knowledge/design-patterns-comportement.md#command-commande), et l'[exercice 7](exercices.md#exercice-7-deboguer-un-double-paiement).

### « Comment gères-tu les erreurs dans ton code ? Exceptions ou type résultat ? »

- Je sépare les erreurs métier attendues (stock insuffisant), qui font partie du contrat, des pannes (base injoignable), que je laisse remonter.
- J'applique l'<span class="term" data-term="fail-fast">échec rapide</span> : une entrée invalide est refusée dès l'entrée de la fonction (Jim Shore, IEEE Software, 2004).
- Je n'avale jamais une exception ; à la frontière, je traduis en code HTTP ou en message utile, sans fuite d'information.
- Je journalise une seule fois, avec un <span class="term" data-term="correlation-id">identifiant de corrélation</span>.

**À relire** : [Gestion des erreurs](../../knowledge/principes-conception.md#gestion-des-erreurs), [Pas de valeur de repli qui masque un trou](../../knowledge/qualite.md#pas-de-valeur-de-repli-qui-masque-un-trou), [Format d'erreur](../../knowledge/api-rest-async.md#format-derreur).

### « Comment conçois-tu une bibliothèque ou une CLI interne qui évolue sans casser ses utilisateurs ? »

- Je publie chaque version avec un numéro SemVer et un changelog : une rupture, une version majeure.
- Je pars du principe que tout comportement visible finira par être utilisé par quelqu'un (loi de Hyrum).
- Je déprécie avant de retirer, et je garde des dépendances sans cycle, tournées vers plus stable que moi.

**À relire** : [Principes des composants](../../knowledge/principes-conception.md#principes-des-composants), [Principe de moindre surprise](../../knowledge/principes-conception.md#principe-de-moindre-surprise), [Loi de Hyrum](../../knowledge/lois-et-principes.md#loi-de-hyrum), [SemVer](../../knowledge/api-rest-async.md#semver-ce-que-dit-le-numero-de-version), [Points d'extension par plugins](../../knowledge/principes-conception.md#points-dextension-par-plugins).

## Tester son propre code

### « Comment décides-tu quoi tester, et à quel niveau ? Pyramide ou trophée ? »

- Je pars du risque : qu'est-ce qui coûterait cher si ça cassait ?
- La logique métier (prix, validation) part en <span class="term" data-term="unit-test">tests unitaires</span> nombreux, avec les cas limites ; les requêtes SQL et transactions en <span class="term" data-term="integration-test">tests d'intégration</span> sur une vraie base jetable ; quelques tests de bout en bout pour les parcours critiques.
- La forme dépend du contexte (pyramide de Mike Cohn, 2009 ; trophée de Kent C. Dodds, 2018) : ma règle, une vraie requête dès qu'elle peut prouver le comportement.
- Je teste ce que fait le code, pas comment il le fait, pour pouvoir refactorer sans réécrire les tests.

**À relire** : [Pyramide, trophée, nid d'abeille](../../knowledge/qualite.md#pyramide-trophee-nid-dabeille-la-forme-dune-suite), [Choisir le bon niveau de test](../../knowledge/qualite.md#choisir-le-bon-niveau-de-test), [Test basé sur les risques](../../knowledge/conception-tests.md#test-base-sur-les-risques), [Partitions d'équivalence et valeurs limites](../../knowledge/conception-tests.md#partitions-dequivalence-et-valeurs-limites).

### « Pratiques-tu le TDD, et quand ne le fais-tu pas ? »

- J'utilise le <span class="term" data-term="tdd">TDD</span> quand la règle est claire et la logique riche : calcul, validation, parseur, correction de bug (Kent Beck, 2002 ; « Canon TDD », 2023).
- Je commence par la liste des scénarios, puis je les transforme un par un en test qui échoue.
- Quand je ne sais pas encore ce que je construis, je fais un <span class="term" data-term="spike">spike</span> jetable, puis je reprends proprement avec des tests.
- Pour un bug, j'écris toujours d'abord le test qui le reproduit.

**À relire** : [TDD en pratique](../../knowledge/conception-tests.md#tdd-en-pratique), et l'[exercice 3](exercices.md#exercice-3-ecrire-une-fonction-pure-en-tdd).

### « Quand utiliser un mock, et quand une vraie dépendance ? Quelle différence entre mock, stub et fake ? »

- Je double ce qui sort de mon contrôle : API tierce, e-mail, horloge, aléatoire.
- Je préfère un <span class="term" data-term="fake-object">fake</span> simple à un <span class="term" data-term="mock">mock</span> qui vérifie chaque appel : le fake teste le résultat, pas la manière (Martin Fowler, « Mocks Aren't Stubs », 2007).
- Je ne mocke pas ma propre base : une requête fausse ou une contrainte oubliée ne se voient qu'avec une vraie base, démarrée par <span class="term" data-term="testcontainers">Testcontainers</span>.
- Je choisis par voisin : école de Detroit par défaut, un mock quand l'échange est le comportement ; « don't mock what you don't own » (Freeman et Pryce, 2009).

**À relire** : [Double de test](../../knowledge/qualite.md#double-de-test-mock-stub-fake), [Écoles de Londres et de Detroit](../../knowledge/qualite.md#ecoles-de-londres-et-de-detroit-isoler-ou-non-lunite), [Tests d'intégration avec Testcontainers](../../knowledge/qualite.md#tests-dintegration-avec-testcontainers), [Tests de contrat et mocks d'API](../../knowledge/qualite.md#tests-de-contrat-et-mocks-dapi).

### « Comment rends-tu un test fiable et lisible ? Que fais-tu d'un test instable ? »

- Je contrôle tout ce qui varie : j'injecte une horloge au lieu d'appeler `now()`, je fixe la graine de l'aléatoire, je ne dépends ni de l'ordre ni des données d'un autre test.
- Un test, un comportement, un nom qui le dit (« refuse un code promo expiré »), et la forme préparer, agir, vérifier.
- J'attends un état, jamais un délai fixe.
- Un <span class="term" data-term="flaky-test">test instable</span> est un bug : je le mets en quarantaine avec un ticket, puis je trouve si le test est faux ou s'il révèle une vraie course dans le code (principes FIRST, cités dans « Clean Code », 2008).

**À relire** : [Test instable](../../knowledge/qualite.md#test-instable-flaky), [Stratégie face à un test instable](../../knowledge/qualite.md#strategie-face-a-un-test-instable), [Données de test](../../knowledge/conception-tests.md#donnees-de-test-builder-object-mother-isolation), [DAMP plutôt que DRY dans les tests](../../knowledge/conception-tests.md#damp-plutot-que-dry-dans-les-tests).

### « La couverture de code est-elle un bon indicateur ? 100 %, c'est suffisant ? »

- La couverture dit quel code a été exécuté, pas quel code a été vérifié.
- Je pose un gate sur le nouveau code seulement, pas un objectif global qui pousse à écrire des tests sans assertion.
- Le mutation testing montre un mutant qui survit malgré 100 % de couverture ; je le réserve au code critique, parce qu'il coûte du temps de calcul.

**À relire** : [Ce qu'elle dit et ce qu'elle ne dit pas](../../knowledge/qualite.md#ce-quelle-dit-et-ce-quelle-ne-dit-pas), [Mutation testing](../../knowledge/qualite.md#mutation-testing-tester-les-tests), [Deux gates suffisent](../../knowledge/qualite.md#deux-gates-suffisent), [Loi de Goodhart](../../knowledge/lois-et-principes.md#loi-de-goodhart).

### « Comment testes-tu un traitement asynchrone sans `sleep` fixe ? »

- J'attends une condition avec un délai maximal, au lieu d'une pause fixe qui est soit trop longue, soit trop courte.
- Je teste aussi le message reçu deux fois et le message qui part en file des messages morts.

**À relire** : [Tester l'asynchrone](../../knowledge/api-rest-async.md#tester-lasynchrone).

## Code existant, refactoring et dette technique

### « Comment modifies-tu un code legacy qui n'a pas de tests ? »

- Je ne réécris pas : je cherche le plus petit endroit à changer et un point d'où observer le comportement.
- Si le code est trop couplé, je crée un <span class="term" data-term="seam">seam</span> minimal, par exemple la dépendance gênante passée en paramètre avec une valeur par défaut.
- J'écris des <span class="term" data-term="characterization-test">tests de caractérisation</span> qui figent ce que le code fait aujourd'hui, même si c'est bizarre.
- Je fais pousser la nouvelle logique dans une fonction testée (Sprout Method), appelée depuis l'ancien code (Michael Feathers, « Working Effectively with Legacy Code », 2004).

**À relire** : [Modifier du code legacy](../../knowledge/principes-conception.md#modifier-du-code-legacy), [Tests de caractérisation et golden master](../../knowledge/conception-tests.md#tests-de-caracterisation-et-golden-master).

### « Quand refactores-tu, et comment le fais-tu sans casser le comportement ? »

- Je refactore au moment où je dois toucher le code : « make the change easy, then make the easy change » (Kent Beck, 2012).
- Je traite les <span class="term" data-term="code-smell">odeurs de code</span> qui gênent ce changement précis, pas toutes celles du fichier.
- Petits pas (renommer, extraire, déplacer), tests lancés après chaque étape, refactorings automatiques de l'IDE.
- Je sépare un commit `refactor:` sans changement de comportement du commit `feat:` ou `fix:` (catalogue de Martin Fowler, « Refactoring », 1999, 2e édition 2018).

**À relire** : [Refactoring en petits pas](../../knowledge/principes-conception.md#refactoring-en-petits-pas), [Extraire au lieu d'empiler](../../knowledge/qualite.md#extraire-au-lieu-dempiler), et l'[exercice 1](exercices.md#exercice-1-refactorer-une-fonction-longue-sans-changer-son-comportement).

### « Tu trouves un bout de code que personne ne comprend : tu le supprimes ? »

- Je cherche d'abord pourquoi il est là : historique Git, ticket lié, appelants.
- Je le retire par étapes réversibles : un log ou une métrique pour voir s'il est appelé, puis la suppression derrière une MR courte.

**À relire** : [Barrière de Chesterton](../../knowledge/lois-et-principes.md#barriere-de-chesterton), [Je cherche qui a écrit une ligne](../../knowledge/git.md#je-cherche-qui-a-ecrit-une-ligne-ou-quand-un-bug-est-apparu).

### « Comment parles-tu de dette technique à ton équipe et au Product Owner ? »

- Je ne dis pas « le code est sale », je dis ce que la <span class="term" data-term="technical-debt">dette technique</span> coûte : « chaque règle de prix prend trois jours au lieu d'un, et deux bugs de calcul ce trimestre » (chiffres d'exemple).
- Je ne parle que de la dette des zones souvent modifiées, les points chauds (Adam Tornhill, 2015).
- Je propose un remboursement par tranches dans les fonctionnalités qui touchent la zone, et je note chaque dette avec son impact dans le backlog (Ward Cunningham, OOPSLA, 1992).

**À relire** : [Dette technique](../../knowledge/principes-conception.md#dette-technique), [Présenter un compromis technique en termes métier](../../knowledge/culture-entreprise.md#presenter-un-compromis-technique-en-termes-metier).

## Revue de code et Git

### « Comment fais-tu une bonne revue de code ? »

- Je lis d'abord la description et le ticket : sans l'intention, je ne peux pas juger si la <span class="term" data-term="merge-request">MR</span> fait bien ce qu'elle veut.
- Dans l'ordre : justesse (cas limites, erreurs, concurrence), tests, sécurité, lisibilité ; le style, je le laisse au lint.
- Je classe chaque remarque (bloquant, suggestion, question, <span class="term" data-term="nit">nit</span>) et je la prouve par `fichier:ligne` et un scénario qui casse.
- Je commente le code, pas la personne, je propose une solution, et je réponds dans la journée (Google Engineering Practices, 2019).

**À relire** : [Revue de code](../../knowledge/qualite.md#revue-de-code), [Prouver chaque remarque](../../knowledge/qualite.md#prouver-chaque-remarque), [Itérer jusqu'à zéro bloquant](../../knowledge/qualite.md#iterer-jusqua-zero-bloquant), [Préparer ma MR et recevoir une revue](../../knowledge/qualite.md#preparer-ma-mr-et-recevoir-une-revue), et l'[exercice 9](exercices.md#exercice-9-revue-de-code-dune-mr-de-developpeur-junior).

### « Comment réagis-tu aux remarques de revue sur ton propre code ? »

- Je rends la revue facile : une MR courte, une description qui dit le pourquoi et comment tester, une relecture de mon propre diff avant de demander un relecteur.
- Si le relecteur n'a pas compris, le prochain lecteur ne comprendra pas : souvent, je clarifie le code au lieu d'expliquer en commentaire.
- Je réponds à chaque remarque ; en désaccord, j'argumente avec un fait, et après deux échanges sans accord, on en parle de vive voix.
- Je ne suis pas mon code (Gerald Weinberg, « The Psychology of Computer Programming », 1971).

**À relire** : [Revue de code](../../knowledge/qualite.md#revue-de-code), [Je veux nettoyer mes commits avant la review](../../knowledge/git.md#je-veux-nettoyer-mes-commits-avant-la-review), [Désaccord et engagement](../../knowledge/culture-entreprise.md#desaccord-et-engagement), [Préparer ma MR et recevoir une revue](../../knowledge/qualite.md#preparer-ma-mr-et-recevoir-une-revue).

### « Quel workflow Git utilises-tu, et comment écris-tu tes commits ? »

- Des branches courtes, de un à trois jours, rebasées souvent sur `main` : c'est proche du <span class="term" data-term="trunk-based-development">trunk-based development</span>.
- Des commits atomiques qui laissent les tests verts, avec des messages <span class="term" data-term="conventional-commits">Conventional Commits</span> (spécification 1.0.0, 2019) et un corps qui explique le pourquoi.
- Je peux nettoyer mes commits locaux, jamais une branche partagée, et je pousse avec `--force-with-lease` plutôt que `--force`.

**À relire** : [J'écris un bon message de commit](../../knowledge/git.md#jecris-un-bon-message-de-commit-conventional-commits-specification-10-de-2019), [Trunk-based development](../../knowledge/livraison.md#trunk-based-development), [Je dois pousser après un rebase](../../knowledge/git.md#je-dois-pousser-apres-un-rebase).

### « Merge ou rebase ? Quelle différence entre `reset` et `revert` ? »

- Je <span class="term" data-term="git-rebase">rebase</span> ma branche quand je suis seul dessus, je merge sur une branche partagée.
- `reset` réécrit l'historique et reste local ; `revert` ajoute un commit inverse, sans danger sur `main`, donc c'est ce que j'utilise pour annuler un commit déjà fusionné.
- Ma règle : tout ce qui réécrit est sans danger sur ma branche seule, et dangereux dès qu'elle est partagée.

**À relire** : [Ma branche est en retard sur main : merge ou rebase ?](../../knowledge/git.md#ma-branche-est-en-retard-sur-main-merge-ou-rebase), [Je me suis trompé : quelle commande ?](../../knowledge/git.md#je-me-suis-trompe-quelle-commande), [J'ai perdu un commit](../../knowledge/git.md#jai-perdu-un-commit-apres-un-reset-ou-un-rebase-rate).

### « Comment résous-tu un conflit, et un conflit dans un lockfile ? »

- Je lis les marqueurs et je rappelle le sens de « ours » et « theirs », qui s'inverse entre merge et rebase.
- Je ne fusionne pas un lockfile à la main : je prends une des deux versions et je le régénère avec le gestionnaire de paquets.

**À relire** : [J'ai un conflit](../../knowledge/git.md#jai-un-conflit), [Manifeste et lockfile](../../knowledge/gestionnaires-paquets.md#manifeste-et-lockfile).

### « Un mot de passe a été poussé dans le dépôt : que fais-tu ? »

- Je change le secret d'abord : il reste dans l'historique et dans tous les clones, même après un commit qui le retire.
- `.gitignore` et `git rm --cached` évitent seulement la suite ; je préviens l'équipe et je vérifie les journaux d'accès.

**À relire** : [Je veux ignorer un fichier](../../knowledge/git.md#je-veux-ignorer-un-fichier), [Les secrets](../../knowledge/securite.md#les-secrets).

## API et bases de données

### « Comment conçois-tu un endpoint REST propre ? »

- Je pars de ce que le client veut faire, pas de mes tables : des ressources au pluriel (`/orders/42`), l'action portée par la méthode HTTP.
- Des <span class="term" data-term="http-status-code">codes HTTP</span> précis : `201` avec `Location`, `404`, `422` pour des données invalides, `409` pour un conflit (RFC 9110, 2022).
- Je valide les entrées à la frontière, je vérifie les droits, et je ne renvoie jamais un objet de base tel quel.
- Je décris le contrat dans un fichier <span class="term" data-term="openapi">OpenAPI</span> (3.1, 2021), et j'ajoute des champs sans en retirer, pour un client Tolerant Reader (Martin Fowler, 2011).

**À relire** : [Ressource et URL](../../knowledge/api-rest-async.md#ressource-et-url), [Les codes de réponse](../../knowledge/api-rest-async.md#les-codes-de-reponse), [OpenAPI](../../knowledge/api-rest-async.md#openapi), [Tolerant Reader](../../knowledge/api-rest-async.md#tolerant-reader-un-client-qui-ne-casse-pas), et l'[exercice 5](exercices.md#exercice-5-concevoir-un-petit-endpoint-rest-avec-erreurs-et-pagination).

### « Quelle différence entre `PUT` et `PATCH` ? Comment rendre un `POST` rejouable sans risque ? »

- `PUT` remplace toute la ressource et est idempotent ; `PATCH` modifie une partie et ne l'est pas forcément.
- Pour un `POST` de paiement, le client envoie une <span class="term" data-term="idempotency-key">clé d'idempotence</span> ; le serveur garde la réponse liée à cette clé et la renvoie si la requête revient.

**À relire** : [Les méthodes HTTP](../../knowledge/api-rest-async.md#les-methodes-http), [Idempotence](../../knowledge/architecture.md#idempotence).

### « Comment renvoies-tu les erreurs et pagines-tu une liste dans une API ? `401` ou `403` ? »

- Un seul format d'erreur, <span class="term" data-term="problem-details">Problem Details</span> (RFC 9457, 2023), avec un `type` stable et la liste des champs en erreur ; jamais de trace d'exception au client.
- `401` quand je ne sais pas qui appelle, `403` quand je le sais mais qu'il n'a pas le droit.
- Je pagine toujours, avec une limite maximale côté serveur ; je passe à la <span class="term" data-term="cursor-pagination">pagination par curseur</span> dès que la liste est grande ou reçoit des insertions en continu.

**À relire** : [Format d'erreur](../../knowledge/api-rest-async.md#format-derreur), [Pagination](../../knowledge/api-rest-async.md#pagination), [Les codes de réponse](../../knowledge/api-rest-async.md#les-codes-de-reponse).

### « Comment fais-tu évoluer une API sans casser ses clients ? »

- J'ajoute sans retirer ; pour une rupture, je fais un expand / contract annoncé par les en-têtes `Deprecation` et `Sunset`, et je monte la version majeure.
- Je pars du principe que tout comportement visible est utilisé : je garde des codes d'erreur stables.

**À relire** : [Versionner](../../knowledge/api-rest-async.md#versionner), [Loi de Hyrum](../../knowledge/lois-et-principes.md#loi-de-hyrum), [Principe de robustesse](../../knowledge/lois-et-principes.md#principe-de-robustesse-loi-de-postel).

### « Comment modélises-tu une table, et comment choisis-tu tes index ? »

- Je modélise le métier, je <span class="term" data-term="db-normalization">normalise</span> par défaut, et je mets les règles dans la base : clé primaire, `NOT NULL`, unicité, <span class="term" data-term="foreign-key">clés étrangères</span>. Le code peut avoir un bug, la contrainte tient toujours.
- J'indexe d'après les requêtes réelles (colonnes du `WHERE`, des jointures, du `ORDER BY`), l'égalité d'abord puis la plage ou le tri dans un index composite (Markus Winand, « SQL Performance Explained », 2012).
- Je vérifie avec le <span class="term" data-term="execution-plan">plan d'exécution</span>, et je n'indexe pas tout : chaque index ralentit les écritures.

**À relire** : [Quand un index aide](../../knowledge/sql.md#quand-un-index-aide), [EXPLAIN](../../knowledge/sql.md#explain), [Index et contraintes sans bloquer](../../knowledge/sql.md#index-et-contraintes-sans-bloquer), [Modéliser une table](../../knowledge/sql.md#modeliser-une-table), [Les formes normales, en clair](../../knowledge/sql.md#les-formes-normales-en-clair), [Les contraintes : la base garde les règles](../../knowledge/sql.md#les-contraintes-la-base-garde-les-regles), [Quand dénormaliser](../../knowledge/sql.md#quand-denormaliser), [Index composite : l'ordre des colonnes et l'index couvrant](../../knowledge/sql.md#index-composite-lordre-des-colonnes-et-lindex-couvrant).

### « Quelle différence entre INNER JOIN et LEFT JOIN ? Comment trouver les clients qui n'ont jamais commandé ? »

- Je donne le nombre de lignes renvoyées sur un petit exemple : `INNER JOIN` garde ce qui existe des deux côtés, `LEFT JOIN` garde toute la table de gauche.
- Pour ce qui manque : `LEFT JOIN ... WHERE o.id IS NULL`.
- Pour les trois dernières commandes de chaque client, une fonction de fenêtre `ROW_NUMBER() OVER (PARTITION BY ...)`.

**À relire** : [Joindre des tables](../../knowledge/sql.md#joindre-des-tables), [Trouver ce qui manque](../../knowledge/sql.md#trouver-ce-qui-manque-left-join-is-null), [Fonctions de fenêtre](../../knowledge/sql.md#fonctions-de-fenetre).

### « Qu'est-ce que le problème N+1, et comment l'évites-tu ? »

- Le <span class="term" data-term="n-plus-one">problème N+1</span> arrive surtout avec un ORM : une boucle sur des commandes qui lit `order.customer` fait une requête par ligne, invisible en local avec dix lignes.
- Je le détecte en comptant les requêtes par page, dans les logs SQL ou l'APM.
- Je le corrige par un <span class="term" data-term="eager-loading">chargement anticipé</span> (jointure, ou seconde requête `IN (...)`), et j'ajoute un test qui vérifie que le nombre de requêtes reste fixe.

**À relire** : [Le problème N+1](../../knowledge/sql.md#le-probleme-n1), [Chargement paresseux ou anticipé](../../knowledge/sql.md#chargement-paresseux-ou-anticipe), et l'[exercice 4](exercices.md#exercice-4-corriger-une-requete-n1).

### « Quand utilises-tu une transaction, et quel niveau d'isolation choisis-tu ? »

- J'ouvre une <span class="term" data-term="db-transaction">transaction</span> dès que plusieurs écritures forment une seule opération métier, et je la garde courte : jamais d'appel HTTP au milieu.
- Je connais le <span class="term" data-term="isolation-level">niveau d'isolation</span> par défaut : `READ COMMITTED` pour PostgreSQL, `REPEATABLE READ` pour MySQL InnoDB.
- Pour une lecture suivie d'une écriture qui en dépend, je protège : `SELECT ... FOR UPDATE`, mise à jour conditionnelle, ou `SERIALIZABLE` avec nouvelle tentative contre l'<span class="term" data-term="write-skew">écriture biaisée</span> (Kleppmann, « Designing Data-Intensive Applications », 2017).

**À relire** : [Ce qu'une transaction garantit (ACID)](../../knowledge/sql.md#ce-quune-transaction-garantit-acid), [Niveaux d'isolation](../../knowledge/sql.md#niveaux-disolation), [Verrou pessimiste](../../knowledge/sql.md#verrou-pessimiste-for-update).

### « Comment renommes-tu une colonne en production sans interruption ? »

- Je déroule expand / contract : ajouter la nouvelle colonne, écrire dans les deux, recopier par lots, lire la nouvelle, puis retirer l'ancienne dans une livraison séparée.
- Chaque étape garde le retour arrière possible, et je pose un `lock_timeout` pour ne pas bloquer la table.

**À relire** : [Expand / contract](../../knowledge/sql.md#expand-contract), [Backfill par lots](../../knowledge/sql.md#backfill-par-lots), [Les verrous : lock_timeout](../../knowledge/sql.md#les-verrous-lock_timeout).

## Concurrence, performance et cache

### « Comment évites-tu une race condition sur une donnée partagée ? Deux personnes réservent la dernière place en même temps. »

- Je cherche le motif lire, décider, écrire (`if stock > 0: stock -= 1`) : c'est la <span class="term" data-term="race-condition">race condition</span> classique.
- Ma première option est une <span class="term" data-term="atomic-operation">opération atomique</span> en base : `UPDATE ... SET stock = stock - 1 WHERE stock > 0`.
- Sinon, je choisis le <span class="term" data-term="optimistic-locking">verrou optimiste</span> (colonne `version`) quand les conflits sont rares, le verrou pessimiste quand ils sont fréquents (Kung et Robinson, 1981).
- Pour « une seule fois », une <span class="term" data-term="unique-constraint">contrainte d'unicité</span>, vraie même avec dix serveurs ; un verrou en mémoire ne protège que son processus. Je le prouve par un test qui lance des appels en parallèle.

**À relire** : [Race condition et mise à jour perdue](../../knowledge/sql.md#race-condition-et-mise-a-jour-perdue), [Verrou optimiste](../../knowledge/sql.md#verrou-optimiste-colonne-version), [Verrou pessimiste](../../knowledge/sql.md#verrou-pessimiste-for-update), [Les contraintes : la base garde les règles](../../knowledge/sql.md#les-contraintes-la-base-garde-les-regles), [Contrainte d'exclusion : pas de créneaux qui se chevauchent](../../knowledge/sql.md#contrainte-dexclusion-pas-de-creneaux-qui-se-chevauchent), et l'[exercice 7](exercices.md#exercice-7-deboguer-un-double-paiement).

### « Comment trouves-tu la cause d'une lenteur dans ton code ? Un export est passé de 10 secondes à 4 minutes. »

- Je définis la lenteur par un chiffre : quel endpoint, quel <span class="term" data-term="p95">p95</span>, depuis quand.
- Je regarde une trace pour voir où part le temps entre code, base et appels externes : le plus souvent, une requête SQL ou un appel réseau.
- Si c'est le code, je lance un <span class="term" data-term="profiler">profileur</span> et je lis le <span class="term" data-term="flame-graph">flame graph</span> (Brendan Gregg, 2011).
- Je corrige une cause à la fois, je remesure, et j'arrête dès que l'objectif est atteint (Knuth, 1974 : optimiser les 3 % critiques, une fois mesurés).

**À relire** : [Trouver la cause d'une lenteur](../../knowledge/observabilite.md#trouver-la-cause-dune-lenteur-profileur-et-flame-graph), [Latence p95](../../knowledge/observabilite.md#latence-p95), [Rendre une requête rapide : la boucle](../../knowledge/sql.md#rendre-une-requete-rapide-la-boucle).

### « Quand ajoutes-tu un cache, et comment l'invalides-tu ? »

- Je mesure d'abord : le <span class="term" data-term="cache-data">cache</span> traite un symptôme, la cause est parfois un index manquant.
- J'utilise le plus souvent <span class="term" data-term="cache-aside">cache-aside</span> : je lis le cache, sinon la source, puis je remplis le cache.
- Je fixe avec le métier la fraîcheur acceptable, je mets toujours un <span class="term" data-term="ttl">TTL</span>, et je supprime l'entrée à l'écriture quand j'en ai la main.
- La clé contient tout ce qui fait varier la réponse (langue, devise, utilisateur pour une donnée personnelle) ; contre la ruée sur une clé populaire, regroupement des requêtes et gigue.

**À relire** : [Où placer un cache](../../knowledge/architecture.md#ou-placer-un-cache), [Lire et écrire avec un cache](../../knowledge/architecture.md#lire-et-ecrire-avec-un-cache), [Invalidation et ruée sur le cache](../../knowledge/architecture.md#invalidation-et-ruee-sur-le-cache), [Cache : Redis](../../knowledge/outils.md#cache-redis), et l'[exercice 6](exercices.md#exercice-6-coder-un-cache-lru).

### « Pourquoi le p95 plutôt que la moyenne ? Quelle différence entre logs, métriques et traces ? »

- La moyenne ne ressemble à aucune requête : 95 requêtes à 50 ms et 5 à 3 s font une moyenne de 200 ms (exemple).
- La métrique montre qu'il y a un problème, la trace où il est, le log pourquoi.

**À relire** : [Latence p95](../../knowledge/observabilite.md#latence-p95), [Les trois signaux](../../knowledge/observabilite.md#les-trois-signaux).

## Sécurité, débogage et production

### « Quels réflexes de sécurité appliques-tu dans ton code au quotidien ? »

- Toute requête SQL est paramétrée, jamais concaténée, contre l'<span class="term" data-term="sql-injection">injection SQL</span>.
- Toute donnée affichée passe par l'échappement du moteur de templates, contre le <span class="term" data-term="xss">XSS</span>.
- Les <span class="term" data-term="secret-credential">secrets</span> viennent de l'environnement ou d'un gestionnaire, jamais du dépôt ni des logs ; les mots de passe sont hachés avec Argon2id ou bcrypt.
- Je laisse la CI faire sa part : analyse des dépendances et <span class="term" data-term="sast">SAST</span> (OWASP Top 10, édition 2021, nouvelle édition à vérifier).

**À relire** : [Injection](../../knowledge/securite.md#injection), [XSS, CSRF, CORS](../../knowledge/securite.md#xss-csrf-cors-les-failles-cote-navigateur), [Les secrets](../../knowledge/securite.md#les-secrets), [Stocker un mot de passe](../../knowledge/securite.md#stocker-un-mot-de-passe), [Sécurité : l'injection SQL](../../knowledge/sql.md#securite-linjection-sql).

### « Comment vérifies-tu les droits d'accès dans ton code ? Qu'est-ce que le BOLA ? »

- L'<span class="term" data-term="authentication">authentification</span> dit qui appelle, l'<span class="term" data-term="authorization">autorisation</span> s'il a le droit de toucher cet objet précis.
- Le <span class="term" data-term="bola">BOLA</span>, premier risque de l'OWASP API Security Top 10 (édition 2023) : `GET /invoices/1234` rend la facture à quiconque change le numéro.
- Je vérifie l'appartenance à chaque requête côté serveur, idéalement dans la requête SQL, dans une couche commune qu'un nouvel endpoint ne peut pas oublier, en refus par défaut.
- Je teste les accès refusés, pas seulement les accès autorisés.

**À relire** : [Les failles les plus courantes des API](../../knowledge/securite.md#les-failles-les-plus-courantes-des-api), [Où appliquer les contrôles](../../knowledge/securite.md#ou-appliquer-les-controles), [Modéliser les droits](../../knowledge/securite.md#modeliser-les-droits-rbac-abac-rebac).

### « Qu'y a-t-il dans un JWT, et que doit vérifier l'API ? »

- Je cite `iss`, `aud`, `exp`, `scope` et la signature : l'API vérifie chacun avant de faire confiance au jeton.
- Un bearer token sert à quiconque le possède : je le garde court et je n'en écris jamais dans les logs.

**À relire** : [JWT](../../knowledge/securite.md#jwt-a-quoi-ressemble-un-jeton), [Bearer token](../../knowledge/securite.md#bearer-token-le-jeton-au-porteur).

### « Comment débogues-tu un bug que tu ne comprends pas, ou que tu ne sais pas reproduire ? »

- Je reproduis d'abord, idéalement par un test qui échoue.
- Je lis l'erreur et la trace en entier, puis je formule une hypothèse et l'expérience qui peut la réfuter, une variable à la fois.
- Si je ne trouve pas, je coupe en deux : la donnée minimale qui déclenche, le commit fautif avec <span class="term" data-term="git-bisect">git bisect</span>.
- Je corrige la cause, je garde le test, et je note ce que j'ai appris (David J. Agans, « Debugging: The 9 Indispensable Rules », 2002).

**À relire** : [Trouver la cause : déboguer méthodiquement](../../knowledge/incidents.md#trouver-la-cause-deboguer-methodiquement), [Je cherche qui a écrit une ligne, ou quand un bug est apparu](../../knowledge/git.md#je-cherche-qui-a-ecrit-une-ligne-ou-quand-un-bug-est-apparu), et l'[exercice 2](exercices.md#exercice-2-corriger-un-bug-a-partir-dun-test-qui-echoue).

### « Ta mise en production casse quelque chose : que fais-tu ? Raconte un incident que tu as géré. »

- Je préviens l'équipe tout de suite et je dis ce que je fais.
- J'atténue d'abord : <span class="term" data-term="rollback">rollback</span> ou désactivation du <span class="term" data-term="feature-flag">feature flag</span>, pas un correctif écrit dans l'urgence.
- Je vérifie avec les métriques que le taux d'erreur revient à la normale, puis je cherche la cause dans les logs et les traces.
- Je corrige avec un test qui reproduit, et j'écris un <span class="term" data-term="postmortem">postmortem</span> court et <span class="term" data-term="blameless">sans reproche</span> (« Site Reliability Engineering », Google, 2016).

**À relire** : [Le cycle de vie d'un incident](../../knowledge/incidents.md#le-cycle-de-vie-dun-incident), [Le postmortem sans recherche de coupable](../../knowledge/incidents.md#le-postmortem-sans-recherche-de-coupable), [Déploiement progressif](../../knowledge/livraison.md#deploiement-progressif), [De l'alerte à la cause](../../knowledge/observabilite.md#de-lalerte-a-la-cause), [Raconter une expérience avec la méthode STAR](../../knowledge/culture-entreprise.md#raconter-une-experience-avec-la-methode-star).

## Organisation du travail, produit et IA

### « Comment estimes-tu et découpes-tu une fonctionnalité ? Pourquoi nos projets dépassent-ils toujours ? »

- Je n'estime pas une demande floue : je pose d'abord les questions qui changent la taille.
- Je découpe en <span class="term" data-term="vertical-slice">tranches verticales</span>, livrables et testables seules (critères INVEST, Bill Wake, 2003).
- Je donne une fourchette par tranche et je nomme les inconnues ; une inconnue trop grosse justifie un spike limité dans le temps.
- Je pars des durées réelles de projets passés plutôt que de la somme des tâches, et je préviens dès qu'une hypothèse tombe.

**À relire** : [Estimer et découper une fonctionnalité](../../knowledge/culture-entreprise.md#estimer-et-decouper-une-fonctionnalite), [Erreur de planification](../../knowledge/lois-et-principes.md#erreur-de-planification), [Loi de Hofstadter](../../knowledge/lois-et-principes.md#loi-de-hofstadter), et l'[exercice 10](exercices.md#exercice-10-estimer-et-decouper-une-fonctionnalite).

### « Comment travailles-tu avec le Product Owner quand une demande te paraît mal posée ? »

- Le <span class="term" data-term="product-owner">PO</span> connaît le besoin mieux que moi, je connais mieux le coût des solutions.
- Je demande le problème derrière la solution : quel utilisateur, quelle situation, qu'est-ce qui le gêne aujourd'hui.
- Je rends la discussion concrète avec des exemples (Example Mapping, Matt Wynne, 2015), je propose des options chiffrées et je laisse le PO décider.
- J'écris les règles retenues en <span class="term" data-term="acceptance-criteria">critères d'acceptation</span>.

**À relire** : [Jobs to be done](../../knowledge/culture-entreprise.md#jobs-to-be-done), [Gherkin avec un « Goal »](../../knowledge/conception-tests.md#gherkin-avec-un-goal), [Estimer et découper une fonctionnalité](../../knowledge/culture-entreprise.md#estimer-et-decouper-une-fonctionnalite).

### « Comment utilises-tu un assistant de code IA de façon responsable ? »

- Je reste l'auteur du code fusionné : je relis chaque ligne proposée comme une MR, et je ne garde pas ce que je ne sais pas expliquer.
- Je vérifie par des tests, idéalement écrits ou relus par moi avant le code généré, parce qu'une <span class="term" data-term="hallucination">hallucination</span> passe bien une relecture rapide.
- Je donne à l'agent une tâche précise et la commande de tests ou de lint pour qu'il boucle jusqu'au vert.
- Aucun secret ni donnée client dans un outil que l'équipe n'a pas validé (OWASP Top 10 for LLM Applications, édition 2025, à vérifier).

**À relire** : [Hallucination](../../knowledge/ia-agents.md#hallucination), [Écrire un bon prompt de tâche](../../knowledge/ia-agents.md#ecrire-un-bon-prompt-de-tache), [Fermer la boucle](../../knowledge/ia-agents.md#fermer-la-boucle-donner-un-moyen-de-verifier), [Assistants de code IA](../../knowledge/devx.md#assistants-de-code-ia).

### « Comment fais-tu ta veille technique ? Quelles sources suis-tu ? »

- Un créneau fixe et court, trois sources que je lis vraiment, une ligne de trace par sujet retenu.
- J'essaie une chose par mois sur un vrai cas et je partage avec l'équipe.

**À relire** : [Pourquoi, quand et comment](../../knowledge/veille.md#pourquoi-quand-et-comment), [Développeur](../../knowledge/veille.md#developpeur).

## Conception de système et questions comportementales

### « Comment concevrais-tu un raccourcisseur d'URL ? Comment abordes-tu un exercice de system design ? »

- Je clarifie : liens créés par jour, clics, expiration, statistiques.
- Je fais un <span class="term" data-term="back-of-envelope">calcul de coin de table</span> : 1 million de liens par jour et 100 clics par lien, c'est un service lu cent fois plus qu'il n'est écrit (exemple).
- Conception simple : `POST /links`, `GET /{code}` qui renvoie une <span class="term" data-term="http-redirect">redirection</span> ; un identifiant unique encodé en <span class="term" data-term="base62">base62</span> (7 caractères, environ 3 500 milliards de codes) ; un cache devant la base.
- Je finis par les limites : abus, énumération des codes, <span class="term" data-term="rate-limit">limitation de débit</span> à la création (Alex Xu, « System Design Interview », 2020).

**À relire** : [Estimer la capacité](../../knowledge/architecture.md#estimer-la-capacite), [QPS moyen et pic](../../knowledge/architecture.md#qps-moyen-et-pic), [Les codes de réponse](../../knowledge/api-rest-async.md#les-codes-de-reponse), [Où placer un cache](../../knowledge/architecture.md#ou-placer-un-cache), [Exemple : un raccourcisseur d'URL](../../knowledge/architecture.md#exemple-un-raccourcisseur-durl).

### « Conçois un limiteur de débit pour une API ouverte à des partenaires. »

- Je compare fenêtre fixe, fenêtre glissante et seau à jetons.
- Avec plusieurs instances, je partage le compteur dans Redis (`INCR` atomique et expiration).
- Je renvoie `429` avec `Retry-After`, et je vérifie d'abord si la passerelle d'API ne le fait pas déjà.

**À relire** : [Limitation de débit](../../knowledge/architecture.md#limitation-de-debit), [Passerelle d'API](../../knowledge/outils.md#passerelle-dapi-krakend-nginx), [Isolation multi-locataires et voisin bruyant](../../knowledge/architecture.md#isolation-multi-locataires-et-voisin-bruyant), et l'[exercice 8](exercices.md#exercice-8-conception-un-limiteur-de-debit-pour-une-api).

### « Un service dont tu dépends devient lent : que fais-tu ? Comment éviter qu'un retry débite deux fois ? »

- J'empile un timeout, un retry avec backoff et gigue, un disjoncteur, et une dégradation contrôlée.
- Un retry n'est sûr que si l'appel est idempotent : clé d'idempotence côté appelé.

**À relire** : [Résilience](../../knowledge/architecture.md#resilience), [Retry, backoff exponentiel et gigue](../../knowledge/architecture.md#retry-backoff-exponentiel-et-gigue), [Idempotence](../../knowledge/architecture.md#idempotence), [Simuler un tiers en erreur ou lent](../../knowledge/qualite.md#simuler-un-tiers-en-erreur-ou-lent).

### « Raconte une erreur que tu as faite, et ce que tu en as tiré. »

- Je choisis une vraie erreur, avec un impact réel mais maîtrisé, pas un faux défaut.
- Je la raconte avec la <span class="term" data-term="star-method">méthode STAR</span>, en disant « j'ai » et non « on a ».
- Je passe peu de temps sur l'erreur, plus sur la détection, la correction et ce que j'ai changé ensuite (un test, une checklist, une habitude).

**À relire** : [Le postmortem sans recherche de coupable](../../knowledge/incidents.md#le-postmortem-sans-recherche-de-coupable), [Culture de l'apprentissage](../../knowledge/culture-entreprise.md#culture-de-lapprentissage), [Raconter une expérience avec la méthode STAR](../../knowledge/culture-entreprise.md#raconter-une-experience-avec-la-methode-star).

### « Raconte un désaccord technique avec un collègue, et comment il s'est résolu. »

- Je reformule la position de mon collègue jusqu'à ce qu'il soit d'accord avec ma reformulation.
- On s'accorde sur les <span class="term" data-term="decision-criteria">critères de décision</span> avant les options, puis on cherche un fait : un prototype, une mesure, un test (« Getting to Yes », Fisher et Ury, 1981).
- Si les faits ne tranchent pas, l'équipe ou le lead décide, et je m'engage dans la décision (disagree and commit).

**À relire** : [Désaccord et engagement](../../knowledge/culture-entreprise.md#desaccord-et-engagement), [Décisions de type 1 et de type 2](../../knowledge/culture-entreprise.md#decisions-de-type-1-et-de-type-2), [Sécurité psychologique](../../knowledge/culture-entreprise.md#securite-psychologique), [Raconter une expérience avec la méthode STAR](../../knowledge/culture-entreprise.md#raconter-une-experience-avec-la-methode-star).

### « Comment apprends-tu une nouvelle technologie, ou un code que tu ne connais pas ? »

- Je pars d'un objectif concret : je suis une fonctionnalité simple du point d'entrée à la base, avec un débogueur ou des logs.
- Pour une bibliothèque, j'écris des <span class="term" data-term="learning-test">tests d'apprentissage</span> (cités dans « Clean Code », 2008) qui me préviendront si une mise à jour change son comportement.
- Je note ce qui m'a surpris et je l'ajoute à la documentation du projet, et je pose mes questions tôt.

**À relire** : [Onboarding](../../knowledge/devx.md#onboarding), [Documentation](../../knowledge/devx.md#documentation), [Apprendre un code ou une bibliothèque inconnus](../../knowledge/devx.md#apprendre-un-code-ou-une-bibliotheque-inconnus).

### « Quel livre ou quel article technique t'a le plus marqué ? »

- Je choisis un texte que j'ai vraiment lu, je cite l'auteur et l'année, et une idée précise qui a changé ma façon de travailler.

**À relire** : [Par où commencer](../../knowledge/textes-fondateurs.md#par-ou-commencer).

## Choix d'outils

### « ORM ou SQL écrit à la main : comment choisis-tu ? Active Record ou Data Mapper ? »

- L'<span class="term" data-term="orm">ORM</span> pour le CRUD courant ; le SQL paramétré pour le reporting, les agrégations et les requêtes critiques, dont je lis le plan.
- J'active les logs SQL en développement : un ORM qu'on ne regarde jamais finit par générer des N+1.
- Active Record : l'objet s'enregistre lui-même ; Data Mapper : une session enregistre un objet qui ignore la base (Martin Fowler, 2002).
- Ce qui compte, c'est une règle d'équipe claire pour savoir quand passer au SQL.

**À relire** : [ORM, query builder ou SQL écrit à la main](../../knowledge/sql.md#orm-query-builder-ou-sql-ecrit-a-la-main), [Active Record ou Data Mapper](../../knowledge/sql.md#active-record-ou-data-mapper), [Repository](../../knowledge/design-patterns.md#repository-depot).

### « Feature flag ou branche longue : comment livres-tu une fonctionnalité qui prend trois semaines ? »

- Je fusionne chaque jour du code désactivé derrière un flag plutôt que garder une <span class="term" data-term="long-lived-branch">branche longue</span>, qui accumule les conflits et cache les problèmes d'intégration.
- J'active pour l'équipe, puis pour une partie des utilisateurs, et je peux éteindre en une seconde.
- Je teste les deux positions du flag, et je crée le ticket de retrait en même temps que le flag (Pete Hodgson, « Feature Toggles », 2017).

**À relire** : [Trunk-based development](../../knowledge/livraison.md#trunk-based-development), [Séparer déployer et activer](../../knowledge/architecture.md#separer-deployer-et-activer), [Feature flags : Unleash](../../knowledge/outils.md#feature-flags-unleash), [OpenFeature : changer d'outil de flags sans toucher au code](../../knowledge/outils.md#openfeature-changer-doutil-de-flags-sans-toucher-au-code).

### « Comment choisis-tu une bibliothèque externe à ajouter au projet ? À quoi sert un lockfile ? »

- Je me demande si la <span class="term" data-term="dependency-software">dépendance</span> vaut son coût : pour trois lignes de code, non.
- Je regarde sa santé (versions, mainteneurs, vitesse de correction des failles, OpenSSF Scorecard, lancé en 2020), sa licence et ses <span class="term" data-term="transitive-dependency">dépendances transitives</span>.
- Si elle est au cœur du métier, je l'enveloppe dans un adaptateur à moi.
- Je fixe la version dans le <span class="term" data-term="lockfile">lockfile</span> (le manifeste dit ce que j'accepte, le lockfile ce qui a été choisi) et un robot comme Renovate propose les mises à jour.

**À relire** : [Choisir une dépendance](../../knowledge/securite.md#choisir-une-dependance), [Manifeste et lockfile](../../knowledge/gestionnaires-paquets.md#manifeste-et-lockfile), [Versions et plages](../../knowledge/gestionnaires-paquets.md#versions-et-plages), [Mettre à jour les dépendances](../../knowledge/gestionnaires-paquets.md#mettre-a-jour-les-dependances).

## Critères éliminatoires

Ces questions testent le jugement plus que la technique. Une réponse de principe, dans un sens ou dans l'autre, élimine.

| Question du recruteur | À éviter | Ce que je réponds | À relire |
|---|---|---|---|
| « Livrerais-tu sans tests pour tenir une date ? » | « Oui, on testera plus tard », ou « jamais, la qualité n'est pas négociable », sans regarder le contexte. | Je pars du risque : je garde les tests qui protègent l'argent et les données, quitte à réduire le <span class="term" data-term="feature-scope">périmètre</span> ; un raccourci sur le reste est écrit, visible et suivi d'un ticket, et le PO connaît le compromis. | [Test basé sur les risques](../../knowledge/conception-tests.md#test-base-sur-les-risques), [Dette technique](../../knowledge/principes-conception.md#dette-technique) |
| « Un collègue a cassé la production : comment en parles-tu ? » | Nommer et blâmer la personne en public, ou dire « ça ne serait pas arrivé avec moi ». | Je parle du système : si une MR a pu casser la production, plusieurs filets ont manqué. J'aide à rétablir, puis je participe au postmortem ; en privé, je rappelle que tout le monde l'a fait un jour. | [Le postmortem sans recherche de coupable](../../knowledge/incidents.md#le-postmortem-sans-recherche-de-coupable), [Culture juste](../../knowledge/culture-entreprise.md#culture-juste) |
| « Que penses-tu du code que tu as écrit il y a deux ans ? » | « Il est très bien, je le referais pareil », ou « il est horrible » sans dire pourquoi. | Je cite un ou deux points concrets que je ferais autrement (tests trop liés à l'implémentation, abstraction trop tôt), puis ce qui m'a fait changer : une revue, un incident, un livre. | [Culture de l'apprentissage](../../knowledge/culture-entreprise.md#culture-de-lapprentissage), [YAGNI et règle de trois](../../knowledge/principes-conception.md#yagni-et-regle-de-trois) |

## Les 3 choses qu'un Software Engineer fait en permanence

1. **Écrire du code que les autres peuvent lire, tester et modifier** : je nomme selon l'intention, je sépare la logique pure des effets de bord, et je laisse des tests qui documentent les règles.
2. **Vérifier par des faits plutôt que supposer** : je reproduis un bug par un test avant de le corriger, je mesure avant d'optimiser, je lis le plan d'exécution avant d'ajouter un index, et je relis le code généré par un assistant comme celui d'un collègue.
3. **Prendre la responsabilité de mon code jusqu'en production** : je pense aux erreurs, à la concurrence, à la sécurité et au retour arrière avant de livrer, je surveille ma mise en production, et je réagis vite et calmement quand quelque chose casse. Par exemple, une migration rétrocompatible garde le rollback possible, et je regarde les métriques dans l'heure qui suit le déploiement.

## Structure simple pour répondre à l'oral

Pour presque toutes les questions, je suis ce fil, proche de la méthode STAR (situation, tâche, action, résultat) :

1. **Clarifier** : quel est le besoin, quelles contraintes (volume, délai, risque) ?
2. **Proposer simple** : la solution la plus simple qui répond au besoin.
3. **Vérifier** : comment je prouve qu'elle marche (tests, mesure, revue).
4. **Limites** : cas limites, erreurs, concurrence, sécurité.
5. **Livrer** : comment je la mets en production sans risque (petites MR, flag, rollback).
6. **Résultat** : ce qui a changé, chiffre à l'appui.
7. **Apprendre** : ce que je referais autrement, ce que l'équipe garde.

Je privilégie les exemples que j'ai vécus. Quand je n'ai pas vécu un cas, je le présente comme hypothétique et j'explique mon raisonnement : un recruteur préfère une méthode honnête à une histoire inventée.

## Mesurer le succès

Ma préparation marche quand je réponds juste et vite, avec une histoire vécue, pas quand j'ai lu toutes les pages. Avant de commencer, je note une base : sur une simulation d'entretien de 45 minutes avec un collègue, combien de questions de cette page je traite en moins de deux minutes avec un exemple concret. Je refais la même simulation, avec d'autres questions tirées au hasard, deux semaines plus tard. La métrique garde-fou est la justesse : une réponse rapide mais fausse, ou une histoire inventée, compte comme un échec.

| Solution | Indicateur de succès (<span class="term" data-term="sli">SLI</span>) | <span class="term" data-term="slo">SLO</span> probable | <span class="term" data-term="sla">SLA</span> probable |
|---|---|---|---|
| plan de réponse appris pour chaque question | part des questions tirées au hasard auxquelles je réponds en moins de deux minutes | au moins 8 questions sur 10 | sans objet : pas de contrat externe |
| une histoire vécue par thème | nombre de thèmes pour lesquels j'ai une histoire avec un résultat chiffré | 11 thèmes sur 11 | sans objet : pas de contrat externe |
| exercices en direct chronométrés | part des exercices terminés et testés dans le temps imparti (20 à 40 minutes) | au moins 3 exercices sur 4 | sans objet : pas de contrat externe |
| relecture des sections À relire | part des notions citées dans mes réponses que je sais définir avec un exemple | 100 % des notions que je cite, puisqu'une notion citée sans la comprendre se voit à la question suivante | sans objet : pas de contrat externe |
| simulations d'entretien avec un pair | nombre de remarques « réponse apprise, pas vécue » par simulation | au plus une par simulation | sans objet : pas de contrat externe |

[À prendre avec précaution : ordres de grandeur d'exemple, à adapter au poste visé et au temps disponible]

## Pièges à éviter

| Piège | Ce qui se passe | Solution |
|---|---|---|
| **Réciter la définition** : je donne les cinq lettres de SOLID sans exemple. | Le recruteur voit une réponse apprise et creuse jusqu'à ce que je bloque. | Je donne le symptôme, un exemple vécu, puis le cas où le principe ne s'applique pas ([SOLID](../../knowledge/principes-conception.md#solid)). |
| **Dire « on »** : je raconte ce que l'équipe a fait. | Le recruteur ne sait pas ce que j'ai fait moi-même. | Je dis « j'ai », avec mon action et son résultat ([Structure simple pour répondre à l'oral](#structure-simple-pour-repondre-a-loral)). |
| **Coder tout de suite** : je fonce sur l'exercice sans poser de question. | Je résous un autre problème que celui posé, ou j'oublie un cas limite. | Je pose deux ou trois questions et j'écris un exemple ou un test d'abord ([exercices](exercices.md)). |
| **Optimiser avant de mesurer** : je propose un cache dès qu'on parle de lenteur. | Je traite un symptôme, et la vraie cause (un index manquant, un N+1) reste. | Je mesure, je trouve la cause, puis je corrige une chose à la fois ([Trouver la cause d'une lenteur](../../knowledge/observabilite.md#trouver-la-cause-dune-lenteur-profileur-et-flame-graph)). |
| **Répondre par principe** : « jamais sans tests », « toujours des microservices ». | Je montre que je ne sais pas peser un compromis. | Je donne mes critères, puis ce que je choisirais dans le cas posé ([Critères éliminatoires](#criteres-eliminatoires)). |
| **Inventer une histoire** : je présente un cas hypothétique comme vécu. | Une question de détail suffit à la faire tomber, et la confiance avec. | Je dis que le cas est hypothétique et j'explique mon raisonnement. |
| **Blâmer quelqu'un** : je raconte un incident en accusant un collègue. | Le recruteur imagine comment je parlerai de lui. | Je parle du système qui a permis l'erreur et de ce qui a changé ensuite ([Le postmortem sans recherche de coupable](../../knowledge/incidents.md#le-postmortem-sans-recherche-de-coupable)). |
