//sql db queries are run asyncisly
//routes for /industries
const express = require("express");
const ExpressError = require('../expressError');
const router = new express.Router();
const db = require('../db')
const slugify = require('slugify');

//add routes for:
// adding an industry

// associating an industry to a company

/** returns info for all industries */
router.get('', async (req, res, next) => {    
    try {
        // listing all industries, which should show the company code(s) for that industry
        const results = await db.query(`SELECT code, name, description FROM industries`); 
        
        const indusCompDict = {};
        const indusCodesSet = new Set();
        
        for(let x of results.rows){
            indusCodesSet.add(x['code']); //create unique key for every industry
            indusCompDict[x['code']] = []; //create array for every industry to have companies added into later
        }
        
        const compIndusResults = await db.query(`
            SELECT comp_code, indus_code FROM companies_industries;
        `);
        
        for(let x of compIndusResults.rows){ //pushes companies in array labeled with an industry
            console.log(indusCodesSet.has(x.indus_code))
            if(indusCodesSet.has(x.indus_code)) {
                indusCompDict[x.indus_code].push(x.comp_code);
            };
        }

        return res.send({industries: indusCompDict}); 
    } catch (error) {
        return next(new ExpressError("Couldn't find data", 404));
    }
});

/** return obj on given added industry
 * I: { "name":"Mining", "description":"Tryna git gold" }
*/
router.post('', async (req, res, next) => {    
    try {
        const { name, description } = req.body;
        
        //slugify the industry
        const code = slugify(name, { lower: true, strict: true });
        
        const results = await db.query(
            `INSERT INTO industries (code, name, description)
            VALUES ($1, $2, $3)
            RETURNING code, name, description`,
            [code, name, description]
        );

        return res.send( { industry: results.rows[0]} );  //might need to check what is returned
    } catch (error) {
        return next(new ExpressError('Could not add industry', 404));
    }
});

/** add an industry to a company (association an industry with a company)
 * I: {"comp_code":"apple", "indus_code":"tech"}
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
