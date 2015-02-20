var util = require( 'util' );

exports.logExecuteData = [];

exports.logData = function ( req ) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path,
        host: req.host,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    /*
	console.log( "body: " + util.inspect( req.body ) );
	console.log( "headers: " + req.headers );
	console.log( "trailers: " + req.trailers );
	console.log( "method: " + req.method );
	console.log( "url: " + req.url );
	console.log( "params: " + util.inspect( req.params ) );
	console.log( "query: " + util.inspect( req.query ) );
	console.log( "route: " + req.route );
	console.log( "cookies: " + req.cookies );
	console.log( "ip: " + req.ip );
	console.log( "path: " + req.path );
	console.log( "host: " + req.host );
	console.log( "fresh: " + req.fresh );
	console.log( "stale: " + req.stale );
	console.log( "protocol: " + req.protocol );
	console.log( "secure: " + req.secure );
	console.log( "originalUrl: " + req.originalUrl );
	*/
};


exports._deskCreds = {
	subdomain: '__subdomain__'
	,username: '__username__'
	,userpw: '__password__'
};

exports.deskCreds.host = exports.deskCreds.subdomain + '.desk.com'; 
exports.deskCreds.supportEmail = 'support@' + exports.deskCreds.subdomain + '.desk-mail.com';
exports.deskCreds.token = new Buffer(exports.deskCreds.username + ':' + exports.deskCreds.userpw).toString('base64');


	