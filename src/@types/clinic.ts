export type ClinicType = 'HUMAN' | 'PET' | 'LIVE_STOCK'

export type ClinicAddress = {
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
    geoLocation?: Record<string, unknown>
}

export type ClinicCreatePayload = {
    name: string
    clinicType: ClinicType
    isActive: boolean
    phone: string
    email: string
    address: ClinicAddress
}

export type ClinicCreateResponse = {
    success: boolean
    data: {
        id: string
        tenantId: string
        name: string
        clinicType: ClinicType
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
    message: string
    timestamp: string
    method: string
    path: string
    requestId: string
}

export type ClinicFormData = {
    name: string
    clinicType: string
    isActive: boolean
    phone: string
    email: string
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
}