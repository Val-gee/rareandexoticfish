const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
require('dotenv').config();

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
});

var cors = require('cors');

const stripe = require('stripe')('enter your stripe key here');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

// this handler code isnt neccessary when using frameworks/libs like React and Angular because they handle the routing for you!!
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/public/index.html'));
// });

app.post("/checkout", async (req, res) => {
    
    console.log(req.body);
    const items = req.body.items;

    let lineItems = [];
    items.forEach((item) => {
        lineItems.push({
            price: item.id,
            quantity: item.quantity,
        });
    });

    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
    });

    res.send(
        JSON.stringify({
            url: session.url,
        })
    );
});

const startApolloServer = async (typeDefs, resolvers) => {
    await server.start();
    server.applyMiddleware({ app });

    db.once('open', () => {
        app.listen(PORT, () => {
            console.log(`API server running on port ${PORT}!`);
            console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
        })
    })
};

startApolloServer(typeDefs, resolvers);