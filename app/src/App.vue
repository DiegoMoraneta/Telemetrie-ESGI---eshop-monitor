<template>
  <div>
    <nav class="navbar">
      <RouterLink to="/" class="brand">🌿 Eco-Hardware</RouterLink>
      <div class="nav-links">
        <RouterLink to="/products">Produits</RouterLink>
        <RouterLink to="/cart" class="cart-link">
          🛒 Panier
          <span v-if="cart.count > 0" class="badge">{{ cart.count }}</span>
        </RouterLink>
      </div>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useCartStore } from './stores'

const cart = useCartStore()
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: #f8f9fa;
  color: #1a1a2e;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #1a1a2e;
  color: white;
  position: sticky;
  top: 0;
}

.brand { font-size: 1.25rem; font-weight: 700; color: #4ade80; text-decoration: none; }
.nav-links { display: flex; gap: 1.5rem; align-items: center; }
.nav-links a { color: #e2e8f0; text-decoration: none; }
.nav-links a:hover { color: #4ade80; }

.cart-link { position: relative; }
.badge {
  background: #ef4444;
  color: white;
  border-radius: 999px;
  padding: 1px 6px;
  font-size: 0.7rem;
  position: absolute;
  top: -8px;
  right: -12px;
}

main { max-width: 1100px; margin: 0 auto; padding: 2rem 1rem; }

.btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: opacity 0.2s;
}
.btn:hover { opacity: 0.85; }
.btn-primary { background: #4ade80; color: #1a1a2e; }
.btn-danger  { background: #ef4444; color: white; }
</style>