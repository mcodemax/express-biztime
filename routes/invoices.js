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
        
        //might have to do a LEFT JOIN to display all of invoices.id, invoices.amt, invoices.comp_code, invoices.paid, invoices.add_date, invoices.paid_date
        const results = await db.query(`SELECT invoices.id, invoices.amt, invoices.comp_code, invoices.paid, invoices.add_date, invoices.paid_date 
                                        FROM invoices
                                        JOIN companies ON invoices.comp_code=companies.code
                                        WHERE invoices.id=$1`
                                      ,[id]); 
        
        if(!results.rows[0]) throw new ExpressError("Couldn't find invoice", 404);

        const comp_code = results.rows[0].comp_code;
        if(results.rows[0].hasOwnProperty('comp_code')) delete results.rows[0]['comp_code'];
        
        const comp_results = await db.query(`SELECT code, name, description FROM companies
                                            WHERE code=$1`
                                            ,[comp_code]);

        results.rows[0].company = comp_results.rows[0];

        return res.send( { invoice: results.rows[0]} );  //might need to check what is returned
    } catch (error) {
        return next(error);
    }
});

/** add an invoice
 * I: {"comp_code":"apple", "amt":20000}
*/
router.post('', async (req, res, next) => {       
    try {
        const {comp_code, amt} = req.body;
        
        const results = await db.query(
            `INSERT INTO invoices (comp_code, amt)
            VALUES ($1, $2)
            RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [comp_code, amt]
        );
        return res.status(201).send( {invoice: results.rows[0] } ); //maybe change to{invoices: {}}
    } catch (error) {
        return next(new ExpressError("Couldn't add invoice",404));
    }
});

/** updates an invoice
 {"amt": 50000, "paid":false}
*/
router.put('/:id', async (req, res, next) => {    
    try {
        const id = req.params.id;
        const { amt, paid } = req.body;
        let paidDate;

        if(paid === true){
            paidDate = new Date();
        }else{
            paidDate = null;
        }
        
        console.log({paidDate, paid});
        const results = await db.query(`UPDATE invoices SET amt=$1, paid=$2, paid_date=$3
                                        WHERE id=$4
                                        RETURNING id, comp_code, amt, paid, add_date, paid_date`
                                    ,[amt, paid, paidDate, id]);
        
        return res.send( { invoice: results.rows[0] } ); //might need to check what is returned
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
        if(!results.rowCount) throw new ExpressError('No invoice to delete', 404);

        return res.send({status: 'deleted'}); 
    } catch (error) {
        return next(error);
    }
});


module.exports = router;
