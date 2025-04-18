import { Strategy } from "passport-jwt";

import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { UsersService } from "src/modules/users/users.service";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

export interface JwtPayload {
    email: string;
    sub: string;
}

@Injectable()   
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UsersService,
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback-secret-key',  
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.userService.findOneById(payload.sub);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const { password, ...result } = user;
        return result;
    }
}
