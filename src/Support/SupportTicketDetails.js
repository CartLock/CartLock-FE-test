import React, { useEffect, useState, useMemo } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import { resetErrorAndSuccessState } from "../store/actions/userActions";
import {
  getGeneratedTicketDetails,
  createSupportNotes,
} from "../store/actions/deviceGroupActions";
import { withSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import Loader from "../PageLoader";
import Footer from "../footer";
import Submenu from "../header_sub_menu";
import {
  TextField,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  Box,
  Divider,
  Typography,
} from "@material-ui/core";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";

import GoogleMapReact from "google-map-react";
import Tooltip from "@material-ui/core/Tooltip";
import PlaceIcon from "@material-ui/icons/Place";
import SideNavBar from "../SideNavBar";
import PhoneInput from "react-phone-input-2";
import { Switch } from "react-switch-input";
import is from "date-fns/esm/locale/is/index.js";
const useStyles = makeStyles((theme) => ({
  labelBox: {
    width: 200,
    textAlign: "right",
  },
  labelScheduleBox: {
    width: 100,
    textAlign: "right",
  },
}));

const SupportTicketDetails = (props) => {
  const { enqueueSnackbar, error, success, loading, pageLoading } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { supportTicketDetail } = useSelector((state) => state.deviceGroup);
  const history = useHistory();

  const customerDetails = supportTicketDetail.customerDeatils;
  const [values, setValues] = React.useState({
    notes: "",
    firstName: "",
    lastName: "",
    reportedDate: "",
    isdeactive: false,
  });

  const [formValidation, setFormValidation] = React.useState({
    notes: "",
    firstName: "",
    lastName: "",
    reportedDate: "",
    mobile: "",
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
  const [isdeactive, setIsdeactive] = useState(false);
  // if (supportTicketDetail.ticket_status == "0") {
  //   setIsdeactive(false);
  // }

  var swiitchvalue;
  const handleChangeSwitch = (e) => {
    const value = e.target.checked;
    console.log("switch value before::" + value);
    setIsdeactive(value);
    swiitchvalue = value;
    console.log("switch value after::" + swiitchvalue);
    values.isdeactive = swiitchvalue;
    console.log("switch value after::" + values.isdeactive);
  };
  const handleChange = (prop) => (event) => {
    console.log("Inside HandleChange");
    console.log(prop);
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    console.log("value::::::" + value);
    setValues({ ...values, [prop]: value });

    if (prop == "is_deactive") {
      if (value) isdeactive = true;
    }
    console.log("after setting the props value:::" + isdeactive);
    const formerr = { ...formValidation };
    formerr[event.target.name] = null;
    setFormValidation(formerr);
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (handleValidation()) return false;
    console.log("Is_deactive data:::" + values.isdeactive);
    const supportId = localStorage.getItem("tempSupportId");
    const userId = localStorage.getItem("logedUserId");

    const Data = {
      notes: values.notes,
      serviceTicketId: supportId,
      userId: userId,
      ticketStatus: values.isdeactive,
    };
    console.log("notes::" + Data.notes);
    dispatch(createSupportNotes(Data));
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
    dispatch(resetErrorAndSuccessState());
  }, [error]);

  useEffect(() => {
    success && enqueueSnackbar(success, { variant: "success" });
    dispatch(resetErrorAndSuccessState());
    setValues({ notes: "" });
    const id = localStorage.getItem("tempSupportId");
    dispatch(getGeneratedTicketDetails(id, false));
  }, [success]);

  const handleGPS = () => {
    const gpsLocation = supportTicketDetail.gps_location;
    if (
      gpsLocation.longitude > -180 &&
      gpsLocation.longitude < 180 &&
      gpsLocation.latitude > -90 &&
      gpsLocation.latitude < 90
    ) {
      localStorage.setItem("gps_location", JSON.stringify(gpsLocation));
      history.push({
        pathname: "supportTicketGPSDetails",
        state: { id: 1 },
      });
    } else {
      enqueueSnackbar("Invalid latitude or longitude ", { variant: "error" });
      return;
    }
  };

  const Marker = ({ text }) => {
    return (
      <Tooltip title={text} placement="top">
        <PlaceIcon className="text-red" />
      </Tooltip>
    );
  };

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
              <div className="card-header border-0">
                  <div className="row align-items-center">
                    <div className="col-lg-10 text-center">
                      <Typography
                        variant="subtitle1"
                        style={{ color: "#1b330a" }}
                      >
                        Ticket ID #{" "}
                        <strong>{supportTicketDetail.ticket_number} </strong>
                      </Typography>
                    </div>
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
                      to="/support"
                    >
                      Back
                    </Link>
                  </div>
                    <div className="col-lg-2">
                      {/**  <Link class='btn btn-primary float-right' to='/users'>User List</Link>*/}
                      <button
                        className="btn ticketUpdateButton"
                        variant="contained"
                        size="large"
                        onClick={handleSubmitClick}
                        style={{
                          display: props.loading ? "none" : "block",
                          marginLeft: "24%",
                        }}
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
                </div>

                <div className="card-header">
                  <form autoComplete="off">
                    {customerDetails ? (
                      <div>
                        <div className="row">
                          <div className="col-md-6 row">
                            <div
                              className="col-md-4"
                              style={{
                                top: "-32%",
                              }}
                            >
                              <label className="adduserlabel" fullWidth>
                                Problem Description
                              </label>
                            </div>

                            <div className="col-md-8">
                              <TextField
                                id="fname"
                                multiline
                                rows={4}
                                fullWidth
                                variant="outlined"
                                name="problem_description"
                                value={supportTicketDetail.problem_description}
                                onChange={""}
                                error={""}
                                helperText={""}
                              />
                            </div>
                          </div>
                          <div className="col-md-1 row"></div>
                          <div className="col-md-4 row">
                            <div
                              className="col-md-5"
                              style={{
                                top: "-43%",
                              }}
                            >
                              <label className="adduserlabel" fullWidth>
                                {" "}
                                Phone
                              </label>
                            </div>
                            <div
                              className="col-md-7"
                              style={{
                                marginTop: "25px",
                              }}
                            >
                              <TextField
                                id="phone"
                                fullWidth
                                name="phone"
                                value={supportTicketDetail.phone}
                                onChange={""}
                                error={""}
                                helperText={""}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
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
                                value={supportTicketDetail.User.first_name}
                                onChange=""
                                onBlur=""
                                error=""
                                helperText=""
                              />
                            </div>
                          </div>
                          <div className="col-md-2 row"></div>
                          <div className="col-md-4 row">
                            <div className="col-md-5">
                              <label className="adduserlabel" fullWidth>
                                Last Name
                              </label>
                            </div>
                            <div className="col-md-7">
                              <TextField
                                id="lname"
                                fullWidth
                                name="lastName"
                                value={supportTicketDetail.User.last_name}
                                onChange=""
                                onBlur=""
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
                          <div className="col-md-4 row">
                            <div className="col-md-4">
                              <label className="adduserlabel" fullWidth>
                                Email
                              </label>
                            </div>
                            <div className="col-md-8">
                              <TextField
                                id="email"
                                fullWidth
                                name="email"
                                value={supportTicketDetail.User.e_mail}
                                onChange={handleChange("reportedDate")}
                                error={!!formValidation.em}
                                helperText={formValidation.reportedDate}
                              />
                            </div>
                          </div>
                          <div className="col-md-2 row"></div>
                          <div className="col-md-4 row">
                            <div className="col-md-5">
                              <label className="adduserlabel" fullWidth>
                                ReportedDate
                              </label>
                            </div>
                            <div className="col-md-7">
                              <TextField
                                id="reportDate"
                                fullWidth
                                name="reportDate"
                                value={moment(
                                  supportTicketDetail.createdAt
                                ).format("MMMM DD, YYYY")}
                                onChange={handleChange("reportedDate")}
                                error={!!formValidation.reportedDate}
                                helperText={formValidation.reportedDate}
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
                          <div className="col-md-4 row">
                            <div
                              className="col-md-4"
                              style={{
                                top: "-32%",
                              }}
                            >
                              <label className="adduserlabel" fullWidth>
                                Problem Description
                              </label>
                            </div>

                            <div className="col-md-8">
                              <TextField
                                id="fname"
                                multiline
                                rows={4}
                                fullWidth
                                variant="outlined"
                                name="problem_description"
                                value={supportTicketDetail.problem_description}
                                onChange={""}
                                error={""}
                                helperText={""}
                              />
                            </div>
                          </div>
                          <div className="col-md-2 row"></div>
                          <div className="col-md-4 row">
                            <div
                              className="col-md-5"
                              style={{
                                top: "-43%",
                              }}
                            >
                              <label className="adduserlabel" fullWidth>
                                {" "}
                                Phone
                              </label>
                            </div>
                            <div
                              className="col-md-7"
                              style={{
                                marginTop: "25px",
                              }}
                            >
                              <TextField
                                id="phone"
                                fullWidth
                                name="phone"
                                value={supportTicketDetail.phoneNumber}
                                onChange={""}
                                error={""}
                                helperText={""}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                </div>

              

                <div className="card-body">
                  <div className="row  isTicketActiveRadio">
                    <Box display="flex" alignItems="center">
                      <Typography variant="subtitle2">
                        <strong>De-Active Ticket </strong>
                      </Typography>
                      <Switch
                        checked={isdeactive ? true : false}
                        onChange={handleChangeSwitch}
                      />
                    </Box>
                  </div>
                  <div className="row">
                    <div className="col-md-12 mt-4 mb-2">
                      <Typography variant="subtitle1">
                        <strong>Ticket Notes:</strong>
                      </Typography>
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
                  </div>
                  <div className="row">
                    <div className="col-md-12 mt-4 mb-2">
                      <Typography variant="subtitle1">
                        <strong>conversation history</strong>
                      </Typography>
                    </div>
                  </div>
                  {supportTicketDetail.serviceTicketNotes.map((item, i) => (
                    <div>
                      <div className="row ">
                        <div className="col-md-3">
                          <Typography variant="subtitle2" className="mt-3">
                            <strong>
                              {moment(
                                item.createdAt,
                                "YYYY-MM-DD HH:mm:ss"
                              ).format("MM/DD/YY, HH:mm")}
                              , &nbsp;
                              {/* {item.User.dispay_name} */}
                              {"------"}
                            </strong>
                          </Typography>
                        </div>
                        <div className="col-md-9">
                          <Typography
                            variant="subtitle2"
                            component="p"
                            className="mt-3"
                          >
                            {item.note_description}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  ))}
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
    loading: state.deviceGroup.loading,
    error: state.deviceGroup.error,
    success: state.deviceGroup.success,
    pageLoading: state.deviceGroup.pageLoading,
  };
};

SupportTicketDetails.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(withSnackbar(SupportTicketDetails));
