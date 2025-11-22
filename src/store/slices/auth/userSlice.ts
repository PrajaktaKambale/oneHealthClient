import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export type UserState = {
    id?: string
    avatar?: string
    username?: string
    emailId?: string
    fullName?: string
    tenantId?: string
    clinicId?: string
    roles?: Array<{
        roleId: string
        roleName: string
        roleCategory: string | null
    }>
    authority?: string[]
    tenant?: {
        id: string
        name: string
        slug: string
    }
    clinics?: Array<{
        id: string
        name: string
        clinicType: string
    }>
}

const initialState: UserState = {
    id: '',
    avatar: '',
    username: '',
    emailId: '',
    fullName: '',
    tenantId: '',
    clinicId: '',
    roles: [],
    authority: [],
    tenant: undefined,
    clinics: [],
}

const userSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.id = action.payload?.id
            state.avatar = action.payload?.avatar
            state.emailId = action.payload?.emailId
            state.username = action.payload?.username
            state.fullName = action.payload?.fullName
            state.tenantId = action.payload?.tenantId
            state.clinicId = action.payload?.clinicId
            state.roles = action.payload?.roles
            state.authority = action.payload?.authority
            state.tenant = action.payload?.tenant
            state.clinics = action.payload?.clinics
        },
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
