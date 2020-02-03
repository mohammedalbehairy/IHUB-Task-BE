const mongoose = require('mongoose');
const ErrorHandler = require('../errors/ErrorHandler');

module.exports = function (id) {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(400, { message: 'this id is Invalid ObjectId' })
  return undefined;
}