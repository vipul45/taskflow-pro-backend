import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from '../dto/register-user.dto';
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    /**
     * Validate a user's credentials
     * @param email - The user's email address
     * @param password - The user's password
     * @returns A user object if the credentials are valid, otherwise null
     */

    async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
        console.log('--- AuthService validateUser method ENTERED ---')
        const user = await this.userService.findOneByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    /**
     * Login a user and return an access token
     * @param user - The user object
     * @returns An object containing the user data and an access token
     */

    async login(user: Omit<User, 'password'>) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user
        };
    }

    /**
     * Register a new user
     * @param createUserDto - The user data
     * @returns A user object
     */

    async register(registorUserDto: RegisterUserDto) {

        const existingUser = await this.userService.findOneByEmail(registorUserDto.email);
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }
        const saltRound = 10
        const hashedPassword = await bcrypt.hash(registorUserDto.password, saltRound);
        const user = await this.userService.createUser(registorUserDto, hashedPassword);
        const { password, ...result } = user;
        return result;
    }
    


}
