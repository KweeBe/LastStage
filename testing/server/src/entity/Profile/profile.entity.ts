import { User } from "../Users/users.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Photo } from "../Photo/photo.entity";

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

    @OneToOne(() => Photo)
    @JoinColumn({name: "idPhoto"})
    idPhoto:number;


    @OneToOne(() => User)
    @JoinColumn({name: "idUser"})
    idUser:number;
}