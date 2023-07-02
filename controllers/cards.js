const Card = require('../models/card');

const ERROR_CODE = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_DEFAULT = 500;

const createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((card) => { res.send(card); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((card) => { res.send(card); })
    .catch(() => res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка.' }));
};

const deleteCard = (req, res) => {
  const { id } = req.params;

  Card.findByIdAndRemove(id)
    .then((card) => { res.send(card); })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

const likeCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(id, { $addToSet: { likes: req.user._id } }, {
    new: true,
    runValidators: true,
  })
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки. ' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

const dislikeCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(id, { $pull: { likes: req.user._id } }, {
    new: true,
    runValidators: true,
  })
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки. ' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для снятии лайка' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
