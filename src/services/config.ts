const DEFAULT_GRAPHQL_URL =
  'https://hoteljj-graphql-api-amd5hxafbzd9exc2.brazilsouth-01.azurewebsites.net/graphql/';

export const config = {
  graphqlUrl: process.env.EXPO_PUBLIC_GRAPHQL_URL ?? DEFAULT_GRAPHQL_URL,
  correlationHeader: 'X-Correlation-Id',
  authTokenKey: 'hoteljj_auth_token',
  authRefreshKey: 'hoteljj_auth_refresh',
  authUserKey: 'hoteljj_auth_user',
  checkoutDraftKey: 'hoteljj_checkout_draft',
  searchDraftKey: 'hoteljj_search_draft',
  reservationChannel: 'MOBILE',
} as const;
