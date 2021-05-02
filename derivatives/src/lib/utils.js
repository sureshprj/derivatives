const moment = require("moment");

const formatDate = (stringDate, fromFormat, toFormat) => {
  if (!toFormat) toFormat = "MM-DD-YYYY HH:mm:ss";
  return moment(stringDate, fromFormat).format(toFormat);
};

const formatTimestamp = (timestamp, toFormat) => {
  if (!toFormat) toFormat = "MM-DD-YYYY HH:mm:ss";
  return moment.unix(timestamp / 1000).format(toFormat);
};

const formatDateWhitOutHours = (stringDate, fromFormat) => {
  return moment(stringDate, fromFormat).format("MM-DD-YYYY");
};

const formatNumber = (number, type) => {
  if (number === null || number === undefined) {
    return "";
  }

  if (type === "crypto") {
    return number.toFixed(4).toString();
  } else {
    return number
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
};

module.exports = {
  formatDate,
  formatDateWhitOutHours,
  formatNumber,
  formatTimestamp
};
