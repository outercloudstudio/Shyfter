<script setup lang="ts">
import NavigationMenu from '@/components/NavigationMenu.vue'
import { Trade } from '@/libs/Firebase'

import { shifts } from '@/libs/State';
import { calculateTrades } from '@/libs/Trades'
import { computed, ComputedRef } from 'vue'

const trades: ComputedRef<Trade[]> = computed(() => calculateTrades(shifts.value))
</script>

<template>
	<NavigationMenu />

	<h1>Dashboard</h1>
	<h4>Mini Calendar</h4>
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
