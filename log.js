//Niza Volair
//HW Assignment: Database interactions and UI
//http://52.24.115.207:3000/

var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var bodyParser = require('body-parser');

app.engine('handlebars', handlebars.engine);

app.set('view engine', 'handlebars');
app.set('port', 3000);

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())
app.use(express.static('public'));


// Make database (used example code)
var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'student',
    password: 'default',
    database: 'student'
});

// Only make new pool when server is started
module.exports.pool = pool;


// GET request to insert new rows
app.get('/insert', function(req, res, next){
    var context = {};
	//Insert user input into database
    pool.query('INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)',
      [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], 
      function(err, result){
        if(err){
            next(err);
            return;
        }
        pool.query('SELECT * FROM workouts', function(err, row, next){
            if (err){
                next(err);
                return;
            }
            var results = JSON.stringify(row);
            res.send(results);
        });
    });
});


// GET reset table (provided for assignment)
app.get('/reset-table', function(req, res, next){
  	var context = {};
  	pool.query('DROP TABLE IF EXISTS workouts', function(err){
    	var createString = 'CREATE TABLE workouts('+
        	'id INT PRIMARY KEY AUTO_INCREMENT,'+
        	'name VARCHAR(255) NOT NULL,'+
        	'reps INT,'+
        	'weight INT,'+
        	'date DATE,'+
        	'lbs BOOLEAN)';
			pool.query(createString, function(err){
      		context.results = 'Table reset'; 
			res.render('home', context);
    	})
  	}); 
});


//  404 Error 
app.use(function(req, res){
	res.status(404);
	res.render('404');
});


// 500 Error 
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});


app.listen(app.get('port'), function(){
	console.log('Started');
});