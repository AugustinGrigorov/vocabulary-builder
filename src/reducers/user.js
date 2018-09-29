const user = (state = null, action) => {
  switch (action.type) {
    case 'RECEIVE_LOGIN_DETAILS':
      return action.user;
    default:
      return state;
  }
};

export default user;
