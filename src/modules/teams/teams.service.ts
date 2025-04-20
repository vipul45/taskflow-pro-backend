// src/modules/teams/teams.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto'
import { User } from '../users/entities/user.entity';

@Injectable()
export class TeamsService {
    constructor(
        @InjectRepository(Team)
        private readonly teamRepository: Repository<Team>,
    ) { }

    async create(createTeamDto: CreateTeamDto, owner: User): Promise<Team> {
        const team = this.teamRepository.create({
            ...createTeamDto,
            owner: owner,
            ownerId: owner.id
        });
        return this.teamRepository.save(team);
    }

    async findAllForUser(userId: string): Promise<Team[]> {
        return this.teamRepository.find({
            where: { ownerId: userId },
        });
    }

    async findOneById(id: string, userId: string): Promise<Team> {
        const team = await this.teamRepository.findOne({
            where: { id },
        });

        if (!team) {
            throw new NotFoundException(`Team with ID ${id} not found`);
        }


        if (team.ownerId !== userId) {
            throw new ForbiddenException('You do not have permission to access this team');
        }
        return team;
    }


}