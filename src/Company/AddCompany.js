import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import { generateUniqueNumber } from "../helper/commonHelper";
import {
  createCompany,
  resetErrorAndSuccessState,
} from "../store/actions/companyActions";
import { withSnackbar } from "notistack";
import Loader from "../PageLoader";
import Footer from "../footer";
import Submenu from "../header_sub_menu";
import Switch from "@material-ui/core/Switch";
import validator from "validator";
import SideNavBar from "../SideNavBar";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  Box,
  Avatar,
  ListItemText,
  Divider,
  Typography,
  FormControl,
  InputLabel,
  Select,
  FormLabel,
  RadioGroup,
  Radio,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import HelpIcon from "@material-ui/icons/Help";
import { makeStyles } from "@material-ui/core/styles";
import "../App.css";
import { useState } from "react";
import { Instagram } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  infoStyle: {
    marginLeft: 10,
    cursor: "pointer",
  },
}));

const AddCompany = (props) => {
  const CHARACTER_LIMIT = 2;
  var currencyValue;
  const { enqueueSnackbar, error, success } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();

  const [pageLoading, setPageLoading] = React.useState(true);

  const [values, setValues] = React.useState({
    company_name: "",
    poc_first_name: "",
    poc_last_name: "",
    poc_e_mail: "",
    poc_phone_number: "",
    company_id: "",
    is_deactive: "",
    //Added new Field By Saurav
    company_code: "",
    location: "",
    timezone: "",
    phone: "",
    cartFee: "",
    timing: "",
    paymentGateway: "",
    merchantAccount: "",
    registratationDate: "",
    currency: "",
    hour: "",
    min: "",
  });

  const [formValidation, setFormValidation] = React.useState({
    company_name: "",
    poc_first_name: "",
    poc_last_name: "",
    poc_e_mail: "",
    poc_phone_number: "",
    company_id: "",
    //Added new Field By Saurav
    company_code: "",
    location: "",
    timezone: "",
    phone: "",
    cartFee: "",
    timing: "",
    paymentGateway: "",
    merchantAccount: "",
    registratationDate: "",
    company_name: "",
    hour: "",
    min: "",
  });

  const handleValidation = () => {
    let isError = false;
    const formerr = { ...formValidation };

    //Added new Validation By Saurav
    if (!values.poc_e_mail) {
      isError = true;
      formerr.poc_e_mail = "Required email";
      setFormValidation(formerr);
    }

    if (values.poc_e_mail && !validator.isEmail(values.poc_e_mail)) {
      isError = true;
      formerr.poc_e_mail = "Email invalid";
      setFormValidation(formerr);
    }
    if (!values.poc_phone_number) {
      isError = true;
      formerr.poc_phone_number = "Required telephone";
      setFormValidation(formerr);
    }
    if (!values.company_code) {
      isError = true;
      formerr.company_code = "Required company code";
      setFormValidation(formerr);
    }
    if (!values.location) {
      isError = true;
      formerr.location = "Required location";
      setFormValidation(formerr);
    }
    if (!values.timezone) {
      isError = true;
      formerr.timezone = "Required timezone";
      setFormValidation(formerr);
    }
    if (!values.cartFee) {
      isError = true;
      formerr.cartFee = "Enter Payment Cost";
      setFormValidation(formerr);
    }

    if (isNaN(values.cartFee)) {
      isError = true;
      formerr.cartFee = "Enter digit only";
      setFormValidation(formerr);
    }

    if (!values.paymentGateway) {
      isError = true;
      formerr.paymentGateway = "Enter payment platform";
      setFormValidation(formerr);
    }
    if (!values.merchantAccount) {
      isError = true;
      formerr.merchantAccount = "Enter Account No";
      setFormValidation(formerr);
    }
    if (!values.registratationDate) {
      isError = true;
      formerr.registratationDate = "Enter Date";
      setFormValidation(formerr);
    }
    if (!values.registratationDate) {
      isError = true;
      formerr.registratationDate = "Enter Date";
      setFormValidation(formerr);
    }
    if (!values.company_name) {
      isError = true;
      formerr.company_name = "Company Name Required";
      setFormValidation(formerr);
    }

    if (!values.hour) {
      isError = true;
      formerr.hour = "Required Hour";
      setFormValidation(formerr);
      console.log("Req hour");
    }
    if (!values.min) {
      isError = true;
      formerr.min = "Required min";
      setFormValidation(formerr);
    }
    if (isNaN(values.hour)) {
      isError = true;
      formerr.hour = "Enter valid Hours";
      setFormValidation(formerr);
    }
    if (isNaN(values.min)) {
      isError = true;
      formerr.min = "Enter valid min";
      setFormValidation(formerr);
    }
    if (values.hour && !isNaN(values.hour)) {
      console.log(values.hour);
      if (values.hour > 60) {
        isError = true;
        formerr.hour = "Enter valid Range";
        setFormValidation(formerr);
      }
      if (values.hour < 0) {
        isError = true;
        formerr.hour = "Enter valid Range";
        setFormValidation(formerr);
      }
    }
    if (values.min && !isNaN(values.min)) {
      console.log(0 > values.min);
      if (values.min > 60) {
        isError = true;
        formerr.min = "Enter valid Range";
        setFormValidation(formerr);
      }
      if (values.min < 0) {
        isError = true;
        formerr.min = "Enter valid Range";
        setFormValidation(formerr);
      }
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

  const [curr, setcurr] = useState();
  const handleChangeSchedule = (event, type) => {
    if (event) {
      if (type == "currency") {
        console.log(event.currency);
        currencyValue = event.currency;
        console.log("After setting the Value1:::" + currencyValue);
        setcurr(currencyValue);
        console.log("After setting the Value2:::" + curr);
      }
    }
  };

  const handleSubmitClick = (e, returnRequired) => {
    e.preventDefault();
    if (handleValidation()) return false;

    const Data = {
      //addded By Saurav Satpathy
      companyCode: values.company_code,
      location: values.location,
      companyEmail: values.poc_e_mail,
      registratationDate: values.registratationDate,
      timezone: values.timezone,
      POCPhoneNumber: values.poc_phone_number,
      cartFee: values.cartFee,
      timing: values.hour + ":" + values.min,
      paymentGateway: values.paymentGateway,
      merchantAccNo: values.merchantAccount,
      isDeactive: values.is_deactive ? "1" : "0",
      companyId: values.company_id,
      currency: "INR",
      companyName: values.company_name,
      hour: values.hour,
      min: values.min,
    };
    dispatch(createCompany(Data, history));
  };

  useEffect(() => {
    error && enqueueSnackbar(error, { variant: "error" });
    dispatch(resetErrorAndSuccessState());
  }, [error]);

  useEffect(() => {
    success && enqueueSnackbar(success, { variant: "success" });
    dispatch(resetErrorAndSuccessState());
    resetDeviceGroupForm();
  }, [success]);

  const resetDeviceGroupForm = () => {
    var resetForm = { ...values };
    resetForm["company_name"] = "";
    resetForm["poc_first_name"] = "";
    resetForm["poc_last_name"] = "";
    resetForm["poc_e_mail"] = "";
    resetForm["poc_phone_number"] = "";
    resetForm["company_id"] = "";
    resetForm["is_deactive"] = "";
    setValues(resetForm);
  };

  const handleGenerateCompanyId = () => {
    const formerr = { ...formValidation };
    formerr["company_id"] = null;
    setFormValidation(formerr);

    const formval = { ...values };
    formval["company_id"] = generateUniqueNumber(4, "alphaNumber");
    setValues(formval);
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
                <div className="col-lg-12  ">
                  {/*<Link class='btn btn-success float-right' to='/users'>User List</Link>*/}
                  <button
                    className="btn  createCompany"
                    type="button"
                    variant="contained"
                    size="large"
                    onClick={handleSubmitClick}
                    style={{ display: props.loading ? "none" : "block" }}
                  >
                    Create Company
                  </button>
                </div>

                <div className="card-header">
                  <div className="row">
                    <div className="col-md-5 row">
                      <div className="col-md-5">
                        <label className="adduserlabel" fullWidth>
                          Company Code
                        </label>
                      </div>
                      <div className="col-md-7">
                        <TextField
                          id="companycode"
                          fullWidth
                          name="company_code"
                          value={values.company_code}
                          onChange={handleChange("company_code")}
                          error={!!formValidation.company_code}
                          helperText={formValidation.company_code}
                        />
                      </div>
                    </div>
                    <div className="col-md-1 row"></div>
                    <div className="col-md-5 row">
                      <div className="col-md-7">
                        <label className="adduserlabel" fullWidth>
                          Location
                        </label>
                      </div>

                      <div className="col-md-5">
                        <TextField
                          id="location"
                          fullWidth
                          name="location"
                          value={values.location}
                          onChange={handleChange("location")}
                          error={!!formValidation.location}
                          helperText={formValidation.location}
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
                          Email
                        </label>
                      </div>
                      <div className="col-md-7">
                        <TextField
                          id="email"
                          fullWidth
                          name="poc_e_mail"
                          value={values.poc_e_mail}
                          onChange={handleChange("poc_e_mail")}
                          error={!!formValidation.poc_e_mail}
                          helperText={formValidation.poc_e_mail}
                        />
                      </div>
                    </div>
                    <div className="col-md-1 row"></div>
                    <div className="col-md-5 row">
                      <div className="col-md-7">
                        <label className="adduserlabel" fullWidth>
                          Registration Date
                        </label>
                      </div>

                      <div className="col-md-5">
                        <TextField
                          type="date"
                          id="regisdate"
                          fullWidth
                          name="registratationDate"
                          value={values.registratationDate}
                          onChange={handleChange("registratationDate")}
                          error={!!formValidation.registratationDate}
                          helperText={formValidation.registratationDate}
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
                          Timezone
                        </label>
                      </div>
                      <div className="col-md-7">
                        <TextField
                          id="zone"
                          fullWidth
                          name="timezone"
                          value={values.timezone}
                          onChange={handleChange("timezone")}
                          error={!!formValidation.timezone}
                          helperText={formValidation.timezone}
                        />
                      </div>
                    </div>
                    <div className="col-md-1 row"></div>
                    <div className="col-md-5 row">
                      <div className="col-md-7">
                        <label className="adduserlabel" fullWidth>
                          Phone
                        </label>
                      </div>

                      <div className="col-md-5">
                        <TextField
                          id="phone"
                          fullWidth
                          name="poc_phone_number"
                          value={values.poc_phone_number}
                          onChange={handleChange("poc_phone_number")}
                          error={!!formValidation.poc_phone_number}
                          helperText={formValidation.poc_phone_number}
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
                          Payment Cost
                        </label>
                      </div>
                      <div className="col-md-7">
                        <TextField
                          id="cartfee"
                          fullWidth
                          name="cartFee"
                          value={values.cartFee}
                          onChange={handleChange("cartFee")}
                          error={!!formValidation.cartFee}
                          helperText={formValidation.cartFee}
                        />
                      </div>
                    </div>
                    <div className="col-md-1 row"></div>
                    <div className="col-md-3 row">
                      <div className="col-md-7">
                        <label className="adduserlabel" fullWidth>
                          Waiting Hour
                        </label>
                      </div>
                    </div>
                    <div className="col-md-2 row">
                      <TextField
                        id="outlined-basic"
                        label="hour"
                        variant="outlined"
                        size="small"
                        inputProps={{
                          maxlength: CHARACTER_LIMIT,
                        }}
                        name="hour"
                        value={values.hour}
                        onChange={handleChange("hour")}
                        error={!!formValidation.hour}
                        helperText={formValidation.hour}

                        // the change is here
                      />
                    </div>
                    <div
                      className="col-md-1 row"
                      style={{
                        left: "10px",
                        top: "5px",
                      }}
                    >
                      :
                    </div>

                    <div
                      className="col-md-2 row"
                      style={{
                        marginLeft: "-5%",
                      }}
                    >
                      <TextField
                        id="outlined-basic"
                        label="min"
                        variant="outlined"
                        size="small"
                        inputProps={{
                          maxlength: CHARACTER_LIMIT,
                        }}
                        name="min"
                        value={values.min}
                        onChange={handleChange("min")}
                        error={!!formValidation.min}
                        helperText={formValidation.min}
                      />
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
                          Comapny Name
                        </label>
                      </div>
                      <div className="col-md-7">
                        <TextField
                          id="company_name"
                          fullWidth
                          name="company_name"
                          value={values.company_name}
                          onChange={handleChange("company_name")}
                          error={!!formValidation.company_name}
                          helperText={formValidation.company_name}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Adding currency  */}

                  {/* Giving white Space */}
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    className="mb-4"
                  ></Typography>
                  {/* <div className="row">
                    <div className="col-md-5 row"></div>
                    <div className="col-md-1 row"></div>
                    <div className="col-md-5 row">
                      <div className="col-md-7" style={{ top: "-32%" }}>
                        <label className="adduserlabel" fullWidth>
                          Select Currency
                        </label>
                      </div>

                      <div className="col-md-5">
                        <select value={selected} onChange={handleSelectChange}>
                          {options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.text}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div> */}

                  {/* Giving white Space */}
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    className="mb-4 "
                  ></Typography>

                  <div className="row">
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      className="mb-3"
                    >
                      <strong>Payment Details</strong>
                    </Typography>
                  </div>
                  <div className="row">
                    <div className="col-md-5 row">
                      <div className="col-md-5">
                        <label className="adduserlabel" fullWidth>
                          Payment Gateway
                        </label>
                      </div>
                      <div className="col-md-7">
                        <TextField
                          id="gateway"
                          fullWidth
                          name="paymentGateway"
                          value={values.paymentGateway}
                          onChange={handleChange("paymentGateway")}
                          error={!!formValidation.paymentGateway}
                          helperText={formValidation.paymentGateway}
                        />
                      </div>
                    </div>
                    <div className="col-md-1 row"></div>
                    <div className="col-md-5 row">
                      <div className="col-md-7">
                        <label className="adduserlabel" fullWidth>
                          Merchant Account
                        </label>
                      </div>

                      <div className="col-md-5">
                        <TextField
                          id="maccount"
                          fullWidth
                          name="merchantAccount"
                          value={values.merchantAccount}
                          onChange={handleChange("merchantAccount")}
                          error={!!formValidation.merchantAccount}
                          helperText={formValidation.merchantAccount}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Giving White Space */}
                  <div className="row">&nbsp;</div>
                  <div className="row">&nbsp;</div>

                  <div className="row">
                    <div className="col-md-6 ">
                      <div className="row mt-3">
                        <div className="col-md-12 ">
                          <Button
                            style={{
                              padding: "7px 22px",
                              fontSize: "0.9375rem",
                              border: "2px solid ",
                              borderRadius: "8px",
                              borderColor: "1b330a",
                              borderWidth: "2px",
                              backgroundColor: "#a9d18e",
                              color: "#1b330a",
                            }}
                            className="mr-2"
                            variant="contained"
                            size="large"
                            onClick={handleGenerateCompanyId}
                          >
                            Generate Company ID
                          </Button>
                          <TextField
                            InputProps={{
                              readOnly: true,
                            }}
                            size="small"
                            id="id"
                            label="ID"
                            variant="outlined"
                            name="company_id"
                            value={values.company_id}
                            error={!!formValidation.company_id}
                            helperText={formValidation.company_id}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-1 "></div>
                    <div className="col-md-5 ">
                      <div className="row">
                        <Box
                          display="flex"
                          alignItems="center"
                          style={{
                            marginTop: "2%",
                          }}
                        >
                          <Typography variant="subtitle2">
                            <strong
                              style={{
                                color: "#1b330a",
                              }}
                            >
                              De-Active Compnay{" "}
                            </strong>
                          </Typography>
                          <Switch
                            color="success"
                            checked={values.is_deactive}
                            inputProps={{ "aria-label": "success" }}
                            name="is_deactive"
                            onChange={handleChange("is_deactive")}
                          />
                        </Box>
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
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.company.loading,
    error: state.company.error,
    success: state.company.success,
  };
};

AddCompany.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};
const currencyList = [
  "ALL",
  "DZD",
  "AOA",
  "ARS",
  "AMD",
  "AUD",
  "EUR",
  "AZN",
  "BHD",
  "BBD",
  "DKK",
  "INR",
];
var Currency = new Array();
for (let index = 0; index < currencyList.length; index++) {
  var key = { id: index, currency: currencyList[index] };
  Currency.push(key);
}
console.log(Currency);
export default connect(mapStateToProps)(withSnackbar(AddCompany));
