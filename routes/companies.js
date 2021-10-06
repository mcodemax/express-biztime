//sql db queries are run asyncisly

const express = require("express");
const ExpressError = require('../expressError');
const router = new express.Router();
const db = require('../db')

router.get('', async (req, res, next) => {    
    // try {
    //     return res.send(items); //.json not needed b/c included in app.py
    // } catch (error) {
    //     return next(error);
    // }
    const results = await db.query('SELECT * FROM companies') 
    return res.send(results.rows);
});

module.exports = router;