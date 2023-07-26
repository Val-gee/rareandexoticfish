const mongoose = require('mongoose');

const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        min: 0,
        default: 0
    },
    category: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category'
        }
    ],
    image: {
        type: String,
        required: true
    }
})

const Products = mongoose.model('Product', ProductSchema);
module.exports = Products;
