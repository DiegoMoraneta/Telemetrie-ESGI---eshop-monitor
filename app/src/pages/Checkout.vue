<template>
	<div>
		<h1>Paiement</h1>

		<p>Total : {{ cart.total.toFixed(2) }} €</p>

		<button @click="handlePay" :disabled="paying">
			{{ paying ? "Traitement..." : "Payer" }}
		</button>

		<p v-if="errorMsg" style="color: red">{{ errorMsg }}</p>
	</div>
</template>

<script setup>
	import { ref } from "vue";
	import { useRouter } from "vue-router";
	import * as Sentry from "@sentry/vue";
	import { useCartStore } from "../stores";

	const cart = useCartStore();
	const router = useRouter();
	const paying = ref(false);
	const errorMsg = ref("");

	async function handlePay() {
		paying.value = true;
		errorMsg.value = "";

		try {
			// Simule un délai réseau pour l'appel de l'API de paiement
			await new Promise((resolve) => setTimeout(resolve, 800));

			// Simule une panne réaliste (1 fois sur 3)
			if (Math.random() < 1 / 3) {
				throw new TypeError('Cannot read properties of undefined (reading "cardToken")');
			}

			// Tracking des événements personnalisés avec Umami si présent
			if (window.umami) {
				window.umami.track("checkout_success", { cart_total: cart.total, revenue: cart.total });
			}

			// Vider le panier et rediriger vers la confirmation de commande
			cart.clear(); router.push("/order-confirmation");
		} catch (err) {

			// Capture de l'exception avec toutes ses métadonnées dans GlitchTip
			Sentry.captureException(err);

			// Arrêt de l'indicateur de chargement et affichage du message d'erreur.
			paying.value = false; errorMsg.value = "Paiement échoué. Réessayez.";
		}
	}
</script>
