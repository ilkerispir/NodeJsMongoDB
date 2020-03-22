const express = require('express');
const router = express();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

//Handle incoming GET requests to /orders
router.get('/', (req, res, next) =>{
    Order
    .find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(docs => {
        console.log(order);
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
              return {
                  _id: doc._id,
                  product: doc.product,
                  quantity: doc.quantity,
                  request: {
                      type: 'GET',
                      url: 'http://localhost:8080/orders' + doc._id
                  }
              }  
            })
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next) =>{
    Product.findById(req.body.productId)
    .then(product => {
        if(!product){
            console.log(order);
            return res.status(404).json({
                message: 'Prodcut not found'
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        }); 
        return order.save(); 
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Order stored',
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url: 'http://localhost:8080/orders' + result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });  
});

router.get('/:orderId', (req, res, next) => {
    Order
    .findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order =>{ 
        if(!order){
            console.log(order);
            res.status(404).json({
                message: "Order not found"
            });
        }
        console.log(order);
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http://localhost:8080/orders'
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
});

router.delete('/:orderId', (req, res, next) => {
    Order.remove({_id: req.params.orderId})
    .exec()
    .then(order =>{
        console.log(order);
        res.status(200).json({
            message: 'Order deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:8080/orders',
                body: {productId: "ID", quantity: "Number"}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;