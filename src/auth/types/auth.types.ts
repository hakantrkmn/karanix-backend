import { Request } from 'express';

export interface AuthenticatedUser {
  _id: string;
  username: string;
  role: 'admin' | 'guide' | 'driver';
}

export interface JwtPayload {
  username: string;
  sub: string;
  role: 'admin' | 'guide' | 'driver';
}

export interface LoginResponse {
  access_token: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
