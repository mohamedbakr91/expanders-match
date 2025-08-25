import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository, Transaction } from "typeorm";
import * as bcrypt from "bcrypt";
import { Account } from "./entities/account.entity";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";
import { AuthHelper } from "src/auth/auth-helper.service";
import { hash } from "bcryptjs";

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto, manager?: EntityManager): Promise<Account> {
    this.logger.log(`Creating account: ${createAccountDto.userName}`);
    const hashedPassword = await hash(createAccountDto.password, 10);
    console.log(hashedPassword);
    const repository = manager ? manager.getRepository(Account) : this.accountRepository;

    const account = repository.create({
      userName: createAccountDto.userName,
      password: hashedPassword,
      role: createAccountDto.role,
    });

    return repository.save(account);
  }

  async findAll(): Promise<Account[]> {
    this.logger.log(`Fetching all accounts`);
    return this.accountRepository.find();
  }

  async findOne(id: number, manager?: EntityManager): Promise<Account> {
    const repository = manager ? manager.getRepository(Account) : this.accountRepository;

    const account = await repository.findOne({ where: { id } });
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  async findByUserName(userName: string, manager?: EntityManager): Promise<Account | null> {
    this.logger.log(`Fetching account by userName=${userName}`);

    const repository = manager ? manager.getRepository(Account) : this.accountRepository;

    return repository.createQueryBuilder("account").where("account.userName = :userName", { userName }).getOne();
  }

  async update(id: number, updateAccountDto: UpdateAccountDto): Promise<Account> {
    this.logger.log(`Updating account ID=${id}`);
    const account = await this.findOne(id);

    if (updateAccountDto.password) {
      updateAccountDto.password = await bcrypt.hash(updateAccountDto.password, 10);
    }

    Object.assign(account, updateAccountDto);
    const updated = await this.accountRepository.save(account);
    this.logger.log(`Account updated ID=${updated.id}`);
    return updated;
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Removing account ID=${id}`);
    const account = await this.findOne(id);
    await this.accountRepository.remove(account);
    this.logger.log(`Account removed ID=${id}`);
  }
}
