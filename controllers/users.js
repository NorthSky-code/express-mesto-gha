const User = require('../models/user');

const ERROR_CODE = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_DEFAULT = 500;

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => { res.send(user); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

const getUserId = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Некорректный _id пользователя.' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((user) => { res.send(user); })
    .catch(() => res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка.' }));
};

const updateUser = (req, res) => {
  const userId = req.user._id;

  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

const updateAvatar = (req, res) => {
  const userId = req.user._id;

  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  createUser,
  getUserId,
  getUsers,
  updateUser,
  updateAvatar,
};
