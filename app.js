const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');

const app = express();

const { PORT = 3000 } = process.env;

app.use(userRoutes);
app.use(movieRoutes);
app.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница по указанному адресу не найдена'));
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Установлена связь с базой данных');

  app.listen(PORT, () => {
    console.log(`Все в порядке. Приложение слушает порт ${PORT}`);
  });
}

main();
