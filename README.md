# Journey Builder
## Custom Activities - Desk.com API

This nodejs app is a Journey Builder Application Extension containing two custom activities.  Create Case creates an email case using Desk.com's API in response to a JB interaction trigger being fired.  Update Case is to be placed after Create Case within an interaction and will update the subject and priority of the newly created case.

**Abbreviated Instructions**(for those who have done this sorta thing before)

* Create a desk.com trial account.
* Clone this repo, add your App Center and desk.com configs, push to web server.
* Reload JB, create JB Interaction and trigger, drag this activity ("Desk.com Create Case") onto JB canvas, configure, save, activate your interaction.
* Use REST client to fire the event.
* A desk.com case will be created in your desk.com account.



**What the Create Case custom activity demonstrates**

* The necessary pieces of a custom JB activity.
* Multi-step activity configuration.
* Use of inArguments for data-binding to the Contact Model.
* Use of outArguments for passing data downstream from this activity to another activity further down in the interaction.
* Default configuration values.
* User override of default configuration values during configuration of activity.
* Display of user-selected values during edit of activity.
* Display of custom activity version (from package.json) for more transparent development iteration.
* Use of the Desk.com API.

**What the Update Case custom activity demonstrates**

* Single-step activity configuration.
* Use of inArguments for receiving data from another activity further upstream in the interaction.



**NOTE:** You won't be able to run this locally. It is intended to be ran on a publicly available web server/cloud only.

**NOTE:** This app and the associated code is NOT intended to be production quality. Its pure purpose is to demonstrate the full flow of custom activities in Journey Builder


### How does it work?

