# Staff Engineer : exercices en direct

!!! warning "Avertissement"
    Ces notes sont des pense-bêtes personnels, pas une source de vérité. Elles reflètent ma compréhension et mes choix : leur contenu reste subjectif, malgré les citations et les références qu'il contient. Il peut être incomplet, simplifié, inexact ou dépassé. Vérifiez toujours dans la documentation officielle avant de l'appliquer. Ce contenu est fourni tel quel, sans aucune garantie : son utilisation se fait sous votre seule responsabilité.

!!! audience "Pour qui, pour quoi"
    - **Métiers** : développeur senior qui vise un poste Staff, Staff ou Principal Engineer, tech lead, architecte logiciel, ingénieur qualité ou plateforme.
    - **Usages** : je m'entraîne à voix haute sur une revue de code avant un entretien technique ; on me donne quarante minutes pour concevoir une stratégie de tests et je veux un corrigé pour comparer ; je prépare une étude de cas comme « l'équipe QA est un goulot d'étranglement » ; je révise l'idempotence d'un `POST /orders` avec du code à montrer.

Ces exercices pratiques ont des corrigés détaillés. Ils complètent la page [Entretien Staff Engineer : les questions](questions.md). Il n'existe pas une réponse unique : ce sont des **réponses de référence concrètes**, avec du code, des décisions d'architecture, des critères de choix et une formulation orale.

Le poste demande surtout de faire progresser plusieurs équipes : architecture, qualité, outillage, fiabilité, mesure et influence transverse. Les exercices couvrent donc du code, mais aussi des arbitrages et des études de cas. Chaque exercice finit par une ligne **À relire** vers les sections de Knowledge qui expliquent les notions utilisées.

## Comment utiliser ce document

En entretien en direct, l'intervieweur regarde surtout **comment** je cherche, pas seulement ce que je trouve. Pour chaque exercice :

1. Je lis l'énoncé sans regarder le corrigé.
2. **Je pose deux ou trois questions avant de répondre** : « combien d'équipes ? », « quel volume ? », « qu'est-ce qui est déjà en place ? ». Je montre ainsi que je ne plaque pas une solution toute faite.
3. **Je pense à voix haute** : j'explique mon raisonnement avant de proposer une solution, puis je dis ce que je vérifie et pourquoi, même pendant que j'écris du code.
4. Je donne une solution simple, puis je précise ses limites et les évolutions possibles.
5. J'explicite les compromis : coût, risque, complexité opérationnelle et adoption par les équipes.
6. **Je termine par un exemple vécu** : « dans un poste précédent, j'ai eu un cas proche... ». Les corrigés sont théoriques, c'est l'expérience qui fait la différence.

Les exemples de code sont volontairement petits pour être réalisables en entretien. Ils illustrent le raisonnement attendu, pas une architecture complète de production. Ils sont en PHP ; les exercices 1 et 4 ont aussi une version Python, pour pouvoir répondre dans l'un ou l'autre langage.

---

## Exercice 1. Revue de code : fiabilité, sécurité et maintenabilité

### Énoncé

L'intervieweur me montre cette fonction PHP :

``` { .php .ex-bad title="À éviter · fonction à revoir" }
// À éviter : requête construite par concaténation, contrat de retour flou
function getUser(PDO $db, $id) {
    $sql = "SELECT * FROM users WHERE id = " . $id;
    $result = $db->query($sql);
    return $result->fetch();
}
```

« Identifie les problèmes, propose une version corrigée et explique ce que
tu vérifierais dans les tests. »

### Corrigé attendu

#### Problèmes à relever

-   **<span class="term" data-term="sql-injection">Injection SQL</span>** : la valeur de `$id` est concaténée dans la
    requête.
-   **Contrat imprécis** : on ne sait pas si `$id` doit être un entier
    positif, ni ce qui est retourné si l'utilisateur n'existe pas.
-   **`SELECT *`** : récupère potentiellement des colonnes inutiles et
    rend le contrat dépendant du schéma.
-   **Gestion des erreurs** : le comportement dépend de la configuration
    PDO et aucune convention n'est explicitée.
-   **Typage insuffisant** : les types d'entrée et de sortie ne sont pas
    documentés.
-   **Responsabilités** : la fonction mélange accès aux données et
    absence de politique explicite sur les erreurs.

#### Proposition corrigée

``` { .php .ex-good title="Recommandé" }
<?php

declare(strict_types=1);

// Bien : requête préparée, typage strict, contrat de retour explicite
function getUser(PDO $db, int $id): ?array
{
    if ($id <= 0) {
        throw new InvalidArgumentException('User ID must be positive.');
    }

    $statement = $db->prepare(
        'SELECT id, email, display_name FROM users WHERE id = :id'
    );
    $statement->execute(['id' => $id]);

    $user = $statement->fetch(PDO::FETCH_ASSOC);

    return $user === false ? null : $user;
}
```

Cette version suppose que le contrat retenu est : identifiant positif,
`null` si aucun utilisateur n'existe, exception en cas d'erreur de base
de données. Une autre convention peut être acceptable si elle est
cohérente dans l'application.

La ligne `declare(strict_types=1);` est indispensable : sans elle, le
type `int $id` ne protège pas complètement. PHP convertit une chaîne
comme `"1 OR 1=1"` en `1` (avec un simple avertissement) au lieu de la
refuser. Avec elle, PHP lève une `TypeError`. Ce mode s'applique aux
appels écrits dans le fichier qui le déclare : il doit donc aussi figurer
dans les fichiers qui appellent `getUser`. Le plus simple est d'en faire
une règle du projet, vérifiée automatiquement.

Version Python équivalente. Les annotations de type Python ne sont pas
vérifiées à l'exécution : le contrôle `isinstance` joue le rôle de
`strict_types`, et mypy signale l'erreur avant même l'exécution.

``` { .python .ex-good title="Recommandé · version Python" }
import sqlite3
from typing import TypedDict


# Exemple : le type renvoyé, une ligne de la table users
class User(TypedDict):
    id: int
    email: str
    display_name: str


# Bien : type vérifié à l'exécution, requête paramétrée, None si absent
def get_user(db: sqlite3.Connection, user_id: int) -> User | None:
    if not isinstance(user_id, int):
        raise TypeError("User ID must be an int.")
    if user_id <= 0:
        raise ValueError("User ID must be positive.")

    row = db.execute(
        "SELECT id, email, display_name FROM users WHERE id = :id",
        {"id": user_id},
    ).fetchone()

    if row is None:
        return None
    return User(id=row[0], email=row[1], display_name=row[2])
```

#### Tests à prévoir

1.  Un identifiant existant retourne les champs attendus.
2.  Un identifiant inexistant retourne `null`.
3.  Un identifiant nul ou négatif déclenche `InvalidArgumentException`.
4.  Une chaîne hostile comme `"1 OR 1=1"` déclenche une `TypeError` :
    elle n'atteint jamais la requête, dont la structure reste intacte.
5.  Une erreur de base de données remonte selon la convention d'erreur
    du projet.

Exemples de <span class="term" data-term="integration-test">tests d'intégration</span> (le schéma de test et la configuration
PDO sont à adapter au projet ; le fichier de test déclare lui aussi
`strict_types`) :

``` { .php .ex-good title="Recommandé · tests d'intégration" }
// Bien : un utilisateur absent donne null
public function testReturnsNullWhenUserDoesNotExist(): void
{
    $user = getUser($this->pdo, 999999);

    self::assertNull($user);
}

// Bien : une chaîne hostile est refusée avant la requête
public function testRejectsHostileStringId(): void
{
    $this->expectException(TypeError::class);

    getUser($this->pdo, '1 OR 1=1');
}
```

#### Ce qu'un Staff Engineer doit ajouter

-   Ne pas s'arrêter à la correction locale : chercher le même motif
    dans tous les dépôts (une requête SQL construite avec `.` et une
    variable).
-   Ajouter une <span class="term" data-term="lint-rule">règle d'analyse automatique</span> (Semgrep, un outil qui
    repère des motifs de code, ou SonarQube) qui bloque ce motif dans les
    nouvelles <span class="term" data-term="merge-request">MR</span>. Corriger une fonction règle un bug ; la règle empêche
    les suivants.
-   Documenter le motif sécurisé et faciliter son adoption via des
    exemples, des helpers ou des standards.
-   Éviter d'imposer une abstraction générique si une <span class="term" data-term="prepared-statement">requête préparée</span>
    suffit.

#### Réponse orale possible

> « Je corrige d'abord l'injection SQL avec une requête préparée,
> j'active le typage strict et je clarifie le contrat de retour.
> Ensuite, je cherche le même motif dans tous les dépôts. S'il revient,
> j'ajoute une règle d'analyse automatique qui le bloque dans les
> nouvelles MR, plutôt qu'une simple consigne dans la documentation. »

