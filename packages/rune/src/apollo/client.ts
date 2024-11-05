import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  RequestHandler,
} from "@apollo/client/index.js"

import { contextLink } from "./contextLink.js"
import { uploadLink } from "./uploadLink.js"

export const client = new ApolloClient({
  link: contextLink.concat(
    uploadLink as unknown as ApolloLink | RequestHandler
  ),
  cache: new InMemoryCache(),
})
