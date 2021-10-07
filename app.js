/** BizTime express application. */


const express = require("express");
const morgan = require('morgan');
const app = express();
const ExpressError = require("./expressError");
const companiesRoutes = require('./routes/companies');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

/** Routes related to companies*/
app.use('/companies', companiesRoutes);

/** Routes related to invoices*/
app.use('/invoices', companiesRoutes);

/** 404 handler */
app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */
app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;
