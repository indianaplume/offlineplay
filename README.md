# OfflinePlay — prototype fonctionnel

Squelette d'application de streaming (Séries / Films / Musique) avec abonnement
Premium optionnel et support hors ligne (PWA). Base de travail à faire évoluer.

## Structure

```
offlineplay/
├── index.html      # Structure de l'app (topbar, catalogue, lecteur, modal abonnement)
├── style.css        # Identité visuelle (fond sombre, accent cyan/corail, HUD discret)
├── app.js           # Logique : navigation, catalogue, lecteur simulé, abonnement, offline
├── sw.js             # Service worker — cache l'app shell pour un accès hors ligne
├── manifest.json     # Rend l'app installable sur mobile et PC (PWA)
└── icon-192.png / icon-512.png
```

## Espace Administrateur (nouveau)

Accessible via `admin.html`, séparé du site public.

- **Connexion dédiée** (identifiants de démonstration affichés sur l'écran de connexion :
  `admin@offlineplay.fr` / `admin123`). Mot de passe simplement encodé, comme pour les comptes
  utilisateurs — à remplacer par un vrai backend avant toute mise en production.
- **Vue d'ensemble** : nombre de comptes, d'abonnés Premium, de demandes en attente, de contenus au catalogue.
- **Demandes** : liste de toutes les demandes envoyées depuis l'onglet "Demandes" du site,
  avec boutons Accepter / Refuser qui mettent à jour leur statut.
- **Catalogue** : gestion complète des séries, films et musiques — ajout, modification,
  suppression. Les changements sont immédiatement visibles sur le site public au
  prochain chargement (catalogue partagé via `localStorage`, voir `catalog-data.js`).
- **Comptes** : liste des comptes utilisateurs, avec possibilité d'offrir/retirer le
  Premium manuellement ou de supprimer un compte.

## Correctif : bug d'ordre d'initialisation (cause réelle trouvée et corrigée)

Grâce à une capture de la console développeur, la vraie cause a été identifiée :
`CATALOG` était déclaré (chargé depuis `catalog-data.js`) **après** le code qui
reconnecte automatiquement une session admin déjà active. Résultat : dès la
deuxième ouverture de la page (session déjà connectée depuis la fois précédente),
la reconnexion automatique tentait d'afficher "Vue d'ensemble" avant que
`CATALOG` n'existe encore → erreur JavaScript → tout plantait sauf l'onglet
"Comptes" (le seul qui ne dépend pas du catalogue). Corrigé en chargeant le
catalogue et les autres données partagées **avant** toute tentative de
reconnexion automatique. Testé et confirmé avec le scénario exact
(session déjà active au chargement).

## Correctif : robustesse face aux données corrompues (important)

Bug corrigé : si une valeur stockée en local (comptes, demandes, playlist, etc.)
devenait invalide pour une raison ou une autre, la page qui l'utilisait plantait
silencieusement — ça expliquait le cas où l'onglet actif changeait dans le menu
mais le contenu affiché restait celui de l'onglet précédent (aucune erreur visible,
juste un blocage silencieux). Toutes les lectures de `localStorage` passent
maintenant par une fonction tolérante aux erreurs (`getLocal()`, dans
`catalog-data.js`) qui retombe sur une valeur vide plutôt que de faire planter
la page. Testé et confirmé avec des données volontairement corrompues.

## Fichiers 100% autonomes

`index.html` et `admin.html` contiennent maintenant TOUT (CSS, JavaScript, logo en
base64) directement dans le fichier. Plus aucune dépendance à `style.css`,
`admin.css`, `catalog-data.js`, `app.js` ou `admin.js` pour que les pages
s'affichent et fonctionnent — ces fichiers restent fournis à part uniquement
pour que tu puisses les éditer plus facilement (code source), mais ils ne sont
plus chargés au moment de l'exécution. Ça évite les soucis rencontrés quand
un environnement de prévisualisation ne charge pas correctement les fichiers
liés séparément (CSS non appliqué, ou pire : script non chargé qui casse
silencieusement certaines fonctionnalités — c'était la cause du bug où seul
l'onglet "Comptes" fonctionnait dans l'admin, les trois autres onglets dépendant
tous du catalogue via `catalog-data.js`).

