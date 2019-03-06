var express = require('express');
var router = express.Router();
var sha256 = require('sha256');
var bodyParser = require('body-parser');
var tools = require('../tools/tokenValid');
const isHex = require('is-hex');
var ObjectID = require('mongodb').ObjectID;

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.use(bodyParser.urlencoded({ extended: true }));

var db = require('../db');
var Template = db.JDR.collection('templates');

router.get('/template/public', function (req, res) {
    tools.tokenIsValid(req.query.token, res, function(isvalid, token) {
        if (isvalid === -1) return;
        if (isvalid === false) return res.status(401).send({msg: "Need to be log for acess to this ressource"});
        Template.find({"public":true}, function(err, templates) {
            if (templates[0] === undefined)
                return res.status(404).send({msg: "No template in database"});
            else
                return res.status(200).send(templates);
        })
    });
});

router.get('/template/my', function (req, res) {
    tools.tokenIsValid(req.query.token, res, function(isvalid, token) {
        if (isvalid === -1) return;
        if (isvalid === false) return res.status(401).send({msg: "Need to be log for acess to this ressource"});
        Template.find({"ownerId":token.userId}, function(err, templates) {
            if (templates[0] === undefined)
                return res.status(404).send({msg: "No template in database"});
            else
                return res.status(200).send(templates);
        })
    });
});

router.post('/template/my', function (req, res) {
    if (!req.body.public || !req.body.name || !req.body.types || !req.body.items)
        return res.status(400).send({msg: "Need a valid template."})
    tools.tokenIsValid(req.query.token, res, function(isvalid, token) {
        if (isvalid === -1) return;
        if (isvalid === false) return res.status(401).send({msg: "Need to be log for acess to this ressource"});
        Template.insert({
            "nbUse": 0,
            "nbLike": 0,
            "public": req.body.public,
            "ownerId": token.userId,
            "name": req.body.name,
            "types": req.body.types,
            "items": req.body.items
        }
        ,function(err, templates) {
            if (err) return res.status(500).send({msg: "There was a problem adding the information to the database.", value : 4});
            res.status(200).send("add in db");
        })
    });
});

router.put('/template/my', function (req, res) {
    if (!req.body.public || !req.body.name || !req.body.types || !req.body.items || !req.body._id)
        return res.status(400).send({msg: "Need a valid template."})
    tools.tokenIsValid(req.query.token, res, function(isvalid, token) {
        if (isvalid === -1) return;
        if (isvalid === false) return res.status(401).send({msg: "Need to be log for acess to this ressource"});
        if (!isHex(req.body._id)) return res.status(400).send({msg: "Invalid Id."})
        var objectId = new ObjectID(req.body._id);
        Template.update({"ownerId":token.userId, "_id": objectId},  { $set: {"public": req.body.public, "name" : req.body.name, "types": req.body.types, "items": req.body.items}}
        ,function(err, templates) {
            if (templates.nModified == 0) return res.status(400).send({msg: "Cant find the ressource to modified in database"});
            if (err) return res.status(500).send({msg: "There was a problem adding the information to the database.", value : 4});
            res.status(200).send("Ressource has been modified");
        })
    });
});

router.delete('/template/my', function (req, res) {
    if (!req.body._id)
        return res.status(400).send({msg: "Need an id."})
    tools.tokenIsValid(req.query.token, res, function(isvalid, token) {
        if (isvalid === -1) return;
        if (isvalid === false) return res.status(401).send({msg: "Need to be log for acess to this ressource"});
        if (!isHex(req.body._id)) return res.status(400).send({msg: "Invalid Id."})
        var objectId = new ObjectID(req.body._id);
        Template.remove({"ownerId":token.userId, "_id": objectId}
        ,function(err, templates) {
            if (templates.n == 0) return res.status(400).send({msg: "Cant find the ressource to modified in database"});
            if (err) return res.status(500).send({msg: "There was a problem adding the information to the database.", value : 4});
            res.status(200).send("Ressource has been deleted");
        })
    });
});


module.exports = router;