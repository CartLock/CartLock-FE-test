import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import {
  TextField,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
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
  Radio
} from '@material-ui/core';
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import { registerUser, UpdateUserDetails, userList, ekeyList } from "../store/actions/userActions";
import { UserListForRole, 
  roleList, 
  assignRole, 
  userListSuccess, 
  assignedRoleUserList, 
  assignedRoleUserListSuccess,
  removeRoleFromUser, 
  resetErrorAndSuccessState } from "../store/actions/roleActions";
import { withSnackbar } from "notistack";
import validator from 'validator';
import { makeStyles } from '@material-ui/core/styles';
import Loader from "../PageLoader"
import Footer from "../footer"
import { Autocomplete } from '@material-ui/lab';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Delete } from '@material-ui/icons';


const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    }
  },
  active: {
    cursor: "pointer",
    "&:hover": {
      background: "#efefef"
    },
    "&:last-child": {
      borderRight: "solid 1px #cccccc"
    }
  },
}));

const AssignRole = (props) => {
  const { enqueueSnackbar, success, error, loading, pageLoading } = props;
  const classes = useStyles();
  const { ekey_List } = useSelector((state) => state.user)
  const { role_List } = useSelector((state) => state.role)
  const { role_user_List } = useSelector((state) => state.role)
  const { assined_role_user_List } = useSelector((state) => state.role)
  const { available_Devices } = useSelector((state) => state.deviceGroup)
  const dispatch = useDispatch()
  const history = useHistory()

  const [values, setValues] = React.useState({
    role_id: "",
    user_id: "",
    role: {},
    user: {}
  });


  const [formValidation, setFormValidation] = React.useState({
    role: "",
    user: ""
  });

  const handleValidation = () => {
    let isError = false;
    const formerr = { ...formValidation };
    if (!values.role_id) {
      isError = true;
      formerr.role = "Required role";
      setFormValidation(formerr);
    }
    if (!values.user_id) {
      isError = true;
      formerr.user = "Required user";
      setFormValidation(formerr);
    }
    return isError;
  };


  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (handleValidation()) return false;

    const Data = {
      user_id: values.user_id,
      role_id: values.role_id,
    }
    dispatch(assignRole(Data))
  };


  const handleChangeSelection = (event, type) => {
    if (event) {
      var valDetail = { ...values }
      if (type === 'role') {
        valDetail["role_id"] = event.id;
        valDetail["role"] = event
      }
      else if (type === 'user') {
        valDetail["user_id"] = event.id;
        valDetail["user"] = event
      }
      setValues(valDetail)
      setFormValidation({ ...formValidation, [type]: null })
    }
  };

  useEffect(() => {
    dispatch(roleList());
    dispatch(UserListForRole());
    dispatch(assignedRoleUserList());
  }, [dispatch]);

  useEffect(() => {
    error && enqueueSnackbar(error, { variant: "error" });
    dispatch(resetErrorAndSuccessState())
  }, [error]);


  useEffect(() => {
    success && enqueueSnackbar(success, { variant: "success" });
    dispatch(resetErrorAndSuccessState())
    // reset form
    if (success === 'Role assigned successfully') {
      dispatch(userListSuccess(role_user_List.filter((e) => (e !== values.user))))
      
      // add in assigned
      let assignedDetails = {
        id: values.user_id,
        dispay_name: values.user.dispay_name,
        Role: {
            id: values.role_id,
            role_title: values.role.role_title
        }
      }
      dispatch(assignedRoleUserListSuccess([...assined_role_user_List, assignedDetails]))

      var valDetail = { ...values }
      valDetail["role_id"] = ""
      valDetail["role"] = {}
      valDetail["user_id"] = ""
      valDetail["user"] = {}
      setValues(valDetail)
    }
  }, [success]);


  const handleRemoveRole = (event) => {
    dispatch(assignedRoleUserListSuccess(assined_role_user_List.filter((e)=>(e !== event))))
    dispatch(removeRoleFromUser(event.id, event))
    dispatch(userListSuccess([...role_user_List, event]))
  }

  return (
    <div>
      { pageLoading ? <Loader /> : null}

      <div className='header bg-primary pb-6'>
        <div className='container-fluid'>
          <div className='header-body'>
            <div className='row align-items-center py-4'>
              <div className='col-lg-6 col-7'>
                <h6 className='h2 text-white d-inline-block mb-0'>Assign Role</h6>
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
                  <div className="row">
                    <div className="col-md-6">
                      <div className="col-md-12">
                        <FormControl variant="outlined" fullWidth error={!!formValidation.role}>
                          <Autocomplete
                            id="combo-box-demo"
                            value={values.role}
                            onChange={(event, value) => handleChangeSelection(value, 'role')}
                            options={role_List}
                            getOptionLabel={(option) => option.role_title}
                            renderInput={(params) => <TextField {...params} label="Select Role" variant="outlined" error={!!formValidation.role} />}
                          />
                          <FormHelperText>{formValidation.role}</FormHelperText>
                        </FormControl>
                      </div>

                      <div className="col-md-12 mt-3">
                        <FormControl variant="outlined" fullWidth error={!!formValidation.user}>
                          <Autocomplete
                            id="combo-box-demo"
                            value={values.user}
                            onChange={(event, value) => handleChangeSelection(value, 'user')}
                            options={role_user_List}
                            getOptionLabel={(option) => option.dispay_name}
                            renderInput={(params) => <TextField {...params} label="Select User" variant="outlined" error={!!formValidation.role} />}
                          />
                          <FormHelperText>{formValidation.user}</FormHelperText>
                        </FormControl>
                      </div>

                      <div className="col-md-12 mt-3">
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          onClick={handleSubmitClick}
                          style={{ display: props.loading ? 'none' : 'block' }}
                        >
                          Assign
                            </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          style={{ display: props.loading ? 'block' : 'none' }}
                        >
                          Assign
                          &nbsp;
                              <i className="fa fa-spinner fa-spin right" />
                        </Button>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <Typography variant="subtitle1" className="text-center mb-2"><strong>User's Assigned Role</strong></Typography>
                      <Card
                        variant="outlined"
                        style={{
                          height: "500px",
                          borderRadius: "40px",
                          border: "3px solid #3477eb",
                        }}
                      >
                        <CardContent>
                          <List style={{ minHeight: 440, maxHeight: 440, overflow: "auto" }}>
                            <ListItem>
                                <div className="col-md-6">
                                  <Typography variant="subtitle2"><strong>User </strong></Typography>
                                </div>
                                <div className="col-md-5">
                                  <Typography variant="subtitle2"><strong>Role </strong></Typography>
                                </div>
                                <div className="col-md-1">
                                </div>
                            </ListItem>
                            <Divider component="li" />
                            {assined_role_user_List.length > 0 ?
                              (assined_role_user_List.map((item, i) => (
                                <div>
                                  <ListItem className={classes.active}>
                                      <div className="col-md-6">
                                        <ListItemText primary={item.dispay_name} />
                                      </div>
                                      <div className="col-md-6">
                                        <ListItemText primary={item.Role.role_title} />
                                        <ListItemSecondaryAction>
                                          <IconButton edge="end" aria-label="delete" color="secondary" onClick={() => handleRemoveRole(item)}>
                                            <Delete />
                                          </IconButton>
                                        </ListItemSecondaryAction>
                                      </div>
                                  </ListItem>
                                  <Divider component="li" />
                                </div>
                              )))
                              : (<Typography variant="subtitle2" style={{ textAlign: "center", marginTop: 40 + "%" }} className="mb-3">No record found...</Typography>)}
                          </List>
                        </CardContent>
                      </Card>
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

AssignRole.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired

};

// export default (withSnackbar(AddUsers));
export default connect(
  mapStateToProps
)(withSnackbar(AssignRole));
