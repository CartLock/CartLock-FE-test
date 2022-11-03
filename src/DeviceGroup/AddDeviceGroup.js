import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import { timeZoneList, resetErrorAndSuccessState } from "../store/actions/userActions";
import { availableDeviceList, updateAvailableDeviceList, createDeviceGroup, fail } from "../store/actions/deviceGroupActions";
import { withSnackbar } from "notistack";
import { makeStyles } from '@material-ui/core/styles';
import Loader from "../PageLoader"
import Footer from "../footer"
import Submenu from "../header_sub_menu"
import Switch from '@material-ui/core/Switch';
import { format } from 'date-fns'
import { getTimes } from "../helper/commonHelper";

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
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Autocomplete } from '@material-ui/lab';


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
    // background: "#80808094",
    cursor: "pointer",
    "&:hover": {
      background: "#efefef"
    },
    "&:last-child": {
      borderRight: "solid 1px #cccccc"
    }
  },
}));

const AddDeviceGroup = (props) => {
  const { enqueueSnackbar, error,success, loading } = props;
  const classes = useStyles();
  const { timeZone_List } = useSelector((state) => state.user)
  const { available_Devices } = useSelector((state) => state.deviceGroup)
  const dispatch = useDispatch()

  const history = useHistory()

  const [zoneValue, setZoneValue] = useState({})
  const [deviceGroup, setDeviceGroup] = useState([])
  const [timeList, settimeList] = useState([])

  const [values, setValues] = React.useState({
    fullName: "",
    displayName: "",
    startAt: "",
    endAt: "",
    zone: "",
    description: "",
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
    status:"1"
  });

  const [formValidation, setFormValidation] = React.useState({
    fullName: "",
    displayName: ""
  });

  const handleValidation = () => {
    let isError = false;
    const formerr = { ...formValidation };
    if (!values.fullName) {
      isError = true;
      formerr.fullName = "Required full name";
      setFormValidation(formerr);
    }

    if (!values.displayName) {
      isError = true;
      formerr.displayName = "Required display name";
      setFormValidation(formerr);
    }

    return isError;
  };

  const handleChange = (prop) => (event) => {
    var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    if(prop == 'status'){
      value = event.target.checked ? "3" : "1"
    }
    setValues({ ...values, [prop]: value });
    const formerr = { ...formValidation };
    formerr[event.target.name] = null;
    setFormValidation(formerr);
  };

  const handleSubmitClick = (e, returnRequired) => {
    e.preventDefault();
    if (handleValidation()) return false;

    if(values.monday === false &&
      values.tuesday === false &&
      values.wednesday === false &&
      values.thursday === false &&
      values.friday === false &&
      values.saturday === false &&
      values.sunday === false){
        dispatch(fail("Please choose at least one day."))
        return
    }
    else if(deviceGroup.length == 0){
        dispatch(fail("Please add at least one device to group."))
        return
    }
    
    const uData = {
      display_name: values.displayName,
      full_name: values.fullName,
      description: values.description,
      sch_monday: values.monday,
      sch_tuesday: values.tuesday,
      sch_wednesday: values.wednesday,
      sch_thursday: values.thursday,
      sch_friday: values.friday,
      sch_saturday: values.saturday,
      sch_sunday: values.sunday,
      start_at: values.startAt,// ? format(values.startAt, "HH:mm:ss") : null,
      end_at: values.endAt,// ? format(values.endAt, "HH:mm:ss") : null,
      time_zone: values.zone,
      available_devices: deviceGroup
    }

    history.push({
      isReturn: returnRequired
    });
    dispatch(createDeviceGroup(uData, history))
  };


  useEffect(() => {
    dispatch(timeZoneList());
    dispatch(availableDeviceList(true));
    
  }, [dispatch]);


  useEffect(() => {
    error && enqueueSnackbar(error, { variant: "error" });
    dispatch(resetErrorAndSuccessState())
  }, [error]);


  useEffect(() => {
    success && enqueueSnackbar(success, { variant: "success" });
    dispatch(resetErrorAndSuccessState());
    resetDeviceGroupForm();
  }, [success]);


  const handleChangeSchedule = (event, type) => {
    if (event) {
      if (type === 'startAt') {
        setValues({ ...values, startAt: event });
      }
      else if (type === 'endAt') {
        setValues({ ...values, endAt: event });
      }
      else if (type === 'zone') {
        setValues({ ...values, zone: event });
      }
    }
  };


  const handleDeviceClick = (event) => {
    dispatch(updateAvailableDeviceList(available_Devices.filter((e)=>(e !== event))))
    setDeviceGroup([...deviceGroup, event])
  }

  const handleDeviceClickRemove = (event) => {
    dispatch(updateAvailableDeviceList([...available_Devices, event]))
    setDeviceGroup(deviceGroup.filter((e)=>(e !== event)))
  }


  const resetDeviceGroupForm = () => {
    var resetForm = { ...values }
    resetForm["fullName"] = ""
    resetForm["displayName"] = ""
    resetForm["startAt"] = ""
    resetForm["endAt"] = ""
    resetForm["zone"] = ""
    resetForm["description"] = ""
    resetForm["startTime"] = ""
    resetForm["endTime"] = ""
    resetForm["zone"] = ""
    resetForm["monday"] = false
    resetForm["tuesday"] = false
    resetForm["wednesday"] = false
    resetForm["thursday"] = false
    resetForm["friday"] = false
    resetForm["saturday"] = false
    resetForm["sunday"] = false
    setValues(resetForm);
    setZoneValue({})
    setDeviceGroup([])
  }

  const [pageLoading, setPageLoading] = React.useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 1000);
  }, []);


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
                    <Button
                      variant="contained"
                      color="primary"
                      size="medium"
                      className="mr-3"
                      onClick={(event, value)=>handleSubmitClick(event, false)}
                    >
                      Add & Create<br></br> Another <i className="fa fa-spinner fa-spin right" style={{ display: props.loading ? 'block' : 'none' }}/>
                        </Button>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="medium"
                      onClick={(event, value)=>handleSubmitClick(event, true)}
                    >
                      Add & Return<br></br>To Device Groups
                    </Button>
                    <div className="row mt-4">
                      <div className="col-md-12">
                        <TextField
                          id="lname"
                          fullWidth
                          label="Display Name (required)"
                          variant="outlined"
                          name="displayName"
                          value={values.displayName}
                          onChange={handleChange("displayName")}
                          error={!!formValidation.displayName}
                          helperText={formValidation.displayName}
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
                          name="fullName"
                          value={values.fullName}
                          onChange={handleChange("fullName")}
                          error={!!formValidation.fullName}
                          helperText={formValidation.fullName}
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
                          value={values.description}
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
                                checked={values.monday}
                                inputProps={{ 'aria-label': 'primary' }}
                                name="monday"
                                onChange={handleChange("monday")}
                              />
                            </Box>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6 text-right mt-2"><Typography variant="subtitle2"><strong>Tuesday</strong></Typography></div>
                          <div className="col-md-6">
                            <Box display="flex" alignItems="center" style={{marginLeft: "-15px"}}>
                              <Switch
                                color="primary"
                                checked={values.tuesday}
                                inputProps={{ 'aria-label': 'primary' }}
                                name="tuesday"
                                onChange={handleChange("tuesday")}
                              />
                            </Box>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6 text-right mt-2"><Typography variant="subtitle2"><strong>Wednesday</strong></Typography></div>
                          <div className="col-md-6">
                            <Box display="flex" alignItems="center" style={{marginLeft: "-15px"}}>
                            <Switch
                              color="primary"
                              checked={values.wednesday}
                              inputProps={{ 'aria-label': 'primary' }}
                              name="wednesday"
                              onChange={handleChange("wednesday")}
                            />
                            </Box>
                          </div>
                        </div>
                        
                        <div className="row">
                          <div className="col-md-6 text-right mt-2"><Typography variant="subtitle2"><strong>Thursday</strong></Typography></div>
                          <div className="col-md-6">
                            <Box display="flex" alignItems="center" style={{marginLeft: "-15px"}}>
                            <Switch
                              color="primary"
                              checked={values.thursday}
                              inputProps={{ 'aria-label': 'primary' }}
                              name="thursday"
                              onChange={handleChange("thursday")}
                            />
                            </Box>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6 text-right mt-2"><Typography variant="subtitle2"><strong>Friday</strong></Typography></div>
                          <div className="col-md-6">
                            <Box display="flex" alignItems="center" style={{marginLeft: "-15px"}}>
                            <Switch
                              color="primary"
                              checked={values.friday}
                              inputProps={{ 'aria-label': 'primary' }}
                              name="friday"
                              onChange={handleChange("friday")}
                            />
                            </Box>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6 text-right mt-2"><Typography variant="subtitle2"><strong>Saturday</strong></Typography></div>
                          <div className="col-md-6">
                            <Box display="flex" alignItems="center" style={{marginLeft: "-15px"}}>
                            <Switch
                              color="primary"
                              checked={values.saturday}
                              inputProps={{ 'aria-label': 'primary' }}
                              name="saturday"
                              onChange={handleChange("saturday")}
                            />
                            </Box>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6 text-right mt-2"><Typography variant="subtitle2"><strong>Sunday</strong></Typography></div>
                          <div className="col-md-6">
                            <Box display="flex" alignItems="center" style={{marginLeft: "-15px"}}>
                            <Switch
                              color="primary"
                              checked={values.sunday}
                              inputProps={{ 'aria-label': 'primary' }}
                              name="sunday"
                              onChange={handleChange("sunday")}
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
                        <Typography variant="h5" className="mb-3 text-center mt-3">Add a Device Group</Typography>
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
                              {deviceGroup.length > 0 ?
                                (deviceGroup.map((item, i) => (
                                  <div>
                                    {/* <Button size="small"> */}
                                    <ListItem className={classes.active} onClick={() => handleDeviceClickRemove(item)}>
                                      <ListItemText primary={item.full_name} />
                                    </ListItem>

                                    <Divider component="li" />
                                    {/* </Button> */}
                                  </div>
                                )))
                                : (<Typography variant="subtitle2" style={{ textAlign: "center", marginTop: 40 + "%" }} className="mb-3">No device group...</Typography>)}
                            </List>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    <div className="row mt-5 rowtime">
                      <form class="form-inline" role="form">
                        <div class="col-md-12">
                          <Box display="flex" alignItems="center">
                            <TextField
                              size="small"
                              type="time"
                              label="Start at"
                              variant="outlined"
                              name="startAt"
                              // value={values.start_at}
                              onChange={handleChange("startAt")}
                              InputLabelProps={{ shrink: true, style: {fontSize: 15} }}
                              style={{ width: 130 }}
                              className="mr-2"
                            />
                            <TextField
                              size="small"
                              type="time"
                              label="End at"
                              variant="outlined"
                              name="endAt"
                              // value={values.end_at}
                              onChange={handleChange("endAt")}
                              InputLabelProps={{ shrink: true, style: {fontSize: 15} }}
                              style={{ width: 130 }}
                              // className="mr-2"
                            />
                            
                            <FormControl variant="outlined">
                              <Autocomplete
                                size="small"
                                style={{ width: 130, marginLeft: 8, marginRight: 15 }}
                                id="combo-box-demo"
                                value={values.zone}
                                onChange={(event, val) => handleChangeSchedule(val, 'zone')}
                                options={timeZone_List}
                                getOptionLabel={(option) => option.time_zone}
                                renderInput={(params) => <TextField {...params} label="Zone" variant="outlined" />}
                              />
                            </FormControl>

                            <Typography variant="subtitle2"><strong>De-Active Device Group </strong></Typography>
                            <Switch
                              color="primary"
                              checked={values.status == "3" ? true : false}
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

AddDeviceGroup.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  onAuth: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired

};


export default connect(
  mapStateToProps
)(withSnackbar(AddDeviceGroup));
