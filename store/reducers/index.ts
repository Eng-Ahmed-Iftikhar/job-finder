// third-party
import { combineReducers } from "redux";
import { apiReducers } from "api/services";
import authReducer from "./authSlice";

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  auth: authReducer,
  ...apiReducers,
});

export type RootState = ReturnType<typeof reducers>; // ✅ this is important

export default reducers;
