import React from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import { Box } from '@mui/material';
import { FaInstagram, FaTelegram, FaWhatsapp, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';

const Sidebar: NextPage = () => {
  return (
    <StyledComponent>
      <BoxPageLink01>
        <TextPageLink>
          <Link href='/'>Dashboard</Link>
        </TextPageLink>
        <TextPageLink>
          <Link href='/Vaults'>Vaults</Link>
        </TextPageLink>
        <TextPageLink>
          <Link href='/Swap/Swap'>Swap</Link>
        </TextPageLink>
      </BoxPageLink01>
      <BoxContactLink01>
        <IconContact>
          <FaTwitter />
        </IconContact>
        <IconContact>
          <FaInstagram />
        </IconContact>
        <IconContact>
          <FaTelegram />
        </IconContact>
        <IconContact>
          <FaWhatsapp />
        </IconContact>
      </BoxContactLink01>
    </StyledComponent>
  );
};

const StyledComponent = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 250px;
  min-width: 250px;
  height: 100%;
  background-color: #181818;
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: cover;
  z-index: 99;
  padding: 50px 20px 30px 20px;
  box-sizing: border-box;
  justify-content: space-between;
`;

const BoxPageLink01 = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const BoxContactLink01 = styled(Box)`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const TextPageLink = styled(Box)`
  display: flex;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 23px;
  color: #bbbbbb;
  margin-bottom: 50px;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    color: #ffffff;
  }
`;

const IconContact = styled(Box)`
  display: flex;
  font-size: 23px;
  color: #ffffff;
  cursor: pointer;
  transition: 0.5s;
  &:hover {
    color: #0c6aa8;
  }
`;

export default Sidebar;
