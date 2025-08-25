import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, LessThan, Repository } from "typeorm";
import { CreateVendorDto } from "./dto/create-vendor.dto";
import { Vendor } from "./entities/vendor.entity";
import { FindByCountryAndServices } from "./dto/find-by-country-and-services.dto";

@Injectable()
export class VendorsService {
  private readonly logger = new Logger(VendorsService.name);

  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepo: Repository<Vendor>,
  ) {}
  async findByCountryAndServices(data: FindByCountryAndServices): Promise<Vendor[]> {
    this.logger.log(`Fetching vendors in country: ${data.country} with services: ${data.servicesNeeded.join(", ")}`);

    const vendors = await this.vendorRepo
      .createQueryBuilder("v")
      .where("JSON_CONTAINS(v.countriesSupported, :country)", {
        country: JSON.stringify(data.country),
      })
      .andWhere("JSON_OVERLAPS(v.servicesOffered, :services)", {
        services: JSON.stringify(data.servicesNeeded),
      })
      .orderBy("v.rating", "DESC")

      .getMany();

    return vendors;
  }

  async create(dto: CreateVendorDto, transaction: EntityManager): Promise<Vendor> {
    this.logger.log(`Creating vendor: ${dto.name}`);

    try {
      const vendor = transaction.create(Vendor, {
        name: dto.name,
        countriesSupported: dto.countriesSupported,
        servicesOffered: dto.servicesOffered,
        rating: dto.rating ?? 0,
        responseSlaHours: dto.responseSlaHours ?? 24,
      });

      const savedVendor = await transaction.save(vendor);
      this.logger.log(`Vendor created with ID: ${savedVendor.id}`);

      return savedVendor;
    } catch (error) {
      this.logger.error(`Failed to create vendor: ${error.message}`);
      throw error;
    }
  }

  async findAll(): Promise<Vendor[]> {
    this.logger.log("Fetching all vendors");
    return this.vendorRepo.find();
  }

  async findOne(id: number): Promise<Vendor> {
    this.logger.log(`Fetching vendor with ID: ${id}`);

    const vendor = await this.vendorRepo.findOne({ where: { id } });
    if (!vendor) {
      this.logger.warn(`Vendor with ID ${id} not found`);
      throw new NotFoundException("Vendor not found");
    }
    return vendor;
  }

  async flagExpiredSLAs() {
    const now = new Date();
    const vendors = await this.vendorRepo.find();

    const expiredVendors = vendors.filter(vendor => {
      const expiryDate = new Date(vendor.createdAt.getTime() + vendor.responseSlaHours * 60 * 60 * 1000);
      return now > expiryDate;
    });

    for (const v of expiredVendors) {
      if (!v.isSLAExpired) {
        v.isSLAExpired = true;
        await this.vendorRepo.save(v);
      }
    }

    return expiredVendors.length;
  }
}
