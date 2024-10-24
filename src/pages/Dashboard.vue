<script setup lang="ts">
import NavigationMenu from '@/components/NavigationMenu.vue'
import DashboardCalendar from '@/components/DashboardCalendar.vue'
import Trades from '@/components/Trades.vue'
</script>

<template>
	<NavigationMenu />

	<h1>Dashboard</h1>

	<DashboardCalendar />

	<Trades />
</template>
