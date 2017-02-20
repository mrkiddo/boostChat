/**
 * Created by mrkiddo on 2017/2/18.
 */
var jwt = require('jsonwebtoken');
var userService = require('../service/userService');

module.exports = function (req, res, next) {
    var whiteList = ['/users/create', '/users/authenticate', '/users/verifytoken'];
    var whiteListFlag = false;
    var requestUrl = req.originalUrl;
    for(var i = 0; i < whiteList.length; i++) {
        if(whiteList[i] == requestUrl) {
            whiteListFlag = true;
        }
    }
    if(whiteListFlag) {
        next();
    }
    else {
        var token = req.headers['x-access-token'];
        jwt.verify(token, req.app.get('secret'), function (err, decoded) {
            if(err) {
                res.status(403).send({
                    success: false,
                    message: 'Fail to authenticate user identity.'
                });
            }
            else {
                var userInfo = decoded._doc;
                userService.findUserExist(userInfo.email, userInfo.password)
                    .then(function (user) {
                        if (!user) {
                            res.status(403).send({
                                success: false,
                                message: 'Fail to authenticate user identity.'
                            });
                        }
                        res.locals.userName = userInfo.email;
                        res.locals.userId = userInfo._id;
                        next();
                    });
            }
        });
    }
};