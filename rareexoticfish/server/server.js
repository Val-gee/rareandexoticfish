// import packages needed
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
require('dotenv').config();
const cors = require('cors');

// import files needed
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');

// set up port and middleware
const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// stripe setup

app.post('/checkout', async (req, res) => {
    console.log("server.js file/app.post/checkout", req.body.items);
    const items = req.body.items;

    let lineItems = [];

    items.forEach((item) => {
        lineItems.push({
            price: item.id,
            quantity: item.quantity,
        });
    });

    //add stripe session checkout
    // response.send code block
})
// set up routes
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// set up apollo server
const startApolloServer = async (typeDefs, resolvers) => {
    await server.start();
    server.applyMiddleware({ app });

    db.once('open', () => {
        app.listen(PORT, () => {
            console.log(`API server running on port ${PORT}!`);
            console.log(`Use graphQL at http://localhost:${PORT}${server.graphqlPath}`);
        })
    })
};

startApolloServer(typeDefs, resolvers);
