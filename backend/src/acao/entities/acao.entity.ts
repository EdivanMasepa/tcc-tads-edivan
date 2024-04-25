import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsuarioEntity } from "../../usuario/entities/usuario.entity";

@Entity({name:'acao'})
export class AcaoEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:'tipo_acao', length:50, nullable:false})
    tipoAcao:string;

    @Column({name:'titulo', length:100, nullable:false})
    titulo:string;

    @Column({name:'status', length:30, nullable:false})
    status: string;

    @Column({name: 'dataInicial', nullable:false})
    dataInicial: Date;

    @Column({name: 'dataFinal', nullable:false})
    dataFinal: Date;

    @Column({name:'descricao', length:500, nullable:false})
    descricao:string;

    @ManyToOne(() =>UsuarioEntity, usuario => usuario.pedidosDeAjuda,  {cascade: true, onDelete: 'CASCADE'})
    usuarioResponsavel: UsuarioEntity;

    @ManyToMany(() =>UsuarioEntity, usuario => usuario.participacaoEmCampanhas,  {cascade: true, onDelete: 'CASCADE'})
    usuariosVoluntarios: UsuarioEntity[];
}