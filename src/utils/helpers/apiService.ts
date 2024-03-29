import axios from 'axios';

export const requestAPICall = async (url: string) => {
  return await axios.get(url);
};
