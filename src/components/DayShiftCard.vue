<script setup lang="ts">
import { getDayUniqueId, Shift } from '@/libs/Firebase'
import Card from './Card.vue'

import { shifts } from '@/libs/State'
import { computed, ComputedRef, toRaw } from 'vue'
import Icon from './Icon.vue'

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
</script>
<template>
	<Card
		:title="
			['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day.getDay()]
		"
		icon="calendar_today"
		class="w-48"
	>
		<div class="h-1" />

		<div v-if="dayShift" class="flex my-2 gap-2 p-2 rounded-[0.4rem] border-[2px] border-primary">
			<Icon icon="clear_day" class="text-primary" />
			<p>Day</p>
		</div>

		<div
			v-else
			class="flex my-2 gap-2 p-2 rounded-[0.4rem] border-[2px] border-dashed border-element-border"
		>
			<Icon icon="clear_day" class="text-primary" />
			<p>Day</p>
		</div>

		<div v-if="nightShift" class="flex my-2 gap-2 p-2 rounded-[0.4rem] border-[2px] border-primary">
			<Icon icon="bedtime" class="text-primary" />
			<p>Night</p>
		</div>

		<div
			v-else
			class="flex my-2 gap-2 p-2 rounded-[0.4rem] border-[2px] border-dashed border-element-border"
		>
			<Icon icon="bedtime" class="text-primary" />
			<p>Night</p>
		</div>
		<!-- <p>{{ shift.time }} {{ new Date((shift.day?.seconds ?? 0) * 1000) }}</p> -->
	</Card>
</template>
