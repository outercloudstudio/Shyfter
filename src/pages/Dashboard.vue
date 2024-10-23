<script setup lang="ts">
import NavigationMenu from '@/components/NavigationMenu.vue'
import { Ref, ref } from 'vue'
import { currentOrganization, user, shifts, updateShifts } from '@/libs/State'
import { createShift } from '@libs/Firebase'

// functionality to add shifts
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
</script>

<template>
	<NavigationMenu />

	<h1>Dashboard</h1>
	<h3>Mini Calendar</h3>
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
	<h3>Available Trades</h3>
	<h3>Requested Trades</h3>
	<h3>Approved Trades</h3>
</template>
