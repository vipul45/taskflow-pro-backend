// src/modules/teams/controllers/teams.controller.ts
// ... other imports
import { UseGuards, Controller, Post, Body, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { GetUser } from 'src/Common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './entities/team.entity'; // Import Team entity for response type
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger'; // Import ApiBody, ApiParam
import { TeamsService } from './teams.service';

@ApiTags('Teams')
@ApiBearerAuth() // Indicate JWT needed for all endpoints in this controller
@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new team for the current user' }) // Enhanced summary
  @ApiResponse({ status: 201, description: 'The team has been successfully created.', type: Team }) // Specify type
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Bad Request (validation failed).' })
  @ApiBody({ type: CreateTeamDto }) // Explicitly define body type
  create(
    @Body() createTeamDto: CreateTeamDto,
    @GetUser() user: User,
  ): Promise<Team> {
    return this.teamsService.create(createTeamDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all teams owned by or member of (future) the current user' }) // Enhanced summary
  @ApiResponse({ status: 200, description: 'List of teams.', type: [Team] }) // Specify array type
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(@GetUser() user: User): Promise<Team[]> {
    return this.teamsService.findAllForUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific team by ID (if user has access)' }) // Enhanced summary
  @ApiParam({ name: 'id', description: 'UUID of the team to retrieve', type: String }) // Describe path param
  @ApiResponse({ status: 200, description: 'Team details.', type: Team }) // Specify type
  @ApiResponse({ status: 404, description: 'Team not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden (user does not have access).' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Bad Request (invalid UUID format).' }) // Added for ParseUUIDPipe
  findOne(
      @Param('id', ParseUUIDPipe) id: string,
      @GetUser() user: User
  ): Promise<Team> {
      return this.teamsService.findOneById(id, user.id);
  }
}