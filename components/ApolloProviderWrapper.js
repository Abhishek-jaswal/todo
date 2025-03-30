"use client"; // Ensures ApolloProvider runs on client

import { ApolloProvider } from "@apollo/client";
import client from "../lib/apolloClient";

export default function ApolloProviderWrapper({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
