import { UsuarioEntity } from "../entities/usuario.entity";

export class ListaServicosDTO{
    constructor(
        private readonly id:number,
        private readonly titulo:string,
        private readonly descricao:string, 
        private readonly dataServico: Date,
        private readonly status: string,
        private readonly usuario: UsuarioEntity
    ){}
}