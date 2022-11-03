import React, { useEffect, useState, useRef } from "react";
import { useHistory, Link } from "react-router-dom";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Card,
  CardContent,
  List,
  Box,
  Divider,
  Typography,
  FormControl,
  InputLabel,
  Select,
  RadioGroup,
  Radio,
  FormHelperText,
} from "@material-ui/core";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import {
  registerUser,
  UpdateUserDetails,
  userList,
} from "../store/actions/userActions";
import { companyListForUsers } from "../store/actions/companyActions";
import { withSnackbar } from "notistack";
import validator from "validator";
import { makeStyles } from "@material-ui/core/styles";
import Loader from "../PageLoader";
import Footer from "../footer";
import Submenu from "../header_sub_menu";
import { generateUniqueNumber } from "../helper/commonHelper";
import { Autocomplete } from "@material-ui/lab";
import InputMask from "react-input-mask";
import SideNavBar from "../SideNavBar";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

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

const AddUsers = (props) => {
  const { enqueueSnackbar, error, loading } = props;

  const textRef = useRef();

  const classes = useStyles();
  const { user_Details } = useSelector((state) => state.user);
  const { company_List } = useSelector((state) => state.company);
  const dispatch = useDispatch();

  const history = useHistory();

  const [pageLoading, setPageLoading] = React.useState(true);
  const [companyValue, setCompanyValue] = useState({});

  const [values, setValues] = React.useState({
    lastName: "",
    firstName: "",
    displayName: "",
    email: "",
    cell: "",
    note: "",
    isSentinel: false,
    isFob: false,
    isInstaller: false,
    isInactive: false,
    isSupervisor: false,
    isHouseKeeping: false,
  });
  const [phoneNumer, setPhoneNumber] = React.useState();

  const [formValidation, setFormValidation] = React.useState({
    lastName: "",
    firstName: "",
    displayName: "",
    // cell: ""
  });

  const handleValidation = () => {
    let isError = false;
    const formerr = { ...formValidation };

    if (!values.lastName) {
      isError = true;
      formerr.lastName = "Required last name";
      setFormValidation(formerr);
    }

    if (!values.firstName) {
      isError = true;
      formerr.firstName = "Required first name";
      setFormValidation(formerr);
    }

    if (!values.displayName) {
      isError = true;
      formerr.displayName = "Required display name";
      setFormValidation(formerr);
    }

    if (values.email && !validator.isEmail(values.email)) {
      isError = true;
      formerr.email = "Email invalid";
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

  const handleBlur = () => {
    const firstName = values.firstName;
    const lastName = values.lastName;
    const displayName = lastName.concat(", ", firstName);
    const formerr = { ...formValidation };
    formerr.displayName = null;
    setFormValidation(formerr);
    setValues({ ...values, displayName: displayName });
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (handleValidation()) return false;

    const uData = {
      firstName: values.firstName,
      lastName: values.lastName,
      displayName: values.displayName,
      emailId: values.email,
      phoneNumer: phoneNumer,
      userNotes: values.note,
      isSentinel: values.isSentinel === true ? "1" : "0",
      isInstaller: values.isInstaller === true ? "1" : "0",
      isFob: values.isFob === true ? "1" : "0",
      isInactive: values.isInactive === true ? "1" : "0",
      isSupervisor: values.isSupervisor === true ? "1" : "0",
      isHouseKeeping: values.isHouseKeeping === true ? "1" : "0",
      isHouseKeepingWithoutEvent: "1",
      isSupervisorWithoutEvent: "0",
      checkboxValue:"false",
      companyId:localStorage.getItem("companyID")
    };
// console.log("CheckBoxdata>>>>"+uData.isHouseKeeping+"---"+uData.isSupervisor)
    dispatch(registerUser(uData, history));
  };

  useEffect(() => {
    dispatch(companyListForUsers());
  }, [dispatch]);

  useEffect(() => {
    error && enqueueSnackbar(error, { variant: "error" });
  }, [error]);

  const [value, setValue] = React.useState("female");

  const handleChangeCheckboxValue = (key, value) => {
    console.log(key+":"+value)
    setValues({ ...values, [key]: value });
  };

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
                  {/*<Link class='btn btn-success float-right' to='/users'>User List</Link>*/}
                  <button
                    className="btn  createUserBtn"
                    type="button"
                    variant="contained"
                    size="large"
                    onClick={handleSubmitClick}
                    style={{ display: props.loading ? "none" : "block" }}
                  >
                    Create User
                  </button>
                  <button
                    variant="contained"
                    color="success"
                    size="large"
                    style={{ display: props.loading ? "block" : "none" }}
                  >
                    Create User &nbsp;
                    <i className="fa fa-spinner fa-spin right" />
                  </button>
                </div>

                <div className="card-header">
                  <form autoComplete="off">
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
                            label="First Name (required)"
                            name="firstName"
                            value={values.firstName}
                            onChange={handleChange("firstName")}
                            onBlur={handleBlur}
                            error={!!formValidation.firstName}
                            helperText={formValidation.firstName}
                          />
                        </div>
                      </div>
                      <div className="col-md-1 row"></div>
                      <div className="col-md-4 row">
                        <div className="col-md-4">
                          <label className="adduserlabel" fullWidth>
                            Last Name
                          </label>
                        </div>

                        <div className="col-md-8">
                          <TextField
                            id="lname"
                            fullWidth
                            label="Last Name (required)"
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange("lastName")}
                            error={!!formValidation.lastName}
                            helperText={formValidation.lastName}
                          />
                        </div>
                      </div>

                     
                    </div>
                     {/* Giving white Space */}
                     <Typography variant="subtitle2" gutterBottom className="mb-4 "></Typography>
                    

                    <div className="row">
                    <div className="col-md-4 row ">
                        <div className="col-md-4">
                          <label className="adduserlabel" fullWidth>
                          Email
                          </label>
                        </div>
                        <div className="col-md-8">
                          <TextField
                            id="lname"
                            fullWidth
                            label="E-Mail"
                             name="email"
                          value={values.email}
                          onChange={handleChange("email")}
                          error={!!formValidation.email}
                          helperText={formValidation.email}
                          />
                        </div>
                      </div>
                      <div className="col-md-1 row"></div>

                      <div className="col-md-4 row ">
                        <div className="col-md-4">
                          <label className="adduserlabel" fullWidth>
                            Roles
                          </label>
                        </div>

                         <div className="col-md-8">
                        <div className="row adduserCheckBox">
                        <div className="col-md-6 sauravtest ">
                          <Typography variant="subtitle2" gutterBottom className="">
                            {values.isSupervisor ?
                              (<img alt='Supervisor' src='../assets/img/checkGreen.png' className={classes.imgSize} onClick={() => handleChangeCheckboxValue('isSupervisor', false)} />)
                              : (<img alt='Supervisor' src='../assets/img/unchecked.png' className={classes.imgSize} onClick={() => handleChangeCheckboxValue('isSupervisor', true)} />)
                            }
                            Supervisor
                          </Typography>
                        </div>
                        <div className="col-md-6 sauravtest ">
                          <Typography variant="subtitle2" gutterBottom className="">
                            {values.isHouseKeeping ?
                              (<img alt='HouseKeeping' src='../assets/img/checkGreen.png' className={classes.imgSize} onClick={() => handleChangeCheckboxValue('isHouseKeeping', false)} />)
                              : (<img alt='HouseKeeping' src='../assets/img/unchecked.png' className={classes.imgSize} onClick={() => handleChangeCheckboxValue('isHouseKeeping', true)} />)
                            }
                            HouseKeeping
                          </Typography>
                        </div>
                      </div>
                        </div> 
                      </div>
                    </div>
                    <p style={{marginLeft: "60%",color:"#1b330a",fontWeight:"bold"}}>(Please Choose any one role)</p>
                     {/* Giving white Space */}
                     <Typography variant="subtitle2" gutterBottom className="mb-4 "></Typography>
                    

                    <div className="col-md-4 row modifyUser">
                      <div className="col-md-4">
                        <label className="adduserlabel" fullWidth>
                          Phone
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

                    
                    <div className="row mt-3">
                      <div className="col-md-4"></div>
                      <div className="col-md-4"></div>
                    </div>
                  </form>
                </div>
                    {/* <div className="card-body">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="row">
                        <div className="col">
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            className="mb-3"
                          >
                            <strong>Device Batches</strong>
                          </Typography>
                          <FormControl
                            variant="outlined"
                            fullWidth
                            style={{
                              background: "#E8E8E8",
                              border: "2px solid #a9d18e",
                              borderRadius: "6px",
                            }}
                          >
                            <InputLabel htmlFor="outlined-age-native-simple">
                            
                            </InputLabel>
                            <Select
                              disabled
                              native
                              label="Select eKeys"
                              inputProps={{
                                name: "ekeys",
                                id: "outlined-age-native-simple",
                                className: classes.disabledColor,
                              }}
                            ></Select>
                          </FormControl>
                        </div>

                       
                      </div>
                     
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-4">
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        className="mb-3"
                      >
                      </Typography>
                      <Card
                        variant="outlined"
                        style={{
                          background: "#E8E8E8",
                          border: "2px solid #a9d18e",
                        }}
                      >
                        <CardContent>
                          <List style={{ height: 100 }}></List>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div> */}
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
    loading: state.user.loading,
    error: state.user.error,
  };
};

AddUsers.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

// export default (withSnackbar(AddUsers));
export default connect(mapStateToProps)(withSnackbar(AddUsers));
