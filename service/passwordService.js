/**
 * Created by luojiawei on 16/10/11.
 */
var crypto = require('crypto');
var config = require('../config/config');

var generateSalt = function (length) {
    var salt = crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
    return salt;
};

var sha512 = function (password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('hex');
};

var saltHashPassword = function (password) {
    var salt = generateSalt(config.saltLength);
    var hashPassword = sha512(password, salt);
    return {
        salt: salt,
        hashPassword: hashPassword
    };
};

var hashPassword = function (password, salt) {
    return sha512(password, salt);
};

module.exports = {
    hash: saltHashPassword,
    test: hashPassword
};