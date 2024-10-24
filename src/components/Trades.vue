<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { currentOrganization, user, shifts, updateShifts } from '@/libs/State'
import { getTrades, createTrade } from '@/libs/Firebase'
import { Shift, Trade, ShiftState } from '@/libs/Firebase'

const droppableShifts = ref<Shift[]>([])
const trades = ref<Trade[]>([])
const selectedFromShift = ref<string | null>(null)
const selectedToShift = ref<string | null>(null)
const selectedUserToTradeWith = ref('')

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

onMounted(async () => {
  await updateShifts()

  droppableShifts.value = shifts.value.filter(shift => shift.state === ShiftState.Droppable)

  if (currentOrganization.value) {
    trades.value = await getTrades(currentOrganization.value)
  }
})

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
    <h1>Trades Dashboard</h1>

    <section>
      <h2>Create a Trade</h2>
      
      <label for="fromShift">Select Your Shift to Trade:</label>
      <select id="fromShift" v-model="selectedFromShift">
        <option disabled value="">Select a Shift</option>
        <option v-for="shift in droppableShifts" :key="shift.id" :value="shift.id">
          {{ shift.time }} - {{ formatDate(shift.day) }} ({{ shift.organization.name }})
        </option>
      </select>
      
      <br>

      <label for="toShift">Select Shift You Want:</label>
      <select id="toShift" v-model="selectedToShift">
        <option disabled value="">Select a Shift</option>
        <!-- this formatting is kind of terrible i'm so sorry -->
        <option v-for="shift in shifts" :key="shift.id" :value="shift.id">
          {{ shift.time }} - {{ formatDate(shift.day) }} ({{ shift.organization.name }})
        </option>
      </select>
      
      <br>

      <label for="tradeUser">Enter User to Trade With:</label>
      <input id="tradeUser" type="text" v-model="selectedUserToTradeWith" placeholder="Username">
      
      <br>
      
      <!-- <button @click="createTradeRequest">Create Trade</button> -->
      <button >Create Trade</button>
    </section>

    <section>
      <h2>Existing Trades</h2>
      <div v-if="trades.length === 0">
        <p>No trade requests available.</p>
      </div>
      <ul v-else>
        <li v-for="trade in trades" :key="trade.id">
          <p>From: {{ trade.from }}</p>
          <p>To: {{ trade.to || 'Pending' }}</p>
          <p>From Shift ID: {{ trade.fromShift }}</p>
          <p>To Shift ID: {{ trade.toShift }}</p>
          <p>Approved: {{ trade.approved ? 'Yes' : 'No' }}</p>
        </li>
      </ul>
    </section>
  </div>
</template>