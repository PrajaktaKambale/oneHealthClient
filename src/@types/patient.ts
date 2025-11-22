export type PatientType = 'HUMAN' | 'PET' | 'LIVESTOCK'
export type PatientSex = 'MALE' | 'FEMALE' | 'OTHER'
export type Species = 'DOG' | 'CAT' | 'COW' | 'BUFFALO' | 'GOAT' | 'SHEEP' | 'HORSE' | 'OTHER'

export type PatientAddress = {
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
    geoLocation?: any
}

export type PatientPerson = {
    fullName: string
    phone: string
    email?: string
    dateOfBirth: string
    sex: PatientSex
}

export type PatientCreatePayload = {
    tenantId: string
    clinicId: string
    type: PatientType
    age: number
    sex: PatientSex
    species?: Species
    breed?: string
    hasIdentifyingInfo: boolean
    externalId?: string
    address: PatientAddress
    person: PatientPerson
}

export type PatientCreateResponse = {
    success: boolean
    data: {
        id: string
        tenantId: string
        clinicId: string
        pseudonymId: string
        type: PatientType
        age: number
        sex: PatientSex
        species?: Species
        breed?: string
        hasIdentifyingInfo: boolean
        externalId?: string
        ownerId?: string
        createdAt: string
        updatedAt: string
    }
}

export type PatientFormData = {
    fullName: string
    phone: string
    email: string
    gender: string
    dateOfBirth: string
    age: string
    // Address fields
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
    // Animal specific fields (conditional)
    species: string
    breed: string
    externalId: string
}