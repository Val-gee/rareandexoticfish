import { gql } from "@apollol/client";


export const QUERY_AllUSERS = gql `
query AllUsers {
  allUsers {
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
`

export const QUERY_USERBYID =gql `
query UserById($id: ID!) {
  userById(_id: $id) {
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
`

export const QUERY_USEERBYEMAIL = gql `
query UserByEmail($email: String!) {
  userByEmail(email: $email) {
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
`

export const QUERY_ALLCATEGORIES = gql `
query AllCategories {
  allCategories {
    _id
    name
  }
}
`

export const QUERY_CATEGORYBYNAME = gql `
query CategoryByName($name: String!) {
  categoryByName(name: $name) {
    _id
    name
  }
}
`

export const QUERY_ALLPRODUCTS = gql`
query AllProducts {
  allProducts {
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

export const QUERY_PRODUCTBYNAME = gql`
query ProductByName($name: String!) {
  productByName(name: $name) {
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

export const QUERY_ALLORDERS =gql `
query AllOrders {
  allOrders {
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
`

export const QUERY_ORDERBYID = gql `
query OrderById($id: ID!) {
  orderById(_id: $id) {
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
`

export const QUERY_ORDERBYDATE = gql `
query OrderByDate($purchaseDate: String!) {
  orderByDate(purchaseDate: $purchaseDate) {
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
`