**À relire** : [SQL : Sécurité : l'injection SQL](../../knowledge/sql.md#securite-linjection-sql), [Qualité : Règles de code qui évitent des défauts](../../knowledge/qualite.md#regles-de-code-qui-evitent-des-defauts), [Qualité : Revue de code](../../knowledge/qualite.md#revue-de-code), [Livraison : Contrôles automatiques avant la fusion](../../knowledge/livraison.md#controles-automatiques-avant-la-fusion)

---

## Exercice 2. Concevoir une stratégie de tests pour une API

### Énoncé

Une API permet de créer une commande. Elle vérifie le panier, calcule le
total, débite le stock et demande un paiement. Les équipes se plaignent
que la suite de tests est lente et fragile. « Propose une stratégie de
tests. »

### Corrigé attendu

#### 1. Chiffrer le problème

Première question : « lente et fragile, c'est combien ? » Sans chiffres
de départ, on ne pourra pas dire si la nouvelle stratégie est meilleure.
Par exemple : la suite dure 40 minutes et 1 run sur 5 échoue sans
changement de code.

#### 2. Identifier les scénarios critiques

Avant de choisir les niveaux de test, lister avec le produit ce qui ne
doit pas casser, puis classer chaque scénario selon son impact et la
probabilité d'un défaut. Les premiers de la liste reçoivent le plus
d'effort.

-   Création valide : commande enregistrée et total correct.
-   Stock insuffisant : commande refusée, aucun débit de stock partiel.
-   Paiement refusé : état cohérent et stock libéré selon les règles
    métier.
-   Erreur de base de données : transaction annulée quand c'est
    possible. Ce scénario se teste avec une vraie base jetable
    (Testcontainers, un outil qui démarre la base dans un conteneur le
    temps du test) qu'on arrête en plein test, plutôt qu'avec un faux
    objet qui simule l'erreur.
-   Requête répétée : pas de double commande ni de double paiement si
    une <span class="term" data-term="idempotency-key">clé d'idempotence</span> est prévue.
-   Entrées invalides : réponse 4xx stable et documentée.

#### 3. Placer chaque scénario au bon niveau de test

| Niveau | Ce qu'on vérifie | Exemples |
|--------|------------------|----------|
| <span class="term" data-term="unit-test">Tests unitaires</span> | Règles déterministes sans infrastructure réelle | calcul du total, remises, règles métier |
| Tests d'intégration | Interaction avec une vraie dépendance contrôlée | persistance SQL, transaction, mapping ORM |
| <span class="term" data-term="contract-test">Tests de contrat</span> | Compatibilité entre consommateurs et fournisseurs | schéma de requête/réponse, codes d'erreur |
| Tests de parcours | Quelques scénarios métier critiques de bout en bout | création de commande complète avec dépendances de test |

Ne pas chercher à tout tester en bout en bout. Ils sont utiles pour
vérifier que les composants fonctionnent ensemble, mais coûteux et plus
fragiles.

Chaque scénario de l'étape 2 va au niveau le plus bas qui le protège :
le calcul du total en unitaire, le stock non débité en intégration, la
création complète en parcours.

#### 4. Exemple de test unitaire du calcul

``` { .php .ex-good title="Recommandé · calcul du total" }
// Bien : montants en centimes entiers, entrées invalides refusées
final class OrderTotal
{
    public static function calculate(array $items): int
    {
        $total = 0;

        foreach ($items as $item) {
            if ($item['quantity'] <= 0 || $item['unit_price_cents'] < 0) {
                throw new InvalidArgumentException('Invalid order item.');
            }

            $total += $item['quantity'] * $item['unit_price_cents'];
        }

        return $total;
    }
}
```

``` { .php .ex-good title="Recommandé · test unitaire" }
// Bien : un test rapide, sans base ni réseau, sur la règle de calcul
public function testCalculatesTotalInCents(): void
{
    $total = OrderTotal::calculate([
        ['quantity' => 2, 'unit_price_cents' => 1250],
        ['quantity' => 1, 'unit_price_cents' => 500],
    ]);

    self::assertSame(3000, $total);
}
```

Les montants sont stockés en unités monétaires mineures (centimes ici)
pour éviter les erreurs d'arrondi liées aux flottants.

#### 5. Réduire la fragilité

-   Mettre tout de suite en quarantaine les <span class="term" data-term="flaky-test">tests instables</span> existants :
    ils ne bloquent plus les MR, mais chacun a un ticket et un
    responsable. L'équipe retrouve confiance dans le pipeline pendant
    qu'on les répare.
-   Remplacer les attentes sur des détails d'implémentation par des
    assertions sur le comportement observable.
-   Utiliser des données de test explicites et isolées.
-   Éviter les dépendances à l'ordre d'exécution.
-   Contrôler l'horloge, l'aléatoire et les appels externes.
-   Réserver les appels réels aux services tiers à des tests dédiés, pas
    à toute la suite.
-   Mesurer durée et taux d'échec intermittent avant de supprimer ou
    déplacer des tests.

#### 6. Mesurer le succès

-   Temps total et temps au 95e percentile de la suite.
-   Taux de tests intermittents.
-   Temps de retour du pipeline après une modification.
-   <span class="term" data-term="escaped-defect">Défauts échappés</span> en production et incidents liés aux parcours
    critiques.

Ces mesures se comparent aux chiffres de départ, avec des cibles
concrètes : par exemple un retour en moins de 10 minutes sur une MR et
moins de 1 % de tests instables.

La <span class="term" data-term="code-coverage">couverture de code</span> est un signal, pas un objectif suffisant : une
ligne exécutée ne garantit pas une assertion pertinente.

#### Réponse orale possible

> « Je commencerais par chiffrer le problème : durée de la suite et
> taux d'échec sans changement de code. Ensuite, j'identifierais avec le
> produit les scénarios critiques, je les classerais selon leur impact,
> et je placerais chacun au niveau de test le moins coûteux qui apporte
> une confiance suffisante. Je mettrais les tests
> instables en quarantaine, chacun avec un ticket et un responsable,
> pour que le pipeline redevienne fiable pendant qu'on les répare. Je ne
> supprimerais pas des tests simplement parce qu'ils sont lents : je
> mesurerais leur valeur, leur fragilité et leur coût, puis je
> déplacerais les scénarios vers des tests plus ciblés quand c'est
> possible. »

**À relire** : [Concevoir les tests : Test basé sur les risques](../../knowledge/conception-tests.md#test-base-sur-les-risques), [Qualité : Choisir le bon niveau de test](../../knowledge/qualite.md#choisir-le-bon-niveau-de-test), [Qualité : Tests d'intégration avec Testcontainers](../../knowledge/qualite.md#tests-dintegration-avec-testcontainers), [Qualité : Stratégie face à un test instable](../../knowledge/qualite.md#strategie-face-a-un-test-instable), [Qualité : L'argent en centimes entiers](../../knowledge/qualite.md#largent-en-centimes-entiers), [Qualité : Simuler un tiers en erreur ou lent](../../knowledge/qualite.md#simuler-un-tiers-en-erreur-ou-lent)

---

## Exercice 3. Concevoir une CI utile plutôt qu'une CI interminable

### Énoncé

Le pipeline GitLab dure 25 minutes. Les développeurs attendent souvent
le résultat pour fusionner une <span class="term" data-term="merge-request">MR</span>. « Propose une évolution progressive. »

### Corrigé attendu

#### Étape 1 : mesurer avant de réorganiser

Collecter sur une période représentative :

- durée par <span class="term" data-term="ci-job">job</span> et durée totale ;
- temps d'attente dans les files ;
- taux d'échec par job ;
- taux de relance et de <span class="term" data-term="flaky-test">tests intermittents</span> ;
- durée entre ouverture de MR et premier retour fiable ;
- fréquence des échecs détectés seulement après fusion.

#### Étape 2 : séparer feedback rapide et validations plus coûteuses

Exemple conceptuel de `.gitlab-ci.yml` :

``` { .yaml .ex-good title="Recommandé · .gitlab-ci.yml (illustratif)" }
stages:
  - validate
  - test
  - package

# Bien : annuler les pipelines dépassés, cacher les dépendances selon le lockfile
default:
  interruptible: true
  cache:
    key:
      files: [composer.lock]
    paths: [vendor/]

# Bien : le contrôle le plus rapide d'abord
lint:
  stage: validate
  script:
    - composer validate --strict
    - vendor/bin/phpcs

# Bien : démarre dès que lint a fini, grâce à needs
unit_tests:
  stage: test
  needs: [lint]
  script:
    - vendor/bin/phpunit --testsuite unit

# Bien : ne tourne que si la MR touche le code ou les dépendances
integration_tests:
  stage: test
  needs: [lint]
  rules:
    - changes:
        - src/**/*
        - tests/integration/**/*
        - composer.lock
  script:
    - vendor/bin/phpunit --testsuite integration

# Exemple : l'image n'est construite qu'après les tests
build:
  stage: package
  script:
    - docker build -t app:$CI_COMMIT_SHA .
```

Les jobs d'un même <span class="term" data-term="ci-stage">stage</span> peuvent s'exécuter en parallèle si les runners
et les dépendances le permettent. Mais avec des `stages` seuls, un stage
attend que **tout** le stage précédent soit fini. Quatre réglages GitLab
font gagner du temps sans retirer aucun contrôle :

- `needs` : le job démarre dès que `lint` est fini, sans attendre les
  autres jobs du stage précédent ;
- `interruptible: true` : si un nouveau commit est poussé, l'ancien
  pipeline est annulé au lieu de tourner pour rien ;
- un cache dont la clé est le <span class="term" data-term="lockfile">lockfile</span> : les dépendances ne sont
  retéléchargées que quand elles changent ;
- `rules: changes` : le job ne tourne que si la MR modifie les fichiers
  listés. Dans un dépôt à plusieurs modules, on ne lance pas les tests
  d'un module que la MR ne touche pas.

Le YAML est illustratif : les scripts, images, caches et règles doivent
correspondre au dépôt réel.

#### Étape 3 : améliorer sans dégrader la confiance

1.  Identifier les jobs les plus lents et les plus coûteux.
2.  Mettre en cache les dépendances de façon sûre, avec une clé adaptée
    au lockfile.
3.  Exécuter en parallèle les tests indépendants.
4.  Faire remonter les contrôles rapides avant les tests coûteux.
5.  Stabiliser les tests intermittents et suivre leurs causes.
6.  Conserver les contrôles de sécurité et de qualité proportionnés au
    risque.
7.  Après fusion, garder les validations nécessaires avant déploiement
    et les contrôles de production.

#### Ce qu'il ne faut pas faire

-   Supprimer les tests lents sans analyser ce qu'ils protègent.
-   Rendre les tests non bloquants uniquement pour afficher un pipeline
    vert.
-   Optimiser uniquement la durée moyenne sans mesurer le temps de
    feedback réel.
-   Créer un pipeline tellement complexe que personne ne sait
    diagnostiquer un échec.

#### Critères d'acceptation d'une amélioration

-   Diminution mesurable du temps de feedback sur MR.
-   Pas de hausse significative des défauts échappés.
-   Résultats reproductibles et échecs diagnostiquables.
-   Documentation et propriétaire identifiés pour chaque job important.

#### Réponse orale possible

> « Je ne commencerais pas par réécrire le pipeline. Je mesurerais où le
> temps est consommé, puis je viserais le feedback le plus rapide
> possible sur les erreurs fréquentes, tout en conservant des garde-fous
> fiables. Les premiers gains viennent souvent de réglages qui ne
> retirent aucun contrôle : lancer un job dès que ce dont il dépend est
> fini, annuler les pipelines dépassés par un nouveau commit, mettre les
> dépendances en cache et ne pas relancer les tests d'un module non
> modifié. Le succès se mesure à la fois par le délai de feedback et par
> l'absence de dégradation de la qualité. »

**À relire** : [DevX : Une CI rapide et fiable](../../knowledge/devx.md#une-ci-rapide-et-fiable), [Qualité : CI et livraison](../../knowledge/qualite.md#ci-et-livraison), [Qualité : Paralléliser sans casser](../../knowledge/qualite.md#paralleliser-sans-casser)

---

## Exercice 4. API de création : idempotence et double soumission

### Énoncé

Un client mobile peut réessayer une requête `POST /orders` après un
<span class="term" data-term="timeout">timeout</span>. Parfois, deux commandes sont créées. Comment corriger le
problème ?

### Corrigé attendu

#### Principe

Un timeout ne signifie pas que le serveur n'a rien fait : il peut avoir
créé la commande puis perdu la réponse. Le client doit pouvoir réessayer
sans déclencher une deuxième opération métier.

Utiliser une **clé d'idempotence** fournie par le client, unique pour
une intention de création, et enregistrer cette clé de manière atomique
avec le résultat de l'opération.

#### Contrat API proposé

``` { .http .ex-illus title="Illustration · contrat proposé" }
POST /orders
Idempotency-Key: 6f4c0f0a-0b35-4c82-9c72-0e7b45f5a9c1
Content-Type: application/json
```

-   Première requête valide : création et réponse `201 Created`.
-   Même clé et même requête logique : renvoyer le résultat déjà
    enregistré.
-   Même clé réutilisée avec un contenu différent : refuser, par exemple
    avec `409 Conflict`.
-   Requête en cours avec la même clé : répondre `409 Conflict` avec un
    en-tête `Retry-After` qui indique au client dans combien de secondes
    réessayer.

La clé est **propre à chaque client**, pas unique pour toute
l'application : la même clé envoyée par deux clients différents
correspond à deux intentions différentes.

#### Modèle de persistance

Table `idempotency_records` avec, au minimum :

-   `customer_id` et `idempotency_key`, avec une contrainte
    `UNIQUE (customer_id, idempotency_key)` ;
-   empreinte du contenu pertinent ;
-   état (`processing`, `completed`) ;
-   identifiant de commande et/ou réponse enregistrée ;
-   date de création et date d'expiration.

Une contrainte sur la clé seule ne suffit pas : si deux clients
envoient par hasard la même clé, le second reçoit la réponse
enregistrée du premier, c'est-à-dire la commande de quelqu'un d'autre.

Chaque clé a une durée de vie, par exemple 24 heures. Une tâche
planifiée supprime ensuite les lignes expirées, sinon la table grossit
sans fin.

L'**empreinte** (*fingerprint*) est un hash du corps de la requête,
calculé après **<span class="term" data-term="canonicalization">canonicalisation</span>** : on réécrit le JSON sous une forme
unique (clés triées, aucun espace) pour que deux corps équivalents
donnent le même hash, quel que soit l'ordre des champs envoyé par le
client.

``` { .text .ex-illus title="Illustration · empreinte après canonicalisation" }
corps reçu          forme canonique     sha256 (8 premiers caractères)
{"a":1,"b":2}       {"a":1,"b":2}       43258cff
{"b": 2, "a": 1}    {"a":1,"b":2}       43258cff   même empreinte : rejeu accepté
{"a":1,"b":3}       {"a":1,"b":3}       f9c6777f   empreinte différente : 409 Conflict
```

Sans canonicalisation, un client qui renvoie la même commande avec les
champs dans un autre ordre recevrait un `409` à tort.

#### Pseudo-code

Le réflexe qui ne marche pas : chercher la clé, puis créer la commande si
la clé est absente. Deux requêtes simultanées passent toutes les deux le
test avant que l'une n'enregistre la clé, et le client a deux commandes.

``` { .text .ex-bad title="À éviter · chercher puis insérer" }
# À éviter : deux requêtes simultanées ne trouvent rien et créent chacune une commande
handleCreateOrder(customerId, key, request):
    if idempotency record exists for (customerId, key):
        return record.saved_response
    create order
    insert idempotency record (customerId, key, response)
```

La version qui tient : on tente l'insertion de la clé d'abord.

``` { .text .ex-good title="Recommandé · pseudo-code" }
# Bien : la clé est insérée d'abord, la contrainte d'unicité arbitre la concurrence
handleCreateOrder(customerId, key, request):
    fingerprint = hash(canonicalize(request))

    try:
        insert idempotency record
            (customerId, key, fingerprint, processing, expires in 24 h)
        commit
    on unique constraint violation:
        record = find idempotency record by (customerId, key)

        if record.fingerprint != fingerprint:
            return 409 Conflict

        if record.status == completed:
            return record.saved_response

        return 409 Conflict with Retry-After header

    begin transaction
    validate business rules
    create order
    save response in idempotency record as completed
    commit

    on error:
        delete idempotency record so that a retry can start again

    return saved response
```

La concurrence repose sur la <span class="term" data-term="unique-constraint">contrainte d'unicité</span> en base : on tente
d'abord l'insertion, et c'est son échec qui révèle qu'une requête avec
la même clé existe déjà. Un simple « chercher puis insérer » subirait
une <span class="term" data-term="race-condition">course</span> entre deux requêtes concurrentes. L'état `processing` est
enregistré avant la création de la commande, pour qu'une deuxième
requête le voie et reçoive `409` avec `Retry-After`.

Même logique en Python avec `sqlite3` (la table et la fonction
`create_order` sont à adapter au projet) :

``` { .python .ex-good title="Recommandé · version Python" }
import hashlib
import json
import sqlite3
from collections.abc import Callable
from typing import Any

RETRY_AFTER_SECONDS = 2

JsonDict = dict[str, Any]
Response = tuple[int, dict[str, str], JsonDict]
CreateOrder = Callable[[sqlite3.Connection, JsonDict], JsonDict]


# Bien : même empreinte pour deux JSON équivalents, quel que soit l'ordre des clés
def fingerprint(request: JsonDict) -> str:
    canonical = json.dumps(request, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canonical.encode()).hexdigest()


# Bien : la clé est réservée avant la création, et libérée si la création échoue
def handle_create_order(
    db: sqlite3.Connection,
    customer_id: int,
    key: str,
    request: JsonDict,
    create_order: CreateOrder,
) -> Response:
    request_hash = fingerprint(request)

    try:
        with db:
            db.execute(
                "INSERT INTO idempotency_records"
                " (customer_id, idempotency_key, fingerprint, status, expires_at)"
                " VALUES (?, ?, ?, 'processing', datetime('now', '+24 hours'))",
                (customer_id, key, request_hash),
            )
    except sqlite3.IntegrityError:
        return replay(db, customer_id, key, request_hash)

    try:
        with db:
            order = create_order(db, request)
            db.execute(
                "UPDATE idempotency_records"
                " SET status = 'completed', response = ?"
                " WHERE customer_id = ? AND idempotency_key = ?",
                (json.dumps(order), customer_id, key),
            )
    except Exception:
        with db:
            db.execute(
                "DELETE FROM idempotency_records"
                " WHERE customer_id = ? AND idempotency_key = ?",
                (customer_id, key),
            )
        raise

    return 201, {}, order


# Bien : rejouer la réponse enregistrée, ou demander de réessayer plus tard
def replay(
    db: sqlite3.Connection, customer_id: int, key: str, request_hash: str
) -> Response:
    retry_later: Response = (
        409,
        {"Retry-After": str(RETRY_AFTER_SECONDS)},
        {"error": "Request in progress."},
    )
    row = db.execute(
        "SELECT fingerprint, status, response FROM idempotency_records"
        " WHERE customer_id = ? AND idempotency_key = ?",
        (customer_id, key),
    ).fetchone()

    if row is None:
        return retry_later
    stored_hash, status, response = row
    if stored_hash != request_hash:
        return 409, {}, {"error": "Key reused with another payload."}
    if status == "completed":
        return 201, {}, json.loads(response)
    return retry_later
```

#### Point d'architecture important

Si le paiement est un service externe, une transaction SQL ne peut pas
rendre atomiques à elle seule la base locale et le paiement. Il faut
définir un workflow robuste : identifiant de paiement <span class="term" data-term="idempotency">idempotent</span>, états
explicites, reprise sur erreur et éventuellement pattern <span class="term" data-term="outbox-pattern">outbox</span>/<span class="term" data-term="saga-pattern">saga</span>
selon le contexte.

#### Tests indispensables

-   Deux requêtes séquentielles avec la même clé ne créent qu'une
    commande.
-   Deux requêtes concurrentes avec la même clé ne créent qu'une
    commande.
-   Même clé, contenu différent : conflit explicite.
-   Deux clients différents avec la même clé : deux commandes distinctes,
    aucun ne reçoit la réponse de l'autre.
-   Requête qui arrive pendant le traitement de la première : `409` avec
    `Retry-After`.
-   Timeout après création puis retry : le client récupère le résultat
    existant.
-   Échec pendant le traitement : l'enregistrement est supprimé et un
    nouvel essai repart de zéro sans doublon.
-   Clé expirée : la tâche de nettoyage supprime la ligne.

#### Réponse orale possible

> « Je pars du fait qu'un timeout est ambigu. Je rends la création
> idempotente avec une clé persistée, unique par client, une empreinte
> de la requête et un résultat réutilisable. Je fais porter la garantie
> de concurrence par la base, je réponds `409` avec `Retry-After` tant
> que la première requête est en cours, et les clés expirent au bout de
> 24 heures. Je traite ensuite séparément les effets externes comme le
> paiement. »

**À relire** : [API : Les méthodes HTTP](../../knowledge/api-rest-async.md#les-methodes-http), [Architecture : Idempotence](../../knowledge/architecture.md#idempotence), [SQL : Écritures concurrentes](../../knowledge/sql.md#ecritures-concurrentes), [Architecture : Outbox](../../knowledge/architecture.md#outbox), [Architecture : Saga orchestrée ou chorégraphiée](../../knowledge/architecture.md#saga-orchestree-ou-choregraphiee), [SQL : Les contraintes : la base garde les règles](../../knowledge/sql.md#les-contraintes-la-base-garde-les-regles)

---

## Exercice 5. Étude de cas : l'équipe QA est décrite comme un goulot d'étranglement

### Énoncé

La direction affirme qu'un contrôle qualité séparé ralentit les
livraisons. Elle veut transférer les activités de qualité aux équipes de
développement et supprimer le contrôle central. « Comment abordes-tu le
problème comme Staff Engineer ? »

### Corrigé attendu

#### 1. Ne pas défendre une organisation par principe

La bonne question n'est pas « faut-il garder une équipe QA ? », mais :
**où se situe réellement le délai, quel risque le contrôle réduit-il et
quelle capacité doit être conservée ?**

Une équipe QA centralisée peut créer une file d'attente si toutes les
livraisons doivent passer par elle. Mais supprimer cette équipe ne
supprime ni les besoins de test, ni la sécurité, ni les exigences de
fiabilité. Les responsabilités et les mécanismes de contrôle doivent
être explicitement redistribués.

#### 2. Formuler des hypothèses testables

-   H1 : l'attente d'une revue QA est une part importante du <span class="term" data-term="lead-time">lead time</span>.
-   H2 : les retards proviennent plutôt des environnements, des
    dépendances, des validations produit ou des défauts.
-   H3 : certaines vérifications sont répétitives et automatisables.
-   H4 : les équipes de développement n'ont pas partout les compétences,
    le temps ou les outils pour reprendre les activités.
-   H5 : la centralisation reste nécessaire pour certains risques
    spécialisés, par exemple sécurité, performance ou stratégie de test
    transverse.

#### 3. Demander les bonnes données

-   Temps d'attente avant prise en charge QA. Source précise : le temps
    passé par les tickets dans la colonne « À tester » du tableau de tickets,
    comparé au temps passé dans « En cours ». Si un ticket attend
    3 jours en « À tester » pour 2 heures de test réel, le <span class="term" data-term="bottleneck">goulot</span> est
    confirmé et chiffré.
-   Temps de traitement actif versus temps en file.
-   Lead time de changement et fréquence de déploiement.
-   Taux d'échec de changement, incidents et défauts en production.
-   Réouvertures, retests et causes des blocages.
-   Usage réel des outils, mais aussi qualité et interprétabilité des
    données d'usage.
-   Différences par équipe, type de changement et niveau de risque.

Ne pas confondre corrélation et causalité. Une hausse du délai en
présence d'une étape QA ne prouve pas à elle seule que cette étape est
la cause principale.

#### 4. Proposer une expérimentation réversible

1.  Cartographier le flux actuel et établir une référence chiffrée.
2.  Choisir une ou deux équipes volontaires et un périmètre limité.
3.  <span class="term" data-term="shift-left">Déplacer à gauche</span> les tests automatisables et clarifier les critères
    d'acceptation.
4.  Fournir templates, exemples, bibliothèques, pipelines et coaching.
5.  Conserver une expertise transverse pour les cas complexes, les
    standards et les risques élevés.
6.  Comparer les résultats avec la situation initiale et, si possible,
    une équipe comparable.
7.  Définir à l'avance les critères de succès et les conditions d'arrêt.

#### 5. Mesures de réussite

-   Diminution du délai de livraison et du temps d'attente.
-   Pas de hausse inacceptable des incidents ou <span class="term" data-term="escaped-defect">défauts échappés</span>.
-   Capacité des équipes à diagnostiquer les échecs.
-   Adoption des pratiques et coût de maintenance des tests.
-   Temps consacré à la reprise et au coaching.

#### 6. Position de Staff Engineer

Le rôle n'est ni de protéger un silo, ni d'accepter une réorganisation
sur la base d'une intuition. Il consiste à clarifier le problème,
proposer une architecture organisationnelle et technique, tester
l'hypothèse et mesurer les effets.

Le changement de rôle de la QA se présente de façon positive : elle
passe de « celle qui valide à la fin » à « celle qui outille et
accompagne », avec des modèles de tests, la CI et une revue de la
stratégie de test dès le début du ticket.

#### Réponse orale possible

> « Je traiterais le goulot d'étranglement comme une hypothèse à
> vérifier. Je mesurerais le temps en file et le temps de traitement,
> par exemple le temps passé en colonne « À tester » comparé au temps de
> test réel, puis je regarderais les défauts et les incidents pour
> éviter d'optimiser la vitesse au détriment de la fiabilité. Je
> testerais un modèle où les équipes prennent en charge la qualité au
> quotidien, soutenues par des outils et des standards communs, avec
> une expertise transverse pour les risques complexes. La QA ne valide
> plus à la fin : elle outille et accompagne. »

C'est l'exercice le plus proche d'un métier de QA, celui où il faut être
le plus concret : je termine par un exemple vécu de ce passage d'une QA
qui valide à une QA qui outille.

**À relire** : [Culture d'entreprise : Cartographie du flux de valeur](../../knowledge/culture-entreprise.md#cartographie-du-flux-de-valeur), [Culture d'entreprise : Théorie des contraintes](../../knowledge/culture-entreprise.md#theorie-des-contraintes), [Qualité : Shift-left et shift-right : quand tester](../../knowledge/qualite.md#shift-left-et-shift-right-quand-tester), [Données et décision : Décider avec les données](../../knowledge/donnees-decision.md#decider-avec-les-donnees), [Qualité : Le rôle du QA dans une équipe agile](../../knowledge/qualite.md#le-role-du-qa-dans-une-equipe-agile)

---

## Exercice 6. DORA : choisir les métriques sans créer de mauvais comportements

### Énoncé

Un manager demande un tableau de bord pour comparer les équipes. Il
propose de classer les équipes par nombre de déploiements et couverture
de tests. « Que réponds-tu ? »

### Corrigé attendu

#### Pourquoi le classement est risqué

-   Le nombre de déploiements dépend du produit, de l'architecture, des
    contraintes réglementaires et du découpage des changements.
-   La <span class="term" data-term="code-coverage">couverture de code</span> mesure l'exécution, pas la pertinence des
    assertions.
-   Un classement incite à optimiser l'indicateur plutôt que le système.
    C'est la **<span class="term" data-term="goodhart-law">loi de Goodhart</span>** (Charles Goodhart, 1975, formulation
    popularisée par Marilyn Strathern en 1997) : « quand une mesure
    devient un objectif, elle cesse d'être une bonne mesure ». Exemple :
    si on classe les équipes par couverture, des tests sans assertion
    apparaissent, la couverture monte et la qualité ne bouge pas.
-   Les équipes peuvent avoir des profils de risque et des contextes
    différents.

#### Tableau de bord plus utile

Suivre des tendances et des distributions, par service ou produit,
plutôt qu'un classement simpliste :

-   **Lead time for changes** : délai entre une modification engagée et
    sa mise à disposition selon une définition partagée.
-   **Deployment frequency** : fréquence des déploiements en production.
-   **Change failure rate** : proportion de déploiements provoquant un
    incident ou nécessitant une correction selon une définition
    convenue.
-   **Failed deployment recovery time** : temps nécessaire pour rétablir
    le service après un déploiement défaillant.

Exemple de calcul du change failure rate, sur un mois (chiffres
d'exemple) :

| Déploiement en production | Compté comme échec ? | Pourquoi |
|---|---|---|
| 36 déploiements sans suite | Non | rien à corriger |
| 1 déploiement annulé par <span class="term" data-term="rollback">rollback</span> | Oui | intervention immédiate en production |
| 2 déploiements suivis d'un correctif urgent (*hotfix*) | Oui | le changement a dégradé le service |
| 1 *hotfix* qui corrige l'un des deux précédents | Non | c'est un déploiement de plus au dénominateur, pas un échec s'il réussit |
| Pipeline rouge, jamais arrivé en production | Hors calcul | ce n'est pas un déploiement |
| Bug découvert 3 mois plus tard | Hors calcul, en général | il relève des défauts échappés, pas d'un déploiement précis |

Résultat : 3 échecs sur 40 déploiements, soit 7,5 %. Le chiffre n'a de
sens que si toutes les équipes comptent les mêmes événements : c'est la
« définition convenue » ci-dessus, à écrire avant de publier le premier
graphique. La définition officielle (un déploiement qui provoque une
défaillance demandant une intervention immédiate) vient de
[dora.dev](https://dora.dev/guides/dora-metrics-four-keys/) (consulté
en novembre 2026, formulation exacte à vérifier).

Compléter ces métriques par :

- disponibilité et <span class="term" data-term="slo">SLO</span> ;
- incidents et sévérité ;
- <span class="term" data-term="escaped-defect">défauts échappés</span> ;
- durée du feedback CI ;
- taux de tests intermittents ;
- charge de travail non planifiée et coût opérationnel, si pertinent.

#### Méthode

1.  Définir précisément les événements et les dénominateurs.
2.  Vérifier la qualité des données.
3.  Établir une référence avant toute cible.
4.  Observer les tendances et les contraintes propres à chaque service.
5.  Utiliser les métriques pour trouver les obstacles et décider
    d'expériences.
6.  Montrer à chaque équipe **ses propres** courbes dans le temps. La
    direction voit les tendances globales, pas un classement nominatif.
7.  Afficher les quatre <span class="term" data-term="dora-metrics">métriques DORA</span> toujours ensemble sur le même
    écran : on ne peut pas en améliorer une en dégradant les autres sans
    que ça se voie.
8.  Éviter de relier mécaniquement ces chiffres à l'évaluation
    individuelle.

#### Réponse orale possible

> « Je refuserais de transformer les métriques en classement brut :
> c'est la loi de Goodhart, une mesure qui devient un objectif cesse
> d'être une bonne mesure. Je proposerais un ensemble équilibré qui
> mesure à la fois le flux et la stabilité, avec des définitions
> partagées et une lecture dans le contexte de chaque produit. Chaque
> équipe voit ses propres courbes, la direction voit les tendances
> globales, et les quatre métriques restent affichées ensemble. Les
> métriques doivent aider à localiser les contraintes et à apprendre,
> pas pousser les équipes à manipuler les chiffres. »

**À relire** : [Livraison : Mesurer la livraison : DORA](../../knowledge/livraison.md#mesurer-la-livraison-dora), [Lois et principes : Loi de Goodhart](../../knowledge/lois-et-principes.md#loi-de-goodhart), [DevX : Mesurer sans surveiller](../../knowledge/devx.md#mesurer-sans-surveiller), [Qualité : Ce qu'elle dit et ce qu'elle ne dit pas](../../knowledge/qualite.md#ce-quelle-dit-et-ce-quelle-ne-dit-pas)

---

## Exercice 7. Incident de production : que fait le Staff Engineer ?

### Énoncé

Après un déploiement, le taux d'erreur de l'API augmente fortement. Les
équipes cherchent immédiatement le commit fautif et plusieurs personnes
proposent de corriger en production. « Décris ta conduite. »

### Corrigé attendu

#### Priorité 1 : limiter l'impact

1.  Nommer les rôles : une personne dirige l'incident (<span class="term" data-term="incident-commander">incident
    commander</span>) et décide, une autre communique, les autres investiguent.
    Celle qui dirige ne débogue pas elle-même.
2.  Vérifier l'impact utilisateur, le périmètre et les indicateurs de
    service.
3.  Suivre le <span class="term" data-term="runbook">runbook</span> et envisager <span class="term" data-term="rollback">rollback</span>, désactivation d'une
    fonctionnalité par <span class="term" data-term="feature-flag">feature flag</span> (un interrupteur de configuration
    qui coupe la fonctionnalité sans redéployer) ou mitigation connue.
    Le retour arrière n'est pas toujours possible : si le déploiement
    contenait une migration qui supprime ou renomme une colonne,
    l'ancienne version du code cherche une colonne qui n'existe plus et
    tout casse.
4.  Communiquer un état factuel aux parties prenantes à une cadence
    régulière.
5.  Éviter les changements simultanés non coordonnés.

#### Priorité 2 : diagnostiquer avec des preuves

-   Comparer taux d'erreur, latence et saturation avant/après le
    déploiement.
-   Corréler avec version, région, dépendances et feature flags.
-   Examiner logs, traces et métriques.
-   Vérifier si le problème touche toutes les requêtes ou un parcours
    particulier.
-   Formuler des hypothèses et les tester une par une.

#### Priorité 3 : rétablir et vérifier

-   Appliquer la mitigation la moins risquée.
-   Vérifier le retour des indicateurs au niveau attendu.
-   Surveiller les effets secondaires.
-   Documenter la chronologie, les décisions et les incertitudes.

#### Après l'incident

-   Faire une revue <span class="term" data-term="blameless">sans recherche de coupable</span>.
-   Distinguer cause immédiate, facteurs contributifs et failles de
    détection.
-   Créer peu d'actions, mais avec propriétaire, échéance et critère de
    réussite.
-   Améliorer tests, observabilité, déploiement progressif, rollback ou
    runbook si nécessaire.
-   Garder le retour arrière possible avec deux pratiques : des
    migrations compatibles avec l'ancienne et la nouvelle version (on
    ajoute d'abord, on supprime plusieurs déploiements plus tard), et
    des feature flags pour couper une fonctionnalité sans redéployer.

#### Réponse orale possible

> « Pendant l'incident, je privilégie la réduction de l'impact et une
> coordination claire plutôt que la recherche immédiate d'un coupable :
> une personne dirige sans déboguer, une communique, les autres
> investiguent. Je m'appuie sur les signaux observables, je choisis une
> mitigation réversible, en vérifiant qu'aucune migration n'empêche le
> retour arrière, et je vérifie le rétablissement. Ensuite, je
> transforme les apprentissages en actions suivies, sans réduire
> l'analyse à une erreur individuelle. »

**À relire** : [Incidents : Le cycle de vie d'un incident](../../knowledge/incidents.md#le-cycle-de-vie-dun-incident), [Incidents : Les rôles pendant l'incident](../../knowledge/incidents.md#les-roles-pendant-lincident), [Incidents : Le postmortem sans recherche de coupable](../../knowledge/incidents.md#le-postmortem-sans-recherche-de-coupable), [SQL : Migrer un schéma sans interruption](../../knowledge/sql.md#migrer-un-schema-sans-interruption), [Livraison : Déploiement progressif](../../knowledge/livraison.md#deploiement-progressif)

---

## Exercice 8. Faire adopter un standard sans autorité hiérarchique

### Énoncé

Je propose un <span class="term" data-term="quality-gate">quality gate</span> commun sur les <span class="term" data-term="merge-request">merge requests</span>. Deux équipes
refusent : l'une craint de ralentir ses livraisons, l'autre considère
que son contexte est différent. « Comment avances-tu ? »

### Corrigé attendu

#### 1. Comprendre les objections avant de convaincre

-   Quel problème le gate doit-il prévenir ?
-   Quel est le coût actuel des défauts qu'il vise ?
-   Quel est le coût du gate en durée, maintenance et <span class="term" data-term="false-positive">faux positifs</span> ?
-   Les équipes ont-elles des contraintes ou des exceptions légitimes ?
-   Les règles proposées sont-elles compréhensibles et actionnables ?

#### 2. Distinguer le socle commun des règles spécifiques

Exemple de socle possible :

- compilation ou validation de syntaxe ;
- tests rapides ;
- règles de sécurité à risque élevé ;
- seuils de qualité ciblés sur le nouveau code, si justifiés.

Des règles plus coûteuses peuvent être exécutées après fusion ou dans un
pipeline adapté, à condition que le risque et le mécanisme de détection
restent acceptables.

#### 3. Prouver la valeur

-   Commencer par une équipe volontaire plutôt que par les deux équipes
    réticentes : un premier succès chez une équipe qui a choisi
    d'essayer convainc mieux que n'importe quel argument.
-   Faire un atelier avec les équipes.
-   Mesurer le temps de pipeline et les défauts ciblés.
-   Tester le gate en mode informatif avant de le rendre bloquant.
-   Publier les résultats, y compris les faux positifs et les coûts.
-   Corriger les règles qui génèrent du bruit.
-   Définir un mécanisme d'exception explicite, temporaire et révisable,
    et le rendre visible : par exemple un label sur la MR avec une date
    d'expiration, et un tableau qui liste les exceptions en cours. Une
    exception sans date devient une règle cachée.

#### 4. Définir la gouvernance

-   Qui possède les règles ?
-   Comment les modifier ?
-   Quel délai de traitement pour une demande d'exception ?
-   Comment éviter que le socle commun devienne trop lourd ?
-   Comment mesurer l'adoption et les résultats ?

#### Réponse orale possible

> « Je ne chercherais pas à imposer le même outil et tous les mêmes
> seuils partout. Je commencerais par un objectif commun et des règles
> justifiées par le risque. Je testerais le dispositif d'abord avec une
> équipe volontaire, je publierais le coût et le bénéfice observés, puis
> je rendrais bloquants les contrôles fiables et réellement nécessaires.
> Les exceptions restent possibles, mais visibles et avec une date de
> fin. L'adoption est un critère de réussite, pas un détail de
> communication. »

**À relire** : [Qualité : Quality gates](../../knowledge/qualite.md#quality-gates), [Qualité : Deux gates suffisent](../../knowledge/qualite.md#deux-gates-suffisent), [DevX : Faire adopter un outil sans l'imposer](../../knowledge/devx.md#faire-adopter-un-outil-sans-limposer), [Culture d'entreprise : Advice process](../../knowledge/culture-entreprise.md#advice-process), [Culture d'entreprise : Influence sans autorité et communautés de pratique](../../knowledge/culture-entreprise.md#influence-sans-autorite-et-communautes-de-pratique)

---

## Exercice 9. Performance SQL : diagnostiquer avant d'optimiser

### Énoncé

Une page qui liste les commandes est lente. La requête ressemble à ceci :

``` { .sql .ex-illus title="Illustration · la requête de la page lente" }
-- Exemple : les 50 dernières commandes d'un client
SELECT id, customer_id, created_at, status
FROM orders
WHERE customer_id = 123
ORDER BY created_at DESC
LIMIT 50;
```

« Quelle est ta démarche ? »

### Corrigé attendu

#### 1. Mesurer et comprendre

-   Reproduire avec des données représentatives.
-   Mesurer la latence côté application et base de données.
-   Examiner `EXPLAIN` ou `EXPLAIN ANALYZE` selon le moteur.
-   Vérifier le nombre de lignes estimé et réel, les lectures et le tri.
-   Regarder les index existants, la distribution des données et la
    fréquence de la requête.

#### 2. Hypothèse d'index

Un <span class="term" data-term="composite-index">index composite</span> `(customer_id, created_at)` peut être pertinent : la
base trouve directement les commandes du client 123 **déjà triées par
date** dans l'index. Elle lit les 50 dernières et s'arrête, sans trier
toutes les commandes du client. Le choix exact dépend du moteur, de la
cardinalité, de la direction de tri, de la taille des lignes et des
autres requêtes.

Exemple :

``` { .sql .ex-good title="Recommandé · index composite" }
-- Bien : le filtre et le tri sont servis par le même index
CREATE INDEX idx_orders_customer_created
ON orders (customer_id, created_at);
```

Sous MySQL, `EXPLAIN` le montre : avant, la colonne `Extra` affiche
`Using filesort` (la base trie elle-même les lignes) ; après, cette
mention disparaît.

En InnoDB (MySQL), un index secondaire contient toujours la clé
primaire `id`. Avec un index `(customer_id, created_at, status)`, toutes
les colonnes demandées sont dans l'index : la base n'a même plus besoin
de lire la table. On appelle ça un <span class="term" data-term="covering-index">index couvrant</span>.

Il faut vérifier le plan après création et mesurer l'effet. Un index
supplémentaire ralentit les écritures et consomme de l'espace : il ne
doit pas être ajouté sans validation.

#### 3. Points complémentaires

-   Éviter de sélectionner des colonnes inutiles.
-   Vérifier si la pagination par `OFFSET` devient coûteuse sur les
    grandes pages ; envisager une <span class="term" data-term="cursor-pagination">pagination par curseur</span> si le besoin le
    justifie.
-   Vérifier le <span class="term" data-term="n-plus-one">N+1</span> côté application si la page charge ensuite des
    détails pour chaque commande.
-   Contrôler les changements de performance sous charge et les coûts
    d'écriture.

Ce que coûte un `OFFSET` profond, comparé à la pagination par clé
(*keyset*, la forme la plus courante de pagination par curseur) :

``` { .sql .ex-bad title="À éviter · OFFSET profond" }
-- À éviter : la base lit 100 050 entrées d'index pour en garder 50
SELECT id, created_at, total FROM orders
WHERE customer_id = 123
ORDER BY created_at DESC, id DESC
LIMIT 50 OFFSET 100000;
```

``` { .sql .ex-good title="Recommandé · pagination par clé (keyset)" }
-- Bien : la base repart de la dernière ligne vue et lit 50 entrées
SELECT id, created_at, total FROM orders
WHERE customer_id = 123
  AND (created_at, id) < ('2026-03-14 10:22:05', 98431)
ORDER BY created_at DESC, id DESC
LIMIT 50;
```

La première requête lit 100 050 entrées d'index et en jette 100 000 :
plus la page est loin, plus elle est lente. La seconde repart de la
dernière ligne vue (sa date et son `id`, renvoyés au client comme
curseur) : avec un index `(customer_id, created_at, id)`, la base saute
directement au bon endroit et lit 50 entrées, quelle que soit la page.
L'`id` départage deux commandes créées à la même seconde. Limite : on ne
peut plus sauter directement à la page 2 000, seulement à la suivante.
Sous MySQL, l'usage de l'index par la comparaison de tuples
`(created_at, id) < (...)` dépend de la version (à vérifier avec
`EXPLAIN`) ; la forme développée
`created_at < ? OR (created_at = ? AND id < ?)` est la plus sûre.

#### Réponse orale possible

> « Je commence par le <span class="term" data-term="execution-plan">plan d'exécution</span> et une mesure représentative,
> pas par l'ajout automatique d'un index. L'index
> `(customer_id, created_at)` est une hypothèse raisonnable pour ce
> filtre et cet ordre : la base lit les lignes déjà triées et s'arrête à
> 50. Je la valide avec le plan, où `Using filesort` doit disparaître,
> et avec des mesures. Si besoin, j'ajoute `status` pour obtenir un
> index couvrant. Je vérifie ensuite le compromis lecture/écriture et le
> comportement sur de gros volumes. »

**À relire** : [SQL : Performances](../../knowledge/sql.md#performances), [SQL : EXPLAIN](../../knowledge/sql.md#explain), [SQL : Quand un index aide](../../knowledge/sql.md#quand-un-index-aide), [API : Pagination](../../knowledge/api-rest-async.md#pagination), [SQL : Le problème N+1](../../knowledge/sql.md#le-probleme-n1), [SQL : Index composite : l'ordre des colonnes et l'index couvrant](../../knowledge/sql.md#index-composite-lordre-des-colonnes-et-lindex-couvrant)

---

## Exercice 10. Sécurité : traiter une dépendance vulnérable

### Énoncé

Un scanner signale une vulnérabilité dans une dépendance. Le correctif
est disponible, mais la mise à jour majeure risque de casser
l'application. « Comment décides-tu ? »

### Corrigé attendu

#### 1. Qualifier le risque

-   Version réellement installée et chemin de dépendance direct ou
    <span class="term" data-term="transitive-dependency">transitif</span>.
-   Version(s) vulnérable(s) et versions corrigées.
-   Exploitabilité dans le contexte réel : code concerné, exposition
    réseau, données accessibles.
-   Gravité et probabilité d'exploitation. Le score **<span class="term" data-term="cvss">CVSS</span>** (version
    4.0, publiée en 2023) dit à quel point une faille est grave **si**
    elle est exploitée. Le score **<span class="term" data-term="epss">EPSS</span>** (publié depuis 2021 par le
    FIRST, l'association internationale des équipes de réponse aux
    incidents) estime la **probabilité** qu'elle soit réellement
    exploitée dans les 30 jours. Une faille à CVSS 9 mais EPSS 0,1 % n'a
    pas la même urgence qu'une faille à CVSS 7 avec un exploit qui
    circule déjà.
-   Atteignabilité : certains scanners vérifient si le code appelle
    vraiment la fonction vulnérable de la bibliothèque. Si ce n'est pas
    le cas, le risque baisse fortement.
-   Éventuelles obligations internes ou réglementaires.
-   Possibilité d'une mitigation temporaire.

Le score du scanner est un signal ; il ne remplace pas l'analyse de
l'exposition réelle.

#### 2. Choisir un plan proportionné

-   Si le risque est exploitable et élevé : accélérer la mitigation et
    la mise à jour, avec plan de retour arrière.
-   Si le correctif est compatible : mettre à jour rapidement, tester et
    déployer.
-   Si une mise à jour majeure est nécessaire : isoler le changement,
    ajouter les tests de compatibilité, planifier une migration courte
    et attribuer un responsable.
-   Si le risque est faible ou non applicable : écrire l'exception dans
    la configuration du scanner, avec les preuves, le propriétaire et une
    date d'expiration, pour que l'alerte revienne d'elle-même, plutôt que
    fermer silencieusement l'alerte.

#### 3. Prévention transverse

-   Inventaire fiable des dépendances et <span class="term" data-term="lockfile">lockfiles</span>.
-   Alertes automatiques dans la CI.
-   Politique de délai de correction par niveau de risque.
-   Tests de compatibilité et processus de mise à jour régulière.
-   Suivi des exceptions et de leur expiration.

#### Réponse orale possible

> « Je combine la gravité, mesurée par le CVSS, avec la probabilité
> d'exploitation, mesurée par l'EPSS, l'atteignabilité du code
> vulnérable et l'exposition réelle. Je définis une action, un
> propriétaire, un délai et une mitigation éventuelle. Si j'ignore une
> alerte, je l'écris dans la configuration du scanner avec une date
> d'expiration. Le but n'est ni de suivre aveuglément le scanner, ni de
> banaliser une alerte parce que le correctif est coûteux. Je cherche
> aussi à rendre le traitement reproductible pour les autres équipes. »

**À relire** : [Cybersécurité : Noter et trier une faille](../../knowledge/cybersecurite.md#noter-et-trier-une-faille), [Gestionnaires de paquets : Mettre à jour les dépendances](../../knowledge/gestionnaires-paquets.md#mettre-a-jour-les-dependances), [Sécurité : Exemple : un scan de dépendances](../../knowledge/securite.md#exemple-un-scan-de-dependances), [Qualité : Dérogation datée et acceptation du risque](../../knowledge/qualite.md#derogation-datee-et-acceptation-du-risque)

---

## Exercice 11. Architecture : extraire un service ou garder un monolithe ?

### Énoncé

Une équipe propose d'extraire le calcul des tarifs dans un <span class="term" data-term="microservice">microservice</span>
parce que le module est complexe et change souvent. « Quels éléments
examines-tu avant de décider ? »

### Corrigé attendu

#### Questions à poser

-   Le module a-t-il un besoin indépendant de déploiement ou de mise à
    l'échelle ?
-   A-t-il une frontière métier claire et des données dont il est
    propriétaire ?
-   Les changements fréquents sont-ils bloqués par le monolithe ou
    simplement difficiles à tester ?
-   Quel est le besoin de disponibilité et de latence ?
-   Quelles nouvelles défaillances réseau, politiques de retry et
    contraintes de cohérence apparaîtraient ?
-   L'équipe peut-elle opérer le service : observabilité, alertes,
    astreinte, déploiement, sécurité ?
-   Quel est le coût de migration et le plan de retour arrière ?

#### Position de départ

La complexité du code ne suffit pas, à elle seule, à justifier un
microservice. Une première étape peut être un **<span class="term" data-term="modular-monolith">monolithe modulaire</span>** :
le calcul des tarifs devient un module bien isolé dans le même code,
avec une interface claire et des tests contractuels internes, sans
réseau entre les deux.

Pour que cette frontière tienne dans le temps, la CI la vérifie
automatiquement : Deptrac en PHP ou import-linter en Python échouent si
un autre module appelle directement l'intérieur du module tarifs au lieu
de passer par son interface. Avec import-linter, un contrat de quatre
lignes dans `pyproject.toml` suffit :

``` { .toml .ex-good title="Recommandé · pyproject.toml" }
# Bien : les autres modules ne passent que par l'interface app.pricing
[[tool.importlinter.contracts]]
name = "Personne n'importe l'intérieur du module tarifs"
type = "forbidden"
source_modules = ["app.orders", "app.billing"]
forbidden_modules = ["app.pricing.internal"]
```

`lint-imports` échoue alors si `app.orders` importe
`app.pricing.internal`, et la seule porte d'entrée reste `app.pricing`.
La version complète (couches, exceptions gelées, test de la règle) est
dans [Architecture : Fitness functions](../../knowledge/architecture.md#fitness-functions).

L'extraction devient plus pertinente si l'indépendance de déploiement,
de mise à l'échelle, de propriété des données ou d'organisation apporte
un bénéfice mesurable supérieur au coût distribué. La <span class="term" data-term="conway-law">loi de Conway</span>
(Melvin Conway, 1968) le rappelle : l'architecture finit par ressembler à
l'organisation. Extraire un service n'a de sens que si une équipe peut
en être pleinement responsable.

#### Décision progressive

1.  Clarifier les responsabilités et les frontières métier.
2.  Isoler le module dans le code, faire vérifier sa frontière en CI et
    mesurer les dépendances.
3.  Définir les contrats et les exigences non fonctionnelles.
4.  Prototyper ou tester les contraintes majeures.
5.  Comparer coût total et bénéfices attendus.
6.  Si extraction : migration progressive, observabilité, stratégie de
    cohérence et <span class="term" data-term="rollback">rollback</span>.

#### Réponse orale possible

> « Je ne confonds pas modularité et distribution. Je commencerais par
> un monolithe modulaire : la frontière devient explicite dans le même
> code et la CI vérifie qu'elle est respectée. Ensuite, j'évaluerais si
> un déploiement indépendant ou une mise à l'échelle séparée est
> réellement nécessaire. Un microservice ajoute des coûts opérationnels
> et des défaillances réseau ; je l'extrais si les bénéfices sont
> concrets et si une équipe peut en être pleinement responsable. »

**À relire** : [Architecture : Quel style choisir](../../knowledge/architecture.md#quel-style-choisir), [Architecture : Monolithe modulaire](../../knowledge/architecture.md#monolithe-modulaire), [Architecture : Fitness functions](../../knowledge/architecture.md#fitness-functions), [Architecture : Loi de Conway](../../knowledge/architecture.md#loi-de-conway)

---

## Exercice 12. Coaching technique : un développeur propose une solution fragile

### Énoncé

En revue de code, un développeur propose une abstraction générique
complexe pour éviter quelques lignes dupliquées. La solution fonctionne,
mais sera difficile à comprendre. « Comment réagis-tu ? »

### Corrigé attendu

#### Réponse à éviter

-   « C'est une mauvaise pratique, fais comme ça. »
-   Imposer une préférence personnelle comme une règle universelle.
-   Réécrire soi-même le code sans expliquer le problème.
-   Laisser passer un risque important pour éviter un désaccord.

#### Approche constructive

1.  Demander quel problème l'abstraction résout et quels changements
    futurs elle facilite.
2.  Examiner le nombre de cas réellement communs et la stabilité de leur
    logique.
3.  Comparer la duplication locale au coût cognitif de l'abstraction.
4.  Proposer une alternative concrète, si possible plus simple.
5.  Expliquer les critères de décision, puis laisser l'équipe participer
    au choix.
6.  Si le désaccord révèle une règle récurrente, documenter un principe
    avec exemples plutôt qu'une interdiction dogmatique.

Dans le commentaire de revue, formuler une question plutôt qu'un
verdict, par exemple : « Quels sont les prochains cas que cette
abstraction doit couvrir ? Si on n'en connaît pas encore, est-ce qu'on
peut garder les deux versions simples et factoriser au troisième cas ? »

#### Règle de décision utile

Une abstraction est intéressante quand elle exprime un concept stable et
réduit réellement le coût des changements. Quelques lignes similaires ne
suffisent pas toujours : une duplication explicite peut être moins
coûteuse qu'une abstraction prématurée.

Une règle simple et connue aide à trancher : la **<span class="term" data-term="rule-of-three">règle de trois</span>**. On
accepte la duplication à la deuxième fois, on factorise à la troisième,
quand on voit enfin ce qui est vraiment commun. Sandi Metz le résume
ainsi dans « The Wrong Abstraction » (2016) : « la duplication coûte
bien moins cher qu'une mauvaise abstraction ».

#### Exemple avant / après

Avant : deux fonctions presque identiques, six lignes chacune.

``` { .python .ex-illus title="Illustration · avant" }
# Exemple : export des commandes, six lignes lisibles
def export_orders_csv(orders):
    lines = ["id;date;total"]
    for order in orders:
        lines.append(f"{order.id};{order.created_at:%Y-%m-%d};{order.total}")
    return "\n".join(lines)


# Exemple : export des factures, presque identique, acceptable à deux cas
def export_invoices_csv(invoices):
    lines = ["id;date;amount"]
    for invoice in invoices:
        lines.append(f"{invoice.id};{invoice.issued_at:%Y-%m-%d};{invoice.amount}")
    return "\n".join(lines)
```

Proposition en revue : une classe générique à six paramètres, dont
quatre (`delimiter`, `header`, `date_format`, `encoding`) reçoivent la
même valeur chez les deux appelants.

``` { .python .ex-bad title="À éviter · abstraction prématurée" }
# À éviter : six paramètres, dont quatre identiques chez les deux appelants
exporter = GenericExporter(
    source="orders",
    columns=["id", "created_at", "total"],
    delimiter=";",
    header=True,
    date_format="%Y-%m-%d",
    encoding="utf-8",
)
```

Elle couvre des cas qui n'existent pas encore et oblige le lecteur à
ouvrir la classe pour comprendre un export de six lignes. Réponse
proposée : garder les deux fonctions. Quand un troisième export arrive
(les remboursements), le point commun réel devient visible (un en-tête,
puis une ligne par élément, séparée par `;`) et on factorise seulement
ça :

``` { .python .ex-good title="Recommandé · factoriser au troisième cas" }
# Bien : la seule partie vraiment commune, deux paramètres
def to_csv(header, rows):
    lines = [";".join(header)]
    lines += [";".join(str(value) for value in row) for row in rows]
    return "\n".join(lines)


# Bien : chaque export garde ses colonnes lisibles
def export_refunds_csv(refunds):
    return to_csv(
        ["id", "date", "amount"],
        ([r.id, f"{r.refunded_at:%Y-%m-%d}", r.amount] for r in refunds),
    )
```

La petite fonction `to_csv` a deux paramètres, chaque export garde son
choix de colonnes lisible, et l'ajout d'un paramètre ne se fera que le
jour où un export en aura réellement besoin.

#### Réponse orale possible

> « Je chercherais d'abord à comprendre le besoin et les évolutions
> attendues, en posant la question en revue plutôt qu'en rendant un
> verdict. Je comparerais le coût de la duplication au coût de
> compréhension et de maintenance de l'abstraction. Je proposerais un
> exemple plus simple et la règle de trois : on garde deux versions
> simples et on factorise au troisième cas. Mon rôle est de faire
> progresser le jugement technique de l'équipe, pas seulement de faire
> accepter mon implémentation. »

**À relire** : [Principes de conception : DRY, WET et AHA](../../knowledge/principes-conception.md#dry-wet-et-aha), [Principes de conception : YAGNI et règle de trois](../../knowledge/principes-conception.md#yagni-et-regle-de-trois), [Qualité : Prouver chaque remarque](../../knowledge/qualite.md#prouver-chaque-remarque)

---

## Exercice 13. Question de synthèse : mes 90 premiers jours

### Énoncé

« Si tu es recruté comme Staff Engineer, que fais-tu pendant les trois
premiers mois ? »

### Corrigé attendu

#### Jours 1 à 30 : Comprendre

-   Rencontrer les équipes, responsables techniques, produit,
    plateforme, sécurité et opérations.
-   Cartographier les systèmes et les flux de livraison.
-   Comprendre les irritants récurrents et les initiatives en cours.
-   Examiner les signaux existants : incidents, <span class="term" data-term="lead-time">lead time</span>, pipeline,
    défauts et dette technique.
-   Ne pas lancer immédiatement une refonte générale.
-   Livrer une petite victoire visible, par exemple un tableau de bord
    des tests instables par équipe : ça coûte peu et ça donne de la
    crédibilité pour la suite.

**Livrable :** un document court et partageable (problèmes, risques,
forces, hypothèses à vérifier), envoyé aux équipes avec une question
simple : « qu'est-ce que j'ai mal compris ? ». Les corrections reçues
sont aussi précieuses que le diagnostic lui-même, et les équipes se
sentent associées dès le début.

#### Jours 31 à 60 : Prioriser et expérimenter

-   Choisir un ou deux problèmes transverses ayant un impact
    démontrable.
-   Définir une mesure de référence et un résultat attendu.
-   Co-construire une solution avec les équipes concernées.
-   Lancer une expérimentation limitée, réversible et documentée.
-   Clarifier la propriété et la maintenance de la solution.

**Livrable :** un plan priorisé, avec hypothèses, responsables, mesures
et expérimentation.

#### Jours 61 à 90 : Démontrer et diffuser

-   Comparer les résultats à la référence.
-   Corriger les problèmes d'adoption ou les coûts cachés.
-   Documenter le modèle réutilisable.
-   Organiser le partage avec d'autres équipes.
-   Proposer la suite à partir des résultats, pas d'un plan figé.

**Livrable :** résultats observés, décisions prises et feuille de route
mise à jour.

#### Réponse orale possible

> « Le premier mois, je cherche à comprendre les systèmes, les personnes
> et les vrais points de friction. Je livre une petite victoire visible
> et je fais relire mon diagnostic par les équipes en leur demandant ce
> que j'ai mal compris. Le deuxième, je sélectionne avec les équipes un
> ou deux problèmes transverses et je lance une expérimentation
> mesurable. Le troisième, je partage les résultats et je décide avec
> les parties prenantes de généraliser, d'adapter ou d'arrêter. Je veux
> construire de la confiance et démontrer un impact, pas multiplier les
> standards sans preuve. »

**À relire** : [Culture d'entreprise : Les archétypes staff+](../../knowledge/culture-entreprise.md#les-archetypes-staff), [Culture d'entreprise : Cartographie du flux de valeur](../../knowledge/culture-entreprise.md#cartographie-du-flux-de-valeur), [Livraison : Mesurer la livraison : DORA](../../knowledge/livraison.md#mesurer-la-livraison-dora), [Culture d'entreprise : Les 90 premiers jours dans un nouveau rôle](../../knowledge/culture-entreprise.md#les-90-premiers-jours-dans-un-nouveau-role)

---

## Grille de préparation pour un exercice en direct

Avant de conclure une réponse, je vérifie que j'ai abordé :

-   [ ] **Problème** : ai-je clarifié le besoin et les contraintes ?
-   [ ] **Hypothèses** : ai-je indiqué ce que je dois vérifier ?
-   [ ] **Solution minimale** : ai-je proposé une approche concrète et
    compréhensible ?
-   [ ] **Risques** : ai-je parlé des erreurs, de la sécurité, de la
    concurrence ou de l'exploitation quand c'est pertinent ?
-   [ ] **Tests** : ai-je expliqué comment prouver que la solution
    fonctionne ?
-   [ ] **Mesure** : ai-je défini comment vérifier le résultat ?
-   [ ] **Adoption** : ai-je pensé aux équipes qui devront utiliser et
    maintenir la solution ?
-   [ ] **Compromis** : ai-je reconnu les limites et les alternatives ?

### Si je bloque pendant l'entretien

Je peux verbaliser :

> « Je vais commencer par clarifier les contraintes, puis proposer une
> solution simple. Je vais ensuite examiner les cas limites et les
> compromis avant de parler d'optimisation. »

C'est préférable à une réponse précipitée. Pour un Staff Engineer, la
qualité du raisonnement, la gestion de l'incertitude et la capacité à
rendre la décision compréhensible comptent autant que la solution
finale.

### Priorité de révision si je manque de temps

1.  Revue de code et sécurité.
2.  Stratégie de tests et CI/CD.
3.  Idempotence, transactions et gestion des erreurs.
4.  Étude de cas sur un goulot d'étranglement qualité.
5.  Métriques DORA et prévention des effets pervers.
6.  Incident de production.
7.  Influence transverse et adoption.
8.  Performance SQL et arbitrage monolithe/microservices.
9.  Plan des 90 premiers jours.

L'objectif n'est pas de réciter ces réponses mot pour mot. Je les utilise
comme structures, puis je les relie à mes expériences réelles : code en
production, outillage qualité, accompagnement des équipes et adoption de
standards. Les questions d'entretien qui vont avec sont dans
[Entretien Staff Engineer : les questions](questions.md).

## Mesurer le succès

Je sais que mon entraînement marche quand je tiens le temps et que je couvre la grille, pas quand je connais les corrigés par cœur. Avant de commencer, je note une base : je fais trois exercices à voix haute, chronométrés, et je compte combien de points de la [grille de préparation](#grille-de-preparation-pour-un-exercice-en-direct) j'ai abordés sans regarder. Je refais la même mesure sur trois autres exercices une semaine plus tard. La métrique garde-fou est la durée : un exercice de quarante minutes où je passe trente minutes sur la première idée laisse de côté les tests et les compromis.

| Solution | Indicateur de succès (<span class="term" data-term="sli">SLI</span>) | <span class="term" data-term="slo">SLO</span> probable | <span class="term" data-term="sla">SLA</span> probable |
|---|---|---|---|
| poser des questions de cadrage avant de répondre | part des exercices où je pose au moins deux questions avant de proposer | 100 % des exercices | sans objet : pas de contrat externe |
| suivre la grille de préparation | nombre de points de la grille abordés sans notes, sur 8 | au moins 7 sur 8 | sans objet : pas de contrat externe |
| écrire le code en direct | part des exercices de code où le code proposé tourne et a au moins un test | au moins 4 exercices de code sur 5 | sans objet : pas de contrat externe |
| tenir le temps | durée d'un exercice fait à voix haute | 30 à 40 minutes, réponse orale comprise | sans objet : pas de contrat externe |
| finir par un exemple vécu | part des exercices conclus par un cas réel | au moins 3 sur 4 | sans objet : pas de contrat externe |

[À prendre avec précaution : ordres de grandeur d'exemple, à ajuster selon le format annoncé par l'intervieweur]

## Pièges à éviter

| Piège | Ce qui se passe | Solution |
| --- | --- | --- |
| **Foncer sur le code** : j'écris la solution dès la fin de l'énoncé. | Je résous un problème que l'intervieweur n'a pas posé, et je découvre la contrainte clé trop tard. | Je pose deux ou trois questions de cadrage d'abord ([comment utiliser ce document](#comment-utiliser-ce-document)). |
| **Corriger seulement le local** : je répare la fonction vulnérable et je m'arrête là. | Le même motif reste dans les autres dépôts, et l'intervieweur attend la vue Staff. | Je cherche le motif partout et j'ajoute une règle automatique qui le bloque ([exercice 1](#exercice-1-revue-de-code-fiabilite-securite-et-maintenabilite)). |
| **Optimiser sans mesurer** : j'ajoute un index ou je supprime des tests lents sans chiffre de départ. | Je ne peux pas prouver le gain, et je casse parfois ce que les tests protégeaient. | Je mesure, je lis le plan, je change une chose, je remesure ([exercice 9](#exercice-9-performance-sql-diagnostiquer-avant-doptimiser)). |
| **Chercher puis insérer** : je vérifie l'existence de la clé d'idempotence avant de l'enregistrer. | Deux requêtes simultanées passent le test et créent deux commandes. | Je laisse la contrainte d'unicité arbitrer ([exercice 4](#exercice-4-api-de-creation-idempotence-et-double-soumission)). |
| **Classer les équipes** : j'accepte un tableau qui compare les équipes par déploiements ou par couverture. | Les équipes optimisent le chiffre, pas le système. | Je montre à chaque équipe ses propres courbes, les quatre métriques ensemble ([exercice 6](#exercice-6-dora-choisir-les-metriques-sans-creer-de-mauvais-comportements)). |
| **Chercher le coupable pendant l'incident** : je laisse l'équipe débattre du commit fautif. | Le service reste dégradé pendant qu'on cherche qui a cassé. | Je fais atténuer d'abord, avec des rôles nommés ([exercice 7](#exercice-7-incident-de-production-que-fait-le-staff-engineer)). |
| **Imposer le standard** : je rends le quality gate bloquant partout le premier jour. | Les équipes réticentes le contournent et je perds leur confiance. | Je commence par une équipe volontaire, en mode informatif ([exercice 8](#exercice-8-faire-adopter-un-standard-sans-autorite-hierarchique)). |
