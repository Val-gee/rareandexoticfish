const { AuthenticationError } = require('apollo-server-express');
const { User, Product, Order, Category } = require('../models');

const { signToken } = require('../utils/auth.js');

const resolvers = {
    Query: {
        //works
        allUsers: async () => {
            const users = await User.find()
                .populate('orders')
                .populate({
                    path: 'orders',
                    populate: {
                        path: 'products'
                    }
                })
                .populate({
                    path: 'orders',
                    populate: {
                        path: 'products',
                        populate: {
                            path: 'category'
                        }
                    }
                });
            return users;
        },
        //works
        userById: async (parent, { _id }) => {
            const userById = await User.findById(_id)
                .populate('orders')
                .populate({
                    path: 'orders',
                    populate: {
                        path: 'products'
                    }
                })
                .populate({
                    path: 'orders',
                    populate: {
                        path: 'products',
                        populate: {
                            path: 'category'
                        }
                    }
                });
            return userById;
        },
        //works
        userByEmail: async (parent, { email }) => {
            const userByEmail = await User.findOne({ "email": email })
                .populate('orders')
                .populate({
                    path: 'orders',
                    populate: {
                        path: 'products'
                    }
                })
                .populate({
                    path: 'orders',
                    populate: {
                        path: 'products',
                        populate: {
                            path: 'category'
                        }
                    }
                });
            ;
            return userByEmail;;
        },
        //works
        allCategories: async () => {
            const categories = await Category.find();
            return categories;
        },
        //Works
        categoryByName: async (parent, { name }) => {
            const categoryByName = await Category.findOne({ "name": name });
            return categoryByName;
        },
        //works
        allProducts: async () => {
            const products = await Product.find()
                .populate('category');
            return products;
        },
        //works
        productByName: async (parent, { name }) => {
            const productByName = await Product.findOne({ "name": name })
                .populate('category');
            return productByName;
        },
        //works
        allOrders: async () => {
            const allOrders = await Order.find()
                .populate('products')
                .populate({
                    path: 'products',
                    populate: {
                        path: 'category'
                    }
                });
            const formattedOrders = allOrders.map(order => ({
                ...order._doc,
                purchaseDate: new Date(order.purchaseDate).toLocaleString('en-US', {
                    timeZone: 'America/New_York',
                }),
            }));

            // Return data with populated products and formatted purchaseDate
            return formattedOrders;
        },
        //works
        orderById: async (parent, { _id }) => {
            const order = await Order.findById({ _id })
                .populate('products')
                .populate({
                    path: 'products',
                    populate: {
                        path: 'category'
                    }
                });
            console.log(order);

            if (!order) {
                throw new AuthenticationError("Order not found.")
            }

            const formattedOrderById = {
                ...order._doc,
                purchaseDate: new Date(order.purchaseDate).toLocaleString('en-US', {
                    timeZone: 'America/New_York',
                })
            };

            return formattedOrderById;
        },
        //works
        orderByDate: async (parent, { purchaseDate }) => {
            const parsedDate = new Date(purchaseDate);
            const unixPurchaseDate = parsedDate.getTime();

            const startTime = unixPurchaseDate - 1800000; //30 minutes before 
            const endTime = unixPurchaseDate + 1800000; //30 minutes after

            const orderByDate = await Order.find({
                "purchaseDate":
                    { $gte: startTime, $lte: endTime }
                })
                .populate('products')
                .populate({
                    path: 'products',
                    populate: {
                        path: 'category'
                    }
                });

            console.log('Order By Date: ',orderByDate)
            return orderByDate;
        }
    },
    Mutation: {
        //works
        addUser: async (parent, { firstName, lastName, email, password }) => {
            const addUser = await User.create({ firstName, lastName, email, password });
            const token = signToken(addUser);
            return { token, user: addUser };
        },
        //works
        login: async (parent, { email, password }) => {
            console.log("Logging in...");
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError("Incorrect credentials");
            }

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError("Incorrect credentials");
            }

            const token = signToken(user);
            return { token, user };
        },
        addOrder: async (parent, { products }, context) => {
            try {
                if (!context.user) {
                    throw new AuthenticationError('Must be logged in.');
                }

                console.log('Context User:', context.user);

                // Create the order
                const newOrder = await Order.create({
                    owner: context.user._id,
                    products: products,
                    purchaseDate: new Date()
                });

                console.log('New Order:', newOrder);

                // Update the user's orders array
                await User.findByIdAndUpdate(context.user._id, {
                    $push: { orders: newOrder._id },
                });

                console.log('User updated!');

                // Fetch the created order using its ID and populate the 'products' field
                const addedOrder = await Order.findById(newOrder._id)
                    .populate('products')
                    .populate({ path: 'products', populate: { path: 'category' } })
                    .exec();

                console.log('Order added successfully!:', addedOrder);

                // Format the purchaseDate to a human-readable string in UTC-4 timezone
                const formattedPurchaseDate = new Date(addedOrder.purchaseDate).toLocaleString('en-US', {
                    timeZone: 'America/New_York',
                });

                // Return data with populated products and formatted purchaseDate
                return { ...addedOrder._doc, purchaseDate: formattedPurchaseDate };
            } catch (err) {
                console.log(err);
                throw new AuthenticationError('Failed to create order.');
            }
        },
        //works
        addProduct: async (parent, { productInput }, context) => {
            console.log(context.user);
            try {
                if (context.user) {
                    const newProduct = await Product.create({
                        ...productInput,
                        owner: context.user._id,
                    });

                    const addedProduct = await newProduct.populate("category");

                    return addedProduct;
                }
            } catch (err) {
                console.log(err);
                throw new AuthenticationError("Failed to create product. resolvers.js.addProduct.line105");
            }
        },
        //works
        removeProduct: async (parent, { _id, name }, context) => {
            console.log(context.user);
            try {
                if (context.user) {
                    //fetch product to be deleted
                    const productToDelete = await Product.findOne({
                        _id: _id,
                        name: name,
                        owner: context.user._id
                    }).populate("category");

                    if (!productToDelete) {
                        throw new AuthenticationError("No product found.")
                    }
                    // delete the product
                    await productToDelete.remove();
                    //return the populate product that was deleted
                    return productToDelete;
                }
            } catch (err) {
                console.log(err);
                throw new AuthenticationError("Failed to remove product. resolvers.js file line 119")
            }
            // try{ 
            //     if (context.user) {
            //         const removedProduct = await Product.findOneAndDelete({
            //             _id: _id,
            //             name: name,
            //             owner: context.user._id,
            //         }).populate('category');

            //         return removedProduct;
            //     }
            // } catch(err) {
            //     console.log(err);
            //     throw new AuthenticationError("Failed to remove Product. resolvers.js.removeproduct.line128")
            // }
        },
        //works
        addCategory: async (parent, { categoryInput }, context) => {
            console.log(context.user)
            try {
                if (context.user) {
                    const addedCategory = await Category.create({
                        ...categoryInput,
                        owner: context.user._id
                    });

                    return addedCategory;
                }
            } catch (err) {
                console.log(err);
                throw new AuthenticationError("Failed to create new category. resolvers.js.addCategory")
            }
        },
        //works
        removeCategory: async (parent, { name }, context) => {
            console.log(context.user);
            try {
                if (context.user) {
                    const removedCategory = await Category.findOneAndDelete({
                        name: name,
                        owner: context.user._id
                    });

                    return removedCategory;
                }
            } catch (err) {
                console.log(err);
                throw new AuthenticationError("failed to remove category. resolvers.js.removeCategory")
            }
        }
    }
};

module.exports = resolvers;