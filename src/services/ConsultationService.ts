import ApiService from './ApiService'
import type { ConsultationCreatePayload, ConsultationCreateResponse, PatientsResponse, DoctorsResponse } from '@/@types/consultation'

export async function apiCreateConsultation(data: ConsultationCreatePayload) {
    return ApiService.fetchData<ConsultationCreateResponse>({
        url: '/patients/visits',
        method: 'post',
        data,
    })
}

export async function apiGetPatients(clinicId: string) {
    return ApiService.fetchData<PatientsResponse>({
        url: '/patients',
        method: 'get',
        params: { clinicId },
    })
}

export async function apiGetDoctorsByClinic(clinicId: string) {
    return ApiService.fetchData<DoctorsResponse>({
        url: `/clinics/${clinicId}/doctors`,
        method: 'get',
    })
}

export async function apiGetConsultations(clinicId?: string, patientId?: string) {
    return ApiService.fetchData({
        url: '/patients/visits',
        method: 'get',
        params: { 
            ...(clinicId && { clinicId }),
            ...(patientId && { patientId })
        },
    })
}

export async function apiGetConsultation(id: string) {
    return ApiService.fetchData({
        url: `/patients/visits/${id}`,
        method: 'get',
    })
}

export async function apiUpdateConsultation(id: string, data: Partial<ConsultationCreatePayload>) {
    return ApiService.fetchData({
        url: `/patients/visits/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteConsultation(id: string) {
    return ApiService.fetchData({
        url: `/patients/visits/${id}`,
        method: 'delete',
    })
}

export async function apiGetOngoingVisits(clinicId: string) {
    return ApiService.fetchData({
        url: `/patients/visits/clinic/${clinicId}/ongoing`,
        method: 'get',
    })
}

export async function apiGetVisitDetails(visitId: string) {
    return ApiService.fetchData({
        url: `/patients/visits/${visitId}`,
        method: 'get',
    })
}

export async function apiSearchIcdCodes(searchTerm: string) {
    return ApiService.fetchData({
        url: '/icd-codes/search',
        method: 'get',
        params: { q: searchTerm, limit: 20 },
    })
}

export async function apiSubmitDiagnosis(data: any) {
    return ApiService.fetchData({
        url: '/diagnosis',
        method: 'post',
        data,
    })
}

export async function apiSearchDiseaseMaster(collection: string, searchTerm: string) {
    return ApiService.fetchData({
        url: `/master/${collection}/search`,
        method: 'get',
        params: { q: searchTerm },
    })
}

export async function apiSearchMedicines(searchTerm?: string) {
    return ApiService.fetchData({
        url: `/master/medicine_master`,
        method: 'get',
    })
}