# Accéder au site

!!! warning "Avertissement"
    Ces notes sont des pense-bêtes personnels, pas une source de vérité. Elles reflètent ma compréhension et mes choix : leur contenu reste subjectif, malgré les citations et les références qu'il contient. Il peut être incomplet, simplifié, inexact ou dépassé. Vérifiez toujours dans la documentation officielle avant de l'appliquer. Ce contenu est fourni tel quel, sans aucune garantie : son utilisation se fait sous votre seule responsabilité.

Le site tourne sur ma machine. Il n'est pas publié en ligne, pour que le contenu reste privé comme le repo.

## Vocabulaire

- **MkDocs** : l'outil qui transforme les fichiers Markdown de `docs/` en site web. **Material** est son thème (couleurs, recherche, mode sombre).
- **mise** : l'outil qui installe la bonne version de Python pour ce projet et lance ses commandes (`mise run serve`), définies dans `mise.toml`.
- **Environnement virtuel (`.venv`)** : un dossier où sont installées les librairies Python de ce projet seulement, sans toucher au reste de la machine.
- **`127.0.0.1` et port** : `127.0.0.1` (ou `localhost`) désigne ma propre machine. Le port (`8100`) est le numéro de la « porte » sur laquelle le site écoute. Deux programmes ne peuvent pas utiliser le même port en même temps.
- **GitHub Pages** : le service de GitHub qui héberge un site statique à partir d'un dépôt.
- **Workflow (GitHub Actions)** : un fichier dans `.github/workflows/` qui lance des tâches automatiquement, par exemple publier le site à chaque push.

## Première fois

Prérequis : `git` et [mise](https://mise.jdx.dev/).

```
$ git clone https://github.com/vincentbaticle/reminder.git
$ cd reminder
$ mise trust
$ mise run serve
```

`mise` installe Python, crée un environnement virtuel `.venv` dans le repo et installe MkDocs. Ensuite il démarre le site.

Ouvrir [http://127.0.0.1:8100](http://127.0.0.1:8100).

## Les fois suivantes

```
$ cd reminder
$ git pull
$ mise run serve
```

Le site se recharge tout seul quand je modifie un fichier dans `docs/`.

## Les langues

Le site existe en français et en anglais. Le bouton de langue (icône de traduction) dans l'en-tête passe de l'un à l'autre.

| Langue   | Adresse                          | Fichiers        |
|----------|----------------------------------|-----------------|
| français | `http://127.0.0.1:8100/`         | `page.md`       |
| anglais  | `http://127.0.0.1:8100/en/`      | `page.en.md`    |

C'est le plugin `mkdocs-static-i18n` qui construit les deux versions.

## Commandes

| Je veux...                                         | Commande          |
|----------------------------------------------------|-------------------|
| lire le site en local                              | `mise run serve`  |
| vérifier qu'aucun lien n'est cassé                 | `mise run build`  |
| réinstaller les dépendances                        | `mise run install`|

## Ajouter une page

1. Créer le fichier Markdown en français dans `docs/knowledge/`, par exemple `docker.md`.
2. Créer sa traduction anglaise à côté, avec le suffixe `.en.md` : `docker.en.md`.
3. L'ajouter dans la partie `nav` de `mkdocs.yml` (avec le nom du fichier français), et son titre anglais dans `nav_translations` si le titre change.
4. Ajouter sa carte sur la page d'accueil, dans `docs/index.md` et `docs/index.en.md`, avec la date du jour.
5. `mise run build` pour vérifier, puis commit et push.

Sans fichier `.en.md`, la version anglaise affiche la page française.

## Modifier une page

1. Modifier la page française **et** sa version anglaise (`page.md` et `page.en.md`).
2. Mettre à jour la date de sa carte sur la page d'accueil, dans les deux langues :
   ```
   docs/index.md      *:material-calendar-check: Mis à jour le 21/10/2026*
   docs/index.en.md   *:material-calendar-check: Updated on 2026-10-21*
   ```
   Seule la carte concernée change de date : la date indique la dernière modification d'une des pages de la carte.
3. `mise run build`, puis commit et push.

Ces règles sont aussi écrites dans `CLAUDE.md` à la racine du repo, pour que l'assistant les applique tout seul.

## Le port 8100 est déjà pris

Le site écoute sur le port 8100 plutôt que 8000, le port par défaut de MkDocs : 8000 et 8001 sont souvent pris par des API lancées dans Docker. Le site voisin de préparation aux entretiens utilise 8101. Si 8100 est quand même occupé, choisir un autre port libre :

```
$ lsof -nP -iTCP:8100 -sTCP:LISTEN
$ mise exec -- mkdocs serve -a 127.0.0.1:8102
```

## Pourquoi pas GitHub Pages

Sur un compte GitHub perso, un site GitHub Pages est **toujours public**, même si le repo est privé. Pour publier quand même, il faudrait ajouter un workflow de déploiement en sachant que tout le contenu serait visible par n'importe qui.
