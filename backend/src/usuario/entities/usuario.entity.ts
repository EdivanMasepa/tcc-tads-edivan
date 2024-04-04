import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PessoaEntity } from "./pessoa.entity";
import { InstituicaoEntity } from "./instituicao.entity";
import { ServicoEntity } from "./servico.entity";

@Entity({name:'usuario'})
export class UsuarioEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => PessoaEntity, {nullable:true, cascade:true})
    @JoinColumn()
    usuarioPessoa: PessoaEntity;

    @OneToOne(() => InstituicaoEntity, {nullable:true, cascade:true})
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

    @OneToMany(() => ServicoEntity, servico => servico.usuario)
    solicitacoesDeServicos: ServicoEntity[];
}