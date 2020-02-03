const ErrorHandler = require('../errors/ErrorHandler');

module.exports = function (error, req, res, next) {

	switch (error.constructor) {

		case ErrorHandler: {
			const { statusCode, message } = error;
			return res.status(statusCode).json(message).end();
		}
		default: {
			return res.status(500).json(error.message).end();
		}

	}
};