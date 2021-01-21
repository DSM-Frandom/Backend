import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 100 })
    email: string;

    @Column({ type: "varchar", length: 16 })
    username: string;

    @Column({ type: "varchar", length: 255})
    password: string;

    @CreateDateColumn()
    created_at: Date;
    
}