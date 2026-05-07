import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from './user/user.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {

  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(Reflector)
  private readonly reflector: Reflector;

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    // console.log(this.userService);
    const request = context.switchToHttp().getRequest();
    const user = request.session.user;
    if (!user) {
      throw new UnauthorizedException('用户未登录');
    }
    const userRecord = await this.userService.findByUsername(user.username);
    if (!userRecord) {
      throw new UnauthorizedException('用户不存在');
    }
    // console.log('userRecord', userRecord);
    const permissions = userRecord.permissions.map(p => p.name);
    console.log('permissions', permissions);
    const requiredPermission = this.reflector.get<string>('permission', context.getHandler());
    if (!requiredPermission) {
      return true;
    }
    if (!permissions.includes(requiredPermission)) {
      throw new UnauthorizedException('没有访问权限');
    }
    return true;
  }
}
