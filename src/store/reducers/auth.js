import * as actionTypes from "../actions/actionTypes";
const initialState = {
  user: null,
  error: "",
  loading: false,
  authRedirectPath: "/",
  success: null,
  success_message: null,
  permissionDetails: {
    permission_add: false,
    permission_modifly: false,
    permission_delete: false,
    permission_all: false,
    permission_module: {},
    forgot_message:null
  },
};

const reducer = (state = initialState, action) => { 
  switch (action.type) {
    case actionTypes.AUTH_START:
      return {
        ...state,
        error: null,
        loading: true,
      };

    case actionTypes.AUTH_SUCCESS:
      return {
        ...state,
        user: action,
        error: null,
        loading: false,
      };

    case actionTypes.AUTH_FAIL:
      return {
        ...state,
        error: action.error,
        loading: false,
      };

    case actionTypes.AUTHERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
      };


      case actionTypes.FORGOT_SUCCESS:
        console.log("Action MSG::"+action.forgot_message)
        return {
          ...state,
          success_message: action.forgot_message,
          error: null,
          success:true,
          loading: false,
        };

    case actionTypes.AUTH_LOGOUT:
      return {
        ...state,
        token: null,
      };

    case actionTypes.SUCCESS_MESSAGE_AUTH:
      return {
        ...state,
        success_message: action.msg,
        loading: false,
      };

      

    case actionTypes.PERMISSION_DETAILS:
      return {
        ...state,
        permissionDetails: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
