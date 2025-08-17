const API_ROUTES = {
  auth: {
    sign_in: "/auth/login",
    sign_up: "/auth/register",
    social_login: "/auth/social-login",
    logout: "/auth/logout",
    me: "/auth/me",
    refresh: "/auth/refresh",
    profile: "/auth/profile?withPopulate=true",
    send_phone_verification: "/auth/send-phone-verification",
    verify_phone_code: "/auth/verify-phone-code",
  },
  file: {
    post: "/save",
    delete: "/delete-file",
    upload: "/files/upload",
  },
  document: {
    list: "/documents?page=:page&pageSize=:pageSize",
    listFilter: "/documents/filters",
    post: "/documents",
    get: "/documents/:id",
    update: "/documents/:id",
    delete: "/documents/:id",
  },
  user: {
    me: "/users/me",
    profile: "/users/me/profile",
    phoneNumber: "/users/me/phone-number",
    resume: "/users/me/resume",
  },
};

export default API_ROUTES;
