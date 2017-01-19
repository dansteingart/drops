# express-authentication-verify

Authentication callbacks for [express-authentication] middleware builders.

![build status](http://img.shields.io/travis/izaakschroeder/express-authentication-verify/master.svg?style=flat)
![coverage](http://img.shields.io/coveralls/izaakschroeder/express-authentication-verify/master.svg?style=flat)
![license](http://img.shields.io/npm/l/express-authentication-verify.svg?style=flat)
![version](http://img.shields.io/npm/v/express-authentication-verify.svg?style=flat)
![downloads](http://img.shields.io/npm/dm/express-authentication-verify.svg?style=flat)

You're an implementor of authentication middleware and you want to provide your users with a callback mechanism to assign the relevant authentication properties? Fear no more!

```javascript
var verifier = require('express-authentication-verify');

module.exports = function(options) {
	// Create verify middleware.
	var verify = verifier(options);

	// Return your middleware!
	return function(req, res, next) {

		// Extract the authentication challenge from the client first
		// If no challenge is provided, the user's callback will never be
		// executed.
		req.challenge = ...;

		// Invoke the users verification callback in order to set the relevant
		// express-authentication properties on the request.
		verify(req, res, function(err) {
			if (err) {
				return next(err);
			}
			// req.authenticated / req.authentication are now set
			// do any post-flight you want here
			next();
		});
	}
}
```

The result returned is middleware just like anything else.

[express-authentication]: https://github.com/izaakschroeder/express-authentication
