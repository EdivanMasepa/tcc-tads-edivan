import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsuarioEntity } from "./usuario.entity";


@Entity({name:'instituicao'})
export class InstituicaoEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @OneToOne(() => UsuarioEntity, usuario => usuario.usuarioInstituicao, {cascade:true})
    usuario: UsuarioEntity;

    @Column({name:'id_usuario', nullable:false})
    idUsuario: number;

    @Column({name: 'cnpj', nullable:false})
    cnpj: string;

    @Column({name: 'data_fundacao', nullable:false})
    dataFundacao: string;

    @Column({name: 'area_atuacao', length:50, nullable:false})
    areaAtuacao: string;

}