const express = require('express');
const app = express();

const productRouters = require('./api/routes/products');
const orderRouters = require('./api/routes/orders');

app.use('/products', productRouters);
app.use('/orders', orderRouters);

module.exports = app;
