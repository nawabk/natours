const AppError = require('../utils/appError');

const handleCastErroDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
const hanldeDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'](\\?.)*?\1)/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data.${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJwtError = () =>
  new AppError('Invalid token,Please login again', 401);

const handleJwtExpiredError = () =>
  new AppError('Your token has expired! Please login again', 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }
};
const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    //opeational ,trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
      //Programming or other unknown error: don't leak error details
    } else {
      //1)Log error
      // console.error('Error ', err);

      //2)Send generic message
      return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong'
      });
    }
  }
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message
    });
    //Programming or other unknown error: don't leak error details
  }
  //1)Log error
  // console.log(err);
  //2)Send generic message
  res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later'
  });
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'developement') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let copyErr = { ...err };
    copyErr.message = err.message;
    if (copyErr.name === 'CastError') copyErr = handleCastErroDB(copyErr);
    if (copyErr.code === 11000) copyErr = hanldeDuplicateFieldsDB(copyErr);
    if (copyErr.name === 'ValidationError')
      copyErr = handleValidationErrorDB(copyErr);
    if (copyErr.name === 'JsonWebTokenError') copyErr = handleJwtError();
    if (copyErr.name === 'TokenExpiredError') copyErr = handleJwtExpiredError();
    sendErrorProd(copyErr, req, res);
  }
};
