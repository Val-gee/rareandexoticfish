const { AuthenticationError } = require('apollo-server-express');
const { User, Product, Order, Category } = require('../models');

const { signToken } = require('../utils/auth.js');

const resolvers = {
    Query: {
        //works
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
    Mutation: {
        //works
        addUser: async (parent, { firstName, lastName, email, password }) => {
            const addUser = await User.create({ firstName, lastName, email, password });
            const token = signToken(addUser);
            return { token, user: addUser };
        },
        login: async (parent, { email, password }) => {
            console.log("Logging in...");
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError("Incorrect credentials");
            }

            const correctPw = await User.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError("Incorrect credentials");
            }

            const token = signToken(user);
            return { token, user };
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
        },
        addProduct: async (parent, { productInput }, context) => {
            console.log(context.user);
            try {
                if (context.user) {
                    const newProduct = await Product.create({
                        ...productInput,
                        owner: context.user._id,
                    });

                    return newProduct;
                }
            } catch(err) {
                console.log(err);
                throw new AuthenticationError("Failed to create product. resolvers.js.addProduct.line105");
            }
        },
        removeProduct: async (parent, { _id, name }, context) => {
            console.log(context.user);
            try{ 
                if (context.user) {
                    const removedProduct = await Product.findOneAndDelete({
                        _id: _id,
                        name: name,
                        owner: context.user._id,
                    });

                    return removedProduct;
                }
            } catch(err) {
                console.log(err);
                throw new AuthenticationError("Failed to remove Product. resolvers.js.removeproduct.line113")
            }
        }
    }
};

module.exports = resolvers;