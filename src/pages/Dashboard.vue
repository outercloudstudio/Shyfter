<script setup lang="ts">
import NavigationMenu from '@/components/NavigationMenu.vue'
import DashboardCalendar from '@/components/DashboardCalendar.vue'
import Trades from '@/components/Trades.vue'
</script>

<template>
	<!-- <NavigationMenu /> -->

	<div class="w-full h-full p-[10rem]">
		<h1 class="bold mb-8">Dashboard</h1>

		<DashboardCalendar class="mb-4" />

		<Trades />
	</div>
</template>
