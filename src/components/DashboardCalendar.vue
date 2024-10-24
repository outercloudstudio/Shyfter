<script setup lang="ts">
import DayShiftCard from '@/components/DayShiftCard.vue'

import { currentOrganization, user, shifts, updateShifts } from '@/libs/State'
import { computed, ComputedRef, Ref, ref } from 'vue'
import { createShift, Day, deleteShift, getDayUniqueId, ShiftState } from '@/libs/Firebase'
import Icon from './Icon.vue'

const timelineStartDate: Ref<Date> = ref(new Date())
const timelineDates: ComputedRef<Date[]> = computed(() => {
	let dates: Date[] = []

	for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
		const date = new Date(timelineStartDate.value.getTime())
		date.setDate(date.getDate() + dayOffset)

		dates.push(date)
	}

	return dates
})

function moveTimelineForward() {
	timelineStartDate.value.setDate(timelineStartDate.value.getDate() + 1)
	timelineStartDate.value = new Date(timelineStartDate.value.getTime())
}

function moveTimelineBackward() {
	timelineStartDate.value.setDate(timelineStartDate.value.getDate() - 1)
	timelineStartDate.value = new Date(timelineStartDate.value.getTime())
}

// function formatShift(shift: any) {
// 	const date = new Date((shift.day?.seconds ?? 0) * 1000)

// 	const formattedDate = new Intl.DateTimeFormat('en-US', {
// 		weekday: 'long',
// 		year: '2-digit',
// 		month: '2-digit',
// 		day: '2-digit',
// 	}).format(date)

// 	return `${shift.time === 'day' ? 'Day' : 'Night'} Shift, ${formattedDate}`
// }

// async function remove(shift: any) {
// 	try {
// 		await deleteShift(shift)
// 		updateShifts()
// 	} catch (error) {
// 		console.error('Error removing shift: ', error)
// 	}
// }
</script>

<template>
	<div class="w-full">
		<h4 class="mb-1">Calendar</h4>

		<div class="flex gap-2 w-full">
			<button class="element" @click="moveTimelineBackward">
				<Icon icon="chevron_left" />
			</button>

			<div class="flex flex-wrap gap-2 grow">
				<DayShiftCard
					v-for="date of timelineDates"
					:day="date"
					:key="
						getDayUniqueId({ day: date.getDate(), month: date.getMonth(), year: date.getFullYear() })
					"
					class="basis-48 grow"
				/>
			</div>

			<button class="element" @click="moveTimelineForward">
				<Icon icon="chevron_right" />
			</button>
		</div>
	</div>
</template>
