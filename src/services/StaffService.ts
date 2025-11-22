import ApiService from './ApiService'
import type { StaffCreatePayload, StaffCreateResponse, ClinicsByTenantResponse, RolesResponse } from '@/@types/staff'

export async function apiGetRoles() {
    return ApiService.fetchData<RolesResponse>({
        url: '/o/role',
        method: 'get',
    })
}

export async function apiCreateStaff(data: StaffCreatePayload) {
    return ApiService.fetchData<StaffCreateResponse>({
        url: '/users/staff',
        method: 'post',
        data,
    })
}

export async function apiGetClinicsByTenant(tenantId: string, page: number = 1, limit: number = 10) {
    return ApiService.fetchData<ClinicsByTenantResponse>({
        url: '/clinics/page',
        method: 'get',
        params: {
            page,
            limit,
            tenantId
        },
    })
}

export async function apiGetStaffList(clinicId?: string) {
    return ApiService.fetchData({
        url: '/users/staff',
        method: 'get',
        params: clinicId ? { clinicId } : undefined,
    })
}

export async function apiGetStaff(id: string) {
    return ApiService.fetchData({
        url: `/users/staff/${id}`,
        method: 'get',
    })
}

export async function apiUpdateStaff(id: string, data: Partial<StaffCreatePayload>) {
    return ApiService.fetchData({
        url: `/users/staff/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteStaff(id: string) {
    return ApiService.fetchData({
        url: `/users/staff/${id}`,
        method: 'delete',
    })
}