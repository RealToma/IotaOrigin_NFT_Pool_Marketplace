import React from 'react';
import styled from 'styled-components';
import { Box } from '@mui/material';

export const IconText = ({ icon, title, description, callToAction }: any) => {
  return (
    <div className='flex flex-col text-white p-7 rounded-2xl border-[1px] border-slate-600 bg-slate-900 cursor-pointer transform-[0.2s_border-color] mb-2 hover:border-[#1fcec1] mx-1'>
      <TextTitle01>{title}</TextTitle01>
      <BoxIcon>{icon}</BoxIcon>
      <TextDescription01>{description}</TextDescription01>
      <CallToAction>{callToAction}</CallToAction>
    </div>
  );
};

export const IconLink = ({ icon, title, url, target }: any) => {
  return (
    <a href={url} target={target ? '_blank' : ''} rel='noreferrer'>
      <StyledComponentSmall>
        <BoxIconSmall> {icon} </BoxIconSmall>
        <TextTitle02> {title}</TextTitle02>
      </StyledComponentSmall>
    </a>
  );
};

const StyledComponentSmall = styled(Box)`
  flex-direction: column;
  color: #fff;
  margin-right: 5%;
  text-align: left;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background-color: transparent;
  cursor: pointer;
  transition: 0.2s border-color;
  text-align: center;
  margin-bottom: 5px;

  &:hover {
    border-color: rgba(255, 255, 255, 0.25);
  }
`;

const BoxIcon = styled(Box)`
  font-size: 3rem;
  float: right;
  text-align: right;
  margin-top: -90px;
  margin-bottom: 40px;
`;

const BoxIconSmall = styled(Box)`
  font-size: 22px;
  display: inline-block;
  margin-right: 20px;
  margin-left: -20px;
  padding-top: 2px;
  vertical-align: top;
`;

const TextTitle01 = styled(Box)`
  color: white;
  font-weight: 600;
  font-size: 30px;
  margin-bottom: 40px;
  text-shadow: 5px 5px 1px rgb(0 0 0 / 40%);
  margin-top: 10px;
`;

const TextTitle02 = styled(Box)`
  color: white;
  font-weight: 500;
  display: inline-block;
  font-size: 24px;
  vertical-align: top;
`;

const TextDescription01 = styled(Box)`
  color: white;
  opacity: 0.5;
  font-weight: 400;
  font-size: 22px;
  text-shadow: 5px 5px 1px rgb(0 0 0 / 40%);
  margin-top: 5px;
  line-height: 1.5em;
`;

const CallToAction = styled(Box)`
  margin-top: 15px;
  font-size: 22px;
  color: #4488ff;
  cursor: pointer;
`;
