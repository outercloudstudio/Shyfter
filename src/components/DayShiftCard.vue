<script setup lang="ts">
import { Shift } from '@/libs/Firebase'
import Card from './Card.vue';

import { shifts } from '@/libs/State'
import { computed, ComputedRef, onMounted } from 'vue'

const props = defineProps<{day: Date}>()

const dayShifts: ComputedRef<Shift[]> = computed(() => shifts.value.filter(shift => {
	const shiftDate = new Date((shift.day?.seconds ?? 0) * 1000)

	if(shiftDate.getDay() !== props.day.getDay()) return false
	if(shiftDate.getDate() !== props.day.getDate()) return false
	if(shiftDate.getFullYear() !== props.day.getFullYear()) return false

	return true
}))
</script>
<template>
<Card :title="['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day.getDay()]" icon="calendar_today" class="w-48 h-48">
	<!-- <p>{{ shift.time }} {{ new Date((shift.day?.seconds ?? 0) * 1000) }}</p> -->
</Card>
</template>