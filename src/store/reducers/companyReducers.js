import * as actionTypes from "../actions/actionTypes";
const initialState = {
  company_List: [],
  company_related_device_List: {
    details:[],
    company: ""
  },
  error: "",
  loading: false,
  authRedirectPath: "/",
  success: "",
  message: null,
  pageLoading: false,
  company_Details:{
    company_name: "",
    poc_first_name: "",
    poc_last_name: "",
    poc_e_mail: "",
    poc_phone_number: "",
    is_deactive: false,
    company_id: "",
  },
  companyMailerSetting:{
    id:"",
    company_id: "",
    host_name: "",
    port_name: "",
    user_name: "",
    user_password: "",
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ISLOADING:
      return {
        ...state,
        error: null,
        success: null,
        loading: true,
      };
    case actionTypes.ISPAGELOADING:
      return {
        ...state,
        error: null,
        pageLoading: true,
      };
    case actionTypes.COMPANY_LIST:
      return {
        ...state,
        company_List: action.listing,
        error: null,
        loading: false,
        pageLoading: false
      };
    case actionTypes.COMPANY_RELATED_DEVICE_LIST:
      return {
        ...state,
        company_related_device_List: action.listing,
        error: null,
        loading: false,
        pageLoading: false
      };
    case actionTypes.ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case actionTypes.SUCCESS:
      return {
        ...state,
        success: action.success.message,
        company_Details: action.success.payload,
        loading: false,
      };
    case actionTypes.REST_ERROR_AND_SUCCESS_STATE:
      return {
        ...state,
        error: null,
        success: null,
        loading: false,
        // pageLoading: false
      };
    case actionTypes.COMPANY_DETAILS:
      return {
        ...state,
        company_Details: action.payload,
        error: null,
        loading: false,
        pageLoading: false
      };
    case actionTypes.COMPANY_MAILER_SETTING:
      return {
        ...state,
        companyMailerSetting: action.payload,
        error: null,
        loading: false,
        pageLoading: false
      };
    default:
      return state;
  }
};

export default reducer;