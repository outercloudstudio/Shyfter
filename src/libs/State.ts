import { ref, Ref, watch } from 'vue'
import {
    getMember,
    getShifts,
    getUser,
    getUserOrganizations,
    Organization,
    Shift,
    User,
} from './Firebase'

export const user: Ref<User | null> = ref(null)

export const organizations: Ref<Organization[]> = ref([])

export const currentOrganization: Ref<Organization | null> = ref(null)

export const isAdmin: Ref<boolean> = ref(false)

export const shifts: Ref<(Shift & { day?: { seconds?: number } })[]> = ref([])

watch(currentOrganization, async () => {
    isAdmin.value = false

    if (!user.value) return
    if (!currentOrganization.value) return

    const member = await getMember(
        currentOrganization.value,
        user.value.account
    )
    isAdmin.value = member.role === 'admin'

    shifts.value = await getShifts(currentOrganization.value)
})

export async function updateShifts() {
    if (!currentOrganization.value) return

    shifts.value = await getShifts(currentOrganization.value)
}

export async function loadUser() {
    user.value = await getUser()
    organizations.value = await getUserOrganizations()

    if (organizations.value.length > 0)
        currentOrganization.value = organizations.value[0]
}
