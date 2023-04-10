import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

//Сущность
@Entity()
export class User{

    @PrimaryGeneratedColumn()
    idUser: number

    @Column({unique: true})
    login:string;

    @Column()
    password:string;

    @Column({default: "User"})
    role: string
}