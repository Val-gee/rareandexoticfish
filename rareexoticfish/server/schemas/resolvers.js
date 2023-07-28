const { AuthenticationError } = require('apollo-server-express');
const { User, Product, Order, Category, User } = require('../models');

const { signToken } = require('../utils/auth.js');

const resolvers = {
    Query: {
        allUsers: async () => {
            const users = await User.find()
                .populate('orders');
            return users;
        },
        userById: async (parent, { _id }) => {
            const userById = await User.findbyId(_id)
                .populate('orders');
            return userById;
        },
        userByEmail: async (parent, { email }) => {
            const userByEmail = await User.find({ "email": email })
                .populate('orders');
            return userByEmail;;
        },
        allCategories: async () => {
            const categories = await Category.find();
            return categories;
        },
        categoryByName: async (parent, { name }) => {
            const categoryByName = await Category.find({ "name": name });
            return categoryByName;
        },
        allProducts: async () => {
            const products = await Product.find()
                .populate('category');
            return products;
        },
        productByName: async (parent, { name }) => {
            const productByName = await Product.find({ "name": name })
                .populate('category');
            return productByName;
        },
        allOrders: async () => {
            const allOrders = await Order.find()
                .populate('products');
            return allOrders;
        },
        orderById: async (parent, { _id }) => {
            const orderById = await Order.find({ "_id": _id })
                .populate('products');
            return orderById;
        },
        orderByDate: async (parent, { purchaseDate }) => {
            const orderByDate = await Order.find({ "purchaseDate": purchaseDate })
                .populate('products');
            return orderByDate
        }
    },
    mutations: {
        addUser: async (parent, args) => {
            const addUser = await User.create(args);
            const token = signToken(addUser);
            return { token, addUser };
        },
        login: async (parent, { email, password }) => {
            console.log("Logging in...");
            const User = await User.findOne({ email });

            if (!User) {
                throw new AuthenticationError("Incorrect credentials");
            }

            const correctPw = await User.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError("Incorrect credentials");
            }

            const token = signToken(User);
            return { token, User };
        },
        addOrder: async (parent, { products }, context) => {
            console.log(context);
            if (context.user) {
                const order = new Order.create({ products });
                await User.findByIdAndUpdate(context.user._id, {
                    $push: { orders: order._id}
                })
    
                return order;
            }
            throw new AuthenticationError('Must be logged in...');
        }
    }
};

module.exports = resolvers;