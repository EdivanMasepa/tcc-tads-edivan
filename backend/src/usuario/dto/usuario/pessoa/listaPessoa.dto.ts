export class ListaPessoaDTO {
    constructor(
        private readonly idPessoa: number,
        private readonly dataNascimento: Date,
        private readonly genero:string, 
        private readonly situacao:string
    ) {}
}