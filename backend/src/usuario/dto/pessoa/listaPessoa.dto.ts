export class ListaPessoaDTO {
    constructor(
        private readonly id: number,
        private readonly dataNascimento: Date,
        private readonly genero:string, 
        private readonly situacao:string
    ) {}
}