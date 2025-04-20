import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../services/auth.service";
import { Strategy } from "passport-local";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "src/modules/users/entities/user.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject(AuthService) private authService: AuthService,) {
        super({ usernameField: 'email' });
        console.log('LocalStrategy instantiated. AuthService:', this.authService ? 'Defined' : '!!! UNDEFINED !!!');
    }

    async validate(email: string, password: string): Promise<Omit<User, 'password'> | null> {
        console.log('--- LocalStrategy validate method ENTERED ---')
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return user;
    }
}
