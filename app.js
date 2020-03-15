const express = require('express');
const app = express();
const morgan = require('morgan');

const productRouters = require('./api/routes/products');
const orderRouters = require('./api/routes/orders');

app.use(morgan('dev'));

//Routes which should handle requests 
app.use('/products', productRouters);
app.use('/orders', orderRouters);

app.use((res, req, next) =>{
    const error = new Error('Not Found!');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    });
});

module.exports = app;
