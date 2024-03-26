export class ListaUsuarioDTO{
    constructor(
        private readonly id:number, 
        private readonly nome:string, 
        private readonly email:string, 
        private readonly telefone:string
    ){}
}