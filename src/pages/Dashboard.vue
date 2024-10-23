<script setup lang="ts">
import DayShiftCard from '@/components/DayShiftCard.vue'
import NavigationMenu from '@/components/NavigationMenu.vue'

import { Trade } from '@/libs/Firebase'
import { calculateTrades } from '@/libs/Trades'
import { computed, ComputedRef } from 'vue'
import { currentOrganization, user, shifts, updateShifts } from '@/libs/State'
import { Ref, ref } from 'vue'
import { createShift, deleteShift } from '@/libs/Firebase'

// Shift Manager
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

function formatShift(shift: any) {
  const date = new Date((shift.day?.seconds ?? 0) * 1000)
  
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
  
  return `${date.toLocaleDateString('en-US', { weekday: 'long' })} ${shift.time === 'day' ? 'Day' : 'Night'} Shift, ${formattedDate}`
}

async function remove(shift: any) {
	try {
    	await deleteShift(shift)
    	updateShifts()
  	} catch (error) {
    console.error("Error removing shift: ", error)
  }
}

const trades: ComputedRef<Trade[]> = computed(() => calculateTrades(shifts.value))
</script>

<template>
	<NavigationMenu />

	<h1>Dashboard</h1>
	<h4>Mini Calendar</h4>
	<DayShiftCard :day="new Date('October 23, 2024')" />

	<h4>Shift Manager</h4>
	<input type="date" v-model="day" />
	<br>
	<button @click="time = 'day'" :style="{ backgroundColor: time === 'day' ? 'lightblue' : undefined }">Day</button>
	<button @click="time = 'night'" :style="{ backgroundColor: time === 'night' ? 'lightblue' : undefined }">Night</button>
	<br>
	<button @click="create">Create</button>

	<div v-for="shift in shifts">
		<p>{{ formatShift(shift) }}</p>
		<button @click="remove(shift)">Delete</button>
	</div>

	<h4>Available Trades</h4>
	<div v-for="trade in trades">
		<p>{{ trade.shift }}</p>
		<p>{{ trade.from }}</p>
	</div>

	<!-- <h4>Requested Trades</h4>
	<h4>Approved Trades</h4> -->
</template>
