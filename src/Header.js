import React, {useEffect, useLayoutEffect} from 'react';
import PropTypes from "prop-types";
import { Link, useHistory, useLocation } from 'react-router-dom';
import { withSnackbar } from "notistack";
import { permissions } from "./store/actions/auth";
import { connect, useSelector, useDispatch } from "react-redux";
import { Person } from '@material-ui/icons';
import { getPageDetails } from './helper/commonHelper';


// const Header = (props) => {
const Header = ({ logout }) => {
  const displayName = localStorage.getItem("displayName");
  // const userRole = localStorage.getItem("userRole");
  const [pageDetails, setPageDetails] = React.useState({
    isDashboard: true,
    title: '',
    icon: ''
  })

  const history = useHistory();
  const location = useLocation()
  const { permissionDetails } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  
  
  useEffect(() => {
    dispatch(permissions())
  }, [dispatch]);

  useEffect(() => {
    const pDetails = getPageDetails(location.pathname)
    const details = {...pageDetails}
    details["isDashboard"] = pDetails.isDashboard
    details["title"] = pDetails.title
    details["icon"] = pDetails.icon
    setPageDetails(details)
  }, [location.pathname]);

  return (
   
    
    
    <nav className='test_nav'>
           {/*<nav className='navbar navbar-top navbar-expand navbar-dark bg-white'></nav>*/}
        <div className='pr-3 sidenav-toggler sidenav-toggler-dark' data-action='sidenav-pin' data-target='#sidenav-main'>
            <div className='sidenav-toggler-inner'  role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
              {/* <i className='sidenav-toggler-line bg-dark' />
              <i className='sidenav-toggler-line bg-dark' />
              <i className='sidenav-toggler-line bg-dark' /> */}
              <i className="fa fa-bars fa-2x" style={{color: "white"}}></i>
            </div>
            <div className='dropdown-menu  dropdown-menu-right' style={{left:0, right:'auto'}}>
                <div className='dropdown-header noti-title'>
                  {/* <h6 className='text-overflow m-0'>Welcome!</h6> */}
                </div>
                  {permissionDetails.permission_all || permissionDetails.permission_module.change_password ? 
                    <div>
                      {/* <Link to="" className='dropdown-item'>
                        <img alt="Change Password" src='../assets/img/key.svg' style={{ width: "25px", marginRight: "10px" }} />
                        <span>Change Password</span>
                      </Link> */}
                    </div>
                    : ""
                  }
              </div>
          </div>

          {!pageDetails.isDashboard ? 
            <div>
              <div style={{display:'flex', alignItems:'right'}}>
                <img alt='Users' src={pageDetails.icon} style={{height:60,width:120}} />
                <h1 className="ml-5">{pageDetails.title}</h1>
              </div>
            </div>
            : null 
          }

          <Link>
            <img alt='Logo' src='../assets/img/lockcartlogo.png' style={{height:70}} />
          </Link>

          {pageDetails.isDashboard ? 
            <div>
              <Link to="/login" onClick={() => logout()}>
                <img alt='logout' src='../assets/img/GrayImg.png' style={{height:40}} />
              </Link>
            </div>
            : null 
          }
          
      
    </nav>
  )
}

Header.propTypes = {
  logout: PropTypes.func.isRequired,
};

// export default Header;


export default connect(
)(withSnackbar(Header));


