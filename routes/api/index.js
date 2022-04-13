const express = require('express');
const router = express.Router();
const pool = require('../../utils/database');

router.get('/users', async (req, res) => {
    await pool
    .promise()
    .query(`SELECT id, name FROM ${process.env.TABLE_PREFIX}users`)
    .then(([rows]) => {
        if(rows.length === 0) {
            return res.json({
                error: 'No users found'
            });
        }
        return res.json({
            users: rows
        });
    })
    .catch(error => {
        console.log(error);
        return res.status(500).json({
            error: 'Something went wrong'
        })
    });
})

module.exports = router;