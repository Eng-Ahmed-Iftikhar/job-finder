import { authApi } from "@/api/services/authApi";
import { createListenerMiddleware } from "@reduxjs/toolkit";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../reducers/notificationSlice";

export const userNotificationMiddleware = createListenerMiddleware();

// listen to me matchfilled to show welcome back notification
userNotificationMiddleware.startListening({
  matcher: authApi.endpoints.me.matchFulfilled,
  effect: async (action, listenerApi) => {
    if (action.payload.profile.role !== "EMPLOYEE") {
      listenerApi.dispatch(
        showErrorNotification("Access denied: Unauthorized role")
      );
      return;
    }
    listenerApi.dispatch(
      showSuccessNotification(
        `Welcome back, ${action.payload.profile.generalInfo?.firstName}!`
      )
    );
  },
});

// Listen to logout success
userNotificationMiddleware.startListening({
  matcher: authApi.endpoints.logout.matchFulfilled,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(showSuccessNotification("Logged out successfully"));
  },
});
