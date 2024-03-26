import { UsuarioEntity } from "src/usuario/entities/usuario.entity";
import { PessoaEntity } from "../../entities/pessoa.entity";

export class ListaServicosDTO{
    constructor(
        private readonly id:number,
        private readonly titulo:string,
        private readonly descricao:string, 
        private readonly dataServico: Date,
        private readonly status: string,
        private readonly usuarioSolicitante: string
    ){}
}