import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import { withSnackbar } from "notistack";
import Loader from "../PageLoader"
import Footer from "../footer"
import Submenu from "../header_sub_menu"
import { BrowserRouter as Router, useHistory, Route, Link } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ForwardIcon from "@material-ui/icons/Forward";
import "../App.css";
import { modifyCompanySettings, 
  getCompanySettings, 
  resetErrorAndSuccessState, 
  getFobProgrammers, 
  companySettingsDetailsSuccess,
  updateFobProgrammerList
} from "../store/actions/companySettingsActions";



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

const SetFobProgramers = (props) => {
  const { enqueueSnackbar, error, success, loading, pageLoading } = props;
  const { companySettingsDetails } = useSelector((state) => state.companySettings)
  const { fob_Listing } = useSelector((state) => state.companySettings)

  const dispatch = useDispatch()
  const history = useHistory()
  const classes = useStyles(); 

  const [oldSettings, setOldSettings] = React.useState(companySettingsDetails.fob_programmers);

  const handleSubmitClick = (e) => {
    const Data = {
      id: companySettingsDetails.id,
      fobProgrammers: companySettingsDetails.fob_programmers
    }

    dispatch(modifyCompanySettings(Data, oldSettings, 'fob'))
  };


  useEffect(() => {
    dispatch(getCompanySettings());
    dispatch(getFobProgrammers());
  }, [dispatch]);


  useEffect(() => {
    error && enqueueSnackbar(error, { variant: "error" });
    dispatch(resetErrorAndSuccessState())
  }, [error]);


  useEffect(() => {
    success && enqueueSnackbar(success, { variant: "success" });
    dispatch(resetErrorAndSuccessState());
  }, [success]);
   

  const handleAvailableProgrammerClick = (event) => {
    dispatch(updateFobProgrammerList(fob_Listing.filter((e)=>(e !== event))))

    var details = { ...companySettingsDetails }
    details.fob_programmers.push(event);
    dispatch(companySettingsDetailsSuccess(details));

  }

  const handleAssignedProgrammerClick = (event) => {
    dispatch(updateFobProgrammerList([...fob_Listing, event]))

    var details = { ...companySettingsDetails }
    details.fob_programmers = details.fob_programmers.filter((e) => (e !== event));
    dispatch(companySettingsDetailsSuccess(details));
  }

  return (
    <div>
      { pageLoading ? <Loader /> : null}
      
      <Submenu/>

      <div className="Contborder">
        <div className="row">
          <div className="col-md-12">
            <div className="card" style={{marginBottom: 0}}>
              <div className='row align-items-center' style={{padding: "12px 25px 0 0"}}>
                <div className='col-lg-11'>
                  <Typography variant="h5" className="mb-3 text-center">Set Fob Programmers</Typography>
                </div>
                <div className='col-lg-1'>
                  <Link class='btn btn-primary float-right' to='/companySettings'>Back</Link>
                </div>
              </div>
              <div className="card-header">
                <div className="row">
                  <div className="col-md-2"></div>
                  <div className="col-md-8">
                  <div className="row">
                      <div className="col-md-5">
                        <Typography variant="subtitle1" className="text-center mt-2 mb-2"><strong>Available Programmers</strong></Typography>
                        <Card
                          variant="outlined"
                          style={{
                            height: "400px",
                            borderRadius: "40px",
                            border: "3px solid #3477eb",
                          }}
                        >
                          <CardContent>
                            <List style={{ minHeight: 350, maxHeight: 350, overflow: "auto" }}>
                              {fob_Listing.length > 0 ?
                                (fob_Listing.map((item, i) => (
                                  <div>
                                    <ListItem className={classes.active} onClick={() => handleAvailableProgrammerClick(item)}>
                                      <ListItemText primary={item.display_name} />
                                    </ListItem>
                                    <Divider component="li" />
                                  </div>
                                )))
                                : (<Typography variant="subtitle2" style={{ textAlign: "center", marginTop: 40 + "%" }} className="mb-3">No available programmers...</Typography>)}
                            </List>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="col-md-2">
                        <ForwardIcon color="primary" style={{ fontSize: "60px", marginTop: "185px", marginLeft: "18px" }} />
                        <ForwardIcon
                          color="primary"
                          style={{
                            fontSize: "60px",
                            marginTop: "0px",
                            marginLeft: "18px",
                            transform: "rotate(180deg)",
                          }}
                        />
                      </div>
                      <div className="col-md-5">
                        <Typography variant="subtitle1" className="text-center mt-2 mb-2"><strong>Assigned Programmers</strong></Typography>
                        <Card
                          variant="outlined"
                          style={{
                            height: "400px",
                            borderRadius: "40px",
                            border: "3px solid #3477eb",
                          }}
                        >
                          <CardContent>
                            <List style={{ minHeight: 350, maxHeight: 350, overflow: "auto" }}>
                              {companySettingsDetails.fob_programmers.length > 0 ?
                                (companySettingsDetails.fob_programmers.map((item, i) => (
                                  <div>
                                    <ListItem className={classes.active} onClick={() => handleAssignedProgrammerClick(item)}>
                                      <ListItemText primary={item.display_name} />
                                    </ListItem>
                                    <Divider component="li" />
                                  </div>
                                )))
                                : (<Typography variant="subtitle2" style={{ textAlign: "center", marginTop: 40 + "%" }} className="mb-3">No ssigned programmers...</Typography>)}
                            </List>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                     <Button
                        className="mt-5"
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
        {/* <Footer /> */}
      </div>
    </div>
  )
};


const mapStateToProps = (state) => {
  return {
    loading: state.companySettings.loading,
    error: state.companySettings.error,
    success: state.companySettings.success,
    pageLoading: state.companySettings.pageLoading
  };
};

SetFobProgramers.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired

};


export default connect(
  mapStateToProps
)(withSnackbar(SetFobProgramers));
