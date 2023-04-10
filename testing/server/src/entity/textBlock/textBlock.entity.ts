import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Photo } from "../Photo/photo.entity";

@Entity()
export class TextBlock{

    @PrimaryGeneratedColumn()
    postId: number

    @Column({unique: true})
    name:string

    @Column()
    title:string;

    //Связь один к одному
    @OneToOne(() => Photo)
    @JoinColumn({name: "idPhoto"})
    idPhoto:number;

    @Column()
    text: string

    @Column()
    group: string;
}