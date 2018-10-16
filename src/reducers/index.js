import { combineReducers } from 'redux';
import dictionary from './dictionary';
import user from './user';
import quiz from './quiz';

export default combineReducers({
  dictionary,
  user,
  quiz,
});
