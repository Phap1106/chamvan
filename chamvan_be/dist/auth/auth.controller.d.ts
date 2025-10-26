import type { Response } from 'express';
import { AuthService } from './auth.service';
declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    login(dto: LoginDto, res: Response): Promise<{
        access_token: string;
        user: import("../users/user.entity").User;
    }>;
}
export {};
