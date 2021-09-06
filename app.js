const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');


const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')
const gigRouter = require('./routes/gigRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Global Middleware

// Set security HTTP headers
app.use(helmet());

// console.log(process.env.NODE_ENV)
// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMilliseconds: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour'
})

app.use('/api', limiter);

// Body parser
app.use(express.json({
  limit: '10kb'
}));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

// prevent parameter pollution
app.use(hpp({
  whitelist: [
    'title',
    'venue',
    'venueAddress',
    'time',
    'musicians',
    'gigDuration',
    'suit',
    'createdAt'
  ]
}));

// Compress text sent to clients
app.use(compression());

// Serve static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
})

// Routes
app.use('/api/v1/gigs', gigRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler)

module.exports = app;