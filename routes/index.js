var express = require('express');
var router = express.Router();
let CryptoJS = require("crypto-js");

const cors = require('cors');

router.use(cors());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//Checks if the login details is corrct, if so logins oterwise send back error
router.post('/login', function(req, res, next) {  

  let userName = req.body.userName;
  let password = req.body.password;

  //Checks against the database
  req.app.locals.db.collection("users").find({"userName": userName}).toArray()
  .then(results => {

    //If the user is not found, sen error-message to frontend
    if(results == "") {
      res.json({"code": "Error"});
    }
    else {
      //If the user is found, the password is decrypted and checks if it's the same as in the database. If it is, success code is sent to frontend, otherwise eroor-message it sent.
      let decryptPass = CryptoJS.AES.decrypt(results[0].password, "saltNyckel").toString(CryptoJS.enc.Utf8);

      if(decryptPass == password) {
        res.json({"code": "Success", "userName": userName});
      }
      else {
        res.json({"code": "Error"});
      }     
    }
  })
});

//Returns all exercises from database
router.get('/exercises', function(req, res, next) {
  req.app.locals.db
        .collection('exercises')
        .find()
        .toArray()
        .then((results) => {
            return res.json(results); 
  });
}); 




//Returns all favorite exercises from database
router.post('/favoriteexercises', function(req, res, next) {

  let user = req.body.userName;

  req.app.locals.db.collection('users').find({ "userName": user }).toArray()
  .then((results) => {
      return res.json(results);
  });
});




//Removes an exercise from favorite exercises
router.post('/removeexercise', function(req, res, next) {

  let objectToRemove = {
    title: req.body.title,
    category: req.body.category,
    description1: req.body.description1,
    description2: req.body.description2,
    image: req.body.image,
    video: req.body.video,
  }

  req.app.locals.db.collection("users").findOneAndUpdate({"userName": req.body.userName}, {$pull: {"favoriteExercises": objectToRemove}}, {returnDocument: 'after'} )
  .then(results => {
    res.json(results.value.favoriteExercises);
  }) 
});




//Saves exercise as favorite
router.post('/savefavorite', function(req, res, next) {
  let userName = req.body.userName;

  let exercise = {
    title: req.body.title,
    category: req.body.category,
    description1: req.body.description1,
    description2: req.body.description2,
    image: req.body.image,
    video: req.body.video
  }

  req.app.locals.db.collection("users").updateOne({"userName": userName}, {$push: {"favoriteExercises": exercise}})
  .then(results => {
    res.json("Det har ändrats");
  })
});



//Returns trainingprogram
router.post('/trainingprogram', function(req, res, next) {

  let user = req.body.userName;

  req.app.locals.db.collection('users').find({ "userName": user }).toArray()
  .then((results) => {
      return res.json(results[0].trainingProgram);
  });
});


//Adds exercise in trainingprogram
router.post('/addinprogram', function(req, res, next) {
  let userName = req.body.userName;  

  let exercise = {
    title: req.body.title,
    category: req.body.category,
    sets: req.body.sets,
    reps: req.body.reps,
    comments: req.body.comments
  }

  req.app.locals.db.collection("users").updateOne({"userName": userName}, {$push: {"trainingProgram": exercise}})
  .then(results => {
    res.json("Övning tillagd i träningsprogramprogram");
  })
});



//Removes exercise from trainingprogram
router.post('/removefromtrainingprogram', function(req, res, next) {

  let objectToRemove = {
    title: req.body.title,
    category: req.body.category,
    sets: req.body.sets,
    reps: req.body.reps,
    comments: req.body.comments,
  }  

  req.app.locals.db.collection("users").findOneAndUpdate({"userName": req.body.userName}, {$pull: {"trainingProgram": objectToRemove}}, {returnDocument: 'after'} )
  .then(results => {
    res.json(results.value.trainingProgram);
  })
});



//Returns all products in webshop
router.get('/webshop', function(req, res, next) {
  req.app.locals.db
        .collection('webshop')
        .find()
        .toArray()
        .then((results) => {
            return res.json(results); 
  });
});


module.exports = router;
