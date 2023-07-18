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

type Query {
user(_id:ID!): User
users: [User]
}
`