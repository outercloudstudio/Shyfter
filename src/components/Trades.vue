<script setup lang="ts">
import Card from './Card.vue'

import { computed } from 'vue'
import { calculateTrades } from '@/libs/Trades'
import { shifts, user } from '@/libs/State'
import { getMember, getUser } from '@/libs/Firebase'

// idk if you had a better way of formatting dates, this is based on the one i made for the list of shifts
function formatDate(day: any) {
	if (day && typeof day.seconds === 'number') {
		return new Date(day.seconds * 1000).toLocaleDateString()
	}

	if (day instanceof Date) {
		return day.toLocaleDateString()
	}

	return ''
}

const trades = computed(() => {
	const trades = calculateTrades(shifts.value).filter(
		trade => trade.from === user.value?.account || trade.to === user.value?.account
	)

	console.log(shifts.value)
	console.log(trades)

	return trades
})

// onMounted(async () => {
// 	await updateShifts()

// 	droppableShifts.value = shifts.value.filter(shift => shift.state === ShiftState.Droppable)

// 	if (currentOrganization.value) {
// 		trades.value = await getTrades(currentOrganization.value)
// 	}
// })

// idk how to do firebase things, i keep getting errors that i don't have permissions
// so idk if this function works at all

/* async function createTradeRequest() {
  if (!selectedFromShift.value || !selectedToShift.value || !selectedUserToTradeWith.value) {
    alert('Select shifts and user to trade with.')
    return
  }

  if (!currentOrganization.value || !user.value) return

  try {
    const fromShift = shifts.value.find(shift => shift.id === selectedFromShift.value)
    const toShift = shifts.value.find(shift => shift.id === selectedToShift.value)

    if (!fromShift || !toShift) return

    await createTrade(currentOrganization.value, user.value.account, selectedUserToTradeWith.value, fromShift, toShift)
    
    trades.value = await getTrades(currentOrganization.value)
    alert('Trade successful.')
  } catch (error) {
    console.error('Error creating trade:', error)
  }
} */
</script>

<template>
	<div>
		<h4>Trades Dashboard</h4>

		<div class="flex flex-wrap gap-2 grow">
			<Card
				v-for="trade in trades"
				:key="trade.from + trade.fromShift + trade.to + trade.toShift"
				title="Trade"
				icon="swap_horiz"
				class="basis-48 grow max-w-80"
			>
				<p>You and {{ (await getUser(trade.from === user?.account ? trade.from : trade.to)).name }}</p>
			</Card>
		</div>
	</div>
</template>
