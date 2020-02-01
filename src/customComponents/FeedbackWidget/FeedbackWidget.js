import React from 'react';
import styled from 'styled-components/macro';
import feedbackIcon from './feedback.svg';

const FeedbackIcon = styled.div`
  display: flex;
  position: fixed;
  padding: 12px;
  background-color: #388E3C;
  width: 32px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.4);
  border-radius: 28px;
  bottom: 12px;
  right: 12px;
`;

function FeedbackWidget() {
  return (
    <FeedbackIcon>
      <img alt="Give feedback" src={feedbackIcon} />
    </FeedbackIcon>
  );
}

export default FeedbackWidget;
