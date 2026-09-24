import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '../../users/user.schema';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): UserDocument | undefined => {
    const request = context.switchToHttp().getRequest<{ user?: UserDocument }>();
    return request.user;
  },
);
