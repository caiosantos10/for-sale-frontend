export interface RegisterRequest {
  id?: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export interface RegisterResponse {
  id: number;
  message?: string;
}
