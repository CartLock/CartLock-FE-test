import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import { withSnackbar } from "notistack";
import Loader from "../PageLoader"
import Footer from "../footer"
import Submenu from "../header_sub_menu"
import Switch from '@material-ui/core/Switch';
import { BrowserRouter as Router, useHistory, Route, Link } from "react-router-dom";
import {
  Button,
  Divider,
  Typography,
  TextField,
  FormControl
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "../App.css";
import { modifyCompanySettings, getCompanySettings, resetErrorAndSuccessState, companySettingsDetailsSuccess } from "../store/actions/companySettingsActions";
import { timeZoneList } from "../store/actions/userActions";
import DateFnsUtils from '@date-io/date-fns';
import { TimePicker, DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DeleteIcon from '@material-ui/icons/Delete';
import { format } from "date-fns";
import { getTimes } from "../helper/commonHelper";
import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    }
  },
  disabledColor: {
    background: '#E8E8E8'
  },
}));

const ScheduleOpen = (props) => {
  const { enqueueSnackbar, error, success, loading, pageLoading } = props;
  const { companySettingsDetails } = useSelector((state) => state.companySettings)
  const dispatch = useDispatch()
  const classes = useStyles();

  const [oldSettings, setOldSettings] = React.useState(companySettingsDetails);

  const handleChange = (prop, type) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    if (type == 'day' && companySettingsDetails.schedule_opens.length > 0) {
      companySettingsDetails.schedule_opens.map((item, i) => {
        if (item.scheduleDay == prop) {
          item.openWholeDay = value;

          if (event.target.checked === false) {
            item.openTime = "";
            item.closeTime = "";
          }
        }
      })
      var details = { ...companySettingsDetails }
      details.schedule_opens = companySettingsDetails.schedule_opens
      dispatch(companySettingsDetailsSuccess(details));
    }
    else if (type == 'excepDay' && companySettingsDetails.schedule_exceptions.length > 0) {
      companySettingsDetails.schedule_exceptions.map((item, i) => {
        if (item.exceptionDate + i == prop) {
          item.openWholeDay = value;

          if (event.target.checked === false) {
            item.openTime = "";
            item.closeTime = "";
          }
        }
      })
      var details = { ...companySettingsDetails }
      details.schedule_exceptions = companySettingsDetails.schedule_exceptions
      dispatch(companySettingsDetailsSuccess(details));
    }


  };

  const handleSubmitClick = (e) => {
    // console.log(companySettingsDetails);return
    const Data = {
      id: companySettingsDetails.id,
      scheduleOpens: companySettingsDetails.schedule_opens,
      scheduleExceptions: companySettingsDetails.schedule_exceptions,
    }

    dispatch(modifyCompanySettings(Data, oldSettings, 'schedule'))
  };


  useEffect(() => {
    dispatch(timeZoneList());
    dispatch(getCompanySettings());
  }, [dispatch]);


  useEffect(() => {
    error && enqueueSnackbar(error, { variant: "error" });
    dispatch(resetErrorAndSuccessState())
  }, [error]);


  useEffect(() => {
    success && enqueueSnackbar(success, { variant: "success" });
    dispatch(resetErrorAndSuccessState());
  }, [success]);



  const handleChangeSchedule = (type, day) => (e) => {
    if ((type == 'openAt' || type == 'closeAt') && companySettingsDetails.schedule_opens.length > 0) {
        companySettingsDetails.schedule_opens.map((item, i) => {
          if (item.scheduleDay == day) {
            if (type == 'openAt') {
              item.openTime = e.target.value;
            }
            else if (type == 'closeAt') {
              item.closeTime = e.target.value;
            }
          }
        })

      var details = { ...companySettingsDetails }
      details.schedule_opens = companySettingsDetails.schedule_opens
      dispatch(companySettingsDetailsSuccess(details));
    }
  };

  const handleChangeException = (type, day) => (e) => {
    // console.log(e.target.value)
    if ((type == 'exceptionDate' || type == 'excepOpenAt' || type == 'excepCloseAt') && companySettingsDetails.schedule_exceptions.length > 0) {
      companySettingsDetails.schedule_exceptions.map((item, i) => {
        if (item.exceptionDate + i == day) {
          if (type == 'exceptionDate') {
            item.exceptionDate = format(e, "YYY-MM-dd");
          }
          else if (type == 'excepOpenAt') {
            item.openTime = e.target.value;
          }
          else if (type == 'excepCloseAt') {
            item.closeTime = e.target.value;
          }
        }
      })

      var details = { ...companySettingsDetails }
      details.schedule_exceptions = companySettingsDetails.schedule_exceptions
      dispatch(companySettingsDetailsSuccess(details));
    }
  };
  const handleAddMore = (event) => {
    var newExcep = {
      exceptionDate: "",
      openWholeDay: true,
      openTime: "",
      closeTime: ""
    }
    var details = { ...companySettingsDetails }
    details.schedule_exceptions.push(newExcep);
    dispatch(companySettingsDetailsSuccess(details));
  };

  const handleRemove = (event) => {
    var details = { ...companySettingsDetails }
    details.schedule_exceptions = details.schedule_exceptions.filter((e) => (e !== event));
    dispatch(companySettingsDetailsSuccess(details));
  };

  const [timeList, settimeList] = useState([])
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
              <div className='row align-items-center' style={{padding: "12px 25px 0 0"}}>
                <div className='col-lg-11'>
                  <Typography variant="h5" className="mb-3 text-center">Set Default "Scheduled Open"</Typography>
                </div>
                <div className='col-lg-1'>
                  <Link class='btn btn-primary float-right' to='/companySettings'>Back</Link>
                </div>
              </div>
              <div className="card-header">
                <div className="row">
                  <div className="col-md-3">
                    <div className="row">
                      <Typography variant="subtitle2" className="ml-2">
                        <strong>
                          By default, be open during these <br /> days and times:
                        </strong>
                      </Typography>
                    </div>
                  </div>
                  <div className="col-md-9">
                    {companySettingsDetails.schedule_opens.map((item, i) => (
                      <div>
                        <div className="row mt-4">
                          <div className="col-md-2">
                            <Typography variant="subtitle2"><strong>{item.scheduleDay}</strong></Typography>
                          </div>
                          <div className="col-md-2">
                            <Switch
                              color="primary"
                              checked={item.openWholeDay}
                              inputProps={{ 'aria-label': 'primary' }}
                              name={item.scheduleDay}
                              onChange={handleChange(item.scheduleDay, 'day')}
                            />
                          </div>
                          <div className="col-md-6">
                            <TextField
                              size="small"
                              type="time"
                              label="Open at"
                              variant="outlined"
                              name="start_at"
                              value={item.openTime}
                              onChange={handleChangeSchedule('openAt', item.scheduleDay)}
                              type={!item.openWholeDay ? "text" : "time"}
                              InputLabelProps={{ shrink: (item.openTime ? true : (!item.openWholeDay ? false : true)), style: {fontSize: 15} }}
                              style={{ width: 130 }}
                              disabled={!item.openWholeDay}
                              className={`mr-2 ${!item.openWholeDay ? classes.disabledColor : null}`}
                            />
                            <TextField
                              size="small"
                              type="time"
                              label="Close at"
                              variant="outlined"
                              name="end_at"
                              value={item.closeTime}
                              onChange={handleChangeSchedule('closeAt', item.scheduleDay)}
                              type={!item.openWholeDay ? "text" : "time"}
                              InputLabelProps={{ shrink: (item.openTime ? true : (!item.openWholeDay ? false : true)), style: {fontSize: 15} }}
                              style={{ width: 130 }}
                              disabled={!item.openWholeDay}
                              className={!item.openWholeDay ? classes.disabledColor : null}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Divider variant="middle1" className="mt-4 mb-2" style={{ background: '#1E4CA1' }} />

                <div className="row">
                  <div className="col-md-3">
                    <div className="row mt-4">
                      <Typography variant="subtitle2" className="ml-2">
                        <strong>
                          With the following exceptions:
                        </strong>
                      </Typography>
                    </div>
                  </div>
                  <div className="col-md-9">
                    {companySettingsDetails.schedule_exceptions.map((item, i) => (
                      <div>
                        <div className="row mt-4">
                          <div className="col-md-2">
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <DatePicker
                                // disablePast
                                label="Start Date"
                                inputVariant="outlined"
                                format="MM/dd/yyyy"
                                size="small"
                                style={{ width: 130 }}
                                name="exceptionDate"
                                value={item.exceptionDate && item.exceptionDate != '0000-00-00' ? item.exceptionDate : null}
                                onChange={handleChangeException('exceptionDate', item.exceptionDate + i)}
                              />
                            </MuiPickersUtilsProvider>
                          </div>
                          <div className="col-md-2">
                            <Switch
                              color="primary"
                              checked={item.openWholeDay}
                              inputProps={{ 'aria-label': 'primary' }}
                              name={item.exceptionDate}
                              onChange={handleChange(item.exceptionDate + i, 'excepDay')}
                            />
                          </div>
                          <div className="col-md-6">
                            <TextField
                              size="small"
                              type="time"
                              label="Open at"
                              variant="outlined"
                              name="start_at"
                              value={item.openTime}
                              onChange={handleChangeException('excepOpenAt', item.exceptionDate + i)}
                              type={!item.openWholeDay ? "text" : "time"}
                              InputLabelProps={{ shrink: (item.openTime ? true : (!item.openWholeDay ? false : true)), style: {fontSize: 15} }}
                              style={{ width: 130 }}
                              disabled={!item.openWholeDay}
                              className={`mr-2 ${!item.openWholeDay ? classes.disabledColor : null}`}
                            />
                            <TextField
                              size="small"
                              type="time"
                              label="Close at"
                              variant="outlined"
                              name="end_at"
                              value={item.closeTime}
                              onChange={handleChangeException('excepCloseAt', item.exceptionDate + i)}
                              type={!item.openWholeDay ? "text" : "time"}
                              InputLabelProps={{ shrink: (item.openTime ? true : (!item.openWholeDay ? false : true)), style: {fontSize: 15} }}
                              style={{ width: 130 }}
                              disabled={!item.openWholeDay}
                              className={`mr-2 ${!item.openWholeDay ? classes.disabledColor : null}`}
                            />
                            {/* <FormControl variant="outlined">
                              <Autocomplete
                                size="small"
                                style={{ width: 130 }}
                                id="combo-box-demo"
                                value={item.openTime}
                                onChange={(event, val) => handleChangeException(val, 'excepOpenAt', item.exceptionDate + i)}
                                options={timeList}
                                getOptionLabel={(option) => option}
                                renderInput={(params) => <TextField {...params} label="Open at" variant="outlined" />}
                                disabled={!item.openWholeDay}
                                className={!item.openWholeDay ? classes.disabledColor : null}
                              />
                            </FormControl>

                            <FormControl variant="outlined">
                              <Autocomplete
                                size="small"
                                style={{ width: 130, marginLeft:10, marginRight: 10 }}
                                id="combo-box-demo"
                                value={item.closeTime}
                                onChange={(event, val) => handleChangeException(val, 'excepCloseAt', item.exceptionDate + i)}
                                options={timeList}
                                getOptionLabel={(option) => option}
                                renderInput={(params) => <TextField {...params} label="Close at" variant="outlined" />}
                                disabled={!item.openWholeDay}
                                className={!item.openWholeDay ? classes.disabledColor : null}
                              />
                            </FormControl> */}

                            
                            
                            {
                              i == 0 ?
                                <Button variant="contained" color="secondary" onClick={() => handleRemove(item)} startIcon={<DeleteIcon style={{ marginLeft: 8 }} />}></Button>
                                : <Button variant="contained" color="secondary" onClick={() => handleRemove(item)} startIcon={<DeleteIcon style={{ marginLeft: 8 }} />}></Button>
                            }

                          </div>
                        </div>
                      </div>
                    ))}
                    <div class="row>">
                    <div className="col-md-9 mt-4">
                      <Button variant="contained" color="primary" onClick={handleAddMore} className="mt-3, float-right">Add</Button>
                      </div>
                    </div>
                    
                    <div class="row>">
                      <Button
                        className="mt-5"
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleSubmitClick}
                      >
                        Submit &nbsp;<i className="fa fa-spinner fa-spin" style={{ display: props.loading ? 'block' : 'none' }} />
                      </Button>
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
    loading: state.companySettings.loading,
    error: state.companySettings.error,
    success: state.companySettings.success,
    pageLoading: state.companySettings.pageLoading
  };
};

ScheduleOpen.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired

};


export default connect(
  mapStateToProps
)(withSnackbar(ScheduleOpen));