**Important** : si tu modifies `style.css`, `app.js`, `catalog-data.js` ou
`admin.js` (les fichiers source), il faudra me redemander de resynchroniser
ces changements dans `index.html`/`admin.html`, sinon les modifications ne
seront pas prises en compte à l'exécution.

- **Badge "Nouveau" limité à 5 jours** : un contenu marqué comme nouveauté dans l'admin
  perd automatiquement son badge au bout de 5 jours (calculé depuis la date où il a été
  marqué). L'admin voit le statut réel dans le tableau du catalogue ("Oui — actif" /
  "Oui — expiré (5j)"). Remarquer une nouveauté à nouveau relance le compte à rebours.
- **Correctif d'affichage en mode sombre** : le bouton "Lecture" du bandeau suggestion et
  le bouton de fermeture (✕) de la fiche détail utilisaient un fond blanc figé avec un
  texte qui suivait le thème — invisibles en mode sombre. Corrigé pour rester lisibles
  dans les deux thèmes.

- **Écran de démarrage animé** : à l'arrivée sur le site, le logo apparaît en grand avec
  une animation d'entrée (fondu + léger zoom), puis s'efface après ~1,3 seconde pour
  laisser place à l'application. Réservé au site public (pas sur l'espace admin).

## Ce qui est fonctionnel dès maintenant

- **Navigation séparée en deux groupes** : Accueil/Séries/Films/Musique restent groupés à
  gauche, tandis que Ma Liste et Demandes sont détachés visuellement et poussés à droite
  de la barre (juste avant le compte), tout en restant dans la même barre de navigation.
- **Miniatures personnalisées** : dans l'admin, chaque contenu peut recevoir une image
  (URL) qui remplace le fond dégradé par défaut — sur les cartes, la fiche détail et le
  grand bandeau "Suggestion du jour". Sans image, le dégradé + initiales reste utilisé.
- **Onglet "Ma Liste"** (navigation principale) : page dédiée listant tout ce que
  l'utilisateur a ajouté à sa liste, groupé par Séries/Films/Musique, avec un bouton
  de retrait rapide directement sur chaque carte (sans repasser par la fiche détail).

- **Vrais comptes persistants** (`localStorage`, clé `op_accounts`) : la création vérifie
  qu'aucun compte n'existe déjà avec cet email, la connexion vérifie le mot de passe.
  Se déconnecter puis se reconnecter retrouve bien le même compte.
- **Aucun contenu n'est verrouillé** : tous les films, séries et musiques sont
  regardables/écoutables gratuitement, sans compte ni abonnement.
