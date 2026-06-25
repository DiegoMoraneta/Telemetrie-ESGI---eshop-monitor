<template>
  <div v-if="product">
    <RouterLink to="/products">← Retour</RouterLink>
    <h1>{{ product.name }}</h1>
    <p>{{ product.description }}</p>
    <p>{{ product.price }} €</p>
    <button @click="handleAddToCart">Ajouter au panier</button>
    <p v-if="added">✅ Ajouté !</p>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useCartStore } from '../stores'

const route = useRoute()
const cart = useCartStore()
const added = ref(false)

const products = [
  { id: 1, name: 'Clavier Mécanique', price: 49.99, image: '⌨️', category: 'Périphériques', description: 'Clavier reconditionné.' },
  { id: 2, name: 'Écran 24"', price: 129.99, image: '🖥️', category: 'Écrans', description: 'Dalle IPS Full HD.' },
  { id: 3, name: 'Souris Ergonomique', price: 29.99, image: '🖱️', category: 'Périphériques', description: 'Souris verticale.' },
  { id: 4, name: 'Laptop Thinkpad X1', price: 549.99, image: '💻', category: 'Ordinateurs', description: 'Intel Core i5, 16 Go RAM.' },
]

const product = computed(() =>
  products.find(p => p.id === Number(route.params.id))
)

onMounted(() => {
  if (product.value && window.umami) {
    window.umami.track('view_product', {
      product_id: product.value.id,
      product_name: product.value.name,
      price: product.value.price,
    })
  }
})

function handleAddToCart() {
  cart.addItem(product.value)

  if (window.umami) {
    window.umami.track('add_to_cart', {
      product_id: product.value.id,
      product_name: product.value.name,
      price: product.value.price,
    })
  }

  added.value = true
  setTimeout(() => (added.value = false), 2000)
}
</script>