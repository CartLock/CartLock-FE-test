import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import {
  modifyCompany,
  companyDetails,
  companyDetailsSuccess,
  resetErrorAndSuccessState,
} from "../store/actions/companyActions";
import { withSnackbar } from "notistack";
import { makeStyles } from "@material-ui/core/styles";
import Loader from "../PageLoader";
import Footer from "../footer";
import Switch from "@material-ui/core/Switch";
import validator from "validator";
import { TextField, Button, Box, Typography } from "@material-ui/core";
import ForwardIcon from "@material-ui/icons/Forward";
import "../App.css";
import Submenu from "../header_sub_menu";
import SideNavBar from "../SideNavBar";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  margin: {
    margin: theme.spacing(0),
  },
}));

const ModifyCompany = (props) => {
  const { enqueueSnackbar, error, success, loading } = props;
  const classes = useStyles();
  const { company_Details } = useSelector((state) => state.company);
  const dispatch = useDispatch();
  const history = useHistory();

  const [formValidation, setFormValidation] = React.useState({
    // company_name: "",
    // poc_first_name: "",
    // poc_last_name: "",
    // company_e_mail: "",
    // poc_phone_number: "",
    // company_code: "",
    // location: "",
    // registratation_date: "",
    // timezone: "",
    // cart_fee: "",
    // timing: "",
    // payment_gateway: "",
    // acc_no: "",

    //added by saurav
    company_code: "",
    location: "",
    company_e_mail: "",
    registratation_date: "",
    timezone: "",
    poc_phone_number: "",
    payment_cost: "",
    waiting_hour: "",
    payment_gateway: "",
    acc_no: "",
    company_name:""
  });

  const handleValidation = () => {
    let isError = false;
    const formerr = { ...formValidation };
    if (!company_Details.company_code) {
      isError = true;
      formerr.company_code = "Required company code";
      setFormValidation(formerr);
    }

    // if (!company_Details.poc_first_name) {
    //   isError = true;
    //   formerr.poc_first_name = "Required first name";
    //   setFormValidation(formerr);
    // }

    // if (!company_Details.poc_last_name) {
    //   isError = true;
    //   formerr.poc_last_name = "Required last name";
    //   setFormValidation(formerr);
    // }

    if (!company_Details.company_e_mail) {
      console.log("Email req")
      isError = true;
      formerr.company_e_mail = "Required email";
      setFormValidation(formerr);
    }

    if (
      company_Details.company_e_mail &&
      !validator.isEmail(company_Details.company_e_mail)
    ) {
      isError = true;
      formerr.company_e_mail = "Email invalid";
      setFormValidation(formerr);
    }

    if (!company_Details.poc_phone_number) {
      isError = true;
      formerr.poc_phone_number = "Required telephone";
      setFormValidation(formerr);
    }
    //  else if (company_Details.poc_phone_number.length < 10) {
    //   isError = true;
    //   formerr.poc_phone_number = "Telephone number at least 10 digits";
    //   setFormValidation(formerr);
    // }
    if (!company_Details.payment_cost) {
      isError = true;
      formerr.payment_cost = "Enter Payment Cost";
      setFormValidation(formerr);
    }
  
    if (isNaN(company_Details.payment_cost)) {  
      isError = true;
      formerr.payment_cost = "Enter digit only";
      setFormValidation(formerr);
    }
    if (!company_Details.company_name) {  
      isError = true;
      formerr.company_name = "Required Company Name";
      setFormValidation(formerr);
    }

    return isError;
  };

  const handleChange = (prop) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    dispatch(companyDetailsSuccess({ ...company_Details, [prop]: value }));
    const formerr = { ...formValidation };
    formerr[event.target.name] = null;
    setFormValidation(formerr);
  };

  const handleSubmitClick = (e, returnRequired) => {
    console.log("Handle Submitclick")
    console.log(handleValidation())
    e.preventDefault();
    if (handleValidation()) return false;

    const Data = {
      // id: company_Details.id,
      // companyName: company_Details.company_name,
      // POCFirstName: company_Details.poc_first_name,
      // POCLastName: company_Details.poc_last_name,
      // POCEmail: company_Details.poc_e_mail,
      // POCPhoneNumber: company_Details.poc_phone_number,
      // companyId: company_Details.company_id,
      // isDeactive: company_Details.is_deactive ? "1" : "0",
      companyCode: company_Details.company_code,
      location: company_Details.location,
      companyEmail: company_Details.company_e_mail,
      registratationDate: company_Details.registratation_date,
      timezone: company_Details.timezone,
      POCPhoneNumber: company_Details.poc_phone_number,
      cartFee: company_Details.payment_cost,
      timing: company_Details.waiting_hour,
      paymentGateway: company_Details.payment_gateway,
      merchantAccNo: company_Details.acc_no,
      isDeactive: company_Details.is_deactive ? "1" : "0",
      id: company_Details.id,
      companyName:company_Details.company_name
      
    };

    dispatch(modifyCompany(Data));
  };

  useEffect(() => {
    const id = localStorage.getItem("tempCompanyId");
    if (!id) {
      history.push({
        pathname: "/company",
      });
    } else {
      dispatch(companyDetails(id));
    }
  }, [dispatch]);

  useEffect(() => {
    error && enqueueSnackbar(error, { variant: "error" });
    dispatch(resetErrorAndSuccessState());
  }, [error]);

  useEffect(() => {
    success && enqueueSnackbar(success, { variant: "success" });
    dispatch(resetErrorAndSuccessState());
  }, [success]);

  const [pageLoading, setPageLoading] = React.useState(true);
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
                    className="btn  updateCompany"
                    type="button"
                    variant="contained"
                    size="large"
                    onClick={handleSubmitClick}
                    style={{ display: props.loading ? "none" : "block" }}
                  >
                    Update
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
                          value={company_Details.company_code}
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
                          value={company_Details.location}
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
                          name="company_e_mail"
                          value={company_Details.company_e_mail}
                          onChange={handleChange("company_e_mail")}
                          error={!!formValidation.company_e_mail}
                          helperText={formValidation.company_e_mail}
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
                          name="registratation_date"
                          value={company_Details.registratation_date}
                          onChange={handleChange("registratation_date")}
                          error={!!formValidation.registratation_date}
                          helperText={formValidation.registratation_date}
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
                          value={company_Details.timezone}
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
                          value={company_Details.poc_phone_number}
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
                          name="payment_cost"
                          value={company_Details.payment_cost}
                          onChange={handleChange("payment_cost")}
                          error={!!formValidation.payment_cost}
                          helperText={formValidation.payment_cost}
                        />
                      </div>
                    </div>
                    <div className="col-md-1 row"></div>
                    <div className="col-md-5 row">
                      <div className="col-md-7">
                        <label className="adduserlabel" fullWidth>
                          Waiting Hour
                        </label>
                      </div>

                      <div className="col-md-5">
                        <TextField
                          type="time"
                          id="waiting_hour"
                          fullWidth
                          name="tiwaiting_hourming"
                          value={company_Details.waiting_hour}
                          onChange={handleChange("waiting_hour")}
                          error={!!formValidation.waiting_hour}
                          helperText={formValidation.waiting_hour}
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
                          Company Name
                        </label>
                      </div>
                      <div className="col-md-7">
                        <TextField
                          id="cartfee"
                          fullWidth
                          name="company_name"
                          value={company_Details.company_name}
                          onChange={handleChange("company_name")}
                          error={!!formValidation.company_name}
                          helperText={formValidation.company_name}
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
                          name="payment_gateway"
                          value={company_Details.payment_gateway}
                          onChange={handleChange("payment_gateway")}
                          error={!!formValidation.payment_gateway}
                          helperText={formValidation.payment_gateway}
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
                          name="acc_no"
                          value={company_Details.acc_no}
                          onChange={handleChange("acc_no")}
                          error={!!formValidation.acc_no}
                          helperText={formValidation.acc_no}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row  isCompanyActiveRadio">
                        <Box display="flex" alignItems="center">
                          <Typography variant="subtitle2" >
                            <strong>De-Active Company </strong>
                          </Typography>
                          <Switch
                            color="secondary"
                            checked={company_Details.is_deactive ? true : false}
                            inputProps={{ "aria-label": "primary" }}
                            name="is_deactive"
                            onChange={handleChange("is_deactive")}
                          />
                        </Box>
                      </div>

                  {/* Old Code Goes Here */}

                  {/* <div className="row">
                    <div className="col-md-6 ">
                      <div className="row">
                        <div className="col-md-12">
                          <TextField
                            id="cname"
                            fullWidth
                            label="Company Name (required)"
                            variant="outlined"
                            name="company_name"
                            value={company_Details.company_name}
                            onChange={handleChange("company_name")}
                            error={!!formValidation.company_name}
                            helperText={formValidation.company_name}
                          />
                        </div>
                      </div>

                      <div className="row mt-3">
                        <div className="col-md-12">
                          <Typography variant="subtitle2">
                            <strong>Technical POC</strong>
                          </Typography>
                        </div>
                      </div>

                      <div className="row mt-1">
                        <div className="col-md-12">
                          <TextField
                            id="lname"
                            fullWidth
                            label="Last Name (required)"
                            variant="outlined"
                            name="poc_last_name"
                            value={company_Details.poc_last_name}
                            onChange={handleChange("poc_last_name")}
                            error={!!formValidation.poc_last_name}
                            helperText={formValidation.poc_last_name}
                          />
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-md-12">
                          <TextField
                            id="fname"
                            fullWidth
                            label="First Name (required)"
                            variant="outlined"
                            name="poc_first_name"
                            value={company_Details.poc_first_name}
                            onChange={handleChange("poc_first_name")}
                            error={!!formValidation.poc_first_name}
                            helperText={formValidation.poc_first_name}
                          />
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-md-12">
                          <TextField
                            id="email"
                            fullWidth
                            label="E-Mail (required)"
                            variant="outlined"
                            name="poc_e_mail"
                            value={company_Details.poc_e_mail}
                            onChange={handleChange("poc_e_mail")}
                            error={!!formValidation.poc_e_mail}
                            helperText={formValidation.poc_e_mail}
                          />
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-md-12">
                          <TextField
                            id="telephone"
                            fullWidth
                            label="Telephone (required)"
                            variant="outlined"
                            name="poc_phone_number"
                            value={company_Details.poc_phone_number}
                            onChange={handleChange("poc_phone_number")}
                            error={!!formValidation.poc_phone_number}
                            helperText={formValidation.poc_phone_number}
                          />
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-md-12">
                          <TextField
                            InputProps={{
                              readOnly: true,
                            }}
                            size="small"
                            // fullWidth
                            id="id"
                            label="ID"
                            variant="outlined"
                            name="company_id"
                            value={company_Details.company_id}
                          />
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-md-12">
                          <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleSubmitClick}
                          >
                            Modify &nbsp;
                            <i
                              className="fa fa-spinner fa-spin"
                              style={{
                                display: props.loading ? "block" : "none",
                              }}
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-1 "></div>
                    <div className="col-md-5 ">
                      <div className="row">
                        <Typography
                          variant="subtitle2"
                          style={{ textAlign: "justify", marginRight: 18 }}
                        >
                          <strong>
                            Administrator’s Note: The Company Name along with
                            the E-Mail address must be unique. It is allowable
                            to have the same Company Name, but the e-mail
                            addresses must be different. It is allowable to have
                            multiple Company Names associated with one E-Mail
                            address. It is not permitted to have a Company Name
                            and E-Mail address pair match another.
                          </strong>
                        </Typography>
                      </div>
                      <div className="row">&nbsp;</div>
                      <div className="row">&nbsp;</div>
                      <div className="row">&nbsp;</div>
                      <div className="row">&nbsp;</div>
                      <div className="row">&nbsp;</div>
                      <div className="row">&nbsp;</div>
                      <div className="row">&nbsp;</div>
                      <div className="row">&nbsp;</div>
                      <div className="row">&nbsp;</div>
                      <div className="row">&nbsp;</div>
                      <div className="row">&nbsp;</div>
                      <div className="row">
                        <Box display="flex" alignItems="center">
                          <Typography variant="subtitle2">
                            <strong>De-Active Compnay </strong>
                          </Typography>
                          <Switch
                            color="primary"
                            checked={company_Details.is_deactive ? true : false}
                            inputProps={{ "aria-label": "primary" }}
                            name="is_deactive"
                            onChange={handleChange("is_deactive")}
                          />
                        </Box>
                      </div>
                    </div>
                  </div> */}
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
    // pageLoading: state.company.pageLoading
  };
};

ModifyCompany.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(withSnackbar(ModifyCompany));
