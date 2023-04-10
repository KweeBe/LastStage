import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Photo } from "../Photo/photo.entity";

@Entity()
export class Films{

    @PrimaryGeneratedColumn()
    filmsId: number

    @Column()
    nameFilm:string

    @Column()
    year_of_release:string;
}
