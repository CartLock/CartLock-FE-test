import React, { useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
} from '@material-ui/core';
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import { getRoleDetails, modifyRole, createRole, resetErrorAndSuccessState, fail, roleDetailsSuccess } from "../store/actions/roleActions";
import { withSnackbar } from "notistack";
import { makeStyles } from '@material-ui/core/styles';
import Loader from "../PageLoader"
import Footer from "../footer"
import { roleDetails } from "../helper/commonHelper";


const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    }
  },
  imgSize: {
    width: "20px",
    marginRight: "10px",
    cursor: "pointer"
  }
}));

const ModifyRole = (props) => {
  const { enqueueSnackbar, success, error, loading, pageLoading } = props;
  const classes = useStyles();
  const roleDetail = roleDetails()
  const { role_Details } = useSelector((state) => state.role)
  const dispatch = useDispatch()
  const history = useHistory()

  const [formValidation, setFormValidation] = React.useState({
    role_title: "",
  });

  const handleValidation = () => {
    let isError = false;
    const formerr = { ...formValidation };
    if (!role_Details.role_title) {
      isError = true;
      formerr.role_title = "Required role";
      setFormValidation(formerr);
    }
    return isError;
  };

  const handleChange = (prop) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    dispatch(roleDetailsSuccess({ ...role_Details, [prop]: value }))
    const formerr = { ...formValidation };
    formerr[event.target.name] = null;
    setFormValidation(formerr);
  };


  const handleSubmitClick = (e) => {

    e.preventDefault();
    if (handleValidation()) return false;
    var isErr = false;
    roleDetail.modules.forEach(el => {
      if (role_Details[el.key] == true) {
        isErr = true
      }
    });

    roleDetail.actions.forEach(el => {
      if (role_Details[el.key] == true) {
        isErr = true
      }
    });

    if (role_Details.permission_all == true) {
      isErr = true
    }

    if (!isErr) {
      dispatch(fail("Please choose at least one permission modules or actions or permission all"))
      return
    }
// console.log(role_Details);return
    const Data = {
      role_title: role_Details.role_title,
      role_description: role_Details.role_description,
      permission_add: role_Details.permission_add,
      permission_modifly: role_Details.permission_modifly,
      permission_view: role_Details.permission_view,
      permission_delete: role_Details.permission_delete,
      permission_all: role_Details.permission_all,
      permission_title: role_Details.permission_title,
      permission_description: role_Details.permission_description,
      permission_module: {
        users: role_Details.users,
        devices: role_Details.devices,
        device_group: role_Details.device_group,
        activity: role_Details.activity,
        support: role_Details.support,
        company_settings: role_Details.company_settings,
        change_password: role_Details.change_password,
        company: role_Details.company,
        role: role_Details.role
      }
    }

    dispatch(modifyRole(role_Details))
  };


  useEffect(() => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>CVVVVVVVVVVVV");
    const roleId = localStorage.getItem("tempRoleId");
    if (!roleId) {
      history.push({
        pathname: "/role",
      });
    }
    else {
      console.log(">>>>>>>>>>>>>>>>>>>>>>",roleId);
      dispatch(getRoleDetails(roleId))
    }
    
  }, [dispatch]);

  useEffect(() => {
    error && enqueueSnackbar(error, { variant: "error" });
    dispatch(resetErrorAndSuccessState())
  }, [error]);


  useEffect(() => {
    success && enqueueSnackbar(success, { variant: "success" });
    dispatch(resetErrorAndSuccessState())
  }, [success]);


  const handleChangeCheckboxValue = (key, value) => {    
    dispatch(roleDetailsSuccess({ ...role_Details, [key]: value }))
  }

  const handleChangeCheckboxValueModule = (key, value) => {    
    var details = {...role_Details}
    details.permission_module[key] = value
    dispatch(roleDetailsSuccess(details));
  }

  return (
    <div>
      {console.log(role_Details)}
      { pageLoading ? <Loader /> : null}

      <div className='header bg-primary pb-6'>
        <div className='container-fluid'>
          <div className='header-body'>
            <div className='row align-items-center py-4'>
              <div className='col-lg-6 col-7'>
                <h6 className='h2 text-white d-inline-block mb-0'>Create/Modify Role</h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container-fluid mt--6'>
        <div className='row'>
          <div className='col-md-12'>
            <div className='card p-3 pt-4'>
              <div className='row align-items-center'>
                <div className='col-lg-6'>
                </div>
                <div className='col-lg-6'>
                  <Link class='btn btn-primary float-right' to='/role'>Role List</Link>
                </div>
              </div>
              <div className="card-header">
                <form autoComplete="off">
                  <div className="row mb-2">
                    <div className="col-md-4">
                      <Typography variant="subtitle2" gutterBottom><strong>Role Details</strong></Typography>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <TextField
                        fullWidth
                        label="Role (required)"
                        variant="outlined"
                        name="role_title"
                        value={role_Details.role_title}
                        onChange={handleChange("role_title")}
                        error={!!formValidation.role_title}
                        helperText={formValidation.role_title}
                      />
                    </div>
                    <div className="col-md-8">
                      <TextField
                        fullWidth
                        label="Description"
                        variant="outlined"
                        name="role_description"
                        value={role_Details.role_description}
                        onChange={handleChange("role_description")}
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-4">
                      <Typography variant="subtitle2" gutterBottom><strong>Permission Details</strong></Typography>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-md-4">
                      <TextField
                        fullWidth
                        label="Permission Title"
                        variant="outlined"
                        name="permission_title"
                        value={role_Details.permission_title}
                        onChange={handleChange("permission_title")}
                      />
                    </div>
                    <div className="col-md-8">
                      <TextField
                        fullWidth
                        label="Permission Description"
                        variant="outlined"
                        name="permission_description"
                        value={role_Details.permission_description}
                        onChange={handleChange("permission_description")}
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-4">
                      <Typography variant="subtitle2" gutterBottom><strong>Permission Modules</strong></Typography>
                    </div>
                  </div>
                  <div className="row mt-2">
                    {(roleDetail.modules.map((item, i) => (
                      <div className="col-md-4">
                        <Typography variant="subtitle2" gutterBottom className="mb-3">
                          {role_Details.permission_module[item.key] ?
                            (<img alt='Users' src='../assets/img/checked.png' className={classes.imgSize} onClick={() => handleChangeCheckboxValueModule(item.key, false)} />)
                            : (<img alt='Users' src='../assets/img/unchecked.png' className={classes.imgSize} onClick={() => handleChangeCheckboxValueModule(item.key, true)} />)
                          }
                          {item.value}
                        </Typography>
                      </div>
                    )))}
                  </div>

                  <div className="row">
                    <div className="col-md-4">
                      <Typography variant="subtitle2" gutterBottom><strong>Permission Actions</strong></Typography>
                    </div>
                  </div>
                  <div className="row mt-2">
                    {(roleDetail.actions.map((item, i) => (
                      <div className="col-md-4">
                        <Typography variant="subtitle2" gutterBottom className="mb-3">
                          {role_Details[item.key] ?
                            (<img alt='Users' src='../assets/img/checked.png' className={classes.imgSize} onClick={() => handleChangeCheckboxValue(item.key, false)} />)
                            : (<img alt='Users' src='../assets/img/unchecked.png' className={classes.imgSize} onClick={() => handleChangeCheckboxValue(item.key, true)} />)
                          }
                          {item.value}
                        </Typography>
                      </div>
                    )))}
                  </div>

                  <div className="row mt-2">
                    <div className="col-md-4">
                      <Typography variant="subtitle2" gutterBottom><strong>Permission all to Role</strong></Typography>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-md-4">
                      <Typography variant="subtitle2" gutterBottom className="mb-3">
                        {role_Details.permission_all ?
                          (<img alt='Permission All' src='../assets/img/checked.png' className={classes.imgSize} onClick={() => handleChangeCheckboxValue('permission_all', false)} />)
                          : (<img alt='Permission All' src='../assets/img/unchecked.png' className={classes.imgSize} onClick={() => handleChangeCheckboxValue('permission_all', true)} />)
                        }
                        Permission All
                      </Typography>
                    </div>
                    <div className="col-md-4">
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleSubmitClick}
                        style={{ display: props.loading ? 'none' : 'block' }}
                      >
                        Modify
                          </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        style={{ display: props.loading ? 'block' : 'none' }}
                      >
                        Modify
                        &nbsp;
                            <i className="fa fa-spinner fa-spin right" />
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
};


const mapStateToProps = (state) => {
  return {
    loading: state.role.loading,
    error: state.role.error,
    pageLoading: state.role.pageLoading,
    success: state.role.success,
  };
};

ModifyRole.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired

};

export default connect(
  mapStateToProps
)(withSnackbar(ModifyRole));
