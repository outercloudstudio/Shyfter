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
	<div class="w-full h-full p-[10rem]">
		<h1><span class="bold">Shyft</span> is a purpose built tool</h1>

		<h1>for trading shifts</h1>
		
		<p class="text-secondary">Let's help you design your time.<br> Track, Approve, and Request shift trades.</p>

		<div class="h-12" />

		<div class="flex gap-4">
			<button @click="router.push('login')" class="text-primary bold">Start Trading</button>
			
			<button >Learn More</button>
		</div>
	</div>
</template>
