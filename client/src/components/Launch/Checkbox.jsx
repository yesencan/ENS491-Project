import React from 'react';
import styled from 'styled-components';

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

function ScanCheckbox({ label, defaultChecked }) {
  return (
    <CheckboxWrapper>
      <CheckboxLabel>{label}</CheckboxLabel>
      <Checkbox type="checkbox" defaultChecked={defaultChecked} />
    </CheckboxWrapper>
  );
}

function ScanCheckboxGroup() {
  return (
    <>
      <LabelCentered>Scan for:</LabelCentered>
      <CheckboxContainer>
        <ScanCheckbox label="Serine (S)" defaultChecked />
        <ScanCheckbox label="Threonine (T)" defaultChecked />
        <ScanCheckbox label="Tyrosine (Y)" defaultChecked />
        <ScanCheckbox label="Histidine (H)" defaultChecked />
      </CheckboxContainer>
    </>
  );
}

export default ScanCheckboxGroup;