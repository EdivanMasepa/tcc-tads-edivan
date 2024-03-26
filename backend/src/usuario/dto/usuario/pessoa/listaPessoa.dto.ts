import { ListaServicosDTO } from "../../servico/listaServicos.dto";
import { ListaUsuarioDTO } from "../listaUsuario.dto";

export class ListaPessoaDTO extends ListaUsuarioDTO{
    constructor(
        id:number, 
        nome:string, 
        email:string, 
        telefone:string,
        private readonly cpf:string, 
        private readonly dataNascimento: Date,
        private readonly genero:string, 
        private readonly situacao:string,
        private readonly solicitacoesDeServico:number
    ) {
        super(id, nome, email, telefone);
    }
}