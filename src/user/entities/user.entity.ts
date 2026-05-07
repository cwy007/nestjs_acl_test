import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, UpdateDateColumn } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "./permission.entity";

@Entity({
  comment: '用户表',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '用户名',
  })
  username: string;

  @Column({
    length: 50,
    comment: '密码',
  })
  password: string;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime: Date;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'user_permissions_relation',
  })
  permissions: Permission[];
}
