import { useState } from 'react'
import { apiCreateDoctor } from '@/services/DoctorService'
import { useAppSelector } from '@/store'
import type { DoctorCreatePayload, DoctorFormData } from '@/@types/doctor'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function useDoctorRegistration() {
    const [status, setStatus] = useState<Status>('idle')
    const [message, setMessage] = useState('')
    
    // Get current auth state
    const { accessToken, signedIn } = useAppSelector((state) => state.auth.session)
    const user = useAppSelector((state) => state.auth.user)

    const registerDoctor = async (formData: DoctorFormData) => {
        try {
            setStatus('loading')
            setMessage('')

            // Check if user is authenticated
            if (!signedIn || !accessToken) {
                throw new Error('Please login first to register a doctor')
            }

            // Validate password confirmation
            if (formData.password !== formData.confirmPassword) {
                throw new Error('Passwords do not match')
            }

            // Transform form data to API payload
            const payload: DoctorCreatePayload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                middleName: formData.middleName || undefined,
                phone: formData.phone,
                email: formData.email,
                username: formData.username,
                password: formData.password,
                clinicId: formData.clinicId,
                tenantId: formData.tenantId, // Get from selected clinic
                sex: formData.sex as 'MALE' | 'FEMALE' | 'OTHER',
                dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : undefined,
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
                    countryId: formData.countryId, // Get from pincode API
                    countryName: formData.countryName || 'India'
                }
            }

            console.log('Sending doctor payload:', payload)

            const response = await apiCreateDoctor(payload)

            if (response.data && response.data.success) {
                setStatus('success')
                setMessage('Doctor registered successfully!')
                return {
                    success: true,
                    data: response.data.data,
                    message: 'Doctor registered successfully!'
                }
            } else {
                throw new Error('Registration failed')
            }
        } catch (error: any) {
            setStatus('error')
            
            console.error('Doctor registration error:', error)
            
            // Handle specific error types
            let errorMessage = 'Failed to register doctor'
            
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
        registerDoctor,
        resetStatus,
        isLoading: status === 'loading',
        isSuccess: status === 'success',
        isError: status === 'error',
        // Auth state info
        isAuthenticated: signedIn && !!accessToken,
        currentUser: user.username
    }
}