// third-party
import { combineReducers } from "redux";
import { apiReducers } from "api/services";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import notificationReducer from "./notificationSlice";
import jobReducer from "./jobSlice";

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  auth: authReducer,
  user: userReducer,
  notification: notificationReducer,
  job: jobReducer,
  ...apiReducers,
});

export type RootState = ReturnType<typeof reducers>; // ✅ this is important

export default reducers;
