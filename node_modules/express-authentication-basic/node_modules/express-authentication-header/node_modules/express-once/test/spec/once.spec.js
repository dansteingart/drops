
'use strict';

var express = require('express'),
	request = require('supertest'),
	once = require('once');

describe('basic', function() {

	it('should fail if no function is given', function() {
		expect(once).to.throw(TypeError);
	});

	it('should fail if middleware is not a function', function() {
		expect(function() {
			once({ });
		}).to.throw(TypeError);
	});

	it('should only call wrapped function once', function(done) {
		var stub = sinon.stub().callsArg(2),
			app = express(),
			middleware = once(stub);

		app.get('/', middleware, middleware, function(req, res) {
			res.status(200).send();
		});

		request(app)
			.get('/')
			.expect(function(res) {
				expect(res.statusCode).to.equal(200);
				expect(stub).to.be.calledOnce;
			})
			.end(done);
	});
});
