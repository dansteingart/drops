
'use strict';

var _ = require('lodash');

/**
 * Verify a challenge assigned previously.
 *
 * @param {Object} options Configuration options.
 * @param {Function} options.verify Function to check `req.challenge`.
 * @returns {Function} middleware to set appropriate properties.
 */
module.exports = function verify(options) {

	if (_.isFunction(options)) {
		options = {
			verify: options
		};
	}

	// Defaults.
	options = _.assign({
		verify: null
	}, options);

	// Type safety.
	if (!_.isFunction(options.verify)) {
		throw new TypeError();
	}

	return function verifyMiddleware(req, res, next) {

		// If no authentication has been provided, respond with a challenge.
		if (!req.challenge) {
			return next();
		}

		// Try and verify the challenge that was given.
		options.verify(req.challenge, function verified(err, status, result) {
			// If there was an error verifying the challenge just bail out.
			if (err) {
				return next(err);
			}

			// Assign request variables.
			req.authenticated = status;
			req.authentication = result;

			// Carry on.
			next();
		});

	};
};
