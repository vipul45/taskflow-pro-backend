import { IsEmail, IsString, IsNotEmpty } from "class-validator";

export class LoginDto {
    @IsEmail({}, { message: "Please provide a Valid Email Address" })
    @IsNotEmpty({ message: "Email is required" })
    email: string;
    
    @IsString()
    @IsNotEmpty({ message: "Password is required" })
    password: string;
}
