import { UsuarioEntity } from "src/usuario/entities/usuario.entity";
import { PessoaEntity } from "../../usuario/entities/pessoa.entity";

export class ListaAcaoDTO{
    constructor(
        private readonly id:number,
        private readonly tipoAcao:string,
        private readonly status: string,
        private readonly titulo:string,
        private readonly descricao:string,
        private readonly dataInicial: string,
        private readonly dataFinal: string,
        private readonly usuarioResponsavel: string
    ){}
}