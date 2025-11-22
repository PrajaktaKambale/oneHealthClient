export type StaffSex = 'MALE' | 'FEMALE' | 'OTHER'

export type StaffCreatePayload = {
    tenantId: string
    clinicId: string
    name: string
    phoneNumber: string
    email: string
    username: string
    password: string
    sex: StaffSex
    roleId: string
}

// Role types
export interface Role {
    id: string
    roleName: string
    roleCategory: string | null
    priority: number
    createdAt: string
    createdBy: string
    updatedAt: string
    updatedBy: string
    isActive: boolean
}

export interface RolesResponse {
    success: boolean
    data: Role[]
    message: string
    timestamp: string
    method: string
    path: string
    requestId: string
}

export type StaffCreateResponse = {
    success: boolean
    message: string
    data: {
        user: {
            id: string
            username: string
            emailId: string
            mobileNumber: string
            tenantId: string
            personId: string
            createdAt: string
        }
        person: {
            id: string
            tenantId: string
            type: string
            fullName: string
            phone: string
            email: string
            sex: StaffSex
            createdAt: string
        }
        userRole: {
            id: string
            userId: string
            roleId: string
            priority: number
        }
        userClinic: {
            id: string
            userId: string
            clinicId: string
            roleInClinic: string
        }
    }
}

export type StaffFormData = {
    fullName: string
    phone: string
    email: string
    username: string
    password: string
    confirmPassword: string
    gender: string
    roleId: string
    clinicId: string
    dateOfJoining: string
}

// Clinic types for tenant-based clinic fetching
export interface ClinicByTenant {
    id: string
    tenantId: string
    name: string
    clinicType: string
    isActive: boolean
    phone: string
    email: string
    createdAt: string
    updatedAt: string
    tenant: {
        id: string
        name: string
        slug: string
    }
    address: {
        id: string
        address: string
        town: string
        state: string
        countryName: string
    }
    _count: {
        patients: number
        appointments: number
        visits: number
    }
}

export interface ClinicsByTenantResponse {
    success: boolean
    data: {
        data: ClinicByTenant[]
        total: number
        currentPage: number
        pageSize: number
        totalPages: number
    }
}