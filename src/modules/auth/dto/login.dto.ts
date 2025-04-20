// src/modules/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Import

export class LoginDto {
  @ApiProperty({ // Add this
    description: 'Registered user email address',
    example: 'test.user@example.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ // Add this
    description: 'User password',
    example: 'Str0ngP@sswOrd!',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}