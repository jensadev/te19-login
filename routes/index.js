const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../utils/database');

router.get('/routes', (req, res) => {
    const routes = router.stack.map(route => {
        return route.route.path;
    });
    res.json(routes);
});

/* GET home page. */
router.get('/', function (req, res, next) {
    const routes = router.stack.map(route => {
        return route.route.path;
    });
    res.render('index.njk', {
        routes: routes,
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
    .query('SELECT id, name, password FROM users WHERE name = ? LIMIT 1', [username])
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
    res.json({ fix: 'fix' });
});

router.post('/register', function (req, res, next) {
    res.json({ fix: 'fix' });
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
