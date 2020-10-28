const returnError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.status = statusCode;
  return error;
};

const isEmptyObject = (obj = {}) => {
  return !Object.keys(obj || {}).length;
};

module.exports = {
  returnError,
  isEmptyObject
};
