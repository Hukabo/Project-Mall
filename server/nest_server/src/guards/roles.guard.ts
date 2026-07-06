import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from 'src/decorators/roles.decorator';
import { matchRoles } from 'src/enums/role.enum';
import { User } from 'src/domains/user/entity/user.entity';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user: User | any = request.user;

    console.log('guard: ');
    console.log(context.getHandler());
    console.log('user = ', user);

    return matchRoles(roles, user!.roles);
  }
}
