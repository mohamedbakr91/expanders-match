import { Project } from "src/project/entities/project.entity";
import { Vendor } from "src/vendor/entities/vendor.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("matches")
export class Match {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  projectId: number;
  @Column()
  vendorId: number;
  @Column({ type: "decimal", precision: 5, scale: 2 })
  score: number;

  @ManyToOne(() => Project, project => project.matches, { onDelete: "CASCADE" })
  @JoinColumn({ name: "projectId" })
  project: Project;

  @ManyToOne(() => Vendor, vendor => vendor.matches, { onDelete: "CASCADE" })
  @JoinColumn({ name: "vendorId" })
  vendor: Vendor;

  @CreateDateColumn({ name: "createdAt", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updatedAt", type: "timestamp" })
  updatedAt: Date;
}
