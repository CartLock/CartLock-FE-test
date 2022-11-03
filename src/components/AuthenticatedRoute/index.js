import { Redirect, Route } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";
const AuthenticatedRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem("token");
  return (
    <Route
      {...rest}
      render={(routeProps) =>
        token ? <Component {...routeProps} /> : <Redirect to="/login" />
      }
    />
  );
};

AuthenticatedRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

export default AuthenticatedRoute;