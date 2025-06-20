import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UsuarioEntity } from "../../usuario/entities/usuario.entity";
import { PublicacaoEntity } from "../../publicacao/entities/publicacao.entity";

@Entity({name:'usuario'})
export class DenunciaEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'descricao', type: 'varchar'})
    descricao: string;

    @Column({name: 'data', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    data: Date;

    @ManyToOne(() =>UsuarioEntity, usuarioRemetente => usuarioRemetente.denunciasFeitas)
    @JoinColumn({name: 'id_usuario_remetente'})
    usuarioRemetente: UsuarioEntity;

    @ManyToOne(() =>UsuarioEntity, usuarioDenunciado => usuarioDenunciado.denunciasRecebidas)
    @JoinColumn({name: 'id_usuario_denunciado'})
    usuarioDenunciado: UsuarioEntity;

    @ManyToOne(() => PublicacaoEntity, publicacao => publicacao.denuncias)
    @JoinColumn({name: 'id_publicacao'})
    publicacao: PublicacaoEntity;
}
