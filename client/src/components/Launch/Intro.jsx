import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
const Container = styled.div`
  width: 100vw;
  height: 160vh;
  margin: 0;
  display: grid;
  grid-template-columns: 40% 60%;
  grid-template-rows: 50% 50%;
  overflow: hidden;
`;

const TitleContainer = styled.div`
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  position: relative;
  background-color: white;
`;

const Title = styled.div`
  position: absolute;
  top: 20%;
  left: 20%;
  font-size: 48px;
  font-family: "Roboto";
  font-weight: 100;
  color: black;
`;

const SubTitle = styled.div`
  position: absolute;
  top: calc(20% + 60px);
  left: 20%;
  font-size: 16px;
  font-family: "Roboto";
  font-weight: 200;
  color: black;
  line-height: 25px;
`;

const TryButton = styled.button`
  width: 150px;
  height: 40px;
  position: absolute;
  top: calc(20% + 300px);
  left: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid orange;
  cursor: pointer;
  background-color: white;
  color: orange;
  transition: all 0.2s;
  font-size: 16px;
  &:hover {
    background-color: orange;
    color: white;
  }
`;

const VisualizationContainer = styled.div`
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  position: relative;
  z-index: 4;
`;

const AboutContainer = styled.div`
  grid-column: 1 / 3;
  grid-row: 2 / 3;
  background-color: orange;
  display: flex;
`;

const DefinitionContainer = styled.div`
  width: 60%;
  height: 100%;
  position: relative;
`;

const DefinitionTitle = styled.div`
  position: absolute;
  left: 13%;
  top: 15%;
  font-family: "Roboto";
  font-weight: 100;
  font-size: 48px;
  color: black;
`;

const DefinitonText = styled.div`
  position: absolute;
  left: 13%;
  top: calc(15% + 80px);
  font-family: "Roboto";
  font-weight: 300;
  font-size: 18px;
  color: black;
  line-height: 25px;
  text-align: justify;
`;

const Intro = () => {
  return (
    <Container>
      <TitleContainer>
        <Title>DeepKinZero</Title>
        <SubTitle>
          Zero-shot learning for predicting kinase-phosphosite associations
          involving understudied kinases.
        </SubTitle>
        <Link to="/" style={{ textDecoration: "none", color: "black" }}>
          <TryButton>Try DeepKinZero</TryButton>
        </Link>
      </TitleContainer>
      <VisualizationContainer></VisualizationContainer>
      <AboutContainer>
        <DefinitionContainer>
          <DefinitionTitle>What is DeepKinZero?</DefinitionTitle>
          <DefinitonText>
            We present DeepKinZero, the first zero-shot learning approach to
            predict the kinase acting on a phosphosite for kinases with no known
            phosphosite information. DeepKinZero transfers knowledge from
            kinases with many known target phosphosites to those kinases with no
            known sites through a zero-shot learning model. The kinase-specific
            positional amino acid preferences are learned using a bidirectional
            recurrent neural network. We show that DeepKinZero achieves
            significant improvement in accuracy for kinases with no known
            phosphosites in comparison to the baseline model and other methods
            available. By expanding our knowledge on understudied kinases,
            DeepKinZero can help to chart the phosphoproteome atlas.
          </DefinitonText>
        </DefinitionContainer>
      </AboutContainer>
    </Container>
  );
};

export default Intro;
