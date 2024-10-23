<script setup lang="ts">
import { Shift } from '@/libs/Firebase'
import Card from './Card.vue';

import { shifts } from '@/libs/State'
import { computed, ComputedRef, onMounted } from 'vue'
import Icon from './Icon.vue'

const props = defineProps<{day: Date}>()

const dayShifts: ComputedRef<Shift[]> = computed(() => shifts.value.filter(shift => {
	const shiftDate = new Date((shift.day?.seconds ?? 0) * 1000)

	if(shiftDate.getDay() !== props.day.getDay()) return false
	if(shiftDate.getDate() !== props.day.getDate()) return false
	if(shiftDate.getFullYear() !== props.day.getFullYear()) return false

	return true
}))

const dayShift: ComputedRef<Shift | undefined> = computed(() => dayShifts.value.find(shift => shift.time === 'day'))
const nightShift: ComputedRef<Shift | undefined> = computed(() => dayShifts.value.find(shift => shift.time === 'night'))
</script>
<template>
<Card :title="['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day.getDay()]" icon="calendar_today" class="w-48">
	<div class="h-1" />

	<div v-if="dayShift" class="flex my-2 gap-2 p-2 rounded-[0.4rem] border-[2px] border-primary">
		<Icon icon="clear_day" class="text-primary" />
		<p>Day</p>
	</div>

	<div v-else class="flex my-2 gap-2 p-2 rounded-[0.4rem] border-[2px] border-dashed border-element-border">
		<Icon icon="clear_day" class="text-primary" />
		<p>Day</p>
	</div>

	<div v-if="nightShift" class="flex my-2 gap-2 p-2 rounded-[0.4rem] border-[2px] border-primary">
		<Icon icon="bedtime" class="text-primary" />
		<p>night</p>
	</div>

	<div v-else class="flex my-2 gap-2 p-2 rounded-[0.4rem] border-[2px] border-dashed border-element-border">
		<Icon icon="bedtime" class="text-primary" />
		<p>night</p>
	</div>
	<!-- <p>{{ shift.time }} {{ new Date((shift.day?.seconds ?? 0) * 1000) }}</p> -->
</Card>
</template>