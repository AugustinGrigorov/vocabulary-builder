import { combineReducers } from 'redux';
import dictionary from './dictionary';
import user from './user';

export default combineReducers({
  dictionary,
  user,
});
