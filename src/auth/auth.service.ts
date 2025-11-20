import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import {
  AuthenticatedUser,
  JwtPayload,
  LoginResponse,
} from './types/auth.types';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<AuthenticatedUser | null> {
    const user = await this.userModel.findOne({ username });
    if (user && user.password === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user.toObject();
      return {
        _id: String(result._id),
        username: result.username,
        role: result.role,
      } as AuthenticatedUser;
    }
    return null;
  }

  login(user: AuthenticatedUser): LoginResponse {
    const payload: JwtPayload = {
      username: user.username,
      sub: user._id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: RegisterDto) {
    const newUser = new this.userModel(user);
    return newUser.save();
  }
}
