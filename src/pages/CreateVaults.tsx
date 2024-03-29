import React from 'react';
import Layout from '../layout';
import type { NextPage } from 'next';
import CreatePoolButton from '../components/vaults/CreatePoolButton';
import CreateRewardPairButton from '../components/vaults/CreateRewardPairButton';

const CreateVaults: NextPage = () => {
  return (
    <div className='vaultCreationContainer'>
      <div className='header'>
        <h2>Create Your Vault</h2>
      </div>
      <div className='vaultCreationBody'>
        <div className='topTwo'>
          <div className='parameters'>
            <h4>Set Parameters for Pool</h4>
          </div>
          <div className='rewards'>
            <h4>Set Rewards Options</h4>
          </div>
        </div>
        <div className='bottomOne'>
          <div className='summary'>
            <h4>Summary of Vault Settings</h4>
          </div>
        </div>
      </div>
      <CreatePoolButton />
      <CreateRewardPairButton />
    </div>
  );
};

export default CreateVaults;
