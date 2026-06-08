import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { Role } from '../models/User';

type TokenPayload = {
  id: string;
  email: string;
  role: Role;
};

export const generateAccessToken = (payload: TokenPayload): string =>
  jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn
  } as SignOptions);

export const generateRefreshToken = (payload: TokenPayload): string =>
  jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn
  } as SignOptions);

export const verifyAccessToken = (token: string): TokenPayload =>
  jwt.verify(token, env.jwtAccessSecret) as TokenPayload;

export const verifyRefreshToken = (token: string): TokenPayload =>
  jwt.verify(token, env.jwtRefreshSecret) as TokenPayload;
