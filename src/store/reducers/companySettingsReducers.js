import * as actionTypes from "../actions/actionTypes";
const initialState = {
  error: "",
  loading: false,
  authRedirectPath: "/",
  success: "",
  message: null,
  pageLoading: false,
  companySettingsDetails: {
    id: "",
    company_id: "",
    is_multi_phone_login: "",
    offline_reconect: "",
    schedule_opens: [],
    schedule_exceptions: [],
    default_time_zone: "",
    ekey_duration: false,
    default_country_code: "",
    fob_programmers: []
  },
  fob_Listing: []
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
        companySettingsDetails: action.success.payload,
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
    case actionTypes.COMPANY_SETTING_DETAILS:
      return {
        ...state,
        companySettingsDetails: action.payload,
        error: null,
        success: action.message,
        loading: false,
        pageLoading: false
      };
    case actionTypes.FOB_PROGRAMMER_LISTING:
      return {
        ...state,
        fob_Listing: action.listing.data.payload,
        error: null,
        loading: false,
        message: action.listing.data.payload,
        pageLoading: false
      };
    case actionTypes.UPDATE_FOB_PROGRAMMER_LIST:
      return {
        ...state,
        fob_Listing: action.listing
      };
    default:
      return state;
  }
};

export default reducer;