import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UsuarioEntity } from "../../usuario/entities/usuario.entity";
import { CategoriaPublicacaoEnum } from "../enum/categoriaPublicacao.enum";
import { DenunciaEntity } from "../../denuncia/entities/denuncia.entity";

@Entity({name:'publicacao'})
export class PublicacaoEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:'categoria', type:'enum', enum: CategoriaPublicacaoEnum, nullable: false})
    categoria:CategoriaPublicacaoEnum;
    
    @Column({name: 'titulo', type: 'varchar', nullable: false})
    titulo:string;

    @Column({name: 'descricao', type: 'varchar', nullable: false})
    descricao:string;
    
    @Column({name: 'data', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    data: Date;

    @Column({name: 'aprovada', type: 'boolean', nullable: true})
    aprovada: boolean;

    @Column({name: 'imagem', type: 'varchar', nullable: true})
    imagem: string;

    @ManyToOne(() =>UsuarioEntity, usuarioResponsavel => usuarioResponsavel.publicacoes, {onDelete:'CASCADE'})
    @JoinColumn({name:'id_usuario_responsavel'})
    usuarioResponsavel: UsuarioEntity;

    @ManyToOne(() =>UsuarioEntity, usuarioModerador => usuarioModerador.publicacoes)
    @JoinColumn({name:'id_usuario_moderador'})
    usuarioModerador: UsuarioEntity;

    @OneToMany(() => DenunciaEntity, denuncias => denuncias.publicacao)
    denuncias: DenunciaEntity[];
}