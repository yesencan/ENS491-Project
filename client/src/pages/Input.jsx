import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import OutputDataContext from "../contexts/OutputDataContext";
import { PulseLoader } from "react-spinners";
import Popup from "reactjs-popup";
import ScanCheckboxGroup from "../components/Launch/Checkbox";

const Tooltip = styled.div`
  background: rgba(135, 135, 135, 0.9);
  width: 15vw;
  padding: 8px;
  border-radius: 5px;
  font-family: "Poppins";
  color: #f7fbff;
  font-size: 14px;
`;
const Container = styled.div`
  width: auto;
  height: auto;
  display: grid;
  background-color: #f7fbff;
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
  background-color: ${(props) => (props.active ? "#97bee5" : "white")};
  cursor: pointer;
  border: 1px solid #f0f0f0;
  border-bottom: none;
  transition: background-color 0.3s;
  &:hover {
    background-color: ${(props) => (props.active ? "#599de1" : "#f0f0f0")};
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
  height: fit-content;
  width: 100%;
  display: flex;
  background-color: white;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  border: 1px solid #f0f0f0;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  overflow-y: auto;
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
  margin-bottom: 10px;
  margin-top: 20px;
  font-family: "Poppins";
  font-size: 14px;
  color: #004990;
  text-decoration: underline;
  text-align: right;
  cursor: pointer;
`;

const InputTextArea = styled.textarea`
  width: 85%;
  height: 70%;
  min-height: 200px;
  margin-bottom: 10px;
  border: 1px solid #f0f0f0;
  border-radius: 5px;
  padding: 10px;
  font-family: "Poppins";
  font-size: 16px;
  resize: none;
  outline: none;
  box-sizing: border-box;
  &::placeholder {
    color: lightgray;
  }
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


const PredictButton = styled.button`
  width: 150px;
  height: 40px;
  margin: 10px;
  font-family: "Poppins";
  font-size: 16px;
  background-color: rgb(0, 73, 144);;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #599de1;
  }
`;

const FileUploadContainer = styled.div`
  width: 85%;
  height: 70px;
  border: 1px solid #f0f0f0;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 0 10px;
  margin: 10px 0;
`;

const UploadButton = styled.button`
  width: 150px;
  height: 40px;
  font-family: "Poppins";
  font-size: 16px;
  background-color: rgb(0, 73, 144);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #599de1;
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

