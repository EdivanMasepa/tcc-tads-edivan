import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'usuario'})
export class UsuarioEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'nome', length:50, nullable:false})
    nome: string;

    @Column({name: 'email', length:50, nullable:false})
    email: string;

    @Column({name: 'telefone', length:16, nullable:true})
    telefone: string;

    @Column({name: 'senha', length:100, nullable:false})
    senha: string;

}