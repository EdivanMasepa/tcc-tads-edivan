import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'campanha'})
export class CampanhaEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'objetivo', length:50, nullable:false})
    objetivo: string;

    @Column({name: 'publicoAlvo', length:50, nullable:false})
    publicoAlvo: string;

    @Column({name: 'resultados', length:350, nullable:false})
    resultado: string;

    @Column({name: 'voluntarios', nullable:false})
    voluntários: number;

    @Column({name: 'descricao',length:500, nullable:false})
    descricao: string;

    @Column({name: 'dataInicial', nullable:false})
    dataInicial: Date;

    @Column({name: 'dataFinal', nullable:false})
    dataFinal: Date;

}