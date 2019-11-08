import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components/macro';

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const Container = styled.div`
  width: 240px;
  padding: 12px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media screen and (max-width: 520px) {
    width: 60px;
  }
`;

const Name = styled.span`
  @media screen and (max-width: 520px) {
    display: none;
  }
`;

export default function UserBadge({ userDetails }) {
  return (
    <Container>
      <ProfileImage
        alt={userDetails.displayName}
        src={userDetails.photoURL}
      />
      <Name>
        {userDetails.displayName}
      </Name>
      <FontAwesomeIcon icon="caret-down" />
    </Container>
  );
}

UserBadge.propTypes = {
  userDetails: PropTypes.shape({}).isRequired,
};
