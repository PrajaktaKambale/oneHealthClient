import ApiService from './ApiService'
import type { ClinicCreatePayload, ClinicCreateResponse } from '@/@types/clinic'

export async function apiCreateClinic(data: ClinicCreatePayload) {
    return ApiService.fetchData<ClinicCreateResponse>({
        url: '/clinics',
        method: 'post',
        data,
    })
}

export async function apiGetClinics() {
    return ApiService.fetchData({
        url: '/clinics',
        method: 'get',
    })
}

export async function apiGetClinic(id: string) {
    return ApiService.fetchData({
        url: `/clinics/${id}`,
        method: 'get',
    })
}

export async function apiUpdateClinic(id: string, data: Partial<ClinicCreatePayload>) {
    return ApiService.fetchData({
        url: `/clinics/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteClinic(id: string) {
    return ApiService.fetchData({
        url: `/clinics/${id}`,
        method: 'delete',
    })
}