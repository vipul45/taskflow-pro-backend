import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../auth/dto/register-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } })
    }

    async findOneById(id: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } })
    }

    async createUser(createUserDto: CreateUserDto, hashedPassword?: string ): Promise<User> {
        const { email, firstName, lastName, password } = createUserDto;

        const existingUser = await this.findOneByEmail(email);
        if (existingUser) {
            throw new ConflictException("User with this email already exists")
        }

        const user = await this.userRepository.create({
            email,
            firstName,
            lastName,
            password: hashedPassword || password
        });

        await this.userRepository.save(user);
        return user;
    }

}
