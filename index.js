//Wait For The Drop
//Dan Steingart 2017
//Node replacement for the hoary drops.py

//Done:
//	- List Files with full state
//	- Serve Basic Indexhtml
//	- Uploads
//	- Basic CSS
//	- Make New Dir
// - authentication

//To Do:
// - auto zip
// - better css

var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var {glob} = require("glob")
var fs = require('fs');
var multiparty = require('multiparty');
var mv = require('mv')
var randomstring = require("randomstring");
var argv = require('minimist')(process.argv.slice(2));
console.dir(argv);


//auth
var basicAuth = require('basic-auth');

var gen_user = randomstring.generate();
var gen_pass = randomstring.generate();

if (process.env.GEN_USER != undefined) gen_user = process.env.GEN_USER
else if (argv['user'] != undefined)    gen_user = argv['user'] ;

if (process.env.GEN_PASS != undefined) gen_pass = process.env.GEN_PASS
else if (argv['pass'] != undefined)    gen_pass = argv['pass'] ;

if (process.env.GEN_FILE != undefined) gen_file = process.env.GEN_FILE
else if (argv['file'] != undefined)    gen_file = argv['file'] ;
else gen_file = '/filez/'

var port = 8000;
if (argv['p'] != undefined) port = argv['p']

console.log("user: "     + gen_user);
console.log("pass: "     + gen_pass);
console.log("file dir: " + gen_file);


var auth = function (req, res, next) {
	if (argv['auth'] != 'false')
	{
	  function unauthorized(res) {
	    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
	    return res.send(401);
	  };
	  var user = basicAuth(req);
	
	  if (!user || !user.name || !user.pass) { return unauthorized(res);};
	
	  if (user.name === gen_user && user.pass === gen_pass) {return next();}
	  else {return unauthorized(res);};
	}
	else {
		//console.log('skip auth')

		next()
		};
};

// http://stackoverflow.com/a/27855234/565514
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//List All Files
app.post('/list/',auth,function (req, res) {
	terms = req.body
	files = glob(gen_file+unescape(terms['search'])+"/*"));
	bigout = [];
	for (f in files)
	{
		try{
			end = bigout.length
			bigout[end] = fs.statSync(files[f])
			bigout[end]['name'] = files[f].replace(gen_file,"/")
			bigout[end]['is_dir'] = fs.lstatSync(files[f]).isDirectory()
			}
			catch(e){}
	}

	if (terms['search'] == "") bigout = {}
	res.send(bigout)
	
})

//Post Function To get File
app.post("/filez/",auth,function (req,res){
	terms = req.body
	file = gen_file+terms['file']
	res.sendFile(file)
})

// post function to upload
app.post("/upload/",auth,function (req,res){
	var form = new multiparty.Form();
	console.log("here")
	form.parse(req, function(err, fields, files) {
		console.log("and here")
		console.log(fields);
		console.log(files);
		for (f in files)
		{
			console.log("and finally...")
			clobber = fields['clobber']
			if (clobber != undefined) clobber = true;
			else clobber = false
			
			tmp  = files[f][0]['path']
			console.log(tmp)
			goto = gen_file+fields['path'][0]+files[f][0]['originalFilename']
			console.log(goto)
			goto = unescape(goto)
			mv(tmp,goto,{mkdirp: true,clobber:clobber},function(err){
				//at some point this shoujld throw the error
				if (err == null)status = "ok"
				else status = err
				res.send({'status':status});
			})
		}

	});
})

//Starter Shell for Zipper
app.post("/zip",auth,function(req,res){ })

//Likely Over-Overloaded Get function
app.get("/*", function(req,res){
	//get request
	path = req.originalUrl
	file = gen_file+unescape(path)

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


app.listen(port, function () {
  console.log('we be listening on port '+port+'!')
})
