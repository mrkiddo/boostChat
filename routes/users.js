var express = require('express');
var router = express.Router();

var passwordService = require('../service/passwordService');
var onlineUserService = require('../service/onlineUserService');

var jwt = require('jsonwebtoken');
var User = require('../models/user');
var Contactlist = require('../models/contactlist');

var debugFlag = true;

router.use(function (req, res, next) {
    var whiteList = ['/users/', '/users/create', '/users/authenticate', '/users/verifytoken'];
    var whiteListFlag = false;
    var requestUrl = req.originalUrl;
    for(var i = 0; i < whiteList.length; i++) {
        if(whiteList[i] == requestUrl) {
            whiteListFlag = true;
        }
    }
    if(whiteListFlag || debugFlag) {
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
            next();
        });
    }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  var query = User.find({});
  query.select("_id, name");
  var queryPromise = query.exec();
  var userListLite = [];
  queryPromise.then(function (users) {
      users.forEach(function (user) {
          var o = {
              id: user.id,
              name: user.name
          };
          if(user) {
              userListLite.push(o);
          }
      });
  }).then(function () {
      res.json({
          success: true,
          message: 'get user list successfully',
          data: userListLite
      });
  });
});

router.post('/create', function (req, res, next) {
    var data = {
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
    };

    User.findOne({
        email: data.email
    }, function (err, user) {
        if(err) {
            throw err;
        }
        if(user) {
            res.json({
                success: false,
                status: 1,
                message: 'Email address has been occupied.'
            });
        }
        else {
            var encodedResult = passwordService.hash(data.password);
            data.password = encodedResult.hashPassword;
            data.salt = encodedResult.salt;
            var newUser = new User(data);
            newUser.save(function (err) {
                if(err) {
                    throw err;
                }
                var token = jwt.sign(newUser, req.app.get('secret'), {
                    expiresIn: 86400000
                });
                res.json({
                    success: true,
                    message: 'User created successfully.',
                    status: 0,
                    data: {
                        userId: newUser['_id'],
                        name: data.name,
                        email: data.email,
                        token: token
                    }
                });
            });
        }
    });

});

router.post('/authenticate', function (req, res, next) {
    var data = {
        email: req.body.email,
        password: req.body.password
    };
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if(err) {
            throw err;
        }
        if(!user) {
            res.json({
                success: false,
                status: 1,
                message: 'Authentication failed. E-mail not found.'
            });
        }
        else {
            var passwordHash = passwordService.test(data.password, user.salt);
            if(user.password != passwordHash) {
                res.json({
                    success: false,
                    status: 2,
                    message: 'Authentication failed. Password not match.'
                });
            }
            else {
                var token = jwt.sign(user, req.app.get('secret'), {
                    expiresIn: 86400000
                });
                res.json({
                    success: true,
                    status: 0,
                    message: 'Authentication success.',
                    data: {
                        email: user.email,
                        name: user.name,
                        id: user['_id'],
                        token: token
                    }
                });
            }
        }
    });
});

router.post('/verifytoken', function (req, res, next) {
    var token = req.headers['x-access-token'];
    jwt.verify(token, req.app.get('secret'), function (err, decoded) {
        if(err) {
            res.status(403).send({
                success: false,
                message: 'Fail to authenticate token.'
            });
        }
        res.json({
            success: true,
            message: 'Verify token successfully.'
        });
    });
});

router.get('/contactlist/:userid', function (req, res, next) {
    var userId = req.params.userid;
    var query = Contactlist.findOne({userid: userId});
    var queryPromise = query.exec();
    queryPromise.then(function (data) {
        var contactList = data.list;
        contactList = contactList.map(function (currentValue) {
            currentValue.isOnline = onlineUserService.userList.getByUserId(currentValue.id);
        });
        res.json({
            success: true,
            message: 'get contact list successfully',
            data: data
        });
    });
});

router.post('/contactlist/update', function (req, res, next) {
    var userid = req.body.userid,
        contactUserid = req.body.contactUserid,
        stickyStatus = req.body.sticky;
    var contactsQuery = Contactlist.findOneAndUpdate({
        "userid": userid,
        "list.id": contactUserid
    }, {
        "$set": {
            "list.$.isSticky": stickyStatus,
            "list.$.lastModifiedDate": new Date().getTime()
        }
    }, {
        new: true
    });
    var contactsPromise = contactsQuery.exec();
    contactsPromise.then(function (data) {
        res.json({
            success: true,
            message: 'contact item successfully updated',
            data: data
        });
    });
});

router.get('/contactlist/reset/:userid', function (req, res, next) {
    // TODO: as it's a reset method, should delete the record first and then add new one
    var userId = req.params.userid;
    var query = User.find({});
    query.select("_id, name");
    var queryPromise = query.exec();
    var userListLite = [];
    queryPromise.then(function (users) {
        users.forEach(function (user) {
            var o = {
                id: user.id,
                name: user.name,
                lastModifiedDate: new Date().getTime(),
                isSticky: false,
                isOnline: false
            };
            if(user.id != userId) {
                userListLite.push(o);
            }
        });
    }).then(function () {
        var newContactlist = new Contactlist({
            userid: userId,
            list: userListLite
        });
        var contactlistPromise = newContactlist.save();
        contactlistPromise.then(function (doc) {
            res.json({
                success: true,
                message: "create contact list successfully",
                data: {
                    userid: doc.userid,
                    list: doc.list
                }
            });
        }, function (err) {
            res.json({
                success: false,
                message: "database error",
                data: {}
            });
        });
    });
});

module.exports = router;
