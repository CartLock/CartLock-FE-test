import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import { resetErrorAndSuccessState, updatePassword } from "../store/actions/companyActions";
import { withSnackbar } from "notistack";
import { makeStyles } from '@material-ui/core/styles';
import Loader from "../PageLoader"
import Footer from "../footer"
import Submenu from "../header_sub_menu"
import {
  TextField,
  Button,
} from "@material-ui/core";
import "../App.css";


const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    }
  },
}));

const ChangePassword = (props) => {
  const { enqueueSnackbar, error, success, loading } = props;
  const classes = useStyles();
  const dispatch = useDispatch()

  const [pageLoading, setPageLoading] = React.useState(true)

  const [values, setValues] = React.useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [formValidation, setFormValidation] = React.useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleValidation = () => {
    let isError = false;
    const formerr = { ...formValidation };
    if (!values.old_password) {
      isError = true;
      formerr.old_password = "Required current password";
      setFormValidation(formerr);
    }

    if (!values.new_password) {
      isError = true;
      formerr.new_password = "Required password";
      setFormValidation(formerr);
    }

    if (!values.confirm_password) {
      isError = true;
      formerr.confirm_password = "Required confirm password";
      setFormValidation(formerr);
    }

    return isError;
  };

  const handleChange = (prop) => (event) => {
    const value = event.target.value;
    setValues({ ...values, [prop]: value });
    const formerr = { ...formValidation };
    formerr[event.target.name] = null;
    setFormValidation(formerr);
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (handleValidation()) return false;

    const Data = {
      currentPassword: values.old_password,
      newPassword: values.new_password,
      confirmPassword: values.confirm_password
    }

    dispatch(updatePassword(Data))
  };


  useEffect(() => {
    error && enqueueSnackbar(error, { variant: "error" });
    dispatch(resetErrorAndSuccessState())
  }, [error]);


  useEffect(() => {
    success && enqueueSnackbar(success, { variant: "success" });
    dispatch(resetErrorAndSuccessState());
    resetDeviceGroupForm();
  }, [success]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 1000);
  }, []);

  const resetDeviceGroupForm = () => {
    var resetForm = { ...values }
    resetForm["old_password"] = ""
    resetForm["new_password"] = ""
    resetForm["confirm_password"] = ""
    setValues(resetForm);
  }

  return (
    <div>
      { pageLoading ? <Loader /> : null}

      <Submenu/>

      <div className="Contborder">
        <div className="row">
          <div className="col-md-12">
            <div className="card" style={{marginBottom: 0}}>
              <div className="card-header">
                <div className="row" style={{ marginBottom: "170px" }}>
                  <div className="col-md-3 "></div>
                  <div className="col-md-6 ">
                    <div className="row">
                      <div className="col-md-12">
                        <TextField
                          id="cname"
                          fullWidth
                          label="Current Password (required)"
                          variant="outlined"
                          name="old_password"
                          value={values.old_password}
                          onChange={handleChange("old_password")}
                          error={!!formValidation.old_password}
                          helperText={formValidation.old_password}
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-12">
                        <TextField
                          id="lname"
                          fullWidth
                          label="Password (required)"
                          variant="outlined"
                          name="new_password"
                          value={values.new_password}
                          onChange={handleChange("new_password")}
                          error={!!formValidation.new_password}
                          helperText={formValidation.new_password}
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-12">
                        <TextField
                          id="fname"
                          fullWidth
                          label="Confirm Password (required)"
                          variant="outlined"
                          name="confirm_password"
                          value={values.confirm_password}
                          onChange={handleChange("confirm_password")}
                          error={!!formValidation.confirm_password}
                          helperText={formValidation.confirm_password}
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
                          Submit &nbsp;<i className="fa fa-spinner fa-spin" style={{ display: props.loading ? 'block' : 'none' }} />
                        </Button>
                      </div>
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
    loading: state.company.loading,
    error: state.company.error,
    success: state.company.success
  };
};

ChangePassword.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired

};


export default connect(
  mapStateToProps
)(withSnackbar(ChangePassword));
