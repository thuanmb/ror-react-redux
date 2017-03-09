import React, { PropTypes } from 'react';
import ReduxToastr from 'react-redux-toastr';

const AppPage = (props) => (
  <div>
    <ReduxToastr
      timeOut={4000}
      newestOnTop={false}
      preventDuplicates={false}
      position="top-right"
      transitionIn="fadeIn"
      transitionOut="fadeOut"
      progressBar
    />
    {props.children}
  </div>
);

AppPage.propTypes = {
  children: PropTypes.object,
};

export default AppPage;
