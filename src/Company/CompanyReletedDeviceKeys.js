import React, { useEffect, useState, useMemo } from "react";
import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom'
import {
  DataGrid,
} from '@material-ui/data-grid';
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import { resetErrorAndSuccessState } from "../store/actions/userActions";
import { companyRelatedDeviceList, companyRelatedDeviceListSuccess } from "../store/actions/companyActions";
import { withSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import Loader from "../PageLoader"
import Footer from "../footer"
import { Typography } from '@material-ui/core';
import Submenu from "../header_sub_menu"


const columns = [
  {
    field: 'serial_number',
    headerName: 'Serial Number',
    width: 500,
    renderHeader: () => (
      <strong>{'Serial Number'}</strong>
    ),
    renderCell: (params) => (
      params.row.ekeyDetails ? params.row.ekeyDetails.serial_number : ""
    )
  },
  {
    field: 'display_name',
    headerName: 'User',
    width: 300,
    renderHeader: () => (
      <strong>{'User'}</strong>
    ),
    renderCell: (params) => (
      params.row.User ? params.row.User.dispay_name : ""
    )
  }
];

const CompanyReletedDeviceKeys = (props) => {
  const { enqueueSnackbar, error, success, loading, pageLoading } = props;

  const dispatch = useDispatch()
  const { company_related_device_List } = useSelector((state) => state.company)
  const history = useHistory()


  useEffect(() => {
    const id = localStorage.getItem("tempCompanyId");
    if (!id) {
      history.push({
        pathname: "/company",
      });
    }
    else {
      dispatch(companyRelatedDeviceList(id))    
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

  const currentlySelected = (GridCellParams) => {
    const action = GridCellParams.colDef.field
    const id = GridCellParams.row.id
    if (action == '#') {
      localStorage.setItem("tempCompanyId", id);
      history.push({
        pathname: "/modifyCompany"
      });
    }
  };


  return (
    <div>
      { pageLoading ? <Loader /> : null}
      
      <Submenu/>

      <div className='Contborder'>
        <div className='row'>
          <div className='col-md-12'>
            <div className='card' style={{marginBottom: 0}}>
              <div className='card-header border-0' style={{padding: "12px 25px 0 0"}}>
                <div className='row align-items-center'>
                  <div className='col-lg-10 text-center'>
                    <Typography variant="subtitle1">
                      <strong> Company:- </strong> {company_related_device_List.company.company_name} <br/>
                      <strong> Company Id:- </strong> {company_related_device_List.company.company_id}
                    </Typography>
                  </div>
                  <div className='col-lg-2'>
                    <Link class='btn btn-primary float-right' to='/company'>Company List</Link>
                  </div>
                </div>
              </div>
              <div className='card-body' style={{ height: 480, width: '100%' }}>
                <DataGrid onCellClick={currentlySelected} rows={company_related_device_List.details} columns={columns} pageSize={6} loading={props.loading} />
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
    success: state.company.success,
    pageLoading: state.company.pageLoading
  };
};



CompanyReletedDeviceKeys.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired

};

export default connect(
  mapStateToProps
)(withSnackbar(CompanyReletedDeviceKeys));