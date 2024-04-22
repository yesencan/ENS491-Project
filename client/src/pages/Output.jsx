import React, { useState } from "react";
import { useContext } from "react";
import styled, { keyframes } from "styled-components";
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
  display: grid;
  grid-template-columns: 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5%;
  grid-template-rows: 70px 70px 70px calc(100% - 210px);
`;

const DownloadCSVContainer = styled.div`
  grid-column: 7 / 8;
  grid-row: 2 / 3;
  display: flex;
  align-items: center;
  justify-content: right;
`;

const DownloadCSV = styled.button`
  width: 160px;
  height: 30px;
  border: 2px solid orange;
  color: black;
  background-color: white;
  font-size: 14px;
  transition: 0.2s all;
  cursor: pointer;
  &:hover {
    color: white;
    background-color: orange;
  }
`;

const Table = styled.div`
  grid-column: 2 / 8;
  grid-row: 3 / 4;
  display: flex;
  box-sizing: border-box;
  font-family: "Roboto";
  font-size: 16px;
  border-right: 5px solid orange;
  border-left: 5px solid orange;
`;

const LabelContainer = styled.div`
  width: calc(100% / 6);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Roboto";
  font-weight: bold;
  font-size: 14px;
  color: black;
  flex-direction: column;
  border-top: 0.5px solid lightgray;
  border-right: ${(props) =>
    props.id === 5 ? "0.5px solid white" : "0.5px solid lightgray"};
`;

const Label = styled.div`
  width: 100%;
  display: flex;
  justify-content: left;
  align-items: center;
  padding-left: 20px;
  box-sizing: border-box;
`;

const OptionsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: left;
  align-items: center;
  padding-left: 20px;
  box-sizing: border-box;
`;

const Tag = styled.button`
  width: auto;
  height: 30px;
  padding: 0;
  margin-right: 5px;
  display: flex;
  border: none;
  align-items: center;
  justify-content: left;
  color: ${(props) => (props.isClicked ? "orange" : "black")};
  font-family: "Roboto";
  font-size: 20px;
  background-color: transparent;
  transition: 0.2s all;
  user-select: none;
  cursor: pointer;
  &:hover {
    transform: translateY(-2px);
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

const ResultsContainer = styled.div`
  grid-column: 2 / 8;
  grid-row: 4 / end;
  overflow-y: auto;
  position: relative;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Row = styled.div`
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  background-color: ${(props) => props.bgColor};
  font-family: "Roboto";
  display: flex;
  opacity: 0;
  animation: ${FadeInAnimation} 1s ease forwards;
  animation-delay: ${(props) => props.idx * 0.1}s;
  border-right: 5px solid orange;
  border-left: 5px solid orange;
`;

const Data = styled.div`
  width: calc(100% / 6);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: left;
  color: black;
  font-size: 14px;
  box-sizing: border-box;
  font-family: "Roboto";
  border-right: 0.5px solid lightgray;
  padding: 0 20px;
`;

const Letter = styled.span`
  width: ${(props) => (props.idx === 7 ? "5px" : "2px")};
  flex: ${(props) => (props.idx === 7 ? "2" : "1")};
  font-size: ${(props) => (props.idx === 7 ? "40px" : "12px")};
  color: ${(props) => (props.idx === 7 ? "gray" : "black")};
  margin: ${(props) => (props.idx === 7 ? "0 3px 0 3px" : "0")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Roboto";
  &:hover {
  }
`;

const Probability = styled.div`
  width: calc(100% / 6);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: left;
  color: ${(props) =>
    props.probability > 0.8
      ? "green"
      : props.probability > 0.5
        ? "orange"
        : "red"};
  font-size: 14px;
  font-weight: 700;
  box-sizing: border-box;
  padding: 0 20px;
`;

