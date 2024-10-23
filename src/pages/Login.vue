<script setup lang="ts">
import Card from '@/components/Card.vue'
import { login } from '@/libs/Firebase'
import { loadUser } from '@/libs/State'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')

async function onLogin() {
	await login(email.value, password.value)
	await loadUser()

	router.push('dashboard')
}
</script>

<template>
	<div class="w-full h-full flex justify-center items-center flex-col">
		<h1 class="bold mb-8">Login</h1>

		<Card title="Login" icon="deployed_code" :bold="true" >
			<p>Email</p>
			<input v-model="email" class="mb-2" placeholder="Email..."/>

			<p>Password</p>
			<input v-model="password" class="mb-4" placeholder="Pasword..." type="password"/>
			
			<div class="flex items-center justify-between">
				<router-link to="register" class="link">Need An Account?</router-link>
				
				<button @click="onLogin" class="element">Login</button>
			</div>
		</Card>
	</div>
</template>
