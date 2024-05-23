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
      <Logo style={{ gridColumn: "3" }}>
        <Link to="/" style={{ textDecoration: "none", color: "#004990", fontWeight: "900", fontSize: "2.1em" }}>
          DeepKinZero
        </Link>
      </Logo>
      <ButtonContainer style={{ gridColumnEnd: "7" }}>
        <RedirectLink to="/about" style={{ margin: "0 20px 0 0" }}>
          About
        </RedirectLink>
        <RedirectLink to="/" style={{ margin: "0 20px 0 0" }}>
          Predict
        </RedirectLink>
        <RedirectLink to="/tutorial">
          Tutorial
        </RedirectLink>
      </ButtonContainer>
    </Container>
  );
};

export default Navbar;
