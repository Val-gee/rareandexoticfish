const { AuthenticationError } = require('apollo-server-express');
const { User, Product, Order, Category } = require('../models');

const { signToken } = require('../utils/auth.js');

const resolvers = {
    Query: {
        user: async (parent, { _id }) => {
            const user = await User.findbyId(_id);
            return User;
        }
    }
};

module.exports = resolvers;