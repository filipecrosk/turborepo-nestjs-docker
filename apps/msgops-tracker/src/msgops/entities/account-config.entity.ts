import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('accounts_configs')
export class AccountConfigEntity {
  @Column('int', { name: 'account_id' })
  accountId: number;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('text', { name: 'description' })
  description: string;

  @PrimaryColumn('text', { name: 'value' })
  value: string;
}
