//Wait For The Drop
//Dan Steingart 2017
//Node replacement for the hoary drops.py

//Done:
//	- List Files with full state
//	- Serve Basic Indexhtml
//	- Uploads
//	- Basic CSS
//	- Make New Dir

//To Do:
// - auto zip
// - better css
// - authetication

var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var glob = require("glob")
var fs = require('fs');
var multiparty = require('multiparty');
var mv = require('mv')

//auth
var basicAuth = require('basic-auth');

var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === 'foo' && user.pass === 'bar') {
    return next();
  } else {
    return unauthorized(res);
  };
};

// http://stackoverflow.com/a/27855234/565514
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//List All Files
app.post('/list/',auth,function (req, res) {
	terms = req.body
	glob("/filez/"+unescape(terms['search'])+"/*", function (er, files)
	{
		bigout = [];
		for (f in files)
		{
			try{
				end = bigout.length
				bigout[end] = fs.statSync(files[f])
				bigout[end]['name'] = files[f].replace("/filez/","/")
				bigout[end]['is_dir'] = fs.lstatSync(files[f]).isDirectory()
			}
			catch(e){}
		}

		if (terms['search'] == "") bigout = {}
		res.send(bigout)
	})
})

//Post Function To get File
app.post("/filez/",auth,function (req,res){
	terms = req.body
	file = "/filez/"+terms['file']
	res.sendFile(file)
})

//post function to upload
app.post("/upload/",auth,function (req,res){
	var form = new multiparty.Form();
	form.parse(req, function(err, fields, files) {
		for (f in files)
		{
			tmp  = files[f][0]['path']
			goto = "/filez"+fields['path'][0]+files[f][0]['originalFilename']
			goto = unescape(goto)
			mv(tmp,goto,{mkdirp: true,clobber:false},function(err){
				//at some point this shoujld throw the error
				if (err == null)status = "ok"
				else status = err
				res.send({'status':status});
			})
		}

	});

})

//Starter Shell for Zipper
app.post("/zip",auth,function(req,res){

})

//Likely Over-Overloaded Get function
app.get("/*", function(req,res){
	//get request
	path = req.originalUrl
	file = "/filez"+unescape(path)

	//To start, assume we're going to serve an index
	var ind = __dirname+"/index.html"
	var tts = ind  //thing to send

	// if the request wants boiler plate send directly, don't look for directories
	if (path =="/robots.txt") tts = __dirname+'/robots.txt'
	else if (path.search("/static/") == 0) tts = __dirname+path

	//else check to see if this is a file we can send directly
	else if (fs.existsSync(file)) { if (fs.lstatSync(file).isFile()) tts = file }

	//Send whatever tts, with the caveat that 1) directories need trailing slashes and 2) boilerplate that we don't have gets a 404
	if ((tts == ind) & (req.url.substr(-1) != "/")) res.redirect(301, req.url+"/");
	else res.sendFile(tts,function(err){if (err) res.status(404).end("these are not the drops you're looking for")})
})



//Listen on Port 8000
port = 8000;
app.listen(port, function () {
  console.log('Example app listening on port '+port+'!')
})
