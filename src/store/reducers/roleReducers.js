import * as actionTypes from "../actions/actionTypes";
const initialState = {
  role_List: [],
  role_user_List: [],
  assined_role_user_List: [],
  error: "",
  loading: false,
  authRedirectPath: "/",
  success: "",
  message: null,
  pageLoading: false,
  role_Details: {
    role_title: "",
    role_description: "",
    permission_add: false,
    permission_modifly: false,
    permission_delete: false,
    permission_all: false,
    permission_title: "",
    permission_description: "",
    permission_module: {
        users: false,
        devices: false,
        device_group: false,
        activity: false,
        support: false,
        company_settings: false,
        change_password: false,
        company: false,
        role: false
    }
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
    case actionTypes.ROLE_LIST:
      return {
        ...state,
        role_List: action.listing,
        error: null,
        loading: false,
        pageLoading: false
      };
    case actionTypes.ROLE_USER_LIST:
      return {
        ...state,
        role_user_List: action.listing,
        error: null,
        loading: false,
        pageLoading: false
      };
    case actionTypes.ASSINED_ROLE_USER_LIST:
      return {
        ...state,
        assined_role_user_List: action.listing,
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
        role_Details: action.success.payload,
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
    case actionTypes.ROLE_DETAILS:
      return {
        ...state,
        role_Details: action.payload,
        error: null,
        loading: false,
        pageLoading: false
      };
    default:
      return state;
  }
};

export default reducer;