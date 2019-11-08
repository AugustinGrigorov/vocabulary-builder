import React from 'react';
import styled from 'styled-components/macro';

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

function Home() {
  return (
    <Container>
      <Heading>Vocabulary builder</Heading>
      <Description>
        This is a web aplication designed
        to help you store and practice new
        words you learn when studying a
        foreign language.
      </Description>
    </Container>
  );
}


export default Home;
