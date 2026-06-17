import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  CombinedGraphQLErrors,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import { config } from './config';
import { authStorage } from '../features/auth/services/authStorage';
import { createCorrelationId } from '../shared/utils/graphqlError';

const httpLink = new HttpLink({
  uri: config.graphqlUrl,
});

const authLink = setContext(async (_, { headers, skipAuth }) => {
  const token = await authStorage.getToken();
  return {
    headers: {
      ...headers,
      ...(!skipAuth && token ? { Authorization: `Bearer ${token}` } : {}),
      [config.correlationHeader]: createCorrelationId(),
    },
  };
});

const errorLink = new ErrorLink(({ error }) => {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, extensions }) => {
      console.warn('[GraphQL error]', extensions?.code ?? 'UNKNOWN', message);
    });
    return;
  }
  console.warn('[Network error]', error);
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network' },
    query: { fetchPolicy: 'network-only' },
  },
});
