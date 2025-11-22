export type DoctorSex = 'MALE' | 'FEMALE' | 'OTHER'

export type DoctorAddress = {
    address: string
    townCode: string
    town: string
    pin: string
    subDistrictCode: string
    subDistrict: string
    districtCode: string
    district: string
    stateCode: string
    state: string
    countryId: string
    countryName: string
}

export type DoctorCreatePayload = {
    firstName: string
    lastName: string
    phone: string
    email: string
    username: string
    password: string
    clinicId: string
    tenantId?: string
    sex: DoctorSex
    middleName?: string
    dateOfBirth?: string
    address: DoctorAddress
    externalId?: string
    signatureUrl?: string
    profileImageUrl?: string
}

export type DoctorCreateResponse = {
    success: boolean
    data: {
        id: string
        firstName: string
        lastName: string
        phone: string
        email: string
        username: string
        clinicId: string
        tenantId: string
        sex: DoctorSex
        middleName?: string
        dateOfBirth?: string
        createdAt: string
        updatedAt: string
        address: {
            id: string
            address: string
            town: string
            state: string
            countryName: string
        }
    }
    message: string
    timestamp: string
    method: string
    path: string
    requestId: string
}

export type DoctorFormData = {
    firstName: string
    lastName: string
    middleName: string
    phone: string
    email: string
    username: string
    password: string
    confirmPassword: string
    clinicId: string
    tenantId: string
    sex: string
    dateOfBirth: string
    pin: string
    state: string
    district: string
    subDistrict: string
    town: string
    address: string
    stateCode: string
    districtCode: string
    subDistrictCode: string
    townCode: string
    countryId: string
    countryName: string
    qualifications: string
    licenseNumber: string
    yearsOfExperience: string
}