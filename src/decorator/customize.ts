
import { SetMetadata } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const User = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        return data ? user?.[data] : user;
    },
);
export const RESPONSE_MESSAGE = "respone_message"
export const ResponseMessage = (message: string) => SetMetadata(RESPONSE_MESSAGE, message)

export const IS_PUBLIC_PERMISSION = "isPublicPermission";
export const skipcheckPermission = () => SetMetadata(IS_PUBLIC_PERMISSION, true)
