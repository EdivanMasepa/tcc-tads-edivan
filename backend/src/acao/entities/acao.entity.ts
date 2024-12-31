import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UsuarioEntity } from "../../usuario/entities/usuario.entity";

@Entity({name:'acao'})
export class AcaoEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:'tipo_acao', length:50, nullable: false})
    tipoAcao:string;

    @Column({name: 'status', length:30, nullable: false})
    status: string;
    
    @Column({name: 'titulo', length:100, nullable: false})
    titulo:string;

    @Column({name: 'descricao', length:500, nullable: false})
    descricao:string;
    
    @Column({name: 'dataInicial', nullable: false})
    dataInicial: string;

    @Column({name: 'dataFinal', nullable: false})
    dataFinal: string;

    @ManyToOne(() =>UsuarioEntity, usuario => usuario.acoes)
    usuario: UsuarioEntity;
}