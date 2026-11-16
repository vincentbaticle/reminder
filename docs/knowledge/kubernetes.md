# Conteneurs, Kubernetes et déploiement

!!! warning "Avertissement"
    Ces notes sont des pense-bêtes personnels, pas une source de vérité. Elles reflètent ma compréhension et mes choix : leur contenu reste subjectif, malgré les citations et les références qu'il contient. Il peut être incomplet, simplifié, inexact ou dépassé. Vérifiez toujours dans la documentation officielle avant de l'appliquer. Ce contenu est fourni tel quel, sans aucune garantie : son utilisation se fait sous votre seule responsabilité.

!!! audience "Pour qui, pour quoi"
    - **Métiers** : développeur back-end, SRE, platform engineer, QA, tech lead...
    - **Usages** : je prépare un entretien où l'on me demande la différence entre readiness et liveness ; j'écris le Deployment et les values Helm d'un nouveau service ; je relis une MR qui ajoute une probe, des limits ou un HPA ; je comprends pourquoi un pod redémarre en boucle avec `OOMKilled` ; je choisis entre HPA, KEDA et Cloud Run pour un worker.

!!! abstract "Les échelles"
    Les pastilles de couleur sous les titres disent à quelle échelle une notion s'applique :

    - <span class="pill pill-scope pill-scope-code">Code</span> les classes, fonctions et modules d'un programme ;
    - <span class="pill pill-scope pill-scope-app">Application</span> un service ou une application et son découpage interne ;
    - <span class="pill pill-scope pill-scope-system">Système</span> plusieurs services qui communiquent par le réseau ;
    - <span class="pill pill-scope pill-scope-infra">Infrastructure</span> les serveurs, le réseau, les zones et les clusters, physiques ou virtuels ;
    - <span class="pill pill-scope pill-scope-enterprise">Entreprise</span> le système d'information entier et son organisation.

    Détail et mots ambigus : [carte des échelles](architecture.md#carte-des-echelles).

<span class="term" data-term="kubernetes">Kubernetes</span> fait tourner les applications dans des <span class="term" data-term="container">conteneurs</span>, vérifie qu'elles vont bien et les redémarre si besoin. Cette page couvre ce qu'il faut connaître côté appli : <span class="term" data-term="pod">pods</span>, <span class="term" data-term="k8s-deployment">déploiements</span> et <span class="term" data-term="probe">probes</span>, puis le chemin d'une image jusqu'au cluster (Docker, Helm, Argo CD, Cloud Run), l'autoscaling (HPA, KEDA, Knative, Karpenter) et les opérateurs. Pour comprendre ce que l'appli produit une fois lancée (<span class="term" data-term="logs">logs</span>, <span class="term" data-term="metric">métriques</span>, <span class="term" data-term="trace-distributed">traces</span>), voir la page [Observabilité](observabilite.md).

!!! info "Par où commencer"
    - **Je veux seulement déployer mon service**, sans devenir expert de Kubernetes : le plus souvent, une équipe plateforme m'offre un chemin balisé (template, [chart générique](#un-chart-generique-pour-tous-les-services), Argo CD), décrit côté organisation dans [Golden paths et templates](devx.md#golden-paths-et-templates). Ici, je lis seulement [le chemin d'une modification jusqu'au pod](#le-chemin-dune-modification-jusquau-pod).
    - **Je veux comprendre ou déboguer un pod** qui redémarre, qui ne reçoit pas de trafic ou qui manque de mémoire : [Pods, conteneurs et probes](#pods-conteneurs-et-probes), puis [Namespace et kubectl](#namespace-et-kubectl).
    - **Je monte ou je relis la chaîne de déploiement** : [Construire et déployer](#construire-et-deployer-docker-helm-argo-cd-cloud-run), et le pipeline qui la déclenche dans [Livraison et déploiement continus](livraison.md#livraison-et-deploiement-continus).
    - **Je dois tenir la charge ou faire tourner Kafka** : [Autoscaling](#autoscaling-et-serverless-hpa-keda-knative-karpenter) et [Opérateurs](#operateurs-kubernetes-strimzi).
    - **Je construis la plateforme pour les autres équipes** : [Platform engineering](devx.md#platform-engineering-la-plateforme-comme-produit), puis le chart générique et Argo CD ici.

Les ports, les valeurs <span class="term" data-term="yaml">YAML</span> et les routes métier sont des exemples. `my-api` est un service fictif.

:material-swap-horizontal: Les outils cités dans cette page : lesquels se remplacent, lesquels se combinent ? Voir [Complémentaires ou concurrents](outils.md#complementaires-ou-concurrents).
{ .doc-ref }

## Vocabulaire

Les notions web générales que cette page utilise ont leur propre page : API, route et JSON dans le [Vocabulaire de la page API](api-rest-async.md#vocabulaire), les codes HTTP dans [Les codes de réponse](api-rest-async.md#les-codes-de-reponse), le cache dans [Où placer un cache](architecture.md#ou-placer-un-cache), SLI, SLO et SLA dans [SLI, SLO, budget d'erreur](observabilite.md#sli-slo-budget-derreur). Ici, seulement les mots du déploiement.

### Le chemin d'une modification jusqu'au pod

J'ai corrigé un bug dans `my-api` et je veux que la correction tourne en production. Entre ma MR et le pod qui répond, les mêmes mots reviennent sans arrêt. Le dessin les place dans l'ordre, le tableau les définit, et chacun a sa section plus bas.

```mermaid
flowchart LR
  Dev["MR fusionnée<br/>dépôt my-api"] --> CI["CI<br/>docker build"]
  CI -->|"push my-api:1.4.1"| Reg[("registre<br/>d'images")]
  CI -->|"MR image.tag: 1.4.1"| Cfg["dépôt de config<br/>values Helm"]
  Cfg --> Argo["Argo CD<br/>génère les manifestes"]
  Argo -->|"applique"| API["cluster Kubernetes<br/>API server"]
  API --> Pod["pods my-api 1.4.1<br/>namespace my-team"]
  Reg -.->|"tire l'image"| Pod
```

| Mot | Ce que c'est | Exemple | Détail |
|---|---|---|---|
| <span class="term" data-term="container">conteneur</span> | un processus isolé qui embarque son appli et ses bibliothèques, pour tourner pareil sur mon poste, en CI et en prod | `my-api` tourne avec Python 3.12 même si la machine a Python 3.9 | [Conteneur](#conteneur) |
| <span class="term" data-term="docker-image">image</span> | le modèle figé d'un conteneur, construit une fois par la CI à partir d'un `Dockerfile` | l'image de `my-api` en version 1.4.1 | [Docker : l'image](#docker-limage) |
| <span class="term" data-term="image-tag">tag d'image</span> | l'étiquette de version écrite après les deux-points : changer le tag, c'est choisir la version qui tourne | `my-api:1.4.1` | [Docker : l'image](#docker-limage) |
| <span class="term" data-term="container-registry">registre d'images</span> | le serveur où la CI range les images, et où le cluster vient les chercher au démarrage d'un pod | `registry.example.com/my-api` | [Docker : l'image](#docker-limage) |
| <span class="term" data-term="k8s-manifest">manifeste</span> | un fichier YAML qui décrit une ressource voulue (un Deployment, un Service) : Kubernetes fait en sorte que la réalité lui ressemble | `kind: Deployment` avec `replicas: 3` | [Deployment](#deployment) |
| <span class="term" data-term="k8s-namespace">namespace</span> | un espace de noms dans le cluster, qui sépare les ressources d'une équipe ou d'un environnement | `my-team`, `preview-mr-42` | [Namespace et kubectl](#namespace-et-kubectl) |
| <span class="term" data-term="kubectl">kubectl</span> | la ligne de commande qui parle à l'API du cluster : lire l'état, décrire un pod, lire ses logs | `kubectl get pods -n my-team` | [Namespace et kubectl](#namespace-et-kubectl) |
| <span class="term" data-term="helm-chart">Helm</span>, chart, values | un modèle de manifestes avec des trous (le chart), rempli par un fichier de valeurs différent par environnement | `values-prod.yaml` contient `replicaCount: 3` | [Helm](#helm-le-modele-de-deploiement) |
| <span class="term" data-term="gitops">GitOps</span> | la règle « ce qui tourne est ce que décrit Git » : je déploie par une MR, jamais par une commande à la main | une MR qui passe `image.tag` à `1.4.1` | [Argo CD](#argo-cd-git-decide-de-ce-qui-tourne) |
| <span class="term" data-term="argo-cd">Argo CD</span> | l'outil GitOps installé dans le cluster : il lit le dépôt de config, génère les manifestes, les applique, puis corrige tout écart | l'application `my-api-prod` passe de `OutOfSync` à `Synced` | [Argo CD](#argo-cd-git-decide-de-ce-qui-tourne) |

### Kubernetes, cluster, nœud

*Kubernetes : concurrent de Cloud Run ; complémentaire de Docker, Helm, Argo CD*
{ .tool-rel }

**<span class="term" data-term="kubernetes">Kubernetes</span>** (souvent abrégé K8s) est le système qui lance les applications dans des conteneurs, les surveille, les redémarre et répartit le <span class="term" data-term="network-traffic">trafic</span>. Un **<span class="term" data-term="cluster">cluster</span>** est l'ensemble des machines qu'il gère, et chaque machine est un **<span class="term" data-term="node-k8s">nœud</span>** (node).
``` { .text .ex-illus title="Illustration" }
cluster prod
├─ nœud 1 : pod my-api-abcde, pod worker-x1
├─ nœud 2 : pod my-api-fghij
└─ nœud 3 : pod my-api-klmno, pod worker-x2
```

Les composants d'un cluster, tels que la documentation Kubernetes les dessine : le plan de contrôle décide, les nœuds exécutent.

```mermaid
flowchart LR
  U[kubectl, Argo CD] --> API
  subgraph CP[Plan de contrôle]
    API[API server] <--> ETCD[(etcd<br/>état du cluster)]
    SCH[Scheduler<br/>choisit un nœud] --> API
    CM[Controller manager<br/>boucles de contrôle] --> API
  end
  subgraph N1[Nœud 1]
    K1[kubelet] --> P1[pod my-api]
    KP1[kube-proxy]
  end
  subgraph N2[Nœud 2]
    K2[kubelet] --> P2[pod my-api]
    KP2[kube-proxy]
  end
  API --> K1
  API --> K2
```

:material-book-open-variant: Doc de référence : [Kubernetes, Cluster Architecture](https://kubernetes.io/docs/concepts/architecture/) (consultée en novembre 2026) ; [Kubernetes, Nodes](https://kubernetes.io/docs/concepts/architecture/nodes/) (consultée en novembre 2026)
{ .doc-ref }

### Namespace et kubectl

Dans un cluster partagé, deux équipes veulent chacune un Service nommé `api`, et l'équipe plateforme veut limiter ce que chacune consomme. Un **namespace** règle ça : c'est un espace de noms, les noms n'ont à être uniques qu'à l'intérieur, et quotas et droits se posent par namespace. **kubectl** est le client en ligne de commande de l'API du cluster. Quand Argo CD pilote le cluster, je m'en sers pour lire et diagnostiquer, pas pour changer ce qui tourne : une modification faite avec kubectl serait annulée à la synchronisation suivante.

``` { .text .ex-ref title="Référence" }
$ kubectl get namespaces
NAME            STATUS   AGE
my-team         Active   210d
preview-mr-42   Active   2d

$ kubectl get pods -n my-team
NAME                 READY   STATUS    RESTARTS   AGE
my-api-7f9c-abcde    1/1     Running   0          3h
my-api-7f9c-fghij    1/1     Running   0          3h

$ kubectl describe pod my-api-7f9c-abcde -n my-team
$ kubectl logs my-api-7f9c-abcde -n my-team --previous
```

| Je veux... | J'utilise... |
|---|---|
| savoir si les pods de mon service tournent et combien de fois ils ont redémarré depuis le déploiement de ce matin | `kubectl get pods -n my-team` |
| comprendre pourquoi un pod ne démarre pas, par exemple une image introuvable dans le registre ou une probe en échec | `kubectl describe pod`, section `Events` |
| lire ce que l'appli a écrit juste avant de planter et d'être redémarrée | `kubectl logs --previous` |
| changer la version qui tourne, ou le nombre de copies | pas kubectl : une MR sur le dépôt de config, voir [Argo CD](#argo-cd-git-decide-de-ce-qui-tourne) |

:material-book-open-variant: Doc de référence : [Kubernetes, Namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) (consultée en novembre 2026) ; [kubectl Quick Reference](https://kubernetes.io/docs/reference/kubectl/quick-reference/) (consultée en novembre 2026)
{ .doc-ref }

### Deployment
L'objet Kubernetes qui dit « je veux 3 copies de my-api, avec telle image ». Kubernetes crée les <span class="term" data-term="pod">pods</span> et les recrée s'ils disparaissent.

!!! noob "As noob"
    Le Deployment, c'est le chef d'équipe d'un restaurant : je lui dis « je veux toujours 3 cuisiniers », il en remplace un s'il tombe malade, et il les change un par un quand la recette évolue. La phrase à retenir : **je décris l'état voulu, Kubernetes s'occupe d'y rester.**

``` { .yaml .ex-ref title="Référence" }
# Exemple : Deployment minimal, 3 copies de my-api
kind: Deployment
metadata:
  name: my-api
spec:
  replicas: 3
```

Entre les deux se cache un objet intermédiaire, le **ReplicaSet** : le Deployment crée un ReplicaSet par version de l'image, et c'est le ReplicaSet qui garde le bon nombre de pods. Un rolling update fait grossir le nouveau ReplicaSet et maigrir l'ancien.

```mermaid
flowchart TD
  D[Deployment my-api<br/>replicas: 3] --> RS1["ReplicaSet my-api-7f9c<br/>(image 1.4.0)"]
  D -.-> RS0["ReplicaSet my-api-5d2a<br/>(image 1.3.9, 0 pod, gardé pour le rollback)"]
  RS1 --> P1[pod my-api-7f9c-abcde]
  RS1 --> P2[pod my-api-7f9c-fghij]
  RS1 --> P3[pod my-api-7f9c-klmno]
```

:material-book-open-variant: Doc de référence : [Kubernetes, Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) (consultée en novembre 2026) ; [Kubernetes, ReplicaSet](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/) (consultée en novembre 2026)
{ .doc-ref }

### Rolling update (mise à jour progressive)
Quand l'image change, le Deployment ne remplace pas tous les pods d'un coup : il fait un <span class="term" data-term="rollout">rollout</span> pod par pod. `maxSurge` dit combien de pods en plus du nombre voulu il peut créer, `maxUnavailable` combien de pods prêts il peut perdre.

!!! noob "As noob"
    C'est une relève d'équipe dans un magasin qui ne ferme jamais : un nouveau vendeur arrive, et c'est seulement quand il est à son poste qu'un ancien s'en va. Si le nouveau ne sait pas tenir la caisse, l'ancien reste et les clients ne voient rien. La phrase à retenir : **avec `maxUnavailable: 0`, un ancien pod n'est arrêté qu'une fois un nouveau prêt.**

Le réglage qu'on croise encore : `Recreate`. Il arrête tous les pods avant de lancer les nouveaux, donc l'API ne répond plus pendant tout le démarrage, et reste coupée si la nouvelle version ne démarre pas. Il ne se justifie que si deux versions ne peuvent pas tourner en même temps (par exemple une seule copie qui tient un verrou exclusif).
``` { .yaml .ex-bad title="À éviter" }
# À éviter : Recreate arrête les 3 pods avant de lancer les nouveaux, donc une coupure à chaque déploiement
spec:
  replicas: 3
  strategy:
    type: Recreate
```

``` { .yaml .ex-good title="Recommandé" }
# Bien : rolling update, un pod en plus à la fois, aucun pod prêt retiré avant
spec:
  replicas: 3
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
```
Passage de 1.4.0 à 1.4.1 avec ces réglages (heures en exemple) :
``` { .text .ex-illus title="Illustration" }
heure     pods 1.4.0   pods 1.4.1          total
10:00:00  3 prêts      0                   3
10:00:01  3 prêts      1 démarre           4   (maxSurge : un pod de plus)
10:00:20  3 prêts      1 prêt              4
10:00:21  2 prêts      1 prêt              3   (un 1.4.0 n'est arrêté qu'une fois le 1.4.1 prêt)
10:00:22  2 prêts      1 prêt, 1 démarre   4
10:00:41  1 prêt       2 prêts             3
10:01:02  0            3 prêts             3   rollout terminé
```
Avec `maxUnavailable: 0`, il y a toujours 3 pods prêts. Si les pods 1.4.1 ne deviennent jamais prêts, le rollout reste bloqué et les 1.4.0 continuent de servir.

Revenir à la version précédente (<span class="term" data-term="rollback">rollback</span>) refait le même mouvement dans l'autre sens :
``` { .text .ex-ref title="Référence" }
$ kubectl rollout status deployment/my-api
deployment "my-api" successfully rolled out
$ kubectl rollout undo deployment/my-api
deployment.apps/my-api rolled back
```
Piège : avec Argo CD, un `rollout undo` à la main est écrasé à la prochaine synchronisation. On annule plutôt la MR (voir [Argo CD](#argo-cd-git-decide-de-ce-qui-tourne)).

:material-book-open-variant: Doc de référence : [Kubernetes, Updating a Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#updating-a-deployment) (consultée en novembre 2026) ; [kubectl rollout](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/) (consultée en novembre 2026)
{ .doc-ref }

### Service
Les pods naissent et meurent, et leur adresse IP change à chaque fois. Un **<span class="term" data-term="k8s-service">Service</span>** donne une adresse stable (`http://my-api` dans le cluster) et répartit le trafic entre tous les pods qui portent le label demandé dans `selector`, à condition qu'ils soient prêts.

!!! noob "As noob"
    Le Service, c'est le numéro du standard d'une entreprise : les employés changent de bureau et de ligne directe, mais j'appelle toujours le même numéro, et le standard me passe quelqu'un de disponible. La phrase à retenir : **on appelle le Service, jamais un pod directement, parce que les pods changent d'adresse.**

``` { .yaml .ex-ref title="Référence" }
# Exemple : Service qui envoie le port 80 vers le port 8080 des pods app=my-api
kind: Service
metadata:
  name: my-api
spec:
  selector:
    app: my-api
  ports:
    - port: 80
      targetPort: 8080
```
``` { .text .ex-illus title="Illustration" }
Service my-api (http://my-api:80)
├─ pod my-api-7f9c-abcde   label app=my-api, prêt       reçoit du trafic
├─ pod my-api-7f9c-fghij   label app=my-api, prêt       reçoit du trafic
└─ pod my-api-7f9c-klmno   label app=my-api, pas prêt   retiré : sa readiness probe échoue
```
Le pod retiré n'est pas tué : il revient dans le Service dès que sa [readiness probe](#readiness-probe) repasse.

Depuis l'extérieur du cluster, un **Ingress** (ou son successeur, la Gateway API) reçoit les requêtes HTTP et les envoie au bon Service selon l'hôte et le chemin. Le chemin complet d'une requête :

```mermaid
flowchart LR
  C[Client] -->|"https://api.example.com/v1/orders"| I[Ingress]
  I -->|"/v1/orders"| S[Service my-api<br/>adresse stable]
  S --> P1[pod abcde<br/>prêt]
  S --> P2[pod fghij<br/>prêt]
  S -.->|"retiré, readiness en échec"| P3[pod klmno<br/>pas prêt]
```

:material-book-open-variant: Doc de référence : [Kubernetes, Service](https://kubernetes.io/docs/concepts/services-networking/service/) (consultée en novembre 2026) ; [Kubernetes, Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) (consultée en novembre 2026)
{ .doc-ref }

## Pods, conteneurs et probes

<a class="pill pill-scope pill-scope-app" href="../architecture/#carte-des-echelles">Échelle · Application</a> <a class="pill pill-scope pill-scope-infra" href="../architecture/#carte-des-echelles">Échelle · Infrastructure</a>

### Pod
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

La plus petite unité que Kubernetes fait tourner. Il contient un ou plusieurs <span class="term" data-term="container">conteneurs</span>.

``` { .text .ex-illus title="Illustration" }
Deployment my-api (prod)
├─ pod my-api-7f9c-abcde   (conteneur my-api)
├─ pod my-api-7f9c-fghij   (conteneur my-api)
└─ pod my-api-7f9c-klmno   (conteneur my-api)
```
Les 3 <span class="term" data-term="pod">pods</span> sont identiques, et le <span class="term" data-term="network-traffic">trafic</span> est réparti entre eux. Chaque pod reçoit ses propres <span class="term" data-term="probe">probes</span>.

**Risques.** Un pod est jetable : quand Kubernetes le déplace ou le redémarre, tout ce qu'il gardait en mémoire ou sur son disque local disparaît. Si my-api range le panier de Léa dans un fichier local, le panier s'efface au prochain déploiement : je garde l'état dans une base ou un cache partagé. Mettre plusieurs conteneurs sans lien dans le même pod les attache aussi : ils démarrent, tombent et passent à l'échelle ensemble, donc je réserve ce cas aux auxiliaires (*sidecars*) qui servent vraiment le conteneur principal.

:material-book-open-variant: Doc de référence : [Kubernetes, Pods](https://kubernetes.io/docs/concepts/workloads/pods/) (consultée en novembre 2026) ; [Kubernetes, Pod Lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/) (consultée en novembre 2026)
{ .doc-ref }

### Conteneur
L'appli empaquetée avec tout ce qu'il lui faut pour tourner, à partir d'une <span class="term" data-term="docker-image">image Docker</span>.

``` { .text .ex-illus title="Illustration" }
image my-api:1.4.2
├─ Python 3.12
├─ dépendances (requirements)
└─ code de my-api
```

:material-book-open-variant: Doc de référence : [Kubernetes, Containers](https://kubernetes.io/docs/concepts/containers/) (consultée en novembre 2026) ; [Docker, What is a container?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/) (consultée en novembre 2026)
{ .doc-ref }

### Probe (sonde)
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Une <span class="term" data-term="http-request">requête</span> que Kubernetes envoie tout seul, à intervalle régulier, pour vérifier l'état d'un conteneur. Il agit ensuite selon la réponse.

L'erreur classique : faire pointer la liveness sur la même route que la readiness. Cette route interroge MySQL, donc le jour où la base tombe, la liveness de tous les pods échoue et Kubernetes les redémarre tous en boucle. Avec `failureThreshold: 1`, une seule pause de quelques secondes (un ramasse-miettes un peu long) suffit en plus à tuer le conteneur.
``` { .yaml .ex-bad title="À éviter" }
# À éviter : liveness sur /readyz, qui dépend de MySQL, et un seul échec suffit pour redémarrer
livenessProbe:
  httpGet:
    path: /readyz
    port: 8080
  periodSeconds: 5
  failureThreshold: 1
```

``` { .yaml .ex-good title="Recommandé" }
# Bien : readiness, retire le pod du trafic après 3 échecs
readinessProbe:
  httpGet:
    path: /readyz
    port: 8080
  periodSeconds: 10
  failureThreshold: 3
# Bien : liveness, redémarre le conteneur après 3 échecs
livenessProbe:
  httpGet:
    path: /livez
    port: 8080
  periodSeconds: 30
  failureThreshold: 3
```
`periodSeconds: 10` veut dire « toutes les 10 s ». `failureThreshold: 3` veut dire « 3 échecs d'affilée avant d'agir ».

:material-book-open-variant: Doc de référence : [Kubernetes, Liveness, Readiness, and Startup Probes](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/) (consultée en novembre 2026) ; [Configure Liveness, Readiness and Startup Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) (consultée en novembre 2026)
{ .doc-ref }

### Readiness probe
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

« <span class="term" data-term="readiness-probe">Readiness</span> » veut dire « le fait d'être prêt ». La question est : « es-tu prêt à recevoir du trafic ? » Si la probe échoue, le pod ne reçoit plus de trafic, mais il n'est pas tué.

``` { .text .ex-illus title="Illustration" }
10:00:00  GET /readyz  200  pod dans le circuit
10:00:10  GET /readyz  503  MySQL injoignable
10:00:20  GET /readyz  503
10:00:30  GET /readyz  503  3 échecs : pod retiré du circuit
10:01:00  GET /readyz  200  MySQL revenu : pod remis dans le circuit
```

**Risques.** Si la readiness vérifie une dépendance partagée par tous les pods, comme la base, une panne de cette dépendance retire tous les pods du Service en même temps : les clients reçoivent une erreur de connexion au lieu d'un message clair, et une réponse dégradée, servie depuis un cache, devient impossible. Je réserve la readiness à ce dont le pod a vraiment besoin pour répondre, et je décide à l'avance ce que le service peut encore faire sans la dépendance. Une readiness plus lente que son `timeoutSeconds` compte comme un échec, et le pod entre et sort du circuit sans arrêt.

### Liveness probe
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

« Es-tu encore vivant ? » Si elle échoue plusieurs fois d'affilée, Kubernetes tue le conteneur et le redémarre.

!!! noob "As noob"
    La readiness, c'est le serveur de restaurant débordé qui dit « ne m'envoie plus de tables pour l'instant » : on arrête de lui en donner, mais il reste en salle. La liveness, c'est le serveur figé qui ne répond plus du tout : on le fait sortir et revenir frais. La phrase à retenir : **readiness en échec retire le pod du trafic, liveness en échec redémarre le conteneur.**

``` { .text .ex-illus title="Illustration" }
10:00:00  GET /livez  200      OK
10:00:30  GET /livez  timeout  appli bloquée (deadlock)
10:01:00  GET /livez  timeout
10:01:30  GET /livez  timeout  3 échecs : conteneur redémarré
10:01:45  GET /livez  200      OK après redémarrage
```

**Risques.** Une liveness qui vérifie la base de my-api redémarre tous les pods en même temps le jour où la base tombe, sans rien réparer : je ne vérifie que le processus lui-même (`/livez` répond sans appeler personne). Des seuils trop serrés (`failureThreshold: 1`, `timeoutSeconds: 1`) tuent un conteneur seulement lent, par exemple pendant un pic de trafic, ce qui retire de la capacité au pire moment : je laisse plusieurs échecs d'affilée. Sans liveness, une appli bloquée par un <span class="term" data-term="deadlock">deadlock</span> reste figée, sans répondre, jusqu'à ce que quelqu'un la relance à la main.

### Startup probe
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

« As-tu fini de démarrer ? » Tant qu'elle n'a pas réussi, la <span class="term" data-term="liveness-probe">liveness</span> ne vérifie rien, ce qui évite de tuer une appli lente au démarrage.

!!! noob "As noob"
    C'est le premier jour d'un nouvel arrivant : tant qu'il n'a pas fini de s'installer, personne ne lui reproche de ne pas répondre au téléphone. Une fois installé, les règles habituelles s'appliquent. Limite : s'il ne finit jamais de s'installer dans le délai prévu, le conteneur est quand même redémarré. La phrase à retenir : **la startup probe protège le démarrage, puis passe la main à la liveness et à la readiness.**

``` { .text .ex-illus title="Illustration" }
10:00:00  conteneur lancé, chargement du cache (40 s)
10:00:10  startup probe  échec  (normal, encore en démarrage)
10:00:40  startup probe  200    démarrage terminé
10:00:40  la liveness et la readiness prennent le relais
```

**Risques.** Une marge trop généreuse (`failureThreshold` fois `periodSeconds` à 10 minutes pour une appli qui démarre en 40 s) retarde d'autant la détection d'un vrai plantage au démarrage, et un déploiement cassé met longtemps à se bloquer : je règle la marge à deux ou trois fois le temps de démarrage mesuré. Sans startup probe, je suis tenté d'augmenter l'`initialDelaySeconds` de la liveness, ce qui retarde aussi la détection d'une appli figée après chaque redémarrage.

### Quelle probe pour quel besoin

Les trois probes vues comme les états d'un conteneur (réglages de l'exemple : 3 échecs d'affilée avant d'agir) :

```mermaid
stateDiagram-v2
  [*] --> Demarrage : conteneur lancé
  state "Démarrage<br/>seule la startup probe tourne" as Demarrage
  state "Prêt<br/>reçoit du trafic" as Pret
  state "Hors circuit<br/>vivant, sans trafic" as HorsCircuit
  state "Redémarrage<br/>conteneur tué" as Redemarrage
  Demarrage --> Pret : startup OK, puis readiness OK
  Demarrage --> Redemarrage : startup toujours en échec
  Pret --> HorsCircuit : readiness en échec 3 fois
  HorsCircuit --> Pret : readiness OK
  Pret --> Redemarrage : liveness en échec 3 fois
  HorsCircuit --> Redemarrage : liveness en échec 3 fois
  Redemarrage --> Demarrage
```

| Je veux... | Probe |
|---|---|
| que les utilisateurs ne tombent plus sur un pod dont la base ne répond plus, sans le tuer pour autant, puisqu'il redeviendra utile dès que la base revient | readiness |
| que Kubernetes relance tout seul une appli figée, par exemple bloquée par un deadlock : elle tourne encore mais ne répond plus à rien | liveness |
| que Kubernetes laisse 2 minutes à une appli lente à démarrer, par exemple parce qu'elle charge un gros cache au lancement, avant que la liveness ne la tue | <span class="term" data-term="startup-probe">startup</span> |

Piège classique : je mets la vérification de la <span class="term" data-term="database">base</span> dans la liveness. Le jour où la base tombe, la liveness de tous les pods échoue en même temps, donc Kubernetes les redémarre tous <span class="term" data-term="restart-loop">en boucle</span>. Redémarrer ne répare pas la base, et mes pods passent leur temps à redémarrer au lieu de répondre.

### Health check
Terme générique pour « vérification de santé ». Les probes sont la version Kubernetes du <span class="term" data-term="health-check">health check</span>.

``` { .text .ex-ref title="Référence" }
$ curl -i http://localhost:8080/livez
HTTP/1.1 200 OK
```

### Les probes dans les traces
Les probes sont des requêtes HTTP comme les autres : l'<span class="term" data-term="instrumentation">instrumentation</span> les trace. Comme elles tournent jour et nuit, elles peuvent représenter presque toutes les <span class="term" data-term="trace-distributed">traces</span> d'un service peu utilisé. Ce cas est détaillé dans [Observabilité : le bruit des probes](observabilite.md#cas-concret-le-bruit-des-probes-kubernetes).

### Ressources : requests et limits
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Chaque conteneur déclare ce qu'il consomme. La **request** est ce que Kubernetes lui réserve : elle sert à choisir un nœud qui a la place. La **limit** est le plafond. Au-dessus de sa limit CPU, le conteneur est ralenti. Au-dessus de sa limit mémoire, il est tué (`OOMKilled`, pour « <span class="term" data-term="oomkilled">out of memory</span> ») puis redémarré.

!!! noob "As noob"
    La request, c'est ma place réservée dans un train : Kubernetes ne me fait monter que dans une voiture où cette place est libre. La limit, c'est le maximum autorisé : trop de CPU et on me ralentit, trop de mémoire et on me fait descendre (le conteneur est tué puis redémarré). La phrase à retenir : **la request sert à placer le pod, la limit sert à le contenir.**

L'oubli fréquent : aucun bloc `resources`. Le pod passe alors dans la classe *BestEffort* : Kubernetes le place sans rien réserver, il peut prendre toute la mémoire du nœud, il est le premier expulsé quand le nœud en manque, et le HPA n'a pas de base pour calculer son pourcentage.
``` { .yaml .ex-bad title="À éviter" }
# À éviter : aucun bloc resources, rien n'est réservé ni plafonné
containers:
  - name: my-api
    image: my-api:1.4.0
```

``` { .yaml .ex-good title="Recommandé" }
# Bien : réserve 250m de CPU et 256Mi, plafonne à 1 CPU et 512Mi
resources:
  requests:
    cpu: 250m
    memory: 256Mi
  limits:
    cpu: "1"
    memory: 512Mi
```
`250m` veut dire 0,25 cœur de CPU. `Mi` est un mébioctet.

Diagnostic d'un pod qui redémarre :
``` { .text .ex-ref title="Référence" }
$ kubectl describe pod my-api-7f9c-abcde
...
    State:          Running
    Last State:     Terminated
      Reason:       OOMKilled
      Exit Code:    137
    Restart Count:  4
```
`137` = 128 + 9 : le conteneur a reçu le signal 9 (`SIGKILL`), il n'a pas pu s'arrêter proprement. Si le nombre de redémarrages monte, c'est une fuite mémoire ou une limit trop basse : redémarrer ne répare rien.

**Risques.** Une limit CPU trop basse ne tue rien, elle ralentit : my-api reste « en bonne santé » mais ses réponses passent de 80 ms à 600 ms aux heures de pointe (chiffres d'exemple), et personne ne pense au CPU. Je surveille le *throttling* (`container_cpu_cfs_throttled_periods_total`) avant de baisser une limit. Une request trop haute réserve des cœurs qui ne servent jamais : les nœuds paraissent pleins, et le cluster ajoute des machines payées pour rien. Je règle les requests sur l'usage réel mesuré au p95, pas sur une estimation.

:material-book-open-variant: Doc de référence : [Kubernetes, Resource Management for Pods and Containers](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) (consultée en novembre 2026)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | les pods tournent sans probes, ou avec une probe copiée d'un autre service, et sans bloc `resources` |
    | N2 | chaque Deployment déclare readiness et liveness (et startup si besoin) sur des routes distinctes, plus requests et limits, à partir d'un modèle commun |
    | N3 | Kubernetes retire du trafic et redémarre seul les pods malades, et un contrôle en CI refuse un manifeste sans probes ni `resources` |
    | N4 | l'équipe ajuste les seuils des probes et les requests d'après les redémarrages, les `OOMKilled` et l'usage réel mesurés |

    **Je mesure** : le nombre de redémarrages et d'`OOMKilled` par pod et par semaine, lu avec `kubectl get pods` ou dans le backend de métriques ; l'écart entre la request et l'usage réel de CPU et de mémoire au p95.

## Construire et déployer : Docker, Helm, Argo CD, Cloud Run

<a class="pill pill-scope pill-scope-infra" href="../architecture/#carte-des-echelles">Échelle · Infrastructure</a>

<a class="pill pill-practice" href="../livraison/#livraison-et-deploiement-continus" title="niveau 2 : elle est automatisée">Pratique · Déploiement continu · N2</a>
<a class="pill pill-dora" href="https://dora.dev/capabilities/deployment-automation/">DORA · Deployment automation</a> <a class="pill pill-dora" href="https://dora.dev/capabilities/flexible-infrastructure/">DORA · Flexible infrastructure</a>


Le chemin d'une modification jusqu'à la production : on emballe l'application dans une image, on décrit comment la faire tourner, puis un outil applique cette description au cluster. Le choix entre ces outils (mini benchmark) est dans le [Panorama des outils techniques](outils.md#conteneurs-et-deploiement-docker-kubernetes-helm-argo-cd-cloud-run).

### Docker : l'image
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>


*Docker : complémentaire de Kubernetes, Helm*
{ .tool-rel }

**Docker** emballe une application et tout ce dont elle a besoin (langage, bibliothèques, fichiers) dans une <span class="term" data-term="docker-image">image</span>. La même image tourne sur le poste du dev, en CI et en production. Elle se décrit dans un `Dockerfile`.

!!! noob "As noob"
    L'image, c'est un plat préparé sous vide : tout est dedans, et il a le même goût dans n'importe quelle cuisine équipée du même four (un moteur de conteneurs). Le conteneur, c'est une assiette de ce plat en train d'être servie : un même sachet peut en remplir plusieurs. La phrase à retenir : **l'image est le modèle figé, le conteneur est une exécution de ce modèle.**

La version qu'on écrit au premier jet marche, mais `python:latest` peut passer d'une version de Python à la suivante d'un build à l'autre, `COPY . .` placé avant l'installation relance `pip install` à chaque ligne de code modifiée, et sans `USER` l'appli tourne en root : une faille dans l'appli donne alors les droits root dans le conteneur.
``` { .dockerfile .ex-bad title="À éviter" }
# À éviter : image latest, code copié avant les dépendances, appli lancée en root
FROM python:latest
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["uvicorn", "my_api.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

``` { .dockerfile .ex-good title="Recommandé" }
# Bien : image Python de my-api, lancée en utilisateur non root (USER 1000)
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
USER 1000
CMD ["uvicorn", "my_api.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

``` { .text .ex-ref title="Référence" }
$ docker build -t my-api:1.4.0 .
$ docker run -p 8080:8080 my-api:1.4.0
$ curl localhost:8080/readyz
{"status": "ok"}
```

Copier `requirements.txt` avant le reste du code profite du <span class="term" data-term="docker-layer-cache">cache des couches</span> : tant que les dépendances ne changent pas, `pip install` n'est pas relancé. `USER 1000` évite de faire tourner l'appli en root.

*pip : concurrent de uv, Poetry, pdm*
{ .tool-rel }


**Risques.** Tout ce qui est copié dans une couche y reste, même si une ligne suivante l'efface : un fichier `.env` avec le mot de passe de la base, copié par `COPY . .`, se retrouve en extrayant l'image (`docker save`). J'exclus ces fichiers avec `.dockerignore` et je passe les secrets au lancement, pas au build. Une image construite une fois ne reçoit pas les correctifs publiés ensuite pour son image de base : l'image de my-api construite il y a six mois embarque des failles connues. Je la reconstruis au moins chaque semaine et je la scanne en CI.

:material-book-open-variant: Doc de référence : [Docker, Dockerfile reference](https://docs.docker.com/reference/dockerfile/) (consultée en novembre 2026) ; [Docker, Build cache](https://docs.docker.com/build/cache/) (consultée en novembre 2026)
{ .doc-ref }

### Image multi-étapes : rapide à reconstruire, légère en production
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

*uv : concurrent de pip, Poetry, pdm*
{ .tool-rel }

L'image de `my-api` fait 1,1 Go, et chaque ligne de code modifiée relance l'installation de toutes les dépendances : le build prend quatre minutes sur mon poste comme en CI. Trois outils de Docker règlent ça. La <span class="term" data-term="multi-stage-build">construction multi-étapes</span> (*multi-stage build*) découpe le `Dockerfile` en étapes nommées par `AS` ; `docker build --target dev` ou `--target prod` choisit l'étape à produire, et l'image finale ne garde que ce que sa dernière étape contient. Le **cache de montage** de <span class="term" data-term="buildkit">BuildKit</span> (le moteur de build par défaut de Docker depuis la version 23, sortie en 2023, à vérifier) garde un dossier, comme le cache de téléchargement de uv, d'un build à l'autre avec `RUN --mount=type=cache` : même quand la couche des dépendances doit être refaite, les paquets ne sont pas retéléchargés. Le fichier **`.dockerignore`** liste ce qui ne part pas dans le *contexte de build*, l'ensemble des fichiers envoyés au moteur : sans lui, `.git` ou un `.venv` local partent à chaque build, alourdissent l'envoi et peuvent finir dans l'image.

!!! noob "As noob"
    Un Dockerfile multi-étapes, c'est une cuisine avec un plan de travail et un passe-plat : on prépare tout sur le plan de travail (outils de compilation, dépendances de test), et seule l'assiette finie passe par le passe-plat vers la salle. Le cache de montage, c'est le garde-manger : on ne refait pas les courses à chaque plat. La phrase à retenir : **on construit avec tout, on livre seulement ce qui sert à faire tourner l'appli.**

**Quand** : dès que l'image part en production, ou que le build revient plusieurs fois par heure dans la boucle de travail. Pour un script jetable lancé une fois, la version simple suffit. **Pourquoi** : un build qui ne refait que la dernière couche quand seul le code change, une image de production plus petite (moins à télécharger au démarrage d'un pod, moins de paquets où trouver des failles), et un seul fichier pour le poste et la production. Le coût : un `Dockerfile` plus long, à relire avec soin. **Comment** : je copie d'abord les fichiers de dépendances et le lockfile, j'installe avec un cache de montage, puis je copie le code ; je sépare une cible `dev` (outils de test, rechargement automatique) d'une cible `prod` (sans outils de dev, utilisateur non root).

À éviter : le code copié avant l'installation, sur l'image complète `python:3.12`. Toute modification d'un fichier invalide la couche, donc toutes les dépendances se réinstallent à chaque build ; l'image embarque compilateurs, outils de test et lint, `uv sync` sans `--frozen` peut résoudre d'autres versions d'un build à l'autre, et l'appli tourne en root.

``` { .dockerfile .ex-bad title="À éviter" }
# À éviter : code copié avant les dépendances, image complète, outils de dev en production, root
FROM python:3.12
WORKDIR /app
COPY . .
RUN pip install uv && uv sync
CMD ["uv", "run", "uvicorn", "my_api.main:app", "--host", "0.0.0.0"]
```

``` { .dockerfile .ex-good title="Recommandé" }
# syntax=docker/dockerfile:1
# Bien : base commune, uv copié depuis son image officielle
FROM python:3.12-slim AS base
WORKDIR /app
ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    PYTHONUNBUFFERED=1
COPY --from=ghcr.io/astral-sh/uv:0.4.30 /uv /usr/local/bin/uv

# Bien : dépendances seules, à partir du lockfile figé, avec le cache de uv gardé entre deux builds
FROM base AS deps
COPY pyproject.toml uv.lock ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-install-project --no-dev

# Bien : cible de développement, avec les outils de test et le rechargement automatique
FROM deps AS dev
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-install-project
CMD ["uv", "run", "uvicorn", "my_api.main:app", "--host", "0.0.0.0", "--reload"]

# Bien : cible de production, code copié en dernier, sans outils de dev, utilisateur non root
FROM deps AS prod
COPY src ./src
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev
RUN useradd --uid 10001 --no-create-home app
USER app
CMD ["/app/.venv/bin/uvicorn", "my_api.main:app", "--host", "0.0.0.0"]
```

Le `.dockerignore` à côté :

``` { .text .ex-ref title="Référence" }
.git
.venv
.uv-cache
__pycache__
tests
*.md
```

``` { .text .ex-ref title="Référence" }
$ docker build --target dev -t my-api:dev .
$ docker build --target prod -t my-api:1.4.0 .
```

| Ce que je modifie | Avant | Après |
|---|---|---|
| une ligne de code dans `src/` | réinstallation complète des dépendances | seule la dernière couche est refaite |
| une dépendance ajoutée | réinstallation complète, tout retéléchargé | réinstallation, mais les paquets viennent du cache de montage |
| mon travail en local | un build à chaque essai | cible `dev`, code monté par un volume, rechargement automatique |

Options de uv et version de son image à vérifier dans leur documentation au moment de l'utilisation.

| Je veux... | J'utilise... |
|---|---|
| ne plus attendre quatre minutes de build chaque fois que je change une ligne de code | fichiers de dépendances copiés avant le code |
| que l'ajout d'une dépendance ne retélécharge pas les 200 autres paquets | `RUN --mount=type=cache` |
| une image de dev avec les outils de test et une image de prod sans eux, depuis un seul fichier | un build multi-étapes avec `--target dev` et `--target prod` |
| que `.git` ou mon `.venv` local ne partent pas dans le build ni dans l'image | un `.dockerignore` |

:material-book-open-variant: Doc de référence : [Docker, Multi-stage builds](https://docs.docker.com/build/building/multi-stage/) (consultée en novembre 2026) ; [Docker, Optimize cache usage in builds](https://docs.docker.com/build/cache/optimize/) (consultée en novembre 2026) ; [Docker, Build context](https://docs.docker.com/build/concepts/context/) (consultée en novembre 2026)
{ .doc-ref }

### ConfigMap et Secret : la config par environnement
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Règle : **la même image partout, la config change par environnement**. L'image `my-api:1.4.0` testée en staging est celle qui part en prod, seules ses <span class="term" data-term="environment-variable">variables d'environnement</span> changent. Un **<span class="term" data-term="configmap">ConfigMap</span>** porte la config non sensible, un **Secret** porte les <span class="term" data-term="secret">secrets</span> (mots de passe, clés).

!!! noob "As noob"
    C'est une voiture de location : le même modèle sort du garage pour chaque client, seuls les réglages (ConfigMap) et la clé (Secret) changent. Limite : par défaut, un Secret est seulement encodé, pas chiffré, donc qui peut le lire doit rester restreint. La phrase à retenir : **on ne reconstruit pas l'image pour changer d'environnement, on change sa config.**

``` { .yaml .ex-ref title="Référence" }
# Exemple : ConfigMap avec la config non secrète de my-api
kind: ConfigMap
metadata:
  name: my-api-config
data:
  LOG_LEVEL: "info"
  ORDERS_SERVICE_URL: "http://orders-service"
```

Ce que je trouve encore dans des dépôts : le mot de passe écrit en clair dans le manifeste, donc lisible par quiconque peut lire Git, et une image `latest`, donc impossible de savoir quelle version tourne ni de revenir à la précédente, puisque chaque nœud a pu tirer une image `latest` différente.
``` { .yaml .ex-bad title="À éviter" }
# À éviter : image latest et mot de passe en clair dans le manifeste versionné
containers:
  - name: my-api
    image: my-api:latest
    env:
      - name: DB_PASSWORD
        value: "s3cr3t-prod"
```

Le Deployment lit les deux dans `env` :
``` { .yaml .ex-good title="Recommandé" }
# Bien : LOG_LEVEL lu dans le ConfigMap, DB_PASSWORD dans le Secret
containers:
  - name: my-api
    image: my-api:1.4.0
    env:
      - name: LOG_LEVEL
        valueFrom:
          configMapKeyRef:
            name: my-api-config
            key: LOG_LEVEL
      - name: DB_PASSWORD
        valueFrom:
          secretKeyRef:
            name: my-api-secrets
            key: DB_PASSWORD
```

| Env     | Image          | `LOG_LEVEL` | `DB_PASSWORD`              |
|---------|----------------|-------------|----------------------------|
| staging | `my-api:1.4.0` | `debug`     | Secret `my-api-secrets` de staging |
| prod    | `my-api:1.4.0` | `info`      | Secret `my-api-secrets` de prod    |

Pièges : un Secret est seulement encodé en base64, pas chiffré, donc jamais en clair dans Git (on le remplit en général depuis un gestionnaire de secrets, à vérifier selon le cluster). Et modifier un ConfigMap ne relance pas les pods : les variables d'environnement sont lues au démarrage.

:material-book-open-variant: Doc de référence : [Kubernetes, ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/) (consultée en novembre 2026) ; [Kubernetes, Secrets](https://kubernetes.io/docs/concepts/configuration/secret/) (consultée en novembre 2026)
{ .doc-ref }

### Helm : le modèle de déploiement
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>


*Helm : concurrent en partie de Kustomize ; complémentaire de Argo CD, Kubernetes*
{ .tool-rel }

**Helm** est un gestionnaire de paquets pour Kubernetes. Un **<span class="term" data-term="helm-chart">chart</span>** est un modèle de <span class="term" data-term="k8s-manifest">manifestes</span>, rempli par un fichier `values.yaml` différent par environnement. Tous les services peuvent partager le même chart.

!!! noob "As noob"
    Un chart, c'est un modèle de lettre avec des champs à remplir (« Bonjour {nom} ») ; le fichier de values, c'est la liste des destinataires. La même lettre part à staging avec 2 copies et à la prod avec 3. La phrase à retenir : **le chart décrit la forme une seule fois, les values disent ce qui change par environnement.**

``` { .yaml .ex-ref title="Référence" }
# templates/deployment.yaml (extrait)
# Exemple : modèle Helm, le nom et le nombre de copies viennent des values
kind: Deployment
metadata:
  name: {{ .Release.Name }}
spec:
  replicas: {{ .Values.replicaCount }}
```
``` { .yaml .ex-ref title="Référence" }
# values-staging.yaml
# Exemple : values de staging, 2 copies
replicaCount: 2
image:
  tag: "1.4.0"
```
``` { .yaml .ex-ref title="Référence" }
# values-prod.yaml
# Exemple : values de prod, 3 copies de la même image
replicaCount: 3
image:
  tag: "1.4.0"
```
`helm template` affiche le résultat sans rien installer :
``` { .text .ex-ref title="Référence" }
$ helm template my-api ./chart -f values-staging.yaml
kind: Deployment
metadata:
  name: my-api
spec:
  replicas: 2

$ helm template my-api ./chart -f values-prod.yaml
kind: Deployment
metadata:
  name: my-api
spec:
  replicas: 3
```

**Risques.** Un template mal indenté ou une value mal orthographiée produit un manifeste faux, ou une value simplement ignorée, sans erreur claire : je lance `helm lint` et `helm template` en CI, et j'ajoute un `values.schema.json`. Les fichiers de values par environnement dérivent si chacun y recopie tout : je garde le commun dans un seul fichier et seulement les différences par environnement. Un `helm upgrade` lancé à la main depuis un poste laisse le cluster dans un état que Git ne décrit pas : je le confie à Argo CD ou à la CI.

:material-book-open-variant: Doc de référence : [Helm, Charts](https://helm.sh/docs/topics/charts/) (consultée en novembre 2026) ; [Helm, Values Files](https://helm.sh/docs/chart_template_guide/values_files/) (consultée en novembre 2026)
{ .doc-ref }

### Un chart générique pour tous les services
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>

Écrire un chart par service, c'est copier vingt fois les mêmes templates (Deployment, Service, probes, HPA...) et les corriger vingt fois. L'alternative : **un seul chart générique**, maintenu par une équipe plateforme, versionné comme une bibliothèque. Chaque service n'écrit plus de template : il fournit seulement ses **values** (image, port, probes, ressources, scaling). Helm prévoit même un type de chart pour ça, le *library chart*, qui ne contient que des modèles réutilisables. Des exemples publics : `app-template` (bjw-s), `application` (Stakater), et la bibliothèque `common` de Bitnami. C'est la brique de base du [golden path](devx.md#golden-paths-et-templates) de déploiement que propose une équipe plateforme.

!!! noob "As noob"
    Le chart générique, c'est un formulaire administratif pré-imprimé : l'équipe plateforme a dessiné les cases une fois pour toutes, chaque service remplit seulement ses cases (nom, image, port). Personne ne redessine le formulaire, et quand la plateforme l'améliore (une nouvelle sécurité, une meilleure probe), tous les services en profitent en changeant de version.

```mermaid
flowchart LR
  subgraph PF["équipe plateforme"]
    G["chart générique<br/>version 3.2.0<br/>templates + values.schema.json"]
  end
  subgraph SV["dépôt de config de chaque service"]
    V1["my-api<br/>values.yaml<br/>values-prod.yaml"]
    V2["orders-service<br/>values.yaml<br/>values-prod.yaml"]
  end
  G --> T["helm template<br/>chart + values"]
  V1 --> T
  V2 --> T
  T --> M["manifestes Kubernetes<br/>Deployment, Service, HPA..."]
  M --> A["Argo CD applique"]
```

**Les values en couches.** Helm accepte plusieurs fichiers `-f` : le suivant écrase le précédent, clé par clé. On met le commun dans `values.yaml`, et seulement les différences dans le fichier de l'environnement.

``` { .yaml .ex-ref title="Référence · values.yaml (commun à tous les environnements)" }
# Exemple : image, port, probes et ressources communs à tous les environnements
image:
  repository: registry.example.com/my-api
  tag: "1.4.0"
port: 8080
probes:
  readiness: /readyz
  liveness: /livez
resources:
  requests: {cpu: 100m, memory: 256Mi}
```

``` { .yaml .ex-ref title="Référence · values-prod.yaml (seulement ce qui change)" }
# Exemple : la prod ne déclare que ses copies et son autoscaling
replicas: 3
autoscaling:
  enabled: true
  maxReplicas: 10
```

``` { .text .ex-ref title="Référence" }
$ helm template my-api platform/generic --version 3.2.0 \
    -f values.yaml -f values-prod.yaml
```

```mermaid
flowchart LR
  D["valeurs par défaut<br/>du chart"] --> C["values.yaml<br/>commun"] --> E["values-prod.yaml<br/>environnement"] --> R["valeurs finales"]
```

**Quand l'utiliser.** Dès qu'une équipe ou une plateforme gère plus d'une poignée de services qui se ressemblent (une API HTTP, un worker, un job planifié). **Quand ne pas l'utiliser** : un composant très particulier (une base de données, un outil tiers qui a déjà son chart officiel) ; on prend alors le chart de l'éditeur.

**Pourquoi.** Gain : une seule correction profite à tous, les bonnes pratiques (probes, limites, sécurité) sont appliquées par défaut, et une revue de values est bien plus courte qu'une revue de templates. Coût : le chart devient un produit à part entière, avec ses versions, sa documentation et ses changements cassants à annoncer.

**Le piège du « tout configurable ».** Si chaque champ Kubernetes devient une value, le fichier de values devient un deuxième langage, plus difficile que les manifestes d'origine. Un bon chart générique expose peu de choses, avec des valeurs par défaut sûres, et laisse une porte de sortie documentée pour les cas rares (des manifestes supplémentaires à côté).

**Comment le tester**, du plus rapide au plus complet :

| Je veux vérifier... | J'utilise... |
|---|---|
| que les values ont la bonne forme (une faute de frappe, un type faux) | un `values.schema.json` dans le chart : Helm refuse les values invalides dès `helm template` |
| que le chart produit un YAML valide | `helm lint`, puis `helm template ... \| kubeconform` |
| qu'une value donne bien le manifeste attendu | des tests unitaires de templates (plugin `helm-unittest`) |
| ce qu'une nouvelle version du chart va changer pour mon service | `helm diff` (plugin) ou le diff d'Argo CD avant de synchroniser |
| qu'un changement cassant n'arrive pas par surprise | une version de chart épinglée par service, montée par MR |

:material-book-open-variant: Doc de référence : [Helm, Library Charts](https://helm.sh/docs/topics/library_charts/) (consultée en novembre 2026) ; [Helm, Schema Files](https://helm.sh/docs/topics/charts/#schema-files) (consultée en novembre 2026) ; [bjw-s, app-template](https://bjw-s-labs.github.io/helm-charts/docs/app-template/) (consultée en novembre 2026)
{ .doc-ref }

### Argo CD : Git décide de ce qui tourne
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>


*Argo CD : concurrent de Flux ; complémentaire de Helm, Kubernetes*
{ .tool-rel }

Mon équipe déploie `my-api` en lançant `helm upgrade` depuis la CI, et parfois depuis un poste pendant un incident. Trois mois plus tard, personne ne sait dire quelle version tourne en prod sans aller regarder dans le cluster, un nombre de copies changé à la main pendant un pic de trafic y est resté, et la CI détient des droits d'administration sur le cluster de production. **<span class="term" data-term="gitops">GitOps</span>** règle ça en inversant le sens : au lieu que la CI pousse vers le cluster, un agent installé dans le cluster tire l'état voulu depuis Git et l'applique. **<span class="term" data-term="argo-cd">Argo CD</span>** est cet agent. Avec Flux, c'est l'un des deux outils GitOps diplômés de la CNCF (fin 2022).

!!! noob "As noob"
    GitOps, c'est un thermostat : je règle la température voulue (le dépôt Git), et l'appareil chauffe ou coupe tout seul pour y revenir, même si quelqu'un ouvre la fenêtre (une modification faite à la main dans le cluster). La phrase à retenir : **pour changer ce qui tourne, on change Git, pas le cluster.**

Le groupe de travail OpenGitOps de la CNCF résume GitOps en quatre principes (version 1.0.0, 2021) :

| Principe | Ce que ça veut dire pour `my-api` |
|---|---|
| déclaratif | Git décrit le résultat voulu (3 pods en 1.4.1), pas les commandes pour y arriver |
| versionné et immuable | chaque état voulu est un commit : je sais qui a déployé quoi et quand, et je peux revenir à n'importe quel commit |
| tiré automatiquement | c'est Argo CD, dans le cluster, qui va chercher Git : la CI n'a plus besoin d'accès au cluster |
| réconcilié en continu | Argo CD compare sans arrêt Git et le cluster, puis signale ou corrige l'écart |

**Les mots d'Argo CD.**

| Mot | Ce que c'est | Exemple |
|---|---|---|
| <span class="term" data-term="argo-application">Application</span> | la ressource Argo CD qui relie une source (un dossier Git, un chart Helm) à un namespace d'un cluster | `my-api-prod` : le chart générique avec les values de `my-api`, vers le namespace `my-team` |
| <span class="term" data-term="config-repo">dépôt de config</span> | le dépôt Git qui décrit ce qui tourne, séparé du dépôt de code : la CI de l'appli y ouvre une MR à chaque nouvelle version | `deploy-config`, qui contient `my-api/values-prod.yaml` |
| synchronisation (sync) | l'action d'appliquer Git au cluster, à la main (bouton, `argocd app sync`) ou automatiquement | Argo CD applique la MR fusionnée il y a une minute |
| statut de synchronisation | `Synced` si le cluster ressemble à Git, `OutOfSync` sinon | `OutOfSync` juste après la fusion, `Synced` une fois appliqué |
| santé | l'état des ressources une fois appliquées : `Healthy`, `Progressing` (rollout en cours), `Degraded` (pods jamais prêts) | `Degraded` si la readiness de la 1.4.1 échoue |
| <span class="term" data-term="configuration-drift">écart</span> (drift) | une différence entre Git et le cluster, le plus souvent un changement fait à la main | quelqu'un a lancé `kubectl scale --replicas=6` |
| `selfHeal` | option qui annule tout seul un écart, sans attendre un nouveau commit | les 6 copies redeviennent 3 quelques secondes plus tard |
| `prune` | option qui supprime du cluster une ressource retirée de Git, désactivée par défaut par sécurité | le CronJob retiré du chart disparaît du cluster |
| <span class="term" data-term="argo-applicationset">ApplicationSet</span> | un générateur d'Applications : une par environnement, par cluster, ou par MR ouverte | une Application `preview-mr-42` créée à l'ouverture de la MR 42, supprimée à sa fermeture |

L'Application de `my-api` en prod. Elle prend le [chart générique](#un-chart-generique-pour-tous-les-services) de l'équipe plateforme et les values de `my-api` dans le dépôt de config (deux sources, la seconde référencée par `$values`), et elle est rangée elle aussi dans Git :

``` { .yaml .ex-ref title="Référence" }
# Exemple : Application Argo CD de my-api en prod, synchronisation automatique
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-api-prod
  namespace: argocd
spec:
  project: default
  sources:
    - repoURL: https://charts.example.com/platform
      chart: generic
      targetRevision: 3.2.0
      helm:
        valueFiles:
          - $values/my-api/values.yaml
          - $values/my-api/values-prod.yaml
    - repoURL: https://git.example.com/my-team/deploy-config.git
      targetRevision: main
      ref: values
  destination:
    server: https://kubernetes.default.svc
    namespace: my-team
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

Le trajet complet d'une version, de la MR de code au pod :

```mermaid
sequenceDiagram
  participant Dev as ada (dev)
  participant App as dépôt my-api
  participant CI
  participant Reg as registre d'images
  participant Cfg as dépôt de config
  participant Argo as Argo CD
  participant K8s as cluster
  Dev->>App: merge la MR
  App->>CI: pipeline
  CI->>Reg: push my-api:1.4.1
  CI->>Cfg: MR "image.tag: 1.4.1" dans values-prod.yaml
  Argo->>Cfg: surveille la branche principale
  Argo->>Argo: helm template avec values-prod.yaml
  Argo->>K8s: applique les manifestes, corrige les écarts
  K8s->>Reg: tire l'image my-api:1.4.1
```

**Revenir en arrière.** La 1.4.1 renvoie des erreurs 500. Avec la synchronisation automatique, Argo CD refuse `argocd app rollback`, et un `kubectl rollout undo` serait annulé par `selfHeal` : je reviens en arrière par Git. Par défaut, Argo CD interroge Git toutes les 2 à 3 minutes ; un webhook du dépôt rend la détection immédiate. Heures en exemple :
``` { .text .ex-illus title="Illustration" }
heure  action                                                 statut Argo CD
14:02  MR "image.tag: 1.4.1" fusionnée                        OutOfSync
14:04  Argo CD voit le commit et l'applique                   Synced, Progressing
14:05  rollout terminé, l'alerte sur les 5xx se déclenche     Synced, Healthy
14:08  j'annule la MR (git revert), relue et fusionnée        OutOfSync
14:09  Argo CD applique image.tag: 1.4.0                      Synced, Progressing
14:10  pods 1.4.0 prêts, les 5xx retombent                    Synced, Healthy
```
À 14:05, Argo CD dit `Healthy` alors que l'appli renvoie des 500 : il lit l'état Kubernetes (pods prêts, rollout fini), pas le taux d'erreurs. Pour arrêter tout seul une version qui dégrade le service, il faut un [déploiement progressif](livraison.md#deploiement-progressif) qui lit les métriques (Argo Rollouts, Flagger).

**Quand.** Dès que plusieurs personnes ou plusieurs services déploient sur un même cluster Kubernetes, et que je veux répondre à « qu'est-ce qui tourne en prod, et depuis quand ? » en lisant Git. **Pas quand** : un service seul sur Cloud Run ou un autre PaaS, sans cluster à surveiller ; une équipe dont la CI ne construit pas encore d'images versionnées (c'est l'étape d'avant, le niveau N2 ci-dessous) ; ma boucle de travail sur un cluster de dev, où j'attends le résultat en secondes, pas en minutes (voir [Accélérer la boucle interne](devx.md#accelerer-la-boucle-interne)).

**Pourquoi.** Le gain : un historique et un audit sans effort (`git log` dit qui a déployé quoi), un rollback qui est une MR comme une autre, une CI qui n'a plus aucun droit sur le cluster de prod, des écarts visibles et corrigés, et la même procédure pour tous les services. Le coût : un dépôt et une MR de plus par déploiement, quelques minutes de délai, Argo CD lui-même à installer, mettre à jour et surveiller, et des secrets qu'il ne faut jamais écrire en clair dans Git (voir [ConfigMap et Secret](#configmap-et-secret-la-config-par-environnement)).

**Comment**, pas à pas :

1. Je sépare le dépôt de config du dépôt de code : une MR de config ne relance pas toute la CI de l'appli, et les droits de fusion sur la prod ne sont pas les mêmes.
2. Je décris chaque service et chaque environnement par une Application, ou par un ApplicationSet quand ils se ressemblent tous, et je range ces fichiers dans Git.
3. La CI de l'appli, après avoir poussé l'image, ouvre une MR qui change `image.tag` ; en prod, cette MR est relue.
4. Je commence en synchronisation manuelle sur la prod, en lisant le diff d'Argo CD avant chaque sync. Je passe en automatique avec `selfHeal` quand l'équipe a confiance, et j'active `prune` en dernier.
5. Je surveille Argo CD comme un service de production, et j'envoie ses notifications (sync en échec, application `Degraded`) dans le canal de l'équipe.

**Risques.** Une MR fusionnée sur le dépôt de config part en production à la synchronisation suivante, erreur comprise : je protège la branche, je fais relire les MR de prod, et je regarde le diff d'Argo CD avant de synchroniser. Avec `selfHeal`, un correctif d'urgence fait à la main dans le cluster est annulé quelques secondes plus tard : en incident, je passe par une MR, ou je suspends la synchronisation automatique de l'application en le disant dans le canal. Avec `prune`, un dossier renommé par erreur dans le dépôt de config supprime les ressources de l'ancien nom : je relis les MR qui déplacent des fichiers. Si Argo CD est en panne, plus rien ne se déploie : je le surveille comme le reste.

| Situation | Choix |
|---|---|
| plusieurs équipes déploient sur des clusters Kubernetes et veulent voir l'état de chaque appli dans une interface web, avec le diff avant chaque synchronisation | Argo CD |
| une équipe plateforme veut le même principe GitOps piloté entièrement par des ressources Kubernetes et la ligne de commande, sans interface web fournie par le projet (à vérifier) | Flux |
| un seul petit service sur un seul cluster, une équipe de deux personnes : la CI lance `helm upgrade --atomic` avec un compte limité à son namespace | déploiement poussé par la CI, en renonçant à la correction des écarts |
| pas de cluster du tout, je donne une image et le fournisseur la fait tourner | [Cloud Run](#cloud-run-sans-cluster) |

:material-book-open-variant: Doc de référence : [Argo CD, Core Concepts](https://argo-cd.readthedocs.io/en/stable/core_concepts/) (consultée en novembre 2026) ; [Argo CD, Automated Sync Policy](https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/) (consultée en novembre 2026) ; [OpenGitOps, Principles](https://opengitops.dev/) (version 1.0.0, 2021)
{ .doc-ref }

### Cloud Run : sans cluster
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>


*Cloud Run : concurrent de Kubernetes ; complémentaire de Docker*
{ .tool-rel }

**Cloud Run** : on donne une image, Google la fait tourner et la met à l'échelle, jusqu'à zéro instance. Pas de cluster à gérer, mais moins de contrôle (réseau, probes, ressources). **GKE** est, lui, le Kubernetes managé de Google.

**Risques.** À zéro instance, la première requête attend le démarrage d'un conteneur, de quelques centaines de millisecondes à plusieurs secondes selon l'image (à vérifier) : je garde une instance minimale pour un service qui doit répondre vite. Je dépends des limites et des prix d'un seul fournisseur, avec des réglages (réseau, probes, ressources) moins riches que sur Kubernetes : je garde mon appli dans une image standard, pour pouvoir la déplacer.

:material-book-open-variant: Doc de référence : [Google Cloud, What is Cloud Run](https://cloud.google.com/run/docs/overview/what-is-cloud-run) (consultée en novembre 2026) ; [GKE overview](https://cloud.google.com/kubernetes-engine/docs/concepts/kubernetes-engine-overview) (consultée en novembre 2026)
{ .doc-ref }

### Quoi utiliser

| Je veux... | J'utilise... |
|---|---|
| que mon appli tourne pareil sur mon poste, en CI et en prod, au lieu de planter en prod parce qu'une bibliothèque n'y a pas la même version | Docker |
| que mon build ne réinstalle pas toutes les dépendances à chaque ligne de code modifiée, et que l'image de prod ne contienne pas les outils de test | un [build multi-étapes](#image-multi-etapes-rapide-a-reconstruire-legere-en-production) avec cache de montage |
| faire tourner beaucoup de services qui doivent être surveillés, redémarrés, mis à l'échelle et s'appeler entre eux, comme `orders-service` qui appelle `my-api` | Kubernetes |
| ne pas réécrire les mêmes fichiers YAML de déploiement pour chaque service et chaque environnement | Helm |
| que l'équipe de chaque service écrive seulement ce qui lui est propre (image, port, ressources), et qu'une équipe plateforme maintienne le reste une seule fois pour tous | un [chart générique](#un-chart-generique-pour-tous-les-services) |
| pouvoir répondre à « qu'est-ce qui tourne en prod ? » en lisant Git, et qu'une modification faite à la main dans le cluster soit annulée toute seule | Argo CD |
| faire tourner un petit service ou un job lancé de temps en temps, sans personne pour gérer un cluster | Cloud Run |

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | l'image est construite sur un poste et déployée avec `kubectl apply` à la main |
    | N2 | la CI construit l'image avec un tag de version, et Helm génère les manifestes à partir des values de chaque environnement |
    | N3 | Argo CD applique seul ce que dit Git et annule les modifications faites à la main, et une MR de config non relue ne peut pas partir en prod |
    | N4 | l'équipe suit la durée du build, la taille des images et le délai entre fusion et déploiement, et les réduit quand ils montent |

    **Je mesure** : la part des déploiements de production faits par Argo CD depuis Git, sans `kubectl` à la main, lue dans l'historique d'Argo CD et le journal d'audit du cluster ; la durée médiane du build de l'image, lue dans la CI.

## Autoscaling et serverless : HPA, KEDA, Knative, Karpenter

<a class="pill pill-scope pill-scope-infra" href="../architecture/#carte-des-echelles">Échelle · Infrastructure</a>

!!! info "Rédigé le 04/11/2026"
    Versions d'API, statuts de projets et options citées datent de cette rédaction. Elles évoluent vite, à vérifier dans la documentation de chaque projet : [HPA](https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/), [KEDA](https://keda.sh/docs/), [Knative](https://knative.dev/docs/serving/), [Karpenter](https://karpenter.sh/docs/), [Cluster Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler) (consultées en novembre 2026).

L'<span class="term" data-term="autoscaling">autoscaling</span> ajuste la capacité à la charge sans intervention humaine. Il y a deux étages, à ne pas confondre :

!!! noob "As noob"
    Je pense à un supermarché : ouvrir plus de caisses quand la file s'allonge (étage pods), et ouvrir une salle de plus quand il n'y a plus la place d'installer une caisse (étage nœuds). La première action prend quelques secondes, la seconde plus longtemps. La phrase à retenir : **l'étage pods ajoute des copies, l'étage nœuds ajoute de la place pour les accueillir.**

``` { .text .ex-illus title="Illustration" }
étage pods   : combien de copies de my-api ?        HPA, KEDA, Knative
étage nœuds  : combien de machines dans le cluster ? Cluster Autoscaler, Karpenter
```

Les deux s'enchaînent : l'étage pods demande 6 pods, il n'y a de la place que pour 4, les 2 autres restent `Pending` (en attente d'un nœud), et l'étage nœuds ajoute une machine. Sans autoscaling, on fixe `replicas: 3` et le nombre de nœuds à la main, comme dans le [Deployment](#deployment) plus haut.

```mermaid
flowchart LR
  L[La charge monte] --> HPA["Étage pods<br/>HPA, KEDA, Knative"]
  HPA -->|"replicas: 3 puis 6"| S{De la place<br/>sur les nœuds ?}
  S -->|oui| R[6 pods prêts]
  S -->|non| P[2 pods Pending]
  P --> NA["Étage nœuds<br/>Cluster Autoscaler, Karpenter"]
  NA -->|"ajoute une machine"| R
```

| Signal | Piste |
|---|---|
| mon API reçoit beaucoup de monde à midi et presque personne la nuit, mais je paie le même nombre de pods tout le temps | HPA |
| un worker lit une file, et les messages arrivent par vagues : une montagne d'un coup, puis presque rien pendant des heures | KEDA |
| j'ai beaucoup de petits services HTTP appelés quelques fois par jour, comme des outils internes ou des webhooks, et les nœuds qui les portent sont payés à ne rien faire | Knative (ou Cloud Run sans cluster) |
| des pods restent `Pending` parce qu'aucune machine n'a la place de les accueillir, ou au contraire je paie des nœuds à moitié vides | Cluster Autoscaler ou Karpenter |
| ma charge est à peu près la même toute la journée, et je sais la prévoir | rien : `replicas` fixe, plus simple à comprendre |

### HPA : le point de départ
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>


*HPA : complémentaire de KEDA, Karpenter, Cluster Autoscaler*
{ .tool-rel }

**Quand** : un service HTTP dont la charge suit le CPU ou la mémoire (pic à midi, creux la nuit). Pas pour un worker de file : son CPU peut rester bas alors que 50 000 messages attendent.

**Pourquoi** : ne pas payer 10 pods la nuit, ne pas tomber avec 3 pods au pic. Coût : un délai de réaction (la métrique est relevée toutes les 15 s environ, puis le pod doit démarrer et passer sa [readiness probe](#readiness-probe)), et des requests CPU qui doivent être justes.

**Comment** : le **HorizontalPodAutoscaler** (HPA), intégré à Kubernetes, compare l'usage moyen des pods à une cible exprimée en pourcentage de leur **request** (voir [requests et limits](#ressources-requests-et-limits)), et change `replicas` du Deployment.

!!! noob "As noob"
    Le HPA, c'est un régulateur de vitesse : je fixe la cible (70 % de CPU), il mesure en continu et accélère (ajoute des pods) ou lève le pied (en retire) pour y revenir, sans sortir de son minimum et de son maximum. Limite : il réagit après coup, il ne voit pas venir la côte. La phrase à retenir : **le HPA corrige le nombre de pods pour ramener l'usage moyen vers la cible.**

La boucle de contrôle du HPA, qui tourne en continu :

```mermaid
flowchart LR
  MS[metrics-server<br/>CPU de chaque pod] -->|"toutes les 15 s environ"| H[HPA<br/>compare à la cible 70 %]
  H -->|"change replicas"| D[Deployment my-api]
  D --> P[pods my-api]
  P -->|"consomment du CPU"| MS
```

``` { .yaml .ex-ref title="Référence" }
# Exemple : HPA qui vise 70 % de CPU moyen, entre 2 et 10 pods
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-api
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

Le calcul : pods voulus = arrondi supérieur de (pods actuels × usage actuel / cible).

``` { .text .ex-illus title="Illustration" }
heure  pods  CPU moyen (en % de la request)   décision
12:00  3     140 %                            3 × 140 / 70 = 6 pods
12:02  6     72 %                             proche de la cible : rien
14:00  6     20 %                             6 × 20 / 70 = 1,7 donc 2 pods (minReplicas), après la fenêtre de stabilisation
```

Pièges :

- Sans `requests.cpu`, le pourcentage n'a pas de base : le HPA ne décide rien.
- Avec Helm et [Argo CD](#argo-cd-git-decide-de-ce-qui-tourne), un `replicas: 3` écrit dans le Deployment se bat avec le HPA : Argo CD remet 3, le HPA remet 6. On retire `replicas` du modèle quand le HPA est activé (ou on fait ignorer ce champ par Argo CD).
- Le HPA ne descend pas sous 1 pod (descendre à 0 demande une option expérimentale de Kubernetes, à vérifier). C'est le rôle de KEDA et Knative.

:material-book-open-variant: Doc de référence : [Kubernetes, HorizontalPodAutoscaler Walkthrough](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) (consultée en novembre 2026)
{ .doc-ref }

### KEDA : scaler sur les événements, jusqu'à zéro
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>


*KEDA : concurrent en partie de Knative ; complémentaire de HPA, Karpenter*
{ .tool-rel }

**Quand** : un <span class="term" data-term="worker">worker</span> qui consomme une file RabbitMQ, un topic Kafka, un abonnement Pub/Sub, ou un job lancé par un <span class="term" data-term="cron">cron</span>. Le bon signal n'est pas le CPU mais le **retard** : le <span class="term" data-term="consumer-lag">lag</span> (messages publiés mais pas encore lus). Pas pour un service HTTP qui doit répondre vite à la première requête : à zéro pod, le premier message attend le démarrage d'un pod.

*RabbitMQ : concurrent en partie de Pub/Sub, SQS ; complémentaire de Kafka*<br>
*Kafka : concurrent en partie de Pub/Sub ; complémentaire de RabbitMQ, Strimzi*<br>
*Pub/Sub : concurrent en partie de RabbitMQ, Kafka, SQS*
{ .tool-rel }


**Pourquoi** : le <span class="term" data-term="scale-to-zero">scale to zero</span>. Un worker qui traite un lot par nuit ne coûte rien le reste du temps, et il passe à 20 pods quand 100 000 messages arrivent. Coût : un composant de plus à exploiter, et un délai au réveil.

!!! noob "As noob"
    KEDA, c'est la lumière à détecteur de présence d'un couloir : personne, lumière éteinte (zéro pod) ; quelqu'un entre, elle s'allume après un court instant (le réveil). Ici, le détecteur regarde les messages en attente, pas le CPU. La phrase à retenir : **KEDA réveille le worker quand du travail attend, et l'éteint quand il n'y a plus rien.**

**Comment** : **KEDA** (*Kubernetes Event-Driven Autoscaling*, projet diplômé de la CNCF en 2023, à vérifier) s'installe dans le cluster. On décrit un `ScaledObject` : KEDA crée et pilote lui-même un HPA pour aller de 1 à N, et gère seul le passage de 0 à 1 et de 1 à 0. Une soixantaine de sources sont prises en charge (Kafka, RabbitMQ, Pub/Sub, Prometheus, cron, à vérifier).

*Prometheus : concurrent de Datadog ; complémentaire de Grafana, Alertmanager, OpenTelemetry*
{ .tool-rel }


``` { .yaml .ex-ref title="Référence" }
# Exemple : KEDA dimensionne email-worker selon le lag Kafka, de 0 à 12 pods
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: email-worker
spec:
  scaleTargetRef:
    name: email-worker
  minReplicaCount: 0
  maxReplicaCount: 12
  cooldownPeriod: 300
  triggers:
    - type: kafka
      metadata:
        bootstrapServers: kafka:9092
        consumerGroup: email-worker
        topic: orders
        lagThreshold: "100"
```

`lagThreshold: "100"` veut dire « un pod pour 100 messages de retard ». `cooldownPeriod: 300` : attendre 5 minutes sans message avant de revenir à zéro.

Qui fait quoi : KEDA gère seul le passage de 0 à 1 pod (et retour), puis délègue au HPA qu'il a créé.

```mermaid
flowchart LR
  K[(Kafka<br/>topic orders)] -->|"lag du groupe email-worker"| KO[KEDA operator]
  KO -->|"0 vers 1, 1 vers 0"| D[Deployment email-worker]
  KO -->|"crée et alimente"| H["HPA keda-hpa-email-worker<br/>(1 à 12)"]
  H -->|"1 vers N"| D
  D --> P[pods email-worker]
  P -->|"lisent les messages"| K
```

``` { .text .ex-illus title="Illustration" }
heure  lag du groupe email-worker   pods
02:00  0                            0
02:01  1 200                        1 (réveil par KEDA), puis 12 (1 200 / 100)
02:06  80                           1
02:07  0                            1
02:12  0 depuis 5 min               0
```

Même idée sur RabbitMQ : `type: rabbitmq`, avec `queueName: invoice-emails`, `mode: QueueLength` et `value: "50"` (50 messages en attente par pod), les identifiants venant d'un `TriggerAuthentication`. Piège Kafka : au-delà du nombre de partitions du topic, les pods en plus n'ont rien à lire, et KEDA plafonne par défaut à ce nombre (à vérifier selon la version).

:material-book-open-variant: Doc de référence : [KEDA, Scaling Deployments](https://keda.sh/docs/latest/concepts/scaling-deployments/) (consultée en novembre 2026) ; [KEDA, Apache Kafka scaler](https://keda.sh/docs/latest/scalers/apache-kafka/) (consultée en novembre 2026)
{ .doc-ref }

### Knative Serving : du serverless sur son propre cluster
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>


*Knative : concurrent en partie de KEDA*
{ .tool-rel }

**Quand** : beaucoup de petits services HTTP peu appelés (outils internes, webhooks, aperçus de MR) sur un cluster qui existe déjà, et l'envie d'avoir le modèle de [Cloud Run](#cloud-run-sans-cluster) sans quitter Kubernetes. Pas si Cloud Run suffit (rien à exploiter), ni pour une API dont la première requête doit répondre en quelques millisecondes : il y a un <span class="term" data-term="cold-start">démarrage à froid</span>.

**Pourquoi** : <span class="term" data-term="serverless">serverless</span> sur Kubernetes. Le service tombe à zéro quand personne ne l'appelle et monte selon le nombre de requêtes simultanées, pas le CPU. Coût : Knative ajoute ses propres composants et une couche réseau (Kourier ou Istio) à installer et mettre à jour.

*Istio : concurrent de Linkerd ; complémentaire de Envoy*
{ .tool-rel }


**Comment** : on décrit un `Service` Knative (différent du [Service](#service) Kubernetes). Knative crée Deployment, Service et routage, et un composant (l'*activator*) retient les requêtes pendant qu'un pod démarre.

``` { .yaml .ex-ref title="Référence" }
# Exemple : Service Knative de 0 à 10 pods, cible de 20 requêtes simultanées par pod
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: report-service
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/min-scale: "0"
        autoscaling.knative.dev/max-scale: "10"
        autoscaling.knative.dev/target: "20"
    spec:
      containers:
        - image: report-service:1.4.0
```

`target: "20"` : environ 20 requêtes simultanées par pod. Cloud Run reprend l'API de Knative Serving, ce qui rend le passage de l'un à l'autre assez direct (à vérifier sur les champs pris en charge).

:material-book-open-variant: Doc de référence : [Knative, About autoscaling](https://knative.dev/docs/serving/autoscaling/) (consultée en novembre 2026)
{ .doc-ref }

### Karpenter et Cluster Autoscaler : ajouter des nœuds
<span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>


*Karpenter : concurrent de Cluster Autoscaler ; complémentaire de HPA, KEDA*<br>
*Cluster Autoscaler : concurrent de Karpenter ; complémentaire de HPA*
{ .tool-rel }

**Quand** : des pods restent `Pending` parce qu'aucun <span class="term" data-term="node-k8s">nœud</span> n'a la place, ou à l'inverse des nœuds payés tournent à 20 %. Inutile sur Cloud Run, et souvent déjà réglé par le fournisseur sur un Kubernetes managé en mode tout automatique (GKE Autopilot par exemple, à vérifier).

**Pourquoi** : sans lui, HPA et KEDA demandent des pods que personne ne peut placer. Gain : la facture suit la charge. Coût : un nœud met en général une à quelques minutes à arriver (ordre de grandeur, à vérifier selon le fournisseur), et retirer un nœud déplace ses pods.

**Comment** : deux approches.

- **Cluster Autoscaler** (projet Kubernetes historique) agrandit ou réduit des **groupes de nœuds** définis à l'avance (« groupe e2-standard-4, de 3 à 20 machines »). Simple, présent chez tous les fournisseurs, mais il ne choisit pas le type de machine.
- **Karpenter** (créé par AWS en 2021, version 1.0 en 2024, à vérifier) regarde les pods en attente et commande directement la machine qui leur convient, sans groupe prédéfini. Il **consolide** aussi : il replace les pods pour éteindre les nœuds sous-utilisés. Il peut viser des <span class="term" data-term="spot-instance">machines spot</span>. Il tourne surtout sur AWS, et sur Azure via son équivalent intégré (à vérifier pour les autres fournisseurs).

``` { .yaml .ex-ref title="Référence" }
# Exemple : NodePool Karpenter, spot ou à la demande, consolide les nœuds sous-utilisés
apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: default
spec:
  template:
    spec:
      requirements:
        - key: karpenter.sh/capacity-type
          operator: In
          values: ["spot", "on-demand"]
        - key: kubernetes.io/arch
          operator: In
          values: ["amd64", "arm64"]
      nodeClassRef:
        group: karpenter.k8s.aws
        kind: EC2NodeClass
        name: default
  limits:
    cpu: "200"
  disruption:
    consolidationPolicy: WhenEmptyOrUnderutilized
    consolidateAfter: 1m
```

`limits.cpu: "200"` plafonne la taille totale : c'est le garde-fou de la facture.

| Critère                        | Cluster Autoscaler           | Karpenter                          |
|--------------------------------|------------------------------|------------------------------------|
| Unité ajoutée                  | un nœud d'un groupe prédéfini | la machine qui convient aux pods en attente |
| Choix du type de machine       | ★ (fixé par groupe)          | ★★★                                |
| Réduction des nœuds à moitié vides | ★★                       | ★★★ (consolidation)                |
| Fournisseurs                   | ★★★ (presque tous)           | ★★ (AWS, Azure, à vérifier)        |
| Simplicité                     | ★★★                          | ★★                                 |

:material-book-open-variant: Doc de référence : [Karpenter, NodePools](https://karpenter.sh/docs/concepts/nodepools/) (consultée en novembre 2026) ; [Cluster Autoscaler FAQ](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md) (consultée en novembre 2026)
{ .doc-ref }

### Quoi utiliser pour scaler

| Je veux... | J'utilise... |
|---|---|
| que mon API HTTP ajoute des pods quand son CPU monte au pic de midi et en retire la nuit, sans jamais descendre sous 2 pods | HPA |
| qu'un worker ajoute des pods quand les messages s'accumulent dans sa file, et tombe à zéro pod la nuit quand il n'a rien à lire | KEDA |
| que mes petits services HTTP peu appelés tombent à zéro quand personne ne les appelle, sur le cluster Kubernetes que j'ai déjà | Knative Serving |
| la même chose, sans aucun cluster à gérer | [Cloud Run](#cloud-run-sans-cluster) |
| que le cluster ajoute des machines quand des pods attendent une place et en retire quand elles se vident, quel que soit mon fournisseur cloud | Cluster Autoscaler |
| sur AWS, que le cluster choisisse lui-même la bonne taille de machine pour les pods en attente, y compris des machines spot | Karpenter |
| rien de plus, parce que ma charge ne bouge presque pas | `replicas` fixe |

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | `replicas` est fixé à la main, et quelqu'un l'augmente avant un pic annoncé |
    | N2 | un HPA ou un ScaledObject KEDA ajuste les pods, et un autoscaler de nœuds ajoute des machines |
    | N3 | la capacité suit seule la charge entre un minimum et un plafond, sans pod `Pending` durable ni intervention humaine au pic |
    | N4 | l'équipe ajuste cibles, minimums et plafonds d'après la latence au pic, le lag des workers et la facture du mois |

    **Je mesure** : le temps passé avec des pods `Pending` et la latence p95 pendant le pic, lus dans le backend de métriques ; le coût du cluster rapporté au trafic servi, lu sur la facture.

## Opérateurs Kubernetes : Strimzi

<a class="pill pill-scope pill-scope-infra" href="../architecture/#carte-des-echelles">Échelle · Infrastructure</a> <span class="pill pill-status pill-status-ok" title="Toujours valable, vérifié en novembre 2026">Valable · 11/2026</span>


*Strimzi : complémentaire de Kafka*
{ .tool-rel }

!!! info "Rédigé le 04/11/2026"
    Versions et statuts de projets cités à cette date, à vérifier : [opérateurs Kubernetes](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/), [Strimzi](https://strimzi.io/documentation/) (consultées en novembre 2026).

Un **<span class="term" data-term="k8s-operator">opérateur</span>** est un programme qui tourne dans le cluster et fait le travail d'un administrateur pour un logiciel précis : installer, mettre à jour, sauvegarder, remplacer un membre tombé. On lui décrit l'état voulu dans une **<span class="term" data-term="custom-resource">ressource personnalisée</span>** (CRD, *custom resource definition*, un nouveau `kind` ajouté à Kubernetes), et il compare en boucle l'état voulu à l'état réel, comme un Deployment le fait pour ses pods.

!!! noob "As noob"
    Un opérateur, c'est un administrateur spécialisé qui ne dort jamais : je lui laisse une fiche « je veux un Kafka de 3 machines », il installe, surveille, remplace ce qui tombe, et revient sans cesse vérifier que la réalité colle à la fiche. La phrase à retenir : **un opérateur, c'est le savoir-faire d'un administrateur transformé en boucle automatique.**

La boucle de réconciliation, le cœur de tout opérateur (et de tout contrôleur Kubernetes) :

```mermaid
flowchart LR
  G[Git<br/>KafkaTopic orders] -->|"Argo CD applique"| API[API server]
  API -->|"surveille les KafkaTopic"| OP[Opérateur Strimzi]
  OP --> C{État voulu =<br/>état réel ?}
  C -->|oui| W[Attendre le<br/>prochain changement]
  C -->|non| A[Agir sur Kafka<br/>créer, modifier, recréer]
  A -->|"met à jour status"| API
  W --> OP
```

**Quand** : faire tourner soi-même un logiciel avec état (Kafka, PostgreSQL, Elasticsearch) dans Kubernetes, sans écrire ses propres scripts d'exploitation. Pas quand un <span class="term" data-term="managed-service">service managé</span> équivalent existe et que l'équipe n'a personne pour exploiter la base : l'opérateur automatise les gestes, pas la compétence pour diagnostiquer une panne.

*PostgreSQL : concurrent de MySQL, MariaDB ; concurrent en partie de MongoDB ; complémentaire de Redis, PgBouncer, BigQuery, Elasticsearch*<br>
*Elasticsearch : concurrent de OpenSearch ; complémentaire de PostgreSQL*
{ .tool-rel }


**Pourquoi** : un `StatefulSet` Kafka écrit à la main ne sait pas faire une mise à jour sans coupure, ajouter un broker ou créer un topic. L'opérateur encode ce savoir-faire. Coût : l'opérateur lui-même est un logiciel à mettre à jour, et la responsabilité des données reste à l'équipe.

**Comment** : on installe l'opérateur (souvent par un chart [Helm](#helm-le-modele-de-deploiement)), puis on écrit ses ressources dans Git, et [Argo CD](#argo-cd-git-decide-de-ce-qui-tourne) les applique comme le reste. Exemple avec **Strimzi**, l'opérateur Kafka de la CNCF (projet en incubation, à vérifier) :

``` { .yaml .ex-ref title="Référence" }
# Exemple : cluster Kafka géré par l'opérateur Strimzi
apiVersion: kafka.strimzi.io/v1beta2
kind: Kafka
metadata:
  name: events
spec:
  kafka:
    listeners:
      - name: plain
        port: 9092
        type: internal
        tls: false
  entityOperator:
    topicOperator: {}
```
``` { .yaml .ex-ref title="Référence" }
# Exemple : topic orders (6 partitions, 3 répliques), créé par l'opérateur
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaTopic
metadata:
  name: orders
  labels:
    strimzi.io/cluster: events
spec:
  partitions: 6
  replicas: 3
```

Extrait simplifié : les versions récentes demandent aussi un `KafkaNodePool` qui décrit les brokers (nombre, disques), et les versions d'API changent (à vérifier dans la documentation Strimzi). Créer le topic `orders` revient à faire une MR qui ajoute ce fichier : Strimzi le crée dans Kafka, et le remet si quelqu'un le supprime à la main.

``` { .text .ex-ref title="Référence" }
$ kubectl get kafkatopic orders
NAME     CLUSTER   PARTITIONS   REPLICATION FACTOR   READY
orders   events    6            3                    True
```

Autres opérateurs courants : CloudNativePG (PostgreSQL), Prometheus Operator, cert-manager (certificats TLS). Crossplane applique la même idée à l'infrastructure cloud ([Panorama des outils techniques](outils.md#infrastructure-as-code-terraform-opentofu-terragrunt-pulumi-crossplane-ansible-packer)).

*Crossplane : concurrent en partie de Terraform ; complémentaire de Kubernetes*
{ .tool-rel }


| Je veux... | J'utilise... |
|---|---|
| utiliser Kafka ou PostgreSQL alors que personne dans l'équipe n'a le temps ou la compétence pour les mettre à jour, les sauvegarder et les réparer | le service managé du fournisseur |
| faire tourner Kafka dans mon propre cluster, parce que l'offre managée coûte trop cher, que les données doivent rester sur place, ou qu'il n'existe pas d'offre managée | Strimzi |
| la même chose pour PostgreSQL | CloudNativePG |
| déployer une appli qui ne garde rien sur ses disques, comme une API qui range tout dans une base externe | un Deployment et un chart Helm, pas d'opérateur |

:material-book-open-variant: Doc de référence : [Kubernetes, Custom Resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) (consultée en novembre 2026) ; [Kubernetes, Controllers](https://kubernetes.io/docs/concepts/architecture/controller/) (consultée en novembre 2026)
{ .doc-ref }

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | Kafka ou PostgreSQL tournent dans le cluster avec des manifestes écrits à la main, mis à jour par une seule personne |
    | N2 | un opérateur (Strimzi, CloudNativePG) gère le logiciel, et ses ressources sont décrites dans Git |
    | N3 | l'opérateur remplace seul un membre tombé et recrée un topic supprimé à la main, et une restauration automatique vérifie les sauvegardes |
    | N4 | l'équipe compare régulièrement le coût et les incidents de cette exploitation à ceux d'un service managé, et décide de garder ou de migrer |

    **Je mesure** : le délai de retour à la normale quand un broker ou une instance tombe, lu dans les incidents ou mesuré en game day ; la date de la dernière restauration de sauvegarde réussie.

## Environnements

<a class="pill pill-scope pill-scope-infra" href="../architecture/#carte-des-echelles">Échelle · Infrastructure</a>

| Env | Nom          | Pour qui                               |
|-----|--------------|----------------------------------------|
| dev | <span class="term" data-term="integration-env">intégration</span>  | les devs testent leurs changements     |
| staging | <span class="term" data-term="staging-env">staging</span>      | pré-production, proche de la prod      |
| prod | <span class="term" data-term="production-env">production</span>   | les vrais utilisateurs                 |

**Risques.** Un staging qui ne ressemble pas à la prod (autre version de base, données minuscules, config différente) laisse passer les bugs qu'il devait arrêter, et donne une fausse confiance : je déploie la même image partout et je garde la même config, à part les secrets et les tailles. Chaque environnement en plus coûte de l'argent et de l'entretien : trois suffisent souvent, et un environnement éphémère par MR remplace parfois un dev partagé toujours cassé. Des données réelles copiées en staging posent un problème de confidentialité : je les anonymise.

!!! maturity "Mesurer la maturité"
    | Niveau | Ce que j'observe dans l'équipe |
    |---|---|
    | N1 | un environnement de test existe, mais sa config et ses versions diffèrent de la prod, et il est mis à jour à la main |
    | N2 | la même image passe automatiquement de dev à staging puis à la prod, seule la config change |
    | N3 | une version ne peut pas atteindre la prod sans être passée par staging avec des tests verts |
    | N4 | l'équipe suit les bugs vus en prod que staging aurait dû attraper, et rapproche staging de la prod là où ils passent |

    **Je mesure** : le nombre d'incidents de production dont la cause aurait été visible en staging, relevé en postmortem ; les écarts de version (base, dépendances) entre staging et prod, lus dans les values de chaque environnement.

## Mesurer le succès

Je sais que mes réglages Kubernetes marchent quand les utilisateurs ne voient plus les déploiements ni les redémarrages, pas quand les manifestes sont plus longs. Je relève une base sur quatre semaines : erreurs 5xx pendant les déploiements, redémarrages par pod, pods `Pending` au pic, durée du build. Je mesure la même chose sur les quatre semaines qui suivent le changement, et je surveille le coût du cluster comme garde-fou : un autoscaling qui garde 30 pods la nuit règle la latence en faisant exploser la facture. Le tableau donne des valeurs d'exemple.

| Solution ou situation | Indicateur de succès (SLI) | SLO probable | SLA probable |
|---|---|---|---|
| rolling update avec `maxUnavailable: 0` | part des requêtes en erreur 5xx pendant un déploiement | moins de 0,1 % pendant chaque rollout | sans objet : pas de contrat externe |
| readiness, liveness et startup probes | redémarrages par pod et par semaine, hors déploiement | moins de 1 en moyenne, aucun redémarrage en boucle | sans objet : pas de contrat externe |
| requests et limits | nombre d'`OOMKilled` par semaine | zéro sur les services critiques | sans objet : pas de contrat externe |
| build multi-étapes | durée du build quand seul le code change | moins de 1 min, contre 4 min avant | sans objet : pas de contrat externe |
| Argo CD et GitOps | délai entre la fusion de la MR de config et le pod prêt en prod | médiane sous 10 min | sans objet : pas de contrat externe |
| HPA, KEDA et autoscaler de nœuds | latence p95 au pic ; lag maximal d'un worker | p95 sous 300 ms au pic ; lag résorbé en moins de 15 min | sans objet : pas de contrat externe |
| service exposé aux clients, comme `my-api` | disponibilité mesurée à l'entrée de l'Ingress | 99,9 % sur 30 jours | 99,5 % par mois, avoir de 10 % au-delà : plus lâche que le SLO pour garder une marge |

[À prendre avec précaution : ordres de grandeur d'exemple, à fixer avec le métier]

!!! noob "As noob"
    Sur l'autoroute, le compteur affiche ma vitesse réelle : c'est le SLI. Je me fixe de rouler à 120 km/h au plus : c'est le SLO. La limite de 130, qui me vaut une amende si je la dépasse, c'est le SLA. La marge entre les deux me laisse le temps de lever le pied avant de payer. La phrase à retenir : **le SLO est ma règle à moi, plus stricte que le SLA promis au client, pour réagir avant la pénalité.**

## Pièges à éviter

- **La base dans la liveness** : je vérifie la base de données dans la liveness, donc le jour où la base tombe, Kubernetes redémarre tous les pods en boucle sans rien réparer. Je mets la dépendance dans la readiness, et la liveness ne vérifie que l'appli elle-même ([voir Quelle probe pour quel besoin](#quelle-probe-pour-quel-besoin)).
- **Pas de startup probe pour une appli lente** : mon appli charge un gros cache au démarrage, donc la liveness la tue avant qu'elle ait fini de démarrer. J'ajoute une startup probe, qui retient la liveness tant que le démarrage n'est pas terminé ([voir Startup probe](#startup-probe)).
- **Redémarrer au lieu de comprendre un `OOMKilled`** : je laisse le pod redémarrer en boucle avec le code `137`, donc la fuite mémoire ou la limit trop basse reste là. Je lis `kubectl describe pod`, puis je corrige la fuite ou j'ajuste la limit ([voir requests et limits](#ressources-requests-et-limits)).
- **Un Secret en clair dans Git** : je commite un Secret en le croyant chiffré, alors qu'il est seulement encodé en base64, donc quiconque lit le dépôt a le mot de passe. Je le remplis depuis un gestionnaire de secrets ([voir ConfigMap et Secret](#configmap-et-secret-la-config-par-environnement)).
- **Un ConfigMap modifié qui ne change rien** : je change `LOG_LEVEL` dans le ConfigMap et j'attends l'effet, mais les variables d'environnement sont lues au démarrage, donc les pods gardent l'ancienne valeur. Je relance les pods après le changement ([voir ConfigMap et Secret](#configmap-et-secret-la-config-par-environnement)).
- **Un rollback à la main sous Argo CD** : je lance `kubectl rollout undo`, donc Argo CD remet la version de Git à la synchronisation suivante. J'annule la MR qui a changé le tag d'image ([voir Argo CD](#argo-cd-git-decide-de-ce-qui-tourne)).
- **Un `replicas` fixe à côté du HPA** : je laisse `replicas: 3` dans le modèle Helm alors que le HPA est activé, donc Argo CD remet 3 pendant que le HPA remet 6. Je retire `replicas` du modèle, et je vérifie que `requests.cpu` est déclaré, sans quoi le HPA ne décide rien ([voir HPA](#hpa-le-point-de-depart)).
- **Un chart générique où tout est configurable** : chaque champ Kubernetes devient une value, donc le fichier de values devient un deuxième langage, plus dur que les manifestes. J'expose peu de choses, avec des valeurs par défaut sûres et une porte de sortie documentée ([voir le chart générique](#un-chart-generique-pour-tous-les-services)).

## Ce qu'on demande en entretien

Les questions typiques :

- « Quelle différence entre readiness, liveness et startup probe ? », « Que se passe-t-il si je vérifie la base dans la liveness ? » Pour répondre : je décris ce que fait Kubernetes dans chaque cas, retirer du trafic ou redémarrer ([Quelle probe pour quel besoin](#quelle-probe-pour-quel-besoin)).
- « Comment déploies-tu sans coupure ? », « Comment reviens-tu en arrière ? » Pour répondre : je décris le rolling update avec `maxSurge` et `maxUnavailable`, puis l'annulation de la MR quand Argo CD pilote le cluster ([Rolling update](#rolling-update-mise-a-jour-progressive), [Argo CD](#argo-cd-git-decide-de-ce-qui-tourne)).
- « Un pod redémarre en boucle, que regardes-tu ? », « Request ou limit, quelle différence ? » Pour répondre : je lance `kubectl describe pod` et je cherche la raison `OOMKilled` et le code `137` ([Ressources : requests et limits](#ressources-requests-et-limits)).
- « Pourquoi passer par un Service plutôt que par l'adresse d'un pod ? » Pour répondre : je rappelle que les pods changent d'adresse, alors que le Service garde une adresse stable et n'envoie le trafic qu'aux pods prêts ([Service](#service)).
- « Qu'est-ce que GitOps ? », « À quoi sert Helm ? » Pour répondre : je dis que Git décrit l'état voulu et qu'Argo CD corrige les écarts, et que Helm évite de réécrire les mêmes manifestes par environnement ([Argo CD](#argo-cd-git-decide-de-ce-qui-tourne), [Helm](#helm-le-modele-de-deploiement)).
- « Comment fais-tu scaler un worker qui lit une file ? », « HPA, KEDA ou Karpenter ? » Pour répondre : je prends le lag comme signal, pas le CPU, et je montre que chaque outil agit à un étage différent ([Quoi utiliser pour scaler](#quoi-utiliser-pour-scaler)).
- « Mon image fait 1 Go et se reconstruit en quatre minutes à chaque modification, que fais-tu ? » Pour répondre : je copie les fichiers de dépendances avant le code, j'ajoute un cache de montage BuildKit, un `.dockerignore`, et je sépare les cibles `dev` et `prod` d'un build multi-étapes ([Image multi-étapes](#image-multi-etapes-rapide-a-reconstruire-legere-en-production)).
- « Comment prouves-tu qu'un changement de configuration Kubernetes a servi ? » Pour répondre : je compare avant et après les erreurs pendant les déploiements, les redémarrages et la latence au pic, avec le coût du cluster comme garde-fou ([Mesurer le succès](#mesurer-le-succes)).

Ce qui fait une bonne réponse : raconter ce que voit l'utilisateur et ce que fait Kubernetes, étape par étape (le pod retiré du trafic, le conteneur redémarré, le pod en `Pending`), plutôt que réciter des champs YAML.
