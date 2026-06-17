export type ParsedGraphQLError = {
  message: string;
  code?: string;
  httpStatus?: number;
};

type ApolloLikeError = Error & {
  graphQLErrors?: Array<{
    message: string;
    extensions?: Record<string, unknown>;
  }>;
  networkError?: Error | null;
};

const DEFAULT_MESSAGE = 'No pudimos completar la accion. Intentalo nuevamente.';
const NETWORK_MESSAGE = 'No pudimos conectar con el servicio. Revisa tu conexion e intentalo otra vez.';
const TECHNICAL_MESSAGE_PATTERN =
  /(token|graphql|bearer|authorization|refresh|\.env|localhost|https?:\/\/)/i;

function toUserMessage(message?: string, fallback = DEFAULT_MESSAGE): string {
  if (!message || TECHNICAL_MESSAGE_PATTERN.test(message)) {
    return fallback;
  }
  return message;
}

export function parseGraphQLError(error: unknown): ParsedGraphQLError {
  if (error && typeof error === 'object' && 'graphQLErrors' in error) {
    const apolloError = error as ApolloLikeError;
    const gqlError = apolloError.graphQLErrors?.[0];
    if (gqlError) {
      return {
        message: toUserMessage(gqlError.message),
        code: gqlError.extensions?.code as string | undefined,
        httpStatus: gqlError.extensions?.httpStatus as number | undefined,
      };
    }
    if (apolloError.networkError) {
      return {
        message: NETWORK_MESSAGE,
        code: 'NETWORK_ERROR',
      };
    }
    return { message: toUserMessage(apolloError.message) };
  }

  if (error instanceof Error) {
    return { message: toUserMessage(error.message) };
  }

  return { message: DEFAULT_MESSAGE };
}

export function createCorrelationId(): string {
  return `mobile-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
