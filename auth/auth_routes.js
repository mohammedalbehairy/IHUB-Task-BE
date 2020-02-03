const router = require('express').Router();
const authService = require('./auth_service');

router.post('/login', async (req, res, next) => {
    try {
        const user = await authService.validateUser(req.body);

        const authJosn = await authService.login(user);

        return res.status(200).send(authJosn);
    } catch (e) {
        return next(e)
    }
});

router.post('/register', async (req, res, next) => {
    try {
        await authService.validateRegister(req.body);

        let user = await authService.createUser(req.body);
        const authJosn = await authService.login(user);

        return res.status(201).send(authJosn);
    } catch (e) {
        return next(e)
    }
});

module.exports = router;