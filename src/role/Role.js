import React, { useEffect, useState, useMemo } from "react";
import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom'
import { DataGrid } from '@material-ui/data-grid';
import { IconButton } from '@material-ui/core';
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import { roleList, deleteRole, listSuccess, permissionDetails, resetErrorAndSuccessState } from "../store/actions/roleActions";
import { withSnackbar } from "notistack";
import { Delete, Create, RemoveRedEye } from '@material-ui/icons';
import { useHistory } from "react-router-dom";
import Loader from "../PageLoader"
import Footer from "../footer"


const Role = (props) => {
  const { enqueueSnackbar, error, success, loading, pageLoading } = props;

  const dispatch = useDispatch()
  const { role_List } = useSelector((state) => state.role)
  const { permissionDetails } = useSelector((state) => state.auth)
  const history = useHistory()

  const columns = [
    {
      field: 'role_title',
      headerName: 'Role',
      width: 220,
      renderHeader: () => (
        <strong>{'Role'}</strong>
      )
    },
    {
      field: 'permission_add',
      headerName: 'Create Permission',
      width: 180,
      type: 'boolean',
      renderHeader: () => (
        <strong>{'Create Permission'}</strong>
      ),
      renderCell: (params) => (
        <img alt='Create Permission' src={params.value ? '../assets/img/checked.png' : '../assets/img/unchecked.png'} style={{ width: 20 }} />
      )
    },
    {
      field: 'permission_modifly',
      headerName: 'Modify Permission',
      width: 180,
      renderHeader: () => (
        <strong>{'Modify Permission'}</strong>
      ),
      renderCell: (params) => (
        <img alt='Modify Permission' src={params.value ? '../assets/img/checked.png' : '../assets/img/unchecked.png'} style={{ width: 20 }} />
      )
    },
    {
      field: 'permission_delete',
      headerName: 'Delete Permission',
      width: 180,
      renderHeader: () => (
        <strong>{'Delete Permission'}</strong>
      ),
      renderCell: (params) => (
        <img alt='Delete Permission' src={params.value ? '../assets/img/checked.png' : '../assets/img/unchecked.png'} style={{ width: 20 }} />
      )
    },
    {
      field: 'permission_view',
      headerName: 'View Permission',
      width: 180,
      renderHeader: () => (
        <strong>{'View Permission'}</strong>
      ),
      renderCell: (params) => (
        <img alt='View Permission' src={params.value ? '../assets/img/checked.png' : '../assets/img/unchecked.png'} style={{ width: 20 }} />
      )
    },
    /*{
      ...(permissionDetails.permission_all || permissionDetails.permission_view ? {
        field: 'View',
        headerName: 'View',
        width: 85,
        renderHeader: () => (
          <strong>{'View'}</strong>
        ),
        renderCell: (params) => (
          <IconButton ><RemoveRedEye className="text-primary" /></IconButton>
        )
      } : ""),
    },*/
    {
      ...(permissionDetails.permission_all || permissionDetails.permission_modifly ? {
        field: 'Edit',
        headerName: 'Edit',
        width: 80,
        renderHeader: () => (
          <strong>{'Edit'}</strong>
        ),
        renderCell: (params) => (
          <IconButton ><Create className="text-primary" /></IconButton>
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
    }
  ];


  const currentlySelected = (GridCellParams) => {
    const action = GridCellParams.colDef.field
    const id = GridCellParams.row.id
    // console.log(GridCellParams.row);

    if (action == 'Edit') {
      localStorage.setItem("tempRoleId", id);
      history.push({
        pathname: "/modifyRole"
      });
    }
    else if (action == 'Delete') {
      var row = GridCellParams.row
      dispatch(deleteRole(id, row))
      dispatch(listSuccess(role_List.filter((e) => (e !== row))))
    }
  };


  useEffect(() => {
    dispatch(roleList(true))
  }, [dispatch]);


  useEffect(() => {
    error && enqueueSnackbar(error, { variant: "error" });
  }, [error]);


  useEffect(() => {
    success && enqueueSnackbar(success, { variant: "success" });
    dispatch(resetErrorAndSuccessState())
  }, [success]);

  return (
    <div>
      { pageLoading ? <Loader /> : null}

      <div className='header bg-primary pb-6'>
        <div className='container-fluid'>
          <div className='header-body'>
            <div className='row align-items-center py-4'>
              <div className='col-lg-6 col-7'>
                <h6 className='h2 text-white d-inline-block mb-0'>Roles</h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container-fluid mt--6'>
        <div className='row'>
          <div className='col-md-12'>
            <div className='card'>
              <div className='card-header border-0'>
                <div className='row align-items-center'>
                  <div className='col-lg-6'>
                  </div>
                  <div className='col-lg-6'>
                    {permissionDetails.permission_all || permissionDetails.permission_add ? 
                      <Link class='btn btn-primary float-right' to='/addRole'>Add Role</Link>
                      : ""
                    }
                    {permissionDetails.permission_all || permissionDetails.permission_add ? 
                      <Link class='btn btn-primary float-right mr-2' to='/assignRole'>Assign Role</Link>
                      : ""
                    }
                  </div>
                </div>
              </div>
              <div className='card-body' style={{ height: 480, width: '100%' }}>
                <DataGrid onCellClick={currentlySelected} rows={role_List} columns={columns} pageSize={6} loading={props.loading} />
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
    success: state.role.success,
    pageLoading: state.role.pageLoading
  };
};



Role.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired

};

export default connect(
  mapStateToProps
)(withSnackbar(Role));