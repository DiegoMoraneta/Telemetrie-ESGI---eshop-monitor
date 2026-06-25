# E-Shop Monitor - Observabilité & Télémétrie

Application e-commerce Vue 3 simulée avec une infrastructure d'observabilité complète 100 % open source et auto-hébergée (GlitchTip et Umami).

---

## Services & URLs de la Stack

| Service | URL / Port | Description |
| :--- | :--- | :--- |
| **App Web (Production)** | `http://localhost:80` | Site e-commerce servi par Caddy |
| **GlitchTip** | `http://localhost:8000` | Suivi et centralisation des exceptions |
| **Umami** | `http://localhost:3001` | Dashboard analytique (privacy-focused) |

---

## Démarrage Rapide (Production - Une seule commande)

La stack utilise un build multi-stage éphémère directement orchestré par Docker Compose pour compiler l'application et la servir sous Caddy, sans nécessiter de configuration manuelle sur l'hôte.

1. **Préparer l'environnement :**
   Copiez le fichier d'exemple et configurez vos secrets si nécessaire :
   ```bash
   cp .env.example .env
   ```

2. **Lancer toute la stack :**
   ```bash
   docker compose up --build -d
   ```
   *Note : Le conteneur `app_builder` se lancera pour installer les dépendances et compiler l'application, puis s'arrêtera proprement. Caddy (`app_server`) prendra le relais automatiquement sur le port `80` dès que la compilation sera achevée.*

---

## Configuration Initiale de la Télémétrie

Pour que la télémétrie soit active, vous devez configurer vos identifiants après le premier lancement :

1. **GlitchTip (Suivi des erreurs) :**
   - Allez sur `http://localhost:8000` et créez votre compte/organisation.
   - Créez un projet de type **Vue**.
   - Récupérez la clé **DSN** et collez-la dans la variable `VITE_GLITCHTIP_DSN` de votre fichier `.env`.

2. **Umami (Analytics) :**
   - Allez sur `http://localhost:3001` (identifiants par défaut : `admin` / `umami`).
   - Ajoutez un site web nommé `Eco-Hardware` avec le domaine `localhost`.
   - Récupérez le **Website ID** (UUID) de tracking et collez-le dans la variable `VITE_UMAMI_WEBSITE_ID` de votre `.env`.

3. **Re-compiler la stack production :**
   Une fois le `.env` mis à jour, relancez le build pour injecter les variables de tracking :
   ```bash
   docker compose up --build -d app_builder app_server
   ```

---

## Mode Développement Local (Sans Docker)

Pour tester ou modifier l'application Vue en temps réel avec un rechargement à chaud (HMR) :

1. Allez dans le répertoire de l'application :
   ```bash
   cd app
   ```
2. Installez les dépendances localement :
   ```bash
   npm install
   ```
3. Créez un fichier `.env` local dans `app/` en copiant les configurations du `.env` de la racine (Vite requiert les variables préfixées par `VITE_` pour être lues localement) :
   ```bash
   # Créez le fichier app/.env avec :
   VITE_GLITCHTIP_DSN=http://votre-dsn@localhost:8000/1
   VITE_UMAMI_WEBSITE_ID=votre-website-id
   VITE_UMAMI_URL=http://localhost:3001
   ```
4. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:5173`.

---

## Tunnel de Conversion & Marquage Umami

Le tunnel d'achat de l'application est instrumenté pour envoyer des événements personnalisés à Umami :

1. **view_product** : Consultation d'une fiche produit (propriétés : `product_id`, `product_name`, `price`).
2. **add_to_cart** : Ajout d'un produit au panier (propriétés : `product_id`, `product_name`, `price`).
3. **checkout_start** : Clic sur le bouton "Passer la commande" (propriété : `cart_total`).
4. **checkout_success** : Validation réussie du paiement (propriétés : `cart_total`, `revenue`).

---

## Simulation de Panne & Performance

- **Simulation de panne :** Le bouton "Payer" sur la page de paiement échoue de manière réaliste 1 fois sur 3 en simulant une exception `TypeError: Cannot read properties of undefined (reading "cardToken")`. L'erreur est immédiatement remontée dans GlitchTip.
- **Performance :** L'application est configurée pour remonter le temps de chargement et le rendu des composants à GlitchTip. De plus, le processus de paiement est tracé spécifiquement avec un Span Sentry (`payment.submit`) pour en mesurer la latence.
- **RGPD :** Les données à caractère personnel (IP, emails, etc.) sont automatiquement expurgées (`sendDefaultPii: false`) avant d'être expédiées à GlitchTip.