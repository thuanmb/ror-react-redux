import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import routes from './routes';

import './vendor/vendor';
import './vendor/vendor-style';
import './styles/my-project';
import './init';

const Root = ({ store }) =>
  <Provider store={store}>
    {routes}
  </Provider>;

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
