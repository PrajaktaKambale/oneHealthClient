import ApiService from './ApiService'
import type { DoctorCreatePayload, DoctorCreateResponse } from '@/@types/doctor'

// Clinic API types
export interface Clinic {
    id: string;
    name: string;
    clinicType: string;
    isActive: boolean;
    phone: string;
    email: string;
    tenant: {
        id: string;
        name: string;
        slug: string;
    };
    address: {
        id: string;
        address: string;
        town: string;
        state: string;
        countryName: string;
    };
    _count: {
        patients: number;
        appointments: number;
        visits: number;
    };
}

export interface ClinicsResponse {
    success: boolean;
    data: Clinic[];
    message: string;
    timestamp: string;
    method: string;
    path: string;
    requestId: string;
}

export async function apiGetClinics(search?: string) {
    const params: any = { isActive: 'true' };
    if (search && search.trim()) {
        params.search = search.trim();
    }
    
    return ApiService.fetchData<ClinicsResponse>({
        url: '/clinics',
        method: 'get',
        params,
    })
}

export async function apiCreateDoctor(data: DoctorCreatePayload) {
    return ApiService.fetchData<DoctorCreateResponse>({
        url: '/clinics/doctors',
        method: 'post',
        data,
    })
}

export async function apiGetDoctors(clinicId?: string) {
    return ApiService.fetchData({
        url: '/clinics/doctors',
        method: 'get',
        params: clinicId ? { clinicId } : undefined,
    })
}

export async function apiGetDoctor(id: string) {
    return ApiService.fetchData({
        url: `/clinics/doctors/${id}`,
        method: 'get',
    })
}

export async function apiUpdateDoctor(id: string, data: Partial<DoctorCreatePayload>) {
    return ApiService.fetchData({
        url: `/clinics/doctors/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteDoctor(id: string) {
    return ApiService.fetchData({
        url: `/clinics/doctors/${id}`,
        method: 'delete',
    })
}