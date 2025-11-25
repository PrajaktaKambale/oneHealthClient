import {
  apiFetchMenusByRole,
  apiSignIn,
  apiSignOut,
  apiSignUp,
} from "@/services/AuthService";

import {
  setUser,
  signInSuccess,
  signOutSuccess,
  useAppSelector,
  useAppDispatch,
  setNavigationConfig,
} from "@/store";

import appConfig from "@/configs/app.config";
import { REDIRECT_URL_KEY } from "@/constants/app.constant";
import { useNavigate } from "react-router-dom";
import useQuery from "./useQuery";
import type { SignInCredential, SignUpCredential } from "@/@types/auth";
import { mapBackendMenusToNavigation } from "./useMenuMapper";

type Status = "success" | "failed";

function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const query = useQuery();

  const { accessToken, signedIn } = useAppSelector(
    (state) => state.auth.session
  );

  // Debug authentication state
  console.log('🔐 useAuth: Current auth state:', {
    accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : null,
    signedIn,
    authenticated: Boolean(accessToken && signedIn)
  });

  // ---------------------------------------------------------
  // FETCH ROLE MENUS & MAP TO NAVIGATION CONFIG
  // ---------------------------------------------------------
  const fetchRoleMenus = async (roleId: string, user: any) => {
    try {
      const resp = await apiFetchMenusByRole(roleId);
      if (resp.success && resp.data) {
        const mappedMenus = mapBackendMenusToNavigation(
          resp.data.filter((m) => m.childOf === null)
        );

        dispatch(setNavigationConfig(mappedMenus));

        console.log("Mapped Menus:", mappedMenus);
        console.log("Logged-in user:", user);
      }
    } catch (err) {
      console.error("Failed to fetch menus:", err);
    }
  };

  // ---------------------------------------------------------
  // SIGN IN
  // ---------------------------------------------------------
  const signIn = async (
    values: SignInCredential
  ): Promise<
    | {
        status: Status;
        message: string;
      }
    | undefined
  > => {
    try {
        console.log('🔄 SignIn: Starting authentication...')
        const resp = await apiSignIn(values)
        console.log('📡 SignIn: API response received:', resp)
        console.log('📡 SignIn: resp.data structure:', resp.data)
        console.log('📡 SignIn: resp.data.data structure:', resp.data?.data)
        
        if (resp && resp.success && resp.data) {
            const signInData = resp.data  // This is the SignInResponse
            console.log('🔍 SignIn: signInData structure:', JSON.stringify(signInData, null, 2))
            
            // Try both access patterns to see which one works
            const directAccess = (signInData as any)
            const nestedAccess = (signInData as any).data
            
            console.log('🔍 Direct access - user exists:', !!directAccess.user)
            console.log('🔍 Direct access - accessToken exists:', !!directAccess.accessToken)
            console.log('🔍 Nested access - user exists:', !!nestedAccess?.user)
            console.log('🔍 Nested access - accessToken exists:', !!nestedAccess?.accessToken)
            
            // Use the correct access pattern based on your API response
            const { accessToken, refreshToken, expiresIn, user } = directAccess
            console.log('✅ SignIn: Authentication successful, dispatching Redux actions...')
            
            dispatch(signInSuccess({ accessToken, refreshToken, expiresIn }))
            
            if (user) {
                // Map roles to authority for backward compatibility
                const authority = user.roles?.map((role: any) => role.roleName) || []
                const userPayload = {
                    id: user.id,
                    username: user.username,
                    emailId: user.emailId,
                    fullName: user.fullName,
                    tenantId: user.tenantId,
                    clinicId: user.clinicId,
                    roles: user.roles,
                    authority: authority,
                    tenant: user.tenant,
                    clinics: user.clinics,
                    avatar: '', // Default empty avatar
                }
                console.log('👤 SignIn: Setting user data:', userPayload)
                dispatch(setUser(userPayload))
            }
            
            const redirectUrl = query.get(REDIRECT_URL_KEY)
            const targetPath = redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
            console.log('🚀 SignIn: Navigating to:', targetPath)
            
            navigate(targetPath)
            
            console.log('✅ SignIn: Process completed successfully')
            return {
                status: 'success',
                message: '',
            }
        } else {
            console.log('❌ SignIn: API response indicates failure:', resp)
            return {
                status: 'failed',
                message: resp?.message || 'Authentication failed',
            }
        }
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (errors: any) {
      return {
        status: "failed",
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  // ---------------------------------------------------------
  // SIGN UP
  // ---------------------------------------------------------
  const signUp = async (
    values: SignUpCredential
  ): Promise<{ status: Status; message: string } | undefined> => {
    try {
      const resp = await apiSignUp(values);

      if (resp.data && resp.data.success) {
        const { accessToken, refreshToken, expiresIn, user } = resp.data.data;

        dispatch(signInSuccess({ accessToken, refreshToken, expiresIn }));

        if (user) {
          const authority = user.roles?.map((role) => role.roleName) || [];

          dispatch(
            setUser({
              id: user.id,
              username: user.username,
              emailId: user.emailId,
              fullName: user.fullName,
              tenantId: user.tenantId,
              clinicId: user.clinicId,
              roles: user.roles,
              authority,
              tenant: user.tenant,
              clinics: user.clinics,
              avatar: "",
            })
          );

          const roleId = user.roles?.[0]?.roleId;
          if (roleId) {
            await fetchRoleMenus(roleId, user);
          }
        }

        const redirectUrl = query.get(REDIRECT_URL_KEY);
        navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);

        return {
          status: "success",
          message: "",
        };
      }
    } catch (errors: any) {
      return {
        status: "failed",
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  // ---------------------------------------------------------
  // SIGN OUT
  // ---------------------------------------------------------
  const handleSignOut = () => {
    dispatch(signOutSuccess());
    dispatch(
      setUser({
        avatar: "",
        username: "",
        emailId: "",
        fullName: "",
        tenantId: "",
        clinicId: "",
        roles: [],
        authority: [],
        tenant: undefined,
        clinics: [],
      })
    );
    navigate(appConfig.unAuthenticatedEntryPath);
  };

    const signOut = async () => {
        try {
            // Call backend logout API with token
            if (accessToken) {
                await apiSignOut({
                    allDevices: false,
                    token: accessToken
                })
            }
        } catch (error) {
            // Continue with logout even if API call fails
            console.error('Logout API error:', error)
        } finally {
            // Always clear local state regardless of API call result
            handleSignOut()
        }
    }

  return {
    authenticated: Boolean(accessToken && signedIn),
    signIn,
    signUp,
    signOut,
  };
}

export default useAuth;
