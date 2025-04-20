import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('teams')
export class Team {
    @ApiProperty({ description: 'Unique identifier for the team (UUID)' }) 
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'Marketing Team' })
    @Column({ type: 'varchar', length: 255, unique: true })
    name: string;

    @ApiProperty({ example: 'Team responsible for marketing campaigns', required: false, nullable: true })
    @Column({ type: 'varchar', length: 255 })
    description: string;

    @ManyToMany(() => User, {nullable: false, eager: false})
    @JoinColumn({name: 'ownerId'})
    owner: User;

    @ApiProperty({ description: "ID of the user who owns the team", example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
    @Column()
    ownerId: string;

    @ApiProperty({ description: 'Timestamp when the team was created' }) // Add decorator
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Timestamp when the team was updated' }) // Add decorator
    @CreateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}