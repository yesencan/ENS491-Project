import React, { useState } from "react";
import styled from "styled-components";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import OutputDataContext from "../contexts/OutputDataContext";
import { PulseLoader } from "react-spinners";
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5%;
  grid-template-rows: 70px 70px 40px calc(33% - 30px) calc(33% - 30px) calc(
      33% - 30px
    );
`;

const TabContainer = styled.div`
  grid-column: 3 / 7;
  grid-row: 3 / 4;
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
`;

const Tab = styled.div`
  flex: 1;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.active ? "lightblue" : "white")};
  cursor: pointer;
  border: 1px solid lightblue;
  border-bottom: none;
  transition: background-color 0.3s;
  &:hover {
    background-color: ${(props) => (props.active ? "lightblue" : "#f0f0f0")};
  }
  &:first-child {
    border-top-left-radius: 5px;
  }
  &:last-child {
    border-top-right-radius: 5px;
  }
  font-family: "Poppins";
  font-size: 14px;
  color: black;
`;

const ContentArea = styled.div`
  grid-column: 3 / 7;
  grid-row: 4 / 6;
  box-sizing: border-box;
  height: fit-content; /* Expand based on content */
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  border: 1px solid lightblue;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  overflow-y: auto; /* Add scrollbar if content overflows vertically */
`;

const InputLabel = styled.div`
  font-family: "Poppins";
  font-size: 14px;
  color: black;
  width: 15%;
  height: 100%;
  text-align: end;
  margin-right: 10px;
  overflow-wrap: break-word;
  z-index: 99;
`;

const LoadSampleLink = styled.a`
  margin-left: auto;
  margin-right: 10px;
  margin-top: 20px;
  font-family: "Poppins";
  font-size: 14px;
  color: blue;
  text-decoration: underline;
  text-align: right;
  cursor: pointer;
`;

const InputTextArea = styled.textarea`
  width: 85%;
  height: 70%;
  min-height: 200px;
  margin-bottom: 10px;
  border: 1px solid lightblue; /* Add border style here */
  border-radius: 5px;
  padding: 10px; /* Add padding for better visual appearance */
  font-family: "Poppins";
  font-size: 16px;
  resize: none;
  outline: none;
  box-sizing: border-box;
  &::placeholder {
    color: lightgray;
  }
`;

const SeparatorText = styled.div`
  font-family: "Poppins";
  font-size: 14px;
  color: black;
`;

const LabelCentered = styled.div`
  width: 15%;
  font-family: "Poppins";
  display: flex;
  justify-content: end;
  text-align: end;
  font-size: 14px;
  margin-right: 10px;
  overflow-wrap: break-word;
`;

const CheckboxContainer = styled.div`
  width: 85%;
  padding: 10px;
  display: flex;
  justify-content: space-evenly;
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
  width: 85%;
  height: 70px;
  border: 1px solid lightblue; /* Add border style here */
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 0 10px; /* Adjust padding for better spacing */
  margin: 10px 0;
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
  margin-left: 10px;
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
`;

const ErrorMessageDiv = styled.div`
  grid-column: 3 / 7;
  grid-row: 2 / 3;
  width: 100%;
  margin: 5px 0;
  box-sizing: border-box;
  border-radius: 5px;
  border-left: 5px solid red;
  color: red;
  background-color: #f7d5d5;
  display: flex;
  align-items: center;
  padding-left: 20px;
  font-family: "Roboto";
`;

const InputPage = () => {
  let navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);
  const [geneIDInputText, setGeneIdInputText] = useState("");
  const [proteinSequenceInputText, setProteinSequenceInputText] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPredicting, setIsPredicting] = useState(false);

  const hiddenFileInput = useRef(null);
  const { setOutputData } = useContext(OutputDataContext);
  const geneIDPlaceholderText = `P05198 5 86 91
P83268 48
P05198
P22455 67
P24928 79 103`;

  const proteinSequencePlaceholderText = `>TP53
MEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDPGPDEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSSSVPSQKTYQGSYGFRLGFLHSGTAKSVTCTYSPALNKMFCQLAKTCPVQLWVDSTPPPGTRVRAMAIYKQSQHMTEVVRRCPHHER
>CTNNB1
MATQADLMELDMAMEPDRKAAVSHWQQQSYLDSGIHSGATTTAPSLSGKGNPEEEDVDTSQVLYEWEQGFSQSFTQEQVADIDGQYAMTRAQRVRAAMFPETLDEGMQIPSTQFDAAHPTNVQRLAEPSQMLKHAVVNLINYQDDAELATRAIPELTKLLNDEDQVVVNKAAVMVHQLSKK`;

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

  const handleFileChange = (event) => {
    const fileUploaded = event.target.files[0];

    if (fileUploaded) {
      // Check if the file extension is ".fasta"
      const validExtensions = [".fasta"];
      const isValidExtension = validExtensions.some((ext) =>
        fileUploaded.name.toLowerCase().endsWith(ext)
      );

      if (isValidExtension) {
        // Valid file extension, proceed with handling the file
        setUploadedFile(fileUploaded);
      } else {
        // Invalid file extension, show an error message or take appropriate action
        enableErrorMessage("Invalid file extension. Please select a .fasta file.");
        // Optionally, reset the file input to clear the selected file
        event.target.value = null;
      }
    }
  };

  const enableErrorMessage = (msg) => {
    setErrorMessage(msg);
    setErrorOpen(true);
    setTimeout(() => {
      setErrorOpen(false);
    }, 3500);
  };

  const handlePredictClick = async () => {
    setIsPredicting(true);

    const parseGeneListInput = (geneListInput) => {
      const geneList = [];
      let currentGene = null;

      geneListInput.forEach((item) => {
        if (/^P\d+$/.test(item)) {
          currentGene = { gene: item, positions: [] };
          geneList.push(currentGene);
        } else if (/^\d+$/.test(item) && currentGene !== null) {
          // position, add to the current gene
          currentGene.positions.push(parseInt(item));
        }
      });

      return geneList;
    };

    // Assuming geneIDInputText is a string with genes and positions
    const geneListInput = geneIDInputText.trim().split(/\s+/);
    console.log(geneListInput);
    const geneList = parseGeneListInput(geneListInput);
    console.log(geneList);

    const apiEndpoint = "http://127.0.0.1:5000/api/predict/gene-id";

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ geneList: geneList }),
      });

      const data = await response.json();

      if (!response.ok) {
        const error = data["error"];
        switch (error) {
          case "invalid_id_pos":
            if (data["invalid_ids"].length > 0) {
              if (data["invalid_ids"].length > 2) {
                enableErrorMessage(
                  "Invalid UniProt ID or positions. Please check: " +
                  data["invalid_ids"].slice(0, 3) +
                  "..."
                );
              } else {
                enableErrorMessage(
                  "Invalid UniProt ID or positions. Please check: " +
                  data["invalid_ids"]
                );
              }
            }
            else if (data["invalid_positions"].length > 0) {
              if (data["invalid_positions"].length > 2) {
                enableErrorMessage(
                  "Invalid UniProt ID or positions. Please check: " +
                  data["invalid_positions"].slice(0, 3).map(function (entry) {
                    return entry.id + " (" + entry.invalid_positions + ") ";
                  }).join(", ") +
                  "..."
                );
              } else {
                enableErrorMessage(
                  "Invalid UniProt ID or positions. Please check: " +
                  data["invalid_positions"].map(function (entry) {
                    return entry.id + " (" + entry.invalid_positions + ") ";
                  }).join(", ")
                );
              }
            }


            break;
          case "empty-test-data":
            enableErrorMessage("Input data is empty.");
            break;

          case "invalid-aa-seq":
            enableErrorMessage("Invalid amino acid sequence.");
            break;

          case "incorrect_format":
            enableErrorMessage(
              "Input data is in incorrect format or there is no site with selected amino acid(s)."
            );
            break;

          default:
            enableErrorMessage("Some error occurred. Please try again.");
            break;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setOutputData(data.results);
      navigate("/results");
      console.log("sevval", data.results);
    } catch (error) {
      setIsPredicting(false);
      console.error("There was an error with the prediction request:", error);
    }
  };

  async function handlePredictClick2() {
    setIsPredicting(true);
    const aminoacids = ["S", "T", "Y", "H"].filter((acid, index) => {
      return document.querySelectorAll('input[type="checkbox"]')[index].checked;
    });

    // check if user uploaded a file or entered as text
    if (uploadedFile) {
      // send file to the "/api/predict/sequence-file" endpoint
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append(
        "json",
        new Blob([JSON.stringify({ aminoacids })], { type: "application/json" })
      );

      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/predict/sequence-file",
          {
            method: "POST",
            body: formData,
          }
        );
        const result = await response.json();

        if (!response.ok) {
          const error = result["error"];
          switch (error) {
            case "invalid_aa_seq":
              enableErrorMessage("Invalid aminoacid sequence.");
              break;

            case "incorrect_format":
              enableErrorMessage(
                "Input data is in incorrect format or there is no site with selected amino acid(s)."
              );
              break;

            default:
              enableErrorMessage("Some error occurred. Please try again.");
              break;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setOutputData(result.results);
        navigate("/results");
        console.log(result);
      } catch (error) {
        setIsPredicting(false);
        console.error("Error predicting sequence from file:", error);
      }
    } else if (proteinSequenceInputText) {
      console.log(proteinSequenceInputText);
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/predict/sequence-string",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fasta: proteinSequenceInputText,
              aminoacids,
            }),
          }
        );
        const result = await response.json();
        if (!response.ok) {
          const error = result["error"];
          switch (error) {
            case "invalid_aa_seq":
              enableErrorMessage("Invalid aminoacid sequence.");
              break;

            case "incorrect_format":
              enableErrorMessage(
                "Input data is in incorrect format or there is no site with selected amino acid(s)."
              );
              break;

            default:
              enableErrorMessage("Some error occurred. Please try again.");
              break;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setOutputData(result.results); // This updates the context
        navigate("/results");
        console.log("eb", result);
      } catch (error) {
        setIsPredicting(false);
        console.error("Error predicting sequence from text:", error);
      }
    } else {
      setIsPredicting(false);
      enableErrorMessage("Please enter a protein sequence or upload a file.");
    }
  }
  return (
    <Container>
      {errorOpen ? <ErrorMessageDiv>{errorMessage}</ErrorMessageDiv> : null}
      <TabContainer>
        <Tab active={activeTab === 1} onClick={() => handleTabClick(1)}>
          Uniprot ID
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
                <LoadSampleLink onClick={handleLoadSample}>
                  Load Sample
                </LoadSampleLink>
              </Row>
              <Row>
                <InputLabel>UniProt ID List</InputLabel>
                <InputTextArea
                  autoFocus
                  placeholder={geneIDPlaceholderText}
                  value={geneIDInputText}
                  onChange={(e) => setGeneIdInputText(e.target.value)}
                />
              </Row>
              <Row>
                <PredictButton
                  onClick={handlePredictClick}
                  disabled={isPredicting}
                >
                  {isPredicting ? (
                    <PulseLoader color="hsla(168, 0%, 100%, 1)" size={8} />
                  ) : (
                    "Predict"
                  )}
                </PredictButton>
              </Row>
            </Col>
          </>
        )}
        {activeTab === 2 && (
          <>
            <Col>
              <Row>
                <LoadSampleLink onClick={handleLoadSample}>
                  Load Sample
                </LoadSampleLink>
              </Row>
              <Row>
                <InputLabel>Protein Sequence</InputLabel>
                <InputTextArea
                  autoFocus
                  placeholder={proteinSequencePlaceholderText}
                  value={proteinSequenceInputText}
                  onChange={(e) => setProteinSequenceInputText(e.target.value)}
                />
              </Row>
              <Row>
                <SeparatorText>or</SeparatorText>
              </Row>
              <Row>
                <LabelCentered>Fasta File</LabelCentered>

                <FileUploadContainer>
                  <UploadButton onClick={handleFileUpload}>
                    Upload File
                    <input
                      type="file"
                      accept=".fasta"
                      ref={hiddenFileInput}
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </UploadButton>
                  <UploadedFileName>
                    {uploadedFile ? uploadedFile.name : ""}
                  </UploadedFileName>
                </FileUploadContainer>
              </Row>
              <Row>
                <LabelCentered>Scan For:</LabelCentered>
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
                <PredictButton
                  onClick={handlePredictClick2}
                  disabled={isPredicting}
                >
                  {isPredicting ? (
                    <PulseLoader color="hsla(168, 0%, 100%, 1)" size={8} />
                  ) : (
                    "Predict"
                  )}
                </PredictButton>
              </Row>
            </Col>
          </>
        )}
      </ContentArea>
    </Container>
  );
};

export default InputPage;
