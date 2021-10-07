//sql db queries are run asyncisly
//routes for /companies
const express = require("express");
const ExpressError = require('../expressError');
const router = new express.Router();
const db = require('../db')

router.get('', async (req, res, next) => {    
    try {
        const results = await db.query('SELECT * FROM companies') 
        return res.send(results.rows); //maybe change to{companies: {}}
    } catch (error) {
        return next(new ExpressError("Couldn't find data",404));
    }
});

router.post('', async (req, res, next) => {    
    const req.body.code;
    const req.body.name;
    const req.body.description;
    try {
        const results = await db.query('SELECT * FROM companies') 
        return res.send(results.rows); //maybe change to{companies: {}}
    } catch (error) {
        return next(new ExpressError("Couldn't add company",404));
    }
});

router.get('/:code', async (req, res, next) => {    
    try {
        const results = await db.query('SELECT * FROM companies WHERE code=code', //add sanitizer) 
        return res.send({company: {results}}); //might need to check what is returned
    } catch (error) {
        return next(new ExpressError("Couldn't find company",404));
    }
});

router.put('/:code', async (req, res, next) => {    
    const code = req.params.code;
    const name = req.body.name;
    const description = req.body.description;
    
    try {
        const results = await db.query('SELECT * FROM companies WHERE code=code', //add sanitizer) 
        //reassign results stuff
        return res.send({company: {results}}); //might need to check what is returned
    } catch (error) {
        return next(new ExpressError("Couldn't find company",404));
    }
});

router.delete('/:code', async (req, res, next) => {    
    const code = req.params.code;
    const name = req.body.name;
    const description = req.body.description;
    
    try {
        const results = await db.query('SELECT * FROM companies WHERE code=code', //add sanitizer) 
        //then del it
        return res.send({company: {results}}); //might need to check what is returned
    } catch (error) {
        return next(new ExpressError("Couldn't find company",404));
    }
});


module.exports = router;
