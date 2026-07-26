# 🏥 Para Ben Moussa — Parapharmacie e-commerce

Site e-commerce parapharmacie complet basé sur **Laravel (API)** + **React (frontend)**.

## 🚀 Stack Technique
- **Backend**: Laravel 11 + Sanctum (API REST)
- **Frontend**: React 18 + Vite + React Router v6
- **Base de données**: MySQL (ou SQLite pour dev)

---

## ⚙️ Installation

### Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve  # port 8000
```

### Frontend (React)
```bash
cd frontend
npm install
npm run dev  # port 3000
```

---

## 🔐 Sécurité — Ce qui a été renforcé

### Backend
- **Rate limiting** sur login : max 5 tentatives par email/IP, blocage 5 min
- **Password fort** : min 8 caractères, 1 majuscule, 1 chiffre (frontend + backend)
- **Sanitisation** des inputs : `strip_tags()`, validation regex
- **Security headers** : X-Content-Type-Options, X-Frame-Options, XSS-Protection, Referrer-Policy
- **CORS strict** : origines whitlistées via variable d'env `FRONTEND_URL`
- **Token révocation** : connexion révoque les anciens tokens; changement mot de passe révoque toutes les sessions
- **Email normalisé** en lowercase avant stockage

### Frontend
- **Axios interceptor** : 401 = déconnexion automatique + nettoyage token
- **Admin login séparé** : UI dédiée pour l'accès administrateur
- **Password validation** côté client avant envoi
- **Route guards** : `PrivateRoute` (client) + `AdminRoute` (admin)

---

## 👥 Comptes

### Créer un admin via artisan:
```bash
cd backend
php artisan tinker
User::create(['name'=>'Admin','email'=>'admin@parabenmoussa.ma','password'=>Hash::make('MotDePasse123'),'role'=>'admin']);
```

### Accès admin:
```
URL: http://localhost:3000/login?redirect=admin
Email: admin@parabenmoussa.ma
```

---

## 🛒 Fonctionnalités

| Fonctionnalité | Statut |
|---|---|
| Catalogue produits (liste, détail, recherche) | ✅ |
| Panier & checkout | ✅ |
| Inscription / Connexion client | ✅ |
| Espace client (profil, commandes, adresses) | ✅ |
| Admin Dashboard (stats, KPIs) | ✅ |
| Gestion produits / catégories / marques | ✅ |
| Gestion commandes | ✅ |
| Gestion stocks | ✅ |
| Gestion promotions & bannières | ✅ |
| Gestion clients & personnel | ✅ |
| Avis clients | ✅ |

---

## 🎨 Design
Inspiré de paranewera.com — palette verte naturelle, typographie Outfit + Inter, UX parapharmacie.

