const express = require('express');

const mongoose = require('mongoose');

const app = express();

const { PORT = 3000 } = process.env;

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
