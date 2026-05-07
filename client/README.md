# DPE Simplifié

Tu déposes un DPE ou un PPPT en PDF, le projet te ressort un rapport vulgarisé prêt à envoyer au propriétaire. C'est à peu près ça.

---

## Comment ça marche

Le truc se passe en trois étapes, dans l'ordre :

1. **Extraction** — le texte brut est tiré du PDF avec `pdf-parse`. Pas de reconnaissance OCR, ça marche sur les PDFs textuels.
2. **Vulgarisation** — le texte est envoyé à l'API Mistral qui le réécrit en français clair selon un prompt détaillé. Si le document est long (> 40 ko), il est découpé en morceaux et résumé avant d'être vulgarisé.
3. **Génération** — le résultat markdown est rendu en HTML puis converti en PDF stylisé via Puppeteer.

---

## Structure du projet

```
DPE-Clem/
├── backend/                  # Express — le pipeline de traitement
│   └── src/
│       ├── index.js          # Entrée, serveur Express sur le port 3000
│       ├── routes/pdf.js     # Route POST /api/process
│       ├── controllers/pdf.js
│       └── services/
│           ├── extract.js    # Extraction du texte PDF
│           ├── vulgarize.js  # Appel à Mistral + logique de chunking
│           └── generate.js   # Génération du PDF de sortie
│
└── dpe-simplifier/           # React + Vite — l'interface
    └── src/
        ├── App.tsx
        ├── pages/            # Upload, Processing, Result
        ├── components/       # DropZone, shadcn/ui, etc.
        └── context/          # PDFContext — état global
```

---

## Démarrage local

Il faut Node.js et une clé API Mistral.

```sh
# Backend
cd backend
cp .env.example .env          # puis mettre ta clé Mistral dans MISTRAL_API_KEY
npm install
npm run dev                   # lance sur le port 3000

# Frontend (autre terminal)
cd dpe-simplifier
npm install
npm run dev                   # lance sur le port 8080
```

Le frontend parle au backend sur `localhost:3000`, le CORS est configuré pour `localhost:8080`.

---

## Variables d'environnement

Tout se passe dans `backend/.env` :

| Variable           | Valeur par défaut       | Pour quoi                          |
| ------------------ | ------------------------ | ---------------------------------- |
| `MISTRAL_API_KEY`  | —                        | Obligatoire, clé API Mistral       |
| `PORT`             | `3000`                   | Port du backend                    |
| `CORS_ORIGIN`      | `http://localhost:8080`  | Origine autorisée en développement |

---

## Stack en résumé

- **Backend :** Node.js, Express, pdf-parse, Puppeteer, Mistral API
- **Frontend :** React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, React Router
