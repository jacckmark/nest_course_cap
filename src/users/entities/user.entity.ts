import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum RoleNames {
  ADMIN = 'admin',
  ROOT = 'root',
}

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: RoleNames;

  @ManyToMany((type) => User)
  users: User[];
}
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password?: string;

  @ManyToMany((type) => Role, (role) => role.users, { eager: true })
  @JoinTable()
  roles: Role[];
}

export class TokenPayload {
  username: string;
  sub: number;
}

export class RequestPayload {
  user: User;
  companies?: any;
  token?: string;
}
