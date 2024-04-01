import { ListaServicosDTO } from "../../servico/listaServicos.dto";
import { ListaUsuarioDTO } from "../listaUsuario.dto";

export class ListaPessoaDTO {
    constructor(
        private readonly idPessoa: number,
        private readonly dataNascimento: Date,
        private readonly genero:string, 
        private readonly situacao:string,
        private readonly solicitacoesDeServico:number
    ) {}
}