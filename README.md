# 📱 OfflinePlay — Guide d'installation

## C'est quoi ?
Une app de streaming **100% hors-ligne** pour écouter ta musique, regarder tes vidéos et podcasts **sans connexion internet**. Parfait pour les voyages !

---

## 🚀 Installation sur Android (Chrome)

### Étape 1 — Héberge l'app gratuitement sur GitHub Pages

1. Crée un compte sur [github.com](https://github.com) (gratuit)
2. Crée un nouveau dépôt public nommé `offlineplay`
3. Upload tous les fichiers :
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - le dossier `icons/` avec les 2 images PNG
4. Va dans **Settings → Pages → Branch: main → Save**
5. Ton app sera accessible sur : `https://TON_PSEUDO.github.io/offlineplay`

### Étape 2 — Installe l'app sur ton téléphone

1. Ouvre **Chrome** sur ton Android
2. Va sur l'URL de ton app (ex: `https://tonpseudo.github.io/offlineplay`)
3. Clique sur les **⋮ (trois points)** en haut à droite
4. Appuie sur **"Ajouter à l'écran d'accueil"**
5. Confirme → l'app apparaît comme une vraie app sur ton écran ! ✅

---

## 🎵 Utilisation

- **Importer** → bouton en haut à droite, sélectionne tes fichiers audio/vidéo
- **Miniatures** → survole une carte, clique sur "📷 miniature"
- **Playlists** → onglet Playlists → "Nouvelle playlist" → ajoute des fichiers
- **Hors-ligne** → une fois importés, tous les fichiers restent disponibles sans internet
- **Contrôles depuis l'écran de verrouillage** → fonctionnels automatiquement !

---

## 📁 Formats supportés

| Audio | Vidéo |
|-------|-------|
| MP3, AAC, FLAC, WAV, OGG, M4A | MP4, WebM, MOV, AVI |

---

## 💾 Stockage

Tous tes fichiers sont stockés dans le navigateur (IndexedDB). Ils restent là **même sans connexion** et entre les sessions. L'espace disponible dépend de ton téléphone (généralement plusieurs Go).

---

*Fait avec ❤️ — OfflinePlay v1.0*
