<script setup lang="ts">
import Card from '@/components/Card.vue'
import BackArrow from '@/components/BackArrow.vue'

import { register, login } from '@/libs/Firebase'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')

async function onRegister() {
    await register(email.value, password.value)

    router.push('dashboard')
}
</script>

<template>
    <div class="w-full h-full flex justify-center items-center flex-col">
        <BackArrow to="/" />

		<h1 class="bold mb-8">Register</h1>

		<Card title="Login" icon="deployed_code" :bold="true" >
			<p>Email</p>
			<input v-model="email" class="mb-2" placeholder="Email..."/>

			<p>Password</p>
			<input v-model="password" class="mb-4" placeholder="Pasword..." type="password"/>
			
			<div class="flex items-center justify-between">
				<router-link to="login" class="link">Have An Account?</router-link>
				
				<button @click="onRegister" class="element">Register</button>
			</div>
		</Card>
	</div>
</template>