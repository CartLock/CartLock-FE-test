import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import { modifyCompanyMailerSetting, getCompanyMailerConfig, companyMailerSettingSuccess, resetErrorAndSuccessState } from "../store/actions/companyActions";
import { withSnackbar } from "notistack";
import { makeStyles } from '@material-ui/core/styles';
import Loader from "../PageLoader"
import Footer from "../footer"
import SideNavBar from "../SideNavBar";
import {
  TextField,
  Button,
  Box,
  Typography
} from "@material-ui/core";
import "../App.css";
import Submenu from "../header_sub_menu"


const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    }
  },
  margin: {
    margin: theme.spacing(0),
  },
}));

const ModifyCompanyMailer = (props) => {
  const { enqueueSnackbar, error, success, loading } = props;
  const classes = useStyles();
  const { companyMailerSetting } = useSelector((state) => state.company)
  const dispatch = useDispatch()
  const history = useHistory()

  const [formValidation, setFormValidation] = React.useState({
    host_name: "",
    port_name: "",
    user_name: "",
    user_password: "",
  });

  const handleValidation = () => {
    let isError = false;
    const formerr = { ...formValidation };
    if (!companyMailerSetting.host_name) {
      isError = true;
      formerr.host_name = "Required host name";
      setFormValidation(formerr);
    }

    if (!companyMailerSetting.port_name) {
      isError = true;
      formerr.port_name = "Required port name";
      setFormValidation(formerr);
    }

    if (!companyMailerSetting.user_name) {
      isError = true;
      formerr.user_name = "Required user name";
      setFormValidation(formerr);
    }

    if (!companyMailerSetting.user_password) {
      isError = true;
      formerr.user_password = "Required password";
      setFormValidation(formerr);
    }

    return isError;
  };

  const handleChange = (prop) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    dispatch(companyMailerSettingSuccess({ ...companyMailerSetting, [prop]: value }));
    const formerr = { ...formValidation };
    formerr[event.target.name] = null;
    setFormValidation(formerr);
  };

  const handleSubmitClick = (e, returnRequired) => {
    e.preventDefault();
    if (handleValidation()) return false;
    
    //const companyId = localStorage.getItem("tempCompanyId");
    const companyId = localStorage.getItem("companySettingId");
    const Data = {
      id: companyMailerSetting.id,
      company_id: companyMailerSetting.company_id ? companyMailerSetting.company_id : companyId,
      host_name: companyMailerSetting.host_name,
      port_name: companyMailerSetting.port_name,
      user_name: companyMailerSetting.user_name,
      user_password: companyMailerSetting.user_password,
    }

    dispatch(modifyCompanyMailerSetting(Data))
  };


  useEffect(() => {
    //const id = localStorage.getItem("tempCompanyId");
    const id = localStorage.getItem("companySettingId");
    if (id) {
      dispatch(getCompanyMailerConfig(id));
    }
  }, [dispatch]);


  useEffect(() => {
    error && enqueueSnackbar(error, { variant: "error" });
    dispatch(resetErrorAndSuccessState())
  }, [error]);


  useEffect(() => {
    success && enqueueSnackbar(success, { variant: "success" });
    dispatch(resetErrorAndSuccessState());    
  }, [success]);

  const [pageLoading, setPageLoading] = React.useState(true)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 1000);
  }, []);

  // const companyId = localStorage.getItem("tempCompId");
  // console.log("companyId = "+companyId)
  
  return (
    <>
    <SideNavBar/>
    <div className="main">
      { pageLoading ? <Loader /> : null}

      <Submenu/>  

      <div className="Contborder">
        <div className="row">
          <div className="col-md-12">
            <div className="card" style={{marginBottom: 0}}>
              <div className='row align-items-center' style={{padding: "12px 25px 0 0"}}>
                {/* <div className='col-lg-10 text-center'>
                  <Typography variant="h5" className="text-center">Company Mailer Setting</Typography>
                </div> */}
                <div className='col-lg-12'>
                  <Link 
                  style={{
                    border: "2px solid",
                    borderColor: " #1b330a",
                    borderRadius: "8px",
                    borderWidth: "2px",
                    backgroundColor: "#a9d18e",
                    color: "#1b330a",
                  }}
                  class='btn  float-right' to='/company'>Back</Link>
                </div>
              </div>
              <div className="card-header">
                <div className="row">
                  <div className="col-md-3 "></div>
                  <div className="col-md-6 ">
                    <div className="row">
                      <div className="col-md-12">
                        <TextField
                          id="cname"
                          fullWidth
                          label="Mailer Host Name (required)"
                          variant="outlined"
                          name="host_name"
                          value={companyMailerSetting.host_name}
                          onChange={handleChange("host_name")}
                          error={!!formValidation.host_name}
                          helperText={formValidation.host_name}
                        />
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-md-12">
                        <TextField
                          id="lname"
                          fullWidth
                          label="Mailer Port (required)"
                          variant="outlined"
                          name="port_name"
                          value={companyMailerSetting.port_name}
                          onChange={handleChange("port_name")}
                          error={!!formValidation.port_name}
                          helperText={formValidation.port_name}
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-12">
                        <TextField
                          id="email"
                          fullWidth
                          label="Username (required)"
                          variant="outlined"
                          name="user_name"
                          value={companyMailerSetting.user_name}
                          onChange={handleChange("user_name")}
                          error={!!formValidation.user_name}
                          helperText={formValidation.user_name}
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-12">
                        <TextField
                          id="telephone"
                          fullWidth
                          label="Password (required)"
                          variant="outlined"
                          name="user_password"
                          value={companyMailerSetting.user_password}
                          onChange={handleChange("user_password")}
                          error={!!formValidation.user_password}
                          helperText={formValidation.user_password}
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-12">
                        <Button
                          variant="contained"
                          style={{
                            border: "2px solid",
                            borderColor: " #1b330a",
                            borderRadius: "8px",
                            borderWidth: "2px",
                            backgroundColor: "#a9d18e",
                            color: "#1b330a",
                          }}
                          size="large"
                          onClick={handleSubmitClick}
                        >
                        Modify &nbsp;<i className="fa fa-spinner fa-spin" style={{display: props.loading ? 'block' : 'none'}}/>
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
    </>
  )
};


const mapStateToProps = (state) => {
  return {
    loading: state.company.loading,
    error: state.company.error,
    success: state.company.success,
    // pageLoading: state.company.pageLoading
  };
};

ModifyCompanyMailer.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired

};


export default connect(
  mapStateToProps
)(withSnackbar(ModifyCompanyMailer));
