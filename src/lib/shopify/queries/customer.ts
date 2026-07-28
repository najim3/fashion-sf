export const CUSTOMER_DETAILS_QUERY = `
  query getCustomerDetails {
    customer {
      id
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      phoneNumber {
        phoneNumber
      }
      metafield(namespace: "custom", key: "wishlist") {
        value
      }
    }
  }
`;

export const CUSTOMER_ORDERS_QUERY = `
  query getCustomerOrders($first: Int!, $after: String) {
    customer {
      orders(first: $first, after: $after, sortKey: CREATED_AT, reverse: true) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            name
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const CUSTOMER_ORDER_QUERY = `
  query getCustomerOrder($id: ID!) {
    order(id: $id) {
      id
      name
      processedAt
      financialStatus
      fulfillmentStatus
      totalPrice {
        amount
        currencyCode
      }
      subtotalPrice {
        amount
        currencyCode
      }
      totalTax {
        amount
        currencyCode
      }
      totalShippingPrice {
        amount
        currencyCode
      }
      shippingAddress {
        firstName
        lastName
        address1
        address2
        city
        province
        country
        zip
      }
      lineItems(first: 250) {
        edges {
          node {
            id
            title
            quantity
            variantTitle
            price {
              amount
              currencyCode
            }
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;

export const CUSTOMER_ADDRESSES_QUERY = `
  query getCustomerAddresses($first: Int!) {
    customer {
      defaultAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        province
        country
        zip
        phoneNumber
      }
      addresses(first: $first) {
        edges {
          node {
            id
            firstName
            lastName
            company
            address1
            address2
            city
            province
            country
            zip
            phoneNumber
          }
        }
      }
    }
  }
`;
