import React, { useEffect, useState, useMemo } from "react";
import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom'
import { Person } from '@material-ui/icons';
import {
  DataGrid,
  GridColDef,
  GridApi,
  GridCellValue,
  GridCellParams
} from '@material-ui/data-grid';
import { Checkbox, IconButton } from '@material-ui/core';
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import { userList, deleteUser, resetErrorAndSuccessState, updateUserList} from "../store/actions/userActions";
import { withSnackbar } from "notistack";
import { Group, Devices, DevicesOther, Description, ContactSupport, Settings, Delete, Create } from '@material-ui/icons';
// import UserDetails from "./UserDetails";
import { useHistory } from "react-router-dom";
import Loader from "../PageLoader"
import Footer from "../footer"
import Submenu from "../header_sub_menu"
import moment from 'moment';
import Tooltip from '@material-ui/core/Tooltip';
import SideNavBar from "../SideNavBar";

const UsersList = (props) => {
  const { enqueueSnackbar, error, success, loading, pageLoading } = props;
  const dispatch = useDispatch()
  const { user_List } = useSelector((state) => state.user)
  const { permissionDetails } = useSelector((state) => state.auth)
  const history = useHistory()
console.log(user_List)
  const columns = [
    {
      field: '#',
      headerName: '',
      width: 80,
      filterable: false,
      renderHeader: () => (
        <strong>{''}</strong>
      ),
      renderCell: (params) => (
        <Tooltip title="Click to User Details" arrow><Person className="text-success" style={{ fontSize: 45, cursor: "pointer" }}/></Tooltip>
      )
    },
    {
      field: 'dispay_name',
      headerName: 'Display Name',
      width: 200,
      renderHeader: () => (
        <strong >{'Display Name'}</strong>
      )
    },
    {
      field: 'e_mail',
      headerName: 'Email',
      width: 260,
      renderHeader: () => (
        <strong>{'Email'}</strong>
      ),
      renderCell: (params) => (
        <a href={`mailto:${params.value}`} target="_blank">{params.value}</a>
      )
    },
    {
      field: 'phone_number',
      headerName: 'Phone',
      width: 150,
      renderHeader: () => (
        <strong>{'Phone'}</strong>
      ),
      // renderCell: (params) => (
      //   params.value.substring(0, 3) + "-" + params.value.substring(3, 6) + "-" + params.value.substring(6, params.value.length)
      // )
    }
    /*{
      field: 'is_installer',
      headerName: 'Installer',
      width: 120,
      type: 'boolean',
      renderHeader: () => (
        <strong>{'Installer'}</strong>
      ),
      renderCell: (params) => (
        <img alt='Installer' src={params.value ? '../assets/img/checked.png' : '../assets/img/unchecked.png'} style={{ width: 20 }} />
      )
    },
    {
      field: 'is_sentinel',
      headerName: 'Sentinel',
      width: 120,
      renderHeader: () => (
        <strong>{'Sentinel'}</strong>
      ),
      renderCell: (params) => (
        <img alt='Sentinel' src={params.value ? '../assets/img/checked.png' : '../assets/img/unchecked.png'} style={{ width: 20 }} />
      )
    }*/,
    {
      field: 'is_inactive',
      headerName: 'Active',
      width: 100,
     
      renderHeader: () => (
        <strong>{'Active'}</strong>
      ),
      renderCell: (params) => (
        <img alt='Active' src={!params.value ? '../assets/img/checkGreen.png' : '../assets/img/unchecked.png'} style={{ width: 30,height:30 }} />
      )
    },
    /*{
      field: 'is_fob',
      headerName: 'Fob',
      width: 100,
      renderHeader: () => (
        <strong>{'Fob'}</strong>
      ),
      renderCell: (params) => (
        <img alt='Fob' src={params.value ? '../assets/img/checked.png' : '../assets/img/unchecked.png'} style={{ width: 20 }} />
      )
    },*/
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 260,
      renderHeader: () => (
        <strong>{'Created At'}</strong>
      ),
      renderCell: (params) => moment(params.value).format("MM/DD/YYYY HH:mm"),
    },
    /*{
      ...(permissionDetails.permission_all || permissionDetails.permission_modifly ? {
        field: 'Edit',
        headerName: 'Edit',
        width: 80,
        renderHeader: () => (
          <strong>{'Edit'}</strong>
        ),
        renderCell: (params) => (
          <IconButton >
            <Create className="text-primary" />
          </IconButton>
        )
      } : ""),
    }, 
    {
      ...(permissionDetails.permission_all || permissionDetails.permission_delete ? {
        field: 'Delete',
        headerName: 'Delete',
        width: 95,
        renderHeader: () => (
          <strong>{'Delete'}</strong>
        ),
        renderCell: (params) => (
          <IconButton >
            <Delete color="secondary" />
          </IconButton>
        )
      } : ""),
    }*/
  ];


  const currentlySelected = (GridCellParams) => {
    const action = GridCellParams.colDef.field
    const userId = GridCellParams.row.id
    // console.log(GridCellParams.row);
    // console.log(action);
    if (action == '#') {
      localStorage.setItem("tempId", userId);
      history.push({
        pathname: "/modifyUser",
        isLoaderRequired: true
      });
    }
    else if (action == 'Delete') {
      var row = GridCellParams.row
      dispatch(deleteUser(userId, row))
      dispatch(updateUserList(user_List.filter((e) => (e !== row))))
    }
    else if (action == 'lastActivity') {
      var row = GridCellParams.row
      if(row.lastActivity){
        // location.search("id=82&type=user")
        history.push({
          pathname: 'activity',
          state: { id: userId, type: 'user' },
        });
        // history.push('activity?id=1&type=user');
      }
    }
  };


  useEffect(() => {
    dispatch(userList())
  }, [dispatch]);


  useEffect(() => {
    error && enqueueSnackbar(error, { variant: "error" });
  }, [error]);


  useEffect(() => {
    success && enqueueSnackbar(success, { variant: "success" });
    dispatch(resetErrorAndSuccessState())
  }, [success]);
  
  return (
    <>
   <SideNavBar/>
     
    <div className="main">
      { pageLoading ? <Loader /> : null}
      <Submenu/>
      <div id="Contborder" className='Contborder'>
        <div className='row' style={{height:'100%'}}>
          <div className='col-md-12' style={{height:'100%'}}>
            <div className='card' style={{marginBottom: 0, height:'100%'}}>
              <div className='card-header border-0' style={{padding: "12px 25px 0 0"}}>
                <div className='row align-items-center'>
                  <div className='col-lg-6'>
                  </div>
                  <div className='col-lg-6'>
                    {permissionDetails.permission_all || permissionDetails.permission_add ? 
                      <Link class='btn  float-right addUserBtn' to='/adduser'>Add User</Link>
                      : ""
                    }
                  </div>
                </div>
              </div>


              <div className='card-body' style={{ height: 520, width: '100%' }}>
                <DataGrid onCellClick={currentlySelected} rows={user_List} columns={columns} pageSize={250} loading={props.loading} />
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
    loading: state.user.loading,
    error: state.user.error,
    success: state.user.success,
    pageLoading: state.user.pageLoading
  };
};



UsersList.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired

};

export default connect(
  mapStateToProps
)(withSnackbar(UsersList));