const router = require('express').Router();
const { validateUpdateUser, validateUpdateAvatar, validateUserId } = require('../middlewares/validators');

const {
  getUsers,
  getAuthUser,
  updateUser,
  updateAvatar,
  getUserId,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getAuthUser);
router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);
router.get('/:id', validateUserId, getUserId);

module.exports = router;
