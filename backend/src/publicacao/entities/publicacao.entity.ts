import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UsuarioEntity } from "../../usuario/entities/usuario.entity";
import { CategoriaPublicacao } from "../../enums/categoriaPublicacao.enum";

@Entity({name:'acao'})
export class PublicacaoEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:'categoria', type:'enum', enum: CategoriaPublicacao, length:20, nullable: false})
    categoria:CategoriaPublicacao;
    
    @Column({name: 'titulo', type: 'varchar', length:50, nullable: false})
    titulo:string;

    @Column({name: 'descricao', type: 'varchar', length:500, nullable: false})
    descricao:string;
    
    @Column({name: 'data', type: 'varchar', nullable: false})
    data: string;

    @Column({name: 'aprovada', type: 'boolean', nullable: false})
    aprovada: string;

    @Column({name: 'imagem', type: 'varchar', nullable: false})
    imagem: string;

    @ManyToOne(() =>UsuarioEntity, usuario => usuario.publicacoes)
    usuario: UsuarioEntity;
}