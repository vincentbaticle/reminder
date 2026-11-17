# Entretien QA Engineer : exercices en direct

!!! warning "Avertissement"
    Ces notes sont des pense-bêtes personnels, pas une source de vérité. Elles reflètent ma compréhension et mes choix : leur contenu reste subjectif, malgré les citations et les références qu'il contient. Il peut être incomplet, simplifié, inexact ou dépassé. Vérifiez toujours dans la documentation officielle avant de l'appliquer. Ce contenu est fourni tel quel, sans aucune garantie : son utilisation se fait sous votre seule responsabilité.

!!! audience "Pour qui, pour quoi"
    - **Métiers** : QA Engineer, testeur ou testeuse, ingénieur en automatisation des tests (SDET), QA lead, développeur qui vise un poste orienté qualité.
    - **Usages** : on me demande en direct de lister les cas de test d'un formulaire de dates et je veux une méthode qui tient en dix minutes ; je dois réparer un test Playwright instable devant le recruteur ; on me donne un signalement client et je dois écrire le rapport de bug ; je dois recommander un go ou un no-go à partir d'une situation de release.

Exercices pratiques avec corrigés détaillés. Cette page complète [les questions d'entretien](questions.md) : il n'existe pas de réponse unique, mais des **réponses de référence concrètes** (cas de test, code, rapports et formulation orale) qui me servent de structure.

Le poste visé demande de concevoir et d'écrire des tests, de trouver des bugs et de les rapporter, d'automatiser au bon niveau et d'aider l'équipe à décider de livrer. Les exercices couvrent donc des techniques de conception de tests, du code (Playwright en TypeScript, <span class="term" data-term="pytest">pytest</span>, k6, SQL), des revues et des décisions.

## Comment utiliser cette page

En entretien en direct, le recruteur regarde surtout **comment** je cherche, pas seulement ce que je trouve. Pour chaque exercice :

1. Je lis l'énoncé sans regarder le corrigé.
2. **Je pose deux ou trois questions avant de répondre** : « qui sont les utilisateurs ? », « quelle est la règle exacte ? », « qu'est-ce qui est déjà testé ? ». Un QA qui commence par questionner la spécification montre déjà son métier.
3. **Je pense à voix haute** : je nomme la technique que j'applique (« je fais des <span class="term" data-term="equivalence-partitioning">partitions d'équivalence</span>, puis les valeurs limites »), puis je dis ce que je vérifie et pourquoi, même pendant que j'écris du code.
4. Je commence par les cas les plus risqués, puis j'élargis. Je dis aussi ce que je ne testerais pas, et pourquoi.
5. Pour le code, je donne une version simple qui marche, puis je précise ses limites (stabilité, données, parallélisme).
6. **Je termine par un exemple vécu** : « dans mon poste actuel, j'ai eu un bug proche... ». Les corrigés sont théoriques, c'est l'expérience qui fait la différence.

Les exemples de code sont volontairement petits pour être réalisables en entretien. Les noms de services, d'URL et de données sont fictifs. La syntaxe des outils est à vérifier selon leur version.

## Exercice 1. Concevoir les tests d'un champ de période de réservation

### Énoncé

Un site de location de vélos propose un formulaire avec une date de début et une date de fin. Règles données par le PO :

- la date de début ne peut pas être dans le passé ;
- la location dure de 1 à 14 jours inclus ;
- la réservation se fait au plus 90 jours à l'avance.

Je dois lister les cas de test que je proposerais, et écrire les tests de la fonction de validation.

### Corrigé attendu

#### 1. Questions à poser d'abord

- « 1 à 14 jours » : une location du lundi au lundi dure-t-elle 7 ou 8 jours ? La date de fin est-elle incluse ?
- « Pas dans le passé » : aujourd'hui est-il autorisé ? Dans quel fuseau horaire est calculé « aujourd'hui » ?
- Que se passe-t-il si la date de fin est avant la date de début ?
- La règle est-elle vérifiée côté serveur, et pas seulement dans le navigateur ?

Pour la suite, je suppose la réponse : la date de fin est incluse (du 1er au 1er = 1 jour), aujourd'hui est autorisé, le fuseau est celui de l'agence (Europe/Paris).

#### 2. Partitions d'équivalence

Une partition d'équivalence est un groupe de valeurs que le système doit traiter de la même façon : une seule valeur du groupe suffit à le représenter. Par exemple, un début à J+10 représente tous les débuts entre aujourd'hui et J+90.

| Paramètre | Partition valide | Partitions invalides |
|---|---|---|
| Début | aujourd'hui à J+90 | passé, au-delà de J+90 |
| Durée | 1 à 14 jours | 0 ou négatif (fin avant début), 15 jours et plus |
| Format | deux dates valides | date vide, date impossible (31/02), texte |

#### 3. Valeurs limites

Avec la <span class="term" data-term="boundary-value">méthode à trois valeurs</span> autour de chaque frontière :

| Frontière | Valeurs testées | Attendu |
|---|---|---|
| Début au plus tôt | hier, aujourd'hui, demain | refus, accepté, accepté |
| Début au plus tard | J+89, J+90, J+91 | accepté, accepté, refus |
| Durée minimale | fin = début moins 1 jour, fin = début, fin = début plus 1 jour | refus, accepté (1 jour), accepté (2 jours) |
| Durée maximale | 13, 14, 15 jours | accepté, accepté, refus |

#### 4. Cas propres aux dates

- Une période qui traverse le changement d'heure (fin mars, fin octobre).
- Une période qui traverse le 29 février d'une année bissextile.
- Une période à cheval sur deux années (du 28 décembre au 3 janvier).
- Un utilisateur dans un autre fuseau horaire, à 23 h 30 heure de Paris : « aujourd'hui » n'est pas le même jour pour lui.

#### 5. Table de décision et transitions d'état

Une <span class="term" data-term="decision-table">table de décision</span> croise les conditions et donne le résultat attendu pour chaque combinaison utile ; chaque colonne devient un cas de test. « - » veut dire « peu importe pour cette règle ».

| Condition / résultat | R1 | R2 | R3 | R4 |
|---|---|---|---|---|
| Début dans le passé | oui | non | non | non |
| Durée de 1 à 14 jours | - | non | oui | oui |
| Début au plus tard à J+90 | - | - | non | oui |
| Résultat attendu | refus `start_in_past` | refus `too_long` ou `end_before_start` | refus `too_far_ahead` | accepté |

Les <span class="term" data-term="state-transition">transitions d'état</span> testent ce que la réservation devient après sa validation. Trois transitions valides, et une interdite à tester aussi :

| État de départ | Événement | État d'arrivée |
|---|---|---|
| Brouillon | dates valides et paiement accepté | Confirmée |
| Confirmée | annulation avant la date de début | Annulée |
| Confirmée | date de fin dépassée | Terminée |

Transition interdite : une réservation annulée qui reçoit un paiement doit rester annulée (et le paiement être refusé ou remboursé).

#### 6. Les tests de la fonction de validation

Je suppose une fonction `validate_booking(start, end, today)` qui renvoie une liste d'erreurs vide si la période est valide. L'erreur classique est de laisser la fonction lire la date réelle : le test passe aujourd'hui et casse le jour où J+90 tombe sur une autre frontière.

``` { .python .ex-bad title="À éviter" }
from datetime import date, timedelta

from booking.rules import validate_booking


# À éviter : la date réelle, donc le résultat change selon le jour où la CI tourne
def test_booking_ninety_days_ahead():
    start = date.today() + timedelta(days=90)
    assert validate_booking(start, start) == []
```

Passer `today` en paramètre rend le test indépendant de la date réelle. `@pytest.mark.parametrize` exécute la même fonction de test une fois par ligne de la liste : ici sept cas, sept résultats séparés dans le rapport, chacun nommé par son `id`.

``` { .python .ex-good title="Recommandé" }
from datetime import date, timedelta

import pytest

from booking.rules import validate_booking

TODAY = date(2026, 10, 23)


# Bien : une aide qui exprime chaque date par rapport à un jour fixe
def d(days: int) -> date:
    return TODAY + timedelta(days=days)


# Bien : un cas par partition et par valeur limite, chacun nommé par son id
@pytest.mark.parametrize(
    ("start", "end", "expected_error"),
    [
        pytest.param(d(-1), d(0), "start_in_past", id="debut-hier"),
        pytest.param(d(0), d(0), None, id="debut-aujourdhui-1-jour"),
        pytest.param(d(90), d(90), None, id="debut-j90"),
        pytest.param(d(91), d(91), "too_far_ahead", id="debut-j91"),
        pytest.param(d(5), d(4), "end_before_start", id="fin-avant-debut"),
        pytest.param(d(1), d(14), None, id="duree-14-jours"),
        pytest.param(d(1), d(15), "too_long", id="duree-15-jours"),
    ],
)
def test_validate_booking(start, end, expected_error):
    errors = validate_booking(start, end, today=TODAY)

    if expected_error is None:
        assert errors == []
    else:
        assert expected_error in errors


# Bien : un piège propre aux dates, avec un jour du calendrier fixé
def test_booking_across_leap_day_counts_29_february():
    errors = validate_booking(date(2028, 2, 20), date(2028, 3, 4), today=date(2028, 2, 1))

    assert errors == []
```

