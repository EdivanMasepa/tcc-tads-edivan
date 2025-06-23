import { ChangeEvent, useState } from "react";
import "./criarPublicacao.css"
import '../../index.css'
import Input from "../../componentes/input/input";
import Button from "../../componentes/botao/botao";
import SelectDemo from "../../componentes/select/select-radix";
import { toast } from "react-toastify";
import Cookies from "js-cookie"
import axios from 'axios'
import { jwtDecode, JwtPayload } from 'jwt-decode'

enum TipoPublicacao{
    ajuda = 'Pedir ajuda' ,
    campanha = 'Promover campanha',
    informativa = 'informativa'
}
  
interface DadosPublicacao {
    tipoPublicacao:TipoPublicacao;
    status: string;
    titulo:string;
    descricao:string;
    dataInicial: string;
    dataFinal: string;
}

const CriarPublicacao: React.FC = () => {

    const [tipoPublicacao, setTipoPublicacao] = useState<TipoPublicacao>(TipoPublicacao.informativa);
    const [status, setStatus] = useState<string | null>(null);
    const [titulo, setTitulo] = useState<string | null>(null);
    const [descricao, setDescricao] = useState<string | null>(null);
    const [dataInicial, setDataInicial] = useState<string | null>(null);
    const [dataFinal, setDataFinal] = useState<string | null>(null);

    const dados: DadosPublicacao | any = {
        titulo: titulo,
        tipoAcao: tipoPublicacao,
        status: status,
        dataInicial: dataInicial,
        dataFinal: dataFinal,
        descricao: descricao    
    }

    const listaCamposCadastro = [tipoPublicacao, status, titulo, descricao, dataInicial, dataFinal];

    for(let campo in listaCamposCadastro){
      if (!campo) {
        toast.dismiss()
        toast.error("Preencha todos os campos")
        return
      }
    }

    let decodeToken: JwtPayload;
    
    const publicar = async (dadosPublicacao: DadosPublicacao) => {
        try{
            const token = Cookies.get('token') ;
            
            if(token){
                decodeToken = jwtDecode(token)
            }
            console.log(dadosPublicacao)
            const response = await axios.patch('http://localhost:3000/acao/criar-acao', dadosPublicacao,{
                method: 'PATCH',
                headers: {'Authorization': `Bearer ${token}`}
            })
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
                console.log('Erro desconhecido', erro);
            }
        }
    }

    const [opcao, setOpcao] = useState<number | null>(0);

    const alteraOpcaoPublicacao = (buttonSelecionado: number) => {
        setOpcao(buttonSelecionado)
    };

    type TipoOpcao = {
        value: string;
        label: string;
      };

    const buttons = [
        { id: 0, legenda: 'Pedir ajuda', boxShadow: 'shadowDireita', value:TipoPublicacao.ajuda, setValue:setTipoPublicacao },
        { id: 1, legenda: 'Promover campanha', boxShadow: 'shadowDuplo', value:TipoPublicacao.campanha, setValue:setTipoPublicacao },
        { id: 2, legenda: 'Informativo', boxShadow: 'shadowEsquerda', value:TipoPublicacao.informativa, setValue:setTipoPublicacao },
      ];

    const opcoes:TipoOpcao[] = [
    { value: 'urgente', label: 'Urgente' },
    { value: 'media', label: 'Média' },
    { value: 'adiavel', label: 'Adiável ' },
    ];

    return(
        <>
            <div className='divPrincipal alturaCriarPublicacaoDivPrincipal'>
                <div className='divLegendaTipoPublicacao'>
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
                </div>

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
                        <SelectDemo value={status} onValueChange={setStatus}/>
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
                    <div className="divCriarPublicacaoSecao">
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
                    </div>
                </div>
                
                <div className="divPublicar">
                    <Button legenda='Publicar' onClick={() => publicar(dados)}/>
                </div>
                {/* tipoAcao:string;

                titulo:string;

                status: string;

                dataInicial: Date;

                dataFinal: Date;

                descricao:string;

                 */}
            </div>
        </>
    )
}
export default CriarPublicacao