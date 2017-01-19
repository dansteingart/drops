
'use strict';

var express = require('express'),
	request = require('supertest'),
	verify = require('verify');

describe('verify', function() {

	it('should fail if no function', function() {
		expect(verify).to.throw(TypeError);
	});

	it('should work with explicit options object', function() {
		expect(verify({
			verify: sinon.stub()
		})).to.be.an.instanceof(Function);
	});

	it('should forward errors', function(done) {
		var app = express(),
			ver = verify(sinon.stub().callsArgWith(1, 'err'));
		app.use(function(req, res, next) {
			req.challenge = 'test';
			next();
		});
		app.use(ver);
		request(app)
			.get('/')
			.expect(function(res) {
				expect(res.statusCode).to.equal(500);
			})
			.end(done);
	});

	it('should skip if no challenge is given', function(done) {
		var app = express(),
			stub = sinon.stub(),
			ver = verify(stub);
		app.use(ver);
		request(app)
			.get('/')
			.expect(function() {
				expect(stub).to.not.be.called;
			})
			.end(done);
	});

	it('should work', function(done) {
		var app = express(),
			ver = verify(function(challenge, callback) {
				callback(null, true, 'foo');
			});
		app.use(function(req, res, next) {
			req.challenge = 'test';
			next();
		});
		app.use(ver);
		app.use(function(req, res) {
			res.status(200).send({
				authenticated: req.authenticated,
				authentication: req.authentication
			});
		});
		request(app)
			.get('/')
			.expect(function(res) {
				expect(res.body).to.have.property('authenticated', true);
				expect(res.body).to.have.property('authentication', 'foo');
			})
			.end(done);
	});

});
