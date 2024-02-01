var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();    

const MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb+srv://workoutbase:kattenbus@cluster0.5gae8.mongodb.net/workoutbase?retryWrites=true&w=majority", { 
    useUnifiedTopology: true
})
.then(client => {
    console.log("Vi är uppkopplade mot databasen!");
    const db = client.db("workoutbase"); 

    app.locals.db = db;
})
.catch((error) => console.log(error));



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'public'), {index:false}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
