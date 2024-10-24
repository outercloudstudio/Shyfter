import { initializeApp } from 'firebase/app'
import {
	Auth,
	createUserWithEmailAndPassword,
	getAuth,
	signInWithEmailAndPassword,
} from 'firebase/auth'
import {
	addDoc,
	collection,
	collectionGroup,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	or,
	query,
	updateDoc,
	where,
} from 'firebase/firestore'
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
	apiKey: 'AIzaSyBEJPrkIu_qSEVL-gjQ0RUpwoMlC7IyO-4',
	authDomain: 'shifter-34852.firebaseapp.com',
	projectId: 'shifter-34852',
	storageBucket: 'shifter-34852.appspot.com',
	messagingSenderId: '35646851933',
	appId: '1:35646851933:web:2eec85b5ab5230db9b76b4',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

let auth: Auth | null = null

export let loggedIn = false

export async function register(email: string, password: string) {
	const currentAuth = getAuth()

	await createUserWithEmailAndPassword(currentAuth, email, password)

	// TODO: Insecure, should replace with better method later
	sessionStorage.setItem('email', email)
	sessionStorage.setItem('password', password)

	auth = currentAuth
	loggedIn = true
}

export async function login(email: string, password: string) {
	const currentAuth = getAuth()

	await signInWithEmailAndPassword(currentAuth, email, password)

	// TODO: Insecure, should replace with better method later
	sessionStorage.setItem('email', email)
	sessionStorage.setItem('password', password)

	auth = currentAuth
	loggedIn = true
}

export async function loginWithSavedAccount() {
	const currentAuth = getAuth()

	// TODO: Insecure, should replace with better method later
	await signInWithEmailAndPassword(
		currentAuth,
		sessionStorage.getItem('email') as string,
		sessionStorage.getItem('password') as string
	)

	auth = currentAuth
	loggedIn = true
}

export type User = {
	account: string
	name: string
	id: string
}

export type Organization = {
	name: string
	owner: string
	id: string
}

export type Role = 'member' | 'admin'

export type Member = {
	account: string
	role: Role
	organization: Organization
	id: string
}

export enum ShiftState {
	None = 'None',
	Droppable = 'Droppable',
	Wanted = 'Wanted',
}

export type Day = {
	month: number
	day: number
	year: number
}

export type Shift = {
	account: string
	day: Day
	time: 'day' | 'night'
	organization: Organization
	id: string
	state: ShiftState
}

export type Trade = {
	from: string
	to: string
	fromShift: string
	toShift: string
	approved: boolean
	organization: Organization
	id: string
}

export function dateToDay(date: Date): Day {
	return { day: date.getDate(), month: date.getMonth(), year: date.getFullYear() }
}

export function getDayUniqueId(day: Day): string {
	return `${day.day} ${day.month}  ${day.year}`
}

export function getShiftTimeUniqueId(shift: Shift): string {
	return `${shift.time} ${shift.day.day} ${shift.day.month}  ${shift.day.year}`
}

export async function getUser(accountId?: string): Promise<User> {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	const userQuery = query(
		collection(db, `users`),
		where('account', '==', accountId ?? auth.currentUser.uid)
	)

	const userDocs = await getDocs(userQuery)

	if (userDocs.docs.length != 1) throw new Error(`Found ${userDocs.docs.length} users instead of 1!`)

	let data = userDocs.docs[0].data() as User
	data.id = userDocs.docs[0].id

	return data
}

export async function changeUserName(user: User, name: string) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await updateDoc(doc(db, `users/${user.id}`), {
		account: user.account,
		name,
	})
}

export async function createOrganization(name: string) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	const organization = await addDoc(collection(db, 'organizations'), {
		name,
		owner: auth.currentUser.uid,
	})

	await addDoc(collection(organization, 'members'), {
		account: auth.currentUser.uid,
		role: 'admin',
	})
}

export async function deleteOrganization(organization: Organization) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await deleteDoc(doc(db, `organizations/${organization.id}`))
}

export async function transferOrganizationOwnership(organization: Organization, ownerId: string) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await updateDoc(doc(db, `organizations/${organization.id}`), {
		name: organization.name,
		owner: ownerId,
	} as Organization)
}

export async function changeOrganizationName(organization: Organization, name: string) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	organization.name = name

	await updateDoc(doc(db, `organizations/${organization.id}`), {
		name,
		owner: organization.owner,
	})
}

export async function getUserOrganizations(): Promise<Organization[]> {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	const organizations: Organization[] = []

	const membersQuery = query(
		collectionGroup(db, 'members'),
		where('account', '==', auth.currentUser.uid)
	)

	const membersDocs = await getDocs(membersQuery)
	for (const document of membersDocs.docs) {
		const organizationId = document.ref.path.split('/')[1]

		const organizationDocument = await getDoc(doc(db, `organizations/${organizationId}`))
		const data = organizationDocument.data() as Organization
		data.id = organizationDocument.id

		organizations.push(data)
	}

	return organizations
}

export async function getOrganization(id: string): Promise<Organization | null> {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	const documentReference = doc(db, 'organizations', id)
	const document = await getDoc(documentReference)

	const data = document.data() as Organization
	data.id = document.id

	return data
}

