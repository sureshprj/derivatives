import { BigNumber } from "@0x/utils";

export const tomorrow = () => {
  return new BigNumber(Math.floor(new Date().valueOf() / 1000) + 3600 * 24);
};

export const todayInSeconds = () => {
  return Math.floor(Date.now() / 1000);
};

export const convertTimeInSecondsToDaysAndHours = timeInSeconds => {
  let seconds = timeInSeconds.toNumber();
  const days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24;
  const hours = Math.floor(seconds / 3600);
  return {
    days,
    hours
  };
};

export const getExpirationTimeOrdersFromConfig = () => {
  return new BigNumber(todayInSeconds()).plus(360000000000000);
};

export const getEndDateStringFromTimeInSeconds = timeInSeconds => {
  const currentDate = new Date(timeInSeconds.toNumber() * 1000);
  return currentDate.toLocaleString("en-us");
};
