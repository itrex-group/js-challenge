const express = require('express'),
    route = express.Router(),
    MainCtrl = require('./MainController.js');

route.get('/', MainCtrl.main);
route.get('/asyncVersion', MainCtrl.asyncVersion);
route.get('/nativePromiseVersion', MainCtrl.nativePromiseVersion);
route.get('/asyncAwaitVersion', MainCtrl.asyncAwaitVersion);
route.get('/rxJSVersion', MainCtrl.rxJSVersion);

module.exports = route;