Your interaction contains a trigger (ie. foo equals 123) and subsequent activities (ie. 'send this email').  Something happens in the real world (ie. oil change is due) to [fire an event](http://code.exacttarget.com/app-development/journey-builder-development/events/how-to-fire-an-event.html).  If your trigger condition resolves to true (foo === 123), your interaction will begin.  Data in the payload will be used to update SFMC, then your custom activities' execute function (see /routes/activityCreate.js) will be called.  The public folder pertains to configuration of the custom activity.  This is what users of Journey Builder see when they drag your activity onto the canvas and click Configure.




### A Note About Your Data

It's very important to have your data setup correctly in your Marketing Cloud account.  The [Journey Builder for Apps ebook](https://code.exacttarget.com/resources/jb4a-dev-ebook.pdf) describes a scenario that can be used to test this custom activity.  Instructions for setting up that data can be found in the links below.  The gist is that you'll need subscribers linked to a Data Extension, which in turn will be linked to an Attribute Group in Contact Builder.  Notice that config.json contains:

<pre>
"inArguments":[
	{ "firstName":"{{Contact.Attribute.__your-de-name__.FirstName}}"},
	{ "lastName":"{{Contact.Attribute.__your-de-name__.LastName}}"},
	{ "emailAddress": "{{Contact.Default.Email}}"}							
],
</pre>

When your interaction trigger is fired, the payload you send will be for either an existing contact or a new contact.  If for a new contact, also pass in First and Last name so your contact can be updated with those values before your activities' 'execute' function is called. (Make sure your contact model has enabled "Use as root", otherwise your trigger will fail.)  These inArguments are data that will be passed to your custom activity.  In the documentation for [data binding](http://code.exacttarget.com/app-development/journey-builder-development/interactions/how-data-binding-works.html), attribute sets are synonymous with data extensions.  '&#95;&#95;your-de-name&#95;&#95;' is the name of your data extension.

* [Setup your email and subscriber data](https://code.exacttarget.com/getting-started/sending-your-first-email/sending-your-first-email.html)
* [Setup your data extension](https://code.exacttarget.com/getting-started/sending-your-first-email/going-further-with-data-extensions.html)
* [Setup your contact model](https://code.exacttarget.com/getting-started/creating-your-first-interaction/setting-up-the-contact-model-using-contact-builder.html)
* [Setup your interaction](https://code.exacttarget.com/getting-started/creating-your-first-interaction/creating-your-first-interaction.html)


### Debugging Tools and Techniques

* The Network tab in Chrome Developer Tools comes in handy.
* Chrome extension called Postman.
* You may need to use the SFMC [REST API](http://code.exacttarget.com/apis-sdks/rest-api/v1/interaction/rest.html) to get data, check on status, delete triggers or interactions, etc.
* You'll need tokens to run the REST routes.  One way to find a current Bearer token is from the Network tab in your Marketing Cloud session.  Filter on "update" to find the update-token call.  Click on it and click the Preview tab to find the accessToken property.  If you can't find update-token, open the Email application and look again.
	* The interaction routes (other than trigger firing) need X-CSRF-Token, not Bearer.  That can be found the same way in Journey Builder; for instance when viewing all interactions, look for this route in the Network tab: fuelapi/interaction/v1/interactions/.
* Note: code@ documentation is in the process of being updated, but still may be useful in the meantime. This repo should be considered more up-to-date than the doc as of 1/29/2015.
* [Tool for running REST routes](http://iodocs-code.exacttargetapps.com/)
* Journey Builder Documentation:
	* [helpdot Getting Started With Journey Builder](http://help.exacttarget.com/en/documentation/journey_builder/getting_started_with_journey_builder/)
	* [code@ Journey Builder Development](http://code.exacttarget.com/app-development/journey-builder-development/)
	* [helpdot Journey Builder](http://help.exacttarget.com/en/documentation/journey_builder/)
* If your activity returns a system error when trying to activate, get more information by using the [publish](http://code.exacttarget.com/apis-sdks/rest-api/v1/interaction/postPublishInteractionById.html) and [status](http://code.exacttarget.com/apis-sdks/rest-api/v1/interaction/getPublishStatus.html) REST routes.
* The API comes in handy if you need to delete interactions or triggers outside of the UI:
	* Delete an interaction:
		* [Stop an interaction first](http://code.exacttarget.com/apis-sdks/rest-api/v1/interaction/postStopInteractionById.html)
		* [Then delete it](http://code.exacttarget.com/apis-sdks/rest-api/v1/interaction/deleteInteractionById.html)
	* Delete a trigger:
		* Get the payload: GET https://jbinteractions.exacttargetapps.com/rest/beta/interactionstudio/eventdefinition/<id>
		* Modify payload: isActive: false
		* Post the modified payload: POST https://jbinteractions.exacttargetapps.com/rest/beta/interactionstudio/eventdefinition/<id>
* When making a UI change to an activity, you'll have to get rid of the previous version first.  Follow these steps:
	* Update your version number in package.json (or where appropriate for your language/code)
	* Push your new version to the web server.
	* In JB, stop the running interaction.
	* New Draft
	* Delete the activity from the interaction.
	* Save.
	* Reload the page. (this causes JB to re-read the new config.json file)
	* Drag your activity onto the interaction.
	* Configure.  If your activity includes code to get and display the version (like this activity does), you should see the new version number.
	* This is a good way to make sure you are using the activity version you expect.
* Find out what really happened to your interaction after firing its trigger.
	* Network tab, clear all data.
	* Navigate to Admin/Contacts.
	* Click on the route: interaction/v1/interactions/traceevents/search
	* Network tab/Response tab: a more detailed error is probably in there telling you why it failed.
* Quick-check your code
	* Before pushing to your web server, run "node app".  This will catch any syntax errors in the server-side (non-UI) code.
* Make sure your URL endpoints in config.json point to valid endpoints.  A typo here can cost you days you'll never get back.
* Run your config.json files through a JSON linter.  A misplaced comma will throw an error when JB tries to access the config files.



### Pre-Requisites

* Desk.com trial account
* Must have an ExactTarget Marketing Cloud account
* Journey Builder and all associated applications  must be provisioned into this account
* A publicly accessible web server or cloud (I'll be using [Heroku](https://heroku.com) with a single dyno and you can too, just sign up for a free account) You'll need the Heroku toolbelt if you're using that PaaS for this app.
* Web Server or Cloud MUST support SSL (which is why we recommend Heroku...it just works for single dyno apps)
* A valid Code@ account and associated App Center Developer Account (available from within Code@)
* Understanding of client-server communications, JavaScript, HTML(5), Node.js and Express
* Data setup in Sales Force Marketing Cloud according to [these instructions](https://code.exacttarget.com/getting-started)
	* Your subscribers will need to be linked to a DE, which needs to be linked to the Contact Model.  Set the link to "Use as root".
	* [Info on setting up the Contact Model](https://code.exacttarget.com/getting-started/creating-your-first-interaction/setting-up-the-contact-model-using-contact-builder.html)


### How To Use

#### Creating our base app in App Center

1. clone this repository locally
    git clone git@github.com:sfmc-developer-advocates/custom-activity-deskapi-node

2. Login to [App Center](https://code.exacttarget.com/appcenter). 'Create Account' as a developer if you haven't already.

3. Select "Create New App"

4. Select "Application Extension" as the template type and use the following properties:
    * App Type: App Extension
    * Name: JB Activity Desk.com
    * Description: Activities that interact with desk.com API
    * Package: &lt;THIS MUST BE UNIQUE ACROSS ALL OF EXACTTARGET&gt; (I recommend something like johndoe-jb-custom-activity-deskapi) where you replace johndoe with your first and last name
    * Would you like to use an existing App ID: No
    * Application Event Callbacks: Not required
    
5. Integrate your app with an account which will use this activity.
	* It's helpful if are already logged into the Marketing Cloud account that you want to integrate with, before reaching this step.
	* If you do not see your account in the drop down, select 'New'.
	* If you are not logged into the account, it will direct you to login.
	* If you are already logged in, it will ask you to confirm that you want to integrate with the account.
	
6. Data Access: No (SSO Only)

7. Make sure everything is correct.  Take note of the appID, app signature, clientID, and client secret.  These will be pasted into the code.


#### Defining our Activity App Extension (still in App Center)

1. Select the Journey Builder Activity tab and click the plus sign (+) to begin creating an entry.
	* Name: Create Case
	* Key: johndoe-jb-example-activity-desk-create-case  (this key will be used in the config.json file)
	* Description: Create a case via Desk.com API
	* Endpoint URL: https://&lt;your sub domain here&gt;.herokuapp.com/ixn/activities/create-case  (wherever you plan to host the app; can be edited later)
	* Help URL/Description: Not required
	* Category: Messaging
	* Public Extension: This application and other installed applications
2. Save.
3. Click the plus sign (+) again.
	* Name: Update Case
	* Key: johndoe-jb-example-activity-desk-update-case  (this key will be used in the config.json file)
	* Description: Update a case via Desk.com API
	* Endpoint URL: https://&lt;your sub domain here&gt;.herokuapp.com/ixn/activities/update-case  (wherever you plan to host the app; can be edited later)
	* Help URL/Description: Not required
	* Category: Messaging
	* Public Extension: This application and other installed applications
4. Save.



#### Copying App Center Data

1. Open /app.js

2. Copy the values from the App Center Summary Screen into this section of code in app.js

<pre>
    var APIKeys = {
        appId           : '__insert_your_app_id__',
        clientId        : '__insert_your_app_client_id__',
        clientSecret    : '__insert_your_app_client_secret__',
        appSignature    : '__insert_your_app_signature__',
        authUrl         : 'https://auth.exacttargetapis.com/v1/requestToken?legacy=1'
    };
</pre>


#### Web Server

1. At this point we're going to need the endpoint for our app and subsequently each app extension

2. If you're using Heroku, create a new app and copy the endpoint into App Center for this activity.


#### Updating the code to reflect our new App Extensions
1. Open /public/ixn/activities/create-case/config.json and /public/ixn/activities/update-case/config.json  

2. Replace '&#95;&#95;activity-key&#95;&#95;' with the "Key" value of your App Extension Custom Activity (ie. johndoe-jb-example-activity-desk-create-case).  

3. Replace '&#95;&#95;insert_your_custom_activity_endpoint&#95;&#95;' with your web server's endpoint throughout the file.

4. Replace '&#95;&#95;your-de-name&#95;&#95;' with the name of the data extension you want to use for this interaction.

5. In update-case config, replace '&#95;&#95;your-activity-customer-key&#95;&#95;' with the interaction-unique 'key' value (ie. REST-1) for create-case activity.
	You can get it by querying for details about your interaction:

<pre>
<code>
headers: 
Authorization: Bearer &lt;token&gt;
Content-Type: application/json
GET https://jbinteractions.exacttargetapps.com/fuelapi/interaction/v1/interactions/&lt;guid&gt;?extras=all&versionNumber=9
</code>
</pre>
You can find your interaction's guid in the Network Tab (chrome) when you view interactions in Journey Builder. (https://jbinteractions.exacttargetapps.com/fuelapi/interaction/v1/interactions/)


#### Updating the code to reflect our new Desk.com trial account
1. Open /routes/activityUtils.js

2. Replace '&#95;&#95;subdomain&#95;&#95;', '&#95;&#95;username&#95;&#95;', and '&#95;&#95;password&#95;&#95;' with your desk.com subdomain, username and password values.
	* make sure the desk.com user has either admin or API rights.


#### Deploy application to host
* Run 'node app' to make sure there are no issues with the app.
* Now that you have updated your configuration to point to the appropriate SFMC resources, push your changes to your web server.
* Remember to edit your App Center instance to include the "Endpoint URL," if you did not do that earlier.

#### Testing our activity loads in the Marketing Cloud
1. Log into the [Marketing Cloud](https://mc.exacttarget.com/cloud)

2. Navigate to Journey Builder and either start a new interaction or open an existing one.

3. You should see the custom activity "Desk.com Create Case" in the left pane under "CUSTOM"

#### Creating our Custom Interaction
1. Drag the "Desk.com Create Case" activity from the list onto the Interaction Canvas at Minute 0.
	* First change the duration of the Canvas to 'minutes'.

2. Hover and click the "Configure" button

3. The custom activity dialog should appear (this is loading from your app)

4. Select a priority other than the default.

5. Click Next.

6. Review your changes and click Done.

7. The Activity is configured.
* If you hover again and click the edit icon, you should see the activities 'payload' in the Console tab of Developer Tools.  The payload should include the 'priority' change you just made.

8. Add the "Update Case" activity to minute 1 of the interaction, then Configure, and Done. 

9. Under the interaction name, set the interaction to "Multiple Entries" so your contact can go through it multiple times.

10. Save and activate your interaction.

#### Testing our Custom Interaction

This is how the trigger is fired from a REST client like Postman:

<pre>
POST https://www.exacttargetapis.com/interaction-experimental/v1/events
Authorization: Bearer &lt;token&gt;
Content-Type: application/json

JSON Payload:
{
"ContactKey":"name@email.com",
"EventDefinitionKey":"&lt;trigger key&gt;",
"Data": {
  	"EmailAddress":"name@email.com",
    "DE_Fieldname":&lt;trigger value&gt;
    }
}
</pre>

* "DE_Fieldname":&lt;trigger value&gt;  The data trigger you specify for your interaction will contain a fieldname and value which causes your trigger to resolve to "true" and kick off the interaction.
* For new contacts, make sure you also pass in First and Last name in "Data" (and those fields exist in your DE).

* Make sure the email you use for ContactKey is in your All Subscribers list, or your Contact Model/DE link is set to "Use as root".
* ContactKey and EmailAddress should be equal.
* The &lt;trigger key&gt; can be obtained by inspecting Network traffic when you click on Admin/Triggers in JB, or by using the API (https://jbinteractions.exacttargetapps.com/rest/beta/interactionstudio/eventdefinition/?$skip=0&$top=50&availablefilter=1)  
	* It is the eventDefinitionKey which will look like "CONTACT-EVENT-&lt;guid&gt;"
	* Choose the &lt;trigger key&gt; associated with your interaction.

 

After a minute or two, navigate to Admin / Contacts in Journey Builder.  You should see some statuses for your interaction.  If your desk.com case is not created within a few minutes, check to see if an error was thrown:
* Find out what really happened to your interaction after firing its trigger.
	* Network tab, clear all data.
	* Open Admin / Contacts
	* Click on the route: interaction/v1/interactions/traceevents/search
	* NetworkTab/Response tab: a more detailed error is probably in there telling you why it failed.
	
	



## Licensing
 Please see the "LICENSE" file in the root of this repository for information related to licensing of this repository.
