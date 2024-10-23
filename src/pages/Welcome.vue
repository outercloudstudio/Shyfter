<script setup lang="ts">
import { loginWithSavedAccount } from '@/libs/Firebase'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// onMounted(async () => {
// 	await loginWithSavedAccount()

// 	router.push('dashboard')
// })
</script>

<template>
	<h1><span class="bold">Shyft</span> is a purpose built tool</h1>
	<h1>for trading shifts</h1>
	<button @click="router.push('login')">Login</button>
</template>
