//sql db queries are run asyncisly
//routes for /invoices
const express = require("express");
const ExpressError = require('../expressError');
const router = new express.Router();
const db = require('../db')

/** returns info for all invoices */
router.get('', async (req, res, next) => {    
    try {
        const results = await db.query(`SELECT invoices.id, invoices.comp_code FROM invoices`); // using * in SQL is bad practice
        return res.send({invoices: results.rows}); 
    } catch (error) {
        return next(new ExpressError("Couldn't find data", 404));
    }
});

/** return obj on given invoice*/
router.get('/:id', async (req, res, next) => {    
    try {
        const id = req.params.id;
        
        const results = await db.query(`SELECT invoices.id, invoices.amt, invoices.comp_code, invoices.paid, invoices.add_date, invoices.paid_date, companies.company FROM invoices
                                       JOIN companies ON invoices.comp_code=companies.code
                                       WHERE invoices.comp_code=$1`
                                      ,[id]); 
        return res.send( {invoice: { results.rows[0] }} ); //might need to check what is returned
    } catch (error) {
        return next(new ExpressError("Couldn't find invoice",404));
    }
});

/** add an invoice*/
router.post('', async (req, res, next) => {       
    try {
        const {comp_code, amt} = req.body;
        
        //add invoice
        const results = await db.query(
            `INSERT INTO invoices (comp_code, amt)
            VALUES ($1, $2)
            RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [comp_code, amt]
        );
        return res.send(invoice: {results.rows[0]}); //maybe change to{invoices: {}}
    } catch (error) {
        return next(new ExpressError("Couldn't add invoice",404));
    }
});

/** updates an invoice*/
router.put('/:id', async (req, res, next) => {    
    try {
        const id = req.params.id;
        const { amt } = req.body;
        
        const results = await db.query(`SELECT * FROM invoices WHERE id=$1
                                        RETURN id, comp_code, amt, paid, add_date, paid_date`,
                                      [id])
        
        return res.send({ invoice: {results.rows[0]} }); //might need to check what is returned
    } catch (error) {
        return next(new ExpressError("Couldn't find invoice id",404));
    }
});

/** Deletes an invoice. */
router.delete('/:id', async (req, res, next) => {    
    try {
        const id = req.params.id;
        
        const results = await db.query(`DELETE FROM invoices WHERE id=$1`,
                                        [id]);

        console.log(results.rowCount)
        if(!results.rowCount) throw new ExpressError('No data to delete', 404);

        return res.send({status: 'deleted'}); 
    } catch (error) {
        return next(error);
    }
});


module.exports = router;
