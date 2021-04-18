export const getNumberOfDecimalsSixChars = number => {
  if (number >= 100000) {
    return 0;
  } else if (number >= 10000) {
    return 1;
  } else if (number >= 1000) {
    return 2;
  } else if (number >= 100) {
    return 3;
  } else if (number >= 10) {
    return 4;
  } else if (number < 10) {
    return 5;
  }
};
