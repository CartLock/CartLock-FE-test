import React from 'react';
import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom'
import { Description, ContactSupport, Settings } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';

const Submenu = () => {
  return (
    <div className='header headerSunmenu'>
      <div className='container-fluid'>
        <div className='header-body'>
          <ul className="headerIcons">
            <li>
              <Tooltip title="Home" arrow>
                <Link to="/"><img alt='Home' src='../assets/img/home_white.svg' style={{width:"33px", height: "40px"}} /></Link>
              </Tooltip>
            </li>
            {/* <li>
            <Tooltip title="Change Password" arrow>
            <Link to="/changePassword">
              <img alt="Change Password" src='../assets/img/forgot_password.jpg' style={{ width: "33px", height: "40px" }} />   
             </Link>
            </Tooltip>
            </li> */}
                      
                    
            {/** 
            <li>
              <Tooltip title="Users" arrow>
                <Link to="/users"><img alt='Users' src='../assets/img/users_white.svg' style={{width:"40px", height: "40px"}} /></Link>
              </Tooltip>
            </li>
            <li>
              <Tooltip title="Devices" arrow>
                <Link to="/devices"><img alt='Devices' src='../assets/img/lock_white.svg' style={{width:"30px", paddingTop: "4px", height: "40px", paddingBottom: "4px"}} /></Link>
              </Tooltip>
            </li>
            <li>
              <Tooltip title="Device Groups" arrow>
                <Link to="/deviceGroups"><img alt='Device Groups' src='../assets/img/lock_multi_white.svg' style={{width:"36px", paddingTop: "4px", height: "40px", paddingBottom: "4px"}} /></Link>
              </Tooltip>
            </li>
            <li>
              <Tooltip title="Activity" arrow>
                <Link to="/activity"><img alt='Activity' src='../assets/img/activity_white.svg' style={{width:"30px", paddingTop: "4px", height: "40px", paddingBottom: "4px"}} /></Link>
              </Tooltip>
            </li>
            <li>
              <Tooltip title="Support" arrow>
                <Link to="/support"><img alt='Support' src='../assets/img/support_white.svg' style={{width:"40px", paddingTop: "3px", height: "40px", paddingBottom: "4px"}} /></Link>
              </Tooltip>
            </li>
            <li>
              <Tooltip title="Company Settings" arrow>
                <Link to="/companySettings"><img alt='Company Settings' src='../assets/img/setting_white.svg' style={{width:"40px", paddingTop: "4px", height: "40px", paddingBottom: "4px"}} /></Link>
              </Tooltip>
            </li>
  */}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Submenu;
