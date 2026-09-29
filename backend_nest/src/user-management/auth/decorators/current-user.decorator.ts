import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AppUser } from '../../users/user.entity';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AppUser | undefined => {
    const request = context.switchToHttp().getRequest<{ user?: AppUser }>();
    return request.user;
  },
);
