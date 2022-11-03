import React, { useEffect, useState, useMemo } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import { getDeviceDetails } from "../store/actions/userActions";
import { withSnackbar } from "notistack";
import { useHistory,useLocation } from "react-router-dom";
import Loader from "../PageLoader";
import Footer from "../footer";
import Submenu from "../header_sub_menu";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  List,
  ListItem,
  Box,
  ListItemText,
  Divider,
  Typography,
  TextField,
} from "@material-ui/core";
import SideNavBar from "../SideNavBar";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  active: {
    cursor: "pointer",
    "&:hover": {
      background: "#efefef",
    },
    "&:last-child": {
      borderRight: "solid 1px #cccccc",
    },
  },
  labelBox: {
    width: 200,
    textAlign: "right",
  },
  labelScheduleBox: {
    width: 100,
    textAlign: "right",
  },
}));

const DeviceDetails = (props) => {
  const { enqueueSnackbar, error, success, loading, pageLoading } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { device_Details } = useSelector((state) => state.user);
  const history = useHistory();
  const location = useLocation();

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
    if (type == "user") {
      localStorage.setItem("tempId", item.user_id);
      history.push({
        pathname: "/modifyUser",
        isLoaderRequired: true,
      });
    } else if (type == "deviceGroup") {
      localStorage.setItem("tempDeviceGroupId", item.id);
      history.push({
        pathname: "/modifyDeviceGroup",
        isLoaderRequired: true,
      });
    }
  };
  useEffect(() => {
    const batchId = localStorage.getItem("NewBatchId");
    console.log("after getting the response "+batchId)
    if (!batchId) {
      history.push({
        pathname: "/deviceDetails",
      });
    } else {
      const isLoaderReq =
        location.isLoaderRequired != undefined
          ? location.isLoaderRequired
          : true;
      dispatch(getDeviceDetails(batchId, isLoaderReq));
    
    }
 
  }, [dispatch]);
 

  var deviceConfigurationList;
  if (device_Details.deviceConfiguration) {
    deviceConfigurationList = device_Details.deviceConfiguration;
    console.log(deviceConfigurationList);
  }

  return (
    <>
      <SideNavBar />
      <div className="main">
        {pageLoading ? <Loader /> : null}
        <Submenu />

        <div className="Contborder">
          <div className="row">
            <div className="col-md-12">
              <div className="card" style={{ marginBottom: 0 }}>
                <div className="col-lg-6"></div>
                <div className="col-lg-12  ">
                    <Link class=' userUpdateButton btn  float-right' to='/devices'>Back
                               
                    </Link>
                  
                </div>

                <div className="card-header">
                  <form autoComplete="off">
                    <div className="row">
                      <div className="col-md-5 row">
                        <div className="col-md-5">
                          <label className="adduserlabel" fullWidth>
                            Batch Name
                          </label>
                        </div>
                        <div className="col-md-7">
                          <TextField
                            id="fname"
                            fullWidth
                            // label="Batch Name (required)"
                            name="batchName"
                            value={device_Details.batch_name}
                            onChange=""
                            //onBlur={handleBlur}
                            error=""
                            helperText=""
                          />
                        </div>
                      </div>
                      <div className="col-md-1 row"></div>
                      <div className="col-md-5 row">
                        <div className="col-md-7">
                          <label className="adduserlabel" fullWidth>
                            Activation Date
                          </label>
                        </div>

                        <div className="col-md-5">
                          <TextField
                            type="date"
                            id="lname"
                            fullWidth
                            name="activationDate"
                            value={device_Details.activation_date}
                            onChange=""
                            error=""
                            helperText=""
                          />
                        </div>
                      </div>
                    </div>
                    {/* Giving white Space */}
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      className="mb-4 "
                    ></Typography>
                    <div className="row">
                      <div className="col-md-5 row">
                        <div className="col-md-5">
                          <label className="adduserlabel" fullWidth>
                            Batch Numbers
                          </label>
                        </div>
                        <div className="col-md-7">
                          <TextField
                            id="batchNo"
                            fullWidth
                            // label="Batch No"
                            name="batchNo"
                            value={device_Details.batch_number}
                            onChange=""
                            error=""
                            helperText=""
                          />
                        </div>
                      </div>

                      <div className="col-md-1 row"></div>
                      <div className="col-md-5 row">
                        <div className="col-md-7">
                          <label className="adduserlabel" fullWidth>
                            Battery ReplacementDate
                          </label>
                        </div>

                        <div className="col-md-5">
                          <TextField
                            type="date"
                            id="lname"
                            fullWidth
                            name="relcementdate"
                            value={device_Details.battery_replacement_date}
                            onChange=""
                            error=""
                            helperText=""
                          />
                        </div>
                      </div>
                    </div>
                    {/* Giving white Space */}
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      className="mb-4 "
                    ></Typography>

                    <div className="row">
                      <div className="col-md-5 row">
                        <div className="col-md-5">
                          <label className="adduserlabel" fullWidth>
                            No of Device
                          </label>
                        </div>

                        <div className="col-md-7">
                          <TextField
                            id="batchNo"
                            fullWidth
                            // label="No of device"
                            name="noOfDevice"
                            value={device_Details.no_of_device}
                            onChange=""
                            error=""
                            helperText=""
                          />
                        </div>
                      </div>

                      <div className="col-md-1 row"></div>
                    </div>
                  </form>
                </div>
                <Divider
                  variant="middle"
                  style={{ background: "#a9d18e", margin: "0 15px 0 15px" }}
                />
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4">
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        className="mb-3"
                      >
                        <strong>Device Batches</strong>
                      </Typography>
                      <Card
                        variant="outlined"
                        style={{ border: "2px solid #a9d18e" ,
                      width:"75%"}}
                      >
                        <CardContent>
                          <List
                            style={{
                              minHeight: 250,
                              maxHeight: 250,
                              overflow: "auto",
                            }}
                          >
                            {deviceConfigurationList ? (
                              deviceConfigurationList.map((item, i) => (
                                <div key={Math.random()}>
                                  <Tooltip>
                                    <ListItemText primary={item.hardwareId} />
                                  </Tooltip>
                                </div>
                              ))
                            ) : (
                              <Typography
                                variant="subtitle2"
                                style={{
                                  textAlign: "center",
                                  marginTop: 40 + "%",
                                }}
                                gutterBottom
                                className="mb-3"
                              >
                                No batch Available
                              </Typography>
                            )}
                          </List>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.user.loading,
    error: state.user.error,
    success: state.user.success,
    pageLoading: state.user.pageLoading,
  };
};

DeviceDetails.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(withSnackbar(DeviceDetails));
