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

// http://stackoverflow.com/a/27855234/565514
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//List All Files
app.post('/list/', function (req, res) {
	terms = req.body
	glob("/filez/"+unescape(terms['search'])+"/*", function (er, files)
	{
		bigout = [];
		for (f in files)
		{
			try{
				end = bigout.length
				bigout[end] = fs.statSync(files[f])
				bigout[end]['name'] = files[f]
				bigout[end]['is_dir'] = fs.lstatSync(files[f]).isDirectory()
			}
			catch(e){}
		}

		if (terms['search'] == "") bigout = {}
		res.send(bigout)
	})
})

//Post Function To get File
app.post("/filez/", function (req,res){
	terms = req.body
	file = terms['file']
	res.sendFile(file)
})

//post function to upload
app.post("/upload/",function (req,res){
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

//Likely Over-Overloaded Get function
app.get("/*", function(req,res){
	file = "/filez"+unescape(req.originalUrl)
  path = req.originalUrl
	var ind = __dirname+"/index.html"
  var tts = ind  //thing to send
	//At some point there's a better way to do this logic chain.  Unilt then....

		if (path =="/robots.txt") tts = __dirname+'/robots.txt'
		else if (path.search("/static/") == 0) tts = __dirname+path
		else if (fs.existsSync(file))
		{
			if (fs.lstatSync(file).isFile()) tts = file
		}

		if ((tts == ind) & (req.url.substr(-1) != "/")) res.redirect(301, req.url+"/");
		else res.sendFile(tts,function(err){if (err) res.status(404).send("whatever you think you want, you don't")})

})

//Starter Shell for Zipper
app.post("/zip",function(req,res){

})


//Listen on Port 8000
port = 8000;
app.listen(port, function () {
  console.log('Example app listening on port '+port+'!')
})
