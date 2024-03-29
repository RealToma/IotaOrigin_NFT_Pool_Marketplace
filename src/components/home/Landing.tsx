import { Typography } from '@mui/material';
import React from 'react';
import placeholderImg from '../../../public/media/IotaOrigin_LM3737_12022021.png';
import type { NextPage } from 'next';

const Landing: NextPage = () => {
  return (
    <div className='homeContainer'>
      <div className='header'>
        <img src={placeholderImg.src} alt='' className='headerImg' />
        <Typography
          variant='h4'
          gutterBottom
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          Welcome to Celo&apos;s first NFT Liquidity Pool and Vault Service!
        </Typography>
      </div>
      <div className='homeBody'>
        <p>Just some placeholder text for now</p>
      </div>
    </div>
  );
};

export default Landing;
