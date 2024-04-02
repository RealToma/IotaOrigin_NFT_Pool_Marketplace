import styled from 'styled-components';
import { Modal } from '@mui/material';
import { Box } from '@mui/system';
import { RiCloseCircleFill } from 'react-icons/ri';
import { MouseEventHandler } from 'react';

export const ModalFrame = ({
  isOpen,
  close,
  title,
  children,
  zIndex,
}: {
  zIndex?: number;
  isOpen: boolean;
  close: Function;
  title: string;
  children: any;
}) => {
  return (
    <Modal
      open={isOpen}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      sx={{ zIndex: zIndex }}
    >
      <ModalViewBox>
        <UpText>{title}</UpText>
        <ButtonCloseModal onClick={() => close()}>
          <RiCloseCircleFill />
        </ButtonCloseModal>
        <InsideModalBox01>{children}</InsideModalBox01>
      </ModalViewBox>
    </Modal>
  );
};

const ButtonCloseModal = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 30px;
  top: 20px;
  color: white;
  font-size: 2.3rem;
  cursor: pointer;
  transition: 0.5s;
  &:hover {
    color: #158bda;
  }
`;

const UpText = styled(Box)`
  display: flex;
  flex: 1;
  align-items: center;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 25px;
  color: #ffffff;
  text-shadow: 4px 4px 0.5px rgb(0 0 0 / 40%);
  margin: 30px;
`;

const ModalViewBox = styled(Box)`
  display: flex;
  width: min(900px, 95vw);
  max-height: 90vh;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  backdrop-filter: blur(10px) !important;
  border-radius: 20px;
  padding: 30px;
  transition: box-shadow 300ms;
  transition: transform 505ms cubic-bezier(0, 0, 0.2, 1) 0ms !important;
  outline: none;
  //animation: back_animation1 0.5s 1;
  animation-timing-function: ease;
  animation-fill-mode: forwards;
  @keyframes back_animation1 {
    0% {
      opacity: 0%;
    }
    100% {
      opacity: 100%;
    }
  }
  @media (max-width: 600px) {
    transition: 0.5s !important;
    width: 300px;
  }
  @media (max-width: 450px) {
    transition: 0.5s !important;
    width: 200px;
    height: 330px;
  }
  @media (max-width: 1000px) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    transform: none;
    border: none;
    background-color: #000;
    padding: 0;
    border-radius: 0;
  }
`;

const InsideModalBox01 = styled(Box)`
  display: flex;
  width: 100%;
  height: 100%;
  margin-top: 10px;
  overflow-y: auto;
  padding-right: 20px;

  flex-direction: column;
  ::-webkit-scrollbar {
    width: 15px;
  }

  ::-webkit-scrollbar-track {
    background-color: #e4e4e4;
    border-radius: 100px;
    cursor: pointer;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #4b4b4b;
    border-radius: 100px;
  }

  @media (max-width: 1000px) {
    padding: 30px;
  }
`;
