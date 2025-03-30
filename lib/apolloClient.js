import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://eternal-shad-26.hasura.app/v1/graphql", // Replace with your Hasura URL
  headers: {
    "x-hasura-admin-secret": "kbVqFqWZDmZ718hZIJZVPBNQdKlRlCQezVC4dFrwYJzjvC4hC8zLDI9KxhKG7rA6", // Replace with your Hasura Admin Key
  },
  cache: new InMemoryCache(),
});

export default client;
