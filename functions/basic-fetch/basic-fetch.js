const { ApolloServer, gql } = require("apollo-server-lambda")
const axios = require("axios").default

const typeDefs = gql`
  type Query {
    hello(name: String): String!
    getPerson(id: Int!): Person
  }

  type Person {
    name: String
    hair_color: String
    skin_color: String
    eye_color: String
    birth_year: Int
    gender: String
  }
`

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || "World"} ${_}`,
    getPerson: async (_, { id }) => {
      const response = await axios
        .get(`https://graphql-apollo-server.firebaseio.com/people/${id}.json`, {
          headers: {
            "Access-Control-Allow-Headers": "Accept",
          },
        })
        .then(res => {
          return res.data
        })
        .catch(err => console.log(err))
      return response
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

exports.handler = server.createHandler()
