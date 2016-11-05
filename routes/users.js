//var now = require("date-now");
var dateTime = require('date-time');
module.exports.list = function(req, res) {

	req.getConnection(function(err, connection) {
		var query = connection.query('select * from user', function(err, rows) {
			if(err) {
				console.log(err);
			} else {
				
				//var date = dateTime(new Date(), {local: true});
				//console.log(date);
				res.render('users', {page_title: "Users - Node.js", data:rows});
			}
		});
	});
}




//add user form//

module.exports.add = function(req, res) {
	res.render('adduser.ejs',{page_title:"Add User - Node.js"});
}




//adding user in database//

module.exports.save = function(req, res) {

	var input = JSON.parse(JSON.stringify(req.body));

	req.getConnection(function(err, connection) {
		
		var data = {
			Name 	: input.name,
			Email   : input.email,
			Mobileno: input.mobileno,
			City    : input.city,
		    State   : input.state,
		    Country : input.country,
		    Zipcode : input.zipcode
		}
		var query = connection.query('insert into user set ?',data, function(err, rows) {
			if(err) {
				console.log(err);
			} else {
				res.redirect('/users');
			}
		});
	});
}



//editing the user data//

module.exports.edit = function(req, res) {

	var id = req.params.id;
	console.log('hello');

	req.getConnection(function(err, connection) {
		var query = connection.query('select * from user where userid = ?', [id] , function(err, rows) {
			if(err) {
				console.log(err);
			} else {

				
				res.render('edituser.ejs', {page_title: "Edit developers info - Node.js", data:rows});
			}
		}); 
	});
}




//updating user data//

module.exports.save_edit = function(req, res) {
	var input = JSON.parse(JSON.stringify(req.body));
	var id = req.params.id;
	req.getConnection(function(err, connection) {
		
		var userdata = {
			Name 	: input.name,
			Email   : input.email,
			Mobileno: input.mobileno,
			City    : input.city,
		    State   : input.state,
		    Country : input.country,
		    Zipcode : input.zipcode,
		    updatedon:dateTime(new Date(), {local: true})
		    
		}
		connection.query("update user set ? where userid = ?",[userdata,id], function(err, rows) {
			if(err) {
				console.log(err);
			} else {
				res.redirect('/users');
			}
		});
	});
}



//deleting user data//

module.exports.delete = function(req, res) {
	var id  = req.params.id;
	console.log(id);
	req.getConnection(function(err, connection) {
		connection.query("delete from user where userid = ?",[id], function(err, rows) {
			if (err) {
				console.log(err);
			} else {
				res.redirect('/users');
			}
		});
	});
}