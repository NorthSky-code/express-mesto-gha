const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '64a04c2ae66098165b704a32',
  };
  next();
});

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

app.use(bodyParser.json());
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.listen(PORT, () => {
  console.log('Сервер Запущен!');
});
