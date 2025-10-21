export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    username: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    username: string;
  } | null;
}

