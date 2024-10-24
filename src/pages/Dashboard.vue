<script setup lang="ts">
import NavigationMenu from '@/components/NavigationMenu.vue'
import DashboardCalendar from '@/components/DashboardCalendar.vue'
import Trades from '@/components/Trades.vue'
import { onMounted } from 'vue'
import { loggedIn } from '@/libs/Firebase'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
	if (!loggedIn) router.push('/')
})
</script>

<template>
	<!-- <NavigationMenu /> -->

	<div class="w-full h-full p-[4rem]">
		<h1 class="bold mb-8">Dashboard</h1>

		<DashboardCalendar class="mb-8" />

		<Trades />
	</div>
</template>
