import { useEffect, useState } from 'react'
import Button from '../../componentes/botao/botao'
import Cabecalho from '../../componentes/cabecalho/cabecalho'
import Input from '../../componentes/input/input'
import '../../index.css'
import './perfil.css'
import Cookies from "js-cookie"
import axios, { isAxiosError } from 'axios'
import { jwtDecode, JwtPayload } from 'jwt-decode'
import { api } from '../../api'
import { FiEdit } from 'react-icons/fi'
import { FaRegCalendarAlt, FaTransgender } from 'react-icons/fa'
import { HiOutlineMail, HiOutlinePhone } from 'react-icons/hi'

interface dadosUsuario {
    nome: string,
    email:string,
    telefone:string
}

enum TipoConteudoEnum{
    INFORMACOES='INFORMAÇÕES',
    PUBLICACOES='PUBLICAÇÕES',
}

enum CategoriaPublicacaoEnum {
    PEDIDO_AJUDA = 'Pedido de ajuda',
    INFORMACAO_PUBLICA = ' Informação pública',
    ACAO_SOLIDARIA = 'Ação solidária'
}

interface DadosPublicacao {
    id: number
    categoria:CategoriaPublicacaoEnum;
    titulo:string;
    descricao: string;
    data: string;
    usuarioResponsavel: string;
}

