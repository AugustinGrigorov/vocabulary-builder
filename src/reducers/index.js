import { combineReducers } from 'redux';
import dictionary from './dictionary';
import user from './user';
import practice from './practice';
import learn from './learn';

export default combineReducers({
  dictionary,
  user,
  practice,
  learn,
});
