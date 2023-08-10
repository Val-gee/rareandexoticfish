const mongoose = require('mongoose');

const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
    purchaseDate: {
        type: Date,
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;