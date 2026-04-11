# Quizly
> Transforme tes cours en quiz en 10 secondes — propulsé par l'IA

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js)
![Groq](https://img.shields.io/badge/IA-Groq%20%2F%20Llama%203.1-orange?style=flat)
![License](https://img.shields.io/badge/Licence-Académique-blue?style=flat)

Application web académique développée à l'École Centrale de Lyon. Elle permet à tout étudiant d'importer un cours PDF et de générer automatiquement un QCM intelligent grâce à un LLM.

---

## Auteurs

| Nom | École |
|-----|-------|
| Mohamed Montassar Ben Youssef | École Centrale de Lyon |
| Ichrak Ben Yahia | École Centrale de Lyon |

---

## Fonctionnalités

- **Import PDF** — glisser-déposer ou sélection de fichier (max 10 Mo)
- **Configuration** — nombre de questions (5–50), difficulté (Facile / Moyen / Difficile), langue (FR / EN)
- **Génération IA** — questions, options, bonne réponse et explication via Llama 3.1
- **Quiz interactif** — correction immédiate avec explication pédagogique
- **Progression** — barre de progression et score final

---

## Stack technique

| Couche | Technologie | Rôle |
|--------|-------------|------|
| Frontend | React 19 + Vite 7 | Interface utilisateur SPA |
| Frontend | Tailwind CSS 3 | Styles et mise en page |
| Frontend | Axios | Requêtes HTTP vers le backend |
| Backend | Node.js + Express 5 | Serveur API REST |
| Backend | Multer | Upload de fichiers PDF |
| Backend | pdf-parse | Extraction du texte brut |
| Backend | Groq SDK | Appel au LLM Llama 3.1 |
| Backend | dotenv | Variables d'environnement |
| Backend | cors | Autorisation cross-origin |

---

## Structure du projet

```
Quizly/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── vite.config.js        ← Proxy vers le backend
│   └── package.json
├── backend/
│   ├── routes/
│   │   └── quiz.js            ← Route POST /api/generate
│   ├── services/
│   │   ├── pdfExtractor.js    ← Extraction texte PDF
│   │   └── quizGenerator.js   ← Appel API Groq / LLM
│   ├── uploads/               ← Fichiers PDF temporaires
│   ├── index.js               ← Point d'entrée Express
│   ├── .env                   ← Clé API (non versionné !)
│   └── package.json
└── README.md
```

---

## Installation & lancement

### Prérequis

- Node.js >= 18
- npm >= 9
- Une clé API Groq gratuite → [console.groq.com](https://console.groq.com) (sans carte bancaire)

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-repo/Quizly.git
cd Quizly
```

### 2. Backend

```bash
cd backend
npm install
```

Créer un fichier `.env` dans `backend/` :

```env
GROQ_API_KEY=gsk_XXXXXXXXXXXXXXXXXXXXXXXX
PORT=3001
```

### 3. Frontend

```bash
cd ../frontend
npm install
```

### 4. Lancer l'application

**Terminal 1 — Backend :**
```bash
cd backend
npm run dev
# Quizly backend running on http://localhost:3001
```

**Terminal 2 — Frontend :**
```bash
cd frontend
npm run dev
# ➜ Local: http://localhost:5173/
```

Ouvrir [http://localhost:5173](http://localhost:5173) dans le navigateur.

### Configuration du proxy Vite

`frontend/vite.config.js` doit rediriger les appels `/api` vers le backend :

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})
```

---

## Architecture IA

La couche IA est concentrée dans deux fichiers backend :

- `services/quizGenerator.js` — génération du quiz
- `routes/quiz.js` — orchestration de la pipeline

### Prompt engineering

Le prompt instruit le modèle de :

- Lire le texte extrait du PDF fourni en contexte
- Générer exactement N questions (paramètre configuré par l'utilisateur)
- Adapter la difficulté (Facile / Moyen / Difficile)
- Répondre dans la langue choisie (FR / EN / ES)
- Retourner **uniquement** un tableau JSON — pas de Markdown, pas de texte libre

Chaque objet du tableau contient : `question`, `options` (4 choix), `correctIndex` (entier 0–3), `explanation`.

### Choix du modèle : Llama 3.1 via Groq

Après avoir testé Claude (Anthropic) et Gemini (Google), nous avons retenu **Groq / Llama 3.1 8B Instant** pour :

- Gratuité sans carte bancaire (indispensable pour un projet académique)
- Latence très faible grâce au hardware LPU dédié de Groq
- Réponses JSON fiables sur des textes académiques

---

## API

La seule route HTTP est `POST /api/generate`, en `multipart/form-data` :

| Champ | Type | Contrainte | Rôle |
|-------|------|------------|------|
| `pdf` | File | max 10 Mo, `application/pdf` | Cours à transformer |
| `questionCount` | String | Entre 5 et 50 | Nombre de questions |
| `difficulty` | String | `Facile` \| `Moyen` \| `Difficile` | Niveau de difficulté |
| `language` | String | `FR` \| `EN` \| `Espagnol` | Langue du quiz |

### Pipeline de traitement

```
Utilisateur
    │
    ▼
[React Frontend :5173]
    │  POST /api/generate (multipart PDF + paramètres)
    ▼
[Express Backend :3001]
    │
    ├─► Multer       → sauvegarde le PDF dans uploads/
    ├─► pdf-parse    → extrait le texte brut
    └─► Groq SDK     → envoie le texte + paramètres au LLM
            │
            ▼
    [Llama 3.1 8B Instant]
            │  JSON : questions + options + correctIndex + explanation
            ▼
[Express Backend] → renvoie le quiz au frontend
    │
    ▼
[React Frontend]  → affiche le quiz interactif
```

---

## Gestion des erreurs

| Erreur | Cause | Traitement |
|--------|-------|------------|
| Fichier non PDF / trop grand | Multer `fileFilter` + `limits` | Rejet 400 avant traitement |
| PDF illisible ou vide | `pdf-parse` échoue | `catch` + réponse 422 |
| Clé API invalide ou absente | Variable d'environnement manquante | Erreur 500 loggée serveur |
| Quota LLM dépassé (429) | Rate limiting Groq | Propagation au frontend |
| JSON LLM malformé | Réponse hors format | `JSON.parse` en `try/catch` |
| CORS bloqué | Frontend ≠ Backend domaine | Middleware `cors` + proxy Vite |

### Point clé — initialisation du client LLM

```js
// ❌ MAUVAIS — lu avant que dotenv.config() soit exécuté
const client = new Groq({ apiKey: process.env.GROQ_API_KEY }); // undefined !

// ✅ CORRECT — instancié à l'intérieur de la fonction
export async function generateQuiz(text, options) {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  // ...
}
```

---

## Problèmes connus & solutions

| Erreur | Cause | Solution |
|--------|-------|----------|
| `Network Error` | Backend non démarré ou proxy absent | Configurer le proxy dans `vite.config.js` + lancer les 2 serveurs |
| `Could not resolve authentication method` | Client LLM instancié avant `dotenv.config()` | Instancier le client à l'intérieur de la fonction |
| `API key not valid` | Clé invalide ou guillemets dans le `.env` | Copier la clé sans guillemets ni espaces |
| `Credit balance too low` | Compte Anthropic sans crédits | Migrer vers Groq (gratuit) |
| `Model not found (404)` | Nom de modèle déprécié | Mettre à jour le nom du modèle |
| `Too Many Requests (429)` | Quota Gemini dépassé | Migrer vers Groq |
| Erreur CSS PostCSS | `@import` Google Fonts après `@tailwind` | Mettre les `@import` avant `@tailwind` dans `index.css` |

---

## Sécurité

### Failles identifiées

| Faille | Sévérité |
|--------|----------|
| Clé API dans `.env` potentiellement exposée en prod | 🔴 Haute |
| Fichiers PDF stockés en clair dans `uploads/` | 🔴 Haute |
| Aucune authentification sur `/api/generate` | 🔴 Haute |
| Pas de rate limiting sur l'API Express | 🟡 Moyenne |
| Pas de validation du contenu PDF avant injection dans le prompt | 🟡 Moyenne |
| Texte PDF tronqué si trop long | 🟢 Faible |
| Pas de timeout sur l'appel LLM | 🟢 Faible |

### Corrections envisagées

- Utiliser les variables d'environnement du service d'hébergement (Railway, Vercel) plutôt qu'un `.env` local
- Traiter le PDF en mémoire (stream) pour ne jamais l'écrire sur disque
- Authentification JWT ou OAuth2 (Auth0 / Clerk)
- `express-rate-limit` pour limiter les requêtes par IP
- Timeout via `AbortController` sur l'appel Groq avec retry automatique
- Pour les PDF longs : chunking par section avec résumé préalable

---

## Améliorations futures

- [ ] Mode révision adaptatif (répétition espacée sur les questions ratées)
- [ ] Export PDF du quiz avec score et corrections
- [ ] Partage de quiz via lien public
- [ ] Streaming des réponses LLM (Server-Sent Events)
- [ ] Support multi-formats : DOCX, PPTX, TXT, URL
- [ ] Cache des quiz via hash du contenu PDF
- [ ] Base de données (SQLite ou PostgreSQL) pour persister l'historique
- [ ] Questions ouvertes avec correction automatique par le LLM
- [ ] Déploiement cloud : frontend sur Vercel, backend sur Railway avec CI/CD

---

## Licence

Projet académique — École Centrale de Lyon — 2025–2026 — Usage éducatif uniquement.
