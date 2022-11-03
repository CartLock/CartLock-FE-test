import React, { useEffect, useState, useRef } from "react";
import SideNavBar from "../SideNavBar";
import Loader from "../PageLoader";
import Submenu from "../header_sub_menu";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import validator from "validator";
import PhoneInput from "react-phone-input-2";
//Importing React Material UI
import {
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  List,
} from "@material-ui/core";
import { Height } from "@material-ui/icons";

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
}));

const UpdateTickets = (props) => {
  const { enqueueSnackbar, error, loading } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [pageLoading, setPageLoading] = React.useState(true);
  const [values, setValues] = React.useState({
    lastName: "",
    firstName: "",
    email: "",
    reportedDate: "",
    subject: "",
  });
  const [phoneNumer, setPhoneNumber] = React.useState();

  const [formValidation, setFormValidation] = React.useState({
    lastName: "",
    firstName: "",
    displayName: "",
    phone: "",
    subject: "",
  });
  const handleValidation = () => {
    let isError = false;
    const formerr = { ...formValidation };

    if (!values.firstName) {
      isError = true;
      formerr.firstName = "Required first name";
      setFormValidation(formerr);
    }
    if (!values.lastName) {
      isError = true;
      formerr.lastName = "Required last name";
      setFormValidation(formerr);
    }
    if (values.email && !validator.isEmail(values.email)) {
      isError = true;
      formerr.email = "Email invalid";
      setFormValidation(formerr);
    }
    if (!values.email) {
      isError = true;
      formerr.email = "Email required";
      setFormValidation(formerr);
    }

    if (!values.reportedDate) {
      isError = true;
      formerr.reportedDate = "Required Reported Date";
      setFormValidation(formerr);
    }
    if (!values.subject) {
      isError = true;
      formerr.subject = "Required Subject";
      setFormValidation(formerr);
    }
    return isError;
  };
  const handleChange = (prop) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setValues({ ...values, [prop]: value });
    const formerr = { ...formValidation };
    formerr[event.target.name] = null;
    setFormValidation(formerr);
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (handleValidation()) return false;

    const ticketData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phoneNumer: phoneNumer,
      reportedDate: values.reportedDate,
      subject: values.subject,
    };
    //dispatch(registerUser(uData, history));
  };

  useEffect(() => {
    error && enqueueSnackbar(error, { variant: "error" });
  }, [error]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
  }, []);

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
                  <button
                    className="btn userUpdateButton"
                    type="button"
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={handleSubmitClick}
                    style={{ display: props.loading ? "none" : "block" }}
                  >
                    Update
                  </button>
                  <button
                    variant="contained"
                    color="success"
                    size="large"
                    style={{ display: props.loading ? "block" : "none" }}
                  >
                    Update &nbsp;
                    <i className="fa fa-spinner fa-spin right" />
                  </button>
                </div>

                <div className="card-header">
                  <form autoComplete="off">
                    <div className="row">
                      <div className="col-md-4 row">
                        <div className="col-md-6">
                          <label className="adduserlabel" fullWidth>
                            First Name
                          </label>
                        </div>
                        <div className="col-md-6">
                          <TextField
                            id="fname"
                            fullWidth
                            name="firstName"
                            value={values.firstName}
                            onChange={handleChange("firstName")}
                            error={!!formValidation.firstName}
                            helperText={formValidation.firstName}
                          />
                        </div>
                      </div>
                      <div className="col-md-2 row"></div>
                      <div className="col-md-4 row">
                        <div className="col-md-6">
                          <label className="adduserlabel" fullWidth>
                            Last Name
                          </label>
                        </div>
                        <div className="col-md-6">
                          <TextField
                            id="lname"
                            fullWidth
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange("lastName")}
                            error={!!formValidation.lastName}
                            helperText={formValidation.lastName}
                          />
                        </div>
                      </div>
                    </div>
                    {/**  Second Row Design Related Div  */}
                    <div className="row   updateDeviceSecondRow">
                      <div className="col-md-4 row">
                        <div className="col-md-6">
                          <label className="adduserlabel" fullWidth>
                            Email
                          </label>
                        </div>
                        <div className="col-md-6">
                          <TextField
                            id="email"
                            fullWidth
                            name="email"
                            value={values.email}
                            onChange={handleChange("email")}
                            error={!!formValidation.email}
                            helperText={formValidation.email}
                          />
                        </div>
                      </div>
                      {/* Giving Space in Middle */}
                      <div className="col-md-2 row"></div>
                      <div className="col-md-4 row">
                        <div className="col-md-6">
                          <label className="adduserlabel" fullWidth>
                            Reported Date
                          </label>
                        </div>
                        <div className="col-md-6">
                          <TextField
                            type="date"
                            id="lname"
                            fullWidth
                            name="reportedDate"
                            value={values.reportedDate}
                            onChange={handleChange("reportedDate")}
                            error={!!formValidation.reportedDate}
                            helperText={formValidation.reportedDate}
                          />
                        </div>
                      </div>
                    </div>
                   {/* Giving white Space */}
<Typography variant="subtitle2" gutterBottom className="mb-3"></Typography>
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
                          value={phoneNumer}
                          onChange={setPhoneNumber}
                        />
                      </div>
                    </div>

                   
{/* Giving white Space */}
<Typography variant="subtitle2" gutterBottom className="mb-5 "></Typography>
                   

                    <Typography variant="subtitle2" gutterBottom className="mb-3 "><strong>Ticket Subject</strong></Typography>
                    <div className="row">
                      <div className="col-md-6">
                        <TextField
                          id="subject"
                          fullWidth
                          label="Subject"
                          variant="outlined"
                          name="subject"
                          value={values.subject}
                          onChange={handleChange("subject")}
                          error={!!formValidation.subject}
                          helperText={formValidation.subject}
                        />
                      </div>
                    </div>
                  </form>
                </div>

                {/* <div className="card-body  ">
                <Typography variant="subtitle2" gutterBottom className="mb-3"><strong>Conversation history</strong></Typography>
               
                <form>
  <div class="form-group ">
    <input type="email" class="form-control updateSupport" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder=""
   
   />
  </div>
</form>
                </div> */}
              </div>
              <div />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default UpdateTickets;
