import React, { useEffect, useState, useRef } from "react";
import { useHistory, Link } from "react-router-dom";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Card,
  CardContent,
  List,
  Box,
  Divider,
  Typography,
  FormControl,
  InputLabel,
  Select,
  RadioGroup,
  Radio,
  FormHelperText,
} from "@material-ui/core";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import {
  registerUser,
  UpdateUserDetails,
  userList,
} from "../store/actions/userActions";
import { companyListForUsers } from "../store/actions/companyActions";
import { withSnackbar } from "notistack";
import validator from "validator";
import { makeStyles } from "@material-ui/core/styles";
import Loader from "../PageLoader";
import Footer from "../footer";
import Submenu from "../header_sub_menu";
import { generateUniqueNumber } from "../helper/commonHelper";
import { Autocomplete } from "@material-ui/lab";
import InputMask from "react-input-mask";
import SideNavBar from "../SideNavBar";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { registerdevice } from "../store/actions/deviceGroupActions";
import * as XLSX from "xlsx";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  disabledColor: {
    background: "#E8E8E8",
  },
  imgSize: {
    width: "20px",
    marginRight: "10px",
    cursor: "pointer",
  },
}));
console.log("companyId::::"+localStorage.getItem("tempCompId"))
const AddUsers = (props) => {
  const { enqueueSnackbar, error, loading } = props;
  const textRef = useRef();
  const classes = useStyles();
  const { user_Details } = useSelector((state) => state.user);
  const { company_List } = useSelector((state) => state.company);
  const dispatch = useDispatch();
  const history = useHistory();
  const [pageLoading, setPageLoading] = React.useState(true);
  const [companyValue, setCompanyValue] = useState({});
  const [batchFileType, setBatchfileType] = useState("");

  const [values, setValues] = React.useState({
    activationDate: "",
    batchName: "",
    relcementdate: "",
    noOfDevice: "",
    displayName: "",
    batchNo: "",
    isSupervisor: false,
    isHouseKeeping: false,
    fileType: "",
  });
  const [excelFile, setExcelFile] = useState(null);
  const [excelFileError, setExcelFileError] = useState(null);

  // submit
  const [excelData, setExcelData] = useState(null);
  // it will contain array of objects

  // handle File
  // const fileType=['application/vnd.ms-excel']; xls type
  const fileType = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ]; //xsls type
  const handleFile = async (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      console.log(selectedFile.type);
      if (selectedFile && fileType.includes(selectedFile.type)) {
        //saurav start here
        const file = e.target.files[0];
        const data = await file.arrayBuffer();
        console.log("Sheet Name :" + data);
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        //const jsonData=XLSX.utils.sheet_to_json(worksheet);
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
        });
        setExcelData(jsonData);

        setExcelFileError(null); //setting the error mesaage
      } else {
        console.log("not a excel file");
        setExcelFileError("Please select only excel file types");
        setExcelFile(null);
      }
    } else {
      console.log("plz select your file");
    }
  };

  const [formValidation, setFormValidation] = React.useState({
    activationDate: "",
    batchName: "",
    relcementdate: "",
    noOfDevice: "",
    displayName: "",
    batchNo: "",
    fileType: "",
  });

  const handleValidation = () => {
    let isError = false;
    const formerr = { ...formValidation };
    if (!values.activationDate) {
      console.log("ActivationData Failes");
      isError = true;
      formerr.activationDate = "Required Activation Date";
      setFormValidation(formerr);
    }

    if (!values.relcementdate) {
      console.log("relcementdate Failes");
      isError = true;
      formerr.relcementdate = "Required Replacement Date";
      setFormValidation(formerr);
    }
    if (!values.batchName) {
      console.log("batchName Failes");
      isError = true;
      formerr.batchName = "Required batch name";
      setFormValidation(formerr);
    }
    if (!values.batchNo) {
      console.log("batchNo Failes");
      isError = true;
      formerr.batchNo = "Required batch no";
      setFormValidation(formerr);
    }
    // if (!values.noOfDevice) {
    //   isError = true;
    //   formerr.noOfDevice = "Required No of Device";
    //   setFormValidation(formerr);
    // }

    return isError;
  };

  const handleChangeTest = (prop) => (event) => {
    // const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    console.log(event.value);
  };

  const handleChange = (prop) => (event) => {
    console.log(event.target.value);
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setValues({ ...values, [prop]: value });
    const formerr = { ...formValidation };
    formerr[event.target.name] = null;
    setFormValidation(formerr);
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (!excelData) {
      setExcelFileError("Please select only excel file types");
      setExcelFile(null);
    }
    if (handleValidation()) return false;
    console.log(excelData);
    const deviceData = {
      batchName: values.batchName,
      activationDate: values.activationDate,
      batchNo: values.batchNo,
      noOfDevice: " ",
      relcementdate: values.relcementdate,
      ExcelFileData: JSON.stringify(excelData),
      userId: localStorage.getItem("logedUserId"),
      companyId: localStorage.getItem("companyID"),
    };
    //dispatch(registerdevice(deviceData, history));
    dispatch(registerdevice(deviceData,history));
  };

  // useEffect(() => {
  //   dispatch(companyListForUsers());
  // }, [dispatch]);

  useEffect(() => {
    error && enqueueSnackbar(error, { variant: "error" });
  }, [error]);
  const [value, setValue] = React.useState("female");
  const handleChangeCheckboxValue = (key, value) => {
    setValues({ ...values, [key]: value });
  };
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

        <div className="Contborder">
          <div className="row">
            <div className="col-md-12">
              <div className="card" style={{ marginBottom: 0 }}>
                <div className="col-lg-6"></div>
                <div className="col-lg-12  ">
                  <button
                    className="btn createDeviceBtn"
                    type="button"
                    variant="contained"
                    size="large"
                    onClick={handleSubmitClick}
                    style={{ display: props.loading ? "none" : "block" }}
                  >
                    Upload
                  </button>
                  <button
                    variant="contained"
                    color="success"
                    size="large"
                    style={{ display: props.loading ? "block" : "none" }}
                  >
                    Create Device &nbsp;
                    <i className="fa fa-spinner fa-spin right" />
                  </button>
                </div>

                <div className="card-header">
                  <form autoComplete="off">
                    <div className="row">
                      <div className="col-md-5 row">
                        <div className="col-md-5">
                          <label className="adduserlabel" fullWidth>
                            Batch Name
                          </label>
                        </div>
                        <div className="col-md-7">
                          <TextField
                            id="fname"
                            fullWidth
                            // label="Batch Name (required)"
                            name="batchName"
                            value={values.batchName}
                            onChange={handleChange("batchName")}
                            //onBlur={handleBlur}
                            error={!!formValidation.batchName}
                            helperText={formValidation.batchName}
                          />
                        </div>
                      </div>
                      <div className="col-md-1 row"></div>
                      <div className="col-md-5 row">
                        <div className="col-md-7">
                          <label className="adduserlabel" fullWidth>
                            Activation Date
                          </label>
                        </div>

                        <div className="col-md-5">
                          <TextField
                            type="date"
                            id="lname"
                            fullWidth
                            name="activationDate"
                            value={values.activationDate}
                            onChange={handleChange("activationDate")}
                            error={!!formValidation.activationDate}
                            helperText={formValidation.activationDate}
                          />
                        </div>
                      </div>
                    </div>
                    {/* Giving white Space */}
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      className="mb-4 "
                    ></Typography>
                    <div className="row">
                      <div className="col-md-5 row">
                        <div className="col-md-5">
                          <label className="adduserlabel" fullWidth>
                            Batch Numbers
                          </label>
                        </div>
                        <div className="col-md-7">
                          <TextField
                            id="batchNo"
                            fullWidth
                            // label="Batch No"
                            name="batchNo"
                            value={values.batchNo}
                            onChange={handleChange("batchNo")}
                            error={!!formValidation.batchNo}
                            helperText={formValidation.batchNo}
                          />
                        </div>
                      </div>

                      <div className="col-md-1 row"></div>
                      <div className="col-md-5 row">
                        <div className="col-md-7">
                          <label className="adduserlabel" fullWidth>
                            Battery ReplacementDate
                          </label>
                        </div>

                        <div className="col-md-5">
                          <TextField
                            type="date"
                            id="lname"
                            fullWidth
                            name="relcementdate"
                            value={values.relcementdate}
                            onChange={handleChange("relcementdate")}
                            error={!!formValidation.relcementdate}
                            helperText={formValidation.relcementdate}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-md-4"></div>
                      <div className="col-md-4"></div>
                    </div>

                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="row">
                            <div className="col">
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                className="mb-3"
                              >
                                <strong>Device Batches</strong>
                              </Typography>

                              <input
                                type="file"
                                className="form-control"
                                onChange={handleFile}
                                required
                              ></input>
                              {excelFileError && (
                                <div
                                  className="text-danger"
                                  style={{ marginTop: 5 + "px" }}
                                >
                                  {excelFileError}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-2"></div>
                      </div>
                    </div>
                  </form>
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
    loading: state.user.loading,
    error: state.user.error,
  };
};

AddUsers.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

// export default (withSnackbar(AddUsers));
export default connect(mapStateToProps)(withSnackbar(AddUsers));
