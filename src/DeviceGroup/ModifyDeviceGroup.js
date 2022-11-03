import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import { timeZoneList, resetErrorAndSuccessState } from "../store/actions/userActions";
import { availableDeviceList, updateAvailableDeviceList, modifyDeviceGroup, fail, deviceGroupDetails, deviceGroupDetailsSuccess } from "../store/actions/deviceGroupActions";
import { withSnackbar } from "notistack";
import { makeStyles } from '@material-ui/core/styles';
import Loader from "../PageLoader"
import Footer from "../footer"
import Submenu from "../header_sub_menu"
import Switch from '@material-ui/core/Switch';

import {
  TextField,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  Box,
  Avatar,
  ListItemText,
  Divider,
  Typography,
  FormControl
} from "@material-ui/core";
import ForwardIcon from "@material-ui/icons/Forward";
import "../App.css";
import DateFnsUtils from '@date-io/date-fns';
import { format } from "date-fns";

import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Autocomplete } from '@material-ui/lab';
import { getTimes } from "../helper/commonHelper";


const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    }
  },
  margin: {
    margin: theme.spacing(0),
  },
  active: {
    cursor: "pointer",
    "&:hover": {
      background: "#efefef"
    },
    "&:last-child": {
      borderRight: "solid 1px #cccccc"
    }
  },
}));