Le dernier test vérifie qu'une location du 20 février au 4 mars 2028 dure 14 jours, 29 février compris, donc reste acceptée.

#### Ce qu'un QA Engineer doit ajouter

- Le même jeu de cas doit être rejoué **sur l'API**, pas seulement sur la fonction : un contrôle seulement dans le navigateur se contourne.
- Un seul E2E suffit pour vérifier que l'erreur s'affiche à côté du bon champ et qu'elle est lisible par un <span class="term" data-term="screen-reader">lecteur d'écran</span>.
- Les réponses du PO aux questions de départ vont dans les <span class="term" data-term="acceptance-criteria">critères d'acceptation</span>, pour que personne n'ait à les redemander.

#### Réponse orale possible

> « Je commencerais par lever les ambiguïtés : la date de fin est-elle incluse, et dans quel fuseau calcule-t-on aujourd'hui ? Ensuite je découperais en partitions d'équivalence, valides et invalides, et j'ajouterais les valeurs limites autour de chaque frontière : hier, aujourd'hui, J+90, J+91, 14 et 15 jours. J'ajouterais les pièges propres aux dates : changement d'heure, 29 février, fuseau de l'utilisateur. J'écrirais ces cas en tests unitaires <span class="term" data-term="parametrized-test">paramétrés</span>, avec une date du jour injectée pour qu'ils ne dépendent pas du calendrier, puis je rejouerais les principaux sur l'API. »

