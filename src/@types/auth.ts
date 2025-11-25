export type SignInCredential = {
    identifier: string
    password: string
}

export type SignInResponse = {
    success: boolean
    data: {
        user: {
            id: string
            username: string
            emailId: string
            fullName: string
            tenantId: string
            clinicId: string
            roles: Array<{
                roleId: string
                roleName: string
                roleCategory: string | null
            }>
            tenant: {
                id: string
                name: string
                slug: string
            }
            clinics: Array<{
                id: string
                name: string
                clinicType: string
            }>
        }
        accessToken: string
        refreshToken: string
        expiresIn: number
    }
    message: string
    timestamp: string
    method: string
    path: string
    requestId: string
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    userName: string
    email: string
    password: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}

export type LogoutPayload = {
    allDevices: boolean
    token: string
}
