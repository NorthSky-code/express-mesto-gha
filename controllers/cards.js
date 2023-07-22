const Card = require('../models/card');
const BadRequest = require('../errors/bad-request');
const NotFound = require('../errors/not-found-err');
const Forbidden = require('../errors/forbidden-err');

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { id } = req.params;

  Card.findByIdAndRemove(id)
    .then((card) => {
      if (!card) {
        next(new NotFound('Карточка с указанным id не найдена.'));
      }
      if (!card.owner.equals(req.user._id)) {
        next(new Forbidden('Нет прав на удаление чужой карточки'));
      } else {
        res.send({ message: 'Карточка усешно удалена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректный id карточки'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(id, { $addToSet: { likes: req.user._id } }, {
    new: true,
    runValidators: true,
  })
    .then((card) => {
      if (!card) {
        next(new NotFound('Карточка с указанным id не найдена.'));
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для постановки лайка'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(id, { $pull: { likes: req.user._id } }, {
    new: true,
    runValidators: true,
  })
    .then((card) => {
      if (!card) {
        next(new NotFound('Карточка с указанным id не найдена.'));
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для снятии лайка'));
      } else {
        next(err);
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
