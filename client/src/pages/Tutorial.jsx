import React from "react";
import styled from "styled-components";

const PageContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5%;
`;

const ContentContainer = styled.div`
  font-family: "Arial", sans-serif;
  
  color: #333;
  padding: 60px 0 0 0;
  background-color: #f7fbff;
  grid-column: 3 / 7;
`;

const Section = styled.section`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-top: 30px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const SectionTitle = styled.h3`
  color: #004990;
  margin: 0 !important;
`;

const Paragraph = styled.p`
  color: #424242;
  line-height: 1.6;
  margin: 0;
  margin-top: 15px;
`;
const CodeBlock = styled.pre`
  background-color: #ebf0f1;
  color: #7b898a;
  border: 1px solid #cccccc;
  margin: 10px 40px;
  padding: 10px;
  border-radius: 6px;
`
const TutorialPage = () => {
  return (
    <PageContainer>
      <ContentContainer>
        <Section>
          <Paragraph style={{ marginTop: 0 }}>
            DeepKinZero, built on top of the model with the same name, is a web service that predicts kinases acting on a phosphorylation site in a protein sequence.
            DeepKinZero transfers knowledge from kinases with many known target phosphosites to those kinases with no known sites through a zero-shot learning model, to enable prediction of these unknown kinases.
          </Paragraph>
        </Section>
        <Section>
          <SectionTitle>How to use DeepKinZero?</SectionTitle>
          <Paragraph>There are three ways to input query proteins to DeepKinZero:</Paragraph>
          <Paragraph>
            1. UniProt ID List. Each UniProt ID should be on a new line. A list of positions can be provided for each UniProt ID, separated by spaces, to limit the prediction to these positions. If no positions are provided, prediction will run on all possible positions suitable for phosphorylation. An example:
            <CodeBlock>
              P05198 5 86 91 <br />
              P83268 48<br />
              P05198<br />
              P22455 67<br />
              P24928 79 103<br />
            </CodeBlock>
          </Paragraph>
          <Paragraph>
            2. Protein Sequence. A protein sequence can be input directly. The sequence should be in the FASTA format. Additionally, prediction can be limited to a subset of the four amino acids suitable for phosphorylation (Serine (S), Threonine (T), Tyrosine (Y), Histidine (H)). An example:
            <CodeBlock>
              {'>'}sp|P04439|HLAA_HUMAN<br />
              MAVMAPRTLLLLLSGALALTQTWAGSHSMRYFFTSVSRPGRGEPRFIAVGYVDD<br />
              TQFVRFDSDAASQRMEPRAPWIEQEGPEYWDQETRNVKAQSQTDRVDLGTLRGY<br />
              YNQSEAGSHTIQIMYGCDVGSDGRFLRGYRQDAYDGKDYIALNEDLRSWTAADM<br />
              AAQITKRKWEAAHEAEQLRAYLDGTCVEWLRRYLENGKETLQRTDPPKTHMTHH<br />
              PISDHEATLRCWALGFYPAEITLTWQRDGEDQTQDTELVETRPAGDGTFQKWAA<br />
              VVVPSGEEQRYTCHVQHEGLPKPLTLRWELSSQPTIPIVGIIAGLVLLGAVITG<br />
              AVVAAVMWRRKSSDRKGGSYTQAASSDSAQGSDVSLTACKV
            </CodeBlock>
          </Paragraph>
          <Paragraph>
            3. FASTA File. The file may contain one or more protein sequences in the FASTA format. Prediction can be limited to a subset of the four amino acids similar to protein sequence input.
          </Paragraph>
        </Section>
        <Section style={{ marginBottom: "20px" }}>
          <SectionTitle>How to interpret the results?</SectionTitle>
          <Paragraph>
            The results are presented in a table. You may choose to display 1, 3 or 5 predictions for each phosphosite in the dropdown menu above the results table. The results table has the following columns:
          </Paragraph>
          <Paragraph>
            1. ID: The identifier of the query protein. If this is a UniProt ID, a link to the UniProt page is provided.
          </Paragraph>
          <Paragraph>
            2. Position: The position of the phosphorylation site in the protein sequence.
          </Paragraph>
          <Paragraph>
            3. Phosphosite (±7): The sequence of the phosphorylation site, with the phosphorylated amino acid in the center and the surrounding amino acids within a window of ±7 amino acids.
          </Paragraph>
          <Paragraph>
            4. Probable Kinase: The kinase predicted to act on the phosphorylation site. If more than one prediction is chosen to be displayed, the kinases are presented in separate rows within the row. The predictions of one phosphosite are sorted in a descending order with respect to their prediction probabilities. The kinase name is a link to the UniProt page of the kinase.
          </Paragraph>
          <Paragraph>
            5. Kinase Family: The family of the kinase predicted to act on the phosphorylation site.
          </Paragraph>
          <Paragraph>
            6. Probability: The probability of the kinase acting on the phosphorylation site.
          </Paragraph>
        </Section>
      </ContentContainer>
    </PageContainer>
  );
};

export default TutorialPage;