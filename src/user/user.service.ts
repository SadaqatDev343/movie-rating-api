import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './user.schema';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './user.dto';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private cloudinaryService: CloudinaryService
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return newUser.save();
  }

  async login(loginDto: LoginUserDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user._id, email: user.email });

    return { message: 'Login successful', token };
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.image && user.image) {
      try {
        await this.cloudinaryService.deleteImage(user.image);
      } catch (error) {
        console.error('Failed to delete old image:', error);
      }
    }

    Object.assign(user, updateUserDto);
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    return { message: 'Profile updated successfully', user: userResponse };
  }
}
