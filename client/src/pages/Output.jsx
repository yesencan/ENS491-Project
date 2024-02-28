import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import OutputData from "../data/output.json";

const FadeInAnimation = keyframes`
  from {
    transform: translateY(100px);
    opacity: 0;
  }

  to {
    transform: translateY(0px);
    opacity: 1;
  }
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
`;

const Wrapper = styled.div`
  width: 100vw;
  height: calc(100vh - 70px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ResultsContainer = styled.div`
  width: 90%;
  height: auto;
  max-height: 80%;
  overflow-y: auto;
  position: relative;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Row = styled.div`
  width: calc(100% - 40px);
  height: 50px;
  margin: 0 20px 10px 20px;
  background-color: orange;
  font-family: "Roboto";
  display: flex;
  opacity: 0;
  animation: ${FadeInAnimation} 1s ease forwards;
  animation-delay: ${(props) => props.idx * 0.1}s;
  box-shadow: 0 0 5px 1px lightgray;
  border-radius: 5px;
`;

const Table = styled.div`
  width: 90%;
  height: 40px;
  display: flex;
  padding: 0 20px 0 20px;
  box-sizing: border-box;
  position: relative;
  font-family: "Poppins";
  font-size: 16px;
`;

const Label = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Poppins";
  font-weight: bold;
  font-size: 16px;
  color: black;
`;

const GeneId = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-size: 20px;
`;

const Position = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-size: 30px;
`;

const ProteinSequence = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-size: 20px;
`;

const ProbableKinase = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-size: 20px;
`;

const KinaseFamily = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-size: 20px;
`;

const Probability = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.probability > 0.8
      ? "green"
      : props.probability > 0.5
      ? "yellow"
      : "red"};
  font-size: 24px;
  font-weight: 700;
`;

const Letter = styled.span`
  font-size: ${(props) => (props.idx === 7 ? "40px" : "20px")};
  color: ${(props) => (props.idx === 7 ? "gray" : "black")};
  margin: ${(props) => (props.idx === 7 ? "0 3px 0 3px" : "0")};
  transform: translateY(5px);
  &:hover {
  }
`;

const Tag = styled.button`
  width: auto;
  height: 30px;
  margin: 0 5px 0 5px;
  display: flex;
  border: none;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.isClicked ? "orange" : "black")};
  font-family: "Poppins";
  font-size: 20px;
  background-color: transparent;
  transition: 0.2s all;
  cursor: pointer;
  &:hover {
    transform: translateY(-2px);
  }
`;

const DownloadCSV = styled.button`
  width: 160px;
  height: 30px;
  position: absolute;
  right: 20px;
  bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border: 2px solid orange;
  color: orange;
  background-color: white;
  font-size: 16px;
  border-radius: 5px;
  transition: 0.2s all;
  cursor: pointer;
  &:hover {
    color: white;
    background-color: orange;
  }
`;

const Output = () => {
  const [sortBy, setSortBy] = useState("probability");
  const getRowKey = (item, idx) => `${idx}-${sortBy}`;

  const handleSort = (type) => {
    setSortBy(type);
  };
  return (
    <Container>
      <Wrapper>
        <Table>
          <DownloadCSV>
            Download CSV <i class="bi bi-box-arrow-down"></i>
          </DownloadCSV>
        </Table>
        <Table>
          <Label>
            Gene ID{" "}
            <Tag
              isClicked={sortBy === "geneID"}
              onClick={() => handleSort("geneID")}
            >
              <i class="bi bi-sort-alpha-down"></i>
            </Tag>
          </Label>
          <Label>
            Position{" "}
            <Tag
              isClicked={sortBy === "position"}
              onClick={() => handleSort("position")}
            >
              {" "}
              <i class="bi bi-sort-down"></i>
            </Tag>
          </Label>
          <Label>Phosphate (+-7)</Label>
          <Label>
            Probable Kinase{" "}
            <Tag
              isClicked={sortBy === "probableKinase"}
              onClick={() => handleSort("probableKinase")}
            >
              <i class="bi bi-sort-alpha-down"></i>
            </Tag>
          </Label>
          <Label>
            Kinase Family{" "}
            <Tag
              isClicked={sortBy === "kinaseFamily"}
              onClick={() => handleSort("kinaseFamily")}
            >
              <i class="bi bi-sort-alpha-down"></i>
            </Tag>
          </Label>
          <Label>
            Probability{" "}
            <Tag
              isClicked={sortBy === "probability"}
              onClick={() => handleSort("probability")}
            >
              <i class="bi bi-sort-down"></i>
            </Tag>
          </Label>
        </Table>
        <ResultsContainer>
          {OutputData.results
            .sort((a, b) => {
              if (sortBy === "probability") {
                return parseFloat(b.probability) - parseFloat(a.probability);
              }
              if (sortBy === "position") {
                return parseFloat(b.position) - parseFloat(a.position);
              }
              if (sortBy === "geneID") {
                return a.geneId.localeCompare(b.geneId);
              }
              if (sortBy === "probableKinase") {
                return a.probKinase.localeCompare(b.probKinase);
              }
              if (sortBy === "kinaseFamily") {
                return a.kinaseFamily.localeCompare(b.kinaseFamily);
              }
              return 0;
            })
            .map((item, idx) => (
              <Row key={getRowKey(item, idx)} idx={idx}>
                <GeneId>{item.geneId}</GeneId>
                <Position>{item.position}</Position>
                <ProteinSequence>
                  {item.proteinSeq.split("").map((letter, idx) => (
                    <Letter key={idx} idx={idx}>
                      {letter}
                    </Letter>
                  ))}
                </ProteinSequence>
                <ProbableKinase>{item.probKinase}</ProbableKinase>
                <KinaseFamily>{item.kinaseFamily}</KinaseFamily>
                <Probability probability={parseFloat(item.probability)}>
                  {item.probability} <span style={{ fontSize: "24px" }}></span>
                </Probability>
              </Row>
            ))}
        </ResultsContainer>
      </Wrapper>
    </Container>
  );
};

export default Output;
