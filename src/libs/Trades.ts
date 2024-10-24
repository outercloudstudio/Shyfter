import { Shift, ShiftState, Trade } from './Firebase'

type UserId = string

export function calculateTrades(shifts: Shift[]): Trade[] {
	const currentShifts: Map<UserId, Shift[]> = new Map()
	const shiftsToDrop: Map<UserId, Shift[]> = new Map()
	const shiftsToAdd: Map<UserId, Shift[]> = new Map()

	for (const shift of shifts) {
		if (shift.state === ShiftState.Wanted) {
			shiftsToAdd.set(shift.account, [...(shiftsToAdd.get(shift.account) ?? []), shift])
		} else {
			currentShifts.set(shift.account, [...(currentShifts.get(shift.account) ?? []), shift])

			if (shift.state === ShiftState.Droppable) {
				shiftsToDrop.set(shift.account, [...(shiftsToDrop.get(shift.account) ?? []), shift])
			}
		}
	}

	for (const [user, userShiftsToDrop] of shiftsToDrop.entries()) {
		for (const shift of userShiftsToDrop) {
			for (const [otherUser, otherUserShiftsToAdd] of shiftsToAdd.entries()) {
				if (user === otherUser) continue

				// if(otherUserShiftsToAdd.find())

				// const otherUserShiftsToDrop = shiftsToDrop.get(otherUser) ?? []
			}
		}
	}

	return []
}
