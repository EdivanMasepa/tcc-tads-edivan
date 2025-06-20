import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UsuarioEntity } from "../../usuario/entities/usuario.entity";
import { CategoriaPublicacao } from "../enum/categoriaPublicacao.enum";
import { DenunciaEntity } from "../../denuncia/entities/denuncia.entity";

@Entity({name:'acao'})
export class PublicacaoEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:'categoria', type:'enum', enum: CategoriaPublicacao, nullable: false})
    categoria:CategoriaPublicacao;
    
    @Column({name: 'titulo', type: 'varchar', nullable: false})
    titulo:string;

    @Column({name: 'descricao', type: 'varchar', nullable: false})
    descricao:string;
    
    @Column({name: 'data', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    data: Date;

    @Column({name: 'aprovada', type: 'boolean', nullable: false})
    aprovada: boolean;

    @Column({name: 'imagem', type: 'varchar', nullable: false})
    imagem: string;

    @ManyToOne(() =>UsuarioEntity, usuarioResponsavel => usuarioResponsavel.publicacoes)
    @JoinColumn({name:'id_usuario_responsavel'})
    usuarioResponsavel: UsuarioEntity;

    @ManyToOne(() =>UsuarioEntity, usuarioModerador => usuarioModerador.publicacoes)
    @JoinColumn({name:'id_usuario_moderador'})
    usuarioModerador: UsuarioEntity;

    @OneToMany(() => DenunciaEntity, denuncias => denuncias.publicacao)
    denuncias: DenunciaEntity[];
}