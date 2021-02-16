import { Column, CreateDateColumn, Entity, getConnection, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from ".";
import { CreateReportDto } from "./report.dto";

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 80 })
    title: string;

    @Column({ type: "text" })
    description: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => User, user => user.report)
    @JoinColumn({ name: "user_id" })
    user: User;

    static getRepository() {
        return getConnection().getRepository(Report);
    }

    static async createReport(dto: CreateReportDto, user: User) {
        const reportRepository = this.getRepository();
        const newReport = reportRepository.create({
            ...dto,
            user
        });
        await reportRepository.save(newReport);
    }
}