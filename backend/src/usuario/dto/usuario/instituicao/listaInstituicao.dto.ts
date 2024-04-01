import { ListaUsuarioDTO } from "../listaUsuario.dto";

export class ListaInstituicaoDTO {
    constructor(
        private readonly idInstituicao: number,
        private readonly cnpj:string, 
        private readonly dataFundacao: Date,
        private readonly areaAtuacao:string
    ) {}
}