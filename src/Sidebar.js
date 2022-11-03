import React from "react";
import { BrowserRouter as Router, Switch, Route, Link, useLocation } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { Home, Group, Devices, DevicesOther, Description, ContactSupport, Settings } from '@material-ui/icons';
import { useSelector } from "react-redux";

export default function Sidebar() {

  const selectedMenu = localStorage.getItem("selectedMenu");
  const [isMenuSelected, setisMenuSelected] = React.useState(selectedMenu ? selectedMenu : 'home');
  const location = useLocation();
  const { permissionDetails } = useSelector((state) => state.auth)

  const activeMenu = (menuName) => {
    localStorage.setItem("selectedMenu", menuName);
    setisMenuSelected(menuName)
  }
  return (
    <nav
      className="sidenav navbar navbar-vertical  fixed-left  navbar-expand-xs navbar-light bg-white"
      id="sidenav-main"
    >
      <div className="scrollbar-inner">
        <div className="sidenav-header  align-items-center">
          <Link className="navbar-brand">
            <img alt='Logo' src='../assets/img/lockcartlogo.png' />
            {/* <Typography variant="h4" gutterBottom color="primary">
              PAC-BLU
            </Typography> */}
          </Link>
        </div>
        <div className="navbar-inner">
          <div className="collapse navbar-collapse" id="sidenav-collapse-main">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className={isMenuSelected == "home" ? "nav-link active" : "nav-link"} to="/" onClick={() => activeMenu('home')}>
                  <Home style={{ fontSize: 25, marginRight: 5 }} className="text-primary" />
                  <span className="nav-link-text">Home</span>
                </Link>
              </li>
              
              {permissionDetails.permission_all || permissionDetails.permission_module.users ?
                <li className="nav-item">
                  <Link className={isMenuSelected == "user" ? "nav-link active" : "nav-link"} to="/users" onClick={() => activeMenu('user')}>
                    <Group style={{ fontSize: 25, marginRight: 5 }} className="text-primary" />
                    <span className="nav-link-text">Users</span>
                  </Link>
                </li>
                : ""
              }

              {permissionDetails.permission_all || permissionDetails.permission_module.devices ?
                <li className="nav-item">
                  <Link className={isMenuSelected == "device" ? "nav-link active" : "nav-link"} to="/devices" onClick={() => activeMenu('device')}>
                    <Devices style={{ fontSize: 25, marginRight: 5 }} className="text-primary" />
                    <span className="nav-link-text">Devices</span>
                  </Link>
                </li>
                : ""
              }

              {permissionDetails.permission_all || permissionDetails.permission_module.device_group ?
                <li className="nav-item">
                  <Link className={isMenuSelected == "deviceGroup" ? "nav-link active" : "nav-link"} to="/deviceGroups" onClick={() => activeMenu('deviceGroup')}>
                    <DevicesOther style={{ fontSize: 25, marginRight: 5 }} className="text-primary" />
                    <span className="nav-link-text">Device Groups</span>
                  </Link>
                </li>
                : ""
              }

              {permissionDetails.permission_all || permissionDetails.permission_module.activity ?
                <li className="nav-item">
                  <Link className={isMenuSelected == "activity" ? "nav-link active" : "nav-link"} to="/activity" onClick={() => activeMenu('activity')}>
                    <Description style={{ fontSize: 25, marginRight: 5 }} className="text-primary" />
                    <span className="nav-link-text">Activity</span>
                  </Link>
                </li>
                : ""
              }

              {permissionDetails.permission_all || permissionDetails.permission_module.support ?
                <li className="nav-item">
                  <Link className={isMenuSelected == "support" ? "nav-link active" : "nav-link"} to="/support" onClick={() => activeMenu('support')}>
                    <ContactSupport style={{ fontSize: 25, marginRight: 5 }} className="text-primary" />
                    <span className="nav-link-text">Support</span>
                  </Link>
                </li>
                : ""
              }

              {permissionDetails.permission_all || permissionDetails.permission_module.company_settings ?
                <li className="nav-item">
                  <Link className={isMenuSelected == "companySetting" ? "nav-link active" : "nav-link"} to="/companySettings" onClick={() => activeMenu('companySetting')}>
                    <Settings style={{ fontSize: 25, marginRight: 5 }} className="text-primary" />
                    <span className="nav-link-text">Company Settings</span>
                  </Link>
                </li>
                : ""
              }

              {permissionDetails.permission_all || permissionDetails.permission_module.company ?
                <li className="nav-item">
                  <Link className={isMenuSelected == "company" ? "nav-link active" : "nav-link"} to="/company" onClick={() => activeMenu('company')}>
                    <img alt="Company" src='../assets/img/company.png' style={{ width: "25px", marginRight: "5px" }} />
                    <span className="nav-link-text">Company</span>
                  </Link>
                </li>
                : ""
              }
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
