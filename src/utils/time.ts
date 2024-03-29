import moment from 'moment';

export const convertMiliSecondsToDateTime = (milliseconds: any) => {
  const dateObject = new Date(milliseconds);
  const humanDateFormat = dateObject.toLocaleString();
  return humanDateFormat;
};

export const convertTimestampToDate = (timestamp: number) => {
  return moment(new Date(timestamp * 1000)).format('M/D HH');
};

export const convertMiliSecondsToDHM = (milliseconds: any) => {
  const days = Math.floor(milliseconds / (24 * 60 * 60 * 1000));
  const daysMs = milliseconds % (24 * 60 * 60 * 1000);
  const hours = Math.floor(daysMs / (60 * 60 * 1000));
  const hoursMs = milliseconds % (60 * 60 * 1000);
  const minutes = Math.floor(hoursMs / (60 * 1000));
  const minutesMs = milliseconds % (60 * 1000);
  const sec = Math.floor(minutesMs / 1000);
  return days + 'd ' + hours + 'h ' + minutes + 'm ' + sec + 's';
};
