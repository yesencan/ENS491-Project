import React from 'react';
import styled from 'styled-components';
import LogoTastanLab from '../../images/TastanLab.png';
import LogoSabanci from '../../images/LogoSabanci.svg';


const FooterContainer = styled.footer`
    width: 100%;
    height: 70px;
    margin-top: 20px;
    display: grid;
    /* position: fixed; */
    bottom: 0;
    align-items: center;
    justify-content: center;
    background-color: #97bee5;
    color: white;
    font-family: "Roboto";
    border-top: 1px solid #217ec3;
    grid-template-columns: 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5%;
`;

const Footer = () => {
        return (
                <FooterContainer>
                        <img src={LogoSabanci} alt="Sabanci University Logo" style={{ width: '100px', height: '50px', gridColumn: "3" }} />
                        <p style={{gridColumn: "4 / 6", justifySelf: "center"}}>&copy; {new Date().getFullYear()} Sabancı University.</p>
                        <img src={LogoTastanLab} alt="TastanLab Logo" style={{ width: '140px', height: '70px', justifySelf: "end",  gridColumn: "6"}} />
                </FooterContainer>
        );
};

export default Footer;

