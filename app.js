let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require("cors");
let usersRouter = require('./routes/users');
const userRouter = require('./routes/user');
const testAPIRouter = require("./routes/testAPI");
const sqlite3 = require('sqlite3').verbose();
const fs = require("fs");


const fileContent1 = fs.readFileSync("./database/users.json", "utf8");


const app = express();

const db = new sqlite3.Database('./database/users.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the main database.');
    db.run('CREATE TABLE IF NOT EXISTS users_info AS\n' +
        'SELECT users.id, users.first_name, users.last_name, users.email, users.gender, users.ip_address, users_statistic.clicks, users_statistic.page_views\n' +
        'FROM users, users_statistic WHERE users.id = users_statistic.user_id')
});


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/userInfo', userRouter);
app.use("/testAPI", testAPIRouter);

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
