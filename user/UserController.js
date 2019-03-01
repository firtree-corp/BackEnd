var express = require('express');
var router = express.Router();
var sha256 = require('sha256');
var bodyParser = require('body-parser');
var tools = require('../tools/tokenValid');
var mail = require('../mail');

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  router.use(bodyParser.urlencoded({ extended: true }));

var db = require('../db');
var User = db.JDR.collection('users');
var Token = db.JDR.collection('tokens');


router.post('/users/new/', function (req, res) {
    if (!req.body.login || !req.body.password || !req.body.email)
        return res.status(400).send("Need a login, a password and an email.")
    if (req.body.login.indexOf("@") === -1) {
        return res.status(400).send("Invalid login")
    }
    User.find({"login":req.body.login}, function (err, users) {
        if (users[0] !== undefined)
            return res.status(403).send("Login already used.");
        User.find({"email":req.body.email}, function (err, userst) {
            var i = 0;
            if (userst[0] !== undefined)
                return res.status(403).send("Email already used.");
            var newToken = Math.floor(Math.random() * Math.floor(999999999999999)).toString();
            User.insert({
                login : req.body.login,
                email : req.body.email,
                password: sha256(sha256(req.body.password)),
                mailToken : newToken,
                creationDate : new Date(),
                verifiedAccount : false
            },
            function (err, user) {
                if (err) return res.status(500).send("There was a problem adding the information to the database.");
                res.status(200).send(user);
                mail.sendMail("Create_User", req.body.email, newToken);
            });
        });
    });
});

router.get('/confirme', function (req, res) {
    if (!req.query.token)
        return res.status(400).send("Cant confirme the account")
    User.find({"mailToken": req.query.token}, function (err, users) {
        if (users[0] === undefined)
            return res.status(404).send("Cant confirme the account");
        if (err) return res.status(500).send("There was a problem finding the users.");

        User.update({"mailToken": req.query.token}, { $set: {"mailToken": null,"verifiedAccount" : true}},function(err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send("Email has been validated.");
        });
    });
});

function createNewToken(userId) {
    var newToken = Math.floor(Math.random() * Math.floor(999999999999999)).toString();
    Token.insert({
        token : newToken,
        userId : userId,
        createDate : new Date(),
        tokenExpiration : -1
    })
    return newToken;
}

router.get('/users/login', function (req, res) {
    if (!req.query.login || !req.query.password)
        return res.status(400).send("Need a login and a password")
    User.find({"login": req.query.login, "password": req.query.password}, function (err, users) {
        if (users[0] === undefined)
            return res.status(404).send("Invalid login or password");
        if (err) return res.status(500).send("There was a problem finding the users.");
        if (users[0].verifiedAccount == false)
            return res.status(401).send("Email has not been confirmed");

        Token.find({"userId":users[0]._id}, function(err, tokens) {
            var newToken = {
                token : ""
            };
            if (tokens[0] === undefined) {
                newToken.token = createNewToken(users[0]._id);
                res.status(200).send(newToken);
            } else {
                Token.remove({"userId":users[0]._id}, function (err, token) {
                    if (err) return res.status(500).send("There was a problem deleting the token.");
                    newToken.token = createNewToken(users[0]._id);
                res.status(200).send(newToken);
                })
            }
        })
    });
});

router.get('/users/token/valid', function (req, res) {
    tools.tokenIsValid(req.query.token, res, function(token) {
        if (token !== -1)
            res.status(200).send(token);
    });

});

module.exports = router;