**À relire** : [Partitions d'équivalence et valeurs limites](../../knowledge/conception-tests.md#partitions-dequivalence-et-valeurs-limites), [Table de décision](../../knowledge/conception-tests.md#table-de-decision), [Transitions d'état](../../knowledge/conception-tests.md#transitions-detat), [pytest](../../knowledge/outils.md#pytest)

## Exercice 2. Rédiger un rapport de bug à partir d'un signalement

### Énoncé

Le support transmet ce message d'un client :

> « Bonjour, j'ai voulu payer ma commande hier soir et ça a planté. J'ai réessayé et maintenant j'ai été débité deux fois ! Votre site est nul. »

En le reproduisant sur l'environnement de test, j'observe : sur la page de paiement, si on clique deux fois rapidement sur « Payer », deux requêtes `POST /payments` partent, et deux paiements sont enregistrés pour la même commande. Je dois rédiger le rapport de bug.

### Corrigé attendu

#### 1. Ce qu'il faut vérifier avant d'écrire

- **Reproduction minimale** : le double clic suffit-il, ou faut-il une erreur réseau ? Le bug apparaît-il aussi en rechargeant la page pendant le paiement, ou avec le bouton retour ?
- **Côté serveur ou côté client** : le bouton devrait se désactiver après le premier clic (client), mais surtout le serveur ne devrait jamais accepter deux paiements pour la même commande. Envoyer deux requêtes identiques avec un outil (curl, test d'API) montre si le serveur protège.
- **Impact** : de l'argent débité deux fois. Combien de cas en production ? Les logs ou la base peuvent le dire (voir l'exercice 8).

#### 2. Le rapport

Le rapport rempli, avec des données fictives :

``` { .markdown .ex-illus title="Illustration" }
Titre : Double débit quand on clique deux fois rapidement sur "Payer"

Environnement : intégration, front 4.2.0, payments-service 2.7.1,
Chrome 130 et Firefox 131
Sévérité proposée : critique (argent débité deux fois)
Fréquence : 10 essais sur 10 avec deux clics à moins de 300 ms d'écart

Étapes
1. Se connecter avec ada@example.test
2. Ajouter un article au panier, aller au paiement
3. Saisir la carte de test 4242 4242 4242 4242
4. Cliquer deux fois rapidement sur "Payer"

Attendu : un seul paiement enregistré, le second clic est ignoré
Obtenu : deux paiements de 40,00 € enregistrés pour la commande 9812

Isolation
- Le bouton reste actif pendant le traitement du premier paiement.
- Deux requêtes POST /payments identiques envoyées avec curl :
  deux paiements créés. Le serveur ne protège pas contre la répétition.
- Même résultat en rechargeant la page pendant le paiement.

Preuves : trace Playwright, X-Request-Id a81f et a820, extrait de la
table payments joint.

Signalement d'origine : ticket support du client, débit double hier soir.
```

#### 3. Ce qui fait la qualité de ce rapport

- Le titre dit quoi et dans quelle condition, sans jugement.
- Les étapes sont minimales, avec les données exactes.
- La section « Isolation » prouve que le vrai problème est côté serveur, ce qui oriente la correction : une <span class="term" data-term="idempotency-key">clé d'idempotence</span> ou une contrainte d'unicité sur la commande, pas seulement un bouton désactivé.
- La <span class="term" data-term="bug-severity">sévérité</span> est justifiée par l'impact, et le lien avec le client réel permet au support de lui répondre.

La sévérité mesure l'impact du bug ; la <span class="term" data-term="bug-priority">priorité</span> dit dans quel ordre le corriger, et c'est le PO qui la fixe. Une échelle courante à quatre niveaux :

| Sévérité | Ce que ça veut dire | Exemple |
|---|---|---|
| Critique | perte d'argent ou de données, faille, service arrêté | double débit de ce rapport |
| Majeur | fonction importante cassée, un contournement existe | tri par prix inversé, on peut trier par pertinence |
| Mineur | gêne sans bloquer personne | faute dans un e-mail de confirmation |
| Cosmétique | défaut visuel seulement | icône décalée de quelques pixels |

Les deux axes ne vont pas toujours ensemble : un plantage dans un écran d'administration utilisé une fois par an est majeur mais de priorité basse ; le nom de la marque mal écrit sur la page d'accueil est cosmétique mais de priorité haute.

#### Ce qu'un QA Engineer doit ajouter

- Prévenir tout de suite le PO et l'équipe : un bug qui débite deux fois de l'argent en production ne doit pas attendre le prochain triage.
- Proposer de chercher les autres clients touchés en base, et de les rembourser.
- Proposer un test d'API de non-régression : deux requêtes simultanées pour la même commande, un seul paiement attendu.

#### Réponse orale possible

> « Avant d'écrire, je chercherais la reproduction minimale et je vérifierais si le serveur protège, en envoyant deux requêtes identiques sans passer par le navigateur. Ici il ne protège pas, donc désactiver le bouton ne suffirait pas. J'écrirais un titre factuel, des étapes minimales, l'attendu et l'obtenu, une section d'isolation qui pointe le serveur, et une sévérité critique. Comme de l'argent est débité deux fois en production, je préviendrais l'équipe tout de suite, sans attendre le triage. »

**À relire** : [Le rapport de bug](../../knowledge/conception-tests.md#le-rapport-de-bug), [Sévérité et priorité](../../knowledge/conception-tests.md#severite-et-priorite), [Les méthodes HTTP](../../knowledge/api-rest-async.md#les-methodes-http), [Idempotence](../../knowledge/architecture.md#idempotence)

## Exercice 3. Réparer un test Playwright instable

### Énoncé

Ce test échoue environ une fois sur cinq en CI, jamais en local. Je dois trouver les causes d'instabilité et proposer une version corrigée.

``` { .typescript .ex-bad title="À éviter" }
import { test, expect } from '@playwright/test';

// À éviter : pause fixe, lectures uniques, données du catalogue partagé et sélecteurs CSS
test('rechercher un produit et l\'ajouter au panier', async ({ page }) => {
  await page.goto('https://staging.shop.example.test');
  await page.fill('#search', 'mug');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);
  const results = await page.$$('.product-card');
  expect(results.length).toBe(12);
  await page.click('.product-card:first-child .add-btn');
  const count = await page.textContent('.cart-count');
  expect(count).toBe('1');
});
```

### Corrigé attendu

#### 1. Les causes d'instabilité

| Ligne | Problème | Pourquoi c'est instable |
|---|---|---|
| `waitForTimeout(3000)` | attente fixe | en CI, la recherche peut prendre plus de 3 s ; en local elle est plus rapide |
| `$$('.product-card')` puis `length` | lecture unique, sans attente | si les résultats arrivent en deux temps, on compte trop tôt |
| `toBe(12)` | dépend des données | un produit ajouté ou retiré du catalogue de staging casse le test |
| `textContent('.cart-count')` | lecture unique | le compteur se met à jour après la réponse de l'API, le test lit trop tôt |
| `:first-child` | dépend de l'ordre | l'ordre des résultats peut changer (tri par popularité) |
| URL en dur | dépend de l'environnement | impossible de lancer le test ailleurs |
| sélecteurs CSS | fragiles | un changement de classe casse le test sans changement de comportement |

#### 2. La version corrigée

``` { .typescript .ex-good title="Recommandé" }
import { test, expect } from '@playwright/test';

// Bien : données propres au test, sélecteurs par rôle et assertions qui réessaient
test('rechercher un produit et l\'ajouter au panier', async ({ page, request }) => {
  await request.post('/api/test/products', {
    data: { sku: 'MUG-QA-001', name: 'Mug test QA' },
  });

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Rechercher' }).fill('Mug test QA');
  await page.getByRole('searchbox', { name: 'Rechercher' }).press('Enter');

  const card = page.getByRole('article').filter({ hasText: 'Mug test QA' });
  await expect(card).toHaveCount(1);

  await card.getByRole('button', { name: 'Ajouter au panier' }).click();

  await expect(page.getByTestId('cart-count')).toHaveText('1');
});
```

Ce qui a changé :

- L'URL vient de `baseURL` dans la configuration, donc le test tourne sur n'importe quel environnement.
- Le test crée son propre produit par l'API : il ne dépend plus du catalogue ni de l'ordre des résultats (<span class="term" data-term="test-data">données de test</span> isolées).
- Plus aucune attente fixe : `expect(...).toHaveCount()` et `toHaveText()` réessaient jusqu'au délai configuré, c'est l'<span class="term" data-term="auto-wait">attente automatique</span> de Playwright.
- Les <span class="term" data-term="selector">sélecteurs</span> utilisent le rôle et le libellé, plus stables et qui vérifient au passage l'accessibilité.

#### 3. Valider la correction

``` { .bash .ex-ref title="Référence" }
# Exemple : rejouer le test 50 fois sur 4 workers pour vérifier qu'il ne vacille plus
npx playwright test search.spec.ts --repeat-each=50 --workers=4
```

Si les 50 exécutions passent, le test peut sortir de <span class="term" data-term="test-quarantine">quarantaine</span>. Pour diagnostiquer un échec restant, j'active `trace: 'on-first-retry'` dans `playwright.config.ts` et j'ouvre la trace avec `npx playwright show-trace`.

#### Ce qu'un QA Engineer doit ajouter

- Vérifier que l'échec n'était pas un vrai bug : si la trace montre une erreur 500 de l'API de recherche, c'est le produit qui est instable, pas le test.
- Supprimer le produit de test à la fin, ou utiliser un nom unique, pour que les exécutions parallèles ne se gênent pas.
- Ne pas « corriger » en augmentant `waitForTimeout` ou en ajoutant `retries: 3` : cela cache le problème.

#### Réponse orale possible

> « Je vois trois familles de causes : des attentes fixes et des lectures uniques au lieu des assertions qui réessaient, une dépendance au catalogue et à l'ordre des résultats, et des sélecteurs CSS fragiles. Je créerais les données du test par l'API, j'utiliserais `getByRole` et des `expect` qui attendent, et je retirerais l'URL en dur. Je validerais avec `--repeat-each=50`, et je regarderais la trace d'un ancien échec pour m'assurer qu'il ne cachait pas un vrai bug. »

**À relire** : [Stratégie face à un test instable](../../knowledge/qualite.md#strategie-face-a-un-test-instable), [Causes d'instabilité qui ne sont pas des bugs de test](../../knowledge/qualite.md#causes-dinstabilite-qui-ne-sont-pas-des-bugs-de-test), [Playwright, Cypress, Selenium](../../knowledge/outils.md#playwright-cypress-selenium), [Le vocabulaire des tests](../../knowledge/qualite.md#le-vocabulaire-des-tests), [Données de test : Builder, Object Mother, isolation](../../knowledge/conception-tests.md#donnees-de-test-builder-object-mother-isolation), [Mettre en quarantaine sans bloquer](../../knowledge/qualite.md#mettre-en-quarantaine-sans-bloquer)

## Exercice 4. Écrire des tests d'API avec pytest

### Énoncé

L'API `my-api` expose :

- `POST /users` : crée un utilisateur. Corps : `email` (obligatoire, unique), `name` (obligatoire, 1 à 50 caractères). Réponse `201` avec `id`, `email`, `name`.
- `GET /users/{id}` : renvoie l'utilisateur, `404` s'il n'existe pas.
- Les deux routes demandent un jeton (`Authorization: Bearer ...`).

Je dois écrire une suite pytest : <span class="term" data-term="test-fixture">fixtures</span>, cas nominal, cas d'erreur paramétrés, authentification.

### Corrigé attendu

#### 1. Organisation

``` { .text .ex-illus title="Illustration" }
tests/
├── conftest.py        # fixtures : client, jeton, utilisateur unique
└── test_users.py      # les tests
```

#### 2. Les fixtures

Une fixture est une fonction marquée `@pytest.fixture` qui prépare une ressource. Un test la reçoit en déclarant un paramètre du même nom : pytest voit le nom, appelle la fixture et passe le résultat.

``` { .python .ex-illus title="Illustration" }
import pytest


# Exemple : une fixture qui prépare un panier vide
@pytest.fixture
def cart():
    return {"items": [], "total_cents": 0}


# Exemple : le test reçoit la fixture en déclarant un paramètre du même nom
def test_empty_cart_total_is_zero(cart):
    assert cart["total_cents"] == 0
```

L'erreur classique est de mettre le secret dans le code et de demander un jeton dans chaque test : le secret part dans l'historique Git, et la suite appelle le serveur d'authentification des centaines de fois.

``` { .python .ex-bad title="À éviter" }
import httpx


# À éviter : secret en dur et nouveau jeton à chaque test
def test_get_user():
    token = httpx.post(
        "https://my-api.example.test/auth/token",
        data={"client_id": "qa", "client_secret": "s3cr3t"},
    ).json()["access_token"]
    response = httpx.get(
        "https://my-api.example.test/users/42",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
```

Les fixtures de la suite, mises dans `conftest.py` pour être visibles de tous les fichiers de tests :

``` { .python .ex-good title="Recommandé" }
# tests/conftest.py
import os
import uuid

import httpx
import pytest

BASE_URL = os.environ["API_BASE_URL"]


# Bien : un jeton par session, secrets lus dans l'environnement
@pytest.fixture(scope="session")
def token() -> str:
    response = httpx.post(
        f"{BASE_URL}/auth/token",
        data={
            "client_id": os.environ["TEST_CLIENT_ID"],
            "client_secret": os.environ["TEST_CLIENT_SECRET"],
        },
    )
    response.raise_for_status()
    return response.json()["access_token"]


# Bien : un client authentifié, fermé proprement après le test
@pytest.fixture
def api(token):
    with httpx.Client(
        base_url=BASE_URL, headers={"Authorization": f"Bearer {token}"}, timeout=10
    ) as client:
        yield client


# Bien : un client sans jeton pour les tests d'authentification
@pytest.fixture
def anonymous_api():
    with httpx.Client(base_url=BASE_URL, timeout=10) as client:
        yield client


# Bien : un e-mail unique par test, pour paralléliser sans collision
@pytest.fixture
def unique_email() -> str:
    return f"grace+{uuid.uuid4().hex[:8]}@example.test"
```

- Le jeton est obtenu une fois par session (`scope="session"`), pas à chaque test.
- Les <span class="term" data-term="secret">secrets</span> viennent de variables d'environnement, jamais du code.
- Chaque test reçoit un e-mail unique : les tests peuvent tourner en parallèle sans collision.

#### 3. Les tests

``` { .python .ex-good title="Recommandé" }
# tests/test_users.py
import pytest


# Bien : le cas nominal vérifie la réponse puis relit la ressource créée
def test_create_user_returns_201_and_can_be_read(api, unique_email):
    created = api.post("/users", json={"email": unique_email, "name": "Grace"})

    assert created.status_code == 201
    body = created.json()
    assert body["email"] == unique_email
    assert body["name"] == "Grace"
    assert api.get(f"/users/{body['id']}").json() == body


# Bien : les entrées invalides dans un seul test paramétré, un id par cas
@pytest.mark.parametrize(
    ("payload_update", "reason"),
    [
        pytest.param({"email": None}, "email manquant", id="email-manquant"),
        pytest.param({"email": "pas-un-email"}, "format", id="email-invalide"),
        pytest.param({"name": ""}, "nom vide", id="nom-vide"),
        pytest.param({"name": "a" * 51}, "nom trop long", id="nom-51-caracteres"),
    ],
)
def test_create_user_rejects_invalid_payload(api, unique_email, payload_update, reason):
    payload = {"email": unique_email, "name": "Grace"} | payload_update
    payload = {key: value for key, value in payload.items() if value is not None}

    response = api.post("/users", json=payload)

    assert response.status_code == 422, reason


# Bien : la valeur limite haute acceptée
def test_name_of_50_characters_is_accepted(api, unique_email):
    response = api.post("/users", json={"email": unique_email, "name": "a" * 50})

    assert response.status_code == 201


# Bien : la règle d'unicité
def test_duplicate_email_is_rejected(api, unique_email):
    api.post("/users", json={"email": unique_email, "name": "Grace"})

    response = api.post("/users", json={"email": unique_email, "name": "Ada"})

    assert response.status_code == 409


# Bien : la ressource absente
def test_unknown_user_returns_404(api):
    assert api.get("/users/00000000-0000-0000-0000-000000000000").status_code == 404


# Bien : l'authentification sur les deux routes
@pytest.mark.parametrize(
    ("method", "path"), [("post", "/users"), ("get", "/users/any-id")]
)
def test_routes_require_a_token(anonymous_api, method, path):
    response = getattr(anonymous_api, method)(path)

    assert response.status_code == 401
```

#### 4. Ce que la suite couvre

| Catégorie | Tests |
|---|---|
| Nominal | création puis relecture |
| Valeurs limites | nom de 50 caractères accepté, 51 refusé, nom vide refusé |
| Entrées invalides | e-mail manquant, e-mail mal formé |
| Règle métier | e-mail en double refusé (`409`) |
| Ressource absente | `404` |
| Authentification | `401` sans jeton sur les deux routes |

#### Ce qu'un QA Engineer doit ajouter

- Un test d'autorisation si les utilisateurs ne doivent voir que leur propre fiche : c'est la faille <span class="term" data-term="bola">BOLA</span>.
- La validation du schéma de réponse contre le fichier <span class="term" data-term="openapi">OpenAPI</span>, si l'équipe en maintient un.
- Le nettoyage des utilisateurs créés, ou un environnement remis à zéro régulièrement.
- Un test de deux créations simultanées avec le même e-mail, pour vérifier que l'unicité tient sous concurrence.

#### Réponse orale possible

> « Je mettrais les fixtures dans `conftest.py` : un jeton obtenu une fois par session, un client authentifié, un client anonyme et un e-mail unique par test pour pouvoir paralléliser. J'écrirais le cas nominal avec relecture, puis un test paramétré pour les entrées invalides, avec les valeurs limites de la longueur du nom. J'ajouterais la règle d'unicité, le 404 et le 401. Les secrets viendraient de variables d'environnement. Ensuite je compléterais avec un test d'autorisation entre deux utilisateurs. »

**À relire** : [pytest](../../knowledge/outils.md#pytest), [Tester une API REST](../../knowledge/api-rest-async.md#tester-une-api-rest), [Les codes de réponse](../../knowledge/api-rest-async.md#les-codes-de-reponse), [Les failles les plus courantes des API](../../knowledge/securite.md#les-failles-les-plus-courantes-des-api), [Les secrets](../../knowledge/securite.md#les-secrets)

## Exercice 5. Écrire un test de charge avec k6

### Énoncé

L'équipe veut savoir si l'API de catalogue tient le pic attendu du Black Friday : 300 utilisateurs simultanés, qui consultent la liste des produits, ouvrent une fiche, et pour un tiers d'entre eux ajoutent un produit au panier. Objectif : 95 % des requêtes en moins de 400 ms, moins de 1 % d'erreurs. Je dois écrire le script k6.

### Corrigé attendu

#### 1. Questions à poser d'abord

- Sur quel environnement ? Il doit être dimensionné comme la production, et les autres équipes doivent être prévenues.
- Le pic arrive-t-il progressivement ou d'un coup à minuit ?
- Faut-il un compte par utilisateur virtuel pour le panier ?
- Qui regarde les métriques serveur pendant le test ?

#### 2. Le script

L'erreur classique : 300 utilisateurs virtuels qui bouclent sur la même URL sans temps de réflexion ni seuil. Le test envoie bien plus de requêtes que 300 vraies personnes, ne mesure que le cache d'une page, et passe au vert quel que soit le résultat.

``` { .javascript .ex-bad title="À éviter" }
import http from 'k6/http';

export const options = { vus: 300, duration: '1m' };

// À éviter : une seule URL, aucune pause, aucun seuil, donc rien ne fait échouer le test
export default function () {
  http.get('https://perf.my-api.example.test/products/1');
}
```

``` { .javascript .ex-good title="Recommandé" }
import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL;
const TOKEN = __ENV.TEST_TOKEN;

// Bien : une montée, un plateau, une descente, et des seuils qui font échouer le test
export const options = {
  scenarios: {
    black_friday: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5m', target: 300 },
        { duration: '20m', target: 300 },
        { duration: '3m', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<400'],
    http_req_failed: ['rate<0.01'],
    'http_req_duration{name:add_to_cart}': ['p(95)<600'],
  },
};

// Bien : le vrai parcours, avec des temps de réflexion et des produits variés
export default function () {
  const params = { headers: { Authorization: `Bearer ${TOKEN}` } };

  group('parcourir le catalogue', () => {
    const list = http.get(`${BASE_URL}/products?page=1`, { ...params, tags: { name: 'list' } });
    check(list, { 'liste 200': (r) => r.status === 200 });
    sleep(Math.random() * 2 + 1);

    const productId = Math.floor(Math.random() * 5000) + 1;
    const product = http.get(`${BASE_URL}/products/${productId}`, {
      ...params,
      tags: { name: 'product' },
    });
    check(product, { 'fiche 200': (r) => r.status === 200 });
    sleep(Math.random() * 3 + 2);

    if (Math.random() < 1 / 3) {
      const cart = http.post(
        `${BASE_URL}/cart/items`,
        JSON.stringify({ product_id: productId, quantity: 1 }),
        { headers: { ...params.headers, 'Content-Type': 'application/json' }, tags: { name: 'add_to_cart' } },
      );
      check(cart, { 'panier 201': (r) => r.status === 201 });
    }
  });

  sleep(1);
}
```

Lancement : `k6 run -e BASE_URL=https://perf.my-api.example.test -e TEST_TOKEN=... catalog.js`

#### 3. Les choix expliqués

Un <span class="term" data-term="virtual-user">utilisateur virtuel</span> (VU) est une boucle qui rejoue la fonction `default` sans arrêt, comme un visiteur qui enchaîne les pages : 300 VU, ce sont 300 boucles en parallèle. Les trois `stages` donnent cette courbe :

``` { .text .ex-illus title="Illustration" }
VU
300 |        ______________________
    |       /                      \
    |      /                        \
  0 |_____/                          \_____
    0 min  5 min               25 min  28 min
      montée       plateau        descente
```

| Choix | Raison |
|---|---|
| Montée de 5 minutes | voir à quelle charge la latence commence à monter, au lieu d'un choc instantané |
| Plateau de 20 minutes | laisser le temps aux caches, pools de connexions et files de se stabiliser |
| `sleep` aléatoires | un vrai utilisateur lit la page ; sans temps de réflexion, 300 VU envoient beaucoup plus de requêtes que 300 personnes |
| Identifiant de produit aléatoire | éviter que tout soit servi par le cache d'un seul produit |
| `tags: { name }` | des seuils et des résultats par type de requête |
| <span class="term" data-term="load-threshold">Seuils</span> | `k6 run` se termine en erreur si un objectif n'est pas tenu, la CI peut s'en servir |

#### 4. Lire le résultat

- Regarder le <span class="term" data-term="p95">p95</span> et le p99 par type de requête, pas la moyenne.
- Comparer le moment où la latence monte avec les métriques serveur : CPU, mémoire, connexions à la base, temps des requêtes SQL.
- Vérifier que le <span class="term" data-term="load-generator">générateur de charge</span> n'était pas saturé lui-même (CPU de la machine qui lance k6).

#### Ce qu'un QA Engineer doit ajouter

- Un <span class="term" data-term="smoke-test">test de fumée</span> d'abord (`--vus 2 --duration 1m`) pour valider le script avant de lancer 300 VU.
- Un <span class="term" data-term="stress-test">test de stress</span> ensuite, au-delà de 300, pour connaître la marge.
- Une mesure de référence conservée, pour comparer la prochaine version.

#### Réponse orale possible

> « Je modéliserais le vrai parcours : liste, fiche, et un tiers d'ajouts au panier, avec des temps de réflexion aléatoires et des produits variés pour ne pas tester seulement le cache. J'utiliserais une montée progressive, un plateau de vingt minutes à 300 VU, et des seuils sur le p95 et le taux d'erreur, pour que le test échoue clairement si l'objectif n'est pas tenu. Je lancerais d'abord un test de fumée, et pendant le test je regarderais les métriques serveur avec un développeur, pour savoir pourquoi c'est lent si ça l'est. »

**À relire** : [Test de performance](../../knowledge/qualite.md#test-de-performance), [k6, JMeter, Locust](../../knowledge/outils.md#k6-jmeter-locust), [Latence p95](../../knowledge/observabilite.md#latence-p95)

## Exercice 6. Choisir ce qu'il faut automatiser

### Énoncé

Voici huit cas de test d'une campagne manuelle. J'ai deux semaines pour automatiser. Lesquels j'automatise, à quel niveau, et lesquels je garde au manuel ?

1. Connexion avec un e-mail et un mot de passe valides.
2. Calcul des frais de port pour 30 combinaisons pays et poids.
3. Le nouveau tableau de bord est « agréable à lire » (refait chaque sprint en ce moment).
4. Paiement par carte avec 3-D Secure.
5. Export comptable annuel, lancé une fois par an en janvier.
6. Un client ne peut pas voir la commande d'un autre client.
7. L'e-mail de confirmation de commande contient le bon montant.
8. Le site s'affiche correctement sur un vieux navigateur utilisé par 0,2 % des visiteurs.

### Corrigé attendu

#### 1. Les critères de choix

Pour chaque cas : combien de fois sera-t-il exécuté, quel risque couvre-t-il, la fonctionnalité est-elle stable, combien coûte l'automatisation, et quel est le niveau le plus bas qui le couvre ?

Le niveau d'un test, c'est la part du système qu'il traverse. Le même contrôle des frais de port (cas 2) à trois niveaux, montant et route donnés à titre d'exemple :

| Niveau | Ce que fait le test | Durée | Ce qui peut le casser |
|---|---|---|---|
| Unitaire | appelle `shipping_fee(total_cents=4999, country="FR")` et attend 490 | quelques millisecondes | la règle de calcul |
| API | envoie `POST /cart/quote` et lit `shipping_fee` dans le JSON | environ 100 ms | la règle, la sérialisation, la route |
| E2E | ouvre le navigateur, ajoute un article, lit le montant affiché au panier | plusieurs secondes | tout, y compris un sélecteur renommé |

Plus le niveau est bas, plus le test est rapide et stable : c'est la logique de la <span class="term" data-term="test-pyramid">pyramide de tests</span>.

#### 2. La décision

| Cas | Décision | Niveau | Raison |
|---|---|---|---|
| 1. Connexion | automatiser | E2E (1 test) + API | parcours vital, exécuté à chaque release, stable ; c'est aussi un bon test de fumée |
| 2. Frais de port | automatiser en premier | unitaire paramétré | 30 cas fastidieux à la main, règle précise, s'exécute en une seconde |
| 3. Tableau de bord « agréable » | manuel | <span class="term" data-term="test-charter">charte exploratoire</span> | jugement humain, écran qui change chaque sprint |
| 4. Paiement 3-D Secure | automatiser | E2E avec le bac à sable ou un faux service | risque élevé ; la fenêtre 3-D Secure demande un réglage, mais le parcours rapporte de l'argent |
| 5. Export annuel | manuel, avec une procédure écrite | | une exécution par an, l'automatiser coûte plus que ça ne rapporte ; à revoir si l'export devient mensuel |
| 6. Commande d'un autre client | automatiser | API | faille de sécurité grave, test court et très stable |
| 7. Montant dans l'e-mail | automatiser | API ou intégration (contenu de l'e-mail généré) | vérifier le contenu, pas la boîte de réception ; le vrai envoi se teste à la main de temps en temps |
| 8. Vieux navigateur | ne pas tester, risque accepté et écrit | | 0,2 % des visiteurs ; à rediscuter si le chiffre augmente |

Une charte pour le cas 3, au format « Explorer ... avec ... pour découvrir ... » d'Elisabeth Hendrickson, « Explore It! » (2013) :

``` { .text .ex-illus title="Illustration" }
Explorer      : le tableau de bord, avec un compte de 500 commandes puis un compte vide
Avec          : Chrome sur un écran de 1280 px, puis un téléphone
Pour découvrir: ce qui rend les chiffres difficiles à lire ou trompeurs
Durée         : 60 minutes, notes et captures au fil de l'eau, bilan de 10 minutes
```

#### 3. L'ordre sur les deux semaines

1. Cas 2 et 6 : rapides à écrire, risque élevé, très stables.
2. Cas 1 : connexion, base des autres E2E (session réutilisée).
3. Cas 7 : contenu de l'e-mail.
4. Cas 4 : le plus long à mettre en place, à démarrer en parallèle.

#### Ce qu'un QA Engineer doit ajouter

- Écrire la liste de ce qui n'est pas automatisé et pourquoi : c'est une décision, pas un oubli.
- Proposer aux développeurs d'écrire le cas 2 eux-mêmes : c'est un test unitaire de leur code.
- Revoir la décision du cas 3 quand le tableau de bord se stabilise.

#### Réponse orale possible

> « Je trierais selon la fréquence, le risque, la stabilité et le coût, et pour chaque cas je choisirais le niveau le plus bas. Les frais de port et l'accès à la commande d'un autre client passent en premier : risque élevé, tests rapides et stables, en unitaire et en API. La connexion et le paiement deviennent des E2E, l'e-mail un test de contenu. Je garderais au manuel le tableau de bord, qui change trop et demande du jugement, et l'export annuel. Je n'irais pas tester le vieux navigateur, et j'écrirais ce choix pour qu'il soit assumé. »

**À relire** : [Choisir le bon niveau de test](../../knowledge/qualite.md#choisir-le-bon-niveau-de-test), [Pyramide, trophée, nid d'abeille](../../knowledge/qualite.md#pyramide-trophee-nid-dabeille-la-forme-dune-suite), [Session et charte (SBTM)](../../knowledge/conception-tests.md#session-et-charte-sbtm), [Tester ou vérifier](../../knowledge/conception-tests.md#tester-ou-verifier-testing-vs-checking), [Choisir ce qu'on automatise](../../knowledge/qualite.md#choisir-ce-quon-automatise)

## Exercice 7. Stratégie de test d'une nouvelle fonctionnalité en 30 minutes

### Énoncé

L'équipe va développer « l'abonnement mensuel » : un client choisit une box de café livrée chaque mois, payée automatiquement par carte. Il peut mettre en pause, changer de box ou résilier. Le prélèvement a lieu le 1er de chaque mois. J'ai 30 minutes pour proposer une stratégie de test.

### Corrigé attendu

#### 1. Questions (5 minutes)

- Que se passe-t-il si le prélèvement échoue (carte expirée, fonds insuffisants) ? Combien de nouvelles tentatives ?
- Un changement de box le 30 du mois s'applique-t-il au mois suivant ?
- Une pause est-elle limitée dans le temps ?
- Quel prestataire de paiement, et a-t-il un bac à sable ?
- Combien d'abonnés prévus au lancement, et tous prélevés en même temps le 1er ?

#### 2. Les risques (10 minutes)

Priorité 1 = à couvrir en premier, 3 = en dernier. Elle combine la probabilité et l'impact.

| Risque | Probabilité | Impact | Priorité |
|---|---|---|---|
| Client prélevé deux fois le même mois | moyenne | très fort (argent, confiance) | 1 |
| Client résilié encore prélevé | moyenne | très fort | 1 |
| Échec de prélèvement non géré, box envoyée gratuitement | moyenne | fort | 2 |
| Changement de box en fin de mois mal appliqué | forte | moyen | 2 |
| Charge du 1er du mois (tous les prélèvements en même temps) | moyenne | fort | 2 |
| Affichage de la date du prochain prélèvement faux | forte | faible | 3 |

#### 3. Les tests par niveau (10 minutes)

| Niveau | Ce qu'on teste |
|---|---|
| Unitaire | calcul de la date du prochain prélèvement (fin de mois, février, changement d'heure), règles de pause, prix au prorata si changement de box |
| <span class="term" data-term="state-machine">États de l'abonnement</span> | actif, en pause, en échec de paiement, résilié : toutes les transitions valides, et les interdites (reprendre un abonnement résilié, prélever en pause) |
| API | créer, mettre en pause, changer, résilier ; autorisations (un client ne modifie pas l'abonnement d'un autre) |
| Intégration avec le prestataire | faux service pour les refus, les délais et les réponses en double ; un test de nuit avec le vrai bac à sable |
| Traitement du 1er du mois | job de prélèvement relancé deux fois : aucun double prélèvement (<span class="term" data-term="idempotency">idempotence</span>) |
| E2E | un seul parcours : s'abonner et voir la date du prochain prélèvement |
| Performance | job de prélèvement avec 10 fois le nombre d'abonnés prévu |
| <span class="term" data-term="exploratory-testing">Exploratoire</span> | une session sur les changements en fin de mois, une sur les messages d'erreur de paiement |

Pour tester le 1er du mois sans attendre le calendrier, le code doit permettre d'injecter la date : je le demande aux développeurs dès le cadrage.

#### 4. Critères de sortie et ce qui n'est pas testé (5 minutes)

Les <span class="term" data-term="exit-criteria">critères de sortie</span> sont des conditions mesurables, fixées avant de tester, qui disent quand la version peut partir :

- Tous les risques de priorité 1 couverts par un test automatisé vert.
- Le job de prélèvement relancé deux fois sur un jeu de 1 000 abonnements de test : zéro double prélèvement.
- Non testé : les e-mails marketing liés à l'abonnement (hors périmètre, autre équipe).
- Après la mise en production : une alerte sur le nombre de prélèvements par client et par mois supérieur à 1.

#### Ce qu'un QA Engineer doit ajouter

- Montrer la gestion du temps : questions, risques, tests, critères. En entretien, annoncer ce découpage au début rassure.
- Dire ce qu'on ne fait pas, et pourquoi.
- Proposer le <span class="term" data-term="shift-right">shift-right</span> : la supervision du premier 1er du mois en production est le vrai test final.

#### Réponse orale possible

> « Je commencerais par cinq minutes de questions, surtout sur les échecs de prélèvement et les changements en fin de mois. Ensuite je listerais les risques : le double prélèvement et le prélèvement après résiliation sont en tête, car ils touchent l'argent et la confiance. Je placerais chaque test au bon niveau : dates et règles en unitaire, cycle de vie de l'abonnement en tests de transitions, prestataire simulé pour les erreurs, job de prélèvement rejoué deux fois pour vérifier l'idempotence, un seul E2E. Je finirais par des critères de sortie et une alerte en production sur les doubles prélèvements. »

**À relire** : [Test basé sur les risques](../../knowledge/conception-tests.md#test-base-sur-les-risques), [Critères de sortie et décision go/no-go](../../knowledge/conception-tests.md#criteres-de-sortie-et-decision-gono-go), [Transitions d'état](../../knowledge/conception-tests.md#transitions-detat), [Idempotence](../../knowledge/architecture.md#idempotence), [Shift-left et shift-right](../../knowledge/qualite.md#shift-left-et-shift-right-quand-tester)

## Exercice 8. Vérifier la cohérence des données avec SQL

### Énoncé

Après le bug de double paiement (exercice 2), on me demande de vérifier les données de production en lecture seule. Schéma simplifié :

``` { .sql .ex-illus title="Illustration" }
-- Exemple : les deux tables utiles, colonnes simplifiées
orders   (id, customer_id, total_cents, status, created_at)
payments (id, order_id, amount_cents, status, created_at)
```

J'écris les requêtes qui trouvent :

1. les commandes avec plus d'un paiement réussi ;
2. les commandes payées dont le total des paiements réussis ne correspond pas au montant de la commande ;
3. les paiements qui pointent vers une commande inexistante.

### Corrigé attendu

#### 1. Commandes avec plus d'un paiement réussi

``` { .sql .ex-good title="Recommandé" }
-- Bien : regrouper par commande, puis filtrer les groupes avec HAVING
SELECT p.order_id,
       COUNT(*)            AS successful_payments,
       SUM(p.amount_cents) AS total_paid_cents
FROM payments AS p
WHERE p.status = 'succeeded'
GROUP BY p.order_id
HAVING COUNT(*) > 1
ORDER BY successful_payments DESC;
```

`GROUP BY` regroupe les paiements par commande, `HAVING` filtre après le regroupement (on ne peut pas mettre `COUNT(*) > 1` dans le `WHERE`).

#### 2. Total payé différent du montant de la commande

L'erreur classique est de filtrer le statut du paiement dans le `WHERE` : les commandes « payées » sans aucun paiement réussi disparaissent du résultat, alors que ce sont les plus graves.

``` { .sql .ex-bad title="À éviter" }
-- À éviter : le filtre dans le WHERE supprime les lignes sans paiement et annule le LEFT JOIN
SELECT o.id, o.total_cents, SUM(p.amount_cents) AS paid_cents
FROM orders AS o
LEFT JOIN payments AS p ON p.order_id = o.id
WHERE o.status = 'paid'
  AND p.status = 'succeeded'
GROUP BY o.id, o.total_cents
HAVING SUM(p.amount_cents) <> o.total_cents;
```

``` { .sql .ex-good title="Recommandé" }
-- Bien : le filtre de statut dans le ON, et COALESCE pour compter l'absence de paiement comme 0
SELECT o.id,
       o.total_cents,
       COALESCE(SUM(p.amount_cents), 0) AS paid_cents
FROM orders AS o
LEFT JOIN payments AS p
       ON p.order_id = o.id
      AND p.status = 'succeeded'
WHERE o.status = 'paid'
GROUP BY o.id, o.total_cents
HAVING COALESCE(SUM(p.amount_cents), 0) <> o.total_cents;
```

- Le `LEFT JOIN` garde aussi les commandes « payées » qui n'ont **aucun** paiement réussi : une <span class="term" data-term="sql-join">jointure</span> simple les ferait disparaître, alors que c'est une incohérence grave.
- La condition `p.status = 'succeeded'` est dans le `ON`, pas dans le `WHERE` : dans le `WHERE`, elle supprimerait les lignes sans paiement et annulerait l'effet du `LEFT JOIN`.
- `COALESCE` remplace l'absence de paiement (`NULL`) par 0.

#### 3. Paiements orphelins

``` { .sql .ex-good title="Recommandé" }
-- Bien : LEFT JOIN puis IS NULL pour trouver ce qui manque de l'autre côté
SELECT p.id, p.order_id, p.amount_cents, p.created_at
FROM payments AS p
LEFT JOIN orders AS o ON o.id = p.order_id
WHERE o.id IS NULL;
```

Si la base a une <span class="term" data-term="foreign-key">clé étrangère</span> de `payments.order_id` vers `orders.id`, cette requête doit renvoyer zéro ligne. Si elle en renvoie, la contrainte manque, et c'est un défaut à signaler.

#### 4. Précautions en production

- Utiliser un <span class="term" data-term="read-only-account">compte en lecture seule</span>, ou une réplique, jamais le compte de l'application.
- Limiter la période (`created_at >= ...`) et ajouter `LIMIT` lors des premiers essais, pour ne pas charger la base.
- Vérifier le plan d'exécution (`EXPLAIN`) si les tables sont grosses.
- Ne pas copier de données personnelles dans un ticket : identifiants de commande, pas les noms ni les e-mails.

#### Ce qu'un QA Engineer doit ajouter

- Transformer ces requêtes en contrôle automatique : un job de nuit qui alerte si la requête 1 renvoie une ligne.
- Proposer la correction structurelle : une <span class="term" data-term="unique-constraint">contrainte d'unicité</span> sur les paiements réussis par commande, qui empêche le problème au lieu de le détecter.
- Donner au support la liste des commandes à rembourser.

#### Réponse orale possible

> « Pour les doubles paiements, je regrouperais les paiements réussis par commande avec un `HAVING COUNT(*) > 1`. Pour les montants incohérents, j'utiliserais un `LEFT JOIN` avec le filtre de statut dans le `ON`, pour garder les commandes payées sans aucun paiement, qui sont le cas le plus grave. Pour les orphelins, un `LEFT JOIN` avec `IS NULL`. Je lancerais tout ça avec un compte en lecture seule, sur une période limitée, puis je proposerais une contrainte d'unicité et une vérification automatique de nuit. »

**À relire** : [SQL pour la QA](../../knowledge/sql.md#sql-pour-la-qa), [HAVING : filtrer après le regroupement](../../knowledge/sql.md#having-filtrer-apres-le-regroupement), [Trouver ce qui manque](../../knowledge/sql.md#trouver-ce-qui-manque-left-join-is-null), [Joindre des tables](../../knowledge/sql.md#joindre-des-tables), [Les contraintes : la base garde les règles](../../knowledge/sql.md#les-contraintes-la-base-garde-les-regles)

## Exercice 9. Revue d'une MR de tests

### Énoncé

Un collègue propose cette MR qui ajoute des tests pour la fonction `apply_coupon(cart_total_cents, coupon)`. Je dois faire la revue.

``` { .python .ex-bad title="À éviter" }
import time
import requests

from shop.coupons import apply_coupon

USER = "admin"
PASSWORD = "Admin123!"


# À éviter : secret en dur, appel réseau, pause, assertions vagues et exception avalée
def test_coupon():
    coupon = requests.get(
        "https://staging.shop.example.test/api/coupons/SUMMER",
        auth=(USER, PASSWORD),
    ).json()
    time.sleep(2)
    result = apply_coupon(10000, coupon)
    assert result
    result2 = apply_coupon(5000, coupon)
    assert result2 < 5000
    try:
        apply_coupon(-1, coupon)
    except Exception:
        pass
```

### Corrigé attendu

#### 1. Les problèmes, du plus grave au moins grave

| Problème | Pourquoi c'est un problème | Correction |
|---|---|---|
| Identifiants en dur (`admin`, `Admin123!`) | un <span class="term" data-term="secret">secret</span> dans le dépôt Git, visible par tous, et qui reste dans l'historique | variables d'environnement, et faire changer ce mot de passe |
| Appel réel à staging dans un test unitaire | le test dépend du réseau et des données de staging, il sera lent et instable | construire le coupon dans le test |
| `time.sleep(2)` | ralentit sans raison, ne protège de rien | supprimer |
| `assert result` | passe pour n'importe quelle valeur non nulle, même fausse | vérifier la valeur exacte attendue |
| `assert result2 < 5000` | passe même si la remise est fausse (4 999 ou 1) | valeur exacte |
| `try / except / pass` | le test passe que l'exception soit levée ou non | `pytest.raises` |
| Un seul test pour tout | un échec ne dit pas quelle règle est cassée | un test par comportement, paramétré |
| Nom `test_coupon` | ne dit pas ce qui est vérifié | nommer le comportement |

#### 2. La version proposée

``` { .python .ex-good title="Recommandé" }
import pytest

from shop.coupons import Coupon, apply_coupon

TEN_PERCENT = Coupon(code="SUMMER", percent_off=10, min_total_cents=2_000)


# Bien : valeurs exactes, seuil testé à sa limite, un cas par ligne
@pytest.mark.parametrize(
    ("total_cents", "expected_cents"),
    [
        pytest.param(10_000, 9_000, id="remise-10-pourcent"),
        pytest.param(2_000, 1_800, id="seuil-minimum-exact"),
        pytest.param(1_999, 1_999, id="sous-le-seuil-pas-de-remise"),
    ],
)
def test_apply_coupon_amount(total_cents, expected_cents):
    assert apply_coupon(total_cents, TEN_PERCENT) == expected_cents


# Bien : pytest.raises échoue si l'exception n'est pas levée
def test_apply_coupon_rejects_negative_total():
    with pytest.raises(ValueError):
        apply_coupon(-1, TEN_PERCENT)
```

Les règles (10 %, minimum de 20 euros) sont supposées : la revue doit demander au collègue de les confirmer, car les tests d'origine ne les disent pas.

#### 3. Le ton de la revue

Un commentaire de revue efficace explique le risque et propose une correction concrète. Par exemple, sur la ligne du mot de passe :

> « Ce mot de passe va rester dans l'historique Git même si on le retire plus tard. On peut le passer par une variable d'environnement ? Et comme il a été poussé, il faudrait aussi le changer sur staging. »

Et sur `assert result` :

> « Ce test passerait aussi si la remise était de 90 % au lieu de 10 %. Je propose de vérifier la valeur exacte, `9_000`, pour que le test échoue le jour où le calcul change. »

#### Ce qu'un QA Engineer doit ajouter

- Vérifier que les nouveaux tests échouent quand on casse le code : changer `10` en `20` dans le calcul et relancer, c'est l'idée du <span class="term" data-term="mutation-testing">mutation testing</span>.
- Classer les remarques : bloquantes (secret, assertions qui ne vérifient rien), suggestions (nommage).
- Proposer une règle automatique (détection de secrets dans un <span class="term" data-term="pre-commit-hook">hook pre-commit</span> ou en CI) pour que le prochain mot de passe soit bloqué avant la revue.

#### Réponse orale possible

> « Le plus grave est le mot de passe en dur : il faut le retirer, passer par une variable d'environnement et le faire changer, car il reste dans l'historique. Ensuite, les assertions ne vérifient presque rien : `assert result` et `< 5000` passeraient avec un calcul faux, et le `try / except / pass` rend le dernier cas toujours vert. Je proposerais des tests unitaires sans appel réseau, avec un coupon construit dans le test, des valeurs exactes, les valeurs limites du seuil et `pytest.raises`. Je vérifierais enfin que les tests échouent quand je casse le calcul. »

**À relire** : [Revue de code](../../knowledge/qualite.md#revue-de-code), [Prouver chaque remarque](../../knowledge/qualite.md#prouver-chaque-remarque), [Les secrets](../../knowledge/securite.md#les-secrets), [Mutation testing](../../knowledge/qualite.md#mutation-testing-tester-les-tests), [DAMP plutôt que DRY dans les tests](../../knowledge/conception-tests.md#damp-plutot-que-dry-dans-les-tests), [Préparer ma MR et recevoir une revue](../../knowledge/qualite.md#preparer-ma-mr-et-recevoir-une-revue)

## Exercice 10. Décision go/no-go

### Énoncé

Il est 15 h, la mise en production de la version 5.0 est prévue à 18 h. La situation :

- suite E2E critique : 47 tests sur 48 passent ; l'échec porte sur « télécharger une facture PDF », instable depuis deux semaines ;
- deux bugs ouverts : un majeur (le tri par prix est inversé dans la recherche, contournement : tri par pertinence) et un mineur (faute d'orthographe dans un e-mail) ;
- la nouvelle fonctionnalité de « paiement en trois fois » a été testée sur le bac à sable, mais pas les échecs du deuxième ou du troisième prélèvement ;
- le retour arrière n'a pas été testé depuis la migration de base de données de cette version, qui supprime une colonne.

Que recommander ?

### Corrigé attendu

#### 1. Trier les faits

| Élément | Gravité | Ce qu'il faut savoir |
|---|---|---|
| E2E facture PDF rouge | à qualifier | instable ou vrai bug ? Regarder la trace du dernier échec |
| Tri par prix inversé | majeur, contournement existe | combien de clients trient par prix ? |
| Faute dans un e-mail | mineur | n'empêche rien |
| Paiement en trois fois, échecs non testés | risque élevé | argent ; que se passe-t-il si le 2e prélèvement échoue ? |
| <span class="term" data-term="rollback">Retour arrière</span> non testé, colonne supprimée | **bloquant** | si la version pose problème, on ne peut pas revenir en arrière sans perdre des données |

#### 2. Le point bloquant

La migration supprime une colonne. Si la version 5.0 doit être retirée, l'ancienne version 4.x attend cette colonne, qui n'existe plus : le retour arrière casse l'application ou perd des données. C'est le seul point qui rend la mise en production dangereuse quoi qu'il arrive, car il supprime le filet de sécurité.

Options pour le lever :

- séparer la migration en deux temps (<span class="term" data-term="expand-contract">expand / contract</span>) : la 5.0 n'utilise plus la colonne, mais ne la supprime pas ; la suppression part dans une version suivante ;
- ou tester le retour arrière en pré-production avant 18 h, avec une sauvegarde vérifiée.

#### 3. La recommandation

L'avis écrit, avec des numéros de bugs fictifs :

``` { .markdown .ex-illus title="Illustration" }
Avis QA, version 5.0, 15 h 30

Recommandation : NO-GO à 18 h, GO possible demain si deux conditions
sont remplies.

Bloquant
- Retour arrière impossible : la migration supprime la colonne
  orders.legacy_ref, que la 4.x lit encore. Proposition : retirer la
  suppression de la colonne de la 5.0 (migration en deux temps).

À traiter avant le GO
- Paiement en trois fois : livrer derrière le flag `split-payment`,
  désactivé, tant que les échecs du 2e et du 3e prélèvement ne sont
  pas testés (prévu jeudi).

Acceptés, à écrire dans les notes de version et au support
- BUG-412 tri par prix inversé (majeur, contournement : tri par
  pertinence), correctif en 5.0.1.
- BUG-415 faute dans l'e-mail (mineur).

À qualifier ce soir
- E2E facture PDF : trace du dernier échec en cours d'analyse. Si
  c'est un vrai bug, il devient bloquant.

Décision : PO et responsable technique, à 16 h.
```

Le flag `split-payment` ne s'active qu'une fois ses critères de sortie cochés (pourcentages et durées donnés à titre d'exemple) :

``` { .markdown .ex-illus title="Illustration" }
- [ ] Échec du 2e prélèvement : le client reçoit un e-mail, la commande
      passe en « à régulariser », aucune box n'est envoyée gratuitement.
- [ ] Échec du 3e prélèvement : même comportement, testé séparément.
- [ ] Flag coupé en pré-production : le paiement comptant reste
      disponible et les paiements en cours ne sont pas perdus.
- [ ] Activation pour 5 % des clients, taux d'échec des prélèvements
      suivi pendant 48 h avant d'élargir.
```

#### Ce qu'un QA Engineer doit ajouter

- Séparer clairement les faits, les risques et la recommandation.
- Proposer une issue (<span class="term" data-term="feature-flag">flag</span>, migration en deux temps) plutôt qu'un simple refus.
- Rappeler que la décision revient au PO et au responsable technique, et qu'elle doit être écrite.
- Après coup, faire entrer « retour arrière testé » dans les critères de sortie de toutes les versions avec migration.

#### Réponse orale possible

> « Je trierais d'abord les faits. Le vrai problème n'est ni le bug de tri ni l'E2E rouge, c'est le retour arrière : la migration supprime une colonne, donc si la 5.0 casse, on ne peut pas revenir à la 4.x. Je recommanderais un no-go à 18 h, et un go dès que la suppression de colonne est sortie de cette version. Je livrerais le paiement en trois fois derrière un flag désactivé tant que ses échecs ne sont pas testés, j'accepterais le bug de tri avec son contournement, et je qualifierais l'E2E rouge ce soir. La décision appartient au PO, mais je ferais en sorte qu'elle soit prise en connaissance de cause et écrite. »

**À relire** : [Critères de sortie et décision go/no-go](../../knowledge/conception-tests.md#criteres-de-sortie-et-decision-gono-go), [Migrer un schéma sans interruption](../../knowledge/sql.md#migrer-un-schema-sans-interruption), [Déploiement progressif](../../knowledge/livraison.md#deploiement-progressif), [Feature flags : Unleash](../../knowledge/outils.md#feature-flags-unleash)

## Grille de préparation pour un exercice en direct

Avant de conclure une réponse, je vérifie que j'ai abordé :

- [ ] **Questions** : ai-je clarifié la règle, les utilisateurs et le contexte avant de tester ?
- [ ] **Risques** : ai-je commencé par ce qui coûterait le plus cher si ça cassait ?
- [ ] **Techniques** : ai-je nommé et appliqué une technique (partitions, valeurs limites, table de décision, états, <span class="term" data-term="pairwise-testing">paires</span>) ?
- [ ] **Niveau** : ai-je placé chaque test au niveau le plus bas qui le couvre ?
- [ ] **Négatif** : ai-je testé les erreurs, les autorisations et les entrées invalides, pas seulement le cas nominal ?
- [ ] **Stabilité** : mes tests sont-ils indépendants, sans attente fixe, avec leurs propres données ?
- [ ] **Communication** : ai-je dit ce que je ne teste pas, et comment je rapporte le résultat ?
- [ ] **Après la livraison** : ai-je pensé à la supervision et au retour arrière ?

### Si je bloque pendant l'entretien

Je peux verbaliser :

> « Je vais commencer par les questions que je poserais au PO, puis lister les risques, et choisir une technique de conception de tests pour chacun. Je commence par le cas nominal, puis les erreurs. »

C'est préférable à une réponse précipitée. Pour un QA Engineer, la méthode visible (questions, risques, techniques nommées, priorités) compte autant que la liste finale de cas de test.

### Priorité de révision si je manque de temps

1. Techniques de conception : partitions, valeurs limites, tables de décision, transitions d'état (exercice 1).
2. Rapport de bug et sévérité (exercice 2).
3. Tests instables et attentes en Playwright (exercice 3).
4. Tests d'API avec pytest, fixtures et paramétrage (exercice 4).
5. Stratégie de test fondée sur les risques (exercice 7).
6. Go/no-go et retour arrière (exercice 10).
7. Revue de tests (exercice 9).
8. Choix d'automatisation (exercice 6).
9. SQL de cohérence et test de charge k6 (exercices 8 et 5).

L'objectif n'est pas de réciter ces réponses mot pour mot. Je m'en sers comme structures, puis je les relie à mes expériences réelles : les bugs que j'ai trouvés, les suites que j'ai stabilisées, les décisions de livraison auxquelles j'ai participé.

## Mesurer le succès

Je sais que mon entraînement marche quand je résous un exercice nouveau à voix haute, dans le temps, en nommant mes techniques. Avant de commencer, je note une base : je fais trois exercices de cette page sans regarder le corrigé, chronométrés, et je compte les points de la grille de préparation que j'ai couverts. Je refais la même mesure une semaine plus tard sur trois autres exercices. La métrique garde-fou est la justesse : aller plus vite ne compte pas si j'oublie les cas négatifs ou le retour arrière.

| Solution | Indicateur de succès (<span class="term" data-term="sli">SLI</span>) | <span class="term" data-term="slo">SLO</span> probable | <span class="term" data-term="sla">SLA</span> probable |
|---|---|---|---|
| faire les exercices chronométrés sans le corrigé | part des exercices finis dans le temps annoncé (30 minutes pour l'exercice 7) | 7 sur 10 [À prendre avec précaution : valeur d'exemple, à ajuster à mon niveau de départ] | sans objet : pas de contrat externe |
| suivre la grille de préparation | nombre de points de la grille couverts par exercice | 7 sur 8 [À prendre avec précaution : valeur d'exemple] | sans objet : pas de contrat externe |
| poser des questions avant de répondre | part des exercices où je pose au moins deux questions avant le premier cas de test | 100 % des exercices | sans objet : pas de contrat externe |
| écrire du code qui tourne | part des extraits de code écrits de mémoire qui passent au premier lancement local | 8 sur 10 [À prendre avec précaution : valeur d'exemple] | sans objet : pas de contrat externe |
| relier à une histoire vécue | part des exercices conclus par un exemple réel ou présenté comme hypothétique | 100 % des exercices | sans objet : pas de contrat externe |

## Pièges à éviter

| Piège | Ce qui se passe | Solution |
| --- | --- | --- |
| **Foncer sur les cas** : je liste des valeurs dès la lecture de l'énoncé. | Je teste une règle mal comprise, comme une date de fin que je crois exclue. | Je pose d'abord deux ou trois questions ([Exercice 1](#exercice-1-concevoir-les-tests-dun-champ-de-periode-de-reservation)). |
| **Oublier le négatif** : je ne teste que le cas nominal. | Le recruteur conclut que je ne pense pas comme un QA. | Je couvre les erreurs, les autorisations et les entrées invalides ([Exercice 4](#exercice-4-ecrire-des-tests-dapi-avec-pytest)). |
| **Réparer par une pause** : j'allonge `waitForTimeout` pour faire passer un test instable. | Le test reste instable, plus lent, et peut cacher un vrai bug. | J'utilise des assertions qui réessaient et des données propres au test ([Exercice 3](#exercice-3-reparer-un-test-playwright-instable)). |
| **S'arrêter au bouton** : je conclus que désactiver le bouton règle le double paiement. | Un second appel direct à l'API débite encore deux fois. | J'isole le côté serveur avec deux requêtes identiques ([Exercice 2](#exercice-2-rediger-un-rapport-de-bug-a-partir-dun-signalement)). |
| **Filtrer dans le WHERE** : je mets le statut du paiement dans le `WHERE` d'un `LEFT JOIN`. | Les commandes payées sans paiement, les plus graves, disparaissent. | Je mets le filtre dans le `ON` ([Exercice 8](#exercice-8-verifier-la-coherence-des-donnees-avec-sql)). |
| **Dire non sans issue** : je recommande un no-go sans proposer de chemin. | L'équipe me voit comme un frein, et la décision se prend sans moi. | Je propose un flag ou une migration en deux temps ([Exercice 10](#exercice-10-decision-gono-go)). |
| **Mesurer la moyenne** : je juge un test de charge sur le temps moyen. | Les utilisateurs lents sont invisibles dans le résultat. | Je fixe des seuils sur le p95 et le taux d'erreur ([Exercice 5](#exercice-5-ecrire-un-test-de-charge-avec-k6)). |
