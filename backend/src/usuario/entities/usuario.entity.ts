import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PessoaEntity } from "./pessoa.entity";
import { InstituicaoEntity } from "./instituicao.entity";
import { AcaoEntity } from "../../acao/entities/acao.entity";

@Entity({name:'usuario'})
export class UsuarioEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name:'tipo_usuario', nullable:false})
    tipoUsuario:string;
    
    @Column({name: 'nome', length:50, nullable:false})
    nome: string;

    @Column({name: 'email', length:50, nullable:false})
    email: string;

    @Column({name: 'telefone', length:16, nullable:true})
    telefone: string;

    @Column({name: 'senha', length:100, nullable:false})
    senha: string;

    @OneToOne(() => PessoaEntity, pessoa => pessoa.usuario, {nullable:true,  eager: true, cascade:true})
    @JoinColumn()
    usuarioPessoa: PessoaEntity;

    @OneToOne(() => InstituicaoEntity, instituicao => instituicao.usuario, {nullable:true, onUpdate:'CASCADE', onDelete:'CASCADE', eager: true,  cascade:true})
    @JoinColumn()
    usuarioInstituicao: InstituicaoEntity;

    @OneToMany(() => AcaoEntity, acao => acao.usuario, {nullable:true, eager: true,  cascade:true})
    acoes: AcaoEntity[];
}