import { ListaServicosDTO } from "./listaServicos.dto";

export class ListaUsuarioDTO {
    constructor(
        private readonly id:number, 
        private readonly nome:string, 
        private readonly cpf:string, 
        private readonly dataNascimento: Date,
        private readonly genero:string, 
        private readonly telefone:string, 
        private readonly email:string, 
        private readonly situcao:string,
        private readonly servicos:ListaServicosDTO[]
    ) {}
}