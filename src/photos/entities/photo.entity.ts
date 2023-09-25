import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Photo {
  // primary key in our table
  @PrimaryGeneratedColumn()
  id: number;

  // regular column in our table
  @Column()
  filename: string;

  // all records that are already created will have empty this column (no need to migrate)
  // we can also add default:'no description' and this will add the description
  // value as 'no description' to all previously created entities that does not
  // have the description column
  @Column({ nullable: true })
  description?: string;

  @ManyToOne((type) => User, { eager: true, nullable: true })
  user: User;
}
