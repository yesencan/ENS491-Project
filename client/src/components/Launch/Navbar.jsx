import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 70px;
  position: fixed;
  z-index: 99;
  background: white;
  display: grid;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  border-bottom: 2px solid #217ec3;
  grid-template-columns: 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5%;
  grid-template-rows: 100%;
`;

const ButtonContainer = styled.div`
  width: auto;
  height: auto;
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.div`
  width: 80px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Roboto";
  font-size: 16px;
  transition: 0.2s all;
  border: 2px solid transparent;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    border: 2px solid #217ec3;
  }
`;

const RedirectLink = styled(Link)`
  text-decoration: none;
  color: #004990;
  font-weight: 500;
  font-size: 1.1em;
  font-family: "Roboto";
  &:hover {
    text-decoration: underline;
  }
`;

const Logo = styled.div`
  width: auto;
  height: auto;
  font-family: "Freeman";
  font-size: 20px;
  user-select: none;
`;

const Navbar = () => {
  return (
    <Container>
      <Logo style={{ gridColumn: "3"}}>
        <Link to="/" style={{ textDecoration: "none", color: "#004990", fontWeight: "900", fontSize: "2.1em" }}>
          DeepKinZero
        </Link>
      </Logo>
      <ButtonContainer style={{gridColumnEnd: "7"}}>
        <RedirectLink to="/about" style={{ margin: "0 20px 0 0"}}>
          About
        </RedirectLink>
        <RedirectLink to="/">
          Predict
        </RedirectLink>
      </ButtonContainer>
    </Container>
  );
};

export default Navbar;
