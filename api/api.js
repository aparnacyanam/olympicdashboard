/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var CACHE_EXPIRATION = 3600000;
var mysql = require('mysql'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
    connection = mysql.createConnection({
    host: 'localhost',
    //port : '3306',
    user: 'root',
    password: '',
    database: 'olympicathletes'
});


//passport.use(new LocalStrategy(
//    function (username, password, done) {
//        return check_auth_user(username, password, done);
//    }
//));

//var check_auth_user = function (username, password, done, public_id) {
//    var sql = "SELECT * FROM users WHERE username = " + username + " and password = " + password + " limit 1";
//    console.log(sql);
//    connection.query(sql, function (err, results) {
//        if (err)
//            throw err;
//        if (results.length > 0) {
//            var res = results[0];
//            //serialize the query result save whole data as session in req.user[] array
//            passport.serializeUser(function (res, done) {
//                done(null, res);
//            });
//            passport.deserializeUser(function (id, done) {
//                done(null, res);
//            });
//            console.log(JSON.stringify(results));
//            console.log(results[0]['id']);
//            return done(null, res);
//        } else {
//            return done(null, false);
//        }
//
//    });
//
//};


var checkCache = function (req, res, next) {

    if (req.cache.get(req.originalUrl)) {
        console.log(req.originalUrl + " Response loaded from cache");
        return res.json(req.cache.get(req.originalUrl));
    }
    else {
        next();
    }
};
exports.services = function (app) {


    app.all('/*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
        res.header("Expires", "-1");
        return next();
    });


    app.get('/clearCache', function (req, res) {
        var size = req.cache.size();
        req.cache.clear();
        res.json('Cache of size : ' + size + ' Cleared successfully');
    });

    app.get("/", function (req, res) {
        res.send('Api Working Correctly');

    });


    app.get("/hello", checkCache, function (req, res) {
        req.cache.put(req.originalUrl, 'Hello User, This is loaded from cache', CACHE_EXPIRATION);
        res.send('Hello User');
    });

    var auth = function (req, res, next) {
        if (!req.isAuthenticated())
            res.send(401);
        else
            next();
    };

    app.post("/login", checkCache, function (req, res) {

        var username = connection.escape(req.body.username);
        var pwd = connection.escape(req.body.password);
        var sql = 'Select *  from  users WHERE username = ' + username + ' AND password = ' + pwd;

        connection.query(sql, function (sqlError, rows) {
            console.log("rows :" + rows);
            console.log("sqlError :" + sqlError);
            if (sqlError != null) {
                console.log("Error while running query " + sql + " with sqlError : " + sqlError);
                res.send(sqlError);
            } else {
                req.cache.put(req.originalUrl, rows, CACHE_EXPIRATION);
                res.send(rows);
            }
        });

    });

    var mysql_handle_database = function (req, res, sql) {

        connection.query(sql, function (sqlError, rows) {
            if (sqlError != null) {
                console.log("Error while running query " + sql + " with sqlError : " + sqlError);

                res.status(503).json(sqlError);
            } else {
                req.cache.put(req.originalUrl, rows, CACHE_EXPIRATION);
                res.json(rows);
            }
        });

        //connection.connect(function (err) {
        //    if (err) {
        //        console.log("Error connecting to Database..");
        //        res.send(err);
        //    }
        //    else {
        //        connection.query(sql, function (sqlError, rows) {
        //            if (sqlError != null) {
        //                console.log("Error while running query " + sql + " with sqlError : " + sqlError);
        //                res.json(sqlError);
        //            } else {
        //                res.json(rows);
        //            }
        //        });
        //    }
        //});
    };

    app.get("/samplequery", function (req, res) {
        var sql = 'Select count(*) as total_records from  medal_info';
        mysql_handle_database(req, res, sql);
    });

    app.get("/totalNumMedals", function (req, res) {
        var sql = 'Select country, year, count(total) as total_perYr from  medal_info ' +
            'Group by country, year ' +
            'Order by total_perYr Desc, year';
        mysql_handle_database(req, res, sql);
    });

    app.get("/totalNumMedalsByType", function (req, res) {
        var sql = 'Select country, year, count(' + connection.escape(req.query.type) + ') as total_perYr from  medal_info ' +
            'Group by country, year Order by total_perYr Desc, country, year';
        console.log('totalNoMedalsByType (SQL) : ' + sql);
        mysql_handle_database(req, res, sql);
    });

    app.get("/getYears", function (req, res) {
        var sql = 'Select Distinct(year) FROM  medal_info ORDER BY year DESC';
        //    console.log('getYears (SQL) : '+sql);
        mysql_handle_database(req, res, sql);
    });

    app.get("/getCountries", function (req, res) {
        var sql = 'Select Distinct(country) FROM  medal_info ORDER By country';
        //    console.log('getCountries (SQL) : '+sql);
        mysql_handle_database(req, res, sql);
    });

    app.get("/totalGoldNumMedalsByYear", function (req, res) {
        var sql = 'Select country,cc_2 as cc_code, year, SUM(gold) as medal_count' +
            ' FROM  medal_info , country_codes ' +
            ' WHERE LOWER(TRIM(country)) = LOWER(TRIM(country_name)) AND year =' + connection.escape(req.query.year) +
            ' GROUP BY country, cc_code, year ORDER BY medal_count DESC';
        //  console.log('totalNoMedalsByType (SQL) : '+sql);
        mysql_handle_database(req, res, sql);
    });

    app.get("/totalSilverNumMedalsByYear", function (req, res) {
        var sql = 'Select country,cc_2 as cc_code, year, SUM(silver) as medal_count' +
            ' FROM  medal_info , country_codes ' +
            ' WHERE LOWER(TRIM(country)) = LOWER(TRIM(country_name)) AND year =' + connection.escape(req.query.year) +
            ' GROUP BY country, cc_code, year ORDER BY medal_count DESC';
        //   console.log('totalNoMedalsByType (SQL) : '+sql);
        mysql_handle_database(req, res, sql);
    });

    app.get("/totalBronzeNumMedalsByYear", function (req, res) {
        var sql = 'Select country,cc_2 as cc_code, year, SUM(bronze) as medal_count' +
            ' FROM  medal_info , country_codes ' +
            ' WHERE LOWER(TRIM(country)) = LOWER(TRIM(country_name)) AND year =' + connection.escape(req.query.year) +
            ' GROUP BY country, cc_code, year ORDER BY medal_count DESC';
        //    console.log('totalNoMedalsByType (SQL) : '+sql);
        mysql_handle_database(req, res, sql);
    });

    app.get("/getCountryMedalsByYear", function (req, res) {

        var medal = req.query.medal;
        if (req.query.medal === 'gold') {
            var sql = "Select country, year, sports_category, SUM(gold) as count " +
                " FROM  medal_info WHERE LOWER(TRIM(country)) = LOWER(TRIM( ? )) AND year = ?" +
                " GROUP BY sports_category ORDER BY sports_category";
            var inserts = [req.query.country, req.query.year];
            sql = mysql.format(sql, inserts);
            console.log(sql);
            connection.query(sql, function (sqlError, rows) {
                console.log("rows :" + rows);
                console.log("sqlError :" + sqlError);
                if (sqlError != null) {
                    console.log("Error while running query " + sql + " with sqlError : " + sqlError);
                    res.json(sqlError);
                } else {
                    req.cache.put(req.originalUrl, rows, CACHE_EXPIRATION);
                    res.json(rows);
                }
            });
        } else if (req.query.medal === 'silver') {
            var sql = "Select country, year, sports_category, SUM(silver) as count " +
                " FROM  medal_info WHERE LOWER(TRIM(country)) = LOWER(TRIM( ? )) AND year = ?" +
                " GROUP BY sports_category ORDER BY sports_category";
            var inserts = [req.query.country, req.query.year];
            sql = mysql.format(sql, inserts);
            console.log(sql);
            connection.query(sql, function (sqlError, rows) {
                console.log("rows :" + rows);
                console.log("sqlError :" + sqlError);
                if (sqlError != null) {
                    console.log("Error while running query " + sql + " with sqlError : " + sqlError);
                    res.json(sqlError);
                } else {
                    req.cache.put(req.originalUrl, rows, CACHE_EXPIRATION);
                    res.json(rows);
                }
            });
        } else if (req.query.medal === 'bronze') {
            var sql = "Select country, year, sports_category, SUM(bronze) as count " +
                " FROM  medal_info WHERE LOWER(TRIM(country)) = LOWER(TRIM( ? )) AND year = ?" +
                " GROUP BY sports_category ORDER BY sports_category";
            var inserts = [req.query.country, req.query.year];
            sql = mysql.format(sql, inserts);
            console.log(sql);
            connection.query(sql, function (sqlError, rows) {
                console.log("rows :" + rows);
                console.log("sqlError :" + sqlError);
                if (sqlError != null) {
                    console.log("Error while running query " + sql + " with sqlError : " + sqlError);
                    res.json(sqlError);
                } else {
                    req.cache.put(req.originalUrl, rows, CACHE_EXPIRATION);
                    res.json(rows);
                }
            });
        }

    });

    app.get("/totalNumMedalsOnWhole", function (req, res) {
        var sql = 'Select country, count(*) as total_medals from  medal_info group by country order by total_medals DESC';
        mysql_handle_database(req, res, sql);
    });

    app.get("/getPlayers", function (req, res) {
        var sql = 'Select Distinct(athlete) as player, sports_category as category from medal_info' +
            '  WHERE LOWER(TRIM(country)) = LOWER(TRIM(' + connection.escape(req.query.country) + ')) ORDER BY category'
        mysql_handle_database(req, res, sql);
    });

    app.get("/getPlayerMedalCount", function (req, res) {
        var sql = 'Select SUM(gold) as gold, SUM(silver) as silver, SUM(bronze) as bronze from medal_info' +
            '  WHERE LOWER(TRIM(athlete)) = LOWER(TRIM(' + connection.escape(req.query.player) + '))'
        console.log('getPlayerMedalCount SQL : ' + sql);
        mysql_handle_database(req, res, sql);
    });

    app.get("/getPlayerInfo", function (req, res) {
        var sql = 'SELECT athlete, age, gold, silver, bronze, ceremony_date FROM medal_info ' +
            '  WHERE LOWER(TRIM(athlete)) = LOWER(TRIM(' + connection.escape(req.query.player) + '))'
        console.log('getPlayerMedalCount SQL : ' + sql);
        mysql_handle_database(req, res, sql);
    });
};

