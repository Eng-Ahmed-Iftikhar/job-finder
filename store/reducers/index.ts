// third-party
import { combineReducers } from "redux";
import { apiReducers } from "api/services";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import notificationReducer from "./notificationSlice";

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  auth: authReducer,
  user: userReducer,
  notification: notificationReducer,
  ...apiReducers,
});

export type RootState = ReturnType<typeof reducers>; // ✅ this is important

export default reducers;
