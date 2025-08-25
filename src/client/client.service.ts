import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { Client } from "./entities/client.entity";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { AccountService } from "src/accounts/accounts.service";
import { Account } from "src/accounts/entities/account.entity";

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
    private readonly accountService: AccountService,
  ) {}

  async create(dto: CreateClientDto, transaction: EntityManager): Promise<Client> {
    this.logger.log(`Creating client: ${dto.companyName} linked to account ${dto.accountId}`);

    try {
      const account = await transaction.findOne(Account, { where: { id: dto.accountId } });
      if (!account) {
        throw new NotFoundException(`Account with ID ${dto.accountId} not found`);
      }

      const client = transaction.create(Client, {
        companyName: dto.companyName,
        contactEmail: dto.contactEmail,
        accountId: dto.accountId,
      });

      const savedClient = await transaction.save(client);
      this.logger.log(`Client created with ID: ${savedClient.id}`);

      return savedClient;
    } catch (error) {
      this.logger.error(`Failed to create client: ${error.message}`);
      throw error;
    }
  }

  async findAll(): Promise<Client[]> {
    this.logger.log(`Fetching all clients`);
    return this.clientRepo.find({ relations: ["account"] });
  }

  async findOne(id: number, transaction?: EntityManager): Promise<Client> {
    this.logger.log(`Fetching client with ID: ${id}`);
    const client = await this.clientRepo.findOne({ where: { id }, relations: ["account"] });
    if (!client) {
      this.logger.warn(`Client with ID ${id} not found`);
      throw new NotFoundException("Client not found");
    }
    return client;
  }
  async findByAccountId(accountId: number, manager?: EntityManager): Promise<Client> {
    this.logger.log(`Fetching client for accountId: ${accountId}`);

    const repo = manager ? manager.getRepository(Client) : this.clientRepo;

    const client = await repo.findOne({ where: { accountId } });
    if (!client) {
      this.logger.warn(`Client with accountId ${accountId} not found`);
      throw new NotFoundException("Client not found");
    }

    return client;
  }

  async findByAccountUserName(userName: string, transaction?: EntityManager): Promise<Client | null> {
    this.logger.log(`Fetching client by account userName=${userName}`);

    const repository = transaction ? transaction.getRepository(Client) : this.clientRepo;

    return repository
      .createQueryBuilder("client")
      .leftJoinAndSelect("client.account", "account")
      .where("account.userName = :userName", { userName })
      .getOne();
  }
  async update(id: number, dto: UpdateClientDto): Promise<Client> {
    this.logger.log(`Updating client with ID: ${id}`);
    const client = await this.findOne(id);

    const updatedClient = await this.clientRepo.save(client);
    this.logger.log(`Client with ID ${id} updated`);
    return updatedClient;
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Removing client with ID: ${id}`);
    const client = await this.findOne(id);
    await this.clientRepo.remove(client);
    this.logger.log(`Client with ID ${id} removed`);
  }
}
