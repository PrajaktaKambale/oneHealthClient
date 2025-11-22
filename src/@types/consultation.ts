export type VisitType = 'CLINIC' | 'HOME' | 'ON_CALL' | 'FARM'

export type ConsultationVitals = {
    temperature?: number
    pulse?: number
    bp?: string
    spo2?: number
}

export type ConsultationCreatePayload = {
    tenantId: string
    clinicId: string
    patientId: string
    doctorId: string
    visitType: VisitType
    vitals: ConsultationVitals
    symptoms: string
    notes?: string
}

export type ConsultationCreateResponse = {
    success: boolean
    data: {
        id: string
        tenantId: string
        clinicId: string
        patientId: string
        doctorId: string
        visitType: VisitType
        vitals: ConsultationVitals
        symptoms: string
        notes?: string
        createdAt: string
        updatedAt: string
    }
}

export type ConsultationFormData = {
    patientId: string
    doctorId: string
    visitType: string
    symptoms: string
    notes: string
    // Vitals
    temperature: string
    pulse: string
    systolic: string
    diastolic: string
    spo2: string
}

// Patient types for API response
export interface PatientData {
    id: string
    tenantId: string
    clinicId: string
    pseudonymId: string
    type: string
    age: number
    sex: string
    species?: string
    breed?: string
    hasIdentifyingInfo: boolean
    externalId?: string
    ownerId?: string
    createdAt: string
    updatedAt: string
    addressId: string
    clinic: {
        id: string
        name: string
        clinicType: string
    }
    owner: any
    address: {
        id: string
        address: string
        town: string
        state: string
        countryName: string
    }
    identities: {
        id: string
        patientId: string
        personId: string
        nameCipher?: string
        phoneCipher?: string
        emailCipher?: string
        addressCipher?: string
        governmentIdCipher?: string
        createdAt: string
        person: {
            id: string
            fullName: string
            phone: string
            email?: string
            dateOfBirth: string
            sex: string
            type: string
        }
    }
}

export interface PatientsResponse {
    success: boolean
    data: PatientData[]
    message: string
    timestamp: string
    method: string
    path: string
    requestId: string
}

// Doctor types for API response
export interface DoctorData {
    user: {
        id: string
        username: string
        emailId: string
        mobileNumber: string
        emailVerified: boolean
        mobileValidationStatus: boolean
        isLocked: boolean
        profilePictureUrl?: string
        tenantId: string
        createdAt: string
        updatedAt: string
    }
    person: {
        id: string
        tenantId: string
        type: string
        fullName: string
        phone: string
        email: string
        dateOfBirth: string
        sex: string
        metadata: {
            lastName: string
            firstName: string
            externalId?: string
            middleName?: string
            signatureUrl?: string
            profileImageUrl?: string
        }
        createdAt: string
        updatedAt: string
        addressId: string
        address: {
            id: string
            address: string
            town: string
            state: string
            countryName: string
            pin: string
        }
    }
    clinic: {
        id: string
        name: string
        clinicType: string
        isActive: boolean
    }
}

export interface DoctorsResponse {
    success: boolean
    data: DoctorData[]
    message: string
    timestamp: string
    method: string
    path: string
    requestId: string
}