- **Le Premium donne des avantages, sans jamais bloquer l'accès** :
  - **Reprise de lecture automatique** — la position de lecture n'est mémorisée
    d'une session à l'autre que pour les comptes Premium (visible dans la fiche détail,
    bouton "▶ Reprendre (x%)").
  - **Téléchargement hors ligne** réservé aux comptes Premium (upsell non bloquant :
    le bouton ouvre directement l'abonnement pour les comptes gratuits/non connectés).
- **Onglet "Demandes"** (navigation principale) : formulaire pour demander l'ajout
  d'un film, d'une série ou d'une musique, avec une liste communautaire des demandes
  en cours (statut "En attente" pour l'instant — le tri/traitement viendra avec le
  futur espace administrateur).
- **Page "Mon compte"** (au clic sur le bouton compte une fois connecté), avec des onglets
  **verticaux à gauche** pour une navigation plus pratique :
  - **Profil** : nom modifiable, email, déconnexion.
  - **Sécurité** : changement de mot de passe (vérifie l'ancien avant de le remplacer).
  - **Apparence** : bascule mode clair / mode sombre, appliquée immédiatement et mémorisée.
  - **Abonnement** : statut Premium, bouton pour s'abonner ou résilier.
  - **Téléchargements** : liste des contenus disponibles hors ligne, retrait individuel ou global.
  - **Notifications** : préférences (nouveautés, recommandations, offres) mémorisées en local.
- **Premium activable uniquement via un compte connecté** : cliquer sur "Passer Premium"
  sans être connecté ouvre d'abord la connexion/création de compte, puis l'abonnement
  automatiquement une fois connecté. Le statut Premium est stocké sur le compte lui-même.
- **Logo intégré directement dans la page** (en base64) pour un affichage garanti quel
  que soit l'endroit où les fichiers sont hébergés.
- **Page de détail complète** au clic sur une carte (affiche, titre, badges de note/licence,
  description, boutons Lecture / Playlist / J'aime / Télécharger) :
  - Séries et films : onglets (Épisodes, Casting & Production, Commentaires) + section
    "Séries/Films similaires" en bas de page.
  - Musique : pochette carrée centrée, titre + artiste, puis "Plus de cet artiste" en dessous.
- **Onglet Accueil** (par défaut) avec deux rangées par catégorie (Séries / Films / Musique) :
  "Les plus vus" (triés par popularité simulée) et "Nouveautés" (contenus marqués `isNew`).
- **Grand rectangle = Suggestion du jour**, en carrousel défilant automatiquement toutes les
  4 secondes : toujours un film, une série et une musique, choisis en priorité parmi ce que
  l'utilisateur n'a pas encore ouvert (sinon les plus vus).
- **3 espaces de contenu** avec ratios distincts appliqués automatiquement :
  Séries → 16:9, Films → 9:16, Musique → 1:1 (cartes du catalogue + affiche de la fiche détail).
- **Barre de recherche** visible sur Séries/Films/Musique, masquée sur Accueil, filtre en direct.
- **Connexion / création de compte** (bouton en haut à droite) — simulé en local pour l'instant.
- **Abonnement optionnel à 9,99€/mois** : bascule Premium en local (`localStorage`),
  déverrouille les contenus marqués "Premium" dans le catalogue.
- **Téléchargement hors ligne, playlist et likes** persistés en local, gérés directement
  depuis la fiche détail.
- **Bannière de détection hors ligne** : s'affiche automatiquement quand la
  connexion tombe (`navigator.onLine`).
- **PWA installable** sur mobile (Chrome/Safari → "Ajouter à l'écran d'accueil")
  et sur PC (Chrome/Edge → icône d'installation dans la barre d'adresse).

## Ce qui est volontairement simulé (à connecter ensuite)

- Le catalogue utilise des **données de démonstration** (`CATALOG` dans `app.js`) —
  aucun contenu réel, pour ne pas anticiper tes accords de licence.
- Le lecteur simule la lecture (barre de progression) au lieu de streamer un
  vrai fichier — il n'y a pas encore de backend ni de fichiers média.
- Le téléchargement hors ligne marque juste l'état ; il faudra le relier à la
  **Cache Storage API** ou **IndexedDB** pour stocker le fichier réel.
- La **connexion/création de compte** stocke le profil et le mot de passe (encodé en
  base64, PAS chiffré) dans `localStorage`. C'est une simulation de mémoire côté
  prototype uniquement — avant mise en production il faut impérativement un vrai
  backend avec hachage de mot de passe (bcrypt/argon2) et sessions sécurisées.

## Prochaines étapes techniques (à valider avec toi)

1. **Backend** : API (catalogue, utilisateurs, licences, paiement Stripe).
2. **Lecteur réel** : `<video>` / `<audio>` avec streaming adaptatif (HLS),
   + chiffrement/DRM léger selon les exigences des ayants droit.
3. **Vrai stockage hors ligne** : téléchargement des fichiers média chiffrés
   dans IndexedDB, avec expiration si l'abonnement est résilié.
4. **Version mobile native ou wrapper** (Capacitor/Electron) pour publier sur
   store et desktop à partir de cette même base web.
5. **Espace "OfflinePlay Administrateur"** (prochaine étape) : traitement des
   demandes de contenus (accepter/refuser, changer le statut), gestion du
   catalogue, modération — actuellement toutes les demandes restent "En attente".

## Tester en local

```bash
cd offlineplay
python3 -m http.server 8080
# puis ouvrir http://localhost:8080 dans le navigateur
```

Dis-moi ce que tu veux ajuster (design, catalogue, comportement de
l'abonnement) et je fais évoluer le code en conséquence.
