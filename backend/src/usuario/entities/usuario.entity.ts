import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PessoaEntity } from "./pessoa.entity";
import { InstituicaoEntity } from "./instituicao.entity";

@Entity({name:'usuario'})
export class UsuarioEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => PessoaEntity, {nullable:true})
    @JoinColumn()
    usuarioPessoa: PessoaEntity;

    @OneToOne(() => InstituicaoEntity, {nullable:true})
    @JoinColumn()
    usuarioInstituicao: InstituicaoEntity;

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

}