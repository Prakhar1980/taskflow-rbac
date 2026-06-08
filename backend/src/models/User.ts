import bcrypt from 'bcrypt';
import { Schema, model, HydratedDocument, Model } from 'mongoose';
import { env } from '../config/env';

export type Role = 'user' | 'admin';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: Role;
  refreshToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

type UserMethods = {
  comparePassword(candidatePassword: string): Promise<boolean>;
};

type UserModel = Model<IUser, {}, UserMethods>;

export type UserDocument = HydratedDocument<IUser, UserMethods>;

const userSchema = new Schema<IUser, UserModel, UserMethods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    refreshToken: {
      type: String,
      default: null,
      select: false
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, env.bcryptSaltRounds);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser, UserModel>('User', userSchema);
