# 🚀 Guide de Déploiement en Production — Parapharmacie Ben Moussa

Ce guide détaille les étapes nécessaires pour déployer le projet en production en toute sécurité.

---

## 1. 🔑 Sécurité & Variables d'Environnement Backend (`backend/.env`)

Assurez-vous de configurer les variables suivantes dans le fichier `.env` du backend en production :

```ini
APP_NAME="Para Ben Moussa"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://parabenmoussa.ma
FRONTEND_URL=https://parabenmoussa.ma

# ⚠️ Générer une clé unique pour la production
# Exécuter : php artisan key:generate

# ⚠️ Mot de passe initial pour l'administrateur lors du seed
ADMIN_INITIAL_PASSWORD=VoteMotDePasseTresSecurise2026!

# Configuration Base de données
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=votre_db_prod
DB_USERNAME=votre_user_prod
DB_PASSWORD=votre_password_prod

# Clés de paiement CMI (Fournies par votre banque / CMI)
CMI_CLIENT_ID=votre_client_id_cmi
CMI_STORE_KEY=votre_store_key_cmi
```

---

## 2. 📂 Lien Symbolique du Stockage (`storage:link`)

Pour que les images des produits et les ordonnances téléchargées soient accessibles via le web :

```bash
cd backend
php artisan storage:link
```

*Note : Vérifiez que le dossier `public/storage` pointe vers `storage/app/public`.*

---

## 3. ⚙️ Gestion des Files d'Attente (Queue Worker)

Le projet utilise des files d'attente pour envoyer les emails et les SMS/Notifications sans ralentir l'expérience utilisateur (`QUEUE_CONNECTION=database`).

### Option A : Avec Supervisor (Recommandé sur VPS / Serveur Dédié)

Créez le fichier de configuration `/etc/supervisor/conf.d/pharmacie-worker.conf` :

```ini
[program:pharmacie-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/html/backend/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/html/backend/storage/logs/worker.log
stopwaitsecs=3600
```

Ensuite, rechargez Supervisor :

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start pharmacie-worker:*
```

### Option B : Avec Cron (Si le serveur n'autorise pas les processus dæmon)

Ajoutez cette ligne dans la `crontab` de votre serveur (`crontab -e`) :

```cron
* * * * * cd /var/www/html/backend && php artisan schedule:run >> /dev/null 2>&1
```

---

## 4. 📲 Notifications Push (PWA / VAPID) & Meilisearch

### A. Génération des clés VAPID pour les notifications PWA

1. Exécutez la commande d'auto-génération dans le backend :
   ```bash
   php artisan pwa:generate-vapid
   ```
2. Copiez la clé publique `VAPID_PUBLIC_KEY` générée dans le fichier `frontend/.env` :
   ```ini
   VITE_VAPID_PUBLIC_KEY=votre_cle_publique_vapid
   ```

### B. Recherche Optimisée (Meilisearch)

Par défaut, le projet utilise `SCOUT_DRIVER=database`. Pour activer Meilisearch en production :
1. Installez et démarrez Meilisearch.
2. Mettez à jour `backend/.env` :
   ```ini
   SCOUT_DRIVER=meilisearch
   MEILISEARCH_HOST=http://127.0.0.1:7700
   MEILISEARCH_KEY=votre_cle_meilisearch
   ```
3. Importez l'index :
   ```bash
   php artisan scout:import "App\Models\Product"
   ```

---

## 5. 🌐 Variables d'Environnement Frontend (`frontend/.env`)

Créez le fichier `frontend/.env` pour la production avant la compilation :

```ini
VITE_API_URL=https://parabenmoussa.ma/api
VITE_VAPID_PUBLIC_KEY=votre_cle_publique_vapid
```

Puis compilez le frontend :

```bash
cd frontend
npm run build
```

Les fichiers compilés dans `frontend/dist` sont prêts à être servis par Nginx ou Apache.
