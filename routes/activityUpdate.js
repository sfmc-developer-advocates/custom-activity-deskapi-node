'use strict';
var https = require( 'https' );
var activityUtils = require('./activityUtils');


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

	//merge the array of objects.
	var aArgs = req.body.inArguments;
	var inArgs = {};
	for (var i=0; i<aArgs.length; i++) {  
		for (var key in aArgs[i]) { 
			inArgs[key] = aArgs[i][key]; 
		}
	}

	var caseID = inArgs.caseID;

	function controller(status, msg, data, err){
		if (err) {
			console.log('controller error', msg, status, data, 'error', err);
			res.json( status, err );
			return;
		}
		if (msg == 'updateCase') {
			console.log('controller updateCase', data);
			if (data.id) {
				res.send( 200, {caseID: data.id} ); //return the updated CaseID
			} else {
				res.send( 500, {message: 'Error updating caseID: ' + caseID} );
			}
		}
			
	};

	if (caseID) {
		updateCase(caseID, controller);
	} else {
		res.send( 500, {message: 'Error updating case.  CaseID was not provided.'} );
	}
};



function updateCase(caseID, next) {
	console.log('updateCase', caseID);
	var post_data = JSON.stringify({  
		"subject":"This case is now updated. CaseID: " + caseID + ". Priority: 10.",
		"priority":10
	});
		
	var options = {
		'hostname': activityUtils.deskCreds.host
		,'path': '/api/v2/cases/' + caseID
		,'method': 'PATCH'
		,'headers': {
			'Accept': 'application/json' 
			,'Content-Type': 'application/json'
			,'Content-Length': post_data.length
			,'Authorization': 'Basic ' + activityUtils.deskCreds.token
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
				console.log('onEND updateCase',response.statusCode,data.id);			
				next(response.statusCode, 'updateCase', {id: data.id});
			} else {
				next( response.statusCode, 'updateCase', {} );
			}				
		});								

	});
	httpsCall.on( 'error', function( e ) {
		console.error(e);
		next(500, 'updateCase', {}, { error: e });
	});				
	
	httpsCall.write(post_data);
	httpsCall.end();

};

