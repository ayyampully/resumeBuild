module.exports = function(config, mongoose, nodemailer) {
	
	var crypto = require('crypto');
	
	var AccountSchema = new mongoose.Schema({
		username: { type: String, unique: true },
		email: { type: String, unique: true },
		password: { type: String },
		name: {
			first: { type: String },
			last: { type: String }
		},
		title: { type: String },
		company: { type: String },
		website: { type: String },
		mobile: { type: String },
		priSkill: { type: Array },
		photoUrl: { type: String },
		resume: { type: String }
	});
	
	var Account = mongoose.model('Account', AccountSchema);
	
	var registerCallback = function(err) {
		if (err) {
			return console.log(err);
		};
		return console.log('Account was created');
	};
	
	var changePassword = function(accountId, newpassword) {
		var shaSum = crypto.createHash('sha256');
		shaSum.update(newpassword);
		var hashedPassword = shaSum.digest('hex');
		Account.update({_id:accountId}, {$set: {password:hashedPassword}},{upsert:false},
		function changePasswordCallback(err) {
			console.log('Change password done for account ' + accountId);
		});
	};
	
	var updateResume = function(username, resume, callback) {
		Account.update({username:username}, {$set: {
			resume: resume
		}},{upsert:false},
		function updateResumeCallback(err) {
			callback();
		});
	};
	
	var updateUser = function(username, firstname, lastname, mobile, website, title, company, photoUrl, priSkill, callback) {
		Account.update({username:username}, {$set: {
			name: {
				first: firstname,
				last: lastname
			},
			title: title,
			company: company,
			mobile: mobile,
			website: website,
			photoUrl: photoUrl,
			priSkill: priSkill
		}},{upsert:false},
		function updateUserCallback(err) {
			callback();
		});
	};
	
	var forgotPassword = function(email, resetPasswordUrl, callback) {
		var user = Account.findOne({email: email}, function findAccount(err, doc){
			if (err) {
				// Email address is not a valid user
				callback(false);
			} else {
				var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
				resetPasswordUrl += '?account=' + doc._id;
				smtpTransport.sendMail({
					from: 'thisapp@example.com',
					to: doc.email,
					subject: 'SocialNet Password Request',
					text: 'Click here to reset your password: ' + resetPasswordUrl
				}, function forgotPasswordResult(err) {
					if (err) {
						callback(false);
					} else {
						callback(true);
					}
				});
			}
		});
	};
	
	var getUserDetails = function(username, callback) {
		var user = Account.findOne({username: username}, function findAccount(err, doc){
			if (err) {
				// No valid user
				callback(false);
			} else {
			console.log(doc);
				var details = {
					name: doc.name.first+" "+doc.name.last,
					firstname:doc.name.first,
					lastname:doc.name.last,
					title: doc.title,
					company: doc.company,
					mobile: doc.mobile,
					email: doc.email,
					website: doc.website,
					resume: doc.resume,
					priSkill: doc.priSkill
				}
				callback(details);
			}
		});
	};
	
	var login = function(username, password, callback) {
		var shaSum = crypto.createHash('sha256');
		shaSum.update(password);
		Account.findOne({
			username:username,
			password:shaSum.digest('hex')},
			function(err,doc){callback(null!=doc);});
	};
	
	var register = function(username, email, password, firstName, lastName, mobile, website, callback) {
		var shaSum = crypto.createHash('sha256');
		shaSum.update(password);
		username = username.toLowerCase();
		console.log('Registering ' + username);
		var userExists = false;
		var emailExists = false;
		//callback(false)
		Account.findOne({username:username }, function(err,rec) {
			if(rec){
				userExists = true;
				callback(rec, 'userExists')
			} else{
				Account.findOne({email:email }, function(errE,recE) {
					if(recE){
						emailExists = true;
						callback(recE, 'emailExists')
					} else{
						var user = new Account({
							username: username,
							email: email,
							name: {
								first: firstName,
								last: lastName
							},
							title: 'Title',
							company: 'Company',
							mobile: mobile,
							website: website,
							password: shaSum.digest('hex')
						});
						user.save(registerCallback);
						console.log('Save command was sent');
						callback();
					}
				});
			}
			
		});
		
	}
	
	return {
		register: register,
		forgotPassword: forgotPassword,
		updateResume: updateResume,
		updateUser: updateUser,
		changePassword: changePassword,
		login: login,
		getUserDetails: getUserDetails,
		Account: Account
	}
}