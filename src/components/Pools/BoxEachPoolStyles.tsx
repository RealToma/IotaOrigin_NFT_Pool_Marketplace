import { TextField } from '@mui/material';
import { Box } from '@mui/system';
import styled from 'styled-components';

const InputValue = styled.input`
  display: inline-block;
  width: 300px;
  height: 56px;
  border-radius: 8px;
  padding: 0px 15px;
  box-sizing: border-box;
  font-size: 1.3rem;
  font-weight: 600;
  color: #3d3d3d;
  outline: none;
  border: none;
  margin-right: 5px;
`;

const TextDescription = styled(Box)`
  display: inline-block;
  align-items: flex-start;
  font-weight: 400;
  font-size: 18px;
  color: #ffffff;
  text-shadow: 4px 4px 0.5px rgb(0 0 0 / 40%);
  margin-bottom: 10px;
`;
const CustomTextField = styled(TextField)`
  background: white;
  border-radius: 8px;
  font-size: 1.3rem;
  font-weight: 600;
  color: #3d3d3d;
`;
const BoxEachInput01 = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 30px;
`;

const ButtonCreatePoolModal = styled(Box)`
  display: flex;
  width: 100%;
  height: 50px;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 8px;
  text-transform: uppercase;
  background-color: #181818;
  color: white;
  cursor: pointer;
  transition: 0.5s;
  &:hover {
    background-color: white;
    color: #181818;
  }
  margin-top: 30px;
`;

const BoxGroup01 = styled(Box)`
  display: flex;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
  flex-direction: column;
  margin-top: 30px;
`;

const TitleText01 = styled(Box)`
  display: flex;
  align-items: flex-start;
  font-weight: 600;
  font-size: 22px;
  color: #ffffff;
  text-shadow: 4px 4px 0.5px rgb(0 0 0 / 40%);
  margin-bottom: 20px;
`;

const BoxBorderValues01 = styled(Box)`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const EachBorderValues01 = styled(Box)`
  display: flex;
  height: 100%;
  flex-direction: column;
  padding-right: 20px;
  box-sizing: border-box;
  border-right: 2px solid #afafaf;
  margin-right: 20px;
`;

const EachBorderValues02 = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const BorderUpValue01 = styled(Box)`
  font-weight: 400;
  font-size: 18px;
  color: #afafaf;
  text-transform: uppercase;
  margin-bottom: 5px;
`;

const BorderDownValue01 = styled(Box)`
  font-weight: 400;
  font-size: 18px;
  color: white;
`;

const BoxTimeRemain = styled(Box)`
  display: flex;
  width: 35%;
  align-items: center;
  color: white;
  background-color: #afafaf;
  border-radius: 8px;
  padding: 15px;
  box-sizing: border-box;
`;
const TextTimeRemain = styled(Box)`
  display: flex;
  font-size: 20px;
  font-weight: 600;
  margin-left: 10px;
`;

const TextNoPools = styled(Box)`
  display: flex;
  width: 100%;
  color: white;
  font-size: 20px;
  justify-content: center;
  align-items: center;
`;

const BoxButtonGroup01 = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
`;

const CustomButton01 = styled(Box)`
  display: flex;
  width: 30%;
  height: 50px;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 8px;
  text-transform: uppercase;
  background-color: #1fcec1;
  color: black;
  cursor: pointer;
  transition: 0.15s;
  // &:hover {
  //   background-color: #ffffff;
  //   color: #000000;
  // }
`;

export {
  BorderDownValue01,
  BorderUpValue01,
  BoxBorderValues01,
  BoxButtonGroup01,
  BoxEachInput01,
  BoxGroup01,
  BoxTimeRemain,
  ButtonCreatePoolModal,
  CustomButton01,
  CustomTextField,
  EachBorderValues01,
  EachBorderValues02,
  InputValue,
  TextDescription,
  TextNoPools,
  TextTimeRemain,
  TitleText01,
};
