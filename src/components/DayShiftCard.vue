<script setup lang="ts">
import Card from './Card.vue'
import Icon from './Icon.vue'

import {
	changeShiftState,
	createShift,
	dateToDay,
	Day,
	deleteShift,
	getDayUniqueId,
	Shift,
	ShiftState,
} from '@/libs/Firebase'
import { currentOrganization, user, shifts, updateShifts } from '@/libs/State'
import { computed, ComputedRef, ref } from 'vue'

const props = defineProps<{ day: Date }>()

const dayKey = getDayUniqueId({
	day: props.day.getDate(),
	month: props.day.getMonth(),
	year: props.day.getFullYear(),
})

const dayShifts: ComputedRef<Shift[]> = computed(() =>
	shifts.value.filter(shift => {
		if (shift.account !== user.value?.account) return false

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

const createPopupOpen = ref(false)
let createTime: 'day' | 'night' = 'day'
const addPopupOpen = ref(false)

function openCreatePopup(time: 'day' | 'night') {
	createPopupOpen.value = true

	createTime = time
}

function openAddPopup() {
	createPopupOpen.value = false
	addPopupOpen.value = true
}

function create(day: Day, time: 'day' | 'night', state: ShiftState) {
	if (!currentOrganization.value) return
	if (!user.value) return

	createShift(currentOrganization.value, user.value.account, day, time, state)

	updateShifts()
}

function remove(shift: Shift) {
	if (!currentOrganization.value) return
	if (!user.value) return

	deleteShift(shift)

	updateShifts()
}

function changeState(shift: Shift, newState: ShiftState) {
	if (!currentOrganization.value) return
	if (!user.value) return

	changeShiftState(shift, newState)

	updateShifts()
}
</script>
<template>
	<Card
		:title="
			['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day.getDay()]
		"
		icon="calendar_today"
		:detail="
			['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][
				day.getMonth()
			] +
			' ' +
			day.getDate()
		"
	>
		<div class="h-1" />

		<div
			class="flex my-2 justify-between p-2 rounded-[0.4rem] border-[2px]"
			:class="{
				'bg-primary': dayShift && dayShift.state !== ShiftState.Wanted,
				'text-element': dayShift && dayShift.state !== ShiftState.Wanted,
				'border-transparent': dayShift && dayShift.state !== ShiftState.Wanted,
				'text-primary': !dayShift || dayShift.state === ShiftState.Wanted,
				'border-primary': dayShift && dayShift.state === ShiftState.Wanted,
				'border-dashed': !dayShift || dayShift.state === ShiftState.Wanted,
				'border-element-border': !dayShift,
			}"
		>
			<div class="flex items-center gap-2">
				<Icon icon="clear_day" class="text-inherit" />

				<p class="text-inherit">Day</p>
			</div>

			<div v-if="dayShift" class="flex items-center">
				<Icon
					v-if="dayShift.state !== ShiftState.Wanted"
					:icon="dayShift.state === ShiftState.Droppable ? 'lock_open' : 'lock'"
					class="text-inherit hover:scale-110 transition-[transform] duration-150 ease-in-out"
					@click="
						changeState(
							dayShift,
							dayShift.state === ShiftState.Droppable ? ShiftState.None : ShiftState.Droppable
						)
					"
				/>
				<Icon
					icon="delete"
					class="text-inherit hover:scale-110 transition-[transform] duration-150 ease-in-out"
					@click="remove(dayShift)"
				/>
			</div>

			<div v-else class="flex items-center">
				<Icon
					icon="add"
					class="text-inherit hover:scale-110 transition-[transform] duration-150 ease-in-out"
					@click="openCreatePopup('day')"
				/>
			</div>
		</div>

		<div
			class="flex my-2 justify-between p-2 rounded-[0.4rem] border-[2px]"
			:class="{
				'bg-primary': nightShift && nightShift.state !== ShiftState.Wanted,
				'text-element': nightShift && nightShift.state !== ShiftState.Wanted,
				'border-transparent': nightShift && nightShift.state !== ShiftState.Wanted,
				'text-primary': !nightShift || nightShift.state === ShiftState.Wanted,
				'border-primary': nightShift && nightShift.state === ShiftState.Wanted,
				'border-dashed': !nightShift || nightShift.state === ShiftState.Wanted,
				'border-element-border': !nightShift,
			}"
		>
			<div class="flex items-center gap-2">
				<Icon icon="bedtime" class="text-inherit" />

				<p class="text-inherit">Night</p>
			</div>

			<div v-if="nightShift" class="flex items-center">
				<Icon
					v-if="nightShift.state !== ShiftState.Wanted"
					:icon="nightShift.state === ShiftState.Droppable ? 'lock_open' : 'lock'"
					class="text-inherit hover:scale-110 transition-[transform] duration-150 ease-in-out"
					@click="
						changeState(
							nightShift,
							nightShift.state === ShiftState.Droppable ? ShiftState.None : ShiftState.Droppable
						)
					"
				/>
				<Icon
					icon="delete"
					class="text-inherit hover:scale-110 transition-[transform] duration-150 ease-in-out"
					@click="remove(nightShift)"
				/>
			</div>

			<div v-else class="flex items-center">
				<Icon
					icon="add"
					class="text-inherit hover:scale-110 transition-[transform] duration-150 ease-in-out"
					@click="openCreatePopup('night')"
				/>
			</div>
		</div>

		<div
			v-if="createPopupOpen"
			class="absolute w-screen h-screen left-0 top-0 flex justify-center items-center"
		>
			<div class="absolute left-0 w-screen h-screen top-0 backdrop-blur-lg"></div>
			<div
				class="absolute left-0 w-screen h-screen top-0 bg-element opacity-50"
				@click="createPopupOpen = false"
			></div>

			<Card class="absolute" title="Add Or Request Shift" icon="add">
				<p class="w-96 my-8">
					If you would like to request this shift, press "Request". Otherwise, if you already have this
					shift, simply press "Add"
				</p>

				<div class="flex gap-2 justify-end">
					<button
						class="element"
						@click="
							() => {
								create(dateToDay(day), createTime, ShiftState.Wanted)

								createPopupOpen = false
							}
						"
					>
						Request
					</button>

					<button @click="openAddPopup">Add</button>
				</div>

				<Icon
					class="absolute top-4 right-4 text-primary hover:scale-110 transition-[transform] duration-150 ease-in-out"
					icon="close"
					@click="createPopupOpen = false"
				/>
			</Card>
		</div>

		<div
			v-if="addPopupOpen"
			class="absolute w-screen h-screen left-0 top-0 flex justify-center items-center"
		>
			<div class="absolute left-0 w-screen h-screen top-0 backdrop-blur-lg"></div>
			<div
				class="absolute left-0 w-screen h-screen top-0 bg-element opacity-50"
				@click="addPopupOpen = false"
			></div>

			<Card class="absolute" title="Add Shift" icon="add">
				<p class="w-96 my-8">
					Are you willing do trade away this shift? Press "Willing To Trade" if you are. Otherwise, press
					"Not Willing To Trade"
				</p>

				<div class="flex gap-2 justify-end">
					<button
						class="element"
						@click="
							() => {
								create(dateToDay(day), createTime, ShiftState.None)

								addPopupOpen = false
							}
						"
					>
						Not Willing To Trade
					</button>

					<button
						@click="
							() => {
								create(dateToDay(day), createTime, ShiftState.Droppable)

								addPopupOpen = false
							}
						"
					>
						Willing To Trade
					</button>
				</div>

				<Icon
					class="absolute top-4 right-4 text-primary hover:scale-110 transition-[transform] duration-150 ease-in-out"
					icon="close"
					@click="addPopupOpen = false"
				/>
			</Card>
		</div>
	</Card>
</template>
