var express = require('express'),
app = express(),
port = process.env.PORT || 3001,
//ModelTransaction = require('./models/transaction'), //created model loading here
bodyParser = require('body-parser');
var cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var routes = require('./routes/app'); //importing route
routes(app); //register the route
app.listen(port);


console.log('todo list RESTful API server started on: ' + port);