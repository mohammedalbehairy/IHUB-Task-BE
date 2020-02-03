const router = require('express').Router();
const userService = require('./user_service');

// get users
router.get('/', async (req, res, next) => {
  try {

    const users = await userService.getUsers(req.query.username);

    return res.status(200).send(users);
  } catch (e) {
    return next(e)
  }
});

// change password of user
router.put('/', async (req, res, next) => {
  try {

    userService.validateChangePassword(req.body);
    await userService.changePassword(req.user._id, req.body);

    return res.status(200).send({
      message: 'password updated successfully'
    });
  } catch (e) {
    return next(e)
  }
});

// delete user
router.delete('/:id', async (req, res, next) => {
  try {

    userService.validateUserId(req.params.id);

    await userService.deleteUser(req.params.id);

    return res.status(200).send({
      message: 'user deleted successfully'
    });
  } catch (e) {
    return next(e)
  }
});

module.exports = router;
