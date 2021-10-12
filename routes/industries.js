//sql db queries are run asyncisly
//routes for /industries
const express = require("express");
const ExpressError = require('../expressError');
const router = new express.Router();
const db = require('../db')
const slugify = require('slugify');

//add routes for:
// adding an industry
// listing all industries, which should show the company code(s) for that industry
// associating an industry to a company

/** returns info for all industries */
router.get('', async (req, res, next) => {    
    try {
        const results = await db.query(`SELECT code, name, description FROM industries`); 
        return res.send({invoices: results.rows}); 
    } catch (error) {
        return next(new ExpressError("Couldn't find data", 404));
    }
});

/** return obj on given added industry*/
router.post('', async (req, res, next) => {    
    try {
        const { name, description } = req.body;
        
        //slugify the indsutry
        const code = slugify(name, { lower: true, strict: true });
        
        const results = await db.query(
            `INSERT INTO industries (code, name, description)
            VALUES ($1, $2, $3)
            RETURNING code, name, description`,
            [code, name, description]
        );

        return res.send( { industry: results.rows[0]} );  //might need to check what is returned
    } catch (error) {
        return next(new ExpressError('Could not add industry';, 404));
    }
});

/** add an industry to a company (association an industry with a company)
 * I: {"comp_code":"apple", "amt":20000}
*/
router.post('/associations', async (req, res, next) => {       
    try {
        const {comp_code, indus_code} = req.body;
        
        const results = await db.query(
            `INSERT INTO companies_industries (comp_code, indus_code)
            VALUES ($1, $2)
            RETURNING comp_code, indus_code`,
            [comp_code, indus_code]
        );
        return res.status(201).send( { "indsutry association": results.rows[0] } ); //maybe change to{invoices: {}}
    } catch (error) {
        return next(new ExpressError("Couldn't add association", 404));
    }
});


module.exports = router;
