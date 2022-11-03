import React, { Fragment, useEffect, useState, useMemo } from "react";
import { useHistory, Link, useLocation } from "react-router-dom";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  Box,
  Avatar,
  ListItemText,
  Divider,
  Typography,
  FormControl,
  InputLabel,
  Select,
  FormLabel,
  RadioGroup,
  Radio,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import { Group, Delete } from "@material-ui/icons";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import {
  userDetails,
  UpdateUserDetails,
  successUserDetails,
  modifyUserDetails,
  resetErrorAndSuccessState,
  assignEkeyToUser,
  assignEkeyList,
  deleteAssignedEkey,
  ekeyList,
  timeZoneList,
} from "../store/actions/userActions";
import { companyListForUsers } from "../store/actions/companyActions";
import FormHelperText from "@material-ui/core/FormHelperText";
import { withSnackbar } from "notistack";
import validator from "validator";
import { makeStyles, alpha, withStyles } from "@material-ui/core/styles";
import Loader from "../PageLoader";
import Footer from "../footer";
import Submenu from "../header_sub_menu";
import Tooltip from "@material-ui/core/Tooltip";

import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { format } from "date-fns";
import { Autocomplete } from "@material-ui/lab";
import { generateUniqueNumber, getTimes } from "../helper/commonHelper";
import moment from "moment";
// confirm dialog
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputMask from "react-input-mask";
import SideNavBar from "../SideNavBar";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const CheckboxWithGreenCheck = withStyles({
  root: {
    "&$checked": {
      "& .MuiIconButton-label": {
        position: "relative",
        zIndex: 0,
      },
      "& .MuiIconButton-label:after": {
        content: '""',
        left: 4,
        top: 4,
        height: 15,
        width: 15,
        position: "absolute",
        backgroundColor: "#3f51b5",
        zIndex: -1,
      },
    },
  },
  checked: {},
})(Checkbox);

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  disabledColor: {
    background: "#E8E8E8",
  },
  imgSize: {
    width: "20px",
    marginRight: "10px",
    cursor: "pointer",
  },
  lockImgSize: {
    cursor: "pointer",
    width: 25,
    marginRight: 10,
  },
  active: {
    cursor: "pointer",
    "&:hover": {
      background: "#efefef",
    },
    "&:last-child": {
      borderRight: "solid 1px #cccccc",
    },
  },
  activeSelected: {
    background: "#efefef",
    borderRight: "solid 1px #cccccc",
  },
}));

