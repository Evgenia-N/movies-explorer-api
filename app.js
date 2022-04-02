require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { limiter } = require('./middlewares/rate-limiter');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');
const NotFoundError = require('./errors/NotFoundError');

const app = express();

const { PORT = 3001 } = process.env;

app.use(helmet());
app.use(limiter);
app.use(cookieParser());
app.use(requestLogger);
app.use(userRoutes);
app.use(movieRoutes);
app.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница по указанному адресу не найдена'));
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

async function main() {
  await mongoose.connect(process.env.DB_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Установлена связь с базой данных');

  app.listen(PORT, () => {
    console.log(`Все в порядке. Приложение слушает порт ${PORT}`);
  });
}

main();
