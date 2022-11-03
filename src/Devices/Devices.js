import React, { useEffect, useState, useMemo } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import {
  Group,
  Devices,
  DevicesOther,
  Description,
  ContactSupport,
  Settings,
  Delete,
  Create,
} from "@material-ui/icons";
import { DataGrid } from "@material-ui/data-grid";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import { ekeyList } from "../store/actions/userActions";
import { withSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import Loader from "../PageLoader";
import Footer from "../footer";
import Submenu from "../header_sub_menu";
import moment from "moment";
import Tooltip from "@material-ui/core/Tooltip";
import SideNavBar from "../SideNavBar";

const columns = [
  {
    field: "#",
    headerName: "",
    width: 85,
    filterable: false,
    renderHeader: () => <strong>{""}</strong>,
    renderCell: (params) => (
      <Tooltip title="Click to Device Details" arrow>
        <img
          alt="Active"
          src="../assets/img/user_key.jpg"
          style={{ cursor: "pointer", width: 30, color: "#2dce89" }}
        />
      </Tooltip>
    ),
  },
  {
    field: "batch_name",
    headerName: "Batch Name",
    width: 200,
    renderHeader: () => <strong>{"Batch Name"}</strong>,
  },
  {
    field: "batch_number",
    headerName: "Batch Number",
    width: 150,
    renderHeader: () => <strong>{"Batch Number"}</strong>,
  },
  {
    field: "activation_date",
    headerName: "Activation Date",
    width: 180,
    renderHeader: () => <strong>{"Activation Date"}</strong>,
  },
  {
    field: "battery_replacement_date",
    headerName: "Battery Replacement Date",
    width: 200,
    renderHeader: () => <strong>{"Battery Replacement Date"}</strong>,
    // renderCell: (params) => (
    //   params.value ? <Tooltip title="Click to Device Activities" arrow><Link to='/act1ivity'>{moment(params.value).format('MM/DD/YYYY HH:mm')}</Link></Tooltip> : '-'
    // )
  },
  {
    field: "createdAt",
    headerName: "Date Added",
    width: 170,
    renderHeader: () => <strong>{"Date Added"}</strong>,
    renderCell: (params) => moment(params.value).format("MM/DD/YYYY HH:mm"),
  },
];

const DevicesComp = (props) => {
  const { enqueueSnackbar, error, success, loading } = props;

  const dispatch = useDispatch();
  const { ekey_List } = useSelector((state) => state.user);
  const history = useHistory();

  const currentlySelected = (GridCellParams) => {
    const action = GridCellParams.colDef.field;
    const id = GridCellParams.row.id;
    console.log("Action Value::" + action);
    if (action == "#") {
      console.log("deviceId:::" + id);
      localStorage.setItem("tempDeviceId", id);
      history.push({
        pathname: "/deviceDetails",
      });
    } else if (action == "lastActivity") {
      history.push({
        pathname: "activity",
        state: { id: id, type: "device" },
      });
    }
  };

  useEffect(() => {
    dispatch(ekeyList());
  }, [dispatch]);

  const [pageLoading, setPageLoading] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      <SideNavBar />
      <div className="main">
        {pageLoading ? <Loader /> : null}
        <Submenu />
        <div id="Contborder" className="Contborder">
          <div className="row" style={{ height: "100%" }}>
            <div className="col-md-12" style={{ height: "100%" }}>
              <div className="card" style={{ marginBottom: 0, height: "100%" }}>
                <div
                  className="card-header border-0"
                  style={{ padding: "12px 25px 2 0" }}
                >
                  <div className="row align-items-center">
                    <div className="col-lg-6">
                      <h3
                        style={{
                          position: "absolute",
                          color: "#1b330a",
                        }}
                      >
                       Please select batch...
                      </h3>
                    </div>
                    <div className="col-lg-6">
                      <Link class="btn addUserBtn float-right" to="/addDevice">
                        Add Device
                      </Link>
                    </div>
                  </div>
                </div>
                <div
                  className="card-body"
                  style={{ height: 800, width: "100%", marginTop: "-30px" }}
                >
                  <DataGrid
                    onCellClick={currentlySelected}
                    rows={ekey_List}
                    columns={columns}
                    pageSize={250}
                    loading={props.loading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.user.loading,
    error: state.user.error,
    success: state.user.success,
    pageLoading: state.user.pageLoading,
  };
};

DevicesComp.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(withSnackbar(DevicesComp));
