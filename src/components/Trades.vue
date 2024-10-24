<script setup lang="ts">
import Card from './Card.vue'

import { computed, ComputedRef, onMounted, ref, Ref, watch } from 'vue'
import { calculateTrades } from '@/libs/Trades'
import { currentOrganization, shifts, user } from '@/libs/State'
import { getMember, getShift, getUser, Trade } from '@/libs/Firebase'

const trades: ComputedRef<Trade[]> = computed(() => {
	const trades = calculateTrades(shifts.value).filter(
		trade => trade.from === user.value?.account || trade.to === user.value?.account
	)

	console.log(shifts.value)
	console.log(trades)

	return trades
})

const tradeData: Ref<
	{ trade: Trade; otherUserName: string; giveTime: string; takeTime: string }[]
> = ref([])

async function updateTradeData() {
	tradeData.value = await Promise.all(
		trades.value.map(async trade => {
			if (!currentOrganization.value) throw new Error('No organization!')

			const userIsFrom = trade.from === user.value?.account
			const giveShift = await getShift(
				currentOrganization.value,
				userIsFrom ? trade.fromShift : trade.toShift
			)
			const takeShift = await getShift(
				currentOrganization.value,
				userIsFrom ? trade.toShift : trade.fromShift
			)

			return {
				otherUserName: (await getUser(userIsFrom ? trade.to : trade.from)).name,
				giveTime: `${giveShift.time.charAt(0).toUpperCase() + giveShift.time.slice(1)} Shift on ${
					['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][
						giveShift.day.month
					]
				} S ${giveShift.day.day}`,
				takeTime: `${takeShift.time.charAt(0).toUpperCase() + takeShift.time.slice(1)} Shift on ${
					['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][
						takeShift.day.month
					]
				} ${takeShift.day.day}`,
				trade,
			}
		})
	)
}

watch(trades, async () => {
	await updateTradeData()
})

onMounted(() => {
	updateTradeData()
})

async function makeTrade(trade: Trade) {}
</script>

<template>
	<div>
		<h4 class="mb-1">Trades Dashboard</h4>

		<div class="flex flex-wrap gap-2 grow">
			<Card
				v-for="data in tradeData"
				:key="data.trade.from + data.trade.fromShift + data.trade.to + data.trade.toShift"
				title="Trade"
				icon="swap_horiz"
				class="basis-48 grow max-w-80"
			>
				<p class="my-4">Between You and {{ data.otherUserName }}</p>

				<p>
					<span class="text-secondary">You give</span>
					{{ data.giveTime }}
				</p>

				<p>
					<span class="text-secondary">You take</span>
					{{ data.takeTime }}
				</p>

				<div class="flex mt-4 justify-end">
					<button @click="makeTrade(data.trade)">Trade</button>
				</div>
			</Card>
		</div>
	</div>
</template>
