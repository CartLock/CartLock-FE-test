import * as actionTypes from "./actionTypes";
import Axios from "../../helper/axios";
import { createActivityLog } from "../../helper/commonHelper"

export const isLoading = () => {
  return {
    type: actionTypes.ISLOADING,
  };
};

export const isPageLoading = () => {
  return {
    type: actionTypes.ISPAGELOADING,
  };
};

export const success = (success) => {
  return {
    type: actionTypes.SUCCESS,
    success: success
  };
};


export const fail = (error) => {
  return {
    type: actionTypes.ERROR,
    error: error,
  };
};


export const resetErrorAndSuccessState = () => {
  return {
    type: actionTypes.REST_ERROR_AND_SUCCESS_STATE
  };
};


export const roleDetailsSuccess = (details) => {
  return {
    type: actionTypes.ROLE_DETAILS,
    payload: details,
  };
};



export const listSuccess = (listing) => {
  return {
    type: actionTypes.ROLE_LIST,
    listing
  };
};


export const userListSuccess = (listing) => {
  return {
    type: actionTypes.ROLE_USER_LIST,
    listing
  };
};


export const assignedRoleUserListSuccess = (listing) => {
  return {
    type: actionTypes.ASSINED_ROLE_USER_LIST,
    listing
  };
};



export const token = () => {
  return localStorage.getItem("token")
}


export const roleList = (needLoading = false) => {
  return (dispatch) => {
    if(needLoading === true){
      dispatch(isPageLoading());
    }
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.get("/user/getRoles", authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(listSuccess(response.data.payload));
        } else {
          dispatch(fail(response.data.message));
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          dispatch(fail(err.response.data.message));
        }
      });
  };
};


export const UserListForRole = () => {
  return (dispatch) => {
    dispatch(isPageLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.get("/user/getUsers", authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(userListSuccess(response.data.payload));
        } else {
          dispatch(fail(response.data.message));
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          dispatch(fail(err.response.data.message));
        }
      });
  };
};


export const assignedRoleUserList = () => {
  return (dispatch) => {
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.get("/user/getUsers?type=assigned", authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(assignedRoleUserListSuccess(response.data.payload));
        } else {
          dispatch(fail(response.data.message));
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          dispatch(fail(err.response.data.message));
        }
      });
  };
};


export const createRole = (requestPayload) => {
  return (dispatch) => {
    dispatch(isLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.post("/user/createRole", requestPayload, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(success(response.data));
         // createActivityLog('Created Role', "", requestPayload) // create activity log
        } else {
          dispatch(fail(response.data.message));
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(fail(err.response.data.message));
        }
      });
  };
};


export const modifyRole = (requestPayload) => {
  return (dispatch) => {
    dispatch(isLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.put("/user/modifyRole", requestPayload, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(success(response.data));
         // createActivityLog('Modified Role', "", requestPayload) // create activity log
        } else {
          dispatch(fail(response.data.message));
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(fail(err.response.data.message));
        }
      });
  };
};


export const getRoleDetails = (id) => {
  return (dispatch) => {
    dispatch(isPageLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.get("/user/getRoleDetails?id="+id, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(roleDetailsSuccess(response.data.payload));
        } else {
          dispatch(fail(response.data.message));
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(fail(err.response.data.message));
        }
      });
  };
};


export const deleteRole = (id, details="") => {
  return (dispatch) => {
    dispatch(isLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.delete("/user/deleteRole?id="+id, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(success(response.data));
          //createActivityLog('Removed Role', "", details) // create activity log
        } else {
          dispatch(fail(response.data.message));
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(fail(err.response.data.message));
        }
      });
  };
};


export const assignRole = (requestPayload) => {
  return (dispatch) => {
    dispatch(isLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.post("/user/assignRoleToUser", requestPayload, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(success(response.data));
          //createActivityLog('Assigned Role to User', "", requestPayload) // create activity log
        } else {
          dispatch(fail(response.data.message));
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(fail(err.response.data.message));
        }
      });
  };
};


export const removeRoleFromUser = (id, details="") => {
  return (dispatch) => {
    dispatch(isLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.delete("/user/removeRoleFromUser?id="+id, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(success(response.data));
          //createActivityLog('Removed Role from User', "", details) // create activity log
        } else {
          dispatch(fail(response.data.message));
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(fail(err.response.data.message));
        }
      });
  };
};