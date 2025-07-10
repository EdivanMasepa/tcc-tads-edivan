import { useEffect, useState } from 'react';
import Cabecalho from '../../componentes/cabecalho/cabecalho';
import '../../index.css'
import './paginaInicial.css'
import { ToastContainer } from 'react-toastify';
import  'react-toastify/dist/ReactToastify.css' ;
import { isAxiosError } from 'axios'
import { api } from '../../api';

enum CategoriaPublicacaoEnum {
    PEDIDO_AJUDA = 'Pedido de ajuda',
    INFORMACAO_PUBLICA = 'Informação pública',
    ACAO_SOLIDARIA = 'Ação solidária',
    TODOS = 'Todos'
}

interface DadosPublicacao {
    id: number
    categoria:CategoriaPublicacaoEnum;
    titulo:string;
    descricao: string;
    data: string;
    usuarioResponsavel: string;
}

const PaginaInicial: React.FC = () => {
    const [opcao, setOpcao] = useState<CategoriaPublicacaoEnum>(CategoriaPublicacaoEnum.TODOS);
    const [publicacoes, setPublicacoes] = useState<DadosPublicacao[]>([]);
    const alteraOpcaoPaginaInicial = (buttonSelecionado: CategoriaPublicacaoEnum) => {listarPublicacoes(buttonSelecionado); setOpcao(buttonSelecionado)};
    const value = false;
   
    const buttons = [
        { id: 0, legenda: 'Tudo', value: CategoriaPublicacaoEnum.TODOS, boxShadow: 'shadowDireita' },
        { id: 1, legenda: 'Pedidos de ajuda', value: CategoriaPublicacaoEnum.PEDIDO_AJUDA, boxShadow: 'shadowDuplo' },
        { id: 2, legenda: 'Ações solidárias', value: CategoriaPublicacaoEnum.ACAO_SOLIDARIA, boxShadow: 'shadowDuplo' },
        { id: 3, legenda: 'Informações públicas', value: CategoriaPublicacaoEnum.INFORMACAO_PUBLICA, boxShadow: 'shadowEsquerda' },
    ];  

    const formatarData = (isoDate: string) => {
        const data = new Date(isoDate);
        const formatada = new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
        }).format(data);

        return formatada.replace(',', ' -');
    };

    const listarPublicacoes = async (opcao?: CategoriaPublicacaoEnum):Promise<DadosPublicacao[]> => {
        try{                
            const {data} = await api.get<DadosPublicacao[]>(`/publicacao/listar?aprovada=${value}&opcao=${opcao}`);
            setPublicacoes(data); 
            return data;

        }catch(erro:unknown){
            throw new Error(isAxiosError(erro) ? erro.message : 'Falha ao buscar publicações.');
        }
    };

    useEffect(() => {listarPublicacoes()}, []);
    
    return(
        <div className='divPrincipal alturaPaginaInicialDivPrincipal'>
            <Cabecalho />
            <div className="opcoesConteudo">
                {buttons.map((botao) => (
                    <button
                        key={botao.id}
                        className={opcao === botao.value ? `buttonOpcaoConteudo buttonOpcaoConteudoSelecionado  ${botao.boxShadow}` : 'buttonOpcaoConteudo'}
                        onClick={() => {alteraOpcaoPaginaInicial(botao.value); }}
                    >
                        {botao.legenda}
                    </button>
                ))}
            </div>
            <div className='divPaginaInicial'>

                {publicacoes.map((publicacao: any)=>(  
                    <div  className='divPublicacao' key={publicacao.id}>
                        <div className='divCabecalhoPublicacao'> 
                            <div className='divCabecalhoUsuarioPublicacao'>
                                <img src='./perfil.png' alt="menu" className='imgUsuarioPublicacao'/>
                                <div className='divUsuarioPublicacao'>
                                    <p className="pUsuarioPublicacao">{publicacao.nomeUsuarioResponsavel}</p>
                                    <p className="pSituacaoUsuarioPublicacao">Fora de risco</p>
                                </div>
                            </div>
                            <p className="dataPublicacao">{formatarData(publicacao.data)}</p>
                        </div>
                        <div className='divConteudoPublicacao'>
                            <div className='divCabecalhoConteudoPublicacao'>
                                <p className='pCategoria'> {publicacao.categoria} </p>
                            </div>
                            <div className='divConteudoPrincipalPublicacao1'>
                                <p className='pTituloPublicacao'>{publicacao.titulo}</p>
                                <p className='pDescricaoPublicacao'>{publicacao.descricao}</p>
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