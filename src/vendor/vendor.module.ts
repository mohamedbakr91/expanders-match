import { Module } from "@nestjs/common";
import { VendorController } from "./vendor.controller";
import { VendorsService } from "./vendor.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Vendor } from "./entities/vendor.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Vendor])],
  controllers: [VendorController],
  providers: [VendorsService],
  exports: [VendorsService],
})
export class VendorModule {}
