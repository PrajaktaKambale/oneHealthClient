import { useState } from 'react'
import { apiCreatePatient } from '@/services/PatientService'
import { useAppSelector } from '@/store'
import type { PatientCreatePayload, PatientFormData } from '@/@types/patient'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function usePatientRegistration() {
    const [status, setStatus] = useState<Status>('idle')
    const [message, setMessage] = useState('')
    
    // Get current auth state
    const { accessToken, signedIn } = useAppSelector((state) => state.auth.session)
    const user = useAppSelector((state) => state.auth.user)

    const registerPatient = async (formData: PatientFormData) => {
        try {
            setStatus('loading')
            setMessage('')

            // Check if user is authenticated
            if (!signedIn || !accessToken) {
                throw new Error('Please login first to register patient')
            }

            // Check if required user data is available
            if (!user.tenantId || !user.clinicId) {
                throw new Error('Tenant and clinic information not available. Please login again.')
            }

            // Get clinic type from user's clinics
            const currentClinic = user.clinics?.find(clinic => clinic.id === user.clinicId)
            const clinicType = currentClinic?.clinicType || 'HUMAN'

            // Calculate age from date of birth
            const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear()

            // Transform form data to API payload
            const payload: PatientCreatePayload = {
                tenantId: user.tenantId,
                clinicId: user.clinicId,
                type: clinicType as 'HUMAN' | 'PET' | 'LIVESTOCK',
                age: age,
                sex: formData.gender as 'MALE' | 'FEMALE' | 'OTHER',
                hasIdentifyingInfo: true,
                address: {
                    address: formData.address,
                    townCode: formData.townCode || '',
                    town: formData.town,
                    pin: formData.pin,
                    subDistrictCode: formData.subDistrictCode || '',
                    subDistrict: formData.subDistrict,
                    districtCode: formData.districtCode || '',
                    district: formData.district,
                    stateCode: formData.stateCode || '',
                    state: formData.state,
                    countryId: formData.countryId,
                    countryName: formData.countryName || 'India',
                    geoLocation: {}
                },
                person: {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    email: formData.email || undefined,
                    dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
                    sex: formData.gender as 'MALE' | 'FEMALE' | 'OTHER'
                }
            }

            // Add animal-specific fields if not HUMAN clinic
            if (clinicType !== 'HUMAN') {
                payload.species = formData.species as any
                payload.breed = formData.breed || undefined
                payload.externalId = formData.externalId || undefined
            }

            console.log('Sending patient payload:', payload)

            const response = await apiCreatePatient(payload)

            if (response.data && response.data.success) {
                setStatus('success')
                setMessage('Patient registered successfully!')
                return {
                    success: true,
                    data: response.data.data,
                    message: 'Patient registered successfully!'
                }
            } else {
                throw new Error('Registration failed')
            }
        } catch (error: any) {
            setStatus('error')
            
            console.error('Patient registration error:', error)
            
            // Handle specific error types
            let errorMessage = 'Failed to register patient'
            
            if (error?.response?.status === 401) {
                errorMessage = 'Authentication failed. Please login again.'
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message
            } else if (error?.message) {
                errorMessage = error.message
            }
            
            setMessage(errorMessage)
            return {
                success: false,
                message: errorMessage
            }
        }
    }

    const resetStatus = () => {
        setStatus('idle')
        setMessage('')
    }

    return {
        status,
        message,
        registerPatient,
        resetStatus,
        isLoading: status === 'loading',
        isSuccess: status === 'success',
        isError: status === 'error',
        // Auth state info
        isAuthenticated: signedIn && !!accessToken,
        currentUser: user.username,
        tenantId: user.tenantId,
        clinicId: user.clinicId,
        clinicType: user.clinics?.find(clinic => clinic.id === user.clinicId)?.clinicType || 'HUMAN'
    }
}