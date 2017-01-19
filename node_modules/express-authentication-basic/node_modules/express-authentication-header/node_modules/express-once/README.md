# express-once

Create express middleware that just runs once.

![build status](http://img.shields.io/travis/izaakschroeder/express-once/master.svg?style=flat)
![coverage](http://img.shields.io/coveralls/izaakschroeder/express-once/master.svg?style=flat)
![license](http://img.shields.io/npm/l/express-once.svg?style=flat)
![version](http://img.shields.io/npm/v/express-once.svg?style=flat)
![downloads](http://img.shields.io/npm/dm/express-once.svg?style=flat)

Ever wish you could make a function that would only ever be called once per request? Well now you can with `once`! Simple wrap your function in `once` and add as many times as you like to your app with the satisfcation that it will only ever be invoked... once.

```javascript
var express = require('express'),
	once = require('express-once');

var app = express();

// Ensure this function is only called once
var hello = once(function middleware(req, res, next) {
	console.log('Hello world.');
});

// Try to call it many times... but it won't!
app.use(hello, hello, hello);
```
