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

input categoryInput {
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

input productInput {
name: String!,
description: String!,
price: Float!,
quantity: Int!,
category: [ID],
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
userById(_id:ID!): User
userByEmail(email: String!): User
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
addProduct(productInput: productInput!): Product
removeProduct(_id: ID!, name: String!): Product
addCategory(categoryInput: categoryInput!): Category
removeCategory(name: String!): Category
}
`

module.exports = typeDefs;