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
				res.send('{"status":"ok"}');
				console.log(goto)
				console.log(err)

			})
		}

	});

})

//Likely Over-Overloaded Get function
app.get("/*", function(req,res){
	file = "/filez"+unescape(req.originalUrl)
	var ind = __dirname+"/index.html"
	if (fs.existsSync(file))
	{
		if (fs.lstatSync(file).isFile()) res.sendFile(file)
		else
		{
			if (req.url.substr(-1) != "/") res.redirect(301, req.url+"/");
			else res.sendFile(ind)
		}
	}
	else
	{	if (req.url.substr(-1) != "/") res.redirect(301, req.url+"/");
		res.sendFile(ind)
	}

})

//Starter Shell for Zipper
app.post("/zip",function(req,res){

})


//Listen on Port 8000
port = 8000;
app.listen(port, function () {
  console.log('Example app listening on port '+port+'!')
})
