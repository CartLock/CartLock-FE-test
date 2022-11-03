import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  Link,

  useHistory 
} from "react-router-dom";
import { Redirect, NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  FormControl,
  TextField,
  Typography,
  Button,
  Box,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import FormHelperText from "@material-ui/core/FormHelperText";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import {
  forgotpassword,
  resetPassword,
  resetErrorAndSuccessState,
} from "./store/actions/auth";
import { withSnackbar } from "notistack";
import Axios from "./helper/axios";

// import { Loader } from "react-loader-spinner"
import Loader from "./PageLoader";
import { useStaticState } from "@material-ui/pickers";


export const ResetPassword = (props) => {
  
    const history = useHistory();

  var responseMessage;
  let { companyId, to } = useParams();
  const params = new URLSearchParams(window.location.pathname);
  console.log(companyId + ":::" + to);

  const { enqueueSnackbar, error, success, success_message, loading } = props;
  const dispatch = useDispatch();
  const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "25ch",
      },
    },
  }));

  const [values, setValues] = React.useState({
    mailer: to,
    companyId: companyId,
    password: "",
    confirmpassword: "",
  });

  const [isSubmit, setIsSubmit] = React.useState(false);

  const [formValidation, setFormValidation] = React.useState({
    password: "",
    confirmpassword: "",
  });

  const handleValidation = () => {
    let isError = false;
    const formerr = { ...formValidation };
    var password = values.password;
    var confirmPassword = values.confirmpassword;
    if (!values.password) {
      isError = true;
      formerr.password = "Required Password";
      setFormValidation(formerr);
    }

    if (!values.confirmpassword) {
      isError = true;
      formerr.confirmpassword = "Confirm password  required";
      setFormValidation(formerr);
    }
    if (password != confirmPassword) {
      console.log("here");
      isError = true;
      formerr.confirmpassword = "Must same as password";
      setFormValidation(formerr);
    }

    return isError;
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });

    const formerr = { ...formValidation };
    formerr[event.target.name] = null;
    setFormValidation(formerr);
  };


  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (handleValidation()) {
      console.log("validation failed");
      return false;
    }
    console.log("validation success");
    const data = {
      mailer: values.mailer,
      companyId: values.companyId,
      password: values.password,
      confirmpassword: values.confirmpassword,
    };
   
    Axios.post("/user/webResetPassword", data)
      .then((response) => {
        if (response.status === 200) {
          console.log("password changed successfully");
          console.log(response.data.message);
          responseMessage=true;
          history.push('/resetMsg')
        } else {
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
         
        }
      });
    
    console.log(data);
  };

  const [pageLoading, setPageLoading] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
  }, []);

  return (



    <div className="main-content">
      <div></div>
      {pageLoading ? <Loader /> : null}
      <div className="header" />

      <div className="container mt-5 pb-5">
        <div
          className="row justify-content-center"
          style={{
            padding: "5% 32% 5% 32%",
          }}
        >
          <div className="col-lg-2 col-md-2"></div>
          <div className="col-lg-5 col-md-5">
            <div
              className="card bg-secondary mb-0"
              style={{
                border: "1px solid #5e8047",
                borderTop: "20px solid #5e8047",
                boxShadow: "3px 3px 5px rgba(0, 0, 0, 0.46)",
                padding: "5%",
              }}
            >
              <div className="card-header bg-transparent text-center">
                <h2
                  style={{
                    marginLeft: "32%",
                    marginTop: "-1%",
                  }}
                >
                  LOCK CART
                </h2>
                <h4
                  style={{
                    marginLeft: "17%",
                    marginTop: "-2%",
                  }}
                >
                  Contact free unlocking of shopping cart
                </h4>
              </div>
              <div className="card-body px-lg-5">
                <form noValidate autoComplete="off">
                  <Box mb={4}>
                    <TextField
                      id="password"
                      fullWidth
                      label="password"
                      // inputProps={{ maxLength: 4 }}
                      name="password"
                      value={values.password}
                      onChange={handleChange("password")}
                      error={!!formValidation.password}
                      helperText={formValidation.password}
                    />
                  </Box>
                  <Box mb={4}>
                    <TextField
                      id="confirmpassword"
                      fullWidth
                      label="confirm password"
                      name="confirmpassword"
                      value={values.confirmpassword}
                      onChange={handleChange("confirmpassword")}
                      error={!!formValidation.confirmpassword}
                      helperText={formValidation.confirmpassword}
                    />
                  </Box>

                  <div className="row mt-3">
                    <div className="col-12 ">
                      <Button
                        class="btn restBTn btn-lg btn-block"
                        variant="contained"
                        size="large"
                        fullWidth={true}
                        onClick={handleSubmitClick}
                        style={{ display: props.loading ? "none" : "block" }}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
