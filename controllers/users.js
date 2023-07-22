const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const BadRequest = require('../errors/bad-request');
const NotFound = require('../errors/not-found-err');
const Conflict = require('../errors/conflict-err');
const NotAuth = require('../errors/not-auth');

const JWT_SECRET = 'secret-code';

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequest('Поля email или пароль не могут быть пустыми'));
  }

  bcrypt.hash(password, 10, (error, hash) => {
    User.findOne({ email })
      .then((user) => {
        if (user) {
          throw new Conflict('Пользователь с таким Email уже зарегистрирован');
        }
        User.create({ name, about, avatar, email, password: hash })
          .then(() => {
            res.status(200).send({ message: `Пользователь ${email} успешно зарегистрирован` });
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new BadRequest(err.message));
            } else {
              next(err);
            }
          });
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new Conflict('Пользователь с таким Email уже зарегистрирован'));
        } else {
          next(err);
        }
      });
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequest('Поля email или пароль не могут быть пустыми'));
  }
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user || !user.password) {
        return next(new NotAuth('Неправильные почта или пароль'));
      }
      bcrypt.compare(password, user.password, (error, isValidPassword) => {
        if (!isValidPassword) {
          return next(new NotAuth('Неправильные почта или пароль'));
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('jwt', token, { httpOnly: true }).send({ token });
      })
    })
    .catch(next);
};

const getUserId = (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (!user) {
        next(new NotFound('Пользователь с указанным _id не найден.'));
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректный _id пользователя.'));
      } else {
        next(err);
      }
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => { res.send(user); })
    .catch(next);
};

const getAuthUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFound('Пользователь с указанным _id не найден.'));
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректный _id пользователя.'));
      } else {
        next(err);
      }
    });
}

const updateUser = (req, res, next) => {
  const userId = req.user._id;

  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        next(new NotFound('Пользователь с указанным _id не найден.'));
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const userId = req.user._id;

  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        next(new NotFound('Пользователь с указанным _id не найден.'));
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  getUserId,
  getAuthUser,
  getUsers,
  updateUser,
  updateAvatar,
  JWT_SECRET
};