export async function addMember(organization: Organization, account: string, role: Role) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await addDoc(collection(db, `organizations/${organization.id}/members`), {
		account,
		role,
	})
}

export async function removeMember(member: Member) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await deleteDoc(doc(db, `organizations/${member.organization.id}/members/${member.id}`))
}

export async function changeMemberRole(member: Member, role: Role) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await updateDoc(doc(db, `organizations/${member.organization.id}/members/${member.id}`), {
		account: member.account,
		role,
	})
}

export async function getMember(organization: Organization, accountId: string): Promise<Member> {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	const memberQuery = query(
		collection(db, `organizations/${organization.id}/members`),
		where('account', '==', accountId)
	)

	const memberDocs = await getDocs(memberQuery)

	if (memberDocs.docs.length != 1)
		throw new Error(`Found ${memberDocs.docs.length} members instead of 1!`)

	const data = memberDocs.docs[0].data() as Member
	data.id = memberDocs.docs[0].id
	data.organization = organization

	return data
}

export async function getMembers(organization: Organization): Promise<Member[]> {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	const members: Member[] = []

	const memberQuery = query(collection(db, `organizations/${organization.id}/members`))

	const memberDocs = await getDocs(memberQuery)
	for (const document of memberDocs.docs) {
		const data = document.data() as Member
		data.id = document.id
		data.organization = organization

		members.push(data)
	}

	return members
}

export async function createShift(
	organization: Organization,
	account: string,
	day: Day,
	time: 'day' | 'night',
	state: ShiftState
) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await addDoc(collection(db, `organizations/${organization.id}/shifts`), {
		account,
		day,
		time,
		state,
	})
}

export async function deleteShift(shift: Shift) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await deleteDoc(doc(db, `organizations/${shift.organization.id}/shifts/${shift.id}`))
}

export async function changeShiftTime(shift: Shift, day: Day, time: 'day' | 'night') {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await updateDoc(doc(db, `organizations/${shift.organization.id}/shifts/${shift.id}`), {
		account: shift.account,
		day,
		time,
		state: shift.state,
	})
}

export async function changeShiftState(shift: Shift, state: ShiftState) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await updateDoc(doc(db, `organizations/${shift.organization.id}/shifts/${shift.id}`), {
		account: shift.account,
		day: shift.day,
		time: shift.time,
		state: state,
	})
}

export async function getShifts(organization: Organization): Promise<Shift[]> {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	const shifts: Shift[] = []

	const shiftQuery = query(collection(db, `organizations/${organization.id}/shifts`))

	const shiftDocs = await getDocs(shiftQuery)
	for (const document of shiftDocs.docs) {
		const data = document.data() as Shift
		data.id = document.id
		data.organization = organization

		shifts.push(data)
	}

	return shifts
}

export async function getShift(organization: Organization, shiftId: string): Promise<Shift> {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	const shiftReference = doc(db, `organizations/${organization.id}/shifts/${shiftId}`)
	const shiftDocument = await getDoc(shiftReference)

	const shift = shiftDocument.data() as Shift
	shift.id = shiftDocument.id
	shift.organization = organization

	return shift
}

export async function createTrade(
	organization: Organization,
	from: string,
	to: string,
	fromShift: Shift,
	toShift: Shift
) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await addDoc(collection(db, `organizations/${organization.id}/trades`), {
		from,
		to,
		fromShift: fromShift.id,
		toShift: toShift.id,
		approved: false,
	})
}

export async function deleteTrade(trade: Trade) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await deleteDoc(doc(db, `organizations/${trade.organization.id}/trades/${trade.id}`))
}

export async function changeTradeApproval(trade: Trade, approved: boolean) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await updateDoc(doc(db, `organizations/${trade.organization.id}/trades/${trade.id}`), {
		from: trade.from,
		to: trade.to,
		fromShift: trade.fromShift,
		toShift: trade.toShift,
		approved,
	})
}

export async function changeTradeAcceptedUser(trade: Trade, acceptedUserId: string) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await updateDoc(doc(db, `organizations/${trade.organization.id}/trades/${trade.id}`), {
		from: trade.from,
		to: acceptedUserId,
		fromShift: trade.fromShift,
		toShift: trade.toShift,
		approved: trade.approved,
	})
}

export async function acceptTrade(trade: Trade) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await changeTradeAcceptedUser(trade, auth.currentUser.uid)
}

export async function approveTrade(trade: Trade) {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	await changeTradeApproval(trade, true)
}

export async function getTrades(organization: Organization): Promise<Trade[]> {
	if (!loggedIn) throw new Error('Not logged in!')
	if (!auth) throw new Error('Not authenticated!')
	if (!auth.currentUser?.uid) throw new Error('No current user uid!')

	const trades: Trade[] = []

	const tradeQuery = query(collection(db, `organizations/${organization.id}/trades`))

	const tradeDocs = await getDocs(tradeQuery)
	for (const document of tradeDocs.docs) {
		const data = document.data() as Trade
		data.id = document.id
		data.organization = organization

		trades.push(data)
	}

	return trades
}