const ModifyUser = (props) => {
  const { enqueueSnackbar, error, success, loading, pageLoading } = props;
  const classes = useStyles();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user_Details } = useSelector((state) => state.user);
  const { assigned_ekey_List } = useSelector((state) => state.user);
  const { ekey_List } = useSelector((state) => state.user);
  const { timeZone_List } = useSelector((state) => state.user);

  const history = useHistory();

  const [confirmOpen, setConfirmOpen] = React.useState({
    show: false,
    key: "",
    item: {},
    loadingDelete: false,
  });

  const [userOldDetails, setUserOldDetails] = React.useState(user_Details);

  // user update functionality
  const handleValidation = () => {
    let isError = false;
    const formerr = { ...formValidation };

    if (!user_Details.lastName) {
      isError = true;
      formerr.lastName = "Required last name";
      setFormValidation(formerr);
    }

    if (!user_Details.firstName) {
      isError = true;
      formerr.firstName = "Required first name";
      setFormValidation(formerr);
    }

    if (!user_Details.displayName) {
      isError = true;
      formerr.displayName = "Required display name";
      setFormValidation(formerr);
    }

    if (user_Details.email && !validator.isEmail(user_Details.email)) {
      isError = true;
      formerr.email = "Email invalid";
      setFormValidation(formerr);
    }

    if (!user_Details.cell) {
      isError = true;
      formerr.cell = "Required cell";
      setFormValidation(formerr);
    } else if (user_Details.cell.length < 10) {
      isError = true;
      formerr.cell = "Cell number at least 10 digits";
      setFormValidation(formerr);
    }

    return isError;
  };

  var isSupervisorUpdateData = false;
  var isHouseKeppingUpdateData = false;

  const handleChange = (prop) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    dispatch(successUserDetails({ ...user_Details, [prop]: value }));
    const formerr = { ...formValidation };
    formerr[event.target.name] = null;
    setFormValidation(formerr);
  };

  const handleBlur = () => {
    const firstName = user_Details.firstName;
    const lastName = user_Details.lastName;
    const displayName = lastName.concat(", ", firstName);
    const formerr = { ...formValidation };
    formerr.displayName = null;
    setFormValidation(formerr);
    dispatch(UpdateUserDetails({ ...user_Details, displayName: displayName }));
  };

  const [phoneNumer, setPhoneNumber] = React.useState();

  const handleUpdateClick = (e) => {
    e.preventDefault();
    if (handleValidation()) return false;

    console.log("isSupervisor ::" + values.isSupervisor);
    console.log("isHouseKeeping ::" + values.isHouseKeeping);
    console.log("isSupervisor db value ::" + user_Details.isSupervisor);
    console.log("isHouseKeeping db value ::" + user_Details.isHouseKeeping);

    const uData = {
      userId: user_Details.id,
      firstName: user_Details.firstName,
      lastName: user_Details.lastName,
      displayName: user_Details.displayName,
      emailId: user_Details.email,
      phoneNumer: !phoneNumer ? user_Details.cell : phoneNumer,
      userNotes: user_Details.user_notes,
      isSentinel: user_Details.isSentinel === true ? "1" : "0",
      isInstaller: user_Details.isInstaller === true ? "1" : "0",
      isFob: user_Details.isFob === true ? "1" : "0",
      isInactive: user_Details.isInactive === true ? "1" : "0",
      isHouseKeepingWithoutEvent:
        user_Details.is_housekeeping === "1" ? "1" : "0",
      isSupervisorWithoutEvent: user_Details.isSupervisor === true ? "1" : "0",
      isHouseKeeping: values.isHouseKeeping === true ? "1" : "0",
      isSupervisor: values.isSupervisor === true ? "1" : "0",
      checkboxValue: values.checkboxFlag,
      companyId: localStorage.getItem("companyID"),
    };
    console.log("SuperVisor:::" + uData.isSupervisorUpdateData);
    dispatch(modifyUserDetails(uData, userOldDetails));
  };

  const [formValidation, setFormValidation] = React.useState({
    lastName: "",
    firstName: "",
    displayName: "",
    cell: "",
  });

  // assign ekeys functionality



  const [eKeyValue, seteKeyValue] = useState({});
  const [isGroupSelected, setIsGroupSelected] = useState(false);
  const [isDateDisabled, setIsDateDisabled] = useState(true);
  const [isTimeDisabled, setIsTimeDisabled] = useState(true);
  const [timeList, settimeList] = useState([]);
  const [values, setValues] = React.useState({
    eKey: "",
    fobDeviceId: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    zone: "",
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false,
    days: "",
    type: "device",
    groupId: "",
    scheduleType: "keyOneTimeUse",
    assignedKeyId: "",
    isHouseKeeping: "",
    isSupervisor: "",
    checkboxFlag: "false",
  });

  const [formValidationEkey, setFormValidationEkey] = React.useState({
    eKey: "",
    // fobDeviceId: "",
  });

  const handleClickAssignEkey = (e) => {
    e.preventDefault();
    if (handleValidationEkey()) return false;

    const ekeyData = {
      userId: user_Details.id,
      eKey: values.eKey,
      type: values.type,
      status: values.scheduleType === "keyOneTimeUse" ? "2" : "1",
      FOBDeviceId: values.fobDeviceId,
      oneTimeUse: values.scheduleType === "keyOneTimeUse" ? "1" : "0",
      startDate: values.startDate
        ? moment(values.startDate, "YYYY-MM-DD").format("YYYY-MM-DD")
        : null,
      startTime: values.startTime,
      endDate: values.endDate
        ? moment(values.endDate, "YYYY-MM-DD").format("YYYY-MM-DD")
        : null,
      endTime: values.endTime,
      scheduleDays:
        values.scheduleType != "keyOneTimeUse"
          ? JSON.stringify({
              Mon: values.mon,
              Tue: values.tue,
              Wed: values.wed,
              Thu: values.thu,
              Fri: values.fri,
              Sat: values.sat,
              Sun: values.sun,
            })
          : null,
      zone: values.zone,
      assignedKeyId: values.assignedKeyId,
    };
    // console.log(ekeyData);return
    const uDetail = {
      id: user_Details.id,
      displayName: user_Details.displayName,
    };
    dispatch(assignEkeyToUser(ekeyData, eKeyValue, uDetail, oldKeyDetails));
  };

  const handleValidationEkey = () => {
    let isErrorEkey = false;
    const formerrEkey = { ...formValidationEkey };
    if (!values.eKey) {
      isErrorEkey = true;
      formerrEkey.eKey = "Required ekey";
      setFormValidationEkey(formerrEkey);
    }

    if (values.scheduleType == "keySchedule") {
      if (!values.startDate) {
        isErrorEkey = true;
        formerrEkey.startDate = "Required start date";
        setFormValidationEkey(formerrEkey);
      }

      if (!values.startTime || values.startTime == "--:--") {
        isErrorEkey = true;
        formerrEkey.startTime = "Required start time";
        setFormValidationEkey(formerrEkey);
      }

      if (!values.endDate) {
        isErrorEkey = true;
        formerrEkey.endDate = "Required end date";
        setFormValidationEkey(formerrEkey);
      }

      if (!values.endTime || values.endDate == "--:--") {
        isErrorEkey = true;
        formerrEkey.endTime = "Required end time";
        setFormValidationEkey(formerrEkey);
      }

      if (!values.zone) {
        isErrorEkey = true;
        formerrEkey.zone = "Required zone";
        setFormValidationEkey(formerrEkey);
      }

      if (
        !values.mon &&
        !values.tue &&
        !values.wed &&
        !values.thu &&
        !values.fri &&
        !values.sat &&
        !values.sun
      ) {
        isErrorEkey = true;
        formerrEkey.days = "Required days";
        setFormValidationEkey(formerrEkey);
      }
    }

    return isErrorEkey;
  };

  const handleChangeEkey = (prop) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setValues({ ...values, [prop]: value });
    const formerr = { ...formValidationEkey };
    formerr[event.target.name] = null;

    if (value == "keyOneTimeUse") {
      var scheduleReset = { ...values };
      scheduleReset["scheduleType"] = value;
      scheduleReset["mon"] = false;
      scheduleReset["tue"] = false;
      scheduleReset["wed"] = false;
      scheduleReset["thu"] = false;
      scheduleReset["fri"] = false;
      scheduleReset["sat"] = false;
      scheduleReset["sun"] = false;
      scheduleReset["startDate"] = "";
      scheduleReset["endDate"] = "";
      scheduleReset["startTime"] = "";
      scheduleReset["endTime"] = "";
      scheduleReset["zone"] = "";
      setValues(scheduleReset);

      setIsDateDisabled(true);
      setIsTimeDisabled(true);

      formerr["startDate"] = null;
      formerr["startTime"] = null;
      formerr["endDate"] = null;
      formerr["endTime"] = null;
      formerr["zone"] = null;
      formerr["days"] = null;
    } else if (value == "keySchedule") {
      setIsDateDisabled(false);
      setIsTimeDisabled(false);
    }

    if (
      prop == "mon" ||
      prop == "tue" ||
      prop == "wed" ||
      prop == "thu" ||
      prop == "fri" ||
      prop == "sat" ||
      prop == "sun"
    ) {
      formerr["days"] = null;
    }
    setFormValidationEkey(formerr);
  };

  useEffect(() => {
    const userId = localStorage.getItem("tempId");
    if (!userId) {
      history.push({
        pathname: "/users",
      });
    } else {
      const isLoaderReq =
        location.isLoaderRequired != undefined
          ? location.isLoaderRequired
          : true;
      dispatch(userDetails(userId, isLoaderReq));
      dispatch(assignEkeyList(userId));
      dispatch(companyListForUsers());
    }
    dispatch(ekeyList("group", userId, false));
    dispatch(timeZoneList());
  }, [dispatch]);

  useEffect(() => {
    error && enqueueSnackbar(error, { variant: "error" });
    dispatch(resetErrorAndSuccessState());
  }, [error]);

  useEffect(() => {
    success && enqueueSnackbar(success, { variant: "success" });
    if (success == "User modified successfully") {
      window.location.reload();
    }
    dispatch(resetErrorAndSuccessState());
    const userId = localStorage.getItem("tempId");
    if (!userId) {
      history.push({
        pathname: "/users",
      });
    } else if (
      success === "eKeys/Groups Assigned successfully" ||
      success === "eKeys Modified successfully" ||
      success === "ekey removed successfully"
    ) {
      dispatch(assignEkeyList(userId));
      dispatch(ekeyList("group", userId, false));
      resetEkayAssignForm();
      handleClose();
    }
  }, [success]);

  useEffect(() => {
    settimeList(getTimes());
  }, [getTimes]);

  const resetEkayAssignForm = () => {
    var resetForm = { ...values };
    resetForm["eKey"] = "";
    resetForm["fobDeviceId"] = "";
    resetForm["scheduleType"] = "keyOneTimeUse";
    resetForm["startDate"] = "";
    resetForm["endDate"] = "";
    resetForm["startTime"] = "";
    resetForm["endTime"] = "";
    resetForm["zone"] = "";
    resetForm["mon"] = false;
    resetForm["tue"] = false;
    resetForm["wed"] = false;
    resetForm["thu"] = false;
    resetForm["fri"] = false;
    resetForm["sat"] = false;
    resetForm["sun"] = false;
    resetForm["assignedKeyId"] = "";
    setValues(resetForm);

    seteKeyValue({});
    setIsDateDisabled(true);
    setIsTimeDisabled(true);
    setIsGroupSelected(false);
  };

  const handleChangeSelection = (event, type) => {
    if (event) {
      // set device/group details
      if (type === "ekey") {
        seteKeyValue(event);
        var vData = { ...values };
        vData["eKey"] = event.id;

        if (event.type === "group") {
          vData["type"] = "group";
          vData["zone"] = event.time_zone ? JSON.parse(event.time_zone) : {};
          vData["startTime"] = event.start_at;
          vData["endTime"] = event.end_at;
          vData["mon"] = event.sch_monday;
          vData["tue"] = event.sch_tuesday;
          vData["wed"] = event.sch_wednesday;
          vData["thu"] = event.sch_thursday;
          vData["fri"] = event.sch_friday;
          vData["sat"] = event.sch_saturday;
          vData["sun"] = event.sch_sunday;
          vData["scheduleType"] = "keySchedule";

          setIsGroupSelected(true);
          setIsDateDisabled(false);
          setIsTimeDisabled(true);
        } else {
          vData["type"] = "device";

          setIsGroupSelected(false);

          if (values.scheduleType == "keySchedule") {
            setIsDateDisabled(false);
            setIsTimeDisabled(false);
          }
        }

        setValues(vData);

        // reset error messages
        const formerr = { ...formValidationEkey };
        formerr["eKey"] = null;
        formerr["startDate"] = null;
        formerr["startTime"] = null;
        formerr["endDate"] = null;
        formerr["endTime"] = null;
        formerr["zone"] = null;
        formerr["days"] = null;
        setFormValidationEkey(formerr);
      } else if (type === "zone") {
        setFormValidationEkey({ ...formValidationEkey, zone: null });
        setValues({ ...values, zone: event });
      } else if (type === "startTime") {
        setFormValidationEkey({ ...formValidationEkey, startTime: null });
        setValues({ ...values, startTime: event });
      } else if (type === "endTime") {
        setFormValidationEkey({ ...formValidationEkey, endTime: null });
        setValues({ ...values, endTime: event });
      }
    }
  };

  const removeEkeyFromUser = () => {
    if (confirmOpen.item) {
      setConfirmOpen({ ...confirmOpen, loadingDelete: true });
      const item = confirmOpen.item;

      const uDetail = {
        id: user_Details.id,
        displayName: user_Details.displayName,
      };
      dispatch(deleteAssignedEkey(item.id, item, uDetail));
    }
  };

  const handleChangeSchedule = (event, type) => {
    if (event) {
      setFormValidationEkey({ ...formValidationEkey, [type]: null });

      if (type === "startDate") {
        setValues({ ...values, startDate: event });
      } else if (type === "endDate") {
        setValues({ ...values, endDate: event });
      } else if (type === "startTime") {
        setValues({ ...values, startTime: event });
      } else if (type === "endTime") {
        setValues({ ...values, endTime: event });
      }
    }
  };

  const handleChangeCheckboxValue = (key, value) => {
    console.log(key + ":" + value);
    if (key == "isSupervisor") {
      console.log("Supervisor click");
      if (value) {
        values.isSupervisor = true;
        values.checkboxFlag = "true";
      }
      console.log(values.isSupervisor);
    }
    if (key == "isHousekeeping") {
      console.log("houseKeeping click");
      if (value) {
        values.isHouseKeeping = true;
        values.checkboxFlag = "true";
      }
      console.log(values.isHouseKeeping);
    }

    dispatch(successUserDetails({ ...user_Details, [key]: value }));
  };

  const [oldKeyDetails, setOldKeyDetails] = React.useState({});

  const handleAssignedEkeyInfoClick = (event) => {
    if (!event.is_group) {
      if (values.assignedKeyId == "") {
        setOldKeyDetails(event);
        resetEkayAssignForm();
        var vData = { ...values };
        vData["eKey"] = event.ekeyDetails.id;
        vData["zone"] = event.time_zone;
        vData["startDate"] = event.one_time_use == "1" ? "" : event.start_date;
        vData["endDate"] = event.one_time_use == "1" ? "" : event.end_date;
        vData["startTime"] = event.one_time_use == "1" ? "" : event.start_time;
        vData["endTime"] = event.one_time_use == "1" ? "" : event.end_time;
        vData["mon"] =
          event.schedule_days != null ? event.schedule_days.Mon : false;
        vData["tue"] =
          event.schedule_days != null ? event.schedule_days.Tue : false;
        vData["wed"] =
          event.schedule_days != null ? event.schedule_days.Wed : false;
        vData["thu"] =
          event.schedule_days != null ? event.schedule_days.Thu : false;
        vData["fri"] =
          event.schedule_days != null ? event.schedule_days.Fri : false;
        vData["sat"] =
          event.schedule_days != null ? event.schedule_days.Sat : false;
        vData["sun"] =
          event.schedule_days != null ? event.schedule_days.Sun : false;
        vData["scheduleType"] =
          event.one_time_use == "1" ? "keyOneTimeUse" : "keySchedule";
        vData["assignedKeyId"] = event.id;

        setValues(vData);

        if (event.one_time_use == "1") {
          setIsDateDisabled(true);
          setIsTimeDisabled(true);
        } else {
          setIsDateDisabled(false);
          setIsTimeDisabled(false);
        }

        // set key in dropdown
        seteKeyValue(event.ekeyDetails);
      } else {
        const userId = localStorage.getItem("tempId");
        dispatch(assignEkeyList(userId));
        dispatch(ekeyList("group", userId, false));
        resetEkayAssignForm();
        handleClose();
      }
    }
  };

  // confirm dialog
  const handleClose = () => {
    setConfirmOpen({
      show: false,
      key: "",
      item: {},
      loadingDelete: false,
    });
  };

  const handleClickOpen = (item) => {
    setConfirmOpen({
      show: true,
      key: item.ekeyDetails.full_name,
      item: item,
      loadingDelete: false,
    });
  };

  return (
    <>
      <SideNavBar />
      <div className="main">
        {pageLoading ? <Loader /> : null}
        {/* {console.log("userDetails", user_Details)} */}
        <Submenu />

        <div className="Contborder">
          <div className="row">
            <div className="col-md-12">
              <div className="card" style={{ marginBottom: 0 }}>
                <div className="row align-items-center">
                  <div className="col-lg-10">
                    <Link
                      style={{
                        border: "2px solid",
                        borderColor: " #1b330a",
                        borderRadius: "8px",
                        borderWidth: "2px",
                        backgroundColor: "#a9d18e",
                        color: "#1b330a",
                        width: "10%",
                        marginTop: "1%",
                      }}
                      class="btn  float-right"
                      to="/users"
                    >
                      Back
                    </Link>
                  </div>
                  <div className="col-lg-2">
                    <button
                      className="btn userUpdateButtonTest"
                      variant="contained"
                      size="large"
                      onClick={handleUpdateClick}
                      style={{ display: props.loading ? "none" : "block" }}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-success"
                      variant="contained"
                      size="large"
                      style={{ display: props.loading ? "block" : "none" }}
                    >
                      Update &nbsp;
                      <i className="fa fa-spinner fa-spin right" />
                    </button>
                  </div>
                </div>

                <div className="card-header">
                  <form autoComplete="off">
                    <div className="row">
                      <div className="col-md-4 row">
                        <div className="col-md-4">
                          <label className="adduserlabel" fullWidth>
                            First Name
                          </label>
                        </div>
                        <div className="col-md-8">
                          <TextField
                            id="fname"
                            fullWidth
                            name="firstName"
                            value={user_Details.firstName}
                            onChange={handleChange("firstName")}
                            onBlur={handleBlur}
                            error={!!formValidation.firstName}
                            helperText={formValidation.firstName}
                          />
                        </div>
                      </div>
                      <div className="col-md-1 row"></div>

                      <div className="col-md-4 row">
                        <div className="col-md-4">
                          <label className="adduserlabel" fullWidth>
                            Last Name
                          </label>
                        </div>
                        <div className="col-md-8">
                          <TextField
                            id="lname"
                            fullWidth
                            name="lastName"
                            value={user_Details.lastName}
                            onChange={handleChange("lastName")}
                            onBlur={handleBlur}
                            error={!!formValidation.lastName}
                            helperText={formValidation.lastName}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row"></div>
                    <div className="row">
                      <div className="col-md-4 row ">
                        <div className="col-md-4">
                          <label className="adduserlabel" fullWidth>
                            Email
                          </label>
                        </div>
                        <div className="col-md-8">
                          <TextField
                            id="lname"
                            fullWidth
                            name="email"
                            value={user_Details.email}
                            onChange={handleChange("email")}
                            error={!!formValidation.email}
                            helperText={formValidation.email}
                          />
                        </div>
                      </div>
                      <div className="col-md-1 row"></div>

                      <div className="col-md-4 row ">
                        <div className="col-md-4">
                          <label className="adduserlabel" fullWidth>
                            Roles
                          </label>
                        </div>

                        <div className="col-md-8">
                          <div className="row testkoti">
                            <div className="col-md-6 sauravtest ">
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                className=""
                              >
                                {user_Details.isSupervisor ? (
                                  <img
                                    alt="Supervisor"
                                    src="../assets/img/checkGreen.png"
                                    className={classes.imgSize}
                                    onClick={() =>
                                      handleChangeCheckboxValue(
                                        "isSupervisor",
                                        false
                                      )
                                    }
                                  />
                                ) : (
                                  <img
                                    alt="Supervisor"
                                    src="../assets/img/unchecked.png"
                                    className={classes.imgSize}
                                    onClick={() =>
                                      handleChangeCheckboxValue(
                                        "isSupervisor",
                                        true
                                      )
                                    }
                                  />
                                )}
                                Supervisor
                              </Typography>
                            </div>

                            <div className="col-md-6 sauravtest ">
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                className=""
                              >
                                {user_Details.isHousekeeping ? (
                                  <img
                                    alt="Supervisor"
                                    src="../assets/img/checkGreen.png"
                                    className={classes.imgSize}
                                    onClick={() =>
                                      handleChangeCheckboxValue(
                                        "isHousekeeping",
                                        false
                                      )
                                    }
                                  />
                                ) : (
                                  <img
                                    alt="Supervisor"
                                    src="../assets/img/unchecked.png"
                                    className={classes.imgSize}
                                    onClick={() =>
                                      handleChangeCheckboxValue(
                                        "isHousekeeping",
                                        true
                                      )
                                    }
                                  />
                                )}
                                HouseKeeping
                              </Typography>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4 row modifyUser">
                      <div className="col-md-4">
                        <label className="adduserlabel" fullWidth>
                          {" "}
                          Number
                        </label>
                      </div>

                      <div className="col-md-6">
                        <PhoneInput
                          name="cell"
                          country={"us"}
                          value={user_Details.cell}
                          onChange={setPhoneNumber}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <Dialog
            open={confirmOpen.show}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Delete Confirmation"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete{" "}
                <strong>{confirmOpen.key}</strong> key ?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClose}
                color=""
                variant="contained"
                size="small"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={removeEkeyFromUser}
                color="secondary"
                autoFocus
                style={{
                  display: confirmOpen.loadingDelete ? "none" : "block",
                }}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                size="small"
                color="secondary"
                autoFocus
                style={{
                  display: confirmOpen.loadingDelete ? "block" : "none",
                }}
              >
                Delete &nbsp;
                <i className="fa fa-spinner fa-spin right" />
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.user.loading,
    loadingKeyAssign: state.user.loadingKeyAssign,
    error: state.user.error,
    success: state.user.success,
    pageLoading: state.user.pageLoading,
  };
};

ModifyUser.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  // onAuth: PropTypes.func.isRequired,
  // error: PropTypes.string.isRequired
};

// export default (withSnackbar(AddUsers));
export default connect(mapStateToProps)(withSnackbar(ModifyUser));
