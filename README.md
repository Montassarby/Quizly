# Quiz**ly** 
> Transforme tes cours en quiz en 10 secondes — propulsé par l'IA

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js)
![Groq](https://img.shields.io/badge/IA-Groq%20%2F%20Llama%203.1-orange?style=flat)
![License](https://img.shields.io/badge/Licence-Académique-blue?style=flat)

**Quizly** est une application web académique développée à l'École Centrale de Lyon. Elle permet à tout étudiant d'importer un cours PDF et de générer automatiquement un QCM intelligent grâce à un modèle de langage (LLM).

---

##  Auteurs

| Nom | École |
|-----|-------|
| Mohamed Montassar Ben Youssef | École Centrale de Lyon |
| Ichrak Ben Yahia | École Centrale de Lyon |

---

##  Fonctionnalités

-  **Import PDF** — glisser-déposer ou sélection de fichier (max 10 Mo)
-  **Configuration** — nombre de questions (5–50), difficulté (Facile / Moyen / Difficile), langue (FR / EN)
-  **Génération IA** — questions, options, bonne réponse et explication via Llama 3.1
-  **Quiz interactif** — correction immédiate avec explication pédagogique
-  **Progression** — barre de progression et score final

---

##  Stack technique

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

##  Structure du projet

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

##  Installation & lancement

### Prérequis

- Node.js >= 18
- npm >= 9
- Une clé API Groq gratuite → [console.groq.com](https://console.groq.com) (sans carte bancaire)

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-repo/Quizly.git
cd Quizly
```

### 2. Installer les dépendances backend

```bash
cd backend
npm install
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env` dans `backend/` :

```env
GROQ_API_KEY=gsk_XXXXXXXXXXXXXXXXXXXXXXXX
PORT=3001
```

### 4. Installer les dépendances frontend

```bash
cd ../frontend
npm install
```

### 5. Lancer l'application (2 terminaux)

**Terminal 1 — Backend :**
```bash
cd backend
npm run dev
#  Quizly backend running on http://localhost:3001
```

**Terminal 2 — Frontend :**
```bash
cd frontend
npm run dev
# ➜ Local: http://localhost:5173/
```

Ouvrir [http://localhost:5173](http://localhost:5173) dans le navigateur.

---

##  Configuration du proxy Vite

Le fichier `frontend/vite.config.js` doit rediriger les appels `/api` vers le backend :

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

##  Flux de données

```
Utilisateur
    │
    ▼
[React Frontend :5173]
    │  POST /api/generate (multipart PDF + paramètres)
    ▼
[Express Backend :3001]
    │
    ├─► Multer → sauvegarde le PDF dans uploads/
    ├─► pdf-parse → extrait le texte brut
    └─► Groq SDK → envoie le texte + paramètres au LLM
            │
            ▼
    [Llama 3.1 8B Instant]
            │  JSON : questions + options + correctIndex + explanation
            ▼
[Express Backend] → renvoie le quiz au frontend
    │
    ▼
[React Frontend] → affiche le quiz interactif
```

---

## Difficultés rencontrées & solutions

| Erreur | Cause | Solution |
|--------|-------|----------|
| `Network Error` | Backend non démarré ou proxy Vite absent | Configurer le proxy dans `vite.config.js` + lancer les 2 serveurs |
| `Could not resolve authentication method` | Client LLM instancié avant `dotenv.config()` | Instancier le client **à l'intérieur** de la fonction, pas au niveau du module |
| `API key not valid` | Clé invalide ou guillemets dans le `.env` | Copier la clé sans guillemets ni espaces |
| `Credit balance too low` | Compte Anthropic sans crédits | Migrer vers **Groq API** (gratuit, sans carte bancaire) |
| `Model not found (404)` | Nom de modèle déprécié (`gemini-1.5-flash`) | Utiliser `gemini-2.0-flash` ou migrer vers Groq |
| `Too Many Requests (429)` | Quota minute Gemini dépassé | Migrer vers Groq (limites plus souples) |
| Erreur CSS PostCSS | `@import` Google Fonts après `@tailwind` | Mettre les `@import` **avant** `@tailwind` dans `index.css` |

### Point clé — initialisation du client LLM

```js
//  MAUVAIS — lu avant que dotenv.config() soit exécuté
import Groq from 'groq-sdk';
const client = new Groq({ apiKey: process.env.GROQ_API_KEY }); // undefined !

//  CORRECT — instancié à l'intérieur de la fonction
export async function generateQuiz(text, options) {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY }); // ok !
  ...
}
```

---

##  Améliorations futures

- [ ] Authentification utilisateur + historique des quiz
- [ ] Export des résultats en PDF avec score et corrections
- [ ] Mode révision : repose uniquement les questions ratées
- [ ] Support d'autres formats : DOCX, PPTX, TXT
- [ ] Minuteur par question pour simuler des examens
- [ ] Déploiement cloud (Vercel + Railway)
- [ ] Base de données pour persister les quiz générés
- [ ] Streaming des réponses LLM en temps réel
- [ ] Support multi-modèles au choix de l'utilisateur

---

##  Licence

Projet académique — École Centrale de Lyon — 2024–2025  
Usage éducatif uniquement.