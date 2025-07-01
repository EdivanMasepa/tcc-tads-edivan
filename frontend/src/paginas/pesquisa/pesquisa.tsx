import { useEffect, useState } from "react";
import "./pesquisa.css"
import '../../index.css'
import Button from "../../componentes/botao/botao";
import SelectDemo from "../../componentes/select/select-radix";
import { toast } from "react-toastify";
import Cookies from "js-cookie"
import axios from 'axios'
import { jwtDecode, JwtPayload } from 'jwt-decode'
import { IoClose, IoSearch } from "react-icons/io5";
import { api } from "../../api";

enum CategoriaPublicacaoEnum{
    ajuda = 'Pedir ajuda' ,
    campanha = 'Promover campanha',
    informativa = 'informativa'
}

interface ResultadoPesquisaInterface{
    id: number,
    categoria: CategoriaPublicacaoEnum,
    titulo: string,
    descricao: string,
    data: string,
    aprovada: boolean,
    nomeUsuarioResponsavel: string
 }


const Pesquisa: React.FC = () => {
    const [valor, setValor] = useState("");
    const [resultados, setResultados] = useState<ResultadoPesquisaInterface[]>([]);

    const [tipoPublicacao, setTipoPublicacao] = useState<CategoriaPublicacaoEnum>(CategoriaPublicacaoEnum.informativa);
    const [opcao, setOpcao] = useState<number | null>(0);
    const alteraOpcaoPublicacao = (buttonSelecionado: number) => {
        setOpcao(buttonSelecionado)
    };
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
        setResultados([]); 
      }
        }, 500); 

        return () => clearTimeout(timeout); 
    }, [valor]);
    
    const pesquisar = async (texto: string) => {
    try {
      const response = await api.get(`publicacao/buscar-por-texto/${encodeURIComponent(texto)}`);
      setResultados(response.data); console.log(response.data)
    } catch (error) {
      console.error("Erro ao buscar publicações:", error);
    }
  };

    return(
        <>
            <div className='divPesquisa'>
                <div className="divPaginaCabecalhoPesquisa">
                    <div className='divIconePesquisa'> 
                        <IoSearch className='iconePesquisa iconePesquisaBorda' />
                    </div>

                    <div className='divInputPesquisa '> 
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
                    {resultados.map((resultado) =>(
                        <div className='divItemResultado' key={resultado.id}>
                            <p className='pItemUsuario'>Usuario: {resultado.nomeUsuarioResponsavel}</p>
                            {resultado.titulo && 
                            <p className='pItemTitulo'>Publicação: {resultado.titulo}</p>
                            }
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