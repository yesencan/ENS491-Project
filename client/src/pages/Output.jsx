import React, { useState } from "react";
import { useContext } from "react";
import styled, { keyframes } from "styled-components";
//import OutputData from "../data/output.json";
import OutputDataContext from "../contexts/OutputDataContext";
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
  height: 80vh;
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
  height: 60px;
  display: flex;
  padding: 0 20px 0 20px;
  box-sizing: border-box;
  position: relative;
  font-family: "Poppins";
  font-size: 16px;
  bottom: 5px;
`;

const LabelContainer = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Poppins";
  font-weight: bold;
  font-size: 14px;
  color: black;
  flex-direction: column;
  border: 1px solid orange;
  border-radius: 5px;
`;

const Label = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OptionsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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
  font-size: 20px;
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
  font-size: 20px;
  font-weight: 700;
`;

const Letter = styled.span`
  font-size: ${(props) => (props.idx === 7 ? "40px" : "18px")};
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
  user-select: none;
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

const SearchContainer = styled.div`
  width: auto;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchInput = styled.input`
  width: ${(props) => (props.isClicked ? "70px" : "0")};
  height: 25px;
  border: ${(props) => (props.isClicked ? "1px solid black" : "none")};
  border-radius: 5px;
  outline: none;
  margin-left: 5px;
  padding-left: ${(props) => (props.isClicked ? "5px" : "0")};
  transition: 0.5s;
