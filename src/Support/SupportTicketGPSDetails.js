import React, { useEffect, useState, useMemo } from "react";
import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom'
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";
import { useLocation, useHistory } from "react-router-dom";
import Loader from "../PageLoader"
import Footer from "../footer"
import Submenu from "../header_sub_menu"

import GoogleMapReact from 'google-map-react';
import Tooltip from '@material-ui/core/Tooltip';
import PlaceIcon from '@material-ui/icons/Place';


const SupportTicketGPSDetails = (props) => {
  const { enqueueSnackbar, error, success, loading, pageLoading } = props;
  const [gps, setGps] = React.useState({
    lat: "",
    log: ""
  });

  const location = useLocation()
  const history = useHistory()
  

  useEffect(() => {
    const gpsLocation = localStorage.getItem("gps_location");
    if (!gpsLocation) {
      history.push({
        pathname: "/supportTicketDetails",
      });
    }
    const gps = JSON.parse(gpsLocation)
    setGps({lat: parseFloat(gps.latitude), log: parseFloat(gps.longitude)})
  }, []);


  const Marker = ({ text }) => {
    return (
      <Tooltip title={text} placement="top">
        <PlaceIcon className="text-red"/>
      </Tooltip>
    );
  }

  
  return (              
    <div>
      { pageLoading ? <Loader /> : null}
      <Submenu/>
      <div className="Contborder">
        <div className="row">
          <div className="col-md-12">
            <div className="card" style={{marginBottom: 0}}>
              <div className='card-header border-0' style={{padding: "12px 25px 0 0"}}>
                <div className='row align-items-center'>
                  <div className='col-lg-11 text-center'>
                  </div>
                  <div className='col-lg-1'>
                    <Link class='btn btn-primary float-right' to='/supportTicketDetails'>Back</Link>
                  </div>
                </div>
              </div>
              
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div style={{ height: '62vh', width: '100%', border:'1px dotted' }}>
                      <GoogleMapReact
                        bootstrapURLKeys={{ key: "AIzaSyAFcDErMtUN_AhN7_pClSsy_rk6mbqHB5Y" }}
                        defaultCenter={{lat: gps.lat, lng: gps.log}}
                        defaultZoom={15}
                      >
                        <Marker text={`${gps.lat}, ${gps.log}`} lat={gps.lat} lng={gps.log} />
                      </GoogleMapReact>
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
    loading: state.deviceGroup.loading,
    error: state.deviceGroup.error,
    success: state.deviceGroup.success,
    pageLoading: state.deviceGroup.pageLoading
  };
};



SupportTicketGPSDetails.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired

};

export default connect(
)(withSnackbar(SupportTicketGPSDetails));
