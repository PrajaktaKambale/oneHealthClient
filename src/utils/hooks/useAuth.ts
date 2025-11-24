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

  const fetchRoleMenus = async (roleId: string) => {
    try {
      const resp = await apiFetchMenusByRole(roleId);
      if (resp.success && resp.data) {
        const mappedMenus = mapBackendMenusToNavigation(
          resp.data.filter((m) => m.childOf === null)
        );
        console.log("mapp", mappedMenus);
        dispatch(setNavigationConfig(mappedMenus));
      }
    } catch (err) {
      console.error("Failed to fetch menus:", err);
    }
  };

  //   const signIn = async (
  //     values: SignInCredential
  //   ): Promise<
  //     | {
  //         status: Status;
  //         message: string;
  //       }
  //     | undefined
  //   > => {
  //     try {
  //       const resp = await apiSignIn(values);
  //       if (resp.data && resp.data.success) {
  //         const { accessToken, refreshToken, expiresIn, user } = resp.data.data;
  //         dispatch(signInSuccess({ accessToken, refreshToken, expiresIn }));
  //         if (user) {
  //           // Map roles to authority for backward compatibility
  //           const authority = user.roles?.map((role) => role.roleName) || [];
  //           dispatch(
  //             setUser({
  //               id: user.id,
  //               username: user.username,
  //               emailId: user.emailId,
  //               fullName: user.username, // Use username as fullName since it's not in response
  //               roleId: user.roles.map((r: any) => r.roleId),
  //               roleName: user.roles.map((r: any) => r.roleName),
  //               roleCategory: user.roles.map((r: any) => r.roleCategory),
  //               authority: authority,
  //               avatar: "", // Default empty avatar
  //             })
  //           );
  //           const roleId = user.roles[0]?.roleId || "";
  //           if (roleId) {
  //             await fetchRoleMenus(roleId);
  //           }
  //         }
  //         const redirectUrl = query.get(REDIRECT_URL_KEY);
  //         navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);
  //         return {
  //           status: "success",
  //           message: "",
  //         };
  //       }
  //       // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  //     } catch (errors: any) {
  //       return {
  //         status: "failed",
  //         message: errors?.response?.data?.message || errors.toString(),
  //       };
  //     }
  //   };

  
const signIn = async (
    values: SignInCredential,
): Promise<
    | {
          status: Status
          message: string
      }
    | undefined
> => {
    try {
        const resp = await apiSignIn(values)
        if (resp.data && resp.data.success) {
            const { accessToken, refreshToken, expiresIn, user } = resp.data.data
            dispatch(signInSuccess({ accessToken, refreshToken, expiresIn }))
            if (user) {
                // Map roles to authority for backward compatibility
                const authority = user.roles?.map(role => role.roleName) || []
                dispatch(
                    setUser({
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
                    }),
                )
            }
            const redirectUrl = query.get(REDIRECT_URL_KEY)
            navigate(
                redirectUrl
                    ? redirectUrl
                    : appConfig.authenticatedEntryPath,
            )
            return {
                status: 'success',
                message: '',
            }
        }
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (errors: any) {
        return {
            status: 'failed',
            message: errors?.response?.data?.message || errors.toString(),
        }
    }
};

const signUp = async (values: SignUpCredential) => {
    try {
        const resp = await apiSignUp(values)
        if (resp.data && resp.data.success) {
            const { accessToken, refreshToken, expiresIn, user } = resp.data.data
            dispatch(signInSuccess({ accessToken, refreshToken, expiresIn }))
            if (user) {
                const authority = user.roles?.map(role => role.roleName) || []
                dispatch(
                    setUser({
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
                        avatar: '',
                    }),
                )
            }
            const redirectUrl = query.get(REDIRECT_URL_KEY)
            navigate(
                redirectUrl
                    ? redirectUrl
                    : appConfig.authenticatedEntryPath,
            )
            return {
                status: 'success',
                message: '',
            }
        }
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (errors: any) {
        return {
            status: 'failed',
            message: errors?.response?.data?.message || errors.toString(),
        }
    }
};
    const handleSignOut = () => {
        dispatch(signOutSuccess())
        dispatch(
            setUser({
                avatar: '',
                username: '',
                emailId: '',
                fullName: '',
                tenantId: '',
                clinicId: '',
                roles: [],
                authority: [],
                tenant: undefined,
                clinics: [],
            }),
        )
        navigate(appConfig.unAuthenticatedEntryPath)
    }

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
    authenticated: accessToken && signedIn,
    signIn,
    signUp,
    signOut,
  };
}

export default useAuth;
