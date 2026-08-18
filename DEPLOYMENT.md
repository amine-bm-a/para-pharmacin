# Guide de Deploiement — Parapharmacie Ben Moussa

---

## Option 1 : Railway (Recommande)

### Architecture

```
Railway Project
├── Backend Service    (PHP 8.2 + Apache — Dockerfile)
├── Worker Service     (Queue worker — meme Dockerfile)
├── Frontend Service   (Nginx + SPA — Dockerfile multi-stage)
└── MySQL Database     (Railway managed)
```

### Etape 1 — Creer le projet Railway

1. Aller sur [railway.app](https://railway.app) → New Project
2. Choisir **"Deploy from GitHub Repo"** → selectionner `amine-bm-a/mon-projet_react`
3. Railway detecte automatiquement les deux Dockerfiles

### Etape 2 — Ajouter la base de donnees

1. Dans le dashboard Railway → **+ New** → **Database** → **MySQL**
2. Railway genere automatiquement les variables `MYSQL_*`

### Etape 3 — Configurer le Backend

1. Cliquer sur le service Backend → **Settings** → **Networking**
   - Internal Port: `80`
   - Public Network: **Enabled** (pour l'API)
2. **Variables d'environnement** (Settings → Variables) :

```ini
APP_ENV=production
APP_DEBUG=false
APP_KEY=<generer avec: php artisan key:generate>
APP_URL=https://<ton-backend>.railway.app
FRONTEND_URL=https://<ton-frontend>.railway.app

# Railway injecte automatiquement MySQL vars:
# DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
# Utiliser: ${{MySQL.MYSQL_HOST}} etc.

DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_PORT=${{MySQL.MYSQL_PORT}}
DB_DATABASE=${{MySQL.MYSQL_DATABASE}}
DB_USERNAME=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}

SESSION_SECURE_COOKIE=true
SANCTUM_STATEFUL_DOMAINS=<ton-frontend>.railway.app

CMI_CLIENT_ID=<ton_client_id>
CMI_STORE_KEY=<ton_store_key>

MAIL_MAILER=log
LOG_LEVEL=error
```

3. **Deploy trigger**: `Deploy on commit` (optionnel)

### Etape 4 — Configurer le Worker

1. Ajouter un 2eme service Backend (cloner la config)
2. **Command**: `php artisan queue:work --sleep=3 --tries=3 --max-time=3600`
3. Meme variables d'env que le Backend

### Etape 5 — Configurer le Frontend

1. Cliquer sur le service Frontend → **Settings** → **Variables** :

```ini
VITE_API_URL=https://<ton-backend>.railway.app/api
VITE_VAPID_PUBLIC_KEY=<cle VAPID>
```

2. Railway rebuild automatiquement le frontend avec ces vars
3. **Networking** → Public Network: Enabled

### Etape 6 — Migrations & Storage

Depuis le dashboard Railway → Backend Service → **Deploy** → **Shell** :

```bash
php artisan migrate --force
php artisan storage:link --force
php artisan config:cache
```

### Etape 7 — Domaine Personnalise (optionnel)

1. Railway → Frontend Service → **Settings** → **Custom Domain**
2. Ajouter `parabenmoussa.ma`
3. Configurer les DNS :

```
CNAME  www    → <ton-frontend>.railway.app
A      @      → <IP Railway>
```

4. Idem pour Backend avec `api.parabenmoussa.ma`
5. Mettre a jour `APP_URL`, `FRONTEND_URL`, `SANCTUM_STATEFUL_DOMAINS`

---

## Option 2 : Docker Compose (Dev Local)

### Pre-requis
- Docker + Docker Compose v2

### Commandes

```bash
# Copier les .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Generer la APP_KEY
docker compose exec backend php artisan key:generate

# Lancer tous les services
docker compose up -d

# Migrations + seed
docker compose exec backend php artisan migrate --seed

# Storage link
docker compose exec backend php artisan storage:link --force

# Acces
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
# DB:       localhost:3306
```

### Commandes utiles

```bash
# Logs
docker compose logs -f backend
docker compose logs -f frontend

# Shell backend
docker compose exec backend bash

# Artisan
docker compose exec backend php artisan <command>

# Arreter
docker compose down

# Arreter + supprimer les volumes
docker compose down -v
```

---

## Variables d'Environnement — Referent

### Backend (.env)

| Variable | Dev | Production |
|---|---|---|
| `APP_ENV` | `local` | `production` |
| `APP_DEBUG` | `true` | `false` |
| `APP_KEY` | genere | genere |
| `DB_HOST` | `db` (docker) / `127.0.0.1` | Railway `${{MySQL.MYSQL_HOST}}` |
| `SESSION_SECURE_COOKIE` | `false` | `true` |
| `SANCTUM_STATEFUL_DOMAINS` | `localhost:3000` | `parabenmoussa.ma` |
| `CMI_CLIENT_ID` | test | reel |
| `CMI_STORE_KEY` | test | reel |
| `SMS_DRIVER` | `log` | `twilio` |
| `SCOUT_DRIVER` | `database` | `database` (ou `meilisearch`) |

### Frontend (.env)

| Variable | Dev | Production |
|---|---|---|
| `VITE_API_URL` | `http://127.0.0.1:8000/api` | `https://api.parabenmoussa.ma/api` |
| `VITE_VAPID_PUBLIC_KEY` | vide | genere avec `pwa:generate-vapid` |

---

## Deploiement CI/CD (GitHub Actions)

Le pipeline `.github/workflows/ci.yml` tourne automatiquement sur chaque push :

- **Backend**: PHP Pint (lint) + PHPUnit (51 tests)
- **Frontend**: ESLint + Vite build

Railway deploie automatiquement quand le CI passe sur `main`.
