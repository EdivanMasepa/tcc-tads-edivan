import { forwardRef, useState } from "react";
import './criarPublicacao.css'
import Button from "../botao/botao";
import SelectDemo from "../select/select-radix";
import { toast } from "react-toastify";
import { api } from "../../api";
import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Cookies from "js-cookie"

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

interface CriarPublicacaoProps {
  onCancelar: () => void;
} 

const CriarPublicacao = forwardRef<HTMLDivElement, CriarPublicacaoProps>(({ onCancelar }, ref) => {
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
        const token = Cookies.get('token') ;
        let decodeToken: JwtPayload;
        if (token) decodeToken = jwtDecode(token);

        try{
            const response = await api.post('publicacao/criar', dadosPublicacao);
            toast.dismiss();
            toast.success(response.data.message || 'Cadastrado com sucesso.');
            onCancelar();      
        } catch (erro) {
            const msg = axios.isAxiosError(erro)
                ? erro.response?.data?.message || 'Erro ao cadastrar.'
                : 'Erro inesperado.';

            console.error('Erro ao publicar:', erro);
            setTimeout(() => {
                toast.dismiss();
                toast.error(msg);
            }, 100);
        }
    };

 return(
        <div className='divFundo'>
            <div  ref={ref} className="divCriarPublicacao">

                <div className="divCriarPublicacaoSecao">
                    <label className="labelCriarPublicacaoSecao">Categoria:</label>
                    <SelectDemo 
                        value={categoriaPublicacao} 
                        onValueChange={setCategoriaPublicacao}
                        options={[
                            { key : 1, label: CategoriaPublicacaoEnum.PEDIDO_AJUDA , value: CategoriaPublicacaoEnum.PEDIDO_AJUDA },
                            { key : 2, label: CategoriaPublicacaoEnum.INFORMACAO_PUBLICA, value: CategoriaPublicacaoEnum.INFORMACAO_PUBLICA },
                            { key : 3, label: CategoriaPublicacaoEnum.ACAO_SOLIDARIA, value: CategoriaPublicacaoEnum.ACAO_SOLIDARIA },
                        ]}
                    />
                </div>

                <div className="divCriarPublicacaoSecao">
                    <label className="labelCriarPublicacaoSecao" htmlFor="titulo" >Titulo:</label>
                    <input 
                        className="inputCriarPublicacaoSecao" 
                        value={titulo ?? ""} 
                        onChange={(e) => setTitulo(e.target.value)}
                        type="text" 
                        id="titulo" 
                        name="titulo" 
                        placeholder="Digite o titulo"
                    />
                </div>

                <div className="divCriarPublicacaoSecao">
                    <label className="labelCriarPublicacaoSecao posicaoLabelDescricao" htmlFor="descricao">Descrição</label>
                    <textarea
                        className="inputCriarPublicacaoSecao alturaInputDescricao"
                        value={descricao ?? ""}
                        onChange={(e) => setDescricao(e.target.value)}
                        id="descricao"
                        rows={5} 
                        cols={40}
                        placeholder="Descreva aqui o conteúdo da publicação"
                    />
                </div>
            </div>
            
            <div className="divPublicar">
                <Button legenda='Publicar' onClick={() => publicar(dados)}/>
                <Button legenda='Cancelar' onClick={onCancelar} classNameButton='buttonCancelar'/>
            </div>
            
        </div>
    )
})
export default CriarPublicacao;