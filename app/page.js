"use client"; // Ensures ApolloProvider runs on client

import client from "../lib/apolloClient.js";
import { ApolloProvider } from "@apollo/client";
import TodoList from "../components/TodoList";

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        <TodoList />
      </div>
    </ApolloProvider>
  );
}
