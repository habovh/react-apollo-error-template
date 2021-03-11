import { graphql, print } from "graphql";
import { ApolloLink, Observable } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { schema } from "./schema";

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

const errorLink = onError(({ response }) => {
  response.errors = null
})

const defaultLink = new ApolloLink(operation => {
  return new Observable(observer => {
    const { query, operationName, variables } = operation;
    delay(2000)
      .then(() =>
        graphql(schema, print(query), null, null, variables, operationName)
      )
      .then(result => {
        observer.next(result);
        observer.complete();
      })
      .catch(observer.error.bind(observer));
  });
});

export const link = errorLink.concat(defaultLink)
