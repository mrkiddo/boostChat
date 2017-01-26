/**
 * Created by luojiawei on 16/10/8.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    name: String,
    salt: String,
    password: String,
    email: String
}));