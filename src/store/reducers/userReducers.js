import * as actionTypes from "../actions/actionTypes";
const initialState = {
  user: null,
  error: "",
  loading: false,
  loadingKeyAssign: false,
  authRedirectPath: "/",
  success: "",
  user_List:[],
  user_Details: {
    lastName: "",
    firstName: "",
    displayName: "",
    email: "",
    cell: "",
    user_notes: "",
    isSentinel: false,
    isFob: false,
    isInstaller: false,
    isInactive: false,
    password: "",
    password_show: "",
    company:{}
  },
  message: null,
  pageLoading: false,
  assigned_ekey_List: [],
  ekey_List: [],
  timeZone_List:[],
  device_Details: {
    exceptions: [],
    schedule: {},
    users: [],
    deviceGroup: []
  },
  activityLog_List: [],
  totalActivities: 0,
  activityLogNotes_List: [],
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
    case actionTypes.ISLOADINGEKEYASSIGN:
      return {
        ...state,
        error: null,
        success: null,
        loadingKeyAssign: true,
      };
    case actionTypes.ISPAGELOADING:
      return {
        ...state,
        error: null,
        pageLoading: true,
      };
    case actionTypes.USER_LIST:
      return {
        ...state,
        user_List: action.listing.data.payload,
        error: null,
        loading: false,
        message: action.listing.data.payload,
        pageLoading: false
      };
    case actionTypes.UPDATE_USER_LIST:
      return {
        ...state,
        user_List: action.listing
      };
    case actionTypes.ASSIGNED_EKEY_LIST:
      return {
        ...state,
        assigned_ekey_List: action.listing.data.payload,
        error: null,
        loading: false,
        message: action.listing.data.payload,
        pageLoading: false
      };
    case actionTypes.EKEY_LIST:
      return {
        ...state,
        ekey_List: action.listing.data.payload,
        error: null,
        loading: false,
        message: action.listing.data.payload,
        pageLoading: false
      };
    case actionTypes.ACTIVITY_LOG_LIST:
      return {
        ...state,
        activityLog_List: action.listing,
        error: null,
        loading: false,
        // message: action.listing.data.payload,
        pageLoading: false
      };
    case actionTypes.ACTIVITY_LOG_NOTES_LIST:
      return {
        ...state,
        activityLogNotes_List: action.listing,
        error: null,
        loading: false,
        pageLoading: false
      };
    case actionTypes.TIMEZONE_LIST:
      return {
        ...state,
        timeZone_List: action.listing.data.payload,
        error: null,
        loading: false,
        message: action.listing.data.payload,
        pageLoading: false
      };
    case actionTypes.USER_DETAILS:
      return {
        ...state,
        user_Details: action.payload,
        error: null,
        loading: false,
        loadingKeyAssign: false,
        pageLoading: false
      };
    case actionTypes.DEVICE_DETAILS:
        return {
          ...state,
          device_Details: action.payload,
          error: null,
          loading: false,
          pageLoading: false
        };
    case actionTypes.MODIFY_SUCCESS:
      return {
        ...state,
        success: action.success,
        loading: false,
        loadingKeyAssign: false,
        pageLoading: false
      };
    case actionTypes.ERROR:
      return {
        ...state,
        error: action.error,
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
    case actionTypes.ERROR_USER_LISTING:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case actionTypes.SUCCESS:
      return {
        ...state,
        success: action.msg,
        user: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default reducer;