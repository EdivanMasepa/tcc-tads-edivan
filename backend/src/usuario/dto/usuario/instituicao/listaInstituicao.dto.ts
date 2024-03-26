import { ListaUsuarioDTO } from "../listaUsuario.dto";

export class ListaInstituicaoDTO extends ListaUsuarioDTO{
    constructor(
        id:number, 
        nome:string, 
        email:string, 
        telefone:string, 
        private readonly cnpj:string, 
        private readonly dataFundacao: Date,
        private readonly areaAtuacao:string
    ) {
        super(id, nome, email, telefone)
    }
}