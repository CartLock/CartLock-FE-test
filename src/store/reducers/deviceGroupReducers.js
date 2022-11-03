import * as actionTypes from "../actions/actionTypes";
const initialState = {
  deviceGroupDetails: "",
  error: "",
  loading: false,
  authRedirectPath: "/",
  success: "",
  message: null,
  pageLoading: false,
  available_Devices: [],
  device_Group: [],
  generated_Tickets: [],
  device_GroupDetails:{
    full_name: "",
    display_name: "",
    start_at: "",
    end_at: "",
    time_zone: "",
    description: "",
    sch_monday: false,
    sch_tuesday: false,
    sch_wednesday: false,
    sch_thursday: false,
    sch_friday: false,
    sch_saturday: false,
    sch_sunday: false,
    deviceDetails:[],
    status: "1"
  },
  supportTicketDetail: {
    User:{},
    serviceTicketNotes:[],
    active_lock:[],
    reportedDevices: [],
    assignedSeninel: [],
    latitude:"",
    longitude:""
  },
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
    case actionTypes.AVAILABLE_DEVICE__LIST:
      return {
        ...state,
        available_Devices: action.listing.data.payload,
        error: null,
        loading: false,
        message: action.listing.data.message,
        pageLoading: false
      };
    case actionTypes.GENERATED_TICKET_LIST:      
      return {
        ...state,
        generated_Tickets: action.listing.data.payload,
        error: null,
        loading: false,
        message: action.listing.data.message,
        pageLoading: false
      };
    case actionTypes.DEVICE_GROUP_LIST:
      return {
        ...state,
        device_Group: action.listing.data.payload,
        error: null,
        loading: false,
        message: action.listing.data.payload,
        pageLoading: false
      };
    case actionTypes.UPDATE_DEVICE__LIST:
      return {
        ...state,
        available_Devices: action.listing
      };
    case actionTypes.UPDATE_DEVICE_GROUP_LIST:
      return {
        ...state,
        device_Group: action.listing
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
    case actionTypes.SUCCESS:
      return {
        ...state,
        success: action.success.message,
        deviceGroupDetails: action.success.payload,
        loading: false,
      };
    case actionTypes.DEVICE_GROUP_DETAILS:
      return {
        ...state,
        device_GroupDetails: action.payload,
        error: null,
        loading: false,
        pageLoading: false
      };
    case actionTypes.GENERATED_TICKET_DETAILS:
      return {
        ...state,
        supportTicketDetail: action.payload,
        error: null,
        loading: false,
        pageLoading: false
      };
    default:
      return state;
  }
};

export default reducer;