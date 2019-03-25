var mongojs = require('mongojs');
var pass = require('./mdp');
var JDR = mongojs(pass.db);

var db = {JDR};

module.exports = db;