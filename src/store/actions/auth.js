import * as actionTypes from "./actionTypes";
import Axios from "../../helper/axios";
import { CollectionsOutlined } from "@material-ui/icons";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (user) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    user,
  };
};

export const isLoading = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const Success = (response) => {
  return response;
};
export const ForgotSuccess = (message) => {
  return {
    type: actionTypes.FORGOT_SUCCESS,
    // success_message: message,
    forgot_message: message,
  };  
}; 
export const Fail = (error) => {
  return {
    type: actionTypes.AUTHERROR,
    error: error,
  };
};

export const SuccessMessage = (message) => {
  return {
    type: actionTypes.SUCCESS_MESSAGE_AUTH,
    success_message: message,
  };
};


export const permissionDetailsSuccess = (details) => {
  return {
    type: actionTypes.PERMISSION_DETAILS,
    payload: details,
  };
};



export const token = () => {
  return localStorage.getItem("token")
}


export const auth = (username, password, companyId) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = {
      userName: username,
      password: password,
      companyId: companyId,
    };
    Axios.post("/user/login", authData)
      .then((response) => {
        if (response.status === 200) {
          console.log("success", response);
          localStorage.setItem("token", response.data.token);
          // localStorage.setItem("userData", JSON.stringify(response.data.payload));
          localStorage.setItem("displayName", response.data.payload.dispay_name);
          localStorage.setItem("logedUserId", response.data.payload.id);
          localStorage.setItem("userRole", response.data.payload.role_id);
          localStorage.setItem("tempCompId", response.data.payload.comp_id);  
          localStorage.setItem("companyID", response.data.payload.comp_id);
          localStorage.setItem("companyName", response.data.payload.companyName);
          console.log("CompanyId::::"+localStorage.getItem("companyID")) 
          localStorage.setItem("roleName", response.data.payload.roleName);        
          dispatch(authSuccess(response, response.data, response.data.msg));
        } else {
          dispatch(Fail(response.data.message));
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(Fail(err.response.data.message));
        }
      });
  };
};


export const forgotpassword = (username, companyId) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = {
      userName: username, 
      companyId: companyId,
    };

    
    Axios.post("../api/user/forgetPassword", authData)
      .then((response) => {
        if (response.status === 200) {         
          dispatch(ForgotSuccess(response.data.message)); 
          //createActivityLogWithoutLogin('Forgot Password Link Sent', "", authData,"",authData)
        } else {
          dispatch(Fail(response.data.message));
        }
      })  
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(Fail(err.response.data.message));
        }
      });
  };
};
export const permissions = () => {

console.log("Getting role")
  return (dispatch) => {
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    const roleId = localStorage.getItem("userRole")
    Axios.get("/user/getUserPermissions?roleId="+roleId, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(permissionDetailsSuccess(response.data.payload));
        } else {
          dispatch(Fail(response.data.message));
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(Fail(err.response.data.message));
        }
      });
  };
};

export const resetErrorAndSuccessState = () => { 
  return {
    type: actionTypes.REST_ERROR_AND_SUCCESS_STATE
  };                             
};