import crypto from "crypto";
import Axios from "./axios";
import moment from "moment";

export const generateUniqueNumber = (howMany, type) => {
  let chars;
  if (type === 'alphaNumber') {
    chars = "ABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
  }
  else if (type === 'alphaNumber2') {
    chars = "ABCDEFGHIJKLMNOPQRSTUWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  }
  else {
    chars = "0123456789";
  }
  var rnd = crypto.randomBytes(howMany),
    value = new Array(howMany),
    len = chars.length;
  for (var i = 0; i < howMany; i++) {
    value[i] = chars[rnd[i] % len];
  }

  return value.join("");
};


export const roleDetails = () => {
  const modules = [
    { key: "users", value: "Users" },
    { key: "devices", value: "Devices" },
    { key: "device_group", value: "Device Groups" },
    { key: "activity", value: "Activity" },
    { key: "support", value: "Support" },
    { key: "company_settings", value: "Company Settings" },
    { key: "change_password", value: "Change Password" },
    { key: "company", value: "Company" },
    { key: "role", value: "Role" }
  ]

  const actions = [
    { key: "permission_add", value: "Create" },
    { key: "permission_modifly", value: "Modify" },
    { key: "permission_view", value: "View" },
    { key: "permission_delete", value: "Delete" }
  ]

  return { modules: modules, actions: actions }
};


export const createActivityLog = (summary, deviceId="", description = "", deviceGroupId="") => {
  const logData = {
    operation_type: 'Admin',
    device_id: deviceId,
    device_group_id: deviceGroupId,
    summary: summary,
    activity_description: description
  }

  const authCode = { 
    headers: { 'Authorization': localStorage.getItem("token") } 
  }

  Axios.post("../api/user/createActivityLog", logData, authCode)
    .then((response) => {
      if (response.status === 200) {
        // console.log('200', response.data.message);
      } else {
        // console.log('501', response.data.message);
      }
    })
    .catch((err) => {
      if (err.response.status === 401) {
        // console.log('401', err.response.data.message);
      }
    });
  
  return true;
};



export const getPageDetails = (pathName) => {
  const pageDetails = { isDashboard: true, title: '', icon: '' }
  const iconPath = '../assets/img/';
  const pages = [
    // users
    { key: "users", title: "Users", pathName: "/users", icon: iconPath + "GrayImg.svg" },
    { key: "users", title: "Create/Modify Users", pathName: "/adduser", icon: iconPath + "GrayImg.svg" },
    { key: "users", title: "Create/Modify Users", pathName: "/modifyUser", icon: iconPath + "GrayImg.svg" },
    // device
    { key: "devices", title: "Devices", pathName: "/devices", icon: iconPath + "GrayImg.svg" },
    { key: "devices", title: "Devices", pathName: "", icon: iconPath + "GrayImg.svg" },
    // device groups
    { key: "deviceGroups", title: "Device Groups", pathName: "/deviceGroups", icon: iconPath + "GrayImg.svg" },
    { key: "deviceGroups", title: "Create/Modify Device Groups", pathName: "/addDeviceGroup", icon: iconPath + "GrayImg.svg" },
    { key: "deviceGroups", title: "Create/Modify Device Groups", pathName: "/modifyDeviceGroup", icon: iconPath + "GrayImg.svg" },
    // activity
    { key: "activity", title: "Activity", pathName: "/activity", icon: iconPath + "GrayImg.svg" },
    { key: "activityDetails", title: "Activity Details", pathName: "/activityDetails", icon: iconPath + "GrayImg.svg" },
    // support
    { key: "support", title: "Support", pathName: "/support", icon: iconPath + "GrayImg.svg"},
    { key: "support", title: "Support Ticket Details", pathName: "/supportTicketDetails", icon: iconPath + "GrayImg.svg"},
    { key: "support", title: "Support Ticket Details", pathName: "/supportTicketGPSDetails", icon: iconPath + "GrayImg.svg"},
    
    // company setting
    { key: "companySettings", title:"Default Settings", pathName: "/companySettings", icon: iconPath + "GrayImg.svg"},
    { key: "scheduleOpen", title: "Company Settings", pathName: "/scheduleOpen", icon: iconPath + "GrayImg.svg"},
    { key: "setFobProgramers", title: "Company Settings", pathName: "/setFobProgramers", icon: iconPath + "GrayImg.svg"},
    { key: "changePassword", title: "Change Password", pathName: "/changePassword", icon: iconPath + "GrayImg.svg"},
    // companies
    { key: "company", title: "Companies", pathName: "/company", icon: iconPath + "GrayImg.svg"},
    { key: "addCompany", title: "Create/Modify Companies", pathName: "/addCompany", icon: iconPath + "GrayImg.svg"},
    { key: "modifyCompany", title: "Create/Modify Companies", pathName: "/modifyCompany", icon: iconPath + "GrayImg.svg"},
    { key: "modifyCompany", title: "Company Mailer Setting", pathName: "/companyMailerSetting", icon: iconPath + "GrayImg.svg"},
  ]
  
  pages.forEach(el => {
    if(el.pathName == pathName){
      pageDetails.isDashboard = false
      pageDetails.title = el.title
      pageDetails.icon = el.icon
    }
  });

  return pageDetails
};


export const getTimes = () => {
  var timeValue = "00:00"; 
  var endLimit= "23:59"
  var step = 5;
  
  var options = []
  var lastValue
  var timeValueIsEarlier = true
	var timeValueIsLaterThanLastValue = true

  while ( timeValueIsEarlier && timeValueIsLaterThanLastValue) {
    lastValue = timeValue;
    timeValue = moment(timeValue, 'HH:mm').add(step, 'minutes').format('HH:mm');
    options.push(timeValue)

    timeValueIsEarlier = moment(timeValue, 'HH:mm').diff(moment(endLimit, 'HH:mm')) < 0
		timeValueIsLaterThanLastValue = lastValue === undefined ? true : moment(lastValue, 'HH:mm').diff(moment(timeValue, 'HH:mm')) < 0
  }
  
  return options
};


export const UTCDateTimeFormat = (dateTime) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  var localFormat   = moment.tz(dateTime, timeZone)
  var utcFormat = moment.tz(localFormat, "UTC")

  return utcFormat;
}


export const phoneNuberFormate = (phoneNumber) => {
  const formatedNumber =  phoneNumber ? phoneNumber.substring(0, 3) + "-" + phoneNumber.substring(3, 6) + "-" + phoneNumber.substring(6, phoneNumber.length) : ""
  return formatedNumber;
}
