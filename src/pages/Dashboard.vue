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
	<h3>Available Trades</h3>
	<h3>Requested Trades</h3>
	<h3>Approved Trades</h3>
</template>
