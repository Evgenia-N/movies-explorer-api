require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');

const app = express();

const { PORT = 3000 } = process.env;

app.use(cookieParser());
app.use(requestLogger);
app.use(userRoutes);
app.use(movieRoutes);
app.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница по указанному адресу не найдена'));
});
app.use(errorLogger);
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
