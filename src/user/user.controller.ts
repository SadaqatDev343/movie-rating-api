import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './user.dto';
import { GetUser } from './get-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.userService.signUp(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    return this.userService.login(loginDto);
  }
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@GetUser() user, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(user.id, updateUserDto);
  }
}
