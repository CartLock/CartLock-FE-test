import * as actionTypes from "./actionTypes";
import Axios from "../../helper/axios";
import { createActivityLog } from "../../helper/commonHelper"

export const isLoading = () => {
  return {
    type: actionTypes.ISLOADING,
  };
};

export const isLoadingEkeyAssign = () => {
  return {
    type: actionTypes.ISLOADINGEKEYASSIGN,
  };
};

export const isPageLoading = () => {
  return {
    type: actionTypes.ISPAGELOADING,
  };
};


export const modiflySuccess = (success) => {
  return {
    type: actionTypes.MODIFY_SUCCESS,
    success: success,
  };
};


export const resetErrorAndSuccessState = () => {
  return {
    type: actionTypes.REST_ERROR_AND_SUCCESS_STATE
  };
};

//##### Listing #####
export const FailUserListing = (error) => {
  return {
    type: actionTypes.ERROR_USER_LISTING,
    error: error,
  };
};


export const successUserListing = (listing) => {
  return {
    type: actionTypes.USER_LIST,
    listing
  };
};


export const successUserDetails = (users) => {
    return {
    type: actionTypes.USER_DETAILS,
    payload: users,
  };
};

//#####################################################################33

export const updateUserList = (listing) => {
  return {
    type: actionTypes.UPDATE_USER_LIST,
    listing
  };
};



//##### Addition #####
export const FailUserAddition = (error) => {
  return {
    type: actionTypes.ERROR,
    error: error,
  };
};

export const additionSuccess = (user) => {
  return {
    type: actionTypes.SUCCESS,
    user,
  };
};


export const SuccessUserAddition = (response) => {
  return response;
};

export const SuccessMessageUserAddition = (message) => {
  return {
    type: actionTypes.SUCCESS,
    success: message,
  };
};


export const UpdateUserDetails = (users) => {
  return {
    
    type: actionTypes.USER_DETAILS,
    payload: users,
  };
};


export const SuccessAssignedEkeyListing = (listing) => {
  return {
    type: actionTypes.ASSIGNED_EKEY_LIST,
    listing
  };
};


export const SuccessEkeyListing = (listing) => {
  return {
    type: actionTypes.EKEY_LIST,
    listing
  };
};


export const SuccessTineZoneListing = (listing) => {
  return {
    type: actionTypes.TIMEZONE_LIST,
    listing
  };
};

export const successDeviceDetails = (details) => {
  return {
    type: actionTypes.DEVICE_DETAILS,
    payload: details,
  };
};


export const Fail = (error) => {
  return {
    type: actionTypes.ERROR,
    error: error,
  };
};


export const successActivityLogListing = (listing) => {
  return {
    type: actionTypes.ACTIVITY_LOG_LIST,
    listing
  };
};



export const token = () => {
  return localStorage.getItem("token")
}

export const registerUser = (requestPayload, history) => {
  return (dispatch) => {
    dispatch(isLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    
    Axios.post("/user/addUser", requestPayload, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(modiflySuccess(response.data.message));
         // createActivityLog('User Created', "", requestPayload) // create activity log
          localStorage.setItem("tempId", response.data.payload.id);
          history.push({
            pathname: "/modifyUser",
            isLoaderRequired: false
          });
        } else {
          dispatch(FailUserAddition(response.data.message));
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(FailUserAddition(err.response.data.message));
        }
      });
  };
};


export const userList = (needLoading = true) => {
  return (dispatch) => {
    if(needLoading === true){
      dispatch(isPageLoading());
    }
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.get("/user/getAllUsers", authCode)
      .then((response) => {
        if (response.status === 200) {
          // console.log("success", response);
          // dispatch({type:actionTypes.USER_LIST, payload:response.data.payload});
          dispatch(successUserListing(response))
        } else {
          dispatch(FailUserListing(response.data.message));
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(FailUserListing(err.response.data.message));
        }
      });
  };
};


export const userDetails = (userId, needLoading = true) => {
  console.log("hllo")
  return (dispatch) => {
    if(needLoading === true){
      dispatch(isPageLoading());
    }
    const authCode = { 
      headers: { 'Authorization': token() } 
    }

    // const params
    Axios.get("/user/getUserDetails?id="+userId, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(successUserDetails(response.data.payload));
        } else {
          dispatch(FailUserListing(response.data.message));
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(FailUserListing(err.response.data.message));
        }
      });
  };
};


export const modifyUserDetails = (requestPayload, userOldDetails="") => {
  return (dispatch) => {
    dispatch(isLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.put("/user/modifyUserDetails", requestPayload, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(modiflySuccess(response.data.message));
          if(userOldDetails.user_notes == "" && requestPayload.userNotes != ""){
           // createActivityLog('Notes Added to User', "", requestPayload) // create activity log
          }
          else if(userOldDetails.displayName != requestPayload.displayName && userOldDetails.last_name != requestPayload.phoneNumer && userOldDetails.e_mail != requestPayload.emailId && requestPayload.isInactive == "1"){
           // createActivityLog('User De-Activated', "", requestPayload)
          }
          else{
          //  createActivityLog('User Info Modified', "", {oldDetails: userOldDetails, modiflyedDetails: requestPayload}) // create activity log
          }
        } else {
          dispatch(FailUserAddition(response.data.message));
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(FailUserAddition(err.response.data.message));
        }
      });
  };
};


