import React, { useEffect, useState, useMemo } from "react";
import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom'
import { Button } from "@material-ui/core";
import { DataGrid } from '@material-ui/data-grid';
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { FormControl, TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { connect, useSelector, useDispatch } from "react-redux";
import { activityLogList } from "../store/actions/userActions";
import { withSnackbar } from "notistack";
import { useHistory, useLocation } from "react-router-dom";
import Loader from "../PageLoader"
import Footer from "../footer"
import moment from 'moment';
import Moment from 'react-moment';
import timeZone from 'moment-timezone';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { CSVLink } from "react-csv";
import Submenu from "../header_sub_menu"
import { UTCDateTimeFormat } from "../helper/commonHelper";
import SideNavBar from "../SideNavBar";
import Tooltip from '@material-ui/core/Tooltip';

const headers = [
  { label: "ID", key: "id" },
  { label: "Operation Typw", key: "operation_type" },
  { label: "Device Id", key: "device_id" },
  { label: "GPS LOcation", key: "gps_location" },
  { label: "Summary", key: "summary" },
  { label: "Created At", key: "createdAt" },
  // { label: "Device / Device Group", key: "device" },
  // { label: "User", key: "user" },
  // { label: "Summary", key: "summary" },
  // { label: "Description", key: "description" }
];
 

const columns = [
  {
    field: '#',
    headerName: '',
    width: 85,
    filterable: false,
    renderHeader: () => (
      <strong>{''}</strong>
    ),
    renderCell: (params) => (
      <Tooltip title="" arrow>
        <img
          alt="Active"
          src="../assets/img/activity_log.png"
          style={{ cursor: "pointer", width: 30, color: "#2dce89" }}
        />
      </Tooltip>
    ),
  },
  {
    field: 'operation_type',
    headerName: 'Operation Type',
    width: 170,
    renderHeader: () => (
      <strong>{'Operation Type'}</strong>
    // ),
    // renderCell: (params) => (
    //   <Link>{params.value}</Link>
    )
  },
  
  {
    field: 'device_id',
    headerName: 'Device Id',
    width: 150,
    renderHeader: () => (
      <strong>{'Device Id'}</strong>
    )
    // renderCell: (params) => (
    //   params.value ? <Link>{params.value}</Link> : '-'
    // )
  },
  {
    field: 'gps_location',
    headerName: 'GPS Location',
    width: 200,
    renderHeader: () => (
      <strong>{'GPS Location'}</strong>
    ),
    // renderCell: (params) => (
    //   params.value ? <Link>{params.value}</Link> : '-'
    // )
  },
  {
    field: 'summary',
    headerName: 'Summary',
    width: 210,
    renderHeader: () => (
      <strong>{'Summary'}</strong>
    ),
    // renderCell: (params) => (
    //   <Link>{params.value}</Link>
    // )
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    width: 250,
    renderHeader: () => (
      <strong>{'Created At'}</strong>
    ),
    renderCell: (params) => (
      // moment(UTCDateTimeFormat(params.value)).format('MM/DD/YYYY HH:mm:ss')
      moment(params.value).format('MM/DD/YYYY, HH:mm:ss')
    )
  },
];

const operationType = ['All', 'Admin', 'User', 'Sensor']

const Activity = (props) => {
  
  const { enqueueSnackbar, error, success, loading, pageLoading } = props;


  const dispatch = useDispatch()
  const { activityLog_List } = useSelector((state) => state.user)
  const location = useLocation()
  const history = useHistory()

  const [values, setValues] = React.useState({
    filterOperationType: operationType[0],
    filterFromDate: "",
    filterToDate: "",
    id: "",
    type: ""
  })


  const [activityList, setActivityList] = React.useState([])
  const [loader, setloader] = React.useState(false)

  
  const handleChangeSelection = (event, type) => {
    if (event) {
      if (type === 'type') {
        setValues({ ...values, filterOperationType: event == 'All' ? 'All' : event });
      }
    }
  }

  const handleChangeSchedule = (event, type) => {
    if (event) {
      if (type === 'fromDate') {
        setValues({ ...values, filterFromDate: event });
      }
      else if (type === 'toDate') {
        setValues({ ...values, filterToDate: event });
      }
    }
  }

  const handleFilter = (type) => {
    if (type === 'filter') {
      dispatch(activityLogList(values, false));
    }
    else if (type === 'rest') {
      history.push({state: null})
      let reset = {...values}
      reset.filterFromDate = ""
      reset.filterToDate = ""
      setValues(reset);
      dispatch(activityLogList({}, false));
    }
    
  };


  const downloadCSV = () => {
    setActivityList([]);
    setloader(true)
    setTimeout(() => {
      setloader(false)
    }, 3000)

    activityLog_List.forEach(el => {
      const element = {
        id: el.id,
        operation_type: el.operation_type,
        createdAt: moment(el.createdAt).format('MM/DD/YYYY HH:mm:ss'),
        device: el.Device ? el.Device.display_name : el.DeviceGroup ? el.DeviceGroup.display_name : '-',
        user: el.User ? el.User.dispay_name : '-',
        summary: el.summary,
        // description: JSON.stringify(JSON.parse(el.activity_description))
      }
      setActivityList((activityList) => [
        ...activityList,
        element,
      ]);
    });
  };

  
  const currentlySelected = (GridCellParams) => {
    const action = GridCellParams.colDef.field
    const userId = GridCellParams.row.id
    const row = GridCellParams.row
    console.log(row);
    console.log(action);
    // return
    if (action == 'operation_type') {
      history.push({
        state: { filterOperationType: row.operation_type },
      });
      
    }
    else if (action == 'Device') {
      if(row.device_id){
        history.push({
          state: { id: row.device_id, type: 'device' },
        });
      }
      else if(row.device_group_id){
        history.push({
          state: { id: row.device_group_id, type: 'deviceGroup' },
        });
      }
    }
    else if (action == 'User') {
      if(row.user_id){
        history.push({
          state: { id: row.user_id, type: 'user' },
        });
      }
    }
    // else if (action == 'summary') {
    //   if(row.user_id){
    //     history.push({
    //       pathname: 'activityDetails',
    //       state: { details: row },
    //     });
    //   }
    // }
  };

  
  
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
// console.log(tz,">>>>>>>>>>>>>>>>>>>>>>");

    // console.log("location", location);
    // console.log("location.state", location.state);
    
    var restFilters = {
      "filterOperationType": "All",
      "filterFromDate": "",
      "filterToDate": "",
      "id": "",
      "type": ""
    }
    if(location.state){
      restFilters.id = location.state.id
      restFilters.type = location.state.type
      if(location.state.filterOperationType){
        restFilters.filterOperationType = location.state.filterOperationType
      }
    }
    if(values.filterFromDate !="" && values.filterToDate !=""){
      restFilters.filterFromDate = values.filterFromDate
      restFilters.filterToDate = values.filterToDate
    }
    // console.log(restFilters);
    dispatch(activityLogList(restFilters, false));
  }, [dispatch, location.state]);

  

  return (
    <>
    <SideNavBar/>
    <div className="main">
      { pageLoading ? <Loader /> : null}
      <Submenu/>
      <div id='Contborder' className='Contborder'>
        <div className='row' style={{height: '100%'}}>
          <div className='col-md-12' style={{height: '100%'}}>
            <div className='card' style={{marginBottom: 0, height: '100%'}}>
              <div className="row align-items-center mt-3 ml-4">
                {/* <Typography variant="subtitle2"><strong>Filters:</strong></Typography> */}
              </div>
              <div className="row align-items-center mt-3 ml-2 pr-4">
                <div className="col-lg-8">
                  {/* <FormControl variant="outlined">
                    <Autocomplete
                      value={values.filterOperationType}
                      onChange={(event, value) => handleChangeSelection(value, 'type')}
                      options={operationType}
                      size="small"
                      renderInput={(params) => <TextField {...params} label="Select Type" variant="outlined" />}
                      className="mr-2"
                      style={{width:150}}
                    />
                  </FormControl> */}
                
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker                      
                      label="From Date"
                      inputVariant="outlined"
                      format="MM/dd/yyyy"
                      value={values.filterFromDate ? values.filterFromDate : null}
                      size="small"
                      name="startDate"
                      onChange={(value) => handleChangeSchedule(value, 'fromDate')}
                      className="mr-2"
                      style={{width:150}}
                    />

                    <DatePicker
                      label="To Date"
                      inputVariant="outlined"
                      format="MM/dd/yyyy"
                      value={values.filterToDate ? values.filterToDate : null}
                      size="small"
                      name="endDate"
                      onChange={(value) => handleChangeSchedule(value, 'toDate')}
                      className="mr-2"
                      style={{width:150}}
                    />
                  </MuiPickersUtilsProvider>
                  <Button 
                  style={{
                    padding: "7px 22px",
                    fontSize: "0.9375rem",
                    border: "2px solid ",
                    borderRadius: "8px",
                    borderColor: "1b330a",
                    borderWidth: "2px",
                    backgroundColor: "#a9d18e",
                    color: "#1b330a",
                  }}
                  variant="contained" className="mr-2" onClick={()=>handleFilter('filter')} disabled={values.filterFromDate && values.filterToDate ? false : true}>Filter</Button>
                  <Button 
                   style={{
                    padding: "7px 22px",
                    fontSize: "0.9375rem",
                    border: "2px solid ",
                    borderRadius: "8px",
                    borderColor: "1b330a",
                    borderWidth: "2px",
                    backgroundColor: "#a9d18e",
                    color: "#1b330a",
                  }}
                  variant="contained" onClick={()=>handleFilter('rest')} disabled={location.state || (values.filterFromDate && values.filterToDate) ? false : true}>Remove Filter</Button>
                </div>
                <div className="col-lg-4">
                  {/* <CSVLink filename="lockcart_activitylog.csv" data={activityList} headers={headers} onClick={() => downloadCSV()} class="float-right" style={{ display: loader ? 'none' : 'block' }}>
                    <Button 
                    style={{
                      padding: "7px 22px",
                      fontSize: "0.9375rem",
                      border: "2px solid ",
                      borderRadius: "8px",
                      borderColor: "1b330a",
                      borderWidth: "2px",
                      backgroundColor: "#a9d18e",
                      color: "#1b330a",
                    }}
                    variant="contained">
                         Download Log
                      </Button>
                  </CSVLink> */}
                  {/* <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    style={{ display: loader ? 'block' : 'none', float:"right" }}
                  >
                    Download Log
                    &nbsp;
                        <i className="fa fa-spinner fa-spin right" />
                  </Button> */}
                </div>
              </div>
              <div className='card-body' style={{ height: 480, width: '100%' }}>
                <DataGrid onCellClick={currentlySelected} rows={activityLog_List} columns={columns}
                  pageSize={250}
                  // rowsPerPageOptions={[250, 500, 1000]}
                  loading={loading} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
};


const mapStateToProps = (state) => {
  return {
    loading: state.user.loading,
    error: state.user.error,
    success: state.user.success,
    pageLoading: state.user.pageLoading
  };
};



Activity.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired

};

export default connect(
  mapStateToProps
)(withSnackbar(Activity));