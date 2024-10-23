<script setup lang="ts">
import DayShiftCard from '@/components/DayShiftCard.vue'
import NavigationMenu from '@/components/NavigationMenu.vue'

import { Trade } from '@/libs/Firebase'
import { calculateTrades } from '@/libs/Trades'
import { computed, ComputedRef } from 'vue'
import { createShift } from '@/libs/Firebase'
import { currentOrganization, user, shifts, updateShifts } from '@/libs/State'
import { Ref, ref } from 'vue'

const day: Ref<string | undefined> = ref(undefined)
const time: Ref<'day' | 'night'> = ref('day')

function create() {
	if(day.value === undefined) return
	if(!currentOrganization.value) return
	if(!user.value) return
	
	const date = new Date(day.value)
	
	createShift(currentOrganization.value, user.value.account, date, time.value)

	updateShifts()
}

const trades: ComputedRef<Trade[]> = computed(() => calculateTrades(shifts.value))

</script>

<template>
	<NavigationMenu />

	<h1>Dashboard</h1>
	<h4>Mini Calendar</h4>
	<DayShiftCard :day="new Date('October 23, 2024')" />

	<h3>Shift Manager</h3>
	<input type="date" v-model="day" />
	<br>
	<button @click="time = 'day'" :style="{ backgroundColor: time === 'day' ? 'lightblue' : undefined }">Day</button>
	<button @click="time = 'night'" :style="{ backgroundColor: time === 'night' ? 'lightblue' : undefined }">Night</button>
	<br>
	<button @click="create">Create</button>

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
