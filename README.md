# 🌿 Eco-Hardware - E-Shop Monitor & Observabilité

Ce projet est une démonstration pratique de mise en place d'une stack d'observabilité complète, auto-hébergée et 100 % open source, intégrée à une application e-commerce simulée en **Vue 3**.

L'objectif est d'intercepter les erreurs applicatives en temps réel avec **GlitchTip** et de suivre le comportement des utilisateurs sans cookies à l'aide de l'outil d'analytics **Umami**.

---

## 🚀 Services de la Stack

| Service                    | URL locale                                     | Description                                           |
| :------------------------- | :--------------------------------------------- | :---------------------------------------------------- |
| **Application Web (Prod)** | [http://localhost](http://localhost)           | Boutique en ligne servie par Caddy                    |
| **GlitchTip Dashboard**    | [http://localhost:8000](http://localhost:8000) | Console de centralisation des exceptions              |
| **Umami Dashboard**        | [http://localhost:3000](http://localhost:3000) | Statistiques de visite respectueuses de la vie privée |

---

## 🛠️ Guide d'installation et de configuration (Pas à pas)

Pour faire fonctionner la télémétrie, l'application doit connaître les identifiants de suivi de vos instances locales de GlitchTip et d'Umami. Suivez ces étapes pour une configuration propre :

### Étape 1 : Créer et configurer le fichier `.env`

À la racine du projet, commencez par copier le fichier d'exemple pour initialiser vos variables d'environnement :

```bash
cp .env.example .env
```

Ouvrez ensuite le fichier `.env` nouvellement créé. Vous devez y définir les mots de passe et générer des clés secrètes applicatives.

#### 💡 Comment générer des clés secrètes robustes ?

Vous pouvez générer des chaînes aléatoires sécurisées pour vos variables `GLITCHTIP_SECRET_KEY` et `UMAMI_APP_SECRET` à l'aide des commandes suivantes :

- **Via Bash / Terminal Git Bash :**
    ```bash
    openssl rand -hex 32
    ```
- **Via PowerShell (Windows) :**
    ```powershell
    -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
    ```

Copiez les valeurs générées dans votre fichier `.env`.

---

### Étape 2 : Lancement et initialisation de la stack

1. Démarrez tous les conteneurs à l'aide de Docker Compose :
   ```bash
   docker compose up -d
   ```
   *Note : Au premier démarrage, le conteneur éphémère `app_builder` va compiler automatiquement l'application front-end. Elle sera servie sur le port 80 dès que la compilation sera terminée. Les migrations de GlitchTip s'exécutent également de manière autonome.*

2. Créez votre compte administrateur initial pour **GlitchTip** :
   ```bash
   docker compose exec glitchtip ./manage.py createsuperuser
   ```
   *Important : Saisissez une adresse email valide avec un domaine standard contenant un point (ex: `admin@example.com`). Les domaines comme `@localhost` ou `@localhost.local` sont bloqués par les règles de validation strictes de GlitchTip.*

---

### Étape 3 : Récupération des jetons de suivi (Tracking tokens)

#### 1. Configurer GlitchTip (Erreurs & Performance)

1. Rendez-vous sur [http://localhost:8000](http://localhost:8000) et connectez-vous avec le compte administrateur créé à l'étape précédente.
2. Créez une **Organisation** (ex: `Eco-Hardware-Org`).
3. Créez un nouveau **Projet** en sélectionnant la plateforme **Vue**.
4. GlitchTip vous fournit alors une clé **DSN** (ex: `http://1133eb47cee...` ).
5. Copiez cette valeur dans la variable `VITE_GLITCHTIP_DSN` de votre fichier `.env` à la racine.

#### 2. Configurer Umami (Analytics)

1. Rendez-vous sur [http://localhost:3000](http://localhost:3000).
2. Connectez-vous avec les identifiants par défaut :
   - **Nom d'utilisateur :** `admin`
   - **Mot de passe :** `umami`
   *(Important : modifiez immédiatement ce mot de passe par défaut dans les paramètres de votre profil pour des raisons de sécurité).*
3. Allez dans les paramètres et ajoutez un **Site Web** :
    - **Nom :** `Eco-Hardware`
    - **Domaine :** `localhost`
4. Cliquez sur "Edit" puis sur "Data" pour récupérer le **Website ID** (un identifiant de type UUID).
5. Copiez cette valeur dans la variable `VITE_UMAMI_WEBSITE_ID` de votre fichier `.env`.

---

### Étape 4 : Appliquer les configurations de suivi

Une fois les variables `VITE_GLITCHTIP_DSN` et `VITE_UMAMI_WEBSITE_ID` correctement renseignées dans votre fichier `.env`, relancez le conteneur de build pour recompiler l'application avec les nouveaux jetons de suivi :

```bash
docker compose up app_builder
```

_Le conteneur va régénérer les fichiers de production dans le dossier partagé. Caddy servira automatiquement la nouvelle version mise à jour._

Votre boutique e-commerce sur [http://localhost](http://localhost) est désormais connectée à vos outils de télémétrie.

---

## 💻 Mode Développement Local (Sans Docker)

Si vous souhaitez travailler sur le code de l'application Vue 3 avec un rechargement à chaud (HMR) :

1. Entrez dans le dossier de l'application :
    ```bash
    cd app
    ```
2. Installez les dépendances requises localement :
    ```bash
    npm install
    ```
3. Créez un fichier `.env` local dans le dossier `app/` contenant vos variables de suivi (Vite a besoin de lire ces variables en local) :
    ```env
    # Contenu de app/.env
    VITE_GLITCHTIP_DSN=http://votre-dsn-glitchtip@localhost:8000/1
    VITE_UMAMI_WEBSITE_ID=votre-website-id-umami
    VITE_UMAMI_URL=http://localhost:3000
    ```
4. Lancez le serveur de développement de Vite :
    ```bash
    npm run dev
    ```
    L'application sera alors accessible localement sur [http://localhost:5173](http://localhost:5173).

---

## 📊 Tunnel de Conversion et Télémétrie

### Plan de marquage des événements (Umami)

L'application transmet automatiquement des événements clés tout au long du parcours d'achat :

- `view_product` : Consultation d'un article (propriétés transmises : `product_id`, `product_name`, `price`).
- `add_to_cart` : Ajout d'un produit au panier (propriétés : `product_id`, `product_name`, `price`).
- `checkout_start` : Clic sur le bouton de commande (propriété : `cart_total`).
- `checkout_success` : Validation de l'achat (propriétés : `cart_total`, `revenue`).

### Simulation de panne & Tracing (GlitchTip)

- **Erreur simulée :** Lors du paiement dans le composant `Checkout.vue`, une erreur de type `TypeError` survient volontairement 1 fois sur 3 afin de générer une exception visible dans GlitchTip.
- **Performance :** L'application mesure le temps de traitement de l'opération de paiement à l'aide d'un Span de performance Sentry nommé `payment.submit`.
- **Respect du RGPD :** La stack est configurée pour ne pas collecter les adresses IP (`sendDefaultPii: false`) et masque automatiquement toute saisie accidentelle d'adresses e-mail dans les messages d'erreur.

