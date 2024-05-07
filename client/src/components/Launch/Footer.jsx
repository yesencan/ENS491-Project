import React from 'react';
import styled from 'styled-components';
import LogoTastanLab from '../../images/TastanLab.png';
import LogoSabanci from '../../images/LogoSabanci.svg';


const FooterContainer = styled.footer`
    width: 100%;
    height: 70px;
    margin-top: 20px;
    display: flex;
    /* position: fixed; */
    bottom: 0;
    align-items: center;
    justify-content: center;
    background-color: #217ec3;
    color: white;
    font-family: "Roboto";
    border-top: 1px solid #ffa60045;
`;

const Footer = () => {
        return (
                <FooterContainer>
                        <img src={LogoSabanci} alt="Sabanci University Logo" style={{ width: '100px', height: '50px', marginRight: '10px' }} />
                        <p>&copy; {new Date().getFullYear()} Sabancı University.</p>
                        <img src={LogoTastanLab} alt="TastanLab Logo" style={{ width: '140px', height: '70px', marginLeft: '10px' }} />
                </FooterContainer>
        );
};

export default Footer;

