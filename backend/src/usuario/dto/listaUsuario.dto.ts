import { ListaPublicacaoDTO } from "../../publicacao/dto/listaPublicacao.dto";
import { ListaInstituicaoDTO } from "./instituicao/listaInstituicao.dto";
import { ListaPessoaDTO } from "./pessoa/listaPessoa.dto";

export class ListaUsuarioDTO{
    constructor(
        private readonly id:number, 
        private readonly tipoUsuario:string,
        private readonly nome:string, 
        private readonly email:string, 
        private readonly telefone:string,
        private readonly moderador:boolean,
        private readonly especificacao: ListaPessoaDTO | ListaInstituicaoDTO,
        private readonly publicacoes:number | ListaPublicacaoDTO[]

    ){}
}