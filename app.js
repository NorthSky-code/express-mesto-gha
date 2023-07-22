const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const { validateUserInfo, validateUserAuth } = require('./middlewares/validators');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');

const app = express();

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);
app.post('/signup', validateUserInfo, createUser);
app.post('/signin', validateUserAuth, login);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Нет такой страницы'));
});
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
  next();
});

app.listen(PORT, () => {
  console.log('Сервер Запущен!');
});
