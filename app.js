const express = require('express');

const app = express();

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`Все в порядке. Приложение слушает порт ${PORT}`);
});
