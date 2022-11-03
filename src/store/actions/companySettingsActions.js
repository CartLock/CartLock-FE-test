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

export const companySettingsDetailsSuccess = (details) => {
  return {
    type: actionTypes.COMPANY_SETTING_DETAILS,
    payload: details,
  };
};

export const fobProgrammserListingSuccess = (listing) => {
  return {
    type: actionTypes.FOB_PROGRAMMER_LISTING,
    listing
  };
};

export const updateFobProgrammerList = (listing) => {
  return {
    type: actionTypes.UPDATE_FOB_PROGRAMMER_LIST,
    listing
  };
};

export const token = () => {
  return localStorage.getItem("token")
}

export const modifyCompanySettings = (requestPayload, oldSettings, modiflyAction="") => {
  return (dispatch) => {
    dispatch(isLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.put("/settings/modifyCompanySettings", requestPayload, authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(success(response.data));
          if(modiflyAction == 'schedule'){
            // createActivityLog('Default "Scheduled Open" Changed', "", {newSettings: requestPayload, oldSettings: oldSettings}) // create activity log
          }
          if(modiflyAction == 'fob'){
            // createActivityLog('Changed Fob Programmers', "", {newSettings: requestPayload, oldSettings: oldSettings}) // create activity log
          }
          else {
            //createActivityLog('Company Settings Updated', "", {newSettings: requestPayload, oldSettings: oldSettings}) // create activity log
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

export const getCompanySettings = () => {
  return (dispatch) => {
    dispatch(isPageLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }

    Axios.get("/settings/getCompanySettings", authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(companySettingsDetailsSuccess(response.data.payload));
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

export const getFobProgrammers = () => {
  return (dispatch) => {
    dispatch(isPageLoading());
    const authCode = { 
      headers: { 'Authorization': token() } 
    }
    Axios.get("/settings/getFobProgrammers", authCode)
      .then((response) => {
        if (response.status === 200) {
          dispatch(fobProgrammserListingSuccess(response));
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