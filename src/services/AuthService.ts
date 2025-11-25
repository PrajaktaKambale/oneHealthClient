import { ApiResponse, FetchMenusResponse } from "@/@types/common";
import ApiService from "./ApiService";
import type {
  SignInCredential,
  SignUpCredential,
  ForgotPassword,
  ResetPassword,
  SignInResponse,
  SignUpResponse,
    LogoutPayload,
} from "@/@types/auth";

export async function apiSignIn(data: SignInCredential) {
  return ApiService.fetchData<SignInResponse>({
    url: "/auth/login",
    method: "post",
    data,
  });
}

export async function apiSignUp(data: SignUpCredential) {
  return ApiService.fetchData<SignUpResponse>({
    url: "/sign-up",
    method: "post",
    data,
  });
}

export async function apiSignOut(data: LogoutPayload) {
    return ApiService.fetchData({
        url: '/auth/logout',
        method: 'post',
        data,
    })
}

export async function apiForgotPassword(data: ForgotPassword) {
  return ApiService.fetchData({
    url: "/forgot-password",
    method: "post",
    data,
  });
}

export async function apiResetPassword(data: ResetPassword) {
  return ApiService.fetchData({
    url: "/reset-password",
    method: "post",
    data,
  });
}

// Fetch menus by role
export async function apiFetchMenusByRole(
  roleId: string
): Promise<ApiResponse<FetchMenusResponse>> {
  return ApiService.fetchData<FetchMenusResponse>({
    url: `/o/role/${roleId}/menus`,
    method: "GET",
  });
}
