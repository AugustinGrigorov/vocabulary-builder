import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components/macro';

import { dictionaryType } from '../../types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 64px);
  margin: 0;
  text-align: center;
  background: #43A047;
  color: #fff;
  padding: 8px;
  box-sizing: border-box;
`;

const Heading = styled.h2`
  max-width: 800px;
  font-size: 32px;
`;

const Description = styled.p`
  max-width: 800px;
  font-size: 18px;
`;

const Link = styled.a`
  color: #fff;
`;

function Home({ dictionary }) {
  return (
    <Container>
      <Heading>Vocabulary builder</Heading>
      <Description>
        This is a web application designed
        to help you store and practice new
        words you learn when studying a
        foreign language.
      </Description>
      {dictionary.data.length ? (
        <>
          <p>
            Words added:
            {' '}
            <b>{dictionary.data.length}</b>
          </p>
          <p>
            Practice attempts:
            {' '}
            <b>
              {dictionary.data.reduce((total, { attempts = [] }) => total + attempts.length, 0)}
            </b>
          </p>
        </>
      ) : null}
      <p>
        Icons made by
        {' '}
        <Link href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</Link>
        {' '}
        from
        <Link href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</Link>
      </p>
    </Container>
  );
}

Home.propTypes = {
  dictionary: dictionaryType.isRequired,
};

const mapStateToProps = (state) => ({
  dictionary: state.dictionary,
});

export default connect(
  mapStateToProps,
)(Home);
