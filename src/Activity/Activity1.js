import React, { useEffect, useState, useMemo } from "react";
import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom'
import { Button } from "@material-ui/core";
import { DataGrid, useGridSorting } from '@material-ui/data-grid';
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { connect, useSelector, useDispatch } from "react-redux";
import { activityLogList, getDeviceDetails } from "../store/actions/userActions";
import { withSnackbar } from "notistack";
import { useHistory, useLocation } from "react-router-dom";
import Loader from "../PageLoader"
import Footer from "../footer"
import Submenu from "../header_sub_menu"
import moment from 'moment';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { CSVLink } from "react-csv";
import { Group, Devices, DevicesOther, Description, ContactSupport, Settings } from '@material-ui/icons';
import InfiniteScroll from "react-infinite-scroll-component";


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import Icon from '@material-ui/core/Icon'

import Axios from "../helper/axios";

// for csv header
const headers = [
  { label: "ID", key: "id" },
  { label: "Type", key: "operation_type" },
  { label: "Timestamp", key: "createdAt" },
  { label: "Device / Device Group", key: "device" },
  { label: "User", key: "user" },
  { label: "Summary", key: "summary" },
  // { label: "Description", key: "description" }
];


/*const columns = [
  {
    field: 'operation_type',
    headerName: 'Type',
    width: 200,
    renderHeader: () => (
      <strong>{'Type'}</strong>
    ),
    renderCell: (params) => (
      <Link>{params.value}</Link>
    )
  },
  {
    field: 'createdAt',
    headerName: 'Timestamp',
    width: 250,
    renderHeader: () => (
      <strong>{'Timestamp'}</strong>
    ),
    renderCell: (params) => (
      moment(params.value).format('MM/DD/YYYY HH:mm:ss')
    )
  },
  {
    field: 'Device',
    headerName: 'Device/Device Group',
    width: 270,
    renderHeader: () => (
      <strong>{'Device/Device Group'}</strong>
    ),
    renderCell: (rows) => (
      rows.row.Device ? <Link>{rows.row.Device.display_name}</Link> : rows.row.DeviceGroup ? <Link>{rows.row.DeviceGroup.display_name}</Link> : '-'
    )
  },
  {
    field: 'User',
    headerName: 'User',
    width: 200,
    renderHeader: () => (
      <strong>{'User'}</strong>
    ),
    renderCell: (params) => (
      params.value ? <Link>{params.value.dispay_name}</Link> : '-'
    )
  },
  {
    field: 'summary',
    headerName: 'Summary',
    width: 210,
    renderHeader: () => (
      <strong>{'Summary'}</strong>
    ),
    renderCell: (params) => (
      <Link>{params.value}</Link>
    )
  }
];*/

// const operationType = ['All', 'Admin', 'User', 'Sensor']

const rowPerPage = ['250', '500', '1000']


const useStyles = makeStyles((theme) => ({
  iconStyle: {
    fontSize: "18px", 
    color: "#757575", 
    marginLeft: 3
  },
  headerPointer:{
    cursor: "pointer",
    // borderRight: "1px dotted #E0E0E0",
    paddingTop: 10,
    // width: "210px"
    // textAlign:"center"
  },
  cellWidth:{
    // border: "1px dotted rgb(153, 153, 153)",
    // width: "200px"
  }
}));

