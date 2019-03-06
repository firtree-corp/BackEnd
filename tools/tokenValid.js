var db = require('../db');
var Token = db.JDR.collection('tokens');

function tokenIsValid(token, res, callback) {
    if (!token) {
        res.status(400).send("Need a token");
        callback(-1, null);
        return;
    }
    Token.find({"token":token}, function(err, tokens) {
        if (tokens[0] === undefined) {
            callback(false, tokens[0]);
        } else {
            callback(true, tokens[0]);
        }
    })
}

var tokenValid = {tokenIsValid};
module.exports = tokenValid;