const Output = () => {
  const { outputData } = useContext(OutputDataContext);
  const getRowKey = (item, idx) => `${idx}-${sortOrder.sortBy}`;
  const [searchClicked, setSearchClicked] = useState("");
  const [filteredList, setFilteredList] = useState(outputData);
  const [sortOrder, setSortOrder] = useState({
    sortBy: "",
    ascending: true,
  });

  const handleSort = (sortBy) => {
    if (sortOrder.sortBy === sortBy) {
      setSortOrder({
        sortBy,
        ascending: !sortOrder.ascending,
      });
    } else {
      setSortOrder({
        sortBy,
        ascending: true,
      });
    }
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
  return (
    <Container>
      <DownloadCSVContainer>
        <DownloadCSV>
          Download CSV <i class="bi bi-box-arrow-down"></i>
        </DownloadCSV>
      </DownloadCSVContainer>

      <Table></Table>
      <Table>
        <LabelContainer id={0}>
          <OptionsContainer>
            {" "}
            <Tag
              isClicked={sortOrder.sortBy === "geneID"}
              onClick={() => handleSort("geneID")}
            >
              {sortOrder.ascending && sortOrder.sortBy === "geneID" ? (
                <i class="bi bi-sort-alpha-down"></i>
              ) : (
                <i class="bi bi-sort-alpha-up"></i>
              )}
            </Tag>
            <SearchContainer>
              <Tag
                style={{ fontSize: "16px", margin: 0, padding: 0 }}
                onClick={() => handleSearchClick("GeneID")}
              >
                <i class="bi bi-search"></i>
              </Tag>
              <SearchInput
                autoFocus
                placeholder="Search..."
                isClicked={searchClicked === "GeneID"}
                type="text"
                onChange={(e) => handleSearch(e, "GeneID")}
              />
            </SearchContainer>
          </OptionsContainer>
          <Label> Gene ID </Label>
        </LabelContainer>
        <LabelContainer id={1}>
          <OptionsContainer>
            {" "}
            <Tag
              isClicked={sortOrder.sortBy === "position"}
              onClick={() => handleSort("position")}
            >
              {sortOrder.ascending && sortOrder.sortBy === "position" ? (
                <i class="bi bi-sort-down"></i>
              ) : (
                <i class="bi bi-sort-up"></i>
              )}
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
        <LabelContainer id={2}>
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

        <LabelContainer id={3}>
          <OptionsContainer>
            <Tag
              isClicked={sortOrder.sortBy === "probableKinase"}
              onClick={() => handleSort("probableKinase")}
            >
              {sortOrder.ascending && sortOrder.sortBy === "probableKinase" ? (
                <i class="bi bi-sort-alpha-down"></i>
              ) : (
                <i class="bi bi-sort-alpha-up"></i>
              )}
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
        <LabelContainer id={4}>
          <OptionsContainer>
            {" "}
            <Tag
              isClicked={sortOrder.sortBy === "kinaseFamily"}
              onClick={() => handleSort("kinaseFamily")}
            >
              {sortOrder.ascending && sortOrder.sortBy === "kinaseFamily" ? (
                <i class="bi bi-sort-alpha-down"></i>
              ) : (
                <i class="bi bi-sort-alpha-up"></i>
              )}
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
        <LabelContainer id={5}>
          <OptionsContainer>
            {" "}
            <Tag
              isClicked={sortOrder.sortBy === "probability"}
              onClick={() => handleSort("probability")}
            >
              {sortOrder.ascending && sortOrder.sortBy === "probability" ? (
                <i class="bi bi-sort-down"></i>
              ) : (
                <i class="bi bi-sort-up"></i>
              )}
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
            if (sortOrder.sortBy === "probability") {
              return sortOrder.ascending
                ? parseFloat(a.probability) - parseFloat(b.probability)
                : parseFloat(b.probability) - parseFloat(a.probability);
            }
            if (sortOrder.sortBy === "position") {
              return sortOrder.ascending
                ? parseFloat(a.position) - parseFloat(b.position)
                : parseFloat(b.position) - parseFloat(a.position);
            }
            if (sortOrder.sortBy === "geneID") {
              return sortOrder.ascending
                ? a.geneId.localeCompare(b.geneId)
                : b.geneId.localeCompare(a.geneId);
            }
            if (sortOrder.sortBy === "probableKinase") {
              return sortOrder.ascending
                ? a.probKinase.localeCompare(b.probKinase)
                : b.probKinase.localeCompare(a.probKinase);
            }
            if (sortOrder.sortBy === "kinaseFamily") {
              return sortOrder.ascending
                ? a.kinaseFamily.localeCompare(b.kinaseFamily)
                : b.kinaseFamily.localeCompare(a.kinaseFamily);
            }
            return 0;
          })
          .map((item, idx) => (
            <Row
              key={getRowKey(item, idx)}
              idx={idx}
              bgColor={idx % 2 === 0 ? "#ffa60045" : "#ffa60026"}
            >
              <Data>{item.geneId}</Data>
              <Data>{item.position}</Data>
              <Data>
                {item.proteinSeq.split("").map((letter, idx) => (
                  <Letter key={idx} idx={idx}>
                    {letter}
                  </Letter>
                ))}
              </Data>
              <Data>{item.probKinase}</Data>
              <Data>{item.kinaseFamily}</Data>
              <Probability probability={parseFloat(item.probability)}>
                {item.probability} <span style={{ fontSize: "24px" }}></span>
              </Probability>
            </Row>
          ))}
      </ResultsContainer>
    </Container>
  );
};

export default Output;
