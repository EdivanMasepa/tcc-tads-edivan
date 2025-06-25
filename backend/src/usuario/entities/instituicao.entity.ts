import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsuarioEntity } from "./usuario.entity";
import { SegmentoInstituicaoEnum } from "../enum/segmentoInstituicao.enum";

@Entity({name:'instituicao'})
export class InstituicaoEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:'id_usuario', nullable:false})
    idUsuario: number;

    @Column({name: 'cnpj', type: 'varchar', nullable:false})
    cnpj: string;

    @Column({name: 'data_fundacao', type: 'timestamp', nullable:false})
    dataFundacao: Date;

    @Column({name: 'segmento', type: 'enum', enum: SegmentoInstituicaoEnum, nullable:false})
    segmento: SegmentoInstituicaoEnum;

    @OneToOne(() => UsuarioEntity, usuario => usuario.usuarioInstituicao)
    @JoinColumn({name:'id_usuario'})
    usuario: UsuarioEntity;
}