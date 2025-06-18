import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsuarioEntity } from "./usuario.entity";
import { GeneroPessoa } from "../../enums/generoPessoa.enum";
import { SituacaoPessoa } from "../../enums/situacaoPessoa.enum";

@Entity({name:'pessoa'})
export class PessoaEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:'id_usuario', type: 'number', nullable:false})
    idUsuario: number;

    @Column({name: 'cpf', type: 'varchar', nullable:false})
    cpf: string;  

    @Column({name: 'data_nascimento', type: 'varchar', nullable:false})
    dataNascimento: string;

    @Column({name: 'genero', length:30, type: 'enum', enum: GeneroPessoa, nullable:false})
    genero: GeneroPessoa;

    @Column({name: 'situacao', type: 'enum', enum: SituacaoPessoa, length:20, nullable:false})
    situacao: SituacaoPessoa;
    
    @OneToOne(() => UsuarioEntity, usuario => usuario.usuarioPessoa)
    usuario: UsuarioEntity;
}