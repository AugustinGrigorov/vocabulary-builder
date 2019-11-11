import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components/macro';

import { userType } from '../../types';

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

export default function UserBadge({ user }) {
  const { details } = user;
  return (
    <Container>
      <ProfileImage
        alt={details.displayName}
        src={details.photoURL}
      />
      <Name>
        {details.displayName}
      </Name>
      <FontAwesomeIcon icon="caret-down" />
    </Container>
  );
}

UserBadge.propTypes = {
  user: userType.isRequired,
};
