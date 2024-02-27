import React, { useState } from "react";
import styled from "styled-components";
import { useRef } from 'react';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 70px; // padding to account for the fixed navbar
`;

const TabContainer = styled.div`
  width: 80%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
`;

const Tab = styled.div`
  flex: 1;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.active ? "lightblue" : "white")};
  cursor: pointer;
  border: 1px solid lightblue;
  border-radius: 5px;
  transition: background-color 0.3s;
  &:hover {
    background-color: ${(props) => (props.active ? "lightblue" : "#f0f0f0")};
  }
  font-family: "Poppins";
  font-size: 14px;
  color: black;
`;

const ContentArea = styled.div`
  height: fit-content; /* Expand based on content */
  max-height: 1500px; /* Set a maximum height if needed */
  width: 80%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  border: 1px solid lightblue;
  border-radius: 5px;
  overflow-y: auto; /* Add scrollbar if content overflows vertically */
`;

const InputLabel = styled.div`
  font-family: "Poppins";
  font-size: 14px;
  color: black;
`;

const LoadSampleLink = styled.a`
  margin-left: auto;
  margin-right: 10px;
  font-family: "Poppins";
  font-size: 14px;
  color: blue;
  text-decoration: underline;
  text-align: right;
  cursor: pointer;
`;

const InputTextArea = styled.textarea`
  width: 90%;
  height: 70%;
  min-height: 200px;
  margin: 10px;
  border: 1px solid lightblue; /* Add border style here */
  border-radius: 5px;
  padding: 10px; /* Add padding for better visual appearance */
  font-family: "Poppins";
  font-size: 16px;
  resize: none;
`;

const geneIDPlaceholderText = `P05198 52 105 267
P83268 51
P05198
P22455 754
P24928 1616 1619`;

const proteinSequencePlaceholderText = `>TP53
MEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDPGPDEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSSSVPSQKTYQGSYGFRLGFLHSGTAKSVTCTYSPALNKMFCQLAKTCPVQLWVDSTPPPGTRVRAMAIYKQSQHMTEVVRRCPHHER
>CTNNB1
MATQADLMELDMAMEPDRKAAVSHWQQQSYLDSGIHSGATTTAPSLSGKGNPEEEDVDTSQVLYEWEQGFSQSFTQEQVADIDGQYAMTRAQRVRAAMFPETLDEGMQIPSTQFDAAHPTNVQRLAEPSQMLKHAVVNLINYQDDAELATRAIPELTKLLNDEDQVVVNKAAVMVHQLSKK`;

const SeparatorText = styled.div`
  font-family: "Poppins";
  font-size: 14px;
  color: black;
`;

const CheckboxContainer = styled.div`
  display: flex;
  margin-top: 20px;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
`;

const CheckboxLabel = styled.label`
  font-family: "Poppins";
  font-size: 14px;
  color: black;
`;

const Checkbox = styled.input`
    width: 20px;
    height: 20px;
  margin-top: 5px;
`;

const PredictButton = styled.button`
  width: 150px;
  height: 40px;
  margin: 10px;
  font-family: "Poppins";
  font-size: 16px;
  background-color: orange;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #ff8c00;
  }
`;

const FileUploadContainer = styled.div`
  width: 50%;
  height: 70px;
  margin: 10px;
  border: 1px solid lightblue; /* Add border style here */
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px; /* Adjust padding for better spacing */
`;

const UploadButton = styled.button`
  width: 150px;
  height: 40px;
  font-family: "Poppins";
  font-size: 16px;
  background-color: orange;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #ff8c00;
  }
`;

const UploadedFileName = styled.div`
  padding: 10px;
  font-family: "Poppins";
  font-size: 14px;
`;
const Col = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  margin-bottom: 10px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 10px;
`;

