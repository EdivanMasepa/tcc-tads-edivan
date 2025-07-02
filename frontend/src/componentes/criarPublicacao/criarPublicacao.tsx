import { forwardRef, useEffect, useState } from "react";
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
  visivel: boolean;
} 

const CriarPublicacao = forwardRef<HTMLDivElement, CriarPublicacaoProps>(({ onCancelar, visivel }, ref) => {
    const [exibir, setExibir] = useState(visivel);
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
            const response = await api.post('publicacao/criar', dadosPublicacao);
            toast.dismiss();
            toast.success(response.data.message || 'Cadastrado com sucesso.');
            setTimeout(() => {
                onCancelar();
            }, 100);    
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
    useEffect(() => {
        if (visivel) {
        setExibir(true); // mostra imediatamente
        } else {
        // espera 300ms antes de desmontar, tempo para o portal fechar corretamente
        const timer = setTimeout(() => {
            setExibir(false);
        }, 300);
        return () => clearTimeout(timer);
        }
    }, [visivel]);

  if (!exibir) return null;

 return(
        <div className='divFundo' style={{ display: visivel ? 'block' : 'none' }}>
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
            
            <div className='divPublicar'>
                <div className='divButtonCancelar'>
                    <Button 
                        legenda='Cancelar' 
                        classNameButton='buttonCancelar'
                        onClick={() => {
                            setTimeout(() => {
                                onCancelar();
                            }, 100);
                        }}                     
                    />  
                </div>
                <div className='divButtonCancelar'>
                    <Button legenda='Publicar' onClick={() => publicar(dados)}/>
                </div>
                
            </div>
            
        </div>
    )
})
export default CriarPublicacao;