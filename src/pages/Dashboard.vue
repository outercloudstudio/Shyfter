<script setup lang="ts">
import NavigationMenu from '@/components/NavigationMenu.vue'

import { shifts } from '@/libs/State';
</script>

<template>
	<NavigationMenu />

	<h1>Dashboard</h1>
	<h3>Mini Calendar</h3>
	<div v-for="shift in shifts">
		<p>{{ shift.time }} {{ new Date((shift.day?.seconds ?? 0) * 1000) }}</p>
	</div>

	<h4>Available Trades</h4>
	<div v-for="trade in trades">
		<p>{{ trade.shift }}</p>
		<p>{{ trade.from }}</p>
	</div>
	<!-- <h4>Requested Trades</h4>
	<h4>Approved Trades</h4> -->
</template>
