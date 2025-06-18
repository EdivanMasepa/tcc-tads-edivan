import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsuarioEntity } from "./usuario.entity";
import { SegmentoInstituicao } from "../../enums/segmentoInstituicao.enum";

@Entity({name:'instituicao'})
export class InstituicaoEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:'id_usuario', type: 'number', nullable:false})
    idUsuario: number;

    @Column({name: 'cnpj', type: 'varchar', nullable:false})
    cnpj: string;

    @Column({name: 'data_fundacao', type: 'varchar', nullable:false})
    dataFundacao: string;

    @Column({name: 'segmento', type: 'enum', enum: SegmentoInstituicao, length:50, nullable:false})
    segmento: SegmentoInstituicao;

    @OneToOne(() => UsuarioEntity, usuario => usuario.usuarioInstituicao)
    usuario: UsuarioEntity;
}