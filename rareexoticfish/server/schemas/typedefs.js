const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
_id: ID
firstName: String!
lastName: String!
email: String!
password: String!
adminAccess: Boolean!
}
type Auth {
token: ID!,
user: User,
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

type Query {
user(_id:ID!): User
users: [User]
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