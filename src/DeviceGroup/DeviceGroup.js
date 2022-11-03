import React, { useEffect, useState, useMemo } from "react";
import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom'
import {
  DataGrid,
} from '@material-ui/data-grid';
import {
  Checkbox,
  Typography,
  IconButton,
} from "@material-ui/core";
import { Group, Devices, DevicesOther, Description, ContactSupport, Settings, Delete, Create } from '@material-ui/icons';
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import { resetErrorAndSuccessState } from "../store/actions/userActions";
import { deviceGroupList, deleteDeviceGroup, updateDeviceGroupList } from "../store/actions/deviceGroupActions";
import { withSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import Loader from "../PageLoader"
import Footer from "../footer"
import Submenu from "../header_sub_menu"
import moment from 'moment';
import timeZone from 'moment-timezone';
import { parse } from "date-fns";
import Tooltip from '@material-ui/core/Tooltip';


const DeviceGroups = (props) => {
  const { enqueueSnackbar, error, success, loading, pageLoading } = props;

  const dispatch = useDispatch()
  const { device_Group } = useSelector((state) => state.deviceGroup)
  const { permissionDetails } = useSelector((state) => state.auth)
  const history = useHistory()

  const columns = [
    {
      field: 'status',
      headerName: '',
      width: 80,
      filterable: false,
      renderHeader: () => (
        <strong>{''}</strong>
      ),
      renderCell: (params) => (
        params.value == "1" ?
        <Tooltip title="Future" arrow><img alt='Future' src='../assets/img/lock-group-orange.png' style={{ cursor: "pointer", width: 40 }} /></Tooltip>
          : params.value == "2" ?
          <Tooltip title="Active" arrow><img alt='Active' src='../assets/img/lock-group.png' style={{ cursor: "pointer", width: 40 }} /></Tooltip>
            : <Tooltip title="Inactive" arrow><img alt='Inactive' src='../assets/img/lock-group-black.png' style={{ cursor: "pointer", width: 40 }}/></Tooltip>
      )
    },
    {
      field: 'full_name',
      headerName: 'Full Name',
      width: 180,
      renderHeader: () => (
        <strong>{'Full Name'}</strong>
      )
    },
    {
      field: 'display_name',
      headerName: 'Display Name',
      width: 180,
      renderHeader: () => (
        <strong>{'Display Name'}</strong>
      )
    },
    {
      field: 'sch_monday',
      headerName: 'Mon',
      width: 80,
      type: 'boolean',
      renderHeader: () => (
        <strong>{'Mon'}</strong>
      ),
      renderCell: (params) => (
        <img alt='Monday' src={params.value ? '../assets/img/checked.png' : '../assets/img/unchecked.png'} style={{ width: 20 }} />
      )
    },
    {
      field: 'sch_tuesday',
      headerName: 'Tue',
      width: 80,
      type: 'boolean',
      renderHeader: () => (
        <strong>{'Tue'}</strong>
      ),
      renderCell: (params) => (
        <img alt='Tuesday' src={params.value ? '../assets/img/checked.png' : '../assets/img/unchecked.png'} style={{ width: 20 }} />
      )
    },
    {
      field: 'sch_wednesday',
      headerName: 'Wed',
      width: 80,
      renderHeader: () => (
        <strong>{'Wed'}</strong>
      ),
      renderCell: (params) => (
        <img alt='Wednesday' src={params.value ? '../assets/img/checked.png' : '../assets/img/unchecked.png'} style={{ width: 20 }} />
      )
    },
    {
      field: 'sch_thursday',
      headerName: 'Thu',
      width: 80,
      renderHeader: () => (
        <strong>{'Thu'}</strong>
      ),
      renderCell: (params) => (
        <img alt='Thursday' src={params.value ? '../assets/img/checked.png' : '../assets/img/unchecked.png'} style={{ width: 20 }} />
      )
    },
    {
      field: 'sch_friday',
      headerName: 'Fri',
      width: 80,
      renderHeader: () => (
        <strong>{'Fri'}</strong>
      ),
      renderCell: (params) => (
        <img alt='Friday' src={params.value ? '../assets/img/checked.png' : '../assets/img/unchecked.png'} style={{ width: 20 }} />
      )
    },
    {
      field: 'sch_saturday',
      headerName: 'Sat',
      width: 80,
      renderHeader: () => (
        <strong>{'Sat'}</strong>
      ),
      renderCell: (params) => (
        <img alt='Saturday' src={params.value ? '../assets/img/checked.png' : '../assets/img/unchecked.png'} style={{ width: 20 }} />
      )
    },
    {
      field: 'sch_sunday',
      headerName: 'Sun',
      width: 80,
      renderHeader: () => (
        <strong>{'Sun'}</strong>
      ),
      renderCell: (params) => (
        <img alt='Sunday' src={params.value ? '../assets/img/checked.png' : '../assets/img/unchecked.png'} style={{ width: 20 }} />
      )
    },
    {
      field: 'start_at',
      headerName: 'Start At',
      width: 110,
      renderHeader: () => (
        <strong>{'Start At'}</strong>
      ),
      renderCell: (params) => (
        params.value ? moment(moment().format('YYYY-MM-DD '+params.value)).format('HH:mm') : '-'
      )
    },
    {
      field: 'end_at',
      headerName: 'End At',
      width: 110,
      renderHeader: () => (
        <strong>{'End At'}</strong>
      ),
      renderCell: (params) => (
        params.value ? moment(moment().format('YYYY-MM-DD '+params.value)).format('HH:mm') : '-'
      )
    },
    {
      field: 'time_zone',
      headerName: 'Zone',
      width: 110,
      renderHeader: () => (
        <strong>{'Zone'}</strong>
      ),
      renderCell: (params) => (
        params.value ? JSON.parse(params.value).time_zone : '-'
      )
    }
  ];

  useEffect(() => {
    dispatch(deviceGroupList(true))
  }, [dispatch]);


  useEffect(() => {
    error && enqueueSnackbar(error, { variant: "error" });
  }, [error]);


  useEffect(() => {
    success && enqueueSnackbar(success, { variant: "success" });
    dispatch(resetErrorAndSuccessState())
  }, [success]);

  const handleHideInactive = (prop) => (event) => {
    if (event.target.checked) {
      dispatch(updateDeviceGroupList(device_Group.filter((e) => (e.status !== '3'))))
    }
    else {
      dispatch(deviceGroupList(false))
    }
  };


  const currentlySelected = (GridCellParams) => {
    const action = GridCellParams.colDef.field
    const id = GridCellParams.row.id
    
    if (action == 'status') {
      localStorage.setItem("tempDeviceGroupId", id);
      history.push({
        pathname: "/modifyDeviceGroup",
        isLoaderRequired: true
      });
    }
    else if (action == 'Delete') {
      var row = GridCellParams.row
      dispatch(deleteDeviceGroup(id, row))
      dispatch(updateDeviceGroupList(device_Group.filter((e) => (e !== row))))
    }
  };

  return (
    <div>

      { pageLoading ? <Loader /> : null}

      <Submenu />

      <div id='Contborder' className='Contborder'>
        <div className='row' style={{height: '100%'}}>
          <div className='col-md-12' style={{height: '100%'}}>
            <div className='card' style={{marginBottom: 0, height: '100%'}}>
              <div className='card-header border-0' style={{padding: "12px 25px 0 0"}}>
                <div className='row align-items-center'>
                  <div className='col-lg-6'>
                    <Typography className="ml-3" variant="subtitle1"><Checkbox color="primary" onClick={handleHideInactive()} /><strong>Hide Inactive</strong></Typography>
                  </div>
                  <div className='col-lg-6'>
                    {permissionDetails.permission_all || permissionDetails.permission_add ?
                      <Link class='btn btn-primary float-right' to='/addDeviceGroup'>Add Device Group</Link>
                      : ""
                    }
                  </div>
                </div>
              </div>
              <div className='card-body' style={{ height: 520, width: '100%' }}>
                <DataGrid onCellClick={currentlySelected} rows={device_Group} columns={columns} pageSize={250} loading={props.loading} />
              </div>
            </div>
          </div>
        </div>
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



DeviceGroups.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired

};

export default connect(
  mapStateToProps
)(withSnackbar(DeviceGroups));