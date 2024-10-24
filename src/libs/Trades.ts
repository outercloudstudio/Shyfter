import { getShiftTimeUniqueId, Shift, ShiftState, Trade } from './Firebase'

type UserId = string

export function calculateTrades(shifts: Shift[]): Trade[] {
	const currentShifts: Map<UserId, Shift[]> = new Map()
	const droppableShifts: Map<UserId, Shift[]> = new Map()
	const wantedShifts: Map<UserId, Shift[]> = new Map()

	const trades: Trade[] = []

	for (const shift of shifts) {
		if (shift.state === ShiftState.Wanted) {
			wantedShifts.set(shift.account, [...(wantedShifts.get(shift.account) ?? []), shift])
		} else {
			currentShifts.set(shift.account, [...(currentShifts.get(shift.account) ?? []), shift])

			if (shift.state === ShiftState.Droppable) {
				droppableShifts.set(shift.account, [...(droppableShifts.get(shift.account) ?? []), shift])
			}
		}
	}

	const checkedTradeUserUniqueIds: string[] = []

	for (const [user, userDroppableShifts] of droppableShifts.entries()) {
		const userWantedShifts = wantedShifts.get(user) ?? []

		for (const userDroppableShift of userDroppableShifts) {
			for (const [otherUser, otherUserWantedShifts] of wantedShifts.entries()) {
				if (user === otherUser) continue
				if (checkedTradeUserUniqueIds.includes(`${otherUser} ${user}`)) continue

				checkedTradeUserUniqueIds.push(`${user} ${otherUser}`)

				const otherUserWantedShift = otherUserWantedShifts.find(
					otherShift => getShiftTimeUniqueId(otherShift) === getShiftTimeUniqueId(userDroppableShift)
				)

				if (!otherUserWantedShift) continue

				const otherUserDroppableShifts = droppableShifts.get(otherUser) ?? []

				for (const otherUserDroppableShift of otherUserDroppableShifts) {
					const userWantedShift = userWantedShifts.find(
						otherShift =>
							getShiftTimeUniqueId(otherShift) === getShiftTimeUniqueId(otherUserDroppableShift)
					)

					if (!userWantedShift) continue

					trades.push({
						approved: false,
						from: user,
						to: otherUser,
						fromShift: userDroppableShift.id,
						toShift: otherUserDroppableShift.id,
						id: 'unset',
						organization: userDroppableShift.organization,
					})
				}
			}
		}
	}

	return trades
}
