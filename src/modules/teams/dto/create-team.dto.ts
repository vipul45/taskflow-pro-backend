// src/modules/teams/dto/create-team.dto.ts
import { IsString, MaxLength, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({
    description: 'Name of the team (must be unique within user scope eventually)', // Added detail
    example: 'Marketing Team',
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Optional description for the team', // Added detail
    example: 'Team responsible for marketing campaigns',
    required: false, // Explicitly state optionality
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;
}