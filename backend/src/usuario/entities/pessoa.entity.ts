import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsuarioEntity } from "./usuario.entity";
import { GeneroPessoa } from "../enum/generoPessoa.enum";
import { SituacaoPessoa } from "../enum/situacaoPessoa.enum";

@Entity({name:'pessoa'})
export class PessoaEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:'id_usuario', nullable:false})
    idUsuario: number;

    @Column({name: 'cpf', type: 'varchar', nullable:false})
    cpf: string;  

    @Column({name: 'data_nascimento', type: 'timestamp', nullable:false})
    dataNascimento: Date;

    @Column({name: 'genero', type: 'enum', enum: GeneroPessoa, nullable:false})
    genero: GeneroPessoa;

    @Column({name: 'situacao', type: 'enum', enum: SituacaoPessoa, nullable:false})
    situacao: SituacaoPessoa;
    
    @OneToOne(() => UsuarioEntity, usuario => usuario.usuarioPessoa)
    @JoinColumn({name:'id_usuario'})
    usuario: UsuarioEntity;
}