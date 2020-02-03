require('custom-env').env();
const {
  createServer
} = require('http');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const express = require('express');
const mainErrorsHandlerMiddleware = require('./middlewares/mainErrorsHandlerMiddleware');
const authenticationMiddleware = require('./middlewares/authenticationMiddleware');
const authRoutes = require('./auth/auth_routes')
const userRoutes = require('./users/user_routes')

const app = express();
const port = process.env.PORT;

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => {

  console.log(`Server Connecting to Mongoo.`);

  const server = createServer(app);
  server.listen(port, () => {
    console.log(`Listening for events on ${server.address().port}`);
  });

  app.use(require("cors")())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: false
  }))
  app.use('/api/auth', authRoutes)
  app.use(authenticationMiddleware)
  app.use('/api/users', userRoutes)
  app.use(mainErrorsHandlerMiddleware)


}).catch((error) => console.log(`Connection to Mongoo DB Failed. ${error}`));