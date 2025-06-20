import { ListaUsuarioDTO } from "../listaUsuario.dto";

export class ListaInstituicaoDTO {
    constructor(
        private readonly id: number,
        private readonly cnpj:string, 
        private readonly dataFundacao: Date,
        private readonly segmento:string
    ) {}
}