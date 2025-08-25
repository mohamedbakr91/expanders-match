import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { CreateVendorDto } from "./dto/create-vendor.dto";
import { UpdateVendorDto } from "./dto/update-vendor.dto";
import { VendorsService } from "./vendor.service";

@Controller("vendor")
export class VendorController {
  constructor(private readonly vendorService: VendorsService) {}

  // @Post()
  // create(@Body() createVendorDto: CreateVendorDto) {
  //   return this.vendorService.create(createVendorDto);
  // }

  // @Get()
  // findAll() {
  //   return this.vendorService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.vendorService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
  //   return this.vendorService.update(+id, updateVendorDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.vendorService.remove(+id);
  // }
}
