import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Session } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import LoginDto from './dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('init-data')
  initData() {
    console.log('Initializing data...');
    return this.userService.initData();
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Session() session: Record<string, any>) {
    console.log('Login attempt:', loginDto);
    const user = await this.userService.login(loginDto);
    session.user = {
      username: user.username,
    };

    return 'Login successful';
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
