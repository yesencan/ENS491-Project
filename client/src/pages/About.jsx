import React from "react";
import styled from "styled-components";

const PageContainer = styled.div`
  font-family: "Roboto", sans-serif;
  color: #333;
  padding: 80px 50px 50px;
  background-color: #f7fbff;
`;

const Title = styled.h1`
  color: #004990;
  margin-bottom: 20px;
`;

const Subtitle = styled.h2`
  color: #97bee5;
  margin-bottom: 20px;
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

const KinaseSection = styled.div`
  background-color: #f6f6f6;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 20px;
  margin-top: 20px;
`;

const AboutPage = () => {
  return (
    <PageContainer>
      <Subtitle>Zero-shot learning for predicting kinase-phosphosite associations involving understudied kinases</Subtitle>
      <Section>
        <SectionTitle>What is DeepKinZero?</SectionTitle>
        <Paragraph>
          We present DeepKinZero, the first zero-shot learning approach to predict the kinase acting on a phosphosite for kinases with no known phosphosite information. DeepKinZero transfers knowledge from kinases with many known target phosphosites to those kinases with no known sites through a zero-shot learning model. The kinase-specific positional amino acid preferences are learned using a bidirectional recurrent neural network. We show that DeepKinZero achieves significant improvement in accuracy for kinases with no known phosphosites in comparison to the baseline model and other methods available. By expanding our knowledge on understudied kinases, DeepKinZero can help to chart the phosphoproteome atlas.
        </Paragraph>
      </Section>
      <Section>
        <SectionTitle>Motivation</SectionTitle>
        <Paragraph>
          Protein phosphorylation is a key regulator of protein function in signal transduction pathways. Kinases are the enzymes that catalyze the phosphorylation of other proteins in a target-specific manner. The dysregulation of phosphorylation is associated with many diseases, including cancer. Although advances in phosphoproteomics enable the identification of phosphosites at the proteome level, most of the phosphoproteome is still in the dark: more than 95% of the reported human phosphosites have no known kinases. Determining which kinase is responsible for phosphorylating a site remains an experimental challenge. Existing computational methods require several examples of known targets of a kinase to make accurate kinase-specific predictions, yet for a large body of kinases, only a few or no target sites are reported.
        </Paragraph>
      </Section>
      <Section>
        <SectionTitle>Protein Kinase Families</SectionTitle>
        <KinaseSection>
          <strong>Serine/Threonine Kinases:</strong>
          <Paragraph>These kinases primarily phosphorylate the serine or threonine residues of target proteins. Major sub-families include:
            <ul>
              <li>PKA (Protein Kinase A): Also known as cAMP-dependent kinase, involved in the pathway mediated by cyclic AMP (cAMP).</li>
              <li>PKC (Protein Kinase C): Activated by diacylglycerol (DAG) and calcium ions, involved in numerous signaling pathways.</li>
              <li>MAPK (Mitogen-Activated Protein Kinases): Involved in pathways that convert extracellular signals into a variety of cellular activities. MAPKs themselves are part of a cascade that includes several other kinases.</li>
            </ul>
          </Paragraph>
        </KinaseSection>
        <KinaseSection>
          <strong>Tyrosine Kinases:</strong>
          <Paragraph>These enzymes phosphorylate tyrosine residues on target proteins. They are often associated with the receptors of growth factors and play pivotal roles in signal transduction and cancer development. They include:
            <ul>
              <li>Receptor Tyrosine Kinases (RTKs): Part of the receptor on cellular membranes; examples include EGFR, VEGFR, and FGFR.</li>
              <li>Non-receptor Tyrosine Kinases: These operate within the cell and include the SRC family, ABL kinase, and JAK kinases.</li>
            </ul>
          </Paragraph>
        </KinaseSection>
        <KinaseSection>
          <strong>Dual-Specificity Kinases:</strong>
          <Paragraph>These kinases can phosphorylate both serine/threonine and tyrosine residues. Examples include:
            <ul>
              <li>MEK (MAPK/ERK Kinase): Specifically phosphorylates MAPKs and is part of the MAP kinase signal transduction pathway.</li>
            </ul>
          </Paragraph>
        </KinaseSection>
        <KinaseSection>
          <strong>Lipid Kinases:</strong>
          <Paragraph>Involved in phosphorylating lipids instead of proteins, critical in signaling pathways. Examples include:
            <ul>
              <li>PI3K (Phosphoinositide 3-Kinases): Catalyzes the phosphorylation of the 3 position on the inositol ring of phosphoinositides. They play a key role in cell growth and survival pathways.</li>
            </ul>
          </Paragraph>
        </KinaseSection>
        <KinaseSection>
          <strong>Atypical Kinases:</strong>
          <Paragraph>These do not fit into the conventional kinase categories based on their substrates or the amino acids they phosphorylate. Examples include:
            <ul>
              <li>Alpha-kinases: Phosphorylate targets different from the conventional serine, threonine, or tyrosine residues.</li>
              <li>PIKK family: Includes ATM and ATR kinases, which are critical for the DNA damage response.</li>
            </ul>
          </Paragraph>
        </KinaseSection>
      </Section>
    </PageContainer>
  );
};

export default AboutPage;