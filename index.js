var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var request = require('request');
var moment = require('moment');
var parsePodcast = require('node-podcast-parser');
var parseOpml = require('node-opml-parser');

var OPML = "./tests/podcasts_opml.xml";
var fileContent = fs.readFileSync(path.join(OPML)).toString();

// moment().format();
var stats = {};

function sort(days) {

  // return _.findKey(days, {'value': _.max(_.map(days, "value"))});

  return _.reverse(_.sortBy(days, function(o) { return o.value; }))
}

function percentages(data) {

  return _data;
}

function parse(name, data) {
  // stats[name] = {};

  var stat = {};

  for (var i = data.episodes.length - 1; i >= 0; i--) {
    var episode = data.episodes[i];

    var date = moment(episode.published);
    var year = date.format('Y');
    var day = date.format('dddd');

    if (!stat[year]) {
      stat[year] = {};
    }

    if (!stat[year][day]) {
      stat[year][day] = {
        'day': day,
        'value': 1
      };
    } else {
      stat[year][day].value += 1;
    }
  }

  // console.log();

  // console.log(stat);

  var years = _.keys(stat).sort();
  for (var i = 0; i < years.length; i++) {
    var year = years[i];
    console.log('===>', year, ':', _.slice(sort(stat[year]), 0, 2)  );
  }

  // console.log('===>', year, ':', mostCommon(stat['2011']));



  // stats[name] = stat;

}

parseOpml(fileContent, (err, podcasts) => {
  if (err) {
    console.error(err);
    return;
  }

  // items is a flat array of all items in opml

  // console.log(items);
  for (var i = podcasts.length - 1; i >= 0; i--) {
    var podcast = podcasts[i];

    (function(podcast){
      request(podcast.feedUrl.toLowerCase(), (err, res, data) => {
        console.log(podcast.title);
        if (err) {
          console.error('Network error', err);
          return;
        }

        parsePodcast(data, (err, data) => {
          if (err) {
            console.error(err);
            return;
          }

          // data looks like the format above
          // console.log(data);
          parse(podcast.title, data);
        });
      });
    })(podcast);
  }


});
