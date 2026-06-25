# E-Shop Monitor

Application e-commerce simulée avec une stack d'observabilité complète.

## Services

| Service | URL | Description |
|---|---|---|
| App Vue 3 | http://localhost:5173 | Site e-commerce |
| GlitchTip | http://localhost:8000 | Suivi des erreurs |
| Umami | http://localhost:3001 | Analytics |

## Lancer la stack

```bash
docker compose up -d
```

Puis lancer l'app :

```bash
cd app
npm install
npm run dev
```

## Configuration

1. Créer un compte sur GlitchTip (http://localhost:8000)
2. Créer une organisation et un projet Vue
3. Copier le DSN dans `src/main.js`
4. Créer un site sur Umami (http://localhost:3001)
5. Copier le Website ID dans `index.html`

## Tunnel d'achat suivi

| Étape |               Event Umami |
| Consulter un produit | `view_product` |
| Ajouter au panier | `add_to_cart` |
| Démarrer le paiement | `checkout_start` |
| Paiement réussi | `checkout_success` |

## Simulation de panne

Le bouton "Payer" échoue 1 fois sur 2 volontairement.
L'erreur est capturée automatiquement par GlitchTip.