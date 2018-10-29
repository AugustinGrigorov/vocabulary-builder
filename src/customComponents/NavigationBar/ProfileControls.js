import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import InteractiveButton from './InteractiveButton';
import UserBadge from './UserBadge';

const Container = styled.div`
  padding: 12px 0;
  position: relative;
`;

const Menu = styled.ul`
  padding: 0;
  z-index: 1;
  position: absolute;
  width: 240px;
  background: #fff;
  border: 1px solid #9E9E9E;
  box-sizing: border-box;
  border-top: none;
  border-radius: 0 0 10px 10px;
  right: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  list-style: none;
`;

const MenuButton = styled(InteractiveButton)`
  color: #66BB6A;
  width: 100%;
  text-align: left;
  padding: 12px 32px;
`;

export default class ProfileControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
    };
  }

  render() {
    const { showMenu } = this.state;
    const { userDetails, signOut } = this.props;
    return (
      <Container
        onMouseEnter={() => this.setState({ showMenu: true })}
        onMouseLeave={() => this.setState({ showMenu: false })}
      >
        <UserBadge userDetails={userDetails} />
        { showMenu
          ? (
            <Menu>
              <MenuItem>
                <MenuButton
                  type="button"
                  onClick={signOut}
                >
                  Sign out
                </MenuButton>
              </MenuItem>
            </Menu>
          ) : null
        }
      </Container>
    );
  }
}


ProfileControls.propTypes = {
  userDetails: PropTypes.shape({}).isRequired,
  signOut: PropTypes.func.isRequired,
};
