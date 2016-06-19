var accounts = require('../db.js'); // included to connect to database
var accounts = require('../dbAccounts.js');
var passwords = require('../../passwords.json');

console.log("Setting up Secret DJ Panel...");

var callback = function(err, privilegeSaved) { if (err) { console.log("error occurred saving privilege");}};

// links to make available to managers
var links = [];
var managerPanel = {title: "Manage Panel", link: "/panel/manager"};
links.push(managerPanel);

var changeLog = {title: "Change Log", link: "/panel/manager"};
links.push(changeLog);

// addPrivilege = function(privilege, links, callback)
accounts.addPrivilege(accounts.managerPrivilegeName, links, callback);

/***** Create General Manager Account *****/

 // requestNewAccount = function(username, pass, email, fullName, callback)
accounts.requestNewAccount("gm", passwords.gmpass, "chrislaganiere@gmail.com", "General Manager", function(err, saved) {
  if (err) { console.log("error creating gm account:", err); }
  else if (saved) {
    accounts.verifyAccount("gm", function(err, o) {
      if (err) { console.log("error validating gm user", err); }
    });
  }
});

// db.verifyAccount = function(username, callback)


// updatePrivilege = function(username, privilege, shouldHave, callback)
accounts.updatePrivilege("gm", accounts.managerPrivilegeName, true, callback);

console.log("Finished setting up Secret DJ Panel");