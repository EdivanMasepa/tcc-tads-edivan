import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsuarioEntity } from "./usuario.entity";
import { GeneroPessoaEnum } from "../enum/generoPessoa.enum";
import { SituacaoPessoaEnum } from "../enum/situacaoPessoa.enum";

@Entity({name:'pessoa'})
export class PessoaEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:'id_usuario', nullable:false})
    idUsuario: number;

    @Column({name: 'cpf', type: 'varchar', nullable:false})
    cpf: string;  

    @Column({name: 'data_nascimento', type: 'datetime', nullable:false})
    dataNascimento: Date;

    @Column({name: 'genero', type: 'enum', enum: GeneroPessoaEnum, nullable:false})
    genero: GeneroPessoaEnum;

    @Column({name: 'situacao', type: 'enum', enum: SituacaoPessoaEnum, nullable:false})
    situacao: SituacaoPessoaEnum;
    
    @OneToOne(() => UsuarioEntity, usuario => usuario.usuarioPessoa, {nullable:false, onUpdate:'CASCADE', onDelete:'CASCADE', cascade:true})
    @JoinColumn({name:'id_usuario'})
    usuario: UsuarioEntity;
}