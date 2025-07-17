import Button from "../../componentes/botao/botao";
import SelectDemo from "../../componentes/select/select-radix";
import { toast } from "react-toastify";
import Cookies from "js-cookie"
import axios from 'axios'
import { jwtDecode, JwtPayload } from 'jwt-decode'
import { useEffect, useState } from "react";
import "./pesquisa.css";
import '../../index.css';
import { IoClose, IoSearch } from "react-icons/io5";
import { api } from "../../api";

enum CategoriaPublicacaoEnum{
    ajuda = 'Pedir ajuda' ,
    campanha = 'Promover campanha',
    informativa = 'informativa'
};

interface ResultadoUsuarioInterface{
    id: string;
    nome: string;
};

interface ResultadoPublicacaoInterface{
    id: string;
    titulo: string;
};

interface ResultadoPesquisaInterface{
    usuarios?: ResultadoUsuarioInterface[];
    publicacoes: ResultadoPublicacaoInterface[];
};

const Pesquisa: React.FC = () => {
    const [valor, setValor] = useState('');
    const [resultados, setResultados] = useState<ResultadoPesquisaInterface | null>(null);
    const [tipoPublicacao, setTipoPublicacao] = useState<CategoriaPublicacaoEnum>(CategoriaPublicacaoEnum.informativa);
    const [opcao, setOpcao] = useState<number | null>(0);
    const alteraOpcaoPublicacao = (buttonSelecionado: number) => {setOpcao(buttonSelecionado)};

    const buttons = [
        { id: 0, legenda: 'Pedir ajuda', boxShadow: 'shadowDireita', value:CategoriaPublicacaoEnum.ajuda, setValue:setTipoPublicacao },
        { id: 1, legenda: 'Promover campanha', boxShadow: 'shadowDuplo', value:CategoriaPublicacaoEnum.campanha, setValue:setTipoPublicacao },
        { id: 2, legenda: 'Informativo', boxShadow: 'shadowEsquerda', value:CategoriaPublicacaoEnum.informativa, setValue:setTipoPublicacao },
    ];

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (valor.trim() !== "") {
                pesquisar(valor);
            } else {
                setResultados(null); 
            }
        }, 500); 

        return () => clearTimeout(timeout); 
    }, [valor]);
    
    const pesquisar = async (texto: string) => {
        try {
            const { data } = await api.get<ResultadoPesquisaInterface>(`usuario/buscar-por-texto/${encodeURIComponent(texto)}`);
            setResultados(data);
        } catch (error) {
            console.error("Erro ao buscar publicações:", error);
        }
    };

    const listaPublicacoes = resultados?.publicacoes != null && resultados.publicacoes.length > 0 ? resultados?.publicacoes : []
    const listaUsuarios = resultados?.usuarios != null && resultados.usuarios.length > 0 ? resultados?.usuarios : []

    return(
        <>
            <div className='divPesquisa'>
                <div className='divPaginaCabecalhoPesquisa'>
                    <div className='divIconePesquisa'> 
                        <IoSearch className='iconePesquisa iconePesquisaBorda' />
                    </div>

                    <div className='divInputPesquisa'> 
                        <input
                            type='text'
                            className='inputPesquisa'
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            placeholder='Pesquisar'
                        />
                    {/* <ul>
                        {resultados.map((item, index) => (
                        <li key={index}>{JSON.stringify(item)}</li>
                        ))}
                    </ul> */}
                    </div> 
                             
                    <div className='divIconePesquisa'> <a href='./paginaInicial' className='aVoltar' target="_self">
                        <IoClose className='iconeMenu'/></a> 
                    </div>
                </div>

                <div className='divResultadosPesquisa'>
                    {listaPublicacoes.map((publicacao) =>(
                        <div className='divItemResultado' key={publicacao.id}> 
                            {/* <div className='divItemResultadoPesquisa'> */}
                                <p className='pItemResultado'>Publicação: </p> 
                                <p className='pItemResultadoValor'>{publicacao.titulo}</p>
                            {/* </div> */}
                            {/* {resultado.titulo && 
                                <div className='divItemResultadoPesquisa'>
                                    <p className='pItemResultado'>Publicação: </p> 
                                    <p className='pItemResultadoValor'>{resultado.titulo}</p>
                                </div>
                            } */}
                        </div>                            
                    ))} 
                    {listaUsuarios.map((usuario) =>(
                        <div className='divItemResultado' key={usuario.id}> 
                            {/* <div className='divItemResultadoPesquisa'> */}
                                <p className='pItemResultado'>Usuário: </p> 
                                <p className='pItemResultadoValor'>{usuario.nome}</p>
                            {/* </div> */}
                            {/* {resultado.titulo && 
                                <div className='divItemResultadoPesquisa'>
                                    <p className='pItemResultado'>Publicação: </p> 
                                    <p className='pItemResultadoValor'>{resultado.titulo}</p>
                                </div>
                            } */}
                        </div>                            
                    ))}    
                </div>

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
            </div>
        </>
    )
}
export default Pesquisa;