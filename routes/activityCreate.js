'use strict';
var https = require( 'https' );
var activityUtils    = require('./activityUtils');

var host = '__subdomain__.desk.com';
var username = '__username__';
var userpw = '__password__';
var token = new Buffer(username + ':' + userpw).toString('base64');


/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );
    res.send( 200, 'Edit' );
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );
    res.send( 200, 'Save' );
};

/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );
    res.send( 200, 'Publish' );
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );
    res.send( 200, 'Validate' );
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );

	initCase(req,res);
};


function initCase(req,res) {
/*
	Search for email address
	If found, use it to create a case.
	If not found,
		create customer
		use new customer id to create case.
*/

	//merge the array of objects.
	var aArgs = req.body.inArguments;
	var oArgs = {};
	for (var i=0; i<aArgs.length; i++) {  
		for (var key in aArgs[i]) { 
			oArgs[key] = aArgs[i][key]; 
		}
	}

	var email = oArgs.emailAddress;
	var fname = oArgs.firstName;
	var lname = oArgs.lastName;
	var priority = oArgs.priority;

	function controller(status, msg, data, err){
		if (err) {
			console.log('controller error', msg, status, data, 'error', err);
			res.json( status, err );
			return;
		}
		if (msg == 'findCustIdByEmail') {
			console.log('controller findCustIdByEmail', data);
			if (data.id) {
				createCase(data.id, email, priority, controller);
			} else {
				createCustomer({fname:fname,lname:lname,email:email}, controller);
			}
		} else if (msg == 'createCase') {
			console.log('controller createCase', data);
			if (data.id) {
				res.send( 200, 'Execute' );
			} else {
				res.send( 500, {message: 'Error creating Desk.com case.'} );
			}					
		} else if (msg == 'createCustomer') {
			console.log('controller createCustomer', data);
			if (data.id) {
				createCase(data.id, email, priority, controller);
			} else {
				res.send( 500, {message: 'Error creating customer'} );
			}
		}
			
	};

	findCustIdByEmail(email, controller);
};


function findCustIdByEmail(email, next) {
	console.log('findCustIdByEmail', email);
	var post_data = '';				
	var options = {
		'hostname': host
		,'path': '/api/v2/customers/search?email=' + email 
		,'method': 'GET'
		,'headers': {
			'Accept': 'application/json' 
			,'Content-Type': 'application/json'
			,'Content-Length': post_data.length
			,'Authorization': 'Basic ' + token
		},
	};				
	
	var httpsCall = https.request(options, function(response) {
		var data = ''
			,redirect = ''
			,error = ''
			;
		response.on( 'data' , function( chunk ) {
			data += chunk;
		} );				
		response.on( 'end' , function() {
			if (response.statusCode == 200) {
				data = JSON.parse(data);
				console.log('onEND findCustIdByEmail',response.statusCode, 'found count:',data.total_entries);
				if (data.total_entries > 0) {
					next(response.statusCode, 'findCustIdByEmail', {id: data._embedded.entries[0].id});
				} else {
					next( response.statusCode, 'findCustIdByEmail', {} );
				}					
			} else {
				next( response.statusCode, 'findCustIdByEmail', {} );
			}
		});								

	});
	httpsCall.on( 'error', function( e ) {
		console.error(e);
		next(500, 'findCustIdByEmail', {}, { error: e });
	});				
	
	httpsCall.write(post_data);
	httpsCall.end();
};


function createCustomer(data, next) {
	console.log('createCustomer', data.fname, data.lname);
	var post_data = JSON.stringify({  
		"first_name":data.fname
		,"last_name":data.lname
		,"emails": [
			{
				"type": "other",
				"value": data.email
			}
    	]
	});			
		
	var options = {
		'hostname': host
		,'path': '/api/v2/customers'
		,'method': 'POST'
		,'headers': {
			'Accept': 'application/json' 
			,'Content-Type': 'application/json'
			,'Content-Length': post_data.length
			,'Authorization': 'Basic ' + token
		},
	};				
	
	var httpsCall = https.request(options, function(response) {
		var data = ''
			,redirect = ''
			,error = ''
			;
		response.on( 'data' , function( chunk ) {
			data += chunk;
		} );				
		response.on( 'end' , function() {
			if (response.statusCode == 201) {
				data = JSON.parse(data);
				console.log('onEND createCustomer',response.statusCode,data.id);
				if (data.id) {
					next(response.statusCode, 'createCustomer', {id: data.id});
				} else {
					next( response.statusCode, 'createCustomer', {} );
				}
			} else {
				next( response.statusCode, 'createCustomer', {} );
			}				
		});								

	});
	httpsCall.on( 'error', function( e ) {
		console.error(e);
		next(500, 'createCustomer', {}, { error: e });
	});				
	
	httpsCall.write(post_data);
	httpsCall.end();
};


function createCase(custId, email, priority, next) {
	console.log('createCase', custId);
	var post_data = JSON.stringify({  
		"type":"email",
		"subject":"Email Case From JB for " + email,
		"priority":priority,
		"status":"open",
		"labels": ["JB"],
		"message":{  
			"direction":"in",
			"to":"support@sfmc-jb-activity.desk-mail.com",
			"from": email,
			"body": "This is a new case created for a customer coming from Journey Builder.",
			"subject":"My email subject"
		}
	});			
		
	var options = {
		'hostname': host
		,'path': '/api/v2/customers/' + custId + '/cases'
		,'method': 'POST'
		,'headers': {
			'Accept': 'application/json' 
			,'Content-Type': 'application/json'
			,'Content-Length': post_data.length
			,'Authorization': 'Basic ' + token
		},
	};				
	
	var httpsCall = https.request(options, function(response) {
		var data = ''
			,redirect = ''
			,error = ''
			;
		response.on( 'data' , function( chunk ) {
			data += chunk;
		} );				
		response.on( 'end' , function() {
			if (response.statusCode == 201) {
				data = JSON.parse(data);
				console.log('onEND createCustomer',response.statusCode,data.id);			
				next(response.statusCode, 'createCase', {id: data.id});
			} else {
				next( response.statusCode, 'createCase', {} );
			}				
		});								

	});
	httpsCall.on( 'error', function( e ) {
		console.error(e);
		next(500, 'createCase', {}, { error: e });
	});				
	
	httpsCall.write(post_data);
	httpsCall.end();

};

