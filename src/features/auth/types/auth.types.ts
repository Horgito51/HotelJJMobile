export type AuthUser = {
  usuarioId: number;
  usuarioGuid: string;
  username: string;
  email: string;
  roles: string[];
};

export type AuthPayloadResult = {
  success: boolean;
  message?: string | null;
  token?: string | null;
  refreshToken?: string | null;
  user?: AuthUser | null;
  errors?: Array<{ code?: string; message?: string }>;
};

export type LoginFormValues = {
  username: string;
  password: string;
};

export type RegisterFormValues = {
  nombres: string;
  apellidos: string;
  correo: string;
  username: string;
  password: string;
  confirmPassword: string;
};
