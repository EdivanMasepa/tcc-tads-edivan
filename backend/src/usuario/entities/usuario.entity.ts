import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ServicoEntity } from "./servico.entity";

@Entity({name:'usuario'})
export class UsuarioEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'nome', length:50, nullable:false})
    nome: string;

    @Column({name: 'cpf', nullable:false})
    cpf: string;

    @Column({name: 'data_nascimento', nullable:false})
    dataNascimento: Date;

    @Column({name: 'genero', length:30, nullable:false})
    genero: string;

    @Column({name: 'telefone', length:16, nullable:true})
    telefone: string;

    @Column({name: 'email', length:50, nullable:false})
    email: string;

    @Column({name: 'situacao', length:20, nullable:false})
    situacao: string;

    @Column({name: 'senha', length:100, nullable:false})
    senha: string;

    @OneToMany(type => ServicoEntity, servico => servico.usuario)
    servicos: ServicoEntity[];
}