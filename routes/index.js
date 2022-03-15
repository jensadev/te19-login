const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index.njk', {
        title: 'Home',
        layout: 'layout.njk',
    });
});

router.get('/login', function (req, res, next) {
    res.render('login.njk', {
        title: 'Login',
        layout: 'layout.njk',
    });
});

router.post('/login', function (req, res, next) {
    res.json({fix: 'fix'});
});

router.get('/logout', function (req, res, next) {
    res.json({fix: 'fix'});
});

router.get('/register', function (req, res, next) {
    res.json({fix: 'fix'});
});

router.post('/register', function (req, res, next) {
    res.json({fix: 'fix'});
});

router.get('/profile', function (req, res, next) {
    res.render('secret.njk', {
        title: 'Secret',
        layout: 'layout.njk',
    });
});

module.exports = router;
