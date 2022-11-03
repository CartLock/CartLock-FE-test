import React, { useEffect, useState, useMemo } from "react";
import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom'
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import { getDeviceDetails } from "../store/actions/userActions";
import { withSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import Loader from "../PageLoader"
import Footer from "../footer"
import Submenu from "../header_sub_menu"
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, List, ListItem, Box, ListItemText, Divider, Typography } from '@material-ui/core';
import SideNavBar from "../SideNavBar";
const useStyles = makeStyles((theme) => ({
  active: {
    cursor: "pointer",
    "&:hover": {
      background: "#efefef"
    },
    "&:last-child": {
      borderRight: "solid 1px #cccccc"
    }
  },
  labelBox: {
    width: 200,
    textAlign: "right"
  },
  labelScheduleBox:{
    width: 100,
    textAlign: "right"
  }
}));

const DeviceDetails = (props) => {
  const { enqueueSnackbar, error, success, loading, pageLoading } = props;
  const classes = useStyles();
  const dispatch = useDispatch()
  const { device_Details } = useSelector((state) => state.user)
  const history = useHistory()

  useEffect(() => {
    const id = localStorage.getItem("tempDeviceId");
    if (!id) {
      history.push({
        pathname: "/devices",
      });
    }
    dispatch(getDeviceDetails(id));
  }, [dispatch]);


  const handleClickToRedirect = (type, item) => {
    // console.log(item);return
    if(type == 'user'){
      localStorage.setItem("tempId", item.user_id);
      history.push({
        pathname: "/modifyUser",
        isLoaderRequired: true
      });
    }
    else if(type == 'deviceGroup'){
      localStorage.setItem("tempDeviceGroupId", item.id);
      history.push({
        pathname: "/modifyDeviceGroup",
        isLoaderRequired: true
      });
    }
  }

  // const [pageLoading, setPageLoading] = React.useState(true)
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setPageLoading(false)
  //   }, 1000);
  // }, []);

  return (
    <>
    <SideNavBar/>
    <div className="main">
      { pageLoading ? <Loader /> : null}
      
      <Submenu/>

      <div className='Contborder'>
        <div className='row'>
          <div className='col-md-12'>
            <div className='card' style={{marginBottom: 0}}>
              <div className='card-header border-0' style={{padding: "12px 25px 0 0"}}>
                <div className='row align-items-center'>
                  <div className='col-lg-11 text-center'>
                    <Typography variant="subtitle1"><strong>{device_Details.full_name} Device Details </strong></Typography>
                  </div>
                  <div className='col-lg-1'>
                    <Link class='btn btn-success float-right' to='/devices'>Devices</Link>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col">
                        <Box display="flex" alignItems="center">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Full Name:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">{device_Details.full_name}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Display Name:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">{device_Details.display_name}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Date Installed:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">{device_Details.createdAt}</Typography>
                        </Box>
                      </div>
                      <div className="col">
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Serial #:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">{device_Details.hardware_id}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Hardware ID:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">{device_Details.serial_number}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Device Type:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">{device_Details.device_type}</Typography>
                        </Box>
                      </div>
                    </div>

                    <Divider variant="middle1" className="mt-4 mb-4" style={{ background: '#1E4CA1' }} />

                    <div className="row">
                      <div className="col-sm-4">
                        <Box display="flex" alignItems="center">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Lock Type:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">{device_Details.lock_type}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Re-Lock Trigger:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">{device_Details.relock_trigger}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>{device_Details.relock_trigger == 'Timer' ? 'Re-Lock Time' : 'Trigger On'}:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">{device_Details.relock_trigger == 'Timer' ? device_Details.relock_timer : device_Details.trigger_mode}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Manual Unlock:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">{device_Details.manual_lock == "1" ? "Yes" : "No"}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Sleep:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">{device_Details.sleep_mode == "1" ? "Yes" : "No"}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>BT Power Level (1-5):</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">{device_Details.bluetooth_power_level}</Typography>
                        </Box>
                      </div>
                      <div className="col-sm-4">
                        <Box display="flex" alignItems="center">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Scheduled Open:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">{device_Details.schedule_open == "1" ? "Yes" : "No"}</Typography>
                        </Box>
                        {device_Details.schedule_open == "1" ?
                          (<div>
                            <Box display="flex" alignItems="center" className="ml-5">
                              <Typography variant="subtitle2" className={classes.labelScheduleBox}><strong>Mon:</strong></Typography>
                              <Typography variant="subtitle2" component="p" className="ml-2">{device_Details.schedule.Monday}</Typography>
                            </Box>

                            <Box display="flex" alignItems="center" className="ml-5 mt-1">
                              <Typography variant="subtitle2" className={classes.labelScheduleBox}><strong>Tue:</strong></Typography>
                              <Typography variant="subtitle2" component="p" className="ml-2">{device_Details.schedule.Tuesday}</Typography>
                            </Box>

                            <Box display="flex" alignItems="center" className="ml-5 mt-1">
                              <Typography variant="subtitle2" className={classes.labelScheduleBox}><strong>Wed:</strong></Typography>
                              <Typography variant="subtitle2" component="p" className="ml-2">{device_Details.schedule.Wednesday}</Typography>
                            </Box>

                            <Box display="flex" alignItems="center" className="ml-5 mt-1">
                              <Typography variant="subtitle2" className={classes.labelScheduleBox}><strong>Thu:</strong></Typography>
                              <Typography variant="subtitle2" component="p" className="ml-2">{device_Details.schedule.Thursday}</Typography>
                            </Box>

                            <Box display="flex" alignItems="center" className="ml-5 mt-1">
                              <Typography variant="subtitle2" className={classes.labelScheduleBox}><strong>Fri:</strong></Typography>
                              <Typography variant="subtitle2" component="p" className="ml-2">{device_Details.schedule.Friday}</Typography>
                            </Box>

                            <Box display="flex" alignItems="center" className="ml-5 mt-1">
                              <Typography variant="subtitle2" className={classes.labelScheduleBox}><strong>Sat:</strong></Typography>
                              <Typography variant="subtitle2" component="p" className="ml-2">{device_Details.schedule.Saturday}</Typography>
                            </Box>

                            <Box display="flex" alignItems="center" className="ml-5 mt-1">
                              <Typography variant="subtitle2" className={classes.labelScheduleBox}><strong>Sun:</strong></Typography>
                              <Typography variant="subtitle2" component="p" className="ml-2">{device_Details.schedule.Sunday}</Typography>
                            </Box>
                          </div>)
                          : null}

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Sensor 1 Open:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">{device_Details.sensor1_open_name}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Sensor 1 Closed:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">{device_Details.sensor1_close_name}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Sensor 2 Open:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">{device_Details.sensor2_open_name}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Sensor 2 Closed:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">{device_Details.sensor2_close_name}</Typography>
                        </Box>
                      </div>

                      <div className="col-sm-4">
                        <Typography variant="subtitle2" className="mb-2"><strong>Exceptions:</strong></Typography>
                        <Card variant="outlined" style={{border: "2px solid #2dce89"}}>
                          <CardContent style={{padding: 0}}>
                            <List style={{ minHeight: 200, maxHeight:319, overflow:"auto"  }}>
                              {device_Details.exceptions.length > 0 ?
                                (device_Details.exceptions.map((item, i) => (
                                  <div>
                                    <ListItem>
                                      <Typography variant="subtitle2" component="p" className="ml-2">{item.exceptionsDays}</Typography>
                                    </ListItem>
                                    <Divider variant="middle" component="li" />
                                  </div>
                                )))
                                : (<Typography variant="subtitle2" style={{ textAlign: "center", marginTop: 40 + "%" }} gutterBottom className="mb-3">No exceptions...</Typography>)}
                            </List>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <Typography variant="subtitle2" className="mb-2"><strong>Users/ eKeys:</strong></Typography>
                    <Card variant="outlined" style={{border: "2px solid #2dce89"}}>
                      <CardContent style={{padding: 0}}>
                        <List style={{ minHeight: 200, maxHeight:250, overflow:"auto"  }}>
                          {device_Details.users.length > 0 ?
                            (device_Details.users.map((item, i) => (
                              <div>
                                <ListItem className={classes.active} onClick={() => handleClickToRedirect('user', item)}>
                                  <ListItemText primary={item.display_name} />
                                </ListItem>
                                <Divider variant="middle" component="li" />
                              </div>
                            )))
                            : (<Typography variant="subtitle2" style={{ textAlign: "center", marginTop: 25 + "%" }} gutterBottom className="mb-3">No users...</Typography>)}
                        </List>
                      </CardContent>
                    </Card>

                    <Typography variant="subtitle2" className="mt-5 mb-2"><strong>Device Groups:</strong></Typography>
                    <Card variant="outlined" style={{border: "2px solid #2dce89"}}>
                      <CardContent style={{padding: 0}}>
                      <List style={{ minHeight: 200, maxHeight:250, overflow:"auto"  }}>
                          {device_Details.deviceGroup.length > 0 ?
                            (device_Details.deviceGroup.map((item, i) => (
                              <div>
                                <ListItem className={classes.active} onClick={() => handleClickToRedirect('deviceGroup', item)}>
                                  <ListItemText primary={item.full_name} />
                                </ListItem>
                                <Divider variant="middle" component="li" />
                              </div>
                            )))
                            : (<Typography variant="subtitle2" style={{ textAlign: "center", marginTop: 25 + "%" }} gutterBottom className="mb-3">No device group...</Typography>)}
                        </List>
                      </CardContent>
                    </Card>
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
  )
};


const mapStateToProps = (state) => {
  return {
    loading: state.user.loading,
    error: state.user.error,
    success: state.user.success,
    pageLoading: state.user.pageLoading
  };
};



DeviceDetails.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired

};

export default connect(
  mapStateToProps
)(withSnackbar(DeviceDetails));
