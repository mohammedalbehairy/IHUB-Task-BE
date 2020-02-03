const Joi = require("@hapi/joi");
const ErrorHandler = require('../errors/ErrorHandler');
const validateObjectId = require('../helpers/validateObjectId');
const crypto = require('crypto');
const {
  UserModel
} = require('./user_model')


async function getUsers(username) {
  return await UserModel.find({}).select('username firstname lastname');
}

function validateUserId(userId) {
  validateObjectId(userId)
}

async function deleteUser(userId) {

  const user = await UserModel.findOneAndRemove({
    _id: userId
  })

  if (!user)
    throw new ErrorHandler(404, {
      message: "The user with thie given id not found ."
    })

  return undefined
}

function validateChangePassword(bodyData) {
  const validatePostSchema = Joi.object().keys({
    oldPassword: Joi.string().required().min(6).max(25),
    newPassword: Joi.string().required().min(6).max(25),
  }).unknown();

  const {
    value,
    error
  } = validatePostSchema.validate(bodyData, {
    abortEarly: false
  });
  if (error) {
    const messages = error.details.map(i => {
      let e = {};
      e[i.context.key] = i.message.replace(/\"/g, '');
      return e;
    })
    throw new ErrorHandler(400, messages)
  }
  return undefined;
}


async function changePassword(id, body) {

  let user = await UserModel.findById(id);

  let valid = validatePassword(user, body.oldPassword);

  if (!valid) throw new ErrorHandler(400, 'Your password is inCorrect');

  let salt = crypto.randomBytes(16).toString('hex');
  let hash = crypto.pbkdf2Sync(body.newPassword, salt, 10000, 512, 'sha512').toString('hex');

  await UserModel.updateOne({
    _id: user._id
  }, {
    salt: salt,
    hash: hash
  });
}

function validatePassword(user, password) {
  const hash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex');
  return user.hash === hash;
};

module.exports.getUsers = getUsers;
module.exports.validateUserId = validateUserId;
module.exports.deleteUser = deleteUser;
module.exports.validateChangePassword = validateChangePassword;
module.exports.changePassword = changePassword;
