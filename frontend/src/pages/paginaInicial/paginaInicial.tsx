import { useEffect, useState } from 'react';
import Cabecalho from '../../components/cabecalho/cabecalho';
import '../../index.css'
import './paginaInicial.css'
import { ToastContainer } from 'react-toastify';
import  'react-toastify/dist/ReactToastify.css' ;
import Cookies from "js-cookie"
import axios from 'axios'
import { jwtDecode, JwtPayload } from 'jwt-decode'

enum TipoPublicacao{
    ajuda = 'Pedir ajuda' ,
    campanha = 'Promover campanha',
    informativa = 'informativa'
}

interface DadosPublicacao {
    id: number
    tipoAcao:TipoPublicacao;
    status: string;
    titulo:string;
    dataInicial: string;
    dataFinal: string;
    descricao:string;
    usuarioSolicitante: string;
}

const PaginaInicial: React.FC = () => {

    const [acoes, setAcoes] = useState<DadosPublicacao[]>([]);

    const [opcao, setOpcao] = useState<number | null>(0);

    const alteraOpcaoPaginaInicial = (buttonSelecionado: number) => {
        setOpcao(buttonSelecionado)
    };

    const buttons = [
        { id: 0, legenda: 'Tudo', boxShadow: 'shadowDireita' },
        { id: 1, legenda: 'Solicitações', boxShadow: 'shadowDuplo' },
        { id: 2, legenda: 'Campanhas', boxShadow: 'shadowEsquerda' },
      ];

    let decodeToken: JwtPayload;

    useEffect(() => {

        const listaPublicacoes = async () => {
            try{
                const token = Cookies.get('token') ;
                
                if(token){
                    decodeToken = jwtDecode(token)
                }
    
                const response = await axios.get<DadosPublicacao[]>('http://localhost:3000/acao/acoes', {
                    method: 'GET',
                    headers: {'Authorization': `Bearer ${token}`}
                })
                setAcoes(response.data); 
                console.log(response.data[0])
                return response.data
            }catch(erro){
                console.log(erro)
            }
        };

        listaPublicacoes();
      }, []);
    

    return(
        <div className='divPrincipal alturaPaginaInicialDivPrincipal'>
            <Cabecalho />
            <div className="opcoesConteudo">
                {buttons.map((botao) => (
                    <button
                        key={botao.id}
                        className={opcao === botao.id ? `buttonOpcaoConteudo buttonOpcaoConteudoSelecionado  ${botao.boxShadow}` : 'buttonOpcaoConteudo'}
                        onClick={() => alteraOpcaoPaginaInicial(botao.id)}
                    >
                        {botao.legenda}
                    </button>
                ))}
            </div>
            <div className='divPaginaInicial'>

                {acoes.map((acao: any)=>(  
                    <div  className='divPublicacao' key={acao.id}>
                        <div className='divCabecalhoPublicacao'>
                            <p className="usuarioPublicacao">{acao.usuarioSolicitante}</p>
                            <p className="dataPublicacao">{acao.dataInicial} - {acao.dataFinal}</p>
                        </div>
                        <div className='divConteudoPublicacao'>
                            <div className='divCabecalhoConteudoPublicacao'>
                                <p>tipo: {acao.tipoAcao}</p>
                                <p>status: {acao.status}</p>
                            </div>
                            <div className='divConteudo'>
                                <p>{acao.titulo}</p>
                                <p>{acao.descricao}</p>
                            </div>
                        </div>
                    
                    </div>
                ))} 
                
            </div>
            <ToastContainer /> 

        </div>
    )
}
export default PaginaInicial;