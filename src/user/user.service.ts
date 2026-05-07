import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { User } from './entities/user.entity';
import LoginDto from './dto/login.dto';

@Injectable()
export class UserService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager;

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  // 初始化权限数据和用户数据
  async initData() {
    const permission1 = new Permission();
    permission1.name = 'create_aaa';
    permission1.desc = '新增aaa权限';

    const permission2 = new Permission();
    permission2.name = 'update_aaa';
    permission2.desc = '更新aaa权限';

    const permission3 = new Permission();
    permission3.name = 'remove_aaa';
    permission3.desc = '删除aaa权限';

    const permission4 = new Permission();
    permission4.name = 'query_aaa';
    permission4.desc = '查询aaa权限';

    const permission5 = new Permission();
    permission5.name = 'create_bbb';
    permission5.desc = '新增bbb权限';

    const permission6 = new Permission();
    permission6.name = 'update_bbb';
    permission6.desc = '更新bbb权限';

    const permission7 = new Permission();
    permission7.name = 'remove_bbb';
    permission7.desc = '删除bbb权限';

    const permission8 = new Permission();
    permission8.name = 'query_bbb';
    permission8.desc = '查询bbb权限';
    await this.entityManager.save(Permission, [permission1, permission2, permission3, permission4, permission5, permission6, permission7, permission8]);

    const user = new User();
    user.username = 'admin123';
    user.password = 'admin123';
    user.permissions = [permission1, permission2, permission3, permission4, permission5, permission6, permission7, permission8];

    const userA = new User();
    userA.username = 'user_aaa';
    userA.password = 'user_aaa';
    userA.permissions = [permission1, permission2, permission3, permission4];

    const userB = new User();
    userB.username = 'user_bbb';
    userB.password = 'user_bbb';
    userB.permissions = [permission5, permission6, permission7, permission8];

    await this.entityManager.save(User, [user, userA, userB]);

    const users = await this.entityManager.find(User, {
      relations: ['permissions'],
    });
    return users;
  }

  async login(loginDto: LoginDto) {
    const { username } = loginDto;
    const user = await this.entityManager.findOneBy(User, { username });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.ACCEPTED);
    }

    if (user.password !== loginDto.password) {
      throw new HttpException('密码错误', HttpStatus.ACCEPTED);
    }

    return user;
  }
}
