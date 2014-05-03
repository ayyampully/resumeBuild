var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
var fs = require('fs')
var MemoryStore = require('connect').session.MemoryStore;
var easyimg = require('easyimage');
var gm = require('gm').subClass({ imageMagick: true });;
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Import the data layer
var mongoose = require('mongoose');
var config = {
	mail: require('./data/mail')
};
// Import the accounts
var Account = require('./model/account')(config, mongoose, nodemailer);

app.configure(function(){
	app.set('view engine', 'jade');
	app.use(express.static(__dirname + '/public'));
	app.use(express.limit('6mb'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({
		secret: "resumeBuild key", store: new MemoryStore()
	}));
	if(env==='development'){
		mongoose.connect('mongodb://localhost/resumeBuildDb');
	}else{
		mongoose.connect('mongodb://rohith:Rose@1991@ds037478.mongolab.com:37478/resumebuild');
	}
	
});

app.get('/', function(req, res){
	res.render("index.jade", {layout:false});
});

/* app.post('/imagecrop', function(req, res){

	var width = req.body.imgWidth;
	var height = req.body.imgHeight;
	var cropwidth = req.body.cropWidth;
	var cropheight = req.body.cropHeight;
	var x = req.body.cropX;
	var y = req.body.cropY;
	console.log(cropwidth)
	
	if(width==0 || height==0){
		res.send(400)
	} else {
		var readStream = fs.readFileSync(req.session.src); 
		
		/*gm(readStream, 'profile_rohith_a.jpg').crop(cropwidth, cropheight, x, y).stream('jpg', function (err, stdout, stderr) {
		//res.send(400, err)
		  var writeStream = fs.createWriteStream(__dirname + "/public/uploads/profile_new.jpg");
		  console.log(writeStream)
		  stdout.pipe(writeStream);
		});
		gm(readStream, 'profile_rohith_a.jpg').crop(cropwidth, cropheight, x, y).write(req.session.src, function (err) {
		  if (err) console.log(err);
		  console.log('Created an image from a Buffer!');
		});
		
	}
}); */

app.post('/imageupload', function(req, res){
	var image = req.files.displayImage;
	var ext = (image.name).split('.');
	ext = ext.pop();
	console.log(ext)
	fs.readFile(image.path, function (err, data) {
		
	  var newPath = __dirname + "/public/uploads/profile_"+req.session.username+"."+ext;
	  fs.writeFile(newPath, data, function (err) {
		if(err){
			res.send(400, err);
		} else{
			var data = {
				src:"/uploads/profile_"+req.session.username+"."+ext
			}
			req.session.src = newPath; 
			res.send(200, data);
		}
	  });
	});
	
});

app.post('/imagecrop', function(req, res){

	var width = req.body.imgWidth;
	var height = req.body.imgHeight;
	var cropwidth = req.body.cropWidth;
	var cropheight = req.body.cropHeight;
	var x = req.body.cropX;
	var y = req.body.cropY;
	console.log(cropwidth)
	if(width==0 || height==0){
		res.send(400)
	} else {
		easyimg.crop({
				 src: req.session.src,
				 dst: req.session.src,
				 cropwidth: cropwidth,
				 cropheight: cropheight,
				 x: x, y: y
			},
		  function(err, image) {
			 if (err) throw err;
			 console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
			 res.send(200, 'Resized and cropped: ' + image.width + ' x ' + image.height);
		});
	}
});

app.post('/login', function(req, res) {
	console.log('login request');
	var username = req.param('username', null);
	var password = req.param('password', null);
	if ( null == username || username.length < 1 || null == password || password.length < 1 ) {
		res.send(400);
		return;
	}
	Account.login(username, password, function(success) {
		if ( !success ) {
			res.send(401, 'Invalid username or password');
			return;
		}
		console.log('login was successful');
		req.session.loggedIn = true; 
		req.session.username = username; 
		res.send(200, 'Successfully logged in');
	});
});

app.post('/register', function(req, res) {
	var firstName = req.param('firstName', '');
	var lastName = req.param('lastName', '');
	var email = req.param('email', null);
	var mobile = req.param('mobile', null);
	var username = req.param('username', null);
	var password = req.param('password', null);
	var website = req.param('website', '');
	if ( null == username || null == password ) {
		res.send(400);
		return;
	}
	Account.register(username, email, password, firstName, lastName, mobile, website, function(data, err){
		if(data){
			if(err=="emailExists"){
				res.send(400, 'Email already exists');
			}else{
				res.send(400, 'Username already exists');
			}
		} else {
			res.send(200, 'Account created successfully');
		}
	});
	
});

app.post('/updateuser', function(req, res) {
	var username = req.param('username', null);
	var firstname = req.param('firstname', '');
	var lastname = req.param('lastname', '');
	var title = req.param('title', null);
	var company = req.param('company', null);
	var mobile = req.param('mobile', null);
	var photoUrl = req.param('photoUrl', '');
	var website = req.param('website', '');
	var priSkill = req.param('priSkill', null);
	if ( null != username && null != firstname && null != lastname) {
		Account.updateUser(username, firstname, lastname, mobile, website, title, company, photoUrl, priSkill, function(){
			res.send(200);
		});
	}
	
});

app.post('/updateresume', function(req, res) {
	var username = req.param('username', null);
	var resume = req.param('resume', null);
	
	if ( null != username && null != resume) {
		Account.updateResume(username, resume, function(){
			res.send(200, 'Resume added to profile');
		});
	} else {
		res.send(400);
		return;
	}
	
});

app.post('/getuser', function(req, res) {
	console.log('details request');
	var username = req.param('username', null);
	if ( req.session.loggedIn ) {
		username = req.session.username;
	}
	if ( null == username || username.length < 1 ) {
		res.send(400);
		return;
	}
	Account.getUserDetails(username, function(success) {
		if ( !success ) {
			res.send(401, 'Invalid user');
			return;
		} else{
			console.log('User found');
			res.send(200, success);
		}
		
		
	});
});

app.get('/getsession', function(req, res) {

	if ( req.session.loggedIn ) {
		Account.getUserDetails(req.session.username, function(details) {
			if ( !details ) {
				res.send(401, 'Invalid session');
				return;
			} else{
				console.log('Session found');
				var data = {
					name: details.firstname,
					username: req.session.username
				}
				res.send(200, data);
			}
		});
	} else {
		res.send(401);
	}
});

app.get('/resetsession', function(req, res) {

	if ( req.session.loggedIn ) {
		req.session.loggedIn = false; 
		req.session.username = null; 
	}
	res.send(200, 'Log out successfully');
});


var port = process.env.PORT || 8080;
app.listen(port);
console.log('Server is at port:'+port)