const Activity = (props) => {
  const classes = useStyles();
  const [headTitle, setHeadTitle] = React.useState("")
  const [sort, setSort] = React.useState("")
  const [icon, setIcon] = React.useState("")
  const [limit, setLimit] = React.useState("250")
  const [totalAct, setTotalAct] = React.useState(0)
  const [isScroll, setIsScroll] = React.useState(true)
  const [schedule, setSchedule] = React.useState({
    fromDate:"",
    toDate: ""
  })

  const [isFullData, setIsFullData] = React.useState(false)
  const [pageLoading, setPageLoading] = React.useState(true)


  const [stat, setStat] = React.useState({
    items: [],
    hasMore: true
  })
  

  const { enqueueSnackbar, error, success, loading } = props;

  const location = useLocation();
  // const dispatch = useDispatch()
  const history = useHistory()
  // const { activityLog_List } = useSelector((state) => state.user)
  // const { totalActivities } = useSelector((state) => state.user)

  const [values, setValues] = React.useState({
    filterOperationType: "All",
    filterFromDate: "",
    filterToDate: "",
    id: ((location.state && location.state.id != undefined) ? location.state.id : ""),
    type: ((location.state && location.state.type != undefined) ? location.state.type : ""),
    page: 0,
    limit: 250,
    sort: null
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
        setSchedule({ ...schedule, fromDate: event })
      }
      else if (type === 'toDate') {
        setSchedule({ ...schedule, toDate: event })
      }
    }
  }

  // filter from and to date wise and reset filter
  const handleFilter = (type) => {
    setIsScroll(false)
    const newStat = {...stat}
    newStat["hasMore"] = true
    newStat["items"] = []

    var restFilters = { ...values }
    
    if (type === 'filter' && !schedule.fromDate && !schedule.toDate) {
      enqueueSnackbar("Please select from and to date", { variant: "error" });
      return
    }
    else if (type === 'filter' && schedule.fromDate && schedule.toDate) {
      restFilters["filterFromDate"] = schedule.fromDate
      restFilters["filterToDate"] = schedule.toDate
      restFilters["page"] = 0
      setValues(restFilters)  
      setStat(newStat)
    }
    else if (type === 'rest') {
      restFilters["filterOperationType"] = "All"
      restFilters["filterFromDate"] = ""
      restFilters["filterToDate"] = ""
      restFilters["id"] = ""
      restFilters["type"] = ""
      restFilters["page"] = 0
      restFilters["limit"] = 250
      setValues(restFilters)
      setSchedule({fromDate: "", toDate: "" })
      setStat(newStat)
      setLimit("250")
      setIsFullData(false)
    }
  }

  // download csv
  const downloadCSV = () => {
    setActivityList([]);
    setloader(true)
    setTimeout(() => {
      setloader(false)
    }, 3000)

    stat.items.forEach(el => {
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
    const row = GridCellParams.row
    const deviceId = row.device_id
    const deviceGroupId = row.device_group_id
    console.log(GridCellParams.row);
    console.log(action);


    if (action == 'operation_type') {
      // values.filterOperationType = row.operation_type
      // dispatch(activityLogList(values, true));  
      history.push({
        pathname: 'activity',
        state: { operation_type: row.operation_type },
      });
    }
    else if (action == 'User') {
      history.push({
        pathname: 'activity',
        state: { id: row.user_id, type: 'user' },
      });
    }
    else if (action == 'Device') {
      if (deviceGroupId) {
        history.push({
          pathname: 'activity',
          state: { id: deviceGroupId, type: 'deviceGroup' },
        });
      }
      else {
        history.push({
          pathname: 'activity',
          state: { id: deviceId, type: 'device' },
        });
      }
      window.location.reload();
    }
    else if (action == 'summary') {
      history.push({
        pathname: 'activityDetails',
        state: { activityDetails: row },
      });
    }
  };


  // get data on scroll down
  const fetchMoreData = () => {
    if (stat.items.length >= totalAct) {
      setStat({ ...stat, hasMore: false });
      return;
    }
    
    setValues({...values, page: values.page + 1})
  };


  // sorting on column
  const sorting = (type) => {
    setHeadTitle(type)
    if(sort == 'asc'){
      setSort('desc')
      setIcon(<ArrowUpwardIcon className={classes.iconStyle}/>)
      if(type== 'Type'){
        stat.items.sort((a, b) => a.operation_type < b.operation_type ? -1 : 1);  
      }
      else if(type== 'User'){
        stat.items.sort((a, b) => a.User.dispay_name < b.User.dispay_name ? -1 : 1);
      }
      else if(type== 'Summary'){
        stat.items.sort((a, b) => a.summary < b.summary ? -1 : 1);  
      }
      else if(type== 'Timestamp'){
        stat.items.sort((a, b) => a.createdAt < b.createdAt ? -1 : 1);  
      }
      else if(type== 'Device/Device Group'){
        stat.items.sort((a, b) => a.Device && b.Device ? (a.Device.display_name < b.Device.display_name ? -1 : 1) : (a.DeviceGroup && b.DeviceGroup ? (a.DeviceGroup.display_name < b.DeviceGroup.display_name ? -1 : 1) : 1));  
      }
    }
    else{
      setSort('asc')
      setIcon(<ArrowDownwardIcon className={classes.iconStyle}/>)
      if(type== 'Type'){
        stat.items.sort((a, b) => a.operation_type < b.operation_type ? 1 : -1);  
      }
      else if(type== 'User'){
        stat.items.sort((a, b) => a.User.dispay_name < b.User.dispay_name ? 1 : -1);
      }
      else if(type== 'Summary'){
        stat.items.sort((a, b) => a.summary < b.summary ? 1 : -1);  
      }
      else if(type== 'Timestamp'){
        stat.items.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);  
      }
      else if(type== 'Device/Device Group'){
        stat.items.sort((a, b) => a.Device && b.Device ? (a.Device.display_name < b.Device.display_name ? 1 : -1) : (a.DeviceGroup && b.DeviceGroup ? (a.DeviceGroup.display_name < b.DeviceGroup.display_name ? 1 : -1) : -1));  
      }
    }
  }

  

  useEffect(() => {
    getData(values)
  }, [values]);


  // change page item or limit
  const handleChangeRowPerPage = (value) => {
    setIsScroll(false)
    setLimit(value);
    
    const newStat = {...stat}
    newStat["hasMore"] = true
    newStat["items"] = []
    setStat(newStat)

    const newValues = {...values}
    newValues["page"] = 0
    newValues["limit"] = parseInt(value)
    setValues(newValues)
  }

  // get data from api
  const getData = (condValues) => {
    const authCode = { 
      headers: { 'Authorization': localStorage.getItem("token") } 
    }
    Axios.post("/user/activityLogs", condValues, authCode)
      .then((response) => {
        if (response.status === 200) {
          setStat({ ...stat, items: stat.items.concat(response.data.payload.rows) });
          setTotalAct(response.data.payload.count)
          setIsScroll(true)
          setSort("")
          setHeadTitle("")
          setIcon("")
          setIsFullData(false)
          if (response.data.payload.rows.length == response.data.payload.count) {
            setIsFullData(true)
          }
        } else {
          console.log(response.data.message);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          console.log(err.response.data.message);
        }
      });
  }
  
  // filter on columns
  const columWiseFilter = (value, type) => {
    setIsScroll(false)
    const newStat = {...stat}
    newStat["hasMore"] = true
    newStat["items"] = []
    setStat(newStat)

    const newValues = {...values}
    newValues["page"] = 0
    if(type == 'type'){
      newValues["filterOperationType"] = value
    }
    else if(type == 'user'){
      newValues["id"] = value
      newValues["type"] = 'user'
    }
    else if(type == 'device'){
      newValues["id"] = value
      newValues["type"] = 'device'
    }
    else if(type == 'deviceGroup'){
      newValues["id"] = value
      newValues["type"] = 'deviceGroup'
    }
    
    setValues(newValues)
  }


  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 1000);
  }, []);
  
  return (
    <div>
      { pageLoading ? <Loader /> : null}

      <Submenu />

      <div className='Contborder'>
        <div className='row'>
          <div className='col-md-12'>
            <div className='card' style={{ minHeight:575, marginBottom: 0 }}>
              <div className="row align-items-center mt-3 ml-4">
                <Typography variant="subtitle2"><strong>Filters:</strong></Typography>
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
                      format="yyyy-MM-dd"
                      value={schedule.fromDate ? schedule.fromDate : null}
                      size="small"
                      name="startDate"
                      onChange={(value) => handleChangeSchedule(value, 'fromDate')}
                      className="mr-2"
                      style={{ width: 150 }}
                    />

                    <DatePicker
                      label="To Date"
                      inputVariant="outlined"
                      format="yyyy-MM-dd"
                      value={schedule.toDate ? schedule.toDate : null}
                      size="small"
                      name="endDate"
                      onChange={(value) => handleChangeSchedule(value, 'toDate')}
                      className="mr-2"
                      style={{ width: 150 }}
                    />
                  </MuiPickersUtilsProvider>
                  <Button color="primary" variant="contained" className="mr-2" onClick={() => handleFilter('filter')}>Filter</Button>
                  <Button color="primary" variant="contained" onClick={() => handleFilter('rest')}>Filter Reset</Button>
                </div>
                <div className="col-lg-4">
                  <CSVLink filename="activity_log_report.csv" data={activityList} headers={headers} onClick={() => downloadCSV()} class="float-right" style={{ display: loader ? 'none' : 'block' }}>
                    <Button color="primary" variant="contained">
                      Download Report
                      </Button>
                  </CSVLink>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    style={{ display: loader ? 'block' : 'none', float: "right" }}
                  >
                    Download Report
                    &nbsp;
                        <i className="fa fa-spinner fa-spin right" />
                  </Button>

                  <FormControl variant="outlined" className="mr-2 float-right">
                  <Autocomplete
                    value={limit}
                    onChange={(event, value) => handleChangeRowPerPage(value)}
                    options={rowPerPage}
                    size="small"
                    renderInput={(params) => <TextField {...params} label="Row per page" variant="outlined" />}
                    // className="mr-2"
                    style={{width:120}}
                  />
                </FormControl>
                </div>
              </div>
              {/* <div className='card-body' style={{ height: 480, width: '100%' }}>
                <DataGrid onCellClick={currentlySelected} rows={activityLog_List} columns={columns}
                  pageSize={25}
                  rowsPerPageOptions={[25, 50, 100]}
                  loading={loading} />
              </div> */}


              <div className='col-md-12 mt-3'>
                {/* <Table style={{ border: 1, borderColor: "#E0E0E0", borderStyle: 'solid', width: "99%", marginLeft: "8px", minWidth: 700 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{width: 117, textAlign:"center"}} className={classes.headerPointer} onClick={()=>sorting("Type")}><strong>Type</strong>{headTitle=="Type" ? icon : null}</TableCell>
                      <TableCell style={{width: 200}} className={classes.headerPointer} onClick={()=>sorting("Timestamp")}><strong>Timestamp</strong>{headTitle=="Timestamp" ? icon : null}</TableCell>
                      <TableCell style={{width: 200}} className={classes.headerPointer} onClick={()=>sorting("Device/Device Group")}><strong>Device/Device Group</strong>{headTitle=="Device/Device Group" ? icon : null}</TableCell>
                      <TableCell style={{width: 200}} className={classes.headerPointer} onClick={()=>sorting("User")}><strong>User</strong>{headTitle=="User" ? icon : null}</TableCell>
                      <TableCell style={{width: 200}} className={classes.headerPointer} onClick={()=>sorting("Summary")}><strong>Summary</strong>{headTitle=="Summary" ? icon : null}</TableCell>
                    </TableRow>
                  </TableHead>
                </Table> */}
                {console.log(stat.items)}
                <InfiniteScroll
                  dataLength={stat.items.length}
                  next={isScroll ? fetchMoreData : null}
                  hasMore={stat.hasMore}
                  loader={!isFullData ? <h4 style={{ textAlign: "center" }}>Loading...</h4> : ""}
                  // loader={<h4 style={{ textAlign: "center" }}>Loading...</h4>}
                  height={430}
                  scrollThreshold="200px"
                  useWindow={true}
                  style={{ width: "99%", marginLeft: "8px", minWidth: 700 }}
                  endMessage={
                    <p style={{ textAlign: "center" }}>
                      <b>Yay! You have seen it all</b>
                    </p>
                  }
                >
                  <div>
                    
                    <Table style={{ border: 1, borderColor: "#E0E0E0", borderStyle: 'solid' }}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.headerPointer} onClick={()=>sorting("Type")}><strong>Type</strong>{headTitle=="Type" ? icon : null}</TableCell>
                          <TableCell className={classes.headerPointer} onClick={()=>sorting("Timestamp")}><strong>Timestamp</strong>{headTitle=="Timestamp" ? icon : null}</TableCell>
                          <TableCell className={classes.headerPointer} onClick={()=>sorting("Device/Device Group")}><strong>Device/Device Group</strong>{headTitle=="Device/Device Group" ? icon : null}</TableCell>
                          <TableCell className={classes.headerPointer} onClick={()=>sorting("User")}><strong>User</strong>{headTitle=="User" ? icon : null}</TableCell>
                          <TableCell className={classes.headerPointer} onClick={()=>sorting("Summary")}><strong>Summary</strong>{headTitle=="Summary" ? icon : null}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {stat.items.map((e, i) => {
                          return (
                            <TableRow key={e}>
                              <TableCell style={{width: 170}}><Link onClick={() => columWiseFilter(e.operation_type, 'type')}>{e.operation_type}</Link></TableCell>
                              <TableCell style={{width: 290}}>{moment(e.createdAt).format('MM/DD/YYYY HH:mm:ss')}</TableCell>
                              <TableCell style={{width: 290}}>{e.Device ? <Link onClick={() => columWiseFilter(e.Device.id, 'device')}>{e.Device.display_name}</Link> : e.DeviceGroup ? <Link onClick={() => columWiseFilter(e.DeviceGroup.id, 'deviceGroup')}>{e.DeviceGroup.display_name}</Link> : '-'}</TableCell>
                              <TableCell style={{width: 290}}>{e.User ? <Link onClick={() => columWiseFilter(e.User.id, 'user')}>{e.User.dispay_name}</Link> : '-'}</TableCell>
                              <TableCell>{e.summary}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </InfiniteScroll>
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