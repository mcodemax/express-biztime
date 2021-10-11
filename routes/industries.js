//sql db queries are run asyncisly
//routes for /industries
const express = require("express");
const ExpressError = require('../expressError');
const router = new express.Router();
const db = require('../db')

//add routes for:
// adding an industry
// listing all industries, which should show the company code(s) for that industry
// associating an industry to a company

/** returns info for all industries */
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


module.exports = router;
