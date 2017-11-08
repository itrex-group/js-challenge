
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    routes = require('./routes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);

app.listen(4000);