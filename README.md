# 🏥 Para Ben Moussa - Pharmacie en ligne

Plateforme e-commerce dédiée à la pharmacie et au para-pharmaceutique, construite avec **Laravel 12** (backend) et **React 18 + Vite** (frontend).

## 📋 Stack technique

| Couche | Technologie |
|--------|-------------|
| Backend | Laravel 12, PHP 8.2+ |
| Base de données | MySQL / SQLite |
| Authentification | Laravel Sanctum |
| Frontend | React 18, Vite, React Router |
| Recherche full-text | Laravel Scout (database / Meilisearch) |
| Paiement | CMI (Maroc) — mode test |
| PDF | Dompdf (factures) |
| PWA | Workbox, Web Push notifications |
| Cache | Laravel Cache (file / redis) |

## 📁 Structure

```
pharmacie_benmoussa/
├── backend/           # Laravel API
├── frontend/          # React + Vite
├── vercel.json        # Config Vercel (frontend)
├── .gitignore
└── README.md
```

## 🚀 Installation locale (développement)

### 1. Backend (Laravel)

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Le frontend pointe par défaut vers `http://127.0.0.1:8000/api` (variable `VITE_API_URL`).

## 🔐 Sécurité — avant la mise en production

1. **Générer `APP_KEY`** : `php artisan key:generate`
2. **`APP_DEBUG=false`** dans `.env` (jamais `true` en production)
3. **Configurer les vrais identifiants** dans `.env` (ne jamais committer `.env`)
4. **CMI** : remplacer `CMI_CLIENT_ID` et `CMI_STORE_KEY` par les vrais clés de production
5. **Twilio** : configurer les vrais credentials SMS/WhatsApp
6. **Mail** : configurer `MAIL_MAILER=smtp` avec un vrai serveur SMTP

## ☁️ Déploiement sur Vercel (Frontend)

1. Pousse le code sur GitHub (repo public)
2. Connecte ton repo à [Vercel](https://vercel.com)
3. Configure les variables d'environnement :
   - `VITE_API_URL` = URL de ton backend Laravel (ex: `https://api-parabenmoussa.ma/api`)
4. Build command : `npm run build` (dans le dossier `frontend/`)
5. Output directory : `frontend/dist`

> ⚠️ Le backend Laravel (PHP) ne peut pas être hébergé nativement sur Vercel. Héberge le backend sur un service compatible PHP (Render, Railway, Heroku, VPS, ou mutualisé) et configure `VITE_API_URL` pour pointer vers cette URL.

## 🐛 Corrections déjà appliquées

- ✅ `config/database.php` : suppression de l'import invalide `use Pdo\Mysql;`
- ✅ `AuthController.php` : suppression de la fuite du code 2FA en mode debug
- ✅ `OrderController.php` : fidélité et parrainage déplacés dans la transaction DB (cohérence atomique)
- ✅ `.env.example` : `APP_DEBUG=false`, identifiants sensibles masqués
- ✅ `axiosWithCancel.js` : `CancelToken` déprécié remplacé par `AbortController`

## 📄 Licence

CC0 — Domaine public

## 📞 Contact

Pour toute question sur ce projet, ouvre une issue sur ce repository.
