import { useState } from 'react'
import { apiCreateConsultation } from '@/services/ConsultationService'
import { useAppSelector } from '@/store'
import type { ConsultationCreatePayload, ConsultationFormData } from '@/@types/consultation'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function useConsultation() {
    const [status, setStatus] = useState<Status>('idle')
    const [message, setMessage] = useState('')
    
    // Get current auth state
    const { accessToken, signedIn } = useAppSelector((state) => state.auth.session)
    const user = useAppSelector((state) => state.auth.user)

    const createConsultation = async (formData: ConsultationFormData) => {
        try {
            setStatus('loading')
            setMessage('')

            // Check if user is authenticated
            if (!signedIn || !accessToken) {
                throw new Error('Please login first to create consultation')
            }

            // Check if required user data is available
            if (!user.tenantId || !user.clinicId) {
                throw new Error('Tenant and clinic information not available. Please login again.')
            }

            // Transform form data to API payload
            const payload: ConsultationCreatePayload = {
                tenantId: user.tenantId,
                clinicId: user.clinicId,
                patientId: formData.patientId,
                doctorId: formData.doctorId,
                visitType: formData.visitType as 'CLINIC' | 'HOME' | 'ON_CALL' | 'FARM',
                vitals: {
                    temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
                    pulse: formData.pulse ? parseFloat(formData.pulse) : undefined,
                    bp: formData.systolic && formData.diastolic ? `${formData.systolic}/${formData.diastolic}` : undefined,
                    spo2: formData.spo2 ? parseFloat(formData.spo2) : undefined,
                },
                symptoms: formData.symptoms,
                notes: formData.notes || undefined
            }

            console.log('Sending consultation payload:', payload)

            const response = await apiCreateConsultation(payload)

            if (response.data && response.data.success) {
                setStatus('success')
                setMessage('Consultation saved successfully!')
                return {
                    success: true,
                    data: response.data.data,
                    message: 'Consultation saved successfully!'
                }
            } else {
                throw new Error('Failed to save consultation')
            }
        } catch (error: any) {
            setStatus('error')
            
            console.error('Consultation error:', error)
            
            // Handle specific error types
            let errorMessage = 'Failed to save consultation'
            
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
        createConsultation,
        resetStatus,
        isLoading: status === 'loading',
        isSuccess: status === 'success',
        isError: status === 'error',
        // Auth state info
        isAuthenticated: signedIn && !!accessToken,
        currentUser: user,
        tenantId: user.tenantId,
        clinicId: user.clinicId,
        // Check if current user is doctor
        isDoctor: user.roles?.some(role => role.roleName === 'DOCTOR') || false
    }
}