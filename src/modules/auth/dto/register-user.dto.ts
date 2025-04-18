import { IsEmail, IsString, MinLength, IsOptional, MaxLength, IsNotEmpty, Matches } from "class-validator";

export class RegisterUserDto {
    @IsEmail({}, { message: "Please provide a Valid Email Address" })
    @IsNotEmpty({ message: "Email is required" })
    email: string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    })
    password: string;

    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(32)
    firstName?: string;

    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(32)
    lastName?: string;
}

export type CreateUserDto = RegisterUserDto;