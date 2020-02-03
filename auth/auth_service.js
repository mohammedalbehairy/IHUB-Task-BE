const Joi = require("@hapi/joi");
const ErrorHandler = require('../errors/ErrorHandler');
const {
    UserModel
} = require('../users/user_model')

// login routes functions
async function validateUser(body) {
    const validateUserSchema = Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required().min(6).max(40)
    }).unknown();

    const {
        value,
        error
    } = validateUserSchema.validate(body, {
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
    let user = await UserModel.findOne({
        username: body.username
    })

    if (!user) throw new ErrorHandler(400, {
        message: "invalid user name or/and password"
    })

    user = new UserModel(user);

    if (!user.validatePassword(body.password)) throw new ErrorHandler(400, {
        message: "invalid user name or/and password"
    })

    return user;

}

async function login(user) {
    const token = user.generateJWT();
    return {
        bearer: token,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
    }
}

//user register functions
async function validateRegister(body) {

    const validateUserSchema = Joi.object().keys({
        username: Joi.string().required().max(25),
        firstname: Joi.string().required().max(25),
        lastname: Joi.string().required().max(25),
        password: Joi.string().required().min(6).max(40)
    }).unknown();

    const {
        value,
        error
    } = validateUserSchema.validate(body, {
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

    if (await UserModel.countDocuments({
        username: body.username
        }) > 0)
        throw new ErrorHandler(400, {
            message: "username already exist in users"
        })

    return undefined;

}

async function createUser(body) {
    const {
        username,
        firstname,
        lastname,
        password
    } = body;
    const user = new UserModel({
        username,
        firstname,
        lastname
    })
    user.setPassword(password)
    return await user.save()
}

module.exports.validateUser = validateUser;
module.exports.login = login;
module.exports.validateRegister = validateRegister;
module.exports.createUser = createUser;