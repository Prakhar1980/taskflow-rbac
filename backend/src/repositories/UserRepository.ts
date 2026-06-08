import { FilterQuery } from 'mongoose';
import { IUser, User, UserDocument } from '../models/User';

export class UserRepository {
  create(data: Pick<IUser, 'name' | 'email' | 'password' | 'role'>): Promise<UserDocument> {
    return User.create(data);
  }

  findByEmail(email: string, includeSecrets = false): Promise<UserDocument | null> {
    const query = User.findOne({ email });
    if (includeSecrets) query.select('+password +refreshToken');
    return query.exec();
  }

  findById(id: string, includeSecrets = false): Promise<UserDocument | null> {
    const query = User.findById(id);
    if (includeSecrets) query.select('+password +refreshToken');
    return query.exec();
  }

  find(filter: FilterQuery<IUser>): Promise<UserDocument[]> {
    return User.find(filter).sort({ createdAt: -1 }).exec();
  }

  updateRefreshToken(id: string, refreshToken: string | null): Promise<UserDocument | null> {
    return User.findByIdAndUpdate(id, { refreshToken }, { new: true }).select('+refreshToken').exec();
  }
}
