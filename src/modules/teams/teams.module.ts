import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { TeamsService } from './teams.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team])
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
