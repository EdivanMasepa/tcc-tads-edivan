import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PessoaEntity } from "./pessoa.entity";
import { InstituicaoEntity } from "./instituicao.entity";
import { TipoUsuario } from "../../enums/tipoUsuario.enum";
import { PublicacaoEntity } from "../../publicacao/entities/publicacao.entity";

@Entity({name:'usuario'})
export class UsuarioEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name:'tipo_usuario', type: 'enum', enum: TipoUsuario, nullable:false})
    tipoUsuario:TipoUsuario;
    
    @Column({name: 'nome', type: 'varchar', nullable:false})
    nome: string;

    @Column({name: 'email', type: 'varchar', nullable:false})
    email: string;

    @Column({name: 'telefone', type: 'varchar', nullable:true})
    telefone: string;

    @Column({name: 'senha', type: 'varchar', nullable:false})
    senha: string;

    @OneToOne(() => PessoaEntity, pessoa => pessoa.usuario, {nullable:true,  eager: true, cascade:true})
    @JoinColumn()
    usuarioPessoa: PessoaEntity;

    @OneToOne(() => InstituicaoEntity, instituicao => instituicao.usuario, {nullable:true, onUpdate:'CASCADE', onDelete:'CASCADE', eager: true,  cascade:true})
    @JoinColumn()
    usuarioInstituicao: InstituicaoEntity;

    @OneToMany(() => PublicacaoEntity, publicacao => publicacao.usuario, {nullable:true, eager: true,  cascade:true})
    publicacoes: PublicacaoEntity[];
}