import { ListaInstituicaoDTO } from "./instituicao/listaInstituicao.dto";
import { ListaPessoaDTO } from "./pessoa/listaPessoa.dto";

export class ListaUsuarioDTO{
    constructor(
        private readonly id:number, 
        private readonly tipoUsuario:string,
        private readonly nome:string, 
        private readonly email:string, 
        private readonly telefone:string,
        private readonly pedidosDeAjuda:number,
        private readonly especificacao: ListaPessoaDTO | ListaInstituicaoDTO

    ){}
}