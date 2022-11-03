import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  useHistory,
} from "react-router-dom";

import Header from "./Header";
import Footer from "./footer";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Users from "./Users/Users";
import AddUser from "./Users/AddUser";
import Devices from "./Devices/Devices";
import DeviceDetail from "./Devices/DeviceDetails";
import DeviceGroup from "./DeviceGroup/DeviceGroup";
import Company from "./Company/Company";
import AddCompany from "./Company/AddCompany";
import ModifyCompany from "./Company/ModifyCompany";
import CompanyRelatedDeives from "./Company/CompanyReletedDeviceKeys";
import AddDeviceGroup from "./DeviceGroup/AddDeviceGroup";
import ModifyDeviceGroup from "./DeviceGroup/ModifyDeviceGroup";
import CompanySettings from "./CompanySettings/CompanySettings";
import ScheduleOpen from "./CompanySettings/ScheduleOpen";
import SetFobProgramers from "./CompanySettings/SetFobProgramers";
import ChangePassword from "./CompanySettings/ChangePassword";
import Activity from "./Activity/Activity";
import Support from "./Support/Support";
import SupportTicketDetails from "./Support/SupportTicketDetails";
import SupportTicketGPSDetails from "./Support/SupportTicketGPSDetails";
import ModifyUser from "./Users/ModifyUser";
import Role from "./role/Role";
import AddRole from "./role/AddRole";
import ModifyRole from "./role/ModifyRole";
import AssignRole from "./role/AssignRole";
import { useSelector } from "react-redux";
import ActivityDetails from "./Activity/ActivityDetails";
import ModifyCompanyMailer from "./CompanyMailerSetting/ModifyCompanyMailer";
import AddDevice from "./Devices/AddDevice";
import UpdateTickets from "./Support/SupportDetailsUpdate";

export default function Master() {
  let location = useLocation();
  const history = useHistory();
  const { permissionDetails } = useSelector((state) => state.auth);

  const logout = () => {
    localStorage.clear();
    history.push("/login");
  };

  return (
    <Router>
      {/* <Sidebar /> */}
      <div className="main-content" id="panel">
        <Header logout={() => logout()} />
        {/* <Header /> */}
        <Switch>
          {/* Created By Saurav Satpathy */}

          {/* USERS */}
          {permissionDetails.permission_module.users ? (
            <Route path="/users">
              <Users />
            </Route>
          ) : (
            ""
          )}
          {permissionDetails.permission_module.users ? (
            <Route path="/adduser">
              <AddUser />
            </Route>
          ) : (
            ""
          )}
          {permissionDetails.permission_module.users ? (
            <Route path="/modifyUser">
              <ModifyUser />
            </Route>
          ) : (
            ""
          )}

          {/* DEVICE */}
          {permissionDetails.permission_module.devices ? (
            <Route path="/devices">
              <Devices />
            </Route>
          ) : (
            ""
          )}
          {permissionDetails.permission_module.devices ? (
            <Route path="/deviceDetails">
              <DeviceDetail />
            </Route>
          ) : (
            ""
          )}
          {
            <Route path="/addDevice">
              <AddDevice />
            </Route>
          }

          {/* SUPPORT TICKET */}
          {permissionDetails.permission_module.support ? (
            <Route path="/support">
              <Support />
            </Route>
          ) : (
            ""
          )}
          {permissionDetails.permission_module.support ? (
            <Route path="/supportTicketDetails">
              <SupportTicketDetails />
            </Route>
          ) : (
            ""
          )}
          {/* COMPANY */}
          {permissionDetails.permission_module.company ? (
            <Route path="/company">
              <Company />
            </Route>
          ) : (
            ""
          )}
          {permissionDetails.permission_module.company ? (
            <Route path="/addCompany">
              <AddCompany />
            </Route>
          ) : (
            ""
          )}
          {permissionDetails.permission_module.company ? (
            <Route path="/modifyCompany">
              <ModifyCompany />
            </Route>
          ) : (
            ""
          )}
          {/* ACTIVITY */}
          {permissionDetails.permission_module.activity ? (
            <Route path="/activity">
              <Activity />
            </Route>
          ) : (
            ""
          )}

{permissionDetails.permission_module.company_settings ? (
            <Route path="/companySettings">
              <CompanySettings />
            </Route>
          ) : (
            ""
          )}

          {permissionDetails.permission_module.company ? (
            <Route path="/companyMailerSetting">
              <ModifyCompanyMailer />
            </Route>
          ) : (
            ""
          )}
          
          {/* DASHBOARD */}
          <Route path="/">
            <Dashboard />
          </Route>

          {/* {permissionDetails.permission_module.support ? (
            <Route path="/supportTicketGPSDetails">
              <SupportTicketGPSDetails />
            </Route>
          ) : (
            ""
          )}

          {permissionDetails.permission_module.activity ? (
            <Route path="/activityDetails">
              <ActivityDetails />
            </Route>
          ) : (
            ""
          )}

          {permissionDetails.permission_module.company_settings ? (
            <Route path="/companySettings">
              <CompanySettings />
            </Route>
          ) : (
            ""
          )}
          {permissionDetails.permission_module.company_settings ? (
            <Route path="/setFobProgramers">
              <SetFobProgramers />
            </Route>
          ) : (
            ""
          )}
          {permissionDetails.permission_module.company_settings ? (
            <Route path="/scheduleOpen">
              <ScheduleOpen />
            </Route>
          ) : (
            ""
          )}

          {permissionDetails.permission_module.device_group ? (
            <Route path="/deviceGroups">
              <DeviceGroup />
            </Route>
          ) : (
            ""
          )}
          {permissionDetails.permission_module.device_group ? (
            <Route path="/addDeviceGroup">
              <AddDeviceGroup />
            </Route>
          ) : (
            ""
          )}
          {permissionDetails.permission_module.device_group ? (
            <Route path="/modifyDeviceGroup">
              <ModifyDeviceGroup />
            </Route>
          ) : (
            ""
          )}

          {permissionDetails.permission_module.company ? (
            <Route path="/companyRelatedDeives">
              <CompanyRelatedDeives />
            </Route>
          ) : (
            ""
          )}
          {permissionDetails.permission_module.company ? (
            <Route path="/companyMailerSetting">
              <ModifyCompanyMailer />
            </Route>
          ) : (
            ""
          )}

          {permissionDetails.permission_module.change_password ? (
            <Route path="/changePassword">
              <ChangePassword />
            </Route>
          ) : (
            ""
          )}

          {permissionDetails.permission_module.role ? (
            <Route path="/role">
              <Role />
            </Route>
          ) : (
            ""
          )}
          {permissionDetails.permission_module.role ? (
            <Route path="/addRole">
              <AddRole />
            </Route>
          ) : (
            ""
          )}
          {permissionDetails.permission_module.role ? (
            <Route path="/modifyRole">
              <ModifyRole />
            </Route>
          ) : (
            ""
          )}
          {permissionDetails.permission_module.role ? (
            <Route path="/assignRole">
              <AssignRole />
            </Route>
          ) : (
            ""
          )}

          {
            <Route path="/updateServiceTicket">
              <UpdateTickets />
            </Route>
          } */}
        </Switch>
      </div>
    </Router>
  );
}
