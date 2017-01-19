
'use strict';

var crypto = require('crypto');

module.exports = function once(middleware) {

	if (typeof middleware !== 'function') {
		throw new TypeError('Middleware must be function.');
	}

	// Should be unique enough
	var nonce = '_once_' +
		crypto.createHash('sha1').update(middleware.toString()).digest('hex') +
		Math.random().toString(36);

	return function onceMiddleware(req, res, next) {
		// If we've already run the middleware, then skip out. Otherwise
		// mark the middleware as having been called and then call it.
		if (req[nonce]) {
			next();
		} else {
			req[nonce] = true;
			middleware(req, res, next);
		}
	};
};
