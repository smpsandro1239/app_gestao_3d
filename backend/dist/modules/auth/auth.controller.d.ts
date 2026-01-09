import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any, res: any): Promise<any>;
    getProfile(req: any): any;
}
