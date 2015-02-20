'use strict';

// Deps
var activityUtils = require('./activityUtils');
var activityCreate = require('./activityCreate');
var activityUpdate = require('./activityUpdate');

/*
 * GET home page.
 */
exports.index = function(req, res){
    if( !req.session.token ) {
        res.render( 'index', {
            title: 'Unauthenticated',
            errorMessage: 'This app may only be loaded via the ExactTarget Marketing Cloud',
        });
    } else {
        res.render( 'index', {
            title: 'Journey Builder Activity Example: Desk.com API',
            results: activityUtils.logExecuteData,
        });
    }
};

exports.login = function( req, res ) {
    console.log( 'req.body: ', req.body );
    res.redirect( '/' );
};

exports.logout = function( req, res ) {
    req.session.token = '';
};

