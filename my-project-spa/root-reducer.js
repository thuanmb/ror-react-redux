import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as toastr } from 'react-redux-toastr';

const rootReducer = combineReducers({
  routing,
  toastr,
});

export default rootReducer;
