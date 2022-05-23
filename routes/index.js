const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../utils/database');

const routeNav = () => {
    return router.stack.map(route => {
        if (route.route.methods.get) {
            return route.route.path;
        }
    });
}

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index.njk', {
        routes: routeNav(),
        title: 'Home',
        layout: 'layout.njk',
    });
});

router.get('/gethash/:pwd', function (req, res, next) {
    const pwd = req.params.pwd;
    bcrypt.hash(pwd, 10).then(function (hash) {
        res.json({ hash });
    });
});

router.get('/login', function (req, res, next) {
    res.render('login.njk', {
        title: 'Login',
        layout: 'layout.njk',
    });
});

router.post('/login', async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.redirect('/login');
    }

    await pool
    .promise()
    .query(`SELECT id, name, password FROM ${process.env.TABLE_PREFIX}users WHERE name = ? LIMIT 1`, [username])
    .then(([rows]) => {
        if(rows.length === 0) {
            console.log("hantera no user found");
            return res.redirect('/login');
        };
        bcrypt.compare(password, rows[0].password).then((result) =>{
            // result == true
            if (result) {
                req.session.uid = rows[0].id;
                req.session.username = rows[0].name; 
                res.redirect('/profile');
            } else {
                console.log("password fel, men det berättar vi inte för anv");
                res.render('login.njk', {
                    title: 'Failed login',
                    layout: 'layout.njk',
                });
            }
        });
    })
    .catch(error => {
        console.log(error);
    });
});

router.get('/logout', function (req, res, next) {
    req.session.destroy();
    console.log(req.session);
    res.redirect('/');
});

router.get('/register', function (req, res, next) {
    res.render('register.njk', {
        title: 'Register',
        layout: 'layout.njk',
    });
});

router.post('/register', function (req, res, next) {
    const user = req.body.username;
    const pwd = req.body.password;
    const pwd2 = req.body.password2;

    if (pwd !== pwd2) {
        return res.redirect('/register');
    }

    bcrypt.hash(pwd, 10).then(async(hash) =>{
        await pool
        .promise()
        .query(`INSERT INTO ${process.env.TABLE_PREFIX}users (name, password) VALUES (?, ?)`, [user, hash])
        .then((response) => {
            // res.json(response);
            res.redirect('/login');
        })
        .catch(error => {
            console.log(error);
        });
    });
});

router.get('/profile', (req, res, next) =>{
    if (!req.session.uid && !req.session.username) {
        return res.redirect('/login');
    }

    res.render('secret.njk', {
        title: 'Secret',
        user: req.session.username,
        layout: 'layout.njk',
    });
});

module.exports = router;
