import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Scope } from 'typeorm-scope';
import { GlobalService } from '../../utils/global.service';
import { AccountEntity } from './account.entity';

@Scope<CustomFieldsEntity>([
  (qb, alias) => qb.andWhere(`${alias}.account_id = :accountId`, { accountId: GlobalService.accountId }),
])
@Entity('custom_fields')
export class CustomFieldsEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'account_id' })
  accountId: number;

  @Column('varchar', { name: 'title', length: 255 })
  title: string;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('text', { name: 'description' })
  description: string;

  @Column('int', { name: 'order' })
  order: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => AccountEntity, (account) => account.customFields)
  @JoinColumn([{ name: 'account_id', referencedColumnName: 'id' }])
  account: AccountEntity;
}
