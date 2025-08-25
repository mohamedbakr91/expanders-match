import { Match } from "src/matches/entities/match.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("vendors")
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "json" })
  countriesSupported: string[];

  @Column({ type: "json" })
  servicesOffered: string[];

  @Column({ type: "decimal", precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: "int", default: 24 })
  responseSlaHours: number;

  @Column({ default: false })
  isSLAExpired: boolean;

  @OneToMany(() => Match, match => match.vendor)
  matches: Match[];
  @CreateDateColumn({ name: "createdAt" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt: Date;
}
