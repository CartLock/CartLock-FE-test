import React, { useEffect, useState, useMemo } from "react";
import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom'
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import { resetErrorAndSuccessState, createActivityLogNotes, activityLogNotesList } from "../store/actions/userActions";
import { withSnackbar } from "notistack";
import { useHistory, useLocation } from "react-router-dom";
import Loader from "../PageLoader"
import Footer from "../footer"
import Submenu from "../header_sub_menu"
import { TextField, Button, Card, CardContent, List, ListItem, Box, Divider, Typography } from '@material-ui/core';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import { phoneNuberFormate } from '../helper/commonHelper';

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

const ActivityDetails = (props) => {
  const { enqueueSnackbar, error, success, loading, pageLoading } = props;
  const classes = useStyles();
  const dispatch = useDispatch()
  const { activityLogNotes_List } = useSelector((state) => state.user)
  const history = useHistory()
  const location = useLocation()

  const [values, setValues] = React.useState({
    notes: ""
  });

  const [formValidation, setFormValidation] = React.useState({
    notes: ""
  });

  const [details, setDetails] = React.useState({
    actionBy: "",
    action: "",
    details: "",
  });

  const handleValidation = () => {
    let isError = false;
    const formerr = { ...formValidation };
    if (!values.notes) {
      isError = true;
      formerr.notes = "Required activity notes";
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

    const Data = {
      notes: values.notes,
      activityLogId: activityLogId,
    }

    dispatch(createActivityLogNotes(Data))
  };


  useEffect(() => {
    error && enqueueSnackbar(error, { variant: "error" });
    dispatch(resetErrorAndSuccessState())
  }, [error]);


  useEffect(() => {
    success && enqueueSnackbar(success, { variant: "success" });
    dispatch(resetErrorAndSuccessState());
    setValues({ notes: "" })
    // if(activityLogId != ""){
      dispatch(activityLogNotesList(activityLogId));
    // }
  }, [success]);

  const [activityLogId, setActivityLogId] = React.useState("");

  useEffect(() => {
    if(location.state){
      let det = {...details}
      det["actionBy"] = location.state.details.User ? location.state.details.User : ""
      det["details"] = location.state.details.activity_description ? JSON.parse(location.state.details.activity_description) : ""
      det["logType"] = location.state.details.operation_type ? location.state.details.operation_type : ""
      det["timeStamp"] = location.state.details.createdAt ? location.state.details.createdAt : ""
      let summary = location.state.details.summary
      if(summary == 'Configure Device'){
        det["action"] = 'Device Installed'
      }
      else if(summary == 'Modify Device'){
        det["action"] = 'Device Modified'
      }
      else if(summary == 'Remove Device'){
        det["action"] = 'Device Removed'
      }
      else if(summary == 'Change Password'){
        det["action"] = 'User Changed Password'
      }
      else{
        det["action"] = summary
      }

      setDetails(det)
      setActivityLogId(location.state.details.id)
      // if(activityLogId != ""){
        dispatch(activityLogNotesList(location.state.details.id));
      // }
      
    }
    else{
      history.push({
        pathname: 'activity',
      });
    }
    
    
  }, [location.state]);


  const handleClickToRedirect = (type, id) => {
    // console.log(item);return
    if(type == 'user'){
      localStorage.setItem("tempId", id);
      history.push({
        pathname: "/modifyUser",
        isLoaderRequired: true
      });
    }
    else if(type == 'deviceGroup'){
      localStorage.setItem("tempDeviceGroupId", id);
      history.push({
        pathname: "/modifyDeviceGroup",
        isLoaderRequired: true
      });
    }
  }

  return (
    <div>
      { pageLoading ? <Loader /> : null}
      {console.log('details', details.details)}
      <Submenu/>

      <div className="Contborder">
        <div className="row">
          <div className="col-md-12">
            <div className="card" style={{marginBottom: 0}}>
              <div className='card-header border-0'>
                <div className='row align-items-center'>
                  <div className='col-lg-11 text-center'>
                    <Typography variant="h5" className="text-center mt-3" style={{color: "#1E4CA1"}}>
                      Activity Log Type: {details.logType == 'Admin' ? 'Administrative Activity' : details.logType == 'User' ? 'User Activity' : 'Device Activity' }
                    </Typography>
                  </div>
                  <div className='col-lg-1'>
                    <Link class='btn btn-primary float-right' to='/activity'>Activity</Link>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div className="row" style={{marginTop: "-30px"}}>
                <div className="col-md-3"></div>
                  <div className="col-md-5 text-center">
                    <div className="row">
                      <div className="col">
                          <Typography variant="subtitle1" className="text-center mb-1"><strong><i><u>Action Performed By:</u></i></strong></Typography>
                        <Box display="flex" alignItems="center">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>User:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2"><Link onClick={() => handleClickToRedirect('user', details.actionBy.id)}><u>{details.actionBy.dispay_name}</u></Link></Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Cell:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            {phoneNuberFormate(details.actionBy.phone_number)}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>E-Mail:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            <a href={`mailto:${details.actionBy.e_mail}`} target="_blank">{details.actionBy.e_mail}</a>
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Timestamp:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            {moment(details.timeStamp).format('MMMM DD, YYYY, HH:mm:ss')}
                          </Typography>
                        </Box>

                        <Divider variant="middle1" className="mt-3 mb-3" style={{ background: '#1E4CA1' }} />

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Action:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                          {details.action}
                          </Typography>
                        </Box>

                        {/* USER CREATED */}
                        {details.action == 'User Created' ? <div> 
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Details:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            User: <Link onClick={() => handleClickToRedirect('user', details.details.userId)}><u>{details.details.displayName}</u></Link>
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Phone: {details.details.phoneNumer}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Email: {details.details.emailId}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" className="mt-3">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Sentinel Web Management: {details.details.isSentinel == '1' ? 'Yes' : 'No'}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Installer Permissions: {details.details.isInstaller == '1' ? 'Yes' : 'No'}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Fob Access: {details.details.isFob == '1' ? 'Yes' : 'No'}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-3">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            User Notes: {details.details.userNotes}
                          </Typography>
                        </Box>
                         </div>
                        : ""}

                        {/* USER INFO MODIFIED */}
                        {details.action == 'User Info Modified' ? <div> 
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Details:</strong></Typography>
                          {details.details.oldDetails.displayName != details.details.modiflyedDetails.displayName ? <div>
                            <Typography variant="subtitle2" component="p" className="ml-2">
                              Old User: {details.details.oldDetails.displayName}
                            </Typography>
                          </div> : 
                          <div>
                            <Typography variant="subtitle2" component="p" className="ml-2">
                              User: <Link onClick={() => handleClickToRedirect('user', details.details.modiflyedDetails.userId)}><u>{details.details.modiflyedDetails.displayName}</u></Link>
                            </Typography>
                          </div>}
                        </Box>
                        
                        {details.details.oldDetails.displayName != details.details.modiflyedDetails.displayName ? <div>
                          <Box display="flex" alignItems="center" className="mt-1">
                            <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                            <Typography variant="subtitle2" component="p" className="ml-2">
                              New User: <Link onClick={() => handleClickToRedirect('user', details.details.modiflyedDetails.userId)}><u>{details.details.modiflyedDetails.displayName}</u></Link>
                            </Typography>
                          </Box>
                        </div> : ""}

                        {details.details.oldDetails.phone_number != details.details.modiflyedDetails.phoneNumer ? <div>
                          <Box display="flex" alignItems="center" className="mt-3">
                            <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                            <Typography variant="subtitle2" component="p" className="ml-2">
                              Old Phone: {details.details.oldDetails.phone_number}
                            </Typography>
                          </Box>
                        </div> : ""}
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                          {details.details.oldDetails.phone_number != details.details.modiflyedDetails.phoneNumer ? 'New Phone: ' : 'Phone: '}{details.details.modiflyedDetails.phoneNumer}
                          </Typography>
                        </Box>

                        {details.details.oldDetails.e_mail != details.details.modiflyedDetails.emailId ? <div>  
                        <Box display="flex" alignItems="center" className="mt-3">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Old Email: {details.details.oldDetails.e_mail}
                          </Typography>
                        </Box>
                        </div> : ""}
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                          {details.details.oldDetails.e_mail != details.details.modiflyedDetails.emailId ? 'New Email: ' : 'Email: '}{details.details.modiflyedDetails.emailId}
                          </Typography>
                        </Box>

                        {details.details.oldDetails.is_sentinel != details.details.modiflyedDetails.isSentinel ? <div>  
                        <Box display="flex" alignItems="center" className="mt-3">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Old Sentinel Web Management: {details.details.oldDetails.is_sentinel == '1' ? 'Yes' : 'No'}
                          </Typography>
                        </Box>
                        </div> : ""}
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                          {details.details.oldDetails.is_sentinel != details.details.modiflyedDetails.isSentinel ? 'New Sentinel Web Management: ' : 'Sentinel Web Management: '}{details.details.modiflyedDetails.isSentinel == '1' ? 'Yes' : 'No'}
                          </Typography>
                        </Box>

                        {details.details.oldDetails.is_installer != details.details.modiflyedDetails.isSentinel ? <div>  
                        <Box display="flex" alignItems="center" className="mt-3">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Old Installer Permissions: {details.details.oldDetails.is_installer == '1' ? 'Yes' : 'No'}
                          </Typography>
                        </Box>
                        </div> : ""}
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                          {details.details.oldDetails.is_installer != details.details.modiflyedDetails.isInstaller ? 'New Installer Permissions: ' : 'Installer Permissions: '}{details.details.modiflyedDetails.isInstaller == '1' ? 'Yes' : 'No'}
                          </Typography>
                        </Box>

                        {details.details.oldDetails.is_fob != details.details.modiflyedDetails.isSentinel ? <div>  
                        <Box display="flex" alignItems="center" className="mt-3">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Old Fob Access: {details.details.oldDetails.is_fob == '1' ? 'Yes' : 'No'}
                          </Typography>
                        </Box>
                        </div> : ""}
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                          {details.details.oldDetails.is_fob != details.details.modiflyedDetails.isFob ? 'New Fob Access: ' : 'Fob Access: '}{details.details.modiflyedDetails.isFob == '1' ? 'Yes' : 'No'}
                          </Typography>
                        </Box>

                        {details.details.oldDetails.user_notes != details.details.modiflyedDetails.userNotes ? <div>  
                        <Box display="flex" alignItems="center" className="mt-3">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Old User Notes: {details.details.oldDetails.user_notes}
                          </Typography>
                        </Box>
                        </div> : ""}
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                          {details.details.oldDetails.user_notes != details.details.modiflyedDetails.userNotes ? 'New User Notes: ' : 'User Notes: '}{details.details.modiflyedDetails.userNotes}
                          </Typography>
                        </Box>
                        </div>
                        : ""}

                        {/* USER NOTES */}
                        {details.action == 'Notes Added to User' ? <div> 
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Details:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            User: <Link onClick={() => handleClickToRedirect('user', details.details.userId)}><u>{details.details.displayName}</u></Link>
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            User Notes: {details.details.userNotes}
                          </Typography>
                        </Box>
                        </div> 
                        : ""}

                        {/* USER DE-ACTIVATE */}
                        {details.action == 'User De-Activated' ? <div> 
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Details:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            User: <Link onClick={() => handleClickToRedirect('user', details.details.userId)}><u>{details.details.displayName}</u></Link>
                          </Typography>
                        </Box>
                        </div> 
                        : ""}

                        {/* ASSIGN EKEYS */}
                        {details.action == 'eKey Assigned' ? <div> 
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Details:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            User: <Link onClick={() => handleClickToRedirect('user', details.details.userDetails.id)}><u>{details.details.userDetails.displayName}</u></Link>
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Device/Device Group Display Name: {details.details.eKeyDetails.display_name}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Device/Device Group Full Name: {details.details.eKeyDetails.full_name}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            eKey Type: {details.details.keySchedule.type == 'group' ? 'Lock Group eKey' : details.details.keySchedule.oneTimeUse == '1' ? 'One Time Use' : 'Single Lock eKey'}
                          </Typography>
                        </Box>

                        {details.details.keySchedule.oneTimeUse == '0' ? <div>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Date Range: {details.details.keySchedule.startDate} - {details.details.keySchedule.endDate}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Start Time: {details.details.keySchedule.startTime}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            End Time: {details.details.keySchedule.endTime}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Active Days: {JSON.parse(details.details.keySchedule.scheduleDays).Mon ? 'Mon' : ""}
                            {JSON.parse(details.details.keySchedule.scheduleDays).Tue ? ', Tue' : ""}
                            {JSON.parse(details.details.keySchedule.scheduleDays).Wed ? ', Wed' : ""}
                            {JSON.parse(details.details.keySchedule.scheduleDays).Thu ? ', Thu' : ""}
                            {JSON.parse(details.details.keySchedule.scheduleDays).Fri ? ', Fri' : ""}
                            {JSON.parse(details.details.keySchedule.scheduleDays).Sat ? ', Sat' : ""}
                            {JSON.parse(details.details.keySchedule.scheduleDays).Sun ? ', Sun' : ""}
                          </Typography>
                        </Box></div>
                        : ""}
                        </div> 
                        : ""}

                        {/* MODIFIED EKEYS */}
                        {details.action == 'eKey Modified' ? <div> 
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Details:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            User: <Link onClick={() => handleClickToRedirect('user', details.details.userDetails.id)}><u>{details.details.userDetails.displayName}</u></Link>
                          </Typography>
                        </Box>
                        
                        {details.details.oldKeySchedule.ekeyDetails.display_name != details.details.eKeyDetails.display_name ? <div>
                        <Box display="flex" alignItems="center" className="mt-3">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Old Device/Device Group Display Name: {details.details.oldKeySchedule.ekeyDetails.display_name}
                          </Typography>
                        </Box></div>
                        : ""}
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                          {details.details.oldKeySchedule.ekeyDetails.display_name != details.details.eKeyDetails.display_name ? 'New Device/Device Group Display Name: ' : 'Device/Device Group Display Name: '}
                          {details.details.eKeyDetails.display_name}
                          </Typography>
                        </Box>

                        {details.details.oldKeySchedule.ekeyDetails.full_name != details.details.eKeyDetails.full_name ? <div>
                        <Box display="flex" alignItems="center" className="mt-3">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Old Device/Device Group Full Name: {details.details.oldKeySchedule.ekeyDetails.full_name}
                          </Typography>
                        </Box></div>
                        : ""}
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                          {details.details.oldKeySchedule.ekeyDetails.full_name != details.details.eKeyDetails.full_name ? 'New Device/Device Group Full Name: ' : 'Device/Device Group Full Name: '}
                          {details.details.eKeyDetails.full_name}
                          </Typography>
                        </Box>

                        {details.details.oldKeySchedule.one_time_use != details.details.newKeySchedule.oneTimeUse ? <div>
                        <Box display="flex" alignItems="center" className="mt-3">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Old eKey Type: {details.details.oldKeySchedule.one_time_use == '1' ? 'One Time Use' : 'Single Lock eKey'}
                          </Typography>
                        </Box></div>
                        : ""}
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                          {details.details.oldKeySchedule.one_time_use != details.details.newKeySchedule.oneTimeUse ? 'New eKey Type: ' : 'eKey Type: '}
                          {details.details.newKeySchedule.oneTimeUse == '1' ? 'One Time Use' : 'Single Lock eKey'}
                          </Typography>
                        </Box>

                        
                        {details.details.newKeySchedule.oneTimeUse == '0' ? <div>
                        {(details.details.oldKeySchedule.start_date != details.details.newKeySchedule.startDate) || (details.details.oldKeySchedule.end_date != details.details.newKeySchedule.endDate) ? <div>
                        <Box display="flex" alignItems="center" className="mt-3">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Old Date Range: {details.details.oldKeySchedule.start_date} - {details.details.oldKeySchedule.end_date}
                          </Typography>
                        </Box></div>
                        : ""}
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                          {(details.details.oldKeySchedule.start_date != details.details.newKeySchedule.startDate) && (details.details.oldKeySchedule.end_date != details.details.newKeySchedule.endDate) ? 'New Date Range: ' : 'Date Range: '}
                          {details.details.newKeySchedule.startDate} - {details.details.newKeySchedule.endDate}
                          </Typography>
                        </Box>
                        

                        {details.details.oldKeySchedule.start_time != details.details.newKeySchedule.startTime ? <div>
                        <Box display="flex" alignItems="center" className="mt-3">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Old Start Time: {details.details.oldKeySchedule.start_time}
                          </Typography>
                        </Box></div>
                        : ""}
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                          {details.details.oldKeySchedule.start_time != details.details.newKeySchedule.startTime ? 'New Start Time: ' : 'Start Time: '} {details.details.newKeySchedule.startTime}
                          </Typography>
                        </Box>

                        {details.details.oldKeySchedule.end_time != details.details.newKeySchedule.endTime ? <div>
                        <Box display="flex" alignItems="center" className="mt-3">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Old End Time: {details.details.oldKeySchedule.end_time}
                          </Typography>
                        </Box></div>
                        : ""}
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                          {details.details.oldKeySchedule.end_time != details.details.newKeySchedule.endTime ? 'New End Time: ' : 'End Time: '} {details.details.newKeySchedule.endTime}
                          </Typography>
                        </Box>


                        {JSON.stringify(details.details.oldKeySchedule.schedule_days) !== details.details.newKeySchedule.scheduleDays ? <div>
                        <Box display="flex" alignItems="center" className="mt-3">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Old Active Days: {details.details.oldKeySchedule.schedule_days.Mon ? 'Mon' : ""}
                            {details.details.oldKeySchedule.schedule_days.Tue ? ', Tue' : ""}
                            {details.details.oldKeySchedule.schedule_days.Wed ? ', Wed' : ""}
                            {details.details.oldKeySchedule.schedule_days.Thu ? ', Thu' : ""}
                            {details.details.oldKeySchedule.schedule_days.Fri ? ', Fri' : ""}
                            {details.details.oldKeySchedule.schedule_days.Sat ? ', Sat' : ""}
                            {details.details.oldKeySchedule.schedule_days.Sun ? ', Sun' : ""}
                          </Typography>
                        </Box></div>
                        : ""}
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                          {JSON.stringify(details.details.oldKeySchedule.schedule_days) !== details.details.newKeySchedule.scheduleDays ? 'New Active Days: ' : 'Active Days: '} 
                          {JSON.parse(details.details.newKeySchedule.scheduleDays).Mon ? 'Mon' : ""}
                          {JSON.parse(details.details.newKeySchedule.scheduleDays).Tue ? ', Tue' : ""}
                          {JSON.parse(details.details.newKeySchedule.scheduleDays).Wed ? ', Wed' : ""}
                          {JSON.parse(details.details.newKeySchedule.scheduleDays).Thu ? ', Thu' : ""}
                          {JSON.parse(details.details.newKeySchedule.scheduleDays).Fri ? ', Fri' : ""}
                          {JSON.parse(details.details.newKeySchedule.scheduleDays).Sat ? ', Sat' : ""}
                          {JSON.parse(details.details.newKeySchedule.scheduleDays).Sun ? ', Sun' : ""}
                          </Typography>
                        </Box>
                        </div>
                        : ""} 
                        </div> 
                        : ""}

                        
                        {/* DELETE EKEYS */}
                        {details.action == 'eKey Deleted' ? <div> 
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Details:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            User: <Link onClick={() => handleClickToRedirect('user', details.details.userDetails.id)}><u>{details.details.userDetails.displayName}</u></Link>
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Device/Device Group Display Name: {details.details.keyDetails.ekeyDetails.display_name}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Device/Device Group Full Name: {details.details.keyDetails.ekeyDetails.full_name}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            eKey Type: {details.details.keyDetails.is_group ? 'Lock Group eKey' : details.details.keyDetails.one_time_use == '1' ? 'One Time Use' : 'Single Lock eKey'}
                          </Typography>
                        </Box>
                        </div> 
                        : ""}


                        {/* CREATE DEVICE GROUP */}
                        {details.action == 'Device Group Created' ? <div> 
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Details:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Device Group Display Name: <Link onClick={() => handleClickToRedirect('deviceGroup', details.details.groupId)}><u>{details.details.display_name}</u></Link>
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Device Group Full Name: <Link onClick={() => handleClickToRedirect('deviceGroup', details.details.groupId)}><u>{details.details.full_name}</u></Link>
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Description: {details.details.description}
                          </Typography>
                        </Box>
                        
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Access Days: {details.details.sch_monday ? 'Mon' : ""}
                            {details.details.sch_tuesday ? ', Tue' : ""}
                            {details.details.sch_thursday ? ', Thu' : ""}
                            {details.details.sch_friday ? ', Fri' : ""}
                            {details.details.sch_saturday ? ', Sat' : ""}
                            {details.details.sch_sunday ? ', Sun' : ""}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Access Time: {details.details.start_at} - {details.details.end_at} {details.details.time_zone.time_zone}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Assigned Devices:
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            {details.details.available_devices.length > 0 ?
                              (details.details.available_devices.map((item, i) => (
                                <div>
                                  <ul>
                                    <li>{item.full_name}</li>
                                  </ul>
                                </div>
                              )))
                              : ""
                            }
                          </Typography>
                        </Box>
                        </div>
                        : ""}

                        {/* MODIFY DEVICE GROUP */}
                        {details.action == 'Device Group Modified' ? <div> 
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Details:</strong></Typography>
                          {details.details.oldGroupDetails.display_name != details.details.newGroupDetails.display_name ? <div>
                            <Typography variant="subtitle2" component="p" className="ml-2">
                              Old Device Group Display Name: {details.details.oldGroupDetails.display_name}
                            </Typography>
                            </div> : 
                            <div>
                              <Typography variant="subtitle2" component="p" className="ml-2">
                                Device Group Display Name: <Link onClick={() => handleClickToRedirect('deviceGroup', details.details.newGroupDetails.id)}><u>{details.details.newGroupDetails.display_name}</u></Link>
                              </Typography>
                            </div>}
                        </Box>
                        {details.details.oldGroupDetails.display_name != details.details.newGroupDetails.display_name ? <div>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            New Device Group Display Name: <Link onClick={() => handleClickToRedirect('deviceGroup', details.details.newGroupDetails.id)}><u>{details.details.newGroupDetails.display_name}</u></Link>
                          </Typography>
                        </Box></div> : ""}
                        

                       {details.details.oldGroupDetails.full_name != details.details.newGroupDetails.full_name ? <div>
                        <Box display="flex" alignItems="center" className="mt-3">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Old Device Group Full Name: {details.details.oldGroupDetails.full_name}
                          </Typography>
                        </Box>
                        </div> : ""}
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            {details.details.oldGroupDetails.full_name != details.details.newGroupDetails.full_name ? 'New Device Group Full Name: ' : 'Device Group Full Name: ' }
                            <Link onClick={() => handleClickToRedirect('deviceGroup', details.details.newGroupDetails.id)}><u>{details.details.newGroupDetails.full_name}</u></Link>
                          </Typography>
                        </Box>

                        {details.details.oldGroupDetails.description != details.details.newGroupDetails.description ? <div>
                        <Box display="flex" alignItems="center" className="mt-3">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Old Description: {details.details.oldGroupDetails.description}
                          </Typography>
                        </Box>
                        </div> : ""}
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            {details.details.oldGroupDetails.description != details.details.newGroupDetails.description ? 'New Description: ' : 'Description: ' }
                            {details.details.newGroupDetails.description}
                          </Typography>
                        </Box>

                        {details.details.oldGroupDetails.description != details.details.newGroupDetails.description ? <div>
                        <Box display="flex" alignItems="center" className="mt-3">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Old Description: {details.details.oldGroupDetails.description}
                          </Typography>
                        </Box>
                        </div> : ""}
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            {details.details.oldGroupDetails.description != details.details.newGroupDetails.description ? 'New Description: ' : 'Description: ' }
                            {details.details.newGroupDetails.description}
                          </Typography>
                        </Box>

                        {details.details.oldGroupDetails.sch_monday != details.details.newGroupDetails.sch_monday ||
                        details.details.oldGroupDetails.sch_tuesday != details.details.newGroupDetails.sch_tuesday ||
                        details.details.oldGroupDetails.sch_thursday != details.details.newGroupDetails.sch_thursday ||
                        details.details.oldGroupDetails.sch_friday != details.details.newGroupDetails.sch_friday ||
                        details.details.oldGroupDetails.sch_saturday != details.details.newGroupDetails.sch_saturday ||
                        details.details.oldGroupDetails.sch_sunday != details.details.newGroupDetails.sch_sunday ? <div>
                        <Box display="flex" alignItems="center" className="mt-3">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Old Access Days: {details.details.oldGroupDetails.sch_monday ? 'Mon' : ""}
                            {details.details.oldGroupDetails.sch_tuesday ? ', Tue' : ""}
                            {details.details.oldGroupDetails.sch_thursday ? ', Thu' : ""}
                            {details.details.oldGroupDetails.sch_friday ? ', Fri' : ""}
                            {details.details.oldGroupDetails.sch_saturday ? ', Sat' : ""}
                            {details.details.oldGroupDetails.sch_sunday ? ', Sun' : ""}
                          </Typography>
                        </Box>
                        </div> : ""}
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            {details.details.oldGroupDetails.sch_monday != details.details.newGroupDetails.sch_monday ||
                            details.details.oldGroupDetails.sch_tuesday != details.details.newGroupDetails.sch_tuesday ||
                            details.details.oldGroupDetails.sch_thursday != details.details.newGroupDetails.sch_thursday ||
                            details.details.oldGroupDetails.sch_friday != details.details.newGroupDetails.sch_friday ||
                            details.details.oldGroupDetails.sch_saturday != details.details.newGroupDetails.sch_saturday ||
                            details.details.oldGroupDetails.sch_sunday != details.details.newGroupDetails.sch_sunday ? 'New Access Days: ' : 'Access Days: ' }
                            {details.details.newGroupDetails.sch_monday ? 'Mon' : ""}
                            {details.details.newGroupDetails.sch_tuesday ? ', Tue' : ""}
                            {details.details.newGroupDetails.sch_thursday ? ', Thu' : ""}
                            {details.details.newGroupDetails.sch_friday ? ', Fri' : ""}
                            {details.details.newGroupDetails.sch_saturday ? ', Sat' : ""}
                            {details.details.newGroupDetails.sch_sunday ? ', Sun' : ""}
                          </Typography>
                        </Box>

                        {details.details.oldGroupDetails.start_at != details.details.newGroupDetails.start_at || details.details.oldGroupDetails.end_at != details.details.newGroupDetails.end_at ? <div>
                        <Box display="flex" alignItems="center" className="mt-3">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Old Access Time: {details.details.oldGroupDetails.start_at} - {details.details.oldGroupDetails.end_at}
                          </Typography>
                        </Box>
                        </div> : ""}
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            {details.details.oldGroupDetails.start_at != details.details.newGroupDetails.start_at || details.details.oldGroupDetails.end_at != details.details.newGroupDetails.end_at ? 'New Access Time: ' : 'Access Time: ' }
                            {details.details.newGroupDetails.start_at} - {details.details.newGroupDetails.end_at}
                          </Typography>
                        </Box>
                        </div>
                        : ""} 

                        {/* DE-ACTIVATE DEVICE GROUP */}
                        {details.action == 'Device Group De-Activated' ? <div> 
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Details:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Device Group Display Name: <Link onClick={() => handleClickToRedirect('deviceGroup', details.details.groupId)}><u>{details.details.display_name}</u></Link>
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Device Group Full Name: <Link onClick={() => handleClickToRedirect('deviceGroup', details.details.groupId)}><u>{details.details.full_name}</u></Link>
                          </Typography>
                        </Box>
                        </div>
                        : ""}

                        {/* COMPANY SETTING UPDATE */}
                        {details.action == 'Company Settings Updated2' ? <div> 
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Details:</strong></Typography>
                          {details.details.oldSettings.offline_reconect != details.details.newSettings.offlineReconectTime ? <div>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Old Use Offline, Forced Reconnect: {details.details.oldSettings.offline_reconect}
                          </Typography>
                          </div> : 
                          <div>
                            <Typography variant="subtitle2" component="p" className="ml-2">
                              Use Offline, Forced Reconnect: {details.details.newSettings.offlineReconectTime}
                            </Typography>
                          </div>}
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          {details.details.oldSettings.offline_reconect != details.details.newSettings.offlineReconectTime ? <div>
                            <Typography variant="subtitle2" component="p" className="ml-2">
                              New Use Offline, Forced Reconnect: {details.details.newSettings.offlineReconectTime}
                            </Typography>
                          </div> : ""}
                          </Box>
                        
                        {JSON.stringify(details.details.oldSettings.default_time_zone) != JSON.stringify(details.details.newSettings.defaultTimeZone) ? <div>
                        <Box display="flex" alignItems="center" className="mt-3">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Old Default Time Zone: {details.details.oldSettings.default_time_zone.time_zone}
                          </Typography>
                        </Box>
                        </div> : ""}
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                          {JSON.stringify(details.details.oldSettings.default_time_zone) != JSON.stringify(details.details.newSettings.defaultTimeZone) ? 'New Default Time Zone: ' : 'Default Time Zone: '} 
                          {details.details.newSettings.defaultTimeZone.time_zone}
                          </Typography>
                        </Box>

                        {details.details.oldSettings.ekey_duration != details.details.newSettings.ekeyDuration ? <div>
                        <Box display="flex" alignItems="center" className="mt-3">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Old Installer Temp. ekey Duration: {details.details.oldSettings.ekey_duration}
                          </Typography>
                        </Box>
                        </div> : ""}
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                          {details.details.oldSettings.ekey_duration != details.details.newSettings.ekeyDuration ? 'New Installer Temp. ekey Duration: ' : 'Installer Temp. ekey Duration: '} 
                          {details.details.newSettings.ekeyDuration}
                          </Typography>
                        </Box>

                        {details.details.oldSettings.default_country_code != details.details.newSettings.defaultCountryCode ? <div>
                        <Box display="flex" alignItems="center" className="mt-3">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Old Default Phone Country Code: {details.details.oldSettings.default_country_code}
                          </Typography>
                        </Box>
                        </div> : ""}
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                          {details.details.oldSettings.default_country_code != details.details.newSettings.defaultCountryCode ? 'New Default Phone Country Code: ' : 'Default Phone Country Code: '} 
                          {details.details.newSettings.defaultCountryCode}
                          </Typography>
                        </Box>

                        </div>
                        : ""}

                        {/* DEFAULT SHCEDULE OPEN CHANGED */}
                        {details.action == 'Default "Scheduled Open" Changed' ? <div> 
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Details:</strong></Typography>
                        </Box>                     
                        {JSON.stringify(details.details.oldSettings.schedule_opens) != JSON.stringify(details.details.newSettings.scheduleOpens) ? <div>
                        <Box display="flex" alignItems="center" className="mt-3">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Old Scheduled Open:
                            {details.details.oldSettings.schedule_opens.length > 0 ?
                              (details.details.oldSettings.schedule_opens.map((item, i) => (
                                <div>
                                  <div>
                                    <span>{item.scheduleDay}: {item.openTime} - {item.closeTime}</span>
                                  </div>
                                </div>
                              )))
                              : ""
                            }
                          </Typography>
                        </Box>
                        </div> : ""}
                        <Box display="flex" alignItems="center" className="mt-2">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                          {JSON.stringify(details.details.oldSettings.schedule_opens) != JSON.stringify(details.details.newSettings.scheduleOpens) ? 'New Scheduled Open: ' : 'Scheduled Open: '} 
                          {details.details.newSettings.scheduleOpens.length > 0 ?
                            (details.details.newSettings.scheduleOpens.map((item, i) => (
                              <div>
                                  <span>{item.scheduleDay}: {item.openTime} - {item.closeTime}</span>
                              </div>
                            )))
                            : ""
                          }
                          </Typography>
                        </Box>
                        </div>
                        : ""}

                        {/* CHANGE FOB PROGREMME */}
                        {details.action == 'Changed Fob Programmers' ? <div> 
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Details:</strong></Typography>
                        </Box>                     
                        {JSON.stringify(details.details.oldSettings) != JSON.stringify(details.details.newSettings.fobProgrammers) ? <div>
                        <Box display="flex" alignItems="center" className="mt-3 ">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Old Programmers:
                            {details.details.oldSettings.length > 0 ?
                              (details.details.oldSettings.map((item, i) => (
                                <div>
                                  <div>
                                    <span>{item.display_name}</span>
                                  </div>
                                </div>
                              )))
                              : ""
                            }
                          </Typography>
                        </Box>
                        </div> : ""}
                        <Box display="flex" alignItems="center" className="mt-2">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                          {JSON.stringify(details.details.oldSettings) != JSON.stringify(details.details.newSettings.fobProgrammers) ? 'New Programmers: ' : 'Programmers: '} 
                          {details.details.newSettings.fobProgrammers.length > 0 ?
                            (details.details.newSettings.fobProgrammers.map((item, i) => (
                              <div>
                                  <span>{item.display_name}</span>
                              </div>
                            )))
                            : ""
                          }
                          </Typography>
                        </Box>
                        </div>
                        : ""}


                        {/* DEVICE INSTALL */}
                        {details.action == 'Device Installed' || details.action == 'Device Modified' ? <div> 
                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Details:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            {/* Device Display Name: <Link onClick={() => handleClickToRedirect('user', details.details.userDetails.id)}><u>{details.details.display_name}</u></Link> */}
                            Device Display Name: {details.details.display_name}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Device Full Name: {details.details.full_name}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Serial Number: {details.details.hardware_id}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Hardware Id: {details.details.serial_number}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Device Type: {location.state.details.device_type ? location.state.details.device_type : ""}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Lock Type: {details.details.lock_type}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Re-Lock Trigger: {details.details.relock_trigger}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            {details.details.relock_trigger == 'Timer' ? 'Re-Lock Time' : 'Trigger On'}: 
                            {details.details.relock_trigger == 'Timer' ? details.details.relock_timer : details.details.trigger_mode}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Manual Unlock: {details.details.manual_lock == "1" ? "Yes" : "No"}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Sleep: {details.details.sleep_mode == "1" ? "Yes" : "No"}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            BT Power Level (1-5): {details.details.bluetooth_power_level}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Scheduled Open: {details.details.schedule_open == "1" ? "Yes" : "No"}
                          </Typography>
                        </Box>

                        {details.details.schedule_open == "1" ? 
                        <div>
                          {details.details.schedule.map((item, i) => (
                            <Box display="flex" alignItems="right" className="mt-1 text-right">
                              <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                              <Typography variant="subtitle2" component="p" className="ml-2 text-right" style={{width: "100px"}}>
                                {item.schedule_day}: &nbsp;
                              </Typography>
                              <Typography variant="subtitle2" component="p">
                                {item.close_whole_day == '0' ? 'Close whole day' : item.open_time + '-' + item.close_time}
                              </Typography>
                            </Box>
                          ))}
                        </div>
                        : "" }

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Sensor 1 Open: {details.details.sensor1_open_name}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Sensor 1 Closed: {details.details.sensor1_close_name}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Sensor 2 Open: {details.details.sensor2_open_name}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Sensor 2 Closed: {details.details.sensor2_close_name}
                          </Typography>
                        </Box>
                          
                        </div> 
                        : ""}

                        {/* DEVICE REMOVED */}
                        {details.action == 'Device Removed' ? <div> 
                        {/* <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}><strong>Details:</strong></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Device Display Name: <Link onClick={() => handleClickToRedirect('user', details.details.userDetails.id)}><u>{details.details.display_name}</u></Link>
                            Device Display Name: {JSON.parse(details.details).display_name}
                          </Typography>
                        </Box> */}

                        {/* <Box display="flex" alignItems="center" className="mt-1">
                          <Typography variant="subtitle2" className={classes.labelBox}></Typography>
                          <Typography variant="subtitle2" component="p" className="ml-2">
                            Device Display Full Name: {details.details.full_name}
                          </Typography>
                        </Box> */}
                        </div> 
                        : ""}

                        <Divider variant="middle1" className="mt-3 mb-3" style={{ background: '#1E4CA1' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 mt-4 mb-2">
                    <Typography variant="subtitle1" ><strong>Activity Notes:</strong></Typography>
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

                {(activityLogNotes_List.map((item, i) => (
                  <div>
                    <div className="row ">
                      <div className="col-md-2">
                        <Typography variant="subtitle2" className="mt-3">
                          <strong>
                            {moment(item.createdAt, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YY, HH:mm')}
                          </strong>
                        </Typography>
                      </div>
                      <div className="col-md-10">
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



ActivityDetails.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired

};

export default connect(
  mapStateToProps
)(withSnackbar(ActivityDetails));
