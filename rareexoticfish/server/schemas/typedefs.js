const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
_id: ID
firstName: String!
lastName: String!
email: String!
password: String!
adminAccess: Boolean!
orders: [Order]
}

type Category {
_id: ID,
name: String!
}

type Product {
_id: ID,
name: String!,
description: String!,
price: Float!,
quantity: Int!,
category: [Category],
image: String!
}

type Order {
_id: ID,
purchaseDate: String,
products: [Product]
}

type Auth {
token: ID!,
user: User,
}

type Query {
allUsers: [User]
user(_id:ID!): User
user(email: String!): User
allCategories: [Category]
categoryByName(name: String!): Category
allProducts: [Product]
productByName(name: String!): Product
allOrders: [Order]
orderById(_id: ID!): Order
orderByDate(purchaseDate: String!): Order
}

type Mutation {
addUser(
    firstName: String!,
    lastName: String!,
    email: String!,
    password: String!,
    adminAccess: Boolean!
): Auth
login(email: String!, password: String!): Auth
addOrder(products: [ID]!): Order
}
`

module.exports = typeDefs;