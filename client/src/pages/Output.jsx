import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import OutputData from "../data/output.json";

const ShakeAnimation = keyframes`
  0% {
    transform: translateY(5px);
    opacity: 1;
  }

  50% {
    transform: translateY(-5px);
    opacity: 1;
  }

  100% {
    transform: translateY(5px);
    opacity: 1;
  }
`;

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
const Overlay = styled.div`
  width: 100%;
  height: 20%;
  position: fixed;
  left: 0;
  bottom: 0;
  background: linear-gradient(to top, white, transparent 90%);
  z-index: 5;
`;

const Row = styled.div`
  width: calc(100% - 40px);
  height: 120px;
  margin: 0 20px 20px 20px;
  background-color: orange;
  font-family: "Roboto";
  display: flex;
  opacity: 0;
  animation: ${FadeInAnimation} 1s ease forwards;
  animation-delay: ${(props) => props.idx * 0.1}s;
  box-shadow: 0 0 5px 1px lightgray;
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
  align-items: flex-end;
  justify-content: center;
  font-family: "Poppins";
  font-size: 16px;
  color: black;
`;

const GeneId = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
`;

const Position = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 30px;
`;

const ProteinSequence = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
`;

const ProbableKinase = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
`;

const KinaseFamily = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
`;

const Probability = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.probability > 80
      ? "green"
      : props.probability > 50
      ? "yellow"
      : "red"};
  font-size: 70px;
  font-weight: 700;
`;

const Letter = styled.span`
  font-size: ${(props) => (props.idx === 7 ? "40px" : "20px")};
  color: ${(props) => (props.idx === 7 ? "gray" : "white")};
  margin: ${(props) => (props.idx === 7 ? "3px" : "0")};
  transform: translateY(5px);
  animation: ${ShakeAnimation} 6s infinite ease-in-out;
  animation-delay: ${(props) => props.idx * 0.3}s;
  &:hover {
  }
`;

const SortTitle = styled.div`
  position: absolute;
  left: 20px;
  bottom: 7.5px;
`;

const TagContainer = styled.div`
  width: auto;
  position: absolute;
  left: 100px;
  bottom: 5px;
  display: flex;
`;

const Tag = styled.button`
  width: auto;
  height: 30px;
  margin: 0 5px 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid orange;
  color: ${(props) => (props.isClicked ? "white" : "orange")};
  font-family: "Poppins";
  font-size: 14px;
  background-color: ${(props) => (props.isClicked ? "orange" : "white")};
  transition: 0.2s all;
  cursor: pointer;
  &:hover {
    transform: translateY(-2px);
  }
`;

const DownloadCSV = styled.button`
  width: 150px;
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
  font-size: 14px;
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
      <Table>
        <DownloadCSV>
          Download CSV <i class="bi bi-box-arrow-down"></i>
        </DownloadCSV>
        <SortTitle>Sorted By:</SortTitle>
        <TagContainer>
          <Tag
            isClicked={sortBy === "probability"}
            onClick={() => handleSort("probability")}
          >
            Probability
          </Tag>
          <Tag
            isClicked={sortBy === "position"}
            onClick={() => handleSort("position")}
          >
            Position
          </Tag>
          <Tag
            isClicked={sortBy === "geneID"}
            onClick={() => handleSort("geneID")}
          >
            Gene ID
          </Tag>
          <Tag
            isClicked={sortBy === "probableKinase"}
            onClick={() => handleSort("probableKinase")}
          >
            Probable Kinase
          </Tag>
          <Tag
            isClicked={sortBy === "kinaseFamily"}
            onClick={() => handleSort("kinaseFamily")}
          >
            Kinase Family
          </Tag>
        </TagContainer>
      </Table>
      <Table>
        <Label>Gene ID</Label>
        <Label>Position</Label>
        <Label>Protein Sequence</Label>
        <Label>Probable Kinase</Label>
        <Label>Kinase Family</Label>
        <Label>Probability</Label>
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
                {item.probability} <span style={{ fontSize: "24px" }}>%</span>
              </Probability>
            </Row>
          ))}
      </ResultsContainer>
    </Container>
  );
};

export default Output;
