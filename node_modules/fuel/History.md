fuel History
============

v0.4.1 2014-01-21
-----------------

This release fixes an issue where an error response from the token request
will cache the invalid state forever.

  * Forward error from the request to the callback.
  * Only cache token requests when the response body contains an `expiresIn`
    property (i.e. do not cache error responses).

v0.4.0 2013-12-03
-----------------

This release adds better token handling when using automatic token
management.

  * `request` module updated to v2.27.0 from v0.12.0.
  * Return error when fetching token automatically for request fails.
  * Attempt to fetch new token after a request fails with invalid token
    response.

v0.3.1 2013-10-17
-----------------

This release fixes a regression in v0.3.0 where tokens would never expire
and so after token expiration time was reached, all requests would result
in `401 Unauthorized`.

  *  Fix omission preventing memorized tokens from expiring.

v0.3.0 2013-10-17
-----------------

This release removes the token expiration timer. The main benefit is that
the expiration will occur even if the event loop is being starved or the
clock drifts.

  * Replace timer in token response memorization with on-demand checks.
  * Use monotonic clock for memorization expiration rather than wall clock.

v0.2.3 2013-10-08
-----------------

This release contains a fix for a regression in `v0.2.2` that broke
compatibility with node < 0.10.

  * Fix compatibility with Node.js below v0.10.

v0.2.2 2013-06-11
-----------------

  * Prevent token expiration timer from artificially keeping the event
    loop open.

v0.2.1 2013-03-20
-----------------

  * Copy stored options to avoid collision.

v0.2.0 2013-02-02
-----------------

  * Improve validation of options.
  * Support arrays within request body.
  * Cache OAuth errors for 10 seconds.

v0.1.0 2013-01-26
-----------------

This is the first, initial implementation.
