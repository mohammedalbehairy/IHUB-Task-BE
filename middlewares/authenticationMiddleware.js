const jwt = require('jsonwebtoken');
const { UserModel } = require('../users/user_model')

module.exports = async function (req, res, next) {
  const bearerHeader = req.header('Authorization');
  if (!bearerHeader) return res.status(401).send({ message: 'Access denied. No token provided.' });

  let bearer = bearerHeader.split(' ');
  let bearerToken = bearer[1];
  
  try {
    const decoded = jwt.verify(bearerToken, process.env.JWT_PRIVATE_KEY);
    const user = await UserModel.findById(decoded._id)
    if (!user) return res.status(401).send({ message: 'Invalid token.' });
    req.user = user;
    next();
  } catch (ex) {
    res.status(401).send({ message: 'Invalid token.' });
  }
}