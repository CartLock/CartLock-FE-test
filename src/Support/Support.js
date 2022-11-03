import React, { useEffect, useState, useMemo } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import { getAllGeneratedTickets } from "../store/actions/deviceGroupActions";
import { withSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
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

import Loader from "../PageLoader";
import Footer from "../footer";
import Submenu from "../header_sub_menu";
import moment from "moment";
import Tooltip from "@material-ui/core/Tooltip";
import SideNavBar from '../SideNavBar';

const columns = [
  {
    field: "#",
    headerName: "",
    width: 80,
    filterable: false,
    renderHeader: () => <strong>{""}</strong>,
    renderCell: (params) => (
      <Tooltip title="Click to Ticket Details" arrow>
        <img
          alt="Ticket"
          src="../assets/img/ticket.png"
          style={{ cursor: "pointer", width: 30 }}
        />
      </Tooltip>
    ),
  },
  // {
  //   field: "sequence",
  //   headerName: "S.No",
  //   width: 90,
  //   renderHeader: () => <strong>{"S.No"}</strong>,
  // },
  {
    field: "ticket_id",
    headerName: "Ticket Id",
    width: 150,
    renderHeader: () => <strong>{"Ticket Id"}</strong>,
  },
  {
    field: "problem_description",
    headerName: "Ticket Details",
    width: 350,
    renderHeader: () => <strong>{"Ticket Details"}</strong>,
  },
  // {
  //   field: "phone",
  //   headerName: "Phone",
  //   width: 200,
  //   renderHeader: () => <strong>{"Phone"}</strong>,
  //   renderCell: (params) =>
  //     params.value.substring(0, 3) +
  //     "-" +
  //     params.value.substring(3, 6) +
  //     "-" +
  //     params.value.substring(6, params.value.length),
  // },
  // {
  //   field: "email",
  //   headerName: "Email",
  //   width: 220,
  //   renderHeader: () => <strong>{"Email"}</strong>,
  //   renderCell: (params) => (
  //     <a href={`mailto:${params.value}`} target="_blank">
  //       {params.value}
  //     </a>
  //   ),
  // },
  {
    field: "created",
    headerName: "Created Date",
    width: 200,
    renderHeader: () => <strong>{"Created Date"}</strong>,
    renderCell: (params) => moment(params.value).format("MM/DD/YYYY HH:mm"),
  },
  {
    field: 'status',
    headerName: 'Active',
    width: 150,
    renderHeader: () => (
      <strong>{'Active'}</strong>
    ),
    renderCell: (params) => (
      <img alt='Active' src={params.value == '1' ? '../assets/img/checkGreen.png' : '../assets/img/unchecked.png'} style={{ width: 20 }} />
    )
  }
];

const Support = (props) => {
  const { enqueueSnackbar, error, success, loading, pageLoading } = props;

  const dispatch = useDispatch();
  const { generated_Tickets } = useSelector((state) => state.deviceGroup);
  const history = useHistory();

  useEffect(() => {
    dispatch(getAllGeneratedTickets(true));
  }, [dispatch]);

  const currentlySelected = (GridCellParams) => {
    const action = GridCellParams.colDef.field;
    const id = GridCellParams.row.id;
    if (action == "#") {
      localStorage.setItem("tempSupportId", id);
      history.push({
      pathname: "/supportTicketDetails",
        //pathname: "/updateServiceTicket",
      });
    }
  };

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
                <div className="row align-items-center">
                  <div className="col-lg-6"></div>
                  <div className="col-lg-4"></div>
                  <div className="col-lg-2">
                    <Link class="btn supportRefresh"  onClick={() => window.location.reload()}>
                      Refresh
                    </Link>
                  </div>
                </div>
                <div
                  className="card-body"
                  style={{ height: 520, width: "100%" }}
                >
                  <DataGrid
                    onCellClick={currentlySelected}
                    rows={generated_Tickets}
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
    loading: state.deviceGroup.loading,
    error: state.deviceGroup.error,
    success: state.deviceGroup.success,
    pageLoading: state.deviceGroup.pageLoading,
  };
};

Support.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(withSnackbar(Support));
