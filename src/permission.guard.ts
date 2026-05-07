import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from './user/user.service';
import { Reflector } from '@nestjs/core';
import { RedisService } from './redis/redis.service';

@Injectable()
export class PermissionGuard implements CanActivate {

  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(Reflector)
  private readonly reflector: Reflector;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    // console.log(this.userService);
    const request = context.switchToHttp().getRequest();
    const user = request.session.user;
    if (!user) {
      throw new UnauthorizedException('用户未登录');
    }

    const requiredPermission = this.reflector.get<string>('permission', context.getHandler());
    if (!requiredPermission) {
      return true;
    }

    let permissions = await this.redisService.listGet(`permissions:${user.username}`);
    if (!permissions || permissions.length === 0) {
      const userRecord = await this.userService.findByUsername(user.username);
      if (!userRecord) {
        throw new UnauthorizedException('用户不存在');
      }
      permissions = userRecord.permissions.map((p) => p.name);
      await this.redisService.listSet(`permissions:${user.username}`, permissions, 3600);
    }

    if (!permissions.includes(requiredPermission)) {
      throw new UnauthorizedException('没有访问权限');
    }
    return true;
  }
}
