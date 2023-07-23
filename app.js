const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const { validateUserInfo, validateUserAuth } = require('./middlewares/validators');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const NotFoundError = require('./errors/not-found-err');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(helmet());

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(limiter);
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

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Сервер Запущен!');
});
