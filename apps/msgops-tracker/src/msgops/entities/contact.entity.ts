import { Exclude, Transform } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { AccountEntity } from './account.entity';
import { ContactCustomFieldEntity } from './contact-custom-fields.entity';

@Entity('contacts')
export class ContactEntity {
  @Exclude()
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Exclude()
  @PrimaryColumn('varchar', { name: 'uuid', length: 40 })
  uuid: string;

  @Exclude()
  @Column('int', { name: 'account_id' })
  accountId: number;

  @Exclude()
  @Column('varchar', { name: 'email', length: 255 })
  email: string;

  @Exclude()
  @Column('varchar', { name: 'hashed_email', length: 255 })
  hashedEmail: string;

  @Column('varchar', { name: 'email_provider', length: 255 })
  ep: string;

  @Column('varchar', { name: 'hashed_email', length: 255 })
  h: string;

  @Column('bool', { name: 'is_active' })
  a: boolean;

  @Column('bool', { name: 'is_unsubscribed' })
  u: boolean;

  @Column('bool', { name: 'has_bounced' })
  b: boolean;

  @Column('timestamp', { name: 'last_open' })
  lo: number;

  @Column('timestamp', { name: 'last_click' })
  lc: number;

  @Column('timestamp', { name: 'last_sent' })
  ls: number;

  @ManyToOne(() => AccountEntity, (account) => account.contacts, {
    eager: false,
    nullable: true,
  })
  @JoinColumn([{ name: 'account_id', referencedColumnName: 'id' }])
  account: AccountEntity;

  @Transform(({ value }) => {
    return value.map((customField) => {
      return {
        id: customField.customFieldType.id,
        name: customField.customFieldType.name,
        value: customField.value,
      };
    });
  })
  @Exclude()
  @OneToMany(() => ContactCustomFieldEntity, (customFields) => customFields.contact, {
    eager: false,
    nullable: true,
  })
  customFields?: ContactCustomFieldEntity[];
}
