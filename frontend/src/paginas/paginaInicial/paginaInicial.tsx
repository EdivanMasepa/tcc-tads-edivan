import { useEffect, useState } from 'react';
import Cabecalho from '../../componentes/cabecalho/cabecalho';
import '../../index.css'
import './paginaInicial.css'
import { ToastContainer } from 'react-toastify';
import  'react-toastify/dist/ReactToastify.css' ;
import { isAxiosError } from 'axios'

import { api } from '../../api';

enum CategoriaPublicacao{
    ajuda = 'Pedir ajuda' ,
    campanha = 'Promover campanha',
    informativa = 'informativa'
}

interface DadosPublicacao {
    id: number
    categoria:CategoriaPublicacao;
    titulo:string;
    descricao: string;
    data: string;
    aprovada: boolean,
    usuarioSolicitante: string;
}

const PaginaInicial: React.FC = () => {
    const [opcao, setOpcao] = useState<number | null>(0);
    const alteraOpcaoPaginaInicial = (buttonSelecionado: number) => {setOpcao(buttonSelecionado)};
    const buttons = [
        { id: 0, legenda: 'Tudo', boxShadow: 'shadowDireita' },
        { id: 1, legenda: 'Solicitações', boxShadow: 'shadowDuplo' },
        { id: 2, legenda: 'Campanhas', boxShadow: 'shadowEsquerda' },
    ];
    const value = true
    const [publicacoes, setPublicacoes] = useState<DadosPublicacao[]>([]);

    useEffect(() => {
        const listarPublicacoes = async ():Promise<DadosPublicacao[]> => {
            try{                
                const {data} = await api.get<DadosPublicacao[]>(`/publicacao/listar?aprovada=${value}`);
                setPublicacoes(data); 
                return data;

            }catch(erro:unknown){
                throw new Error(isAxiosError(erro) ? erro.message : 'Falha ao buscar publicações.');
            }
        };
        listarPublicacoes();
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

                {publicacoes.map((acao: any)=>(  
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
                            <div className='divConteudo1'>
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