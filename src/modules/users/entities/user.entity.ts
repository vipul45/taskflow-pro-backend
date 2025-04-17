import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true , length: 60})
    email: string;

    @Column({ length: 60 })
    @Exclude()
    password: string;

    @Column({nullable: true, length: 60})
    firstName: string;

    @Column({nullable: true, length: 60})
    lastName: string;

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;
}