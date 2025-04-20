import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
    @ApiProperty({ // Add decorator
        description: 'Unique identifier for the user (UUID)',
        example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'test.user@example.com' })
    @Column({ unique: true , length: 60})
    email: string;

    @Column({ length: 60 })
    @Exclude()
    password: string;

    @ApiProperty({ example: 'John', required: false, nullable: true })
    @Column({nullable: true, length: 60})
    firstName: string;

    @ApiProperty({ example: 'Doe', required: false, nullable: true })
    @Column({nullable: true, length: 60})
    lastName: string;

    @ApiProperty({ description: 'Timestamp when the user was created' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: 'Timestamp when the user was last updated' })
    @CreateDateColumn()
    updatedAt: Date;
}