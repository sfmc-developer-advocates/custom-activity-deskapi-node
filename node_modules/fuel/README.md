# fuel

Client for ExactTarget's Fuel REST APIs

[![Build Status](https://travis-ci.org/ExactTarget/node-fuel.png?branch=master)](https://travis-ci.org/ExactTarget/node-fuel)

## Getting Started
Install the module with: `npm install fuel`

### Call a Fuel REST API

```javascript
// Load and configure the module

var fuel = require('fuel').configure({
	authUrl: 'https://auth.exacttargetapis.com/v1/requestToken',
	clientId: 'xxxxxxxxxxxxxxxxxxxxxxxx',
	clientSecret: 'yyyyyyyyyyyyyyyyyyyyyyyy'
});

// OR, if you have a refresh token

var fuel = require('fuel').configure({
	authUrl: 'https://auth.exacttargetapis.com/v1/requestToken',
	clientId: 'xxxxxxxxxxxxxxxxxxxxxxxx',
	clientSecret: 'yyyyyyyyyyyyyyyyyyyyyyyy',
	refreshToken: 'zzzzzzzzzzzzzzzzzzzzzzzz',
	accessType: 'offline'
});

// The fuel module will manage your access token behind the
// scenes, renewing it when necessary, maintaining state
// using the refresh token if present

// Call the API (this example displays your user context)

fuel({
	url: 'https://www.exacttargetapis.com/platform/v1/tokenContext'
}, function (error, request, body) {
	console.log(body);
});
```
#### Syntax

The general format is as follows:

`fuel(options, callback);`

The `options` and `callback` parameters are compatible with the `request` module.  For details, see the documentation:

https://github.com/mikeal/request#requestoptions-callback

### Just manage a Fuel OAuth token

```javascript
// Load and configure the module

var token = require('fuel').token.configure({
	authUrl: 'https://auth.exacttargetapis.com/v1/requestToken',
	clientId: 'xxxxxxxxxxxxxxxxxxxxxxxx',
	clientSecret: 'yyyyyyyyyyyyyyyyyyyyyyyy'
});

// OR, if you have a refresh token

var token = require('fuel').token.configure({
	authUrl: 'https://auth.exacttargetapis.com/v1/requestToken',
	clientId: 'xxxxxxxxxxxxxxxxxxxxxxxx',
	clientSecret: 'yyyyyyyyyyyyyyyyyyyyyyyy',
	refreshToken: 'zzzzzzzzzzzzzzzzzzzzzzzz',
	accessType: 'offline'
});

// Get a token (this example displays the token data)

token(function (error, response, tokenData) {
	console.log(tokenData);
});

// Repeated calls to the token function will return a cached
// token. This module will manage your access token behind the
// scenes, renewing it when necessary, maintaining state
// using the refresh token if present
```

#### Syntax

The general format is as follows:

`token(callback);`

The `callback` parameter is compatible with the `request` module.  For details, see the documentation:

https://github.com/mikeal/request#requestoptions-callback

## Contributing
Before writing code, we suggest you [search for issues](https://github.com/ExactTarget/node-mashery/issues?state=open)
or [create a new one](https://github.com/ExactTarget/node-mashery/issues/new) to confirm where your contribution fits into
our roadmap.

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality.
Lint and test your code using [grunt](https://github.com/cowboy/grunt).

## Acknowledgements

We are grateful to the following maintainers, contributors, and sponsors of the technologies used by this module.

* [Node.js](http://nodejs.org)

* [Request](https://github.com/mikeal/request) (De facto HTTP request module for Node)

* [grunt](https://github.com/cowboy/grunt) (Build tool for JavaScript projects)

##Authors

**Adam Alexander**

+ http://twitter.com/adamalex
+ http://github.com/adamalex

**Benjamin Dean**

+ https://twitter.com/bdeanet
+ https://github.com/creatovisguru

**Douglas Wilson**

+ https://twitter.com/blipsofadoug
+ https://github.com/dougwilson

## Copyright and license

Copyright (c) 2013 ExactTarget

Licensed under the MIT License (the "License");
you may not use this work except in compliance with the License.
You may obtain a copy of the License in the COPYING file.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
