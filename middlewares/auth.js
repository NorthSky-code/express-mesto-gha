const jwt = require('jsonwebtoken');
const NotAuth = require('../errors/not-auth');
const { JWT_SECRET } = require('../controllers/users')

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new NotAuth('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
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