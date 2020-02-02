import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { sumbitFeedback as sumbitFeedbackAction } from '../../actions';
import { buttonBaseStyle } from '../../genericComponents/styles';
import { userType } from '../../types';

const initialState = {
  isOpen: false,
  feedback: '',
};

const Wrapper = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  bottom: 24px;
  right: 24px;
`;

const CloseIcon = styled(FontAwesomeIcon)`
  background: #fff;
  font-size: 24px;
  border-radius: 12px;
  position: absolute;
  top: -18px;
  right: -12px;
`;

const FeedbackForm = styled.form`
  display: flex;
  flex-direction: column;
  background-color: #388E3C;
  box-shadow: 0 2px 4px rgba(0,0,0,0.4);
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
`;

const FeedbackField = styled.textarea`
  resize: none;
  padding: 4px;
  width: 300px;
  height: 120px;
  margin-bottom: 4px;
  font-size: 16px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
`;

const SubmitButton = styled.input`
  ${buttonBaseStyle}
  background: #1B5E20;
  margin: 0 auto;
`;

const IconContainer = styled.div`
  padding: 12px;
  box-sizing: border-box;
  background-color: #388E3C;
  width: 52px;
  height: 52px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.4);
  border-radius: 28px;
  color: #fff;
  font-size: 28px;
`;

class FeedbackWidget extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    const { feedback } = this.state;
    const { user, submitFeedback } = this.props;
    submitFeedback({
      email: (user && user.details && user.details.email) || 'anonnymous',
      feedback,
    });
    this.setState(initialState);
    e.preventDefault();
  }

  handleChange(e) {
    this.setState({ feedback: e.target.value });
  }

  toggle(state) {
    this.setState({
      isOpen: state,
    });
  }

  render() {
    const { isOpen, feedback } = this.state;

    return (
      <Wrapper>
        {isOpen ? (
          <>
            <CloseIcon icon="times-circle" onClick={() => this.toggle(false)} />
            <FeedbackForm onSubmit={this.handleSubmit}>
              <FeedbackField
                id="feedback"
                name="feedback"
                value={feedback}
                onChange={this.handleChange}
                placeholder="Type your feedback here and click sumbit."
              />
              <SubmitButton type="submit" value="Submit Feedback" />
            </FeedbackForm>
          </>
        ) : null}
        <IconContainer onClick={() => this.toggle(true)}>
          <FontAwesomeIcon icon="comment-alt" />
        </IconContainer>
      </Wrapper>
    );
  }
}

FeedbackWidget.propTypes = {
  user: userType,
  submitFeedback: PropTypes.func.isRequired,
};

FeedbackWidget.defaultProps = {
  user: null,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  submitFeedback: (data) => dispatch(sumbitFeedbackAction(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FeedbackWidget);