const ErrorMessagePre = styled.pre`
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
  font-size: 14px;
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
  const [omitErrors, setOmitErrors] = useState(true);

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

  const idListTooltipText = `List of UniProt ID's to run prediction on,
   with each ID on a new line. Optionally specify a list 
   of positions to limit prediction.
    Click "Load Sample" to see an example input.`;

  const proteinSeqTooltipText = `List of protein sequences to run prediction on, in FASTA format. 
  Click "Load Sample" to see an example input.`;

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  useEffect(() => setOmitErrors(false), [geneIDInputText, proteinSequenceInputText, uploadedFile])

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
        enableErrorMessage(
          "Invalid file extension. Please select a .fasta file."
        );
        // Optionally, reset the file input to clear the selected file
        event.target.value = null;
      }
    }
  };

  const enableErrorMessage = (msg) => {
    setErrorMessage(msg);
    setErrorOpen(true);
  };

  const handlePredictClick = async () => {
    setIsPredicting(true);

    // Assuming geneIDInputText is a string with genes and positions
    const geneListLines = geneIDInputText.trim().split(/\n+/);
    const geneList = []
    geneListLines.forEach(line => {
      // Split the line by spaces to separate ID from positions
      const parts = line.split(/\s+/);

      // Extract ID and positions
      const id = parts[0];
      const positions = parts.slice(1).filter(pos => /^\d+$/.test(pos)).map(pos => parseInt(pos));

      // Create an object with ID and positions
      const obj = { "gene": id, "positions": positions };

      // Push the object into the resulting array
      geneList.push(obj);
    });
    console.log(geneList)
    const apiEndpoint = "http://127.0.0.1:5000/api/predict/gene-id";

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ geneList: geneList, omitErrors: omitErrors }),
      });

      const data = await response.json();

      if (!response.ok) {
        setOmitErrors(true);
        const error = data["error"];
        switch (error) {
          case "invalid_id_pos":
            if (data["invalid_ids"].length > 0) {
              if (data["invalid_ids"].length > 2) {
                enableErrorMessage(
                  "Invalid UniProt ID(s). Please check: " +
                  data["invalid_ids"].slice(0, 3) +
                  "...\nClick Predict again to ignore invalid input."
                );
              } else {
                enableErrorMessage(
                  "Invalid UniProt ID(s). Please check: " +
                  data["invalid_ids"] + "\nClick Predict again to ignore invalid input."
                );
              }
            } else if (data["invalid_positions"].length > 0) {
              if (data["invalid_positions"].length > 2) {
                enableErrorMessage(
                  "Invalid positions. Please check: " +
                  data["invalid_positions"]
                    .slice(0, 3)
                    .map(function (entry) {
                      return entry.id + " (" + entry.invalid_positions + ") ";
                    })
                    .join(", ") +
                  "...\nClick Predict again to ignore invalid input."
                );
              } else {
                enableErrorMessage(
                  "Invalid positions. Please check: " +
                  data["invalid_positions"]
                    .map(function (entry) {
                      return entry.id + " (" + entry.invalid_positions + ") ";
                    })
                    .join(", ") + "\nClick Predict again to ignore invalid input."
                );
              }
            }

            break;
          case "empty-test-data":
            enableErrorMessage("Input data is empty. This may have caused by omitted input(s).");
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

    if (proteinSequenceInputText) {
      console.log(proteinSequenceInputText);
      if (aminoacids.length === 0) {
        setIsPredicting(false);
        enableErrorMessage("Please select at least one amino acid to scan for.");
        return;
      }
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
              omitErrors
            }),
          }
        );
        const result = await response.json();
        if (!response.ok) {
          setOmitErrors(true);
          console.log(omitErrors)
          const error = result["error"];
          console.log(result["invalid_ids"])
          switch (error) {
            case "invalid_aa_seq":
              if (result["invalid_ids"].length > 2) {
                enableErrorMessage(
                  "Invalid aminoacid sequence. Please check: " +
                  result["invalid_ids"].slice(0, 3) +
                  "...\nClick Predict again to ignore invalid input."
                );
              } else {
                enableErrorMessage(
                  "Invalid aminoacid sequence. Please check: " +
                  result["invalid_ids"] + "\nClick Predict again to ignore invalid input."
                );
              }
              break;

            case "incorrect_format":
              enableErrorMessage(
                "Input data is in incorrect format."
              );
              break;

            case "no_target_selected":
              enableErrorMessage(
                "Please select at least one amino acid to scan for."
              );
              break;

            case "no-site":
              enableErrorMessage(
                "There is no site with selected amino acid(s)."
              );
              break;

            case "short-seq":
              if (result["invalid_ids"].length > 2) {
                enableErrorMessage(
                  "Protein sequences should consist of at least 10 amino acids. Please check: " +
                  result["invalid_ids"].slice(0, 3) +
                  "...\nClick Predict again to ignore invalid input."
                );
              } else {
                enableErrorMessage(
                  "Protein sequences should consist of at least 10 amino acids. Please check: " +
                  result["invalid_ids"] + "\nClick Predict again to ignore invalid input."
                );
              }
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
      enableErrorMessage("Please enter a protein sequence");
    }
  }

  async function handlePredictLoadedFile() {
    setIsPredicting(true);

    const aminoacids = ["S", "T", "Y", "H"].filter((acid, index) => {
      return document.querySelectorAll('input[type="checkbox"]')[index].checked;
    });

    if (uploadedFile) {
      if (aminoacids.length === 0) {
        setIsPredicting(false);
        enableErrorMessage("Please select at least one amino acid to scan for.");
        return;
      }
      // send file to the "/api/predict/sequence-file" endpoint
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append(
        "json",
        new Blob([JSON.stringify({ aminoacids, omitErrors })], { type: "application/json" })
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
          setOmitErrors(true);
          const error = result["error"];
          switch (error) {
            case "invalid_aa_seq":
              if (result["invalid_ids"].length > 2) {
                enableErrorMessage(
                  "Invalid aminoacid sequence. Please check: " +
                  result["invalid_ids"].slice(0, 3) +
                  "...\nClick Predict again to ignore invalid input."
                );
              } else {
                enableErrorMessage(
                  "Invalid aminoacid sequence. Please check: " +
                  response["invalid_ids"] + "\nClick Predict again to ignore invalid input."
                );
              }
              break;

            case "incorrect_format":
              enableErrorMessage(
                "Input data is in incorrect format."
              );
              break;

            case "no_target_selected":
              enableErrorMessage(
                "Please select at least one amino acid to scan for."
              );
              break;

            case "no-site":
              enableErrorMessage(
                "There is no site with selected amino acid(s)."
              );
              break;

            case "short-seq":
              if (result["invalid_ids"].length > 2) {
                enableErrorMessage(
                  "Protein sequences should consist of at least 10 amino acids. Please check: " +
                  result["invalid_ids"].slice(0, 3) +
                  "...\nClick Predict again to ignore invalid input."
                );
              } else {
                enableErrorMessage(
                  "Protein sequences should consist of at least 10 amino acids. Please check: " +
                  result["invalid_ids"] + "\nClick Predict again to ignore invalid input."
                );
              }
              break;

            default:
              enableErrorMessage("Some error occurred. Please try again.");
              break;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setOutputData(result.results);
        console.log("result:", result.results);
        navigate("/results");
        console.log(result);
      } catch (error) {
        setIsPredicting(false);
        console.error("Error predicting sequence from file:", error);
      }
    } else {
      setIsPredicting(false);
      enableErrorMessage("Please upload a file.");
    }
  }
  return (
    <Container>
      {errorOpen ? <ErrorMessagePre>{errorMessage}</ErrorMessagePre> : null}
      <TabContainer>
        <Tab active={activeTab === 1} onClick={() => handleTabClick(1)}>
          Uniprot ID
        </Tab>
        <Tab active={activeTab === 2} onClick={() => handleTabClick(2)}>
          Protein Sequence
        </Tab>
        <Tab active={activeTab === 3} onClick={() => handleTabClick(3)}>
          Fasta File
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
                <Popup
                  trigger={() => <InputLabel>Gene ID List</InputLabel>}
                  position="top"
                  on={["hover", "focus"]}
                  closeOnDocumentClick
                >
                  <Tooltip> {idListTooltipText} </Tooltip>
                </Popup>
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
                <Popup
                  trigger={() => <InputLabel>Protein Sequence(s)</InputLabel>}
                  position="top"
                  on={["hover", "focus"]}
                  closeOnDocumentClick
                >
                  <Tooltip> {proteinSeqTooltipText} </Tooltip>
                </Popup>
                <InputTextArea
                  autoFocus
                  placeholder={proteinSequencePlaceholderText}
                  value={proteinSequenceInputText}
                  onChange={(e) => setProteinSequenceInputText(e.target.value)}
                />
              </Row>
              <Row>
                <ScanCheckboxGroup />
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
        {activeTab === 3 && (
          <Col>
            <Row style={{marginTop: "30px"}}>
                <LabelCentered>Upload <br/> Fasta File</LabelCentered>

                <FileUploadContainer>
                  <UploadButton onClick={handleFileUpload}>
                    Select File
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
                <ScanCheckboxGroup />
              </Row>
              <Row>
                <PredictButton
                  onClick={handlePredictLoadedFile}
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
        )}
      </ContentArea>
    </Container>
  );
};

export default InputPage;
