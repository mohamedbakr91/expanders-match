import { Project } from "../../project/entities/project.entity";
import { Account } from "../../accounts/entities/account.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";

@Entity("clients")
export class Client {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  accountId: number;

  @Column({ type: "varchar", length: 255 })
  companyName: string;

  @Column({ type: "varchar", length: 255, unique: true })
  contactEmail: string;

  @OneToOne(() => Account, { eager: true })
  @JoinColumn({ name: "accountId" })
  account: Account;

  @OneToMany(() => Project, project => project.client)
  projects: Project[];

  @CreateDateColumn({ name: "createdAt", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updatedAt", type: "timestamp" })
  updatedAt: Date;
}
