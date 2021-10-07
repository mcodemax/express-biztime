//sql db queries are run asyncisly
//routes for /invoices
const express = require("express");
const ExpressError = require('../expressError');
const router = new express.Router();
const db = require('../db')

/** returns info for all invoices */
router.get('', async (req, res, next) => {    
    try {
        const results = await db.query('SELECT * FROM invoices') 
        return res.send(results.rows); //maybe change to{invoices: {}}
    } catch (error) {
        return next(new ExpressError("Couldn't find data",404));
    }
});

/** return obj on given invoice*/
router.get('/:id', async (req, res, next) => {    
    const id = req.params.id;
    
    try {
        const results = await db.query('SELECT * FROM companies WHERE id='id', //add sanitizer) 
        return res.send( {invoice: {results}} ); //might need to check what is returned
    } catch (error) {
        return next(new ExpressError("Couldn't find invoice",404));
    }
});

/** add an invoice*/
router.post('', async (req, res, next) => {    
    const comp_code = req.body.comp_code;
    const amt = req.body.amt;
    
    try {
        //add invoice
        const results = await db.query('SELECT * FROM invoices') 
        return res.send(results.rows); //maybe change to{invoices: {}}
    } catch (error) {
        return next(new ExpressError("Couldn't find data",404));
    }
});

/** updates an invoice*/
router.put('/:id', async (req, res, next) => {    
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
