import { Column, CreateDateColumn, Entity, getConnection, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from ".";

@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    location: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => User, user => user.file)
    @JoinColumn({ name: "user_id" })
    user: User;

    static getRepository() {
        return getConnection().getRepository(File);
    }

    static async createFile(location: string, user: User): Promise<void> {
        const fileRepository = this.getRepository();
        const newFile = fileRepository.create({ location, user });
        await fileRepository.save(newFile);
    }
}