// shows.js
// Data model for radio shows

// connect to database
require('./db');

// user accounts
var accounts = require('./accounts');

var mongoose = require('mongoose');
var fs = require('fs');

var shows = {};

// Radio shows to show on the site
var ShowSchema = new mongoose.Schema({
  title: String,
  id: Number, // unique identifier
  day: String, // Mon / Tue / Wed / Thu / Fri / Sat / Sun
  time: String,
  djs: [String], // collection of username strings
  genre: String,
  blurb: String, // show description
  picture: String, // relative url to image file
  thumbnail: String,
  public: Boolean,
  // collection of page links (social media)
  pages: [{
    title: String,
    link: String
  }],
  // collection of specific episodes (probably many)
  episodes: [{
    date: Date,
    title: String,
    picture: String,
    link: String,
    description: String
  }]
});
ShowSchema.index({ id: 1});
var ShowModel = mongoose.model('shows', ShowSchema);

shows.webSafeShow = function(show) {
  return {title: show.title,
             id: show.id,
            day: show.day,
           time: show.time,
            djs: show.djs,
          genre: show.genre,
          blurb: show.blurb,
        picture: show.picture,
      thumbnail: show.thumbnail,
         public: show.public,
          pages: show.pages,
       episodes: show.episodes};
}


/***** Shows *****/

// create a new show with the given data
shows.addNewShow = function(title, day, time, djs, callback) {
  accounts.getNextAvailableId(accounts.showIdKey, function(nextId) {
    console.log("nextId: ", nextId);
    newData = {
      "title": title,
      "id": nextId,
      "day": day,
      "time": time,
      "djs": djs
    };

    //Searches for a show with the same title.
    ShowModel.findOne({title: newData.title}, function(err, o) {
      if (o) {
        callback('title-taken');
      }
      else {
        ShowModel.findOne({day: newData.day, time: newData.time}, function(err, o) {
          if (o) {
            callback('time-taken');
          }
          else {
            var newShow = new ShowModel(newData);
            newShow.save(function(err, saved) {
              callback(err, saved);
              if (saved) {
                accounts.setLastTakenId(accounts.showIdKey, nextId, function(err) {
                  if (err) { console.log("error setting next id for shows: ", err); }
                });
              }
            });
          }
        });
      }
    });
  });
};

shows.updateShow = function(id, newData, callback) {
  var update = function() {
    ShowModel.findOneAndUpdate({'id': id}, newData, {upsert:false, new:true}, function(err, o) {
          if (err) { callback(err); }
          else { callback(null, shows.webSafeShow(o)); }
      });
  }
  ShowModel.findOne({id: id}, function(err, o) {
    if (o) {
      if (o.picture !== newData.picture) {
        var path = require('path');
        fs.unlink(path.resolve('public'+o.picture), function() {
          update();
        });
      }
      else {
        update();
      }
    }
    else { callback(err); }
  });
};

shows.getShowsForUser = function(djUsername, callback) {
  ShowModel.find({djs: djUsername}, function(err, res) {
    if (err) {
      callback(err);
    }
    else {
      callback(null, res);
    }
  });
};

shows.userHasAccessToShow = function(username, id, callback) {
  ShowModel.findOne({id: id, djs: username}, function(err, o) {
    if (o) { callback(true); }
    else { callback(false); }
  });
};

// shows.getShow = function(id, callback) {
//   ShowModel.findOne({id: id}, function(err, o) {
//     callback(err, o);
//   });
// };

shows.getShowByTitle = function(title, callback) {
  ShowModel.findOne({title: title}, function(err, o) {
    if (o) {
      o._id = null;
      callback(err, shows.webSafeShow(o));
    }
    else {
      callback(err);
    }
  });
};

shows.getShowById = function(id, callback) {
  ShowModel.findOne({id: id}, function(err, o) {
    callback(err, shows.webSafeShow(o));
  });
};

// get all shows with user data too (name, picture, djs)
shows.getAllShows = function(callback) {
  ShowModel.find({}, function(err, shows) {
    if (err) { callback(err); }
    else {
      var usernames = [];
      shows.map(function(show) {
        show.djs.map(function(dj) {
          usernames.push(dj);
        })
      });
      UserModel.find({username: {$in: usernames}}, function(err, users) {
        if (err) { callback(err, null); }
        else {
          // create a dictionary of all users username->djName
          var nameMap = {};
          users.map(function(u) {
            nameMap[u.username] = u.djName;
          });

          for (var s = 0; s < shows.length; s++) {
            var show = shows.webSafeShow(shows[s]);
            var djList = {};
            show.djs.map(function(dj) {
              djList[dj] = nameMap[dj];
            });
            show["djs"] = djList;
            shows[s] = show;
          }
          callback(null, shows);
        }
      });
    }
  });
}

shows.removeShow = function(id, callback) {
  ShowModel.remove({id: id}, function (e) {
    callback(e);
  });
};

// show for timeslot: used for currently playing show
shows.getShowByTimeslotAndDay = function(time, day, callback) {
  ShowModel.findOne({time: time, day: day}, function(err, show) {
    if (err || show == null) {
      callback(err);
    }
    else {
      UserModel.find({username: {$in: show.djs}}, function(err, users) {
        if (err) {
          console.log(err);
          callback(err);
        }
        else {
          // create a dictionary of all users username->djName
          var nameMap = {};
          users.map(function(u) {
            nameMap[u.username] = u.djName;
          });

          var safeShow = shows.webSafeShow(show);
          var djList = {};
          show.djs.map(function(dj) {
            djList[dj] = nameMap[dj];
          });
          safeShow["djs"] = djList;
          callback(null, safeShow);
        }
      })
    }
  });
};

module.exports = shows;
