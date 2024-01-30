import React from "react";
import styled from "styled-components";
import Intro from "../components/Launch/Intro";

const Container = styled.div`
  width: auto;
  height: auto;
`;

const Launch = () => {
  return (
    <Container>
      <Intro></Intro>
    </Container>
  );
};

export default Launch;
