// src/modules/auth/controllers/auth.controller.ts
import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus, Get } from '@nestjs/common'; // Added Get
import { ApiBearerAuth, ApiBody, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { GetUser } from 'src/Common/decorators/get-user.decorator';
import { Public } from 'src/Common/decorators/Public.decorator';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';


// Define a simple DTO for the login response
class LoginResponseDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    access_token: string;
}

@ApiTags('Authentication') // More descriptive tag
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('register')
    @ApiOperation({ summary: 'Register a new user' }) // Add summary
    @ApiResponse({ status: 201, description: 'User successfully registered.', type: User }) // Specify response type (User without password due to interceptor)
    @ApiResponse({ status: 400, description: 'Bad Request (validation failed).' })
    @ApiResponse({ status: 409, description: 'Conflict (email already exists).' })
    @ApiBody({ type: RegisterUserDto }) // Explicitly define body type for Swagger
    async register(@Body() registerUserDto: RegisterUserDto): Promise<Omit<User, 'password'>> {
        return this.authService.register(registerUserDto);
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Log in a user' }) // Add summary
    @ApiResponse({ status: 200, description: 'User successfully logged in.', type: LoginResponseDto }) // Use LoginResponseDto
    @ApiResponse({ status: 401, description: 'Unauthorized (invalid credentials).' })
    @ApiBody({ type: LoginDto }) // Explicitly define body type
    async login(@Request() req: any, @Body() loginDto: LoginDto): Promise<LoginResponseDto> { // Update return type hint
        console.log('--- AuthController login method ENTERED ---')
        return this.authService.login(req.user);
    }

    // Add a test protected route to verify JWT auth
    @UseGuards(JwtAuthGuard) // Protect this route
    @Get('profile')
    @ApiBearerAuth() // Indicate JWT is required
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'User profile data.', type: User }) // Returns user data (without password)
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    getProfile(@GetUser() user: User) {
        // req.user is populated by JwtAuthGuard/JwtStrategy
        // Thanks to GetUser decorator, we have direct access
        return user;
    }
}