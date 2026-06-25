<template>
  <div>
    <h1>Nos produits</h1>
    <div v-for="p in products" :key="p.id">
      <RouterLink :to="`/products/${p.id}`">{{ p.name }} - {{ p.price }} €</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const products = [
  { id: 1, name: 'Clavier Mécanique', price: 49.99, image: '⌨️', category: 'Périphériques', description: 'Clavier reconditionné.' },
  { id: 2, name: 'Écran 24"', price: 129.99, image: '🖥️', category: 'Écrans', description: 'Dalle IPS Full HD.' },
  { id: 3, name: 'Souris Ergonomique', price: 29.99, image: '🖱️', category: 'Périphériques', description: 'Souris verticale.' },
  { id: 4, name: 'Laptop Thinkpad X1', price: 549.99, image: '💻', category: 'Ordinateurs', description: 'Intel Core i5, 16 Go RAM.' },
]
</script>