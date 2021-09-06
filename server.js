const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  // console.log('uncaught exception, shutting down...');
  // console.log(err);

  process.exit(1);

})

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  // Local DB:
  // .connect(process.env.DATABASE_LOCAL).then(() => {
  // Hosted DB:
  .connect(DB)
  .then(() => console.log("db connection successful"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app running on ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('unhandled rejection, shutting down...');
  console.log(err);
  server.close(() => {
    process.exit(1);
  })
})
