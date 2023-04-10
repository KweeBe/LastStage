
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Profile{
    
    @PrimaryGeneratedColumn()
    profileId:number;

    @Column()
    firstName:string;

    @Column()
    lastName:string;

    @Column()
    email:string;

    @Column()
    phone:string;

    @Column()
    idUser:number;
}