export const API_ROUTE = {
  AUTH: {
    TEMPORARY_LOGIN: "/auth/login/temporary",
    LOGIN: "/auth/login",
    VERIFY_LOGIN_OTP: "/auth/login/verify-otp",

    SET_PASSWORD: "/auth/password/set-password",
    RESET_PASSWORD: "/auth/password/reset-password",
    VERIFY_RESET_OTP: "/auth/password/verify-otp",
  },

  INVITE: {
    VERIFY: "/invite/verify",
  },

  PROJECT: {
    CREATE_PROJECT: "/projects/create",
    GET_PROJECTS: "/projects",
    GET_PROJECT_BY_ID: "/projects",
    UPDATE_PROJECT: "/projects",
    DELETE_PROJECT: "/projects",
  },

  STUDIO: {
    CREATE_STUDIO: "/api/studios/create",
    GET_STUDIOS: "/api/studios",
    GET_STUDIO_BY_ID: "/api/studios",
    UPDATE_STUDIO: "/api/studios",
    DELETE_STUDIO: "/api/studios",
  },
};

