import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } })
    }

    async findOneById(id: string): Promise<User | null>{
        return this.userRepository.findOne({ where: { id } })
    }

    
}
