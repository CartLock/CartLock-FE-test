import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import { withSnackbar } from "notistack";
import Loader from "../PageLoader";
import Footer from "../footer";
import Submenu from "../header_sub_menu";
import Switch from "@material-ui/core/Switch";
import validator from "validator";
import {
  BrowserRouter as Router,
  useHistory,
  Route,
  Link,
} from "react-router-dom";
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
import {
  Group,
  Devices,
  DevicesOther,
  Description,
  ContactSupport,
  Settings,
  Delete,
} from "@material-ui/icons";
import HelpIcon from "@material-ui/icons/Help";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import ForwardIcon from "@material-ui/icons/Forward";
import "../App.css";
import Tooltip from "@material-ui/core/Tooltip";
import {
  modifyCompanySettings,
  getCompanySettings,
  resetErrorAndSuccessState,
  companySettingsDetailsSuccess,
} from "../store/actions/companySettingsActions";
import { timeZoneList } from "../store/actions/userActions";
import { Autocomplete } from "@material-ui/lab";
import moment from "moment";
import SideNavBar from "../SideNavBar";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  infoStyle: {
    marginLeft: 10,
    cursor: "pointer",
  },
}));

const CompanySettings = (props) => {
  const { enqueueSnackbar, error, success, loading, pageLoading } = props;
  const { timeZone_List } = useSelector((state) => state.user);
  const { companySettingsDetails } = useSelector(
    (state) => state.companySettings
  );

const currency=["INR","ALL"]
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const handleChange = (prop) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    dispatch(
      companySettingsDetailsSuccess({
        ...companySettingsDetails,
        [prop]: value,
      })
    );
  };

  const [oldSettings, setOldSettings] = React.useState(companySettingsDetails);

  const handleSubmitClick = (e) => {
    console.log("Waiting hour::::"+companySettingsDetails.waiting_hour)
    const companyId = localStorage.getItem("tempCompId");
    var Data = {
      id: companySettingsDetails.id,
      companyId: companyId,
      isMultiPhoneLogin: companySettingsDetails.is_multi_phone_login,
      offlineReconectTime: companySettingsDetails.offline_reconect,
      defaultTimeZone: companySettingsDetails.default_time_zone,
      ekeyDuration: companySettingsDetails.ekey_duration,
      defaultCountryCode: companySettingsDetails.default_country_code,

      //New Field goes here
      paymentCost: companySettingsDetails.payment_cost,
      currency: companySettingsDetails.currency,
      waitingHour: companySettingsDetails.waiting_hour,
    };

    if (!companySettingsDetails.id) {
      Data.scheduleOpens = [
        {
          scheduleDay: "Monday",
          openWholeDay: false,
          openTime: "",
          closeTime: "",
        },
        {
          scheduleDay: "Tuesday",
          openWholeDay: false,
          openTime: "",
          closeTime: "",
        },
        {
          scheduleDay: "Wednesday",
          openWholeDay: false,
          openTime: "",
          closeTime: "",
        },
        {
          scheduleDay: "Thursday",
          openWholeDay: false,
          openTime: "",
          closeTime: "",
        },
        {
          scheduleDay: "Friday",
          openWholeDay: false,
          openTime: "",
          closeTime: "",
        },
        {
          scheduleDay: "Saturday",
          openWholeDay: false,
          openTime: "",
          closeTime: "",
        },
        {
          scheduleDay: "Sunday",
          openWholeDay: false,
          openTime: "",
          closeTime: "",
        },
      ];
      Data.scheduleExceptions = [
        {
          exceptionDate: moment().format("YYYY-MM-DD"),
          openWholeDay: false,
          openTime: "",
          closeTime: "",
        },
      ];
    }

    dispatch(modifyCompanySettings(Data, oldSettings));
  };

  useEffect(() => {
    dispatch(timeZoneList());
    dispatch(getCompanySettings());
  }, [dispatch]);

  useEffect(() => {
    error && enqueueSnackbar(error, { variant: "error" });
    dispatch(resetErrorAndSuccessState());
  }, [error]);

  useEffect(() => {
    success && enqueueSnackbar(success, { variant: "success" });
    dispatch(resetErrorAndSuccessState());
  }, [success]);

  const handleChangeSchedule = (event, type) => {
    if (event) {
      if (type == "zone") {
        // const zoneDetails = {...companySettingsDetails}
        // zoneDetails['default_time_zone'] = event.full_time_zone
        // zoneDetails['default_time_zone_details'] = event
        // dispatch(companySettingsDetailsSuccess(zoneDetails));
        dispatch(
          companySettingsDetailsSuccess({
            ...companySettingsDetails,
            default_time_zone: event,
          })
        );
      }
      if(type=="currency")
      {
        dispatch(
          companySettingsDetailsSuccess({
            ...companySettingsDetails,
            currency: event.currency,
          })
        ); 
      }
      if (type == "offline_reconect") {
        dispatch(
          companySettingsDetailsSuccess({
            ...companySettingsDetails,
            offline_reconect: event.hour,
          })
        );
      }
      if (type == "ekey_duration") {
        dispatch(
          companySettingsDetailsSuccess({
            ...companySettingsDetails,
            ekey_duration: event.hour,
          })
        );
      }
    }
  };

  return (
    <>
      <SideNavBar />
      <div className="main">
        {pageLoading ? <Loader /> : null}

        <Submenu />

        <div className="Contborder" style={{ height: "auto" }}>
          <div className="row" style={{ height: "100%" }}>
            <div className="col-md-12" style={{ height: "100%" }}>
              <div className="card" style={{ marginBottom: 0, height: "100%" }}>
                <div className="card-header">
                  <div className="row">
                    <div className="col-md-8"></div>
                    <div className="col-md-4">
                      <Link
                      style={{
                          border: "2px solid",
                          borderColor: " #1b330a",
                          borderRadius: "8px",
                          borderWidth: "2px",
                          backgroundColor: "#a9d18e",
                          color: "#1b330a",
                        }}
                        class="btn btn-primary float-right mr-2"
                        to="/companyMailerSetting"
                      >
                        Company's Mailer Config
                      </Link>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-2"></div>
                    <div className="col-md-8">
                      <List>
                        <ListItem
                          style={{ marginTop: "17px", marginBottom: "17px" }}
                        >
                          <Typography
                            style={{ color: "#1b330a" }}
                            variant="subtitle2"
                          >
                            <strong>Payment Cost</strong>
                          </Typography>
                          <ListItemAvatar>
                            <Tooltip title="Default Payment Cost" arrow>
                              <HelpIcon
                                style={{ color: "#a9d18e" }}
                                className={classes.infoStyle}
                              />
                            </Tooltip>
                          </ListItemAvatar>
                          <ListItemSecondaryAction>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              style={{ width: 130 }}
                              name="payment_cost"
                              value={companySettingsDetails.payment_cost}
                              onChange={handleChange("payment_cost")}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider
                          variant="middle1"
                          style={{ background: "#1b330a" }}
                        />
                        {/* <ListItem
                          style={{ marginTop: "17px", marginBottom: "17px" }}
                        >
                          <Typography
                            style={{ color: "#1b330a" }}
                            variant="subtitle2"
                          >
                            <strong>Payment Currency</strong>
                          </Typography>
                          <ListItemAvatar>
                            <Tooltip title=" Default Payment Currency" arrow>
                              <HelpIcon
                                style={{ color: "#a9d18e" }}
                                className={classes.infoStyle}
                              />
                            </Tooltip>
                          </ListItemAvatar>
                          <ListItemSecondaryAction>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              style={{ width: 130 }}
                              name="currency"
                              value={companySettingsDetails.currency}
                              onChange={handleChange("currency")}
                            />
                          </ListItemSecondaryAction>
                        </ListItem> */}
                        
                       <ListItem
                          style={{ marginTop: "17px", marginBottom: "17px" }}
                        >
                          <Typography
                            style={{ color: "#1b330a" }}
                            variant="subtitle2"
                          >
                            <strong>Waiting Hours</strong>
                          </Typography>
                          <ListItemAvatar>
                            <Tooltip title=" Default Waiting hour" arrow>
                              <HelpIcon
                                style={{ color: "#a9d18e" }}
                                className={classes.infoStyle}
                              />
                            </Tooltip>
                          </ListItemAvatar>
                          <ListItemSecondaryAction>
                            <TextField
                              type="time"
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              style={{ width: 130 }}
                              name="waiting_hour"
                              value={companySettingsDetails.waiting_hour}
                              onChange={handleChange("waiting_hour")}
                            />
                          </ListItemSecondaryAction>
                        </ListItem> 

                        {/* <ListItem style={{marginTop: "10px", marginBottom: "10px"}}>
                        <Typography
                        style={{ color: "#1b330a" }}
                        variant="subtitle2"><strong>Waiting Hours</strong></Typography>
                        <ListItemAvatar>
                          <Tooltip title="Use Offline, Forced Reconnect" arrow>
                            <HelpIcon
                              style={{ color: "#a9d18e" }}
                            className={classes.infoStyle}/>
                          </Tooltip>
                        </ListItemAvatar>
                        <ListItemSecondaryAction>
                          <FormControl variant="outlined">
                            <Autocomplete
                              size="small"
                              style={{ width: 130 }}
                              id="combo-box-demo"
                              value={companySettingsDetails.offline_reconect ? {id: 1, hour: companySettingsDetails.offline_reconect } : null}
                              onChange={(event, val) => handleChangeSchedule(val, 'offline_reconect')}
                              options={Hours}
                              getOptionLabel={(option) => option.hour}
                              renderInput={(params) => <TextField {...params} label="hrs" variant="outlined" />}
                            />
                          </FormControl>
                        </ListItemSecondaryAction>
                      </ListItem> */}
                      <Divider
                          variant="middle1"
                          style={{ background: "#1b330a" }}
                        />

                      <ListItem style={{marginTop: "10px", marginBottom: "10px"}}>
                        <Typography
                        style={{ color: "#1b330a" }}
                        variant="subtitle2"><strong>Currency</strong></Typography>
                        <ListItemAvatar>
                          <Tooltip title="Use Offline, Forced Reconnect" arrow>
                            <HelpIcon
                              style={{ color: "#a9d18e" }}
                            className={classes.infoStyle}/>
                          </Tooltip>
                        </ListItemAvatar>
                        <ListItemSecondaryAction>
                          <FormControl variant="outlined">
                            <Autocomplete
                              size="small"
                              style={{ width: 130 }}
                              id="combo-box-demo"
                              value={companySettingsDetails.currency ? {id: 1, currency: companySettingsDetails.currency } : null}
                              onChange={(event, val) => handleChangeSchedule(val, 'currency')}
                              options={Currency}
                              getOptionLabel={(option) => option.currency}
                              renderInput={(params) => <TextField {...params} label="currency" variant="outlined" />}
                            />
                          </FormControl>
                        </ListItemSecondaryAction>
                      </ListItem>



                      {/* <ListItem style={{marginTop: "17px", marginBottom: "17px"}}>
                        <Typography variant="subtitle2"><strong>Default Time Zone</strong></Typography>
                        <ListItemAvatar>
                          <Tooltip title="Default Time Zone" arrow>
                            <HelpIcon className={classes.infoStyle}/>
                          </Tooltip>
                        </ListItemAvatar>
                        <ListItemSecondaryAction>
                          <FormControl variant="outlined">
                            <Autocomplete
                              size="small"
                              style={{ width: 130 }}
                              id="combo-box-demo"
                              value={companySettingsDetails.default_time_zone}
                              onChange={(event, val) => handleChangeSchedule(val, 'zone')}
                              options={currency}
                              getOptionLabel={(option) => option.time_zone}
                              renderInput={(params) => <TextField {...params} label="Zone" variant="outlined" />}
                            />
                          </FormControl>
                        </ListItemSecondaryAction>
                      </ListItem> */}

                      </List>

                      {/* Old Code goes Here */}

                      {/* <List>
                      <ListItem>
                        <Typography variant="subtitle2"><strong>Enable Multi-Phone Login</strong></Typography>
                        <ListItemAvatar>
                          <Tooltip title="Enable Multi-Phone Login" arrow>
                            <HelpIcon className={classes.infoStyle}/>
                          </Tooltip>
                        </ListItemAvatar>
                        <ListItemSecondaryAction>
                          <Switch
                            color="primary"
                            checked={companySettingsDetails.is_multi_phone_login ? true : false}
                            inputProps={{ 'aria-label': 'primary' }}
                            name="is_multi_phone_login"
                            onChange={handleChange("is_multi_phone_login")}
                          />  
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider variant="middle1" style={{ background: '#1E4CA1' }} />

                      <ListItem style={{marginTop: "10px", marginBottom: "10px"}}>
                        <Typography variant="subtitle2"><strong>Use Offline, Forced Reconnect</strong></Typography>
                        <ListItemAvatar>
                          <Tooltip title="Use Offline, Forced Reconnect" arrow>
                            <HelpIcon className={classes.infoStyle}/>
                          </Tooltip>
                        </ListItemAvatar>
                        <ListItemSecondaryAction>
                          <FormControl variant="outlined">
                            <Autocomplete
                              size="small"
                              style={{ width: 130 }}
                              id="combo-box-demo"
                              value={companySettingsDetails.offline_reconect ? {id: 1, hour: companySettingsDetails.offline_reconect } : null}
                              onChange={(event, val) => handleChangeSchedule(val, 'offline_reconect')}
                              options={Hours}
                              getOptionLabel={(option) => option.hour}
                              renderInput={(params) => <TextField {...params} label="hrs" variant="outlined" />}
                            />
                          </FormControl>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider variant="middle1" style={{ background: '#1E4CA1' }} />

                      <ListItem style={{marginTop: "12px", marginBottom: "12px"}}>
                        <Typography variant="subtitle2"><strong>Set 'Scheduled Open' Default</strong></Typography>
                        <ListItemAvatar>
                          <Tooltip title="Set 'Scheduled Open' Default" arrow>
                            <HelpIcon className={classes.infoStyle}/>
                          </Tooltip>
                        </ListItemAvatar>
                        <ListItemSecondaryAction>
                          <Link to="/scheduleOpen" style={{display: companySettingsDetails.id ? 'block' : 'none'}}>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              style={{ width: 130 }}
                            >
                              Set
                            </Button>
                          </Link>
                          <Button
                            disabled
                            variant="contained"
                            color="primary"
                            size="small"
                            style={{display: companySettingsDetails.id ? 'none' : 'block', width: 130}}
                          >
                            Set
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider variant="middle1" style={{ background: '#1E4CA1' }} />

                      <ListItem style={{marginTop: "17px", marginBottom: "17px"}}>
                        <Typography variant="subtitle2"><strong>Default Time Zone</strong></Typography>
                        <ListItemAvatar>
                          <Tooltip title="Default Time Zone" arrow>
                            <HelpIcon className={classes.infoStyle}/>
                          </Tooltip>
                        </ListItemAvatar>
                        <ListItemSecondaryAction>
                          <FormControl variant="outlined">
                            <Autocomplete
                              size="small"
                              style={{ width: 130 }}
                              id="combo-box-demo"
                              value={companySettingsDetails.default_time_zone}
                              onChange={(event, val) => handleChangeSchedule(val, 'zone')}
                              options={timeZone_List}
                              getOptionLabel={(option) => option.time_zone}
                              renderInput={(params) => <TextField {...params} label="Zone" variant="outlined" />}
                            />
                          </FormControl>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider variant="middle1" style={{ background: '#1E4CA1' }} />

                      <ListItem style={{marginTop: "10px", marginBottom: "10px"}}>
                        <Typography variant="subtitle2"><strong>Installer Temp. ekey Duration</strong></Typography>
                        <ListItemAvatar>
                          <Tooltip title="Installer Temp. ekey Duration" arrow>
                            <HelpIcon className={classes.infoStyle}/>
                          </Tooltip>
                        </ListItemAvatar>
                        <ListItemSecondaryAction>
                          <FormControl variant="outlined">
                            <Autocomplete
                              size="small"
                              style={{ width: 130 }}
                              id="combo-box-demo"
                              value={companySettingsDetails.ekey_duration ? {id: 1, hour: companySettingsDetails.ekey_duration } : null}
                              onChange={(event, val) => handleChangeSchedule(val, 'ekey_duration')}
                              options={Hours}
                              getOptionLabel={(option) => option.hour}
                              renderInput={(params) => <TextField {...params} label="hrs" variant="outlined" />}
                            />
                          </FormControl>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider variant="middle1" style={{ background: '#1E4CA1' }} />

                      <ListItem style={{marginTop: "17px", marginBottom: "17px"}}>
                        <Typography variant="subtitle2"><strong>Default Phone Country Code</strong></Typography>
                        <ListItemAvatar>
                          <Tooltip title="Default Phone Country Code" arrow>
                            <HelpIcon className={classes.infoStyle}/>
                          </Tooltip>
                        </ListItemAvatar>
                        <ListItemSecondaryAction>
                          <TextField
                            id="outlined-basic"
                            label="Code"
                            variant="outlined"
                            size="small"
                            style={{ width: 130 }}
                            name="default_country_code"
                            value={companySettingsDetails.default_country_code}
                            onChange={handleChange("default_country_code")}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider variant="middle1" style={{ background: '#1E4CA1' }} />

                      <ListItem style={{marginTop: "12px"}}>
                      <Typography variant="subtitle2"><strong>Set Fob Programmers</strong></Typography>
                        <ListItemAvatar>
                          <Tooltip title="Set Fob Programmers" arrow>
                            <HelpIcon className={classes.infoStyle}/>
                          </Tooltip>
                        </ListItemAvatar>
                        <ListItemSecondaryAction>
                          <Link to="/setFobProgramers" style={{display: companySettingsDetails.id ? 'block' : 'none'}}>
                            <Button                            
                              variant="contained"
                              color="primary"
                              size="small"
                              style={{ width: 130 }}
                            >
                              Set
                            </Button>
                          </Link>
                          <Button
                            disabled
                            variant="contained"
                            color="primary"
                            size="small"
                            style={{display: companySettingsDetails.id ? 'none' : 'block', width: 130}}
                          >
                            Set
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List> 
                    */}
                      <Button
                        style={{
                          border: "2px solid",
                          borderColor: " #1b330a",
                          borderRadius: "8px",
                          borderWidth: "2px",
                          backgroundColor: "#a9d18e",
                          color: "#1b330a",
                        }}
                        className="mt-4"
                        variant="contained"
                        size="large"
                        onClick={handleSubmitClick}
                      >
                        {companySettingsDetails.id ? "Modify" : "Submit"}
                        &nbsp;
                        <i
                          className="fa fa-spinner fa-spin"
                          style={{ display: props.loading ? "block" : "none" }}
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <Footer /> */}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.companySettings.loading,
    error: state.companySettings.error,
    success: state.companySettings.success,
    pageLoading: state.companySettings.pageLoading,
  };
};

CompanySettings.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(withSnackbar(CompanySettings));

var Hours = new Array();
for (let index = 1; index < 25; index++) {
  var key = { id: index, hour: String(index) };
  Hours.push(key);
}

const currencyList=["ALL","DZD","AOA","ARS","AMD","AUD","EUR","AZN","BHD",
"BBD","DKK","INR"
]
var Currency=new Array();
  for(let index=0;index<currencyList.length;index++){
    var key = { id: index, currency:currencyList[index] };
Currency.push(key)
  }
console.log(Currency)