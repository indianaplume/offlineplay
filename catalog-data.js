// ---------- Catalogue par défaut (données de démonstration) ----------
// Ce fichier est partagé entre le site public (app.js) et l'espace administrateur (admin.js).
// Remplace ces entrées par ton vrai catalogue (titres, pochettes, fichiers média sous licence).
// Le catalogue réellement utilisé est copié dans localStorage ("op_catalog") au premier lancement,
// puis modifiable depuis l'espace administrateur sans jamais toucher à ce fichier.
const DEFAULT_CATALOG = {
  series: {
    label: "Séries", ratio: "16:9", ratioClass: "", cat: "series",
    hero: { tag: "Sélection éditoriale", title: "Continuez votre série", desc: "Vos épisodes en cours, synchronisés entre mobile et PC." },
    items: [
      { id: "s1", title: "Horizon Perdu", sub: "S01 · Ep. 4", premium: false, views: 980, isNew: false,
        desc: "Une équipe scientifique isolée en Antarctique découvre un signal qui remet en question tout ce qu'elle croyait savoir sur son isolement.",
        year: "2022 - 2024", genre: "Science-fiction", age: "12+", lang: "VF", rating: "88%", seasons: 3 },
      { id: "s2", title: "Zone Silencieuse", sub: "S02 · Ep. 1", premium: false, views: 1240, isNew: true,
        desc: "Dans une ville où le bruit a disparu du jour au lendemain, une enquêtrice tente de comprendre ce qui a réellement changé.",
        year: "2023 - 2024", genre: "Thriller", age: "16+", lang: "VOSTFR", rating: "91%", seasons: 2 },
      { id: "s3", title: "Nocturne", sub: "S01 · Ep. 8", premium: false, views: 2100, isNew: false,
        desc: "Trois familles d'un même quartier voient leurs secrets refaire surface pendant une série de nuits sans sommeil.",
        year: "2021 - 2023", genre: "Drame", age: "12+", lang: "VF", rating: "85%", seasons: 1 },
      { id: "s4", title: "Fracture", sub: "S03 · Ep. 2", premium: false, views: 640, isNew: false,
        desc: "Un ancien négociateur de crise revient sur le terrain pour une mission qui le confronte directement à son passé.",
        year: "2020 - 2024", genre: "Action", age: "16+", lang: "VF", rating: "82%", seasons: 3 },
      { id: "s5", title: "Rive Nord", sub: "S01 · Ep. 6", premium: false, views: 410, isNew: true,
        desc: "Sur une île du nord, une communauté de pêcheurs doit composer avec l'arrivée d'un projet industriel controversé.",
        year: "2024", genre: "Drame", age: "10+", lang: "VF", rating: "79%", seasons: 1 },
      { id: "s6", title: "Le Dernier Signal", sub: "S01 · Ep. 3", premium: false, views: 1580, isNew: false,
        desc: "Un technicien radio capte un message qui ne devrait plus jamais être émis, et qui va bouleverser sa routine.",
        year: "2023", genre: "Science-fiction", age: "12+", lang: "VF", rating: "87%", seasons: 1 },
    ]
  },
  films: {
    label: "Films", ratio: "9:16", ratioClass: "aspect-916", cat: "films",
    hero: { tag: "À l'affiche", title: "Nouveautés du mois", desc: "Films sous licence exclusive, disponibles en téléchargement." },
    items: [
      { id: "f1", title: "Marée Basse", sub: "1h52 · Drame", premium: false, views: 870, isNew: false,
        desc: "Le retour d'une femme dans son village natal fait ressurgir une histoire familiale que tout le monde préférait taire.",
        year: "2023", genre: "Drame", age: "12+", lang: "VF", rating: "84%" },
      { id: "f2", title: "Vertige", sub: "2h05 · Thriller", premium: false, views: 1930, isNew: true,
        desc: "Une architecte piégée au sommet d'une tour en construction doit déjouer un piège pensé pour elle depuis le début.",
        year: "2024", genre: "Thriller", age: "16+", lang: "VOSTFR", rating: "90%" },
      { id: "f3", title: "Éclats", sub: "1h38 · Action", premium: false, views: 1120, isNew: false,
        desc: "Un convoyeur de fonds se retrouve embarqué dans une course contre la montre à travers une ville en état d'urgence.",
        year: "2022", genre: "Action", age: "16+", lang: "VF", rating: "81%" },
      { id: "f4", title: "Solstice", sub: "2h20 · Science-fiction", premium: false, views: 2600, isNew: false,
        desc: "À bord d'une station orbitale, un équipage doit choisir entre sauver la mission ou sauver la Terre qu'il observe se refroidir.",
        year: "2023", genre: "Science-fiction", age: "12+", lang: "VF", rating: "93%" },
      { id: "f5", title: "Le Passage", sub: "1h47 · Drame", premium: false, views: 300, isNew: true,
        desc: "Deux frères séparés depuis l'enfance se retrouvent contraints de traverser le pays ensemble pour honorer une dernière volonté.",
        year: "2024", genre: "Drame", age: "10+", lang: "VF", rating: "86%" },
    ]
  },
  musique: {
    label: "Musique", ratio: "1:1", ratioClass: "aspect-11", cat: "musique",
    hero: { tag: "Écoute du jour", title: "Vos artistes suivis", desc: "Albums et titres sous licence, écoutables hors connexion." },
    items: [
      { id: "m1", title: "Lueurs", sub: "Studio Nova", premium: false, views: 3400, isNew: false },
      { id: "m2", title: "Basalte", sub: "K. Moreau", premium: false, views: 2200, isNew: false },
      { id: "m3", title: "Aparté", sub: "Les Heures", premium: false, views: 540, isNew: true },
      { id: "m4", title: "Grand Angle", sub: "Studio Nova", premium: false, views: 980, isNew: false },
      { id: "m5", title: "Ricochet", sub: "N. Faye", premium: false, views: 1670, isNew: true },
      { id: "m6", title: "Verglas", sub: "K. Moreau", premium: false, views: 720, isNew: false },
    ]
  }
};
const CATS = ["series", "films", "musique"];

