import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PessoaEntity } from "./pessoa.entity";
import { UsuarioEntity } from "./usuario.entity";

@Entity({name:'servico'})
export class ServicoEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:'titulo', length:100, nullable:false})
    titulo:string;

    @Column({name:'descricao', length:500, nullable:false})
    descricao:string;

    @Column({name:'data_servico', nullable:false})
    dataServico: Date;

    @Column({name:'status', length:30, nullable:false})
    status: string;

    @ManyToOne(() => PessoaEntity, pessoa => pessoa.solicitacoesDeServicos)
    usuario: UsuarioEntity;
}