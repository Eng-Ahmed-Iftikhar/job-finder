const API_ROUTES = {
  auth: {
    sign_in: "/auth/sign-in",
    sign_up: "/auth/sign-up",
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
