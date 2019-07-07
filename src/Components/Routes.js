import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import Play from "./Play";
import About from "./About";
import Settings from "./Settings";

const Routes = ({ childProps }) => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/about" component={About} />
    <Route exact path="/play" render={props => <Play {...childProps} />} />
    <Route
      exact
      path="/settings"
      render={props => <Settings {...childProps} />}
    />
  </Switch>
);

export default Routes;