const ModifyDeviceGroup = (props) => {
  const { enqueueSnackbar, error,success, loading, pageLoading } = props;
  const classes = useStyles();
  const { timeZone_List } = useSelector((state) => state.user)
  const { available_Devices } = useSelector((state) => state.deviceGroup)
  const { device_GroupDetails } = useSelector((state) => state.deviceGroup)

  const dispatch = useDispatch()

  const history = useHistory()

  // const [deviceGroup, setDeviceGroup] = useState([])
  // const [time, settime] = useState({startTime:"", endTime:""})
  const [timeList, settimeList] = useState([])

  const [oldGroupDetails, seOldGroupDetails] = useState(device_GroupDetails)
  

  // const [values, setValues] = React.useState({
  //   fullName: "",
  //   displayName: "",
  //   startAt: "",
  //   endAt: "",
  //   zone: "",
  //   description: "",
  //   monday: false,
  //   tuesday: false,
  //   wednesday: false,
  //   thursday: false,
  //   friday: false,
  //   saturday: false,
  //   sunday: false,
  // });

  const [formValidation, setFormValidation] = React.useState({
    fullName: "",
    displayName: ""
  });

  const handleValidation = () => {
    let isError = false;
    const formerr = { ...formValidation };
    if (!device_GroupDetails.full_name) {
      isError = true;
      formerr.full_name = "Required full name";
      setFormValidation(formerr);
    }

    if (!device_GroupDetails.display_name) {
      isError = true;
      formerr.display_name = "Required display name";
      setFormValidation(formerr);
    }

    return isError;
  };

  const handleChange = (prop) => (event) => {    
    var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    if(prop == 'status'){
      value = event.target.checked ? "3" : "1"
    }
    dispatch(deviceGroupDetailsSuccess({ ...device_GroupDetails, [prop]: value }));
    const formerr = { ...formValidation };
    formerr[event.target.name] = null;
    setFormValidation(formerr);
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (handleValidation()) return false;

    if(device_GroupDetails.sch_monday === false &&
      device_GroupDetails.sch_tuesday === false &&
      device_GroupDetails.sch_wednesday === false &&
      device_GroupDetails.sch_thursday === false &&
      device_GroupDetails.sch_friday === false &&
      device_GroupDetails.sch_saturday === false &&
      device_GroupDetails.sch_sunday === false){
        dispatch(fail("Please choose at least one day."))
        return
    }
    else if(device_GroupDetails.deviceDetails.length == 0){
        dispatch(fail("Please add at least one device to group."))
        return
    }
    
    const Data = {
      id: device_GroupDetails.id,
      display_name: device_GroupDetails.display_name,
      full_name: device_GroupDetails.full_name,
      description: device_GroupDetails.description,
      sch_monday: device_GroupDetails.sch_monday,
      sch_tuesday: device_GroupDetails.sch_tuesday,
      sch_wednesday: device_GroupDetails.sch_wednesday,
      sch_thursday: device_GroupDetails.sch_thursday,
      sch_friday: device_GroupDetails.sch_friday,
      sch_saturday: device_GroupDetails.sch_saturday,
      sch_sunday: device_GroupDetails.sch_sunday,
      start_at: device_GroupDetails.start_at,
      end_at: device_GroupDetails.end_at,
      time_zone: device_GroupDetails.time_zone,
      available_devices: device_GroupDetails.deviceDetails,
      status: device_GroupDetails.status
    }
    
    dispatch(modifyDeviceGroup(Data, oldGroupDetails))
  };


  useEffect(() => {
    const id = localStorage.getItem("tempDeviceGroupId");
    if (!id) {
      history.push({
        pathname: "/deviceGroups",
      });
    }
    else {
      dispatch(deviceGroupDetails(id));
      dispatch(timeZoneList());
      dispatch(availableDeviceList(id, true));
    }
    
  }, [dispatch]);


  useEffect(() => {
    error && enqueueSnackbar(error, { variant: "error" });
    dispatch(resetErrorAndSuccessState())
  }, [error]);


  useEffect(() => {
    success && enqueueSnackbar(success, { variant: "success" });
    dispatch(resetErrorAndSuccessState());
  }, [success]);


  const handleChangeSchedule = (event, type) => {
    if (event) {
      if (type === 'start_at') {
        dispatch(deviceGroupDetailsSuccess({ ...device_GroupDetails, start_at: event }));
        // settime({...time, startTime: event})
      }
      else if (type === 'end_at') {
        dispatch(deviceGroupDetailsSuccess({ ...device_GroupDetails, end_at: event }));
        // settime({...time, endTime: event})
      }
      else if (type === 'zone') {
        dispatch(deviceGroupDetailsSuccess({ ...device_GroupDetails, time_zone: event }));
      }
    }
  };


  const handleDeviceClick = (event) => {
    dispatch(updateAvailableDeviceList(available_Devices.filter((e)=>(e !== event))))
    var details = {...device_GroupDetails}
    details.deviceDetails.push(event);
    dispatch(deviceGroupDetailsSuccess(details));
  }

  const handleDeviceClickRemove = (event) => {
    dispatch(updateAvailableDeviceList([...available_Devices, event]))

    var details = {...device_GroupDetails}
    details.deviceDetails = details.deviceDetails.filter((e)=>(e !== event));
    dispatch(deviceGroupDetailsSuccess(details));
  }


  useEffect(() => {
    settimeList(getTimes())  
  }, [getTimes]);

  return (
    <div>
      { pageLoading ? <Loader /> : null}
      
      <Submenu/>

      <div className="Contborder">
        <div className="row">
          <div className="col-md-12">
            <div className="card" style={{marginBottom: 0}}>
              <div className="card-header">
                <div className="row" style={{marginTop: "-10px"}}>
                  <div className="col-md-4 my-3 ">
                    <Button variant="contained" color="primary" size="medium" className="mr-3" onClick={handleSubmitClick}>
                      Save <i className="fa fa-spinner fa-spin right" style={{ display: props.loading ? 'block' : 'none' }}/>
                    </Button>
                    <Link to="/deviceGroups">
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="medium"
                      >
                        Cancel & Return<br></br>To Device Groups
                      </Button>
                    </Link>
                    <div className="row mt-4">
                      <div className="col-md-12">
                        <TextField
                          id="lname"
                          fullWidth
                          label="Display Name (required)"
                          variant="outlined"
                          name="display_name"
                          value={device_GroupDetails.display_name}
                          onChange={handleChange("display_name")}
                          error={!!formValidation.display_name}
                          helperText={formValidation.display_name}
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-12">
                        <TextField
                          id="fname"
                          fullWidth
                          label="Full Name (required)"
                          variant="outlined"
                          name="full_name"
                          value={device_GroupDetails.full_name}
                          onChange={handleChange("full_name")}
                          error={!!formValidation.full_name}
                          helperText={formValidation.full_name}
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-12">
                        <TextField
                          id="fname"
                          fullWidth
                          label="Description"
                          multiline
                          rows={10}
                          variant="outlined"
                          name="description"
                          value={device_GroupDetails.description}
                          onChange={handleChange("description")}
                        />
                      </div>
                    </div>
                    <Divider variant="middle1" className="mt-4 mb-4" style={{ background: '#1E4CA1' }} />
                    <div className="row">
                      <div className="col-md-12">
                        <Typography variant="subtitle1" className="text-center mb-2"><strong>Access Days and Times</strong></Typography>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6 text-right mt-2"><Typography variant="subtitle2"><strong>Monday</strong></Typography></div>
                          <div className="col-md-5">
                            <Box display="flex" alignItems="left" style={{marginLeft: "-15px"}}>
                              <Switch
                                color="primary"
                                checked={device_GroupDetails.sch_monday}
                                inputProps={{ 'aria-label': 'primary' }}
                                name="sch_monday"
                                onChange={handleChange("sch_monday")}
                              />
                            </Box>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6 text-right mt-2"><Typography variant="subtitle2"><strong>Tuesday</strong></Typography></div>
                          <div className="col-md-5">
                            <Box display="flex" alignItems="left" style={{marginLeft: "-15px"}}>
                              <Switch
                                color="primary"
                                checked={device_GroupDetails.sch_tuesday}
                                inputProps={{ 'aria-label': 'primary' }}
                                name="sch_tuesday"
                                onChange={handleChange("sch_tuesday")}
                              />
                            </Box>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6 text-right mt-2"><Typography variant="subtitle2"><strong>Wednesday</strong></Typography></div>
                          <div className="col-md-5">
                            <Box display="flex" alignItems="left" style={{marginLeft: "-15px"}}>
                              <Switch
                                color="primary"
                                checked={device_GroupDetails.sch_wednesday}
                                inputProps={{ 'aria-label': 'primary' }}
                                name="sch_wednesday"
                                onChange={handleChange("sch_wednesday")}
                              />
                            </Box>
                          </div>
                        </div>
                        
                        <div className="row">
                          <div className="col-md-6 text-right mt-2"><Typography variant="subtitle2"><strong>Thursday</strong></Typography></div>
                          <div className="col-md-5">
                            <Box display="flex" alignItems="left" style={{marginLeft: "-15px"}}>
                              <Switch
                                color="primary"
                                checked={device_GroupDetails.sch_thursday}
                                inputProps={{ 'aria-label': 'primary' }}
                                name="sch_thursday"
                                onChange={handleChange("sch_thursday")}
                              />
                            </Box>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6 text-right mt-2"><Typography variant="subtitle2"><strong>Friday</strong></Typography></div>
                          <div className="col-md-5">
                            <Box display="flex" alignItems="left" style={{marginLeft: "-15px"}}>
                              <Switch
                                color="primary"
                                checked={device_GroupDetails.sch_friday}
                                inputProps={{ 'aria-label': 'primary' }}
                                name="sch_friday"
                                onChange={handleChange("sch_friday")}
                              />
                            </Box>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6 text-right mt-2"><Typography variant="subtitle2"><strong>Saturday</strong></Typography></div>
                          <div className="col-md-5">
                            <Box display="flex" alignItems="left" style={{marginLeft: "-15px"}}>
                              <Switch
                                color="primary"
                                checked={device_GroupDetails.sch_saturday}
                                inputProps={{ 'aria-label': 'primary' }}
                                name="sch_saturday"
                                onChange={handleChange("sch_saturday")}
                              />
                            </Box>
                          </div>
                        </div>
                        
                        <div className="row">
                          <div className="col-md-6 text-right mt-2"><Typography variant="subtitle2"><strong>Sunday</strong></Typography></div>
                          <div className="col-md-5">
                            <Box display="flex" alignItems="left" style={{marginLeft: "-15px"}}>
                              <Switch
                                color="primary"
                                checked={device_GroupDetails.sch_sunday}
                                inputProps={{ 'aria-label': 'primary' }}
                                name="sch_sunday"
                                onChange={handleChange("sch_sunday")}
                              />
                            </Box>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-md-12">
                        <Typography variant="h5" className="mb-3 text-center mt-3">Modifly a Device Group</Typography>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-5">
                        <Typography variant="subtitle1" className="text-center mt-2 mb-2"><strong>Available Devices</strong></Typography>
                        <Card
                          variant="outlined"
                          style={{
                            height: "600px",
                            borderRadius: "40px",
                            border: "3px solid #3477eb",
                          }}
                        >
                          <CardContent>
                            <List style={{ minHeight: 540, maxHeight: 540, overflow: "auto" }}>
                              {available_Devices.length > 0 ?
                                (available_Devices.map((item, i) => (
                                  <div>
                                    <ListItem className={classes.active} onClick={() => handleDeviceClick(item)}>
                                      <ListItemText primary={item.full_name} />
                                    </ListItem>
                                    <Divider component="li" />
                                  </div>
                                )))
                                : (<Typography variant="subtitle2" style={{ textAlign: "center", marginTop: 40 + "%" }} className="mb-3">No device available...</Typography>)}
                            </List>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="col-md-2">
                        <ForwardIcon color="primary" style={{ fontSize: "60px", marginTop: "280px", marginLeft: "18px" }} />
                        <ForwardIcon
                          color="primary"
                          style={{
                            fontSize: "60px",
                            marginTop: "0px",
                            marginLeft: "18px",
                            transform: "rotate(180deg)",
                          }}
                        />
                      </div>
                      <div className="col-md-5">
                        <Typography variant="subtitle1" className="text-center mt-2 mb-2"><strong>Devices in Group</strong></Typography>
                        <Card
                          variant="outlined"
                          style={{
                            height: "600px",
                            borderRadius: "40px",
                            border: "3px solid #3477eb",
                          }}
                        >
                          <CardContent>
                            <List style={{ minHeight: 540, maxHeight: 540, overflow: "auto" }}>
                              {device_GroupDetails.deviceDetails.length > 0 ?
                                (device_GroupDetails.deviceDetails.map((item, i) => (
                                  <div>
                                    <ListItem className={classes.active} onClick={() => handleDeviceClickRemove(item)}>
                                      <ListItemText primary={item.full_name} />
                                    </ListItem>
                                    <Divider component="li" />
                                  </div>
                                )))
                                : (<Typography variant="subtitle2" style={{ textAlign: "center", marginTop: 40 + "%" }} className="mb-3">No device group...</Typography>)}
                            </List>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    <div className="row mt-5 rowtime mb-4">
                      <form class="form-inline" role="form">
                        <div class="col-md-12">
                        <Box display="flex" alignItems="center">
                          <TextField
                            size="small"
                            type="time"
                            label="Start at"
                            variant="outlined"
                            name="start_at"
                            value={device_GroupDetails.start_at}
                            onChange={handleChange("start_at")}
                            InputLabelProps={{ shrink: true, style: {fontSize: 15} }}
                            style={{ width: 130 }}
                            className="mr-2"
                          />
                          <TextField
                            size="small"
                            type="time"
                            label="End at"
                            variant="outlined"
                            name="end_at"
                            value={device_GroupDetails.end_at}
                            onChange={handleChange("end_at")}
                            InputLabelProps={{ shrink: true, style: {fontSize: 15} }}
                            style={{ width: 130 }}
                            // className="mr-2"
                          />
                          <FormControl variant="outlined">
                            <Autocomplete
                              size="small"
                              style={{ width: 130, marginLeft: 7, marginRight: 15 }}
                              id="combo-box-demo"
                              value={device_GroupDetails.time_zone}
                              onChange={(event, val) => handleChangeSchedule(val, 'zone')}
                              options={timeZone_List}
                              getOptionLabel={(option) => option.time_zone}
                              renderInput={(params) => <TextField {...params} label="Zone" variant="outlined" />}
                            />
                          </FormControl>
                          
                            <Typography variant="subtitle2"><strong>De-Active Device Group </strong></Typography>
                            <Switch
                              color="primary"
                              checked={device_GroupDetails.status == "3" ? true : false}
                              inputProps={{ 'aria-label': 'primary' }}
                              name="status"
                              onChange={handleChange("status")}
                            />
                          </Box>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </div>
  )
};


const mapStateToProps = (state) => {
  return {
    loading: state.deviceGroup.loading,
    error: state.deviceGroup.error,
    success: state.deviceGroup.success,
    pageLoading: state.deviceGroup.pageLoading
  };
};

ModifyDeviceGroup.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  onAuth: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired

};


export default connect(
  mapStateToProps
)(withSnackbar(ModifyDeviceGroup));
