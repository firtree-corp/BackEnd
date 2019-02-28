var express = require('express');
var router = express.Router();
var sha256 = require('sha256');
var bodyParser = require('body-parser');
var tools = require('../tools/tokenValid');

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.use(bodyParser.urlencoded({ extended: true }));

var db = require('../db');
// var User = db.JDR.collection('users');
// var Token = db.JDR.collection('tokens');
var Template = db.JDR.collection('templates');

router.get('/template/public', function (req, res) {
    tools.tokenIsValid(req.query.token, res, function(token) {
        if (token === -1)
            return;
        if (token === false)
            return res.status(401).send("Need to be log for acess to this ressource");
        Template.find({"public":true}, function(err, templates) {
            if (templates[0] === undefined)
                return res.status(404).send("No template in database");
            else
                return res.status(200).send(templates);
        })
    });
});



module.exports = router;