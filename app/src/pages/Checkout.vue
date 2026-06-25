<template>
  <div>
    <h1>Paiement</h1>

    <p>Total : {{ cart.total.toFixed(2) }} €</p>

    <button @click="handlePay" :disabled="paying">
      {{ paying ? 'Traitement...' : 'Payer' }}
    </button>

    <p v-if="errorMsg" style="color:red">{{ errorMsg }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as Sentry from '@sentry/vue'
import { useCartStore } from '../stores'

const cart = useCartStore()
const router = useRouter()
const paying = ref(false)
const errorMsg = ref('')

async function handlePay() {
  paying.value = true
  errorMsg.value = ''

  try {
    await new Promise(resolve => setTimeout(resolve, 800))

    if (Math.random() < 1 / 2) {
      throw new TypeError('Cannot read properties of undefined (reading "cardToken")')
    }

    if (window.umami) {
      window.umami.track('checkout_success', {
        cart_total: cart.total,
        revenue: cart.total,
      })
    }

    cart.clear()
    router.push('/order-confirmation')

  } catch (err) {
    Sentry.captureException(err)
    errorMsg.value = 'Paiement échoué. Réessayez.'
    paying.value = false
  }
}
</script>