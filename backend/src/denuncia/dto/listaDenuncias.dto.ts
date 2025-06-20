export class ListaDenunciasDTO {
    constructor(
        private readonly id: number,
        private readonly descricao:string, 
        private readonly data: Date,
        private readonly nomeRemetente:string,
        private readonly nomeDenunciado:string,
        private readonly tituloPublicacao:string
    ) {}
}