// ---------- Accès partagé au catalogue (lecture/écriture localStorage) ----------
const NEW_BADGE_DAYS = 5;

function loadCatalog(){
  const saved = localStorage.getItem("op_catalog");
  let catalog;
  if (saved){
    try { catalog = JSON.parse(saved); } catch(e){ /* ignore, retombe sur le défaut */ }
  }
  if (!catalog) catalog = JSON.parse(JSON.stringify(DEFAULT_CATALOG));

  // Tout contenu marqué "nouveauté" sans date connue reçoit la date du jour,
  // pour démarrer son compte à rebours de 5 jours.
  let changed = false;
  CATS.forEach(cat => {
    (catalog[cat]?.items || []).forEach(item => {
      if (item.isNew && !item.newSince){
        item.newSince = new Date().toISOString().slice(0,10);
        changed = true;
      }
    });
  });
  if (changed) saveCatalog(catalog);
  return catalog;
}
function saveCatalog(catalog){
  localStorage.setItem("op_catalog", JSON.stringify(catalog));
}

// Un contenu n'affiche le badge "Nouveau" que dans les 5 jours suivant son marquage.
function isStillNew(item){
  if (!item.isNew || !item.newSince) return false;
  const days = (Date.now() - new Date(item.newSince).getTime()) / (1000 * 60 * 60 * 24);
  return days < NEW_BADGE_DAYS;
}

// ---------- Lecture localStorage tolérante aux erreurs ----------
// Si une valeur stockée est corrompue (JSON invalide), on retombe sur la valeur
// par défaut au lieu de faire planter silencieusement toute la page qui l'utilise.
function getLocal(key, fallback){
  const raw = localStorage.getItem(key);
  if (raw === null || raw === undefined) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed === null || parsed === undefined ? fallback : parsed;
  } catch(e){
    return fallback;
  }
}
