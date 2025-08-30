import { Vendor } from "src/vendor/entities/vendor.entity";
import { DataSource, EntityManager } from "typeorm";
import { BaseSeeder } from "./accounts-clients-projects.seeders"; // Import BaseSeeder

export class VendorSeeder extends BaseSeeder {
  constructor(protected readonly dataSource: DataSource) {
    super(dataSource);
  }

  private readonly vendorsData = [
    {
      name: "Acme Consulting",
      countriesSupported: ["Egypt", "UAE"],
      servicesOffered: ["legal", "tax"],
      rating: 4.5,
      responseSlaHours: 24,
    },
    {
      name: "Global Expansion Partners",
      countriesSupported: ["KSA", "Qatar"],
      servicesOffered: ["finance", "compliance"],
      rating: 4.2,
      responseSlaHours: 48,
    },
    {
      name: "MENA Market Advisors",
      countriesSupported: ["Jordan", "Egypt"],
      servicesOffered: ["market_research", "strategy"],
      rating: 3.9,
      responseSlaHours: 36,
    },
    {
      name: "FastTrack Logistics",
      countriesSupported: ["UAE", "KSA"],
      servicesOffered: ["logistics", "import", "export"],
      rating: 4.7,
      responseSlaHours: 12,
    },
    {
      name: "TalentBridge HR",
      countriesSupported: ["Egypt", "Morocco"],
      servicesOffered: ["hr", "recruitment", "training"],
      rating: 4.1,
      responseSlaHours: 30,
    },
    {
      name: "PrimeTax Advisors",
      countriesSupported: ["Bahrain", "Egypt"],
      servicesOffered: ["tax", "finance"],
      rating: 4.6,
      responseSlaHours: 20,
    },
    {
      name: "LegalEdge Solutions",
      countriesSupported: ["Oman", "Kuwait"],
      servicesOffered: ["legal", "corporate_law"],
      rating: 4.3,
      responseSlaHours: 40,
    },
    {
      name: "BrightFuture Recruitment",
      countriesSupported: ["Tunisia", "Morocco"],
      servicesOffered: ["hr", "talent_sourcing"],
      rating: 4.0,
      responseSlaHours: 28,
    },
    {
      name: "Atlas Research Group",
      countriesSupported: ["Lebanon", "Egypt"],
      servicesOffered: ["market_research", "analysis"],
      rating: 4.4,
      responseSlaHours: 18,
    },
    {
      name: "TradeLink International",
      countriesSupported: ["KSA", "UAE"],
      servicesOffered: ["import", "export", "supply_chain"],
      rating: 4.8,
      responseSlaHours: 10,
    },
  ];

  async run() {
    await this.withTransaction(async entityManager => {
      const vendorRepo = entityManager.getRepository(Vendor);

      for (const vendorData of this.vendorsData) {
        const exists = await vendorRepo.findOne({
          where: { name: vendorData.name },
        });

        if (!exists) {
          const newVendor = vendorRepo.create(vendorData);
          await vendorRepo.save(newVendor);
          console.log(`Vendor "${vendorData.name}" created successfully`);
        } else {
          console.log(`Vendor "${vendorData.name}" already exists`);
        }
      }
    });
  }
}
