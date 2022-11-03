import authReducer from "./auth";
import userReducer from "./userReducers";
import deviceGroupReducer from "./deviceGroupReducers";
import companyReducer from "./companyReducers";
import companySettingsReducer from "./companySettingsReducers";
import roleReducer from "./roleReducers";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  deviceGroup: deviceGroupReducer,
  company: companyReducer,
  companySettings: companySettingsReducer,
  role: roleReducer
});

export default rootReducer;