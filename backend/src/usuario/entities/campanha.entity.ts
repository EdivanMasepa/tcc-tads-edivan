import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsuarioEntity } from "./usuario.entity";
import { IsArray } from "class-validator";

@Entity({name:'campanha'})
export class CampanhaEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'objetivo', length:50, nullable:false})
    objetivo: string;

    @Column({name: 'publicoAlvo', length:50, nullable:false})
    publicoAlvo: string;

    @Column({name: 'descricao',length:500, nullable:false})
    descricao: string;

    @Column({name: 'dataInicial', nullable:false})
    dataInicial: Date;

    @Column({name: 'dataFinal', nullable:false})
    dataFinal: Date;

    @ManyToOne(() =>UsuarioEntity, usuario => usuario.promocaoDeCampanhas,  {cascade:true, onDelete:'CASCADE'})
    usuarioPromovedor: UsuarioEntity;
    
    @IsArray()
    @ManyToMany(() =>UsuarioEntity, usuario => usuario.promocaoDeCampanhas,  {cascade:true, onDelete:'CASCADE'})
    usuariosVoluntarios: UsuarioEntity[];

}