`;

const Output = () => {
  const { outputData } = useContext(OutputDataContext);
  const [sortBy, setSortBy] = useState("probability");
  const getRowKey = (item, idx) => `${idx}-${sortBy}`;
  const [searchClicked, setSearchClicked] = useState("");
  const [filteredList, setFilteredList] = useState(outputData);

  const handleSort = (type) => {
    setSortBy(type);
  };

  const handleSearchClick = (type) => {
    setSearchClicked(type);
  };

  const handleSearch = (e, type) => {
    let filteredList = [];
    let text = e.target.value;
    console.log(text);
    if (type === "GeneID") {
      outputData.forEach((item) => {
        console.log(item);
        if (text === "") {
          filteredList.push(item);
        } else if (
          item.geneId.toString().toLowerCase().includes(text.toLowerCase())
        ) {
          filteredList.push(item);
        }
      });
      setFilteredList(filteredList);
    }
    if (type === "Position") {
      outputData.forEach((item) => {
        console.log(item);
        if (text === "") {
          filteredList.push(item);
        } else if (
          item.position.toString().toLowerCase().includes(text.toLowerCase())
        ) {
          filteredList.push(item);
        }
      });
      setFilteredList(filteredList);
    }
    if (type === "Phosphate") {
      outputData.forEach((item) => {
        console.log(item);
        if (text === "") {
          filteredList.push(item);
        } else if (
          item.proteinSeq.toString().toLowerCase().includes(text.toLowerCase())
        ) {
          filteredList.push(item);
        }
      });
      setFilteredList(filteredList);
    }
    if (type === "Kinase") {
      outputData.forEach((item) => {
        console.log(item);
        if (text === "") {
          filteredList.push(item);
        } else if (
          item.probKinase.toString().toLowerCase().includes(text.toLowerCase())
        ) {
          filteredList.push(item);
        }
      });
      setFilteredList(filteredList);
    }
    if (type === "KinaseFamily") {
      outputData.forEach((item) => {
        console.log(item);
        if (text === "") {
          filteredList.push(item);
        } else if (
          item.kinaseFamily
            .toString()
            .toLowerCase()
            .includes(text.toLowerCase())
        ) {
          filteredList.push(item);
        }
      });
      setFilteredList(filteredList);
    }
    if (type === "Probability") {
      outputData.forEach((item) => {
        console.log(item);
        if (text === "") {
          filteredList.push(item);
        } else if (
          item.probability.toString().toLowerCase().includes(text.toLowerCase())
        ) {
          filteredList.push(item);
        }
      });
      setFilteredList(filteredList);
    }
  };
  console.log(filteredList);
  return (
    <Container>
      <Wrapper>
        <Table>
          <DownloadCSV>
            Download CSV <i class="bi bi-box-arrow-down"></i>
          </DownloadCSV>
        </Table>
        <Table>
          <LabelContainer>
            <OptionsContainer>
              {" "}
              <Tag
                isClicked={sortBy === "geneID"}
                onClick={() => handleSort("geneID")}
              >
                <i class="bi bi-sort-alpha-down"></i>
              </Tag>
              <SearchContainer>
                <Tag
                  style={{ fontSize: "16px", margin: 0, padding: 0 }}
                  onClick={() => handleSearchClick("GeneID")}
                >
                  <i class="bi bi-search"></i>
                </Tag>
                <SearchInput
                  placeholder="Search..."
                  isClicked={searchClicked === "GeneID"}
                  type="text"
                  onChange={(e) => handleSearch(e, "GeneID")}
                />
              </SearchContainer>
            </OptionsContainer>
            <Label> Gene ID </Label>
          </LabelContainer>
          <LabelContainer>
            <OptionsContainer>
              {" "}
              <Tag
                isClicked={sortBy === "position"}
                onClick={() => handleSort("position")}
              >
                {" "}
                <i class="bi bi-sort-down"></i>
              </Tag>
              <SearchContainer>
                <Tag
                  style={{ fontSize: "16px", margin: 0, padding: 0 }}
                  onClick={() => handleSearchClick("Position")}
                >
                  <i class="bi bi-search"></i>
                </Tag>
                <SearchInput
                  placeholder="Search..."
                  isClicked={searchClicked === "Position"}
                  type="text"
                  onChange={(e) => handleSearch(e, "Position")}
                />
              </SearchContainer>
            </OptionsContainer>
            <Label> Position </Label>
          </LabelContainer>
          <LabelContainer>
            <OptionsContainer>
              {" "}
              <SearchContainer>
                <Tag
                  style={{ fontSize: "16px" }}
                  onClick={() => handleSearchClick("Phosphate")}
                >
                  <i class="bi bi-search"></i>
                </Tag>
                <SearchInput
                  placeholder="Search..."
                  isClicked={searchClicked === "Phosphate"}
                  type="text"
                  onChange={(e) => handleSearch(e, "Phosphate")}
                />
              </SearchContainer>
            </OptionsContainer>
            <Label> Phosphate (+-7) </Label>
          </LabelContainer>

          <LabelContainer>
            <OptionsContainer>
              <Tag
                isClicked={sortBy === "probableKinase"}
                onClick={() => handleSort("probableKinase")}
              >
                <i class="bi bi-sort-alpha-down"></i>
              </Tag>
              <SearchContainer>
                <Tag
                  style={{ fontSize: "16px", margin: 0, padding: 0 }}
                  onClick={() => handleSearchClick("Kinase")}
                >
                  <i class="bi bi-search"></i>
                </Tag>
                <SearchInput
                  placeholder="Search..."
                  isClicked={searchClicked === "Kinase"}
                  type="text"
                  onChange={(e) => handleSearch(e, "Kinase")}
                />
              </SearchContainer>
            </OptionsContainer>
            <Label> Probable Kinase </Label>
          </LabelContainer>
          <LabelContainer>
            <OptionsContainer>
              {" "}
              <Tag
                isClicked={sortBy === "kinaseFamily"}
                onClick={() => handleSort("kinaseFamily")}
              >
                <i class="bi bi-sort-alpha-down"></i>
              </Tag>
              <SearchContainer>
                <Tag
                  style={{ fontSize: "16px", margin: 0, padding: 0 }}
                  onClick={() => handleSearchClick("KinaseFamily")}
                >
                  <i class="bi bi-search"></i>
                </Tag>
                <SearchInput
                  placeholder="Search..."
                  isClicked={searchClicked === "KinaseFamily"}
                  type="text"
                  onChange={(e) => handleSearch(e, "KinaseFamily")}
                />
              </SearchContainer>
            </OptionsContainer>
            <Label> Kinase Family </Label>
          </LabelContainer>
          <LabelContainer>
            <OptionsContainer>
              {" "}
              <Tag
                isClicked={sortBy === "probability"}
                onClick={() => handleSort("probability")}
              >
                <i class="bi bi-sort-down"></i>
              </Tag>
              <SearchContainer>
                <Tag
                  style={{ fontSize: "16px", margin: 0, padding: 0 }}
                  onClick={() => handleSearchClick("Probability")}
                >
                  <i class="bi bi-search"></i>
                </Tag>
                <SearchInput
                  placeholder="Search..."
                  isClicked={searchClicked === "Probability"}
                  type="text"
                  onChange={(e) => handleSearch(e, "Probability")}
                />
              </SearchContainer>
            </OptionsContainer>
            <Label> Probability </Label>
          </LabelContainer>
        </Table>
        <ResultsContainer>
          {filteredList
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
