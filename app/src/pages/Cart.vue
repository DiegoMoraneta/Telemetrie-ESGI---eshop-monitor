<template>
	<div>
		<h1>Mon panier</h1>

		<p v-if="cart.items.length === 0">Panier vide.</p>

		<div v-else>
			<div v-for="item in cart.items" :key="item.id">
				<p>
					{{ item.name }} - {{ item.price }} € × {{ item.qty }}
					<button @click="cart.removeItem(item.id)">Supprimer</button>
				</p>
			</div>
			<p>Total : {{ cart.total.toFixed(2) }} €</p>
			<button @click="handleCheckout">Passer la commande</button>
		</div>
	</div>
</template>

<script setup>
	import { useRouter } from "vue-router";
	import { useCartStore } from "../stores";

	const cart = useCartStore();
	const router = useRouter();

	function handleCheckout() {
		if (window.umami) {
			window.umami.track("checkout_start", { cart_total: cart.total });
		}
		router.push("/checkout");
	}
</script>