export const deleteUser = (userId, userDetails="") => {
  return (dispatch) => {
    dispatch(isLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }

    // const params
    Axios.delete("/user/deleteUser?id="+userId, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(modiflySuccess(response.data.message));
         // createActivityLog('Removed User', "", userDetails) // create activity log
        } else {
          dispatch(FailUserAddition(response.data.message));
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(FailUserAddition(err.response.data.message));
        }
      });
  };
};



export const assignEkeyToUser = (requestPayload, eKeyDetails="", userDetails="", oldKeyDetails="") => {
  return (dispatch) => {
    dispatch(isLoadingEkeyAssign());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.post("/user/assignKeyToUser", requestPayload, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(modiflySuccess(response.data.message));
          if(requestPayload.type == 'group'){
            //createActivityLog('Assign Device Group to user', "", requestPayload, requestPayload.eKey) // create activity log
          }
          else{
            if(requestPayload.assignedKeyId != ""){
              //createActivityLog('eKey Modified', requestPayload.eKey, {oldKeySchedule: oldKeyDetails, newKeySchedule: requestPayload, eKeyDetails: eKeyDetails, userDetails: userDetails})
            }
            else{
              //createActivityLog('eKey Assigned', requestPayload.eKey, {keySchedule: requestPayload, eKeyDetails: eKeyDetails, userDetails: userDetails})
            }
          }
        } else {
          dispatch(FailUserAddition(response.data.message));
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(FailUserAddition(err.response.data.message));
        }
      });
  };
};


export const assignEkeyList = (userId) => {
console.log("GetDeviceList")
  
  return (dispatch) => {
    // dispatch(isLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.get("/user/getAssignedEkeys?userId="+userId, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(SuccessAssignedEkeyListing(response));
        } else {
          dispatch(Fail(response.data.message));
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 422) {
          dispatch(Fail(err.response.data.message));
        }
      });
  };
};


export const deleteAssignedEkey = (id, keyDetails="", uDetail) => {
  return (dispatch) => {
    // dispatch(isLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }

    // const params
    Axios.delete("/user/deleteAssignedEkey?id="+id, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(modiflySuccess(response.data.message));
          createActivityLog('eKey Deleted', keyDetails.ekey_id, {keyDetails: keyDetails, userDetails: uDetail}) // create activity log
        } else {
          dispatch(Fail(response.data.message));
        }
      })
      .catch((err) => {
        if (err.response.status === 422) {
          dispatch(Fail(err.response.data.message));
        }
      });
  };
};


export const ekeyList = (type="device", userId="", needLoading = false) => {

  console.log("ekeyList:::"+ type+"::"+userId)
  return (dispatch) => {
    if(needLoading === true){
      dispatch(isPageLoading());
    }
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.get("/user/getEkeys?type="+type+"&userId="+userId, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(SuccessEkeyListing(response));
        } else {
          dispatch(Fail(response.data.message));
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          dispatch(Fail(err.response.data.message));
        }
      });
  };
};


export const timeZoneList = () => {
  return (dispatch) => {
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.get("/user/getAllTimeZone", authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(SuccessTineZoneListing(response));
        } else {
          dispatch(Fail(response.data.message));
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 422) {
          dispatch(Fail(err.response.data.message));
        }
      });
  };
};


export const getDeviceDetails = (deviceId,needLoading = true) => {


  console.log("getDeviceDetails Hited with "+deviceId)
  console.log("JWT::"+token())
  return (dispatch) => {
    if(needLoading === true){
      dispatch(isPageLoading());
    }
 
    const authCode = { 
      headers: { 'Authorization': token() } 
    }

    // const params
    Axios.get("/user/getDeviceDetails?deviceId="+deviceId, authCode)
      .then((response) => {
        if (response.status === 200) {
  console.log("Success")
          dispatch(successDeviceDetails(response.data.payload));
        } else {
          dispatch(Fail(response.data.message));
        }
      })
      .catch((err) => {
        if (err.response.status === 422) {
          dispatch(Fail(err.response.data.message));
        }
      });
  };
};










export const activityLogList = (requestPayload, pageLoading=true) => {
  return (dispatch) => {
    if(pageLoading){
      dispatch(isPageLoading());
    }
    dispatch(isLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.post("/user/activityLogs", requestPayload, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(successActivityLogListing(response.data.payload.rows));
        } else {
          dispatch(Fail(response.data.message));
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          dispatch(Fail(err.response.data.message));
        }
      });
  };
};



export const success = (success) => {
  return {
    type: actionTypes.SUCCESS,
    success: success
  };
};


export const createActivityLogNotes = (requestPayload) => {
  return (dispatch) => {
    dispatch(isLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.post("/user/createActivityLogNotes", requestPayload, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(success(response.data));
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


export const successActivityLogNotesListing = (listing) => {
  return {
    type: actionTypes.ACTIVITY_LOG_NOTES_LIST,
    listing
  };
};

export const activityLogNotesList = (id) => {
  return (dispatch) => {
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.get("/user/getActivityLogNotes?id="+id, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(successActivityLogNotesListing(response.data.payload));
        } else {
          dispatch(Fail(response.data.message));
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          dispatch(Fail(err.response.data.message));
        }
      });
  };
};