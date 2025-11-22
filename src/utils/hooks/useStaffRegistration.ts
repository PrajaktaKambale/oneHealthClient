import { useState } from 'react'
import { apiCreateStaff } from '@/services/StaffService'
import { useAppSelector } from '@/store'
import type { StaffCreatePayload, StaffFormData } from '@/@types/staff'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function useStaffRegistration() {
    const [status, setStatus] = useState<Status>('idle')
    const [message, setMessage] = useState('')
    
    // Get current auth state
    const { accessToken, signedIn } = useAppSelector((state) => state.auth.session)
    const user = useAppSelector((state) => state.auth.user)

    const registerStaff = async (formData: StaffFormData) => {
        try {
            setStatus('loading')
            setMessage('')

            // Check if user is authenticated
            if (!signedIn || !accessToken) {
                throw new Error('Please login first to register staff')
            }

            // Check if tenantId is available
            if (!user.tenantId) {
                throw new Error('Tenant information not available. Please login again.')
            }

            // Validate password confirmation
            if (formData.password !== formData.confirmPassword) {
                throw new Error('Passwords do not match')
            }

            // Transform form data to API payload
            const payload: StaffCreatePayload = {
                tenantId: user.tenantId,
                clinicId: formData.clinicId,
                name: formData.fullName,
                phoneNumber: formData.phone,
                email: formData.email,
                username: formData.username,
                password: formData.password,
                sex: formData.gender as 'MALE' | 'FEMALE' | 'OTHER',
                roleId: formData.roleId // Use selected role ID
            }

            console.log('Sending staff payload:', payload)

            const response = await apiCreateStaff(payload)

            if (response.data && response.data.success) {
                setStatus('success')
                setMessage('Staff registered successfully!')
                return {
                    success: true,
                    data: response.data.data,
                    message: 'Staff registered successfully!'
                }
            } else {
                throw new Error('Registration failed')
            }
        } catch (error: any) {
            setStatus('error')
            
            console.error('Staff registration error:', error)
            
            // Handle specific error types
            let errorMessage = 'Failed to register staff'
            
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
        registerStaff,
        resetStatus,
        isLoading: status === 'loading',
        isSuccess: status === 'success',
        isError: status === 'error',
        // Auth state info
        isAuthenticated: signedIn && !!accessToken,
        currentUser: user.username,
        tenantId: user.tenantId
    }
}