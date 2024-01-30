import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100vw;
  height: 70px;
  position: fixed;
  z-index: 99;
  backdrop-filter: blur(10px);
  background-color: #ffffff7c;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px 0 50px;
  box-sizing: border-box;
`;

const ButtonContainer = styled.div`
  width: auto;
  height: auto;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const Button = styled.div`
  width: 80px;
  height: 30px;
  margin: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Poppins";
  font-size: 12px;
  transition: 0.2s all;
  border: 2px solid transparent;
  cursor: pointer;
  &:hover {
    border: 2px solid orange;
  }
`;

const Logo = styled.div`
  width: auto;
  height: auto;
  font-family: "Roboto";
  font-size: 16px;
  user-select: none;
`;

const Navbar = () => {
  return (
    <Container>
      <Logo>DeepKinZero.</Logo>
      <ButtonContainer>
        <Button>Page Link 1</Button>
        <Button>Page Link 2</Button>
        <Button>Page Link 3</Button>
        <Button>Page Link 4</Button>
        <Button>Page Link 5</Button>
      </ButtonContainer>
    </Container>
  );
};

export default Navbar;
