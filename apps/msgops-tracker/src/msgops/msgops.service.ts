import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'nestjs-redis';
import { ContactEntity } from './entities/contact.entity';
import { AccountConfigEntity } from './entities/account-config.entity';
import { GlobalService } from '../utils/global.service';
@Injectable()
export class MsgopsService {
  constructor(
    @InjectRepository(ContactEntity)
    private readonly contactRepository: Repository<ContactEntity>,
    @InjectRepository(AccountConfigEntity)
    private readonly accountConfigRepository: Repository<AccountConfigEntity>,
    private readonly redisService: RedisService,
  ) {}

  async findContact(filter: string, value: string): Promise<ContactEntity> {
    const columnsMap = { e: 'email', h: 'hashedEmail', u: 'uuid' };
    return await this.contactRepository.findOneOrFail({
      where: {
        [columnsMap[filter]]: value,
        accountId: GlobalService.accountId,
      },
    });
  }

  async findByConfig(name: string, value: string): Promise<AccountConfigEntity> {
    const redisClient = await this.redisService.getClient();
    const keyName = `accountConfig:${name}:${value}`;
    const config = await redisClient.get(`${keyName}`);
    if (config) {
      return JSON.parse(config);
    }

    const accountConfig = await this.accountConfigRepository.findOne({
      where: {
        name,
        value,
      },
    });

    if (accountConfig) {
      const expireInHours = 24;
      await redisClient.set(`${keyName}`, JSON.stringify(accountConfig), 'EX', 60 * 60 * expireInHours);
    }

    return accountConfig;
  }
}
