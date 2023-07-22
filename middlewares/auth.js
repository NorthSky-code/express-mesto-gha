const jwt = require('jsonwebtoken');
const NotAuth = require('../errors/not-auth');
const { JWT_SECRET } = require('../controllers/users')

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new NotAuth('Необходима авторизация'));
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new NotAuth('Необходима авторизация'));
    return;
  }

  req.user = payload;
  next();
};

module.exports = auth;