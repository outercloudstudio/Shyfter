<script setup lang="ts">
import Card from './Card.vue'
import Icon from './Icon.vue'

import { createShift, Day, getDayUniqueId, Shift, ShiftState } from '@/libs/Firebase'
import { currentOrganization, user, shifts, updateShifts } from '@/libs/State'
import { computed, ComputedRef } from 'vue'

const props = defineProps<{ day: Date }>()

const dayKey = getDayUniqueId({
	day: props.day.getDate(),
	month: props.day.getMonth(),
	year: props.day.getFullYear(),
})

const dayShifts: ComputedRef<Shift[]> = computed(() =>
	shifts.value.filter(shift => {
		const shiftDayKey = getDayUniqueId(shift.day)

		if (dayKey !== shiftDayKey) return false

		return true
	})
)

const dayShift: ComputedRef<Shift | undefined> = computed(() =>
	dayShifts.value.find(shift => shift.time === 'day')
)
const nightShift: ComputedRef<Shift | undefined> = computed(() =>
	dayShifts.value.find(shift => shift.time === 'night')
)

function create(day: Day, time: 'day' | 'night', state: ShiftState) {
	if (!currentOrganization.value) return
	if (!user.value) return

	createShift(currentOrganization.value, user.value.account, day, time, state)

	updateShifts()
}
</script>
<template>
	<Card
		:title="
			['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day.getDay()]
		"
		icon="calendar_today"
	>
		<div class="h-1" />

		<div
			class="flex my-2 justify-between p-2 rounded-[0.4rem] border-[2px]"
			:class="{
				'bg-primary': dayShift,
				'text-element': dayShift,
				'border-transparent': dayShift,
				'text-primary': !dayShift,
				'border-dashed': !dayShift,
				'border-element-border': !dayShift,
			}"
		>
			<div class="flex items-center gap-2">
				<Icon icon="clear_day" class="text-inherit" />

				<p class="text-inherit">Day</p>
			</div>

			<div v-if="dayShift" class="flex items-center">
				<Icon icon="download" class="text-inherit" />
				<Icon icon="delete" class="text-inherit" />
			</div>

			<div v-else class="flex items-center">
				<Icon icon="add" class="text-inherit" />
			</div>
		</div>

		<div
			class="flex my-2 justify-between p-2 rounded-[0.4rem] border-[2px]"
			:class="{
				'bg-primary': nightShift,
				'text-element': nightShift,
				'border-transparent': nightShift,
				'text-primary': !nightShift,
				'border-dashed': !nightShift,
				'border-element-border': !nightShift,
			}"
		>
			<div class="flex items-center gap-2">
				<Icon icon="bedtime" class="text-inherit" />

				<p class="text-inherit">Night</p>
			</div>

			<div v-if="nightShift" class="flex items-center">
				<Icon icon="download" class="text-inherit" />
				<Icon icon="delete" class="text-inherit" />
			</div>

			<div v-else class="flex items-center">
				<Icon icon="add" class="text-inherit" />
			</div>
		</div>
		<!-- <p>{{ shift.time }} {{ new Date((shift.day?.seconds ?? 0) * 1000) }}</p> -->
	</Card>
</template>
