var app = require('./app');
var port = process.env.PORT || 3300;
var express = require('express');

var server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});