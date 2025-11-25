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
      const resp = await apiSignIn(values);

      if (resp.data && resp.data.success) {
        const { accessToken, refreshToken, expiresIn, user } = resp.data.data;

        // Store tokens
        dispatch(signInSuccess({ accessToken, refreshToken, expiresIn }));

        // Store user object
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

          // Fetch role menus dynamically
          const roleId = user.roles?.[0]?.roleId;
          if (roleId) {
            await fetchRoleMenus(roleId, user);
          }
        }

        // Redirect
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
    authenticated: Boolean(accessToken && signedIn),
    signIn,
    signUp,
    signOut,
  };
}

export default useAuth;
