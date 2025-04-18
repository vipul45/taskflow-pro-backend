import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../services/auth.service";
import { Strategy } from "passport-local";
import { UnauthorizedException } from "@nestjs/common";
import { User } from "src/modules/users/entities/user.entity";

export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: 'email' });
    }

    async validate(email: string, password: string): Promise<Omit<User, 'password'> | null> {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return user;
    }
}
