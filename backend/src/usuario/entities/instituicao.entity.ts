import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UsuarioEntity } from "./usuario.entity";

@Entity({name:'instituicao'})
export class InstituicaoEntity extends UsuarioEntity{

    @Column({name: 'cnpj', nullable:false})
    cnpj: string;

    @Column({name: 'data_fundacao', nullable:false})
    dataFundacao: Date;

    @Column({name: 'area_atuacao', length:50, nullable:false})
    areaAtuacao: string;

}