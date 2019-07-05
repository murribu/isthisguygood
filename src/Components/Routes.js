import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Home from './Home';
import Play from './Play';
import About from './About';

const Routes = ({childProps}) => <Switch>
  <Route exact path="/" component={Home} props={childProps}></Route>
  <Route exact path="/about" component={About} props={childProps}></Route>
  <Route exact path="/play" component={Play} props={childProps}></Route>
</Switch>

export default Routes;