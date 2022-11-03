import React, { useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
} from '@material-ui/core';
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import { createRole, resetErrorAndSuccessState, fail } from "../store/actions/roleActions";
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

const AddRole = (props) => {
  const { enqueueSnackbar, success, error, loading, pageLoading } = props;
  const classes = useStyles();
  const roleDetail = roleDetails()
  const dispatch = useDispatch()
  const history = useHistory()

  const [values, setValues] = React.useState({
    role_title: "",
    role_description: "",
    permission_add: false,
    permission_modifly: false,
    permission_view: false,
    permission_delete: false,
    permission_all: false,
    permission_title: "",
    permission_description: "",
    users: false,
    devices: false,
    device_group: false,
    activity: false,
    support: false,
    company_settings: false,
    change_password: false,
    company: false,
    role: false
  });


  const [formValidation, setFormValidation] = React.useState({
    role_title: "",
  });

  const handleValidation = () => {
    let isError = false;
    const formerr = { ...formValidation };
    if (!values.role_title) {
      isError = true;
      formerr.role_title = "Required role";
      setFormValidation(formerr);
    }
    return isError;
  };

  const handleChange = (prop) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setValues({ ...values, [prop]: value });
    const formerr = { ...formValidation };
    formerr[event.target.name] = null;
    setFormValidation(formerr);
  };


  const handleSubmitClick = (e) => {

    e.preventDefault();
    if (handleValidation()) return false;
    var isErr = false;
    roleDetail.modules.forEach(el => {
      if (values[el.key] == true) {
        isErr = true
      }
    });

    roleDetail.actions.forEach(el => {
      if (values[el.key] == true) {
        isErr = true
      }
    });

    if (values.permission_all == true) {
      isErr = true
    }

    if (!isErr) {
      dispatch(fail("Please choose at least one permission modules or actions or permission all"))
      return
    }

    const Data = {
      role_title: values.role_title,
      role_description: values.role_description,
      permission_add: values.permission_add,
      permission_modifly: values.permission_modifly,
      permission_view: values.permission_view,
      permission_delete: values.permission_delete,
      permission_all: values.permission_all,
      permission_title: values.permission_title,
      permission_description: values.permission_description,
      permission_module: {
        users: values.users,
        devices: values.devices,
        device_group: values.device_group,
        activity: values.activity,
        support: values.support,
        company_settings: values.company_settings,
        change_password: values.change_password,
        company: values.company,
        role: values.role
      }
    }

    dispatch(createRole(Data))
  };


  useEffect(() => {
    error && enqueueSnackbar(error, { variant: "error" });
    dispatch(resetErrorAndSuccessState())
  }, [error]);


  useEffect(() => {
    success && enqueueSnackbar(success, { variant: "success" });
    dispatch(resetErrorAndSuccessState())
    // reset form
    if (success === 'Role created successfully') {
      resetForm()
    }
  }, [success]);


  const handleChangeCheckboxValue = (key, value) => {
    var setValueData
    /*if(key == 'permission_all' && value){
      setValueData = {...values}
      setValueData['permission_add'] = true
      setValueData['permission_modifly'] = true
      setValueData['permission_view'] = true
      setValueData['permission_delete'] = true
      setValueData['permission_all'] = true

      setValueData['users'] = true
      setValueData['devices'] = true
      setValueData['device_group'] = true
      setValueData['activity'] = true
      setValueData['support'] = true
      setValueData['company_settings'] = true
      setValueData['change_password'] = true
      setValueData['company'] = true
      setValueData['role'] = true

      setValues(setValueData)
      
    }
    else if(key == 'permission_all' && !value){
      setValueData = {...values}
      setValueData['permission_add'] = false
      setValueData['permission_modifly'] = false
      setValueData['permission_view'] = false
      setValueData['permission_delete'] = false
      setValueData['permission_all'] = false

      setValueData['users'] = false
      setValueData['devices'] = false
      setValueData['device_group'] = false
      setValueData['activity'] = false
      setValueData['support'] = false
      setValueData['company_settings'] = false
      setValueData['change_password'] = false
      setValueData['company'] = false
      setValueData['role'] = false

      setValues(setValueData)
    }
    else {
      console.log(key, '-', value)
      setValues({ ...values, [key]: value })
    }*/
    setValues({ ...values, [key]: value })
  }

  const resetForm = () => {
    var resetForm = { ...values }
    resetForm["role_title"] = "";
    resetForm["role_description"] = "";
    resetForm["permission_add"] = false;
    resetForm["permission_modifly"] = false;
    resetForm["permission_view"] = false;
    resetForm["permission_delete"] = false;
    resetForm["permission_all"] = false;
    resetForm["permission_title"] = "";
    resetForm["permission_description"] = "";
    resetForm["users"] = false;
    resetForm["devices"] = false;
    resetForm["device_group"] = false;
    resetForm["activity"] = false;
    resetForm["support"] = false;
    resetForm["company_settings"] = false;
    resetForm["change_password"] = false;
    resetForm["company"] = false;
    resetForm["role"] = false;

    setValues(resetForm);
  }

  return (
    <div>
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
                        value={values.role_title}
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
                        value={values.role_description}
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
                        value={values.permission_title}
                        onChange={handleChange("permission_title")}
                      />
                    </div>
                    <div className="col-md-8">
                      <TextField
                        fullWidth
                        label="Permission Description"
                        variant="outlined"
                        name="permission_description"
                        value={values.permission_description}
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
                          {values[item.key] ?
                            (<img alt='Users' src='../assets/img/checked.png' className={classes.imgSize} onClick={() => handleChangeCheckboxValue(item.key, false)} />)
                            : (<img alt='Users' src='../assets/img/unchecked.png' className={classes.imgSize} onClick={() => handleChangeCheckboxValue(item.key, true)} />)
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
                          {values[item.key] ?
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
                        {values.permission_all ?
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
                        Create
                          </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        style={{ display: props.loading ? 'block' : 'none' }}
                      >
                        Create
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

AddRole.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired

};

export default connect(
  mapStateToProps
)(withSnackbar(AddRole));