const Perfil: React.FC = () => { 
    const [opcaoCadastro, setOpcaoCadastro] = useState(true);
    const alteraOpcaoCadastro = () =>{setOpcaoCadastro(!opcaoCadastro)};
    const [tipoCadastro, setTipoCadastro] = useState<TipoConteudoEnum>(TipoConteudoEnum.INFORMACOES);
    const [publicacoes, setPublicacoes] = useState<DadosPublicacao[]>([]);
    
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
   
    let decodeToken: JwtPayload;

    const decodificaUsuario = () => {
        const token = Cookies.get('token');
        if (!token) return null;

        try {
            const decodeToken = jwtDecode<JwtPayload>(token);
            return Number(decodeToken.sub);
        } catch (erro) {
            console.error('Erro ao decodificar token:', erro);
            return null;
        }
     };

    const buscarUsuario = async (usuario: number) => {
        try{
            const response = await api.get<dadosUsuario>(`/usuario/buscar/${usuario}`)
            return response.data
        }catch(erro){
            console.error('Erro ao buscar usuário:', erro);
            return null;
        }
    }

    const formatarData = (isoDate: string) => {
        const data = new Date(isoDate);
        const formatada = new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
        }).format(data);

        return formatada.replace(',', ' -');
    };

    useEffect(()=>{
        const carregarDados = async () => {
            const usuarioId = decodificaUsuario();
            if (usuarioId === null) return;
        
            const response = await buscarUsuario(usuarioId);
            if (!response) return;

            setNome(response.nome);
            setEmail(response.email);
            setTelefone(response.telefone);
        }
        const listarPublicacoes = async ():Promise<DadosPublicacao[]> => {
            try{                
                const {data} = await api.get<DadosPublicacao[]>(`/publicacao/listar?aprovada=${false}`);
                setPublicacoes(data); 
                return data;

            }catch(erro:unknown){
                throw new Error(isAxiosError(erro) ? erro.message : 'Falha ao buscar publicações.');
            }
        };
        listarPublicacoes();
        carregarDados()
    },[]);
    
    return(
        <div className='divPrincipal'>
            <Cabecalho />
            <div className='divPaiPerfil'>

                <div className='divPerfil cabecalhoPerfil'>

                    <div className='divFotoPerfil'>
                        <img src='./perfil.png' alt="menu" className='imgUsuarioPerfil'/>     
                    </div>
                    
                    <div className='divEditarFotoPerfil'>
                        <button className='buttonEditarFotoPerfil'><FiEdit className='iconeEditarFotoPerfil'/></button>
                    </div>

                    <div className='divNomeUsuarioPerfil'>
                        <p className='pNomeUsuarioPerfil'>Fulano da silva</p>
                    </div>

                    <div className='divSituacaoPerfil'>
                        <p className='pSituacaoPerfil'>Situação</p>
                    </div>

                </div>
                
                <div className='divTipoConteudoPerfil'>
                    <button 
                    value='INFORMAÇÕES'
                    onChange={() =>{setTipoCadastro}}
                    type='submit' 
                    className={opcaoCadastro ? 'buttonOpcaoConteudoPerfil buttonSelecionadoPerfil shadowRightPerfil' : 'buttonOpcaoConteudoPerfil'}
                    onClick={alteraOpcaoCadastro}>INFORMAÇÕES
                    </button>

                    <button 
                    value='PUBLICAÇÕES'
                    onChange={() =>{setTipoCadastro}}
                    type='submit' 
                    className={opcaoCadastro ? 'buttonOpcaoConteudoPerfil' : 'buttonOpcaoConteudoPerfil buttonSelecionadoPerfil shadowLeftPerfil'}
                    onClick={alteraOpcaoCadastro}>PUBLICAÇÕES
                    </button>
                </div>

                <div className='divPerfil conteudoPerfil'>
                    <div className='divItemConteudoPerfil'>

                        {opcaoCadastro ? 
                            <div className='divItemConteudoInformacao'>

                                <div className='divSubItemInformacao'>
                                    <div className='divSubItemLegenda'>
                                        <p className='pLegendaPerfil'>Data de nascimento</p> <FaRegCalendarAlt className='iconeInformacaoPerfil'/>
                                    </div>
                                    <div className='divSubItemValor'>
                                        <p className='pValorPerfil'>30/02/2001</p>
                                    </div>
                                </div>

                                <div className='divSubItemInformacao'>
                                    <div className='divSubItemLegenda'>
                                        <p className='pLegendaPerfil'>Gênero</p> <FaTransgender className='iconeInformacaoPerfil'/>
                                    </div>
                                    <div className='divSubItemValor'>
                                        <p className='pValorPerfil'>Masculino</p>
                                    </div>
                                </div>

                                
                                <div className='divSubItemInformacao'>
                                    <div className='divSubItemLegenda'>
                                        <p className='pLegendaPerfil'>Telefone</p> <HiOutlinePhone className='iconeInformacaoPerfil'/>
                                    </div>
                                    <div className='divSubItemValor'>
                                        <p className='pValorPerfil'>(42) 988775566</p>
                                    </div>
                                </div>

                                
                                <div className='divSubItemInformacao' style={{border: 'none'}}>
                                    <div className='divSubItemLegenda'>
                                        <p className='pLegendaPerfil'>E-mail</p> <HiOutlineMail className='iconeInformacaoPerfil'/>
                                    </div>
                                    <div className='divSubItemValor'>
                                        <p className='pValorPerfil'>edivan@gmail.com</p>
                                    </div>
                                </div>

                            </div>
                            : 
                            publicacoes.map((publicacao: any)=>(  
                                <div className='divItemConteudoPublicacao'>

                                    <div  className='divPublicacao' style={{marginTop:'0px'}} key={publicacao.id}>
                                        <div className='divCabecalhoPublicacao'> 
                                            <div className='divCabecalhoUsuarioPublicacao'>
                                                <img src='./perfil.png' alt="menu" className='imgUsuarioPublicacao'/>

                                                <div className='divUsuarioPublicacao'>
                                                    <p className="pUsuarioPublicacao">{publicacao.nomeUsuarioResponsavel}</p>
                                                    <p className="pSituacaoUsuarioPublicacao">situacao</p>
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
                                </div>
                            ))
                        }  
                    </div>
                </div>

            </div>
{/* <div className='divH2Titulo'>
                        <h2 className='h2Titulo'>ALTERAR PERFIL</h2>
                    </div>

                    <div className='divAlterarPerfil'>
                        <Input value = {nome} setValue={setNome} label='Nome' placeholder='' type='text'/>
                                    
                        <Input value = {email} setValue={setEmail} label='Email' placeholder=''  type='text'/>

                        <Input value = {telefone} setValue={setTelefone} label='Telefone' placeholder=''  type='text'/>

                        <Input value = {senha} setValue={setSenha} label='Senha' placeholder=''  type='text'/>
                        
                        <Input value = {confirmarSenha} setValue={setConfirmarSenha} label='Confirmar senha' placeholder=''  type='text'/>

                        <Button legenda='Salvar' />

                    </div> */}
        </div>

    )
}
export default Perfil