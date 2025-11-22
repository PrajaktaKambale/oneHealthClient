import { useState } from 'react'
import { apiCreateClinic } from '@/services/ClinicService'
import { useAppSelector } from '@/store'
import type { ClinicCreatePayload, ClinicFormData } from '@/@types/clinic'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function useClinicRegistration() {
    const [status, setStatus] = useState<Status>('idle')
    const [message, setMessage] = useState('')
    
    // Get current auth state
    const { accessToken, signedIn } = useAppSelector((state) => state.auth.session)
    const user = useAppSelector((state) => state.auth.user)

    const registerClinic = async (formData: ClinicFormData) => {
        try {
            setStatus('loading')
            setMessage('')

            // Check if user is authenticated
            if (!signedIn || !accessToken) {
                throw new Error('Please login first to register a clinic')
            }

            // Debug: Log current auth state
            console.log('Current auth state:', {
                signedIn,
                hasToken: !!accessToken,
                user: user.username
            })

            // Transform form data to API payload
            const payload: ClinicCreatePayload = {
                name: formData.name,
                clinicType: formData.clinicType as 'HUMAN' | 'PET' | 'LIVE_STOCK',
                isActive: formData.isActive,
                phone: formData.phone,
                email: formData.email,
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
                    countryId: formData.countryId || 'IN',
                    countryName: formData.countryName || 'India',
                    geoLocation: {}
                }
            }

            console.log('Sending clinic payload:', payload)

            const response = await apiCreateClinic(payload)

            if (response.data && response.data.success) {
                setStatus('success')
                setMessage('Clinic registered successfully!')
                return {
                    success: true,
                    data: response.data.data,
                    message: 'Clinic registered successfully!'
                }
            } else {
                throw new Error('Registration failed')
            }
        } catch (error: any) {
            setStatus('error')
            
            console.error('Clinic registration error:', error)
            
            // Handle specific error types
            let errorMessage = 'Failed to register clinic'
            
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
        registerClinic,
        resetStatus,
        isLoading: status === 'loading',
        isSuccess: status === 'success',
        isError: status === 'error',
        // Auth state info
        isAuthenticated: signedIn && !!accessToken,
        currentUser: user.username
    }
}