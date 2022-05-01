require('dotenv').config();

const { NODE_ENV, DB_CONN } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const { limiter } = require('./middlewares/rate-limiter');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');
const NotFoundError = require('./errors/NotFoundError');

const app = express();
const { PORT = 3001 } = process.env;
app.use(cors());

// const allowedDomains = [
//   'https://evgexmovies.nomoredomains.xyz',
//   'http://evgexmovies.nomoredomains.xyz',
//   'http://localhost:3000',
// ];

// app.use((req, res, next) => {
//   const { origin } = req.headers;
//   if (allowedDomains.includes(origin)) {
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Origin', origin);
//     const { method } = req;
//     const DEFAULT_ALLOWED_METHODS = 'GET,PUT,PATCH,POST,DELETE';
//     if (method === 'OPTIONS') {
//       const requestHeaders = req.headers['access-control-request-headers'];
//       res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
//       res.header('Access-Control-Allow-Headers', requestHeaders);
//     }
//   }
//   next();
// });

app.use(helmet());
app.use(requestLogger);
app.use(limiter);
app.use(cookieParser());
app.use(userRoutes);
app.use(movieRoutes);
app.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница по указанному адресу не найдена'));
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

async function main() {
  await mongoose.connect(NODE_ENV === 'production' ? `${DB_CONN}` : 'mongodb://localhost:27017/moviesdb-dev', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Установлена связь с базой данных');

  app.listen(PORT, () => {
    console.log(`Все в порядке. Приложение слушает порт ${PORT}`);
  });
}

main();
