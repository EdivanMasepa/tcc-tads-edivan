export class ListaPublicacaoDTO{
    constructor(
        private readonly id:number,
        private readonly categoria:string,
        private readonly titulo:string,
        private readonly descricao:string,
        private readonly data: Date,
        private readonly aprovada: boolean,
        private readonly nomeUsuarioResponsavel: string
    ){}
}