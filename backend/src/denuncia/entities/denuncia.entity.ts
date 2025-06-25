import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UsuarioEntity } from "../../usuario/entities/usuario.entity";
import { PublicacaoEntity } from "../../publicacao/entities/publicacao.entity";

@Entity({name:'denuncia'})
export class DenunciaEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'descricao', type: 'varchar', nullable: false})
    descricao: string;

    @Column({name: 'data', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    data: Date;

    @ManyToOne(() =>UsuarioEntity, usuarioRemetente => usuarioRemetente.denunciasFeitas, { nullable: false })
    @JoinColumn({name: 'id_usuario_remetente'})
    usuarioRemetente: UsuarioEntity;

    @ManyToOne(() =>UsuarioEntity, usuarioDenunciado => usuarioDenunciado.denunciasRecebidas, { nullable: false })
    @JoinColumn({name: 'id_usuario_denunciado'})
    usuarioDenunciado: UsuarioEntity;

    @ManyToOne(() => PublicacaoEntity, publicacao => publicacao.denuncias, { nullable: true })
    @JoinColumn({name: 'id_publicacao'})
    publicacao?: PublicacaoEntity;
}
