import { gql } from "@apollo/client";

export const MUTATION_ADDUSER = gql`
mutation AddUser($firstName: String!, $lastName: String!, $email: String!, $password: String!, $adminAccess: Boolean!) {
  addUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password, adminAccess: $adminAccess) {
    token
    user {
      _id
      firstName
      lastName
      email
      password
      adminAccess
      orders {
        _id
        purchaseDate
        products {
          _id
          name
          description
          price
          quantity
          category {
            _id
            name
          }
          image
        }
      }
    }
  }
}
`

export const MUTATION_LOGIN = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      firstName
      lastName
      email
      password
      adminAccess
      orders {
        _id
        purchaseDate
        products {
          _id
          name
          description
          price
          quantity
          category {
            _id
          }
          image
        }
      }
    }
  }
}`

export const MUTATION_ADDORDER = gql`
mutation AddOrder($products: [ID]!, $address: String!) {
  addOrder(products: $products, address: $address) {
    _id
    purchaseDate
    products {
      _id
      name
      description
      price
      quantity
      category {
        _id
        name
      }
      image
    }
    address
  }
}
}
`

export const MUTATION_ADDPRODUCT = gql`
mutation AddProduct($productInput: productInput!) {
  addProduct(productInput: $productInput) {
    _id
    name
    description
    price
    quantity
    category {
      _id
      name
    }
    image
  }
}
`

export const MUTATION_REMOVEPRODUCT = gql`
mutation RemoveProduct($id: ID!, $name: String!) {
  removeProduct(_id: $id, name: $name) {
    _id
    name
    description
    price
    quantity
    category {
      _id
      name
    }
    image
  }
}
`

export const MUTATION_ADDCATEGORY = gql`
mutation AddCategory($categoryInput: categoryInput!) {
  addCategory(categoryInput: $categoryInput) {
    _id
    name
  }
}
`

export const MUTATION_REMOVECATEGORY = gql`
mutation RemoveCategory($name: String!) {
  removeCategory(name: $name) {
    _id
    name
  }
}
`