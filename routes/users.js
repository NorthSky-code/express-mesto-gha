const router = require('express').Router();

const {
  createUser,
  getUserId,
  getUsers,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/:id', getUserId);
router.get('/', getUsers);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
