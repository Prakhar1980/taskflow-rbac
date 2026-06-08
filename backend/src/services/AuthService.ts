import { StatusCodes } from 'http-status-codes';
import { Role } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { AppError } from '../utils/AppError';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role?: Role;
};

type LoginInput = {
  email: string;
  password: string;
};

export class AuthService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async register(input: RegisterInput) {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new AppError('An account with this email already exists', StatusCodes.CONFLICT);
    }

    const user = await this.userRepository.create({
      name: input.name,
      email: input.email,
      password: input.password,
      role: input.role ?? 'user'
    });

    return this.issueTokens(user.id, user.email, user.role);
  }

  async login(input: LoginInput) {
    const user = await this.userRepository.findByEmail(input.email, true);
    if (!user || !(await user.comparePassword(input.password))) {
      throw new AppError('Email or password is incorrect', StatusCodes.UNAUTHORIZED);
    }

    return this.issueTokens(user.id, user.email, user.role);
  }

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    const user = await this.userRepository.findById(payload.id, true);

    if (!user || user.refreshToken !== refreshToken) {
      throw new AppError('Refresh session is no longer valid', StatusCodes.UNAUTHORIZED);
    }

    return this.issueTokens(user.id, user.email, user.role);
  }

  async logout(userId: string) {
    await this.userRepository.updateRefreshToken(userId, null);
  }

  private async issueTokens(id: string, email: string, role: Role) {
    const payload = { id, email, role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    await this.userRepository.updateRefreshToken(id, refreshToken);

    return {
      user: { id, email, role },
      accessToken,
      refreshToken
    };
  }
}
