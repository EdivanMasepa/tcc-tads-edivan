import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PessoaEntity } from "./pessoa.entity";
import { InstituicaoEntity } from "./instituicao.entity";
import { ServicoEntity } from "./servico.entity";
import { CampanhaEntity } from "./campanha.entity";

@Entity({name:'usuario'})
export class UsuarioEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => PessoaEntity, pessoa => pessoa.usuario, {nullable:true,  onUpdate:'CASCADE', onDelete:'CASCADE'})
    @JoinColumn()
    usuarioPessoa: PessoaEntity;

    @OneToOne(() => InstituicaoEntity, instituicao => instituicao.usuario, {nullable:true, onUpdate:'CASCADE', onDelete:'CASCADE'})
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
    @JoinColumn()
    solicitacoesDeServicos: ServicoEntity[];

    @OneToMany(() => CampanhaEntity, campanha => campanha.usuarioPromovedor)
    @JoinColumn()
    promocaoDeCampanhas: CampanhaEntity[];

    @ManyToMany(() => CampanhaEntity, campanha => campanha.usuarioPromovedor)
    @JoinColumn()
    participacaoEmCampanhas: CampanhaEntity[];
}