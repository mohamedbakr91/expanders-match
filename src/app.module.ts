import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { AccountsModule } from "./accounts/accounts.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientsModule } from "./client/client.module";
import { Account } from "./accounts/entities/account.entity";
import { Client } from "./client/entities/client.entity";
import { Project } from "./project/entities/project.entity";
import configuration from "./config/configuration";
import { Vendor } from "./vendor/entities/vendor.entity";
import { MatchesModule } from "./matches/matches.module";
import { Match } from "./matches/entities/match.entity";
import { ProjectModule } from "./project/project.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ResearchDocumentModule } from "./research-document/research-document.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get<string>("database.host"),
        port: configService.get<number>("database.port"),
        username: configService.get<string>("database.user"),
        password: configService.get<string>("database.password"),
        database: configService.get<string>("database.name"),
        entities: [Account, Client, Project, Vendor, Match],
        migrations: [__dirname + "/../database/migrations/*.ts"],
        synchronize: false,
        logging: true,
        autoLoadEntities: true,
      }),
    }),
    AccountsModule,
    AuthModule,
    ClientsModule,
    ProjectModule,
    MatchesModule,
    ResearchDocumentModule,

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("mongoURL"),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    ResearchDocumentModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
