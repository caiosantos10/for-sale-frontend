export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginUser {
  name: string;
  lastName: string;
  email: string;
  role: string;
  [key: string]: any;
}

export interface LoginResponse {
  user: LoginUser;
  token: string;
}
