import React, { useEffect, useState } from "react";
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
import { connect } from "react-redux";
import { auth } from "./store/actions/auth";
import { withSnackbar } from "notistack";
// import { Loader } from "react-loader-spinner"
import Loader from "./PageLoader"

const Login = (props) => {
  const { enqueueSnackbar, error, loading } = props;

  const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "25ch",
      },
    },
  }));

  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
    email: "",
    companyCode: ""
  });

  const [isSubmit, setIsSubmit] = React.useState(false);

  const [formValidation, setFormValidation] = React.useState({
    companyCode: "",
    email: "",
    password: "",
  });

  const handleValidation = () => {
    let isError = false;
    const formerr = { ...formValidation };
    if (!values.companyCode) {
      isError = true;
      formerr.companyCode = "Required compnay code";
      setFormValidation(formerr);
    }
    if (!values.email) {
      isError = true;
      formerr.email = "Required email";
      setFormValidation(formerr);
    }
    if (!values.password) {
      isError = true;
      formerr.password = "Required password";
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

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmitClick = (e) =>  {
    e.preventDefault();
    if (handleValidation()) return false;
    // setIsSubmit(true);
    props.onAuth(values.email, values.password, values.companyCode);
  };

  const userId = localStorage.getItem("token");
  let authRedirect = null;
  if (userId) {
    authRedirect = <Redirect to="/" />;
  }

  useEffect(() => {
    error && enqueueSnackbar(error, { variant: "error" });
  }, [error]);

  const [pageLoading, setPageLoading] = React.useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 1000);
  }, []);

  return (
    <>
        <div className="sidenav">
        <p>LOCK CART</p>
        <small >Contacts free locks</small>
       </div>
       
       <div className="container">
        <h1>Administrator</h1> 
        <i>Login</i>
        <img alt='Logo' src='../assets/img/lockcartHome.png' />
       </div>
       
       
    <div className="main">
      {authRedirect}
      <div>
        <ToastContainer />
      </div>
      { pageLoading ? <Loader /> : null}
      <div className="header" />
      <div className="container mt-5 pb-5">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="card bg-secondary mb-0" style={{border: '1px solid #2dce89', borderTop: '20px solid #5e8047', boxShadow:'3px 3px 5px rgba(0, 0, 0, 0.46)'}}>
              <div className="card-header bg-transparent text-center">
                <h2>LOCK CART</h2>
                <h4>Contact free unlocking of shopping cart</h4>
              </div>
              <div className="card-body px-lg-5">
                <form noValidate autoComplete="off">
                  <Box mb={4}>
                    <TextField
                    er
                      id="compcode"
                      fullWidth
                      label="Supermarket Company Code"
                      name="companyCode"
                      value={values.companyCode}
                      onChange={handleChange("companyCode")}
                      error={!!formValidation.companyCode}
                      helperText={formValidation.companyCode}
                    />
                  </Box>
                  <Box mb={4}>
                    <TextField
                      id="email"
                      fullWidth
                      label="Phone Number/Email"
                      name="email"
                      value={values.email}
                      onChange={handleChange("email")}
                      error={!!formValidation.email}
                      helperText={formValidation.email}
                    />
                  </Box>

                  <FormControl
                    fullWidth
                    error={formValidation.password ? true : false}
                  >
                    <InputLabel  htmlFor="standard-adornment-password">
                      Password
                    </InputLabel >
                    <Input
                      id="standard-adornment-password"
                      type={values.showPassword ? "text" : "password"}
                      value={values.password}
                      name="password"
                      onChange={handleChange("password")}
                      error={!!formValidation.password}
                      helperText={formValidation.password}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {values.showPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    {formValidation.password ? (
                      <FormHelperText id="component-error-text">
                        {formValidation.password}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </FormControl>

                  <div className="row mt-3">
                    <div className="col-12">
                    <button type="button" class="btn submitBtn btn-lg btn-block"
                    onClick={handleSubmitClick}
                    style={{display: props.loading ? 'none' : 'block' }}
                    >
                   Login
                    </button>


                      <Button
                        variant="contained"
                        color="text-primary"
                        size="large"
                        fullWidth={true}
                        style={{display: props.loading ? 'block' : 'none' }}
                      >
                        Login
                        &nbsp;
                        <i className="fa fa-spinner fa-spin right" />
                      </Button>

                    </div>
                    
                    <div className="col-12 text-center mt-3">
                      <NavLink to="/forgotPassword">
                        <small>Forgot password?</small>
                        </NavLink>
                    </div>
                  </div>
                </form>
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
    loading: state.auth.loading,
    error: state.auth.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, companyCode) =>
      dispatch(auth(email, password, companyCode)),
  };
};

Login.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  onAuth: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired

};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(Login));
