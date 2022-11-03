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


export const deviceGroupDetailsSuccess = (details) => {
  return {
    type: actionTypes.DEVICE_GROUP_DETAILS,
    payload: details,
  };
};


export const resetErrorAndSuccessState = () => {
  return {
    type: actionTypes.REST_ERROR_AND_SUCCESS_STATE
  };
};


export const availableDeviceListSuccess = (listing) => {
  return {
    type: actionTypes.AVAILABLE_DEVICE__LIST,
    listing
  };
};


export const generatedTicketsListSuccess = (listing) => {
  return {
    type: actionTypes.GENERATED_TICKET_LIST,
    listing
  };
};


export const deviceGroupListSuccess = (listing) => {
  return {
    type: actionTypes.DEVICE_GROUP_LIST,
    listing
  };
};

export const updateAvailableDeviceList = (listing) => {
  return {
    type: actionTypes.UPDATE_DEVICE__LIST,
    listing
  };
};


export const updateDeviceGroupList = (listing) => {
  return {
    type: actionTypes.UPDATE_DEVICE_GROUP_LIST,
    listing
  };
};


export const generatedTicketsDetailsSuccess = (details) => {
  return {
    type: actionTypes.GENERATED_TICKET_DETAILS,
    payload: details,
  };
};

export const modiflySuccess = (success) => {
  return {
    type: actionTypes.MODIFY_SUCCESS,
    success: success,
  };
};
export const FailUserAddition = (error) => {
  return {
    type: actionTypes.ERROR,
    error: error,
  };
};


export const token = () => {
  return localStorage.getItem("token")
}

//add Device
//export const registerdevice = (requestPayload, history) => {
  export const registerdevice = (requestPayload,history) => {
  return (dispatch) => {
      dispatch(isPageLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.post("/deviceGroup/createDeviceBatch", requestPayload, authCode)
      .then((response) => {
        if (response.status === 200) {
          const newbatchID=response.data.batchId+1;
          console.log( response.data.batchId
            +"------newly created batch Id")
          dispatch(FailUserAddition(response.data.message));
          //createActivityLog('User Created', "", requestPayload) // create activity log
          localStorage.setItem("NewBatchId", response.data.batchId);
          history.push({
            pathname: "/deviceDetails",
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


export const availableDeviceList = (groupId = "", needLoading = false) => {
  return (dispatch) => {
    if(needLoading === true){
      dispatch(isPageLoading());
    }
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.get("/deviceGroup/getAvailableDevices?groupId="+groupId, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(availableDeviceListSuccess(response));
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


export const deviceGroupList = (needLoading = false) => {
  return (dispatch) => {
    if(needLoading === true){
      dispatch(isPageLoading());
    }
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.get("/deviceGroup/getDeviceGroups", authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(deviceGroupListSuccess(response));
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


export const createDeviceGroup = (requestPayload, history) => {
  return (dispatch) => {
    dispatch(isLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.post("/deviceGroup/createDeviceGroup", requestPayload, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(success(response.data));
          requestPayload.groupId = response.data.payload.id
          //createActivityLog('Device Group Created', "", requestPayload, response.data.payload.id) // create activity log
          if(history.location.isReturn){
            history.push({
              pathname: "/deviceGroups"
            });
          }
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


export const modifyDeviceGroup = (requestPayload, oldGroupDetails="") => {
  return (dispatch) => {
    dispatch(isLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.put("/deviceGroup/modifyDeviceGroup", requestPayload, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(success(response.data));
          if(requestPayload.status == '3'){
           // createActivityLog('Device Group De-Activated', "", requestPayload, requestPayload.id) // create activity log
          }
          else{
           // createActivityLog('Device Group Modified', "", {newGroupDetails: requestPayload, oldGroupDetails: oldGroupDetails}, requestPayload.id) // create activity log
          }
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


export const deviceGroupDetails = (id) => {
  return (dispatch) => {
    dispatch(isLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.get("/deviceGroup/getDeviceGroupDetails?id="+id, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(deviceGroupDetailsSuccess(response.data.payload));
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


export const deleteDeviceGroup = (id, details="") => {
  return (dispatch) => {
    const authCode = { 
      headers: { 'Authorization': token() } 
    }

    // const params
    Axios.delete("/user/deleteDeviceGroup?id="+id, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(success(response.data));
          //createActivityLog('Removed Device Group', "", details) // create activity log
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


export const getAllGeneratedTickets = (needLoading = false) => {
  return (dispatch) => {
    if(needLoading === true){
      dispatch(isPageLoading());
    }
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.get("/support/getAllGeneratedTickets", authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(generatedTicketsListSuccess(response));
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


export const getGeneratedTicketDetails = (id, needLoading = true) => {
  return (dispatch) => {
    if(needLoading === true){
      dispatch(isPageLoading());
    }
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.get("/support/generatedTicketDetails?id="+id, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(generatedTicketsDetailsSuccess(response.data.payload));
        } else {
          dispatch(fail(response.data.message));
        }
      })
      .catch((err) => {
        // console.log(err.message);
        if (err.response.status === 401) {
          dispatch(fail(err.response.data.message));
        }
        else{
          dispatch(fail(err.message));
        }
      });
  };
};


export const createSupportNotes = (requestPayload) => {
  return (dispatch) => {
    dispatch(isLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.post("/support/createSupportNotes", requestPayload, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(success(response.data));
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