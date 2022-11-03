import React from 'react';
import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom'


const SideNavBar=()=>{
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

return(
    <>
<div className="sidenav">
        <p>LOCK CART</p>
        <small>Contacts free locks</small>


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
</div>

):
<div>
<div className="userBar">
         
         <div className="card-body">
             <a href="/users">
             <div className="row">
               <div className="col text-center">
                 <div id="userNav">
                   <h2>Users</h2>
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
               <div id="deviceNav">
                 <h2>Devices</h2>
               </div>
             </div>
           </div>
         </a>
  
   </div>
   </div>
   
   
     <div className="deviceBar">
      
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
              <Link to="/activity">
                <div className="row">
                  <div className="col text-center">
                    <div id="settingNav">
                      <h2 style={{
                        color:"#1b330a"
                      }}>Activity Log</h2>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
         
        </div>
</div>
}

       
        {/* <div className="userBar">
         
            <div className="card-body">
                <a href="/users">
                <div className="row">
                  <div className="col text-center">
                    <div id="userNav">
                      <h2>Users</h2>
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
                  <div id="deviceNav">
                    <h2>Devices</h2>
                  </div>
                </div>
              </div>
            </a>
     
      </div>
      </div>
      
      
        <div className="deviceBar">
         
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

    </>
)
}
export default SideNavBar;