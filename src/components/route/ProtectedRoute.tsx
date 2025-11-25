import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '@/utils/hooks/useAuth'

const { unAuthenticatedEntryPath } = appConfig

const ProtectedRoute = () => {
    const { authenticated } = useAuth()

    const location = useLocation()

    console.log('🛡️ ProtectedRoute: Checking authentication...', {
        authenticated,
        currentPath: location.pathname
    })

    if (!authenticated) {
        console.log('🚫 ProtectedRoute: User not authenticated, redirecting to login')
        return (
            <Navigate
                replace
                to={`${unAuthenticatedEntryPath}?${REDIRECT_URL_KEY}=${location.pathname}`}
            />
        )
    }

    console.log('✅ ProtectedRoute: User authenticated, allowing access')
    return <Outlet />
}

export default ProtectedRoute
