import { createApp } from 'vue'
import '@/style.css'
import App from '@/App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import '@libs/Firebase'
import Account from '@pages/Account.vue'
import Admin from '@pages/Admin.vue'
import Calendar from '@pages/Calendar.vue'
import Dashboard from '@pages/Dashboard.vue'
import Login from '@pages/Login.vue'
import Register from '@pages/Register.vue'
import Trades from '@pages/Trades.vue'
import Welcome from '@pages/Welcome.vue'
import { getTrades, loginWithSavedAccount, ShiftState } from '@libs/Firebase'
import { currentOrganization, loadUser, shifts } from '@libs/State'
import { calculateTrades } from '@libs/Trades'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', component: Welcome },
		{ path: '/login', component: Login },
		{ path: '/register', component: Register },
		{ path: '/dashboard', component: Dashboard },
		{ path: '/trades', component: Trades },
		{ path: '/calendar', component: Calendar },
		{ path: '/admin', component: Admin },
		{ path: '/account', component: Account },
	],
})

// try {
// 	await loginWithSavedAccount()
// 	await loadUser()
// } catch {}

// console.log(
// 	calculateTrades([
// 		{
// 			account: 'a',
// 			day: { day: 1, month: 1, year: 1 },
// 			id: '1',
// 			time: 'day',
// 			organization: {
// 				id: 'A',
// 				name: 'Org',
// 				owner: 'a',
// 			},
// 			state: ShiftState.Droppable,
// 		},
// 		{
// 			account: 'a',
// 			day: { day: 1, month: 1, year: 1 },
// 			id: 'unset',
// 			time: 'night',
// 			organization: {
// 				id: 'A',
// 				name: 'Org',
// 				owner: 'a',
// 			},
// 			state: ShiftState.Wanted,
// 		},
// 		{
// 			account: 'b',
// 			day: { day: 1, month: 1, year: 1 },
// 			id: 'unset',
// 			time: 'day',
// 			organization: {
// 				id: 'A',
// 				name: 'Org',
// 				owner: 'a',
// 			},
// 			state: ShiftState.Wanted,
// 		},
// 		{
// 			account: 'b',
// 			day: { day: 1, month: 1, year: 1 },
// 			id: '2',
// 			time: 'night',
// 			organization: {
// 				id: 'A',
// 				name: 'Org',
// 				owner: 'a',
// 			},
// 			state: ShiftState.Droppable,
// 		},
// 	])
// )

createApp(App).use(router).mount('#app')
