import { useState } from "react";
import "./pesquisa.css"
import '../../index.css'
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
  

const Pesquisa: React.FC = () => {
    const [tipoPublicacao, setTipoPublicacao] = useState<TipoPublicacao>(TipoPublicacao.informativa);

    const [opcao, setOpcao] = useState<number | null>(0);
    const alteraOpcaoPublicacao = (buttonSelecionado: number) => {
        setOpcao(buttonSelecionado)
    };
    const buttons = [
        { id: 0, legenda: 'Pedir ajuda', boxShadow: 'shadowDireita', value:TipoPublicacao.ajuda, setValue:setTipoPublicacao },
        { id: 1, legenda: 'Promover campanha', boxShadow: 'shadowDuplo', value:TipoPublicacao.campanha, setValue:setTipoPublicacao },
        { id: 2, legenda: 'Informativo', boxShadow: 'shadowEsquerda', value:TipoPublicacao.informativa, setValue:setTipoPublicacao },
      ];
    let decodeToken: JwtPayload;
    
    const publicar = async () => {
        try{
            const token = Cookies.get('token') ;
            
            if(token){
                decodeToken = jwtDecode(token)
            }

            const response = await axios.patch('http://localhost:3000/acao/criar-acao',{
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
            </div>
        </>
    )
}
export default Pesquisa;