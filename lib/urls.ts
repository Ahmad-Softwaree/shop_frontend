export const URLs = {
  // Auth endpoints
  LOGIN: `/auth/login`,
  REGISTER: `/auth/register`,
  GET_AUTH: `/auth`,
  CHECK_LOGIN_OTP: `/auth/verify-2fa`,
  VERIFY_OTP: `/auth/verify-otp`,
  RESEND_OTP: `/auth/resend-otp`,
  CHANGE_PASSWORD: `/auth/change-password`,
  PASSWORD_RESET: `/auth/password-reset`,
  UPDATE_PASSWORD: `/auth/update-password`,
  GET_2FA_SECRET: `/auth/2fa/secret`,
  ACTIVATE_2FA: `/auth/2fa/activate`,
  DEACTIVATE_2FA: `/auth/2fa/deactivate`,
  LOGOUT: `/auth/logout`,
  VERIFY_RESET_PASSWORD_TOKEN: `/auth/verify-reset-password-token`,
  DELETE_OLD_IMAGE: `/shared/delete_old_image`,
  CHECKOUT: `/checkout/session`,

  // User endpoints
  UPDATE_PROFILE: (userId: string) => `/users/${userId}`,

  // Product endpoints
  PRODUCTS: `/product`,
  BUY_PRODUCT: (id: string | number) => `/product/${id}/buy`,
  MARK_AVAILABLE: (id: string | number) => `/product/${id}/mark-available`,
  PRODUCT_BY_ID: (id: string | number) => `/product/${id}`,
} as const;
