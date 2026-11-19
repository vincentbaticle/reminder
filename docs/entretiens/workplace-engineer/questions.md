# Entretien Workplace Engineer : les questions

!!! warning "Avertissement"
    Ces notes sont des pense-bêtes personnels, pas une source de vérité. Elles reflètent ma compréhension et mes choix : leur contenu reste subjectif, malgré les citations et les références qu'il contient. Il peut être incomplet, simplifié, inexact ou dépassé. Vérifiez toujours dans la documentation officielle avant de l'appliquer. Ce contenu est fourni tel quel, sans aucune garantie : son utilisation se fait sous votre seule responsabilité.

!!! audience "Pour qui, pour quoi"
    - **Métiers** : workplace engineer (ou corporate engineer, IT engineer), administrateur systèmes qui vise un poste d'ingénierie, responsable support IT qui automatise, ingénieur sécurité tourné vers les postes et l'identité, ingénieur plateforme qui reprend l'IT interne.
    - **Usages** : je prépare un entretien de workplace engineer dans une semaine et je veux la liste des questions avec un plan de réponse ; la veille, je relis un seul thème, comme l'identité ; je cherche quelle page Knowledge explique une notion que je veux citer, comme SCIM ; je prépare une histoire vécue par thème, comme un départ dont j'ai automatisé la coupure des accès.

Cette page liste, thème par thème, les questions qu'on pose à un Workplace Engineer, telles que le recruteur les formule. Pour chaque question, je lis le plan de réponse (quelques lignes, à la première personne), puis j'ouvre la section Knowledge liée, qui donne l'explication complète, les exemples et les pièges. Le plan ne se récite pas : il sert à structurer **une histoire vécue**, avec mes propres chiffres (arrivants prêts le premier jour, délai de coupure au départ, tickets évités). Quand je n'ai pas vécu un cas, je le présente comme un scénario et j'explique mon raisonnement.

Le poste mêle trois métiers : l'identité et les accès, les postes de travail, et le support. Le recruteur cherche quelqu'un qui traite ces trois sujets **comme du code** (versionné, relu, testé, mesuré) et les salariés comme les utilisateurs d'un produit. L'entreprise `acme.example`, l'équipe `team-core` et les personnes `ada` et `grace` sont fictives ; les chiffres sont des exemples. Les exercices en direct, avec scripts, requêtes et plans corrigés, sont dans [Entretien Workplace Engineer : les exercices](exercices.md).

## Le rôle et l'IT comme produit

### « Qu'est-ce qu'un workplace engineer, et en quoi diffère-t-il du support ou de l'exploitation IT ? »

- Je définis le <span class="term" data-term="workplace-engineering">workplace engineering</span> par son périmètre : tout ce qu'un salarié utilise pour travailler, hors du produit vendu (identité, ordinateur, outils en ligne, réseau du bureau, support).
- Le support traite les demandes une par une, l'exploitation fait tourner l'existant, la sécurité fixe les règles ; moi, je construis et j'automatise le système qui rend ces gestes inutiles ou sûrs.
- Ma posture : chaque demande qui revient est le signe qu'il manque une automatisation ou une page en libre-service.
- Exemple : au lieu de créer à la main les comptes de chaque arrivant de `team-core`, j'écris la règle qui le fait depuis le SIRH, et le test qui le vérifie.

