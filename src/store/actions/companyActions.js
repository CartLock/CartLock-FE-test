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


export const companyDetailsSuccess = (details) => {
  return {
    type: actionTypes.COMPANY_DETAILS,
    payload: details,
  };
};


export const companyMailerSettingSuccess = (details) => {
  return {
    type: actionTypes.COMPANY_MAILER_SETTING,
    payload: details,
  };
};



export const companyListSuccess = (listing) => {
  return {
    type: actionTypes.COMPANY_LIST,
    listing
  };
};


export const companyRelatedDeviceListSuccess = (listing) => {
  return {
    type: actionTypes.COMPANY_RELATED_DEVICE_LIST,
    listing
  };
};



export const token = () => {
  return localStorage.getItem("token")
}


export const companyList = (needLoading = false) => {
  console.log("get all company")
  return (dispatch) => {
    if(needLoading === true){
      dispatch(isPageLoading());
    }
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.get("/company/getAllCompany", authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(companyListSuccess(response.data.payload));
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



export const createCompany = (requestPayload,history) => {
  return (dispatch) => {
    dispatch(isLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.post("/company/addCompany", requestPayload, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(success(response.data));
         // createActivityLog('Created Company', "", requestPayload) // create activity log
         localStorage.setItem("tempCompanyId", response.data.payload.id);
         history.push({
           pathname: "/modifyCompany",
           isLoaderRequired: false
         })

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


export const modifyCompany = (requestPayload) => {
  console.log(token())
  console.log(requestPayload)
  return (dispatch) => {
    dispatch(isLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.put("/company/updateCompany", requestPayload, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(success(response.data));
         // createActivityLog('Modify Company', "", requestPayload) // create activity log
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


export const companyDetails = (id) => {
  return (dispatch) => {
    dispatch(isPageLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.get("/company/getCompanyDetails?id="+id, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(companyDetailsSuccess(response.data.payload));
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


export const updatePassword = (requestPayload) => {
  return (dispatch) => {
    dispatch(isLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.put("/user/resetPassword", requestPayload, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(success(response.data));
         // createActivityLog('Changed Password', "", requestPayload) // create activity log
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


export const companyListForUsers = () => {
  return (dispatch) => {
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.get("/company/getAllCompany?type=user", authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(companyListSuccess(response.data.payload));
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



export const companyRelatedDeviceList = (id) => {
  return (dispatch) => {
    dispatch(isPageLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.get("/company/getCompanyRelatedDevices?company_id="+id, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(companyRelatedDeviceListSuccess(response.data.payload));
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


export const deleteCompany = (id, details="") => {
  return (dispatch) => {
    dispatch(isLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.delete("/user/deleteCompany?id="+id, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(success(response.data));
         // createActivityLog('Removed Company', "", details) // create activity log
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



export const modifyCompanyMailerSetting = (requestPayload) => {
  return (dispatch) => {
    dispatch(isLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.post("/company/modifyCompanyMailerConfig", requestPayload, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(success(response.data));
          // createActivityLog('Modify Company', "", requestPayload) // create activity log
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


export const getCompanyMailerConfig = (id) => {
  console.log("ComapnyID::"+id)
  return (dispatch) => {
    dispatch(isPageLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.get("/company/getCompanyMailerConfig?company_id="+id, authCode)
      .then((response) => {
        if (response.status === 200) {
          if(response.data.payload){
            dispatch(companyMailerSettingSuccess(response.data.payload));
          }
          else{
            const companyMailerSettingData = {
              id:"",
              company_id: "",
              host_name: "",
              port_name: "",
              user_name: "",
              user_password: "",
            }
            dispatch(companyMailerSettingSuccess(companyMailerSettingData));
          }
          
        } else {
          // dispatch(fail(response.data.message));
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(fail(err.response.data.message));
        }
      });
  };
};