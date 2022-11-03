import React, { useEffect, useState, useMemo } from "react";
import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom'
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import { resetErrorAndSuccessState } from "../store/actions/userActions";
import { getGeneratedTicketDetails, createSupportNotes } from "../store/actions/deviceGroupActions";
import { withSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import Loader from "../PageLoader"
import Footer from "../footer"
import Submenu from "../header_sub_menu"
import { TextField, Button, Card, CardContent, List, ListItem, Box, Divider, Typography } from '@material-ui/core';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';

import GoogleMapReact from 'google-map-react';
import Tooltip from '@material-ui/core/Tooltip';
import PlaceIcon from '@material-ui/icons/Place';

const useStyles = makeStyles((theme) => ({
  labelBox: {
    width: 200,
    textAlign: "right"
  },
  labelScheduleBox:{
    width: 100,
    textAlign: "right"
  }
}));

const SupportTicketDetails = (props) => {
  const { enqueueSnackbar, error, success, loading, pageLoading } = props;
  const classes = useStyles();
  const dispatch = useDispatch()
  const { supportTicketDetail } = useSelector((state) => state.deviceGroup)
  const history = useHistory()

  const [values, setValues] = React.useState({
    notes: ""
  });

  const [formValidation, setFormValidation] = React.useState({
    notes: ""
  });

  const handleValidation = () => {
    let isError = false;
    const formerr = { ...formValidation };
    if (!values.notes) {
      isError = true;
      formerr.notes = "Required ticket notes";
      setFormValidation(formerr);
    }

    return isError;
  };

  const handleChange = (prop) => (event) => {
    const value = event.target.value;
    setValues({ ...values, [prop]: value });
    const formerr = { ...formValidation };
    formerr[event.target.name] = null;
    setFormValidation(formerr);
  };


  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (handleValidation()) return false;

    const supportId = localStorage.getItem("tempSupportId");
    const userId = localStorage.getItem("logedUserId");

    const Data = {
      notes: values.notes,
      serviceTicketId: supportId,
      userId: userId
    }
    dispatch(createSupportNotes(Data))
  };


  useEffect(() => {
    const id = localStorage.getItem("tempSupportId");
    if (!id) {
      history.push({
        pathname: "/support",
      });
    }
    dispatch(getGeneratedTicketDetails(id, true));
  }, [dispatch]);

  useEffect(() => {
    error && enqueueSnackbar(error, { variant: "error" });
    dispatch(resetErrorAndSuccessState())
  }, [error]);


  useEffect(() => {
    success && enqueueSnackbar(success, { variant: "success" });
    dispatch(resetErrorAndSuccessState());
    setValues({ notes: "" })
    const id = localStorage.getItem("tempSupportId");
    dispatch(getGeneratedTicketDetails(id, false));
  }, [success]);

  const handleGPS = () => {
    const gpsLocation = supportTicketDetail.gps_location
    if((gpsLocation.longitude > -180 && gpsLocation.longitude < 180) && (gpsLocation.latitude > -90 && gpsLocation.latitude < 90)){
      localStorage.setItem("gps_location", JSON.stringify(gpsLocation));
      history.push({
        pathname: 'supportTicketGPSDetails',
        state: {id:1}
      });
    }
    else{
      enqueueSnackbar("Invalid latitude or longitude ", { variant: "error" });
      return
    }
    
  }

  const Marker = ({ text }) => {
    return (
      <Tooltip title={text} placement="top">
        <PlaceIcon className="text-red"/>
      </Tooltip>
    );
  }


  return (
    <div>
      { pageLoading ? <Loader /> : null}
      
      <Submenu/>

      <div className="Contborder">
        <div className="row">
          <div className="col-md-12">
            <div className="card" style={{marginBottom: 0}}>
              <div className='card-header border-0'>
                <div className='row align-items-center'>
                  <div className='col-lg-11 text-center'>
                    <Typography variant="subtitle1" style={{color: "#1E4CA1"}}>Ticket ID # <strong>{supportTicketDetail.ticket_number} </strong></Typography>
                  </div>
                  <div className='col-lg-1'>
                    <a class='btn btn-primary float-right' href='/support'>Supports</a>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div className="row">
                  <div className="col-md-5">
                    <div className="row">
                      <div className="col">
                        <Box display="flex" alignItems="center">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>User:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">{supportTicketDetail.User.dispay_name}</Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Cell:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            {supportTicketDetail.phoneNumber}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>E-Mail:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            <a href={`mailto:${supportTicketDetail.User.e_mail}`} target="_blank">{supportTicketDetail.User.e_mail}</a>
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Submitted:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            {moment(supportTicketDetail.createdAt).format('MMMM DD, YYYY, HH:mm')}
                          </Typography>
                        </Box>
                      </div>
                    </div>

                    <Divider variant="middle1" className="mt-4 mb-4" style={{ background: '#1E4CA1' }} />

                    <div className="row">
                      <Typography variant="subtitle1" className="text-center ml-9 mb-2"><strong>Mobile Device Details</strong></Typography>
                    </div>
                    <div className="row">
                      <div className="col-sm-7">
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Brand:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">{supportTicketDetail.brand}</Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Model:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">{supportTicketDetail.phone_model}</Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Software Version:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">{supportTicketDetail.software_version}</Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Bluetooth Enebled:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            {supportTicketDetail.bluetooth_status == 'On' ? 'Yes' : 'No' }
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1" style={{width: 400}}>
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>GPS Location:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2"><Link onClick={handleGPS}>{supportTicketDetail.phone_gps_location}</Link></Typography>
                        </Box>
                        
                       
                      </div>
                    </div>
                    {(parseFloat(supportTicketDetail.latitude) >= -90 && parseFloat(supportTicketDetail.latitude) <= 90) && (parseFloat(supportTicketDetail.longitude) >= -180 && parseFloat(supportTicketDetail.longitude) <= 180) ? 
                          <Box display="flex" alignItems="center" className="mt-1">
                            <div style={{ height: '200px', width: '100%', border:'1px dotted' }}>
                              <GoogleMapReact
                                bootstrapURLKeys={{ key: "AIzaSyAFcDErMtUN_AhN7_pClSsy_rk6mbqHB5Y" }}
                                defaultCenter={{lat: parseFloat(supportTicketDetail.latitude), lng: parseFloat(supportTicketDetail.longitude)}}
                                defaultZoom={15}
                              >
                                <Marker text={`${supportTicketDetail.latitude}, ${supportTicketDetail.longitude}`} lat={supportTicketDetail.latitude} lng={supportTicketDetail.longitude} />
                              </GoogleMapReact>
                            </div>
                          </Box>
                        : "" }
                    <Divider variant="middle1" className="mt-4 mb-4" style={{ background: '#1E4CA1' }} />

                    <div className="row">
                      <Typography variant="subtitle1" className="text-center ml-9 mb-2"><strong>Date & Time Comparison</strong><br />(at time of ticket generation)</Typography>
                    </div>
                    <div className="row">
                      <div className="col-sm-7">
                        <Box display="flex" alignItems="center" className="mt-1" style={{width: 400}}>
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Sentinel:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            {moment(supportTicketDetail.sentinel_date_time).format('MMMM DD, YYYY, HH:mm')}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1" style={{width: 400}}>
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Device:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            {moment(supportTicketDetail.reporting_date_time).format('MMMM DD, YYYY, HH:mm')}
                          </Typography>
                        </Box>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-7">
                    <Typography variant="subtitle1" className="text-center mb-2 ml-3" style={{ marginTop: "-30px" }}><strong>Visible PAC-BLU Devices</strong></Typography>
                    <Card
                      variant="outlined"
                      style={{
                        height: "300px",
                        width: "350px",
                        border: "2px solid #3477eb",
                        marginLeft: "170px",
                      }}
                    >
                      <CardContent style={{ padding: 0 }}>
                        <List style={{ minHeight: 300, maxHeight: 300, overflow: "auto" }}>
                          {supportTicketDetail.active_lock.length > 0 ?
                            (supportTicketDetail.active_lock.map((item, i) => (
                              <div>
                                <ListItem>
                                  <Typography variant="subtitle2" component="p" className="ml-2">{item}</Typography>
                                </ListItem>
                                <Divider variant="middle" component="li" />
                              </div>
                            )))
                            : (<Typography variant="subtitle2" style={{ textAlign: "center", marginTop: 40 + "%" }} gutterBottom className="mb-3">No PAC-BLU Devices...</Typography>)}
                        </List>
                      </CardContent>
                    </Card>

                    <Divider variant="middle1" className="mt-4 mb-4" style={{ background: '#1E4CA1' }} />
                    <Typography variant="subtitle1" className="text-center mb-1"><strong>eKeys</strong><br />(at time of ticket generation)</Typography>
                    <div className="row">
                      <div className="col-md-6 ">
                        <Typography variant="subtitle1" className="text-center mt-2 mb-1"><strong>Reported by Device</strong></Typography>
                        <Card
                          variant="outlined"
                          style={{
                            height: "250px",
                            width: "300px",
                            marginLeft: "00px",
                            border: "2px solid #3477eb",
                          }}
                        >
                          <CardContent style={{ padding: 0 }}>
                            <List style={{ minHeight: 250, maxHeight: 250, overflow: "auto" }}>
                              {supportTicketDetail.reportedDevices.length > 0 ?
                                (supportTicketDetail.reportedDevices.map((item, i) => (
                                  <div>
                                    <ListItem>
                                      <Typography variant="subtitle2" component="p" className="ml-2">{item.ekeyDetails ? item.ekeyDetails.full_name : ""}</Typography>
                                    </ListItem>
                                    <Divider variant="middle" component="li" />
                                  </div>
                                )))
                                : (<Typography variant="subtitle2" style={{ textAlign: "center", marginTop: 35 + "%" }} gutterBottom className="mb-3">No Devices...</Typography>)}
                            </List>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="col-md-6">
                        <Typography variant="subtitle1" className="text-center mt-2 mb-1"><strong>Assigned in Sentinel</strong></Typography>
                        <Card
                          variant="outlined"
                          style={{
                            height: "250px",
                            width: "300px",
                            border: "2px solid #3477eb",
                          }}
                        >
                          <CardContent style={{ padding: 0 }}>
                            <List style={{ minHeight: 250, maxHeight: 250, overflow: "auto" }}>
                              {supportTicketDetail.assignedSeninel.length > 0 ?
                                (supportTicketDetail.assignedSeninel.map((item, i) => (
                                  <div>
                                    <ListItem>
                                      <Typography variant="subtitle2" component="p" className="ml-2">{item.ekeyDetails ? item.ekeyDetails.full_name : ""}</Typography>
                                    </ListItem>
                                    <Divider variant="middle" component="li" />
                                  </div>
                                )))
                                : (<Typography variant="subtitle2" style={{ textAlign: "center", marginTop: 35 + "%" }} gutterBottom className="mb-3">No Sentinel...</Typography>)}
                            </List>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 mt-4 mb-2">
                    <Typography variant="subtitle1" ><strong>Ticket Notes:</strong></Typography>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-10">
                    <TextField
                      id="fname"
                      label="Enter new note."
                      multiline
                      rows={4}
                      fullWidth
                      variant="outlined"
                      name="notes"
                      value={values.notes}
                      onChange={handleChange("notes")}
                      error={!!formValidation.notes}
                      helperText={formValidation.notes}
                    />
                  </div>
                  <Button
                    variant="contained"
                    color="primary"

                    style={{
                      padding: "0px 66px",
                      borderRadius: "10px",
                      height: "60px"
                    }}
                    onClick={handleSubmitClick}
                  >
                    Save &nbsp;<i className="fa fa-spinner fa-spin" style={{display: props.loading ? 'block' : 'none'}}/>
                  </Button>
                </div>

                {(supportTicketDetail.serviceTicketNotes.map((item, i) => (
                  <div>
                    <div className="row ">
                      <div className="col-md-3">
                        <Typography variant="subtitle2" className="mt-3">
                          <strong>
                            {moment(item.createdAt, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YY, HH:mm')}, &nbsp;
                            {item.User.dispay_name}
                          </strong>
                        </Typography>
                      </div>
                      <div className="col-md-9">
                        <Typography variant="subtitle2" component="p" className="mt-3">{item.note_description}</Typography>
                      </div>
                    </div>
                  </div>
                )))}

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



SupportTicketDetails.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired

};

export default connect(
  mapStateToProps
)(withSnackbar(SupportTicketDetails));
