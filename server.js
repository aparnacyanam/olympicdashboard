/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

globalConfiguration = require('nconf');
var http = require('http'),
    express = require('express'),  // routing module
    cache = require('memory-cache'),
    mysql = require('mysql'),
    bodyParser = require('body-parser'),
    session = require('express-session'),

    connection = mysql.createConnection({
        host: 'localhost',
        //port : '3306',
        user: 'root',
        password: '',
        database: 'olympicathletes'
    });

app = express();
api = express();


app.use(session({
    cookieName: 'session',
    secret: 'THISISSECRETKEYFOREXPRESS',
    duration: 30 * 60 * 1000,
    ephemeral: true
}));
app.use(bodyParser.urlencoded());

globalConfiguration.add('default', {type: 'file', file: './config/global.json'});

port = '8088';

app.use(function (req, res, next) {
    req.cache = cache;
    next();
});



app.get('/signin', function (req, res) {
    res.sendFile(__dirname + '/web/login.html');
});

app.get('/signinAgain', function (req, res) {
    res.sendFile(__dirname + '/web/loginAgain.html');
});

app.get('/offline', function (req, res) {
    res.sendFile(__dirname + '/web/offline.html');
});
app.get('/olympicsDashApp.cache', function (req, res) {
    res.sendFile(__dirname + '/olympicsDashApp.cache');
});



app.post('/login', function (req, res, next) {
    var username = connection.escape(req.body.username);
    var password = connection.escape(req.body.password);
    console.log(" username " + username)
    console.log(" password " + password)

    var sql = "select id,username from users where username = ? AND password =  ? ";
    var inserts = [username, password];
    sql = mysql.format(sql, inserts);
    console.log(" /login :" + sql);
    connection.query("select id,username from users where username = " + username + " AND password = " + password, function (sqlError, rows) {
        console.log("rows :" + rows);
        console.log("sqlError :" + sqlError);
        if (sqlError != null) {
            console.log("Error while running query " + sql + " with sqlError : " + sqlError);
            res.status(503).json(sqlError);
        } else {
            if (rows.length > 0) {
            //    console.log("rows[0].username  :"+rows[0].username );
                if(rows[0].username !== null || !rows[0].username){
                    console.log("rows[0].username  :"+rows[0].username );
                    req.session.username = username;
                    req.username = username;
                }
                res.redirect('/dash');
                //    res.json(rows);
            } else {
                res.errorMsg = "Invalid Username or Password";
                //res.status(401).json("Invalid Username or Password");
                res.redirect('/signinAgain');
            }
        }
    });
});

app.get('/login',function(req,res){

    if(req.session.username){
        res.json(req.session.username);
    }
    else{
        res.status(401).json("Not Logged In");
    }

});


app.get('/logout',function(req,res){

    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }
        else
        {
            res.redirect('/signin');
        }
    });
});

function requireLogin (req, res, next) {
    if (!req.session.username) {
        res.redirect('/signin');
    } else {
        next();
    }
};

app.use('/api', api); // '/api' - namespace for all api calls

require('./api/api.js').services(api);

app.get('/dashboard', function (req, res) {
    res.sendFile(__dirname + '/web/index.html');
});

app.use('/dash', requireLogin, express.static(__dirname + '/web/index.html'), function (req, res, next) {
    next();
});
app.use('/web', express.static(__dirname + '/web'));


var httpserver = http.createServer(app).listen(port);
console.log('Http server listening on port : ' + port);

