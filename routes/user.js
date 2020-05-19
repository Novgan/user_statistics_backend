const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/users.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the user database.');
    db.run('CREATE TABLE IF NOT EXISTS users_info AS\n' +
        'SELECT users.id, users.first_name, users.last_name, users.email, users.gender, users.ip_address, users_statistic.clicks, users_statistic.page_views\n' +
        'FROM users, users_statistic WHERE users.id = users_statistic.user_id')
});

router.get('/:id', (req, res) => {
    db.all('SELECT id, first_name, last_name, email, gender, ip_address, Sum(clicks) AS total_clicks, Sum(page_views) AS total_page_views\n' +
        'FROM users_info\n' +
        'GROUP BY id', (err, row) => {
        const Array = row
        const searchId = Number(req.params.id)
        const user = Array.find(u => u.id === searchId)
        if (user === undefined) {
            console.log(err)
            res.json(null)
        } else {
            res.json(user)
        }
    })
});

module.exports = router;
