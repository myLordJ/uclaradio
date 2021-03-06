# UCLA Radio
[![dependencies Status](https://david-dm.org/uclaradio/uclaradio/status.svg)](https://david-dm.org/uclaradio/uclaradio) [![devDependencies Status](https://david-dm.org/uclaradio/uclaradio/dev-status.svg)](https://david-dm.org/uclaradio/uclaradio?type=dev)
[![Build Status](https://travis-ci.org/uclaradio/uclaradio.svg?branch=master)](https://travis-ci.org/uclaradio/uclaradio)

All of the code that powers [uclaradio.com](https://uclaradio.com).

UCLA Radio is a Javascript application, powered by [Node.js](https://nodejs.org/en/) and utilizing the [Express.js](http://expressjs.com) framework. We use [MongoDB](https://www.mongodb.com) for our database and [React](https://facebook.github.io/react/) on the front-end.

In addition to the visible site, we also have a [RESTful API](https://github.com/uclaradio/uclaradio/wiki/The-API), which powers an internal panel for managers and DJs as well as our [iOS](https://github.com/uclaradio/uclaradio-iOS) and [Android](https://github.com/uclaradio/uclaradio-Android) apps.

UCLA Radio is a completely student-run organization offering cultural content created by 100+ DJs. [Let us know](mailto:radio.web@media.ucla.edu) if you have any suggestions! All of the software here is written by students.

## Getting Started

### Running

#### Development
- Ensure you have Mongo and Node installed.
  - For macOS: If you have [homebrew](http://brew.sh/) installed, you can just run [`setup.sh`](https://github.com/uclaradio/uclaradio/blob/master/setup.sh) to set up node and MongoDB automatically!
- In the project root directory, run `npm install` to install dependencies (may need sudo)
- Run `npm run dev` to start the server for development
- Point your browser to [`http://localhost:3000`](http://localhost:3000) :heart_eyes:

#### Production
- Make sure all packages are installed with `npm install`
- Run `node bin/www prod` to start the server for production (will require HTTPS and listen on port 80)


### Getting Started

#### Directories

##### [`./routes`](/routes)
Handles all routing logic, or logic that deals with URI endpoints and HTTP request methods (GET, POST, etc.). (e.g. what happens when you load [`uclaradio.com/shows`](https://uclaradio.com/shows).)

##### [`./database`](/database)
Contains all data models and functions we use in the routes to do things like create a new show.

##### [`./public`](/public)
Everything we have public on the site. For your images, JavaScript, CSS, HTML and what have you.

##### [`./views`](/views)
Jade templates. Right now many front-end pages are in Jade, hopefully we will redesign them in Javascript soon.

##### [`./react`](/react)
React front-end pages. Reusable components like UI elements are in `/react/components`.

#### Files

[`app.js`](/app.js): The main server!

[`defaultPasswords.json`](/defaultPasswords.json): Where the passwords go. These are different on the production server.

[`Gruntfile.js`](/Gruntfile.js): Our [grunt](https://gruntjs.com) file. It automatically compiles all of our `.jsx` and `.scss` files. Just run `grunt watch`!

[`setup.sh`](/setup.sh): The setup script for macOS.

### React

React files must be compiled to actual javascript before a browser can use them, because they do things like this:
```javascript
var djs = {'Toad', 'Squirrel', 'Camel'};
return <p>UCLA Radio is a student-run organization with {djs.length} student DJs. </p>;
```

Do so with Grunt, which automates Webpack:
* install grunt-client with npm: `npm install -g grunt-cli`
* run `grunt` to compile .jsx files in `./react` and put minified versions in `./public/build`
  * run `grunt watch` to automatically recompile whenever you hit save! (Note: this is done automatically for you when you run `npm run dev`!
* add `.../build/[x].min.js` as a script in your HTML files

#### React + API

We prefer using a front-end web app and an API over static templates, because apps can be interactive. Our internal staff panel / content management system works this way:

```javascript
/***** User Home Page *****/

// Front-end: provide HTML file to logged in users, redirect everyone else
// uclaradio.com/panel/home -> HTML
router.get('/home', function(req, res) {
  if (req.session.user == null) {
    // not logged in, redirect to log in page
    res.redirect('/panel');
  } else {
    var path = require('path');
    res.sendFile(path.resolve('public/panel/panel.html'));
  }
});

// API: Return current logged-in user's shows as a JSON file which can be parsed by React, or 400 error
// uclaradio.com/panel/api/shows -> JSON
router.get('/api/shows', function(req, res) {
  if (req.session.user == null) {
    res.status(400).send();
  } else {
    var user = req.session.user;
    shows.getShowsForUser(user.username, function(err, userShows) {
      if (userShows) {
        res.json({'shows': userShows});
      } else {
        res.status(400).send();
      }
    });
  }
});
```

### Requirements for new code

As a student-run organization, UCLA Radio is especially liable to technical debt. We have some goals for cleaning up our codebase in the future, but most importantly new code should:
* Have new front-end pages in **React**. We prefer using a front-end framework with an API to complicated templates.
* Delete files that are not used anymore. It's okay, get rid of clutter.
* Follow an organized structure. Put things in the right directories.

We accept changes from both radio web members and outside contributors. Please note our [contributing guidelines](https://github.com/uclaradio/uclaradio/wiki/Contributing-Guidelines). Want to join radio? We [accept applications](http://apply.uclastudentmedia.com/applications/ucla-radio/web-staff/) every quarter.


### License

All of the code here is released under the [MIT License](/LICENSE.md), which basically means you can do anything you want with the code here as long as you attribute us and don't hold us liable for anything. Make something cool with our code? [Let us know](mailto:radio.web@media.ucla.edu), we'd love to hear what you made!
