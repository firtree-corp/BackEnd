var express = require('express');
var app = express();
var db = require('./db');

var UserController = require('./user/UserController');
var TemplateController = require('./Template/TemplateController');
app.use(UserController, TemplateController);

module.exports = app;