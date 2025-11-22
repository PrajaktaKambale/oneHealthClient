import ApiService from './ApiService'
import type { PatientCreatePayload, PatientCreateResponse } from '@/@types/patient'

export async function apiCreatePatient(data: PatientCreatePayload) {
    return ApiService.fetchData<PatientCreateResponse>({
        url: '/patients',
        method: 'post',
        data,
    })
}

export async function apiGetPatients(clinicId?: string) {
    return ApiService.fetchData({
        url: '/patients',
        method: 'get',
        params: clinicId ? { clinicId } : undefined,
    })
}

export async function apiGetPatient(id: string) {
    return ApiService.fetchData({
        url: `/patients/${id}`,
        method: 'get',
    })
}

export async function apiUpdatePatient(id: string, data: Partial<PatientCreatePayload>) {
    return ApiService.fetchData({
        url: `/patients/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeletePatient(id: string) {
    return ApiService.fetchData({
        url: `/patients/${id}`,
        method: 'delete',
    })
}