**À relire** : [Le métier : workplace engineering](../../knowledge/workplace.md#le-metier-workplace-engineering), [Vocabulaire](../../knowledge/workplace.md#vocabulaire)

### « Comment traites-tu l'IT interne comme un produit ? », « Comment sais-tu si les salariés sont contents de l'IT ? »

- Mes utilisateurs sont les salariés, et leur temps perdu est mon premier indicateur.
- Je pars de leurs tâches fréquentes (arriver, obtenir un accès, remplacer un portable) plutôt que des outils que j'administre.
- Je publie une promesse mesurable, comme la <span class="term" data-term="day-one-readiness">préparation du premier jour</span> : 95 % des arrivants prêts à 9 h [chiffre d'exemple].
- Je mesure par catégorie de tickets, par une question courte après chaque ticket fermé et par une enquête semestrielle, et je publie trois actions après chaque enquête.
- Une équipe qui contourne l'IT (un outil acheté par carte) me donne un signal produit, pas un manque de discipline.

**À relire** : [Le métier : workplace engineering](../../knowledge/workplace.md#le-metier-workplace-engineering), [Arrivée et départ comme un produit](../../knowledge/workplace.md#arrivee-et-depart-comme-un-produit), [Jobs to be done](../../knowledge/culture-entreprise.md#jobs-to-be-done)

### « Que ferais-tu pendant tes trois premiers mois ? »

- Mois 1, comprendre : je suis dix arrivées et dix départs réels, je lis un mois de tickets par catégorie, je liste les outils d'administration et qui y a accès.
- Je relève une mesure de départ : délai de coupure au départ, part des postes chiffrés et à jour, part des SaaS sous SSO.
- Mois 2, prouver : un gain rapide et peu risqué, comme un formulaire qui automatise la demande d'accès la plus fréquente.
- Mois 3, orienter : une feuille de route de trois à cinq chantiers chiffrés, validée avec la sécurité et la RH, avec ce que je ne ferai pas.
- Je vérifie aussi tout de suite deux risques graves : les comptes de secours existent-ils, et les administrateurs ont-ils une MFA forte ?

**À relire** : [Les 90 premiers jours dans un nouveau rôle](../../knowledge/culture-entreprise.md#les-90-premiers-jours-dans-un-nouveau-role), [Mesurer le succès (workplace)](../../knowledge/workplace.md#mesurer-le-succes), [Comptes de secours](../../knowledge/workplace.md#comptes-de-secours-break-glass)

## Identité et accès

### « Quelle différence entre SSO et SCIM ? Entre SAML et OIDC ? »

- Le <span class="term" data-term="sso">SSO</span> dit **qui** se connecte : l'application délègue la connexion au fournisseur d'identité.
- <span class="term" data-term="scim">SCIM</span> (RFC 7643 et 7644, publiées en 2015) **crée et ferme** les comptes dans l'application, par une API REST standard ; sans lui, ada tombe sur « compte inexistant » et grace garde son compte après son départ.
- <span class="term" data-term="saml">SAML 2.0</span> (OASIS, 2005) transporte une assertion XML signée par le navigateur ; OpenID Connect (2014) un jeton JWT au-dessus d'OAuth 2.0.
- En pratique : SAML pour beaucoup de SaaS établis, OIDC pour les applications récentes et mobiles ; je vérifie surtout si l'éditeur réserve le SSO à son offre la plus chère.

**À relire** : [Fournisseur d'identité et SSO](../../knowledge/workplace.md#fournisseur-didentite-et-sso), [Provisioning automatique : SCIM](../../knowledge/workplace.md#provisioning-automatique-scim), [OpenID Connect](../../knowledge/securite.md#openid-connect-oidc-savoir-qui-est-connecte)

### « Une personne quitte l'entreprise ce soir à 18 h. Décris tout ce qui se passe. »

- Le <span class="term" data-term="hris">SIRH</span> est la source de vérité : le départ y est saisi avec son heure, et c'est lui qui déclenche.
- À 18 h, le fournisseur d'identité suspend le compte et révoque les sessions et les jetons ; SCIM désactive les comptes des applications et libère les licences ; le MDM verrouille le portable s'il n'est pas rendu.
- Les applications sans SSO ouvrent chacune une tâche nominative ; les fichiers et la boîte mail passent au manager selon la politique.
- Tout est journalisé, et une vérification à J+1 confirme qu'il ne reste aucun accès.
- Je cite le départ conflictuel : coupure à l'heure près, coordonnée avec la RH et le manager.

**À relire** : [Joiner, mover, leaver](../../knowledge/workplace.md#joiner-mover-leaver-le-cycle-de-vie-pilote-par-le-sirh), [Scripts sur les API d'administration](../../knowledge/workplace.md#scripts-sur-les-api-dadministration), [Départ : conserver et transférer les données](../../knowledge/workplace.md#depart-conserver-et-transferer-les-donnees), [Exercice 1 : arrivées et départs](exercices.md#exercice-1-automatiser-arrivees-et-departs-depuis-le-sirh)

### « Comment gères-tu un changement d'équipe ? », « Comment évites-tu qu'une personne accumule les droits ? »

- Le mover du cycle <span class="term" data-term="joiner-mover-leaver">joiner, mover, leaver</span> est le cas le plus souvent raté : on ajoute les nouveaux accès et on oublie de retirer les anciens.
- Je ne donne jamais un accès à une personne : je le donne à un groupe calculé depuis un attribut du SIRH (équipe, métier, pays), donc changer d'équipe retire l'ancien groupe le jour même.
- Pour les accès sur demande, une <span class="term" data-term="access-review">revue d'accès</span> trimestrielle par le propriétaire de l'accès, avec la dernière connexion affichée.
- Exemple : après trois changements d'équipe, ada cumulait les droits de trois équipes ; avec des groupes calculés, elle n'a plus que ceux de `team-data`.

**À relire** : [Groupes, rôles et revues d'accès](../../knowledge/workplace.md#groupes-roles-et-revues-dacces), [Modéliser les droits : RBAC](../../knowledge/securite.md#modeliser-les-droits-rbac-abac-rebac)

### « Quelle MFA choisirais-tu, et pour qui en premier ? », « Faut-il changer les mots de passe tous les 90 jours ? »

- Une <span class="term" data-term="phishing-resistant-mfa">MFA résistante au phishing</span> (clé FIDO2 ou <span class="term" data-term="passkey">passkey</span>) lie la preuve au vrai nom de domaine, donc un faux site n'obtient rien ; SMS et codes se recopient.
- Les administrateurs du fournisseur d'identité, du MDM et de la messagerie d'abord, puis tout le monde, groupe par groupe.
- Deux méthodes inscrites par personne, et une récupération vérifiée en visio avec pièce d'identité, jamais par un simple appel au support.
- Non aux changements tous les 90 jours : le NIST SP 800-63B (2017, confirmé en 2025) demande de changer seulement en cas de compromission.

**À relire** : [MFA résistante au phishing](../../knowledge/workplace.md#mfa-resistante-au-phishing), [Idée reçue : changer son mot de passe tous les 90 jours](../../knowledge/workplace.md#idee-recue-changer-son-mot-de-passe-tous-les-90-jours), [Ingénierie sociale](../../knowledge/cybersecurite.md#ingenierie-sociale)

### « Qu'est-ce qu'un compte de secours, et comment le protèges-tu ? »

- Un <span class="term" data-term="break-glass-account">compte de secours</span> est un compte administrateur exclu des règles d'accès conditionnel, gardé sous clé, pour réparer quand une règle fausse ou une panne de MFA bloque tout le monde.
- Deux comptes, non rattachés à une personne, protégés par des clés FIDO2 rangées dans un coffre.
- Toute connexion déclenche une alerte immédiate à la sécurité.
- Je le teste chaque trimestre : un compte jamais testé ne marche pas le jour où il sert, un compte sans alerte est une porte dérobée.

**À relire** : [Comptes de secours (break-glass)](../../knowledge/workplace.md#comptes-de-secours-break-glass)

### « Une application refuse la connexion SSO depuis ce matin, les autres marchent. Comment cherches-tu ? »

- Une seule application touchée : c'est un écart de configuration, pas une panne du fournisseur d'identité.
- Je lis l'<span class="term" data-term="saml-assertion">assertion SAML</span> dans le journal du fournisseur d'identité ou avec une extension de navigateur, et je compare champ par champ.
- Les causes fréquentes : <span class="term" data-term="clock-skew">décalage d'horloge</span>, audience ou adresse de retour qui ne correspond pas, certificat de signature renouvelé d'un seul côté, identifiant au mauvais format.
- Je ne « répare » pas en désactivant la vérification de signature ni en montant la tolérance d'horloge à une heure.
- Pour l'avenir, une liste des applications SAML avec l'échéance de leur certificat et une alerte 30 jours avant.

**À relire** : [Déboguer une connexion SAML](../../knowledge/workplace.md#deboguer-une-connexion-saml), [Exercice 2 : connexion SAML](exercices.md#exercice-2-deboguer-une-connexion-saml-qui-echoue)

## Gestion des appareils

### « Comment fais-tu pour que 50 nouveaux arrivants soient prêts le même lundi ? », « Une recrue travaille à distance, comment reçoit-elle son portable ? »

- L'<span class="term" data-term="zero-touch-enrollment">enrôlement zero-touch</span> : le portable est rattaché à l'entreprise par numéro de série dès l'achat (Apple Business Manager ou Windows Autopilot), livré emballé chez la personne, et s'inscrit seul au MDM au premier démarrage.
- Les comptes sont créés depuis le SIRH dix jours avant, désactivés jusqu'à la veille, avec les groupes de l'équipe.
- La promesse : à 9 h, poste chiffré, compte actif, passkey à inscrire en deux minutes, applications de l'équipe installées.
- Je mesure la part des arrivants prêts à 9 h, et je conviens avec la RH d'un délai de saisie minimum.

**À relire** : [Enrôlement zero-touch](../../knowledge/workplace.md#enrolement-zero-touch), [Arrivée et départ comme un produit](../../knowledge/workplace.md#arrivee-et-depart-comme-un-produit), [Onboarding (DevX)](../../knowledge/devx.md#onboarding), [Exercice 4 : arrivée à distance](exercices.md#exercice-4-concevoir-larrivee-zero-touch-dune-recrue-a-distance)

### « Qu'est-ce qu'un MDM, et qu'est-ce que la gestion déclarative change ? »

- Un <span class="term" data-term="mdm">MDM</span> garde un lien avec chaque appareil inscrit : il pousse des profils de configuration, des applications et des commandes (verrouiller, effacer), et reçoit un inventaire.
- Avec la <span class="term" data-term="declarative-device-management">gestion déclarative</span> d'Apple (2021, étendue au Mac en 2022), le serveur envoie un état voulu, l'appareil l'applique et le maintient seul, puis signale ses changements.
- C'est la même idée que GitOps : je décris le résultat, pas les étapes.
- Je vérifie ce que mon outil supporte avant de planifier une migration, et je surveille l'échéance annuelle du certificat de notification Apple.

**À relire** : [MDM et profils de configuration](../../knowledge/workplace.md#mdm-et-profils-de-configuration), [Gestion déclarative des appareils Apple](../../knowledge/workplace.md#gestion-declarative-des-appareils-apple)

### « Les développeurs veulent Linux, et les commerciaux leur téléphone personnel. Que réponds-tu ? »

- Linux : oui si je sais prouver les mêmes contrôles (chiffrement, mises à jour, écran verrouillé) avec un outil de configuration et un agent d'inventaire comme osquery ; sinon un Mac ou un environnement de développement distant.
- Téléphone personnel (<span class="term" data-term="byod">BYOD</span>) : pas de prise de contrôle complète, mais une inscription utilisateur qui sépare les données de l'entreprise et n'efface qu'elles.
- L'accès conditionnel refuse les applications sensibles aux appareils non conformes.
- J'écris ce que l'entreprise voit sur un appareil personnel, pour la confiance et le RGPD.

**À relire** : [Linux et appareils personnels (BYOD)](../../knowledge/workplace.md#linux-et-appareils-personnels-byod), [Confiance de l'appareil et accès conditionnel](../../knowledge/workplace.md#confiance-de-lappareil-et-acces-conditionnel)

## Sécurité des postes et conformité

### « Comment sais-tu que tous les disques sont chiffrés ? »

- Le MDM impose le <span class="term" data-term="disk-encryption">chiffrement du disque</span> (FileVault, BitLocker) et séquestre la clé de récupération, lisible par peu de personnes et journalisée.
- Je vérifie de deux façons : le rapport du MDM, et une requête <span class="term" data-term="osquery">osquery</span> sur tout le parc, qui attrape aussi les postes sortis du MDM.
- Je compare l'inventaire du MDM à celui des achats : un portable absent des deux est le plus dangereux.
- L'accès conditionnel refuse l'application de paie à un poste non chiffré, et la preuve est exportée chaque mois pour l'audit.

**À relire** : [Chiffrement du disque](../../knowledge/workplace.md#chiffrement-du-disque), [EDR et osquery](../../knowledge/workplace.md#edr-et-osquery), [Exercice 3 : osquery](exercices.md#exercice-3-trouver-les-postes-non-conformes-avec-osquery)

### « Comment organises-tu les correctifs ? Une faille activement exploitée est publiée ce matin, que fais-tu ? »

- La <span class="term" data-term="patch-management">gestion des correctifs</span> fixe des délais selon le risque (NIST SP 800-40, révision 4, 2022) : par exemple 48 h pour une faille du catalogue <span class="term" data-term="kev">KEV</span> de la CISA, 14 jours pour une mise à jour ordinaire, 60 à 90 jours pour une version majeure [délais d'exemple].
- Pour la faille du jour : je mesure l'exposition avec osquery (combien de postes ont la version vulnérable), je pousse le correctif en accéléré, avec un redémarrage imposé après préavis.
- Pour le reste : anneaux, puis échéance avec un nombre limité de reports.
- Je mesure la part des postes à jour à J+14, et je publie la liste des retardataires à leurs managers.

**À relire** : [Correctifs : cadence et délais](../../knowledge/workplace.md#correctifs-cadence-et-delais), [Déploiement par anneaux](../../knowledge/workplace.md#deploiement-par-anneaux), [Exercice 5 : version majeure de macOS](exercices.md#exercice-5-planifier-une-montee-de-version-majeure-de-macos)

### « Les développeurs veulent être administrateurs de leur poste, que réponds-tu ? »

- Je ne réponds ni « jamais » ni « oui à tous » : les <span class="term" data-term="local-admin-rights">droits administrateur locaux</span> se donnent selon l'usage réel.
- Un commercial qui installe un outil par trimestre : un catalogue d'applications en libre-service, sans droits.
- Un développeur qui installe des outils chaque semaine : droits temporaires à la demande, par exemple 30 minutes, journalisés.
- Une équipe qui a besoin de pilotes ou de machines virtuelles : droits permanents avec <span class="term" data-term="edr">EDR</span> et justification revue chaque année.
- Je pilote le changement avec des développeurs volontaires avant de serrer pour tous.

**À relire** : [Référentiels CIS et droits administrateur](../../knowledge/workplace.md#referentiels-cis-et-droits-administrateur), [EDR et osquery](../../knowledge/workplace.md#edr-et-osquery)

### « Qu'est-ce que le zero trust pour les salariés ? Faut-il garder le VPN ? »

- BeyondCorp (Google, 2014) : l'accès dépend de qui je suis et de l'état de mon appareil, pas du réseau où je me trouve.
- La <span class="term" data-term="device-trust">confiance de l'appareil</span> prouve qu'il est géré et conforme ; l'<span class="term" data-term="conditional-access">accès conditionnel</span> combine personne, appareil, application et risque à chaque connexion.
- Le <span class="term" data-term="vpn">VPN</span> met le portable « dans » le réseau ; le <span class="term" data-term="ztna">ZTNA</span> publie chaque application séparément.
- Je retire le VPN application par application, après avoir inventorié les flux, parce qu'il reste toujours une vieille application qui ne marche qu'en interne.
- J'active toute nouvelle règle d'abord en <span class="term" data-term="report-only-mode">mode rapport seulement</span>.

**À relire** : [Confiance de l'appareil et accès conditionnel](../../knowledge/workplace.md#confiance-de-lappareil-et-acces-conditionnel), [Réseau du bureau](../../knowledge/workplace.md#reseau-du-bureau), [Zero trust](../../knowledge/securite.md#zero-trust-et-identite-entre-services)

### « Comment prépares-tu un audit ISO 27001 ou SOC 2 ? », « Jusqu'où peut-on surveiller les postes des salariés ? »

- <span class="term" data-term="iso-27001">ISO 27001</span> et <span class="term" data-term="soc2">SOC 2</span> demandent des preuves datées tirées des systèmes : départs, revues d'accès, MFA, chiffrement, changements.
- Je produis ces preuves en continu (export mensuel), pas la semaine de l'audit ; le <span class="term" data-term="audit-log">journal d'audit</span> est exporté hors des consoles, dont la conservation par défaut est courte.
- Côté <span class="term" data-term="gdpr">RGPD</span>, ce que collectent l'EDR, le MDM et la DLP doit être nécessaire, annoncé aux salariés et conservé une durée limitée.
- J'écris ce qui est collecté, pourquoi, qui le lit et combien de temps : c'est ce qui permet de dire non à une demande de surveillance excessive.

**À relire** : [Conformité et preuves](../../knowledge/workplace.md#conformite-et-preuves), [Données personnelles et RGPD](../../knowledge/securite.md#donnees-personnelles-et-rgpd-dans-larchitecture), [SIEM](../../knowledge/securite.md#siem-centraliser-et-correler-les-journaux-de-securite)

## Automatisation et workplace as code

### « Pourquoi mettre la configuration du fournisseur d'identité ou du MDM dans Git ? »

- Dans une console web, personne ne sait qui a changé quoi, et un clic faux ne se relit pas.
- En <span class="term" data-term="infrastructure-as-code">infrastructure as code</span> (Terraform avec les fournisseurs Okta ou Entra ID, Fleet en YAML), chaque changement passe par une merge request : la CI lance le <span class="term" data-term="terraform-plan">plan</span>, un collègue le relit, la fusion applique.
- Un `plan` chaque nuit détecte la <span class="term" data-term="configuration-drift">dérive</span> faite à la main.
- Je protège les ressources critiques par `prevent_destroy`, et le jeton de Terraform vit dans un gestionnaire de secrets.
- Exemple : un groupe calculé par règle au lieu d'une liste de personnes, qui ne garde plus personne après un départ.

**À relire** : [La configuration dans Git](../../knowledge/workplace.md#la-configuration-dans-git), [Gestionnaires de secrets](../../knowledge/securite.md#gestionnaires-de-secrets-pour-les-machines-et-pour-les-humains), [Exercice 9 : Terraform](exercices.md#exercice-9-gerer-les-groupes-du-fournisseur-didentite-en-terraform)

### « Comment écris-tu un script qui touche aux comptes sans risque ? »

- Il prend son entrée du SIRH, jamais d'un copier-coller : une adresse fausse supprimerait la mauvaise personne.
- Chaque étape est <span class="term" data-term="idempotency">idempotente</span> : je peux relancer le script après une panne sans effet de bord.
- Un <span class="term" data-term="dry-run">mode simulation</span> affiche ce qu'il ferait, et je le lance ainsi d'abord.
- Il suspend avant de supprimer, journalise chaque action, et une erreur ouvre un ticket au lieu de s'arrêter en silence.
- Un plafond de sécurité : au-delà de N comptes touchés d'un coup, il s'arrête et demande une validation humaine.

**À relire** : [Scripts sur les API d'administration](../../knowledge/workplace.md#scripts-sur-les-api-dadministration), [Idempotence](../../knowledge/architecture.md#idempotence), [Webhook](../../knowledge/api-rest-async.md#webhook), [Exercice 1 : arrivées et départs](exercices.md#exercice-1-automatiser-arrivees-et-departs-depuis-le-sirh)

### « Comment déploies-tu une nouvelle configuration sur tout le parc sans tout casser ? »

- Un profil faux part sur tout le parc en quelques minutes : je le traite comme une mise en production.
- Je l'applique par <span class="term" data-term="rollout-ring">anneaux</span> : l'équipe IT, puis des volontaires d'un service sur chaque métier, puis la moitié du parc, puis le reste.
- Les critères d'arrêt sont écrits avant : nombre de tickets liés, outil métier cassé.
- Le retour arrière est préparé (retirer le profil du groupe) et testé sur l'anneau 0.
- Exemple : un profil pare-feu qui aurait coupé l'outil de visio des commerciaux, arrêté à l'anneau 1.

**À relire** : [Déploiement par anneaux](../../knowledge/workplace.md#deploiement-par-anneaux), [Déploiement progressif](../../knowledge/livraison.md#deploiement-progressif), [Exercice 5 : version majeure de macOS](exercices.md#exercice-5-planifier-une-montee-de-version-majeure-de-macos)

### « Comment testes-tu un changement de configuration avant la production ? »

- Je relis le plan en merge request : « 1 groupe ajouté, 0 détruit » ; un plan qui détruit doit être expliqué.
- J'applique d'abord dans une organisation de test du fournisseur d'identité, peuplée de comptes fictifs.
- Pour un script, des tests unitaires avec un faux client d'API, et le mode simulation sur des données réelles.
- Pour une règle d'accès conditionnel, le mode rapport seulement pendant une semaine, puis la liste de qui aurait été bloqué.
- Pour un profil de poste, l'anneau 0 sur des machines de l'équipe.

**À relire** : [La configuration dans Git](../../knowledge/workplace.md#la-configuration-dans-git), [Confiance de l'appareil et accès conditionnel](../../knowledge/workplace.md#confiance-de-lappareil-et-acces-conditionnel)

## SaaS et outils collaboratifs

### « Les équipes achètent des SaaS sans passer par l'IT, que fais-tu ? »

- Je ne commence pas par interdire : le <span class="term" data-term="shadow-it">shadow IT</span> interdit se déplace vers des comptes personnels, encore moins visibles.
- Je découvre les outils par les dépenses (cartes, notes de frais), les connexions « Se connecter avec Google ou Microsoft » et les <span class="term" data-term="oauth-consent">consentements OAuth</span> accordés par les salariés.
- Pour chaque outil : un propriétaire, une décision (brancher au SSO et à SCIM, remplacer par l'outil déjà payé, fermer), une revue avant renouvellement.
- J'offre une voie d'achat rapide pour les petits outils sans données sensibles.

**À relire** : [Prolifération SaaS et shadow IT](../../knowledge/workplace.md#proliferation-saas-et-shadow-it), [Construire, acheter ou s'associer](../../knowledge/culture-entreprise.md#construire-acheter-ou-sassocier)

### « Comment réduis-tu le coût des licences ? »

- Je compare licences payées et comptes actifs dans les 30 derniers jours, outil par outil.
- SCIM libère la licence au départ ; sans lui, je paie des mois de comptes fantômes.
- Je repère les outils en double (trois outils de sondage) et je regroupe au renouvellement.
- Une licence d'archivage plutôt qu'une licence complète pour un compte suspendu qu'on garde.
- Exemple : 40 licences d'un outil de dessin sans connexion depuis trois mois [chiffre d'exemple], libérées après un message aux personnes concernées.

**À relire** : [Prolifération SaaS et shadow IT](../../knowledge/workplace.md#proliferation-saas-et-shadow-it), [Coût total de possession](../../knowledge/culture-entreprise.md#cout-total-de-possession)

### « Que deviennent les fichiers et la boîte mail d'une personne qui part ? »

- Suspendre tout de suite, sans supprimer : les données restent, la porte d'entrée est fermée.
- Transférer la propriété des fichiers au manager dans la semaine, rediriger ou partager la boîte quelques semaines, selon la politique écrite.
- Vérifier la <span class="term" data-term="legal-hold">conservation légale</span> avant toute suppression.
- Archiver ou supprimer après la durée fixée, par exemple 30 à 90 jours.
- Limiter le transfert à ce que la politique prévoit : une boîte peut contenir des échanges privés ou RH.

**À relire** : [Départ : conserver et transférer les données](../../knowledge/workplace.md#depart-conserver-et-transferer-les-donnees), [Exercice 8 : départ côté SaaS](exercices.md#exercice-8-concevoir-le-depart-cote-saas-avec-transfert-des-donnees)

### « Quels réglages vérifies-tu en premier dans Google Workspace ou Microsoft 365 ? »

- Le partage externe des documents : interdit par défaut, ouvert à certains groupes avec avertissement.
- Les applications tierces connectées par OAuth : une liste autorisée, les autres bloquées.
- Le transfert automatique des mails vers l'extérieur : interdit, avec alerte, parce que c'est une technique classique après une compromission.
- Les durées de conservation, et une <span class="term" data-term="dlp">DLP</span> en mode audit d'abord pour mesurer les faux positifs.
- Je ferme ce qui est dangereux et j'offre une voie validée pour le besoin réel, comme un espace partagé avec un partenaire.

**À relire** : [Administrer Google Workspace ou Microsoft 365](../../knowledge/workplace.md#administrer-google-workspace-ou-microsoft-365), [Prévention des fuites de données (DLP)](../../knowledge/workplace.md#prevention-des-fuites-de-donnees-dlp)

## Support et ITSM

### « Incident, demande, problème, changement : quelle différence ? »

- Un incident : ce qui marchait ne marche plus, je rétablis vite, même par contournement.
- Une <span class="term" data-term="service-request">demande de service</span> : un besoin prévu, qui mérite un circuit standard, idéalement en libre-service.
- Un problème : la cause inconnue de plusieurs incidents, que je cherche et supprime.
- Un changement : une modification planifiée, avec risque évalué et retour arrière.
- J'utilise ces quatre mots d'<span class="term" data-term="itil">ITIL</span> 4 (2019) sans la lourdeur : pas de comité d'approbation pour chaque profil.

**À relire** : [ITIL 4 : incident, demande, problème, changement](../../knowledge/workplace.md#itil-4-incident-demande-probleme-changement)

### « Le support reçoit 400 tickets par mois, comment les fais-tu baisser ? »

- Je trie un mois de tickets par catégorie, avec le temps de traitement : la fréquence seule ne suffit pas.
- Je cherche les gestes répétitifs : souvent un tiers des tickets demande un accès, signe que les groupes calculés ne couvrent pas les besoins.
- Je traite d'abord les catégories où fréquence fois durée est le plus grand, par le <span class="term" data-term="pareto-principle">principe de Pareto</span>.
- Selon la cause : groupe calculé, formulaire avec validation automatique, article de la <span class="term" data-term="knowledge-base">base de connaissances</span>, ou problème à corriger.
- Je mesure la <span class="term" data-term="ticket-deflection">déviation des tickets</span> et je surveille la satisfaction pour vérifier que je n'ai pas seulement déplacé la charge.

**À relire** : [Files de tickets, portail en libre-service et base de connaissances](../../knowledge/workplace.md#files-de-tickets-portail-en-libre-service-et-base-de-connaissances), [Exercice 7 : export de tickets](exercices.md#exercice-7-choisir-quoi-automatiser-a-partir-dun-export-de-tickets)

### « Comment fais-tu vivre une base de connaissances et un portail en libre-service ? »

- J'écris les articles à partir des tickets les plus fréquents, en réponse courte, avec un propriétaire et une date de relecture.
- Le <span class="term" data-term="shift-left-support">shift left du support</span> résout la demande le plus tôt possible, mais il ne marche que si le libre-service est vraiment plus rapide que le ticket.
- Le <span class="term" data-term="chatops">ChatOps</span> amène les demandes courantes dans l'outil de discussion, avec la validation du propriétaire et un journal.
- Je garde une entrée « je ne sais pas » triée par un humain, sinon les gens contournent par message direct.
- Je mesure les recherches sans résultat et les articles jamais lus, et je supprime ce qui est faux.

**À relire** : [Shift left et ChatOps](../../knowledge/workplace.md#shift-left-et-chatops), [Files de tickets](../../knowledge/workplace.md#files-de-tickets-portail-en-libre-service-et-base-de-connaissances)

### « Quels SLA ou SLO fixerais-tu au support ? »

- Je distingue le <span class="term" data-term="slo">SLO</span>, cible interne, du <span class="term" data-term="sla">SLA</span>, promesse contractuelle avec pénalité, qui n'existe en IT interne que si le support est confié à un prestataire.
- Je choisis des indicateurs qui comptent pour les salariés : délai de première réponse, délai de résolution des demandes standard, part résolue en libre-service.
- Exemple : première réponse sous 4 h ouvrées pour 90 % des tickets [valeur d'exemple].
- Je lis toujours un délai avec la satisfaction : un ticket fermé vite mais rouvert n'est pas un succès.

**À relire** : [Mesurer le succès (workplace)](../../knowledge/workplace.md#mesurer-le-succes), [Support et ITSM](../../knowledge/workplace.md#support-et-itsm)

## Incidents

### « Le compte d'une salariée est compromis, que fais-tu dans la première heure ? »

- Les signaux : <span class="term" data-term="impossible-travel">voyage impossible</span>, <span class="term" data-term="mfa-fatigue">fatigue de MFA</span>, nouvelle règle de transfert des mails, consentement OAuth inconnu.
- Contenir : suspendre sans supprimer, révoquer sessions et jetons, retirer les MFA récentes, les consentements et les règles de transfert.
- Préserver : exporter les journaux avant qu'ils n'expirent ; mesurer l'étendue : ce qui a été lu, partagé ou envoyé.
- Rétablir avec une MFA résistante au phishing, inscrite en visio avec pièce d'identité.
- La sécurité pilote l'enquête, j'exécute et je fournis les journaux ; je préviens la personne par téléphone, pas sur la boîte compromise.

**À relire** : [Compte compromis : contenir, puis enquêter](../../knowledge/workplace.md#compte-compromis-contenir-puis-enqueter), [Le cycle de vie d'un incident](../../knowledge/incidents.md#le-cycle-de-vie-dun-incident), [Exercice 6 : compte compromis](exercices.md#exercice-6-repondre-a-un-compte-compromis)

### « Un profil MDM poussé hier a cassé le Wi-Fi de 200 portables, que fais-tu ? »

- J'ouvre un incident avec un <span class="term" data-term="incident-commander">responsable d'incident</span> et un canal unique, et je préviens les salariés par un moyen qui ne dépend pas du Wi-Fi (SMS, affichage, partage de connexion).
- Je rétablis d'abord : retirer le profil du groupe dans le MDM ; les portables sans réseau ne le reçoivent pas, donc je prévois un câble ou un partage de connexion pour qu'ils récupèrent la correction.
- Ensuite la cause : pourquoi le profil a-t-il atteint 200 postes sans passer par les anneaux ?
- Un <span class="term" data-term="postmortem">postmortem</span> sans recherche de coupable, avec des actions : anneaux obligatoires pour les profils réseau, critère d'arrêt automatique.

**À relire** : [Le cycle de vie d'un incident](../../knowledge/incidents.md#le-cycle-de-vie-dun-incident), [Communiquer](../../knowledge/incidents.md#communiquer), [Le postmortem sans recherche de coupable](../../knowledge/incidents.md#le-postmortem-sans-recherche-de-coupable), [Déploiement par anneaux](../../knowledge/workplace.md#deploiement-par-anneaux)

### « Le fournisseur d'identité est en panne, que se passe-t-il, et qu'avais-tu préparé ? »

- Plus aucune nouvelle connexion : c'est un point unique de défaillance, à traiter comme un composant critique avec ses propres alertes.
- Les sessions déjà ouvertes continuent souvent jusqu'à leur expiration : la panne se voit d'abord chez les arrivants du matin.
- J'avais préparé un canal de communication hors de la suite (page de statut, SMS), les comptes de secours et un <span class="term" data-term="runbook">runbook</span>.
- Je lis l'engagement de disponibilité du fournisseur dans le contrat, et je mesure de mon côté la part des connexions réussies.

**À relire** : [Fournisseur d'identité et SSO](../../knowledge/workplace.md#fournisseur-didentite-et-sso), [Niveaux de sévérité](../../knowledge/incidents.md#niveaux-de-severite), [Runbooks et playbooks](../../knowledge/incidents.md#runbooks-et-playbooks)

## Questions de comportement

!!! info "Préparer des histoires vécues"
    Ces questions n'ont pas de bonne réponse théorique. Je prépare pour chacune une histoire réelle, racontée avec la <span class="term" data-term="star-method">méthode STAR</span>, avec mes propres chiffres. Les exemples ci-dessous sont des scénarios fictifs qui montrent la forme attendue.

### « Raconte une fois où tu as dû dire non à un dirigeant. »

- Situation type : un directeur demande à être exempté de la MFA « parce que ça le ralentit en déplacement ».
- Je cherche le besoin réel derrière la demande : il perd du temps avec les codes SMS à l'étranger.
- Je dis non à l'exemption, oui au besoin : une passkey sur son téléphone, plus rapide que le SMS et plus sûre.
- J'explique le risque en termes métier (son compte est la cible préférée des fraudes au virement), et je laisse une trace écrite si la demande est maintenue.
- Résultat attendu : le besoin est résolu, la règle reste la même pour tous.

**À relire** : [Présenter un compromis technique en termes métier](../../knowledge/culture-entreprise.md#presenter-un-compromis-technique-en-termes-metier), [Désaccord et engagement](../../knowledge/culture-entreprise.md#desaccord-et-engagement), [MFA résistante au phishing](../../knowledge/workplace.md#mfa-resistante-au-phishing)

### « Comment travailles-tu avec la sécurité et la RH ? »

- La RH détient la source de vérité : je conviens avec elle d'un délai de saisie des arrivées et des départs, et d'un geste d'urgence pour un départ immédiat.
- La sécurité fixe les règles et pilote les enquêtes ; moi, je les rends applicables et mesurables, sans bloquer le travail.
- Je formalise qui décide quoi avec une matrice <span class="term" data-term="raci">RACI</span> sur les moments sensibles : départ conflictuel, compte compromis, demande de surveillance.
- Je partage les chiffres avec eux chaque mois : délai de coupure, postes non conformes, tickets d'accès.

**À relire** : [RACI](../../knowledge/culture-entreprise.md#raci), [Influence sans autorité](../../knowledge/culture-entreprise.md#influence-sans-autorite-et-communautes-de-pratique), [Joiner, mover, leaver](../../knowledge/workplace.md#joiner-mover-leaver-le-cycle-de-vie-pilote-par-le-sirh)

### « Raconte une automatisation dont tu es fier. », « Raconte une erreur que tu as faite en production. »

- Pour l'automatisation : la situation chiffrée avant (par exemple, des départs coupés en trois jours en moyenne), ce que j'ai construit, le chiffre après, et ce que je referais autrement.
- Pour l'erreur : je choisis une vraie erreur, j'explique comment je l'ai détectée, ce que j'ai fait pour limiter l'impact, et le garde-fou que j'ai ajouté (anneaux, mode simulation, plafond de sécurité).
- Je parle de ce que le système permettait, pas de qui a cliqué : c'est l'esprit du postmortem sans recherche de coupable.

**À relire** : [Raconter une expérience avec la méthode STAR](../../knowledge/culture-entreprise.md#raconter-une-experience-avec-la-methode-star), [Le postmortem sans recherche de coupable](../../knowledge/incidents.md#le-postmortem-sans-recherche-de-coupable)

## Critères éliminatoires

Trois questions où une seule mauvaise réponse suffit à écarter un candidat workplace engineer.

| Question du recruteur | Réponse qui élimine | Ce que je réponds | À relire |
|---|---|---|---|
| « Une personne part ce soir. Comment coupes-tu ses accès ? » | « Je désactive son compte dans le fournisseur d'identité, c'est tout. » | Suspension, révocation des sessions et des jetons, désactivation par SCIM, applications sans SSO traitées, données transférées, vérification à J+1. Les sessions ouvertes et les comptes locaux survivent sinon. | [Joiner, mover, leaver](../../knowledge/workplace.md#joiner-mover-leaver-le-cycle-de-vie-pilote-par-le-sirh), [Scripts sur les API](../../knowledge/workplace.md#scripts-sur-les-api-dadministration) |
| « Comment déploies-tu un nouveau profil de sécurité ? » | « Je le pousse à tout le parc un vendredi soir, c'est plus rapide. » | Par anneaux, avec des critères d'arrêt écrits avant et un retour arrière testé ; jamais avant un week-end. | [Déploiement par anneaux](../../knowledge/workplace.md#deploiement-par-anneaux) |
| « Un directeur te demande de lire la boîte mail d'un salarié qu'il soupçonne. » | « Je lui donne l'accès, c'est un administrateur qui le demande. » | Je refuse d'agir seul : c'est une décision de la RH, du juridique et de la sécurité, encadrée par le droit et la politique interne, tracée par écrit. | [Conformité et preuves](../../knowledge/workplace.md#conformite-et-preuves), [Données personnelles et RGPD](../../knowledge/securite.md#donnees-personnelles-et-rgpd-dans-larchitecture) |

## Les 3 choses qu'un Workplace Engineer fait en permanence

1. **Partir de la source de vérité.** Le SIRH dit qui travaille ici, les groupes en découlent, les accès suivent. Exemple : un changement d'équipe saisi par la RH retire les anciens droits le jour même, sans ticket.
2. **Traiter la configuration comme du code.** Versionnée, relue, testée, déployée par anneaux, réversible. Exemple : un nouveau profil pare-feu passe par une merge request, puis l'équipe IT, puis des volontaires, avant tout le parc.
3. **Mesurer le temps des salariés et la justesse des accès.** Arrivants prêts à 9 h, délai de coupure au départ, part de postes conformes, tickets par catégorie. Exemple : je choisis l'automatisation suivante en lisant l'export de tickets, pas à l'intuition.

## Structure simple pour répondre à l'oral

Pour une question de comportement (« raconte une fois où... »), je suis la <span class="term" data-term="star-method">méthode STAR</span> : la situation, la tâche qui m'incombait, l'action que j'ai menée, le résultat chiffré, puis ce que j'en ai appris. Pour une question de mise en situation, je déroule ce fil :

1. **Personne** : qui est concerné (ada qui arrive, grace qui part, 300 portables) ?
2. **Source de vérité** : d'où vient l'information qui déclenche (SIRH, MDM, ticket) ?
3. **Chaîne** : quelles étapes, dans quel ordre, de bout en bout ?
4. **Échec** : que se passe-t-il quand une étape échoue, et comment je reviens en arrière ?
5. **Sécurité et vie privée** : quel risque, quelle donnée personnelle, qui doit valider ?
6. **Mesure** : quel chiffre de départ, quel chiffre après, quel garde-fou ?
7. **Preuve** : quelle trace reste pour l'audit ?

L'idée centrale : un workplace engineer ne fait pas tourner des consoles. Il automatise l'identité, les postes et le support à partir d'une source de vérité, déploie les changements comme du code, protège les salariés sans les ralentir, et prouve par des chiffres que leur quotidien s'améliore.

## Mesurer le succès

On me demande presque toujours « comment sais-tu que ça a marché ? ». Ma réponse suit la même forme pour chaque chantier : une **base** mesurée avant (par exemple le délai de coupure des comptes sur les départs du dernier trimestre), la **même mesure après**, sur une durée comparable, et une **métrique garde-fou** qui ne doit pas se dégrader (la satisfaction des salariés envers l'IT, ou le nombre de connexions refusées à tort). Puis je donne, par solution, un <span class="term" data-term="sli">SLI</span> et un SLO interne ; un SLA n'a de sens que pour un service sous contrat, comme un fournisseur d'identité hébergé ou un support confié à un prestataire.

| Solution | Indicateur de succès (SLI) | SLO probable | SLA probable |
|---|---|---|---|
| cycle de vie piloté par le SIRH | délai entre l'heure de départ dans le SIRH et la désactivation du dernier compte | 95 % des départs en moins d'une heure [À prendre avec précaution : valeur d'exemple, à fixer avec la sécurité] | sans objet : pas de contrat externe |
| enrôlement zero-touch et préparation du premier jour | part des arrivants avec poste prêt et tous leurs accès à 9 h | 95 % des arrivées saisies au moins 10 jours avant [À prendre avec précaution : valeur d'exemple] | sans objet : pas de contrat externe |
| conformité des postes | part des postes actifs inscrits au MDM, chiffrés et à jour à J+14 | 95 % [À prendre avec précaution : seuil d'exemple, à fixer avec la sécurité] | sans objet : pas de contrat externe |
| fournisseur d'identité hébergé | part des connexions réussies sans erreur du fournisseur | 99,9 % par mois [À prendre avec précaution : valeur d'exemple] | l'engagement du fournisseur dans le contrat, par exemple 99,99 % [À prendre avec précaution : à vérifier dans le contrat réel] |
| automatisation des demandes standard | part des demandes résolues sans geste du support | 60 % [À prendre avec précaution : valeur d'exemple] | sans objet : pas de contrat externe |
| support de premier niveau confié à un prestataire | part des tickets pris en charge dans le délai | 95 % sous 4 h ouvrées [À prendre avec précaution : valeur d'exemple] | 90 % sous 4 h ouvrées, avec pénalité [À prendre avec précaution : valeur d'exemple, selon le contrat] |

## Pièges à éviter

| Piège | Ce qui se passe | Solution |
|---|---|---|
| **Citer l'outil d'abord** : je réponds « Okta » ou « Jamf » avant de parler de la personne et de la source de vérité. | Le recruteur entend quelqu'un qui administre une console, pas quelqu'un qui conçoit un système. | Je déroule la chaîne depuis le SIRH, puis je nomme l'outil ([Structure pour l'oral](#structure-simple-pour-repondre-a-loral)). |
| **Oublier le mover** : je parle d'arrivée et de départ, jamais du changement d'équipe. | Je montre que mes groupes accumulent les droits. | Groupes calculés par attribut et revues d'accès ([Identité et accès](#identite-et-acces)). |
| **Désactiver sans révoquer** : je m'arrête à la désactivation du compte. | Critère éliminatoire : sessions ouvertes et comptes locaux restent utilisables. | Je cite sessions, jetons, SCIM, applications sans SSO et vérification à J+1 ([Critères éliminatoires](#criteres-eliminatoires)). |
| **Tout pousser d'un coup** : je décris un changement appliqué à tout le parc. | Le recruteur imagine 300 portables sans Wi-Fi un lundi matin. | Anneaux, critères d'arrêt, retour arrière testé ([Automatisation](#automatisation-et-workplace-as-code)). |
| **La sécurité contre les salariés** : je réponds « on interdit » à chaque demande. | Je pousse au shadow IT et aux contournements. | Je ferme le dangereux et j'offre une voie validée ([SaaS et outils collaboratifs](#saas-et-outils-collaboratifs)). |
| **Surveiller sans cadre** : j'accepte de collecter toute l'activité des postes « pour la sécurité ». | Un problème de RGPD et une perte de confiance. | Je documente ce qui est collecté, pourquoi et combien de temps ([Sécurité des postes et conformité](#securite-des-postes-et-conformite)). |
| **Répondre au conditionnel** : je dis « je ferais » sans histoire vécue. | La réponse ressemble à une page apprise, sans preuve d'expérience. | Une histoire STAR par thème, avec mes chiffres ([Questions de comportement](#questions-de-comportement)). |
