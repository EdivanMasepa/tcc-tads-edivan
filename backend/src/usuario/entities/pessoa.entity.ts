import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ServicoEntity } from "./servico.entity";
import { UsuarioEntity } from "./usuario.entity";

@Entity({name:'pessoa'})
export class PessoaEntity extends UsuarioEntity{

    @Column({name: 'cpf', nullable:false})
    cpf: string;  

    @Column({name: 'data_nascimento', nullable:false})
    dataNascimento: Date;

    @Column({name: 'genero', length:30, nullable:false})
    genero: string;

    @Column({name: 'situacao', length:20, nullable:false})
    situacao: string;

    @OneToMany(() => ServicoEntity, servico => servico.usuario)
    solicitacoesDeServicos: ServicoEntity[];
}