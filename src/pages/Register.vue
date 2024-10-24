<script setup lang="ts">
import Card from '@/components/Card.vue'
import BackArrow from '@/components/BackArrow.vue'

import { register } from '@/libs/Firebase'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loadUser } from '@/libs/State'

const router = useRouter()

const email = ref('')
const password = ref('')
const name = ref('')

async function onRegister() {
	await register(email.value, password.value, name.value)
	await loadUser()

	router.push('dashboard')
}
</script>

<template>
	<div class="w-full h-full flex justify-center items-center flex-col">
		<BackArrow to="/" />

		<h1 class="bold mb-8">Register</h1>

		<Card title="Login" icon="deployed_code" :bold="true">
			<p>Name</p>
			<input v-model="name" class="mb-2" placeholder="Name..." />

			<p>Email</p>
			<input v-model="email" class="mb-2" placeholder="Email..." />

			<p>Password</p>
			<input v-model="password" class="mb-4" placeholder="Pasword..." type="password" />

			<div class="flex items-center justify-between">
				<router-link to="login" class="link">Have An Account?</router-link>

				<button @click="onRegister" class="element">Register</button>
			</div>
		</Card>
	</div>
</template>
