const API_ROUTES = {
  auth: {
    sign_in: "/auth/login",
    sign_up: "/auth/register",
    social_login: "/auth/social-login",
    logout: "/auth/logout",
    me: "/auth/me",
    refresh: "/auth/refresh",
    profile: "/auth/profile?withPopulate=true",
  },
  file: {
    post: "/save",
    delete: "/delete-file",
  },
  document: {
    list: "/documents?page=:page&pageSize=:pageSize",
    listFilter: "/documents/filters",
    post: "/documents",
    get: "/documents/:id",
    update: "/documents/:id",
    delete: "/documents/:id",
  },
};

export default API_ROUTES;
