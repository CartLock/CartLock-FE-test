import React, { useEffect, useState, useMemo } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import "react-toastify/dist/ReactToastify.css";
import { IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import { resetErrorAndSuccessState } from "../store/actions/userActions";
import {
  companyList,
  companyListSuccess,
  deleteCompany,
} from "../store/actions/companyActions";
import { withSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import Loader from "../PageLoader";
import Footer from "../footer";
import Submenu from "../header_sub_menu";
import Tooltip from "@material-ui/core/Tooltip";
import SideNavBar from "../SideNavBar"; 
import moment from "moment";

const Company = (props) => {
  console.log("Comapny")
  const { enqueueSnackbar, error, success, loading } = props;

  const dispatch = useDispatch();
  const { company_List } = useSelector((state) => state.company);
  const { permissionDetails } = useSelector((state) => state.auth);
  const history = useHistory();
  const columns = [
    {
      field: "#",
      headerName: "",
      width: 80,
      filterable: false,
      renderHeader: () => <strong>{""}</strong>,
      renderCell: (params) => (
        <Tooltip title="Click to Compnay Modify" arrow>
          <img
            alt="Company"
            src="../assets/img/companyDetails.jpg"
            style={{ cursor: "pointer", width: 30, color: "#2dce89" }}
          />
        </Tooltip>
      ),
    },
    {
      field: "company_code",
      headerName: "Company Code",
      width: 200,
      renderHeader: () => <strong>{"Company Code"}</strong>,
    },
    {
      field: "company_e_mail",
      headerName: "Email",
      width: 190,
      renderHeader: () => <strong>{"Email"}</strong>,
    },
  
    {
      field: "poc_phone_number",
      headerName: "Phone Number",
      width: 170,
      renderHeader: () => <strong>{"Phone Number"}</strong>,
    },
    {
      field: "is_deactive",
      headerName: "Active",
      width: 100,
      renderHeader: () => <strong>{"Active"}</strong>,
      renderCell: (params) => (
        <img
          alt="Active"
          src={
            params.value == "0"
              ? "../assets/img/checkGreen.png"
              : "../assets/img/unchecked.png"
          }
          style={{ width: 20 }}
        />
      ),
    },
    {
      field: "location",
      headerName: "Address",
      width: 190,
      renderHeader: () => <strong>{"Address"}</strong>,
    },
    {
      field: "createdAt",
      headerName: "Date Register",
      width: 150,
      renderHeader: () => <strong>{"Date Register"}</strong>,
      renderCell: (params) => moment(params.value).format("MM/DD/YYYY HH:mm"),
    },
    {
      field: "mailerSetting",
      headerName: " Mailer Setting",
      width: 150,
      filterable: false,
      renderHeader: () => <strong>{"Mailer Setting"}</strong>,
      renderCell: (params) => (
        <Tooltip title="Click to mailer setting Modify" arrow>
          <img
            alt="Company"
            src="../assets/img/mailer.png"
            style={{ cursor: "pointer", width: 30, color: "#2dce89" }}
          />
        </Tooltip>
      ),
    },
   
    
  ];

  useEffect(() => {
    console.log("getting all company")
    dispatch(companyList(true));
  }, [dispatch]);

  useEffect(() => {
    error && enqueueSnackbar(error, { variant: "error" });
    dispatch(resetErrorAndSuccessState());
  }, [error]);

  useEffect(() => {
    success && enqueueSnackbar(success, { variant: "success" });
    dispatch(resetErrorAndSuccessState());
  }, [success]);

  const currentlySelected = (GridCellParams) => {
    const action = GridCellParams.colDef.field;
    const id = GridCellParams.row.id;
    console.log("Global id::"+id)

    if (action == "#") {
      console.log(id)
      localStorage.setItem("tempCompanyId", id);
      history.push({
        pathname: "/modifyCompany",
      });
    }
    if (action == "mailerSetting") {
      console.log("Inside mailer setting")
      console.log("company id::"+id)
      localStorage.setItem("companySettingId", id);
      history.push({
        pathname: "/companyMailerSetting",
      });
    }
   
     else if (action == "Delete") {
      var row = GridCellParams.row;
      const id = GridCellParams.row.id;
      dispatch(deleteCompany(id, row));
      dispatch(companyListSuccess(company_List.filter((e) => e !== row)));
    }
  };

  const [pageLoading, setPageLoading] = React.useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
  }, []);

  return (
    <>
    <SideNavBar/>
    <div className="main">
      {pageLoading ? <Loader /> : null}

      <Submenu />

      <div className="Contborder">
        <div className="row">
          <div className="col-md-12">
            <div className="card" style={{ marginBottom: 0 }}>
              <div
                className="card-header border-0"
                style={{ padding: "12px 25px 0 0" }}
              >
                <div className="row align-items-center">
                  {/* <div className="col-lg-10">
                  <Link 
                  style={{
                    border: "2px solid",
                    borderColor: " #1b330a",
                    borderRadius: "8px",
                    borderWidth: "2px",
                    backgroundColor: "#a9d18e",
                    color: "#1b330a",
                  }}
                  class="btn  float-right" to="/companySettings">
                     Default Setting
                    </Link>
                  </div> */}
                  <div className="col-lg-12">
                    <Link class="btn addCompanyBtn float-right" to="/addCompany">
                      Add Company
                    </Link>
                  </div>
                </div>
              </div>
              <div className="card-body" style={{ height: 520, width: "100%" }}>
                <DataGrid
                  onCellClick={currentlySelected}
                  rows={company_List}
                  columns={columns}
                  pageSize={6}
                  loading={props.loading}
                />
              </div>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </div>
    </>  
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.company.loading,
    error: state.company.error,
    success: state.company.success,
    // pageLoading: state.company.pageLoading
  };
};

Company.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(withSnackbar(Company));
