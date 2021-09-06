const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  console.log('castError')
  const message = `Invalid ${err.path}: ${err.value}.`

  return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
  const message = `Duplicate field value '${err.keyValue.time}'. Please use another value`;

  return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
  return new AppError(err.errors.title, 400);
}

const handleJTWError = () => new AppError('Invalid Token, Please log in again', 401);

const handleJWTExpired = () => new AppError('Token Expired, Please log in again', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // operational, trusted error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // Programming or other unknown error: don't leak
    // 1) Log Error
    // console.error('error', err);
    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'something went wrong'
    })
  }
}

module.exports = (err, req, res, next) => {
  // console.log(err.stack)
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.statusCode === 500) error = handleValidationErrorDB(error);


    if (error.name === 'JsonWebTokenError') error = handleJTWError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpired();
    sendErrorProd(error, res);
  }
}