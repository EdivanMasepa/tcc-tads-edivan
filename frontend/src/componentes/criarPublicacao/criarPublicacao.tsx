import { forwardRef, useState } from "react";
import './criarPublicacao.css'
import Button from "../botao/botao";
import SelectDemo from "../select/select-radix";
import { toast } from "react-toastify";
import { api } from "../../api";
import axios from "axios";

{/* tipoAcao:string;

    titulo:string;

    status: string;

    dataInicial: Date;

    dataFinal: Date;

    descricao:string;
*/}

enum CategoriaPublicacaoEnum{
    PEDIDO_AJUDA = 'Pedido de ajuda' ,
    INFORMACAO_PUBLICA = 'Informação pública',
    ACAO_SOLIDARIA = 'Ação solidária'
}
  
interface DadosPublicacaoInterface {
    tipoPublicacao:CategoriaPublicacaoEnum;
    titulo:string;
    descricao:string;
    data: Date;
}

const CriarPublicacao = forwardRef<HTMLDivElement>((props, ref) => {
    //const [categoriaPublicacao, setCategoriaPublicacao] = useState<CategoriaPublicacaoEnum>(CategoriaPublicacaoEnum.INFORMACAO_PUBLICA);
    const [categoriaPublicacao, setCategoriaPublicacao] = useState<string | null>(null);
    const [titulo, setTitulo] = useState<string | null>(null);
    const [descricao, setDescricao] = useState<string | null>(null);
    const listaCamposCadastro = [categoriaPublicacao, titulo, descricao];
    const dados: DadosPublicacaoInterface | any = {
        titulo: titulo,
        categoria: categoriaPublicacao,
        descricao: descricao   
    }


    const publicar = async (dadosPublicacao: DadosPublicacaoInterface) => {
        for(let campo in listaCamposCadastro){
            if (!campo) {
                toast.dismiss();
                toast.error("Preencha todos os campos.");
                return;
            }
        }
        try{
            console.log(dadosPublicacao)
            const response = await api.patch('publicacao/criar', dadosPublicacao)
            console.log(response)

            toast.success('Cadastrado com sucesso.')      
            }
            catch(erro){
            if (axios.isAxiosError(erro) && erro.response){
                console.log('erro')

                if(erro.response.data.message){
                    console.log(erro.response.data.message)
                    toast.dismiss()
                    toast.error(erro.response.data.message);
                }
                else {
                    toast.dismiss
                    toast.error('Erro ao cadastrar.')
                }
            } 
            else {
                console.log('Erro desconhecido. ', erro);
            }
        }
    }

 return(
        <div className='divFundo'>

                {/* <div className='divLegendaTipoPublicacao'>
                    <p>Tipo de publicação:</p>
                </div>   
                <div className="opcoespublicacao">
                    {buttons.map((botao) => (
                        <button
                            value={TipoPublicacao.ajuda}
                            onChange={() =>{setTipoPublicacao}}
                            key={botao.id}
                            className={
                                opcao === botao.id ? `buttonOpcaoPublicacao buttonOpcaoPublicacaoSelecionado  ${botao.boxShadow}` : 'buttonOpcaoPublicacao'}
                            onClick={() => alteraOpcaoPublicacao(botao.id)}>
                            {botao.legenda}
                        </button>
                    ))}
                </div> */}

                <div className="divCriarPublicacao">
                    <div className="divCriarPublicacaoSecao">
                        <label className="labelCriarPublicacaoSecao" htmlFor="titulo" >Titulo:</label>
                        <input 
                            className="inputCrairPublicacaoSecao" 
                            value={titulo ?? ""} 
                            onChange={(e) => setTitulo(e.target.value)}
                            type="text" 
                            id="titulo" 
                            name="titulo" 
                            placeholder="Digite o titulo"
                        />
                    </div>
                    <div className="divCriarPublicacaoSecao">
                        <label className="labelCriarPublicacaoSecao" htmlFor="status">Status:</label>
                        <SelectDemo value={categoriaPublicacao} onValueChange={setCategoriaPublicacao}/>
                    </div>
                    <div className="divCriarPublicacaoSecao">
                        <label className="labelCriarPublicacaoSecao posicaoLabelDescricao" htmlFor="descricao">Descrição</label>
                        <textarea
                            className="inputCrairPublicacaoSecao alturaInputDescricao"
                            value={descricao ?? ""}
                            onChange={(e) => setDescricao(e.target.value)}
                            id="descricao"
                            rows={5} 
                            cols={40}
                            placeholder="Descreva aqui o conteúdo da publicação"
                        />
                    </div>
                    {/* <div className="divCriarPublicacaoSecao">
                        <label className="labelCriarPublicacaoSecao" htmlFor="dataInicio">Data de início:</label>
                        <input 
                            className="inputCrairPublicacaoSecao" 
                            value={dataInicial ?? ""}
                            onChange={(e) => setDataInicial(e.target.value)}
                            type="text" 
                            id="dataInicio" 
                            name="dataInicio" 
                            placeholder="00/00/0000"
                        />
                    </div>
                    <div className="divCriarPublicacaoSecao">
                        <label className="labelCriarPublicacaoSecao" htmlFor="dataFim">Data de término:</label>
                        <input 
                            className="inputCrairPublicacaoSecao" 
                            value={dataFinal ?? ""}
                            onChange={(e) => setDataFinal(e.target.value)}
                            type="text" 
                            id="dataFim" 
                            name="dataFim" 
                            placeholder="00/00/0000"
                        />
                    </div> */}
                </div>
                
                <div className="divPublicar">
                    <Button legenda='Publicar' onClick={() => publicar(dados)}/>
                    {/* <Button legenda='Publicar' onClick={() => cancelar}/> */}

                </div>
                
            </div>



    )
})
export default CriarPublicacao;