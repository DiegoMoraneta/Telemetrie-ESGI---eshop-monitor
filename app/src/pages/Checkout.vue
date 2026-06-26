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

		await Sentry.startSpan({ name: "submit-payment-checkout", op: "payment.submit" }, async () => {
			try {
				// Simule un délai réseau pour l'appel de l'API de paiement
				await new Promise((resolve) => setTimeout(resolve, 800));

				// Simule une panne réaliste (1 fois sur 3)
				if (Math.random() < 1 / 3) {
					throw new TypeError('Cannot read properties of undefined (reading "cardToken")');
				}

				// Tracking des événements personnalisés avec Umami
				if (window.umami) {
					window.umami.track("checkout_success", { cart_total: cart.total, revenue: cart.total });
				}

				// Vider le panier et rediriger vers la confirmation de commande
				cart.clear();
				router.push("/order-confirmation");
			} catch (err) {
				// Capture de l'exception avec toutes ses métadonnées dans GlitchTip
				Sentry.captureException(err);
				errorMsg.value = "Paiement échoué. Réessayez.";
				paying.value = false;

				// Propager l'erreur pour marquer le Span Sentry comme échoué (erreur)
				throw err;
			}
		}).catch(() => {
			// Catch l'erreur pour éviter que le rejet non géré ne plante l'application
			// L'erreur elle est déjà capturée par Sentry en interne
		});
	}
</script>