const InputPage = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [geneIDInputText, setGeneIdInputText] = useState("");
  const [proteinSequenceInputText, setProteinSequenceInputText] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const hiddenFileInput = useRef(null);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  const handleLoadSample = () => {
    // Load sample data into the input text area
    switch (activeTab) {
      case 1:
        setGeneIdInputText(geneIDPlaceholderText);
        break;
      case 2:
        setProteinSequenceInputText(proteinSequencePlaceholderText);
        break;
      default:
        break;
    }
  };

  const handleFileUpload = (e) => {
    // Handle file upload logic here
    hiddenFileInput.current.click();
  };

  const handleFileChange = event => {
    const fileUploaded = event.target.files[0];

    if (fileUploaded) {
      // Check if the file extension is ".fasta"
      const validExtensions = [".fasta"];
      const isValidExtension = validExtensions.some((ext) => fileUploaded.name.toLowerCase().endsWith(ext));

      if (isValidExtension) {
        // Valid file extension, proceed with handling the file
        setUploadedFile(fileUploaded);
      } else {
        // Invalid file extension, show an error message or take appropriate action
        alert("Invalid file extension. Please select a .fasta file.");
        // Optionally, reset the file input to clear the selected file
        event.target.value = null;
      }
    }
  };

  const handlePredictClick = () => {
    // Handle the predict button click logic here
    console.log("Predict button clicked!");
  };

  return (
    <Container>
      <TabContainer>
        <Tab active={activeTab === 1} onClick={() => handleTabClick(1)}>
          Gene ID
        </Tab>
        <Tab active={activeTab === 2} onClick={() => handleTabClick(2)}>
          Protein Sequence
        </Tab>
      </TabContainer>
      <ContentArea>
        {activeTab === 1 && (
          <>
            <Col>
              <Row>
                <LoadSampleLink onClick={handleLoadSample}>Load Sample</LoadSampleLink>
              </Row>
              <Row>
                <InputLabel>Gene ID List</InputLabel>
                <InputTextArea
                  placeholder={geneIDPlaceholderText}
                  value={geneIDInputText}
                  onChange={(e) => setGeneIdInputText(e.target.value)}
                />
              </Row>
              <Row>
                <PredictButton onClick={handlePredictClick}>Predict</PredictButton>
              </Row>
            </Col>
          </>
        )}
        {activeTab === 2 && (
          <>
            <Col>
              <Row>
                <LoadSampleLink onClick={handleLoadSample}>Load Sample</LoadSampleLink>
              </Row>
              <Row>
                <InputLabel>Protein Sequence</InputLabel>
                <InputTextArea
                  placeholder={proteinSequencePlaceholderText}
                  value={proteinSequenceInputText}
                  onChange={(e) => setProteinSequenceInputText(e.target.value)} />
              </Row>
              <Row>
                <SeparatorText>or</SeparatorText>
              </Row>
              <Row>
                <FileUploadContainer>
                  <UploadButton onClick={handleFileUpload}>
                    Upload File
                    <input type="file" accept=".fasta" ref={hiddenFileInput} onChange={handleFileChange} style={{ display: "none" }} />
                  </UploadButton>
                  <UploadedFileName>{uploadedFile ? uploadedFile.name : ""}</UploadedFileName>
                </FileUploadContainer>
              </Row>
              <Row>
                <CheckboxContainer>
                  <CheckboxWrapper>
                    <CheckboxLabel>Serine</CheckboxLabel>
                    <Checkbox type="checkbox" />
                  </CheckboxWrapper>
                  <CheckboxWrapper>
                    <CheckboxLabel>Threonine</CheckboxLabel>
                    <Checkbox type="checkbox" />
                  </CheckboxWrapper>
                  <CheckboxWrapper>
                    <CheckboxLabel>Tyrosine</CheckboxLabel>
                    <Checkbox type="checkbox" />
                  </CheckboxWrapper>
                  <CheckboxWrapper>
                    <CheckboxLabel>Histidine</CheckboxLabel>
                    <Checkbox type="checkbox" />
                  </CheckboxWrapper>
                </CheckboxContainer>
              </Row>
              <Row>
                <PredictButton onClick={handlePredictClick}>Predict</PredictButton>
              </Row>
            </Col>
          </>
        )}
      </ContentArea>
    </Container>
  );
};

export default InputPage;
