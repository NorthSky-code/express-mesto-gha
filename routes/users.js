const router = require('express').Router();

const {
  getUsers,
  getAuthUser,
  updateUser,
  updateAvatar,
  getUserId,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getAuthUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);
router.get('/:id', getUserId);

module.exports = router;
