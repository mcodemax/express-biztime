//sql db queries are run asyncisly
//routes for /companies
const express = require("express");
const ExpressError = require('../expressError');
const router = new express.Router();
const db = require('../db')

router.get('', async (req, res, next) => {    
    try {
        const results = await db.query('SELECT code, name, description FROM companies'); // using * in SQL is bad practice
        return res.send({companies: results.rows}); 
    } catch (error) {
        return next(new ExpressError("Couldn't find data", 404));
    }
});

/**Adds a company 
 * request body e.g. => {
  "code": "WGU2",
	"name": "Human Resources", 
	"description": "They hire ppl"
}
   in companies table name must be unique
*/
router.post('', async (req, res, next) => {    
    try {
        const { code, name, description } = req.body;

        const results = await db.query(
            `INSERT INTO companies (code, name, description)
            VALUES ($1, $2, $3)
            RETURNING code, name, description`,
            [code, name, description]
        );
        
        return res.status(201).send( { company: results.rows[0] } ); 
    } catch (error) {
        return next(new ExpressError("Couldn't add company", 404));
    }
});

/** return obj of company */
router.get('/:code', async (req, res, next) => {    
    try {
        const code = req.params.code;
	
	  //hint: make 2 seperate quieres. 1 for company info, one for company's invoices; loops through invoices; return the data.
	    //see soln 9:45 in lectures ;; also google adding property to js object
        const results = await db.query(`
            SELECT code, name, description FROM companies
            WHERE code=$1 
            RETURNING code, name, description`, //returning needed otherwise won't return an error
            [code]
        );
        return res.send({company: results}); 
    } catch (error) {
        return next(new ExpressError("Couldn't find company",404));
    }
});

/** Edit existing company. */
router.put('/:code', async (req, res, next) => {    
    try {
        const { name, description } = req.body;
        const code = req.params.code;

        const results = await db.query(`
            UPDATE companies SET name=$2, description=$3
            WHERE code=$1
            RETURNING code, name, description`, //returning needed otherwise won't return an error
            [code, name, description]
        );
        return res.send({ company: results.rows[0] }); 
    } catch (error) {
        return next(new ExpressError("Couldn't find company", 404));
    }
});

router.delete('/:code', async (req, res, next) => {    
    try {
        const code = req.params.code;

        const results = await db.query(`
        DELETE FROM companies WHERE code=$1`,
        [code]);

        console.log(results.rowCount)
        if(!results.rowCount) throw new ExpressError('No data to delete', 404);

        return res.send({status: 'deleted'}); 
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
