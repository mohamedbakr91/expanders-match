import { Client } from "src/client/entities/client.entity";
import { Match } from "src/matches/entities/match.entity";
import { Vendor } from "src/vendor/entities/vendor.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

export enum ProjectStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  ACTIVE = "active",
}

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, client => client.projects, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "clientId" })
  client: Client;

  @Column()
  clientId: number;

  @Column({ type: "varchar", length: 100 })
  country: string;

  @Column("json", { nullable: true })
  servicesNeeded: string[];

  @Column({ type: "decimal", precision: 12, scale: 2 })
  budget: number;

  @Column({
    type: "enum",
    enum: ProjectStatus,
    default: ProjectStatus.PENDING,
  })
  status: ProjectStatus;

  @OneToMany(() => Match, match => match.project)
  matches: Match[];

  @CreateDateColumn({ name: "createdAt" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt: Date;
}
