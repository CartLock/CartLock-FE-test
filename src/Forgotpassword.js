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
import { connect, useSelector, useDispatch } from "react-redux";
import { forgotpassword,resetErrorAndSuccessState } from "./store/actions/auth";
import { withSnackbar } from "notistack"; 
// import { Loader } from "react-loader-spinner"
import Loader from "./PageLoader"  
import { useStaticState } from "@material-ui/pickers";

 
const Forgotpassword = (props) => {
  const { enqueueSnackbar, error,success,success_message, loading } = props;
  const dispatch = useDispatch()
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
      formerr.companyCode = "Required company code";
      setFormValidation(formerr);
    }

    if (values.companyCode.length !==4) {
      isError = true;
      formerr.companyCode = "Company ID is required to have 4 digits";
      setFormValidation(formerr);
    }


    if (!values.email) {
      isError = true;
      formerr.email = "Email is required";
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
    props.onAuth(values.email, values.companyCode);
    //dispatch(resetErrorAndSuccessState());
  };  

  const userId = localStorage.getItem("token");
  let authRedirect = null;
  if (userId) {
    authRedirect = <Redirect to="/" />;
  }
  
  useEffect(() => {
    error && enqueueSnackbar(error, { variant: "error" }); 
    dispatch(resetErrorAndSuccessState());
  }, [error]);

  useEffect(() => {  
    success && enqueueSnackbar(success_message, { variant: "success" }); 
    setValues({email: "",companyCode: ""});
    dispatch(resetErrorAndSuccessState());
  }, [success]);
  

  const [pageLoading, setPageLoading] = React.useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 1000);
  }, []);

  return (
    <div className="main-content">
      {authRedirect}
      <div>
        <ToastContainer />
      </div>
      { pageLoading ? <Loader /> : null}
      <div className="header" />
      <div className="container mt-5 pb-5">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="card bg-secondary mb-0" style={{border: '1px solid #5e8047', borderTop: '20px solid #5e8047', boxShadow:'3px 3px 5px rgba(0, 0, 0, 0.46)'}}>
              <div className="card-header bg-transparent text-center">
                
               <h2>LOCK CART</h2>
                <h4>Contact free unlocking of shopping cart</h4>
                
              </div>
              <div className="card-body px-lg-5">
                <form noValidate autoComplete="off">
                  <Box mb={4}>
                    <TextField
                      id="compcode"
                      fullWidth
                      label="Company ID (4 Characters)"
                      inputProps={{ maxLength: 4 }}
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
                      label="Email"
                      name="email"
                      value={values.email}
                      onChange={handleChange("email")}
                      error={!!formValidation.email}
                      helperText={formValidation.email}
                    />
                  </Box>

                 

                  <div className="row mt-3">
                    <div className="col-12 ">
                      <Button 
                      class="btn submitBtn btn-lg btn-block"
                        variant="contained"
                        size="large"
                        fullWidth={true}
                        onClick={handleSubmitClick}
                        style={{display: props.loading ? 'none' : 'block' }}
                      >
                        Send Reset Password Link
                      </Button>

                      {/* <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth={true}
                        style={{display: props.loading ? 'block' : 'none' }}
                      >
                        Login
                        &nbsp;
                        <i className="fa fa-spinner fa-spin right" />
                      </Button> */}

                    </div>
                    <div className="col-12 text-center mt-3">
                    <NavLink to="/login">
                        <small>Login</small>
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
  );
}; 

const mapStateToProps = (state) => { 
  console.log("State Value:::"+state.auth.loading+"::"+state.auth.error+"::"+state.auth.success+"::"+state.auth.success_message);
  return {
    
    loading: state.auth.loading,
    error: state.auth.error,
    success:state.auth.success,
    success_message:state.auth.success_message,
    
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, companyCode) =>
      dispatch(forgotpassword(email, companyCode)),
  };
};

Forgotpassword.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  onAuth: PropTypes.func.isRequired,

};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(Forgotpassword));
