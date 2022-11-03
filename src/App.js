import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import { SnackbarProvider } from "notistack";
import Login from './Login'
import Master from './Master'
import AuthenticatedRoute from "./components/AuthenticatedRoute/index";
import Forgotpassword from './Forgotpassword';
import { ResetPassword } from './ResetPassword';
import { ResetMessage } from './ResetMessage';
export default function App () {
  return (  
    <Router>
      <SnackbarProvider
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        maxSnack={1}
        dense
        autoHideDuration={2000}>
        <Switch>
          {/* <Route exact path="/login" component={Login} /> */}
          <Route  exact path="/resetPassword/:companyId/:to" component={ResetPassword}/>
          <Route exact path="/login" component={Login} />
          <Route exact path="/forgotPassword" component={Forgotpassword} />
          <Route exact path="/resetMsg" component={ResetMessage} />
          <AuthenticatedRoute path="/" component={Master} />
        </Switch>
      </SnackbarProvider>
    </Router>
  )
}
