// объект, который определяет, как данные фильма будут передаваться
export class FilmsDto{
    filmsId: number;
    nameFilm: string;
    year_of_release:string;
    photos: Array<number>
}