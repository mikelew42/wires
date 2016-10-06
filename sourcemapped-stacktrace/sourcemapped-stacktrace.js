/*
 * sourcemapped-stacktrace.js
 * created by James Salter <iteration@gmail.com> (2014)
 *
 * https://github.com/novocaine/sourcemapped-stacktrace
 *
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var source_map_consumer = require("source-map/lib/source-map-consumer");
/*global define */

// note we only include source-map-consumer, not the whole source-map library,
// which includes gear for generating source maps that we don't need

/**
 * Re-map entries in a stacktrace using sourcemaps if available.
 *
 * @param {Array} stack - Array of strings from the browser's stack
 *                        representation. Currently only Chrome
 *                        format is supported.
 * @param {function} done - Callback invoked with the transformed stacktrace
 *                          (an Array of Strings) passed as the first
 *                          argument
 */
var _mapForUri = {};
var _smc = {};
var mapStackTrace = function(stack, done) {
  var lines;
  var rows = {};
  var fields;
  var uri;
  var expected_fields;
  var regex;
  var skip_lines;

  var fetcher = new Fetcher(function() {
    var result = processSourceMaps(lines, rows, _mapForUri);
    done(result);
  });

  if (isChrome()) {
    regex = /^ +at.+\((.*):([0-9]+):([0-9]+)/;
    expected_fields = 4;
    // (skip first line containing exception message)
    skip_lines = 1;
  } else if (isFirefox()) {
    regex = /@(.*):([0-9]+):([0-9]+)/;
    expected_fields = 4;
    skip_lines = 0;
  } else {
    throw new Error("unknown browser :(");
  }

  lines = stack.split("\n").slice(skip_lines);

  for (var i=0; i < lines.length; i++) {
    fields = lines[i].match(regex);
    if (fields && fields.length === expected_fields) {
      rows[i] = fields;
      uri = fields[1];
      if (!uri.match(/<anonymous>/)) {
        fetcher.fetchScript(uri);
      }
    }
  }

  fetcher.done(_mapForUri);
};

var isChrome = function() {
  return navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
};

var isFirefox = function() {
  return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
};
var Fetcher = function(done) {
  this.sem = 0;
  this.done = done;
};

Fetcher.prototype.fetchScript = function(uri) {
  if (!(uri in _mapForUri)) {
    this.sem++;
    _mapForUri[uri] = null;
  } else {
    return;
  }

  var xhr = createXMLHTTPObject();
  // var that = this;
  // xhr.onreadystatechange = function(e) {
  //   that.onScriptLoad.call(that, e, uri);
  // };
  xhr.open("GET", uri, false);
  // console.log('sending request for ', uri);
  xhr.send();


  // console.log('xhr.status', xhr.status);
  if(xhr.status === 200){
    this.onScriptLoad({ target: xhr }, uri);
  }
};

var absUrlRegex = new RegExp('^(?:[a-z]+:)?//', 'i');

Fetcher.prototype.onScriptLoad = function(e, uri) {
  if (e.target.readyState !== 4) {
    return;
  }

  if (e.target.status === 200 ||
    (uri.slice(0, 7) === "file://" && e.target.status === 0))
  {
    // find .map in file.
    //
    // attempt to find it at the very end of the file, but tolerate trailing
    // whitespace inserted by some packers.
    var match = e.target.responseText.match("//# [s]ourceMappingURL=(.*)[\\s]*$", "m");
    if (match && match.length === 2) {
      // get the map
      var mapUri = match[1];

      var embeddedSourceMap = mapUri.match("data:application/json;charset=utf-8;base64,(.*)");

      if (embeddedSourceMap && embeddedSourceMap[1]) {
        _mapForUri[uri] = atob(embeddedSourceMap[1]);
        return;
      } else {
        console.warn("no embeddedSourceMap");
        return;
        if (!absUrlRegex.test(mapUri)) {
          // relative url; according to sourcemaps spec is 'source origin'
          var origin;
          var lastSlash = uri.lastIndexOf('/');
          if (lastSlash !== -1) {
            origin = uri.slice(0, lastSlash + 1);
            mapUri = origin + mapUri;
            // note if lastSlash === -1, actual script uri has no slash
            // somehow, so no way to use it as a prefix... we give up and try
            // as absolute
          }
        }

        var xhrMap = createXMLHTTPObject();
        var that = this;
        xhrMap.onreadystatechange = function() {
          if (xhrMap.readyState === 4) {
            that.sem--;
            if (xhrMap.status === 200 ||
              (mapUri.slice(0, 7) === "file://" && xhrMap.status === 0)) {
              that.mapForUri[uri] = xhrMap.responseText;
            }
            if (that.sem === 0) {
              that.done(that.mapForUri);
            }
          }
        };

        xhrMap.open("GET", mapUri, true);
        xhrMap.send();
      }
    } else {
      // no map
      this.sem--;
    }
  } else {
    // HTTP error fetching uri of the script
    this.sem--;
  }

  if (this.sem === 0) {
    this.done(this.mapForUri);
  }
};

var processSourceMaps = function(lines, rows, mapForUri) {
  var result = [];
  var map;
  var row;
  var smc;
  var _file, _line, _column, _name;
  for (var i=0; i < lines.length; i++) {
    smc = undefined;
    row = rows[i];
    if (row) {
      var uri = row[1];
      var line = parseInt(row[2], 10);
      var column = parseInt(row[3], 10);

      if (_smc[uri]){
        smc = _smc[uri];
      } else {
        map = mapForUri[uri];
        if (map){
          smc = _smc[uri] = new source_map_consumer.SourceMapConsumer(map);
        }
      }

      if (smc){
        var origPos = smc.originalPositionFor({
          line: line,
          column: column
        });
        _file = origPos.source;
        _line = origPos.line;
        _column = origPos.column;
        _name = origPos.name || origName(lines[i]);
      } else {
        _file = uri;
        _line = line;
        _column = column;
        _name = origName(lines[i]);
      }


      var fOP = formatOriginalPosition(_file, _line, _column, _name);
      result.push(fOP);

    } else {
      // we weren't able to parse the row, push back what we were given
      result.push(lines[i]);
    }
  }

  return result;
};

function origName(origLine) {
  var match = String(origLine).match(isChrome() ?
    / +at +([^ ]*).*/ :
    /([^@]*)@.*/);
  return match && match[1];
}

var formatOriginalPosition = function(source, line, column, name) {
  // mimic chrome's format
  return "    at " + (name ? name : "(unknown)") +
    " (" + source + ":" + line + ":" + column + ")";
};

// xmlhttprequest boilerplate
var XMLHttpFactories = [
function () {return new XMLHttpRequest();},
function () {return new ActiveXObject("Msxml2.XMLHTTP");},
function () {return new ActiveXObject("Msxml3.XMLHTTP");},
function () {return new ActiveXObject("Microsoft.XMLHTTP");}
];

function createXMLHTTPObject() {
    var xmlhttp = false;
    for (var i=0;i<XMLHttpFactories.length;i++) {
        try {
            xmlhttp = XMLHttpFactories[i]();
        }
        catch (e) {
            continue;
        }
        break;
    }
    return xmlhttp;
}

exports.mapStackTrace = mapStackTrace;