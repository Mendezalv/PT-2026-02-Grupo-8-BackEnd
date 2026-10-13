import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Conexao com o banco de dados estabelecida.');
    } catch (error) {
      this.logger.warn(
        'Nao foi possivel conectar ao banco de dados no momento da inicializacao. Verifique a variavel DATABASE_URL.',
      );
    }
  }
}
