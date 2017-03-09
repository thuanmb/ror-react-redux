import React from 'react';
import { Router, Route } from 'react-router';
import { history } from 'CorePath/store';
import App from './pages/app';
import NoMatch from './components/404/404';

const Routes = (
  <Router history={history}>
    <Route path="/" component={App} />
    <Route path="*" component={NoMatch} />
  </Router>
);
export default Routes;
