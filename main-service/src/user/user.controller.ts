import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './user.dto';
import { GetUser } from './get-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

import { User } from './user.schema';
import { MulterFile } from 'src/types/multer.types';
import { JwtStrategy } from './JwtStrategy';
import { Public } from 'src/decorators/public.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly userService: UserService
  ) {}

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({
    status: 400,
    description: 'Bad request, user already exists or invalid data.',
  })
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        address: { type: 'string' },
        dob: { type: 'string', format: 'date' },
        categories: { type: 'array', items: { type: 'string' } },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['email', 'password'],
    },
  })
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file?: MulterFile
  ) {
    let imageUrl = null;

    if (file) {
      try {
        imageUrl = await this.cloudinaryService.uploadImage(file);
      } catch (error) {
        throw new BadRequestException('Invalid file type or upload failed');
      }
    }

    if (imageUrl) {
      createUserDto.image = imageUrl;
    }

    return this.userService.signUp(createUserDto);
  }
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login user and get JWT token' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Login successful' },
        token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, invalid credentials.',
  })
  async login(@Body() loginDto: LoginUserDto) {
    return this.userService.login(loginDto);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth') // This tells Swagger that this endpoint requires JWT Bearer token
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, invalid or missing token',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        address: { type: 'string' },
        dob: { type: 'string', format: 'date' },
        categories: { type: 'array', items: { type: 'string' } },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async updateProfile(
    @GetUser() user, // This decorator extracts user from JWT token
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: MulterFile
  ) {
    if (file) {
      try {
        const newImageUrl = await this.cloudinaryService.uploadImage(file);
        updateUserDto.image = newImageUrl;
      } catch (error) {
        throw new BadRequestException('Invalid file type or upload failed');
      }
    }

    return this.userService.updateProfile(user.id, updateUserDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('whoami')
  async getProfile(@GetUser() user: any) {
    console.log('User in getProfile:', user); // Debugging log

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.userService.getProfile(user._id.toString());
  }
}
