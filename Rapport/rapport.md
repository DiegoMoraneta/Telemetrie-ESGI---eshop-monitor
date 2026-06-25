# Rapport d'Observabilité - E-Shop Monitor

Ce rapport présente l'analyse des données de télémétrie et d'analytics collectées sur notre plateforme d'e-commerce factice "Eco-Hardware" à l'aide de notre stack auto-hébergée.

---

## 1. Analyse Analytics (Umami)

### Tableau de bord général
![Dashboard Umami](image-1.png)

### Suivi des Événements Personnalisés
![Événements Umami](image-2.png)

### Suivi du Tunnel de Conversion (Funnel)

Pendant la phase de simulation et de test, nous avons enregistré les interactions suivantes :

- **Consulter un produit (`view_product`)** : 31 événements
- **Ajouter au panier (`add_to_cart`)** : 68 événements
- **Démarrer le paiement (`checkout_start`)** : 21 événements
- **Paiement validé (`checkout_success`)** : 21 événements

### Analyse des Métriques Métier

1. **Taux de Rebond (Bounce Rate)** : **13 %**
   * **Interprétation :** Un taux de rebond de 13 % sur la page d'accueil est excellent. Cela signifie que 87 % des visiteurs interagissent avec le site (clic sur un produit, navigation) après leur arrivée. Cela démontre une bonne attractivité du catalogue initial et un parcours utilisateur engageant dès la page d'accueil.

2. **Taux de Conversion Global** :
   $$\text{Taux de conversion} = \frac{\text{Nombre de checkout\_success}}{\text{Nombre de sessions uniques}} \times 100$$
   $$\text{Calcul} : \frac{21}{8} \times 100 = 262.5\%$$
   * **Analyse critique du biais :** Ce taux théorique anormalement élevé ($> 100\%$) s'explique par un biais méthodologique lors des tests : un petit nombre de testeurs (8 sessions uniques au total) ont effectué de multiples transactions (21 validations de commande) au cours de la même session. 
   * **Projection en conditions réelles :** En production, avec un trafic utilisateur standard où chaque session unique correspond généralement à un acheteur unique avec un parcours d'achat unique, le taux de conversion global devrait osciller de façon réaliste entre **2 % et 5 %** pour un site e-commerce de matériel informatique.

3. **Analyse de l'abandon (Tunnel d'achat) :**
   * Dans notre simulation, le passage de l'étape `checkout_start` à `checkout_success` est de 100 % (21/21) pour les transactions réussies.
   * On constate cependant une disproportion entre le nombre d'ajouts au panier (68) et l'initiation de commande (21), suggérant un fort taux d'abandon du panier (environ 69 % d'abandons de panier). Ce comportement est très fréquent en e-commerce et peut être optimisé en relançant les paniers abandonnés ou en simplifiant l'étape de validation du panier.

---

## 2. Analyse Technique & Télémétrie des Erreurs (GlitchTip)

### Erreur Capturée dans l'Interface
![Exception GlitchTip](image.png)

### Stack Trace Détaillée
![Stack Trace](image-3.png)

### Diagnostic de l'Erreur Simulée

* **Type de l'anomalie :** `TypeError`
* **Message de l'erreur :** `Cannot read properties of undefined (reading "cardToken")`
* **Localisation de l'erreur dans le code :** Fichier [Checkout.vue](file:///c:/Users/F%C3%A9lix%20Lhoste/Documents/DEV/%5BCOURS%5D/Telemetrie-ESGI---eshop-monitor/app/src/pages/Checkout.vue) au sein de la fonction asynchrone `handlePay`.

### Résolution Technique à partir de l'Observabilité

Grâce aux données remontées par GlitchTip, le développeur dispose de toutes les clés pour corriger rapidement le bug sans avoir à deviner la cause :

1. **La Stack Trace :** Elle isole la ligne exacte de code ayant levé l'exception. Ici, le code tente d'accéder à la propriété `cardToken` sur un objet qui est indéfini (`undefined`). Cela indique une absence de vérification de la présence de l'objet de données de paiement avant son utilisation.
2. **Les Breadcrumbs (Fils d'Ariane) :** L'historique d'activité de l'utilisateur montre qu'il a cliqué sur le bouton de soumission du formulaire de paiement juste avant le crash.
3. **Le Contexte Environnemental :** Les métadonnées de GlitchTip (OS, version du navigateur, appareil) permettent de valider s'il s'agit d'un bug spécifique à un navigateur (ex: Safari mobile) ou d'un bug général de logique applicative.
4. **Action corrective :** Pour résoudre ce bug, le développeur doit s'assurer que l'objet contenant les informations de paiement est correctement initialisé et valider sa présence via un garde JavaScript :
   ```javascript
   // Exemple de correction
   if (!paymentData || !paymentData.cardToken) {
     throw new Error("Les informations de paiement sont incomplètes ou invalides.");
   }
   ```
