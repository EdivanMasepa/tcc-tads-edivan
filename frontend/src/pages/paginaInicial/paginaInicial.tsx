import { useState } from 'react';
import Cabecalho from '../../components/cabecalho/cabecalho';
import '../../index.css'
import './paginaInicial.css'

const PaginaInicial: React.FC = () => {

    const [opcao, setOpcao] = useState<number | null>(0);

    const alteraOpcaoPaginaInicial = (buttonSelecionado: number) => {
        setOpcao(buttonSelecionado)
    };

    const buttons = [
        { id: 0, legenda: 'Tudo', boxShadow: 'shadowDireita' },
        { id: 1, legenda: 'Solicitações', boxShadow: 'shadowDuplo' },
        { id: 2, legenda: 'Campanhas', boxShadow: 'shadowEsquerda' },
      ];
    

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

                {[0, 1, 2, 4].map((publicacao)=>(
                    <div key={publicacao} className='divPublicacao'>
                        <div className='divCabecalhoPublicacao'>
                            <h2>Fulando da silva</h2>
                            <h4>24/03/2004</h4>
                        </div>
                        <div className='divConteudoPublicacao'>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus quam totam reprehenderit similique. 
                                Ut fugiat amet, dolorem voluptate nobis molestias cupiditate voluptatibus! Obcaecati ea reprehenderit 
                                porro, expedita cumque dolore culpa!
                            </p>
                        </div>
                    
                    </div>
                ))}
                
            </div>

        </div>
    )
}
export default PaginaInicial;