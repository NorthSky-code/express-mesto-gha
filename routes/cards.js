const router = require('express').Router();
const { validateCardInfo, validateCardId } = require('../middlewares/validators');

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.post('/', validateCardInfo, createCard);
router.get('/', getCards);
router.delete('/:id', validateCardId, deleteCard);
router.put('/:id/likes', validateCardId, likeCard);
router.delete('/:id/likes', validateCardId, dislikeCard);

module.exports = router;
