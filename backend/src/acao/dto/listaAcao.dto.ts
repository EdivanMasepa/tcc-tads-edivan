import { UsuarioEntity } from "src/usuario/entities/usuario.entity";
import { PessoaEntity } from "../../usuario/entities/pessoa.entity";

export class ListaAcaoDTO{
    constructor(
        private readonly id:number,
        private readonly tipoAcao:string,
        private readonly titulo:string,
        private readonly status: string,
        private readonly dataInicial: Date,
        private readonly dataFinal: Date,
        private readonly descricao:string,
        private readonly usuarioSolicitante: string
    ){}
}