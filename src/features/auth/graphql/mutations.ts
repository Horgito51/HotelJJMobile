import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      success
      message
      token
      refreshToken
      user {
        usuarioId
        usuarioGuid
        username
        email
        roles
      }
      errors {
        code
        message
        httpStatus
        service
      }
    }
  }
`;

export const REGISTER_CLIENT_MUTATION = gql`
  mutation RegisterClient($input: RegisterClientInput!) {
    registerClient(input: $input) {
      success
      message
      token
      refreshToken
      user {
        usuarioId
        usuarioGuid
        username
        email
        roles
      }
      errors {
        code
        message
        httpStatus
        service
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout($input: LogoutInput!) {
    logout(input: $input) {
      success
      message
      errors {
        code
        message
      }
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      success
      message
      token
      refreshToken
      user {
        usuarioId
        usuarioGuid
        username
        email
        roles
      }
      errors {
        code
        message
      }
    }
  }
`;
