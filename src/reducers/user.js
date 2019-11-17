import {
  actions,
} from '../constants';

const user = (state = {
  fetching: true,
  details: null,
  error: false,
}, action) => {
  switch (action.type) {
    case actions.FETCH_USER_DETAILS_REQUEST:
      return {
        ...state,
        fetching: true,
        error: false,
      };
    case actions.RECEIVE_USER_DETAILS:
      return {
        details: action.userDetails,
        fetching: false,
        error: false,
      };
    case actions.USER_DETAILS_REQUEST_FAILED:
      return {
        ...state,
        fetching: false,
        error: true,
      };
    default:
      return state;
  }
};

export default user;
