import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, IsOptional, MaxLength, IsNotEmpty, Matches } from "class-validator";

export class RegisterUserDto {
    @ApiProperty({ // Add this decorator
        description: 'User email address (must be unique)',
        example: 'test.user@example.com',
        required: true,
    })
    @IsEmail({}, { message: "Please provide a Valid Email Address" })
    @IsNotEmpty({ message: "Email is required" })
    email: string;

    @ApiProperty({
        description: 'User password (at least 8 characters)',
        example: 'Str0ngP@sswOrd!',
        minLength: 8,
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    })
    password: string;

    @ApiProperty({
        description: 'User first name',
        example: 'John',
        required: false, // Mark as optional
        maxLength: 50,
    })
    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(32)
    firstName?: string;

    @ApiProperty({
        description: 'User last name',
        example: 'Doe',
        required: false,
        maxLength: 50,
      })
    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(32)
    lastName?: string;
}

export type CreateUserDto = RegisterUserDto;