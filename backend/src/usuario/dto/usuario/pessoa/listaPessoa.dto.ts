export class ListaPessoaDTO {
    constructor(
        private readonly idPessoa: number,
        private readonly dataNascimento: string,
        private readonly genero:string, 
        private readonly situacao:string
    ) {}
}