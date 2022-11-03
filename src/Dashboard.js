import React, { useEffect, Component, useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'
import { Group, Person, Devices, DevicesOther, Description, ContactSupport, Settings } from '@material-ui/icons';
import { withSnackbar } from "notistack";
import Loader from "./PageLoader"
import { connect, useSelector } from "react-redux";
import Footer from "./footer"
// class Dashboard extends Component  {
const Dashboard = (props) => {

  const { permissionDetails } = useSelector((state) => state.auth)
console.log("Permission :::"+permissionDetails)
  // render() {
  const [pageLoading, setPageLoading] = React.useState(true)

  const activeMenu = (menuName) => {
    localStorage.setItem("selectedMenu", menuName);
  }

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 1000);
  }, []);

console.log("RoleName::::"+localStorage.getItem("roleName"))
  return (
     // const userToken = localStorage.getItem('token')
    // // console.log(userToken)
    // let authRedirect = null
    // if (!userToken) {
    //   authRedirect = <Redirect from="./Dashboard" to= "/"/>
    // }
    <>
    <div>
      {pageLoading ? <Loader /> : null}
      <div className="sidenav">
        <p>LOCK CART</p>
        <small>Contacts free locks</small>
        {
          //User Navigation
        }


{localStorage.getItem("roleName")=="Lockcart Administration"?(
  <div style={{
    marginTop:"30%"
  }}>
<div className="settingBar">        
        <div className="card-body">
          <Link to="/company">
            <div className="row">
              <div className="col text-center">
                <div id="settingNav">
                  <h2>Company</h2>
                </div>
              </div>
            </div>
          </Link>
        </div>
     
    </div>
    </div>):

    <div>
    <div className="userBar">   
    <div className="card-body">
        <a href="/users">
        <div className="row">
          <div className="col text-center">
            <div id="userNav">
              <h2 id="headText">Users</h2>
            </div>
          </div>
        </div>
      </a>
    </div>
</div>
<div className="deviceBar">     
        <div className="card-body">
          <a href="/devices">
            <div className="row">
              <div className="col text-center">
                <div id="suppotNav">
                  <h2>Devices</h2>
                </div>
              </div>
            </div>
          </a>
    </div>
    </div>
    <div className="serviceBar">
         
         <div className="card-body">
           <a href="/support">
             <div className="row">
               <div className="col text-center">
                 <div id="deviceNav">
                   <h2>Support</h2>
                 </div>
               </div>
             </div>
           </a>
      
     </div>
     </div>
     <div className="card-body">
          <Link to="/activity">
            <div className="row">
              <div className="col text-center">
                <div id="settingNav">
                  <h2 style={{
                    color:"rgb(31, 85, 20)"
                  }}>Activity Log</h2>
                </div>
              </div>
            </div>
          </Link>
        </div>

</div>



}



        {/* <div className="userBar">
         
            <div className="card-body">
                <a href="/users">
                <div className="row">
                  <div className="col text-center">
                    <div id="userNav">
                      <h2 id="headText">Users</h2>
                    </div>
                  </div>
                </div>
              </a>
            </div>
         
        </div>
        <div className="deviceBar">
        
          <div className="card-body">
            <a href="/devices">
              <div className="row">
                <div className="col text-center">
                  <div id="suppotNav">
                    <h2>Devices</h2>
                  </div>
                </div>
              </div>
            </a>
     
      </div>
      </div>
      
      
        <div className="serviceBar">
         
            <div className="card-body">
              <a href="/support">
                <div className="row">
                  <div className="col text-center">
                    <div id="deviceNav">
                      <h2>Support</h2>
                    </div>
                  </div>
                </div>
              </a>
         
        </div>
        </div>
        
        <div className="settingBar">
        
            <div className="card-body">
              <Link to="/company">
                <div className="row">
                  <div className="col text-center">
                    <div id="settingNav">
                      <h2>Company</h2>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
         
        </div>

        <div className="settingBar">
        
        <div className="card-body">
          <Link to="/activity">
            <div className="row">
              <div className="col text-center">
                <div id="settingNav">
                  <h2>Activity Log</h2>
                </div>
              </div>
            </div>
          </Link>
        </div>
     
    </div> */}
        <div className="logoutBar">
        
            <div className="card-body">
             
                <div className="row">
                  <div className="col text-center">
                    <div id="logoutNav">
                      <img src='../assets/img/dashboard_logout.png' onClick={logout} />
                    </div>
                  </div>
                </div>
            
            </div>
         
        </div>

 </div>

      <div className="main">
        <h2 id="dashboard_home">Dashboard</h2>
        <h3 style={{
          color:" #1b330a",
          fontStyle:"italic"
        }}>Welcome {localStorage.getItem("displayName")}</h3>
        
         {/* <h3 style={{
          color:" #1b330a",
          fontStyle:"italic"
        }}>{localStorage.getItem("companyName")}</h3> */}
        

{localStorage.getItem("roleName")=="Lockcart Administration"?
( <div>
<div class="container"> 
<div class="row dahboardrow">

<div class="col"
style={{marginLeft:"26%",
marginTop:"19%",
}}
>
                <div className="col"
                id="adminCSS"
                >
                  <div className="card card-stats">
                    <div className="card-body">
                      <Link to="/company">
                        <div className="col text-center">
                          <img
                            alt="Logo"
                            src="../assets/img/dashboard_setting.jpg"
                            style={{ height: 120, width: 120 }}
                          />
                          <p className="h2 font-weight-bold mb-0">
                            Company 
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              
            </div>   

</div> 
</div>
</div>
 ) :
<div>

<div class="container">

          <div class="row dahboardrow">
            <div class="col">
             
                <div className="col">
                  <div className="card card-stats">
                    <div className="card-body">
                      <Link to="/users" onClick={() => activeMenu("user")}>
                        <div className="row">
                          <div className="col text-center">
                            <img
                              alt="Logo"
                              src="../assets/img/dashboard_user.jpg"
                              style={{ height: 120, width: 120 }}
                            />
                            <p className="h2 font-weight-bold mb-0">Users</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
             
            </div>
            <div class="col">
             
                <div className="col">
                  <div className="card card-stats">
                    <div className="card-body">
                      <Link to="/devices" onClick={() => activeMenu("device")}>
                        <div className="row">
                          <div className="col text-center">
                            <img
                              alt="Logo"
                              src="../assets/img/dashboard_device.jpg"
                              style={{ height: 120, width: 120 }}
                            />
                            <p className="h2 font-weight-bold mb-0">Devices</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              
            </div>
            <div class="w-100"></div>
            <div class="col">
              
                <div className="col">
                  <div className="card card-stats">
                    <div className="card-body">
                      <a href="/support">
                        <div className="row">
                          <div className="col text-center">
                            <img
                              alt="Logo"
                              src="../assets/img/dashboard_support.jpg"
                              style={{ height: 120, width: 120 }}
                            />
                            <p className="h2 font-weight-bold mb-0">Support</p>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              
            </div>
            <div class="col">
              
                <div className="col">
                  <div className="card card-stats">
                    <div className="card-body">
                      <Link to="/activity">
                        <div className="col text-center">
                          <img
                            alt="Logo"
                            src="../assets/img/activityLog.jpg"
                            style={{ height: 120, width: 120 }}
                          />
                          <p className="h2 font-weight-bold mb-0">
                            Activity Log
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              
            </div>
            
          </div>
        </div>



</div>


}

{/* <div class="container">

          <div class="row dahboardrow">
            <div class="col">
              {permissionDetails.permission_all ||
              permissionDetails.permission_module.users ? (
                <div className="col">
                  <div className="card card-stats">
                    <div className="card-body">
                      <Link to="/users" onClick={() => activeMenu("user")}>
                        <div className="row">
                          <div className="col text-center">
                            <img
                              alt="Logo"
                              src="../assets/img/dashboard_user.jpg"
                              style={{ height: 120, width: 120 }}
                            />
                            <p className="h2 font-weight-bold mb-0">Users</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div class="col">
              {permissionDetails.permission_all ||
              permissionDetails.permission_module.devices ? (
                <div className="col">
                  <div className="card card-stats">
                    <div className="card-body">
                      <Link to="/devices" onClick={() => activeMenu("device")}>
                        <div className="row">
                          <div className="col text-center">
                            <img
                              alt="Logo"
                              src="../assets/img/dashboard_device.jpg"
                              style={{ height: 120, width: 120 }}
                            />
                            <p className="h2 font-weight-bold mb-0">Devices</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div class="w-100"></div>
            <div class="col">
              {permissionDetails.permission_all ||
              permissionDetails.permission_module.support ? (
                <div className="col">
                  <div className="card card-stats">
                    <div className="card-body">
                      <a href="/support">
                        <div className="row">
                          <div className="col text-center">
                            <img
                              alt="Logo"
                              src="../assets/img/dashboard_support.jpg"
                              style={{ height: 120, width: 120 }}
                            />
                            <p className="h2 font-weight-bold mb-0">Support</p>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div class="col">
              {permissionDetails.permission_all ||
              permissionDetails.permission_module.company_settings ? (
                <div className="col">
                  <div className="card card-stats">
                    <div className="card-body">
                      <Link to="/company">
                        <div className="col text-center">
                          <img
                            alt="Logo"
                            src="../assets/img/dashboard_setting.jpg"
                            style={{ height: 120, width: 120 }}
                          />
                          <p className="h2 font-weight-bold mb-0">
                            Company 
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div> */}

        {/* <Footer /> */}
      </div>
    </div>
    </>
  );
  // }
};

// export default Dashboard

export default connect(
)(withSnackbar(Dashboard));
